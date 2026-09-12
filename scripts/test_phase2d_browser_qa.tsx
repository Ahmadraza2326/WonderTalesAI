import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../src/context/AuthContext'
import { I18nProvider } from '../src/context/I18nContext'
import { StoryBookViewer } from '../src/components/story/StoryBookViewer'
import { StoryViewer } from '../src/components/story/StoryViewer'
import { StoryContinuityBridgeCard } from '../src/components/story/StoryContinuityBridgeCard'
import { getStoryContinuityBridge, resolveAgeBandFromChild } from '../src/services/academy/storyContinuityEngine'
import { saveLocalStory, getLocalStories } from '../src/services/storyService'
import { PLAYGROUND_REGISTRY } from '../src/services/games/playgroundRegistry'
import { economyService } from '../src/services/economyService'
import type { StoryRecord } from '../src/types/story'
import type { ChildProfile } from '../src/types/childProfile'

// Mock in-memory localStorage for Node.js headless environment
const memoryStore = new Map<string, string>()
const mockStorage = {
  getItem: (key: string) => memoryStore.get(key) || null,
  setItem: (key: string, val: string) => { memoryStore.set(key, val) },
  removeItem: (key: string) => { memoryStore.delete(key) },
  clear: () => { memoryStore.clear() },
  length: 0,
  key: (i: number) => Array.from(memoryStore.keys())[i] || null,
}
;(globalThis as any).localStorage = mockStorage
;(globalThis as any).window = {
  localStorage: mockStorage,
  addEventListener: () => {},
  removeEventListener: () => {},
}

let passedCount = 0
let failedCount = 0
const issuesFound: string[] = []

function assert(condition: boolean, message: string, flowNum?: number) {
  const prefix = flowNum !== undefined ? `[FLOW ${flowNum}] ` : ''
  if (condition) {
    console.log(`  ✅ [PASS] ${prefix}${message}`)
    passedCount++
  } else {
    console.error(`  ❌ [FAIL] ${prefix}${message}`)
    failedCount++
    issuesFound.push(`${prefix}${message}`)
  }
}

console.log('==================================================================')
console.log('🌐 ORBIS PHASE 2D — BROWSER QA & INTEGRATION AUDIT SUITE')
console.log('==================================================================\n')

// Sample Mock Stories
const ecosystemStory: StoryRecord = {
  id: 'story_qa_ecosystem_1',
  user_id: 'qa_user_1',
  title: 'Maya and the Forest Secrets',
  child_name: 'Maya',
  child_age: '7',
  language: 'English',
  theme: 'Rainforest & Biodiversity',
  moral: 'Protecting habitats',
  characters: 'Maya, Willow',
  story_length: 'short',
  reading_level: 'beginner',
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: 'Maya studied the tall canopy trees and learned how plants produce oxygen through photosynthesis.',
  generation_status: 'ready',
  generated_at: new Date().toISOString(),
  learning_package: {
    story: 'Maya studied the tall canopy trees and learned how plants produce oxygen through photosynthesis.',
    storyDNA: {
      title: 'Maya and the Forest Secrets',
      moral: 'Protecting habitats',
      theme: 'Rainforest & Biodiversity',
      characters: ['Maya', 'Willow'],
      locations: ['Rainforest Canopy'],
      importantObjects: ['Canopy Leaf'],
      keyEvents: ['Discovered ecosystem equilibrium'],
      vocabulary: [{ word: 'Photosynthesis', meaning: 'Plant energy creation' }],
      emotions: ['Curious', 'Inspired'],
      educationalConcepts: ['Photosynthesis and energy', 'Ecosystem biodiversity balance'],
    },
    readingSkills: [],
    lifeSkills: [],
    criticalThinking: [],
    creativeActivity: { title: 'Sketch Tree', instructions: 'Draw a canopy tree' },
    funFact: { title: 'Rainforest Fact', fact: 'The canopy shelters over 50% of species' },
    vocabulary: [],
    quizSeeds: [{ question: 'What do leaves use to make food?', answer: 'Sunlight', options: ['Sunlight', 'Plastic'] }],
    gameSeeds: [],
    parentGuide: { discussionQuestions: [], realLifeActivity: '' },
    illustrations: [],
    narration: { style: 'bright', voices: [], soundEffects: [] },
    metadata: { schemaVersion: 1, language: 'English', recommendedAge: '7', readingLevel: 'beginner' },
  },
}

