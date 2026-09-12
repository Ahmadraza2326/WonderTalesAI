import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface ColorPaletteManipulativeProps {
  primaryColor?: string
  secondaryColor?: string
  targetBlendedColor?: string
  interactive?: boolean
  onColorChange?: (color: string) => void
  onTargetReached?: () => void
}

export const ColorPaletteManipulative: React.FC<ColorPaletteManipulativeProps> = ({
  primaryColor = '#38bdf8',
  secondaryColor = '#ef4444',
  targetBlendedColor,
  interactive = true,
  onColorChange,
  onTargetReached,
}) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [blendRatio, setBlendRatio] = useState<number>(50)
  const [isCompleted, setIsCompleted] = useState(false)

  const spectralClasses = [
    { class: 'O/B', temp: '30,000 K', desc: 'Hottest Blue Supergiant', color: '#38bdf8', icon: '🔵' },
    { class: 'A', temp: '10,000 K', desc: 'Pure White Star', color: '#f8fafc', icon: '⚪' },
    { class: 'G', temp: '5,800 K', desc: 'Yellow Star (Like our Sun)', color: '#fde047', icon: '☀️' },
    { class: 'K', temp: '4,500 K', desc: 'Warm Orange Dwarf', color: '#fb923c', icon: '🟠' },
    { class: 'M', temp: '3,000 K', desc: 'Cool Red Giant', color: '#ef4444', icon: '🔴' },
  ]

  const handleSelectClass = (cls: string, color: string) => {
    if (!interactive) return
    setSelectedClass(cls)
    sfxService.play('star_pop')
    HapticsService.medium()

    onColorChange?.(color)

    if (!isCompleted) {
      setIsCompleted(true)
      sfxService.play('match_success')
      HapticsService.success()
      onTargetReached?.()
    }
  }

  const handleSliderChange = (val: number) => {
    if (!interactive) return
    setBlendRatio(val)
    sfxService.play('card_flip')

    if (!isCompleted && (val > 40 && val < 60)) {
      setIsCompleted(true)
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
        gap: '16px',
        padding: '24px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: isCompleted ? '2px solid #10b981' : '2px solid rgba(56, 189, 248, 0.4)',
        boxShadow: isCompleted ? '0 12px 32px rgba(16, 185, 129, 0.3)' : '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '580px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🌈</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Spectral Star Calibrator
          </span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: isCompleted ? '#10b981' : '#38bdf8' }}>
          {isCompleted ? '✓ Spectrograph Calibrated!' : 'Tap a Spectral Star Class'}
        </div>
      </div>

      {/* Spectral Classes Selection */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
          gap: '8px',
          width: '100%',
        }}
      >
        {spectralClasses.map((item) => {
          const isSelected = selectedClass === item.class
          return (
            <button
              key={item.class}
              type="button"
              onClick={() => handleSelectClass(item.class, item.color)}
              disabled={!interactive}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 6px',
                borderRadius: '16px',
                border: isSelected ? `2px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                boxShadow: isSelected ? `0 0 16px ${item.color}` : 'none',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: interactive ? 'pointer' : 'default',
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: item.color }}>
                Class {item.class}
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.temp}</span>
            </button>
          )
        })}
      </div>

      {/* Spectral Dispersion Slider */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
          <span>🔵 Ultra-Hot Wavelength (Blue)</span>
          <span>Cool Thermal Radiation (Red) 🔴</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={blendRatio}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          disabled={!interactive}
          style={{
            width: '100%',
            accentColor: '#38bdf8',
            cursor: interactive ? 'pointer' : 'default',
          }}
        />
      </div>
    </div>
  )
}
