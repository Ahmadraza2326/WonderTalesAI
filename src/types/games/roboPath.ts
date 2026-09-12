import type { DifficultyTier } from '../experience'

/**
 * 🤖 Directional & Control Program Tokens
 */
export type RoboToken =
  | 'FORWARD' // Move 1 tile forward in facing direction
  | 'TURN_LEFT' // Rotate 90 degrees counter-clockwise
  | 'TURN_RIGHT' // Rotate 90 degrees clockwise
  | 'JUMP' // Jump over a 1-tile gap, water canal, or laser hazard
  | 'LOOP_2X' // Repeat the subsequent sub-routine or token 2 times
  | 'GRAB_GEM' // Collect energy crystal on current tile

export interface TokenMetadata {
  token: RoboToken
  name: string
  symbol: string
  emoji: string
  color: string
  glowColor: string
  description: string
  energyCost: number
}

export type CompassDirection = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST'

export type TileType =
  | 'floor'
  | 'wall'
  | 'water'
  | 'laser_gate'
  | 'battery_beacon'
  | 'energy_crystal'
  | 'spring_launcher'

export interface GridTile {
  x: number
  y: number
  type: TileType
  elevation: number
  isGoal?: boolean
  hasCrystal?: boolean
  isLaserActive?: boolean
  isVisited?: boolean
}

export interface RobotState {
  x: number
  y: number
  direction: CompassDirection
  energy: number
  maxEnergy: number
  crystalsCollected: number
  isAlive: boolean
  isGoalReached: boolean
  statusMessage: string
}

export interface ScienceConcept {
  conceptTitle: string
  scienceTopic: string
  funFact: string
  kidExplanation: string
}

export interface RoboPathChallenge {
  id: string
  title: string
  subtitle: string
  seed: number
  difficulty: DifficultyTier
  gridWidth: number
  gridHeight: number
  tiles: GridTile[][]
  startPos: { x: number; y: number }
  startDirection: CompassDirection
  beaconPos: { x: number; y: number }
  totalCrystals: number
  maxTokens: number
  parMoves: number
  allowedTokens: RoboToken[]
  scientificConcept: ScienceConcept
  rewardXP: number
  rewardStars: number
  hint: string
}

export interface ProgramStepResult {
  stepIndex: number
  token: RoboToken
  tokenIndex: number
  previousState: RobotState
  nextState: RobotState
  actionTaken: string
  isSuccess: boolean
  errorMessage?: string
  sfxCue: 'step' | 'turn' | 'jump' | 'crystal' | 'beacon' | 'bump' | 'laser'
}

export interface ExecutionTrace {
  success: boolean
  steps: ProgramStepResult[]
  finalState: RobotState
  tokensUsed: number
  crystalsCollected: number
  goalReached: boolean
  parScoreDelta: number
  errorMessage?: string
}

export interface RoboPathTelemetry {
  attempts: number
  tokensUsed: number
  parDelta: number
  executionStepsCount: number
  crystalsCollected: number
  totalCrystals: number
  starsEarned: number
  xpEarned: number
  completedAt: string
}
