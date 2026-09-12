import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'
import { narrationDirector } from '../../../../services/audio/narrationDirector'

interface PhonemeTileManipulativeProps {
  availableTiles?: Array<{ id: string; sound: string; runeIcon?: string }>
  targetWord?: string
  slotCount?: number
  interactive?: boolean
  onWordComplete?: (word: string) => void
}

export const PhonemeTileManipulative: React.FC<PhonemeTileManipulativeProps> = ({
  availableTiles = [
    { id: 'c', sound: 'C', runeIcon: '⚡' },
    { id: 'a', sound: 'A', runeIcon: '🌟' },
    { id: 't', sound: 'T', runeIcon: '🛡️' },
    { id: 's', sound: 'S', runeIcon: '🌊' },
    { id: 'p', sound: 'P', runeIcon: '🔮' },
  ],
  targetWord = 'CAT',
  slotCount = 3,
  interactive = true,
  onWordComplete,
}) => {
  const [slottedTiles, setSlottedTiles] = useState<Array<{ id: string; sound: string } | null>>(
    () => Array(slotCount).fill(null)
  )

  const handleTileClick = (tile: { id: string; sound: string }) => {
    if (!interactive) return

    // Find first empty slot
    const emptyIndex = slottedTiles.findIndex((s) => s === null)
    if (emptyIndex === -1) return

    sfxService.play('star_pop')
    HapticsService.light()

    // Speak phoneme sound
    narrationDirector.speak(tile.sound.toLowerCase())

    const next = [...slottedTiles]
    next[emptyIndex] = tile
    setSlottedTiles(next)

    // Check if all slots filled
    const currentWord = next.map((t) => t?.sound || '').join('')
    if (next.every((t) => t !== null)) {
      if (currentWord.toUpperCase() === targetWord.toUpperCase()) {
        sfxService.play('match_success')
        HapticsService.success()
        narrationDirector.speak(`Great word: ${currentWord}!`)
        onWordComplete?.(currentWord)
      } else {
        sfxService.play('card_flip')
      }
    }
  }

  const handleClearSlot = (index: number) => {
    if (!interactive || slottedTiles[index] === null) return
    sfxService.play('card_flip')
    HapticsService.light()
    const next = [...slottedTiles]
    next[index] = null
    setSlottedTiles(next)
  }

  const handleClearAll = () => {
    sfxService.play('card_flip')
    setSlottedTiles(Array(slotCount).fill(null))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '24px 20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '2px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>📜</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Runic Word Altar: <strong style={{ color: '#fbbf24' }}>{targetWord}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reset Slots ↺
        </button>
      </div>

      {/* Target Word Slots */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
          padding: '16px',
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          borderRadius: '20px',
          border: '2px dashed rgba(245, 158, 11, 0.3)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {slottedTiles.map((tile, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleClearSlot(idx)}
            aria-label={`Slot ${idx + 1} ${tile ? tile.sound : 'Empty'}`}
            style={{
              width: '64px',
              height: '72px',
              borderRadius: '16px',
              border: tile ? '2px solid #f59e0b' : '2px dashed rgba(255, 255, 255, 0.2)',
              backgroundColor: tile ? 'rgba(245, 158, 11, 0.25)' : 'rgba(30, 41, 59, 0.5)',
              color: '#f8fafc',
              fontSize: '28px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: tile ? 'pointer' : 'default',
              boxShadow: tile ? '0 0 16px rgba(245, 158, 11, 0.5)' : 'none',
              transform: tile ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {tile?.sound || '_'}
          </button>
        ))}
      </div>

      {/* Available Runic Sound Tiles Tray */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
          Tap Sound Runes to Assemble:
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {availableTiles.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTileClick(t)}
              style={{
                width: '52px',
                height: '58px',
                borderRadius: '14px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                color: '#f8fafc',
                fontSize: '22px',
                fontWeight: 800,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>{t.sound}</span>
              {t.runeIcon && <span style={{ fontSize: '10px', opacity: 0.7 }}>{t.runeIcon}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
