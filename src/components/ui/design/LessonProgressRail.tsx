import React from 'react'
import { AnimatedIcon } from './AnimatedIcon'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export interface LessonProgressRailProps {
  currentSceneIndex: number
  totalScenes?: number
  lessonTitle?: string
  isAudioMuted?: boolean
  onToggleAudio?: () => void
  onOpenAskOrbis?: () => void
  onExit?: () => void
  className?: string
  style?: React.CSSProperties
}

const SCENE_NAMES = [
  'Welcome Hook',
  'Visual Demo',
  'Direct Practice',
  'Knowledge Check',
  'Celebration',
]

export const LessonProgressRail: React.FC<LessonProgressRailProps> = ({
  currentSceneIndex,
  totalScenes = 5,
  lessonTitle,
  isAudioMuted = false,
  onToggleAudio,
  onOpenAskOrbis,
  onExit,
  className = '',
  style,
}) => {
  return (
    <header
      className={`orbis-lesson-progress-rail ${className}`}
      role="banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '0 0 20px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Exit Button */}
      <button
        onClick={() => {
          sfxService.play('button_click')
          HapticsService.light()
          onExit?.()
        }}
        aria-label="Exit Lesson"
        style={{
          minWidth: '48px',
          minHeight: '48px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e2e8f0',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 180ms ease, transform 180ms ease',
        }}
      >
        <AnimatedIcon kind="arrow_left" size={20} color="#f8fafc" />
      </button>

      {/* Center 5-Scene Step Indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', maxWidth: '60%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: totalScenes }).map((_, index) => {
            const isCompleted = index < currentSceneIndex
            const isCurrent = index === currentSceneIndex

            return (
              <div
                key={index}
                style={{
                  width: isCurrent ? '28px' : '10px',
                  height: '10px',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  background: isCurrent
                    ? '#38bdf8'
                    : isCompleted
                    ? '#10b981'
                    : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isCurrent ? '0 0 10px rgba(56, 189, 248, 0.7)' : 'none',
                  transition: 'all 260ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                title={SCENE_NAMES[index] || `Scene ${index + 1}`}
              />
            )
          })}
        </div>

        {lessonTitle && (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontWeight: 'var(--font-weight-medium, 500)',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {lessonTitle} • {SCENE_NAMES[currentSceneIndex] || `Scene ${currentSceneIndex + 1}`}
          </span>
        )}
      </div>

      {/* Right Controls: Audio + Optional Guide Chat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onOpenAskOrbis && (
          <button
            onClick={() => {
              sfxService.play('button_click')
              HapticsService.light()
              onOpenAskOrbis()
            }}
            aria-label="Ask Guide"
            title="Ask Guide"
            style={{
              minWidth: '48px',
              minHeight: '48px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 180ms ease, transform 180ms ease',
            }}
          >
            <AnimatedIcon kind="wand" size={20} color="#c084fc" />
          </button>
        )}

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={() => {
            sfxService.play('button_click')
            HapticsService.light()
            onToggleAudio?.()
          }}
          aria-label={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          style={{
            minWidth: '48px',
            minHeight: '48px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isAudioMuted ? '#f87171' : '#38bdf8',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 180ms ease, transform 180ms ease',
          }}
        >
          <AnimatedIcon
            kind={isAudioMuted ? 'volume_off' : 'volume_on'}
            size={20}
            color={isAudioMuted ? '#f87171' : '#38bdf8'}
          />
        </button>
      </div>
    </header>
  )
}
