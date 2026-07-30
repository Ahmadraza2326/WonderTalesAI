import type { StoryDNA } from './storyDNA'

export function validateStoryDNA(dna: StoryDNA): boolean {
  if (!dna.title.trim()) return false
  if (!dna.theme.trim()) return false
  if (!dna.moral.trim()) return false

  return true
}