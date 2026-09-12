/**
 * Phase 8C Story Library Management Test Suite
 */
import {
  storyService,
  createLocalStory,
  getLocalStories,
  saveLocalStory,
  removeLocalStory,
  mapRowToStoryRecord,
} from '../src/services/storyService'

console.log('🧪 Running Phase 8C Story Library Management Suite...')

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

// 1. Story Library operations existence
assert(typeof storyService.getStoriesForUser === 'function', 'storyService.getStoriesForUser exists')
assert(typeof storyService.toggleFavorite === 'function', 'storyService.toggleFavorite exists')
assert(typeof storyService.deleteStory === 'function', 'storyService.deleteStory exists')
assert(typeof storyService.createStory === 'function', 'storyService.createStory exists')
assert(typeof storyService.getStoryById === 'function', 'storyService.getStoryById exists')
assert(typeof storyService.updateStory === 'function', 'storyService.updateStory exists')

// 2. Input validation
async function testValidation() {
  const invalidAgeRes = await storyService.createStory('user-123', {
    title: 'The Brave Lion',
    childName: 'Leo',
    childAge: 25, // Invalid: > 18
    language: 'English',
    storyLength: 'short',
    readingLevel: 'beginner',
  })
  assert(invalidAgeRes.error !== null, 'createStory rejects age > 18')

  const invalidNegativeAge = await storyService.createStory('user-123', {
    title: 'The Brave Lion',
    childName: 'Leo',
    childAge: -1,
    language: 'English',
    storyLength: 'short',
    readingLevel: 'beginner',
  })
  assert(invalidNegativeAge.error !== null, 'createStory rejects negative age')
}

// 3. Local Story Helpers & Fallback Tests
const testUserId = 'test-story-user-1'
const testChildId = 'child-profile-uuid-456'
const localStory = createLocalStory(testUserId, {
  childId: testChildId,
  title: 'Starry Quest',
  childName: 'Zara',
  childAge: 7,
  language: 'English',
  theme: 'Space & Planets',
  moral: 'Perseverance leads to discovery',
  characters: 'Zara and Oliver the Owl',
  storyLength: 'short',
  readingLevel: 'intermediate',
})

assert(Boolean(localStory.id), 'createLocalStory generates valid ID')
assert(localStory.child_id === testChildId, 'createLocalStory preserves child_id')
assert(localStory.child_name === 'Zara', 'createLocalStory sets child_name')
assert(localStory.status === 'draft', 'createLocalStory sets status=draft')

const loadedLocal = getLocalStories(testUserId)
assert(loadedLocal.length >= 1, 'getLocalStories retrieves stored stories')
assert(loadedLocal.some((s) => s.id === localStory.id), 'Loaded stories contain created Starry Quest')

// 4. Update and Toggle Favorite
localStory.is_favorite = true
saveLocalStory(testUserId, localStory)
const updatedLocal = getLocalStories(testUserId).find((s) => s.id === localStory.id)
assert(updatedLocal?.is_favorite === true, 'saveLocalStory updates story in local storage')

removeLocalStory(testUserId, localStory.id)
const afterRemoval = getLocalStories(testUserId)
assert(!afterRemoval.some((s) => s.id === localStory.id), 'removeLocalStory deletes story from local storage')

// 5. Async CRUD Execution with Seamless Schema Fallback
async function testAsyncStoryService() {
  await testValidation()

  const guestUserId = 'guest'
  const createRes = await storyService.createStory(guestUserId, {
    childId: 'child-123',
    title: 'The Dragon and the Whistle',
    childName: 'Kai',
    childAge: '6',
    language: 'English',
    theme: 'Magic & Wizards',
    moral: 'Honesty is the best treasure',
    characters: 'Kai, Sparky the Dragon',
    storyLength: 'short',
    readingLevel: 'beginner',
  })

  assert(createRes.data !== null && createRes.error === null, 'createStory succeeds in guest/fallback mode')
  if (createRes.data) {
    const createdId = createRes.data.id
    assert(createRes.data.title === 'The Dragon and the Whistle', 'Created story title matches')
    assert(createRes.data.child_id === 'child-123', 'Created story retains child_id')

    const getRes = await storyService.getStoryById(createdId, guestUserId)
    assert(getRes.data !== null && getRes.data.id === createdId, 'getStoryById retrieves created story')

    const updateRes = await storyService.updateStory(createdId, guestUserId, {
      title: 'The Dragon and the Golden Whistle',
      status: 'ready',
    })
    assert(updateRes.data?.title === 'The Dragon and the Golden Whistle', 'updateStory modifies title successfully')

    const favRes = await storyService.toggleFavorite(createdId, guestUserId, true)
    assert(favRes.data?.is_favorite === true, 'toggleFavorite sets is_favorite=true')

    const listRes = await storyService.getStoriesForUser(guestUserId)
    assert(listRes.data !== null && listRes.data.length >= 1, 'getStoriesForUser returns user stories')

    const deleteRes = await storyService.deleteStory(createdId, guestUserId)
    assert(deleteRes.error === null, 'deleteStory removes story without error')
  }

  // 6. Mapping test
  const rawRow = {
    id: 'row-1',
    user_id: 'u-1',
    title: 'Mapped Story',
    child_name: 'Leo',
    child_age: 8,
    language: 'English',
    theme: null,
    moral: null,
    characters: null,
    story_length: 'short',
    reading_level: 'beginner',
    status: 'ready',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    story_content: 'Once upon a time...',
    generation_status: 'ready',
    generated_at: new Date().toISOString(),
    is_favorite: true,
    learning_package: { _meta_child_id: 'child-extracted-789' },
  }
  const mapped = mapRowToStoryRecord(rawRow)
  assert(mapped.child_id === 'child-extracted-789', 'mapRowToStoryRecord extracts child_id from learning_package fallback metadata')
}

testAsyncStoryService().then(() => {
  console.log(`\nPhase 8C Tests: ${passed}/${total} PASS`)
  if (passed !== total) process.exit(1)
})

