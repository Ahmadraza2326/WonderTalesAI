import type { DifficultyTier } from '../experience'

export type RelicCategory =
  | 'astronomy'
  | 'paleontology'
  | 'botany'
  | 'oceanography'
  | 'ancient_history'
  | 'mineralogy'

export interface RelicItem {
  id: string
  pairId: string
  name: string
  emoji: string
  category: RelicCategory
  color: string
  glowColor: string
  loreSnippet: string
  isSpecial?: boolean
}

export interface MuseumCard {
  instanceId: string
  relic: RelicItem
  gridIndex: number
  row: number
  col: number
  isFlipped: boolean
  isMatched: boolean
  flipAngleDeg: number // 0 (hidden) to 180 (revealed)
}

export interface MuseumScienceDossier {
  conceptTitle: string
  scienceTopic: string
  funFact: string
  kidExplanation: string
}

export interface MuseumExhibition {
  id: string
  themeTitle: string
  themeEmoji: string
  themeColor: string
  curatorName: string
  curatorAvatar: string
  curatorQuote: string
  celebrationQuote: string
  scientificConcept: MuseumScienceDossier
}

export interface MemoryMuseumChallenge {
  id: string
  title: string
  difficulty: DifficultyTier
  tierNumber: number
  rows: number
  cols: number
  totalPairs: number
  parMoves: number
  timeTargetSeconds: number
  exhibition: MuseumExhibition
  cards: MuseumCard[]
}

export interface MemoryMuseumTelemetry {
  challengeId: string
  difficulty: DifficultyTier
  movesCount: number
  timeElapsedSeconds: number
  mistakesCount: number
  score: number
  stars: number
  xp: number
  finalStatus: 'in_progress' | 'solved' | 'abandoned'
}

export interface MemoryMuseumState {
  currentChallenge: MemoryMuseumChallenge
  status: 'playing' | 'checking_match' | 'restored' | 'celebrating'
  cards: MuseumCard[]
  selectedCardIndices: number[]
  matchedPairIds: string[]
  movesCount: number
  mistakesCount: number
  timeElapsedSeconds: number
  telemetry: MemoryMuseumTelemetry
}

export type MemoryMuseumAction =
  | { type: 'FLIP_CARD'; cardIndex: number }
  | { type: 'RESOLVE_MATCH_CHECK'; isMatch: boolean; pairId?: string }
  | { type: 'TICK_TIMER'; deltaSeconds: number }
  | { type: 'RESET_CHALLENGE' }
  | { type: 'LOAD_CHALLENGE'; challenge: MemoryMuseumChallenge }
