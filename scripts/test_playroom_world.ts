import { PLAYGROUND_REGISTRY } from '../src/services/games/playgroundRegistry'
import { calculateAdventureProgress } from '../src/services/progressionService'
import type { ChildProfile } from '../src/types/childProfile'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🧪 RUNNING PLAYROOM WORLD OBSERVATORY VERIFICATION SUITE...\n')

// 1. Validate All 4 Flagships in Registry
console.log('1. Validating 4 Flagship Stations in Playground Registry...')
const flagships = ['creature_lab', 'magic_machine', 'mystery_detective', 'potion_scales'] as const

for (const id of flagships) {
  const game = PLAYGROUND_REGISTRY[id]
  assert(!!game, `Game ${id} exists in PLAYGROUND_REGISTRY`)
  assert(game.isPlayable === true, `Game ${id} is marked as playable`)
  assert(game.status === 'playable', `Game ${id} status is 'playable'`)
  assert(typeof game.route === 'string' && game.route.length > 0, `Game ${id} has a valid route (${game?.route})`)
  assert(typeof game.icon === 'string', `Game ${id} has an icon (${game?.icon})`)
  assert(game.learningObjectives.length >= 2, `Game ${id} has at least 2 learning objectives`)
}

// 2. Validate Domain Classification
console.log('\n2. Validating Domain Classification...')
assert(PLAYGROUND_REGISTRY.creature_lab.primaryDomain === 'creativity', 'Creature Lab is creativity domain')
assert(PLAYGROUND_REGISTRY.magic_machine.primaryDomain === 'logic', 'Magic Machine is logic domain')
assert(PLAYGROUND_REGISTRY.mystery_detective.primaryDomain === 'logic', 'Mystery Detective is logic domain')
assert(PLAYGROUND_REGISTRY.potion_scales.primaryDomain === 'logic', 'Potion Scales is logic domain')

// 3. Validate World Progress Aggregation
console.log('\n3. Validating World Progress Aggregation...')
const mockChild: ChildProfile = {
  id: 'child_world_hero',
  parent_id: 'parent_1',
  name: 'Leo',
  age: 6,
  reading_level: 'early_reader',
  interests: ['Dinosaurs', 'Nature & Animals'],
  avatar: '🦁',
  preferred_language: 'en',
  xp: 540,
  stars: 72,
  current_streak: 7,
}

const progress = calculateAdventureProgress(mockChild, {
  creatureDiscoveriesCount: 24, // 100%
  machineCompletedCount: 12, // 100%
  detectiveSolvedCount: 6, // 50%
  potionBrewedCount: 18, // 100%
})

assert(progress.childName === 'Leo', 'Child name is Leo')
assert(progress.level === 5, 'Level 5 for 540 XP')
assert(progress.explorerTitle === 'Master of Elemental Alchemy', 'Title is Master of Elemental Alchemy')
assert(progress.stations.creatureLab.badgeLabel === 'Almanac Master', 'Creature Lab badge is Almanac Master at 24/24')
assert(progress.stations.magicMachine.badgeLabel === 'Master Inventor', 'Magic Machine badge is Master Inventor at 12/12')
assert(progress.stations.potionScales.badgeLabel === 'Master Apothecary', 'Potion Scales badge is Master Apothecary at 18/18')
assert(progress.stations.mysteryDetective.masteryPercentage === 50, 'Detective mastery is 50%')
assert(progress.overallProgressPercentage === 88, 'Overall world progress is 88%')

console.log('\n🎉 ALL 20 PLAYROOM WORLD TEST ASSERTIONS PASSED!')
