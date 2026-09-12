/**
 * ORBis Phase 2B — StoryContinuityBridgeCard Component Test Suite
 *
 * Verifies:
 * 1. Component renders cleanly to HTML string without runtime errors.
 * 2. Renders all key learning continuity sections (Reason, Guide, Academy, Capstone, Rewards).
 * 3. Zero Unicode presentation emojis in generated output.
 * 4. Safe fallback rendering when capstoneGame is absent.
 * 5. Button and touch target attributes meet accessibility criteria.
 */

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StoryContinuityBridgeCard } from '../src/components/story/StoryContinuityBridgeCard'
import { getStoryContinuityBridge } from '../src/services/academy/storyContinuityEngine'
import type { StoryRecord } from '../src/types/story'

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

console.log('==================================================================')
console.log('🧪 RUNNING STORY CONTINUITY BRIDGE CARD UI SUITE (PHASE 2B)')
console.log('==================================================================\n')

// 1. Create realistic story test payload
const testStory: StoryRecord = {
  id: 'story_bridge_card_test',
  user_id: 'user_1',
  title: 'The Great Balance Bazaar',
  child_name: 'Oliver',
  child_age: '8',
  language: 'English',
  theme: 'Apothecary Bazaar',
  moral: 'Precision & Sharing',
  characters: 'Oliver and Poly',
  story_length: 'short',
  reading_level: 'beginner',
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: 'Oliver poured half a beaker of star elixir and equal parts water to make the magical balance scale level.',
  generation_status: 'ready',
  generated_at: new Date().toISOString(),
  learning_package: {
    story: 'Oliver poured half a beaker of star elixir and equal parts water to make the magical balance scale level.',
    storyDNA: {
      title: 'The Great Balance Bazaar',
      moral: 'Precision & Sharing',
      theme: 'Apothecary Bazaar',
      characters: ['Oliver', 'Poly'],
      locations: ['Potion Workshop'],
      importantObjects: ['Brass Scales', 'Beakers'],
      keyEvents: ['Divided elixir into equal halves on balance scales'],
      vocabulary: [
        { word: 'Fraction', difficulty: 'easy', meaning: 'An equal part of a whole' },
        { word: 'Equilibrium', difficulty: 'hard', meaning: 'A state of balance' },
      ],
      emotions: ['Focused'],
      educationalConcepts: ['Equal fractions and halves', 'Balance scale mass measurement', 'Equal division parts'],
    },
    readingSkills: [],
    lifeSkills: [],
    criticalThinking: [],
    creativeActivity: { title: 'Draw', instructions: 'Draw balance' },
    funFact: { title: 'Fact', fact: 'Scales were invented thousands of years ago' },
    vocabulary: [],
    quizSeeds: [],
    gameSeeds: [],
    parentGuide: { discussionQuestions: [], realLifeActivity: '' },
    illustrations: [],
    narration: { style: 'bright', voices: [], soundEffects: [] },
    metadata: { schemaVersion: 1, language: 'English', recommendedAge: '8', readingLevel: 'beginner' },
  },
}

const bridgeResult = getStoryContinuityBridge({ story: testStory })

// 2. Render Component with full callbacks
console.log('▶️ 1. Testing SSR Rendering & DOM Generation...')
const renderedHtml = renderToString(
  React.createElement(StoryContinuityBridgeCard, {
    bridge: bridgeResult,
    onLaunchLesson: () => {},
    onLaunchPractice: () => {},
    onLaunchGame: () => {},
    onBackToLibrary: () => {},
    onReadAgain: () => {},
  })
)

assert(Boolean(renderedHtml && renderedHtml.length > 500), 'Bridge Card rendered non-empty HTML structure')
assert(renderedHtml.includes('story-continuity-bridge-card'), 'Contains root CSS class')
const encodedSkillTitle = bridgeResult.recommendedSkill.title.replace(/&/g, '&amp;')
assert(
  renderedHtml.includes(bridgeResult.recommendedSkill.title) || renderedHtml.includes(encodedSkillTitle),
  'Contains recommended skill title'
)
assert(renderedHtml.includes(bridgeResult.matchReasonLabel), 'Contains match reason badge')
assert(renderedHtml.includes(String(bridgeResult.rewards.lessonXp)), 'Displays lesson XP reward')
assert(renderedHtml.includes(String(bridgeResult.rewards.lessonStars)), 'Displays lesson Stars reward')
assert(renderedHtml.includes('Start Academy Lesson'), 'Contains primary Academy action CTA')

// 3. Playroom Capstone Rendering
console.log('\n▶️ 2. Testing Playroom Capstone Triad Slab...')
if (bridgeResult.capstoneGame) {
  assert(renderedHtml.includes(bridgeResult.capstoneGame.title), 'Contains capstone game title')
  assert(renderedHtml.includes('Play Station'), 'Contains Capstone game action button')
} else {
  console.log('  ℹ️ Capstone game not present in this test case')
}

// 4. Fallback rendering when no capstoneGame exists
console.log('\n▶️ 3. Testing Safe Rendering without Capstone Game...')
const bridgeWithoutCapstone = {
  ...bridgeResult,
  capstoneGame: undefined,
  routes: {
    lessonRoute: bridgeResult.routes.lessonRoute,
    practiceRoute: bridgeResult.routes.practiceRoute,
  },
}

const renderedWithoutCapstoneHtml = renderToString(
  React.createElement(StoryContinuityBridgeCard, {
    bridge: bridgeWithoutCapstone,
    onLaunchLesson: () => {},
  })
)

assert(
  !renderedWithoutCapstoneHtml.includes('PLAYROOM CAPSTONE CHALLENGE'),
  'Cleanly omits capstone slab when no capstone game is assigned'
)
assert(
  renderedWithoutCapstoneHtml.includes(bridgeResult.recommendedSkill.title) || renderedWithoutCapstoneHtml.includes(encodedSkillTitle),
  'Preserves primary Academy recommendation intact'
)

// 5. Zero Emoji Audit in Rendered HTML
console.log('\n▶️ 4. Auditing for Zero Presentation Unicode Emojis in Rendered Output...')
// Match common emoji ranges
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u
const emojiMatches = renderedHtml.match(emojiRegex)

assert(emojiMatches === null, 'Rendered StoryContinuityBridgeCard output contains ZERO presentation Unicode emojis')

// 6. Accessibility & Touch Targets
console.log('\n▶️ 5. Auditing Accessibility & Touch Targets...')
assert(renderedHtml.includes('aria-label='), 'Contains aria-labels on interactive regions and buttons')
assert(renderedHtml.includes('min-height:48px') || renderedHtml.includes('minHeight'), 'Configured with minimum 48px touch targets')

console.log('\n==================================================================')
console.log(`📊 PHASE 2B TEST RESULTS: ${passedCount}/${passedCount + failedCount} PASS (${failedCount} FAILED)`)
console.log('==================================================================\n')

if (failedCount > 0) {
  process.exit(1)
} else {
  console.log('🎉 ALL PHASE 2B STORY CONTINUITY BRIDGE CARD TESTS PASSED!\n')
}
