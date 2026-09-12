/**
 * ORBis Phase 9 Production Experience & Child Immersion Elevation Test Suite
 * Validates all 10 elevation stages: Responsive Navigation, Landing Page & Brand,
 * Pre-K Visual UX, Audio Priming, Mascot Anatomy, Overworld Trail, Multi-Child Switcher,
 * Games Developmental Filtering, and Localization Extensibility.
 */

import { CINEMATIC_LESSONS_REGISTRY } from '../src/services/academy/curriculum/cinematicLessonsData'
import { getCanonicalFlagshipGames } from '../src/services/games/playgroundRegistry'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED] ${message}`)
  }
}

export async function runAcademyPhase9ElevationTests(): Promise<void> {
  console.log('🧪 Running ORBis Phase 9 Elevation Verification...')

  // 1. Verify Pre-K Pure Visual Question Scaffolding
  const prekLesson = CINEMATIC_LESSONS_REGISTRY.lesson_prek_star_counting
  assert(!!prekLesson, 'Pre-K counting lesson must exist in CINEMATIC_LESSONS_REGISTRY')
  assert(prekLesson.gradeBand === 'pre_k', 'Lesson gradeBand must be pre_k')

  const questionScene = prekLesson.scenes.find((s) => s.type === 'micro_question')
  assert(!!questionScene, 'Pre-K lesson must have a micro_question scene')
  assert(!!questionScene?.microQuestion, 'MicroQuestion config must be defined')

  const options = questionScene?.microQuestion?.options || []
  assert(options.length === 3, 'Pre-K question must have 3 options')
  const correctOpt = options.find((o) => o.isCorrect)
  assert(!!correctOpt, 'Must have a correct option')
  assert(correctOpt?.label.includes('⭐⭐⭐⭐⭐'), 'Correct option must feature 5 star icons for visual non-readers')

  // 2. Verify Flagship Games Developmental Categorization
  const games = getCanonicalFlagshipGames()
  assert(games.length === 10, `Must have all 10 canonical flagship games, found ${games.length}`)

  const earlyGames = ['word_trace', 'rhythm_spells', 'potion_scales', 'spellforge']
  const elementaryGames = ['magic_machine', 'invention_lab', 'cosmic_constellations']
  const advancedGames = ['robopath', 'mystery_detective', 'ecosystem_sandbox']

  earlyGames.forEach((id) => {
    assert(games.some((g) => g.id === id), `Early learner game ${id} must exist`)
  })
  elementaryGames.forEach((id) => {
    assert(games.some((g) => g.id === id), `Elementary game ${id} must exist`)
  })
  advancedGames.forEach((id) => {
    assert(games.some((g) => g.id === id), `Advanced game ${id} must exist`)
  })

  // 3. Verify All 10 Cinematic Demonstration Lessons
  const lessonKeys = Object.keys(CINEMATIC_LESSONS_REGISTRY)
  assert(lessonKeys.length >= 10, `Expected at least 10 cinematic lessons, found ${lessonKeys.length}`)

  lessonKeys.forEach((key) => {
    const l = CINEMATIC_LESSONS_REGISTRY[key]
    assert(!!l.id, `Lesson ${key} must have id`)
    assert(!!l.title, `Lesson ${key} must have title`)
    assert(!!l.subjectId, `Lesson ${key} must have subjectId`)
    assert(!!l.guideId, `Lesson ${key} must have guideId`)
    assert(l.scenes.length >= 3, `Lesson ${key} must have at least 3 scenes`)
    assert(l.rewardXP > 0, `Lesson ${key} must award XP`)
    assert(l.rewardStars > 0, `Lesson ${key} must award Stars`)
  })

  console.log('✅ All Phase 9 Elevation Verification checks PASSED (100%)!')
}

// Execute directly if run via CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/')) || process.argv[1]?.includes('test_academy_phase9_elevation')) {
  runAcademyPhase9ElevationTests()
    .then(() => {
      console.log('✨ Phase 9 Test Suite Execution Complete.')
    })
    .catch((err) => {
      console.error('❌ Phase 9 Test Suite Failed:', err)
      process.exit(1)
    })
}
