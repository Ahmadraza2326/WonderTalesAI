import React from 'react'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export interface NorthStarApexProps {
  onTap?: () => void
  activeQuestTitle?: string
  className?: string
  style?: React.CSSProperties
}

export const NorthStarApex: React.FC<NorthStarApexProps> = ({
  onTap,
  activeQuestTitle = 'Daily Cosmic Guidance',
  className = '',
  style,
}) => {
  const handleClick = () => {
    HapticsService.medium()
    sfxService.play('star_pop')
    if (onTap) onTap()
  }

  return (
    <div
      className={`orbis-northstar-container ${className}`}
      style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`North Star: Daily Guidance. Current quest: ${activeQuestTitle}. Tap to view daily exploration quests.`}
        className="animate-northstar group"
        style={{
          background: 'none',
          border: 'none',
          padding: '4px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          outline: 'none',
          minWidth: '48px',
          minHeight: '48px',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Luminous Star SVG with Radiant Lens Flare */}
        <div style={{ position: 'relative', width: '54px', height: '54px' }}>
          {/* Radial Light Aura Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '84px',
              height: '84px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(254, 240, 138, 0.6) 0%, rgba(251, 191, 36, 0.3) 40%, rgba(245, 158, 11, 0.1) 60%, transparent 75%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              filter: 'blur(6px)',
            }}
          />

          <svg
            viewBox="0 0 64 64"
            width="54"
            height="54"
            style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 0 12px rgba(253, 224, 71, 0.85))' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="northStarGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>

              <radialGradient id="starCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
              </radialGradient>

              <filter id="starBloomGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Primary Compass Star */}
            <path
              d="M32 2 L37 23 L58 24 L41 37 L47 58 L32 45 L17 58 L23 37 L6 24 L27 23 Z"
              fill="url(#northStarGoldGrad)"
              filter="url(#starBloomGlow)"
            />

            {/* Dimensional Inner Facets */}
            <path
              d="M32 8 L35 24 L48 25 L38 34 L42 48 L32 39 L22 48 L26 34 L16 25 L29 24 Z"
              fill="#ffffff"
              opacity="0.85"
            />

            {/* Center Radiant Core */}
            <circle cx="32" cy="32" r="5.5" fill="url(#starCenterGlow)" />
            <circle cx="32" cy="32" r="2.5" fill="#ffffff" />

            {/* Subtle Cross Sparkle Flares */}
            <line x1="32" y1="0" x2="32" y2="64" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <line x1="0" y1="32" x2="64" y2="32" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Luminous Stadium Pill Badge: "• DAILY GUIDANCE" */}
        <div
          style={{
            marginTop: '4px',
            background: 'rgba(10, 14, 40, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(253, 224, 71, 0.65)',
            borderRadius: '9999px',
            padding: '4px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 14px rgba(253, 224, 71, 0.35)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#fde047',
              boxShadow: '0 0 6px #fde047',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontSize: '11px',
              fontWeight: 900,
              color: '#fef08a',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            DAILY GUIDANCE
          </span>
        </div>
      </button>
    </div>
  )
}
