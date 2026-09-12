import React, { useState, useEffect } from 'react'
import type { GuideId, GuideEmotion, ActorPose, GazeDirection, GazeTarget } from '../../../types/learningUniverse'
import { getGuideProfile } from '../../../services/academy/guideDirector'
import { narrationDirector, type NarrationSubtitleEvent } from '../../../services/audio/narrationDirector'
import { GuideCharacterSvg } from './GuideCharacterSvg'

interface GuideCompanionAvatarProps {
  guideId: GuideId
  emotion?: GuideEmotion
  pose?: ActorPose
  gaze?: GazeDirection
  gazeTarget?: GazeTarget
  customSpeech?: string
  size?: number
  showSpeechBubble?: boolean
  onSpeechEnd?: () => void
  className?: string
  style?: React.CSSProperties
}

/**
 * ORBis Guide Companion Portal
 * Direction: Living Learning Universe
 * Floating orbital character companion with real-time speech subtitles,
 * mood transitions, and vector actor integration.
 */
export const GuideCompanionAvatar: React.FC<GuideCompanionAvatarProps> = ({
  guideId,
  emotion = 'neutral',
  pose,
  gaze = 'center',
  gazeTarget,
  customSpeech,
  size = 72,
  showSpeechBubble = true,
  className = '',
  style,
}) => {
  const guide = getGuideProfile(guideId)
  const [subtitle, setSubtitle] = useState<NarrationSubtitleEvent | null>(null)

  useEffect(() => {
    const unsubscribe = narrationDirector.subscribe((event) => {
      setSubtitle(event.isSpeaking ? event : null)
    })
    return () => unsubscribe()
  }, [])

  const currentSpeech = subtitle?.text || customSpeech || guide.catchphrase
  const isSpeaking = Boolean(subtitle?.isSpeaking)

  return (
    <div
      className={`orbis-guide-companion-portal ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        ...style,
      }}
      aria-label={`${guide.name} - ${guide.title}`}
    >
      {/* 1. Orbiting Vector Character Avatar Stage */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Ambient Orbiting Aura Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: `1.5px dashed ${guide.accentColor}50`,
            animation: isSpeaking ? 'orbis-spin-slow 6s linear infinite' : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Live Vector Mascot Engine */}
        <GuideCharacterSvg
          guideId={guideId}
          emotion={emotion}
          pose={pose}
          gaze={gaze}
          gazeTarget={gazeTarget}
          isSpeaking={isSpeaking}
          size={size}
        />
      </div>

      {/* 2. Glassmorphic Speech Bubble */}
      {showSpeechBubble && (
        <div
          className="orbis-companion-speech-bubble"
          style={{
            maxWidth: '380px',
            backgroundColor: 'rgba(2, 6, 23, 0.92)',
            border: `1.5px solid ${guide.accentColor}60`,
            borderRadius: '18px',
            padding: '12px 18px',
            color: '#f8fafc',
            fontSize: '13.5px',
            lineHeight: 1.5,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px ${guide.accentColor}25`,
            backdropFilter: 'blur(16px)',
            position: 'relative',
          }}
        >
          {/* Guide Title Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: guide.accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {guide.name}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
              {guide.title}
            </span>
          </div>

          {/* Spoken Content */}
          <div style={{ fontWeight: 450, color: '#f1f5f9' }}>
            {currentSpeech}
          </div>

          {/* Tail Pointer */}
          <div
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderRight: `8px solid rgba(2, 6, 23, 0.92)`,
            }}
          />
        </div>
      )}
    </div>
  )
}
