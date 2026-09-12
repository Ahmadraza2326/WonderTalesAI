import React, { useState } from 'react'
import type { AcademyLesson } from '../../../types/academy'
import {
  startLessonSession,
  advanceLessonStep,
  validateInteractiveBlockAnswer,
} from '../../../services/academy/lessonEngine'
import { getCinematicLesson, getCinematicLessonForSkill } from '../../../services/academy/curriculum/cinematicLessonsData'
import { CinematicLessonPlayer } from './cinematic/CinematicLessonPlayer'
import { GlassPanel, MagicalButton, AnimatedIcon } from '../../ui/design'
import { sfxService } from '../../../services/audio/sfxService'
import { HapticsService } from '../../../services/hapticsService'

interface LessonViewerProps {
  lesson: AcademyLesson
  onComplete: (xp: number, stars: number) => void
  onOpenAskOrbis?: () => void
  onExit?: () => void
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onComplete,
  onOpenAskOrbis,
  onExit,
}) => {
  const [session, setSession] = useState(() => startLessonSession(lesson.id))
  const [interactiveInput, setInteractiveInput] = useState<string>('')
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null)

  const cinematic = getCinematicLesson(lesson.id) || getCinematicLessonForSkill(lesson.skillId)

  if (cinematic) {
    return (
      <CinematicLessonPlayer
        lesson={cinematic}
        onComplete={onComplete}
        onOpenAskOrbis={onOpenAskOrbis}
        onExit={onExit}
      />
    )
  }

  const currentBlock = lesson.blocks[session.currentBlockIndex]
  const progressPercent = Math.round(((session.currentBlockIndex + 1) / lesson.blocks.length) * 100)

  const handleNextStep = () => {
    if (!currentBlock) return

    // If block has an interactive check
    if (currentBlock.expectedAnswer !== undefined) {
      const isValid = validateInteractiveBlockAnswer(currentBlock, interactiveInput)
      if (!isValid) {
        HapticsService.error()
        sfxService.play('mistake_soft')
        setFeedback({
          isCorrect: false,
          message: 'Review the concept and try another answer!',
        })
        return
      } else {
        HapticsService.success()
        sfxService.play('match_success')
        setFeedback({
          isCorrect: true,
          message: currentBlock.explanation || 'Correct! Step mastered.',
        })
      }
    } else {
      HapticsService.light()
      sfxService.play('card_flip')
    }

    const nextState = advanceLessonStep(session, lesson, interactiveInput)
    setSession(nextState)
    setInteractiveInput('')
    setFeedback(null)

    if (nextState.isFinished) {
      HapticsService.success()
      sfxService.play('victory_fanfare')
      onComplete(lesson.rewardXP, lesson.rewardStars)
    }
  }

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
      {/* Progress Bar & Header */}
      <GlassPanel
        variant="elevated"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#38bdf8',
                textTransform: 'uppercase',
              }}
            >
              Step {session.currentBlockIndex + 1} of {lesson.blocks.length}
            </span>
            <h2 style={{ margin: '2px 0 0', fontSize: '20px', color: '#f8fafc' }}>
              {lesson.title}
            </h2>
          </div>

          {onOpenAskOrbis && (
            <button
              onClick={onOpenAskOrbis}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <AnimatedIcon kind="wand" size={16} color="#c084fc" />
              <span>Ask ORBis</span>
            </button>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </GlassPanel>

      {/* Main Content Stage Block */}
      {currentBlock && (
        <GlassPanel
          variant="hero"
          style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            minHeight: '280px',
          }}
        >
          {currentBlock.title && (
            <h3
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 800,
                color: '#f8fafc',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '12px',
              }}
            >
              {currentBlock.title}
            </h3>
          )}

          <div
            style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#e2e8f0',
              whiteSpace: 'pre-line',
            }}
          >
            {currentBlock.content}
          </div>

          {/* Visual Data / Diagram Render */}
          {currentBlock.visualData && (
            <div
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  color: '#38bdf8',
                }}
              >
                {JSON.stringify(currentBlock.visualData, null, 2)}
              </pre>
            </div>
          )}

          {/* Interactive Guided Prompt Input */}
          {currentBlock.interactivePrompt && (
            <div
              style={{
                marginTop: '12px',
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <label style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                {currentBlock.interactivePrompt}
              </label>
              <input
                type="text"
                value={interactiveInput}
                onChange={(e) => setInteractiveInput(e.target.value)}
                placeholder="Type your answer here..."
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: feedback.isCorrect
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`,
                color: feedback.isCorrect ? '#6ee7b7' : '#fca5a5',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              {feedback.message}
            </div>
          )}

          {/* Navigation Action */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '16px',
            }}
          >
            <MagicalButton
              variant="cosmic"
              size="md"
              soundCue="card_flip"
              onClick={handleNextStep}
            >
              {session.currentBlockIndex + 1 >= lesson.blocks.length
                ? 'Complete Lesson'
                : 'Continue Step →'}
            </MagicalButton>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
