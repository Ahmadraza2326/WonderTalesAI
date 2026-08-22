/**
 * Phase 8F Gentle Learning / Reading Progress / Printable StoryBook Test Suite
 */
import { learningProgressService } from '../src/services/learningProgressService'
import * as fs from 'fs'
import * as path from 'path'

console.log('🧪 Running Phase 8F Learning Progress & Export Suite...')

const rootDir = process.cwd()

let passed = 0
let total = 0

function assert(condition: boolean, name: string, details?: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } else {
    console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ''}`)
  }
}


// 1. Reading progress service methods
assert(typeof learningProgressService.getStoryProgress === 'function', 'getStoryProgress exists')
assert(typeof learningProgressService.recordReadingProgress === 'function', 'recordReadingProgress exists')
assert(typeof learningProgressService.getLearningProgressSummary === 'function', 'getLearningProgressSummary exists')

// 2. Migration verification
const migrationsDir = path.resolve(rootDir, 'supabase/migrations')
const files = fs.readdirSync(migrationsDir)
const readingProgressMigration = files.find(f => f.includes('create_reading_progress'))
assert(!!readingProgressMigration, 'create_reading_progress migration exists')

if (readingProgressMigration) {
  const content = fs.readFileSync(path.join(migrationsDir, readingProgressMigration), 'utf-8')
  assert(content.includes('public.story_reading_progress'), 'story_reading_progress table defined')
  assert(content.includes('ENABLE ROW LEVEL SECURITY'), 'story_reading_progress RLS enabled')
}

// 3. Printable StoryBook modal exists
const printableModalPath = path.resolve(rootDir, 'src/components/story/PrintableStoryBookModal.tsx')
assert(fs.existsSync(printableModalPath), 'PrintableStoryBookModal.tsx component exists')

console.log(`\nPhase 8F Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
