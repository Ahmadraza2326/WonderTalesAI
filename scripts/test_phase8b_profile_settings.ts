/**
 * Phase 8B Profile & Settings Test Suite
 */
import { DEFAULT_PREFERENCES } from '../src/services/userPreferencesService'
import { parentProfileService } from '../src/services/parentProfileService'

console.log('🧪 Running Phase 8B Profile & Settings Suite...')

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

// 1. Defaults
assert(DEFAULT_PREFERENCES.theme === 'system', 'Default theme is system')
assert(DEFAULT_PREFERENCES.narrationSpeed === 1.0, 'Default narrationSpeed is 1.0')
assert(DEFAULT_PREFERENCES.bedtimeMode === false, 'Default bedtimeMode is false')

// 2. Parent profile service
assert(typeof parentProfileService.getProfile === 'function', 'parentProfileService.getProfile exists')
assert(typeof parentProfileService.updateProfile === 'function', 'parentProfileService.updateProfile exists')

console.log(`\nPhase 8B Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
