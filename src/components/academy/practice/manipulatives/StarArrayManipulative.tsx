import React, { useState, useEffect } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

export interface StarArrayManipulativeProps {
  initialRows?: number
  initialCols?: number
  targetRows?: number
  targetCols?: number
  interactive?: boolean
  onTargetReached?: () => void
  className?: string
  style?: React.CSSProperties
}

/**
 * ORBis Star Array Manipulative (Phase J - Gold Standard Learning Instrument)
 * Implements Bruner's Enactive-Iconic-Symbolic progression for array multiplication.
 * Features magnetic snap slots, spring physics, skip-counting chimes, and emergent equation notation.
 */
export const StarArrayManipulative: React.FC<StarArrayManipulativeProps> = ({
  initialRows = 1,
  initialCols = 4,
  targetRows = 3,
  targetCols = 4,
  interactive = true,
  onTargetReached,
  className = '',
  style,
}) => {
  const [rows, setRows] = useState(initialRows)
  const [cols] = useState(initialCols)
  const [activeStarHover, setActiveStarHover] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)

  const currentTotal = rows * cols
  const targetTotal = targetRows * targetCols
  const isTargetAchieved = rows === targetRows

  useEffect(() => {
    if (isTargetAchieved && !solved) {
      setSolved(true)
      sfxService.play('star_pop')
      HapticsService.success()
      onTargetReached?.()
    }
  }, [isTargetAchieved, solved, onTargetReached])

  const handleAddRow = () => {
    if (!interactive || rows >= targetRows) return
    const nextRows = rows + 1
    setRows(nextRows)

    // Pentatonic chime harmonic based on row index (1=C5, 2=E5, 3=G5)
    sfxService.playRuneTone(nextRows)
    HapticsService.medium()
  }

  const handleRemoveRow = () => {
    if (!interactive || rows <= 1) return
    setRows(rows - 1)
    sfxService.play('mistake_soft')
    HapticsService.light()
  }

  return (
    <div
      className={`orbis-star-array-manipulative ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '560px',
        padding: '24px',
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        border: `2px solid ${isTargetAchieved ? '#10b981' : 'rgba(56, 189, 248, 0.4)'}`,
        borderRadius: '24px',
        boxShadow: isTargetAchieved
          ? '0 0 36px rgba(16, 185, 129, 0.4)'
          : '0 0 24px rgba(56, 189, 248, 0.2)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
      aria-label={`Star Array with ${rows} rows of ${cols} stars. Total: ${currentTotal}`}
    >
      {/* 1. Header & Stage Status */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#38bdf8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '4px',
          }}
        >
          {isTargetAchieved ? '✨ ARRAY SYNCHRONIZED ✨' : '⚡ STAR ARRAY WORKSPACE'}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
          {rows} {rows === 1 ? 'Row' : 'Rows'} of {cols} Star Crystals
        </div>
      </div>

      {/* 2. Interactive Star Grid Canvas */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '18px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '18px',
          border: '1px dashed rgba(56, 189, 248, 0.3)',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: targetRows }).map((_, rowIndex) => {
          const isRowActive = rowIndex < rows
          const isRowTarget = rowIndex === rows

          return (
            <div
              key={rowIndex}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                borderRadius: '14px',
                backgroundColor: isRowActive
                  ? 'rgba(56, 189, 248, 0.12)'
                  : 'rgba(30, 41, 59, 0.25)',
                border: isRowActive
                  ? '1.5px solid rgba(56, 189, 248, 0.5)'
                  : isRowTarget
                  ? '1.5px dashed #f59e0b'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              {/* Row Tag Label */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: isRowActive ? '#38bdf8' : '#64748b',
                  minWidth: '60px',
                }}
              >
                Row {rowIndex + 1}
              </span>

              {/* Stars in Row */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {Array.from({ length: cols }).map((_, colIndex) => {
                  const starIndex = rowIndex * cols + colIndex
                  return (
                    <button
                      key={colIndex}
                      type="button"
                      disabled={!interactive}
                      onMouseEnter={() => setActiveStarHover(starIndex)}
                      onMouseLeave={() => setActiveStarHover(null)}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: isRowActive
                          ? 'rgba(56, 189, 248, 0.2)'
                          : 'rgba(15, 23, 42, 0.5)',
                        border: isRowActive
                          ? '2px solid #38bdf8'
                          : '1px dashed rgba(255, 255, 255, 0.2)',
                        boxShadow: isRowActive
                          ? '0 0 16px rgba(56, 189, 248, 0.6)'
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: interactive ? 'pointer' : 'default',
                        transform:
                          activeStarHover === starIndex && isRowActive
                            ? 'scale(1.18) rotate(12deg)'
                            : 'scale(1)',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                      aria-label={`Star at Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                    >
                      {/* Bespoke SVG Star (Zero Emojis) */}
                      {isRowActive ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <polygon
                            points="12,2 15,8.5 22,9.5 17,14.5 18.5,21.5 12,18 5.5,21.5 7,14.5 2,9.5 9,8.5"
                            fill="url(#starGold)"
                            stroke="#f59e0b"
                            strokeWidth="1.2"
                          />
                          <defs>
                            <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Row Subtotal */}
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: isRowActive ? '#fde047' : '#475569',
                  minWidth: '40px',
                  textAlign: 'right',
                }}
              >
                {isRowActive ? `+${cols}` : '...'}
              </span>
            </div>
          )
        })}
      </div>

      {/* 3. Interactive Row Addition / Subtraction Controls */}
      {interactive && (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleRemoveRow}
            disabled={rows <= 1}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: rows <= 1 ? 'rgba(30, 41, 59, 0.5)' : 'rgba(239, 68, 68, 0.2)',
              border: `1.5px solid ${rows <= 1 ? '#475569' : '#ef4444'}`,
              color: rows <= 1 ? '#64748b' : '#fca5a5',
              fontWeight: 700,
              fontSize: '14px',
              cursor: rows <= 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            - Remove Row
          </button>

          <button
            type="button"
            onClick={handleAddRow}
            disabled={rows >= targetRows}
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background:
                rows >= targetRows
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '15px',
              boxShadow: '0 4px 20px rgba(56, 189, 248, 0.4)',
              cursor: rows >= targetRows ? 'default' : 'pointer',
              transform: rows >= targetRows ? 'scale(1)' : 'scale(1.02)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {rows >= targetRows ? '✨ Star Array Complete!' : '+ Add Equal Row of 4'}
          </button>
        </div>
      )}

      {/* 4. Bruner Symbolic Emergence Box */}
      <div
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: '16px',
          backgroundColor: isTargetAchieved
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(56, 189, 248, 0.08)',
          border: `1px solid ${isTargetAchieved ? '#10b981' : 'rgba(56, 189, 248, 0.3)'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Repeated Addition Line */}
        <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>
          Repeated Addition:{' '}
          <span style={{ color: '#f8fafc', fontWeight: 800 }}>
            {Array.from({ length: rows }).map(() => cols).join(' + ')} = {currentTotal}
          </span>
        </div>

        {/* Emergent Multiplication Equation */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: 900,
            color: isTargetAchieved ? '#10b981' : '#38bdf8',
            letterSpacing: '0.04em',
            transition: 'all 0.3s ease',
          }}
        >
          {rows} × {cols} = {currentTotal}
        </div>
      </div>
    </div>
  )
}
