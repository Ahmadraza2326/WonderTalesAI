import assert from 'node:assert/strict'
import {
  SPECTRAL_COLORS,
  CURATED_CONSTELLATIONS,
  CONSTELLATION_SCIENCE_CONCEPTS,
  normalizeEdge,
  validateConstellationConnections,
  generateProceduralConstellationChallenge,
} from '../src/services/games/cosmicConstellationEngine'
import type { StarSpectralClass } from '../src/types/games/cosmicConstellation'

console.log('==================================================================')
console.log('✨ RUNNING 3D COSMIC CONSTELLATION BUILDER ENGINE TEST SUITE')
console.log('==================================================================\n')

let passed = 0
let total = 0

function test(name: string, fn: () => void) {
  total++
  try {
    fn()
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`)
    throw err
  }
}

// --- 1. Star Spectral Classification Catalog ---
console.log('⭐ 1. Star Spectral Classification Catalog')

test('Spectral classification contains all 8 astronomical star classes with aura styling', () => {
  const expectedClasses: StarSpectralClass[] = [
    'O_BLUE',
    'B_BLUE_WHITE',
    'A_WHITE',
    'F_YELLOW_WHITE',
    'G_YELLOW',
    'K_ORANGE',
    'M_RED',
    'PULSAR',
  ]
  for (const s of expectedClasses) {
    assert.ok(SPECTRAL_COLORS[s], `Class ${s} must exist in spectral catalog`)
    assert.ok(SPECTRAL_COLORS[s].color.startsWith('#'), `Class ${s} must have hex color`)
    assert.ok(SPECTRAL_COLORS[s].name.length > 0, `Class ${s} must have a name`)
  }
})

// --- 2. Curated Constellation Library ---
console.log('\n📜 2. Curated Constellation Library')

test('Library contains core astronomical constellations with valid stars & geometry edges', () => {
  assert.ok(CURATED_CONSTELLATIONS.length >= 4, 'Must have at least 4 flagship constellations')
  for (const c of CURATED_CONSTELLATIONS) {
    assert.ok(c.id.length > 0, 'Constellation must have ID')
    assert.ok(c.name.length > 0, 'Constellation must have name')
    assert.ok(c.latinName.length > 0, 'Constellation must have Latin name')
    assert.ok(c.stars.length >= 5, `${c.name} must have at least 5 stars`)
    assert.ok(c.requiredEdges.length >= 4, `${c.name} must have at least 4 required edges`)

    for (const star of c.stars) {
      assert.ok(star.name.length > 0, 'Star must have a name')
      assert.ok(star.distanceLightYears > 0, 'Star must have positive distance in light-years')
      assert.ok(star.magnitude > 0, 'Star must have positive apparent magnitude')
    }
  }
})

// --- 3. Graph Edge Normalization & Connection Validation ---
console.log('\n📐 3. Graph Edge Normalization & Connection Validation')

test('Edge normalization is order-independent (A--B equals B--A)', () => {
  assert.equal(normalizeEdge('star_1', 'star_2'), normalizeEdge('star_2', 'star_1'))
  assert.equal(normalizeEdge('alpha', 'beta'), 'alpha--beta')
})

test('Partial connections calculate accurate progress and completion flags', () => {
  const cas = CURATED_CONSTELLATIONS.find((c) => c.id === 'cassiopeia')!
  // Connect 2 of 4 required edges
  const partialEdges: [string, string][] = [
    ['cas_caph', 'cas_schedar'],
    ['cas_schedar', 'cas_navi'],
  ]

  const evalResult = validateConstellationConnections(cas, partialEdges)
  assert.equal(evalResult.isComplete, false)
  assert.equal(evalResult.correctCount, 2)
  assert.equal(evalResult.totalRequired, 4)
  assert.equal(evalResult.accuracyPercentage, 50)
  assert.equal(evalResult.extraCount, 0)
})

test('Full constellation completion triggers isComplete: true with 100% accuracy', () => {
  const cas = CURATED_CONSTELLATIONS.find((c) => c.id === 'cassiopeia')!
  const fullEdges: [string, string][] = [
    ['cas_caph', 'cas_schedar'],
    ['cas_schedar', 'cas_navi'],
    ['cas_navi', 'cas_ruchbah'],
    ['cas_ruchbah', 'cas_segin'],
  ]

  const evalResult = validateConstellationConnections(cas, fullEdges)
  assert.equal(evalResult.isComplete, true)
  assert.equal(evalResult.correctCount, 4)
  assert.equal(evalResult.accuracyPercentage, 100)
  assert.equal(evalResult.extraCount, 0)
})

test('Distractor connections are counted separately without breaking valid progress', () => {
  const cas = CURATED_CONSTELLATIONS.find((c) => c.id === 'cassiopeia')!
  const edgesWithMistake: [string, string][] = [
    ['cas_caph', 'cas_schedar'],
    ['cas_caph', 'distractor_1'], // Invalid line
  ]

  const evalResult = validateConstellationConnections(cas, edgesWithMistake)
  assert.equal(evalResult.isComplete, false)
  assert.equal(evalResult.correctCount, 1)
  assert.equal(evalResult.extraCount, 1)
})

// --- 4. Deterministic Mulberry32 Procedural Generation ---
console.log('\n🎲 4. Deterministic Mulberry32 Procedural Generation')

test('Identical seeds generate identical star chart challenges', () => {
  const c1 = generateProceduralConstellationChallenge(998877, 'medium')
  const c2 = generateProceduralConstellationChallenge(998877, 'medium')

  assert.equal(c1.id, c2.id)
  assert.equal(c1.targetConstellation.id, c2.targetConstellation.id)
  assert.equal(c1.distractorStars.length, c2.distractorStars.length)
  assert.deepEqual(c1.distractorStars, c2.distractorStars)
})

test('Difficulty levels scale distractor star counts appropriately', () => {
  const easy = generateProceduralConstellationChallenge('seed_easy', 'easy')
  const medium = generateProceduralConstellationChallenge('seed_med', 'medium')
  const hard = generateProceduralConstellationChallenge('seed_hard', 'hard')

  assert.equal(easy.distractorStars.length, 4)
  assert.equal(medium.distractorStars.length, 8)
  assert.equal(hard.distractorStars.length, 14)
})

// --- 5. Science of Wonder Curriculum ---
console.log('\n🔬 5. Science of Wonder Curriculum')

test('Curated astronomy science concepts contain kid explanations and fun facts', () => {
  assert.ok(CONSTELLATION_SCIENCE_CONCEPTS.length >= 5)
  for (const c of CONSTELLATION_SCIENCE_CONCEPTS) {
    assert.ok(c.conceptTitle.length > 0)
    assert.ok(c.scienceTopic.length > 0)
    assert.ok(c.kidExplanation.length > 0)
    assert.ok(c.funFact.length > 0)
  }
})

console.log('\n==================================================================')
console.log(`🏆 ALL ${passed}/${total} COSMIC CONSTELLATION TEST ASSERTIONS PASSED!`)
console.log('==================================================================\n')
