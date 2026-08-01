import type { StoryDNA } from './storyDNA'

export interface StoryScene {
  scene: number
  title: string
  description: string
  emotion: string
  location: string
  characters: string[]
}

export function extractIllustrationScenes(
  storyDNA: StoryDNA
): StoryScene[] {
  const scenes: StoryScene[] = []

  const emotions =
    storyDNA.emotions.length > 0
      ? storyDNA.emotions
      : ['Wonder']

  const locations =
    storyDNA.locations.length > 0
      ? storyDNA.locations
      : ['Unknown Location']

  storyDNA.keyEvents.forEach((event, index) => {
    scenes.push({
      scene: index + 1,

      title: `Scene ${index + 1}`,

      description: event,

      emotion:
        emotions[
          Math.min(index, emotions.length - 1)
        ],

      location:
        locations[
          Math.min(index, locations.length - 1)
        ],

      characters: storyDNA.characters,
    })
  })

  return scenes
}