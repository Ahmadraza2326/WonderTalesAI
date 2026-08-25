import {
  getDailyCosmicChallenges,
  getDateKey,
  markDailyChallengeCompleted,
  getDailyChallengeCompletionStatus,
} from '../src/services/proceduralChallengeService'

console.log('🧪 RUNNING INFINITE PROCEDURAL CHALLENGE ENGINE TEST SUITE...\n')

let passCount = 0
let failCount = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`)
    passCount++
  } else {
    console.error(`  ✗ FAIL: ${message}`)
    failCount++
  }
}

// 1. Date formatting & Determinism
console.log('1. Testing Date Keys & Seed Determinism...')
const testDate = new Date('2026-08-25T12:00:00Z')
const dateKey = getDateKey(testDate)
assert(dateKey === '2026-08-25', `Date key formatted properly (got ${dateKey})`)

const packA = getDailyCosmicChallenges(testDate, 1)
const packB = getDailyCosmicChallenges(testDate, 1)
assert(packA.dateKey === packB.dateKey, 'Date keys match')
assert(packA.cosmicModifier === packB.cosmicModifier, 'Cosmic modifier is deterministic')
assert(packA.challenges.length === 4, 'Generates 4 station challenges')
assert(packA.challenges[0].challengeTitle === packB.challenges[0].challengeTitle, 'First challenge matches deterministically')
assert(packA.challenges[1].challengeTitle === packB.challenges[1].challengeTitle, 'Second challenge matches deterministically')
assert(packA.challenges[2].challengeTitle === packB.challenges[2].challengeTitle, 'Third challenge matches deterministically')
assert(packA.challenges[3].challengeTitle === packB.challenges[3].challengeTitle, 'Fourth challenge matches deterministically')

// 2. Station Coverage & Science Concepts
console.log('\n2. Validating 4 Flagship Stations & Science Concepts...')
const stationIds = packA.challenges.map((c) => c.stationId)
assert(stationIds.includes('creature_lab'), 'Contains creature_lab challenge')
assert(stationIds.includes('magic_machine'), 'Contains magic_machine challenge')
assert(stationIds.includes('mystery_detective'), 'Contains mystery_detective challenge')
assert(stationIds.includes('potion_scales'), 'Contains potion_scales challenge')

for (const ch of packA.challenges) {
  assert(Boolean(ch.scientificConcept?.title), `${ch.stationTitle} has scientific title (${ch.scientificConcept.title})`)
  assert(Boolean(ch.scientificConcept?.scienceTopic), `${ch.stationTitle} has science topic (${ch.scientificConcept.scienceTopic})`)
  assert(Boolean(ch.scientificConcept?.kidExplanation), `${ch.stationTitle} has kid explanation`)
}

// 3. Dynamic Level Scaling
console.log('\n3. Testing Dynamic Level Scaling & Multipliers...')
const lvl1Pack = getDailyCosmicChallenges(testDate, 1)
const lvl3Pack = getDailyCosmicChallenges(testDate, 3)
const lvl5Pack = getDailyCosmicChallenges(testDate, 5)

assert(lvl1Pack.challenges[0].difficultyLabel === 'Explorer', 'Level 1 is Explorer tier')
assert(lvl3Pack.challenges[0].difficultyLabel === 'Master', 'Level 3 is Master tier')
assert(lvl5Pack.challenges[0].difficultyLabel === 'Cosmic Champion', 'Level 5 is Cosmic Champion tier')

assert(lvl3Pack.challenges[0].rewardBonusXp > lvl1Pack.challenges[0].rewardBonusXp, 'Level 3 XP bonus is higher than Level 1')
assert(lvl5Pack.challenges[0].rewardBonusXp > lvl3Pack.challenges[0].rewardBonusXp, 'Level 5 XP bonus is higher than Level 3')
assert(lvl5Pack.grandBonus.xp > lvl1Pack.grandBonus.xp, 'Level 5 Grand Bonus XP scales up')

// 4. Daily Refresh on New Date
console.log('\n4. Testing Daily Progression on New Calendar Date...')
const nextDate = new Date('2026-08-26T12:00:00Z')
const nextPack = getDailyCosmicChallenges(nextDate, 1)
assert(nextPack.dateKey === '2026-08-26', 'Next date key matches 2026-08-26')

// 5. Completion Tracking & Local Storage Mock
console.log('\n5. Testing Completion Status Aggregation...')
const mockCompletedIds = [lvl1Pack.challenges[0].id, lvl1Pack.challenges[1].id]
const progressPack = getDailyCosmicChallenges(testDate, 1, mockCompletedIds)
assert(progressPack.completedCount === 2, 'Completed count reflects 2 solved challenges')
assert(progressPack.allCompleted === false, 'allCompleted is false for 2/4')

const fullCompletedIds = lvl1Pack.challenges.map((c) => c.id)
const fullPack = getDailyCosmicChallenges(testDate, 1, fullCompletedIds)
assert(fullPack.completedCount === 4, 'Completed count is 4/4')
assert(fullPack.allCompleted === true, 'allCompleted is true for 4/4')

// 6. Persistence Helpers
console.log('\n6. Testing Persistence Functions in Node environment...')
assert(typeof markDailyChallengeCompleted === 'function', 'markDailyChallengeCompleted is exported')
assert(typeof getDailyChallengeCompletionStatus === 'function', 'getDailyChallengeCompletionStatus is exported')
assert(Array.isArray(getDailyChallengeCompletionStatus('guest')), 'Returns array when storage is empty')

console.log(`\n==================================================================`)
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} PROCEDURAL CHALLENGE TEST ASSERTIONS PASSED!`)
  process.exit(0)
} else {
  console.error(`💥 ${failCount} ASSERTIONS FAILED!`)
  process.exit(1)
}
