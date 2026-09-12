import React, { memo, useCallback } from 'react'
import { sfxService } from '../../services/audio/sfxService'

export type ActivityDifficulty = 'easy' | 'medium' | 'hard'

interface DifficultyToggleProps {
  difficulty: ActivityDifficulty
  onChange: (difficulty: ActivityDifficulty) => void
  disabled?: boolean
  className?: string
}

const DIFFICULTIES: { id: ActivityDifficulty; label: string; icon: string }[] = [
  { id: 'easy', label: 'Easy', icon: '🌱' },
  { id: 'medium', label: 'Medium', icon: '🌟' },
  { id: 'hard', label: 'Hard', icon: '⚡' },
]

export const DifficultyToggle = memo(function DifficultyToggle({
  difficulty,
  onChange,
  disabled = false,
  className = '',
}: DifficultyToggleProps) {
  const handleSelect = useCallback(
    (level: ActivityDifficulty) => {
      if (disabled || level === difficulty) return
      sfxService.play('card_flip')
      onChange(level)
    },
    [disabled, difficulty, onChange]
  )

  return (
    <div
      className={`difficulty-toggle ${className}`.trim()}
      role="group"
      aria-label="Select Game Difficulty"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem',
        borderRadius: '9999px',
        backgroundColor: 'var(--surface-alt, #f8f7ff)',
        border: '1px solid var(--border, rgba(108, 92, 231, 0.14))',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {DIFFICULTIES.map(({ id, label, icon }) => {
        const isSelected = difficulty === id

        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(id)}
            aria-pressed={isSelected}
            aria-label={`Difficulty: ${label}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.75rem',
              fontSize: '0.84rem',
              fontWeight: isSelected ? 700 : 600,
              color: isSelected ? 'var(--text-heading, #1e1b4b)' : 'var(--text-muted, #6b6893)',
              backgroundColor: isSelected ? 'var(--surface, #ffffff)' : 'transparent',
              border: isSelected
                ? '1px solid var(--border-focus, rgba(108, 92, 231, 0.45))'
                : '1px solid transparent',
              borderRadius: '9999px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxShadow: isSelected ? '0 2px 8px rgba(108, 92, 231, 0.15)' : 'none',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 160ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              outline: 'none',
              userSelect: 'none',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '0.9em' }}>
              {icon}
            </span>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
})
