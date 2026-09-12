import React from 'react'
import type { MasteryTier } from '../../../types/academy'
import { AnimatedIcon } from './AnimatedIcon'

export interface SkillCrystalProps {
  tier?: MasteryTier
  masteryPercentage?: number
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  interactive?: boolean
  showPercentage?: boolean
  glow?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export const SkillCrystal: React.FC<SkillCrystalProps> = ({
  tier = 'not_started',
  masteryPercentage = 0,
  size = 'md',
  interactive = false,
  showPercentage = false,
  glow = true,
  onClick,
  className = '',
  style,
}) => {
  const getDimension = () => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'sm':
        return 36
      case 'lg':
        return 72
      case 'xl':
        return 96
      case 'md':
      default:
        return 52
    }
  }

  const getTierColors = () => {
    switch (tier) {
      case 'mastered':
        return {
          primary: '#fbbf24',
          secondary: '#d97706',
          glow: 'rgba(251, 191, 36, 0.65)',
          facets: ['#fef3c7', '#fde68a', '#f59e0b', '#b45309'],
        }
      case 'proficient':
        return {
          primary: '#38bdf8',
          secondary: '#0284c7',
          glow: 'rgba(56, 189, 248, 0.55)',
          facets: ['#e0f2fe', '#bae6fd', '#0284c7', '#0369a1'],
        }
      case 'developing':
        return {
          primary: '#10b981',
          secondary: '#047857',
          glow: 'rgba(16, 185, 129, 0.55)',
          facets: ['#d1fae5', '#a7f3d0', '#10b981', '#065f46'],
        }
      case 'practicing':
        return {
          primary: '#a855f7',
          secondary: '#7e22ce',
          glow: 'rgba(168, 85, 247, 0.5)',
          facets: ['#f3e8ff', '#e9d5ff', '#a855f7', '#6b21a8'],
        }
      case 'learning':
        return {
          primary: '#f97316',
          secondary: '#c2410c',
          glow: 'rgba(249, 115, 22, 0.45)',
          facets: ['#ffedd5', '#fed7aa', '#f97316', '#9a3412'],
        }
      case 'not_started':
      default:
        return {
          primary: '#64748b',
          secondary: '#334155',
          glow: 'rgba(100, 116, 139, 0.25)',
          facets: ['#94a3b8', '#64748b', '#475569', '#1e293b'],
        }
    }
  }

  const dim = getDimension()
  const colors = getTierColors()

  return (
    <div
      onClick={onClick}
      className={`orbis-skill-crystal ${interactive ? 'orbis-skill-crystal--interactive' : ''} ${className}`}
      role="img"
      aria-label={`Skill mastery crystal: ${tier}, ${masteryPercentage}%`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: `${dim}px`,
        height: `${dim}px`,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{
          filter: glow ? `drop-shadow(0 0 ${dim * 0.2}px ${colors.glow})` : undefined,
          transition: 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 240ms ease',
        }}
      >
        {/* Top Facet */}
        <polygon points="50,6 88,32 50,48 12,32" fill={colors.facets[0]} opacity="0.95" />
        {/* Left Upper Facet */}
        <polygon points="12,32 50,48 50,94 12,32" fill={colors.facets[2]} opacity="0.9" />
        {/* Right Upper Facet */}
        <polygon points="88,32 50,48 50,94 88,32" fill={colors.facets[1]} opacity="0.92" />
        {/* Deep Bottom Facet */}
        <polygon points="50,48 50,94 88,32" fill={colors.facets[3]} opacity="0.4" />
        {/* Specular Highlight */}
        <polygon points="50,12 72,28 50,38 28,28" fill="#ffffff" opacity="0.45" />
      </svg>

      {tier === 'mastered' && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
          }}
        >
          <AnimatedIcon kind="sparkle" size={dim * 0.38} color="#fbbf24" animate="sparkle" />
        </span>
      )}

      {showPercentage && (
        <span
          style={{
            position: 'absolute',
            bottom: '-18px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
            fontWeight: 'var(--font-weight-bold, 700)',
            color: colors.primary,
            textShadow: `0 0 8px ${colors.glow}`,
          }}
        >
          {masteryPercentage}%
        </span>
      )}
    </div>
  )
}
