/**
 * Phase 8A Child Profiles Test Suite
 */
import {
  childProfileService,
  validateChildProfileInput,
  getLocalChildProfiles,
  saveLocalChildProfile,
  removeLocalChildProfile,
  createLocalChildProfile,
} from '../src/services/childProfileService'
import { parentProfileService } from '../src/services/parentProfileService'

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

// Mock localStorage for Node.js test environment if not present
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()
  const mockStorage: Storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage,
    writable: true,
  })
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: mockStorage },
    writable: true,
  })
}

// 1. Validation tests
const validRes = validateChildProfileInput({
  name: 'Leo',
  age: 7,
  reading_level: 'beginner',
  avatar: '🦁',
  interests: ['Space', 'Dinosaurs'],
})

assert(validRes.valid === true, 'validateChildProfileInput passes valid input')
if (validRes.valid) {
  assert(validRes.sanitized.name === 'Leo', 'Sanitized name is correct')
  assert(validRes.sanitized.age === 7, 'Sanitized age is correct')
  assert(validRes.sanitized.reading_level === 'beginner', 'Derived reading level is correct')
  assert(validRes.sanitized.avatar === '🦁', 'Avatar is preserved')
}

const invalidRes = validateChildProfileInput({
  name: '',
  age: -1,
})
assert(invalidRes.valid === false, 'validateChildProfileInput catches invalid input')

// 2. Service method existence
assert(typeof childProfileService.getChildProfiles === 'function', 'getChildProfiles exists')
assert(typeof childProfileService.createChildProfile === 'function', 'createChildProfile exists')
assert(typeof childProfileService.updateChildProfile === 'function', 'updateChildProfile exists')
assert(typeof childProfileService.deleteChildProfile === 'function', 'deleteChildProfile exists')
assert(typeof parentProfileService.ensureParentProfileExists === 'function', 'parentProfileService.ensureParentProfileExists exists')

// 3. Local Storage Helpers & Fallback Tests
const testParentId = 'test-parent-123'
const createdLocal = createLocalChildProfile(testParentId, {
  name: 'Maya',
  age: 8,
  reading_level: 'intermediate',
  interests: ['Ocean Animals', 'Magic & Wizards'],
  avatar: '🐬',
  preferred_language: 'English',
  favorite_theme: 'ocean',
})

assert(Boolean(createdLocal.id), 'createLocalChildProfile creates valid profile with ID')
assert(createdLocal.name === 'Maya', 'Local profile name matches')
assert(createdLocal.stars === 0 && createdLocal.xp === 0, 'Local profile initialized with economy defaults')

const loadedLocal = getLocalChildProfiles(testParentId)
assert(loadedLocal.length >= 1, 'getLocalChildProfiles retrieves saved local profile')
assert(loadedLocal.some((p) => p.name === 'Maya'), 'Loaded profiles contain created Maya')

// 4. Update and Removal in Local Storage
createdLocal.avatar = '🦊'
saveLocalChildProfile(testParentId, createdLocal)
const updatedLocal = getLocalChildProfiles(testParentId).find((p) => p.id === createdLocal.id)
assert(updatedLocal?.avatar === '🦊', 'saveLocalChildProfile updates existing profile')

removeLocalChildProfile(testParentId, createdLocal.id)
const afterRemoval = getLocalChildProfiles(testParentId)
assert(!afterRemoval.some((p) => p.id === createdLocal.id), 'removeLocalChildProfile removes profile')

// 5. Async CRUD Execution with Seamless Fallback
async function testAsyncOperations() {
  const guestParentId = 'guest'
  const createRes = await childProfileService.createChildProfile(guestParentId, {
    name: 'Zara',
    age: 5,
    avatar: '🦄',
    interests: ['Fairy Tales'],
    preferred_language: 'English',
  })

  assert(createRes.data !== null && createRes.error === null, 'createChildProfile succeeds seamlessly in guest/fallback mode')
  if (createRes.data) {
    assert(createRes.data.name === 'Zara', 'Created child name matches')
    assert(createRes.data.reading_level === 'beginner', 'Auto-assigned beginner reading level for age 5')

    const getRes = await childProfileService.getChildProfiles(guestParentId)
    assert(getRes.data !== null && getRes.data.some((p) => p.id === createRes.data?.id), 'getChildProfiles returns created child')

    const updateRes = await childProfileService.updateChildProfile(createRes.data.id, guestParentId, {
      name: 'Zara The Brave',
      age: 6,
    })
    assert(updateRes.data?.name === 'Zara The Brave', 'updateChildProfile modifies name successfully')

    const deleteRes = await childProfileService.deleteChildProfile(createRes.data.id, guestParentId)
    assert(deleteRes.error === null, 'deleteChildProfile deletes child successfully')
  }
}

testAsyncOperations().then(() => {
  console.log(`\nPhase 8A Tests: ${passed}/${total} PASS`)
  if (passed !== total) process.exit(1)
})

