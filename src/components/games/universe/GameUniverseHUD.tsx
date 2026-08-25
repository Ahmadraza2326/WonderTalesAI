import React from 'react'
import { sfxService } from '../../../services/audio/sfxService'

interface GameUniverseHUDProps {
  gameTitle: string
  gameIcon: string
  childName?: string
  stardustCount?: number
  onBack?: () => void
  customAction?: React.ReactNode
}

export const GameUniverseHUD: React.FC<GameUniverseHUDProps> = ({
  gameTitle,
  gameIcon,
  childName = 'Explorer',
  stardustCount = 0,
  onBack,
  customAction,
}) => {
  const isMuted = sfxService.isMuted()

  const handleToggleSound = () => {
    sfxService.toggleMuted()
  }

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.75)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
        position: 'sticky',
        top: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
      aria-label="Game Universe HUD"
    >
      {/* Left Navigation Block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#ffffff',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.15s ease',
            }}
            aria-label="Return to Game Universe Hub"
          >
            <span style={{ fontSize: '16px' }}>🪐</span>
            <span>Universe</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }} role="img" aria-hidden="true">
            {gameIcon}
          </span>
          <div>
            <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              {gameTitle}
            </h1>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
              Player: <strong style={{ color: '#e2e8f0' }}>{childName}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right Stats & Actions Block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Stardust Balance Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            background: 'rgba(236, 72, 153, 0.15)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            fontSize: '13px',
            fontWeight: 800,
            color: '#f472b6',
          }}
          title="Crafting Stardust Balance"
          aria-label={`${stardustCount} Stardust`}
        >
          <span>✨</span>
          <span>{stardustCount}</span>
        </div>

        {/* Custom Game Actions (e.g. Almanac Button) */}
        {customAction}

        {/* Audio Mute Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          style={{
            width: '40px',
            height: '40px',
            minHeight: '44px',
            minWidth: '44px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  )
}
