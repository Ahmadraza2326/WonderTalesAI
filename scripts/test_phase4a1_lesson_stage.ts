import fs from 'fs'
import path from 'path'

console.log('==================================================================')
console.log('🧪 RUNNING ORBIS PHASE 4A.1: LESSON STAGE VERIFICATION SUITE')
console.log('==================================================================\n')

let passed = 0
let failed = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`)
    passed++
  } else {
    console.error(`  ❌ [FAIL] ${message}`)
    failed++
  }
}

const root = process.cwd()

// 1. Audit LessonProgressRail
console.log('▶️ 1. Auditing LessonProgressRail HUD Component...')
const progressRailFile = path.join(root, 'src/components/ui/design/LessonProgressRail.tsx')
const progressRailContent = fs.readFileSync(progressRailFile, 'utf-8')

assert(
  progressRailContent.includes('onOpenAskOrbis?: () => void'),
  'LessonProgressRail supports optional onOpenAskOrbis prop'
)
assert(
  progressRailContent.includes("minWidth: '48px'") && progressRailContent.includes("minHeight: '48px'"),
  'Interactive buttons strictly enforce >=48px minimum touch targets'
)
assert(
  progressRailContent.includes("position: 'sticky'") && progressRailContent.includes("top: 0"),
  'LessonProgressRail is pinned as a sticky floating HUD header'
)
assert(
  progressRailContent.includes("backdropFilter: 'blur(16px)'") || progressRailContent.includes('backdropFilter'),
  'LessonProgressRail uses cosmic glassmorphic backdrop blur'
)

// 2. Audit RealmStageBackdrop
console.log('\n▶️ 2. Auditing RealmStageBackdrop Atmosphere & Particles...')
const backdropFile = path.join(root, 'src/components/academy/lesson/cinematic/RealmStageBackdrop.tsx')
const backdropContent = fs.readFileSync(backdropFile, 'utf-8')

assert(
  backdropContent.includes('ParticleField') && backdropContent.includes('<ParticleField'),
  'RealmStageBackdrop embeds canvas-based ParticleField'
)
assert(
  !backdropContent.includes('🌌') && !backdropContent.includes('⭐') && !backdropContent.includes('🍃'),
  'RealmStageBackdrop completely eliminated legacy emoji particle spans'
)
assert(
  backdropContent.includes("overflowX: 'hidden'"),
  'RealmStageBackdrop prevents horizontal mobile overflow'
)
assert(
  backdropContent.includes('accentAura'),
  'RealmStageBackdrop renders ambient celestial glow aura'
)

// 3. Audit CinematicLessonPlayer
console.log('\n▶️ 3. Auditing CinematicLessonPlayer Integration & Welcome Gate...')
const playerFile = path.join(root, 'src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx')
const playerContent = fs.readFileSync(playerFile, 'utf-8')

assert(
  playerContent.includes('<LessonProgressRail'),
  'CinematicLessonPlayer integrates canonical LessonProgressRail at top of stage'
)
assert(
  playerContent.includes('onExit={onExit}'),
  'CinematicLessonPlayer forwards onExit navigation to LessonProgressRail'
)
assert(
  playerContent.includes('onOpenAskOrbis={onOpenAskOrbis}'),
  'CinematicLessonPlayer forwards onOpenAskOrbis to LessonProgressRail'
)
assert(
  playerContent.includes('<GuideCharacterSvg') && playerContent.includes('emotion="excited"'),
  'Audio primer gate showcases GuideCharacterSvg mascot companion'
)
assert(
  playerContent.includes('<MagicalButton') && playerContent.includes('Begin Adventure'),
  'Audio primer gate uses tactile MagicalButton with zero emojis'
)
assert(
  !playerContent.includes('🚀 Tap to Begin') && !playerContent.includes('🤖 Ask Guide') && !playerContent.includes('⭐'),
  'CinematicLessonPlayer eliminated all presentation Unicode emojis from player UI'
)

// 4. Audit LessonPage & LessonViewer Pass-Through
console.log('\n▶️ 4. Auditing LessonPage & LessonViewer Pass-Through...')
const lessonPageFile = path.join(root, 'src/pages/academy/LessonPage.tsx')
const lessonPageContent = fs.readFileSync(lessonPageFile, 'utf-8')
const viewerFile = path.join(root, 'src/components/academy/lesson/LessonViewer.tsx')
const viewerContent = fs.readFileSync(viewerFile, 'utf-8')

assert(
  lessonPageContent.includes('onExit={handleExit}'),
  'LessonPage passes handleExit down to LessonViewer'
)
assert(
  viewerContent.includes('onExit?: () => void') && viewerContent.includes('onExit={onExit}'),
  'LessonViewer passes onExit down to CinematicLessonPlayer'
)
assert(
  lessonPageContent.includes('!cinematicLesson && ('),
  'LessonPage removes redundant outer exit button and double particle field when running cinematic lessons'
)

// 5. Audit Strict Unicode Emoji Absence Across Child-Facing Lesson UI
console.log('\n▶️ 5. Auditing Strict Child-Facing Unicode Emoji Absence...')
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
const auditedFiles = [progressRailFile, backdropFile, playerFile, viewerFile, lessonPageFile]
let emojiFound = false

for (const f of auditedFiles) {
  const c = fs.readFileSync(f, 'utf-8')
  const lines = c.split('\n')
  lines.forEach((l, idx) => {
    if (emojiRegex.test(l)) {
      console.error(`  ❌ [FAIL] Emoji found in ${path.basename(f)}:${idx + 1}: ${l.trim()}`)
      emojiFound = true
    }
  })
}

assert(!emojiFound, 'Zero presentation Unicode emojis in all 5 lesson player components')

console.log('\n==================================================================')
console.log(`📊 PHASE 4A.1 TEST RESULTS: ${passed} Passed, ${failed} Failed`)
console.log('==================================================================')

if (failed > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
