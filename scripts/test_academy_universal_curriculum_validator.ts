/**
 * ORBis Universal Curriculum Validator Test Suite
 * Dynamically audits and validates all cinematic lessons across schema integrity,
 * grade band conformity, realm mapping, mascot pairing, 4-tier scaffolding,
 * reward bounds, game references, prerequisite acyclicity, and non-reader scaffolding.
 */

import assert from 'assert'
import {
  CINEMATIC_LESSONS_REGISTRY,
  getAllCinematicLessons,
} from '../src/services/academy/curriculum/cinematicLessonsData'
import {
  ACADEMY_LESSONS_REGISTRY,
} from '../src/services/academy/curriculum/lessonsData'
import {
  ACADEMY_SUBJECTS_REGISTRY,
  getAcademySkill,
} from '../src/services/academy/curriculum/curriculumRegistry'
import { PEDAGOGICAL_GUIDES, getGuideProfile } from '../src/services/academy/guideDirector'
import { GRADE_BAND_CONFIGS } from '../src/styles/academyTokens'
import { PLAYGROUND_REGISTRY } from '../src/services/games/playgroundRegistry'
import type { GradeBand } from '../src/types/learningUniverse'
import type { SceneType } from '../src/types/cinematicLesson'

console.log('🌌 RUNNING ORBIS UNIVERSAL CURRICULUM VALIDATOR TEST SUITE...\n')

const lessons = getAllCinematicLessons()
const lessonIds = Object.keys(CINEMATIC_LESSONS_REGISTRY)

console.log(`Auditing ${lessons.length} registered cinematic lessons in CINEMATIC_LESSONS_REGISTRY...`)

// 1. UNIQUE LESSON IDS & REGISTRY CONSISTENCY
console.log('\n1. Auditing Lesson ID Uniqueness & Registry Key Parity...')
const seenIds = new Set<string>()

for (const [key, lesson] of Object.entries(CINEMATIC_LESSONS_REGISTRY)) {
  assert.strictEqual(key, lesson.id, `Registry key "${key}" must strictly match lesson.id "${lesson.id}"`)
  assert.ok(!seenIds.has(lesson.id), `Duplicate lesson ID detected: "${lesson.id}"`)
  seenIds.add(lesson.id)

  assert.ok(
    lesson.id.startsWith('lesson_'),
    `Lesson ID "${lesson.id}" must follow standard "lesson_<slug>" prefix convention`
  )
  assert.ok(lesson.title.trim().length > 0, `Lesson "${lesson.id}" must have a non-empty title`)
  assert.ok(lesson.subtitle.trim().length > 0, `Lesson "${lesson.id}" must have a non-empty subtitle`)
  assert.ok(lesson.storyHook.trim().length > 0, `Lesson "${lesson.id}" must have a non-empty storyHook`)
}
console.log(`  ✅ [PASS] ${seenIds.size} unique lesson IDs verified with exact registry key parity`)

// 2. VALID GRADE BANDS & CONFIGURATION SYSTEM
console.log('\n2. Auditing Grade Bands & Grade-Band Configuration System...')
const validGradeBands: GradeBand[] = [
  'pre_k',
  'kindergarten',
  'grade_1',
  'grade_2',
  'grade_3',
  'grade_4',
  'grade_5',
  'grade_6',
]

const gradeCounts: Record<string, number> = {}
for (const lesson of lessons) {
  gradeCounts[lesson.gradeBand] = (gradeCounts[lesson.gradeBand] || 0) + 1
  assert.ok(
    validGradeBands.includes(lesson.gradeBand),
    `Lesson "${lesson.id}" has invalid gradeBand "${lesson.gradeBand}". Expected one of: ${validGradeBands.join(', ')}`
  )

  const gradeConfig = GRADE_BAND_CONFIGS[lesson.gradeBand]
  assert.ok(
    gradeConfig,
    `Grade band "${lesson.gradeBand}" for lesson "${lesson.id}" must exist in GRADE_BAND_CONFIGS`
  )
  assert.ok(gradeConfig.targetLessonDuration > 0, `Grade band config must have a positive targetLessonDuration`)
  assert.ok(gradeConfig.touchTargetSize >= 44, `Touch target size must be at least 44px for accessibility`)
}

assert.ok(lessons.length >= 25, `Expected at least 25 lessons, found ${lessons.length}`)
assert.strictEqual(gradeCounts['pre_k'], 6, `Expected 6 Pre-K lessons, found ${gradeCounts['pre_k']}`)
assert.strictEqual(gradeCounts['kindergarten'], 7, `Expected 7 Kindergarten lessons, found ${gradeCounts['kindergarten']}`)
assert.strictEqual(gradeCounts['grade_1'], 6, `Expected 6 Grade 1 lessons, found ${gradeCounts['grade_1']}`)

