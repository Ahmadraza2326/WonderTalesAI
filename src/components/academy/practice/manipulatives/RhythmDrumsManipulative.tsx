import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface RhythmDrumsManipulativeProps {
  tempo?: number
  targetCadence?: string
  interactive?: boolean
  onCadenceComplete?: (cadence: string) => void
  onTargetReached?: () => void
}

export const RhythmDrumsManipulative: React.FC<RhythmDrumsManipulativeProps> = ({
  tempo = 90,
  targetCadence = 'piano_to_forte',
  interactive = true,
  onCadenceComplete,
  onTargetReached,
}) => {
  const [playedBeats, setPlayedBeats] = useState<string[]>([])
  const [activePad, setActivePad] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  const drumPads = [
    { id: 'piano', label: 'p (Piano)', desc: 'Soft Gentle Beat', icon: '🎵', color: '#38bdf8', aura: 'rgba(56, 189, 248, 0.3)' },
    { id: 'mezzo', label: 'mf (Mezzo-Forte)', desc: 'Medium Energy Beat', icon: '🥁', color: '#a855f7', aura: 'rgba(168, 85, 247, 0.3)' },
    { id: 'forte', label: 'f (Forte)', desc: 'Booming Loud Blast!', icon: '💥', color: '#f43f5e', aura: 'rgba(244, 63, 94, 0.4)' },
  ]

  const handlePadTap = (padId: string) => {
    if (!interactive) return
    setActivePad(padId)
    setTimeout(() => setActivePad(null), 250)

    if (padId === 'piano') {
      sfxService.play('card_flip')
      HapticsService.light()
    } else if (padId === 'mezzo') {
      sfxService.play('star_pop')
      HapticsService.medium()
    } else {
      sfxService.play('victory_fanfare')
      HapticsService.heavy()
    }

    const nextBeats = [...playedBeats, padId].slice(-4)
    setPlayedBeats(nextBeats)

    const sequenceStr = nextBeats.join('_')
    onCadenceComplete?.(sequenceStr)

    // Check if target goal is met (e.g. played piano then forte, or any 3 beats played)
    const hasPiano = nextBeats.includes('piano')
    const hasForte = nextBeats.includes('forte')

    if (!isCompleted && ((targetCadence === 'piano_to_forte' && hasPiano && hasForte) || nextBeats.length >= 3)) {
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
        border: isCompleted ? '2px solid #10b981' : '2px solid rgba(168, 85, 247, 0.4)',
        boxShadow: isCompleted ? '0 12px 32px rgba(16, 185, 129, 0.3)' : '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header & Cadence Tracker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🥁</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Rhythm Studio • {tempo} BPM
          </span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: isCompleted ? '#10b981' : '#a855f7' }}>
          {isCompleted ? '✓ Dynamic Sequence Mastered!' : 'Tap Piano ➔ Forte'}
        </div>
      </div>

      {/* Dynamic Drum Pads Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          width: '100%',
        }}
      >
        {drumPads.map((pad) => {
          const isActive = activePad === pad.id
          return (
            <button
              key={pad.id}
              type="button"
              onClick={() => handlePadTap(pad.id)}
              disabled={!interactive}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '20px 12px',
                borderRadius: '20px',
                border: `2px solid ${pad.color}`,
                backgroundColor: isActive ? pad.color : 'rgba(30, 41, 59, 0.7)',
                boxShadow: isActive ? `0 0 24px ${pad.color}` : `0 4px 14px ${pad.aura}`,
                transform: isActive ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: interactive ? 'pointer' : 'default',
                color: '#ffffff',
              }}
            >
              <span style={{ fontSize: '28px' }}>{pad.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 800 }}>{pad.label}</span>
              <span style={{ fontSize: '11px', color: '#cbd5e1', opacity: 0.85, textAlign: 'center' }}>
                {pad.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Beat History Sequence */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '4px',
          padding: '8px 16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(2, 6, 23, 0.6)',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>Sequence:</span>
        {playedBeats.length === 0 ? (
          <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Tap pads above to play</span>
        ) : (
          playedBeats.map((b, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '12px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: b === 'piano' ? '#0284c7' : b === 'mezzo' ? '#7c3aed' : '#e11d48',
                color: '#ffffff',
              }}
            >
              {b.toUpperCase()}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
