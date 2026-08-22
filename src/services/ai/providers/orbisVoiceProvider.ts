import type { NarrationSegment } from '../../../types/narration'
import type { GeneratedNarration, VoiceProvider, GenerateNarrationOptions } from '../voiceProvider'
import { resolveLocaleConfig } from '../../i18n/locales'
import { supabase } from '../../../lib/supabase'

// Language-specific speech pacing (characters per second) for realistic duration calculation
const LOCALE_SPEECH_PACING: Record<string, number> = {
  'en-US': 15, // ~15 chars/sec English
  'ur-PK': 13, // ~13 chars/sec Urdu Nastaliq
  'ar-SA': 14, // ~14 chars/sec Arabic
  'es-ES': 16, // ~16 chars/sec Spanish
  'fr-FR': 15, // ~15 chars/sec French
  'de-DE': 14, // ~14 chars/sec German
  'zh-CN': 4,  // ~4 characters/sec Mandarin
  'ja-JP': 6,  // ~6 kana/kanji/sec Japanese
  'hi-IN': 13, // ~13 chars/sec Hindi Devanagari
  'pt-BR': 15, // ~15 chars/sec Portuguese
}

export class OrbisVoiceProvider implements VoiceProvider {
  /**
   * Generates production TTS narration audio via Supabase Edge Function & Gemini-TTS.
   */
  async generateNarration(
    segments: NarrationSegment[],
    options?: GenerateNarrationOptions
  ): Promise<GeneratedNarration[]> {
    const locale = resolveLocaleConfig(options?.language)

    // Check if authenticated session is available to call server-side TTS
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kgbmngkedovmtzcbqghk.supabase.co'

      if (accessToken && options?.storyId) {
        const response = await fetch(`${supabaseUrl}/functions/v1/generate-narration-audio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            storyId: options.storyId,
            language: locale.bcp47,
            contentHash: options.contentHash || 'default',
            forceRegenerate: options.forceRegenerate || false,
            segments: segments.map((s) => ({
              id: s.id,
              text: s.text,
              speaker: s.speaker,
              emotion: s.emotion,
            })),
          }),
        })

        if (!response.ok) {
          const errJson = await response.json().catch(() => null)
          if (errJson) {
            console.warn('[OrbisVoiceProvider] Backend Error Diagnostics:', JSON.stringify(errJson, null, 2))
          }
          throw new Error(errJson?.error || `Server TTS failed with status ${response.status}`)
        }

        const result = await response.json()
        if (result?.diagnostics) {
          console.warn('[OrbisVoiceProvider] Backend Diagnostics:', JSON.stringify(result.diagnostics, null, 2))
        }
        if (result?.segments && Array.isArray(result.segments)) {
          return result.segments.map((seg: any) => ({
            id: seg.id,
            audioUrl: seg.audioUrl || '',
            audioPath: seg.audioPath || null,
            duration: seg.duration || 0,
          }))
        }
      }
    } catch (err: any) {
      // Re-throw genuine API/server errors
      const msg = err.message || ''
      if (
        msg.includes('Server TTS failed') ||
        msg.includes('Failed to generate narration audio') ||
        msg.includes('Storage upload failed') ||
        msg.includes('Gemini TTS') ||
        msg.includes('UNAUTHENTICATED') ||
        msg.includes('FORBIDDEN') ||
        msg.includes('LIMIT_EXCEEDED') ||
        msg.includes('INVALID_PAYLOAD')
      ) {
        throw err
      }
      console.warn('[OrbisVoiceProvider] Edge Function audio generation fallback:', err.message)
    }

    // Offline / Local estimation fallback
    const pacing = LOCALE_SPEECH_PACING[locale.bcp47] || 15
    const rateMultiplier = options?.rate && options.rate > 0 ? options.rate : 1.0

    return segments.map((segment) => {
      const textLength = segment.text.trim().length
      const baseDuration = Math.max(2, Math.ceil(textLength / pacing))
      const adjustedDuration = Math.max(1, Math.round(baseDuration / rateMultiplier))

      return {
        id: segment.id,
        audioUrl: '',
        audioPath: null,
        duration: adjustedDuration,
      }
    })
  }
}
