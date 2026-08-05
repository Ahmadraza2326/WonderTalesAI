import type { StoryRecord } from '../types/story'
import { generateStory } from './storyGenerationService'
import { learningEngine } from "./learningEngine"
import { assetEngine } from "./AssetEngine"

export class StoryOrchestrator {
  async generate(story: StoryRecord) {
    const generatedStory = await this.buildStory(story)

   const learningPackage =
  await learningEngine.build(
    story,
    generatedStory
  )

const assets =
  await assetEngine.build(
    story,
    learningPackage
  )
return {

  generatedStory,

  learningPackage,

  storyBook: assets.storyBook,

  narration: assets.narration,

}
}

 private async buildStory(story: StoryRecord) {
  return generateStory(story)
}
}

  

export const storyOrchestrator =
  new StoryOrchestrator()
