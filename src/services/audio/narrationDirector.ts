/**
 * ORBis Narration Director (Phase H - Voice Performance Direction)
 * Coordinates synchronized speech performance, 9 emotional vocal modes,
 * word-by-word subtitle highlights, and -12dB dynamic background music ducking.
 */

import { getGuideProfile } from '../academy/guideDirector'
import type { GuideId } from '../../types/learningUniverse'
import { sfxService } from './sfxService'

export type NarrationPerformanceMode =
  | 'warm_teacher'
  | 'excited_discovery'
  | 'wonder_suspense'
  | 'encouragement'
  | 'gentle_correction'
  | 'celebration'
  | 'reflective_guide'
  | 'focused_attention'
  | 'playful_challenge'

export interface NarrationSubtitleEvent {
  text: string
  currentWordIndex: number
  totalWords: number
  isSpeaking: boolean
  guideId: GuideId
  mode: NarrationPerformanceMode
}

type SubtitleListener = (event: NarrationSubtitleEvent) => void

class NarrationDirector {
  private isMuted: boolean = false
  private speedMultiplier: number = 1.0
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private listeners: Set<SubtitleListener> = new Set()
  private currentGuideId: GuideId = 'poly'
  private currentMode: NarrationPerformanceMode = 'warm_teacher'

  public subscribe(listener: SubtitleListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(event: NarrationSubtitleEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (err) {
        console.error('Subtitle listener error:', err)
      }
    })
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (muted) {
      this.stop()
    }
  }

  public setSpeed(speed: number) {
    this.speedMultiplier = Math.max(0.5, Math.min(2.0, speed))
  }

  /**
   * Modulate pitch and rate offsets based on the 9 canonical performance modes.
   */
  private getPerformanceParameters(basePitch: number, baseRate: number, mode: NarrationPerformanceMode) {
    let pitch = basePitch
    let rate = baseRate * this.speedMultiplier

    switch (mode) {
      case 'excited_discovery':
        pitch = Math.min(2.0, basePitch * 1.18)
        rate = Math.min(1.4, rate * 1.08)
        break
      case 'wonder_suspense':
        pitch = Math.max(0.6, basePitch * 0.9)
        rate = Math.max(0.7, rate * 0.88)
        break
      case 'encouragement':
        pitch = Math.min(1.8, basePitch * 1.06)
        rate = Math.max(0.8, rate * 0.92)
        break
      case 'gentle_correction':
        pitch = basePitch
        rate = Math.max(0.75, rate * 0.88)
        break
      case 'celebration':
        pitch = Math.min(2.0, basePitch * 1.25)
        rate = Math.min(1.5, rate * 1.12)
        break
      case 'reflective_guide':
        pitch = Math.max(0.7, basePitch * 0.95)
        rate = Math.max(0.8, rate * 0.9)
        break
      case 'focused_attention':
        pitch = basePitch
        rate = Math.max(0.8, rate * 0.95)
        break
      case 'playful_challenge':
        pitch = Math.min(1.9, basePitch * 1.1)
        rate = Math.min(1.4, rate * 1.05)
        break
      case 'warm_teacher':
      default:
        // Baseline
        break
    }

    return { pitch, rate }
  }

  /**
   * Executes an emotionally directed spoken performance with dynamic music ducking.
   */
  public speak(
    text: string,
    guideId: GuideId = 'poly',
    mode: NarrationPerformanceMode = 'warm_teacher',
    onComplete?: () => void
  ) {
    this.stop()
    this.currentGuideId = guideId
    this.currentMode = mode

    if (this.isMuted || !text.trim()) {
      onComplete?.()
      return
    }

    // 1. Duck background music by -12dB for speech clarity
    sfxService.duckMusic(true)

    const words = text.split(/\s+/)
    this.notify({
      text,
      currentWordIndex: 0,
      totalWords: words.length,
      isSpeaking: true,
      guideId,
      mode,
    })

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      // Non-browser / SSR fallback: simulate duration based on word count
      const fallbackMs = Math.max(1200, words.length * 280)
      setTimeout(() => {
        sfxService.duckMusic(false)
        this.notify({
          text,
          currentWordIndex: words.length - 1,
          totalWords: words.length,
          isSpeaking: false,
          guideId,
          mode,
        })
        onComplete?.()
      }, fallbackMs)
      return
    }

    const guide = getGuideProfile(guideId)
    const { pitch, rate } = this.getPerformanceParameters(guide.voicePitch, guide.voiceRate, mode)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = pitch
    utterance.rate = rate

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex
        const spokenSubstr = text.substring(0, charIndex)
        const wordIndex = spokenSubstr.split(/\s+/).length - 1
        this.notify({
          text,
          currentWordIndex: Math.max(0, wordIndex),
          totalWords: words.length,
          isSpeaking: true,
          guideId,
          mode,
        })
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null
      sfxService.duckMusic(false)
      this.notify({
        text,
        currentWordIndex: words.length - 1,
        totalWords: words.length,
        isSpeaking: false,
        guideId,
        mode,
      })
      onComplete?.()
    }

    utterance.onerror = () => {
      this.currentUtterance = null
      sfxService.duckMusic(false)
      this.notify({
        text,
        currentWordIndex: 0,
        totalWords: words.length,
        isSpeaking: false,
        guideId,
        mode,
      })
      onComplete?.()
    }

    this.currentUtterance = utterance
    window.speechSynthesis.speak(utterance)
  }

  public stop() {
    if (this.currentUtterance && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
      } catch {
        // Safe fallback
      }
    }
    this.currentUtterance = null
    sfxService.duckMusic(false)
    this.notify({
      text: '',
      currentWordIndex: 0,
      totalWords: 0,
      isSpeaking: false,
      guideId: this.currentGuideId,
      mode: this.currentMode,
    })
  }
}

export const narrationDirector = new NarrationDirector()
