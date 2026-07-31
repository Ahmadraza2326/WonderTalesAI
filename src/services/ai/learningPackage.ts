import type { StoryDNA, VocabularyWord } from './storyDNA'

export interface QuizSeed {
  question: string
  answer: string
  options: string[]
  explanation?: string
}

export interface GameSeed {
  type: string
  data: Record<string, unknown>
}

export interface ParentGuide {
  discussionQuestions: string[]
  realLifeActivity: string
}

export interface ReadingSkill {
  skill: string
  explanation: string
}

export interface LifeSkill {
  skill: string
  explanation: string
}

export interface CriticalThinkingQuestion {
  question: string
}

export interface CreativeActivity {
  title: string
  instructions: string
}

export interface FunFact {
  title: string
  fact: string
}

export interface IllustrationPrompt {
  scene: number
  prompt: string
}

export interface NarrationGuide {
  style: string
  voices: string[]
  soundEffects: string[]
}

export interface LearningPackageMetadata {
  schemaVersion: number
  language: string
  recommendedAge: string
  readingLevel: string
}

export interface LearningPackage {
  story: string

  storyDNA: StoryDNA

  readingSkills: ReadingSkill[]

  lifeSkills: LifeSkill[]

  criticalThinking: CriticalThinkingQuestion[]

  creativeActivity: CreativeActivity

  funFact: FunFact

  vocabulary: VocabularyWord[]

  quizSeeds: QuizSeed[]

  gameSeeds: GameSeed[]

  parentGuide: ParentGuide

  illustrations: IllustrationPrompt[]

  narration: NarrationGuide

  metadata: LearningPackageMetadata
}