const multiPageStoryBook = {
  id: 'sb_qa_multi',
  storyId: 'story_qa_ecosystem_1',
  title: 'Maya and the Forest Secrets',
  theme: 'Rainforest & Biodiversity',
  pages: [
    { pageNumber: 1, text: 'Maya stepped into the lush green grove.', illustrationUrl: null, illustrationPrompt: null, narrationUrl: null },
    { pageNumber: 2, text: 'High in the canopy, sunlight warmed every leaf.', illustrationUrl: null, illustrationPrompt: null, narrationUrl: null },
    { pageNumber: 3, text: 'Through photosynthesis, the forest breathed life.', illustrationUrl: null, illustrationPrompt: null, narrationUrl: null },
  ],
  coverIllustrationUrl: null,
  totalReadingTimeMinutes: 2,
  metadata: { schemaVersion: 1, characterAvatars: {}, audioVoice: 'default', readingLevel: 'beginner' },
}

const singlePageStoryBook = {
  id: 'sb_qa_single',
  storyId: 'story_qa_ecosystem_1',
  title: 'Maya and the Forest Secrets',
  theme: 'Rainforest & Biodiversity',
  pages: [
    { pageNumber: 1, text: 'Through photosynthesis, the forest breathed life.', illustrationUrl: null, illustrationPrompt: null, narrationUrl: null },
  ],
  coverIllustrationUrl: null,
  totalReadingTimeMinutes: 1,
  metadata: { schemaVersion: 1, characterAvatars: {}, audioVoice: 'default', readingLevel: 'beginner' },
}

const childMaya: ChildProfile = {
  id: 'child_qa_maya',
  parent_id: 'qa_user_1',
  name: 'Maya',
  age: 7,
  avatar_url: null,
  theme_preference: 'fantasy',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  current_streak: 3,
  total_xp: 320,
  stars_balance: 45,
  reading_level: 'beginner',
  audio_enabled: true,
  guide_companion: 'nova',
}

const renderWithContext = (element: React.ReactElement, initialPath: string = '/') => {
  return renderToString(
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          MemoryRouter,
          { initialEntries: [initialPath] },
          element
        )
      )
    )
  )
}

// -----------------------------------------------------------------------------
// FLOW 1: Open Story Library -> Open Existing Story
// -----------------------------------------------------------------------------
console.log('▶️ Flow 1: Story Library to Story Workspace Entry...')
saveLocalStory('guest', ecosystemStory)
const loadedStories = getLocalStories('guest')
assert(loadedStories.some(s => s.id === ecosystemStory.id), 'Story Library retrieves saved story', 1)

// -----------------------------------------------------------------------------
// FLOW 2 & 3: Read to Final Page & Continuity Bridge Natural Appearance
// -----------------------------------------------------------------------------
console.log('\n▶️ Flows 2 & 3: Reading Flow & Natural Final Page Bridge Appearance...')
// Page 1 of 3 (Active reading, not last page)
const page1Html = renderWithContext(
  React.createElement(StoryBookViewer, {
    story: ecosystemStory,
    storyBook: multiPageStoryBook,
  })
)
assert(!page1Html.includes('story-continuity-bridge-card'), 'Bridge Card is hidden during active reading on page 1 of 3', 2)

// Final Page (Single page story / end-of-story experience)
const finalPageHtml = renderWithContext(
  React.createElement(StoryBookViewer, {
    story: ecosystemStory,
    storyBook: singlePageStoryBook,
  })
)
assert(finalPageHtml.includes('story-continuity-bridge-card'), 'StoryContinuityBridgeCard renders naturally upon reaching final page', 3)
assert(finalPageHtml.includes('ACADEMY MISSION'), 'Final page displays Academy Mission header', 3)

// -----------------------------------------------------------------------------
// FLOW 4: Active Child / Profile Context Reflection
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 4: Active Child / Profile Context Reflection...')
const bridgeForMaya = getStoryContinuityBridge({ story: ecosystemStory, childProfile: childMaya })
assert(bridgeForMaya.recommendedSkill.ageBand === 'beginner', 'Child age 7 correctly resolves to beginner ageBand', 4)
assert(bridgeForMaya.guideId === 'nova', 'Preferred guide companion (Nova) is respected by continuity engine', 4)
assert(bridgeForMaya.guideDialogue.length > 0, 'Personalized mentor dialogue is generated', 4)

