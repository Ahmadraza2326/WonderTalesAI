import type { DifficultyTier } from '../../types/experience'
import type {
  StructuralMaterial,
  StructuralMaterialType,
  BlueprintNode,
  PlacedBeam,
  InventionLabChallenge,
  InventionLabTelemetry,
  InventionLabState,
  InventionLabAction,
} from '../../types/games/inventionLab'
import { createPRNG } from './gameRegistry'

// ============================================================================
// 1. MASTER STRUCTURAL MATERIALS CATALOG
// ============================================================================

export const MASTER_MATERIALS: Record<StructuralMaterialType, StructuralMaterial> = {
  wood_beam: {
    type: 'wood_beam',
    name: 'Treated Pine Beam',
    cost: 10,
    maxTensionLoad: 35,
    maxCompressionLoad: 35,
    color: '#d97706',
    strokeWidth: 6,
    description: 'Lightweight and economical. Great for light spans and internal triangular bracing.',
  },
  steel_girder: {
    type: 'steel_girder',
    name: 'Reinforced Steel Girder',
    cost: 25,
    maxTensionLoad: 90,
    maxCompressionLoad: 90,
    color: '#38bdf8',
    strokeWidth: 8,
    description: 'Heavy and ultra-rigid. Built for primary road decks and heavy load bearing.',
  },
  cable_rope: {
    type: 'cable_rope',
    name: 'Braided Steel Cable',
    cost: 8,
    maxTensionLoad: 60,
    maxCompressionLoad: 4, // Cables buckle instantly under compression
    color: '#f59e0b',
    strokeWidth: 3,
    description: 'High tensile strength for suspension hangers, but buckles under compression.',
  },
  hydraulic_strut: {
    type: 'hydraulic_strut',
    name: 'Titanium Hydraulic Strut',
    cost: 35,
    maxTensionLoad: 140,
    maxCompressionLoad: 140,
    color: '#a855f7',
    strokeWidth: 9,
    description: 'Shock-absorbing titanium alloy with extreme load endurance.',
  },
}

// ============================================================================
// 2. CURATED MASTER ENGINEERING BLUEPRINTS
// ============================================================================

