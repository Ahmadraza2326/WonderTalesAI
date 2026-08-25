import {
  generateLevel,
  getInitialState,
  evaluateAction,
  stepSimulation,
  calculateScore,
  MAGIC_MACHINE_PUZZLES,
  COMPONENT_METADATA,
} from '../src/services/games/magicMachineEngine'
import { PLAYGROUND_REGISTRY } from '../src/services/games/playgroundRegistry'
import type { MachineState, MachineTelemetry } from '../src/types/games/magicMachine'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🧪 RUNNING MAGIC MACHINE LAB ENGINE TEST SUITE...\n')

// 1. Puzzle Config & Metadata Validation
console.log('1. Validating 12 Curated Deterministic Puzzles & Component Metadata...')
assert(MAGIC_MACHINE_PUZZLES.length === 12, '12 Curated Puzzles are present in engine')
const easyPuzzles = MAGIC_MACHINE_PUZZLES.filter((p) => p.difficulty === 'easy')
const medPuzzles = MAGIC_MACHINE_PUZZLES.filter((p) => p.difficulty === 'medium')
const hardPuzzles = MAGIC_MACHINE_PUZZLES.filter((p) => p.difficulty === 'hard')
assert(easyPuzzles.length === 4, '4 Easy puzzles defined')
assert(medPuzzles.length === 4, '4 Medium puzzles defined')
assert(hardPuzzles.length === 4, '4 Hard puzzles defined')

MAGIC_MACHINE_PUZZLES.forEach((p) => {
  assert(!!p.id && !!p.title && !!p.subtitle, `Puzzle ${p.id} has title and subtitle`)
  assert(p.goal.x > 0 && p.goal.y > 0 && p.goal.radius > 0, `Puzzle ${p.id} has valid goal`)
  assert(p.availableToolbox.length > 0, `Puzzle ${p.id} has available toolbox items`)
  assert(!!p.scientificConcept.title && !!p.scientificConcept.funFact, `Puzzle ${p.id} has scientific dossier`)
})

assert(Object.keys(COMPONENT_METADATA).length >= 11, 'All 11 physical component types are defined with metadata')

// 2. Level Generator
console.log('\n2. Testing Level Generator (generateLevel)...')
const genEasy = generateLevel(0, 'easy')
assert(genEasy.id === 'easy_gentle_slopes', 'generateLevel(0, "easy") returns first easy puzzle')
const genMed = generateLevel(1, 'medium')
assert(genMed.id === 'med_magnetic_ascent', 'generateLevel(1, "medium") returns second medium puzzle')
const genHard = generateLevel('test-seed-42', 'hard')
assert(genHard.difficulty === 'hard', 'generateLevel with seed returns hard puzzle')

// 3. Initial State Factory
console.log('\n3. Testing getInitialState Factory...')
const state = getInitialState(genEasy)
assert(state.simulationStatus === 'design', 'Initial state status is "design"')
assert(state.actor.x === genEasy.startPos.x && state.actor.y === genEasy.startPos.y, 'Actor spawned at startPos')
assert(state.placedComponents.length === 0, 'No components placed initially')
assert(state.actor.vx === 0 && state.actor.vy === 0, 'Actor initially at rest')

// 4. Action Evaluator (Reducer)
console.log('\n4. Testing evaluateAction Reducer...')

// Add component
const stateWithRamp = evaluateAction(state, {
  type: 'ADD_COMPONENT',
  componentType: 'ramp_right',
  x: 100,
  y: 180,
})
assert(stateWithRamp.placedComponents.length === 1, 'Component added successfully')
assert(stateWithRamp.placedComponents[0].type === 'ramp_right', 'Added component has correct type')
assert(stateWithRamp.selectedComponentId === stateWithRamp.placedComponents[0].id, 'New component is auto-selected')

