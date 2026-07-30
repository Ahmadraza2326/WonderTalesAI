import type { StoryDNA } from './storyDNA'

export function parseStoryDNA(response: string): {
  story: string
  dna: StoryDNA
} {
  const separator = '=== STORY DNA ==='

  const parts = response.split(separator)

  const story = parts[0]?.trim() ?? ''
  const dnaText = parts[1]?.trim() ?? ''

  const getValue = (label: string): string => {
    const regex = new RegExp(`${label}:\\s*(.*)`)
    const match = dnaText.match(regex)
    return match?.[1]?.trim() ?? ''
  }

  const dna: StoryDNA = {
    theme: getValue('Theme'),
    characters: getValue('Characters')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),

    vocabulary: getValue('Vocabulary')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),

    keyEvents: getValue('Key Events')
      .split(';')
      .map(item => item.trim())
      .filter(Boolean),

    educationalConcepts: getValue('Educational Concepts')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),

    emotions: getValue('Emotions')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
  }

  return {
    story,
    dna,
  }
}