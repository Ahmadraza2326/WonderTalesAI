/**
 * Phase 7D PWA & Performance Test Suite
 */
import * as fs from 'fs'
import * as path from 'path'

console.log('🧪 Running Phase 7D PWA & Performance Suite...')

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

// 1. PWA Manifest & Service Worker exist
const manifestPath = path.resolve(rootDir, 'public/manifest.webmanifest')
assert(fs.existsSync(manifestPath), 'manifest.webmanifest exists')

const swPath = path.resolve(rootDir, 'public/sw.js')
assert(fs.existsSync(swPath), 'sw.js service worker exists')

const pwaServicePath = path.resolve(rootDir, 'src/services/pwaService.ts')
assert(fs.existsSync(pwaServicePath), 'pwaService.ts exists')

console.log(`\nPhase 7D Tests: ${passed}/${total} PASS`)
if (passed !== total) process.exit(1)
