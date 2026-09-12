import React, { useState } from 'react'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'
import { narrationDirector } from '../../../../services/audio/narrationDirector'

interface WordRune {
  id: string
  word: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'preposition' | 'article'
  isTargetVerb: boolean
  explanation: string
}

const DEFAULT_SENTENCE: WordRune[] = [
  { id: 'w1', word: 'The', partOfSpeech: 'article', isTargetVerb: false, explanation: '"The" introduces the subject!' },
  { id: 'w2', word: 'golden', partOfSpeech: 'adjective', isTargetVerb: false, explanation: '"golden" describes how the eagle looks!' },
  { id: 'w3', word: 'eagle', partOfSpeech: 'noun', isTargetVerb: false, explanation: '"eagle" is the naming word (Noun)!' },
  { id: 'w4', word: 'soars', partOfSpeech: 'verb', isTargetVerb: true, explanation: '"soars" is the Action Verb! It shows what the eagle is doing!' },
  { id: 'w5', word: 'across', partOfSpeech: 'preposition', isTargetVerb: false, explanation: '"across" shows the direction!' },
  { id: 'w6', word: 'the', partOfSpeech: 'article', isTargetVerb: false, explanation: '"the" is an article.' },
  { id: 'w7', word: 'sky', partOfSpeech: 'noun', isTargetVerb: false, explanation: '"sky" is a place noun.' },
]

interface SentenceRuneManipulativeProps {
  onVerbDiscovered?: (verb: string) => void
}

export const SentenceRuneManipulative: React.FC<SentenceRuneManipulativeProps> = ({
  onVerbDiscovered,
}) => {
  const [selectedRuneId, setSelectedRuneId] = useState<string | null>(null)
  const [isVerbFound, setIsVerbFound] = useState(false)
  const [hintMessage, setHintMessage] = useState<string>('Tap any glowing word rune to discover its grammatical power!')

  const handleSelectRune = (rune: WordRune) => {
    setSelectedRuneId(rune.id)
    setHintMessage(rune.explanation)

    if (rune.isTargetVerb) {
      setIsVerbFound(true)
      sfxService.play('match_success')
      HapticsService.success()
      narrationDirector.speak('Yes! Soars is the action verb!')
      onVerbDiscovered?.(rune.word)
    } else {
      sfxService.play('card_flip')
      HapticsService.light()
      narrationDirector.speak(rune.explanation)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        padding: '24px 20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '2px solid rgba(245, 158, 11, 0.45)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        maxWidth: '680px',
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
          <span style={{ fontSize: '24px' }}>📜</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
            Action Rune Sentence Altar
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>
          {isVerbFound ? '✨ Verb Activated!' : 'Find the Action Verb 🔍'}
        </span>
      </div>

      {/* Interactive Sentence Word Runes */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          padding: '16px',
          borderRadius: '18px',
          background: 'rgba(2, 6, 23, 0.85)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {DEFAULT_SENTENCE.map((rune) => {
          const isSelected = selectedRuneId === rune.id
          const isCorrectVerb = rune.isTargetVerb && isVerbFound

          return (
            <button
              key={rune.id}
              type="button"
              onClick={() => handleSelectRune(rune)}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                border: isCorrectVerb
                  ? '2px solid #fbbf24'
                  : isSelected
                  ? '2px solid #38bdf8'
                  : '1.5px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: isCorrectVerb
                  ? 'rgba(245, 158, 11, 0.35)'
                  : isSelected
                  ? 'rgba(56, 189, 248, 0.25)'
                  : 'rgba(30, 41, 59, 0.8)',
                color: isCorrectVerb ? '#fde047' : '#f8fafc',
                fontSize: '18px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: isCorrectVerb ? '0 0 20px #fbbf24' : 'none',
                transform: isCorrectVerb ? 'scale(1.1)' : isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {rune.word}
            </button>
          )
        })}
      </div>

      {/* Visual Animation Reaction Banner */}
      {isVerbFound && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: '16px',
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.25) 100%)',
            border: '1px solid #fbbf24',
            animation: 'bounce 1s ease',
          }}
        >
          <span style={{ fontSize: '32px' }}>🦅</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#fde047' }}>
              Action Activated: The Eagle Soars!
            </div>
            <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
              "Soars" describes the physical action of spreading wings and gliding through the sky.
            </div>
          </div>
        </div>
      )}

      {/* Real-time Discovery Explanation Banner */}
      <div
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '14px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#e2e8f0',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        💡 {hintMessage}
      </div>
    </div>
  )
}
