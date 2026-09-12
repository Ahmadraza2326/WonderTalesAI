import type { DifficultyTier } from '../experience'

export type StructuralMaterialType = 'wood_beam' | 'steel_girder' | 'cable_rope' | 'hydraulic_strut'

export interface StructuralMaterial {
  type: StructuralMaterialType
  name: string
  cost: number // In scrap tokens
  maxTensionLoad: number // kg
  maxCompressionLoad: number // kg
  color: string
  strokeWidth: number
  description: string
}

export interface BlueprintNode {
  id: string
  x: number // Screen/Canvas X
  y: number // Screen/Canvas Y
  isAnchor: boolean // Fixed to mountain/bedrock
  isTarget?: boolean // Goal destination
}

export interface PlacedBeam {
  id: string
  fromNodeId: string
  toNodeId: string
  material: StructuralMaterialType
  currentStress: number // 0.0 to 1.0+ (breaks if > 1.0)
  isBroken: boolean
}

export interface InventionLabChallenge {
  id: string
  title: string
  subtitle: string
  difficulty: DifficultyTier
  budget: number // Scrap token budget
  vehicleWeightKg: number
  chasmWidthMeters: number
  nodes: BlueprintNode[]
  targetNodeId: string
  startNodeId: string
  requiredMaterial?: StructuralMaterialType
  scientificConcept: {
    title: string
    concept: string
    funFact: string
  }
}

export interface InventionLabTelemetry {
  challengeId: string
  difficulty: DifficultyTier
  beamsPlaced: number
  budgetUsed: number
  testRunsCount: number
  isSuccessful: boolean
  maxStressObserved: number
  score: number
  stars: number
  xp: number
}

export interface InventionLabState {
  challenge: InventionLabChallenge
  placedBeams: PlacedBeam[]
  selectedMaterial: StructuralMaterialType
  activeStartNodeId: string | null
  status: 'drafting' | 'simulating' | 'success' | 'structural_failure'
  vehicleProgress: number // 0.0 to 1.0 (crossing bridge)
  vehicleY: number
  budgetRemaining: number
  telemetry: InventionLabTelemetry
}

export type InventionLabAction =
  | { type: 'SELECT_MATERIAL'; material: StructuralMaterialType }
  | { type: 'CLICK_NODE'; nodeId: string }
  | { type: 'REMOVE_BEAM'; beamId: string }
  | { type: 'CLEAR_BEAMS' }
  | { type: 'START_STRESS_TEST' }
  | { type: 'UPDATE_SIMULATION_FRAME'; progress: number; vehicleY: number; beamStresses: Record<string, number>; hasBroken: boolean }
  | { type: 'RESET_TO_DRAFT' }
  | { type: 'LOAD_CHALLENGE'; challenge: InventionLabChallenge }