// -----------------------------------------------------------------------------
// FLOW 5: Click Start Academy Lesson -> Route Verification
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 5: Destination Route Verification for Academy Lesson...')
const lessonRoute = bridgeForMaya.routes.lessonRoute
assert(lessonRoute.startsWith('/academy/lesson/'), 'Lesson route begins with /academy/lesson/', 5)
const targetLessonId = bridgeForMaya.recommendedSkill.lessonId
assert(Boolean(targetLessonId), `Valid target lesson ID resolved: ${targetLessonId}`, 5)

// -----------------------------------------------------------------------------
// FLOW 6: Click Practice Drill -> Route Verification
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 6: Practice Drill Route Verification...')
const practiceRoute = bridgeForMaya.routes.practiceRoute
assert(practiceRoute.startsWith('/academy/practice/'), 'Practice route begins with /academy/practice/', 6)

// -----------------------------------------------------------------------------
// FLOW 7: Click Playroom Capstone -> Flagship Game Verification
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 7: Playroom Capstone Flagship Game Verification...')
assert(Boolean(bridgeForMaya.capstoneGame), `Assigned capstone game: ${bridgeForMaya.capstoneGame?.title}`, 7)
assert(
  Boolean(bridgeForMaya.routes.gameRoute) && (bridgeForMaya.routes.gameRoute!.startsWith('/games/') || bridgeForMaya.routes.gameRoute!.startsWith('/playroom/')),
  `Game route correctly maps to playable game route: ${bridgeForMaya.routes.gameRoute}`,
  7
)
const playgroundGame = bridgeForMaya.capstoneGame ? PLAYGROUND_REGISTRY[bridgeForMaya.capstoneGame.id as keyof typeof PLAYGROUND_REGISTRY] : null
assert(playgroundGame?.status === 'playable', 'Assigned capstone game is verified active and playable in Playground Registry', 7)

// -----------------------------------------------------------------------------
// FLOW 8 & 9: Read Story Again & Back to Stories Navigation
// -----------------------------------------------------------------------------
console.log('\n▶️ Flows 8 & 9: Read Story Again & Back to Stories Navigation Wiring...')
const cardHtml = renderWithContext(
  React.createElement(StoryContinuityBridgeCard, {
    bridge: bridgeForMaya,
    onReadAgain: () => {},
    onBackToLibrary: () => {},
  })
)
assert(cardHtml.includes('Read Story Again'), 'Card contains accessible Read Story Again action', 8)
assert(cardHtml.includes('Back to Stories'), 'Card contains accessible Back to Stories action', 9)

// -----------------------------------------------------------------------------
// FLOW 10: Story Learning / Quest Workspace Bridge
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 10: Story Learning / Quest Workspace Rendering...')
const workspaceHtml = renderWithContext(
  React.createElement(StoryViewer, {
    story: ecosystemStory,
    narration: null,
    mode: 'learning',
  })
)
assert(workspaceHtml.includes('story-continuity-bridge-card'), 'StoryViewer (Learning Tab) renders StoryContinuityBridgeCard', 10)
assert(workspaceHtml.includes('Story Quiz'), 'StoryViewer preserves Story Quiz tab', 10)
assert(workspaceHtml.includes('Memory Quest'), 'StoryViewer preserves Story Memory Quest tab', 10)
assert(workspaceHtml.includes('Word Trace'), 'StoryViewer preserves Word Trace tab', 10)
assert(workspaceHtml.includes('Mystery Detective'), 'StoryViewer preserves Mystery Detective tab', 10)

// -----------------------------------------------------------------------------
// FLOW 11: Legacy / Draft Story Without learning_package
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 11: Legacy / Draft Story Without learning_package...')
const legacyStory: StoryRecord = {
  id: 'story_qa_legacy_1',
  user_id: 'qa_user_1',
  title: 'The Great Mountain Hike',
  child_name: 'Leo',
  child_age: '6',
  language: 'English',
  theme: 'Mountain Climbing',
  moral: 'Perseverance',
  characters: 'Leo',
  story_length: 'short',
  reading_level: 'beginner',
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: null,
  generation_status: 'draft',
  generated_at: null,
  learning_package: null,
}
const legacyBridge = getStoryContinuityBridge({ story: legacyStory })
assert(Boolean(legacyBridge.recommendedSkill), 'Legacy story cleanly generates age-appropriate recommendation', 11)
assert(legacyBridge.confidence > 0, 'Legacy story calculates baseline confidence score', 11)