console.log(`  ✅ [PASS] All ${lessons.length} lessons mapped to valid GradeBands (Pre-K: ${gradeCounts['pre_k']}, K: ${gradeCounts['kindergarten']}, G1: ${gradeCounts['grade_1']}) backed by GRADE_BAND_CONFIGS`)

// 3. VALID SUBJECT IDS & ACADEMIC REALM MAPPINGS
console.log('\n3. Auditing Subject IDs & Academic Realm Mappings...')
const validSubjects = Object.keys(ACADEMY_SUBJECTS_REGISTRY)

for (const lesson of lessons) {
  assert.ok(
    validSubjects.includes(lesson.subjectId),
    `Lesson "${lesson.id}" subjectId "${lesson.subjectId}" is invalid. Expected one of: ${validSubjects.join(', ')}`
  )

  const subject = ACADEMY_SUBJECTS_REGISTRY[lesson.subjectId]
  assert.ok(subject, `Subject "${lesson.subjectId}" must exist in ACADEMY_SUBJECTS_REGISTRY`)
  assert.ok(subject.title.length > 0, `Subject "${lesson.subjectId}" must have a title`)
  assert.ok(subject.accentColor.length > 0, `Subject "${lesson.subjectId}" must have an accentColor`)
}
console.log(`  ✅ [PASS] All lessons belong to recognized academic subjects and realms`)

// 4. VALID GUIDE COMPANION IDS
console.log('\n4. Auditing Guide Mascot References...')
const validGuideIds = Object.keys(PEDAGOGICAL_GUIDES)

for (const lesson of lessons) {
  assert.ok(
    validGuideIds.includes(lesson.guideId),
    `Lesson "${lesson.id}" guideId "${lesson.guideId}" is invalid. Expected one of: ${validGuideIds.join(', ')}`
  )

  const guide = getGuideProfile(lesson.guideId)
  assert.ok(guide, `Guide profile for "${lesson.guideId}" must resolve via getGuideProfile`)
  assert.ok(guide.name.length > 0, `Guide "${lesson.guideId}" must have a name`)
  assert.ok(guide.avatar.length > 0, `Guide "${lesson.guideId}" must have an avatar icon`)
}
console.log(`  ✅ [PASS] All lesson guides resolve to active pedagogical guide profiles`)

// 5. SCENE SEQUENCE, SCENE TYPES & CONTENT INTEGRITY
console.log('\n5. Auditing Scene Sequences, Scene Types & Dialogue Quality...')
const validSceneTypes: SceneType[] = [
  'welcome_hook',
  'visual_demonstration',
  'guided_interaction',
  'micro_question',
  'independent_try',
  'reflection_summary',
]

for (const lesson of lessons) {
  assert.ok(
    lesson.scenes.length >= 3,
    `Lesson "${lesson.id}" must contain at least 3 scenes. Found ${lesson.scenes.length}`
  )

  const sceneIds = new Set<string>()
  for (let i = 0; i < lesson.scenes.length; i++) {
    const scene = lesson.scenes[i]
    assert.ok(scene.id.length > 0, `Lesson "${lesson.id}" scene #${i + 1} must have an ID`)
    assert.ok(!sceneIds.has(scene.id), `Lesson "${lesson.id}" has duplicate scene ID "${scene.id}"`)
    sceneIds.add(scene.id)

    assert.ok(
      validSceneTypes.includes(scene.type),
      `Lesson "${lesson.id}" scene "${scene.id}" has invalid type "${scene.type}"`
    )

    assert.ok(scene.title.trim().length > 0, `Lesson "${lesson.id}" scene "${scene.id}" must have a title`)
    assert.ok(scene.guideDialogue.trim().length > 0, `Lesson "${lesson.id}" scene "${scene.id}" must have guideDialogue`)
    assert.ok(scene.narrationText.trim().length > 0, `Lesson "${lesson.id}" scene "${scene.id}" must have narrationText`)

    // Verify Guide on Scene
    assert.ok(
      validGuideIds.includes(scene.guideId),
      `Lesson "${lesson.id}" scene "${scene.id}" has invalid scene guideId "${scene.guideId}"`
    )
  }

  // Check that first scene is welcome/hook and last scene is reflection/summary
  assert.strictEqual(
    lesson.scenes[0].type,
    'welcome_hook',
    `Lesson "${lesson.id}" first scene must be a "welcome_hook"`
  )
  assert.strictEqual(
    lesson.scenes[lesson.scenes.length - 1].type,
    'reflection_summary',
    `Lesson "${lesson.id}" final scene must be a "reflection_summary"`
  )
}
console.log(`  ✅ [PASS] All lesson scenes conform to strict pedagogical scene sequencing`)

