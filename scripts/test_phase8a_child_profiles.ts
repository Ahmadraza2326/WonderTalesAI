/**
 * Phase 8A Child Profiles Test Suite
 */
import { childProfileService, validateChildProfileInput } from '../src/services/childProfileService'

console.log('🧪 Running Phase 8A Child Profiles Suite...')

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

// 1. Validation tests
const validRes = validateChildProfileInput({
  name: 'Leo',
  age: 7,
  reading_level: 'beginner',
  avatar: '🦁',
  interests: ['Space', 'Dinosaurs']
})

assert(validRes.valid === true, 'validateChildProfileInput passes valid input')
if (validRes.valid) {
  assert(validRes.sanitized.name === 'Leo', 'Sanitized name is correct')
  assert(validRes.sanitized.age === 7, 'Sanitized age is correct')
}

const invalidRes = validateChildProfileInput({
  name: '',
  age: -1
})
assert(invalidRes.valid === false, 'validateChildProfileInput catches invalid input')

assert(typeof childProfileService.getChildProfiles === 'function', 'getChildProfiles exists')
assert(typeof childProfileService.createChildProfile === 'function', 'createChildProfile exists')
assert(typeof childProfileService.updateChildProfile === 'function', 'updateChildProfile exists')
assert(typeof childProfileService.deleteChildProfile === 'function', 'deleteChildProfile exists')

console.log(`\nPhase 8A Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
