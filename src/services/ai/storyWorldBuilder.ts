import type { StoryDNA } from './storyDNA'

export interface LocationProfile {
  name: string
  architecture: string
  environment: string
  lighting: string
  atmosphere: string
  dominantColors: string[]
  importantObjects: string[]
}

export function buildLocationProfiles(
  storyDNA: StoryDNA
): LocationProfile[] {
  return storyDNA.locations.map(location => buildLocationProfile(location, storyDNA))
}

function buildLocationProfile(
  name: string,
  storyDNA: StoryDNA
): LocationProfile {
  const environment = describeEnvironment(name)
  const colors = pickColors(name)

  return {
    name,
    architecture: 'storybook-friendly architecture',
    environment,
    lighting: 'warm and inviting',
    atmosphere: 'safe and magical',
    dominantColors: colors,
    importantObjects: storyDNA.importantObjects.slice(0, 3),
  }
}

function describeEnvironment(name: string): string {
  const lowerName = name.toLowerCase()

  if (lowerName.includes('forest')) return 'lush woodland landscape'
  if (lowerName.includes('castle')) return 'grand medieval surroundings'
  if (lowerName.includes('sea') || lowerName.includes('ocean')) return 'coastal and breezy'
  if (lowerName.includes('mountain')) return 'rugged highland terrain'
  if (lowerName.includes('village')) return 'quiet village streets'

  return 'friendly and scenic'
}

function pickColors(name: string): string[] {
  const lowerName = name.toLowerCase()

  if (lowerName.includes('forest')) return ['green', 'brown', 'gold']
  if (lowerName.includes('castle')) return ['cream', 'gray', 'blue']
  if (lowerName.includes('sea') || lowerName.includes('ocean')) return ['blue', 'teal', 'sand']
  if (lowerName.includes('mountain')) return ['gray', 'white', 'sage']

  return ['pink', 'blue', 'yellow']
}
