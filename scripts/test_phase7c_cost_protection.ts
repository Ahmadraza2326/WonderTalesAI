/**
 * Phase 7C Cost Protection Test Suite
 */
import * as fs from 'fs'
import * as path from 'path'

console.log('🧪 Running Phase 7C Cost Protection Suite...')

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

// 1. Quota & Cooldown migration verification
const migrationsDir = path.resolve(rootDir, 'supabase/migrations')
const files = fs.readdirSync(migrationsDir)
const quotaMigration = files.find(f => f.includes('add_generation_quotas_and_cooldowns'))
assert(!!quotaMigration, 'Quota & Cooldown migration exists')

if (quotaMigration) {
  const content = fs.readFileSync(path.join(migrationsDir, quotaMigration), 'utf-8')
  assert(content.includes('user_generation_quotas'), 'user_generation_quotas table defined')
  assert(content.includes('consume_story_generation_quota'), 'consume_story_generation_quota RPC function defined')
  assert(content.includes('get_user_generation_quota'), 'get_user_generation_quota RPC function defined')
}

console.log(`\nPhase 7C Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
