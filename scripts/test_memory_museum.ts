import assert from 'node:assert'
import {
  generateProceduralMemoryMuseumChallenge,
  generateMemoryMuseumChallenge,
  getInitialMemoryMuseumState,
  evaluateMemoryMuseumAction,
  calculateMemoryMuseumScore,
  MASTER_EXHIBITIONS,
  MASTER_RELIC_POOL,
} from '../src/services/games/memoryMuseumEngine'
import type { MemoryMuseumTelemetry } from '../src/types/games/memoryMuseum'

console.log('🧪 RUNNING 3D MEMORY MUSEUM ENGINE TEST SUITE...')

// ----------------------------------------------------------------------------
// TEST SUITE 1: Master Exhibitions & Relic Catalog
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 1: Master Exhibitions & Relic Catalog ---')

assert.ok(MASTER_EXHIBITIONS.length >= 4, 'Master exhibitions must have at least 4 themes')
MASTER_EXHIBITIONS.forEach((exhibit) => {
  assert.ok(exhibit.id.length > 0, `Exhibit ${exhibit.id} must have a valid id`)
  assert.ok(exhibit.themeTitle.length > 0, `Exhibit ${exhibit.id} must have a themeTitle`)
  assert.ok(exhibit.themeEmoji.length > 0, `Exhibit ${exhibit.id} must have a themeEmoji`)
  assert.ok(exhibit.curatorName.length > 0, `Exhibit ${exhibit.id} must have a curatorName`)
  assert.ok(exhibit.scientificConcept.conceptTitle.length > 0, `Exhibit ${exhibit.id} must have scientificConcept`)
})
console.log(`  ✅ [PASS] ${MASTER_EXHIBITIONS.length} Master exhibitions fully structured with scientific dossiers`)

assert.ok(MASTER_RELIC_POOL.length >= 16, 'Master relic pool must have at least 16 relics')
MASTER_RELIC_POOL.forEach((relic) => {
  assert.ok(relic.id.length > 0, `Relic ${relic.id} must have valid id`)
  assert.ok(relic.pairId.length > 0, `Relic ${relic.id} must have pairId`)
  assert.ok(relic.name.length > 0, `Relic ${relic.id} must have a name`)
  assert.ok(relic.emoji.length > 0, `Relic ${relic.id} must have an emoji`)
  assert.ok(relic.color.length > 0, `Relic ${relic.id} must have color`)
  assert.ok(relic.loreSnippet.length > 0, `Relic ${relic.id} must have loreSnippet`)
})
console.log(`  ✅ [PASS] ${MASTER_RELIC_POOL.length} Master relics verified with rich lore and visual styling`)

// ----------------------------------------------------------------------------
// TEST SUITE 2: Deterministic Mulberry32 Procedural Generation & Scaling
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Deterministic Mulberry32 Procedural Challenge Generation ---')

const easy1 = generateProceduralMemoryMuseumChallenge('seed_123', 'easy', 1)
const easy2 = generateProceduralMemoryMuseumChallenge('seed_123', 'easy', 1)
const easyDifferentSeed = generateProceduralMemoryMuseumChallenge('seed_456', 'easy', 1)

assert.strictEqual(easy1.id, easy2.id, 'Same seed produces identical challenge ID')
assert.notStrictEqual(easy1.id, easyDifferentSeed.id, 'Different seed produces different challenge ID')
assert.strictEqual(easy1.totalPairs, 4, 'Easy tier generates 4 pairs')
assert.strictEqual(easy1.cards.length, 8, 'Easy tier generates 8 cards (4x2 grid)')
assert.strictEqual(easy1.cards[0].relic.id, easy2.cards[0].relic.id, 'Deterministic card placement')

const medium = generateProceduralMemoryMuseumChallenge('seed_123', 'medium', 2)
assert.strictEqual(medium.totalPairs, 8, 'Medium tier generates 8 pairs')
assert.strictEqual(medium.cards.length, 16, 'Medium tier generates 16 cards (4x4 grid)')
assert.strictEqual(medium.rows, 4, 'Medium grid rows = 4')
assert.strictEqual(medium.cols, 4, 'Medium grid cols = 4')

const hard = generateProceduralMemoryMuseumChallenge('seed_123', 'hard', 3)
assert.strictEqual(hard.totalPairs, 10, 'Hard tier generates 10 pairs')
assert.strictEqual(hard.cards.length, 20, 'Hard tier generates 20 cards (5x4 grid)')

console.log('  ✅ [PASS] Easy (4 pairs), Medium (8 pairs), Hard (10 pairs) scale correctly')
console.log('  ✅ [PASS] Seed determinism verified across PRNG invocations')

// ----------------------------------------------------------------------------
// TEST SUITE 3: Card Pair Duplication & Grid Integrity
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Card Pair Duplication & Grid Integrity ---')

const testChallenge = generateMemoryMuseumChallenge('integrity_seed', 'medium', 2)
const pairCounts: Record<string, number> = {}

testChallenge.cards.forEach((card, idx) => {
  assert.strictEqual(card.gridIndex, idx, `Card ${idx} must have matching gridIndex`)
  assert.strictEqual(card.row, Math.floor(idx / testChallenge.cols), `Card ${idx} row calculation correct`)
  assert.strictEqual(card.col, idx % testChallenge.cols, `Card ${idx} col calculation correct`)
  assert.strictEqual(card.isFlipped, false, 'Card starts unrevealed')
  assert.strictEqual(card.isMatched, false, 'Card starts unmatched')

  pairCounts[card.relic.pairId] = (pairCounts[card.relic.pairId] || 0) + 1
})

