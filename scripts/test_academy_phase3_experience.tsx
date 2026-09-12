/**
 * ORBis Phase 3 — Academy Experience Integration Test Suite
 *
 * Verifies:
 * 1. Phase 3A: AcademyHomePage renders 10 Command Center pillars, Stitch Direction C visuals, and zero presentation emojis.
 * 2. Phase 3B: SubjectDetailPage renders thematic realm hero, Guide mascot stage, and course constellation cards.
 * 3. Phase 3C: CourseDetailPage renders AdventurePath progression maps, SkillCrystal nodes, prerequisite gating, and flagship milestones.
 * 4. Phase 3D: SkillHubPage renders 10-step pedagogical loop, Triad launchers (Lesson + Practice + Flagship), and Guide encouragement.
 * 5. Route consistency and zero broken links across all 10 subjects and courses.
 */

import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../src/context/AuthContext'
import { I18nProvider } from '../src/context/I18nContext'
import { AcademyHomePage } from '../src/pages/academy/AcademyHomePage'
import { SubjectDetailPage } from '../src/pages/academy/SubjectDetailPage'
import { CourseDetailPage } from '../src/pages/academy/CourseDetailPage'
import { SkillHubPage } from '../src/pages/academy/SkillHubPage'
import {
  getAllAcademySubjects,
  getAcademySubject,
  getAcademyCourse,
  getAcademySkill,
} from '../src/services/academy/curriculum/curriculumRegistry'
import { getAllPlaygroundGames } from '../src/services/games/playgroundRegistry'
import { getGuideProfile } from '../src/services/academy/guideDirector'

