import type { DifficultyTier } from '../experience'

export interface BeatPad {
  id: string
  noteName: string
  frequency: number
  color: string
  glowColor: string
  word: string
  emoji: string
  isRhyme: boolean
  syllableCount: number
  padIndex: number
}

export interface PhonemicDossier {
  conceptTitle: string
  scienceTopic: string
  funFact: string
  kidExplanation: string
}

export interface RhythmSpellSong {
  id: string
  title: string
  tempoBpm: number
  leadPrompt: string
  targetWord: string
  rhymeFamily: string
  rhymeRule: string
  verseLines: string[]
  scientificConcept: PhonemicDossier
}

export interface RhythmSpellsChallenge {
  id: string
  title: string
  difficulty: DifficultyTier
  tierNumber: number
  tempoBpm: number
  song: RhythmSpellSong
  targetRhymesCount: number
  pads: BeatPad[]
  parMoves: number
  timeTargetSeconds: number
}

export interface RhythmSpellsTelemetry {
  challengeId: string
  difficulty: DifficultyTier
  tapsCount: number
  perfectHits: number
  rhymesFound: number
  mistakesCount: number
  maxCombo: number
  score: number
  stars: number
  xp: number
  finalStatus: 'in_progress' | 'solved' | 'abandoned'
}

export interface RhythmSpellsState {
  currentChallenge: RhythmSpellsChallenge
  status: 'intro' | 'conducting' | 'spell_cast' | 'celebrating'
  activePads: BeatPad[]
  foundRhymeIds: string[]
  currentBeat: number
  combo: number
  score: number
  stars: number
  xp: number
  telemetry: RhythmSpellsTelemetry
}

export type RhythmSpellsAction =
  | { type: 'TAP_PAD'; padId: string; onBeatAccuracy?: number }
  | { type: 'BEAT_TICK' }
  | { type: 'RESOLVE_CHALLENGE' }
  | { type: 'RESET_CHALLENGE' }
  | { type: 'LOAD_CHALLENGE'; challenge: RhythmSpellsChallenge }