// Check toolbox limit enforcement
const maxRamps = genEasy.availableToolbox.find((t) => t.type === 'ramp_right')?.maxCount || 2
let limitState = stateWithRamp
for (let i = 1; i < maxRamps; i++) {
  limitState = evaluateAction(limitState, {
    type: 'ADD_COMPONENT',
    componentType: 'ramp_right',
    x: 200 + i * 50,
    y: 200,
  })
}
assert(limitState.placedComponents.length === maxRamps, `Placed max allowed ramps (${maxRamps})`)

const overLimitState = evaluateAction(limitState, {
  type: 'ADD_COMPONENT',
  componentType: 'ramp_right',
  x: 400,
  y: 200,
})
assert(overLimitState.placedComponents.length === maxRamps, 'Toolbox maxCount limit prevents exceeding component count')

// Move component
const movedState = evaluateAction(limitState, {
  type: 'MOVE_COMPONENT',
  id: limitState.placedComponents[0].id,
  x: 150,
  y: 220,
})
assert(movedState.placedComponents[0].x === 150 && movedState.placedComponents[0].y === 220, 'Component moved correctly')

// Remove component
const compIdToRemove = limitState.placedComponents[0].id
const removedState = evaluateAction(limitState, {
  type: 'REMOVE_COMPONENT',
  id: compIdToRemove,
})
assert(removedState.placedComponents.length === maxRamps - 1, 'Component removed correctly')
assert(!removedState.placedComponents.some((c) => c.id === compIdToRemove), 'Target component no longer exists')

// Start, Pause, Reset Simulation
const startedState = evaluateAction(removedState, { type: 'START_SIMULATION' })
assert(startedState.simulationStatus === 'running', 'START_SIMULATION sets running status')
assert(startedState.actor.state === 'running', 'Actor state set to running')
assert(startedState.telemetry.attempts === 1, 'Attempts counter incremented')

const pausedState = evaluateAction(startedState, { type: 'PAUSE_SIMULATION' })
assert(pausedState.simulationStatus === 'paused', 'PAUSE_SIMULATION sets paused status')

const resetState = evaluateAction(pausedState, { type: 'RESET_SIMULATION' })
assert(resetState.simulationStatus === 'design', 'RESET_SIMULATION returns to design status')
assert(resetState.actor.x === genEasy.startPos.x && resetState.actor.y === genEasy.startPos.y, 'Actor reset to startPos')

// 5. 2D Physics Step Simulation & Force Fields
console.log('\n5. Testing 2D Physics Step Simulation & Force Mechanics...')

// Gravity acceleration
let freeFallState: MachineState = {
  ...getInitialState(genEasy),
  simulationStatus: 'running',
  actor: {
    ...getInitialState(genEasy).actor,
    isGrounded: false,
    vx: 0,
    vy: 0,
  },
}
freeFallState = stepSimulation(freeFallState, 0.1)
assert(freeFallState.actor.vy > 0, 'Gravity accelerates actor downward')
assert(freeFallState.actor.y > genEasy.startPos.y, 'Actor position integrates downward')

// Spring impulse
let springState: MachineState = {
  ...getInitialState(genEasy),
  simulationStatus: 'running',
  placedComponents: [
    {
      id: 'spring_test',
      type: 'spring_up',
      x: 100,
      y: 200,
      width: 70,
      height: 30,
      isFixed: false,
    },
  ],
  actor: {
    ...getInitialState(genEasy).actor,
    x: 130,
    y: 195, // touching top of spring
    vx: 0,
    vy: 100, // moving downward
  },
}
springState = stepSimulation(springState, 0.016)
assert(springState.actor.vy < -500, 'Spring applies powerful upward launch impulse')
assert(springState.telemetry.bouncesCount >= 1, 'Telemetry records spring bounce event')

// Fan airflow acceleration
let fanState: MachineState = {
  ...getInitialState(genEasy),
  simulationStatus: 'running',
  placedComponents: [
    {
      id: 'fan_test',
      type: 'fan_right',
      x: 100,
      y: 200,
      width: 50,
      height: 60,
      isFixed: false,
    },
  ],
  actor: {
    ...getInitialState(genEasy).actor,
    x: 140, // within airflow column
    y: 220,
    vx: 0,
    vy: 0,
  },
}
fanState = stepSimulation(fanState, 0.05)
assert(fanState.actor.vx > 0, 'Fan accelerates actor horizontally to the right')
assert(fanState.telemetry.fanLaunchesCount >= 1, 'Telemetry records fan thrust')

