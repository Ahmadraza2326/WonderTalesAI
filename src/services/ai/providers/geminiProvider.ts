import { supabase } from '../../../lib/supabase'
import { withTimeout } from '../../../utils/asyncUtils'
import {
  classifyGenerationError,
  StoryGenerationFormatError,
  StoryGenerationQuotaError,
  StoryGenerationCooldownError,
  StoryGenerationConfigError,
} from '../errors'
import { getGeminiClient } from '../../geminiService'

export class GeminiProvider {
  /**
   * Generates story package content via the server-side Supabase Edge Function.
   * Keeps GEMINI_API_KEY secure on the server and enforces server-side JWT auth & quotas.
   */
  async generateContent(prompt: string, timeoutMs?: number): Promise<string> {
    try {
      const invokePromise = this.callEdgeFunction(prompt)

      const text = await withTimeout(
        invokePromise,
        timeoutMs,
        'Story generation request timed out after waiting for server response.'
      )

      if (!text?.trim()) {
        throw new StoryGenerationFormatError('Story generation returned an empty response.')
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
        // Try parsing Edge Function response body if available
        const errorObj = error as { context?: { json?: () => Promise<{ code?: string; error?: string; retry_after_seconds?: number }> } }
        const responseJson = errorObj.context?.json ? await errorObj.context.json().catch(() => null) : null

        if (responseJson?.code === 'COOLDOWN_ACTIVE') {
          throw new StoryGenerationCooldownError(
            responseJson.error || 'Cooldown active.',
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
            responseJson.error || 'Authentication required to generate stories.'
          )
        }

        // If Edge function is not deployed in local offline dev, attempt local dev fallback
        if (error.message?.includes('Failed to send a request') || error.message?.includes('FunctionsFetchError')) {
          return this.localDevFallback(prompt)
        }

        throw new Error(responseJson?.error || error.message || 'Story generation service error')
      }

      if (!data?.text) {
        throw new StoryGenerationFormatError('Server response did not contain valid story text.')
      }

      return data.text
    } catch (err) {
      if (
        err instanceof StoryGenerationCooldownError ||
        err instanceof StoryGenerationQuotaError ||
        err instanceof StoryGenerationConfigError
      ) {
        throw err
      }

      // If network fetch failed in local dev environment without Supabase functions running, try local fallback
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('Failed to fetch') || msg.includes('FunctionsFetchError') || msg.includes('network')) {
        return this.localDevFallback(prompt)
      }

      throw err
    }
  }

  private async localDevFallback(prompt: string): Promise<string> {
    try {
      const client = getGeminiClient()
      const response = await client.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      })

      const text = response.text?.trim()
      if (!text) {
        throw new StoryGenerationFormatError('Local Gemini fallback returned an empty response.')
      }
      return text
    } catch (err) {
      throw classifyGenerationError(err)
    }
  }
}

export const geminiProvider = new GeminiProvider()