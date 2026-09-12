import {
  getProgressiveHint,
  verifyHintSafety,
} from '../src/services/academy/hintService'
import {
  calculateSkillMastery,
} from '../src/services/academy/masteryService'
import { ACADEMY_PRACTICE_REGISTRY } from '../src/services/academy/curriculum/practiceData'

function runHintsAndMasteryTests() {
  console.log('💡 Running Progressive Hints & Mastery Calculation Tests...')
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

  // 1. Verify 4-Tier Progressive Hints across all registered practice questions
  for (const set of Object.values(ACADEMY_PRACTICE_REGISTRY)) {
    for (const q of set.questions) {
      const h1 = getProgressiveHint(q, 1)
      const h2 = getProgressiveHint(q, 2)
      const h3 = getProgressiveHint(q, 3)
      const h4 = getProgressiveHint(q, 4)

      assert(h1.tierLevel === 1 && h1.hasMoreHints, `Q ${q.id} Tier 1 has next hint`)
      assert(h2.tierLevel === 2 && h2.hasMoreHints, `Q ${q.id} Tier 2 has next hint`)
      assert(h3.tierLevel === 3 && h3.hasMoreHints, `Q ${q.id} Tier 3 has next hint`)
      assert(h4.tierLevel === 4 && h4.isMaxTier && !h4.hasMoreHints, `Q ${q.id} Tier 4 is max tier`)

      // Verify Safety: Tier 1/2/3 must not leak raw answer
      if (q.correctText) {
        const safety = verifyHintSafety(q.hints, q.correctText)
        assert(safety.isSafe, `Q ${q.id} Tier 1-3 hints must not leak answer "${q.correctText}"`)
      }
    }
  }

  // 2. Mastery Calculations
  // Case A: High accuracy, 0 hints, recent practice -> Mastered (>=95)
  const masteryA = calculateSkillMastery({
    attemptsCount: 10,
    correctCount: 10,
    hintsUsedCount: 0,
    daysSinceLastPracticed: 1,
    capstoneGameMastered: true,
  })
  assert(masteryA.score >= 95, `High performance should reach >=95 score (got ${masteryA.score})`)
  assert(masteryA.tier === 'mastered', `High performance should be 'mastered' (got ${masteryA.tier})`)

  // Case B: Moderate accuracy, moderate hints -> Practicing or Developing
  const masteryB = calculateSkillMastery({
    attemptsCount: 10,
    correctCount: 6,
    hintsUsedCount: 4,
    daysSinceLastPracticed: 3,
  })
  assert(masteryB.score >= 30 && masteryB.score <= 80, `Moderate performance score in range (got ${masteryB.score})`)
  assert(masteryB.tier === 'practicing' || masteryB.tier === 'developing', `Moderate performance tier (got ${masteryB.tier})`)

  // Case C: 0 attempts -> Not started
  const masteryC = calculateSkillMastery({
    attemptsCount: 0,
    correctCount: 0,
    hintsUsedCount: 0,
    daysSinceLastPracticed: 0,
  })
  assert(masteryC.score === 0 && masteryC.tier === 'not_started', 'Zero attempts is not_started')

  console.log(`\nHints & Mastery Tests: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

runHintsAndMasteryTests()
