/**
 * React Hook for ORBIS Native Speech Narration Layer
 */

import { useCallback, useEffect, useState } from 'react'
import {
  speechService,
  SPEECH_PRESETS,
} from '../services/audio/speechService'
import type {
  SpeechVoicePreset,
  SpeechOptions,
} from '../services/audio/speechService'

export interface UseSpeechResult {
  isAvailable: boolean
  isPlaying: boolean
  isPaused: boolean
  currentPreset: SpeechVoicePreset
  currentChunkIndex: number
  speak: (text: string, options?: Partial<SpeechOptions>) => boolean
  pause: () => void
  resume: () => void
  stop: () => void
  setPreset: (preset: SpeechVoicePreset) => void
  presets: typeof SPEECH_PRESETS
}

export function useSpeech(defaultPreset: SpeechVoicePreset = 'ORBY_SPRITE'): UseSpeechResult {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [currentPreset, setCurrentPreset] = useState<SpeechVoicePreset>(defaultPreset)
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0)
  const isAvailable = speechService.isAvailable()

  useEffect(() => {
    speechService.setPreset(defaultPreset)
  }, [defaultPreset])

  const speak = useCallback(
    (text: string, options?: Partial<SpeechOptions>): boolean => {
      const mergedOptions: SpeechOptions = {
        preset: currentPreset,
        ...options,
        onStart: () => {
          setIsPlaying(true)
          setIsPaused(false)
          options?.onStart?.()
        },
        onEnd: () => {
          setIsPlaying(false)
          setIsPaused(false)
          options?.onEnd?.()
        },
        onSentence: (idx, sentence) => {
          setCurrentChunkIndex(idx)
          options?.onSentence?.(idx, sentence)
        },
        onPauseStateChange: (paused) => {
          setIsPaused(paused)
          options?.onPauseStateChange?.(paused)
        },
        onError: (err) => {
          setIsPlaying(false)
          setIsPaused(false)
          options?.onError?.(err)
        },
      }

      return speechService.speak(text, mergedOptions)
    },
    [currentPreset]
  )

  const pause = useCallback(() => {
    speechService.pause()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    speechService.resume()
    setIsPaused(false)
  }, [])

  const stop = useCallback(() => {
    speechService.stop()
    setIsPlaying(false)
    setIsPaused(false)
  }, [])

  const setPreset = useCallback((preset: SpeechVoicePreset) => {
    setCurrentPreset(preset)
    speechService.setPreset(preset)
  }, [])

  return {
    isAvailable,
    isPlaying,
    isPaused,
    currentPreset,
    currentChunkIndex,
    speak,
    pause,
    resume,
    stop,
    setPreset,
    presets: SPEECH_PRESETS,
  }
}
