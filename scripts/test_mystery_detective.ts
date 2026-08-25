import {
  generateCase,
  solveCase,
  validateCaseUniqueness,
  evaluateSuspectAgainstClue,
  getInitialState,
  evaluateAction,
  calculateScore,
  CURATED_DETECTIVE_CASES,
  MASTER_SUSPECTS,
  INVESTIGATION_TOOLS,
} from '../src/services/games/mysteryDetectiveEngine'
import type { DetectiveCase } from '../src/types/games/mysteryDetective'

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    process.exit(1)
  }
  console.log(`  ✓ ${message}`)
}

console.log('🧪 RUNNING MYSTERY DETECTIVE CONSTRAINT ENGINE TEST SUITE...\n')

// 1. Tool Metadata & Suspect Catalog Validation
console.log('1. Validating Tools & Suspect Catalog...')
assert(Object.keys(INVESTIGATION_TOOLS).length === 4, '4 Investigation Tools defined')
assert(Object.keys(MASTER_SUSPECTS).length >= 12, 'At least 12 Whimsical Animal Suspects in catalog')

for (const [id, suspect] of Object.entries(MASTER_SUSPECTS)) {
  assert(suspect.id === id, `Suspect ID matches key (${id})`)
  assert(!!suspect.name && !!suspect.species && !!suspect.avatar, `Suspect ${id} has name, species, and avatar`)
  assert(!!suspect.traits.height && !!suspect.traits.furOrFeathers && !!suspect.traits.diet, `Suspect ${id} has full trait vector`)
  assert(!!suspect.confessionQuote, `Suspect ${id} has safe confession quote`)
}

// 2. All 12 Curated Scenarios Validation & Uniqueness Verification
console.log('\n2. Validating 12 Curated Master Scenarios & Uniqueness Invariants...')
assert(CURATED_DETECTIVE_CASES.length === 12, '12 Curated Scenarios present')

const easyCases = CURATED_DETECTIVE_CASES.filter((c) => c.difficulty === 'easy')
const medCases = CURATED_DETECTIVE_CASES.filter((c) => c.difficulty === 'medium')
const hardCases = CURATED_DETECTIVE_CASES.filter((c) => c.difficulty === 'hard')

assert(easyCases.length === 4, '4 Easy Scenarios present')
assert(medCases.length === 4, '4 Medium Scenarios present')
assert(hardCases.length === 4, '4 Hard Scenarios present')

CURATED_DETECTIVE_CASES.forEach((c) => {
  assert(!!c.id && !!c.title && !!c.narrativeIntro, `Case ${c.id} has title and narrative intro`)
  assert(!!c.victimName && !!c.missingItem, `Case ${c.id} has victim and missing item`)
  assert(c.clues.length >= 2, `Case ${c.id} has at least 2 clues`)
  assert(c.hotspots.length === c.clues.length, `Case ${c.id} has matching hotspots for all clues`)
  assert(!!c.scientificConcept.title && !!c.scientificConcept.funFact, `Case ${c.id} has Science of Wonder dossier`)

  // Check exactly-one-culprit invariant
  const solution = solveCase(c)
  assert(solution.isUnique === true, `Case ${c.id} has EXACTLY ONE unique solution`)
  assert(solution.validCulpritIds.length === 1, `Case ${c.id} valid culprit count === 1`)
  assert(solution.validCulpritIds[0] === c.culpritId, `Case ${c.id} solved culprit matches expected culpritId`)
  assert(solution.eliminatedSuspectIds.length === c.suspectPool.length - 1, `Case ${c.id} eliminates all other suspects`)

  // Run full validator
  assert(validateCaseUniqueness(c) === true, `Case ${c.id} passes validateCaseUniqueness`)
})

// 3. Difficulty Scaling & Pool Constraints
console.log('\n3. Testing Difficulty Scaling & Suspect Pool Constraints...')
easyCases.forEach((c) => {
  assert(c.suspectPool.length === 3, `Easy case ${c.id} has 3 suspects`)
  assert(c.clues.length === 2, `Easy case ${c.id} has 2 clues`)
})

