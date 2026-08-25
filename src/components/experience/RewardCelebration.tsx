import { memo, useEffect, useRef, useState } from 'react'
import type { ActivityRewardStatus } from '../../types/experience'
import { sfxService } from '../../services/audio/sfxService'
import { CelebrationParticles } from './CelebrationParticles'

interface RewardCelebrationProps {
  title?: string
  message?: string
  rewardStatus?: ActivityRewardStatus | null
  accuracy?: number
  statsSummary?: { label: string; value: string | number }[]
  onPrimaryAction: () => void
  primaryActionLabel?: string
  secondaryAction?: { label: string; onClick: () => void }
  className?: string
}

export const RewardCelebration = memo(function RewardCelebration({
  title = '🌟 Quest Completed!',
  message = 'Magnificent effort! You conquered this magical story activity.',
  rewardStatus,
  accuracy,
  statsSummary = [],
  onPrimaryAction,
  primaryActionLabel = 'Play Again 🔄',
  secondaryAction,
  className = '',
}: RewardCelebrationProps) {
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null)
  const [animatedXp, setAnimatedXp] = useState(0)
  const [starsVisible, setStarsVisible] = useState(false)

  const isNewlyAwarded = Boolean(rewardStatus?.awarded && !rewardStatus?.alreadyClaimed)
  const targetXp = rewardStatus?.xpAwarded || 0
  const targetStars = rewardStatus?.starsAwarded || 0
  const isStreakIncremented = Boolean(rewardStatus?.streakIncremented)
  const currentStreak = rewardStatus?.currentStreak || 1

  // Focus primary action on mount for accessibility
  useEffect(() => {
    primaryButtonRef.current?.focus()
  }, [])

  // Audio cues and count-up animation
  useEffect(() => {
    if (isNewlyAwarded) {
      sfxService.play('victory_fanfare')
      const starTimer = setTimeout(() => {
        setStarsVisible(true)
        sfxService.play('star_pop')
      }, 350)

      return () => clearTimeout(starTimer)
    } else {
      setStarsVisible(true)
    }
  }, [isNewlyAwarded])

  // Count-up animation for XP
  useEffect(() => {
    if (!isNewlyAwarded || targetXp <= 0) {
      setAnimatedXp(targetXp)
      return
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setAnimatedXp(targetXp)
      return
    }

    let start = 0
    const duration = 750
    const stepTime = 25
    const totalSteps = duration / stepTime
    const increment = targetXp / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= targetXp) {
        setAnimatedXp(targetXp)
        clearInterval(timer)
      } else {
        setAnimatedXp(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isNewlyAwarded, targetXp])

  // Screen reader accessible announcement string
  const srAnnouncement = isNewlyAwarded
    ? `Congratulations! You earned ${targetXp} XP and ${targetStars} Stars.${isStreakIncremented ? ` Daily streak increased to ${currentStreak} days!` : ''}`
    : rewardStatus?.alreadyClaimed
      ? 'Quest completed! Rewards for this activity were already claimed earlier.'
      : 'Quest completed! Great job!'

  return (
    <div
      className={`reward-celebration ${className}`.trim()}
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: '2rem 1.25rem',
        borderRadius: '1.25rem',
        backgroundColor: 'var(--surface, #ffffff)',
        overflow: 'hidden',
      }}
      role="region"
      aria-label="Activity Completion Celebration"
    >
      {/* Visual celebration particle canvas (disabled under reduced motion) */}
      {isNewlyAwarded ? <CelebrationParticles /> : null}

      {/* Accessible Polite Screen-Reader Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* Header & Message */}
      <div style={{ position: 'relative', zIndex: 6 }}>
        <h4
          style={{
            fontSize: '1.6rem',
            margin: '0 0 0.5rem',
            fontWeight: 800,
            color: 'var(--text-heading, #1e1b4b)',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: '1.05rem',
            margin: '0 0 1.5rem',
            color: 'var(--text-muted, #6b6893)',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        {/* Accuracy and Stats Bar */}
        {accuracy !== undefined || statsSummary.length > 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            {accuracy !== undefined ? (
              <div
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.85rem',
                  backgroundColor: 'var(--surface-alt, #f8f7ff)',
                  border: '1px solid var(--border, rgba(108, 92, 231, 0.12))',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #6b6893)', fontWeight: 600 }}>
                  Accuracy
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading, #1e1b4b)' }}>
                  {accuracy}%
                </div>
              </div>
            ) : null}

            {statsSummary.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.85rem',
                  backgroundColor: 'var(--surface-alt, #f8f7ff)',
                  border: '1px solid var(--border, rgba(108, 92, 231, 0.12))',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #6b6893)', fontWeight: 600 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading, #1e1b4b)' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Reward Badges / Claim Status */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {rewardStatus?.alreadyClaimed ? (
            <span
              className="card-pill"
              style={{
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                color: '#475569',
                border: '1px solid #cbd5e1',
                padding: '0.45rem 1rem',
                fontSize: '0.92rem',
                fontWeight: 600,
              }}
            >
              ✓ Rewards already claimed for this quest
            </span>
          ) : isNewlyAwarded ? (
            <>
              {/* XP Pill */}
              <div
                className="card-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(108, 92, 231, 0.12)',
                  color: 'var(--accent, #6c5ce7)',
                  border: '1.5px solid var(--accent, #6c5ce7)',
                  padding: '0.45rem 1.1rem',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(108, 92, 231, 0.18)',
                }}
              >
                <span aria-hidden="true">✨</span>
                <span>+{animatedXp} XP</span>
              </div>

              {/* Stars Pill */}
              <div
                className="card-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: '#b45309',
                  border: '1.5px solid #f59e0b',
                  padding: '0.45rem 1.1rem',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                  transform: starsVisible ? 'scale(1)' : 'scale(0.8)',
                  opacity: starsVisible ? 1 : 0,
                  transition: 'all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <span aria-hidden="true">🌟</span>
                <span>+{targetStars} Stars</span>
              </div>

              {/* Daily Streak Ignition Pill */}
              {isStreakIncremented ? (
                <div
                  className="card-pill"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(234, 88, 12, 0.12)',
                    color: '#c2410c',
                    border: '1.5px solid #ea580c',
                    padding: '0.45rem 1.1rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)',
                  }}
                >
                  <span aria-hidden="true">🔥</span>
                  <span>Streak: {currentStreak} Days!</span>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {secondaryAction ? (
            <button
              type="button"
              className="button button-outline"
              onClick={secondaryAction.onClick}
              style={{ minWidth: '130px', padding: '0.65rem 1.25rem' }}
            >
              {secondaryAction.label}
            </button>
          ) : null}

          <button
            ref={primaryButtonRef}
            type="button"
            className="button button-primary"
            onClick={onPrimaryAction}
            style={{
              minWidth: '150px',
              padding: '0.65rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(108, 92, 231, 0.28)',
            }}
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  )
})
