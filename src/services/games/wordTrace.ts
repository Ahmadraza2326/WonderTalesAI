import type { StoryRecord } from '../../types/story'
import type {
  WordTraceChallenge,
  WordTraceDifficulty,
  WordTraceGame,
} from '../../types/games/wordTrace'

/**
 * Deterministic pseudo-random number generator (Mulberry32).
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

const COMMON_DISTRACTOR_LETTERS = ['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L', 'C']

/**
 * Sanitizes clue texts to guarantee the target word is NEVER revealed in hints or meaning prompts.
 */
export function sanitizeClueText(text: string, targetWord: string): string {
  if (!text || !targetWord) return text
  // Redact whole word and simple stem variations
  const stem = targetWord.length > 4 ? targetWord.slice(0, -1) : targetWord
  const regex = new RegExp(`\\b${stem}\\w*\\b`, 'gi')
  return text.replace(regex, '_______')
}

/**
 * Generates structured 3-tier progressive hints.
 */
export function generateProgressiveHints(
  word: string,
  meaning: string,
  partOfSpeech?: string,
  synonym?: string
): { phoneticClue: string; syllableClue: string; firstLetterClue: string } {
  const upper = word.toUpperCase()
  const vCount = (upper.match(/[AEIOU]/gi) || []).length
  const cCount = upper.length - vCount

  const sanitizedMeaning = sanitizeClueText(meaning, word)
  const posText = partOfSpeech ? `(${partOfSpeech}) ` : ''
  const synText = synonym && synonym.toUpperCase() !== upper ? ` Often related to "${synonym}".` : ''

  const phoneticClue = `${posText}Clue: ${sanitizedMeaning}.${synText}`
  const syllableClue = `Word structure: ${upper.length} letters (${vCount} ${vCount === 1 ? 'vowel' : 'vowels'}, ${cCount} ${cCount === 1 ? 'consonant' : 'consonants'}).`
  const firstLetterClue = `Sound out the beginning: this word starts with "${upper[0]}".`

  return {
    phoneticClue,
    syllableClue,
    firstLetterClue,
  }
}

/**
 * Extracts and normalizes vocabulary candidates from Story DNA for word tracing.
 */
export function extractWordTraceCandidates(
  story: StoryRecord,
  difficulty: WordTraceDifficulty = 'easy'
): WordTraceChallenge[] {
  const pkg = story.learning_package
  if (!pkg) return []

  const vocabList = Array.isArray(pkg.vocabulary) ? pkg.vocabulary : []
  const dnaVocabList = Array.isArray(pkg.storyDNA?.vocabulary) ? pkg.storyDNA.vocabulary : []
  const combined = [...vocabList, ...dnaVocabList]

  const challenges: WordTraceChallenge[] = []
  const seenWords = new Set<string>()

  // Helper to count vowels
  const countVowels = (word: string) => {
    const vowels = word.match(/[AEIOU]/gi)
    return vowels ? vowels.length : 0
  }

  // 1. Process explicit vocabulary words
  combined.forEach((v, index) => {
    if (!v || typeof v.word !== 'string') return
    const cleanWord = v.word.trim().replace(/[^a-zA-Z]/g, '')
    if (cleanWord.length < 2 || cleanWord.length > 15) return

    const upperWord = cleanWord.toUpperCase()
    if (seenWords.has(upperWord)) return
    seenWords.add(upperWord)

    const rawMeaning = typeof v.meaning === 'string' && v.meaning.trim() ? v.meaning.trim() : 'A special story word'
    const sanitizedMeaning = sanitizeClueText(rawMeaning, cleanWord)
    const rawExample = typeof v.example === 'string' && v.example.trim() ? v.example.trim() : ''

    // Construct cloze sentence strictly hiding the target word
    let clozeSentence = ''
    let fullSentence = ''

    if (rawExample) {
      const regex = new RegExp(`\\b${cleanWord}\\b`, 'gi')
      if (regex.test(rawExample)) {
        clozeSentence = rawExample.replace(regex, '_______')
        fullSentence = rawExample
      } else {
        clozeSentence = `${sanitizeClueText(rawExample, cleanWord)}: _______`
        fullSentence = `${rawExample}: ${cleanWord}`
      }
    } else {
      clozeSentence = `It means "${sanitizedMeaning}": _______`
      fullSentence = `It means "${rawMeaning}": ${cleanWord}`
    }

    // Determine distractor count by difficulty
    const distractorCount = difficulty === 'easy' ? 0 : difficulty === 'medium' ? 1 : 2
    const prng = createSeededRandom(`${story.id || 'story'}-${upperWord}-${difficulty}`)

    // Create letter tiles
    const letters = upperWord.split('').map((char, charIdx) => ({
      id: `tile-${index}-${charIdx}-${char}`,
      letter: char,
      isDistractor: false,
    }))

    // Add distractors if needed
    for (let d = 0; d < distractorCount; d++) {
      const distractorChar =
        COMMON_DISTRACTOR_LETTERS[Math.floor(prng() * COMMON_DISTRACTOR_LETTERS.length)]
      letters.push({
        id: `distractor-${index}-${d}-${distractorChar}`,
        letter: distractorChar,
        isDistractor: true,
      })
    }

    // Deterministically shuffle the tiles
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1))
      const temp = letters[i]
      letters[i] = letters[j]
      letters[j] = temp
    }

    const vCount = countVowels(upperWord)
    const hints = generateProgressiveHints(upperWord, sanitizedMeaning, v.partOfSpeech, v.synonym)

    challenges.push({
      id: `word-challenge-${index}-${upperWord.toLowerCase()}`,
      word: upperWord,
      meaning: sanitizedMeaning,
      clozeSentence,
      fullSentence,
      partOfSpeech: v.partOfSpeech || undefined,
      synonym: v.synonym || undefined,
      difficulty: v.difficulty || (cleanWord.length <= 4 ? 'easy' : cleanWord.length <= 7 ? 'medium' : 'hard'),
      letterCount: cleanWord.length,
      vowelCount: vCount,
      consonantCount: cleanWord.length - vCount,
      hints,
      scrambledLetters: letters,
    })
  })

  // 2. Fallback: if fewer than 2 vocabulary words exist, also harvest prominent character names
  if (challenges.length < 2) {
    const characters = Array.isArray(pkg.storyDNA?.characters) ? pkg.storyDNA.characters : []
    characters.forEach((charName, index) => {
      if (typeof charName !== 'string') return
      const cleanChar = charName.trim().replace(/[^a-zA-Z]/g, '')
      if (cleanChar.length < 3 || cleanChar.length > 12) return

      const upperChar = cleanChar.toUpperCase()
      if (seenWords.has(upperChar)) return
      seenWords.add(upperChar)

      const prng = createSeededRandom(`${story.id || 'story'}-${upperChar}-${difficulty}`)
      const letters = upperChar.split('').map((char, charIdx) => ({
        id: `char-tile-${index}-${charIdx}-${char}`,
        letter: char,
        isDistractor: false,
      }))

      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1))
        const temp = letters[i]
        letters[i] = letters[j]
        letters[j] = temp
      }

      const vCount = countVowels(upperChar)
      const hints = generateProgressiveHints(upperChar, 'Our story companion from the tale')

      challenges.push({
        id: `char-challenge-${index}-${upperChar.toLowerCase()}`,
        word: upperChar,
        meaning: 'A companion from our adventure tale',
        clozeSentence: `Our story friend: _______`,
        fullSentence: `Our story friend: ${cleanChar}`,
        difficulty: 'easy',
        letterCount: cleanChar.length,
        vowelCount: vCount,
        consonantCount: cleanChar.length - vCount,
        hints,
        scrambledLetters: letters,
      })
    })
  }

  return challenges
}

