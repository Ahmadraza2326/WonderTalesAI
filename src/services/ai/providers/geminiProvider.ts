import { supabase } from '../../../lib/supabase'
import { withTimeout } from '../../../utils/asyncUtils'
import {
  classifyGenerationError,
  StoryGenerationFormatError,
  StoryGenerationQuotaError,
  StoryGenerationCooldownError,
  StoryGenerationConfigError,
} from '../errors'

/**
 * ORBIS AI Provider (Server Boundary Abstraction)
 * Securely routes all text and story generation through the server-side Supabase Edge Function.
 * Keeps provider API keys strictly isolated on the server and enforces JWT auth and quotas.
 */
export class OrbisAIProvider {
  async generateContent(prompt: string, timeoutMs?: number): Promise<string> {
    try {
      const invokePromise = this.callEdgeFunction(prompt)

      const text = await withTimeout(
        invokePromise,
        timeoutMs || 45000,
        'ORBIS AI generation request timed out after waiting for server response.'
      )

      if (!text?.trim()) {
        throw new StoryGenerationFormatError('ORBIS AI generation returned an empty response.')
      }

      return text.trim()
    } catch (error) {
      throw classifyGenerationError(error)
    }
  }

  private async callEdgeFunction(prompt: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-story-package', {
        body: { prompt },
      })

      if (error) {
        // Parse server error response payload if present
        const errorObj = error as {
          context?: {
            json?: () => Promise<{
              code?: string
              error?: string
              retry_after_seconds?: number
            }>
          }
        }

        const responseJson = errorObj.context?.json
          ? await errorObj.context.json().catch(() => null)
          : null

        if (responseJson?.code === 'COOLDOWN_ACTIVE') {
          throw new StoryGenerationCooldownError(
            responseJson.error || 'ORBIS AI cooldown is active. Please wait a moment.',
            responseJson.retry_after_seconds ?? 20
          )
        }
        if (responseJson?.code === 'DAILY_LIMIT_REACHED') {
          throw new StoryGenerationQuotaError(
            responseJson.error || 'Daily story generation limit reached.'
          )
        }
        if (responseJson?.code === 'UNAUTHENTICATED') {
          throw new StoryGenerationConfigError(
            responseJson.error || 'Authentication is required to generate stories.'
          )
        }

        throw new Error(
          responseJson?.error ||
            error.message ||
            'ORBIS AI service is temporarily unavailable. Please try again.'
        )
      }

      if (!data?.text) {
        throw new StoryGenerationFormatError('ORBIS AI server response did not contain valid story text.')
      }

      return data.text
    } catch (err) {
      if (
        err instanceof StoryGenerationCooldownError ||
        err instanceof StoryGenerationQuotaError ||
        err instanceof StoryGenerationConfigError ||
        err instanceof StoryGenerationFormatError
      ) {
        throw err
      }

      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('Failed to send a request') || msg.includes('FunctionsFetchError') || msg.includes('network') || msg.includes('Failed to fetch')) {
        throw new StoryGenerationConfigError(
          'ORBIS AI server boundary is currently unreachable. Please check your network connection or verify that Edge Functions are active.'
        )
      }

      throw err
    }
  }
}

export const orbisAIProvider = new OrbisAIProvider()
export const geminiProvider = orbisAIProvider // Backward-compatible internal alias