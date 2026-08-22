/**
 * Phase 8C Story Library Management Test Suite
 */
import { storyService } from '../src/services/storyService'

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

// 1. Story Library operations
assert(typeof storyService.getStoriesForUser === 'function', 'storyService.getStoriesForUser exists')
assert(typeof storyService.toggleFavorite === 'function', 'storyService.toggleFavorite exists')
assert(typeof storyService.deleteStory === 'function', 'storyService.deleteStory exists')
assert(typeof storyService.createStory === 'function', 'storyService.createStory exists')

console.log(`\nPhase 8C Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