// 6. MANIPULATIVES & VISUAL DEMONSTRATION CONFIGURATION
console.log('\n6. Auditing Manipulatives & Visual Demonstration Configurations...')
const validManipulativeKinds = [
  'ten_frame',
  'number_line',
  'fraction_bar',
  'balance_scale',
  'phoneme_builder',
  'code_blocks',
  'logic_clues',
  'sentence_runes',
  'robot_grid',
  'color_palette',
  'rhythm_drums',
  'breath_circle',
]

for (const lesson of lessons) {
  for (const scene of lesson.scenes) {
    if (scene.manipulative) {
      assert.ok(
        validManipulativeKinds.includes(scene.manipulative.kind),
        `Lesson "${lesson.id}" scene "${scene.id}" has invalid manipulative kind "${scene.manipulative.kind}"`
      )
      assert.ok(
        scene.manipulative.instructions.trim().length > 0,
        `Lesson "${lesson.id}" scene "${scene.id}" manipulative must have instructions`
      )
      assert.strictEqual(
        typeof scene.manipulative.interactive,
        'boolean',
        `Lesson "${lesson.id}" scene "${scene.id}" manipulative interactive flag must be boolean`
      )
      assert.strictEqual(
        typeof scene.manipulative.initialState,
        'object',
        `Lesson "${lesson.id}" scene "${scene.id}" manipulative initialState must be an object`
      )
    }

    if (scene.visualDemo) {
      assert.ok(
        scene.visualDemo.title.trim().length > 0,
        `Lesson "${lesson.id}" scene "${scene.id}" visualDemo must have a title`
      )
      assert.strictEqual(
        typeof scene.visualDemo.data,
        'object',
        `Lesson "${lesson.id}" scene "${scene.id}" visualDemo data must be an object`
      )
    }
  }
}
console.log(`  ✅ [PASS] All manipulatives and visual demonstrations have valid schemas and initial states`)

// 7. MICRO-QUESTIONS & 4-TIER PROGRESSIVE SCAFFOLDING
console.log('\n7. Auditing Micro-Questions & 4-Tier Progressive Scaffolding Invariant...')
let totalMicroQuestions = 0

for (const lesson of lessons) {
  for (const scene of lesson.scenes) {
    if (scene.microQuestion) {
      totalMicroQuestions++
      const mq = scene.microQuestion

      assert.ok(mq.id.length > 0, `Lesson "${lesson.id}" microQuestion must have an id`)
      assert.ok(mq.prompt.trim().length > 0, `Lesson "${lesson.id}" microQuestion "${mq.id}" must have a prompt`)
      assert.ok(mq.explanation.trim().length > 0, `Lesson "${lesson.id}" microQuestion "${mq.id}" must have an explanation`)

      // Critical Rule: Exactly 4 Progressive Scaffolding Hint Tiers
      assert.ok(
        Array.isArray(mq.hints),
        `Lesson "${lesson.id}" microQuestion "${mq.id}" hints must be an array`
      )
      assert.strictEqual(
        mq.hints.length,
        4,
        `Lesson "${lesson.id}" microQuestion "${mq.id}" must have EXACTLY 4 hint tiers. Found ${mq.hints.length}`
      )

      for (let tier = 0; tier < 4; tier++) {
        assert.ok(
          mq.hints[tier].trim().length > 0,
          `Lesson "${lesson.id}" microQuestion "${mq.id}" Tier ${tier + 1} hint must not be empty`
        )
      }

      // Options Check (if single_choice or multi_choice)
      if (mq.questionType === 'single_choice' && mq.options) {
        assert.ok(
          mq.options.length >= 2,
          `Lesson "${lesson.id}" microQuestion "${mq.id}" must have at least 2 options`
        )

        const correctOptions = mq.options.filter((o) => o.isCorrect)
        assert.strictEqual(
          correctOptions.length,
          1,
          `Lesson "${lesson.id}" microQuestion "${mq.id}" single_choice must have exactly 1 correct option`
        )

        for (const opt of mq.options) {
          assert.ok(opt.id.length > 0, `Option in "${mq.id}" must have an id`)
          assert.ok(opt.label.trim().length > 0, `Option "${opt.id}" in "${mq.id}" must have a label`)
        }
      }
    }
  }
}
assert.ok(totalMicroQuestions > 0, 'Must have audited at least 1 micro-question')
console.log(`  ✅ [PASS] ${totalMicroQuestions} micro-questions verified with strict 4-Tier Scaffolding Invariant`)

