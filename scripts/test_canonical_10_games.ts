import {
  getCanonicalFlagshipGames,
  CANONICAL_FLAGSHIP_IDS,
  PLAYGROUND_REGISTRY,
} from '../src/services/games/playgroundRegistry'

function runCanonical10GamesTests() {
  console.log('🪐 Running Canonical 10 Flagship Games Registry Tests...')
  let passed = 0
  let failed = 0

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++
    } else {
      failed++
      console.error(`❌ FAILED: ${msg}`)
    }
  }

  // 1. Exact 10 Flagship IDs
  assert(CANONICAL_FLAGSHIP_IDS.length === 10, `Expected exactly 10 canonical flagship IDs, found ${CANONICAL_FLAGSHIP_IDS.length}`)

  const expected10 = [
    'potion_scales',
    'rhythm_spells',
    'word_trace',
    'magic_machine',
    'invention_lab',
    'spellforge',
    'ecosystem_sandbox',
    'mystery_detective',
    'robopath',
    'cosmic_constellations',
  ]

  for (const id of expected10) {
    assert(CANONICAL_FLAGSHIP_IDS.includes(id as any), `Flagship ID "${id}" must be in CANONICAL_FLAGSHIP_IDS`)
    const game = (PLAYGROUND_REGISTRY as Record<string, any>)[id]
    assert(!!game, `Flagship ID "${id}" must exist in PLAYGROUND_REGISTRY`)
    if (game) {
      assert(game.isPlayable === true, `Game "${id}" must be marked isPlayable: true`)
      assert(game.route.startsWith('/'), `Game "${id}" must have a valid route starting with "/"`)
      assert(game.rankOrder >= 1 && game.rankOrder <= 10, `Game "${id}" must have a rankOrder between 1 and 10`)
    }
  }

  // 2. getCanonicalFlagshipGames returns 10 unique games sorted by rank
  const flagships = getCanonicalFlagshipGames()
  assert(flagships.length === 10, `getCanonicalFlagshipGames() must return 10 games (got ${flagships.length})`)

  const idSet = new Set(flagships.map((g) => g.id))
  assert(idSet.size === 10, 'No duplicate games in flagship list')

  console.log(`\nCanonical 10 Games Tests: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

runCanonical10GamesTests()