/**
 * Generates an initialized Word Trace game from Story DNA.
 */
export function generateWordTraceGame(
  story: StoryRecord,
  difficulty: WordTraceDifficulty = 'easy'
): WordTraceGame {
  const storyId = story.id || 'anonymous-story'
  const candidates = extractWordTraceCandidates(story, difficulty)

  if (!candidates || candidates.length < 2) {
    return {
      storyId,
      difficulty,
      challenges: [],
      totalWords: 0,
      isPlayable: false,
      unavailableReason: 'Insufficient vocabulary in Story DNA to generate Word Trace.',
    }
  }

  const targetCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  const chosenChallenges = candidates.slice(0, Math.min(targetCount, candidates.length))

  if (chosenChallenges.length < 2) {
    return {
      storyId,
      difficulty,
      challenges: [],
      totalWords: 0,
      isPlayable: false,
      unavailableReason: 'Not enough distinct words available in this story.',
    }
  }

  return {
    storyId,
    difficulty,
    challenges: chosenChallenges,
    totalWords: chosenChallenges.length,
    isPlayable: true,
  }
}

/**
 * Calculates score and bounded V1 economy rewards for Word Trace completion.
 */
export function calculateWordTraceScore(params: {
  difficulty: WordTraceDifficulty
  wordsCount: number
  mistakes: number
  hintsUsed: number
  durationSeconds: number
}): {
  score: number
  accuracy: number
  xpEarned: number
  starsEarned: number
} {
  const { difficulty, wordsCount, mistakes, hintsUsed, durationSeconds } = params

  // Calculate accuracy based on total actions vs mistakes & hints
  const expectedMinActions = wordsCount * 4 // Average word length ~ 4-6
  const totalDeductions = mistakes * 2 + hintsUsed * 3
  const accuracy = Math.min(
    100,
    Math.max(10, Math.round(100 - (totalDeductions / Math.max(expectedMinActions, 1)) * 30))
  )

  // Base XP by difficulty
  const baseXP = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35
  const skillXpBonus = accuracy >= 80 ? 10 : 0
  const xpEarned = baseXP + skillXpBonus

  // Stars: 5 stars for 0 mistakes and 0 hints, 2 stars for >= 75% accuracy, 1 star otherwise
  const starsEarned = mistakes === 0 && hintsUsed === 0 ? 5 : accuracy >= 75 ? 2 : 1

  // Composite display score
  const baseScore = wordsCount * 120
  const accuracyBonus = accuracy * 6
  const speedBonus = Math.max(0, 250 - durationSeconds * 2)
  const score = Math.round(baseScore + accuracyBonus + speedBonus)

  return {
    score,
    accuracy,
    xpEarned,
    starsEarned,
  }
}
