import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'
import { AnimatedIcon } from '../../ui/design/AnimatedIcon'
import type { ChildAdventureProgress } from '../../../services/progressionService'
import { getNextLevelThreshold } from '../../../services/progressionService'

export interface CentralOrbisCitadelProps {
  adventureProgress?: ChildAdventureProgress
  onSelectMilestones?: () => void
  className?: string
  style?: React.CSSProperties
  isOpen?: boolean
  onClose?: () => void
}

export const CentralOrbisCitadel: React.FC<CentralOrbisCitadelProps> = ({
  adventureProgress,
  onSelectMilestones,
  className = '',
  style,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleClose = () => {
    HapticsService.light()
    sfxService.play('card_flip')
    onClose?.()
  }

  // Keyboard accessibility for modal dismissal
  useEffect(() => {
    if (!isOpen || !onClose) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (isOpen === false) return null

  const childName = adventureProgress?.childName || 'Explorer'
  const childAvatar = adventureProgress?.avatar || '🦁'
  const xp = adventureProgress?.xp || 0
  const level = adventureProgress?.level || 1
  const title = adventureProgress?.explorerTitle || 'Novice Star-Seeker'

  const threshold = getNextLevelThreshold(xp)
  const progressPercent = threshold.progressPercent

  const handleCitadelClick = () => {
    HapticsService.medium()
    sfxService.play('star_pop')
    if (onSelectMilestones) {
      onSelectMilestones()
    } else {
      if (onClose) onClose()
      navigate('/passport')
    }
  }

  const citadelContent = (
    <div
      className={`orbis-central-citadel-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
        margin: '0 auto',
        maxWidth: '480px',
        width: '100%',
        ...style,
      }}
    >
      {/* 1. Golden "ORBis" Luminous Stadium Pill Badge */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          marginBottom: '-8px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid rgba(253, 224, 71, 0.75)',
            borderRadius: '9999px',
            padding: '4px 22px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 20px rgba(253, 224, 71, 0.45), inset 0 0 10px rgba(253, 224, 71, 0.2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
              fontSize: '26px',
              fontWeight: 900,
              letterSpacing: '0.06em',
              background: 'linear-gradient(180deg, #ffffff 0%, #fef08a 35%, #facc15 70%, #ca8a04 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
              display: 'block',
            }}
          >
            ORBis
          </span>
        </div>
      </div>

      {/* 2. Interactive Floating Citadel Diorama */}
      <button
        type="button"
        onClick={handleCitadelClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`ORBis Central Citadel: ${childName}'s Home Base. Level ${level} ${title}, ${xp} XP. Tap to view Explorer Codex.`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          outline: 'none',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isHovered ? 'scale(1.05) translateY(-6px)' : 'scale(1.0)',
          position: 'relative',
          zIndex: 4,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'clamp(240px, 32vw, 340px)',
            height: 'clamp(180px, 24vw, 250px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Volumetric Beacon Golden Aura */}
          <div
            style={{
              position: 'absolute',
              inset: '5%',
              background: 'radial-gradient(circle, rgba(253, 224, 71, 0.45) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 75%)',
              borderRadius: '50%',
              filter: 'blur(28px)',
              opacity: isHovered ? 1 : 0.7,
              transform: isHovered ? 'scale(1.15)' : 'scale(1.0)',
              transition: 'all 0.35s ease',
              pointerEvents: 'none',
            }}
          />

          {/* High-Resolution Citadel Island Artwork */}
          <img
            src="/assets/overworld/citadel_island.png"
            alt="ORBis Central Citadel Floating Beacon Island"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 2,
              mixBlendMode: 'screen',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 86%)',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 86%)',
              filter: isHovered
                ? 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(253, 224, 71, 0.6))'
                : 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6))',
              transition: 'filter 0.3s ease',
            }}
          />
        </div>
      </button>

      {/* 3. Subordinate Player Status Card */}
      <div
        style={{
          marginTop: '-6px',
          position: 'relative',
          zIndex: 6,
          background: 'rgba(10, 14, 40, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(253, 224, 71, 0.5)',
          borderRadius: '9999px',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(253, 224, 71, 0.25)',
          maxWidth: '300px',
          width: '85%',
        }}
      >
        {/* Child Avatar Mini Badge */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            boxShadow: '0 0 8px rgba(253, 224, 71, 0.7)',
            flexShrink: 0,
          }}
        >
          {childAvatar}
        </div>

        {/* Child Info & XP */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {childName} • Lv.{level}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fde047' }}>
              {xp} XP
            </span>
          </div>

          {/* Stardust Progress Tube */}
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(5, progressPercent))}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8 0%, #fde047 100%)',
                borderRadius: '9999px',
                boxShadow: '0 0 8px #fde047',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  // If mounted without onClose, render inline directly
  if (!onClose) {
    return citadelContent
  }

  // Mounted as an independent modal
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="citadel-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.98) 100%)',
          border: '1.5px solid rgba(253, 224, 71, 0.45)',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(253, 224, 71, 0.25)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fde047 0%, #ca8a04 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(253, 224, 71, 0.6)',
              }}
            >
              <AnimatedIcon kind="citadel" size={24} color="#0f172a" />
            </div>
            <div>
              <h2
                id="citadel-modal-title"
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-family-display, Outfit, sans-serif)',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#fef08a',
                }}
              >
                ORBis Central Citadel
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Celestial Headquarters &amp; Explorer Codex
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            ✕
          </button>
        </div>

        {/* Existing Citadel Content */}
        {citadelContent}
      </div>
    </div>
  )
}
