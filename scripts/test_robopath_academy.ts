import assert from 'node:assert/strict'
import {
  TOKEN_CATALOG,
  DIRECTION_DELTAS,
  rotateDirection,
  ROBO_SCIENCE_CONCEPTS,
  executeRoboProgram,
  generateProceduralRoboPathChallenge,
} from '../src/services/games/roboPathEngine'
import type { RoboToken } from '../src/types/games/roboPath'

console.log('==================================================================')
console.log('🤖 RUNNING 3D ROBO-PATH ACADEMY ENGINE & AST VERIFICATION SUITE')
console.log('==================================================================\n')

let passed = 0
let total = 0

function test(name: string, fn: () => void) {
  total++
  try {
    fn()
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`)
    throw err
  }
}

// --- 1. Token Catalog & Directional Compass Arithmetic ---
console.log('🧭 1. Token Catalog & Directional Compass Arithmetic')

test('Token catalog contains all 6 core programming tokens', () => {
  const expectedTokens: RoboToken[] = ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'LOOP_2X', 'GRAB_GEM']
  for (const t of expectedTokens) {
    assert.ok(TOKEN_CATALOG[t], `Token ${t} must exist in catalog`)
    assert.ok(TOKEN_CATALOG[t].energyCost > 0, `Token ${t} must have positive energy cost`)
    assert.ok(TOKEN_CATALOG[t].symbol.length > 0, `Token ${t} must have a display symbol`)
  }
})

test('Compass directions rotate 90° clockwise accurately', () => {
  assert.equal(rotateDirection('NORTH', 'RIGHT'), 'EAST')
  assert.equal(rotateDirection('EAST', 'RIGHT'), 'SOUTH')
  assert.equal(rotateDirection('SOUTH', 'RIGHT'), 'WEST')
  assert.equal(rotateDirection('WEST', 'RIGHT'), 'NORTH')
})

test('Compass directions rotate 90° counter-clockwise accurately', () => {
  assert.equal(rotateDirection('NORTH', 'LEFT'), 'WEST')
  assert.equal(rotateDirection('WEST', 'LEFT'), 'SOUTH')
  assert.equal(rotateDirection('SOUTH', 'LEFT'), 'EAST')
  assert.equal(rotateDirection('EAST', 'LEFT'), 'NORTH')
})

test('Direction deltas translate correctly to 2D Cartesian grid vectors', () => {
  assert.deepEqual(DIRECTION_DELTAS.NORTH, { dx: 0, dy: -1 })
  assert.deepEqual(DIRECTION_DELTAS.EAST, { dx: 1, dy: 0 })
  assert.deepEqual(DIRECTION_DELTAS.SOUTH, { dx: 0, dy: 1 })
  assert.deepEqual(DIRECTION_DELTAS.WEST, { dx: -1, dy: 0 })
})

// --- 2. Deterministic Mulberry32 Procedural Generation ---
console.log('\n🎲 2. Deterministic Mulberry32 Procedural Generation')

test('Identical seeds generate identical challenges', () => {
  const c1 = generateProceduralRoboPathChallenge(424242, 'medium')
  const c2 = generateProceduralRoboPathChallenge(424242, 'medium')

  assert.equal(c1.id, c2.id)
  assert.equal(c1.gridWidth, c2.gridWidth)
  assert.equal(c1.gridHeight, c2.gridHeight)
  assert.deepEqual(c1.startPos, c2.startPos)
  assert.deepEqual(c1.beaconPos, c2.beaconPos)
  assert.equal(c1.totalCrystals, c2.totalCrystals)
})

test('Difficulty levels scale grid dimensions and crystal counts appropriately', () => {
  const easy = generateProceduralRoboPathChallenge('seed_easy', 'easy')
  const medium = generateProceduralRoboPathChallenge('seed_med', 'medium')
  const hard = generateProceduralRoboPathChallenge('seed_hard', 'hard')

  assert.equal(easy.gridWidth, 5)
  assert.equal(easy.gridHeight, 5)
  assert.equal(easy.totalCrystals, 1)

  assert.equal(medium.gridWidth, 6)
  assert.equal(medium.gridHeight, 6)
  assert.equal(medium.totalCrystals, 2)

  assert.equal(hard.gridWidth, 7)
  assert.equal(hard.gridHeight, 7)
  assert.equal(hard.totalCrystals, 3)
})

// --- 3. AST Program Interpreter Execution ---
console.log('\n💻 3. AST Program Interpreter Execution')

test('FORWARD moves BEEP-0 in the facing direction', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  // Clear any obstacle on (0, 3)
  challenge.tiles[3][0].type = 'floor'

  const trace = executeRoboProgram(challenge, ['FORWARD'])
  assert.equal(trace.steps.length, 1)
  assert.equal(trace.steps[0].nextState.x, 0)
  assert.equal(trace.steps[0].nextState.y, 3)
  assert.equal(trace.steps[0].sfxCue, 'step')
})

test('TURN_RIGHT then FORWARD moves East', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  challenge.tiles[4][1].type = 'floor'

  const trace = executeRoboProgram(challenge, ['TURN_RIGHT', 'FORWARD'])
  assert.equal(trace.steps.length, 2)
  assert.equal(trace.finalState.direction, 'EAST')
  assert.equal(trace.finalState.x, 1)
  assert.equal(trace.finalState.y, 4)
})

test('JUMP propels robot 2 tiles forward over gaps', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  challenge.tiles[3][0].type = 'water' // Gap in between
  challenge.tiles[2][0].type = 'floor' // Landing target

  const trace = executeRoboProgram(challenge, ['JUMP'])
  assert.equal(trace.steps.length, 1)
  assert.equal(trace.finalState.x, 0)
  assert.equal(trace.finalState.y, 2)
  assert.equal(trace.steps[0].sfxCue, 'jump')
  assert.equal(trace.finalState.isAlive, true)
})

test('LOOP_2X repeats subsequent token 2 times', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  challenge.tiles[3][0].type = 'floor'
  challenge.tiles[2][0].type = 'floor'

  const trace = executeRoboProgram(challenge, ['LOOP_2X', 'FORWARD'])
  assert.equal(trace.steps.length, 2)
  assert.equal(trace.finalState.y, 2)
  assert.equal(trace.tokensUsed, 2)
})

// --- 4. Collision Safety & Boundary Defense ---
console.log('\n🛡️ 4. Collision Safety & Boundary Defense')

test('Out of bounds collision halts execution safely without exception', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  // Turn West and step (out of bounds from x=0)
  const trace = executeRoboProgram(challenge, ['TURN_LEFT', 'FORWARD', 'FORWARD'])
  assert.equal(trace.steps[1].isSuccess, false)
  assert.equal(trace.steps[1].sfxCue, 'bump')
  assert.equal(trace.finalState.x, 0)
})

test('Wall collision halts execution safely', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  challenge.tiles[3][0].type = 'wall'

  const trace = executeRoboProgram(challenge, ['FORWARD'])
  assert.equal(trace.steps[0].isSuccess, false)
  assert.equal(trace.steps[0].sfxCue, 'bump')
  assert.equal(trace.finalState.y, 4)
})

// --- 5. Goal Activation & Science Concepts ---
console.log('\n🌟 5. Goal Activation & Science Concepts')

test('Reaching beacon with all required crystals triggers victory', () => {
  const challenge = generateProceduralRoboPathChallenge(1337, 'easy')
  // Manually setup small 2x2 test board
  challenge.gridWidth = 2
  challenge.gridHeight = 2
  challenge.startPos = { x: 0, y: 1 }
  challenge.startDirection = 'NORTH'
  challenge.beaconPos = { x: 1, y: 0 }
  challenge.totalCrystals = 1
  challenge.tiles = [
    [{ x: 0, y: 0, type: 'energy_crystal', elevation: 0, hasCrystal: true }, { x: 1, y: 0, type: 'battery_beacon', elevation: 0, isGoal: true }],
    [{ x: 0, y: 1, type: 'floor', elevation: 0 }, { x: 1, y: 1, type: 'floor', elevation: 0 }],
  ]

  // Program: FORWARD (get crystal) -> TURN_RIGHT -> FORWARD (reach beacon)
  const trace = executeRoboProgram(challenge, ['FORWARD', 'TURN_RIGHT', 'FORWARD'])
  assert.equal(trace.success, true)
  assert.equal(trace.goalReached, true)
  assert.equal(trace.crystalsCollected, 1)
  assert.equal(trace.finalState.isGoalReached, true)
})

test('Science concepts contain kid explanations and fun facts', () => {
  assert.ok(ROBO_SCIENCE_CONCEPTS.length >= 5)
  for (const concept of ROBO_SCIENCE_CONCEPTS) {
    assert.ok(concept.conceptTitle.length > 0)
    assert.ok(concept.kidExplanation.length > 0)
    assert.ok(concept.funFact.length > 0)
  }
})

console.log('\n==================================================================')
console.log(`🏆 ALL ${passed}/${total} ROBO-PATH ACADEMY TEST ASSERTIONS PASSED!`)
console.log('==================================================================\n')
