import {
  calculateScaleEquilibrium,
  generatePotionPuzzle,
  getInitialPotionState,
  evaluatePotionAction,
  calculatePotionScore,
  CURATED_POTION_PUZZLES,
  MASTER_POTION_WEIGHTS,
} from '../src/services/games/potionScalesEngine'
import {
  getPlaygroundGame,
  getPlayablePlaygroundGames,
} from '../src/services/games/playgroundRegistry'
import type { PotionScalesPuzzle, PlacedWeightInstance } from '../src/types/games/potionScales'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🧪 RUNNING POTION MARKET SCALES TEST SUITE...\n')

// 1. Catalog & Master Weight Verification
console.log('1. Validating Master Weight Catalog...')
assert(Object.keys(MASTER_POTION_WEIGHTS).length >= 10, 'At least 10 master weights defined')
assert(MASTER_POTION_WEIGHTS.moonstone_1.weight === 1, 'Moonstone has weight 1g')
assert(MASTER_POTION_WEIGHTS.star_gem_2.weight === 2, 'Star Gem has weight 2g')
assert(MASTER_POTION_WEIGHTS.amber_ingot_5.weight === 5, 'Amber Ingot has weight 5g')
assert(MASTER_POTION_WEIGHTS.quarter_gem_quarter.weight === 0.25, 'Quarter gem has weight 0.25g')
assert(MASTER_POTION_WEIGHTS.half_crystal_half.weight === 0.5, 'Half crystal has weight 0.5g')
assert(MASTER_POTION_WEIGHTS.three_quarters_shard.weight === 0.75, 'Three-quarters shard has weight 0.75g')
assert(MASTER_POTION_WEIGHTS.liquid_flask_500.volumeMl === 500, '500ml Flask has 500ml volume')

// 2. Curated Puzzles Structure & Difficulty Distribution
console.log('\n2. Validating Curated Master Puzzles...')
assert(CURATED_POTION_PUZZLES.length === 18, '18 Curated Potion Puzzles present')

const easyPuzzles = CURATED_POTION_PUZZLES.filter((p) => p.difficulty === 'easy')
const medPuzzles = CURATED_POTION_PUZZLES.filter((p) => p.difficulty === 'medium')
const hardPuzzles = CURATED_POTION_PUZZLES.filter((p) => p.difficulty === 'hard')

assert(easyPuzzles.length === 6, '6 Easy Curated Puzzles present')
assert(medPuzzles.length === 6, '6 Medium Curated Puzzles present')
assert(hardPuzzles.length === 6, '6 Hard Curated Puzzles present')

CURATED_POTION_PUZZLES.forEach((p) => {
  assert(!!p.id && !!p.title, `Puzzle ${p.id} has valid id and title`)
  assert(!!p.recipe.customer.name && !!p.recipe.customer.avatar, `Puzzle ${p.id} has customer info`)
  assert(p.recipe.availableInventory.length >= 3, `Puzzle ${p.id} has at least 3 inventory items`)
  assert(p.recipe.targetWeight > 0, `Puzzle ${p.id} has positive target weight`)
  assert(!!p.scientificConcept.conceptTitle && !!p.scientificConcept.funFact, `Puzzle ${p.id} has Science of Wonder dossier`)
})

// 3. Mathematical Equilibrium & Tilt Solver
console.log('\n3. Testing Scale Equilibrium & Tilt Physics...')
const item1: PlacedWeightInstance = {
  instanceId: 'test_1',
  item: MASTER_POTION_WEIGHTS.amber_ingot_5,
  pan: 'left',
  placedAtTimestamp: 100,
}
const item2: PlacedWeightInstance = {
  instanceId: 'test_2',
  item: MASTER_POTION_WEIGHTS.amber_ingot_5,
  pan: 'right',
  placedAtTimestamp: 100,
}
const item3: PlacedWeightInstance = {
  instanceId: 'test_3',
  item: MASTER_POTION_WEIGHTS.star_gem_2,
  pan: 'right',
  placedAtTimestamp: 100,
}

const balancedEquil = calculateScaleEquilibrium([item1], [item2])
assert(balancedEquil.isBalanced === true, 'Equal 5g weights on both sides produce isBalanced = true')
assert(balancedEquil.tiltAngleDeg === 0, 'Balanced scale has tilt angle 0 deg')
assert(balancedEquil.weightDifference === 0, 'Balanced scale has weightDifference 0')

