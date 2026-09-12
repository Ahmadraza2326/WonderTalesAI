import assert from 'node:assert/strict'
import {
  PROCEDURAL_GAME_REGISTRY,
  getAllProceduralGames,
  getProceduralGame,
  getPlayableProceduralGames,
  getProceduralGamesByDomain,
  createPRNG,
  generateGameSessionSeed,
  generateProceduralChallenge,
  GAME_SVG_ICONS,
  LEGACY_GAME_ALIAS_MAP,
  type ProceduralGameId,
} from '../src/services/games/gameRegistry'

console.log('🧪 RUNNING 10-GAME PROCEDURAL REGISTRY TEST SUITE...')

// 1. Validate all 10 Games Exist in Registry
const expectedGames: ProceduralGameId[] = [
  'creature_alchemist',
  'clockwork_physics',
  'midnight_detective',
  'apothecary_scales',
  'spellforge_anvil',
  'memory_museum',
  'rhythm_conductor',
  'robopath_academy',
  'ecosystem_sandbox',
  'cosmic_constellation',
]

console.log('1. Checking All 10 Game Definitions...')
assert.equal(Object.keys(PROCEDURAL_GAME_REGISTRY).length, 10, 'Registry must have exactly 10 games')

for (const gameId of expectedGames) {
  const game = PROCEDURAL_GAME_REGISTRY[gameId]
  assert.ok(game, `Game ${gameId} must exist in registry`)
  assert.equal(game.id, gameId, `Game id must match key: ${gameId}`)
  assert.ok(game.title.length > 0, `Game ${gameId} must have title`)
  assert.ok(game.discipline.length > 0, `Game ${gameId} must have scientific discipline`)
  assert.ok(game.learningObjectives.length >= 3, `Game ${gameId} must have at least 3 learning objectives`)
  assert.ok(game.keyMechanics.length >= 2, `Game ${gameId} must have key mechanics`)
  assert.ok(game.physicsEngineType.length > 0, `Game ${gameId} must define physicsEngineType`)
  assert.ok(game.emoji.length > 0, `Game ${gameId} must have emoji`)
  assert.ok(game.svgIcon.includes('<svg'), `Game ${gameId} must have valid SVG icon markup`)
  assert.ok(game.route.startsWith('/'), `Game ${gameId} must have valid route`)
  console.log(`  ✓ [PASS] ${game.title} (${game.discipline}) - ${game.status}`)
}

// 2. Test Deterministic Mulberry32 PRNG
console.log('\n2. Testing Deterministic PRNG Generator...')
const prng1 = createPRNG(12345)
const prng2 = createPRNG(12345)
const val1a = prng1.next()
const val2a = prng2.next()
assert.equal(val1a, val2a, 'PRNG with identical seeds must generate identical sequence')

const seq1 = [prng1.int(1, 100), prng1.int(1, 100), prng1.int(1, 100)]
const seq2 = [prng2.int(1, 100), prng2.int(1, 100), prng2.int(1, 100)]
assert.deepEqual(seq1, seq2, 'PRNG integer streams must match identically')

const prngString = createPRNG('test-seed-xyz')
assert.ok(prngString.seed > 0, 'String seed hashing must produce positive integer')
console.log('  ✓ [PASS] PRNG seed determinism verified')

// 3. Test Procedural Challenge Generation for all 10 games
console.log('\n3. Testing Procedural Challenge Generation across All 10 Games...')
for (const gameId of expectedGames) {
  const seed = 9999
  const challenge = generateProceduralChallenge(gameId, seed, 'medium')
  assert.equal(challenge.gameId, gameId, 'Challenge must reference correct gameId')
  assert.equal(challenge.seed, seed, 'Challenge must retain seed')
  assert.equal(challenge.difficulty, 'medium', 'Challenge must match difficulty')
  assert.ok(challenge.title.length > 0, 'Challenge must have generated title')
  assert.ok(challenge.scientificConcept.name.length > 0, 'Challenge must have scientific concept')
  assert.ok(challenge.rewardXP > 0, 'Challenge must grant XP')
  assert.ok(challenge.rewardStars > 0, 'Challenge must grant Stars')
  console.log(`  ✓ [PASS] ${challenge.gameId}: "${challenge.title}" (${challenge.scientificConcept.name})`)
}

// 4. Test Legacy Game ID Alias Mapping
console.log('\n4. Testing Backward Compatibility & Aliasing...')
assert.equal(getProceduralGame('creature_lab')?.id, 'creature_alchemist')
assert.equal(getProceduralGame('magic_machine')?.id, 'clockwork_physics')
assert.equal(getProceduralGame('mystery_detective')?.id, 'midnight_detective')
assert.equal(getProceduralGame('potion_scales')?.id, 'apothecary_scales')
assert.equal(getProceduralGame('spellforge')?.id, 'spellforge_anvil')
assert.equal(getProceduralGame('world_builder')?.id, 'ecosystem_sandbox')
assert.ok(Object.keys(LEGACY_GAME_ALIAS_MAP).length >= 6, 'Legacy alias map contains mapped entries')
assert.ok(Object.keys(GAME_SVG_ICONS).length === 10, 'All 10 games have registered SVG icons')

const sessionSeed = generateGameSessionSeed('creature_alchemist', 'child-123', 42)
assert.ok(sessionSeed > 0, 'Generated session seed must be positive integer')
console.log('  ✓ [PASS] All legacy aliases resolve to canonical 10-game IDs')

// 5. Test Query APIs
console.log('\n5. Testing Public Registry Query APIs...')
const all = getAllProceduralGames()
assert.equal(all.length, 10, 'getAllProceduralGames must return 10 games')

const playable = getPlayableProceduralGames()
assert.equal(playable.length, 10, 'Must have 10 playable flagship games')

const logicGames = getProceduralGamesByDomain('logic')
assert.ok(logicGames.length >= 4, 'Must find multiple logic domain games')
console.log(`  ✓ [PASS] Found ${playable.length} playable games, ${logicGames.length} logic games`)

console.log('\n==================================================================')
console.log('🏆 ALL 10-GAME PROCEDURAL REGISTRY TESTS PASSED!')
console.log('==================================================================\n')
