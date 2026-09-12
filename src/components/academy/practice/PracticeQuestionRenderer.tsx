import React, { useState } from 'react'
import type { PracticeQuestion, PracticeSet } from '../../../types/academy'
import {
  evaluateQuestionAnswer,
  type UserAnswerPayload,
  type QuestionEvaluationResult,
} from '../../../services/academy/practiceEngine'
import { ProgressiveHintDrawer } from './ProgressiveHintDrawer'
import { GlassPanel, MagicalButton } from '../../ui/design'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface PracticeQuestionRendererProps {
  practiceSet: PracticeSet
  onFinished: (summary: { scorePercent: number; correctCount: number; total: number }) => void
}

export const PracticeQuestionRenderer: React.FC<PracticeQuestionRendererProps> = ({
  practiceSet,
  onFinished,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [evaluation, setEvaluation] = useState<QuestionEvaluationResult | null>(null)

  // Answers State
  const [selectedOptionId, setSelectedOptionId] = useState<string>('')
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [numberValue, setNumberValue] = useState<string>('')
  const [textValue, setTextValue] = useState<string>('')
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({})
  const [orderedItems, setOrderedItems] = useState<string[]>([])
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({})
  const [clozeTokens, setClozeTokens] = useState<Record<string, string>>({})

  const currentQ = practiceSet.questions[currentIndex]

  // Reset inputs when moving to next question
  const resetInputsForQuestion = (q: PracticeQuestion) => {
    setSelectedOptionId('')
    setSelectedOptionIds([])
    setNumberValue('')
    setTextValue('')
    setMatchedPairs({})
    setOrderedItems(q.orderedSequence ? [...q.orderedSequence].reverse() : [])
    setCategoriesMap({})
    setClozeTokens({})
    setEvaluation(null)
  }

  const handleSubmit = () => {
    if (!currentQ) return

    let payload: UserAnswerPayload

    if (currentQ.type === 'multiple_choice') {
      payload = { type: 'single_option', selectedOptionId }
    } else if (currentQ.type === 'multiple_select') {
      payload = { type: 'multi_option', selectedOptionIds }
    } else if (currentQ.type === 'number_input') {
      payload = { type: 'number', value: parseFloat(numberValue) || 0 }
    } else if (currentQ.type === 'matching_pairs') {
      payload = { type: 'pairs', matches: matchedPairs }
    } else if (currentQ.type === 'ordering') {
      payload = { type: 'ordering', sequence: orderedItems }
    } else if (currentQ.type === 'categorization') {
      payload = { type: 'categorization', itemCategoryMap: categoriesMap }
    } else if (currentQ.type === 'fill_in_the_blank') {
      payload = { type: 'cloze', tokens: clozeTokens }
    } else {
      payload = { type: 'text', value: textValue }
    }

    const result = evaluateQuestionAnswer(currentQ, payload)
    setEvaluation(result)

    if (result.isCorrect) {
      HapticsService.success()
      sfxService.play('match_success')
      setCorrectAnswersCount((c) => c + 1)
    } else {
      HapticsService.error()
      sfxService.play('mistake_soft')
    }
  }

  const handleNextQuestion = () => {
    HapticsService.light()
    sfxService.play('card_flip')

    const nextIndex = currentIndex + 1
    if (nextIndex >= practiceSet.questions.length) {
      const finalCorrect = evaluation?.isCorrect ? correctAnswersCount : correctAnswersCount
      const scorePercent = Math.round((finalCorrect / practiceSet.questions.length) * 100)
      sfxService.play('victory_fanfare')
      onFinished({
        scorePercent,
        correctCount: finalCorrect,
        total: practiceSet.questions.length,
      })
    } else {
      setCurrentIndex(nextIndex)
      const nextQ = practiceSet.questions[nextIndex]
      if (nextQ) resetInputsForQuestion(nextQ)
    }
  }

  if (!currentQ) return null

  return (
    <div
      style={{
        maxWidth: '840px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Header Bar */}
      <GlassPanel
        variant="elevated"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#a855f7' }}>
            Question {currentIndex + 1} of {practiceSet.questions.length}
          </span>
          <h2 style={{ margin: '2px 0 0', fontSize: '18px', color: '#f8fafc' }}>
            {practiceSet.title}
          </h2>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24' }}>
          ⭐ Score: {correctAnswersCount} / {practiceSet.questions.length}
        </div>
      </GlassPanel>

      {/* Main Question Card */}
      <GlassPanel
        variant="hero"
        style={{
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
          {currentQ.prompt}
        </div>

        {currentQ.visualAsset && (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              fontFamily: 'monospace',
              fontSize: '16px',
              color: '#38bdf8',
              textAlign: 'center',
            }}
          >
            {currentQ.visualAsset.content}
          </div>
        )}

        {/* 1. Multiple Choice Options */}
        {currentQ.type === 'multiple_choice' && currentQ.options && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    HapticsService.light()
                    sfxService.play('card_flip')
                    setSelectedOptionId(opt.id)
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: isSelected
                      ? '2px solid #a855f7'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(67, 56, 202, 0.35) 100%)'
                      : 'rgba(30, 41, 59, 0.6)',
                    color: '#f8fafc',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {opt.text}
                </button>
              )
            })}
          </div>
        )}

        {/* 2. Number Input */}
        {currentQ.type === 'number_input' && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              placeholder="Enter number..."
              style={{
                maxWidth: '240px',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* 3. Matching Pairs */}
        {currentQ.type === 'matching_pairs' && currentQ.pairs && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQ.pairs.map((pair) => (
              <div
                key={pair.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', minWidth: '60px' }}>
                  {pair.leftText}
                </span>
                <span style={{ color: '#94a3b8' }}>➔</span>
                <input
                  type="text"
                  value={matchedPairs[pair.leftText] || ''}
                  onChange={(e) =>
                    setMatchedPairs({ ...matchedPairs, [pair.leftText]: e.target.value })
                  }
                  placeholder="Matching partner..."
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 4. Categorization */}
        {currentQ.type === 'categorization' && currentQ.categories && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentQ.categories.flatMap((c) => c.items).map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>{item}</span>
                <select
                  value={categoriesMap[item] || ''}
                  onChange={(e) =>
                    setCategoriesMap({ ...categoriesMap, [item]: e.target.value })
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    color: '#f8fafc',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '13px',
                  }}
                >
                  <option value="">Select Category...</option>
                  {currentQ.categories?.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* 5. Word Builder / Text Input */}
        {(currentQ.type === 'word_builder' || currentQ.type === 'text_input') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQ.options && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      HapticsService.light()
                      sfxService.play('rune_snap')
                      setTextValue((prev) => (prev ? `${prev}${opt.text.replace('-', '')}` : opt.text.replace('-', '')))
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(168, 85, 247, 0.25)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      color: '#e2e8f0',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Forged word..."
              style={{
                maxWidth: '280px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Evaluation Banner */}
        {evaluation && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: evaluation.isCorrect
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${evaluation.isCorrect ? '#10b981' : '#ef4444'}`,
              color: evaluation.isCorrect ? '#6ee7b7' : '#fca5a5',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            <div>{evaluation.feedbackMessage}</div>
            <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
              {currentQ.explanation}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          {!evaluation ? (
            <MagicalButton
              variant="cosmic"
              size="md"
              soundCue="card_flip"
              onClick={handleSubmit}
            >
              Check Answer ⚡
            </MagicalButton>
          ) : (
            <MagicalButton
              variant="gold"
              size="md"
              soundCue="card_flip"
              onClick={handleNextQuestion}
            >
              {currentIndex + 1 >= practiceSet.questions.length ? 'Finish Practice 🏆' : 'Next Question →'}
            </MagicalButton>
          )}
        </div>
      </GlassPanel>

      {/* Progressive 4-Tier Hint Drawer */}
      <ProgressiveHintDrawer question={currentQ} />
    </div>
  )
}