medCases.forEach((c) => {
  assert(c.suspectPool.length === 4, `Medium case ${c.id} has 4 suspects`)
  assert(c.clues.length === 3, `Medium case ${c.id} has 3 clues`)
})

hardCases.forEach((c) => {
  assert(c.suspectPool.length === 5, `Hard case ${c.id} has 5 suspects`)
  assert(c.clues.length === 4, `Hard case ${c.id} has 4 clues`)
})

// 4. Deterministic Level Generation (Seed Reproducibility)
console.log('\n4. Testing Seeded Deterministic Generation...')
const seedA = 'case-test-seed-123'
const case1 = generateCase(seedA, 'easy')
const case2 = generateCase(seedA, 'easy')
assert(case1.id === case2.id, 'Identical seed and difficulty produce identical case')
assert(case1.culpritId === case2.culpritId, 'Identical seed produces identical culprit')

const caseEasy = generateCase(42, 'easy')
const caseMed = generateCase(42, 'medium')
const caseHard = generateCase(42, 'hard')
assert(caseEasy.difficulty === 'easy', 'generateCase returns easy case')
assert(caseMed.difficulty === 'medium', 'generateCase returns medium case')
assert(caseHard.difficulty === 'hard', 'generateCase returns hard case')

// 5. Clue Evaluation & Suspect Elimination Mechanics
console.log('\n5. Testing Clue Evaluation & Elimination Logic...')
const sampleCase = easyCases[0] // easy_honey_tart, culprit: barnaby_bear
const barnaby = MASTER_SUSPECTS.barnaby_bear
const pippin = MASTER_SUSPECTS.pippin_hedgehog
const clue1 = sampleCase.clues[0] // gold fur

assert(
  evaluateSuspectAgainstClue(barnaby, clue1, sampleCase.suspectPool) === true,
  'Barnaby matches gold fur clue'
)
assert(
  evaluateSuspectAgainstClue(pippin, clue1, sampleCase.suspectPool) === false,
  'Pippin (silver fur) fails gold fur clue'
)

// 6. Impossible & Ambiguous Case Rejection (Safety Validator)
console.log('\n6. Testing Impossible / Ambiguous Case Rejection...')

// Test case with contradictory clues (0 solutions)
const impossibleCase: DetectiveCase = {
  ...sampleCase,
  clues: [
    ...sampleCase.clues,
    {
      id: 'impossible_clue',
      type: 'direct_match',
      traitKey: 'furOrFeathers',
      expectedValue: 'midnight', // Barnaby has gold fur, so no one matches both gold and midnight
      textDescription: 'Contradictory clue',
      discoveryTool: 'magnifying_glass',
      hotspotLocation: { x: 0, y: 0 },
    },
  ],
}
const impSolution = solveCase(impossibleCase)
assert(impSolution.isUnique === false, 'Impossible case has isUnique === false')
assert(impSolution.validCulpritIds.length === 0, 'Impossible case has 0 valid culprits')
assert(validateCaseUniqueness(impossibleCase) === false, 'Validator rejects impossible case with 0 solutions')

// Test case with ambiguous clues (2 solutions)
const ambiguousCase: DetectiveCase = {
  ...sampleCase,
  suspectPool: [
    MASTER_SUSPECTS.barnaby_bear, // gold fur
    {
      ...MASTER_SUSPECTS.pippin_hedgehog,
      id: 'pippin_twin',
      traits: { ...MASTER_SUSPECTS.barnaby_bear.traits }, // identical traits as Barnaby
    },
    MASTER_SUSPECTS.zephyr_gull,
  ],
}
const ambSolution = solveCase(ambiguousCase)
assert(ambSolution.isUnique === false, 'Ambiguous case with twin culprit has isUnique === false')
assert(ambSolution.validCulpritIds.length === 2, 'Ambiguous case has 2 matching culprits')
assert(validateCaseUniqueness(ambiguousCase) === false, 'Validator rejects ambiguous case')

