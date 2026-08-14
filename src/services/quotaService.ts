import { supabase } from '../lib/supabase'
import {
  StoryGenerationCooldownError,
  StoryGenerationQuotaError,
  StoryGenerationConfigError,
} from './ai/errors'

export interface QuotaCheckResult {
  allowed: boolean
  code: 'OK' | 'COOLDOWN_ACTIVE' | 'DAILY_LIMIT_REACHED' | 'UNAUTHENTICATED' | 'ERROR'
  message: string
  stories_generated_today?: number
  daily_limit?: number
  remaining?: number
  retry_after_seconds?: number
}

export interface QuotaStatus {
  authenticated: boolean
  used: number
  daily_limit: number
  remaining: number
  cooldown_remaining: number
}

export const DEFAULT_DAILY_LIMIT = 10
export const DEFAULT_COOLDOWN_SECONDS = 20

// Local client-side fallback state for offline / mock testing
let localLastGenerationTime = 0
let localDailyCount = 0
let localDailyDate = new Date().toISOString().split('T')[0]

export const quotaService = {
  /**
   * Atomically checks and consumes quota server-side in Supabase/PostgreSQL.
   * Throws typed StoryGenerationError if quota or cooldown is violated.
   */
  async consumeQuota(
    dailyLimit = DEFAULT_DAILY_LIMIT,
    cooldownSeconds = DEFAULT_COOLDOWN_SECONDS
  ): Promise<QuotaCheckResult> {
    try {
      const { data, error } = await supabase.rpc('consume_story_generation_quota', {
        p_daily_limit: dailyLimit,
        p_cooldown_seconds: cooldownSeconds,
      })

      if (error) {
        // Fallback to local rate-limiting if database function is unavailable in development
        return this.localFallbackConsume(dailyLimit, cooldownSeconds)
      }

      const result = data as unknown as QuotaCheckResult

      if (!result.allowed) {
        if (result.code === 'COOLDOWN_ACTIVE') {
          throw new StoryGenerationCooldownError(result.message, result.retry_after_seconds ?? cooldownSeconds)
        }
        if (result.code === 'DAILY_LIMIT_REACHED') {
          throw new StoryGenerationQuotaError(result.message)
        }
        if (result.code === 'UNAUTHENTICATED') {
          throw new StoryGenerationConfigError(result.message)
        }
        throw new Error(result.message)
      }

      return result
    } catch (err) {
      if (err instanceof StoryGenerationCooldownError || err instanceof StoryGenerationQuotaError || err instanceof StoryGenerationConfigError) {
        throw err
      }
      return this.localFallbackConsume(dailyLimit, cooldownSeconds)
    }
  },

  /**
   * Reads current user quota status for UI display without consuming quota.
   */
  async getQuotaStatus(
    dailyLimit = DEFAULT_DAILY_LIMIT,
    cooldownSeconds = DEFAULT_COOLDOWN_SECONDS
  ): Promise<QuotaStatus> {
    try {
      const { data, error } = await supabase.rpc('get_user_generation_quota', {
        p_daily_limit: dailyLimit,
        p_cooldown_seconds: cooldownSeconds,
      })

      if (error || !data) {
        return this.getLocalQuotaStatus(dailyLimit, cooldownSeconds)
      }

      return data as unknown as QuotaStatus
    } catch {
      return this.getLocalQuotaStatus(dailyLimit, cooldownSeconds)
    }
  },

  localFallbackConsume(dailyLimit: number, cooldownSeconds: number): QuotaCheckResult {
    const today = new Date().toISOString().split('T')[0]
    const now = Date.now()

    if (today !== localDailyDate) {
      localDailyCount = 0
      localDailyDate = today
    }

    const elapsedSeconds = Math.floor((now - localLastGenerationTime) / 1000)
    if (elapsedSeconds < cooldownSeconds && localLastGenerationTime > 0) {
      const remainingCooldown = cooldownSeconds - elapsedSeconds
      throw new StoryGenerationCooldownError(
        `Cooldown active. Please wait ${remainingCooldown} seconds before generating another story.`,
        remainingCooldown
      )
    }

    if (localDailyCount >= dailyLimit) {
      throw new StoryGenerationQuotaError(
        `Daily limit of ${dailyLimit} stories reached. Limit resets tomorrow.`
      )
    }

    localLastGenerationTime = now
    localDailyCount++

    return {
      allowed: true,
      code: 'OK',
      message: 'Quota granted (local).',
      stories_generated_today: localDailyCount,
      daily_limit: dailyLimit,
      remaining: dailyLimit - localDailyCount,
    }
  },

  getLocalQuotaStatus(dailyLimit: number, cooldownSeconds: number): QuotaStatus {
    const today = new Date().toISOString().split('T')[0]
    const now = Date.now()

    if (today !== localDailyDate) {
      localDailyCount = 0
      localDailyDate = today
    }

    const elapsedSeconds = Math.floor((now - localLastGenerationTime) / 1000)
    const cooldownRemaining = localLastGenerationTime > 0 ? Math.max(0, cooldownSeconds - elapsedSeconds) : 0

    return {
      authenticated: true,
      used: localDailyCount,
      daily_limit: dailyLimit,
      remaining: Math.max(0, dailyLimit - localDailyCount),
      cooldown_remaining: cooldownRemaining,
    }
  },
}