// 8. ECONOMY & REWARD BOUNDS (XP: 20–100, Stars: 1–5)
console.log('\n8. Auditing Reward Bounds & Economy Safety...')
for (const lesson of lessons) {
  assert.ok(
    lesson.rewardXP >= 20 && lesson.rewardXP <= 100,
    `Lesson "${lesson.id}" rewardXP (${lesson.rewardXP}) out of bounds [20, 100]`
  )
  assert.ok(
    lesson.rewardStars >= 1 && lesson.rewardStars <= 5,
    `Lesson "${lesson.id}" rewardStars (${lesson.rewardStars}) out of bounds [1, 5]`
  )
}
console.log(`  ✅ [PASS] All lesson rewards strictly respect the ORBis child economy bounds`)

// 9. CAPSTONE GAME REFERENCES
console.log('\n9. Auditing Flagship Game Capstone Bindings...')
const validPlaygroundGameIds = Object.keys(PLAYGROUND_REGISTRY)

for (const lesson of lessons) {
  if (lesson.capstoneGameId) {
    assert.ok(
      validPlaygroundGameIds.includes(lesson.capstoneGameId),
      `Lesson "${lesson.id}" capstoneGameId "${lesson.capstoneGameId}" does not exist in PLAYGROUND_REGISTRY`
    )
    const game = PLAYGROUND_REGISTRY[lesson.capstoneGameId as keyof typeof PLAYGROUND_REGISTRY]
    assert.ok(game.isPlayable, `Capstone game "${lesson.capstoneGameId}" must be marked isPlayable`)
  }
}
console.log(`  ✅ [PASS] All capstone game references link to active, playable flagship games`)

// 10. PREREQUISITE REFERENCES, ACYCLIC GRAPH & PEDAGOGICAL INTEGRITY AUDIT
console.log('\n10. Auditing Prerequisite References, Dependency Graph Acyclicity & Pedagogical Integrity...')

const GRADE_BAND_ORDER: Record<GradeBand, number> = {
  pre_k: 0,
  kindergarten: 1,
  grade_1: 2,
  grade_2: 3,
  grade_3: 4,
  grade_4: 5,
  grade_5: 6,
  grade_6: 7,
}

// Map each subject to its allowed conceptual prerequisite subject domains
const ALLOWED_PREREQUISITE_SUBJECTS: Record<string, string[]> = {
  math: ['math', 'computer_science', 'logic', 'creativity'],
  science: ['science', 'general_knowledge', 'math', 'creativity'],
  english: ['english', 'reading', 'vocabulary', 'grammar'],
  reading: ['reading', 'english', 'vocabulary', 'grammar', 'logic'],
  vocabulary: ['vocabulary', 'reading', 'english', 'grammar'],
  grammar: ['grammar', 'english', 'reading', 'vocabulary'],
  computer_science: ['computer_science', 'math', 'logic'],
  logic: ['logic', 'computer_science', 'reading', 'math'],
  creativity: ['creativity', 'science', 'math', 'general_knowledge', 'english'],
  general_knowledge: ['general_knowledge', 'science', 'creativity', 'reading', 'math', 'computer_science', 'logic'],
}

for (const lesson of lessons) {
  const lessonGradeOrder = GRADE_BAND_ORDER[lesson.gradeBand]

  for (const prereqId of lesson.prerequisites) {
    const prereqCinematic = CINEMATIC_LESSONS_REGISTRY[prereqId]
    const prereqAcademyLesson = ACADEMY_LESSONS_REGISTRY[prereqId]
    const prereqSkill = getAcademySkill(prereqId)

    assert.ok(
      Boolean(prereqCinematic || prereqAcademyLesson || prereqSkill),
      `Lesson "${lesson.id}" has unresolved prerequisite "${prereqId}"`
    )

    // 1. Pedagogical Subject Domain Compatibility
    const prereqSubjectId =
      prereqCinematic?.subjectId || prereqSkill?.subjectId || 'general_knowledge'
    const allowedSubjects = ALLOWED_PREREQUISITE_SUBJECTS[lesson.subjectId] || [lesson.subjectId]

    assert.ok(
      allowedSubjects.includes(prereqSubjectId),
      `Pedagogical Mismatch: Lesson "${lesson.id}" (${lesson.subjectId}) has prerequisite "${prereqId}" (${prereqSubjectId}). Prerequisite subject must be conceptually compatible: [${allowedSubjects.join(', ')}]`
    )

    // 2. Developmental Progression (Prerequisite cannot require a higher grade band)
    if (prereqCinematic) {
      const prereqGradeOrder = GRADE_BAND_ORDER[prereqCinematic.gradeBand]
      assert.ok(
        prereqGradeOrder <= lessonGradeOrder,
        `Developmental Inversion: Lesson "${lesson.id}" (${lesson.gradeBand}) requires prerequisite lesson "${prereqId}" from a higher grade band (${prereqCinematic.gradeBand})`
      )
    }
  }
}

