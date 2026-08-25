import type { DifficultyTier } from '../experience'

export type WeightItemType = 'crystal' | 'gem' | 'ingot' | 'powder' | 'liquid_beaker' | 'mystery_box'

export interface WeightItem {
  id: string
  name: string
  emoji: string
  weight: number
  displayWeightLabel: string
  type: WeightItemType
  color: string
  glowColor: string
  volumeMl?: number
  isFraction?: boolean
  fractionLabel?: string
  isMystery?: boolean
  mysteryHiddenWeight?: number
}

export type ScalePanSide = 'left' | 'right'

export interface PlacedWeightInstance {
  instanceId: string
  item: WeightItem
  pan: ScalePanSide
  placedAtTimestamp: number
}

export interface ScaleEquilibrium {
  leftTotalWeight: number
  rightTotalWeight: number
  weightDifference: number
  tiltAngleDeg: number
  isBalanced: boolean
  isNearBalanced: boolean
}

export interface PotionScienceDossier {
  conceptTitle: string
  scienceTopic: string
  funFact: string
  kidExplanation: string
}

export interface PotionCustomer {
  id: string
  name: string
  species: string
  avatar: string
  orderQuote: string
  celebrationQuote: string
}

export interface PotionRecipe {
  potionId: string
  potionName: string
  potionEmoji: string
  potionColor: string
  potionGlow: string
  targetWeight: number
  displayTargetFormula: string
  customer: PotionCustomer
  leftStartingItems: WeightItem[]
  rightStartingItems: WeightItem[]
  availableInventory: WeightItem[]
  allowLiquidPouring?: boolean
  targetVolumeMl?: number
  solutionHint: string
}

export interface PotionScalesPuzzle {
  id: string
  title: string
  difficulty: DifficultyTier
  tierNumber: number
  parMoves: number
  recipe: PotionRecipe
  scientificConcept: PotionScienceDossier
}

export interface PotionScalesTelemetry {
  puzzleId: string
  difficulty: DifficultyTier
  movesCount: number
  timeElapsedSeconds: number
  mistakesCount: number
  score: number
  stars: number
  xp: number
  finalStatus: 'in_progress' | 'solved' | 'abandoned'
}

export interface PotionScalesState {
  currentPuzzle: PotionScalesPuzzle
  status: 'brewing' | 'balanced' | 'celebrating'
  placedItems: PlacedWeightInstance[]
  activeSelectedItem: WeightItem | null
  activePourVolumeMl: number
  movesCount: number
  timeElapsedSeconds: number
  mistakesCount: number
  equilibrium: ScaleEquilibrium
  telemetry: PotionScalesTelemetry
}

export type PotionScalesAction =
  | { type: 'SELECT_INVENTORY_ITEM'; item: WeightItem | null }
  | { type: 'PLACE_ITEM'; item: WeightItem; pan: ScalePanSide }
  | { type: 'REMOVE_ITEM'; instanceId: string }
  | { type: 'CLEAR_PAN'; pan: ScalePanSide }
  | { type: 'POUR_LIQUID'; pan: ScalePanSide; amountMl: number; weightPerMl?: number }
  | { type: 'TICK_TIMER'; deltaSeconds: number }
  | { type: 'RESET_PUZZLE' }
  | { type: 'LOAD_PUZZLE'; puzzle: PotionScalesPuzzle }
