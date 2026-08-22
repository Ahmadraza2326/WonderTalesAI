import type { StoryRecord } from '../types/story'
import type { StoryNarration } from '../types/narration'
import { buildNarration } from './ai/narrationService'

/**
 * NarrationGenerator is responsible for transforming a StoryRecord 
 * into a structured StoryNarration object with sentence-aligned segments across any supported language.
 */
export async function generateNarration(
  story: StoryRecord,
  language?: string,
  customStoryContent?: string,
  customTitle?: string
): Promise<StoryNarration> {
  const targetLanguage = language || story.language || 'English'
  return buildNarration(story, targetLanguage, customStoryContent, customTitle)
}
