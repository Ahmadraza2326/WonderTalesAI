import { learningPackageSchemaExample } from './learningPackageSchema'

export function getLearningPackageSchemaPrompt(): string {
  return JSON.stringify(
    learningPackageSchemaExample,
    null,
    2
  )
}