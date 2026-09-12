import React from 'react'

interface FractionManipulativeProps {
  totalParts: number
  selectedParts: number
  onChangeSelectedParts?: (selected: number) => void
  readOnly?: boolean
}

export const FractionManipulative: React.FC<FractionManipulativeProps> = ({
  totalParts = 4,
  selectedParts = 1,
  onChangeSelectedParts,
  readOnly = false,
}) => {
  const parts = Array.from({ length: totalParts }, (_, i) => i + 1)

  const handleTogglePart = (index: number) => {
    if (readOnly || !onChangeSelectedParts) return
    if (selectedParts === index) {
      onChangeSelectedParts(index - 1)
    } else {
      onChangeSelectedParts(index)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', margin: '12px 0' }}>
      {/* Fraction Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 900, color: '#38bdf8' }}>
        <span>Selected:</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <span>{selectedParts}</span>
          <span style={{ borderTop: '2px solid #38bdf8', width: '20px' }} />
          <span>{totalParts}</span>
        </div>
      </div>

      {/* Visual Fraction Bar */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '360px',
          height: '52px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
        }}
      >
        {parts.map((part) => {
          const isSelected = part <= selectedParts
          return (
            <div
              key={part}
              onClick={() => handleTogglePart(part)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
                borderRight: part < totalParts ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                cursor: readOnly ? 'default' : 'pointer',
                color: isSelected ? '#ffffff' : '#64748b',
                fontWeight: 800,
                fontSize: '14px',
                transition: 'background-color 0.2s ease',
              }}
            >
              1/{totalParts}
            </div>
          )
        })}
      </div>
    </div>
  )
}
