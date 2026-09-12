import type { DifficultyTier } from '../experience'

export type RuneType = 'letter' | 'onset' | 'rime' | 'prefix' | 'root' | 'suffix'

export interface RuneBlock {
  id: string
  text: string
  phonemeSound: string
  type: RuneType
  color: string
  glowColor: string
  emoji?: string
  isDistractor?: boolean
}

export interface AnvilSocket {
  id: string
  positionIndex: number
  expectedText: string
  placedRune: RuneBlock | null
  label: string
  x: number
  y: number
  width: number
  height: number
  isLocked?: boolean
}

export interface LiteracyScienceDossier {
  conceptTitle: string
  scienceTopic: string
  funFact: string
  kidExplanation: string
}

export interface SpellforgeWord {
  id: string
  targetWord: string
  meaning: string
  phonicsBreakdown: string[]
  morphemeBreakdown?: string[]
  tier: DifficultyTier
  spellName: string
  spellEmoji: string
  spellAuraColor: string
  incantation: string
  scientificConcept: LiteracyScienceDossier
}

export interface SpellforgeChallenge {
  id: string
  title: string
  difficulty: DifficultyTier
  tierNumber: number
  parMoves: number
  targetWord: SpellforgeWord
  sockets: AnvilSocket[]
  availableRunes: RuneBlock[]
  distractorRunes: RuneBlock[]
}

export interface SparkParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface SpellforgeTelemetry {
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

export interface SpellforgeState {
  currentChallenge: SpellforgeChallenge
  status: 'forging' | 'hammer_ready' | 'forged' | 'celebrating'
  placedRunes: Record<string, RuneBlock> // socketId -> RuneBlock
  activeDragRune: RuneBlock | null
  hammerSwing: number // 0 to 1
  movesCount: number
  timeElapsedSeconds: number
  mistakesCount: number
  telemetry: SpellforgeTelemetry
}

export type SpellforgeAction =
  | { type: 'SELECT_RUNE'; rune: RuneBlock | null }
  | { type: 'SNAP_RUNE_TO_SOCKET'; socketId: string; rune: RuneBlock }
  | { type: 'REMOVE_RUNE_FROM_SOCKET'; socketId: string }
  | { type: 'CLEAR_ANVIL' }
  | { type: 'TRIGGER_HAMMER_STRIKE' }
  | { type: 'TICK_TIMER'; deltaSeconds: number }
  | { type: 'RESET_CHALLENGE' }
  | { type: 'LOAD_CHALLENGE'; challenge: SpellforgeChallenge }
