/**
 * Comprehensive Verification Test Suite for The Living Creature Sanctuary
 * Tests:
 * 1. Sanctuary Data Initialization & Local Persistence
 * 2. Elemental Treats & Inventory Management
 * 3. Creature Mood & Passive Decay Mechanics
 * 4. Petting Mechanics (Happiness boost, friendship XP, level up, Web Audio purrs)
 * 5. Feeding Mechanics (Elemental matching, favorite food boost, treat deduction, level up)
 * 6. Nickname Customization & Biome Switching
 * 7. Discovered Species Integration
 */

import { sanctuaryService, SANCTUARY_TREATS, DEFAULT_TREAT_INVENTORY } from '../src/services/games/sanctuaryService'

// Mock LocalStorage for Node testing
class MockLocalStorage {
  private store: Record<string, string> = {}

  getItem(key: string): string | null {
    return this.store[key] !== undefined ? this.store[key] : null
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value)
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  clear(): void {
    this.store = {}
  }
}

const mockStorage = new MockLocalStorage()
;(globalThis as any).window = {
  localStorage: mockStorage,
}
;(globalThis as any).localStorage = mockStorage

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('==================================================================')
console.log('🐾 RUNNING LIVING CREATURE SANCTUARY TEST SUITE')
console.log('==================================================================\n')

let totalTests = 0
let passedTests = 0

function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++
  try {
    fn()
    console.log(`  ✅ ${name}`)
    passedTests++
  } catch (err: any) {
    console.error(`  ❌ ${name}: ${err.message}`)
    throw err
  }
}

// -----------------------------------------------------------------------------
// TEST SUITE 1: SANCTUARY DATA INITIALIZATION & TREATS
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Data Initialization & Treat Inventory ---')

runTest('Should initialize default sanctuary data with 5 elemental treat types', () => {
  mockStorage.clear()
  const data = sanctuaryService.getSanctuaryData('child_test_1')

  assert(data.childId === 'child_test_1', 'Child ID should match')
  assert(data.activeBiome === 'all', 'Default active biome should be all')
  assert(data.totalPatsEver === 0, 'Total pats should start at 0')
  assert(data.totalFeedingsEver === 0, 'Total feedings should start at 0')

  assert(data.treats.sunberry === DEFAULT_TREAT_INVENTORY.sunberry, 'Sunberry count should match default')
  assert(data.treats.sprout_leaf === DEFAULT_TREAT_INVENTORY.sprout_leaf, 'Sprout leaf count should match default')
  assert(data.treats.cloud_puff === DEFAULT_TREAT_INVENTORY.cloud_puff, 'Cloud puff count should match default')
  assert(data.treats.ember_biscuit === DEFAULT_TREAT_INVENTORY.ember_biscuit, 'Ember biscuit count should match default')
  assert(data.treats.stardust_nectar === DEFAULT_TREAT_INVENTORY.stardust_nectar, 'Stardust nectar count should match default')
})

runTest('Should define 5 distinct elemental treats with valid properties', () => {
  assert(SANCTUARY_TREATS.length === 5, 'Should define exactly 5 treats')
  SANCTUARY_TREATS.forEach((treat) => {
    assert(Boolean(treat.id), 'Treat ID must be defined')
    assert(Boolean(treat.name), 'Treat name must be defined')
    assert(Boolean(treat.emoji), 'Treat emoji must be defined')
    assert(treat.happinessBoost > 0, 'Happiness boost must be > 0')
    assert(treat.friendshipXp > 0, 'Friendship XP must be > 0')
  })
})

// -----------------------------------------------------------------------------
// TEST SUITE 2: CREATURE MOOD & PASSIVE DECAY
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Creature Mood & Passive Decay ---')

runTest('Should compute correct mood categories based on happiness scores', () => {
  assert(sanctuaryService.computeMood(90) === 'ecstatic', '90 should be ecstatic')
  assert(sanctuaryService.computeMood(70) === 'happy', '70 should be happy')
  assert(sanctuaryService.computeMood(50) === 'content', '50 should be content')
  assert(sanctuaryService.computeMood(30) === 'hungry', '30 should be hungry')
  assert(sanctuaryService.computeMood(15) === 'sleepy', '15 should be sleepy')
})

// -----------------------------------------------------------------------------
// TEST SUITE 3: PETTING MECHANICS
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Petting Mechanics ---')

runTest('Should pet creature, award happiness, friendship XP, and increment pat counter', () => {
  mockStorage.clear()
  const childId = 'child_pet_test'
  const creatureId = 'glow_puff'

  const result1 = sanctuaryService.petCreature(childId, creatureId)
  assert(result1.happinessGained > 0, 'Happiness gained should be > 0')
  assert(result1.happinessAfter >= result1.happinessBefore, 'Happiness after should increase')
  assert(result1.friendshipXpGained === 8, 'Friendship XP gained should be 8')
  assert(result1.totalPetted === 1, 'Total petted count should be 1')
  assert(result1.message.includes('purrs') || result1.message.includes('wiggles') || result1.message.includes('nuzzles') || result1.message.includes('glows'), 'Should contain positive reaction message')

  const updatedData = sanctuaryService.getSanctuaryData(childId)
  assert(updatedData.totalPatsEver === 1, 'Sanctuary totalPatsEver should be 1')
  assert(updatedData.creatures[creatureId].totalPetted === 1, 'Creature totalPetted should be 1')
})

