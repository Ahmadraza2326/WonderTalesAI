/**
 * ORBIS Native Zero-Cost Speech Narration Engine
 * High-performance, zero-runtime-cost Web Speech API synthesis layer with child-friendly pitch/rate presets.
 */

import { resolveLocaleConfig } from '../i18n/locales'

export type SpeechVoicePreset =
  | 'ORBY_SPRITE'
  | 'STORYTELLER_WARM'
  | 'BEDTIME_CALM'
  | 'EXPLORER_ENERGETIC'

export interface VoicePresetConfig {
  pitch: number
  rate: number
  volume: number
  description: string
  preferredVoiceKeywords: string[]
}

export const SPEECH_PRESETS: Record<SpeechVoicePreset, VoicePresetConfig> = {
  ORBY_SPRITE: {
    pitch: 1.35,
    rate: 1.05,
    volume: 1.0,
    description: 'Bright, sparkling, friendly mascot voice for Orby hints and cheers.',
    preferredVoiceKeywords: ['junior', 'child', 'female', 'samantha', 'victoria', 'karen', 'natural'],
  },
  STORYTELLER_WARM: {
    pitch: 1.0,
    rate: 0.92,
    volume: 1.0,
    description: 'Warm, expressive, steady cadence for story reading and adventures.',
    preferredVoiceKeywords: ['natural', 'google', 'daniel', 'serena', 'moira', 'george'],
  },
  BEDTIME_CALM: {
    pitch: 0.95,
    rate: 0.80,
    volume: 0.85,
    description: 'Soft, slow, gentle low-stimulation cadence for bedtime wind-downs.',
    preferredVoiceKeywords: ['whisper', 'soft', 'calm', 'female', 'natural', 'samantha'],
  },
  EXPLORER_ENERGETIC: {
    pitch: 1.15,
    rate: 1.10,
    volume: 1.0,
    description: 'Upbeat, adventurous tone for quest milestones and game instructions.',
    preferredVoiceKeywords: ['alex', 'oliver', 'natural', 'google'],
  },
}

export interface SpeechOptions {
  preset?: SpeechVoicePreset
  language?: string
  pitch?: number
  rate?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
  onStart?: () => void
  onEnd?: () => void
  onSentence?: (index: number, sentence: string) => void
  onWord?: (charIndex: number, length?: number) => void
  onError?: (error: Error) => void
  onPauseStateChange?: (isPaused: boolean) => void
}

export class SpeechService {
  private isSpeakingActive = false
  private isPausedActive = false
  private activePreset: SpeechVoicePreset = 'ORBY_SPRITE'
  private cachedVoices: SpeechSynthesisVoice[] = []
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private chunks: string[] = []
  private currentChunkIndex = 0
  private options: SpeechOptions = {}
  private isAutoplay = true

  constructor() {
    this.initVoices()
  }