// Cycle Detection using Depth-First Search
const visited = new Set<string>()
const recursionStack = new Set<string>()

function checkCycle(nodeId: string) {
  visited.add(nodeId)
  recursionStack.add(nodeId)

  const lesson = CINEMATIC_LESSONS_REGISTRY[nodeId]
  if (lesson) {
    for (const neighbor of lesson.prerequisites) {
      if (!visited.has(neighbor)) {
        checkCycle(neighbor)
      } else if (recursionStack.has(neighbor)) {
        throw new Error(`Cycle detected in curriculum prerequisites involving "${nodeId}" and "${neighbor}"`)
      }
    }
  }

  recursionStack.delete(nodeId)
}

for (const lesson of lessons) {
  if (!visited.has(lesson.id)) {
    checkCycle(lesson.id)
  }
}
console.log(`  ✅ [PASS] Prerequisite graph verified: 100% resolvable, acyclic (0 cycles), and pedagogically compatible`)

// 11. PRE-K & KINDERGARTEN NON-READER SCAFFOLDING
console.log('\n11. Auditing Pre-K & Kindergarten Non-Reader Visual Scaffolding...')
for (const lesson of lessons) {
  if (lesson.gradeBand === 'pre_k' || lesson.gradeBand === 'kindergarten') {
    for (const scene of lesson.scenes) {
      assert.ok(
        scene.narrationText.trim().length > 0,
        `Early years lesson "${lesson.id}" scene "${scene.id}" must provide complete narrationText for voice read-aloud`
      )

      if (scene.microQuestion && scene.microQuestion.options) {
        for (const opt of scene.microQuestion.options) {
          // Pre-K/K options must have visual icon or rich phoneme/visual label
          const hasVisualScaffolding = Boolean(opt.icon) || opt.label.includes('⭐') || opt.label.includes('/') || opt.label.includes('(')
          assert.ok(
            hasVisualScaffolding,
            `Early years option "${opt.id}" in lesson "${lesson.id}" must contain visual icon or scaffolding`
          )
        }
      }
    }
  }
}
console.log(`  ✅ [PASS] Pre-K and Kindergarten lessons fulfill non-reader visual and auditory requirements`)

// 12. LOCALIZATION SCHEMA CONFORMANCE
console.log('\n12. Auditing Multilingual Translation Schema Conformance...')
for (const lesson of lessons) {
  if (lesson.translations) {
    assert.strictEqual(typeof lesson.translations, 'object', `Translations on "${lesson.id}" must be an object`)
    for (const [lang, tObj] of Object.entries(lesson.translations)) {
      assert.ok(lang.length >= 2, `Language key "${lang}" must be a valid locale string`)
      assert.strictEqual(typeof tObj, 'object', `Translation record for "${lang}" on "${lesson.id}" must be an object`)
    }
  }

  for (const scene of lesson.scenes) {
    if (scene.translations) {
      assert.strictEqual(typeof scene.translations, 'object', `Translations on scene "${scene.id}" must be an object`)
      for (const [lang, tObj] of Object.entries(scene.translations)) {
        assert.ok(lang.length >= 2, `Language key "${lang}" on scene "${scene.id}" must be a valid locale string`)
        assert.strictEqual(typeof tObj, 'object', `Translation record for "${lang}" on scene "${scene.id}" must be an object`)
      }
    }
  }
}
console.log(`  ✅ [PASS] Multilingual localization schemas conform to the international curriculum standard`)

console.log('\n==================================================================')
console.log(`🏆 ALL 12 UNIVERSAL CURRICULUM VALIDATION AUDITS PASSED (100% SUCCESS)!`)
console.log('==================================================================\n')
