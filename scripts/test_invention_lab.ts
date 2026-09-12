import assert from 'node:assert'
import {
  MASTER_MATERIALS,
  CURATED_INVENTION_CHALLENGES,
  generateProceduralInventionChallenge,
  generateInventionChallenge,
  calculateBeamStresses,
  hasContinuousDeckPath,
  calculateInventionScore,
  getInitialInventionState,
  evaluateInventionAction,
} from '../src/services/games/inventionLabEngine'
import {
  getPlaygroundGame,
  getPlayablePlaygroundGames,
} from '../src/services/games/playgroundRegistry'
import type { PlacedBeam } from '../src/types/games/inventionLab'

console.log('🧪 RUNNING INVENTION LAB STRUCTURAL ENGINEERING TEST SUITE...\n')

// ----------------------------------------------------------------------------
// 1. MASTER STRUCTURAL MATERIALS CATALOG
// ----------------------------------------------------------------------------
console.log('1. Validating Structural Materials Catalog...')
assert.ok(MASTER_MATERIALS.wood_beam.cost === 10, 'Wood beam costs 10 tokens')
assert.ok(MASTER_MATERIALS.steel_girder.cost === 25, 'Steel girder costs 25 tokens')
assert.ok(MASTER_MATERIALS.cable_rope.cost === 8, 'Cable rope costs 8 tokens')
assert.ok(MASTER_MATERIALS.hydraulic_strut.cost === 35, 'Hydraulic strut costs 35 tokens')
assert.ok(MASTER_MATERIALS.steel_girder.maxTensionLoad > MASTER_MATERIALS.wood_beam.maxTensionLoad, 'Steel holds more tension than wood')
assert.ok(MASTER_MATERIALS.cable_rope.maxCompressionLoad < 10, 'Cables have minimal compression resistance (buckling)')
console.log('  ✅ [PASS] All 4 structural materials verified with physical properties and costs')

// ----------------------------------------------------------------------------
// 2. CURATED ENGINEERING BLUEPRINTS
// ----------------------------------------------------------------------------
console.log('\n2. Validating Curated Master Engineering Challenges...')
assert.strictEqual(CURATED_INVENTION_CHALLENGES.length, 6, '6 Curated engineering blueprints present')

const easyPuzzles = CURATED_INVENTION_CHALLENGES.filter((p) => p.difficulty === 'easy')
const medPuzzles = CURATED_INVENTION_CHALLENGES.filter((p) => p.difficulty === 'medium')
const hardPuzzles = CURATED_INVENTION_CHALLENGES.filter((p) => p.difficulty === 'hard')

assert.strictEqual(easyPuzzles.length, 2, '2 Easy challenges')
assert.strictEqual(medPuzzles.length, 2, '2 Medium challenges')
assert.strictEqual(hardPuzzles.length, 2, '2 Hard challenges')

CURATED_INVENTION_CHALLENGES.forEach((p) => {
  assert.ok(p.id.length > 0, `Challenge ${p.id} has valid id`)
  assert.ok(p.title.length > 0, `Challenge ${p.id} has title`)
  assert.ok(p.budget >= 50, `Challenge ${p.id} has adequate budget (${p.budget})`)
  assert.ok(p.nodes.length >= 4, `Challenge ${p.id} has at least 4 blueprint nodes`)
  assert.ok(p.scientificConcept.title.length > 0, `Challenge ${p.id} has Science of Wonder dossier`)
})
console.log('  ✅ [PASS] All curated blueprints validated across Easy, Medium, and Hard tiers')

// ----------------------------------------------------------------------------
// 3. DETERMINISTIC PRNG PROCEDURAL GENERATION
// ----------------------------------------------------------------------------
console.log('\n3. Testing Seeded PRNG Reproducibility...')
const seedA = generateProceduralInventionChallenge('seed_omega_42', 'easy', 1)
const seedB = generateProceduralInventionChallenge('seed_omega_42', 'easy', 1)
const seedC = generateProceduralInventionChallenge('seed_zeta_99', 'easy', 1)
const indexedChallenge = generateInventionChallenge(0, 'easy', 1)

assert.strictEqual(seedA.id, seedB.id, 'Identical seeds produce identical challenge ID')
assert.strictEqual(seedA.budget, seedB.budget, 'Identical seeds produce identical budget')
assert.notStrictEqual(seedA.id, seedC.id, 'Different seeds produce different challenge IDs')
assert.ok(indexedChallenge.id.length > 0, 'generateInventionChallenge returns valid challenge')
console.log('  ✅ [PASS] Seed determinism verified across PRNG invocations')

// ----------------------------------------------------------------------------
// 4. GRAPH TOPOLOGY & CONTINUOUS DECK PATH
// ----------------------------------------------------------------------------
console.log('\n4. Testing Continuous Road Deck Path Validation...')
const sample = easyPuzzles[0] // Nodes: n_start (x:120), n_mid_deck (x:300), n_target (x:480)

const incompleteBeams: PlacedBeam[] = [
  { id: 'b1', fromNodeId: 'n_start', toNodeId: 'n_mid_deck', material: 'wood_beam', currentStress: 0, isBroken: false },
]
assert.strictEqual(
  hasContinuousDeckPath(incompleteBeams, sample.startNodeId, sample.targetNodeId),
  false,
  'Incomplete bridge is not a continuous path'
)