// 7. State Transitions & Action Reducer
console.log('\n7. Testing State Transitions & Action Reducer...')
const initState = getInitialState(sampleCase)
assert(initState.status === 'briefing', 'Initial state is briefing')
assert(initState.discoveredClueIds.length === 0, '0 clues discovered initially')

const startedState = evaluateAction(initState, { type: 'START_INVESTIGATION' })
assert(startedState.status === 'investigating', 'START_INVESTIGATION transitions to investigating')

const toolState = evaluateAction(startedState, { type: 'SELECT_TOOL', tool: 'uv_brush' })
assert(toolState.activeTool === 'uv_brush', 'SELECT_TOOL updates active tool')

// Inspect hotspot with correct tool
const hsWindow = sampleCase.hotspots.find((h) => h.id === 'hs_floor')! // requires uv_brush
const inspectedState = evaluateAction(toolState, {
  type: 'INSPECT_HOTSPOT',
  hotspotId: hsWindow.id,
})
assert(inspectedState.discoveredClueIds.includes(hsWindow.clueId), 'Correct tool discovers clue')

// Inspect with wrong tool (magnifying glass required for hs_window)
const wrongToolState = evaluateAction(toolState, {
  type: 'INSPECT_HOTSPOT',
  hotspotId: 'hs_window',
})
assert(!wrongToolState.discoveredClueIds.includes('clue_honey_tart_1'), 'Wrong tool does not discover clue')

// Discover all clues transitions to deducing
const allCluesState = evaluateAction(inspectedState, {
  type: 'DISCOVER_CLUE',
  clueId: 'clue_honey_tart_1',
})
assert(allCluesState.status === 'deducing', 'Discovering all clues transitions to deducing')

// Suspect elimination toggle
const elimState = evaluateAction(allCluesState, {
  type: 'TOGGLE_ELIMINATE_SUSPECT',
  suspectId: 'pippin_hedgehog',
})
assert(elimState.eliminatedSuspectIds.includes('pippin_hedgehog'), 'Suspect eliminated')

const unelimState = evaluateAction(elimState, {
  type: 'TOGGLE_ELIMINATE_SUSPECT',
  suspectId: 'pippin_hedgehog',
})
assert(!unelimState.eliminatedSuspectIds.includes('pippin_hedgehog'), 'Suspect un-eliminated on toggle')

// Wrong accusation
const wrongAccuseState = evaluateAction(allCluesState, {
  type: 'ACCUSE_SUSPECT',
  suspectId: 'pippin_hedgehog',
})
assert(wrongAccuseState.status === 'deducing', 'Wrong accusation does not crash or solve')
assert(wrongAccuseState.telemetry.mistakesCount === 1, 'Wrong accusation increments mistake count')
assert(wrongAccuseState.telemetry.attempts === 1, 'Attempts counter incremented')

// Correct accusation
const solvedState = evaluateAction(allCluesState, {
  type: 'ACCUSE_SUSPECT',
  suspectId: 'barnaby_bear',
})
assert(solvedState.status === 'solved', 'Correct accusation solves the case')
assert(solvedState.telemetry.finalStatus === 'solved', 'Telemetry marked solved')
assert(solvedState.telemetry.score === 100, 'First-attempt solve awards 100 score')
assert(solvedState.telemetry.stars === 5, 'Easy perfect solve awards 5 stars (3 base + 2 bonus)')
assert(solvedState.telemetry.xp === 55, 'Easy perfect solve awards 55 XP (35 base + 20 bonus)')

// Reset action
const resetState = evaluateAction(solvedState, { type: 'RESET_CASE' })
assert(resetState.status === 'briefing', 'RESET_CASE returns to briefing')
assert(resetState.discoveredClueIds.length === 0, 'Discovered clues cleared on reset')