  private initVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices()
      }
    }
  }

  /**
   * Checks if browser speech synthesis is supported.
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  /**
   * Retrieves available system voices.
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
   * Sets custom/mock voices (for testing and non-browser environments).
   */
  setVoices(voices: SpeechSynthesisVoice[]): void {
    this.cachedVoices = voices
  }

  /**
   * Sets active default preset.
   */
  setPreset(preset: SpeechVoicePreset): void {
    this.activePreset = preset
  }

  getActivePreset(): SpeechVoicePreset {
    return this.activePreset
  }

  /**
   * Finds the best voice matching language and preset traits.
   */
  findBestVoice(
    languageOrBcp47?: string | null,
    preset: SpeechVoicePreset = this.activePreset
  ): SpeechSynthesisVoice | null {
    const voices = this.getVoices()
    if (!voices.length) return null

    const locale = resolveLocaleConfig(languageOrBcp47)
    const targetBcp47 = locale.bcp47.toLowerCase()
    const targetCode = locale.code.toLowerCase()
    const presetConfig = SPEECH_PRESETS[preset] || SPEECH_PRESETS.ORBY_SPRITE

    // Filter by language
    const langMatchingVoices = voices.filter((v) => {
      const vLang = v.lang.replace('_', '-').toLowerCase()
      return vLang === targetBcp47 || vLang.startsWith(targetCode + '-') || vLang.startsWith(targetCode)
    })

    if (langMatchingVoices.length > 0) {
      // Look for preferred keywords in voice name
      for (const kw of presetConfig.preferredVoiceKeywords) {
        const match = langMatchingVoices.find((v) => v.name.toLowerCase().includes(kw))
        if (match) return match
      }
      // Exact language match
      const exact = langMatchingVoices.find((v) => v.lang.replace('_', '-').toLowerCase() === targetBcp47)
      if (exact) return exact
      return langMatchingVoices[0]
    }

    // Fallback for English
    if (targetCode === 'en') {
      const defaultVoice = voices.find((v) => v.default)
      return defaultVoice || voices.find((v) => v.lang.toLowerCase().startsWith('en')) || null
    }

    return null
  }

  /**
   * Normalizes narrative text by removing markdown and formatting artifacts.
   */
  normalizeText(text: string): string {
    if (!text) return ''
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
      .replace(/\*([^*]+)\*/g, '$1') // Italic
      .replace(/#+\s+/g, '') // Headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/`([^`]+)`/g, '$1') // Inline code
      .replace(/^[•\-\*]\s+/gm, '') // Bullet points
      .trim()
  }

  /**
   * Splits text into short, natural speech chunks (< 200 characters) to prevent browser synthesis lockup bugs.
   */
  chunkText(text: string): string[] {
    const cleaned = this.normalizeText(text)
    if (!cleaned) return []

    // Split on multilingual punctuation delimiters (. ! ? ؟ ۔ 。 ！ ？ ।)
    const rawSentences = cleaned
      .split(/(?<=[.!?؟۔])\s+|(?<=[。！？।])\s*/)
      .map((s) => s.trim())
      .filter(Boolean)

    const resultChunks: string[] = []

    for (const sentence of rawSentences) {
      if (sentence.length <= 180) {
        resultChunks.push(sentence)
      } else {
        // Split long sentences by comma, semicolon, or clause
        const clauses = sentence.split(/([,;:\-—]\s+)/).filter(Boolean)
        let currentSub = ''
        for (const clause of clauses) {
          if ((currentSub + clause).length <= 180) {
            currentSub += clause
          } else {
            if (currentSub.trim()) resultChunks.push(currentSub.trim())
            currentSub = clause
          }
        }
        if (currentSub.trim()) {
          resultChunks.push(currentSub.trim())
        }
      }
    }

    return resultChunks.length > 0 ? resultChunks : [cleaned]
  }

  /**
   * Speaks given text with child-friendly preset parameters.
   */
  speak(text: string, options?: SpeechOptions): boolean {
    this.stop()
    const chunks = this.chunkText(text)
    if (!chunks.length) return false

    return this.speakChunks(chunks, 0, true, options)
  }

  /**
   * Speaks a sequence of sentences with boundary callbacks and autoplay.
   */
  speakChunks(
    chunks: string[],
    startIndex = 0,
    autoplay = true,
    options?: SpeechOptions
  ): boolean {
    this.stop()
    if (options) {
      this.options = options
    }

    this.chunks = chunks
    this.isAutoplay = autoplay
    const safeIndex = Math.max(0, Math.min(startIndex, chunks.length - 1))
    this.currentChunkIndex = safeIndex

    if (!chunks.length || !chunks[safeIndex]) {
      return false
    }

    if (!this.isAvailable()) {
      this.options.onError?.(new Error('Speech synthesis is not supported on this browser/environment.'))
      return false
    }

    return this.playChunkAtIndex(safeIndex)
  }

  private playChunkAtIndex(index: number): boolean {
    if (!this.isAvailable()) return false
    if (index < 0 || index >= this.chunks.length) {
      this.isSpeakingActive = false
      this.isPausedActive = false
      this.currentUtterance = null
      this.options.onEnd?.()
      return false
    }

    window.speechSynthesis.cancel()

    this.currentChunkIndex = index
    const chunkText = this.chunks[index]
    const utterance = new SpeechSynthesisUtterance(chunkText)
    this.currentUtterance = utterance

    const presetName = this.options.preset || this.activePreset
    const presetConfig = SPEECH_PRESETS[presetName] || SPEECH_PRESETS.ORBY_SPRITE
    const locale = resolveLocaleConfig(this.options.language)

    utterance.lang = locale.bcp47
    const voice = this.options.voice || this.findBestVoice(this.options.language, presetName)
    if (voice) {
      utterance.voice = voice
    }

    utterance.pitch = this.options.pitch ?? presetConfig.pitch
    utterance.rate = this.options.rate ?? presetConfig.rate
    utterance.volume = this.options.volume ?? presetConfig.volume

    utterance.onstart = () => {
      this.isSpeakingActive = true
      this.isPausedActive = false
      if (index === 0) {
        this.options.onStart?.()
      }
      this.options.onSentence?.(index, chunkText)
    }

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        this.options.onWord?.(e.charIndex, (e as unknown as { charLength?: number }).charLength)
      }
    }

    utterance.onend = () => {
      if (this.isAutoplay && index + 1 < this.chunks.length && this.isSpeakingActive) {
        this.playChunkAtIndex(index + 1)
      } else {
        this.isSpeakingActive = false
        this.isPausedActive = false
        this.currentUtterance = null
        this.options.onEnd?.()
      }
    }

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        this.isSpeakingActive = false
        this.isPausedActive = false
        this.currentUtterance = null
        this.options.onError?.(new Error(`Speech narration: ${e.error}`))
      }
    }

    this.isSpeakingActive = true
    this.isPausedActive = false
    window.speechSynthesis.speak(utterance)
    return true
  }

  pause(): void {
    if (this.isAvailable() && this.isSpeakingActive) {
      window.speechSynthesis.pause()
      this.isPausedActive = true
      this.options.onPauseStateChange?.(true)
    }
  }

  resume(): void {
    if (this.isAvailable() && this.isPausedActive) {
      window.speechSynthesis.resume()
      this.isPausedActive = false
      this.options.onPauseStateChange?.(false)
    }
  }

  stop(): void {
    if (this.isAvailable()) {
      window.speechSynthesis.cancel()
    }
    this.isSpeakingActive = false
    this.isPausedActive = false
    this.currentUtterance = null
  }

  isPlaying(): boolean {
    return this.isSpeakingActive && !this.isPausedActive
  }

  isPaused(): boolean {
    return this.isPausedActive
  }

  getCurrentChunkIndex(): number {
    return this.currentChunkIndex
  }

  getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance
  }

  getChunks(): string[] {
    return this.chunks
  }
}

export const speechService = new SpeechService()
