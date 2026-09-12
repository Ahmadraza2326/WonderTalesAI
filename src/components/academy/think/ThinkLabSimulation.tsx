import React, { useState } from 'react'
import { GlassPanel, MagicalButton } from '../../ui/design'
import { GuideCompanionAvatar } from '../guide/GuideCompanionAvatar'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface PatternPuzzle {
  id: string
  title: string
  sequence: string[]
  options: string[]
  correctOption: string
  explanation: string
}

const SAMPLE_PUZZLES: PatternPuzzle[] = [
  {
    id: 'puz_1_geom',
    title: 'Constellation Glyph Sequence',
    sequence: ['⭐', '🪐', '⭐', '🪐', '⭐', '?'],
    options: ['⭐', '🪐', '🚀', '🌙'],
    correctOption: '🪐',
    explanation: 'The pattern alternates between Star (⭐) and Planet (🪐)!',
  },
  {
    id: 'puz_2_matrix',
    title: 'Elemental Symmetry Rotation',
    sequence: ['▲', '▶', '▼', '◀', '▲', '?'],
    options: ['▲', '▶', '▼', '◀'],
    correctOption: '▶',
    explanation: 'The arrow rotates 90 degrees clockwise at every step!',
  },
]

interface ThinkLabSimulationProps {
  onSolved?: (xp: number, stars: number) => void
}

export const ThinkLabSimulation: React.FC<ThinkLabSimulationProps> = ({ onSolved }) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null)

  const currentPuzzle = SAMPLE_PUZZLES[puzzleIndex] || SAMPLE_PUZZLES[0]!

  const handleCheckAnswer = (option: string) => {
    setSelectedOption(option)
    const isCorrect = option === currentPuzzle.correctOption

    if (isCorrect) {
      HapticsService.success()
      sfxService.play('match_success')
      setFeedback({
        isCorrect: true,
        message: currentPuzzle.explanation,
      })
      onSolved?.(30, 3)
    } else {
      HapticsService.error()
      sfxService.play('mistake_soft')
      setFeedback({
        isCorrect: false,
        message: 'Observe the order carefully! Look at the first three symbols.',
      })
    }
  }

  const handleNextPuzzle = () => {
    setSelectedOption(null)
    setFeedback(null)
    setPuzzleIndex((prev) => (prev + 1) % SAMPLE_PUZZLES.length)
    sfxService.play('card_flip')
  }

  return (
    <GlassPanel
      variant="hero"
      style={{
        padding: '28px',
        maxWidth: '720px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase' }}>
            🧩 Think Lab • Pattern Deduction
          </span>
          <h2 style={{ margin: '4px 0 0', fontSize: '22px', color: '#f8fafc' }}>
            {currentPuzzle.title}
          </h2>
        </div>
        <GuideCompanionAvatar guideId="sherlock" emotion={feedback?.isCorrect ? 'celebrating' : 'thinking'} size={52} />
      </div>

      {/* Sequence Box */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          padding: '24px',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          fontSize: '36px',
        }}
      >
        {currentPuzzle.sequence.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: item === '?' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: item === '?' ? '2px dashed #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item === '?' ? '#c084fc' : '#f8fafc',
            }}
          >
            {item === '?' && selectedOption && feedback?.isCorrect ? selectedOption : item}
          </div>
        ))}
      </div>

      {/* Options Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>
          Which glyph completes the sequence?
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {currentPuzzle.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleCheckAnswer(opt)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: selectedOption === opt ? 'rgba(168, 85, 247, 0.4)' : 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                fontSize: '28px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: feedback.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: feedback.isCorrect ? '1px solid #10b981' : '1px solid #ef4444',
            color: '#f8fafc',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{feedback.message}</span>
          {feedback.isCorrect && (
            <MagicalButton variant="cosmic" size="sm" onClick={handleNextPuzzle}>
              Next Puzzle ➡️
            </MagicalButton>
          )}
        </div>
      )}
    </GlassPanel>
  )
}
