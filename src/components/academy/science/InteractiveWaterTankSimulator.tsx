import React, { useState } from 'react'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

export interface TestableObject {
  id: string
  name: string
  icon: string
  densityScore: number // < 1.0 floats, > 1.0 sinks
  explanation: string
}

const DEFAULT_OBJECTS: TestableObject[] = [
  { id: 'wood_log', name: 'Wooden Log', icon: '🪵', densityScore: 0.6, explanation: 'Wood is less dense than water, so it bobs on the surface!' },
  { id: 'river_pebble', name: 'River Pebble', icon: '🪨', densityScore: 2.6, explanation: 'Solid stone is denser than water, so it sinks to the bottom!' },
  { id: 'hollow_bottle', name: 'Hollow Bottle', icon: '🍾', densityScore: 0.3, explanation: 'The trapped air makes the bottle super buoyant!' },
  { id: 'golden_key', name: 'Golden Key', icon: '🗝️', densityScore: 4.2, explanation: 'Heavy brass metal sinks fast!' },
  { id: 'feather', name: 'Soft Feather', icon: '🪶', densityScore: 0.1, explanation: 'Lightweight feathers float effortlessly!' },
]

interface InteractiveWaterTankSimulatorProps {
  onObjectTested?: (objectId: string, didFloat: boolean) => void
}

export const InteractiveWaterTankSimulator: React.FC<InteractiveWaterTankSimulatorProps> = ({
  onObjectTested,
}) => {
  const [tankObjects, setTankObjects] = useState<TestableObject[]>([DEFAULT_OBJECTS[0]])
  const [activeMessage, setActiveMessage] = useState<string>('Tap any object below to drop it into the water tank!')

  const handleDropObject = (obj: TestableObject) => {
    sfxService.play('star_pop')
    HapticsService.medium()

    const didFloat = obj.densityScore < 1.0
    const nextObjects = [...tankObjects.filter((o) => o.id !== obj.id), obj]
    setTankObjects(nextObjects)
    setActiveMessage(obj.explanation)

    onObjectTested?.(obj.id, didFloat)
  }

  const handleClearTank = () => {
    sfxService.play('card_flip')
    setTankObjects([])
    setActiveMessage('Tank emptied! Select an object to test.')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '2px solid rgba(56, 189, 248, 0.5)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        maxWidth: '640px',
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
          <span style={{ fontSize: '24px' }}>🔬</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Interactive Buoyancy Water Tank
          </span>
        </div>
        <button
          type="button"
          onClick={handleClearTank}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Clear Tank ↺
        </button>
      </div>

      {/* Dynamic Water Tank Container */}
      <div
        style={{
          width: '100%',
          height: '200px',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(2, 132, 199, 0.3) 30%, rgba(3, 105, 161, 0.8) 100%)',
          border: '3px solid #38bdf8',
          boxShadow: 'inset 0 0 30px rgba(56, 189, 248, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Surface Waterline */}
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #a5f3fc 50%, #38bdf8 100%)',
            boxShadow: '0 0 12px #38bdf8',
          }}
        />

        {/* Objects Inside Tank */}
        {tankObjects.map((obj) => {
          const isFloating = obj.densityScore < 1.0
          return (
            <div
              key={obj.id}
              style={{
                position: 'relative',
                bottom: isFloating ? '95px' : '5px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: isFloating ? 'bounce 2s infinite alternate' : 'none',
              }}
            >
              <span style={{ fontSize: '38px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
                {obj.icon}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: isFloating ? '#6ee7b7' : '#fca5a5',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${isFloating ? '#10b981' : '#ef4444'}`,
                }}
              >
                {isFloating ? 'Floats! 🌊' : 'Sinks! ⚓'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Real-time Discovery Explanation Banner */}
      <div
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '14px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#e2e8f0',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        💡 {activeMessage}
      </div>

      {/* Object Selection Tray */}
      <div style={{ width: '100%' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', display: 'block', marginBottom: '8px' }}>
          Tap an Object to Test Its Buoyancy:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {DEFAULT_OBJECTS.map((obj) => (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleDropObject(obj)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '14px',
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <span style={{ fontSize: '26px' }}>{obj.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                {obj.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
