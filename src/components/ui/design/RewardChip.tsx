import React from 'react'
import { AnimatedIcon } from './AnimatedIcon'

export interface RewardChipProps {
  type: 'xp' | 'stars' | 'creatures' | 'stardust'
  amount: number | string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
  style?: React.CSSProperties
}

export const RewardChip: React.FC<RewardChipProps> = ({
  type,
  amount,
  size = 'md',
  animated = false,
  className = '',
  style,
}) => {
  const getTheme = () => {
    switch (type) {
      case 'stars':
        return {
          icon: 'star' as const,
          color: '#fbbf24',
          bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)',
          border: 'rgba(245, 158, 11, 0.4)',
          glow: 'rgba(245, 158, 11, 0.3)',
          label: 'Stars',
        }
      case 'creatures':
        return {
          icon: 'biome' as const,
          color: '#10b981',
          bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)',
          border: 'rgba(16, 185, 129, 0.4)',
          glow: 'rgba(16, 185, 129, 0.3)',
          label: 'Creatures',
        }
      case 'stardust':
        return {
          icon: 'sparkle' as const,
          color: '#a855f7',
          bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(126, 34, 206, 0.15) 100%)',
          border: 'rgba(168, 85, 247, 0.4)',
          glow: 'rgba(168, 85, 247, 0.3)',
          label: 'Stardust',
        }
      case 'xp':
      default:
        return {
          icon: 'crystal' as const,
          color: '#38bdf8',
          bg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(2, 132, 199, 0.15) 100%)',
          border: 'rgba(56, 189, 248, 0.4)',
          glow: 'rgba(56, 189, 248, 0.3)',
          label: 'XP',
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '4px 10px',
          fontSize: '0.8125rem',
          iconSize: 14,
          minHeight: '28px',
        }
      case 'lg':
        return {
          padding: '8px 18px',
          fontSize: '1.125rem',
          iconSize: 22,
          minHeight: '44px',
        }
      case 'md':
      default:
        return {
          padding: '6px 14px',
          fontSize: '0.9375rem',
          iconSize: 17,
          minHeight: '34px',
        }
    }
  }

  const theme = getTheme()
  const sizeStyles = getSizeStyles()

  return (
    <span
      className={`orbis-reward-chip ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        boxShadow: `0 4px 14px ${theme.glow}`,
        borderRadius: 'var(--radius-pill, 9999px)',
        color: '#ffffff',
        fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
        fontWeight: 'var(--font-weight-extrabold, 800)',
        userSelect: 'none',
        lineHeight: 1,
        ...sizeStyles,
        ...style,
      }}
    >
      <AnimatedIcon
        kind={theme.icon}
        size={sizeStyles.iconSize}
        color={theme.color}
        animate={animated ? 'sparkle' : 'none'}
      />
      <span>
        {amount} <span style={{ color: theme.color, fontSize: '0.85em' }}>{type === 'xp' ? 'XP' : ''}</span>
      </span>
    </span>
  )
}
