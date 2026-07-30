import { aiEngine } from './ai/aiEngine'
import { buildLearningPackagePrompt } from './ai/prompts'
import { parseLearningPackage } from './ai/jsonParser'
import type { StoryRecord } from '../types/story'
import type { LearningPackage } from './ai/learningPackage'

export async function generateLearningPackage(
  story: StoryRecord
): Promise<LearningPackage> {

  const prompt = buildLearningPackagePrompt(story)

  const response = await aiEngine.generateStory(prompt)

  return parseLearningPackage(response)
}