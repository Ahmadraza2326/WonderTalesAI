import {
  computeExplorerTitle,
  calculateAdventureProgress,
} from '../src/services/progressionService'
import type { ChildProfile } from '../src/types/childProfile'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🧪 RUNNING PROGRESSION SERVICE VERIFICATION SUITE...\n')

// 1. Explorer Titles Progression
console.log('1. Testing Explorer Titles Derivation...')
assert(computeExplorerTitle(0).title === 'Novice Star-Seeker', '0 XP gives Novice Star-Seeker')
assert(computeExplorerTitle(50).title === 'Apprentice Star-Alchemist', '50 XP gives Apprentice Star-Alchemist')
assert(computeExplorerTitle(150).title === 'Master Contraption Engineer', '150 XP gives Master Contraption Engineer')
assert(computeExplorerTitle(300).title === 'Ace Detective Sleuth', '300 XP gives Ace Detective Sleuth')
assert(computeExplorerTitle(500).title === 'Master of Elemental Alchemy', '500 XP gives Master of Elemental Alchemy')
assert(computeExplorerTitle(800).title === 'Grand Master of the Cosmos', '800 XP gives Grand Master of the Cosmos')

// 2. Guest / Null Profile Fallback
console.log('\n2. Testing Guest / Null Profile Fallback...')
const guestProgress = calculateAdventureProgress(null)
assert(guestProgress.childId === 'guest', 'Null child defaults to guest ID')
assert(guestProgress.childName === 'Explorer', 'Null child defaults to Explorer name')
assert(guestProgress.stations.creatureLab.completedCount === 0, 'Creature count defaults to 0')
assert(guestProgress.stations.magicMachine.totalAvailable === 12, 'Magic Machine has 12 total puzzles')
assert(guestProgress.stations.mysteryDetective.totalAvailable === 12, 'Mystery Detective has 12 total cases')
assert(guestProgress.stations.potionScales.totalAvailable === 18, 'Potion Scales has 18 total puzzles')

// 3. Complete Profile Aggregation
console.log('\n3. Testing Active Child Profile Aggregation...')
const mockChild: ChildProfile = {
  id: 'child_test_123',
  parent_id: 'parent_456',
  name: 'Aria',
  age: 7,
  reading_level: 'intermediate',
  interests: ['Space & Planets', 'Robots & Inventions'],
  avatar: '🦊',
  preferred_language: 'en',
  xp: 320,
  stars: 45,
  current_streak: 4,
}

const progress = calculateAdventureProgress(mockChild, {
  creatureDiscoveriesCount: 8,
  machineCompletedCount: 6,
  detectiveSolvedCount: 4,
  potionBrewedCount: 9,
})

assert(progress.childName === 'Aria', 'Progress reflects child name Aria')
assert(progress.avatar === '🦊', 'Progress reflects child avatar')
assert(progress.currentStreak === 4, 'Streak is preserved accurately')
assert(progress.level === 4, 'Level is 4 for 320 XP')
assert(progress.explorerTitle === 'Ace Detective Sleuth', 'Title matches 320 XP')

// Check Station Masteries
assert(progress.stations.creatureLab.completedCount === 8, 'Creature count is 8')
assert(progress.stations.creatureLab.masteryPercentage === 33, 'Creature mastery is 33% (8/24)')
assert(progress.stations.magicMachine.completedCount === 6, 'Machine count is 6')
assert(progress.stations.magicMachine.masteryPercentage === 50, 'Machine mastery is 50% (6/12)')
assert(progress.stations.mysteryDetective.completedCount === 4, 'Detective count is 4')
assert(progress.stations.mysteryDetective.masteryPercentage === 33, 'Detective mastery is 33% (4/12)')
assert(progress.stations.potionScales.completedCount === 9, 'Potion count is 9')
assert(progress.stations.potionScales.masteryPercentage === 50, 'Potion mastery is 50% (9/18)')

// Check Cognitive Domain Scores
assert(progress.cognitiveDomainScores.logic.xp > 0, 'Logic domain has positive XP')
assert(progress.cognitiveDomainScores.creativity.xp > 0, 'Creativity domain has positive XP')
assert(progress.unlockedScienceDossiersCount === 27, 'Total science dossiers unlocked is 27 (8+6+4+9)')

console.log('\n🎉 ALL 18 PROGRESSION SERVICE TEST ASSERTIONS PASSED!')