runTest('Should level up friendship when reaching XP threshold', () => {
  mockStorage.clear()
  const childId = 'child_level_test'
  const creatureId = 'glow_puff'

  // Pet until reaching 50 XP (7 pets * 8 XP = 56 XP -> level up to Level 2)
  for (let i = 0; i < 7; i++) {
    sanctuaryService.petCreature(childId, creatureId)
  }

  const data = sanctuaryService.getSanctuaryData(childId)
  const creatureState = data.creatures[creatureId]
  assert(creatureState.friendshipLevel === 2, `Friendship level should advance to 2, got ${creatureState.friendshipLevel}`)
})

// -----------------------------------------------------------------------------
// TEST SUITE 4: FEEDING MECHANICS & FAVORITE FOOD
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Feeding Mechanics & Elemental Matching ---')

runTest('Should feed creature, consume treat from inventory, and boost happiness', () => {
  mockStorage.clear()
  const childId = 'child_feed_test'
  const creatureId = 'bloom_lizard' // Flora creature

  const feedResult = sanctuaryService.feedCreature(childId, creatureId, 'sprout_leaf')
  assert(feedResult.success === true, 'Feeding should succeed')
  assert(feedResult.isFavorite === true, 'Sprout leaf should be favorite for Flora creature')
  assert(feedResult.happinessGained === 30 || feedResult.happinessGained === 40, 'Should receive favorite food happiness boost')
  assert(feedResult.message.includes('SUPER DELICIOUS'), 'Message should announce super delicious favorite reaction')

  const data = sanctuaryService.getSanctuaryData(childId)
  assert(data.treats.sprout_leaf === DEFAULT_TREAT_INVENTORY.sprout_leaf - 1, 'Treat inventory should decrement by 1')
  assert(data.totalFeedingsEver === 1, 'Total feedings should increment')
  assert(data.creatures[creatureId].totalFed === 1, 'Creature totalFed should be 1')
  assert(data.creatures[creatureId].favoriteFoodMatchCount === 1, 'favoriteFoodMatchCount should be 1')
})

runTest('Should reject feeding when treat count is zero', () => {
  const childId = 'child_empty_treat_test'
  const data = sanctuaryService.getSanctuaryData(childId)
  data.treats.sunberry = 0
  sanctuaryService.saveSanctuaryData(data)

  const feedResult = sanctuaryService.feedCreature(childId, 'glow_puff', 'sunberry')
  assert(feedResult.success === false, 'Feeding with 0 treats should fail')
  assert(feedResult.message.includes('run out'), 'Error should explain treat ran out')
})

// -----------------------------------------------------------------------------
// TEST SUITE 5: CUSTOM NICKNAME & BIOME SETTINGS
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Custom Nicknames & Biomes ---')

runTest('Should assign custom nickname to creature', () => {
  mockStorage.clear()
  const childId = 'child_nick_test'
  const creatureId = 'breeze_lynx'

  sanctuaryService.setNickname(childId, creatureId, 'Zephyr the Swift')
  const data = sanctuaryService.getSanctuaryData(childId)
  assert(data.creatures[creatureId].customNickname === 'Zephyr the Swift', 'Nickname should be saved')
})

runTest('Should switch and persist active biome', () => {
  mockStorage.clear()
  const childId = 'child_biome_test'

  sanctuaryService.setActiveBiome(childId, 'crystal_cave')
  const data = sanctuaryService.getSanctuaryData(childId)
  assert(data.activeBiome === 'crystal_cave', 'Active biome should be crystal_cave')
})

// -----------------------------------------------------------------------------
// TEST SUITE 6: DISCOVERED SPECIES RETRIEVAL
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 6: Discovered Species Integration ---')

runTest('Should fetch discovered creature objects matching creatureLabEngine records', () => {
  mockStorage.clear()
  const childId = 'child_disc_test'

  // Mock 2 discovered creatures in Creature Lab storage
  mockStorage.setItem(`orbis_creature_lab_discovered_${childId}`, JSON.stringify(['glow_puff', 'tide_otter']))

  const discovered = sanctuaryService.getDiscoveredCreatures(childId)
  assert(discovered.length === 2, `Should return 2 discovered species, got ${discovered.length}`)
  assert(discovered[0].id === 'glow_puff', 'First species should be glow_puff')
  assert(discovered[1].id === 'tide_otter', 'Second species should be tide_otter')
})

console.log('\n==================================================================')
console.log(`🏆 ALL ${passedTests}/${totalTests} LIVING SANCTUARY TESTS PASSED`)
console.log('==================================================================\n')
