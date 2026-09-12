import React from 'react'
import type { AcademicRealm } from '../../../types/learningUniverse'
import { REALM_STYLE_CONFIGS } from '../../../styles/academyTokens'
import { AnimatedIcon, type IconKind } from './AnimatedIcon'

export interface RealmBadgeProps {
  realm: AcademicRealm
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  customLabel?: string
  className?: string
  style?: React.CSSProperties
}

export const RealmBadge: React.FC<RealmBadgeProps> = ({
  realm,
  size = 'md',
  showIcon = true,
  customLabel,
  className = '',
  style,
}) => {
  const config = REALM_STYLE_CONFIGS[realm]

  const getIconKind = (): IconKind => {
    switch (realm) {
      case 'mathematics':
        return 'citadel'
      case 'science':
        return 'biome'
      case 'english':
        return 'rune'
      case 'reading':
        return 'scroll'
      case 'computer_science':
        return 'circuit'
      case 'logic_puzzles':
        return 'enigma'
      case 'creativity_arts':
        return 'radiance'
      case 'general_knowledge':
      default:
        return 'globe'
    }
  }

  const getSizeStyles = (): { padding: string; fontSize: string; iconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          padding: '3px 8px',
          fontSize: '0.75rem',
          iconSize: 13,
        }
      case 'lg':
        return {
          padding: '6px 16px',
          fontSize: '0.9375rem',
          iconSize: 18,
        }
      case 'md':
      default:
        return {
          padding: '4px 12px',
          fontSize: '0.8125rem',
          iconSize: 15,
        }
    }
  }

  const sizeStyles = getSizeStyles()

  return (
    <span
      className={`orbis-realm-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(2, 6, 23, 0.75)',
        border: `1px solid ${config.borderAura}`,
        boxShadow: `0 2px 10px ${config.glowColor}`,
        borderRadius: 'var(--radius-pill, 9999px)',
        color: config.baseColor,
        fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
        fontWeight: 'var(--font-weight-bold, 700)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        userSelect: 'none',
        ...style,
      }}
    >
      {showIcon && (
        <AnimatedIcon
          kind={getIconKind()}
          size={sizeStyles.iconSize}
          color={config.baseColor}
        />
      )}
      <span>{customLabel || config.name}</span>
    </span>
  )
}