const completeBeams: PlacedBeam[] = [
  { id: 'b1', fromNodeId: 'n_start', toNodeId: 'n_mid_deck', material: 'wood_beam', currentStress: 0, isBroken: false },
  { id: 'b2', fromNodeId: 'n_mid_deck', toNodeId: 'n_target', material: 'wood_beam', currentStress: 0, isBroken: false },
]
assert.strictEqual(
  hasContinuousDeckPath(completeBeams, sample.startNodeId, sample.targetNodeId),
  true,
  'Continuous span from start to target validates to true'
)
console.log('  ✅ [PASS] Graph search correctly identifies continuous vs fragmented bridge spans')

// ----------------------------------------------------------------------------
// 5. PHYSICAL STRESS & LOAD SIMULATION
// ----------------------------------------------------------------------------
console.log('\n5. Testing Physical Stress Calculations & Failure Breaking...')
// Under light vehicle (20kg), wood beams hold
const stressResult = calculateBeamStresses(completeBeams, sample.nodes, 0.5, 20)
assert.strictEqual(stressResult.hasBroken, false, 'Wood beams do not break under light 20kg vehicle')
assert.ok(stressResult.maxStress > 0 && stressResult.maxStress < 1.0, 'Stress is within safe limits (0 < s < 1.0)')

// Under massive overload (300kg), wood beams exceed 1.0 and break
const overloadResult = calculateBeamStresses(completeBeams, sample.nodes, 0.5, 300)
assert.strictEqual(overloadResult.hasBroken, true, 'Wood beams break when overloaded with 300kg vehicle')
console.log('  ✅ [PASS] Physical load calculation and tensile breaking threshold verified')

// ----------------------------------------------------------------------------
// 6. STATE MACHINE REDUCER & ACTIONS
// ----------------------------------------------------------------------------
console.log('\n6. Testing State Machine Reducer & Gameplay Actions...')
let state = getInitialInventionState(sample)
assert.strictEqual(state.status, 'drafting')
assert.strictEqual(state.budgetRemaining, sample.budget)
assert.strictEqual(state.placedBeams.length, 0)

// Select Material
state = evaluateInventionAction(state, { type: 'SELECT_MATERIAL', material: 'steel_girder' })
assert.strictEqual(state.selectedMaterial, 'steel_girder')

// Connect Node: n_start -> n_mid_deck
state = evaluateInventionAction(state, { type: 'CLICK_NODE', nodeId: 'n_start' })
assert.strictEqual(state.activeStartNodeId, 'n_start')

state = evaluateInventionAction(state, { type: 'CLICK_NODE', nodeId: 'n_mid_deck' })
assert.strictEqual(state.placedBeams.length, 1, 'First beam placed')
assert.strictEqual(state.budgetRemaining, sample.budget - 25, 'Budget deducted 25 for steel girder')

// Connect Node: n_mid_deck -> n_target
state = evaluateInventionAction(state, { type: 'CLICK_NODE', nodeId: 'n_target' })
assert.strictEqual(state.placedBeams.length, 2, 'Second beam placed')
assert.strictEqual(state.budgetRemaining, sample.budget - 50, 'Budget deducted another 25 tokens')

// Start Simulation
state = evaluateInventionAction(state, { type: 'START_STRESS_TEST' })
assert.strictEqual(state.status, 'simulating', 'Status transitions to simulating')
assert.strictEqual(state.telemetry.testRunsCount, 1, 'Test run count incremented')

// Step Simulation to Completion (progress = 1.0)
state = evaluateInventionAction(state, {
  type: 'UPDATE_SIMULATION_FRAME',
  progress: 1.0,
  vehicleY: 260,
  beamStresses: { [state.placedBeams[0].id]: 0.45, [state.placedBeams[1].id]: 0.45 },
  hasBroken: false,
})

assert.strictEqual(state.status, 'success', 'Bridge successfully crossed, status is success')
assert.strictEqual(state.telemetry.isSuccessful, true)
assert.ok(state.telemetry.stars >= 3, 'Stars awarded on success')
assert.ok(state.telemetry.xp >= 30, 'XP awarded on success')

const customScore = calculateInventionScore(state.telemetry, sample)
assert.ok(customScore.score >= 70, 'calculateInventionScore computes valid pass score')
console.log('  ✅ [PASS] Complete drafting, placing, budgeting, stress simulation, and victory flow verified')

// ----------------------------------------------------------------------------
// 7. PLAYGROUND REGISTRY INTEGRATION
// ----------------------------------------------------------------------------
console.log('\n7. Testing Playground Registry Entry...')
const regEntry = getPlaygroundGame('invention_lab')
assert.ok(regEntry !== undefined, 'invention_lab is registered in PLAYGROUND_REGISTRY')
assert.strictEqual(regEntry?.isPlayable, true, 'invention_lab isPlayable === true')
assert.strictEqual(regEntry?.route, '/playroom/invention-lab', 'invention_lab route is /playroom/invention-lab')
assert.strictEqual(regEntry?.icon, '🏗️', 'invention_lab has unique 🏗️ icon')
assert.strictEqual(regEntry?.subtitle, 'Structural Engineering & Blueprint Workshop')

const playable = getPlayablePlaygroundGames()
assert.ok(playable.some((g) => g.id === 'invention_lab'), 'invention_lab is listed in getPlayablePlaygroundGames()')
console.log('  ✅ [PASS] Invention Lab properly registered and distinguished in Playground Registry')

console.log('\n🎉 ALL 18 INVENTION LAB TEST SUITE ASSERTIONS PASSED!\n')