export const CURATED_INVENTION_CHALLENGES: InventionLabChallenge[] = [
  // EASY 1: The Sproutling Stream Bridge
  {
    id: 'easy_stream_bridge',
    title: 'Sproutling Stream Span',
    subtitle: 'Triangular Truss Mechanics & Roadway Decking',
    difficulty: 'easy',
    budget: 80,
    vehicleWeightKg: 20,
    chasmWidthMeters: 12,
    startNodeId: 'n_start',
    targetNodeId: 'n_target',
    nodes: [
      { id: 'n_start', x: 120, y: 260, isAnchor: true },
      { id: 'n_mid_top', x: 300, y: 150, isAnchor: false },
      { id: 'n_mid_deck', x: 300, y: 260, isAnchor: false },
      { id: 'n_target', x: 480, y: 260, isAnchor: true, isTarget: true },
    ],
    scientificConcept: {
      title: 'The Magic of Triangles (Trusses)',
      concept: 'A triangle is the most rigid shape in geometry because its side lengths fix its angles.',
      funFact: 'Engineers use Warren trusses on train bridges because triangles naturally distribute weight across all three sides!',
    },
  },
  // EASY 2: Canyon Crossing
  {
    id: 'easy_canyon_crossing',
    title: 'Whispering Canyon Crossing',
    subtitle: 'Suspension Hangers & Pier Anchors',
    difficulty: 'easy',
    budget: 95,
    vehicleWeightKg: 25,
    chasmWidthMeters: 16,
    startNodeId: 'n_start',
    targetNodeId: 'n_target',
    nodes: [
      { id: 'n_start', x: 100, y: 260, isAnchor: true },
      { id: 'n_tower_left', x: 100, y: 120, isAnchor: true },
      { id: 'n_deck_1', x: 260, y: 260, isAnchor: false },
      { id: 'n_deck_2', x: 420, y: 260, isAnchor: false },
      { id: 'n_tower_right', x: 580, y: 120, isAnchor: true },
      { id: 'n_target', x: 580, y: 260, isAnchor: true, isTarget: true },
    ],
    scientificConcept: {
      title: 'Tension vs Compression',
      concept: 'Tension is pulling force (like a rope); Compression is squishing force (like a pillar).',
      funFact: 'The Golden Gate Bridge cables are made of 80,000 miles of steel wire under massive tension!',
    },
  },
  // MEDIUM 1: Starling Cargo Chasm
  {
    id: 'med_cargo_chasm',
    title: 'Starling Heavy Cargo Chasm',
    subtitle: 'Dual-Span Pratt Truss Engineering',
    difficulty: 'medium',
    budget: 130,
    vehicleWeightKg: 45,
    chasmWidthMeters: 24,
    startNodeId: 'n_start',
    targetNodeId: 'n_target',
    nodes: [
      { id: 'n_start', x: 100, y: 260, isAnchor: true },
      { id: 'n_top_1', x: 240, y: 140, isAnchor: false },
      { id: 'n_deck_1', x: 240, y: 260, isAnchor: false },
      { id: 'n_top_2', x: 380, y: 140, isAnchor: false },
      { id: 'n_deck_2', x: 380, y: 260, isAnchor: false },
      { id: 'n_target', x: 520, y: 260, isAnchor: true, isTarget: true },
    ],
    scientificConcept: {
      title: 'Live Load vs Dead Load',
      concept: 'Dead load is the weight of the bridge itself; Live load is the weight of the vehicles driving across.',
      funFact: 'Engineers always design bridges to hold 3 to 5 times their maximum expected live load for safety!',
    },
  },
  // MEDIUM 2: Sky Arch Bridge
  {
    id: 'med_sky_arch',
    title: 'Crystal Arch Overpass',
    subtitle: 'Arch Compression & Thrust Blocks',
    difficulty: 'medium',
    budget: 140,
    vehicleWeightKg: 50,
    chasmWidthMeters: 26,
    startNodeId: 'n_start',
    targetNodeId: 'n_target',
    nodes: [
      { id: 'n_start', x: 80, y: 260, isAnchor: true },
      { id: 'n_deck_1', x: 220, y: 260, isAnchor: false },
      { id: 'n_deck_2', x: 360, y: 260, isAnchor: false },
      { id: 'n_deck_3', x: 500, y: 260, isAnchor: false },
      { id: 'n_arch_1', x: 220, y: 350, isAnchor: false },
      { id: 'n_arch_center', x: 360, y: 370, isAnchor: false },
      { id: 'n_arch_2', x: 500, y: 350, isAnchor: false },
      { id: 'n_target', x: 640, y: 260, isAnchor: true, isTarget: true },
    ],
    scientificConcept: {
      title: 'The Inverted Arch',
      concept: 'Arches push outward and downward against solid abutments, turning bending into pure compression.',
      funFact: 'Roman aqueducts built over 2,000 years ago still stand today because arch stones lock tighter under load!',
    },
  },
  // HARD 1: Titan Gorge Viaduct
  {
    id: 'hard_titan_viaduct',
    title: 'Titan Gorge Megastructure',
    subtitle: 'Deep Foundation Piers & Cable Stays',
    difficulty: 'hard',
    budget: 180,
    vehicleWeightKg: 75,
    chasmWidthMeters: 36,
    startNodeId: 'n_start',
    targetNodeId: 'n_target',
    nodes: [
      { id: 'n_start', x: 60, y: 240, isAnchor: true },
      { id: 'n_pier_top_1', x: 220, y: 90, isAnchor: false },
      { id: 'n_pier_base_1', x: 220, y: 380, isAnchor: true },
      { id: 'n_deck_1', x: 220, y: 240, isAnchor: false },
      { id: 'n_deck_2', x: 380, y: 240, isAnchor: false },
      { id: 'n_pier_top_2', x: 540, y: 90, isAnchor: false },
      { id: 'n_pier_base_2', x: 540, y: 380, isAnchor: true },
      { id: 'n_deck_3', x: 540, y: 240, isAnchor: false },
      { id: 'n_target', x: 700, y: 240, isAnchor: true, isTarget: true },
    ],
    scientificConcept: {
      title: 'Cable-Stayed Engineering',
      concept: 'Cables run directly from tall central towers to support road decks without needing gigantic anchorages.',
      funFact: 'The Millau Viaduct in France is taller than the Eiffel Tower and uses cable stays to span a whole mountain valley!',
    },
  },
  // HARD 2: Storm Fortress Causeway
  {
    id: 'hard_storm_causeway',
    title: 'Storm Fortress Quantum Causeway',
    subtitle: 'High-Wind Lateral Bracing & Load Resonance',
    difficulty: 'hard',
    budget: 210,
    vehicleWeightKg: 90,
    chasmWidthMeters: 40,
    startNodeId: 'n_start',
    targetNodeId: 'n_target',
    nodes: [
      { id: 'n_start', x: 60, y: 240, isAnchor: true },
      { id: 'n_top_1', x: 200, y: 120, isAnchor: false },
      { id: 'n_deck_1', x: 200, y: 240, isAnchor: false },
      { id: 'n_top_2', x: 370, y: 100, isAnchor: false },
      { id: 'n_deck_2', x: 370, y: 240, isAnchor: false },
      { id: 'n_top_3', x: 540, y: 120, isAnchor: false },
      { id: 'n_deck_3', x: 540, y: 240, isAnchor: false },
      { id: 'n_target', x: 680, y: 240, isAnchor: true, isTarget: true },
    ],
    scientificConcept: {
      title: 'Structural Redundancy',
      concept: 'If one support beam fails, redundant diagonal members safely carry the load until repaired.',
      funFact: 'Aircraft wings and suspension bridges are tested in giant wind tunnels to ensure they bend without breaking!',
    },
  },
]

