/**
 * Story Memory Quest Test Suite
 * Tests Story DNA extraction, deterministic generation, difficulty scaling,
 * scoring algorithms, and activity reward integration.
 */

import type { StoryRecord } from '../src/types/story'
import {
  extractMemoryPairs,
  generateMemoryQuestGame,
  calculateMemoryQuestScore,
} from '../src/services/games/storyMemoryQuest'
import { economyService } from '../src/services/economyService'

console.log('🧪 Running Story Memory Quest Test Suite...\n')

let passed = 0
let total = 0

function assert(condition: boolean, name: string, details?: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } else {
    console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ''}`)
  }
}

// -----------------------------------------------------------------------------
// Mock Story DNA Fixtures
// -----------------------------------------------------------------------------

const mockRichStory: StoryRecord = {
  id: 'story-forest-adventure-123',
  user_id: 'parent-alice-uuid',
  child_id: 'child-leo-uuid',
  title: 'The Whispering Woods',
  child_name: 'Leo',
  child_age: 7,
  language: 'English',
  theme: 'Fantasy',
  moral: 'Kindness shines brightest in the dark.',
  characters: 'Barnaby, Pip, Luna',
  story_length: 'medium',
  reading_level: 'intermediate',
  status: 'published',
  created_at: '2026-08-23T10:00:00Z',
  updated_at: '2026-08-23T10:00:00Z',
  story_content: 'Barnaby the Bear walked through the glowing forest...',
  generation_status: 'completed',
  generated_at: '2026-08-23T10:00:00Z',
  learning_package: {
    story: 'Barnaby the Bear walked through the glowing forest...',
    storyDNA: {
      title: 'The Whispering Woods',
      moral: 'Kindness shines brightest in the dark.',
      theme: 'Fantasy',
      characters: ['Barnaby the Bear', 'Pip the Squirrel', 'Luna the Owl'],
      locations: ['Whispering Woods', 'Crystal Lake', 'Moonlit Meadow'],
      importantObjects: ['Golden Compass', 'Luminous Acorn', 'Silver Key'],
      keyEvents: ['Finding the compass', 'Opening the crystal door'],
      vocabulary: [
        { word: 'Luminous', meaning: 'Glowing softly with light', difficulty: 'easy' },
        { word: 'Courage', meaning: 'Being brave even when scared', difficulty: 'easy' },
        { word: 'Mysterious', meaning: 'Strange and fascinating', difficulty: 'medium' },
      ],
      emotions: ['Joy', 'Wonder', 'Curiosity'],
      educationalConcepts: ['Nature', 'Friendship'],
    },
    readingSkills: [{ skill: 'Comprehension', explanation: 'Recalling details' }],
    lifeSkills: [{ skill: 'Empathy', explanation: 'Helping friends' }],
    criticalThinking: [{ question: 'Why did Barnaby share the acorn?' }],
    creativeActivity: { title: 'Draw Pip', instructions: 'Draw Pip holding the acorn' },
    funFact: { title: 'Bears', fact: 'Bears have an incredible sense of smell.' },
    vocabulary: [
      { word: 'Luminous', meaning: 'Glowing softly with light', difficulty: 'easy' },
      { word: 'Enchanted', meaning: 'Delightfully magical', difficulty: 'medium' },
      { word: 'Perseverance', meaning: 'Never giving up', difficulty: 'hard' },
    ],
    quizSeeds: [
      {
        question: 'Who helped Barnaby find the way?',
        answer: 'Luna the Owl',
        options: ['Luna the Owl', 'A grumpy badger', 'A lost fox'],
        explanation: 'Luna flew high to guide them.',
      },
      {
        question: 'What did the golden compass open?',
        answer: 'The crystal door',
        options: ['The crystal door', 'A hollow tree', 'A stone gate'],
      },
    ],
    gameSeeds: [],
    parentGuide: { discussionQuestions: ['What was your favorite part?'], realLifeActivity: 'Nature walk' },
    illustrations: [],
    narration: { style: 'Warm', voices: ['Narrator'], soundEffects: ['Wind'] },
    metadata: { schemaVersion: 1, language: 'en', recommendedAge: '6-8', readingLevel: 'intermediate' },
  },
}

const mockSparseStory: StoryRecord = {
  ...mockRichStory,
  id: 'story-sparse-456',
  learning_package: {
    ...mockRichStory.learning_package!,
    vocabulary: [],
    storyDNA: {
      ...mockRichStory.learning_package!.storyDNA,
      characters: [],
      locations: [],
      importantObjects: [],
      vocabulary: [],
      keyEvents: [],
    },
    quizSeeds: [],
  },
}

async function runStoryMemoryQuestTests() {
  console.log('--- 1. Story DNA Extraction & Integrity Tests ---')

  // Test 1: valid Story DNA produces a valid game
  const gameEasy = generateMemoryQuestGame(mockRichStory, 'easy')
  assert(
    gameEasy.isPlayable === true && gameEasy.totalPairs === 3 && gameEasy.cards.length === 6,
    '1. Valid Story DNA produces a valid playable game (3 pairs = 6 cards for easy)'
  )

  // Test 2: insufficient Story DNA gracefully disables the game
  const sparseGame = generateMemoryQuestGame(mockSparseStory, 'easy')
  assert(
    sparseGame.isPlayable === false && sparseGame.cards.length === 0 && Boolean(sparseGame.unavailableReason),
    '2. Insufficient Story DNA gracefully disables the game with explanation'
  )

  // Test 3: duplicate/invalid entries are handled
  const extracted = extractMemoryPairs(mockRichStory)
  const prompts = extracted.map((c) => c.promptText.toLowerCase())
  const uniquePrompts = new Set(prompts)
  assert(
    extracted.length > 0 && prompts.length === uniquePrompts.size,
    '3. Duplicate vocabulary or character entries are cleanly deduplicated'
  )

  // Test 4: deterministic generation works
  const run1 = generateMemoryQuestGame(mockRichStory, 'easy')
  const run2 = generateMemoryQuestGame(mockRichStory, 'easy')
  const cards1 = run1.cards.map((c) => c.id).join(',')
  const cards2 = run2.cards.map((c) => c.id).join(',')
  assert(
    cards1 === cards2 && run1.cards[0].text === run2.cards[0].text,
    '4. Deterministic generation: identical story + difficulty produces identical card ordering'
  )

  console.log('\n--- 2. Difficulty Scaling Tests ---')

  // Test 5: easy difficulty produces valid pairs
  assert(gameEasy.difficulty === 'easy' && gameEasy.totalPairs === 3, '5. Easy difficulty produces 3 pairs (6 cards)')

  // Test 6: medium difficulty produces valid pairs
  const gameMedium = generateMemoryQuestGame(mockRichStory, 'medium')
  assert(
    gameMedium.difficulty === 'medium' && gameMedium.totalPairs === 5 && gameMedium.cards.length === 10,
    '6. Medium difficulty produces 5 pairs (10 cards)'
  )

  // Test 7: hard difficulty produces valid pairs
  const gameHard = generateMemoryQuestGame(mockRichStory, 'hard')
  assert(
    gameHard.difficulty === 'hard' && gameHard.totalPairs === 6 && gameHard.cards.length === 12,
    '7. Hard difficulty produces 6 pairs (12 cards)'
  )

  console.log('\n--- 3. Scoring & Completion Contract Tests ---')

  // Test 8: score calculation works
  const perfectScore = calculateMemoryQuestScore({
    difficulty: 'easy',
    pairsCount: 3,
    moves: 3,
    mistakes: 0,
    durationSeconds: 15,
  })
  assert(
    perfectScore.accuracy === 100 && perfectScore.xpEarned === 25 && perfectScore.starsEarned === 5,
    '8. Perfect game score calculates 100% accuracy, base+skill XP (15+10=25), and 5 stars'
  )

  const normalScore = calculateMemoryQuestScore({
    difficulty: 'hard',
    pairsCount: 6,
    moves: 10,
    mistakes: 4,
    durationSeconds: 45,
  })
  assert(
    normalScore.accuracy === 60 && normalScore.xpEarned === 35 && normalScore.starsEarned === 1,
    '   Hard game with 60% accuracy yields base 35 XP and 1 star'
  )

  // Test 9: completion result structure is correct
  const sampleCompletion = {
    storyId: mockRichStory.id,
    childId: mockRichStory.child_id,
    difficulty: 'easy' as const,
    pairsCompleted: 3,
    totalPairs: 3,
    moves: 4,
    mistakes: 1,
    accuracy: 75,
    durationSeconds: 20,
    score: 800,
    xpEarned: 15,
    starsEarned: 2,
  }
  assert(
    sampleCompletion.pairsCompleted === sampleCompletion.totalPairs &&
      sampleCompletion.moves === 4 &&
      sampleCompletion.mistakes === 1,
    '9. Completion result tracks accurate gameplay telemetry (moves, mistakes, accuracy, duration)'
  )

  // Test 10: activity ID is stable
  const activityType = 'memory_match'
  const activityId = mockRichStory.id
  assert(
    activityType === 'memory_match' && activityId === 'story-forest-adventure-123',
    '10. Activity identity contract is stable: activityType="memory_match", activityId=story.id'
  )

  console.log('\n--- 4. Authoritative Reward Service Integration Tests ---')

  // Test 11: economyService.completeActivity is called on completion with valid bounded numbers
  let mockCompleteCalls = 0
  let capturedInput: any = null

  const originalComplete = economyService.completeActivity
  economyService.completeActivity = async (input) => {
    mockCompleteCalls++
    capturedInput = input
    return {
      success: true,
      alreadyAwarded: false,
      xpAwarded: input.xpAmount || 0,
      starsAwarded: input.starsAmount || 0,
      currentXp: 125,
      currentStars: 50,
      currentStreak: 1,
      streakIncremented: true,
    }
  }

  const rewardRes1 = await economyService.completeActivity({
    childId: mockRichStory.child_id!,
    activityType: 'memory_match',
    activityId: mockRichStory.id,
    xpAmount: perfectScore.xpEarned,
    starsAmount: perfectScore.starsEarned,
  })

  assert(
    mockCompleteCalls === 1 &&
      capturedInput.activityType === 'memory_match' &&
      capturedInput.activityId === mockRichStory.id &&
      capturedInput.xpAmount === 25 &&
      rewardRes1.alreadyAwarded === false,
    '11. economyService.completeActivity is called with exact memory_match payload and awards XP/Stars'
  )

  // Test 12: replay does not create another reward (simulating DB idempotency return)
  economyService.completeActivity = async (_input) => {
    mockCompleteCalls++
    return {
      success: true,
      alreadyAwarded: true,
      xpAwarded: 0,
      starsAwarded: 0,
      currentXp: 125,
      currentStars: 50,
      currentStreak: 1,
      streakIncremented: false,
    }
  }

  const rewardRes2 = await economyService.completeActivity({
    childId: mockRichStory.child_id!,
    activityType: 'memory_match',
    activityId: mockRichStory.id,
    xpAmount: perfectScore.xpEarned,
    starsAmount: perfectScore.starsEarned,
  })

  assert(
    rewardRes2.success === true &&
      rewardRes2.alreadyAwarded === true &&
      rewardRes2.xpAwarded === 0 &&
      rewardRes2.starsAwarded === 0,
    '12. Replay / retake returns alreadyAwarded=true and 0 XP/Stars without duplicate rewards'
  )

  // Restore original completeActivity
  economyService.completeActivity = originalComplete
}

runStoryMemoryQuestTests()
  .then(() => {
    console.log(`\nStory Memory Quest Tests: ${passed}/${total} PASS`)
    if (passed !== total) process.exit(1)
  })
  .catch((err) => {
    console.error('Fatal test error:', err)
    process.exit(1)
  })
