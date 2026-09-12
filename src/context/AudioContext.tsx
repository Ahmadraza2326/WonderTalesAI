import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { sfxService, type AudioState } from '../services/audio/sfxService'

export interface AudioContextValue {
  isMuted: boolean
  isMusicPlaying: boolean
  masterVolume: number
  musicVolume: number
  toggleMute: () => boolean
  setMuted: (muted: boolean) => void
  toggleMusic: () => boolean
  setVolume: (vol: number) => void
  setMusicVolume: (vol: number) => void
  resumeAudio: () => Promise<void>
}

const AudioContext = createContext<AudioContextValue | null>(null)

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioState>(() => sfxService.getState())

  useEffect(() => {
    // Subscribe to synchronous changes across sfxService
    const unsubscribe = sfxService.subscribe((state) => {
      setAudioState(state)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const toggleMute = useCallback(() => {
    return sfxService.toggleMuted()
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    sfxService.setMuted(muted)
  }, [])

  const toggleMusic = useCallback(() => {
    return sfxService.toggleMusic()
  }, [])

  const setVolume = useCallback((vol: number) => {
    sfxService.setVolume(vol)
  }, [])

  const setMusicVolume = useCallback((vol: number) => {
    sfxService.setMusicVolume(vol)
  }, [])

  const resumeAudio = useCallback(async () => {
    await sfxService.resumeContext()
  }, [])

  const value: AudioContextValue = {
    isMuted: audioState.isMuted,
    isMusicPlaying: audioState.isMusicActive,
    masterVolume: audioState.masterVolume,
    musicVolume: audioState.musicVolume,
    toggleMute,
    setMuted,
    toggleMusic,
    setVolume,
    setMusicVolume,
    resumeAudio,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext)
  if (!context) {
    // Graceful fallback if invoked outside Provider
    return {
      isMuted: sfxService.isMuted(),
      isMusicPlaying: sfxService.isMusicPlaying(),
      masterVolume: sfxService.getVolume(),
      musicVolume: 0.18,
      toggleMute: () => sfxService.toggleMuted(),
      setMuted: (m) => sfxService.setMuted(m),
      toggleMusic: () => sfxService.toggleMusic(),
      setVolume: (v) => sfxService.setVolume(v),
      setMusicVolume: (v) => sfxService.setMusicVolume(v),
      resumeAudio: async () => sfxService.resumeContext(),
    }
  }
  return context
}
