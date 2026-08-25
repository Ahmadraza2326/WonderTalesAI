import type { StoryRecord } from '../story'

export type MemoryDifficulty = 'easy' | 'medium' | 'hard'

export type MemoryCardCategory =
  | 'vocabulary'
  | 'character'
  | 'location'
  | 'object'
  | 'fact'

export interface MemoryCard {
  id: string
  pairId: string
  type: 'prompt' | 'match'
  category: MemoryCardCategory
  text: string
  secondaryText?: string
  emoji: string
}

export interface MemoryQuestGame {
  storyId: string
  difficulty: MemoryDifficulty
  cards: MemoryCard[]
  totalPairs: number
  isPlayable: boolean
  unavailableReason?: string
}

export interface MemoryQuestCompletionResult {
  storyId: string
  childId?: string | null
  difficulty: MemoryDifficulty
  pairsCompleted: number
  totalPairs: number
  moves: number
  mistakes: number
  accuracy: number
  durationSeconds: number
  score: number
  xpEarned: number
  starsEarned: number
}

export interface RawMemoryPairCandidate {
  pairId: string
  category: MemoryCardCategory
  promptText: string
  promptSecondary?: string
  matchText: string
  matchSecondary?: string
  emoji: string
  difficultyTier: 1 | 2 | 3
}

export interface StoryMemoryQuestProps {
  story: StoryRecord
}
