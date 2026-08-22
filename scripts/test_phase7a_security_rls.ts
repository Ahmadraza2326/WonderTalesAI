/**
 * Phase 7A Security & RLS Test Suite
 */
import * as fs from 'fs'
import * as path from 'path'

console.log('🧪 Running Phase 7A Security & RLS Suite...')

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

// 1. Check migrations for RLS policies
const migrationsDir = path.resolve(rootDir, 'supabase/migrations')
const files = fs.readdirSync(migrationsDir)

const rlsMigration = files.find(f => f.includes('enable_core_rls_policies'))
assert(!!rlsMigration, 'Core RLS migration exists')

if (rlsMigration) {
  const content = fs.readFileSync(path.join(migrationsDir, rlsMigration), 'utf-8')
  assert(content.includes('alter table if exists public.stories enable row level security;'), 'Stories RLS enabled')
  assert(content.includes('alter table if exists public.profiles enable row level security;'), 'Profiles RLS enabled')
  assert(content.includes('alter table if exists public.child_profiles enable row level security;'), 'Child profiles RLS enabled')
  assert(content.includes('auth.uid() = user_id'), 'Stories user_id policy present')
  assert(content.includes('auth.uid() = parent_id'), 'Child profiles parent_id policy present')
}

console.log(`\nPhase 7A Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
