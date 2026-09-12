import type { StoryRecord } from '../story'

export type WordTraceDifficulty = 'easy' | 'medium' | 'hard'

export interface WordTraceChallenge {
  id: string
  word: string // Uppercase canonical word (e.g. "LUMINOUS")
  meaning: string
  clozeSentence: string // e.g. "The lantern was _______ in the cave."
  fullSentence: string // e.g. "The lantern was luminous in the cave."
  partOfSpeech?: string
  synonym?: string
  difficulty: 'easy' | 'medium' | 'hard'
  letterCount: number
  vowelCount: number
  consonantCount: number
  hints: {
    phoneticClue: string
    syllableClue: string
    firstLetterClue: string
  }
  scrambledLetters: {
    id: string
    letter: string
    isDistractor?: boolean
  }[]
}

export interface WordTraceGame {
  storyId: string
  difficulty: WordTraceDifficulty
  challenges: WordTraceChallenge[]
  totalWords: number
  isPlayable: boolean
  unavailableReason?: string
}

export interface WordTraceCompletionResult {
  storyId: string
  childId?: string | null
  difficulty: WordTraceDifficulty
  wordsCompleted: number
  totalWords: number
  mistakes: number
  hintsUsed: number
  accuracy: number
  durationSeconds: number
  score: number
  xpEarned: number
  starsEarned: number
}

export interface WordTraceQuestProps {
  story: StoryRecord
}