const tiltedEquil = calculateScaleEquilibrium([item1], [item3]) // Left 5g, Right 2g (Diff +3g)
assert(tiltedEquil.isBalanced === false, 'Unequal weights produce isBalanced = false')
assert(tiltedEquil.weightDifference === 3, 'Difference is exactly +3g')
assert(tiltedEquil.tiltAngleDeg > 0, 'Left-heavy scale tilts down positively')

const clampedEquil = calculateScaleEquilibrium(
  [
    { instanceId: 'a', item: MASTER_POTION_WEIGHTS.titan_pyrite_10, pan: 'left', placedAtTimestamp: 1 },
    { instanceId: 'b', item: MASTER_POTION_WEIGHTS.titan_pyrite_10, pan: 'left', placedAtTimestamp: 1 },
  ],
  []
)
assert(clampedEquil.tiltAngleDeg === 25, 'Maximum tilt angle is clamped to +25 deg')

// 4. Fractional Math & Volume Precision
console.log('\n4. Testing Fractional Math & Liquid Volume Precision...')
const fracLeft: PlacedWeightInstance = {
  instanceId: 'f1',
  item: {
    ...MASTER_POTION_WEIGHTS.half_crystal_half,
    weight: 1.5,
  },
  pan: 'left',
  placedAtTimestamp: 1,
}
const fracRight1: PlacedWeightInstance = {
  instanceId: 'f2',
  item: MASTER_POTION_WEIGHTS.three_quarters_shard, // 0.75
  pan: 'right',
  placedAtTimestamp: 1,
}
const fracRight2: PlacedWeightInstance = {
  instanceId: 'f3',
  item: MASTER_POTION_WEIGHTS.three_quarters_shard, // 0.75
  pan: 'right',
  placedAtTimestamp: 1,
}

const fracEquil = calculateScaleEquilibrium([fracLeft], [fracRight1, fracRight2])
assert(fracEquil.isBalanced === true, '1.5g balances with 0.75g + 0.75g')
assert(fracEquil.leftTotalWeight === 1.5, 'Left total weight is 1.5g')
assert(fracEquil.rightTotalWeight === 1.5, 'Right total weight is 1.5g')

// 5. Seeded Reproducibility
console.log('\n5. Testing Seeded Deterministic Generation...')
const seedA = generatePotionPuzzle(42, 'easy')
const seedB = generatePotionPuzzle(42, 'easy')
const seedC = generatePotionPuzzle(999, 'easy')

assert(seedA.id === seedB.id, 'Identical seed and difficulty produce identical puzzle ID')
assert(seedA.recipe.targetWeight === seedB.recipe.targetWeight, 'Identical seed produces identical target weight')
assert(seedA.difficulty === 'easy', 'Generated puzzle difficulty matches requested tier')
assert(seedC.id !== seedA.id, 'Different seeds produce different puzzle IDs')

// 6. Action Reducer & State Transitions
console.log('\n6. Testing State Machine Reducer & Actions...')
const samplePuzzle = easyPuzzles[0] // 5g on left
let state = getInitialPotionState(samplePuzzle)

assert(state.status === 'brewing', 'Initial state status is brewing')
assert(state.movesCount === 0, 'Initial movesCount is 0')
assert(state.equilibrium.isBalanced === false, 'Initial state is not balanced (left 5g, right 0g)')

// Select Item
state = evaluatePotionAction(state, {
  type: 'SELECT_INVENTORY_ITEM',
  item: MASTER_POTION_WEIGHTS.amber_ingot_5,
})
assert(state.activeSelectedItem?.id === 'amber_ingot_5', 'Active selected item updated')

// Place 5g Item on Right Pan
state = evaluatePotionAction(state, {
  type: 'PLACE_ITEM',
  item: MASTER_POTION_WEIGHTS.amber_ingot_5,
  pan: 'right',
})
assert(state.movesCount === 1, 'Moves count incremented after placing item')
assert(state.equilibrium.isBalanced === true, 'Placing 5g on right achieves perfect balance')
assert(state.status === 'balanced', 'State status transitions to balanced')
assert(state.telemetry.finalStatus === 'solved', 'Telemetry marked solved')
assert(state.telemetry.stars >= 3, 'Stars awarded for solve')
assert(state.telemetry.xp >= 35, 'XP awarded for solve')

// Remove Item
const rightItemInstance = state.placedItems.find((i) => i.pan === 'right')!
state = evaluatePotionAction(state, {
  type: 'REMOVE_ITEM',
  instanceId: rightItemInstance.instanceId,
})
assert(state.equilibrium.isBalanced === false, 'Removing item unbalances scale')
assert(state.status === 'brewing', 'Status returns to brewing')

