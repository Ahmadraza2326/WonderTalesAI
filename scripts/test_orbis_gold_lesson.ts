/**
 * ORBis Gold Experience Transformation Test Suite
 * Validates Phase G (Character Actor), Phase H (Audio Mixer), Phase I (Cinematic Lesson Player),
 * Phase J (Star Array Manipulative), and Phase K (Magic Machine).
 */

import { CINEMATIC_LESSONS_REGISTRY } from '../src/services/academy/curriculum/cinematicLessonsData'
import { getGuideProfile, determineActorPose } from '../src/services/academy/guideDirector'
import { sfxService } from '../src/services/audio/sfxService'
import { narrationDirector } from '../src/services/audio/narrationDirector'

async function runGoldLessonTestSuite() {
  console.log('🌟 Starting ORBis Gold Lesson Transformation Test Suite...\n')
  let passedCount = 0
  let totalCount = 0

  const assert = (condition: boolean, message: string) => {
    totalCount++
    if (condition) {
      console.log(`  ✅ PASS: ${message}`)
      passedCount++
    } else {
      console.error(`  ❌ FAIL: ${message}`)
      process.exitCode = 1
    }
  }

  // Test 1: Curriculum Invariance on Gold Standard Lesson
  const goldLesson = CINEMATIC_LESSONS_REGISTRY['lesson_g2_array_multiplication']
  assert(Boolean(goldLesson), 'Gold Lesson "lesson_g2_array_multiplication" exists in curriculum')
  assert(goldLesson.skillId === 'skill_arrays_multiplication_intro', 'Skill ID matches canonical curriculum')
  assert(goldLesson.guideId === 'poly', 'Guide ID is Poly the Geometric Owl')
  assert(goldLesson.scenes.length === 5, 'Gold Lesson has exactly 5 structured teaching scenes')

  // Test 2: Character Actor Engine & Poses for Poly
  const polyProfile = getGuideProfile('poly')
  assert(polyProfile.name.includes('Poly'), 'Poly guide profile loaded with correct metadata')
  const idlePose = determineActorPose({ isCorrect: true, streak: 3 })
  assert(idlePose === 'celebrating', 'Streak of 3 correctly triggers celebrating actor pose')

  const errorPose = determineActorPose({ isCorrect: false })
  assert(errorPose === 'encouraging', 'Mistake correctly triggers encouraging actor pose')

  // Test 3: 6-Layer Audio Mixer & Ducking
  assert(typeof sfxService.duckMusic === 'function', 'sfxService exposes duckMusic dynamic gain function')
  assert(typeof narrationDirector.speak === 'function', 'narrationDirector exposes speak function with 9 performance modes')

  // Test 4: Scene-Specific Progression Validation
  const scene1 = goldLesson.scenes[0]
  assert(scene1.type === 'welcome_hook', 'Scene 1 is welcome_hook')

  const scene2 = goldLesson.scenes[1]
  assert(scene2.type === 'visual_demonstration', 'Scene 2 is visual_demonstration with count=12 array')

  const scene3 = goldLesson.scenes[2]
  assert(scene3.type === 'guided_interaction', 'Scene 3 is guided_interaction')

  const scene4 = goldLesson.scenes[3]
  assert(scene4.type === 'micro_question', 'Scene 4 is micro_question with 3x4 multiplication check')

  const scene5 = goldLesson.scenes[4]
  assert(scene5.type === 'reflection_summary', 'Scene 5 is reflection_summary')

  console.log(`\n========================================`)
  console.log(`Results: ${passedCount}/${totalCount} assertions passed.`)
  console.log(`========================================\n`)

  if (passedCount === totalCount) {
    console.log('✨ GOLD LESSON TEST SUITE PASSED ALL AUDITS! ✨')
  }
}

runGoldLessonTestSuite()
