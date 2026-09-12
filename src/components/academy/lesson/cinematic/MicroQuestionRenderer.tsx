import React, { useState } from 'react'
import type { MicroQuestionConfig } from '../../../../types/cinematicLesson'
import type { GuideId } from '../../../../types/learningUniverse'
import { getGuideProfile } from '../../../../services/academy/guideDirector'
import { sfxService } from '../../../../services/audio/sfxService'
import { HapticsService } from '../../../../services/hapticsService'
import { narrationDirector } from '../../../../services/audio/narrationDirector'

interface MicroQuestionRendererProps {
  question: MicroQuestionConfig
  guideId: GuideId
  onAnswerSubmitted: (isCorrect: boolean) => void
}

export const MicroQuestionRenderer: React.FC<MicroQuestionRendererProps> = ({
  question,
  guideId,
  onAnswerSubmitted,
}) => {
  const guide = getGuideProfile(guideId)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hintTier, setHintTier] = useState<number>(0) // 0 = none, 1..4

  const handleSelectOption = (option: { id: string; label: string; isCorrect: boolean }) => {
    if (hasSubmitted && isCorrect) return

    setSelectedOptionId(option.id)
    setHasSubmitted(true)

    if (option.isCorrect) {
      setIsCorrect(true)
      sfxService.play('match_success')
      HapticsService.success()
      narrationDirector.speak(question.explanation || '🌟 Wonderful! You solved it correctly!', guideId)
      onAnswerSubmitted(true)
    } else {
      setIsCorrect(false)
      sfxService.play('mistake_soft')
      HapticsService.warning()
      narrationDirector.speak('Almost! Let us look at the clue together.', guideId)
      onAnswerSubmitted(false)
    }
  }

  const handleRequestHint = () => {
    sfxService.play('card_flip')
    HapticsService.light()
    const nextTier = Math.min(4, hintTier + 1)
    setHintTier(nextTier)
    const hintText = question.hints[nextTier - 1]
    if (hintText) {
      narrationDirector.speak(hintText, guideId)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '24px 20px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: `2px solid ${guide.accentColor}50`,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        maxWidth: '680px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Prompt Heading */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: guide.accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Check Your Understanding
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 800,
              color: '#f8fafc',
              lineHeight: 1.4,
            }}
          >
            {question.prompt}
          </h3>
          <button
            type="button"
            onClick={() => {
              HapticsService.light()
              sfxService.play('star_pop')
              narrationDirector.speak(question.prompt)
            }}
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#38bdf8',
              flexShrink: 0,
            }}
            aria-label="Listen to question prompt"
            title="Read question aloud"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#38bdf8" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>
        </div>
        {question.subPrompt && (
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
            {question.subPrompt}
          </p>
        )}
      </div>

      {/* Options Grid */}
      {question.options && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '12px',
            width: '100%',
            marginTop: '8px',
          }}
        >
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id
            const showSuccess = isSelected && isCorrect
            const showSoftError = isSelected && !isCorrect

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                style={{
                  minHeight: '72px',
                  padding: '14px 20px',
                  borderRadius: '20px',
                  border: showSuccess
                    ? '2.5px solid #10b981'
                    : showSoftError
                    ? '2px solid #f59e0b'
                    : isSelected
                    ? `2.5px solid ${guide.accentColor}`
                    : '1.5px solid rgba(255, 255, 255, 0.25)',
                  background: showSuccess
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.45) 100%)'
                    : showSoftError
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%)'
                    : isSelected
                    ? `linear-gradient(135deg, ${guide.accentColor}30 0%, rgba(30, 41, 59, 0.9) 100%)`
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  color: '#f8fafc',
                  fontSize: '16px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: showSuccess
                    ? '0 0 24px rgba(16, 185, 129, 0.5)'
                    : isSelected
                    ? `0 0 24px ${guide.accentColor}50`
                    : '0 6px 16px rgba(0,0,0,0.3)',
                  transform: showSuccess ? 'scale(1.04)' : isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <span style={{ letterSpacing: '0.01em' }}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Non-Punitive Feedback Banner */}
      {hasSubmitted && (
        <div
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: `1px solid ${isCorrect ? '#10b981' : '#f59e0b'}`,
            color: isCorrect ? '#6ee7b7' : '#fde68a',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxSizing: 'border-box',
          }}
        >
          {isCorrect ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span>
            {isCorrect
              ? question.explanation || 'Wonderful! Step mastered.'
              : 'Almost! Review the concept or tap for a clue!'}
          </span>
        </div>
      )}

      {/* Progressive 4-Tier Scaffolding Drawer */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          type="button"
          onClick={handleRequestHint}
          disabled={hintTier >= 4}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '8px 14px',
            color: hintTier >= 4 ? '#64748b' : '#38bdf8',
            fontSize: '12px',
            fontWeight: 700,
            cursor: hintTier >= 4 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18h6 M10 22h4 M12 2v1 M12 14a5 5 0 0 0 4-4 4 4 0 0 0-8 0 5 5 0 0 0 4 4z" />
          </svg>
          <span>{hintTier === 0 ? 'Need a Clue?' : `Next Clue (${hintTier}/4)`}</span>
        </button>

        {hintTier > 0 && (
          <div style={{ flex: 1, marginLeft: '12px', fontSize: '12px', color: '#93c5fd', fontStyle: 'italic' }}>
            "{question.hints[hintTier - 1]}"
          </div>
        )}
      </div>
    </div>
  )
}
