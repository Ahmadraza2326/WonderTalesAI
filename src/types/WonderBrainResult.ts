import type { StoryBook } from "./storybook"
import type { StoryNarration } from "./narration"
import type { LearningPackage } from "../services/ai/learningPackage"

export interface WonderBrainResult {

  story: {

    title: string

    content: string

    language: string

    ageGroup: string

    readingLevel: string

    theme: string

    moral: string

    genre: string

  }

  learning: LearningPackage

  storyBook: StoryBook

  narration: StoryNarration

}