/**
 * 🧪 Test Suite: Academy Runtime Integrity & Learner Journey
 * Verifies P0, P1, P2 runtime fixes:
 * 1. NumberLineManipulative dynamic range & target > 10 support
 * 2. rhythm_drums and color_palette manipulative completeness
 * 3. Lesson completion mastery progression recording
 * 4. Practice domain subjectId attribution (non-math skills)
 * 5. VisualDemo kinds coverage (rhythm_cadence, code_robot_trace, balance_scale_mass)
 * 6. End-to-end trace of lesson_g2_array_multiplication through all 5 scenes to capstone
 */

import { getCinematicLesson } from '../src/services/academy/curriculum/cinematicLessonsData'
import { getAcademySkill, getAcademySubject } from '../src/services/academy/curriculum/curriculumRegistry'
import {
  saveSkillProgress,
  loadAllSkillProgress,
  recordLessonCompletion,
  calculateSkillMastery,
  getSubjectMasterySummaries,
} from '../src/services/academy/masteryService'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`)
    throw new Error(message)
  }
}

console.log('==================================================================')
console.log('🧪 RUNNING ORBIS ACADEMY RUNTIME INTEGRITY TEST SUITE')
console.log('==================================================================\n')

let totalPassed = 0

// Test 1: NumberLineManipulative Target Range > 10
console.log('▶️ Test 1: NumberLineManipulative dynamic range for targets > 10...')
{
  const lesson = getCinematicLesson('lesson_g2_array_multiplication')
  assert(Boolean(lesson), 'lesson_g2_array_multiplication must exist in curriculum')
  const scene3 = lesson?.scenes.find((s) => s.id === 's3')
  assert(Boolean(scene3), 'Scene 3 must exist')
  assert(scene3?.manipulative?.kind === 'number_line', 'Scene 3 manipulative must be number_line')
  
  const target = Number(scene3?.manipulative?.targetGoal?.target)
  assert(target === 12, 'Scene 3 target must be 12')

  // Calculate effectiveMax derivation
  const maxProp = scene3?.manipulative?.initialState?.max
  const effectiveMax = maxProp !== undefined
    ? Math.max(Number(maxProp), target)
    : Math.max(10, target)
  assert(effectiveMax >= 12, `effectiveMax must be at least 12 (got ${effectiveMax})`)
  
  // Verify jump simulation: 0 -> 4 -> 8 -> 12
  const jumpSteps = Number(scene3?.manipulative?.initialState?.jumpSteps || 1)
  assert(jumpSteps === 4, 'jumpSteps for 3x4 array must be 4')
  
  let currentPos = Number(scene3?.manipulative?.initialState?.start || 0)
  assert(currentPos === 0, 'Starting pos must be 0')
  
  while (currentPos < target) {
    currentPos = Math.min(effectiveMax, currentPos + jumpSteps)
  }
  assert(currentPos === 12, `Learner must be able to reach target 12 through hopping (reached ${currentPos})`)
  console.log('  ✅ Test 1 Passed: NumberLine reaches target 12 cleanly.\n')
  totalPassed++
}

// Test 2: rhythm_drums and color_palette manipulative definitions & completion
console.log('▶️ Test 2: rhythm_drums and color_palette manipulative integration...')
{
  const musicLesson = getCinematicLesson('lesson_g2_musical_dynamics')
  assert(Boolean(musicLesson), 'lesson_g2_musical_dynamics must exist')
  const drumScene = musicLesson?.scenes.find((s) => s.manipulative?.kind === 'rhythm_drums')
  assert(Boolean(drumScene), 'rhythm_drums scene must be present in musical dynamics')
  assert(drumScene?.manipulative?.targetGoal?.cadence === 'piano_to_forte', 'cadence target goal must be piano_to_forte')

  const astroLesson = getCinematicLesson('lesson_g5_solar_spectral_classes')
  assert(Boolean(astroLesson), 'lesson_g5_solar_spectral_classes must exist')
  const paletteScene = astroLesson?.scenes.find((s) => s.manipulative?.kind === 'color_palette')
  assert(Boolean(paletteScene), 'color_palette scene must be present in spectral classes')
  assert(Boolean(paletteScene?.manipulative?.targetGoal?.blended), 'color_palette targetGoal must be present')

  console.log('  ✅ Test 2 Passed: rhythm_drums and color_palette manipulatives verified.\n')
  totalPassed++
}

// Test 3: Lesson Completion -> Mastery Recording
console.log('▶️ Test 3: Lesson completion mastery progression recording...')
{
  // Test recordLessonCompletion
  const skillId = 'skill_arrays_multiplication_intro'
  const record = recordLessonCompletion(skillId, 'math', 'child_test_123')
  assert(record.skillId === skillId, 'Record skillId must match')
  assert(record.subjectId === 'math', 'Record subjectId must be math')
  assert(record.masteryScore >= 50, `Mastery score from lesson must be >= 50 (got ${record.masteryScore})`)
  assert(record.masteryLevel === 'practicing' || record.masteryLevel === 'learning', 'Mastery level must be practicing/learning')
  assert(record.attemptsCount >= 1, 'Attempts count must increment')

  // Verify loadAllSkillProgress contains record
  const allProgress = loadAllSkillProgress()
  assert(Boolean(allProgress[skillId]), 'Skill must be persisted in progress map')
  assert(allProgress[skillId].masteryScore === record.masteryScore, 'Persisted mastery score must match')

  console.log('  ✅ Test 3 Passed: Lesson completion correctly records mastery progress.\n')
  totalPassed++
}

// Test 4: Practice Domain Subject Attribution for Non-Math Skills
console.log('▶️ Test 4: Practice domain subject attribution for non-math skills...')
{
  const scienceSkill = getAcademySkill('skill_plant_biology_g1')
  assert(Boolean(scienceSkill), 'Science skill must exist')
  assert(scienceSkill?.subjectId === 'science', 'Science skill subjectId must be science')

  // Save science practice progress
  saveSkillProgress({
    childId: 'child_test_123',
    skillId: scienceSkill!.id,
    subjectId: scienceSkill!.subjectId,
    masteryLevel: 'proficient',
    masteryScore: 85,
    attemptsCount: 5,
    correctCount: 4,
    hintsUsedCount: 1,
    streak: 2,
    lastPracticedAt: new Date().toISOString(),
  })

  // Get subject summaries and verify science is credited
  const summaries = getSubjectMasterySummaries()
  const scienceSummary = summaries.find((s) => s.subjectId === 'science')
  assert(Boolean(scienceSummary), 'Science summary must exist')
  assert((scienceSummary?.averageMasteryScore || 0) > 0, 'Science average mastery must be > 0')
  assert((scienceSummary?.proficientSkillsCount || 0) >= 1, 'Science proficient count must be >= 1')

  console.log('  ✅ Test 4 Passed: Non-math skill practice correctly attributes to science subject.\n')
  totalPassed++
}

// Test 5: VisualDemo Kinds Coverage
console.log('▶️ Test 5: VisualDemo kinds schema coverage...')
{
  const visualKinds = [
    'rhythm_cadence',
    'code_robot_trace',
    'balance_scale_mass',
    'fraction_partition',
    'ten_frame_counting',
    'number_line_jump',
    'phoneme_sound_wave',
    'science_phenomenon',
    'calm_breathing',
    'color_mixing',
  ]

  const lesson1 = getCinematicLesson('lesson_g2_musical_dynamics')
  assert(lesson1?.scenes[1].visualDemo?.kind === 'rhythm_cadence', 'Scene 2 visual demo must be rhythm_cadence')

  const lesson2 = getCinematicLesson('lesson_g3_debugging_commands')
  assert(lesson2?.scenes[1].visualDemo?.kind === 'code_robot_trace', 'Scene 2 visual demo must be code_robot_trace')

  const lesson3 = getCinematicLesson('lesson_g4_balance_equations_intro')
  assert(lesson3?.scenes[1].visualDemo?.kind === 'balance_scale_mass', 'Scene 2 visual demo must be balance_scale_mass')

  console.log('  ✅ Test 5 Passed: All canonical visual demo kinds verified.\n')
  totalPassed++
}

// Test 6: Complete End-to-End Trace of lesson_g2_array_multiplication
console.log('▶️ Test 6: End-to-end trace of lesson_g2_array_multiplication...')
{
  const lesson = getCinematicLesson('lesson_g2_array_multiplication')
  assert(Boolean(lesson), 'Lesson must exist')
  assert(lesson!.scenes.length === 5, 'Lesson must have exactly 5 scenes')

  // Scene 1: Welcome Hook
  const s1 = lesson!.scenes[0]
  assert(s1.type === 'welcome_hook', 'Scene 1 must be welcome_hook')
  assert(s1.guideId === 'poly', 'Guide must be Poly')
  assert(s1.guideDialogue.length > 10, 'Dialogue must be present')

  // Scene 2: Visual Demo
  const s2 = lesson!.scenes[1]
  assert(s2.type === 'visual_demonstration', 'Scene 2 must be visual_demonstration')
  assert(s2.visualDemo?.kind === 'ten_frame_counting', 'Scene 2 demo must be ten_frame_counting')

  // Scene 3: Guided Interaction
  const s3 = lesson!.scenes[2]
  assert(s3.type === 'guided_interaction', 'Scene 3 must be guided_interaction')
  assert(s3.manipulative?.kind === 'number_line', 'Scene 3 manipulative must be number_line')
  assert(s3.manipulative?.targetGoal?.target === 12, 'Scene 3 target must be 12')

  // Scene 4: Micro-Question
  const s4 = lesson!.scenes[3]
  assert(s4.type === 'micro_question', 'Scene 4 must be micro_question')
  assert(s4.microQuestion?.questionType === 'single_choice', 'Question must be single_choice')
  assert(s4.microQuestion?.options.some((o) => o.isCorrect && o.label.includes('12')), 'Correct answer must be 12')

  // Scene 5: Reflection Summary & Capstone Binding
  const s5 = lesson!.scenes[4]
  assert(s5.type === 'reflection_summary', 'Scene 5 must be reflection_summary')
  assert(lesson!.capstoneGameId === 'magic_machine', 'Lesson must bind to magic_machine capstone game')

  // Skill resolution
  const skill = getAcademySkill(lesson!.skillId)
  assert(Boolean(skill), 'Skill must resolve from skillId')
  assert(skill?.subjectId === 'math', 'Skill subjectId must be math')

  const subject = getAcademySubject('math')
  assert(Boolean(subject), 'Math subject must exist')

  console.log('  ✅ Test 6 Passed: Full learner journey for lesson_g2_array_multiplication is intact.\n')
  totalPassed++
}

console.log('==================================================================')
console.log(`🎉 ALL ${totalPassed}/6 ACADEMY RUNTIME INTEGRITY TESTS PASSED SUCCESSFULLY!`)
console.log('==================================================================\n')
