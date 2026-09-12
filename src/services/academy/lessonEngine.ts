import type { AcademyLesson, LessonBlock } from '../../types/academy'
import { getAcademyLesson } from './curriculum/lessonsData'

export interface LessonSessionState {
  lessonId: string
  currentBlockIndex: number
  totalBlocks: number
  completedBlockIds: string[]
  interactiveAnswers: Record<string, string | number>
  isFinished: boolean
  startedAt: string
}

export function startLessonSession(lessonId: string): LessonSessionState {
  const lesson = getAcademyLesson(lessonId)
  const totalBlocks = lesson?.blocks.length || 0

  return {
    lessonId,
    currentBlockIndex: 0,
    totalBlocks,
    completedBlockIds: [],
    interactiveAnswers: {},
    isFinished: false,
    startedAt: new Date().toISOString(),
  }
}

export function advanceLessonStep(
  state: LessonSessionState,
  lesson: AcademyLesson,
  userInteractiveAnswer?: string | number
): LessonSessionState {
  const currentBlock = lesson.blocks[state.currentBlockIndex]
  const completed = new Set(state.completedBlockIds)

  if (currentBlock) {
    completed.add(currentBlock.id)
  }

  const updatedAnswers = { ...state.interactiveAnswers }
  if (currentBlock && userInteractiveAnswer !== undefined) {
    updatedAnswers[currentBlock.id] = userInteractiveAnswer
  }

  const nextIndex = state.currentBlockIndex + 1
  const isFinished = nextIndex >= lesson.blocks.length

  return {
    ...state,
    currentBlockIndex: Math.min(nextIndex, lesson.blocks.length - 1),
    completedBlockIds: Array.from(completed),
    interactiveAnswers: updatedAnswers,
    isFinished,
  }
}

export function validateInteractiveBlockAnswer(
  block: LessonBlock,
  answer: string | number
): boolean {
  if (block.expectedAnswer === undefined) return true

  if (typeof block.expectedAnswer === 'number') {
    return Number(answer) === block.expectedAnswer
  }

  if (typeof block.expectedAnswer === 'string') {
    return String(answer).trim().toLowerCase() === block.expectedAnswer.trim().toLowerCase()
  }

  return false
}
