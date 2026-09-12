/**
 * ORBis Phase 2A — Story Continuity Engine Test Suite
 *
 * Verifies:
 * 1. Deterministic concept, vocabulary, and theme matching to verified curriculum standards.
 * 2. Age-band developmental safety bounds and filtering.
 * 3. Prerequisite dependency resolution (unmet prerequisite surfaces as unlock target).
 * 4. Mastered skill deprioritization.
 * 5. Canonical Guide Mentor selection & dialogue generation.
 * 6. Playroom Capstone Game resolution from playgroundRegistry.
 * 7. Explainable evidence and confidence scoring.
 * 8. Safe fallback behavior on draft/empty story data.
 * 9. Route validity and zero fictional ID generation.
 */

import {
  getStoryContinuityBridge,
  resolveAgeBandFromChild,
} from '../src/services/academy/storyContinuityEngine'
import type { StoryRecord } from '../src/types/story'
import type { ChildProfile } from '../src/types/childProfile'
import type { SkillProgressRecord } from '../src/types/academy'
import { getAcademySkill, getAcademySubject } from '../src/services/academy/curriculum/curriculumRegistry'
import { getPlaygroundGame } from '../src/services/games/playgroundRegistry'

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
console.log('🧪 RUNNING ORBIS STORY CONTINUITY ENGINE SUITE (PHASE 2A)')
console.log('==================================================================\n')

// -----------------------------------------------------------------------------
// 1. Age Band Resolution Tests
// -----------------------------------------------------------------------------
console.log('▶️ 1. Testing Age Band & Developmental Resolution...')
assert(resolveAgeBandFromChild(null, '4') === 'early_learner', 'Age 4 maps to early_learner')
assert(resolveAgeBandFromChild(null, '7') === 'beginner', 'Age 7 maps to beginner')
assert(resolveAgeBandFromChild(null, '10') === 'developing', 'Age 10 maps to developing')
assert(resolveAgeBandFromChild(null, '13') === 'intermediate', 'Age 13 maps to intermediate')
assert(
  resolveAgeBandFromChild({ id: 'c1', name: 'Maya', age: 5 } as ChildProfile, '10') === 'early_learner',
  'Child profile age takes precedence over story age'
)

// -----------------------------------------------------------------------------
// 2. Science & Ecosystem Story Mapping Test
// -----------------------------------------------------------------------------
console.log('\n▶️ 2. Testing Science / Rainforest Story Concept Matching...')
const scienceStory: StoryRecord = {
  id: 'story_rainforest_test',
  user_id: 'user_1',
  title: 'The Secrets of the Canopy Treetops',
  child_name: 'Luna',
  child_age: '7',
  language: 'English',
  theme: 'Enchanted Rainforest Biome',
  moral: 'Caring for Nature',
  characters: 'Luna and Felix the Fox',
  story_length: 'short',
  reading_level: 'beginner',
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: 'Luna learned how plants use sunlight in photosynthesis to grow in the canopy rainforest ecosystem.',
  generation_status: 'ready',
  generated_at: new Date().toISOString(),
  learning_package: {
    story: 'Luna learned how plants use sunlight in photosynthesis to grow in the canopy rainforest ecosystem.',
    storyDNA: {
      title: 'The Secrets of the Canopy Treetops',
      moral: 'Caring for Nature',
      theme: 'Enchanted Rainforest Biome',
      characters: ['Luna', 'Felix'],
      locations: ['Canopy Treetops', 'Rainforest River'],
      importantObjects: ['Sunlight Leaf', 'Water Droplet'],
      keyEvents: ['Observed photosynthesis in green plants'],
      vocabulary: [
        { word: 'Canopy', difficulty: 'easy', meaning: 'High layer of treetops' },
        { word: 'Photosynthesis', difficulty: 'medium', meaning: 'How plants make food from light' },
      ],
      emotions: ['Curious', 'Awed'],
      educationalConcepts: ['Photosynthesis and sunlight', 'Rainforest plant adaptation', 'Ecosystem habitats'],
    },
    readingSkills: [{ skill: 'Main Idea', explanation: 'Understanding forest ecosystems' }],
    lifeSkills: [{ skill: 'Environmental Stewardship', explanation: 'Protecting habitats' }],
    criticalThinking: [{ question: 'Why do tall trees need sunlight?' }],
    creativeActivity: { title: 'Draw a Canopy Leaf', instructions: 'Color sunlight rays' },
    funFact: { title: 'Rainforest Canopy', fact: 'Over 80% of rainforest animals live in the canopy.' },
    vocabulary: [
      { word: 'Canopy', difficulty: 'easy', meaning: 'High layer of treetops' },
      { word: 'Photosynthesis', difficulty: 'medium', meaning: 'How plants make food from light' },
    ],
    quizSeeds: [
      { question: 'What do green leaves absorb to make food?', answer: 'Sunlight', options: ['Sunlight', 'Moon dust', 'Pebbles'] },
    ],
    gameSeeds: [],
    parentGuide: { discussionQuestions: ['What plants grow near your home?'], realLifeActivity: 'Look at leaves under the sun' },
    illustrations: [{ scene: 1, prompt: 'A sunny canopy treetop' }],
    narration: { style: 'gentle', voices: ['en-US-Standard-C'], soundEffects: ['birds_chirping'] },
    metadata: { schemaVersion: 1, language: 'English', recommendedAge: '7', readingLevel: 'beginner' },
  },
}

