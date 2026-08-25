import {
  calculateAdventureProgress,
  getAllScienceDossiers,
} from '../src/services/progressionService'
import type { ChildProfile } from '../src/types/childProfile'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🧪 RUNNING CHILD ADVENTURE PASSPORT & SCIENCE CODEX TEST SUITE...\n')

// 1. Science Dossiers Extraction
console.log('1. Validating 66 Science of Wonder Dossiers Across 4 Stations...')
const allDossiers = getAllScienceDossiers({
  creatureDiscoveriesCount: 8,
  machineCompletedCount: 6,
  detectiveSolvedCount: 4,
  potionBrewedCount: 9,
})

assert(allDossiers.length === 66, `Total science dossiers is 66 (got ${allDossiers.length})`)

const creatureDossiers = allDossiers.filter((d) => d.sourceStationId === 'creature_lab')
assert(creatureDossiers.length === 24, '24 Creature Lab dossiers extracted')
assert(creatureDossiers.filter((d) => d.unlocked).length === 8, '8 Creature Lab dossiers unlocked')

const machineDossiers = allDossiers.filter((d) => d.sourceStationId === 'magic_machine')
assert(machineDossiers.length === 12, '12 Magic Machine dossiers extracted')
assert(machineDossiers.filter((d) => d.unlocked).length === 6, '6 Magic Machine dossiers unlocked')

const detectiveDossiers = allDossiers.filter((d) => d.sourceStationId === 'mystery_detective')
assert(detectiveDossiers.length === 12, '12 Mystery Detective dossiers extracted')
assert(detectiveDossiers.filter((d) => d.unlocked).length === 4, '4 Mystery Detective dossiers unlocked')

const potionDossiers = allDossiers.filter((d) => d.sourceStationId === 'potion_scales')
assert(potionDossiers.length === 18, '18 Potion Scales dossiers extracted')
assert(potionDossiers.filter((d) => d.unlocked).length === 9, '9 Potion Scales dossiers unlocked')

// 2. Child Passport Profile Binding
console.log('\n2. Testing Child Passport Profile Binding...')
const mockChild: ChildProfile = {
  id: 'child_passport_hero',
  parent_id: 'parent_1',
  name: 'Maya',
  age: 8,
  reading_level: 'fluent',
  interests: ['Mystery & Detective', 'Magic & Potions'],
  avatar: '🦉',
  preferred_language: 'en',
  xp: 480,
  stars: 64,
  current_streak: 5,
}

const progress = calculateAdventureProgress(mockChild, {
  creatureDiscoveriesCount: 12,
  machineCompletedCount: 8,
  detectiveSolvedCount: 10,
  potionBrewedCount: 14,
})

assert(progress.childName === 'Maya', 'Child name is Maya')
assert(progress.avatar === '🦉', 'Avatar is 🦉')
assert(progress.level === 4, 'Level is 4 for 480 XP')
assert(progress.explorerTitle === 'Ace Detective Sleuth', 'Title is Ace Detective Sleuth')
assert(progress.unlockedScienceDossiersCount === 44, '44 total science dossiers unlocked (12+8+10+14)')

// 3. Cognitive Domain Radar Scores
console.log('\n3. Validating Cognitive Domain Radar Scores...')
assert(progress.cognitiveDomainScores.logic.level >= 2, 'Logic level is >= 2')
assert(progress.cognitiveDomainScores.creativity.level >= 2, 'Creativity level is >= 2')
assert(progress.cognitiveDomainScores.memory.level >= 1, 'Memory level is >= 1')
assert(progress.cognitiveDomainScores.vocabulary.level >= 1, 'Vocabulary level is >= 1')

console.log('\n🎉 ALL 16 CHILD ADVENTURE PASSPORT TEST ASSERTIONS PASSED!')
