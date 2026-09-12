import {
  getAllAcademySubjects,
  getAcademySubject,
  getAllSkills,
} from '../src/services/academy/curriculum/curriculumRegistry'
import { getAcademyLesson } from '../src/services/academy/curriculum/lessonsData'
import { getAcademyPracticeSet } from '../src/services/academy/curriculum/practiceData'
import { getEcosystemLinksForSkill } from '../src/services/academy/ecosystemBridgeService'

function runAcademyCurriculumTests() {
  console.log('🏛️ Running Academy Curriculum Integrity Tests...')
  let passed = 0
  let failed = 0

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++
    } else {
      failed++
      console.error(`❌ FAILED: ${msg}`)
    }
  }

  // 1. All 10 Core Academic Subjects exist
  const subjects = getAllAcademySubjects()
  assert(subjects.length === 10, `Expected exactly 10 subjects, found ${subjects.length}`)

  const expectedSubjectIds = [
    'math',
    'science',
    'english',
    'reading',
    'vocabulary',
    'grammar',
    'computer_science',
    'logic',
    'creativity',
    'general_knowledge',
  ]

  for (const id of expectedSubjectIds) {
    const sub = getAcademySubject(id)
    assert(!!sub, `Subject ${id} must exist in registry`)
    assert(sub?.title.length! > 0, `Subject ${id} must have a title`)
    assert(sub?.courses.length! > 0, `Subject ${id} must have at least 1 course`)
  }

  // 2. All Skills have valid Lessons and Practice Sets
  const allSkills = getAllSkills()
  assert(allSkills.length >= 10, `Expected at least 10 skills, found ${allSkills.length}`)

  for (const skill of allSkills) {
    const lesson = getAcademyLesson(skill.lessonId)
    assert(!!lesson, `Skill ${skill.id} points to valid lesson ${skill.lessonId}`)
    if (lesson) {
      assert(lesson.blocks.length >= 2, `Lesson ${lesson.id} has at least 2 structured blocks`)
      assert(lesson.summaryTakeaways.length >= 2, `Lesson ${lesson.id} has key takeaways`)
    }

    const practice = getAcademyPracticeSet(skill.practiceSetId)
    assert(!!practice, `Skill ${skill.id} points to valid practice set ${skill.practiceSetId}`)
    if (practice) {
      assert(practice.questions.length >= 1, `Practice set ${practice.id} has questions`)
    }
  }

  // 3. Ecosystem links for capstone games
  const mathBalanceLink = getEcosystemLinksForSkill('skill_potion_balance_equations')
  assert(!!mathBalanceLink, 'Ecosystem link for balance equations must exist')
  assert(mathBalanceLink?.capstoneGame?.id === 'potion_scales', 'Balance equations must link to Potion Scales capstone')

  const robotLink = getEcosystemLinksForSkill('skill_step_sequencing')
  assert(!!robotLink, 'Ecosystem link for step sequencing must exist')
  assert(robotLink?.capstoneGame?.id === 'robopath', 'Step sequencing must link to RoboPath capstone')

  const prefixLink = getEcosystemLinksForSkill('skill_prefix_un_re')
  assert(!!prefixLink, 'Ecosystem link for prefixes must exist')
  assert(prefixLink?.capstoneGame?.id === 'spellforge', 'Prefixes must link to Spellforge capstone')

  console.log(`\nCurriculum Tests: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

runAcademyCurriculumTests()
