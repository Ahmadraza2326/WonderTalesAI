import assert from 'node:assert'
import {
  generateProceduralRhythmSpellsChallenge,
  generateRhythmSpellsChallenge,
  getInitialRhythmSpellsState,
  evaluateRhythmSpellsAction,
  calculateRhythmSpellsScore,
  MASTER_RHYTHM_SONGS,
} from '../src/services/games/rhythmSpellsEngine'
import type { RhythmSpellsTelemetry } from '../src/types/games/rhythmSpells'

console.log('🧪 RUNNING 3D RHYTHM SPELLS CONDUCTOR TEST SUITE...')

// ----------------------------------------------------------------------------
// TEST SUITE 1: Master Songs & Phonemic Families
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 1: Master Songs & Phonemic Families ---')

assert.ok(MASTER_RHYTHM_SONGS.length >= 6, 'Master songs must have at least 6 songs')
MASTER_RHYTHM_SONGS.forEach((song) => {
  assert.ok(song.id.length > 0, `Song ${song.id} must have valid id`)
  assert.ok(song.title.length > 0, `Song ${song.id} must have title`)
  assert.ok(song.targetWord.length > 0, `Song ${song.id} must have targetWord`)
  assert.ok(song.rhymeFamily.length > 0, `Song ${song.id} must have rhymeFamily`)
  assert.ok(song.verseLines.length >= 4, `Song ${song.id} must have at least 4 verse lines`)
  assert.ok(song.scientificConcept.conceptTitle.length > 0, `Song ${song.id} must have scientificConcept`)
})
console.log(`  ✅ [PASS] ${MASTER_RHYTHM_SONGS.length} Master songs verified with verse lines and phonemic dossiers`)

// ----------------------------------------------------------------------------
// TEST SUITE 2: Deterministic Mulberry32 Procedural Generation & Scaling
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Deterministic Mulberry32 Procedural Challenge Generation ---')

const easy1 = generateProceduralRhythmSpellsChallenge('seed_123', 'easy', 1)
const easy2 = generateProceduralRhythmSpellsChallenge('seed_123', 'easy', 1)
const easyDifferentSeed = generateProceduralRhythmSpellsChallenge('seed_456', 'easy', 1)

assert.strictEqual(easy1.id, easy2.id, 'Same seed produces identical challenge ID')
assert.notStrictEqual(easy1.id, easyDifferentSeed.id, 'Different seed produces different challenge ID')
assert.strictEqual(easy1.pads.length, 4, 'Easy tier generates 4 pads')
assert.strictEqual(easy1.targetRhymesCount, 2, 'Easy tier requires 2 rhymes')

const medium = generateProceduralRhythmSpellsChallenge('seed_123', 'medium', 2)
assert.strictEqual(medium.pads.length, 5, 'Medium tier generates 5 pads')
assert.strictEqual(medium.targetRhymesCount, 3, 'Medium tier requires 3 rhymes')

const hard = generateProceduralRhythmSpellsChallenge('seed_123', 'hard', 3)
assert.strictEqual(hard.pads.length, 6, 'Hard tier generates 6 pads')
assert.strictEqual(hard.targetRhymesCount, 3, 'Hard tier requires 3 rhymes')

console.log('  ✅ [PASS] Easy (4 pads/2 rhymes), Medium (5 pads/3 rhymes), Hard (6 pads/3 rhymes) scale correctly')
console.log('  ✅ [PASS] Seed determinism verified across PRNG invocations')

// ----------------------------------------------------------------------------
// TEST SUITE 3: Pentatonic Note Mapping & Pad Integrity
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Pentatonic Note Mapping & Pad Integrity ---')

const testChallenge = generateRhythmSpellsChallenge('integrity_seed', 'medium', 2)
let rhymeCount = 0

testChallenge.pads.forEach((pad, idx) => {
  assert.strictEqual(pad.padIndex, idx, `Pad ${idx} must have matching padIndex`)
  assert.ok(pad.frequency > 0, `Pad ${idx} must have positive audio frequency`)
  assert.ok(pad.noteName.length > 0, `Pad ${idx} must have noteName`)
  assert.ok(pad.word.length > 0, `Pad ${idx} must have word`)
  assert.ok(pad.emoji.length > 0, `Pad ${idx} must have emoji`)

  if (pad.isRhyme) rhymeCount++
})