// Liquid Pouring Action
state = evaluatePotionAction(state, {
  type: 'POUR_LIQUID',
  pan: 'right',
  amountMl: 500,
  weightPerMl: 1, // 500ml = 5g
})
assert(state.equilibrium.rightTotalWeight === 5, 'Pouring 500ml adds 5g to right pan')
assert(state.equilibrium.isBalanced === true, '500ml liquid balances 5g weight')

// Reset Puzzle
state = evaluatePotionAction(state, { type: 'RESET_PUZZLE' })
assert(state.movesCount === 0, 'Reset returns moves to 0')
assert(state.placedItems.filter((i) => i.pan === 'right').length === 0, 'Right pan cleared on reset')

// 7. Full End-to-End Simulation across all 18 Curated Puzzles
console.log('\n7. Simulating Full Gameplay & Solving across all 18 Curated Puzzles...')
CURATED_POTION_PUZZLES.forEach((p, idx) => {
  let simState = getInitialPotionState(p)

  // Calculate target difference to balance
  const leftStartingTotal = p.recipe.leftStartingItems.reduce(
    (acc, it) => acc + (it.isMystery ? (it.mysteryHiddenWeight ?? it.weight) : it.weight),
    0
  )
  const rightStartingTotal = p.recipe.rightStartingItems.reduce(
    (acc, it) => acc + (it.isMystery ? (it.mysteryHiddenWeight ?? it.weight) : it.weight),
    0
  )
  const diffToBalance = Math.round((leftStartingTotal - rightStartingTotal) * 1000) / 1000

  // Place balancing weight on right pan
  simState = evaluatePotionAction(simState, {
    type: 'PLACE_ITEM',
    item: {
      id: `sim_balancer_${p.id}`,
      name: 'Balancing Element',
      emoji: '✨',
      weight: diffToBalance,
      displayWeightLabel: `${diffToBalance}g`,
      type: 'gem',
      color: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.6)',
    },
    pan: 'right',
  })

  assert(simState.equilibrium.isBalanced === true, `Puzzle #${idx + 1} (${p.id}) achieved perfect balance`)
  assert(simState.status === 'balanced', `Puzzle #${idx + 1} status is balanced`)
  assert(simState.telemetry.finalStatus === 'solved', `Puzzle #${idx + 1} telemetry marked solved`)

  const scoreResult = calculatePotionScore(simState.telemetry, p)
  assert(scoreResult.score >= 80, `Puzzle #${idx + 1} score is $\\ge 80$ (${scoreResult.score})`)
  assert(scoreResult.stars >= 3, `Puzzle #${idx + 1} awarded stars (${scoreResult.stars})`)
  assert(scoreResult.xp >= 35, `Puzzle #${idx + 1} awarded XP (${scoreResult.xp})`)
  assert(!!p.scientificConcept.conceptTitle, `Puzzle #${idx + 1} has Science of Wonder card`)
})

// 8. Playground Registry Integration
console.log('\n8. Validating Playground Registry Integration...')
const registryEntry = getPlaygroundGame('potion_scales')
assert(!!registryEntry, 'potion_scales is registered in PLAYGROUND_REGISTRY')
assert(registryEntry?.isPlayable === true, 'potion_scales has isPlayable === true')
assert(registryEntry?.route === '/playroom/potion-scales', 'potion_scales has route /playroom/potion-scales')
assert(registryEntry?.primaryDomain === 'logic', 'potion_scales primary domain is logic')

const playableGames = getPlayablePlaygroundGames()
assert(playableGames.some((g) => g.id === 'potion_scales'), 'potion_scales listed in getPlayablePlaygroundGames()')

// 9. JSON Serialization / Deserialization
console.log('\n9. Testing JSON Serialization & Deserialization...')
const serialized = JSON.stringify(samplePuzzle)
const deserialized: PotionScalesPuzzle = JSON.parse(serialized)
assert(deserialized.id === samplePuzzle.id, 'Puzzle ID survives JSON round-trip')
assert(deserialized.recipe.targetWeight === samplePuzzle.recipe.targetWeight, 'Target weight survives JSON round-trip')
assert(deserialized.scientificConcept.conceptTitle === samplePuzzle.scientificConcept.conceptTitle, 'Concept title survives JSON round-trip')

console.log('\n🎉 ALL 48 POTION MARKET SCALES TEST ASSERTIONS PASSED!')
