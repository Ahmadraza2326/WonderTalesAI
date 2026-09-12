export type ElementalFamily =
  | 'lumina'
  | 'flora'
  | 'aero'
  | 'pyro'
  | 'terra'
  | 'cosmic'

export type CreatureRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Essence {
  id: string
  name: string
  shortDescription: string
  family: ElementalFamily
  glyph: string
  primaryColor: string
  glowColor: string
  soundCue: string
}

export interface CreatureTrait {
  name: string
  emoji: string
  description: string
}

export interface ScientificConcept {
  name: string
  explanation: string
  funFact: string
}

export interface CreatureRecipe {
  essenceIds: string[]
  catalystId?: string
  temperature?: 'cool' | 'warm' | 'blazing'
}

export type CreatureMutationVariant =
  | 'normal'
  | 'golden'
  | 'spectral'
  | 'iridescent'
  | 'starlight_celestial'

export interface CreatureMutation {
  variant: CreatureMutationVariant
  name: string
  titlePrefix: string
  auraColor: string
  sparkleEmoji: string
  bonusXp: number
  bonusStars: number
  mutationDescription: string
  specialTrait: CreatureTrait
}

export interface CreatureSpecies {
  id: string
  name: string
  speciesTitle: string
  family: ElementalFamily
  rarity: CreatureRarity
  isSecret?: boolean
  emoji: string
  primaryColor: string
  secondaryColor: string
  glowColor: string
  personality: string
  scientificConcept: ScientificConcept
  favoriteFood: string
  soundCue: string
  loreSnippet: string
  clue: string
  recipe: CreatureRecipe
  traits: CreatureTrait[]
  habitatPreference: 'grove' | 'crystal_cave' | 'cloud_citadel' | 'stardust_observatory'
  mutation?: CreatureMutation
}

export interface DiscoveredCreatureMetadata {
  creatureId: string
  discoveredAt: string
  recipeEssences: string[]
  discoveryCount: number
  customNickname?: string
  mutationVariant?: CreatureMutationVariant
}

export interface HappyAccidentReaction {
  id: string
  name: string
  emoji: string
  description: string
  concept?: string
  rewardStardust: number
  primaryColor: string
  secondaryColor: string
}

export interface BrewResult {
  type: 'creature' | 'happy_accident'
  creature?: CreatureSpecies
  reaction?: HappyAccidentReaction
  isNewDiscovery: boolean
  xpAwarded: number
  starsAwarded: number
  stardustAwarded: number
  mutation?: CreatureMutation
}

export type CauldronState =
  | 'idle'
  | 'ready_to_brew'
  | 'stirring'
  | 'revealing'
  | 'hatched'

export interface GuestMigrationResult {
  migratedCount: number
  stardustTransferred: number
  success: boolean
}


