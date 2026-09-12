import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'

interface ClueItem {
  id: string
  text: string
  icon: string
  isTrue: boolean
}

interface SuspectItem {
  id: string
  name: string
  avatar: string
  trait: string
  isCorrectSolution: boolean
}

interface LogicDeductionManipulativeProps {
  clues?: ClueItem[]
  suspects?: SuspectItem[]
  interactive?: boolean
  onSolutionSelected?: (suspectId: string) => void
}

export const LogicDeductionManipulative: React.FC<LogicDeductionManipulativeProps> = ({
  clues = [
    { id: 'c1', text: 'The mystery artifact is shiny and metallic', icon: '✨', isTrue: true },
    { id: 'c2', text: 'It was discovered near the Crystalline Observatory', icon: '🔭', isTrue: true },
    { id: 'c3', text: 'It weighs more than 5 grams', icon: '⚖️', isTrue: true },
  ],
  suspects = [
    { id: 's1', name: 'Wooden Feather', avatar: '🪶', trait: 'Lightweight & Wood', isCorrectSolution: false },
    { id: 's2', name: 'Solar Chronometer', avatar: '🕰️', trait: 'Heavy & Golden Brass', isCorrectSolution: true },
    { id: 's3', name: 'Emerald Leaf', avatar: '🍃', trait: 'Organic & Green', isCorrectSolution: false },
  ],
  interactive = true,
  onSolutionSelected,
}) => {
  const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleToggleEliminate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!interactive) return

    sfxService.play('card_flip')
    HapticsService.light()

    const next = new Set(eliminatedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
      if (selectedId === id) setSelectedId(null)
    }
    setEliminatedIds(next)
  }

  const handleSelectSuspect = (suspect: SuspectItem) => {
    if (!interactive || eliminatedIds.has(suspect.id)) return

    setSelectedId(suspect.id)
    if (suspect.isCorrectSolution) {
      sfxService.play('match_success')
      HapticsService.success()
    } else {
      sfxService.play('mistake_soft')
      HapticsService.warning()
    }
    onSolutionSelected?.(suspect.id)
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
        background: 'rgba(15, 23, 42, 0.85)',
        border: '2px solid rgba(99, 102, 241, 0.4)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '640px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header & Clues Board */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>🔍</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Sherlock Clue Dossier
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {clues.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontSize: '13px',
                color: '#e2e8f0',
              }}
            >
              <span style={{ fontSize: '18px' }}>{c.icon}</span>
              <span style={{ fontWeight: 600 }}>{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suspect Candidates Grid */}
      <div style={{ width: '100%' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', display: 'block', marginBottom: '10px' }}>
          Test Deductive Hypotheses (Click to Select, [X] to Rule Out):
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {suspects.map((s) => {
            const isEliminated = eliminatedIds.has(s.id)
            const isSelected = selectedId === s.id

            return (
              <div
                key={s.id}
                onClick={() => handleSelectSuspect(s)}
                style={{
                  position: 'relative',
                  padding: '16px 12px',
                  borderRadius: '16px',
                  border: isSelected
                    ? '2px solid #818cf8'
                    : isEliminated
                    ? '1px dashed rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: isSelected
                    ? 'rgba(99, 102, 241, 0.3)'
                    : isEliminated
                    ? 'rgba(15, 23, 42, 0.4)'
                    : 'rgba(30, 41, 59, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: isEliminated ? 'default' : 'pointer',
                  opacity: isEliminated ? 0.35 : 1,
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Eliminate Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleEliminate(s.id, e)}
                  title={isEliminated ? 'Restore candidate' : 'Rule out candidate'}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: isEliminated ? '#10b981' : '#ef4444',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {isEliminated ? '↩' : '✕'}
                </button>

                <span style={{ fontSize: '32px' }}>{s.avatar}</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', textAlign: 'center' }}>
                  {s.name}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                  {s.trait}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