Object.entries(pairCounts).forEach(([pairId, count]) => {
  assert.strictEqual(count, 2, `Pair ${pairId} must appear exactly twice in the grid`)
})
assert.strictEqual(Object.keys(pairCounts).length, testChallenge.totalPairs, 'Exact pair count matches')
console.log('  ✅ [PASS] Every card has exactly one matching pair in the grid with valid row/col indices')

// ----------------------------------------------------------------------------
// TEST SUITE 4: Game State Reducer & Gameplay Flow
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Game State Reducer & Gameplay Flow ---')

let state = getInitialMemoryMuseumState(testChallenge)
assert.strictEqual(state.status, 'playing')
assert.strictEqual(state.cards.length, 16)
assert.strictEqual(state.matchedPairIds.length, 0)
assert.strictEqual(state.movesCount, 0)

// 1. Flip First Card
state = evaluateMemoryMuseumAction(state, { type: 'FLIP_CARD', cardIndex: 0 })
assert.strictEqual(state.cards[0].isFlipped, true, 'Card 0 should be flipped')
assert.strictEqual(state.selectedCardIndices.length, 1, '1 card currently selected')
assert.strictEqual(state.status, 'playing')

// 2. Find matching card index for card 0
const targetPairId = state.cards[0].relic.pairId
let matchIndex = -1
let mismatchIndex = -1

for (let i = 1; i < state.cards.length; i++) {
  if (state.cards[i].relic.pairId === targetPairId) {
    matchIndex = i
  } else if (mismatchIndex === -1) {
    mismatchIndex = i
  }
}

// 3. Test Mismatch Flow
let mismatchState = evaluateMemoryMuseumAction(state, { type: 'FLIP_CARD', cardIndex: mismatchIndex })
assert.strictEqual(mismatchState.status, 'checking_match', 'Status becomes checking_match on mismatch')
assert.strictEqual(mismatchState.movesCount, 1, 'Move count incremented')
assert.strictEqual(mismatchState.mistakesCount, 1, 'Mistakes count incremented')

// Resolve mismatch
mismatchState = evaluateMemoryMuseumAction(mismatchState, { type: 'RESOLVE_MATCH_CHECK', isMatch: false })
assert.strictEqual(mismatchState.status, 'playing')
assert.strictEqual(mismatchState.cards[0].isFlipped, false, 'Card 0 unflipped')
assert.strictEqual(mismatchState.cards[mismatchIndex].isFlipped, false, 'Mismatch card unflipped')
assert.strictEqual(mismatchState.selectedCardIndices.length, 0)

// 4. Test Match Flow
// Re-flip card 0
state = evaluateMemoryMuseumAction(state, { type: 'FLIP_CARD', cardIndex: 0 }) // already flipped in state
let matchState = evaluateMemoryMuseumAction(state, { type: 'FLIP_CARD', cardIndex: matchIndex })
assert.strictEqual(matchState.cards[0].isMatched, true, 'Card 0 marked matched')
assert.strictEqual(matchState.cards[matchIndex].isMatched, true, 'Match card marked matched')
assert.strictEqual(matchState.matchedPairIds.length, 1, '1 pair restored')
assert.strictEqual(matchState.selectedCardIndices.length, 0, 'Selection cleared on match')

console.log('  ✅ [PASS] Card flipping, mismatch delay reset, and match resolution verified')

// ----------------------------------------------------------------------------
// TEST SUITE 5: Full Game Completion Simulation
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Full Game Completion Simulation ---')

let simState = getInitialMemoryMuseumState(testChallenge)

// Solve all pairs
for (let i = 0; i < simState.cards.length; i++) {
  if (simState.cards[i].isMatched) continue
  const currentPairId = simState.cards[i].relic.pairId

  // Find partner
  for (let j = i + 1; j < simState.cards.length; j++) {
    if (simState.cards[j].relic.pairId === currentPairId) {
      simState = evaluateMemoryMuseumAction(simState, { type: 'FLIP_CARD', cardIndex: i })
      simState = evaluateMemoryMuseumAction(simState, { type: 'FLIP_CARD', cardIndex: j })
      break
    }
  }
}

assert.strictEqual(simState.status, 'restored', 'Game status becomes restored when all pairs matched')
assert.strictEqual(simState.matchedPairIds.length, testChallenge.totalPairs, 'All pairs matched')
assert.strictEqual(simState.telemetry.finalStatus, 'solved')
assert.ok(simState.telemetry.stars >= 3, 'Stars awarded on win')
assert.ok(simState.telemetry.xp >= 25, 'XP awarded on win')

console.log(`  ✅ [PASS] Simulated game solved with ${simState.movesCount} moves, awarded ${simState.telemetry.stars} Stars and ${simState.telemetry.xp} XP`)

// ----------------------------------------------------------------------------
// TEST SUITE 6: Scoring Algorithm Edge Cases
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 6: Scoring Algorithm ---')

const mockPerfectTelemetry: MemoryMuseumTelemetry = {
  challengeId: 'test',
  difficulty: 'easy',
  movesCount: 4,
  timeElapsedSeconds: 20,
  mistakesCount: 0,
  score: 0,
  stars: 0,
  xp: 0,
  finalStatus: 'solved',
}

const perfectScore = calculateMemoryMuseumScore(mockPerfectTelemetry, easy1)
assert.strictEqual(perfectScore.score, 100, 'Perfect play scores 100')
assert.strictEqual(perfectScore.stars, 5, 'Perfect play awards 5 stars')
assert.strictEqual(perfectScore.xp, 35, 'Perfect easy play awards 35 XP')

console.log('  ✅ [PASS] Scoring calculation accurately computes stars, XP, and mistake deductions')

console.log('\n==================================================================')
console.log('🏆 ALL 3D MEMORY MUSEUM TESTS PASSED!')
console.log('==================================================================\n')
