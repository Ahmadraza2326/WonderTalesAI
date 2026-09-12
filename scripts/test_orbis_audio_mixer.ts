import assert from 'node:assert'
import { narrationDirector, type NarrationPerformanceMode } from '../src/services/audio/narrationDirector'
import { sfxService } from '../src/services/audio/sfxService'

console.log('==================================================================')
console.log('🧪 RUNNING ORBIS AUDIO MIXER & NARRATION VERIFICATION SUITE (PHASE H)')
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

console.log('\n▶️ 1. Auditing Narration Performance Modes (9 Modes)...')
const canonicalModes: NarrationPerformanceMode[] = [
  'warm_teacher',
  'excited_discovery',
  'wonder_suspense',
  'encouragement',
  'gentle_correction',
  'celebration',
  'reflective_guide',
  'focused_attention',
  'playful_challenge',
]

runTest('All 9 performance modes recognized without runtime errors', () => {
  canonicalModes.forEach((mode) => {
    let notified = false
    const unsubscribe = narrationDirector.subscribe((event) => {
      if (event.mode === mode) notified = true
    })
    narrationDirector.speak('Test utterance', 'poly', mode)
    narrationDirector.stop()
    unsubscribe()
    assert(notified, `Mode ${mode} should trigger subtitle event`)
  })
})

console.log('\n▶️ 2. Auditing SfxService Music Ducking API...')
runTest('SfxService has duckMusic method', () => {
  assert(typeof sfxService.duckMusic === 'function', 'duckMusic should be a function')
  // Should execute cleanly without throwing
  sfxService.duckMusic(true)
  sfxService.duckMusic(false)
})

runTest('SfxService getState returns valid audio state', () => {
  const state = sfxService.getState()
  assert(typeof state.isMuted === 'boolean', 'isMuted should be boolean')
  assert(typeof state.masterVolume === 'number', 'masterVolume should be number')
  assert(typeof state.musicVolume === 'number', 'musicVolume should be number')
})

console.log('\n==================================================================')
console.log(`🎉 ORBis Audio Mixer Test Suite: ${passed} Passed, 0 Failed`)
console.log('==================================================================\n')