// ============================================================================
// 3. DETERMINISTIC PRNG PROCEDURAL CHALLENGE GENERATOR
// ============================================================================

export function generateProceduralInventionChallenge(
  seedInput: number | string,
  difficulty: DifficultyTier = 'easy',
  _explorerLevel: number = 1
): InventionLabChallenge {
  const prng = createPRNG(seedInput)
  const tierPuzzles = CURATED_INVENTION_CHALLENGES.filter((p) => p.difficulty === difficulty)
  const basePuzzle = tierPuzzles.length ? prng.pick(tierPuzzles) : CURATED_INVENTION_CHALLENGES[0]

  return {
    ...basePuzzle,
    id: `${basePuzzle.id}_${prng.int(100, 999)}`,
  }
}

export function generateInventionChallenge(
  indexOrSeed: number | string = 0,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): InventionLabChallenge {
  if (typeof indexOrSeed === 'number' && indexOrSeed < CURATED_INVENTION_CHALLENGES.length) {
    const matching = CURATED_INVENTION_CHALLENGES.filter((p) => p.difficulty === difficulty)
    if (matching.length > 0) {
      return matching[Math.abs(indexOrSeed) % matching.length]
    }
  }
  return generateProceduralInventionChallenge(indexOrSeed, difficulty, explorerLevel)
}

// ============================================================================
// 4. PHYSICAL TRUSS & STRESS EVALUATION ENGINE
// ============================================================================

/**
 * Calculates real-time stress ratio (0.0 to 1.0+) across all placed beams.
 */
export function calculateBeamStresses(
  beams: PlacedBeam[],
  nodes: BlueprintNode[],
  vehicleProgress: number, // 0.0 to 1.0
  vehicleWeightKg: number
): { stresses: Record<string, number>; hasBroken: boolean; maxStress: number } {
  const stresses: Record<string, number> = {}
  let hasBroken = false
  let maxStress = 0

  const nodeMap = new Map<string, BlueprintNode>()
  nodes.forEach((n) => nodeMap.set(n.id, n))

  // Find start and target x positions
  const startNode = nodes.find((n) => n.isAnchor && n.x < 200) || nodes[0]
  const targetNode = nodes.find((n) => n.isTarget || (n.isAnchor && n.x > 400)) || nodes[nodes.length - 1]
  const vehicleX = startNode.x + (targetNode.x - startNode.x) * vehicleProgress

  beams.forEach((beam) => {
    const from = nodeMap.get(beam.fromNodeId)
    const to = nodeMap.get(beam.toNodeId)
    if (!from || !to) {
      stresses[beam.id] = 0
      return
    }

    const mat = MASTER_MATERIALS[beam.material]
    const midX = (from.x + to.x) / 2
    const distToVehicle = Math.abs(midX - vehicleX)

    // Base dead load from beam length
    const dx = to.x - from.x
    const dy = to.y - from.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const deadLoad = len * 0.04

    // Live load concentrated near vehicle
    const liveInfluence = Math.max(0, 1 - distToVehicle / 140)
    const liveLoad = vehicleWeightKg * liveInfluence

    // Trigonometric load resolution: horizontal components carry tension/compression
    const angle = Math.atan2(Math.abs(dy), Math.abs(dx))
    const verticalFactor = Math.sin(angle) + 0.35
    const totalEffectiveLoad = (deadLoad + liveLoad) * verticalFactor

    const maxCapacity = mat.maxTensionLoad
    const stressRatio = Math.round((totalEffectiveLoad / maxCapacity) * 100) / 100

    stresses[beam.id] = stressRatio
    if (stressRatio > maxStress) {
      maxStress = stressRatio
    }

    if (stressRatio > 1.0) {
      hasBroken = true
      beam.isBroken = true
    }
  })

  return { stresses, hasBroken, maxStress }
}

