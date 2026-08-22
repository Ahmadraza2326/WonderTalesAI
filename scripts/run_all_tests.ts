/**
 * Master Verification Test Runner for ORBIS / WonderTalesAI
 * Runs all test suites from Phase 6C through Phase 8G.
 */

import { execSync } from 'child_process'
import * as path from 'path'

const suites = [
  'scripts/test_phase6c_closing_audit.ts',
  'scripts/test_phase7a_security_rls.ts',
  'scripts/test_phase7b_reliability.ts',
  'scripts/test_phase7c_cost_protection.ts',
  'scripts/test_phase7c1_server_boundary.ts',
  'scripts/test_phase7d_pwa_perf.ts',
  'scripts/test_phase8a_child_profiles.ts',
  'scripts/test_phase8b_profile_settings.ts',
  'scripts/test_phase8c_library_management.ts',
  'scripts/test_phase8d_reader.ts',
  'scripts/test_phase8e_i18n_rtl_voices.ts',
  'scripts/test_phase8f_learning_export.ts',
  'scripts/test_phase8g_v1_readiness.ts',
  'scripts/test_phase8h_story_language_independence.ts',
  'scripts/test_phase8_storybook_restoration.ts',
  'scripts/test_runtime_quota_accounting.ts',
  'scripts/test_live_failure_and_success_quota_invariant.ts',
  'scripts/test_phase8i_multilingual_narration_architecture.ts',
  'scripts/test_phase8j_gemini_tts_production_narration.ts',
  'scripts/verify_live_acceptance_tts_playback.ts',
  'scripts/test_edge_function_security_audit.ts',
]

console.log('==================================================================')
console.log('🚀 RUNNING ALL 21 ORBIS VERIFICATION & REGRESSION TEST SUITES')
console.log('==================================================================\n')

let passedSuites = 0
let failedSuites = 0

for (const suite of suites) {
  const fullPath = path.resolve(process.cwd(), suite)
  console.log(`\n▶️ Executing ${suite}...`)
  try {
    const output = execSync(`node --import tsx "${fullPath}"`, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd()
    })
    console.log(output.trim())
    passedSuites++
  } catch (err: any) {
    console.error(`❌ Suite failed: ${suite}`)
    if (err.stdout) console.log(err.stdout.toString())
    if (err.stderr) console.error(err.stderr.toString())
    failedSuites++
  }
}

console.log('\n==================================================================')
console.log(`🏆 ALL SUITES SUMMARY: ${passedSuites}/${suites.length} SUITES PASSED (${failedSuites} FAILED)`)
console.log('==================================================================\n')

if (failedSuites > 0) {
  process.exit(1)
}
