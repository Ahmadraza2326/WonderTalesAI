import React, { useEffect } from 'react'
import { CelebrationParticles } from './CelebrationParticles'
import { sfxService } from '../../services/audio/sfxService'
import { HapticsService } from '../../services/hapticsService'

export interface VictoryCelebrationModalProps {
  isOpen: boolean
  title?: string
  subtitle?: string
  badgeEmoji?: string
  xpEarned?: number
  starsEarned?: number
  onNextLevel: () => void
  onReplay?: () => void
  onExit?: () => void
  nextLevelLabel?: string
  children?: React.ReactNode
}

export const VictoryCelebrationModal: React.FC<VictoryCelebrationModalProps> = ({
  isOpen,
  title = 'Victory! Spectacular Discovery!',
  subtitle = 'You solved the challenge and unlocked cosmic knowledge!',
  badgeEmoji = '🎉',
  xpEarned = 100,
  starsEarned = 3,
  onNextLevel,
  onReplay,
  onExit,
  nextLevelLabel = 'Next Level ➔',
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      HapticsService.success()
      sfxService.play('victory_fanfare')

      const timer = setTimeout(() => {
        sfxService.play('star_pop')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Support Space or Enter to auto-advance
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onNextLevel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onNextLevel])

  if (!isOpen) return null

  return (
    <div
      className="victory-celebration-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.25s ease',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
    >
      <CelebrationParticles particleCount={60} durationMs={3200} />

      <div
        className="victory-celebration-card"
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          border: '3px solid #fbbf24',
          borderRadius: '2rem',
          padding: '2.25rem 2rem',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(251, 191, 36, 0.35)',
          zIndex: 10,
          animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Animated Badge */}
        <div
          style={{
            width: '88px',
            height: '88px',
            margin: '0 auto 1.25rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.5)',
            border: '4px solid #ffffff',
            animation: 'bounceGentle 2s infinite',
          }}
        >
          {badgeEmoji}
        </div>

        <h2
          id="victory-modal-title"
          style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            margin: '0 0 0.5rem',
            color: '#fbbf24',
            textShadow: '0 2px 10px rgba(251, 191, 36, 0.4)',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 1.5rem',
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </p>

        {children}

        {/* Rewards Row (Stars & XP) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '1.25rem',
            padding: '1rem 1.5rem',
            margin: '1.25rem 0 1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Earned Stars */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '2px' }}>
              {Array.from({ length: starsEarned }).map((_, i) => (
                <span key={i} style={{ color: '#fbbf24' }}>⭐</span>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
              +{starsEarned} Stars
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Earned XP */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>
              +{xpEarned}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
              Cosmic XP
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {/* Primary Next Level Trigger */}
          <button
            type="button"
            onClick={() => {
              HapticsService.medium()
              sfxService.play('card_flip')
              onNextLevel()
            }}
            style={{
              padding: '1.1rem 2rem',
              borderRadius: '1.25rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '1.15rem',
              fontWeight: 900,
              border: '2px solid #34d399',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '52px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{nextLevelLabel}</span>
          </button>

          {/* Secondary Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {onReplay && (
              <button
                type="button"
                onClick={() => {
                  HapticsService.light()
                  sfxService.play('card_flip')
                  onReplay()
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                🔄 Replay
              </button>
            )}

            {onExit && (
              <button
                type="button"
                onClick={() => {
                  HapticsService.light()
                  sfxService.play('card_flip')
                  onExit()
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                🪐 Playroom
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