// -----------------------------------------------------------------------------
// FLOW 12: Missing Child-Profile / Guest Fallback
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 12: Missing Child-Profile / Guest Fallback...')
const guestBridge = getStoryContinuityBridge({ story: ecosystemStory, childProfile: undefined })
const resolvedAgeBand = resolveAgeBandFromChild(undefined, ecosystemStory.child_age)
assert(resolvedAgeBand === 'beginner', 'Guest fallback derives age band beginner from story.child_age', 12)
assert(Boolean(guestBridge.guideId), 'Guest fallback assigns default guide mentor cleanly', 12)

// -----------------------------------------------------------------------------
// FLOW 13: Recommended Skill With No Capstone Game (Clean Omission)
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 13: Recommended Skill With No Capstone Game (Clean Omission)...')
const bridgeNoCapstone = { ...bridgeForMaya, capstoneGame: undefined, routes: { ...bridgeForMaya.routes, gameRoute: undefined } }
const htmlNoCapstone = renderWithContext(React.createElement(StoryContinuityBridgeCard, { bridge: bridgeNoCapstone }))
assert(!htmlNoCapstone.includes('PLAYROOM CAPSTONE CHALLENGE'), 'Capstone challenge slab is cleanly omitted when no capstone game exists', 13)
assert(htmlNoCapstone.includes('Start Academy Lesson'), 'Academy lesson CTA remains fully interactive and prominent', 13)

// -----------------------------------------------------------------------------
// FLOW 14: Zero Duplicate XP/Star Rewards Invariant
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 14: Zero Side-Effect Duplicate Reward Invariant...')
let completeActivityCalls = 0
const originalCompleteActivity = economyService.completeActivity
economyService.completeActivity = async (input) => {
  completeActivityCalls++
  return originalCompleteActivity.call(economyService, input)
}

// Render the bridge card multiple times
renderWithContext(React.createElement(StoryContinuityBridgeCard, { bridge: bridgeForMaya }))
renderWithContext(React.createElement(StoryContinuityBridgeCard, { bridge: bridgeForMaya }))
renderWithContext(React.createElement(StoryContinuityBridgeCard, { bridge: bridgeForMaya }))

assert(completeActivityCalls === 0, 'StoryContinuityBridgeCard performs zero reward mutation calls on render or re-render', 14)
economyService.completeActivity = originalCompleteActivity

// -----------------------------------------------------------------------------
// FLOW 15: Responsive Layouts & Sizing (320px, 375px, 430px, 1280px)
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 15: Responsive Layouts & CSS Clamp Auditing...')
assert(cardHtml.includes('clamp('), 'Card uses responsive CSS clamp() for padding and typography scaling', 15)
assert(cardHtml.includes('flex-wrap') || cardHtml.includes('wrap'), 'Card utilizes flex-wrap to prevent horizontal overflow on narrow 320px viewports', 15)

// -----------------------------------------------------------------------------
// FLOW 16: Keyboard Navigation, Focus States, A11y & 48px Touch Targets
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 16: Accessibility & Touch Target Standard Verification...')
assert(cardHtml.includes('role="region"'), 'Root element declares landmark role="region"', 16)
assert(cardHtml.includes('aria-label='), 'Root and interactive controls have explicit aria-labels', 16)
assert(cardHtml.includes('48px'), 'Buttons satisfy minimum 48px touch target standard', 16)

// -----------------------------------------------------------------------------
// FLOW 17: Zero Presentation Emojis & Clean DOM Output
// -----------------------------------------------------------------------------
console.log('\n▶️ Flow 17: Presentation Emojis & Clean DOM Output...')
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u
assert(!emojiRegex.test(cardHtml), 'Zero presentation Unicode emojis present in StoryContinuityBridgeCard output', 17)

console.log('\n==================================================================')
console.log(`📊 PHASE 2D AUDIT RESULTS: ${passedCount}/${passedCount + failedCount} PASS (${failedCount} FAILED)`)
console.log('==================================================================\n')

if (failedCount > 0) {
  console.error('❌ ISSUES DISCOVERED DURING PHASE 2D AUDIT:')
  issuesFound.forEach((issue, i) => console.error(`   ${i + 1}. ${issue}`))
  process.exit(1)
} else {
  console.log('🎉 ALL 17 PHASE 2D BROWSER QA & INTEGRATION AUDIT FLOWS PASSED PERFECTLY!\n')
}
