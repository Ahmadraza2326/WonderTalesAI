import type { StoryRecord } from '../../types/story'
import type {
  MemoryCard,
  MemoryDifficulty,
  MemoryQuestGame,
  RawMemoryPairCandidate,
} from '../../types/games/storyMemoryQuest'

/**
 * Creates a deterministic pseudo-random number generator from a seed string.
 * Mulberry32 algorithm.
 */
export function createSeededRandom(seedStr: string): () => number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

/**
 * Extracts and cleans potential memory pair candidates directly from Story DNA.
 * Guaranteed 0 external AI calls.
 */
export function extractMemoryPairs(story: StoryRecord): RawMemoryPairCandidate[] {
  const pkg = story.learning_package
  if (!pkg) return []

  const candidates: RawMemoryPairCandidate[] = []
  const seenPrompts = new Set<string>()

  const addCandidate = (candidate: RawMemoryPairCandidate) => {
    const normPrompt = candidate.promptText.trim().toLowerCase()
    const normMatch = candidate.matchText.trim().toLowerCase()
    if (!normPrompt || !normMatch || normPrompt === normMatch) return
    if (seenPrompts.has(normPrompt)) return
    seenPrompts.add(normPrompt)
    candidates.push(candidate)
  }

  // 1. Vocabulary pairs (Word ↔ Meaning / Definition)
  const vocabList = Array.isArray(pkg.vocabulary) ? pkg.vocabulary : []
  const dnaVocabList = Array.isArray(pkg.storyDNA?.vocabulary) ? pkg.storyDNA.vocabulary : []
  const combinedVocab = [...vocabList, ...dnaVocabList]

  combinedVocab.forEach((v, index) => {
    if (v && typeof v.word === 'string' && v.word.trim()) {
      const meaning = typeof v.meaning === 'string' && v.meaning.trim() ? v.meaning.trim() : ''
      const example = typeof v.example === 'string' && v.example.trim() ? v.example.trim() : ''
      const matchText = meaning || (example ? `e.g. ${example}` : 'Story Word')

      let tier: 1 | 2 | 3 = 1
      if (v.difficulty === 'hard') tier = 3
      else if (v.difficulty === 'medium') tier = 2

      addCandidate({
        pairId: `vocab-${index}-${v.word.trim().toLowerCase()}`,
        category: 'vocabulary',
        promptText: v.word.trim(),
        promptSecondary: 'Word',
        matchText,
        matchSecondary: 'Meaning',
        emoji: '📖',
        difficultyTier: tier,
      })
    }
  })

  // 2. Character pairs (Character Name ↔ Role/Friend)
  const characters = Array.isArray(pkg.storyDNA?.characters) ? pkg.storyDNA.characters : []
  characters.forEach((charName, index) => {
    if (typeof charName === 'string' && charName.trim()) {
      addCandidate({
        pairId: `char-${index}-${charName.trim().toLowerCase()}`,
        category: 'character',
        promptText: charName.trim(),
        promptSecondary: 'Character',
        matchText: 'Story Hero / Friend',
        matchSecondary: 'Role',
        emoji: '🦁',
        difficultyTier: 1,
      })
    }
  })

  // 3. Location pairs (Location Name ↔ Story Setting)
  const locations = Array.isArray(pkg.storyDNA?.locations) ? pkg.storyDNA.locations : []
  locations.forEach((locName, index) => {
    if (typeof locName === 'string' && locName.trim()) {
      addCandidate({
        pairId: `loc-${index}-${locName.trim().toLowerCase()}`,
        category: 'location',
        promptText: locName.trim(),
        promptSecondary: 'Location',
        matchText: 'Magical Setting',
        matchSecondary: 'Place',
        emoji: '🏰',
        difficultyTier: 2,
      })
    }
  })

  // 4. Object pairs (Important Object ↔ Special Item)
  const objects = Array.isArray(pkg.storyDNA?.importantObjects) ? pkg.storyDNA.importantObjects : []
  objects.forEach((objName, index) => {
    if (typeof objName === 'string' && objName.trim()) {
      addCandidate({
        pairId: `obj-${index}-${objName.trim().toLowerCase()}`,
        category: 'object',
        promptText: objName.trim(),
        promptSecondary: 'Object',
        matchText: 'Special Story Item',
        matchSecondary: 'Item',
        emoji: '✨',
        difficultyTier: 2,
      })
    }
  })

  // 5. Comprehension facts / Quiz Seeds (Question ↔ Answer)
  const quizSeeds = Array.isArray(pkg.quizSeeds) ? pkg.quizSeeds : []
  quizSeeds.forEach((q, index) => {
    if (q && typeof q.question === 'string' && typeof q.answer === 'string') {
      const qText = q.question.trim()
      const aText = q.answer.trim()
      if (qText && aText) {
        addCandidate({
          pairId: `fact-${index}`,
          category: 'fact',
          promptText: qText.length > 60 ? `${qText.slice(0, 57)}...` : qText,
          promptSecondary: 'Question',
          matchText: aText.length > 60 ? `${aText.slice(0, 57)}...` : aText,
          matchSecondary: 'Answer',
          emoji: '💡',
          difficultyTier: 3,
        })
      }
    }
  })

  return candidates
}

