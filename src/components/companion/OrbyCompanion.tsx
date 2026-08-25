import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sfxService } from '../../services/audio/sfxService'
import { speechService } from '../../services/audio/speechService'

export type OrbyEmotion = 'happy' | 'thinking' | 'celebrate' | 'guiding' | 'sleepy'

const ROUTE_TIPS: Record<string, { message: string; emotion: OrbyEmotion; tip: string }> = {
  '/': {
    message: 'Welcome Explorer! Ready to craft a magical story or discover curious mini-games?',
    emotion: 'happy',
    tip: 'Tap "Create Story" or jump into "Games" to start earning Stars!',
  },
  '/dashboard': {
    message: 'Here is your Studio Command Center! Look at your daily streak and station progress!',
    emotion: 'guiding',
    tip: 'Complete daily cosmic challenges to level up faster!',
  },
  '/overworld': {
    message: 'Welcome to the Overworld Journey Map! Follow the glowing trail across 5 biomes!',
    emotion: 'happy',
    tip: 'Each milestone unlocks new games, gadgets, and story seeds!',
  },
  '/games': {
    message: 'The Playroom Observatory is alive with wonder! Choose a station to master!',
    emotion: 'celebrate',
    tip: 'Check your Daily Cosmic Quests at the top for bonus XP!',
  },
  '/playroom': {
    message: 'The Playroom Observatory is alive with wonder! Choose a station to master!',
    emotion: 'celebrate',
    tip: 'Check your Daily Cosmic Quests at the top for bonus XP!',
  },
  '/passport': {
    message: 'Your Adventure Passport is official! Check your Brain Skill Radar & Science Codex!',
    emotion: 'thinking',
    tip: 'You can flip any Science Dossier to discover real scientific facts!',
  },
  '/adventure-passport': {
    message: 'Your Adventure Passport is official! Check your Brain Skill Radar & Science Codex!',
    emotion: 'thinking',
    tip: 'You can flip any Science Dossier to discover real scientific facts!',
  },
  '/stories/new': {
    message: 'Let your imagination fly! Pick a hero, theme, and magical elements!',
    emotion: 'guiding',
    tip: 'Your mini-game discoveries unlock special Secret Story Seeds in Step 2!',
  },
  '/stories': {
    message: 'Your personal story library! Tap any tale to read, listen, or solve comprehension quests!',
    emotion: 'happy',
    tip: 'Finishing stories recommends matching mini-game stations!',
  },
  '/games/creature-lab': {
    message: 'Welcome to Creature Lab! Drag elemental essences into the cauldron to hatch mythical beasts!',
    emotion: 'thinking',
    tip: 'Try combining Lumina + Pyro for solar dragons, or Terra + Flora for forest spriggans!',
  },
  '/games/magic-machine': {
    message: 'Physics puzzle time! Position bouncy springs and magnets to guide the Sproutlings home!',
    emotion: 'guiding',
    tip: 'Angle your ramps carefully to conserve kinetic momentum!',
  },
  '/playroom/magic-machine': {
    message: 'Physics puzzle time! Position bouncy springs and magnets to guide the Sproutlings home!',
    emotion: 'guiding',
    tip: 'Angle your ramps carefully to conserve kinetic momentum!',
  },
  '/games/mystery-detective': {
    message: 'Grab your magnifying glass Detective! Inspect footprints, timestamps, and suspect alibis!',
    emotion: 'thinking',
    tip: 'Cross out innocent suspects as you find clues with your UV lens!',
  },
  '/playroom/mystery-detective': {
    message: 'Grab your magnifying glass Detective! Inspect footprints, timestamps, and suspect alibis!',
    emotion: 'thinking',
    tip: 'Cross out innocent suspects as you find clues with your UV lens!',
  },
  '/games/potion-scales': {
    message: 'Welcome to the Apothecary! Place weights on the brass balance to fulfill potion orders!',
    emotion: 'guiding',
    tip: 'Add or remove weights until the pointer locks in the center green zone!',
  },
  '/playroom/potion-scales': {
    message: 'Welcome to the Apothecary! Place weights on the brass balance to fulfill potion orders!',
    emotion: 'guiding',
    tip: 'Add or remove weights until the pointer locks in the center green zone!',
  },
  '/parent-zone': {
    message: 'Welcome to the Parent Zone! Here you can check screen-time, cognitive skills, and export certificates!',
    emotion: 'guiding',
    tip: 'Set bedtime curfew timers to keep screen-time balanced and healthy!',
  },
}

