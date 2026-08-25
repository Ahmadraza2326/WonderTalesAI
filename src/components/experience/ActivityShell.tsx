import { memo, type ReactNode } from 'react'
import type { CognitiveDomain } from '../../types/experience'
import { CognitiveSkillBadge } from './CognitiveSkillBadge'
import { DifficultyToggle, type ActivityDifficulty } from './DifficultyToggle'

export interface ActivityShellProps {
  title: string
  emoji: string
  tagline?: string
  primaryDomain?: CognitiveDomain
  secondaryDomains?: CognitiveDomain[]
  difficulty?: ActivityDifficulty
  onDifficultyChange?: (difficulty: ActivityDifficulty) => void
  supportsDifficulty?: boolean
  difficultyDisabled?: boolean
  progressInfo?: string
  isPlayable?: boolean
  unavailableReason?: string
  headerRight?: ReactNode
  children: ReactNode
  className?: string
}

export const ActivityShell = memo(function ActivityShell({
  title,
  emoji,
  tagline,
  primaryDomain,
  secondaryDomains = [],
  difficulty = 'easy',
  onDifficultyChange,
  supportsDifficulty = true,
  difficultyDisabled = false,
  progressInfo,
  isPlayable = true,
  unavailableReason,
  headerRight,
  children,
  className = '',
}: ActivityShellProps) {
  // Graceful degradation when Story DNA lacks sufficient data
  if (!isPlayable) {
    return (
      <section
        className={`activity-shell activity-shell--unavailable card-panel ${className}`.trim()}
        aria-label={`${title} Unavailable`}
        style={{
          position: 'relative',
          padding: '1.75rem 1.5rem',
          borderRadius: '1.5rem',
          backgroundColor: 'var(--surface-card, #ffffff)',
          border: '1px solid var(--border, rgba(108, 92, 231, 0.12))',
          boxShadow: 'var(--shadow-md, 0 10px 30px rgba(108, 92, 231, 0.08))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.6rem' }} aria-hidden="true">
            {emoji}
          </span>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{title}</h3>
        </div>
        <p
          style={{
            marginTop: '0.85rem',
            marginBottom: 0,
            color: 'var(--text-muted, #6b6893)',
            fontSize: '0.95rem',
            lineHeight: 1.5,
          }}
        >
          {unavailableReason || 'This activity is not available for this story yet.'}
        </p>
      </section>
    )
  }

  return (
    <section
      className={`activity-shell card-panel ${className}`.trim()}
      aria-label={title}
      style={{
        position: 'relative',
        padding: '1.5rem',
        borderRadius: '1.5rem',
        backgroundColor: 'var(--surface-card, #ffffff)',
        border: '1px solid var(--border, rgba(108, 92, 231, 0.14))',
        boxShadow: 'var(--shadow-md, 0 10px 30px rgba(108, 92, 231, 0.08))',
        transition: 'box-shadow 200ms ease',
      }}
    >
      {/* Activity Floating Header */}
      <div
        className="activity-shell__header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <div>
          {/* Title & Emoji */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.6rem' }} aria-hidden="true">
              {emoji}
            </span>
            <h3
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-heading, #1e1b4b)',
                letterSpacing: '-0.015em',
              }}
            >
              {title}
            </h3>

            {/* Cognitive Domain Badges */}
            {primaryDomain ? <CognitiveSkillBadge domain={primaryDomain} /> : null}
            {secondaryDomains.map((dom) => (
              <CognitiveSkillBadge key={dom} domain={dom} isSecondary />
            ))}
          </div>

          {/* Tagline */}
          {tagline ? (
            <p
              style={{
                margin: '0.35rem 0 0',
                fontSize: '0.9rem',
                color: 'var(--text-muted, #6b6893)',
                lineHeight: 1.45,
              }}
            >
              {tagline}
            </p>
          ) : null}
        </div>

        {/* Right Header Controls: Difficulty Selector, Progress, Custom Slot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
          }}
        >
          {headerRight}

          {/* Progress Indicator */}
          {progressInfo ? (
            <span
              className="card-pill"
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: '0.85rem',
                backgroundColor: 'var(--surface-alt, #f8f7ff)',
                color: 'var(--text-heading, #1e1b4b)',
                border: '1px solid var(--border, rgba(108, 92, 231, 0.14))',
              }}
            >
              {progressInfo}
            </span>
          ) : null}

          {/* Difficulty Toggle */}
          {supportsDifficulty && onDifficultyChange ? (
            <DifficultyToggle
              difficulty={difficulty}
              onChange={onDifficultyChange}
              disabled={difficultyDisabled}
            />
          ) : null}
        </div>
      </div>

      {/* Activity Game Canvas */}
      <div className="activity-shell__body">{children}</div>
    </section>
  )
})