// Magnet attraction
let magnetState: MachineState = {
  ...getInitialState(genEasy),
  simulationStatus: 'running',
  placedComponents: [
    {
      id: 'magnet_test',
      type: 'magnet_attract',
      x: 200,
      y: 200,
      width: 60,
      height: 60,
      isFixed: false,
    },
  ],
  actor: {
    ...getInitialState(genEasy).actor,
    x: 150, // to the left of magnet
    y: 230,
    vx: 0,
    vy: 0,
  },
}
magnetState = stepSimulation(magnetState, 0.05)
assert(magnetState.actor.vx > 0, 'Magnet pulls actor towards its center')

// Goal reach success
let goalReachState: MachineState = {
  ...getInitialState(genEasy),
  simulationStatus: 'running',
  actor: {
    ...getInitialState(genEasy).actor,
    x: genEasy.goal.x,
    y: genEasy.goal.y,
    vx: 10,
    vy: 10,
  },
}
goalReachState = stepSimulation(goalReachState, 0.016)
assert(goalReachState.simulationStatus === 'success', 'Goal proximity triggers simulation success status')
assert(goalReachState.actor.state === 'success', 'Actor state set to success')
assert(goalReachState.telemetry.score > 0, 'Telemetry calculates final score')

// Out of bounds fail
let outOfBoundsState: MachineState = {
  ...getInitialState(genEasy),
  simulationStatus: 'running',
  actor: {
    ...getInitialState(genEasy).actor,
    x: 100,
    y: 600, // below bottom boundary
  },
}
outOfBoundsState = stepSimulation(outOfBoundsState, 0.016)
assert(outOfBoundsState.simulationStatus === 'failed', 'Falling out of bounds triggers simulation failed status')

// 6. Score & Reward Calculation
console.log('\n6. Testing calculateScore Scoring Formula...')
const perfectTelemetry: MachineTelemetry = {
  attempts: 1,
  componentsPlaced: 2,
  simulationDurationMs: 3500,
  finalState: 'success',
  score: 0,
  stars: 0,
  xp: 0,
  bouncesCount: 1,
  fanLaunchesCount: 1,
  magnetPullsCount: 0,
}
const perfectRes = calculateScore(perfectTelemetry, genEasy)
assert(perfectRes.isPerfect === true, 'Perfect solve identified within par and 1 attempt')
assert(perfectRes.score === 100, 'Perfect solve awards 100 score')
assert(perfectRes.stars === 5, 'Easy perfect solve awards 5 stars (3 base + 2 bonus)')
assert(perfectRes.xp === 50, 'Easy perfect solve awards 50 XP (30 base + 20 bonus)')

// Hard level rewards
const hardConfig = generateLevel(0, 'hard')
const hardRes = calculateScore(perfectTelemetry, hardConfig)
assert(hardRes.stars === 10, 'Hard perfect solve awards 10 stars (8 base + 2 bonus)')
assert(hardRes.xp === 100, 'Hard perfect solve awards 100 XP (80 base + 20 bonus)')

// 7. Playground Registry Validation
console.log('\n7. Validating Playground Registry Integration...')
const regEntry = PLAYGROUND_REGISTRY.magic_machine
assert(!!regEntry, 'magic_machine registered in PLAYGROUND_REGISTRY')
assert(regEntry.isPlayable === true, 'magic_machine is marked as isPlayable: true')
assert(regEntry.status === 'playable', 'magic_machine has status: "playable"')
assert(regEntry.route === '/playroom/magic-machine', 'magic_machine has correct route')

console.log('\n🎉 ALL 24 MAGIC MACHINE LAB ENGINE ASSERTIONS PASSED!')