/**
 * Validates if the placed beams form a continuous road deck from start to target.
 */
export function hasContinuousDeckPath(
  beams: PlacedBeam[],
  startNodeId: string,
  targetNodeId: string
): boolean {
  const adj = new Map<string, Set<string>>()
  beams.forEach((b) => {
    if (b.isBroken) return
    if (!adj.has(b.fromNodeId)) adj.set(b.fromNodeId, new Set())
    if (!adj.has(b.toNodeId)) adj.set(b.toNodeId, new Set())
    adj.get(b.fromNodeId)!.add(b.toNodeId)
    adj.get(b.toNodeId)!.add(b.fromNodeId)
  })

  const visited = new Set<string>()
  const queue = [startNodeId]
  visited.add(startNodeId)

  while (queue.length > 0) {
    const curr = queue.shift()!
    if (curr === targetNodeId) return true

    const neighbors = adj.get(curr)
    if (neighbors) {
      for (const next of neighbors) {
        if (!visited.has(next)) {
          visited.add(next)
          queue.push(next)
        }
      }
    }
  }

  return false
}

// ============================================================================
// 5. SCORING & REWARD CONTRACT
// ============================================================================

export function calculateInventionScore(
  telemetry: InventionLabTelemetry,
  challenge: InventionLabChallenge
): { score: number; stars: number; xp: number } {
  let score = 70 // Base pass score

  // Budget efficiency bonus
  const budgetRatio = (challenge.budget - telemetry.budgetUsed) / challenge.budget
  if (budgetRatio > 0.3) score += 20
  else if (budgetRatio > 0.1) score += 10

  // Low trial bonus
  if (telemetry.testRunsCount <= 2) score += 10

  // Stress safety margin bonus
  if (telemetry.maxStressObserved < 0.75) score += 10

  score = Math.min(100, Math.max(50, score))

  const stars = score >= 90 ? 5 : score >= 75 ? 4 : 3
  const xp = challenge.difficulty === 'hard' ? 75 : challenge.difficulty === 'medium' ? 50 : 35

  return { score, stars, xp }
}

// ============================================================================
// 6. STATE MACHINE REDUCER & ACTIONS
// ============================================================================

export function getInitialInventionState(challenge: InventionLabChallenge): InventionLabState {
  return {
    challenge,
    placedBeams: [],
    selectedMaterial: 'wood_beam',
    activeStartNodeId: null,
    status: 'drafting',
    vehicleProgress: 0,
    vehicleY: 260,
    budgetRemaining: challenge.budget,
    telemetry: {
      challengeId: challenge.id,
      difficulty: challenge.difficulty,
      beamsPlaced: 0,
      budgetUsed: 0,
      testRunsCount: 0,
      isSuccessful: false,
      maxStressObserved: 0,
      score: 0,
      stars: 0,
      xp: 0,
    },
  }
}

