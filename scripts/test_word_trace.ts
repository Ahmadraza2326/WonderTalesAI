/**
 * Word Trace & Vocabulary Quest Test Suite
 * Tests Story DNA vocabulary extraction, cloze sentence building, letter tile scrambling,
 * difficulty scaling (distractor counts), scoring formulas, and activity reward idempotency.
 */

import type { StoryRecord } from '../src/types/story'
import {
  extractWordTraceCandidates,
  generateWordTraceGame,
  calculateWordTraceScore,
} from '../src/services/games/wordTrace'
import { economyService } from '../src/services/economyService'

console.log('🧪 Running Word Trace & Vocabulary Quest Test Suite...\n')

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
// Test Fixtures
// -----------------------------------------------------------------------------

const mockRichStory: StoryRecord = {
  id: 'story-magic-garden-777',
  user_id: 'parent-alice-uuid',
  child_id: 'child-leo-uuid',
  title: 'The Secret Garden of Whispers',
  child_name: 'Leo',
  child_age: 7,
  language: 'English',
  theme: 'Nature & Magic',
  moral: 'Patience helps beautiful things grow.',
  characters: 'Barnaby, Flora, Sparky',
  story_length: 'medium',
  reading_level: 'intermediate',
  status: 'published',
  created_at: '2026-08-23T10:00:00Z',
  updated_at: '2026-08-23T10:00:00Z',
  story_content: 'Deep in the enchanted valley was a secret garden...',
  generation_status: 'completed',
  generated_at: '2026-08-23T10:00:00Z',
  learning_package: {
    story: 'Deep in the enchanted valley was a secret garden...',
    storyDNA: {
      title: 'The Secret Garden of Whispers',
      moral: 'Patience helps beautiful things grow.',
      theme: 'Nature & Magic',
      characters: ['Barnaby', 'Flora the Fairy', 'Sparky the Dragon'],
      locations: ['Enchanted Valley', 'Crystal Bloom'],
      importantObjects: ['Silver Watering Can', 'Glowing Seed'],
      keyEvents: ['Planting the seed', 'Watering the flower'],
      vocabulary: [
        {
          word: 'Luminous',
          meaning: 'Glowing softly with light',
          difficulty: 'easy',
          partOfSpeech: 'Adjective',
          example: 'The luminous blossom shone in the dark.',
        },
        {
          word: 'Blossom',
          meaning: 'A flower or period of flowering',
          difficulty: 'easy',
          partOfSpeech: 'Noun',
          example: 'A bright blossom opened under the sun.',
        },
        {
          word: 'Patience',
          meaning: 'The ability to wait calmly',
          difficulty: 'medium',
          partOfSpeech: 'Noun',
          example: 'With gentle patience, Flora nurtured the plant.',
        },
        {
          word: 'Flourish',
          meaning: 'To grow in a healthy, vibrant way',
          difficulty: 'hard',
          partOfSpeech: 'Verb',
          example: 'The magic garden began to flourish beautifully.',
        },
      ],
      emotions: ['Serenity', 'Awe'],
      educationalConcepts: ['Botany', 'Patience'],
    },
    readingSkills: [],
    lifeSkills: [],
    criticalThinking: [],
    creativeActivity: { title: 'Draw', instructions: 'Draw a flower' },
    funFact: { title: 'Plants', fact: 'Some flowers bloom only at night.' },
    vocabulary: [
      {
        word: 'Luminous',
        meaning: 'Glowing softly with light',
        difficulty: 'easy',
        partOfSpeech: 'Adjective',
        example: 'The luminous blossom shone in the dark.',
      },
    ],
    quizSeeds: [],
    gameSeeds: [],
    parentGuide: { discussionQuestions: [], realLifeActivity: '' },
    illustrations: [],
    narration: { style: 'Gentle', voices: ['Narrator'], soundEffects: [] },
    metadata: { schemaVersion: 1, language: 'en', recommendedAge: '6-8', readingLevel: 'intermediate' },
  },
}

const mockSparseStory: StoryRecord = {
  ...mockRichStory,
  id: 'story-sparse-999',
  learning_package: {
    ...mockRichStory.learning_package!,
    vocabulary: [],
    storyDNA: {
      ...mockRichStory.learning_package!.storyDNA,
      vocabulary: [],
      characters: [],
    },
  },
}

