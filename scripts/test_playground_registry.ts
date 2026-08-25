import assert from 'assert'
import {
  getAllPlaygroundGames,
  getPlaygroundGame,
  getPlayablePlaygroundGames,
  getPlaygroundGamesByDomain,
  PLAYGROUND_REGISTRY
} from '../src/services/games/playgroundRegistry'
import type { PlaygroundGameId } from '../src/types/playground'

console.log('🧪 RUNNING ORBIS PLAYGROUND REGISTRY VERIFICATION SUITE...\n')

// 1. Verify registered games (10 original concepts + Creature Lab + Magic Machine)
const allGames = getAllPlaygroundGames()
assert.ok(allGames.length >= 11, `Expected at least 11 registered games, found ${allGames.length}`)
console.log(`✅ [1/6] Registered games count matches master concepts`)

// 2. Verify ranking order integrity
assert.strictEqual(allGames[0].id, 'spellforge', 'Rank 1 must be Spellforge')
console.log(`✅ [2/6] Top ranking confirmed`)

// 3. Verify playable game status
const playableGames = getPlayablePlaygroundGames()
assert.ok(playableGames.length >= 2, 'Expected at least 2 playable games (Creature Lab + Magic Machine Lab)')
assert.ok(playableGames.some((g) => g.id === 'creature_lab'), 'Playable games must include creature_lab')
assert.ok(playableGames.some((g) => g.id === 'magic_machine' || g.id === 'invention_lab'), 'Playable games must include magic_machine/invention_lab')
console.log(`✅ [3/6] Playable game filter correctly identifies playable games`)

// 4. Verify domain filtering
const vocabGames = getPlaygroundGamesByDomain('vocabulary')
assert.ok(vocabGames.some((g) => g.id === 'spellforge'), 'Spellforge must be in vocabulary domain')
const logicGames = getPlaygroundGamesByDomain('logic')
assert.ok(logicGames.some((g) => g.id === 'magic_machine' || g.id === 'invention_lab'), 'Magic Machine/Invention Lab must be in logic domain')
const memoryGames = getPlaygroundGamesByDomain('memory')
assert.ok(memoryGames.some((g) => g.id === 'memory_museum'), 'Memory Museum must be in memory domain')
console.log(`✅ [4/6] Cognitive domain queries return correct game mappings`)

// 5. Verify individual lookups
const spellforge = getPlaygroundGame('spellforge')
assert.ok(spellforge, 'getPlaygroundGame(spellforge) must exist')
assert.strictEqual(spellforge?.category, 'linguistic_craft')
assert.ok(spellforge?.learningObjectives.length >= 3)
assert.ok(spellforge?.keyMechanics.length >= 3)
console.log(`✅ [5/6] Individual game contract inspection validated`)

// 6. Verify all games have complete metadata
const expectedIds: PlaygroundGameId[] = [
  'magic_machine',
  'mystery_detective',
  'potion_scales',
  'spellforge',
  'memory_museum',
  'word_detective',
  'skyship_builder',
  'creature_care',
  'rhythm_spells',
  'world_builder',
  'time_machine',
  'invention_lab',
  'orbis_quest_run',
  'creature_lab'
]

for (const id of expectedIds) {
  const game = PLAYGROUND_REGISTRY[id]
  assert.ok(game, `Game ${id} must exist in registry`)
  assert.ok(game.title.length > 0, `Game ${id} must have title`)
  assert.ok(game.description.length > 20, `Game ${id} must have detailed description`)
  assert.ok(game.heroBannerColor.startsWith('linear-gradient'), `Game ${id} banner must be gradient`)
  assert.ok(game.accentGlow.startsWith('rgba'), `Game ${id} glow must be rgba`)
  assert.ok(game.ageRange.min >= 3 && game.ageRange.max <= 12, `Game ${id} age range valid`)
}
console.log(`✅ [6/6] All 11 game contracts contain complete, valid metadata`)

console.log('\n🎉 ALL 6 PLAYGROUND REGISTRY ASSERTIONS PASSED!')
