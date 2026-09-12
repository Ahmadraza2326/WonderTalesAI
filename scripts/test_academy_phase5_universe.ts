/**
 * ORBis Phase 5 Comprehensive Learning Universe Verification Suite
 * Tests Grade Band configurations, Learning Director, Universal Library,
 * Pedagogical Guides, Narration, Projects, Story Bridges, and Offline Sync.
 */

import assert from 'assert'
import { GRADE_BAND_CONFIGS } from '../src/styles/academyTokens'
import { generateDailyLearningPlan } from '../src/services/academy/learningDirector'
import { getAllLibraryItems, filterLibraryItems } from '../src/services/academy/libraryRegistry'
import { getGuideProfile } from '../src/services/academy/guideDirector'
import { narrationDirector } from '../src/services/audio/narrationDirector'
import { getAllProjects, getProjectById } from '../src/services/academy/projectService'
import { STORY_CONNECTIONS, getStoryConnectionForSkill } from '../src/services/academy/storyBridgeService'
import { offlineSyncService } from '../src/services/academy/offlineSyncService'

console.log('🌌 RUNNING ORBIS PHASE 5 LEARNING UNIVERSE VERIFICATION SUITE...\n')

// 1. Grade Band Developmental Progression
console.log('1. Testing Grade Band Developmental Profiles (Pre-K to Grade 5)...')
const grades = ['pre_k', 'kindergarten', 'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5'] as const
for (const g of grades) {
  const cfg = GRADE_BAND_CONFIGS[g]
  assert.ok(cfg, `Grade band ${g} must have configuration`)
  assert.ok(cfg.touchTargetSize >= 44, `Touch target for ${g} must be >= 44px`)
  assert.ok(cfg.maxSessionMinutes > 0, `Session duration for ${g} must be positive`)
}
assert.strictEqual(GRADE_BAND_CONFIGS.pre_k.narrationMandatory, true, 'Pre-K must mandate audio narration')
console.log('  ✅ [PASS] All 7 grade bands verified with developmental scaling')

// 2. Learning Director
console.log('\n2. Testing ORBis Learning Director Daily Plan Generation...')
const plan = generateDailyLearningPlan({
  childId: 'child_test_1',
  gradeBand: 'grade_3',
  preferredGuideId: 'poly',
  currentStreak: 5,
})
assert.strictEqual(plan.childId, 'child_test_1')
assert.strictEqual(plan.streakDays, 5)
assert.ok(plan.plannedActivities.length >= 3, 'Daily plan must contain at least 3 balanced activities')
assert.ok(plan.totalDurationMinutes > 0, 'Total plan duration must be positive')
console.log(`  ✅ [PASS] Daily plan generated with ${plan.plannedActivities.length} activities (${plan.totalDurationMinutes} min total)`)

// 3. Universal Content Library
console.log('\n3. Testing Universal Content Library Indexing & Multi-Filtering...')
const allItems = getAllLibraryItems()
assert.ok(allItems.length >= 8, 'Library must contain standard core items across categories')

const scienceItems = filterLibraryItems({ category: 'science' })
assert.ok(scienceItems.length >= 1, 'Should find science items')

const grade3Items = filterLibraryItems({ gradeBand: 'grade_3' })
assert.ok(grade3Items.length >= 3, 'Should find grade 3 compatible items')

const searchedFractions = filterLibraryItems({ searchQuery: 'fraction' })
assert.ok(searchedFractions.length >= 1, 'Search for fraction should return fractions lesson')
console.log(`  ✅ [PASS] Library catalog indexed (${allItems.length} items) with category & search filters`)

// 4. Pedagogical Guides
console.log('\n4. Testing Pedagogical Guide Characters & Personas...')
const guideIds = ['poly', 'newton', 'lexi', 'beep_0', 'sherlock', 'nova', 'davinci', 'atlas', 'aria', 'harmony'] as const
for (const gid of guideIds) {
  const guide = getGuideProfile(gid)
  assert.strictEqual(guide.id, gid)
  assert.ok(guide.name.length > 0)
  assert.ok(guide.avatar.length > 0)
  assert.ok(guide.greetingLines.length >= 3)
  assert.ok(guide.encouragementLines.length >= 3)
  assert.ok(guide.celebrationLines.length >= 3)
}
console.log(`  ✅ [PASS] All 10 Pedagogical Guides verified with complete dialogue lines`)

// 5. Narration Director Subtitles
console.log('\n5. Testing Narration Director Event Dispatching...')
let subtitleReceived = false
const unsubscribe = narrationDirector.subscribe((evt) => {
  if (evt.text.includes('Hello young explorer')) {
    subtitleReceived = true
  }
})
narrationDirector.speak('Hello young explorer welcome to ORBis', 'poly')
assert.ok(subtitleReceived, 'Subtitle listener must receive spoken text events')
narrationDirector.stop()
unsubscribe()
console.log('  ✅ [PASS] Narration director subtitle event bus verified')

// 6. Project-Based Learning
console.log('\n6. Testing Project-Based Learning Service & Milestones...')
const projects = getAllProjects()
assert.ok(projects.length >= 2, 'Must have at least 2 master cross-disciplinary projects')
const spaceStation = getProjectById('project_space_station')
assert.ok(spaceStation, 'Space Station project must exist')
assert.strictEqual(spaceStation.milestones.length, 4, 'Space station must contain 4 cross-domain milestones')
console.log(`  ✅ [PASS] Project-based learning contracts validated (${projects.length} projects)`)

// 7. Story & Academic Bridges
console.log('\n7. Testing Story <-> Academic <-> Flagship Game Bridges...')
assert.ok(STORY_CONNECTIONS.length >= 3, 'Must have story connections')
const ecoConn = getStoryConnectionForSkill('sci_ecosystem_balance')
assert.ok(ecoConn, 'Ecosystem skill must connect to Rainforest Secret story')
assert.strictEqual(ecoConn.capstoneGameId, 'ecosystem_sandbox')
console.log('  ✅ [PASS] Story-to-academic and flagship game bridge connections validated')

// 8. Offline-First Sync Queue
console.log('\n8. Testing Offline-First Queue Serialization & Synchronization...')
const syncEvt = offlineSyncService.enqueueEvent('child_test_1', 'skill_completed', {
  skillId: 'math_fractions_intro',
  score: 95,
})
assert.ok(syncEvt.id.startsWith('sync_'))
assert.strictEqual(syncEvt.synced, false)
const pending = offlineSyncService.getPendingEvents()
assert.ok(pending.some((e) => e.id === syncEvt.id))
offlineSyncService.markEventsSynced([syncEvt.id])
assert.ok(!offlineSyncService.getPendingEvents().some((e) => e.id === syncEvt.id))
console.log('  ✅ [PASS] Offline sync queue lifecycle (enqueue -> getPending -> markSynced) verified')

console.log('\n==================================================================')
console.log('🏆 ALL PHASE 5 LEARNING UNIVERSE ASSERTIONS PASSED (100% SUCCESS)!')
console.log('==================================================================\n')
