import React from 'react'
import type { AcademicRealm } from '../../../types/learningUniverse'
import { REALM_STYLE_CONFIGS } from '../../../styles/academyTokens'

export interface InteractionSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  realm?: AcademicRealm
  minHeight?: string | number
  showGridGuide?: boolean
  className?: string
  style?: React.CSSProperties
}

export const InteractionSurface: React.FC<InteractionSurfaceProps> = ({
  children,
  realm,
  minHeight = '320px',
  showGridGuide = false,
  className = '',
  style,
  ...props
}) => {
  const config = realm ? REALM_STYLE_CONFIGS[realm] : undefined

  return (
    <div
      {...props}
      className={`orbis-interaction-surface ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        background: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1.5px solid ${config ? config.borderAura : 'rgba(56, 189, 248, 0.3)'}`,
        borderRadius: 'var(--radius-panel, 24px)',
        boxShadow: config
          ? `0 16px 40px rgba(0, 0, 0, 0.6), inset 0 0 25px ${config.glowColor}`
          : '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(56, 189, 248, 0.15)',
        padding: 'var(--spacing-lg, 24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Background Grid Guide Pattern if requested */}
      {showGridGuide && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(${config ? config.baseColor : '#38bdf8'}33 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />
      )}

      {/* Surface content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  )
}
