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

  /**
   * Pre-flight eligibility check without consuming quota.
   * Throws StoryGenerationCooldownError or StoryGenerationQuotaError if limit/cooldown active.
   */
  async checkQuota(
    dailyLimit = DEFAULT_DAILY_LIMIT,
    cooldownSeconds = DEFAULT_COOLDOWN_SECONDS
  ): Promise<QuotaStatus> {
    const status = await this.getQuotaStatus(dailyLimit, cooldownSeconds)
    if (status.cooldown_remaining > 0) {
      throw new StoryGenerationCooldownError(
        `Cooldown active. Please wait ${status.cooldown_remaining} seconds before generating another story.`,
        status.cooldown_remaining
      )
    }
    if (status.used >= status.daily_limit) {
      throw new StoryGenerationQuotaError(
        `Daily limit of ${status.daily_limit} stories reached. Limit resets tomorrow.`
      )
    }
    return status
  },

  /**
   * Resets local fallback state (useful for automated testing and test suites).
   */
  resetLocalState(): void {
    localLastGenerationTime = 0
    localDailyCount = 0
    localDailyDate = new Date().toISOString().split('T')[0]
  },

  /**
   * Safe development-only helper: resets the current authenticated user's quota in Supabase.
   * Strictly restricted to development environments (import.meta.env.DEV check).
   */
  async devResetAuthenticatedQuota(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.DEV) {
      throw new Error('devResetAuthenticatedQuota is strictly restricted to development environments.')
    }

    this.resetLocalState()

    try {
      const { data, error } = await supabase.rpc('dev_reset_user_quota')
      if (error) {
        return { success: false, error: `${error.code || 'RPC_ERROR'}: ${error.message}` }
      }
      const res = data as { success: boolean; message?: string; error?: string } | null
      if (res && res.success === false) {
        return { success: false, error: res.error || res.message || 'Reset rejected by database.', message: res.message }
      }
      return res || { success: true, message: 'Quota successfully reset.' }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) }
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