/**
 * Generates a fully initialized and deterministically shuffled Memory Quest game.
 */
export function generateMemoryQuestGame(
  story: StoryRecord,
  difficulty: MemoryDifficulty = 'easy'
): MemoryQuestGame {
  const storyId = story.id || 'anonymous-story'
  const allCandidates = extractMemoryPairs(story)

  if (!allCandidates || allCandidates.length < 2) {
    return {
      storyId,
      difficulty,
      cards: [],
      totalPairs: 0,
      isPlayable: false,
      unavailableReason: 'Insufficient Story DNA to create memory pairs.',
    }
  }

  // Determine target pair count based on difficulty
  const targetPairCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 6

  // Select candidates: sort/filter by difficulty tier appropriateness
  let selectedCandidates = allCandidates
  if (difficulty === 'easy') {
    // Prefer tier 1 candidates first (vocabulary and characters)
    selectedCandidates = [...allCandidates].sort((a, b) => a.difficultyTier - b.difficultyTier)
  } else if (difficulty === 'hard') {
    // Prefer higher tier candidates
    selectedCandidates = [...allCandidates].sort((a, b) => b.difficultyTier - a.difficultyTier)
  }

  // Take up to target count or whatever is available
  const chosenPairs = selectedCandidates.slice(0, Math.min(targetPairCount, selectedCandidates.length))

  if (chosenPairs.length < 2) {
    return {
      storyId,
      difficulty,
      cards: [],
      totalPairs: 0,
      isPlayable: false,
      unavailableReason: 'Not enough distinct story pairs available.',
    }
  }

  // Build card deck (2 cards per pair)
  const cards: MemoryCard[] = []
  chosenPairs.forEach((pair) => {
    cards.push({
      id: `${pair.pairId}-prompt`,
      pairId: pair.pairId,
      type: 'prompt',
      category: pair.category,
      text: pair.promptText,
      secondaryText: pair.promptSecondary,
      emoji: pair.emoji,
    })

    cards.push({
      id: `${pair.pairId}-match`,
      pairId: pair.pairId,
      type: 'match',
      category: pair.category,
      text: pair.matchText,
      secondaryText: pair.matchSecondary,
      emoji: pair.emoji,
    })
  })

  // Deterministic shuffle using storyId + difficulty as seed
  const prng = createSeededRandom(`${storyId}-${difficulty}`)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }

  return {
    storyId,
    difficulty,
    cards,
    totalPairs: chosenPairs.length,
    isPlayable: true,
  }
}

/**
 * Calculates score and bounded V1 economy rewards for Memory Quest completion.
 */
export function calculateMemoryQuestScore(params: {
  difficulty: MemoryDifficulty
  pairsCount: number
  moves: number
  mistakes: number
  durationSeconds: number
}): {
  score: number
  accuracy: number
  xpEarned: number
  starsEarned: number
} {
  const { difficulty, pairsCount, moves, durationSeconds } = params

  const minPossibleMoves = pairsCount
  const actualMoves = Math.max(minPossibleMoves, moves)

  // Accuracy calculation: perfect game = 100%
  const accuracy = Math.min(100, Math.max(10, Math.round((minPossibleMoves / actualMoves) * 100)))

  // Base XP by difficulty
  const baseXP = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35
  const skillXpBonus = accuracy >= 80 ? 10 : 0
  const xpEarned = baseXP + skillXpBonus

  // Stars reward: 5 stars for 100% accuracy, 2 stars for >= 70%, 1 star otherwise
  const starsEarned = accuracy === 100 ? 5 : accuracy >= 70 ? 2 : 1

  // Composite game score for display
  const baseScore = pairsCount * 100
  const accuracyBonus = accuracy * 5
  const speedBonus = Math.max(0, 300 - durationSeconds * 2)
  const score = Math.round(baseScore + accuracyBonus + speedBonus)

  return {
    score,
    accuracy,
    xpEarned,
    starsEarned,
  }
}