const FUN_CHEERS = [
  '🌟 You are doing fantastic! Keep exploring!',
  '🔬 Did you know? Honey never spoils because of its low moisture and natural acidity!',
  '🪐 Saturn is so light it would float in a giant bathtub of water!',
  '💡 Every time you solve a puzzle, your brain builds stronger neural pathways!',
  '🦉 Owls have tubular eyes that let them see in near total darkness!',
  '✨ Keep going Explorer, you are on your way to becoming a Cosmic Grandmaster!',
]

const ORBY_VOICE_KEY = 'orbis_orby_voice_enabled'

export const OrbyCompanion: React.FC = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [isMinimized, setIsMinimized] = useState<boolean>(false)
  const [customSpeech, setCustomSpeech] = useState<string | null>(null)
  const [isBouncing, setIsBouncing] = useState<boolean>(false)
  const [isSpeakingVoice, setIsSpeakingVoice] = useState<boolean>(false)
  const [isBedtimeWindDown, setIsBedtimeWindDown] = useState<boolean>(false)

  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(ORBY_VOICE_KEY)
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  // Current route context
  const currentContext = ROUTE_TIPS[location.pathname] || {
    message: 'I am Orby, your star companion! Explore stories and magical games with me!',
    emotion: 'happy' as OrbyEmotion,
    tip: 'Tap on me anytime for hints and fun science facts!',
  }

  const activeEmotion: OrbyEmotion = isBedtimeWindDown
    ? 'sleepy'
    : currentContext.emotion

  const activeMessage = isBedtimeWindDown
    ? "It's time to rest our explorer eyes! Let's listen to a gentle bedtime story and drift into dreamland 🌠"
    : customSpeech || currentContext.message

  // Listen to bedtime wind-down event
  useEffect(() => {
    const handleBedtime = () => {
      setIsBedtimeWindDown(true)
      setIsOpen(true)
      setIsMinimized(false)
      sfxService.play('balance_near')

      if (isVoiceEnabled) {
        speechService.speak(
          "It's bedtime wind-down time Explorer! Let's rest our eyes with a calm story.",
          {
            preset: 'BEDTIME_CALM',
            onStart: () => setIsSpeakingVoice(true),
            onEnd: () => setIsSpeakingVoice(false),
          }
        )
      }
    }

    window.addEventListener('orbis:bedtime_wind_down', handleBedtime)
    return () => {
      window.removeEventListener('orbis:bedtime_wind_down', handleBedtime)
    }
  }, [isVoiceEnabled])

  // Reset custom speech when route changes
  useEffect(() => {
    setCustomSpeech(null)
    setIsOpen(true)
  }, [location.pathname])

  const toggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextState = !isVoiceEnabled
    setIsVoiceEnabled(nextState)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(ORBY_VOICE_KEY, String(nextState))
    }
    if (!nextState) {
      speechService.stop()
      setIsSpeakingVoice(false)
    } else {
      sfxService.play('star_pop')
      speakCurrentMessage(activeMessage)
    }
  }

  const speakCurrentMessage = (msg: string) => {
    if (!isVoiceEnabled) return
    speechService.speak(msg, {
      preset: isBedtimeWindDown ? 'BEDTIME_CALM' : 'ORBY_SPRITE',
      onStart: () => setIsSpeakingVoice(true),
      onEnd: () => setIsSpeakingVoice(false),
      onError: () => setIsSpeakingVoice(false),
    })
  }

  const handleMascotTap = () => {
    sfxService.play('star_pop')
    setIsBouncing(true)
    setTimeout(() => setIsBouncing(false), 600)

    if (isBedtimeWindDown) {
      const bedtimeMsg = 'Sleepy stars are shining! Time for gentle dreams. Goodnight Explorer! 🌙✨'
      setCustomSpeech(bedtimeMsg)
      setIsOpen(true)
      setIsMinimized(false)
      if (isVoiceEnabled) speakCurrentMessage(bedtimeMsg)
      return
    }

    // Pick random cheer or science fact
    const randomCheer = FUN_CHEERS[Math.floor(Math.random() * FUN_CHEERS.length)]
    setCustomSpeech(randomCheer)
    setIsOpen(true)
    setIsMinimized(false)

    if (isVoiceEnabled) {
      speakCurrentMessage(randomCheer)
    }
  }

  const emotionEmoji = {
    happy: '🌟',
    thinking: '✨',
    celebrate: '🎉',
    guiding: '🧭',
    sleepy: '🌙',
  }[activeEmotion] || '🌟'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
      aria-label="Orby the Star Sprite Companion"
    >
      {/* Speech Bubble */}
      {isOpen && !isMinimized && (
        <div
          style={{
            pointerEvents: 'auto',
            background: isBedtimeWindDown
              ? 'rgba(15, 23, 42, 0.96)'
              : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(16px)',
            border: isBedtimeWindDown ? '2px solid #818cf8' : '2px solid #a855f7',
            borderRadius: '20px',
            padding: '14px 18px',
            maxWidth: '290px',
            boxShadow: isBedtimeWindDown
              ? '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(129, 140, 248, 0.35)'
              : '0 12px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.3)',
            marginBottom: '12px',
            color: '#f8fafc',
            position: 'relative',
            animation: 'floatGentle 4s ease-in-out infinite',
          }}
        >
          {/* Header Controls: Voice Toggle & Close Button */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={isVoiceEnabled ? 'Mute Orby speech narration' : 'Enable Orby speech narration'}
              title={isVoiceEnabled ? 'Speech Narration: ON' : 'Speech Narration: OFF'}
              style={{
                background: isVoiceEnabled ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: isVoiceEnabled ? '#fbbf24' : '#94a3b8',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isVoiceEnabled ? '🔊' : '🔇'}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Dismiss Orby tip"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 800,
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', paddingRight: '60px' }}>
            <span style={{ fontSize: '16px' }}>{emotionEmoji}</span>
            <span style={{ fontSize: '11px', fontWeight: 900, color: isBedtimeWindDown ? '#a5b4fc' : '#fbbf24', letterSpacing: '0.04em' }}>
              {isBedtimeWindDown ? 'ORBY BEDTIME WIND-DOWN' : 'ORBY THE STAR SPRITE'}
            </span>
          </div>

          <p style={{ margin: '0 0 6px', fontSize: '13px', lineHeight: 1.4, fontWeight: 600 }}>
            {activeMessage}
          </p>

          {!customSpeech && !isBedtimeWindDown && currentContext.tip && (
            <div
              style={{
                fontSize: '11px',
                color: '#c084fc',
                background: 'rgba(168, 85, 247, 0.15)',
                padding: '6px 8px',
                borderRadius: '8px',
                lineHeight: 1.3,
                fontWeight: 700,
              }}
            >
              💡 <strong>Tip:</strong> {currentContext.tip}
            </div>
          )}

          {/* Audio Speaking Wave Indicator */}
          {isSpeakingVoice && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px',
                fontSize: '11px',
                color: '#fbbf24',
                fontWeight: 700,
              }}
            >
              <span>🎙️ Speaking...</span>
            </div>
          )}
        </div>
      )}

      {/* Floating Animated Mascot Avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? 'Show Orby' : 'Minimize Orby'}
          style={{
            background: 'rgba(30, 27, 75, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            borderRadius: '9999px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {isMinimized ? '💬' : '−'}
        </button>

        <button
          type="button"
          onClick={handleMascotTap}
          aria-label="Tap Orby for a cheer or tip"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '24px',
            background: isBedtimeWindDown
              ? 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #818cf8 100%)'
              : 'linear-gradient(135deg, #fbbf24 0%, #ec4899 50%, #8b5cf6 100%)',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            boxShadow: isBedtimeWindDown
              ? '0 8px 24px rgba(99, 102, 241, 0.5), 0 0 20px rgba(129, 140, 248, 0.4)'
              : '0 8px 24px rgba(236, 72, 153, 0.45), 0 0 20px rgba(251, 191, 36, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isBouncing
              ? 'scale(1.25) rotate(15deg)'
              : isSpeakingVoice
              ? 'scale(1.08)'
              : 'scale(1)',
          }}
        >
          {isBedtimeWindDown ? '🌙' : '🌟'}
        </button>
      </div>
    </div>
  )
}
