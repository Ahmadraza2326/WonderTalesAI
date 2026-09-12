/**
 * ORBis Universal Content Library Registry
 * Comprehensive multi-dimensional catalog indexing learning assets across 15 standard categories.
 */

import type { LibraryContentItem, ContentCategory, GradeBand } from '../../types/learningUniverse'

export const UNIVERSAL_LIBRARY_ITEMS: LibraryContentItem[] = [
  // 1. LEARN (Structured Academy Lessons)
  {
    id: 'learn_math_fractions',
    title: 'Fractions on a Number Line',
    description: 'Visual fraction division, pizza slices, and equal parts with Poly the Owl.',
    category: 'learn',
    gradeBands: ['grade_3', 'grade_4'],
    subjectId: 'math',
    skillId: 'math_fractions_intro',
    icon: '🍕',
    durationMinutes: 8,
    difficulty: 'intermediate',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'poly',
    route: '/academy/lesson/lesson_math_fractions',
    prerequisites: ['math_addition_basic'],
    capstoneGameId: 'potion_scales',
    tags: ['fractions', 'math', 'numbers', 'geometry'],
    rewardXP: 30,
    rewardStars: 3,
  },
  {
    id: 'learn_science_ecosystems',
    title: 'Living Food Webs & Biomes',
    description: 'Discover producers, herbivores, carnivores, and trophic balance with Newton.',
    category: 'learn',
    gradeBands: ['grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6'],
    subjectId: 'science',
    skillId: 'sci_ecosystem_balance',
    icon: '🏝️',
    durationMinutes: 10,
    difficulty: 'intermediate',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'newton',
    route: '/academy/lesson/lesson_sci_ecosystems',
    prerequisites: [],
    capstoneGameId: 'ecosystem_sandbox',
    relatedStoryId: 'story_rainforest_secret',
    tags: ['ecology', 'animals', 'plants', 'nature', 'biology'],
    rewardXP: 35,
    rewardStars: 3,
  },
  {
    id: 'learn_cs_algorithms',
    title: 'Algorithmic Sequences & Loops',
    description: 'Program BEEP-0 with directional commands, jumps, and repeated loops.',
    category: 'learn',
    gradeBands: ['grade_1', 'grade_2', 'grade_3'],
    subjectId: 'computer_science',
    skillId: 'cs_algorithms_intro',
    icon: '🤖',
    durationMinutes: 8,
    difficulty: 'beginner',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'beep_0',
    route: '/academy/lesson/lesson_cs_algorithms',
    prerequisites: [],
    capstoneGameId: 'robopath',
    tags: ['coding', 'robots', 'logic', 'algorithms'],
    rewardXP: 30,
    rewardStars: 3,
  },
  {
    id: 'learn_logic_deduction',
    title: 'Forensic Clues & Deduction',
    description: 'Gather eyewitness clues, eliminate false leads, and solve whodunit mysteries with Sherlock.',
    category: 'learn',
    gradeBands: ['grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6'],
    subjectId: 'logic',
    skillId: 'logic_deduction_forensics',
    icon: '🔍',
    durationMinutes: 10,
    difficulty: 'intermediate',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'sherlock',
    route: '/academy/lesson/lesson_logic_deduction',
    prerequisites: [],
    capstoneGameId: 'mystery_detective',
    tags: ['logic', 'mystery', 'puzzles', 'thinking'],
    rewardXP: 35,
    rewardStars: 3,
  },

  // 2. BOOKS (Curated Illustrated Read-Aloud Books)
  {
    id: 'book_little_star',
    title: 'The Brave Little Star',
    description: 'An illustrated cosmic voyage following a young star learning to illuminate the galaxy.',
    category: 'books',
    gradeBands: ['pre_k', 'kindergarten', 'grade_1'],
    subjectId: 'astronomy',
    icon: '⭐',
    durationMinutes: 6,
    difficulty: 'beginner',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'nova',
    route: '/stories',
    prerequisites: [],
    tags: ['stars', 'space', 'courage', 'reading', 'bedtime'],
    rewardXP: 25,
    rewardStars: 2,
  },
  {
    id: 'book_curious_otter',
    title: 'Newton and the Floating Pebble',
    description: 'Why do heavy boats float while tiny pebbles sink? An introduction to buoyancy.',
    category: 'books',
    gradeBands: ['kindergarten', 'grade_1', 'grade_2'],
    subjectId: 'science',
    icon: '🌊',
    durationMinutes: 7,
    difficulty: 'beginner',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'newton',
    route: '/stories',
    prerequisites: [],
    capstoneGameId: 'magic_machine',
    tags: ['buoyancy', 'physics', 'water', 'science'],
    rewardXP: 25,
    rewardStars: 2,
  },

  // 3. CREATE (Creative Studio Activities)
  {
    id: 'create_space_rocket',
    title: 'Design Your Cosmic Rocket',
    description: 'Draw, paint, and stamp your custom space vessel, then tell its interplanetary story.',
    category: 'create',
    gradeBands: ['pre_k', 'kindergarten', 'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6'],
    subjectId: 'creativity',
    icon: '🚀',
    durationMinutes: 12,
    difficulty: 'beginner',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'davinci',
    route: '/academy/create',
    prerequisites: [],
    capstoneGameId: 'cosmic_constellations',
    tags: ['drawing', 'art', 'rocket', 'space', 'story'],
    rewardXP: 40,
    rewardStars: 4,
  },
  {
    id: 'create_creature_biome',
    title: 'Design a Rainforest Creature',
    description: 'Invent a new animal with special adaptations for living in the canopy treetops.',
    category: 'create',
    gradeBands: ['kindergarten', 'grade_1', 'grade_2', 'grade_3'],
    subjectId: 'science',
    icon: '🦎',
    durationMinutes: 10,
    difficulty: 'intermediate',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'newton',
    route: '/academy/create',
    prerequisites: [],
    capstoneGameId: 'ecosystem_sandbox',
    tags: ['art', 'biology', 'animals', 'design'],
    rewardXP: 40,
    rewardStars: 4,
  },

  // 4. THINK (Think Lab Critical Thinking Simulations)
  {
    id: 'think_pattern_matrices',
    title: 'Constellation Pattern Matrices',
    description: 'Identify rotational and color symmetry patterns across mysterious alien glyphs.',
    category: 'think',
    gradeBands: ['grade_1', 'grade_2', 'grade_3', 'grade_4'],
    subjectId: 'logic',
    icon: '🧩',
    durationMinutes: 8,
    difficulty: 'intermediate',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'sherlock',
    route: '/academy/think',
    prerequisites: [],
    tags: ['patterns', 'spatial', 'logic', 'puzzles'],
    rewardXP: 30,
    rewardStars: 3,
  },

  // 5. SCIENCE (Science Lab Interactive Simulations)
  {
    id: 'science_plant_sunlight',
    title: 'Photosynthesis & Light Laboratory',
    description: 'Predict and adjust sunlight and water levels to discover the rate of plant growth.',
    category: 'science',
    gradeBands: ['grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6'],
    subjectId: 'science',
    icon: '🌱',
    durationMinutes: 10,
    difficulty: 'intermediate',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'newton',
    route: '/academy/science',
    prerequisites: [],
    tags: ['plants', 'sunlight', 'experiments', 'photosynthesis'],
    rewardXP: 35,
    rewardStars: 3,
  },

  // 6. MUSIC (Sound Garden & Rhythm Exploration)
  {
    id: 'music_rhythm_echo',
    title: 'Harmonic Beat Cadence',
    description: 'Echo musical drum beats, tap in tempo, and compose sparkling melody trails with Aria.',
    category: 'music',
    gradeBands: ['pre_k', 'kindergarten', 'grade_1', 'grade_2', 'grade_3'],
    subjectId: 'art',
    icon: '🎵',
    durationMinutes: 8,
    difficulty: 'beginner',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'aria',
    route: '/playroom/rhythm-spells',
    prerequisites: [],
    capstoneGameId: 'rhythm_spells',
    tags: ['music', 'rhythm', 'beats', 'auditory'],
    rewardXP: 30,
    rewardStars: 3,
  },

  // 7. PROJECTS (Cross-Disciplinary Capstones)
  {
    id: 'project_space_station',
    title: 'Architect of the Space Station',
    description: 'Combine Math (mass), Science (gravity), Art (blueprints), and Coding (robot paths).',
    category: 'projects',
    gradeBands: ['grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6'],
    subjectId: 'creativity',
    icon: '🛰️',
    durationMinutes: 25,
    difficulty: 'advanced',
    hasAudioNarration: true,
    isOfflineAvailable: true,
    guideId: 'davinci',
    route: '/academy/projects',
    prerequisites: ['math_fractions_intro', 'cs_algorithms_intro'],
    capstoneGameId: 'invention_lab',
    tags: ['project', 'capstone', 'space', 'engineering', 'math', 'coding'],
    rewardXP: 100,
    rewardStars: 10,
  },
]

export function getAllLibraryItems(): LibraryContentItem[] {
  return UNIVERSAL_LIBRARY_ITEMS
}

export function filterLibraryItems(filters: {
  category?: ContentCategory
  gradeBand?: GradeBand
  subjectId?: string
  searchQuery?: string
}): LibraryContentItem[] {
  return UNIVERSAL_LIBRARY_ITEMS.filter((item) => {
    if (filters.category && item.category !== filters.category) return false
    if (filters.gradeBand && !item.gradeBands.includes(filters.gradeBand)) return false
    if (filters.subjectId && item.subjectId !== filters.subjectId) return false
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(q)
      const matchesDesc = item.description.toLowerCase().includes(q)
      const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q))
      if (!matchesTitle && !matchesDesc && !matchesTag) return false
    }
    return true
  })
}
