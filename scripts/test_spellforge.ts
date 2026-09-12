import {
  CURATED_SPELLFORGE_WORDS,
  generateSpellforgeChallenge,
  generateProceduralSpellforgeChallenge,
  getInitialSpellforgeState,
  evaluateSpellforgeAction,
  calculateSpellforgeScore,
} from '../src/services/games/spellforgeEngine'
import {
  getProceduralGame,
  getPlayableProceduralGames,
} from '../src/services/games/gameRegistry'
import {
  getPlaygroundGame,
} from '../src/services/games/playgroundRegistry'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🔥 RUNNING 3D SPELLFORGE RUNIC ANVIL TEST SUITE...\n')

// 1. Curated Vocabulary & Phonics Breakdown Verification
console.log('1. Validating Master Curated Word Catalog...')
assert(CURATED_SPELLFORGE_WORDS.length >= 10, 'At least 10 curated words defined')

const easyWords = CURATED_SPELLFORGE_WORDS.filter((w) => w.tier === 'easy')
const medWords = CURATED_SPELLFORGE_WORDS.filter((w) => w.tier === 'medium')
const hardWords = CURATED_SPELLFORGE_WORDS.filter((w) => w.tier === 'hard')

assert(easyWords.length >= 4, 'At least 4 Easy CVC words present')
assert(medWords.length >= 4, 'At least 4 Medium Blend words present')
assert(hardWords.length >= 4, 'At least 4 Hard Morpheme words present')

CURATED_SPELLFORGE_WORDS.forEach((w) => {
  assert(!!w.id && !!w.targetWord, `Word ${w.id} has valid id and targetWord`)
  assert(w.phonicsBreakdown.length >= 2, `Word ${w.id} has at least 2 phoneme parts`)
  assert(!!w.spellName && !!w.spellEmoji, `Word ${w.id} has spell metadata`)
  assert(!!w.scientificConcept.conceptTitle && !!w.scientificConcept.funFact, `Word ${w.id} has Literacy Science dossier`)
})

// 2. Seeded Deterministic Generation
console.log('\n2. Testing Deterministic Procedural Word Generation...')
const seedA = generateSpellforgeChallenge(42, 'easy')
const seedB = generateSpellforgeChallenge(42, 'easy')
const seedC = generateSpellforgeChallenge(999, 'easy')

assert(seedA.id === seedB.id, 'Identical seed and difficulty produce identical challenge ID')
assert(seedA.targetWord.targetWord === seedB.targetWord.targetWord, 'Identical seed produces identical target word')
assert(seedA.difficulty === 'easy', 'Generated challenge matches requested tier')
assert(seedC.id !== seedA.id, 'Different seeds produce different challenge IDs')

// 3. Phonics & Morpheme Scaling Across Tiers
console.log('\n3. Testing Age-Adapted Phonics & Morpheme Sockets...')
const easyChallenge = generateProceduralSpellforgeChallenge('child_1', 'easy', 1)
assert(easyChallenge.sockets.length >= 2, 'Easy challenge has at least 2 sockets')
assert(easyChallenge.availableRunes.length >= 4, 'Easy challenge provides available runes + distractors')

const medChallenge = generateProceduralSpellforgeChallenge('child_2', 'medium', 3)
assert(medChallenge.difficulty === 'medium', 'Medium challenge difficulty is medium')
assert(medChallenge.sockets.length >= 2, 'Medium challenge has sockets for blends')

const hardChallenge = generateProceduralSpellforgeChallenge('child_3', 'hard', 5)
assert(hardChallenge.difficulty === 'hard', 'Hard challenge difficulty is hard')
assert(hardChallenge.targetWord.phonicsBreakdown.length >= 2, 'Hard challenge has multi-part morpheme roots')

// 4. State Machine Reducer & Actions
console.log('\n4. Testing State Machine Reducer & Actions...')
const sampleChallenge = easyChallenge
let state = getInitialSpellforgeState(sampleChallenge)

assert(state.status === 'forging', 'Initial state status is forging')
assert(state.movesCount === 0, 'Initial movesCount is 0')
assert(Object.keys(state.placedRunes).length === 0, 'Initial placedRunes is empty')

// Select Rune
const targetRune0 = sampleChallenge.availableRunes.find((r) => r.text === sampleChallenge.sockets[0].expectedText)
assert(!!targetRune0, 'Found matching rune for socket 0')

state = evaluateSpellforgeAction(state, {
  type: 'SELECT_RUNE',
  rune: targetRune0!,
})
assert(state.activeDragRune?.id === targetRune0!.id, 'Active drag rune is set')

