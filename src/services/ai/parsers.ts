import type { StoryDNA } from './storyDNA'

export function parseStoryDNA(data: unknown): StoryDNA {
  return data as StoryDNA
}