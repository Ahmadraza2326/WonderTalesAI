import type { StoryRecord } from '../types/story'
import type { LearningPackage } from './ai/learningPackage'
import type { StoryBook } from '../types/storybook'
import type { StoryNarration } from '../types/narration'
import type { WonderBrainResult } from '../types/WonderBrainResult'

export class WonderBrainFactory {
  static build(
    storyRecord: StoryRecord,
    generatedStory: string,
    learningPackage: LearningPackage,
    storyBook: StoryBook,
    narration: StoryNarration
  ): WonderBrainResult {
    return {
      story: {
        title: storyRecord.title,
        content: generatedStory,
        language: storyRecord.language ?? 'en',
        ageGroup: String(storyRecord.child_age ?? 'unknown'),
        readingLevel: storyRecord.reading_level ?? 'beginner',
        theme: storyRecord.theme ?? 'none',
        moral: storyRecord.moral ?? 'none',
        genre: storyRecord.genre ?? 'Adventure',
      },
      learning: learningPackage,
      storyBook,
      narration,
    }
  }
}
