export interface VocabularyWord {
  word: string

  meaning?: string

  difficulty?: 'easy' | 'medium' | 'hard'

  partOfSpeech?: string

  example?: string

  synonym?: string
}

export interface StoryDNA {
  title: string

  moral: string

  theme: string

  characters: string[]

  locations: string[]

  importantObjects: string[]

  keyEvents: string[]

  vocabulary: VocabularyWord[]

  emotions: string[]

  educationalConcepts: string[]
}