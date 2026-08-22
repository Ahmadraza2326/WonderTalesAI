import type { AudioPlayerState } from '../../types/audioPlayer'

export interface AudioControllerOptions {
  onEnded?: () => void
  onError?: (error: Error) => void
  onPlayStateChange?: (isPlaying: boolean) => void
}

export class AudioController {
  private audio: HTMLAudioElement | null = null
  private currentPlayId = 0
  private isUsingSpeechSynthesis = false
  private options: AudioControllerOptions = {}

  private state: AudioPlayerState = {
    isPlaying: false,
    currentSegment: 0,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    volume: 1,
  }

  constructor(options?: AudioControllerOptions) {
    if (options) {
      this.options = options
    }
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.audio = new Audio()
      this.attachEventListeners()
    }
  }

  setOptions(options: AudioControllerOptions): void {
    this.options = { ...this.options, ...options }
  }

  getState(): AudioPlayerState {
    return { ...this.state }
  }

  private attachEventListeners(): void {
    if (!this.audio) return

    this.audio.addEventListener('ended', this.handleAudioEnded)
    this.audio.addEventListener('error', this.handleAudioError)
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.addEventListener('loadedmetadata', this.handleLoadedMetadata)
  }

  private removeEventListeners(): void {
    if (!this.audio) return

    this.audio.removeEventListener('ended', this.handleAudioEnded)
    this.audio.removeEventListener('error', this.handleAudioError)
    this.audio.removeEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata)
  }

  private handleAudioEnded = (): void => {
    this.state.isPlaying = false
    this.options.onPlayStateChange?.(false)
    this.options.onEnded?.()
  }

  private handleAudioError = (): void => {
    this.state.isPlaying = false
    this.options.onPlayStateChange?.(false)
    const err = this.audio?.error
    const errorMsg = err
      ? `Audio playback error (code ${err.code}): ${err.message || 'Unable to play track'}`
      : 'Audio playback failed.'
    this.options.onError?.(new Error(errorMsg))
  }

  private handleTimeUpdate = (): void => {
    if (this.audio) {
      this.state.currentTime = this.audio.currentTime
    }
  }

  private handleLoadedMetadata = (): void => {
    if (this.audio) {
      this.state.duration = this.audio.duration || 0
    }
  }

  /**
   * Plays a segment either via audio URL or browser SpeechSynthesis fallback.
   */
  async playSegment(segment: { audioUrl?: string | null; text: string }, language?: string): Promise<void> {
    this.stop()
    const playId = ++this.currentPlayId

    const audioUrl = segment.audioUrl?.trim()

    if (audioUrl) {
      // Real audio track
      this.isUsingSpeechSynthesis = false
      if (!this.audio) {
        this.options.onError?.(new Error('Audio playback is not supported in this environment.'))
        return
      }

      this.audio.src = audioUrl
      this.audio.playbackRate = this.state.playbackRate
      this.audio.volume = this.state.volume

      try {
        await this.audio.play()
        if (this.currentPlayId === playId) {
          this.state.isPlaying = true
          this.options.onPlayStateChange?.(true)
        }
      } catch (err) {
        if (this.currentPlayId === playId) {
          this.state.isPlaying = false
          this.options.onPlayStateChange?.(false)
          if (err instanceof Error && err.name !== 'AbortError') {
            this.options.onError?.(err)
          }
        }
      }
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // SpeechSynthesis Fallback
      this.isUsingSpeechSynthesis = true
      window.speechSynthesis.cancel()

      const textToSpeak = segment.text.trim()
      if (!textToSpeak) {
        this.handleAudioEnded()
        return
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      if (language) {
        utterance.lang = language
      }
      utterance.rate = this.state.playbackRate
      utterance.volume = this.state.volume

      utterance.onend = () => {
        if (this.currentPlayId === playId) {
          this.state.isPlaying = false
          this.options.onPlayStateChange?.(false)
          this.options.onEnded?.()
        }
      }

      utterance.onerror = (e) => {
        if (this.currentPlayId === playId) {
          this.state.isPlaying = false
          this.options.onPlayStateChange?.(false)
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            this.options.onError?.(new Error(`Speech synthesis error: ${e.error}`))
          }
        }
      }

      this.state.isPlaying = true
      this.options.onPlayStateChange?.(true)
      window.speechSynthesis.speak(utterance)
    } else {
      this.options.onError?.(
        new Error('No audio URL is available and speech synthesis is not supported on this browser.')
      )
      this.state.isPlaying = false
      this.options.onPlayStateChange?.(false)
    }
  }

  play(url: string): Promise<void> {
    return this.playSegment({ audioUrl: url, text: '' })
  }

  pause(): void {
    this.currentPlayId++
    if (this.isUsingSpeechSynthesis && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause()
    } else if (this.audio) {
      this.audio.pause()
    }
    this.state.isPlaying = false
    this.options.onPlayStateChange?.(false)
  }

  resume(): void {
    if (this.isUsingSpeechSynthesis && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume()
      this.state.isPlaying = true
      this.options.onPlayStateChange?.(true)
    } else if (this.audio && this.audio.src) {
      this.audio.play().then(() => {
        this.state.isPlaying = true
        this.options.onPlayStateChange?.(true)
      }).catch((err) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          this.options.onError?.(err)
        }
      })
    }
  }

  stop(): void {
    this.currentPlayId++
    if (this.isUsingSpeechSynthesis && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
    this.state.isPlaying = false
    this.state.currentTime = 0
    this.options.onPlayStateChange?.(false)
  }

  setVolume(volume: number): void {
    this.state.volume = volume
    if (this.audio) {
      this.audio.volume = volume
    }
  }

  setPlaybackRate(rate: number): void {
    this.state.playbackRate = rate
    if (this.audio) {
      this.audio.playbackRate = rate
    }
  }

  isFallbackMode(): boolean {
    return this.isUsingSpeechSynthesis
  }

  destroy(): void {
    this.stop()
    this.removeEventListeners()
    if (this.audio) {
      this.audio.src = ''
      this.audio = null
    }
    this.options = {}
  }
}

export const audioController = new AudioController()