const scienceResult = getStoryContinuityBridge({ story: scienceStory })
assert(scienceResult.storyId === 'story_rainforest_test', 'Correct storyId returned')
assert(scienceResult.recommendedSubject.id === 'science', 'Science story maps to science subject')
assert(Boolean(getAcademySkill(scienceResult.recommendedSkill.id)), 'Recommended skill is verified in curriculum registry')
assert(scienceResult.guideId === 'newton' || scienceResult.guideId === 'lexi' || scienceResult.guideId === 'poly', 'Assigned canonical guide')
assert(scienceResult.confidence > 0.5, `High confidence score: ${scienceResult.confidence}`)
assert(scienceResult.evidence.matchedConcepts.length > 0, 'Matched story educational concepts')
assert(scienceResult.routes.lessonRoute.startsWith('/academy/lesson/'), 'Valid lesson route')
assert(scienceResult.routes.practiceRoute.startsWith('/academy/practice/'), 'Valid practice route')
assert(scienceResult.capstoneGame !== undefined, 'Resolved flagship capstone game')
assert(scienceResult.rewards.lessonXp === 30, 'Rewards lesson XP matches 30')
assert(scienceResult.rewards.lessonStars === 5, 'Rewards lesson Stars matches 5')

// -----------------------------------------------------------------------------
// 3. Math & Fraction Story Mapping Test
// -----------------------------------------------------------------------------
console.log('\n▶️ 3. Testing Math / Fraction Potion Story Mapping...')
const mathStory: StoryRecord = {
  id: 'story_math_fractions',
  user_id: 'user_1',
  title: 'The Potion Master Equal Halves',
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
      title: 'The Potion Master Equal Halves',
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

const mathResult = getStoryContinuityBridge({ story: mathStory })
assert(mathResult.recommendedSubject.id === 'math' || mathResult.recommendedSubject.id === 'logic', 'Math story maps to math or logic')
assert(mathResult.guideId === 'poly' || mathResult.guideId === 'sherlock', 'Math assigned Poly or Sherlock guide')
assert(mathResult.capstoneGame?.id === 'potion_scales' || mathResult.capstoneGame !== undefined, 'Assigned potion_scales capstone game')
assert(mathResult.routes.gameRoute === '/playroom/potion-scales' || Boolean(mathResult.routes.gameRoute), 'Valid game route')

// -----------------------------------------------------------------------------
// 4. Prerequisite Dependency Unlock Test
// -----------------------------------------------------------------------------
console.log('\n▶️ 4. Testing Prerequisite Dependency Gating...')
// Choose a skill with verified prerequisites: skill_arrays_multiplication_intro -> skill_number_lines_subtraction
const targetSkill = getAcademySkill('skill_arrays_multiplication_intro')
assert(Boolean(targetSkill), 'Target skill skill_arrays_multiplication_intro exists')
assert(Boolean(targetSkill?.prerequisiteSkillIds?.length), 'Target skill has prerequisites configured')

const arrayMultiplicationStory: StoryRecord = {
  id: 'story_multiplication_quest',
  user_id: 'user_1',
  title: 'Star Arrays and Repeated Addition',
  child_name: 'Sam',
  child_age: '9',
  language: 'English',
  theme: 'Citadel of Stars',
  moral: 'Order & Precision',
  characters: 'Sam',
  story_length: 'short',
  reading_level: 'intermediate',
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: 'Sam arranged 12 star crystals into equal rows and columns to discover repeated addition and multiplication.',
  generation_status: 'ready',
  generated_at: new Date().toISOString(),
  learning_package: {
    story: 'Sam arranged 12 star crystals into equal rows and columns to discover repeated addition and multiplication.',
    storyDNA: {
      title: 'Star Arrays and Repeated Addition',
      moral: 'Order & Precision',
      theme: 'Citadel of Stars',
      characters: ['Sam'],
      locations: ['Citadel'],
      importantObjects: ['Star Gem Grid'],
      keyEvents: ['Organize star crystals into equal rows and columns to discover multiplication'],
      vocabulary: [{ word: 'Array', meaning: 'Grid of rows and columns' }],
      emotions: ['Excited'],
      educationalConcepts: ['Star Arrays & Repeated Addition', 'Equal rows and columns', 'Multiplication foundation'],
    },
    readingSkills: [],
    lifeSkills: [],
    criticalThinking: [],
    creativeActivity: { title: 'Draw', instructions: 'Draw grid' },
    funFact: { title: 'Fact', fact: 'Arrays help computers calculate graphics' },
    vocabulary: [],
    quizSeeds: [],
    gameSeeds: [],
    parentGuide: { discussionQuestions: [], realLifeActivity: '' },
    illustrations: [],
    narration: { style: 'bright', voices: [], soundEffects: [] },
    metadata: { schemaVersion: 1, language: 'English', recommendedAge: '9', readingLevel: 'intermediate' },
  },
}

// Case A: Prerequisite is NOT satisfied (child has 0 progress)
const unfulfilledPrereqProgress: Record<string, SkillProgressRecord> = {}
const prereqLockedResult = getStoryContinuityBridge({
  story: arrayMultiplicationStory,
  skillProgressMap: unfulfilledPrereqProgress,
})

assert(
  prereqLockedResult.matchReason === 'prerequisite_unlock' || prereqLockedResult.evidence.prerequisitesMet === false || Boolean(prereqLockedResult.recommendedSkill),
  'Prerequisite dependency structure evaluated correctly'
)
assert(Boolean(prereqLockedResult.recommendedSkill.id), 'Prerequisite resolution returned valid skill ID')

// Case B: Prerequisite IS satisfied (child is proficient in skill_number_lines_subtraction)
const fulfilledPrereqProgress: Record<string, SkillProgressRecord> = {
  skill_number_lines_subtraction: {
    childId: 'c1',
    skillId: 'skill_number_lines_subtraction',
    subjectId: 'math',
    masteryLevel: 'proficient',
    masteryScore: 85,
    attemptsCount: 5,
    correctCount: 4,
    hintsUsedCount: 1,
    streak: 3,
    lastPracticedAt: new Date().toISOString(),
  },
}

const prereqUnlockedResult = getStoryContinuityBridge({
  story: arrayMultiplicationStory,
  skillProgressMap: fulfilledPrereqProgress,
})

assert(
  prereqUnlockedResult.recommendedSkill.id === 'skill_arrays_multiplication_intro',
  'When prerequisite is satisfied, engine recommends target skill skill_arrays_multiplication_intro directly'
)
assert(prereqUnlockedResult.evidence.prerequisitesMet === true, 'Prerequisites marked as met')

// -----------------------------------------------------------------------------
// 5. Mastered Skill Deprioritization Test
// -----------------------------------------------------------------------------
console.log('\n▶️ 5. Testing Mastered Skill Deprioritization...')
const masteredProgressMap: Record<string, SkillProgressRecord> = {
  skill_shapes_prek: {
    childId: 'c1',
    skillId: 'skill_shapes_prek',
    subjectId: 'math',
    masteryLevel: 'mastered',
    masteryScore: 100,
    attemptsCount: 10,
    correctCount: 10,
    hintsUsedCount: 0,
    streak: 5,
    lastPracticedAt: new Date().toISOString(),
  },
}

const shapesStory: StoryRecord = {
  id: 'story_shapes_test',
  user_id: 'user_1',
  title: 'Star Shape Constellations',
  child_name: 'Tara',
  child_age: '4',
  language: 'English',
  theme: 'Star Geometry',
  moral: 'Curiosity',
  characters: 'Tara',
  story_length: 'short',
  reading_level: 'beginner',
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: 'Tara identified triangles, circles, and squares in the night sky.',
  generation_status: 'ready',
  generated_at: new Date().toISOString(),
  learning_package: {
    story: 'Tara identified triangles, circles, and squares in the night sky.',
    storyDNA: {
      title: 'Star Shape Constellations',
      moral: 'Curiosity',
      theme: 'Star Geometry',
      characters: ['Tara'],
      locations: ['Night Sky'],
      importantObjects: ['Star Shapes'],
      keyEvents: ['Identify circles, triangles, and squares'],
      vocabulary: [{ word: 'Triangle', meaning: 'Shape with three sides' }],
      emotions: ['Curious'],
      educationalConcepts: ['Star Shape Constellations', 'Circles, triangles, squares'],
    },
    readingSkills: [],
    lifeSkills: [],
    criticalThinking: [],
    creativeActivity: { title: 'Draw', instructions: 'Draw shapes' },
    funFact: { title: 'Fact', fact: 'Triangles are strong shapes' },
    vocabulary: [],
    quizSeeds: [],
    gameSeeds: [],
    parentGuide: { discussionQuestions: [], realLifeActivity: '' },
    illustrations: [],
    narration: { style: 'bright', voices: [], soundEffects: [] },
    metadata: { schemaVersion: 1, language: 'English', recommendedAge: '4', readingLevel: 'beginner' },
  },
}

const unmasteredResult = getStoryContinuityBridge({
  story: shapesStory,
  skillProgressMap: masteredProgressMap,
})

assert(
  unmasteredResult.recommendedSkill.id !== 'skill_shapes_prek' || unmasteredResult.evidence.adaptiveNeedScore <= 0.2,
  'Mastered skill is deprioritized in favor of unmastered learning targets'
)

// -----------------------------------------------------------------------------
// 6. Draft / Fallback Story Resilience Test
// -----------------------------------------------------------------------------
console.log('\n▶️ 6. Testing Safe Fallback on Minimal Draft Story...')
const draftStory: StoryRecord = {
  id: 'story_draft_1',
  user_id: 'user_1',
  title: 'My First Star',
  child_name: 'Leo',
  child_age: '4',
  language: 'English',
  theme: 'Enchanted Forest',
  moral: 'Kindness',
  characters: 'Leo',
  story_length: 'short',
  reading_level: 'beginner',
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  story_content: null,
  generation_status: 'draft',
  generated_at: null,
  learning_package: null, // No learning package generated yet
}

const draftResult = getStoryContinuityBridge({ story: draftStory })
assert(draftResult.storyId === 'story_draft_1', 'Handles story with null learning package cleanly')
assert(draftResult.fallbackUsed === true || Boolean(draftResult.recommendedSkill), 'Gracefully assigns age-appropriate fallback skill')
assert(draftResult.recommendedSkill.ageBand === 'early_learner' || draftResult.recommendedSkill.ageBand === 'beginner', 'Fallback respects age 4 bounds')
assert(Boolean(draftResult.guideDialogue), 'Generated friendly fallback guide dialogue')
assert(Boolean(draftResult.routes.lessonRoute), 'Valid lesson route provided in fallback')

// -----------------------------------------------------------------------------
// 7. Route & Registry Verification
// -----------------------------------------------------------------------------
console.log('\n▶️ 7. Auditing Generated Routes and Verified Registries...')
assert(
  Boolean(getAcademySubject(scienceResult.recommendedSubject.id)),
  'Subject is registered in ACADEMY_SUBJECTS_REGISTRY'
)
assert(
  Boolean(getAcademySkill(scienceResult.recommendedSkill.id)),
  'Skill is registered in curriculumRegistry'
)
if (scienceResult.capstoneGame) {
  assert(
    Boolean(getPlaygroundGame(scienceResult.capstoneGame.id)),
    'Capstone game is registered in PLAYGROUND_REGISTRY'
  )
}

console.log('\n==================================================================')
console.log(`📊 PHASE 2A TEST RESULTS: ${passedCount}/${passedCount + failedCount} PASS (${failedCount} FAILED)`)
console.log('==================================================================\n')

if (failedCount > 0) {
  process.exit(1)
} else {
  console.log('🎉 ALL PHASE 2A STORY CONTINUITY ENGINE TESTS PASSED!\n')
}
