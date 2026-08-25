import type { ElementalFamily } from './creatureLab'

export type SanctuaryBiome =
  | 'all'
  | 'grove'
  | 'crystal_cave'
  | 'cloud_citadel'
  | 'stardust_observatory'

export type CreatureMood =
  | 'ecstatic'
  | 'happy'
  | 'content'
  | 'hungry'
  | 'sleepy'

export interface ElementalTreat {
  id: string
  name: string
  emoji: string
  family: ElementalFamily
  description: string
  primaryColor: string
  glowColor: string
  happinessBoost: number
  friendshipXp: number
}

export interface SanctuaryCreatureState {
  creatureId: string
  customNickname?: string
  happiness: number // 0 to 100
  friendshipLevel: number // 1 to 10
  friendshipXp: number // XP toward next friendship level
  totalPetted: number
  totalFed: number
  lastFedAt: string
  lastPettedAt: string
  currentMood: CreatureMood
  favoriteFoodMatchCount: number
}

export interface SanctuaryData {
  childId: string
  activeBiome: SanctuaryBiome
  creatures: Record<string, SanctuaryCreatureState>
  treats: Record<string, number>
  lastDailyTreatRefill: string
  totalPatsEver: number
  totalFeedingsEver: number
}

export interface FeedResult {
  success: boolean
  isFavorite: boolean
  happinessBefore: number
  happinessAfter: number
  happinessGained: number
  friendshipXpGained: number
  leveledUp: boolean
  newLevel: number
  message: string
}

export interface PetResult {
  happinessBefore: number
  happinessAfter: number
  happinessGained: number
  friendshipXpGained: number
  totalPetted: number
  reactionSound: string
  reactionEmoji: string
  message: string
}
