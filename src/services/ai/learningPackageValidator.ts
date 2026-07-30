import type { LearningPackage } from './learningPackage'

export function validateLearningPackage(
  data: unknown
): asserts data is LearningPackage {

  if (!data || typeof data !== 'object') {
    throw new Error('Learning Package must be an object.')
  }

  const pkg = data as Record<string, unknown>

  if (typeof pkg.story !== 'string') {
    throw new Error('Missing story.')
  }

  if (!pkg.storyDNA) {
    throw new Error('Missing storyDNA.')
  }

  if (!Array.isArray(pkg.vocabulary)) {
    throw new Error('Missing vocabulary.')
  }

  if (!Array.isArray(pkg.quizSeeds)) {
    throw new Error('Missing quizSeeds.')
  }

  if (!Array.isArray(pkg.gameSeeds)) {
    throw new Error('Missing gameSeeds.')
  }

  if (!pkg.parentGuide) {
    throw new Error('Missing parentGuide.')
  }

  if (!Array.isArray(pkg.illustrations)) {
    throw new Error('Missing illustrations.')
  }

  if (!pkg.narration) {
    throw new Error('Missing narration.')
  }

  if (!pkg.metadata) {
    throw new Error('Missing metadata.')
  }
}