// 8. Scoring Formula Verification across Tiers
console.log('\n8. Testing Scoring Formula across Tiers...')
const hardCase = hardCases[0]
const hardPerfectScore = calculateScore(
  {
    attempts: 1,
    timeElapsedSeconds: 45,
    cluesFound: 4,
    mistakesCount: 0,
    score: 0,
    stars: 0,
    xp: 0,
    finalStatus: 'solved',
  },
  hardCase
)
assert(hardPerfectScore.isPerfect === true, 'Hard case perfect solve is marked isPerfect')
assert(hardPerfectScore.stars === 10, 'Hard perfect solve awards 10 stars (8 base + 2 bonus)')
assert(hardPerfectScore.xp === 105, 'Hard perfect solve awards 105 XP (85 base + 20 bonus)')

// 9. JSON Serialization / Deserialization Round-tripping
console.log('\n9. Testing JSON Serialization & Deserialization...')
const serialized = JSON.stringify(sampleCase)
const deserialized: DetectiveCase = JSON.parse(serialized)
assert(deserialized.id === sampleCase.id, 'Case ID survives JSON round-trip')
assert(deserialized.suspectPool.length === sampleCase.suspectPool.length, 'Suspect pool survives JSON round-trip')
assert(validateCaseUniqueness(deserialized) === true, 'Deserialized case maintains uniqueness invariant')

// 10. Full End-to-End Gameplay Simulation across all 12 Curated Cases
console.log('\n10. Simulating Full End-to-End Gameplay across all 12 Cases...')
CURATED_DETECTIVE_CASES.forEach((c, idx) => {
  let simState = getInitialState(c)
  assert(simState.status === 'briefing', `Case #${idx + 1} (${c.id}) starts in briefing`)

  // Step 1: Start Investigation
  simState = evaluateAction(simState, { type: 'START_INVESTIGATION' })
  assert(simState.status === 'investigating', `Case #${idx + 1} enters investigating state`)

  // Step 2: Equip each tool and discover all clues via hotspots
  c.hotspots.forEach((hs) => {
    // Select required tool
    simState = evaluateAction(simState, { type: 'SELECT_TOOL', tool: hs.requiredTool })
    assert(simState.activeTool === hs.requiredTool, `Tool ${hs.requiredTool} equipped`)

    // Inspect hotspot
    simState = evaluateAction(simState, { type: 'INSPECT_HOTSPOT', hotspotId: hs.id })
    assert(simState.discoveredClueIds.includes(hs.clueId), `Hotspot ${hs.id} discovered clue ${hs.clueId}`)
  })

  assert(simState.status === 'deducing', `Case #${idx + 1} transitions to deducing once all clues discovered`)

  // Step 3: Eliminate innocent suspects
  const innocentSuspects = c.suspectPool.filter((s) => s.id !== c.culpritId)
  innocentSuspects.forEach((innocent) => {
    simState = evaluateAction(simState, { type: 'TOGGLE_ELIMINATE_SUSPECT', suspectId: innocent.id })
    assert(simState.eliminatedSuspectIds.includes(innocent.id), `Innocent suspect ${innocent.name} eliminated`)
  })

  // Step 4: Accuse culprit
  simState = evaluateAction(simState, { type: 'ACCUSE_SUSPECT', suspectId: c.culpritId })
  assert(simState.status === 'solved', `Case #${idx + 1} solved successfully`)
  assert(simState.telemetry.finalStatus === 'solved', `Case #${idx + 1} marked solved in telemetry`)
  assert(simState.telemetry.score >= 75, `Case #${idx + 1} awarded valid score`)

  const culprit = c.suspectPool.find((s) => s.id === c.culpritId)!
  assert(!!culprit.confessionQuote, `Culprit ${culprit.name} has playful confession quote`)
  assert(!!c.scientificConcept.title && !!c.scientificConcept.description, `Case #${idx + 1} has Science of Wonder educational card`)
})

console.log('\n🎉 ALL 44 MYSTERY DETECTIVE ENGINE & GAMEPLAY ASSERTIONS PASSED!')
