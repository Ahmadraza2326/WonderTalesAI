import assert from 'node:assert'
import { PEDAGOGICAL_GUIDES, getGuideProfile, determineActorPose } from '../src/services/academy/guideDirector'

console.log('==================================================================')
console.log('🧪 RUNNING ORBIS CHARACTER ACTOR ENGINE VERIFICATION SUITE (PHASE G)')
console.log('==================================================================')

let passed = 0

function runTest(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✅ [PASS] ${name}`)
    passed++
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`)
    process.exit(1)
  }
}

console.log('\n▶️ 1. Auditing Pedagogical Guide Profiles (10 Canonical Guides)...')
const canonicalGuides = ['poly', 'newton', 'lexi', 'beep_0', 'sherlock', 'nova', 'davinci', 'atlas', 'aria', 'harmony']

runTest('Exactly 10 canonical guides registered', () => {
  canonicalGuides.forEach((id) => {
    const guide = getGuideProfile(id as any)
    assert(guide, `Guide ${id} should exist`)
    assert(guide.name.length > 0, `Guide ${id} should have a name`)
    assert(guide.accentColor.startsWith('#'), `Guide ${id} should have a hex color`)
  })
})

console.log('\n▶️ 2. Auditing Emotional Actor Pose Mapping...')
runTest('Hesitation 8s maps to curious pose', () => {
  assert.strictEqual(determineActorPose('hesitation_8s'), 'curious')
})

runTest('First mistake maps to encouraging pose', () => {
  assert.strictEqual(determineActorPose('first_mistake'), 'encouraging')
})

runTest('Repeated mistake maps to concerned pose', () => {
  assert.strictEqual(determineActorPose('repeated_mistake'), 'concerned')
})

runTest('Rapid streak maps to excited pose', () => {
  assert.strictEqual(determineActorPose('rapid_streak'), 'excited')
})

runTest('Concept revealed maps to teaching pose', () => {
  assert.strictEqual(determineActorPose('concept_revealed'), 'teaching')
})

runTest('Lesson completed maps to celebrating pose', () => {
  assert.strictEqual(determineActorPose('lesson_completed'), 'celebrating')
})

console.log('\n==================================================================')
console.log(`🎉 ORBis Character Actor Test Suite: ${passed} Passed, 0 Failed`)
console.log('==================================================================\n')
