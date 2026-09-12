import React, { useState } from 'react'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export interface OrbCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  icon?: string
  badge?: string
  accentColor?: string
  glowColor?: string
  interactive?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export const OrbCard: React.FC<OrbCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  badge,
  accentColor = '#a855f7',
  glowColor = 'rgba(168, 85, 247, 0.4)',
  interactive = true,
  onClick,
  className = '',
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseEnter = () => {
    if (!interactive) return
    setIsHovered(true)
    sfxService.play('card_flip')
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setIsHovered(false)
    setIsPressed(false)
  }

  const handleClick = () => {
    if (!interactive || !onClick) return
    HapticsService.light()
    sfxService.play('star_pop')
    onClick()
  }

  return (
    <div
      className={`orbis-orb-card ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => interactive && setIsPressed(true)}
      onMouseUp={() => interactive && setIsPressed(false)}
      onClick={handleClick}
      role={interactive && onClick ? 'button' : undefined}
      tabIndex={interactive && onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
      style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '24px',
        background: 'rgba(30, 27, 75, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isHovered ? `2px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isHovered
          ? `0 16px 40px rgba(0, 0, 0, 0.45), 0 0 28px ${glowColor}`
          : '0 8px 30px rgba(0, 0, 0, 0.25)',
        transform: isPressed
          ? 'scale(0.97) translateY(2px)'
          : isHovered
          ? 'translateY(-4px) scale(1.01)'
          : 'translateY(0) scale(1)',
        cursor: interactive && onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Ambient Glow Orb in background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: isHovered ? 0.8 : 0.35,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />
      {children ? (
        children
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            {icon && <span style={{ fontSize: '2.5rem' }}>{icon}</span>}
            {badge && (
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {title && <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{title}</h3>}
          {subtitle && <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.4 }}>{subtitle}</p>}
        </div>
      )}
    </div>
  )
}
