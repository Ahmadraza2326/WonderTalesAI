import type { StoryRecord } from "../types/story"
import type { LearningPackage } from "./ai/learningPackage"
import type { StoryBook } from "../types/storybook"
import type { StoryNarration } from "../types/narration"

export interface StoryAssets {
  storyBook: StoryBook
  narration: StoryNarration
  illustrations: unknown
}

export class AssetEngine {
  async build(
    _story: StoryRecord,
    _learning: LearningPackage
  ): Promise<StoryAssets> {
    return {
      storyBook: { title: "Untitled", pages: [] },
      narration: { title: "Untitled", language: "en", segments: [] },
      illustrations: null,
    }
  }
}

export const assetEngine = new AssetEngine()