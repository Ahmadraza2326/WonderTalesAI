import React, { useState, useEffect } from 'react'
import type { GuideId, GuideEmotion } from '../../../../types/learningUniverse'
import { getGuideProfile } from '../../../../services/academy/guideDirector'
import { narrationDirector, type NarrationSubtitleEvent } from '../../../../services/audio/narrationDirector'
import { GuideCharacterSvg } from '../../guide/GuideCharacterSvg'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface GuideTeachingLayerProps {
  guideId: GuideId
  emotion?: GuideEmotion
  dialogueText: string
  narrationText?: string
  autoPlayAudio?: boolean
  focusTargetId?: string
  onNarrationComplete?: () => void
}

export const GuideTeachingLayer: React.FC<GuideTeachingLayerProps> = ({
  guideId,
  emotion = 'neutral',
  dialogueText,
  narrationText,
  autoPlayAudio = true,
  onNarrationComplete,
}) => {
  const guide = getGuideProfile(guideId)
  const [subtitle, setSubtitle] = useState<NarrationSubtitleEvent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const speechToPlay = narrationText || dialogueText

  // Subscribe to narration subtitles
  useEffect(() => {
    const unsubscribe = narrationDirector.subscribe((event) => {
      setSubtitle(event)
      setIsPlaying(event.isSpeaking)
    })
    return () => unsubscribe()
  }, [])

  // Auto-speak on scene mount or text change if autoPlayAudio is true
  useEffect(() => {
    if (autoPlayAudio && speechToPlay) {
      const timer = setTimeout(() => {
        narrationDirector.speak(speechToPlay, guideId, 'warm_teacher', onNarrationComplete)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [speechToPlay, guideId, autoPlayAudio, onNarrationComplete])

  const handleReplaySpeech = () => {
    sfxService.play('star_pop')
    HapticsService.light()
    narrationDirector.speak(speechToPlay, guideId, 'warm_teacher', onNarrationComplete)
  }

  const handleToggleMute = () => {
    HapticsService.light()
    if (isPlaying) {
      narrationDirector.stop()
      setIsPlaying(false)
    } else {
      narrationDirector.speak(speechToPlay, guideId, 'warm_teacher', onNarrationComplete)
    }
  }

  const words = dialogueText.split(/\s+/)
  const activeWordIdx = subtitle?.isSpeaking ? subtitle.currentWordIndex : -1

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto 16px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
      }}
      aria-label={`${guide.name} - Teaching Guide`}
    >
      {/* Vector Expressive Character Companion */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <GuideCharacterSvg
          guideId={guideId}
          emotion={emotion}
          isSpeaking={isPlaying}
          size={82}
        />
        <span style={{ fontSize: '11px', fontWeight: 800, color: guide.accentColor }}>
          {guide.name}
        </span>
      </div>

      {/* Synchronized Live Speech Bubble */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          border: `1.5px solid ${guide.accentColor}70`,
          borderRadius: '20px',
          padding: '14px 18px',
          color: '#f8fafc',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
        }}
      >
        {/* Pointer Arrow */}
        <div
          style={{
            position: 'absolute',
            left: '-8px',
            top: '24px',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: `8px solid ${guide.accentColor}70`,
          }}
        />

        {/* Word-by-Word Highlight Dialogue */}
        <div
          style={{
            fontSize: '16px',
            lineHeight: 1.6,
            fontWeight: 600,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {words.map((w, idx) => {
            const isHighlighted = idx === activeWordIdx
            return (
              <span
                key={idx}
                style={{
                  color: isHighlighted ? '#38bdf8' : '#f8fafc',
                  backgroundColor: isHighlighted ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  padding: '0 2px',
                  borderRadius: '4px',
                  transform: isHighlighted ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              >
                {w}
              </span>
            )
          })}
        </div>

        {/* Audio Quick Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {guide.title} • {guide.realm.toUpperCase()}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleReplaySpeech}
              title="Replay Voice"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#e2e8f0',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>🔊</span>
              <span>Replay</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              title={isPlaying ? 'Pause Speech' : 'Play Speech'}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#e2e8f0',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
