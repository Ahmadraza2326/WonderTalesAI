import React from 'react'
import type { AcademicRealm } from '../../../types/learningUniverse'
import { REALM_STYLE_CONFIGS } from '../../../styles/academyTokens'

export interface OrbitalProgressProps {
  value: number // 0 to 100
  size?: number
  strokeWidth?: number
  realm?: AcademicRealm
  color?: string
  glowColor?: string
  trackColor?: string
  children?: React.ReactNode
  showLabel?: boolean
  className?: string
  style?: React.CSSProperties
}

export const OrbitalProgress: React.FC<OrbitalProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  realm,
  color,
  glowColor,
  trackColor = 'rgba(255, 255, 255, 0.1)',
  children,
  showLabel = true,
  className = '',
  style,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))
  const realmConfig = realm ? REALM_STYLE_CONFIGS[realm] : undefined

  const activeColor = color || (realmConfig ? realmConfig.baseColor : '#38bdf8')
  const activeGlow = glowColor || (realmConfig ? realmConfig.glowColor : 'rgba(56, 189, 248, 0.5)')

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference

  return (
    <div
      className={`orbis-orbital-progress ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${clampedValue}%`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        userSelect: 'none',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${activeGlow})`,
            transition: 'stroke-dashoffset 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Center slot content */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {children ? (
          children
        ) : showLabel ? (
          <span
            style={{
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontWeight: 'var(--font-weight-extrabold, 800)',
              fontSize: `${size * 0.22}px`,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            {Math.round(clampedValue)}%
          </span>
        ) : null}
      </div>
    </div>
  )
}
