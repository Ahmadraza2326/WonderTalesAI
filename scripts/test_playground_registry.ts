import assert from 'assert'
import {
  getAllPlaygroundGames,
  getPlaygroundGame,
  getPlayablePlaygroundGames,
  getPlaygroundGamesByDomain,
  CANONICAL_FLAGSHIP_IDS,
  PLAYGROUND_REGISTRY
} from '../src/services/games/playgroundRegistry'

console.log('🧪 RUNNING ORBIS PLAYGROUND REGISTRY VERIFICATION SUITE...\n')

// 1. Verify 10 Canonical Flagship Games
const allGames = getAllPlaygroundGames()
assert.strictEqual(allGames.length, 10, `Expected exactly 10 canonical flagship games, found ${allGames.length}`)
console.log(`✅ [1/6] Exactly 10 canonical flagship games confirmed`)

// 2. Verify ranking order integrity
assert.strictEqual(allGames[0].id, 'potion_scales', 'Rank 1 must be Potion Market Scales')
console.log(`✅ [2/6] Top ranking confirmed`)

// 3. Verify playable game status
const playableGames = getPlayablePlaygroundGames()
assert.strictEqual(playableGames.length, 10, 'Expected all 10 canonical games to be 100% playable')
console.log(`✅ [3/6] All 10 canonical flagship games are marked playable`)

// 4. Verify domain filtering
const vocabGames = getPlaygroundGamesByDomain('vocabulary')
assert.ok(vocabGames.some((g) => g.id === 'spellforge' || g.id === 'word_trace'), 'Spellforge/Word Trace in vocabulary domain')
const logicGames = getPlaygroundGamesByDomain('logic')
assert.ok(logicGames.some((g) => g.id === 'potion_scales' || g.id === 'magic_machine' || g.id === 'invention_lab'), 'Potion Scales/Magic Machine/Invention Lab in logic domain')
console.log(`✅ [4/6] Cognitive domain queries return correct game mappings`)

// 5. Verify individual lookups
const potion = getPlaygroundGame('potion_scales')
assert.ok(potion, 'getPlaygroundGame(potion_scales) must exist')
assert.strictEqual(potion?.category, 'alchemy_discovery')
assert.ok(potion && potion.learningObjectives.length >= 3)
assert.ok(potion && potion.keyMechanics.length >= 3)
console.log(`✅ [5/6] Individual game contract inspection validated`)

// 6. Verify all 10 canonical games have complete metadata
for (const id of CANONICAL_FLAGSHIP_IDS) {
  const game = PLAYGROUND_REGISTRY[id]
  assert.ok(game, `Game ${id} must exist in registry`)
  assert.ok(game.title.length > 0, `Game ${id} must have title`)
  assert.ok(game.description.length > 20, `Game ${id} must have detailed description`)
  assert.ok(game.heroBannerColor.startsWith('linear-gradient'), `Game ${id} banner must be gradient`)
  assert.ok(game.accentGlow.startsWith('rgba'), `Game ${id} glow must be rgba`)
  assert.ok(game.ageRange.min >= 3 && game.ageRange.max <= 12, `Game ${id} age range valid`)
}
console.log(`✅ [6/6] All 10 canonical flagship game contracts contain complete, valid metadata`)

console.log('\n🎉 ALL 6 PLAYGROUND REGISTRY ASSERTIONS PASSED!')
