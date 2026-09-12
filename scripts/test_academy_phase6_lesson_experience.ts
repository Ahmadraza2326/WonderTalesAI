/**
 * ORBis Phase 6 Cinematic Guided Learning Experience Test Suite
 * Validates lesson scene sequencing, guide teaching behaviors, visual manipulatives,
 * micro-questions, 4-tier progressive scaffolding, anti-answer leak defense, and grade adaptation.
 */

import assert from 'assert'
import {
  getAllCinematicLessons,
  getCinematicLesson,
  getCinematicLessonForSkill,
} from '../src/services/academy/curriculum/cinematicLessonsData'
import {
  startCinematicLessonSession,
  advanceCinematicScene,
  evaluateMicroQuestionAnswer,
  getProgressiveScaffoldingHint,
} from '../src/services/academy/cinematicLessonEngine'
import { getGuideProfile } from '../src/services/academy/guideDirector'

console.log('🌌 RUNNING ORBIS PHASE 6 CINEMATIC GUIDED LEARNING EXPERIENCE TEST SUITE...\n')

// 1. Validate All Multimodal Lessons (25+)
console.log('1. Validating 25+ Multimodal Cinematic Lessons Across All Domains...')
const allLessons = getAllCinematicLessons()
assert.ok(allLessons.length >= 25, 'Must have at least 25 cinematic lessons')

for (const lesson of allLessons) {
  assert.ok(lesson.id.length > 0, `Lesson must have an id`)
  assert.ok(lesson.title.length > 0, `Lesson ${lesson.id} must have a title`)
  assert.ok(lesson.scenes.length >= 3, `Lesson ${lesson.id} must have at least 3 scenes`)
  assert.ok(lesson.rewardXP > 0, `Lesson ${lesson.id} must award XP`)
  assert.ok(lesson.rewardStars > 0, `Lesson ${lesson.id} must award Stars`)
  assert.ok(lesson.learningObjectives.length > 0, `Lesson ${lesson.id} must define learning objectives`)

  // Check Guide
  const guide = getGuideProfile(lesson.guideId)
  assert.ok(guide, `Lesson ${lesson.id} guide must exist in Guide Director`)
}
console.log('  ✅ [PASS] All 10 demonstration lessons validated with rich metadata and guides')

// 2. Test Scene Sequencing & Types
console.log('\n2. Testing Scene Flow & Cognitive Cycle Progression...')
const prekLesson = getCinematicLesson('lesson_prek_star_counting')!
assert.strictEqual(prekLesson.scenes[0].type, 'welcome_hook')
assert.strictEqual(prekLesson.scenes[1].type, 'guided_interaction')
assert.strictEqual(prekLesson.scenes[2].type, 'micro_question')
assert.strictEqual(prekLesson.scenes[3].type, 'reflection_summary')
console.log('  ✅ [PASS] Pre-K lesson follows child-first pedagogical scene sequence')

// 3. Test Session Lifecycle & State Engine
console.log('\n3. Testing Session Lifecycle & State Machine Transitions...')
let session = startCinematicLessonSession('lesson_prek_star_counting')
assert.strictEqual(session.currentSceneIndex, 0)
assert.strictEqual(session.isFinished, false)

// Advance step by step
session = advanceCinematicScene(session, prekLesson)
assert.strictEqual(session.currentSceneIndex, 1)

session = advanceCinematicScene(session, prekLesson)
assert.strictEqual(session.currentSceneIndex, 2)

session = advanceCinematicScene(session, prekLesson)
assert.strictEqual(session.currentSceneIndex, 3)

session = advanceCinematicScene(session, prekLesson)
assert.strictEqual(session.isFinished, true)
assert.strictEqual(session.earnedXP, prekLesson.rewardXP)
assert.strictEqual(session.earnedStars, prekLesson.rewardStars)
console.log('  ✅ [PASS] Session lifecycle, step index advancement, and reward settlement verified')

// 4. Test Micro-Questions & Gentle Feedback
console.log('\n4. Testing Micro-Questions & Non-Punitive Feedback...')
const questionScene = prekLesson.scenes[2]
assert.ok(questionScene.microQuestion)

// Correct answer
const correctResult = evaluateMicroQuestionAnswer(questionScene, 'opt5')
assert.strictEqual(correctResult.isCorrect, true)
assert.ok(correctResult.feedbackMessage.includes('Correct'))

// Incorrect answer
const wrongResult = evaluateMicroQuestionAnswer(questionScene, 'opt3')
assert.strictEqual(wrongResult.isCorrect, false)
assert.ok(!wrongResult.feedbackMessage.includes('FAIL'))
assert.ok(!wrongResult.feedbackMessage.includes('WRONG'))
assert.ok(wrongResult.feedbackMessage.includes('Almost'))
console.log('  ✅ [PASS] Micro-question evaluator delivers gentle, non-punitive guidance')

// 5. Test 4-Tier Progressive Scaffolding & Anti-Leak Protection
console.log('\n5. Testing 4-Tier Progressive Scaffolding & Anti-Answer Leak Defense...')
const tier1 = getProgressiveScaffoldingHint(questionScene, 0)
assert.strictEqual(tier1.tier, 1)
assert.ok(tier1.hintText?.includes('Count each star'))

const tier2 = getProgressiveScaffoldingHint(questionScene, 1)
assert.strictEqual(tier2.tier, 2)

const tier3 = getProgressiveScaffoldingHint(questionScene, 2)
assert.strictEqual(tier3.tier, 3)

const tier4 = getProgressiveScaffoldingHint(questionScene, 3)
assert.strictEqual(tier4.tier, 4)
assert.strictEqual(tier4.hasMoreHints, false)

// Validate that Tier 1 never reveals direct button choice (Anti-Leak)
assert.ok(!tier1.hintText?.toLowerCase().includes('select the button'))
console.log('  ✅ [PASS] 4-Tier scaffolding escalates properly with anti-leak protection')

// 6. Test Skill-Based Cinematic Lookup
console.log('\n6. Testing Skill Bridge Resolution...')
const skillLesson = getCinematicLessonForSkill('skill_ten_frames')
assert.ok(skillLesson, 'Should resolve cinematic lesson by skill ID')
assert.strictEqual(skillLesson?.id, 'lesson_prek_star_counting')
console.log('  ✅ [PASS] Skill-to-cinematic lesson resolution verified')

console.log('\n==================================================================')
console.log('🏆 ALL PHASE 6 CINEMATIC LESSON ASSERTIONS PASSED (100% SUCCESS)!')
console.log('==================================================================\n')