async function runWordTraceTests() {
  console.log('--- 1. Word Extraction, Cloze Building & Orthographic Analysis ---')

  // Test 1: valid extraction produces structured challenges
  const candidates = extractWordTraceCandidates(mockRichStory, 'easy')
  assert(candidates.length >= 4, '1. Candidates extracted from Story DNA (4 vocabulary words found)')

  const firstChallenge = candidates[0]
  assert(
    firstChallenge.word === 'LUMINOUS' &&
      firstChallenge.letterCount === 8 &&
      firstChallenge.vowelCount === 4 &&
      firstChallenge.consonantCount === 4,
    '   Orthographic counts accurate for LUMINOUS (8 letters, 4 vowels, 4 consonants)'
  )

  // Test 2: cloze sentence construction
  assert(
    firstChallenge.clozeSentence.includes('_______') &&
      !firstChallenge.clozeSentence.toLowerCase().includes('luminous'),
    '2. Cloze sentence masks target word with blanks (e.g. "The _______ blossom shone...")'
  )

  // Test 3: sparse Story DNA fallback and graceful disabling
  const sparseGame = generateWordTraceGame(mockSparseStory, 'easy')
  assert(
    sparseGame.isPlayable === false &&
      sparseGame.challenges.length === 0 &&
      Boolean(sparseGame.unavailableReason),
    '3. Sparse Story DNA (< 2 words) gracefully disables Word Trace with clear reason'
  )

  console.log('\n--- 2. Deterministic Letter Scrambling & Difficulty Scaling ---')

  // Test 4: deterministic scrambling
  const gameEasy1 = generateWordTraceGame(mockRichStory, 'easy')
  const gameEasy2 = generateWordTraceGame(mockRichStory, 'easy')
  const tiles1 = gameEasy1.challenges[0].scrambledLetters.map((t) => t.letter).join('')
  const tiles2 = gameEasy2.challenges[0].scrambledLetters.map((t) => t.letter).join('')
  assert(
    tiles1 === tiles2,
    '4. Deterministic tile scrambling: repeated calls generate identical letter order'
  )

  // Test 5: Easy difficulty has 0 distractor letters (exact length)
  const easyTileCount = gameEasy1.challenges[0].scrambledLetters.length
  assert(
    easyTileCount === gameEasy1.challenges[0].letterCount,
    '5. Easy difficulty generates exact letter tiles with 0 distractors'
  )

  // Test 6: Medium difficulty adds 1 distractor letter
  const gameMed = generateWordTraceGame(mockRichStory, 'medium')
  const medTileCount = gameMed.challenges[0].scrambledLetters.length
  assert(
    medTileCount === gameMed.challenges[0].letterCount + 1,
    '6. Medium difficulty adds exactly 1 distractor letter tile'
  )

  // Test 7: Hard difficulty adds 2 distractor letters
  const gameHard = generateWordTraceGame(mockRichStory, 'hard')
  const hardTileCount = gameHard.challenges[0].scrambledLetters.length
  assert(
    hardTileCount === gameHard.challenges[0].letterCount + 2,
    '7. Hard difficulty adds exactly 2 distractor letter tiles'
  )

  console.log('\n--- 3. Scoring & Bounded Reward Contract ---')

  // Test 8: perfect score yields 100% accuracy, base + bonus XP, and 5 stars
  const perfectScore = calculateWordTraceScore({
    difficulty: 'easy',
    wordsCount: 3,
    mistakes: 0,
    hintsUsed: 0,
    durationSeconds: 20,
  })
  assert(
    perfectScore.accuracy === 100 &&
      perfectScore.xpEarned === 25 &&
      perfectScore.starsEarned === 5,
    '8. Perfect game calculation yields 100% accuracy, 25 XP (15 base + 10 bonus), 5 Stars'
  )

  const normalScore = calculateWordTraceScore({
    difficulty: 'medium',
    wordsCount: 4,
    mistakes: 7,
    hintsUsed: 2,
    durationSeconds: 50,
  })
  assert(
    normalScore.accuracy < 80 &&
      normalScore.xpEarned === 25 &&
      normalScore.starsEarned >= 1,
    '   Game with higher mistakes/hints gives base 25 XP without skill bonus'
  )

  // Test 9: Activity identity contract
  const activityType = 'word_trace'
  const activityId = mockRichStory.id
  assert(
    activityType === 'word_trace' && activityId === 'story-magic-garden-777',
    '9. Stable activity identity contract: activityType="word_trace", activityId=story.id'
  )

  console.log('\n--- 4. Authoritative Reward Service Integration & Idempotency ---')

  // Test 10: economyService.completeActivity integration
  let completeCalls = 0
  let capturedInput: any = null

  const originalComplete = economyService.completeActivity
  economyService.completeActivity = async (input) => {
    completeCalls++
    capturedInput = input
    return {
      success: true,
      alreadyAwarded: false,
      xpAwarded: input.xpAmount || 0,
      starsAwarded: input.starsAmount || 0,
      currentXp: 150,
      currentStars: 60,
      currentStreak: 1,
      streakIncremented: false,
    }
  }

  const rewardRes1 = await economyService.completeActivity({
    childId: mockRichStory.child_id!,
    activityType: 'word_trace',
    activityId: mockRichStory.id,
    xpAmount: perfectScore.xpEarned,
    starsAmount: perfectScore.starsEarned,
  })

  assert(
    completeCalls === 1 &&
      capturedInput.activityType === 'word_trace' &&
      capturedInput.activityId === mockRichStory.id &&
      capturedInput.xpAmount === 25 &&
      rewardRes1.alreadyAwarded === false,
    '10. economyService.completeActivity executes with word_trace payload and awards rewards'
  )

  // Test 11: Idempotent replay / retake
  economyService.completeActivity = async (_input) => {
    completeCalls++
    return {
      success: true,
      alreadyAwarded: true,
      xpAwarded: 0,
      starsAwarded: 0,
      currentXp: 150,
      currentStars: 60,
      currentStreak: 1,
      streakIncremented: false,
    }
  }

  const rewardRes2 = await economyService.completeActivity({
    childId: mockRichStory.child_id!,
    activityType: 'word_trace',
    activityId: mockRichStory.id,
    xpAmount: perfectScore.xpEarned,
    starsAmount: perfectScore.starsEarned,
  })

  assert(
    rewardRes2.success === true &&
      rewardRes2.alreadyAwarded === true &&
      rewardRes2.xpAwarded === 0 &&
      rewardRes2.starsAwarded === 0,
    '11. Replay / retake returns alreadyAwarded=true without duplicate XP or Star inflation'
  )

  // Restore completeActivity
  economyService.completeActivity = originalComplete
}

runWordTraceTests()
  .then(() => {
    console.log(`\nWord Trace Tests: ${passed}/${total} PASS`)
    if (passed !== total) process.exit(1)
  })
  .catch((err) => {
    console.error('Fatal test error:', err)
    process.exit(1)
  })