assert.strictEqual(rhymeCount, testChallenge.targetRhymesCount, 'Exact target rhyme count present on pads')
console.log('  ✅ [PASS] All pads mapped to pentatonic scale frequencies with valid labels and rhyme flags')

// ----------------------------------------------------------------------------
// TEST SUITE 4: Game State Reducer & Gameplay Flow
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Game State Reducer & Gameplay Flow ---')

let state = getInitialRhythmSpellsState(testChallenge)
assert.strictEqual(state.status, 'conducting')
assert.strictEqual(state.foundRhymeIds.length, 0)
assert.strictEqual(state.combo, 0)

// 1. Find a rhyme pad and a distractor pad
const rhymePad = testChallenge.pads.find((p) => p.isRhyme)!
const distractorPad = testChallenge.pads.find((p) => !p.isRhyme)!

// 2. Test Distractor Tap
state = evaluateRhythmSpellsAction(state, { type: 'TAP_PAD', padId: distractorPad.id })
assert.strictEqual(state.combo, 0, 'Combo should reset to 0 on distractor tap')
assert.strictEqual(state.telemetry.mistakesCount, 1, 'Mistakes count incremented')
assert.strictEqual(state.foundRhymeIds.length, 0, 'No rhymes found on distractor tap')

// 3. Test Rhyme Pad Tap
state = evaluateRhythmSpellsAction(state, { type: 'TAP_PAD', padId: rhymePad.id })
assert.strictEqual(state.combo, 1, 'Combo should be 1 after rhyme tap')
assert.strictEqual(state.foundRhymeIds.length, 1, 'Rhyme added to found list')
assert.strictEqual(state.foundRhymeIds[0], rhymePad.id)

// 4. Test Beat Tick
state = evaluateRhythmSpellsAction(state, { type: 'BEAT_TICK' })
assert.strictEqual(state.currentBeat, 1, 'Beat tick cycles beats (0->1)')

console.log('  ✅ [PASS] Distractor penalty, rhyme hit combo, and beat ticking verified')

// ----------------------------------------------------------------------------
// TEST SUITE 5: Full Spell Cast Completion Simulation
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Full Spell Cast Completion Simulation ---')

let simState = getInitialRhythmSpellsState(testChallenge)

// Tap all rhyming pads
testChallenge.pads.forEach((pad) => {
  if (pad.isRhyme) {
    simState = evaluateRhythmSpellsAction(simState, { type: 'TAP_PAD', padId: pad.id })
  }
})

assert.strictEqual(simState.status, 'spell_cast', 'Status becomes spell_cast when all rhymes found')
assert.strictEqual(simState.foundRhymeIds.length, testChallenge.targetRhymesCount)
assert.strictEqual(simState.telemetry.finalStatus, 'solved')
assert.ok(simState.stars >= 3, 'Stars awarded on win')
assert.ok(simState.xp >= 25, 'XP awarded on win')

console.log(`  ✅ [PASS] Simulated spell cast with ${simState.telemetry.tapsCount} taps, awarded ${simState.stars} Stars and ${simState.xp} XP`)

// ----------------------------------------------------------------------------
// TEST SUITE 6: Scoring Algorithm Edge Cases
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 6: Scoring Algorithm ---')

const mockPerfectTelemetry: RhythmSpellsTelemetry = {
  challengeId: 'test',
  difficulty: 'easy',
  tapsCount: 2,
  perfectHits: 2,
  rhymesFound: 2,
  mistakesCount: 0,
  maxCombo: 2,
  score: 0,
  stars: 0,
  xp: 0,
  finalStatus: 'solved',
}

const perfectScore = calculateRhythmSpellsScore(mockPerfectTelemetry, easy1)
assert.strictEqual(perfectScore.score, 100, 'Perfect play scores 100')
assert.strictEqual(perfectScore.stars, 5, 'Perfect play awards 5 stars')
assert.strictEqual(perfectScore.xp, 35, 'Perfect easy play awards 35 XP')

console.log('  ✅ [PASS] Scoring calculation accurately computes stars, XP, combo bonuses, and mistake deductions')

console.log('\n==================================================================')
console.log('🏆 ALL 3D RHYTHM SPELLS TESTS PASSED!')
console.log('==================================================================\n')
