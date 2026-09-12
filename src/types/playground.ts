import type { CognitiveDomain } from './experience'

/**
 * Unique identifiers for all 10 original ORBis Playground games + Creature Lab
 */
export type PlaygroundGameId =
  | 'potion_scales'
  | 'rhythm_spells'
  | 'word_trace'
  | 'magic_machine'
  | 'invention_lab'
  | 'spellforge'
  | 'ecosystem_sandbox'
  | 'mystery_detective'
  | 'robopath'
  | 'cosmic_constellations'
  // Legacy aliases supported safely
  | 'world_builder'
  | 'memory_museum'
  | 'creature_lab'
  | 'word_detective'
  | 'skyship_builder'
  | 'creature_care'
  | 'time_machine'
  | 'orbis_quest_run'

export type PlaygroundGameCategory =
  | 'linguistic_craft'
  | 'executive_memory'
  | 'physics_engineering'
  | 'deductive_logic'
  | 'ecological_systems'
  | 'musical_patterns'
  | 'empathy_simulation'
  | 'temporal_reasoning'
  | 'adventure_action'
  | 'alchemy_discovery'

export type PlaygroundReleaseStatus = 'playable' | 'coming_soon' | 'in_development'

/**
 * Comprehensive metadata contract for every Playground mini-game
 */
export interface PlaygroundGameMetadata {
  id: PlaygroundGameId
  title: string
  subtitle: string
  category: PlaygroundGameCategory
  primaryDomain: CognitiveDomain
  secondaryDomains: CognitiveDomain[]
  icon: string
  route: string
  ageRange: {
    min: number
    max: number
  }
  status: PlaygroundReleaseStatus
  isPlayable: boolean
  heroBannerColor: string
  accentGlow: string
  description: string
  learningObjectives: string[]
  keyMechanics: string[]
  estimatedSessionSeconds: number
  rankOrder: number
}

/**
 * Adaptive Difficulty System Contracts
 */
export type AdaptiveDifficultyTier = 'apprentice' | 'artisan' | 'master' | 'grandmaster'

export interface AdaptiveTelemetry {
  attemptCount: number
  correctCount: number
  errorCount: number
  consecutiveCorrectStreak: number
  averageResponseTimeMs: number
  hintsRequested: number
  lastDifficultyShiftAt?: string
}

export interface AdaptiveDifficultyProfile {
  childId: string
  gameId: PlaygroundGameId
  currentTier: AdaptiveDifficultyTier
  masteryScore: number // 0 to 100
  telemetry: AdaptiveTelemetry
  scaffoldingLevel: number // 0 (none) to 3 (heavy hints/slowdown)
}

/**
 * Progression & World Sanctuary Unlocks
 */
export type UnlockableItemType =
  | 'creature_companion'
  | 'biome_terrain'
  | 'architectural_prop'
  | 'cosmetic_accessory'
  | 'discovery_lore_card'
  | 'soundfont_pack'

export interface ProgressionUnlock {
  id: string
  title: string
  type: UnlockableItemType
  requiredMasteryTier?: AdaptiveDifficultyTier
  requiredStars: number
  requiredStardust: number
  unlockedAt?: string
  icon: string
  description: string
  gameOrigin: PlaygroundGameId
}

export interface PlaygroundUserInventory {
  childId: string
  stardustBalance: number
  trustHeartsBalance: number
  unlockedItemIds: string[]
  completedDiscoveries: string[]
  highestStreaks: Record<PlaygroundGameId, number>
}

/**
 * Play Session & Reward Summary Contract
 */
export interface PlaygroundSessionResult {
  gameId: PlaygroundGameId
  childId: string
  tierPlayed: AdaptiveDifficultyTier
  durationSeconds: number
  score: number
  accuracyPercentage: number
  xpEarned: number
  starsEarned: number
  stardustEarned: number
  newDiscoveries: string[]
  completedAt: string
}
