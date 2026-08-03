import type { StoryRecord } from '../types/story'

export interface StoryGenerationResult {
  story: StoryRecord
}

export class StoryOrchestrator {
  async generate(story: StoryRecord): Promise<StoryGenerationResult> {
    return {
      story,
    }
  }
}

export const storyOrchestrator =
  new StoryOrchestrator()