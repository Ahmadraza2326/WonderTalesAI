import type { LearningPackage } from './learningPackage'

export function validateLearningPackage(
  data: unknown
): asserts data is LearningPackage {
  if (!data || typeof data !== 'object') {
    throw new Error('Learning Package must be a JSON object.')
  }

  const pkg = data as Record<string, unknown>

  if (typeof pkg.story !== 'string' || !pkg.story.trim()) {
    throw new Error('Missing or invalid "story" in Learning Package.')
  }

  if (!pkg.storyDNA || typeof pkg.storyDNA !== 'object') {
    throw new Error('Missing or invalid "storyDNA" in Learning Package.')
  }

  if (!Array.isArray(pkg.vocabulary)) {
    throw new Error('Missing or invalid "vocabulary" array in Learning Package.')
  }

  if (!Array.isArray(pkg.quizSeeds)) {
    throw new Error('Missing or invalid "quizSeeds" array in Learning Package.')
  }

  if (!Array.isArray(pkg.gameSeeds)) {
    throw new Error('Missing or invalid "gameSeeds" array in Learning Package.')
  }

  if (!pkg.parentGuide || typeof pkg.parentGuide !== 'object') {
    throw new Error('Missing or invalid "parentGuide" in Learning Package.')
  }

  if (!Array.isArray(pkg.illustrations)) {
    throw new Error('Missing or invalid "illustrations" array in Learning Package.')
  }

  if (!pkg.narration || typeof pkg.narration !== 'object') {
    throw new Error('Missing or invalid "narration" in Learning Package.')
  }

  if (!pkg.metadata || typeof pkg.metadata !== 'object') {
    throw new Error('Missing or invalid "metadata" in Learning Package.')
  }

  // Handle optional collections:
  // 1. If absent/undefined, normalize to empty array [].
  // 2. If present but not an array, throw validation error.
  // 3. If array, preserve unchanged.
  if (pkg.readingSkills === undefined) {
    pkg.readingSkills = []
  } else if (!Array.isArray(pkg.readingSkills)) {
    throw new Error('Invalid "readingSkills" in Learning Package: expected an array.')
  }

  if (pkg.lifeSkills === undefined) {
    pkg.lifeSkills = []
  } else if (!Array.isArray(pkg.lifeSkills)) {
    throw new Error('Invalid "lifeSkills" in Learning Package: expected an array.')
  }

  if (pkg.criticalThinking === undefined) {
    pkg.criticalThinking = []
  } else if (!Array.isArray(pkg.criticalThinking)) {
    throw new Error('Invalid "criticalThinking" in Learning Package: expected an array.')
  }
}