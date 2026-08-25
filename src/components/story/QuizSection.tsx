import { memo, useState } from 'react'
import type { StoryRecord } from '../../types/story'
import type { QuizSeed } from '../../services/ai/learningPackage'
import { useActivityEconomy } from '../../hooks/useActivityEconomy'
import { sfxService } from '../../services/audio/sfxService'
import { ActivityShell } from '../experience/ActivityShell'
import { RewardCelebration } from '../experience/RewardCelebration'

interface QuizSectionProps {
  story: StoryRecord
}

export const QuizSection = memo(function QuizSection({
  story,
}: QuizSectionProps) {
  const quiz = story.learning_package?.quizSeeds
  const activeChildId = story.child_id || null

  const { isCompleted, rewardStatus, completeActivity, resetActivity } =
    useActivityEconomy({
      childId: activeChildId,
      activityType: 'quiz',
      activityId: story.id,
    })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<number, { selected: string; isCorrect: boolean }>
  >({})

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <ActivityShell
        title="Story Quiz"
        emoji="📝"
        primaryDomain="comprehension"
        secondaryDomains={['memory']}
        supportsDifficulty={false}
        isPlayable={false}
        unavailableReason="Quiz is not available for this story."
      >
        <div />
      </ActivityShell>
    )
  }

  const currentQuestion: QuizSeed | undefined = quiz[currentIndex]

  if (!currentQuestion && !isCompleted) {
    return null
  }

  const totalQuestions = quiz.length
  const correctCount = Object.values(answeredQuestions).filter(
    (a) => a.isCorrect
  ).length

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return
    sfxService.play('card_flip')
    setSelectedOption(option)
  }

  const handleCheckAnswer = () => {
    if (!selectedOption || isSubmitted || !currentQuestion) return

    const normalizedSelected = selectedOption.trim().toLowerCase()
    const normalizedAnswer = currentQuestion.answer.trim().toLowerCase()
    const isCorrect =
      normalizedSelected === normalizedAnswer ||
      normalizedAnswer.includes(normalizedSelected) ||
      normalizedSelected.includes(normalizedAnswer)

    if (isCorrect) {
      sfxService.play('match_success')
    } else {
      sfxService.play('mistake_soft')
    }

    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentIndex]: { selected: selectedOption, isCorrect },
    }))
    setIsSubmitted(true)
  }

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      sfxService.play('card_flip')
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      // Calculate final quiz score
      const correctAnswers = Object.values(answeredQuestions).filter(
        (a) => a.isCorrect
      ).length

      const currentIsCorrect = (() => {
        if (!selectedOption || !currentQuestion) return false
        const normalizedSelected = selectedOption.trim().toLowerCase()
        const normalizedAnswer = currentQuestion.answer.trim().toLowerCase()
        return (
          normalizedSelected === normalizedAnswer ||
          normalizedAnswer.includes(normalizedSelected) ||
          normalizedSelected.includes(normalizedAnswer)
        )
      })()

      const finalCorrectCount = correctAnswers + (currentIsCorrect ? 1 : 0)
      const xpAmount = finalCorrectCount * 10
      const starsAmount = finalCorrectCount * 5

      // Complete activity via the unified Experience Layer economy bridge
      completeActivity({ xpAmount, starsAmount })
    }
  }

  const handleRestart = () => {
    resetActivity()
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsSubmitted(false)
    setAnsweredQuestions({})
  }

  const accuracy = Math.round((correctCount / totalQuestions) * 100)

  return (
    <ActivityShell
      title="Story Quiz"
      emoji="📝"
      tagline="Test your comprehension and recall of the story!"
      primaryDomain="comprehension"
      secondaryDomains={['memory']}
      supportsDifficulty={false}
      progressInfo={
        isCompleted
          ? 'Quiz Completed'
          : `Question ${currentIndex + 1} of ${totalQuestions}`
      }
      isPlayable={true}
    >
      {isCompleted ? (
        <RewardCelebration
          title="🎉 Great Job!"
          message={`You answered ${correctCount} out of ${totalQuestions} questions correctly!`}
          accuracy={accuracy}
          rewardStatus={rewardStatus}
          statsSummary={[
            { label: 'Score', value: `${correctCount}/${totalQuestions}` },
          ]}
          onPrimaryAction={handleRestart}
          primaryActionLabel="Retake Quiz 🔄"
        />
      ) : (
        <div>
          <h4
            style={{
              fontSize: '1.1rem',
              marginBottom: '1rem',
              color: 'var(--text-heading, #1e293b)',
            }}
          >
            {currentQuestion.question}
          </h4>

          <div
            style={{
              display: 'grid',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}
          >
            {currentQuestion.options?.map((option, index) => {
              const isSelected = selectedOption === option
              const isCorrectAnswer =
                option.trim().toLowerCase() ===
                currentQuestion.answer.trim().toLowerCase()

              let backgroundColor = 'var(--surface-alt, #f8fafc)'
              let borderColor = 'var(--border, #e2e8f0)'
              let textColor = 'inherit'

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  backgroundColor = 'rgba(34, 197, 94, 0.12)'
                  borderColor = 'rgba(34, 197, 94, 0.5)'
                  textColor = '#15803d'
                } else if (isSelected && !isCorrectAnswer) {
                  backgroundColor = 'rgba(239, 68, 68, 0.12)'
                  borderColor = 'rgba(239, 68, 68, 0.5)'
                  textColor = '#b91c1c'
                }
              } else if (isSelected) {
                backgroundColor = 'rgba(104, 74, 255, 0.1)'
                borderColor = 'var(--accent, #684aff)'
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitted}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: '0.75rem',
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor,
                    color: textColor,
                    cursor: isSubmitted ? 'default' : 'pointer',
                    fontSize: '0.98rem',
                    transition: 'all 150ms ease',
                    font: 'inherit',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.6rem',
                      height: '1.6rem',
                      borderRadius: '999px',
                      backgroundColor: isSelected
                        ? 'var(--accent, #684aff)'
                        : 'rgba(0,0,0,0.06)',
                      color: isSelected ? '#fff' : 'inherit',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </button>
              )
            })}
          </div>

          {isSubmitted ? (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.9rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: answeredQuestions[currentIndex]?.isCorrect
                  ? 'rgba(34, 197, 94, 0.08)'
                  : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${
                  answeredQuestions[currentIndex]?.isCorrect
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'
                }`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  color: answeredQuestions[currentIndex]?.isCorrect
                    ? '#15803d'
                    : '#b91c1c',
                }}
              >
                {answeredQuestions[currentIndex]?.isCorrect
                  ? '✨ Correct!'
                  : `❌ Not quite. The correct answer is: ${currentQuestion.answer}`}
              </p>
              {currentQuestion.explanation ? (
                <p
                  style={{
                    marginTop: '0.4rem',
                    marginBottom: 0,
                    fontSize: '0.92rem',
                    color: 'var(--text-muted, #64748b)',
                  }}
                >
                  {currentQuestion.explanation}
                </p>
              ) : null}
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
            }}
          >
            {!isSubmitted ? (
              <button
                type="button"
                className="button button-primary"
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                className="button button-primary"
                onClick={handleNext}
              >
                {currentIndex + 1 < totalQuestions
                  ? 'Next Question →'
                  : 'See Results ✨'}
              </button>
            )}
          </div>
        </div>
      )}
    </ActivityShell>
  )
})