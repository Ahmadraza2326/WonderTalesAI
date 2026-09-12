import type { DifficultyTier } from '../experience'

export type BiomeTileType =
  | 'deep_water'
  | 'shallow_water'
  | 'sand'
  | 'grassland'
  | 'forest'
  | 'mountain'
  | 'snow_peak'
  | 'volcanic'

export type TrophicLevel = 'producer' | 'herbivore' | 'carnivore' | 'decomposer'

export type WeatherType = 'sunny' | 'rainy' | 'windy' | 'starlight'

export interface Organism {
  id: string
  species: string
  name: string
  emoji: string
  trophicLevel: TrophicLevel
  x: number
  y: number
  energy: number
  maxEnergy: number
  age: number
  isAlive: boolean
}

export interface SandboxTile {
  x: number
  y: number
  elevation: number
  biome: BiomeTileType
  moisture: number // 0 - 100
  fertility: number // 0 - 100
  vegetationLevel: number // 0 - 100
  organisms: Organism[]
  hasRiver?: boolean
}

export interface EcoScienceConcept {
  conceptTitle: string
  scienceTopic: string
  kidExplanation: string
  funFact: string
}

export interface EcosystemChallenge {
  id: string
  title: string
  difficulty: DifficultyTier
  seed: number | string
  gridWidth: number
  gridHeight: number
  initialWeather: WeatherType
  targetBiodiversityScore: number
  targetProducerCount: number
  targetHerbivoreCount: number
  targetCarnivoreCount: number
  maxCycles: number
  rewardStars: number
  rewardXP: number
  scientificConcept: EcoScienceConcept
  startingTiles: SandboxTile[][]
}

export interface EcosystemSimulationState {
  grid: SandboxTile[][]
  cycle: number
  weather: WeatherType
  biodiversityScore: number // 0 - 100
  producerCount: number
  herbivoreCount: number
  carnivoreCount: number
  decomposerCount: number
  isGoalAchieved: boolean
  statusMessage: string
}

export interface EcoToolMetadata {
  id: string
  name: string
  emoji: string
  category: 'terrain' | 'flora' | 'fauna' | 'weather'
  cost: number
  description: string
}
