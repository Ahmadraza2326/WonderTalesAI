/**
 * Phase 6C Closing Audit Verification Test Suite
 */
import * as fs from 'fs'
import * as path from 'path'

console.log('🧪 Running Phase 6C Closing Audit Suite...')

const rootDir = process.cwd()

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

// 1. Core structural files exist
const requiredFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'src/routes/AppRouter.tsx',
  'src/lib/supabase.ts',
  'src/services/storyService.ts',
  'src/services/StoryOrchestrator.ts',
  'src/context/AuthContext.tsx',
  'src/context/I18nContext.tsx'
]

for (const f of requiredFiles) {
  const filePath = path.resolve(rootDir, f)
  assert(fs.existsSync(filePath), `File exists: ${f}`)
}

console.log(`\nPhase 6C Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
