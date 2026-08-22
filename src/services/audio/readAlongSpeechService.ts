/**
 * Synchronized Read-Along Speech Synthesis Service
 * Provides sentence and word boundary tracking with multilingual BCP-47 voice selection for ORBIS.
 */

import { resolveLocaleConfig } from '../i18n/locales'

export interface ReadAlongOptions {
  language?: string
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
  onBoundary?: (charIndex: number, length?: number) => void
  onSentenceChange?: (sentenceIndex: number) => void
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: Error) => void
  onPauseStateChange?: (isPaused: boolean) => void
}

export class ReadAlongSpeechService {
  private sentences: string[] = []
  private sentenceOffsets: number[] = []
  private isSpeaking = false
  private isPaused = false
  private currentSentenceIndex = 0
  private isAutoplay = true
  private options: ReadAlongOptions = {}
  private cachedVoices: SpeechSynthesisVoice[] = []
  private currentUtterance: SpeechSynthesisUtterance | null = null

  constructor(options?: ReadAlongOptions) {
    if (options) {
      this.options = options
    }
    this.initVoiceListener()
  }

  private initVoiceListener() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices()
      }
    }
  }

  setOptions(options: Partial<ReadAlongOptions>) {
    this.options = { ...this.options, ...options }
  }

  /**
   * Retrieves all currently available browser speech synthesis voices.
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const live = window.speechSynthesis.getVoices()
      if (live.length > 0) {
        this.cachedVoices = live
      }
    }
    return this.cachedVoices
  }

  /**
   * Sets custom/mock voices (useful for testing and environments without global speechSynthesis).
   */
  setVoices(voices: SpeechSynthesisVoice[]): void {
    this.cachedVoices = voices
  }

  /**
   * Finds the best matching speech synthesis voice for a language or BCP-47 code.
   * Priority:
   * 1. Exact BCP-47 match (e.g. ar-SA, es-ES, fr-FR, zh-CN, ur-PK)
   * 2. Language-prefix match (e.g. ar, es, fr, zh, ur)
   * 3. Browser default voice
   */
  findBestVoice(languageOrBcp47?: string | null): SpeechSynthesisVoice | null {
    const voices = this.getVoices()
    if (!voices.length) return null

    const locale = resolveLocaleConfig(languageOrBcp47)
    const targetBcp47 = locale.bcp47.toLowerCase()
    const targetCode = locale.code.toLowerCase()

    // 1. Exact BCP-47 match (e.g., 'ar-SA' === 'ar-sa' or 'ar_SA')
    const exactMatch = voices.find((v) => {
      const vLang = v.lang.replace('_', '-').toLowerCase()
      return vLang === targetBcp47
    })
    if (exactMatch) return exactMatch

    // 2. Language-prefix match (e.g., voice 'ar-EG' matches 'ar')
    const prefixMatch = voices.find((v) => {
      const vLang = v.lang.replace('_', '-').toLowerCase()
      return vLang.startsWith(targetCode + '-') || vLang.startsWith(targetCode)
    })
    if (prefixMatch) return prefixMatch

    // 3. Fallback: only assign default voice if target language is English ('en')
    if (targetCode === 'en') {
      const defaultVoice = voices.find((v) => v.default)
      return defaultVoice || voices.find((v) => v.lang.toLowerCase().startsWith('en')) || null
    }

    // Do not force an English voice on non-English scripts (Urdu, Arabic, Hindi, CJK, etc.)
    return null
  }

  /**
   * Splits page text into sentences and computes character offsets for synchronized illumination.
   * Supports Western (. ! ?), Arabic (؟ . !), CJK (。 ！ ？), Urdu (۔ ؟), and Indic (। ? !) sentence terminals.
   */
  prepareText(text: string): string[] {
    if (!text || !text.trim()) {
      this.sentences = []
      this.sentenceOffsets = []
      return []
    }

    // Split on multilingual sentence delimiters (. ! ? ؟ ۔ 。 ！ ？ ।) while retaining full text structure
    const rawSentences = text
      .split(/(?<=[.!?؟۔])\s+|(?<=[。！？।])\s*/)
      .map((s) => s.trim())
      .filter(Boolean)

    this.sentences = rawSentences.length > 0 ? rawSentences : [text.trim()]
    this.sentenceOffsets = []

    let currentOffset = 0
    for (const sentence of this.sentences) {
      const idx = text.indexOf(sentence, currentOffset)
      const resolvedOffset = idx >= 0 ? idx : currentOffset
      this.sentenceOffsets.push(resolvedOffset)
      currentOffset = resolvedOffset + sentence.length
    }

    return this.sentences
  }

  getSentences(): string[] {
    return this.sentences
  }

  getCurrentSentenceIndex(): number {
    return this.currentSentenceIndex
  }

  /**
   * Speaks a sequence of sentences with autoplay progression.
   */
  speakSequence(
    sentences: string[],
    startIndex = 0,
    autoplay = true,
    options?: Partial<ReadAlongOptions>
  ): boolean {
    this.stop()
    if (options) {
      this.setOptions(options)
    }

    this.sentences = sentences
    this.isAutoplay = autoplay
    const safeIndex = Math.max(0, Math.min(startIndex, sentences.length - 1))
    this.currentSentenceIndex = safeIndex

    if (!sentences.length || !sentences[safeIndex]) {
      return false
    }

    const targetLang = options?.language || this.options.language
    const locale = resolveLocaleConfig(targetLang)
    const voice = options?.voice || this.options.voice || this.findBestVoice(targetLang)

    if (!voice && locale.code !== 'en') {
      this.options.onError?.(
        new Error(`No browser speech synthesis voice is available for ${locale.nativeName || locale.name}. Real audio narration is required.`)
      )
      return false
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.options.onError?.(
        new Error('Speech synthesis is not supported on this device/browser.')
      )
      return false
    }

    return this.playSentenceAtIndex(safeIndex)
  }

  private playSentenceAtIndex(index: number): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
    if (index < 0 || index >= this.sentences.length) {
      this.isSpeaking = false
      this.isPaused = false
      this.currentUtterance = null
      this.options.onEnd?.()
      return false
    }

    // Cancel any current utterance cleanly
    window.speechSynthesis.cancel()

    this.currentSentenceIndex = index
    const sentenceText = this.sentences[index]
    const utterance = new SpeechSynthesisUtterance(sentenceText)
    this.currentUtterance = utterance

    const locale = resolveLocaleConfig(this.options.language)
    utterance.lang = locale.bcp47

    const voice = this.options.voice || this.findBestVoice(this.options.language)
    if (voice) {
      utterance.voice = voice
    } else if (locale.code !== 'en') {
      // Non-English scripts (Urdu, Arabic, Hindi, CJK, etc.) must NEVER fake speech playback without a native voice
      this.isSpeaking = false
      this.isPaused = false
      this.currentUtterance = null
      this.options.onError?.(new Error(`No browser speech synthesis voice is available for ${locale.nativeName || locale.name}. Real audio narration is required.`))
      return false
    }

    utterance.rate = this.options.rate ?? 1.0
    utterance.pitch = this.options.pitch ?? 1.0
    utterance.volume = this.options.volume ?? 1.0

    utterance.onstart = () => {
      this.isSpeaking = true
      this.isPaused = false
      if (index === 0) {
        this.options.onStart?.()
      }
      this.options.onSentenceChange?.(index)
    }

    utterance.onend = () => {
      // Check if we are still active and should continue to next sentence
      if (!this.isSpeaking && !this.isAutoplay) {
        return
      }

      if (this.isAutoplay && index + 1 < this.sentences.length) {
        this.playSentenceAtIndex(index + 1)
      } else {
        this.isSpeaking = false
        this.isPaused = false
        this.currentUtterance = null
        this.options.onEnd?.()
      }
    }

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        this.isSpeaking = false
        this.isPaused = false
        this.currentUtterance = null
        this.options.onError?.(new Error(`Speech narration: ${e.error}`))
      }
    }

    this.isSpeaking = true
    this.isPaused = false
    window.speechSynthesis.speak(utterance)
    return true
  }

  /**
   * Moves to next sentence in the sequence.
   */
  nextSentence(): boolean {
    if (this.currentSentenceIndex + 1 < this.sentences.length) {
      return this.playSentenceAtIndex(this.currentSentenceIndex + 1)
    }
    return false
  }

  /**
   * Moves to previous sentence in the sequence.
   */
  previousSentence(): boolean {
    if (this.currentSentenceIndex - 1 >= 0) {
      return this.playSentenceAtIndex(this.currentSentenceIndex - 1)
    }
    return false
  }

  /**
   * Legacy / single-call paragraph speak method with boundary tracking.
   */
  speak(text: string, options?: Partial<ReadAlongOptions>): boolean {
    const sentences = this.prepareText(text)
    if (!sentences.length) return false
    return this.speakSequence(sentences, 0, true, options)
  }

  pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause()
      this.isPaused = true
      this.options.onPauseStateChange?.(true)
    }
  }

  resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume()
      this.isPaused = false
      this.options.onPauseStateChange?.(false)
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    this.isSpeaking = false
    this.isPaused = false
    this.currentUtterance = null
  }

  isPlaying(): boolean {
    return this.isSpeaking && !this.isPaused
  }

  getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance
  }

  isPausedState(): boolean {
    return this.isPaused
  }

  destroy() {
    this.stop()
    this.options = {}
    this.sentences = []
    this.sentenceOffsets = []
    this.currentSentenceIndex = 0
  }
}

export const readAlongSpeechService = new ReadAlongSpeechService()

