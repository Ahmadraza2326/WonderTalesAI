/**
 * Haptics Service Verification Suite
 */
import { HapticsService } from '../src/services/hapticsService'

console.log('🧪 Running Haptics Service Verification Suite...')

let passed = 0
let total = 0

function assert(condition: boolean, name: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } else {
    console.error(`  ❌ [FAIL] ${name}`)
  }
}

// 1. Verify existence of all haptic triggers
assert(typeof HapticsService.light === 'function', 'HapticsService.light exists')
assert(typeof HapticsService.medium === 'function', 'HapticsService.medium exists')
assert(typeof HapticsService.heavy === 'function', 'HapticsService.heavy exists')
assert(typeof HapticsService.success === 'function', 'HapticsService.success exists')
assert(typeof HapticsService.warning === 'function', 'HapticsService.warning exists')
assert(typeof HapticsService.selection === 'function', 'HapticsService.selection exists')

// 2. Safe execution in Node/headless environment without crashing
async function testExecution() {
  await HapticsService.light()
  assert(true, 'HapticsService.light executes safely in headless environment')

  await HapticsService.medium()
  assert(true, 'HapticsService.medium executes safely in headless environment')

  await HapticsService.heavy()
  assert(true, 'HapticsService.heavy executes safely in headless environment')

  await HapticsService.success()
  assert(true, 'HapticsService.success executes safely in headless environment')

  await HapticsService.warning()
  assert(true, 'HapticsService.warning executes safely in headless environment')

  await HapticsService.selection()
  assert(true, 'HapticsService.selection executes safely in headless environment')

  console.log(`\nHaptics Tests: ${passed}/${total} PASS`)
  if (passed !== total) process.exit(1)
}

testExecution()
