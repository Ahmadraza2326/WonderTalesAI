import React, { useState } from 'react'
import type { Essence, CauldronState } from '../../../types/games/creatureLab'
import { getHarmonicFluidColor } from '../../../services/games/creatureLabEngine'
import { sfxService } from '../../../services/audio/sfxService'

interface CauldronStageProps {
  selectedEssences: Essence[]
  cauldronState: CauldronState
  onStir: () => void
  onDropEssence: (essenceId: string) => void
  onRemoveEssence: (index: number) => void
  onReset: () => void
}

export const CauldronStage: React.FC<CauldronStageProps> = ({
  selectedEssences,
  cauldronState,
  onStir,
  onDropEssence,
  onRemoveEssence,
  onReset,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const essenceIds = selectedEssences.map((e) => e.id)
  const fluidColors = getHarmonicFluidColor(essenceIds)
  const isReadyToBrew = selectedEssences.length >= 2 && cauldronState === 'ready_to_brew'
  const isStirring = cauldronState === 'stirring'

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    if (!isDragOver) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const essenceId = e.dataTransfer.getData('text/plain')
    if (essenceId) {
      onDropEssence(essenceId)
    }
  }

  const handleStirClick = () => {
    if (isReadyToBrew) {
      sfxService.play('liquid_mix')
      sfxService.play('cauldron_bubble')
      onStir()
    }
  }

  const maxSlots = 3

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        padding: '16px',
        userSelect: 'none',
      }}
      aria-label="Magical Alchemical Cauldron"
    >
      {/* Active Essence Slots Badge Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          padding: '8px 16px',
          borderRadius: '9999px',
          background: 'rgba(30, 27, 75, 0.75)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0e7ff', letterSpacing: '0.02em' }}>
          Cauldron ({selectedEssences.length}/{maxSlots}):
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map((idx) => {
            const essence = selectedEssences[idx]
            return essence ? (
              <button
                key={idx}
                type="button"
                onClick={() => onRemoveEssence(idx)}
                title={`Remove ${essence.name}`}
                aria-label={`Remove ${essence.name} from cauldron`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  background: essence.glowColor,
                  border: `1.5px solid ${essence.primaryColor}`,
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  minHeight: '44px',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>{essence.glyph}</span>
                <span>{essence.name}</span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>✕</span>
              </button>
            ) : (
              <div
                key={idx}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(168, 85, 247, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(224, 231, 255, 0.4)',
                  fontSize: '14px',
                }}
              >
                +
              </div>
            )
          })}
        </div>
        {selectedEssences.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px',
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Cauldron Visual Frame */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          width: '280px',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isReadyToBrew ? 'pointer' : 'default',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDragOver ? 'scale(1.06)' : isStirring ? 'scale(1.03) rotate(-1deg)' : 'scale(1)',
        }}
        onClick={handleStirClick}
        tabIndex={isReadyToBrew ? 0 : undefined}
        role={isReadyToBrew ? 'button' : undefined}
        aria-label={isReadyToBrew ? 'Stir the cauldron to brew' : 'Cauldron'}
        onKeyDown={(e) => {
          if (isReadyToBrew && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleStirClick()
          }
        }}
      >
        {/* Ambient Pulsing Cauldron Glow */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '180px',
            borderRadius: '50%',
            background: fluidColors.glow,
            filter: 'blur(32px)',
            opacity: selectedEssences.length > 0 ? 0.9 : 0.4,
            transition: 'background 0.5s ease, opacity 0.5s ease',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Cauldron SVG Art */}
        <svg
          viewBox="0 0 280 240"
          style={{
            width: '100%',
            height: '100%',
            zIndex: 1,
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))',
          }}
        >
          <defs>
            {/* Cauldron Iron Gradient */}
            <linearGradient id="cauldronIron" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Cauldron Gold Rim */}
            <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Dynamic Swirling Liquid Gradient */}
            <radialGradient id="liquidGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={fluidColors.secondary} />
              <stop offset="70%" stopColor={fluidColors.primary} />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
          </defs>

          {/* Cauldron Legs */}
          <path d="M 50 200 Q 40 230 30 235 L 55 235 Q 65 210 75 195 Z" fill="url(#cauldronIron)" />
          <path d="M 230 200 Q 240 230 250 235 L 225 235 Q 215 210 205 195 Z" fill="url(#cauldronIron)" />
          <path d="M 130 215 Q 140 238 140 240 L 150 240 Q 150 238 150 215 Z" fill="url(#cauldronIron)" />

          {/* Cauldron Body */}
          <path
            d="M 40 85 C 30 140 50 210 140 215 C 230 210 250 140 240 85 Z"
            fill="url(#cauldronIron)"
            stroke="#475569"
            strokeWidth="3"
          />

          {/* Ornate Star Rune on Pot */}
          <path
            d="M 140 135 L 144 147 L 156 147 L 147 154 L 150 166 L 140 159 L 130 166 L 133 154 L 124 147 L 136 147 Z"
            fill={fluidColors.primary}
            opacity="0.85"
            style={{
              transition: 'fill 0.5s ease',
              filter: `drop-shadow(0 0 6px ${fluidColors.primary})`,
            }}
          />

          {/* Cauldron Interior Fluid Surface (Oval) */}
          <ellipse
            cx="140"
            cy="85"
            rx="92"
            ry="30"
            fill="url(#liquidGlow)"
            stroke="url(#goldRim)"
            strokeWidth="4"
          />

          {/* Animated Rising Fluid Bubbles */}
          <circle cx="120" cy="80" r="5" fill="#ffffff" opacity="0.6">
            <animate attributeName="cy" values="90;70;65" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="155" cy="82" r="7" fill="#ffffff" opacity="0.5">
            <animate attributeName="cy" values="95;72;62" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="88" r="4" fill="#ffffff" opacity="0.7">
            <animate attributeName="cy" values="92;75;68" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.7;0" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Cauldron Gold Top Rim (Ring) */}
          <ellipse
            cx="140"
            cy="82"
            rx="96"
            ry="32"
            fill="none"
            stroke="url(#goldRim)"
            strokeWidth="5"
          />
        </svg>

        {/* Dynamic Stirring Water Swirl Ring */}
        {isStirring && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              width: '120px',
              height: '50px',
              borderRadius: '50%',
              border: `3px dashed #ffffff`,
              boxShadow: `0 0 16px ${fluidColors.primary}`,
              animation: 'spin 1.2s linear infinite',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}
      </div>

      {/* Action / Guidance Prompts */}
      <div style={{ marginTop: '16px', textAlign: 'center', minHeight: '52px' }}>
        {selectedEssences.length === 0 && (
          <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', fontWeight: 500 }}>
            ✨ Drag or tap <strong>2 or 3 magical essences</strong> into the cauldron!
          </p>
        )}

        {selectedEssences.length === 1 && (
          <p style={{ margin: 0, fontSize: '14px', color: '#fbbf24', fontWeight: 600 }}>
            🪄 Added {selectedEssences[0].name}! Choose <strong>1 more essence</strong> to create a mixture.
          </p>
        )}

        {isReadyToBrew && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleStirClick}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 28px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(236, 72, 153, 0.6), 0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '48px',
                transform: 'scale(1.02)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              aria-label="Stir the cauldron now"
            >
              <span style={{ fontSize: '18px' }}>🌀</span>
              <span>STIR THE CAULDRON!</span>
              <span style={{ fontSize: '18px' }}>✨</span>
            </button>
            {selectedEssences.length === 2 && (
              <span style={{ fontSize: '12px', color: '#cbd5e1', opacity: 0.8 }}>
                💡 (Optional: Add 1 more essence for secret 3-part recipes!)
              </span>
            )}
          </div>
        )}

        {isStirring && (
          <p style={{ margin: 0, fontSize: '15px', color: '#f472b6', fontWeight: 700, animation: 'pulse 1s infinite' }}>
            🌟 The starlight essences are bonding together...
          </p>
        )}
      </div>
    </div>
  )
}
