/**
 * ORBis Cinematic Lesson Engine
 * Coordinates lesson session state, scene advancement, micro-question validation,
 * progressive hint scaffolding, and reward calculation.
 */

import type { CinematicLesson, CinematicLessonScene, LessonPlaybackState } from '../../types/cinematicLesson'
import { getCinematicLesson, getCinematicLessonForSkill } from './curriculum/cinematicLessonsData'

export function startCinematicLessonSession(lessonId: string): LessonPlaybackState {
  const lesson = getCinematicLesson(lessonId)
  if (!lesson) {
    throw new Error(`Cinematic lesson with ID "${lessonId}" not found`)
  }

  return {
    currentSceneIndex: 0,
    activeHintTier: 0,
    attemptCount: 0,
    hasAnsweredCurrentScene: false,
    isCurrentAnswerCorrect: false,
    userAnswer: null,
    isSpeaking: false,
    isFinished: false,
    earnedXP: 0,
    earnedStars: 0,
  }
}

export function advanceCinematicScene(
  currentState: LessonPlaybackState,
  lesson: CinematicLesson
): LessonPlaybackState {
  const nextSceneIndex = currentState.currentSceneIndex + 1
  const isFinished = nextSceneIndex >= lesson.scenes.length

  return {
    ...currentState,
    currentSceneIndex: nextSceneIndex,
    activeHintTier: 0,
    attemptCount: 0,
    hasAnsweredCurrentScene: false,
    isCurrentAnswerCorrect: false,
    userAnswer: null,
    isFinished,
    earnedXP: isFinished ? lesson.rewardXP : currentState.earnedXP,
    earnedStars: isFinished ? lesson.rewardStars : currentState.earnedStars,
  }
}

export function evaluateMicroQuestionAnswer(
  scene: CinematicLessonScene,
  selectedOptionId: string
): { isCorrect: boolean; feedbackMessage: string; explanation: string } {
  if (!scene.microQuestion || !scene.microQuestion.options) {
    return { isCorrect: true, feedbackMessage: 'Step completed!', explanation: '' }
  }

  const selectedOpt = scene.microQuestion.options.find((o) => o.id === selectedOptionId)
  const isCorrect = selectedOpt ? selectedOpt.isCorrect : false

  return {
    isCorrect,
    feedbackMessage: isCorrect
      ? '🌟 Correct! Wonderful thinking!'
      : 'Almost! Let us look at the clue together.',
    explanation: scene.microQuestion.explanation,
  }
}

export function getProgressiveScaffoldingHint(
  scene: CinematicLessonScene,
  currentTier: number
): { tier: number; hintText: string | null; hasMoreHints: boolean } {
  if (!scene.microQuestion || !scene.microQuestion.hints) {
    return { tier: 0, hintText: null, hasMoreHints: false }
  }

  const nextTier = Math.min(4, Math.max(1, currentTier + 1))
  const hintText = scene.microQuestion.hints[nextTier - 1] || null

  return {
    tier: nextTier,
    hintText,
    hasMoreHints: nextTier < 4,
  }
}

export { getCinematicLesson, getCinematicLessonForSkill }
