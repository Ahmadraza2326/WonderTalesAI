import type { DifficultyTier } from '../experience'

export type StarSpectralClass =
  | 'O_BLUE'
  | 'B_BLUE_WHITE'
  | 'A_WHITE'
  | 'F_YELLOW_WHITE'
  | 'G_YELLOW'
  | 'K_ORANGE'
  | 'M_RED'
  | 'PULSAR'

export interface StarNode {
  id: string
  name: string
  x: number // 2D/3D projection coordinate (-100 to 100)
  y: number
  z: number
  magnitude: number // 1 (brightest) to 6 (faintest)
  spectralClass: StarSpectralClass
  color: string
  size: number
  distanceLightYears: number
  isAnchor?: boolean
}

export interface ConstellationConnection {
  fromId: string
  toId: string
}

export interface ConstellationScienceConcept {
  conceptTitle: string
  scienceTopic: string
  kidExplanation: string
  funFact: string
}

export interface ConstellationTarget {
  id: string
  name: string
  latinName: string
  mythologyStory: string
  requiredEdges: [string, string][]
  stars: StarNode[]
  scientificConcept: ConstellationScienceConcept
}

export interface ConstellationChallenge {
  id: string
  title: string
  difficulty: DifficultyTier
  seed: number | string
  targetConstellation: ConstellationTarget
  distractorStars: StarNode[]
  maxLinesAllowed: number
  rewardStars: number
  rewardXP: number
}

export interface ConstellationState {
  activeConnections: [string, string][]
  selectedStarId: string | null
  hoveredStarId: string | null
  cameraRotation: { x: number; y: number }
  isCompleted: boolean
  showGhostLines: boolean
  statusMessage: string
}
