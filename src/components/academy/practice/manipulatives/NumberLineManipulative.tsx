import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface NumberLineManipulativeProps {
  startNumber?: number
  minNumber?: number
  maxNumber?: number
  targetNumber?: number
  jumpSteps?: number
  interactive?: boolean
  onPositionChange?: (position: number) => void
  onTargetReached?: () => void
}

export const NumberLineManipulative: React.FC<NumberLineManipulativeProps> = ({
  startNumber = 0,
  minNumber = 0,
  maxNumber,
  targetNumber,
  jumpSteps = 1,
  interactive = true,
  onPositionChange,
  onTargetReached,
}) => {
  const [currentPosition, setCurrentPosition] = useState<number>(startNumber)

  const effectiveMax = maxNumber !== undefined
    ? Math.max(maxNumber, targetNumber ?? 0)
    : Math.max(10, targetNumber ?? 10, startNumber ?? 0)

  const totalPoints = effectiveMax - minNumber + 1
  const numbers = Array.from({ length: totalPoints }, (_, i) => minNumber + i)

  const handleJump = (delta: number) => {
    if (!interactive) return
    const nextPos = Math.max(minNumber, Math.min(effectiveMax, currentPosition + delta))
    if (nextPos === currentPosition) return

    sfxService.play('card_flip')
    HapticsService.medium()

    setCurrentPosition(nextPos)
    onPositionChange?.(nextPos)

    if (targetNumber !== undefined && nextPos === targetNumber) {
      sfxService.play('match_success')
      HapticsService.success()
      onTargetReached?.()
    }
  }

  const handleDirectSelect = (num: number) => {
    if (!interactive || num === currentPosition) return
    sfxService.play('star_pop')
    HapticsService.light()
    setCurrentPosition(num)
    onPositionChange?.(num)

    if (targetNumber !== undefined && num === targetNumber) {
      sfxService.play('match_success')
      HapticsService.success()
      onTargetReached?.()
    }
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
        background: 'rgba(15, 23, 42, 0.75)',
        border: '2px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '680px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header & Status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🐸</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Number Line: Stone <strong style={{ color: '#c084fc' }}>{currentPosition}</strong>
          </span>
        </div>
        {targetNumber !== undefined && (
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#a855f7' }}>
            Target: 🎯 Stone {targetNumber}
          </div>
        )}
      </div>

      {/* Number Line Visual Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: '30px 10px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Connecting Axis Bar */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            right: '20px',
            top: '52px',
            height: '6px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
            borderRadius: '9999px',
            zIndex: 0,
          }}
        />

        {numbers.map((num) => {
          const isCurrent = num === currentPosition
          const isTarget = num === targetNumber

          return (
            <div
              key={num}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                zIndex: 1,
              }}
            >
              {/* Frog / Avatar on current spot */}
              {isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-32px',
                    fontSize: '26px',
                    animation: 'bounce 1s infinite alternate',
                  }}
                >
                  🐸
                </div>
              )}

              {/* Stepping Stone Button */}
              <button
                type="button"
                onClick={() => handleDirectSelect(num)}
                disabled={!interactive}
                aria-label={`Stone ${num}`}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent
                    ? '#a855f7'
                    : isTarget
                    ? 'rgba(234, 179, 8, 0.3)'
                    : 'rgba(30, 41, 59, 0.9)',
                  border: isCurrent
                    ? '3px solid #ffffff'
                    : isTarget
                    ? '2px dashed #eab308'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  color: isCurrent ? '#ffffff' : '#e2e8f0',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: interactive ? 'pointer' : 'default',
                  boxShadow: isCurrent ? '0 0 16px #a855f7' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {num}
              </button>
            </div>
          )
        })}
      </div>

      {/* Visual Jump Controls */}
      {interactive && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => handleJump(-jumpSteps)}
            disabled={currentPosition <= minNumber}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '16px',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.25)',
              color: '#fca5a5',
              fontSize: '15px',
              fontWeight: 800,
              cursor: currentPosition <= minNumber ? 'not-allowed' : 'pointer',
              opacity: currentPosition <= minNumber ? 0.4 : 1,
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)',
            }}
          >
            <span style={{ fontSize: '20px' }}>⬅️</span>
            <span>Back (-{jumpSteps})</span>
          </button>

          <button
            type="button"
            onClick={() => handleJump(jumpSteps)}
            disabled={currentPosition >= effectiveMax}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '16px',
              border: '2px solid #10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              fontSize: '15px',
              fontWeight: 800,
              cursor: currentPosition >= effectiveMax ? 'not-allowed' : 'pointer',
              opacity: currentPosition >= effectiveMax ? 0.4 : 1,
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)',
            }}
          >
            <span>Hop Forward (+{jumpSteps})</span>
            <span style={{ fontSize: '20px' }}>➔ 🐸</span>
          </button>
        </div>
      )}
    </div>
  )
}
