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
  'scripts/test_activity_reward_foundation.ts',
  'scripts/test_story_memory_quest.ts',
  'scripts/test_word_trace.ts',
  'scripts/test_experience_foundation.ts',
  'scripts/test_experience_primitives.ts',
  'scripts/test_experience_activity_refactoring.ts',
  'scripts/test_experience_quest_hub.ts',
  'scripts/test_creature_lab.ts',
  'scripts/test_playground_registry.ts',
  'scripts/test_magic_machine.ts',
  'scripts/test_mystery_detective.ts',
  'scripts/test_potion_scales.ts',
  'scripts/test_spellforge.ts',
  'scripts/test_memory_museum.ts',
  'scripts/test_rhythm_spells.ts',
  'scripts/test_progression_service.ts',
  'scripts/test_playroom_world.ts',
  'scripts/test_child_adventure_passport.ts',
  'scripts/test_story_game_bridge.ts',
  'scripts/test_procedural_challenge.ts',
  'scripts/test_overworld_and_mascot.ts',
  'scripts/test_parent_hub_and_narration.ts',
  'scripts/test_creature_sanctuary.ts',
  'scripts/test_haptics_service.ts',
  'scripts/test_game_registry.ts',
  'scripts/test_image_engine_free_v1.ts',
  'scripts/test_robopath_academy.ts',
  'scripts/test_ecosystem_sandbox.ts',
  'scripts/test_cosmic_constellation.ts',
  'scripts/test_invention_lab.ts',
  'scripts/test_academy_curriculum.ts',
  'scripts/test_academy_practice_evaluators.ts',
  'scripts/test_academy_hints_and_mastery.ts',
  'scripts/test_canonical_10_games.ts',
  'scripts/test_academy_phase5_universe.ts',
  'scripts/test_academy_phase6_lesson_experience.ts',
  'scripts/test_academy_phase7_child_experience.ts',
  'scripts/test_academy_phase8_immersion.ts',
  'scripts/test_academy_phase9_elevation.ts',
  'scripts/test_academy_universal_curriculum_validator.ts',
  'scripts/test_academy_runtime_integrity.ts',
  'scripts/test_orbis_design_system.ts',
  'scripts/test_orbis_character_actor_engine.ts',
  'scripts/test_orbis_audio_mixer.ts',
  'scripts/test_orbis_gold_lesson.ts',
  'scripts/test_phase4a1_lesson_stage.ts',
]

console.log('==================================================================')
console.log(`🚀 RUNNING ALL ${suites.length} ORBIS VERIFICATION & REGRESSION TEST SUITES`)
console.log('==================================================================\n')

let passedSuites = 0
let failedSuites = 0
const failedSuiteNames: string[] = []

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
    console.log(`❌ Suite failed: ${suite}`)
    failedSuiteNames.push(suite)
    if (err.stdout) console.log(err.stdout.toString())
    if (err.stderr) console.log(err.stderr.toString())
    failedSuites++
  }
}

console.log('\n==================================================================')
console.log(`🏆 ALL SUITES SUMMARY: ${passedSuites}/${suites.length} SUITES PASSED (${failedSuites} FAILED)`)
if (failedSuiteNames.length > 0) {
  console.log(`FAILED SUITES: ${failedSuiteNames.join(', ')}`)
}
console.log('==================================================================\n')

if (failedSuites > 0) {
  process.exit(1)
}
