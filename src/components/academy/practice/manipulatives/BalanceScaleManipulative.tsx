import React, { useState } from 'react'

interface BalanceScaleManipulativeProps {
  targetWeight?: number
  currentWeight?: number
  onWeightChange?: (totalWeight: number) => void
}

export const BalanceScaleManipulative: React.FC<BalanceScaleManipulativeProps> = ({
  targetWeight = 10,
  onWeightChange,
}) => {
  const [weightsOnPan, setWeightsOnPan] = useState<number[]>([])

  const totalWeight = weightsOnPan.reduce((acc, w) => acc + w, 0)
  const isBalanced = totalWeight === targetWeight

  const handleAddWeight = (val: number) => {
    const updated = [...weightsOnPan, val]
    setWeightsOnPan(updated)
    onWeightChange?.(updated.reduce((acc, w) => acc + w, 0))
  }

  const handleRemoveWeight = (index: number) => {
    const updated = weightsOnPan.filter((_, i) => i !== index)
    setWeightsOnPan(updated)
    onWeightChange?.(updated.reduce((acc, w) => acc + w, 0))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '14px 0' }}>
      {/* Visual Balance Scale */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          width: '100%',
          maxWidth: '380px',
          height: '140px',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          border: isBalanced ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          position: 'relative',
        }}
      >
        {/* Left Pan (Target) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Target Mass</span>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.25)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              fontWeight: 800,
            }}
          >
            ⚖️ {targetWeight} kg
          </div>
        </div>

        {/* Balance Fulcrum Indicator */}
        <div style={{ fontSize: '24px', alignSelf: 'center', color: isBalanced ? '#10b981' : '#f59e0b' }}>
          {isBalanced ? '⚖️ EQUAL' : totalWeight < targetWeight ? '◀️ LIGHTER' : '▶️ HEAVIER'}
        </div>

        {/* Right Pan (User Placement) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Your Mass</span>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: isBalanced ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.25)',
              border: isBalanced ? '1px solid #10b981' : '1px solid #f59e0b',
              color: isBalanced ? '#10b981' : '#fbbf24',
              fontWeight: 800,
            }}
          >
            {totalWeight} kg
          </div>
        </div>
      </div>

      {/* Weights On Pan Chips */}
      {weightsOnPan.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {weightsOnPan.map((w, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveWeight(idx)}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '11px',
                cursor: 'pointer',
              }}
              title="Click to remove"
            >
              +{w}kg ✕
            </button>
          ))}
        </div>
      )}

      {/* Weights Add Tray */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Add Weight:</span>
        {[1, 2, 5].map((w) => (
          <button
            key={w}
            onClick={() => handleAddWeight(w)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            +{w} kg
          </button>
        ))}
      </div>
    </div>
  )
}
