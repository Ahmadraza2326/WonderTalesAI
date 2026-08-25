import type { CognitiveDomain } from '../experience'

export type GameCategory =
  | 'discovery'
  | 'spatial_physics'
  | 'arcade_speed'
  | 'logic_deduction'
  | 'coding_algorithm'
  | 'rhythm_music'
  | 'systems_ecology'
  | 'narrative_craft'
  | 'etymology_words'

export type GameReleaseStatus = 'playable' | 'coming_soon' | 'in_development'

export interface StandaloneGameMetadata {
  id: string
  title: string
  subtitle: string
  category: GameCategory
  primaryDomain: CognitiveDomain
  secondaryDomains: CognitiveDomain[]
  icon: string
  route: string
  ageMin: number
  ageMax: number
  status: GameReleaseStatus
  heroBannerColor: string
  accentGlow: string
  description: string
  features: string[]
}

export interface StoryGameContext {
  storyId?: string
  storyTitle?: string
  vocabulary?: string[]
  characters?: string[]
  theme?: string
}

export interface ChildGameProgress {
  childId: string
  gameId: string
  highScore?: number
  unlockedTiers?: string[]
  discoveredItemsCount?: number
  lastPlayedAt?: string
}
