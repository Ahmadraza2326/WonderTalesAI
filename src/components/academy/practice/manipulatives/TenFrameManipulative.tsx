import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface TenFrameManipulativeProps {
  initialCount?: number
  targetCount?: number
  interactive?: boolean
  onCountChange?: (count: number) => void
  onTargetReached?: () => void
}

export const TenFrameManipulative: React.FC<TenFrameManipulativeProps> = ({
  initialCount = 0,
  targetCount,
  interactive = true,
  onCountChange,
  onTargetReached,
}) => {
  const [filledIndices, setFilledIndices] = useState<Set<number>>(() => {
    const s = new Set<number>()
    for (let i = 0; i < Math.min(10, initialCount); i++) {
      s.add(i)
    }
    return s
  })

  const handleToggleSlot = (index: number) => {
    if (!interactive) return

    const next = new Set(filledIndices)
    if (next.has(index)) {
      next.delete(index)
      sfxService.play('card_flip')
      HapticsService.light()
    } else {
      next.add(index)
      sfxService.play('star_pop')
      HapticsService.medium()
    }

    setFilledIndices(next)
    onCountChange?.(next.size)

    if (targetCount !== undefined && next.size === targetCount) {
      sfxService.play('match_success')
      HapticsService.success()
      onTargetReached?.()
    }
  }

  const count = filledIndices.size
  const emptyCount = 10 - count
  const topRowCount = Array.from(filledIndices).filter((idx) => idx < 5).length
  const bottomRowCount = Array.from(filledIndices).filter((idx) => idx >= 5).length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '2px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '540px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Visual Header & Counter Subitizing Summary */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>⭐</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Ten-Frame: <strong style={{ color: '#38bdf8' }}>{count}</strong> / 10
          </span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
          {count >= 5 ? `(5 + ${count - 5})` : `(${count} stars)`} • {emptyCount} empty
        </div>
      </div>

      {/* The 2x5 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '10px',
          width: '100%',
          backgroundColor: 'rgba(2, 6, 23, 0.8)',
          padding: '16px',
          borderRadius: '18px',
          border: '2px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => {
          const isFilled = filledIndices.has(index)
          const isTopRow = index < 5

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleToggleSlot(index)}
              disabled={!interactive}
              aria-label={`Slot ${index + 1} of 10 ${isFilled ? 'Filled' : 'Empty'}`}
              style={{
                aspectRatio: '1',
                borderRadius: '14px',
                border: isFilled
                  ? '2px solid #38bdf8'
                  : '2px dashed rgba(255, 255, 255, 0.25)',
                backgroundColor: isFilled
                  ? 'rgba(56, 189, 248, 0.25)'
                  : isTopRow
                  ? 'rgba(30, 41, 59, 0.4)'
                  : 'rgba(15, 23, 42, 0.4)',
                boxShadow: isFilled ? '0 0 16px rgba(56, 189, 248, 0.5)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                cursor: interactive ? 'pointer' : 'default',
                transform: isFilled ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {isFilled ? '⭐' : <span style={{ opacity: 0.2, fontSize: '16px' }}>⚪</span>}
            </button>
          )
        })}
      </div>

      {/* Row breakdown labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          fontSize: '12px',
          fontWeight: 700,
          color: '#38bdf8',
          padding: '0 8px',
        }}
      >
        <span>Top Row: {topRowCount} / 5</span>
        <span>Bottom Row: {bottomRowCount} / 5</span>
      </div>
    </div>
  )
}
