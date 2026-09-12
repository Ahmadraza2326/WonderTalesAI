import React from 'react'
import type { Essence } from '../../../types/games/creatureLab'
import { PRIME_ESSENCES } from '../../../services/games/creatureLabEngine'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface EssenceShelfProps {
  selectedEssenceIds: string[]
  onSelectEssence: (essence: Essence) => void
  disabled?: boolean
}

export const EssenceShelf: React.FC<EssenceShelfProps> = ({
  selectedEssenceIds,
  onSelectEssence,
  disabled = false,
}) => {
  const isFull = selectedEssenceIds.length >= 3

  const handleDragStart = (e: React.DragEvent, essence: Essence) => {
    if (disabled) return
    HapticsService.light()
    e.dataTransfer.setData('text/plain', essence.id)
    e.dataTransfer.effectAllowed = 'copy'
    sfxService.play('essence_pickup')
  }

  const handleTap = (essence: Essence) => {
    if (disabled) return
    HapticsService.light()
    sfxService.play('essence_pickup')
    onSelectEssence(essence)
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '16px 12px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 27, 75, 0.9) 100%)',
        borderTop: '2px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '24px 24px 0 0',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
      aria-label="Alchemical Essence Shelf"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 8px',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>
          🔮 Starlight Essences
        </span>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          {isFull ? 'Cauldron is full! Stir above.' : 'Tap or drag to add to cauldron'}
        </span>
      </div>

      {/* 5 Essences Grid / Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '12px',
          justifyItems: 'center',
        }}
      >
        {PRIME_ESSENCES.map((essence) => {
          const isSelected = selectedEssenceIds.includes(essence.id)

          return (
            <button
              key={essence.id}
              type="button"
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, essence)}
              onClick={() => handleTap(essence)}
              disabled={disabled}
              aria-label={`${essence.name}: ${essence.shortDescription}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '120px',
                minHeight: '100px',
                padding: '12px 8px',
                borderRadius: '16px',
                background: isSelected
                  ? `linear-gradient(135deg, ${essence.glowColor} 0%, rgba(30, 27, 75, 0.8) 100%)`
                  : 'rgba(30, 41, 59, 0.65)',
                border: isSelected
                  ? `2px solid ${essence.primaryColor}`
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected
                  ? `0 0 16px ${essence.glowColor}, 0 4px 8px rgba(0,0,0,0.3)`
                  : '0 4px 6px rgba(0,0,0,0.2)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)'
              }}
              onMouseLeave={(e) => {
                if (!disabled) e.currentTarget.style.transform = 'translateY(0) scale(1)'
              }}
            >
              {/* Essence Jar / Crystal Glyph */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: essence.glowColor,
                  border: `1.5px solid ${essence.primaryColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '6px',
                  boxShadow: `0 0 12px ${essence.glowColor}`,
                }}
              >
                {essence.glyph}
              </div>

              {/* Essence Name */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isSelected ? essence.primaryColor : '#e2e8f0',
                  textAlign: 'center',
                  lineHeight: '1.2',
                }}
              >
                {essence.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
