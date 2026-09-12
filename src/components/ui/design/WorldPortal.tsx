import React, { useState } from 'react'
import type { AcademicRealm } from '../../../types/learningUniverse'
import { REALM_STYLE_CONFIGS } from '../../../styles/academyTokens'
import { GlassPanel } from './GlassPanel'
import { AnimatedIcon } from './AnimatedIcon'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export interface WorldPortalProps {
  realm?: AcademicRealm
  title?: string
  subtitle?: string
  totalSkills?: number
  completedSkills?: number
  masteryPercentage?: number
  isLocked?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  icon?: string
  themeGradient?: string
  glowColor?: string
  badgeText?: string
}

export const WorldPortal: React.FC<WorldPortalProps> = ({
  realm,
  title,
  subtitle,
  totalSkills = 0,
  completedSkills = 0,
  masteryPercentage = 0,
  isLocked = false,
  onClick,
  className = '',
  style,
  icon,
  themeGradient,
  glowColor,
  badgeText,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const config = (realm && REALM_STYLE_CONFIGS[realm]) || REALM_STYLE_CONFIGS.mathematics

  const displayTitle = title || config.name
  const displaySubtitle = subtitle || config.loreTitle
  const portalGlow = glowColor || config.glowColor
  const portalBorder = isLocked ? 'rgba(100, 116, 139, 0.3)' : (glowColor || config.borderAura)
  const portalBackground = isLocked
    ? 'rgba(15, 23, 42, 0.85)'
    : (themeGradient || `linear-gradient(145deg, ${config.deepColor}40 0%, ${config.glassSurface} 100%)`)

  const handleClick = () => {
    if (isLocked) {
      sfxService.play('button_click')
      HapticsService.light()
      return
    }
    sfxService.play('card_flip')
    HapticsService.medium()
    onClick?.()
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`orbis-world-portal ${isLocked ? 'orbis-world-portal--locked' : ''} ${className}`}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={`World Portal: ${displayTitle}, ${badgeText || `${completedSkills} of ${totalSkills} skills mastered, ${masteryPercentage}%`}`}
      aria-disabled={isLocked}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-portal, 32px)',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transform: isHovered && !isLocked ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 260ms ease',
        userSelect: 'none',
        ...style,
      }}
    >
      <GlassPanel
        tier="floating"
        realm={realm || 'mathematics'}
        padding="lg"
        glow={isHovered && !isLocked}
        style={{
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          background: portalBackground,
          border: `1.5px solid ${portalBorder}`,
          boxShadow: isHovered && !isLocked
            ? `0 20px 48px rgba(0, 0, 0, 0.65), 0 0 35px ${portalGlow}`
            : '0 12px 30px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Ambient Realm Aura Orb */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: isLocked ? 'rgba(100, 116, 139, 0.15)' : config.glowColor,
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        {/* Header section with Realm Badge & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(2, 6, 23, 0.65)',
              borderRadius: 'var(--radius-pill, 9999px)',
              border: `1px solid ${config.borderAura}`,
            }}
          >
            {icon ? (
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
            ) : (
              <AnimatedIcon
                kind={realm === 'mathematics' ? 'citadel' : realm === 'science' ? 'biome' : realm === 'computer_science' ? 'circuit' : 'scroll'}
                size={18}
                color={config.baseColor}
              />
            )}
            <span
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: 'var(--font-weight-bold, 700)',
                color: config.baseColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {badgeText || config.name}
            </span>
          </div>

          {isLocked ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-pill, 9999px)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}
            >
              <AnimatedIcon kind="lock" size={14} color="#f87171" />
              <span>Locked</span>
            </div>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fbbf24',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                fontWeight: '700',
              }}
            >
              <AnimatedIcon kind="star" size={16} color="#fbbf24" animate={isHovered ? 'sparkle' : 'none'} />
              <span>{masteryPercentage ? `${masteryPercentage}%` : '100% Free'}</span>
            </div>
          )}
        </div>

        {/* Main Title & Lore */}
        <div style={{ marginTop: '16px', marginBottom: '16px', zIndex: 1 }}>
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: '1.375rem',
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontWeight: 'var(--font-weight-extrabold, 800)',
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            {displayTitle}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#94a3b8',
              lineHeight: 1.4,
            }}
          >
            {displaySubtitle}
          </p>
        </div>

        {/* Progress Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
            {completedSkills} / {totalSkills} Skills Mastered
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isLocked ? '#64748b' : config.baseColor,
              fontWeight: '700',
              fontSize: '0.875rem',
            }}
          >
            <span>Enter Realm</span>
            <AnimatedIcon kind="arrow_right" size={16} color={isLocked ? '#64748b' : config.baseColor} />
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
