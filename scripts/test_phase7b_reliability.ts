/**
 * Phase 7B Reliability & Concurrency Test Suite
 */
import { validateLearningPackage } from '../src/services/ai/learningPackageValidator'
import { cleanJsonResponse } from '../src/services/ai/jsonCleaner'

console.log('🧪 Running Phase 7B Reliability & Concurrency Suite...')

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

// 1. JSON parsing robustness
const messyResponse = '```json\n{"story":"Once upon a time...","storyDNA":{},"vocabulary":[],"quizSeeds":[],"gameSeeds":[],"parentGuide":{},"illustrations":[],"narration":{},"metadata":{}}\n```'
const cleaned = cleanJsonResponse(messyResponse)
assert(cleaned.startsWith('{') && cleaned.endsWith('}'), 'cleanJsonResponse cleans markdown codeblocks')

const parsed = JSON.parse(cleaned)
let validated = false
try {
  validateLearningPackage(parsed)
  validated = true
} catch {
  validated = false
}
assert(validated, 'validateLearningPackage validates valid schema object')

console.log(`\nPhase 7B Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
