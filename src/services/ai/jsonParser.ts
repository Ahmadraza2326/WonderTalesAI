import { cleanJsonResponse } from './jsonCleaner'
import { validateLearningPackage } from './learningPackageValidator'
import type { LearningPackage } from './learningPackage'

export function parseLearningPackage(
  response: string
): LearningPackage {
  if (!response || typeof response !== 'string') {
    throw new Error('Learning Package response must be a non-empty string.')
  }

  const cleaned = cleanJsonResponse(response)

  if (!cleaned) {
    throw new Error('No valid JSON object found in the ORBIS AI response.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch (error) {
    throw new Error(
      `Failed to parse Learning Package JSON: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  validateLearningPackage(parsed)

  return parsed
}