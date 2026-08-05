import type { StoryBook } from "./storybook"
import type { StoryNarration } from "./narration"

export interface VocabularyWord {
  word: string
  meaning: string
  example: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
}

export interface FunFact {
  title: string
  description: string
}

export interface Activity {
  title: string
  instructions: string
}

export interface ParentGuide {
  discussionTopics: string[]
  lifeLessons: string[]
}

export interface StoryAssets {
  storyBook: StoryBook
  narration: StoryNarration
  vocabulary: VocabularyWord[]
  quiz: QuizQuestion[]
  funFacts: FunFact[]
  activities: Activity[]
  parentGuide: ParentGuide
}