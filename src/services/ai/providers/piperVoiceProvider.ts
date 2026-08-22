import type { NarrationSegment } from '../../../types/narration'
import type { GeneratedNarration, VoiceProvider, GenerateNarrationOptions } from '../voiceProvider'
import { resolveLocaleConfig } from '../../i18n/locales'

// Language-specific speech pacing (characters per second) for realistic duration calculation
const LOCALE_SPEECH_PACING: Record<string, number> = {
  'en-US': 15,
  'ur-PK': 13,
  'ar-SA': 14,
  'es-ES': 16,
  'fr-FR': 15,
  'de-DE': 14,
  'zh-CN': 4,
  'ja-JP': 6,
  'hi-IN': 13,
  'pt-BR': 15,
}

export class PiperVoiceProvider implements VoiceProvider {
  /**
   * Generates local TTS narration audio by calling the local Piper wrapper server.
   */
  async generateNarration(
    segments: NarrationSegment[],
    options?: GenerateNarrationOptions
  ): Promise<GeneratedNarration[]> {
    const locale = resolveLocaleConfig(options?.language)
    const pacing = LOCALE_SPEECH_PACING[locale.bcp47] || 15
    const rateMultiplier = options?.rate && options.rate > 0 ? options.rate : 1.0

    // Check configuration for the local TTS server
    const localServerUrl = import.meta.env.VITE_PIPER_SERVER_URL || 'http://localhost:3001/api/tts'
    
    // Process segments sequentially or in parallel?
    // Doing it sequentially to avoid overloading the local Piper process if it doesn't queue well.
    const results: GeneratedNarration[] = []

    for (const segment of segments) {
      try {
        const textToSpeak = segment.text.trim()
        if (!textToSpeak) {
           results.push({
             id: segment.id,
             audioUrl: '',
             audioPath: null,
             duration: 0
           })
           continue
        }

        const response = await fetch(localServerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: textToSpeak,
            language: locale.bcp47,
            voice: options?.voiceName || ''
          }),
        })

        if (!response.ok) {
          const errJson = await response.json().catch(() => null)
          throw new Error(errJson?.error || `Local Piper TTS failed with status ${response.status}`)
        }

        const audioBlob = await response.blob()
        // Convert Blob directly into an ObjectURL to pass it into our existing audio framework
        const audioUrl = URL.createObjectURL(audioBlob)

        // Estimate duration based on pacing, since standard wav doesn't immediately give duration 
        // without parsing headers or creating an Audio element (which happens asynchronously).
        const textLength = textToSpeak.length
        const baseDuration = Math.max(2, Math.ceil(textLength / pacing))
        const adjustedDuration = Math.max(1, Math.round(baseDuration / rateMultiplier))

        results.push({
          id: segment.id,
          audioUrl,
          audioPath: null,
          duration: adjustedDuration,
        })
      } catch (err: any) {
        console.warn(`[PiperVoiceProvider] Fallback for segment ${segment.id}:`, err.message)
        // Offline / Local estimation fallback for this segment
        const textLength = segment.text.trim().length
        const baseDuration = Math.max(2, Math.ceil(textLength / pacing))
        const adjustedDuration = Math.max(1, Math.round(baseDuration / rateMultiplier))

        results.push({
          id: segment.id,
          audioUrl: '',
          audioPath: null,
          duration: adjustedDuration,
        })
      }
    }

    return results
  }
}
