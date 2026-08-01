import type { StoryDNA } from './storyDNA'

export interface CharacterProfile {
  name: string
  age: string
  gender: string
  appearance: string
  clothing: string
  personality: string
  artStyle: string
}

export function buildCharacterProfiles(
  storyDNA: StoryDNA
): CharacterProfile[] {
  return storyDNA.characters.map(character => buildCharacterProfile(character))
}

function buildCharacterProfile(name: string): CharacterProfile {
  return {
    name,
    age: 'child',
    gender: 'unspecified',
    appearance: 'friendly and expressive',
    clothing: 'storybook-style outfit',
    personality: 'curious and kind',
    artStyle: 'Pixar-quality children\'s storybook illustration',
  }
}
