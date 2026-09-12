import React, { useState } from 'react'
import type { AcademicRealm } from '../../../types/learningUniverse'
import { REALM_STYLE_CONFIGS } from '../../../styles/academyTokens'

export type GlassPanelTier = 'hero' | 'card' | 'slot' | 'floating' | 'translucent' | 'grounded' | 'elevated'

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  tier?: GlassPanelTier
  variant?: GlassPanelTier
  realm?: AcademicRealm
  interactive?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  style?: React.CSSProperties
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  tier,
  variant,
  realm,
  interactive = false,
  glow = false,
  padding = 'md',
  className = '',
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const activeTier: GlassPanelTier = tier || variant || 'card'
  const [isHovered, setIsHovered] = useState(false)
  const realmConfig = realm ? REALM_STYLE_CONFIGS[realm] : undefined

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0'
      case 'sm':
        return 'var(--spacing-sm, 12px)'
      case 'lg':
        return 'var(--spacing-lg, 24px)'
      case 'xl':
        return 'var(--spacing-xl, 32px)'
      case 'md':
      default:
        return 'var(--spacing-md, 16px)'
    }
  }

  const getTierStyles = (): React.CSSProperties => {
    const realmSurface = realmConfig ? realmConfig.glassSurface : undefined
    const realmBorder = realmConfig ? realmConfig.borderAura : undefined
    const realmGlow = realmConfig ? realmConfig.glowColor : undefined

    switch (activeTier) {
      case 'hero':
        return {
          background: realmSurface || 'var(--glass-surface-hero, rgba(15, 23, 42, 0.82))',
          backdropFilter: 'var(--glass-backdrop-blur-lg, blur(24px))',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1.5px solid ${realmBorder || 'var(--glass-border-prominent, rgba(255, 255, 255, 0.3))'}`,
          borderRadius: 'var(--radius-panel, 24px)',
          boxShadow: glow || isHovered
            ? `0 24px 60px rgba(0, 0, 0, 0.65), 0 0 35px ${realmGlow || 'rgba(56, 189, 248, 0.3)'}`
            : 'var(--shadow-elevation-hero, 0 24px 60px rgba(0, 0, 0, 0.65))',
        }
      case 'slot':
        return {
          background: 'var(--glass-surface-slot, rgba(2, 6, 23, 0.75))',
          backdropFilter: 'var(--glass-backdrop-blur-sm, blur(8px))',
          WebkitBackdropFilter: 'blur(8px)',
          border: `2px dashed ${realmBorder || 'rgba(56, 189, 248, 0.4)'}`,
          borderRadius: 'var(--radius-card, 16px)',
          boxShadow: isHovered
            ? `0 0 20px ${realmGlow || 'rgba(56, 189, 248, 0.3)'}, inset 0 2px 8px rgba(0, 0, 0, 0.5)`
            : 'inset 0 2px 6px rgba(0, 0, 0, 0.4)',
        }
      case 'floating':
        return {
          background: realmSurface || 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'var(--glass-backdrop-blur-md, blur(16px))',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${realmBorder || 'var(--glass-border-light, rgba(255, 255, 255, 0.18))'}`,
          borderRadius: 'var(--radius-portal, 32px)',
          boxShadow: isHovered
            ? `0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px ${realmGlow || 'rgba(168, 85, 247, 0.35)'}`
            : 'var(--shadow-elevation-floating, 0 16px 36px rgba(0, 0, 0, 0.5))',
        }
      case 'translucent':
        return {
          background: 'var(--glass-surface-translucent, rgba(255, 255, 255, 0.08))',
          backdropFilter: 'var(--glass-backdrop-blur-sm, blur(8px))',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1px solid ${realmBorder || 'var(--glass-border-subtle, rgba(255, 255, 255, 0.1))'}`,
          borderRadius: 'var(--radius-card, 16px)',
          boxShadow: 'none',
        }
      case 'card':
      default:
        return {
          background: realmSurface || 'var(--glass-surface-card, rgba(30, 41, 59, 0.65))',
          backdropFilter: 'var(--glass-backdrop-blur-md, blur(16px))',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${realmBorder || 'var(--glass-border-light, rgba(255, 255, 255, 0.18))'}`,
          borderRadius: 'var(--radius-card, 16px)',
          boxShadow: isHovered
            ? `0 14px 32px rgba(0, 0, 0, 0.45), 0 0 20px ${realmGlow || 'rgba(56, 189, 248, 0.25)'}`
            : 'var(--shadow-elevation-card, 0 10px 25px rgba(0, 0, 0, 0.4))',
        }
    }
  }

  return (
    <div
      {...props}
      onMouseEnter={(e) => {
        if (interactive) setIsHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (interactive) setIsHovered(false)
        onMouseLeave?.(e)
      }}
      className={`orbis-glass-panel ${interactive ? 'orbis-glass-panel--interactive' : ''} ${className}`}
      style={{
        padding: getPadding(),
        position: 'relative',
        transform: interactive && isHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms ease, border-color 240ms ease',
        cursor: interactive ? 'pointer' : 'default',
        color: '#f8fafc',
        ...getTierStyles(),
        ...style,
      }}
    >
      {children}
    </div>
  )
}
