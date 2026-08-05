import type { StoryRecord } from "../types/story"

import { generateLearningPackage } from "./learningPackageGenerationService"

export class LearningEngine {

  async build(
    story: StoryRecord,
    _generatedStory: string
  ) {
    return generateLearningPackage(story)
  }

}

export const learningEngine =
  new LearningEngine()