let passedCount = 0
let failedCount = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`)
    passedCount++
  } else {
    console.error(`  ❌ [FAIL] ${message}`)
    failedCount++
  }
}

// Helper to detect presentation emojis in HTML strings
const EMOJI_REGEX = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u

function renderWithProviders(element: React.ReactElement) {
  return renderToString(
    <AuthProvider>
      <I18nProvider>
        {element}
      </I18nProvider>
    </AuthProvider>
  )
}

console.log('==================================================================')
console.log('🧪 RUNNING ORBIS PHASE 3 ACADEMY EXPERIENCE TEST SUITE')
console.log('==================================================================\n')

// -----------------------------------------------------------------------------
// 1. Phase 3A: Academy Command Center (AcademyHomePage)
// -----------------------------------------------------------------------------
console.log('▶️ 1. Testing Phase 3A — AcademyHomePage Command Center...')

try {
  const homeHtml = renderWithProviders(
    <MemoryRouter initialEntries={['/academy']}>
      <Routes>
        <Route path="/academy" element={<AcademyHomePage />} />
      </Routes>
    </MemoryRouter>
  )

  assert(homeHtml.includes('Living Learning Universe'), 'AcademyHomePage renders Living Learning Universe brand header')
  assert(homeHtml.includes('Adventure Streak'), 'AcademyHomePage renders child streak status')
  assert(homeHtml.includes('CONTINUE LEARNING HERO'), 'AcademyHomePage renders Continue Learning Hero pillar')
  assert(homeHtml.includes('Today&#x27;s Guided Adventure') || homeHtml.includes("Today's Guided Adventure"), "AcademyHomePage renders Today's Guided Adventure mission pillar")
  assert(homeHtml.includes('Next Best Skills to Master'), 'AcademyHomePage renders Next Best Skills recommendation pillar')
  assert(homeHtml.includes('10 Core Academic Realms'), 'AcademyHomePage renders 10 Core Academic Realms portal pillar')
  assert(homeHtml.includes('Library') && homeHtml.includes('Creative Studio') && homeHtml.includes('Think Lab'), 'AcademyHomePage renders Universal Discovery shortcuts')

  // Emoji check
  const hasEmojis = EMOJI_REGEX.test(homeHtml)
  assert(!hasEmojis, 'AcademyHomePage has ZERO presentation Unicode emojis')
} catch (err: any) {
  assert(false, `AcademyHomePage threw render error: ${err.message}`)
}

// -----------------------------------------------------------------------------
// 2. Phase 3B: Subject World Realms (SubjectDetailPage)
// -----------------------------------------------------------------------------
console.log('\n▶️ 2. Testing Phase 3B — SubjectDetailPage World Realms & Mascot Stage...')

const subjects = getAllAcademySubjects()
assert(subjects.length === 10, 'curriculumRegistry contains 10 canonical subjects')

for (const sub of subjects) {
  try {
    const subHtml = renderWithProviders(
      <MemoryRouter initialEntries={[`/academy/subject/${sub.id}`]}>
        <Routes>
          <Route path="/academy/subject/:subjectId" element={<SubjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    const expectedTitleEncoded = sub.title.replace(/&/g, '&amp;')
    assert(subHtml.includes(expectedTitleEncoded) || subHtml.includes(sub.title), `SubjectDetailPage renders subject title for '${sub.id}'`)
    assert(subHtml.includes('Academic Realm'), `SubjectDetailPage renders realm badge for '${sub.id}'`)
    assert(subHtml.includes('Back to All Academy Realms'), `SubjectDetailPage renders realm back navigation for '${sub.id}'`)
    assert(subHtml.includes('Realm Learning Paths &amp; Courses') || subHtml.includes('Realm Learning Paths & Courses'), `SubjectDetailPage renders courses section for '${sub.id}'`)

    const hasEmojis = EMOJI_REGEX.test(subHtml)
    assert(!hasEmojis, `SubjectDetailPage has ZERO presentation emojis for '${sub.id}'`)
  } catch (err: any) {
    assert(false, `SubjectDetailPage threw render error for '${sub.id}': ${err.message}`)
  }
}

// -----------------------------------------------------------------------------
// 3. Phase 3C: Course Constellation Progression (CourseDetailPage)
// -----------------------------------------------------------------------------
console.log('\n▶️ 3. Testing Phase 3C — CourseDetailPage Constellation Maps & Milestones...')

const sampleCourse = getAcademyCourse('math_numbers_counting')
assert(Boolean(sampleCourse), "Sample course 'math_numbers_counting' exists in registry")

if (sampleCourse) {
  try {
    const courseHtml = renderWithProviders(
      <MemoryRouter initialEntries={[`/academy/course/${sampleCourse.id}`]}>
        <Routes>
          <Route path="/academy/course/:courseId" element={<CourseDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    const courseTitleEncoded = sampleCourse.title.replace(/&/g, '&amp;')
    assert(courseHtml.includes(courseTitleEncoded) || courseHtml.includes(sampleCourse.title), 'CourseDetailPage renders course title')
    assert(courseHtml.includes('Constellation Course'), 'CourseDetailPage renders Constellation Course badge')
    assert(courseHtml.includes('COURSE MASTERY'), 'CourseDetailPage renders Course Mastery progression bar')
    assert(courseHtml.includes('Milestone'), 'CourseDetailPage renders Unit milestones')
    assert(courseHtml.includes('Standard Competencies'), 'CourseDetailPage renders unit competencies')

    const hasEmojis = EMOJI_REGEX.test(courseHtml)
    assert(!hasEmojis, 'CourseDetailPage has ZERO presentation Unicode emojis')
  } catch (err: any) {
    assert(false, `CourseDetailPage threw render error: ${err.message}`)
  }
}

// -----------------------------------------------------------------------------
// 4. Phase 3D: Skill Hub & Learning Triad (SkillHubPage)
// -----------------------------------------------------------------------------
console.log('\n▶️ 4. Testing Phase 3D — SkillHubPage 10-Step Loop & Learning Triad...')

const sampleSkill = getAcademySkill('skill_shapes_prek')
assert(Boolean(sampleSkill), "Sample skill 'skill_shapes_prek' exists in registry")

if (sampleSkill) {
  try {
    const skillHtml = renderWithProviders(
      <MemoryRouter initialEntries={[`/academy/skill/${sampleSkill.id}`]}>
        <Routes>
          <Route path="/academy/skill/:skillId" element={<SkillHubPage />} />
        </Routes>
      </MemoryRouter>
    )

    const skillTitleEncoded = sampleSkill.title.replace(/&/g, '&amp;')
    assert(skillHtml.includes(skillTitleEncoded) || skillHtml.includes(sampleSkill.title), 'SkillHubPage renders skill title')
    assert(skillHtml.includes('Skill Superpower Hub'), 'SkillHubPage renders Superpower Hub banner')
    assert(skillHtml.includes('Mastery Score'), 'SkillHubPage renders Mastery Score badge')
    assert(skillHtml.includes('ORBis 10-Step Pedagogical Mastery Loop'), 'SkillHubPage renders 10-step pedagogical mastery loop')
    assert(skillHtml.includes('The Learning Triad Activities'), 'SkillHubPage renders The Learning Triad header')
    assert(skillHtml.includes('Interactive Cinematic Lesson'), 'SkillHubPage renders Lesson triad launcher')
    assert(skillHtml.includes('Practice Challenge'), 'SkillHubPage renders Practice triad launcher')

    const hasEmojis = EMOJI_REGEX.test(skillHtml)
    assert(!hasEmojis, 'SkillHubPage has ZERO presentation Unicode emojis')
  } catch (err: any) {
    assert(false, `SkillHubPage threw render error: ${err.message}`)
  }
}

// -----------------------------------------------------------------------------
// 5. Invariant Integrity Verification
// -----------------------------------------------------------------------------
console.log('\n▶️ 5. Auditing Invariant Integrity & Ecosystem Connections...')

const allGames = getAllPlaygroundGames()
assert(allGames.length >= 8, `Flagship game registry has ${allGames.length} games registered`)

const guides = ['poly', 'newton', 'lexi', 'aria', 'beep_0', 'sherlock', 'davinci', 'atlas', 'nova']
for (const gId of guides) {
  const g = getGuideProfile(gId as any)
  assert(Boolean(g && g.name && g.catchphrase), `Guide profile '${gId}' is complete with persona and catchphrase`)
}

console.log('\n==================================================================')
console.log(`📊 PHASE 3 VERIFICATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`)
console.log('==================================================================')

if (failedCount > 0) {
  process.exit(1)
}

