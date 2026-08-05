import type { StoryRecord } from "../types/story"
import type { LearningPackage } from "./ai/learningPackage"
import type { StoryBook } from "../types/storybook"
import type { StoryNarration } from "../types/narration"

import { generateStoryBook } from "./storybookGenerator"
import { generateNarration } from "./narrationGenerator"

export interface StoryAssets {
  storyBook: StoryBook
  narration: StoryNarration
  illustrations: unknown
}

export class AssetEngine {
  async build(
    story: StoryRecord,
    _learning: LearningPackage
  ): Promise<StoryAssets> {
    return {
      storyBook: await generateStoryBook(story),
      narration: await generateNarration(story),
      illustrations: null,
    }
  }
}

export const assetEngine = new AssetEngine()