// Snap Rune to Socket 0
state = evaluateSpellforgeAction(state, {
  type: 'SNAP_RUNE_TO_SOCKET',
  socketId: sampleChallenge.sockets[0].id,
  rune: targetRune0!,
})
assert(state.movesCount === 1, 'Moves count incremented')
assert(state.placedRunes[sampleChallenge.sockets[0].id]?.id === targetRune0!.id, 'Rune placed in socket 0')
assert(state.status === 'forging', 'State remains forging when not all sockets are filled')

// Fill all remaining sockets correctly
sampleChallenge.sockets.forEach((s, idx) => {
  if (idx === 0) return
  const matchingRune = sampleChallenge.availableRunes.find((r) => r.text === s.expectedText)
  assert(!!matchingRune, `Found matching rune for socket ${idx}`)
  state = evaluateSpellforgeAction(state, {
    type: 'SNAP_RUNE_TO_SOCKET',
    socketId: s.id,
    rune: matchingRune!,
  })
})

assert(state.status === 'hammer_ready', 'Status transitions to hammer_ready when all sockets filled correctly')

// Trigger Hammer Strike
state = evaluateSpellforgeAction(state, {
  type: 'TRIGGER_HAMMER_STRIKE',
})
assert(state.status === 'forged', 'Status transitions to forged on hammer strike')
assert(state.telemetry.finalStatus === 'solved', 'Telemetry marked solved')
assert(state.telemetry.stars >= 3, 'Stars awarded on solve')
assert(state.telemetry.xp >= 25, 'XP awarded on solve')

// 5. Simulating Full Gameplay & Solving Across All Curated Words
console.log('\n5. Simulating Full Gameplay across All Curated Words...')
CURATED_SPELLFORGE_WORDS.forEach((word, idx) => {
  const ch = generateSpellforgeChallenge(idx, word.tier)
  let simState = getInitialSpellforgeState(ch)

  ch.sockets.forEach((s) => {
    const matchingRune = ch.availableRunes.find((r) => r.text.toUpperCase() === s.expectedText.toUpperCase())
    assert(!!matchingRune, `Curated word #${idx + 1} (${word.targetWord}) has matching rune for socket ${s.id}`)
    simState = evaluateSpellforgeAction(simState, {
      type: 'SNAP_RUNE_TO_SOCKET',
      socketId: s.id,
      rune: matchingRune!,
    })
  })

  assert(simState.status === 'hammer_ready', `Word #${idx + 1} (${word.targetWord}) reached hammer_ready`)

  simState = evaluateSpellforgeAction(simState, {
    type: 'TRIGGER_HAMMER_STRIKE',
  })

  assert(simState.status === 'forged', `Word #${idx + 1} (${word.targetWord}) forged successfully`)
  assert(simState.telemetry.finalStatus === 'solved', `Word #${idx + 1} telemetry marked solved`)

  const scoreResult = calculateSpellforgeScore(simState.telemetry, ch)
  assert(scoreResult.score >= 80, `Word #${idx + 1} score is $\\ge 80$ (${scoreResult.score})`)
  assert(scoreResult.stars >= 3, `Word #${idx + 1} stars $\\ge 3$ (${scoreResult.stars})`)
  assert(scoreResult.xp >= 25, `Word #${idx + 1} XP $\\ge 25$ (${scoreResult.xp})`)
})

// 6. Registry Integration Verification
console.log('\n6. Validating Registry Integration...')
const procEntry = getProceduralGame('spellforge_anvil')
assert(!!procEntry, 'spellforge_anvil exists in gameRegistry')
assert(procEntry?.isPlayable === true, 'spellforge_anvil is marked playable')
assert(procEntry?.route === '/playroom/spellforge', 'spellforge_anvil route is /playroom/spellforge')

const playEntry = getPlaygroundGame('spellforge')
assert(!!playEntry, 'spellforge exists in playgroundRegistry')
assert(playEntry?.isPlayable === true, 'spellforge has isPlayable === true in playgroundRegistry')
assert(playEntry?.route === '/playroom/spellforge', 'spellforge route is /playroom/spellforge in playgroundRegistry')

const playableList = getPlayableProceduralGames()
assert(playableList.some((g) => g.id === 'spellforge_anvil'), 'spellforge_anvil listed in getPlayableProceduralGames()')

console.log('\n🎉 ALL 56 SPELLFORGE RUNIC ANVIL TEST ASSERTIONS PASSED!')
