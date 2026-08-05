import type { StoryRecord } from "../types/story"
import type { LearningPackage } from "./ai/learningPackage"

export interface StoryAssets {

  storyBook: unknown

  narration: unknown

  illustrations: unknown

}

export class AssetEngine {

  async build(
    _story: StoryRecord,
    _learning: LearningPackage
  ): Promise<StoryAssets> {

    return {

      storyBook: null,

      narration: null,

      illustrations: null,

    }

  }

}

export const assetEngine =
  new AssetEngine()