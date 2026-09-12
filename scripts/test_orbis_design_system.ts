/**
 * ORBis Design System Verification Suite (Phase 2)
 * Audits design tokens, CSS variables, component contracts, realm styles, and curriculum immutability.
 */

import fs from 'node:fs'
import path from 'node:path'
import {
  REALM_STYLE_CONFIGS,
  GRADE_BAND_CONFIGS,
  MOTION_TIMING_TOKENS,
  TOUCH_TARGET_TOKENS,
} from '../src/styles/academyTokens'
import * as DesignComponents from '../src/components/ui/design'

console.log('==================================================================')
console.log('🧪 RUNNING ORBIS DESIGN SYSTEM & TOKENS VERIFICATION SUITE')
console.log('==================================================================\n')

let passCount = 0
let failCount = 0

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`)
    passCount++
  } else {
    console.error(`  ❌ [FAIL] ${description}`)
    failCount++
  }
}

// 1. Audit CSS Tokens in tokens.css
console.log('▶️ 1. Auditing CSS Master Tokens (tokens.css)...')
const tokensCssPath = path.resolve(process.cwd(), 'src/styles/tokens.css')
const tokensCss = fs.readFileSync(tokensCssPath, 'utf8')

assert(tokensCss.includes('--orbis-void-dark: #020617;'), 'Deep space void dark token defined')
assert(tokensCss.includes('--orbis-realm-math-base: #38bdf8;'), 'Math realm base color defined')
assert(tokensCss.includes('--orbis-realm-science-base: #10b981;'), 'Science realm base color defined')
assert(tokensCss.includes('--orbis-realm-english-base: #a855f7;'), 'English realm base color defined')
assert(tokensCss.includes('--font-family-display:'), 'Display typography token defined')
assert(tokensCss.includes('--font-family-body:'), 'Body typography token defined')
assert(tokensCss.includes('--radius-portal: 32px;'), 'Portal radius token defined')
assert(tokensCss.includes('--glass-surface-hero:'), 'Glass hero surface token defined')
assert(tokensCss.includes('--touch-target-min-standard: 48px;'), 'Child touch target min 48px token defined')
assert(tokensCss.includes('@media (prefers-reduced-motion: reduce)'), 'A11y reduced-motion override path defined')

// 2. Audit TypeScript Academy Tokens
console.log('\n▶️ 2. Auditing TypeScript Design Tokens (academyTokens.ts)...')
assert(Object.keys(REALM_STYLE_CONFIGS).length === 8, 'Exactly 8 academic realms styled')
assert(REALM_STYLE_CONFIGS.mathematics.baseColor === '#38bdf8', 'Mathematics realm color mapped correctly')
assert(REALM_STYLE_CONFIGS.science.baseColor === '#10b981', 'Science realm color mapped correctly')
assert(REALM_STYLE_CONFIGS.computer_science.baseColor === '#6366f1', 'Computer Science realm color mapped correctly')

assert(Object.keys(GRADE_BAND_CONFIGS).length >= 7, 'Grade bands configured from Pre-K to Grade 6')
assert(GRADE_BAND_CONFIGS.pre_k.touchTargetSize === 64, 'Pre-K touch target size is 64px')
assert(GRADE_BAND_CONFIGS.grade_1.touchTargetSize === 48, 'Grade 1 touch target size is 48px')

assert(TOUCH_TARGET_TOKENS.minStandard >= 44, 'Touch target standard meets 44px+ constraint')
assert(MOTION_TIMING_TOKENS.micro === 120, 'Micro motion timing token is 120ms')
assert(MOTION_TIMING_TOKENS.celebration === 1200, 'Celebration motion timing token is 1200ms')

// 3. Audit UI Design Components Exports
console.log('\n▶️ 3. Auditing UI Design System Component Suite...')
const requiredComponents = [
  'AnimatedIcon',
  'MagicalButton',
  'GlassPanel',
  'SkillCrystal',
  'WorldPortal',
  'OrbitalProgress',
  'RealmBadge',
  'RewardChip',
  'AdventurePath',
  'InteractionSurface',
  'LessonProgressRail',
]

for (const compName of requiredComponents) {
  assert(
    typeof (DesignComponents as Record<string, unknown>)[compName] !== 'undefined',
    `Component ${compName} successfully exported`,
  )
}

// 4. Audit Curriculum Immutability
console.log('\n▶️ 4. Auditing Curriculum Immutability Invariant...')
const curriculumPath = path.resolve(
  process.cwd(),
  'src/services/academy/curriculum/cinematicLessonsData.ts',
)
const curriculumContent = fs.readFileSync(curriculumPath, 'utf8')
assert(
  curriculumContent.includes('export const CINEMATIC_LESSONS_REGISTRY: Record<string, CinematicLesson> = {'),
  'cinematicLessonsData.ts registry header verified intact',
)
assert(
  curriculumContent.includes('lesson_g2_array_multiplication'),
  'Gold Lesson (lesson_g2_array_multiplication) definition preserved',
)

console.log('\n==================================================================')
console.log(`🎉 ORBis Design System Test Suite: ${passCount} Passed, ${failCount} Failed`)
console.log('==================================================================')

if (failCount > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
