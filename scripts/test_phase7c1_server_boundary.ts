/**
 * Phase 7C.1 Gemini Server Boundary Test Suite
 */
import * as fs from 'fs'
import * as path from 'path'

console.log('🧪 Running Phase 7C.1 Server Boundary Suite...')

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

// 1. Edge function exists and loads secrets server-side
const edgeFunctionPath = path.resolve(rootDir, 'supabase/functions/generate-story-package/index.ts')
assert(fs.existsSync(edgeFunctionPath), 'generate-story-package Edge Function exists')

if (fs.existsSync(edgeFunctionPath)) {
  const content = fs.readFileSync(edgeFunctionPath, 'utf-8')
  assert(content.includes('Deno.env.get("GEMINI_API_KEY")') || content.includes('Deno.env.get(\'GEMINI_API_KEY\')'), 'Edge function uses Deno.env.get for GEMINI_API_KEY')
  assert(content.includes('auth.getUser('), 'Edge function validates caller JWT authentication')
  assert(content.includes('get_user_generation_quota') || content.includes('consume_story_generation_quota'), 'Edge function enforces quota before AI generation')
}


console.log(`\nPhase 7C.1 Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
