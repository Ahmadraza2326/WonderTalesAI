import { cleanJsonResponse } from './jsonCleaner'
import { validateLearningPackage } from './learningPackageValidator'
import type { LearningPackage } from './learningPackage'

export function parseLearningPackage(
  response: string
): LearningPackage {

  const cleaned = cleanJsonResponse(response)

  const parsed = JSON.parse(cleaned)

  validateLearningPackage(parsed)

  return parsed
}