export function evaluateInventionAction(
  state: InventionLabState,
  action: InventionLabAction
): InventionLabState {
  switch (action.type) {
    case 'SELECT_MATERIAL':
      return { ...state, selectedMaterial: action.material }

    case 'CLICK_NODE': {
      if (state.status === 'simulating') return state

      // If no start node selected, select this one
      if (!state.activeStartNodeId) {
        return { ...state, activeStartNodeId: action.nodeId }
      }

      // If clicked the same node, deselect
      if (state.activeStartNodeId === action.nodeId) {
        return { ...state, activeStartNodeId: null }
      }

      // Check if beam already exists between these two nodes
      const exists = state.placedBeams.some(
        (b) =>
          (b.fromNodeId === state.activeStartNodeId && b.toNodeId === action.nodeId) ||
          (b.fromNodeId === action.nodeId && b.toNodeId === state.activeStartNodeId)
      )

      if (exists) {
        return { ...state, activeStartNodeId: action.nodeId }
      }

      const mat = MASTER_MATERIALS[state.selectedMaterial]
      if (state.budgetRemaining < mat.cost) {
        return { ...state, activeStartNodeId: action.nodeId }
      }

      const newBeam: PlacedBeam = {
        id: `beam_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        fromNodeId: state.activeStartNodeId,
        toNodeId: action.nodeId,
        material: state.selectedMaterial,
        currentStress: 0,
        isBroken: false,
      }

      const nextBeams = [...state.placedBeams, newBeam]
      const nextBudgetRemaining = state.budgetRemaining - mat.cost

      return {
        ...state,
        placedBeams: nextBeams,
        budgetRemaining: nextBudgetRemaining,
        activeStartNodeId: action.nodeId, // Keep active to allow daisy chaining beams
        telemetry: {
          ...state.telemetry,
          beamsPlaced: nextBeams.length,
          budgetUsed: state.challenge.budget - nextBudgetRemaining,
        },
      }
    }

    case 'REMOVE_BEAM': {
      if (state.status === 'simulating') return state
      const target = state.placedBeams.find((b) => b.id === action.beamId)
      if (!target) return state

      const mat = MASTER_MATERIALS[target.material]
      const nextBeams = state.placedBeams.filter((b) => b.id !== action.beamId)
      const nextBudgetRemaining = state.budgetRemaining + mat.cost

      return {
        ...state,
        placedBeams: nextBeams,
        budgetRemaining: nextBudgetRemaining,
        telemetry: {
          ...state.telemetry,
          beamsPlaced: nextBeams.length,
          budgetUsed: state.challenge.budget - nextBudgetRemaining,
        },
      }
    }

    case 'CLEAR_BEAMS':
      return {
        ...state,
        placedBeams: [],
        activeStartNodeId: null,
        status: 'drafting',
        budgetRemaining: state.challenge.budget,
        telemetry: {
          ...state.telemetry,
          beamsPlaced: 0,
          budgetUsed: 0,
        },
      }

    case 'START_STRESS_TEST': {
      // Check if continuous path exists
      const hasPath = hasContinuousDeckPath(
        state.placedBeams,
        state.challenge.startNodeId,
        state.challenge.targetNodeId
      )

      if (!hasPath) {
        return {
          ...state,
          status: 'structural_failure',
        }
      }

      // Reset broken states
      const refreshedBeams = state.placedBeams.map((b) => ({ ...b, isBroken: false, currentStress: 0 }))

      return {
        ...state,
        placedBeams: refreshedBeams,
        status: 'simulating',
        vehicleProgress: 0,
        telemetry: {
          ...state.telemetry,
          testRunsCount: state.telemetry.testRunsCount + 1,
        },
      }
    }

    case 'UPDATE_SIMULATION_FRAME': {
      if (state.status !== 'simulating') return state

      // Apply beam stresses
      const updatedBeams = state.placedBeams.map((b) => ({
        ...b,
        currentStress: action.beamStresses[b.id] ?? b.currentStress,
        isBroken: b.isBroken || (action.beamStresses[b.id] ?? 0) > 1.0,
      }))

      if (action.hasBroken) {
        return {
          ...state,
          placedBeams: updatedBeams,
          status: 'structural_failure',
          vehicleProgress: action.progress,
        }
      }

      if (action.progress >= 1.0) {
        const scored = calculateInventionScore(state.telemetry, state.challenge)
        return {
          ...state,
          placedBeams: updatedBeams,
          status: 'success',
          vehicleProgress: 1.0,
          telemetry: {
            ...state.telemetry,
            isSuccessful: true,
            score: scored.score,
            stars: scored.stars,
            xp: scored.xp,
          },
        }
      }

      return {
        ...state,
        placedBeams: updatedBeams,
        vehicleProgress: action.progress,
        vehicleY: action.vehicleY,
      }
    }

    case 'RESET_TO_DRAFT':
      return {
        ...state,
        status: 'drafting',
        vehicleProgress: 0,
        activeStartNodeId: null,
      }

    case 'LOAD_CHALLENGE':
      return getInitialInventionState(action.challenge)

    default:
      return state
  }
}
