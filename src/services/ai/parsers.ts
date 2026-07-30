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
    title: '',

    moral: '',

    theme: getValue('Theme'),

    characters: getValue('Characters')
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean),

    locations: [],

    importantObjects: [],

    vocabulary: getValue('Vocabulary')
      .split(',')
      .map((item: string) => ({
        word: item.trim(),
      }))
      .filter(item => item.word.length > 0),

    keyEvents: getValue('Key Events')
      .split(';')
      .map((item: string) => item.trim())
      .filter(Boolean),

    emotions: getValue('Emotions')
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean),

    educationalConcepts: getValue('Educational Concepts')
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean),
  }

  return {
    story,
    dna,
  }
}