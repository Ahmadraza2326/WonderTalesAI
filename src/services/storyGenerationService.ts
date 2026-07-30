import { aiEngine } from './ai/aiEngine'
import { buildStoryPrompt } from './ai/prompts'
import { parseStoryDNA } from './ai/parsers'
import type { StoryRecord } from '../types/story'

export async function generateStory(
  story: StoryRecord
): Promise<string> {
  const prompt = buildStoryPrompt(story)

  const response = await aiEngine.generateStory(prompt)

  const result = parseStoryDNA(response)

  console.log('Story DNA:', result.dna)

  return result.story
}