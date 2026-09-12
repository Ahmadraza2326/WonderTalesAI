import type { DifficultyTier } from '../../types/experience'
import type {
  BeatPad,
  RhythmSpellSong,
  RhythmSpellsChallenge,
  RhythmSpellsState,
  RhythmSpellsAction,
  RhythmSpellsTelemetry,
} from '../../types/games/rhythmSpells'

// ============================================================================
// 1. DETERMINISTIC PRNG ENGINE
// ============================================================================

function createPRNG(seedInput: string | number) {
  let s = typeof seedInput === 'number' ? Math.floor(Math.abs(seedInput)) || 1337 : 0
  if (typeof seedInput === 'string') {
    for (let i = 0; i < seedInput.length; i++) {
      s = (s << 5) - s + seedInput.charCodeAt(i)
      s |= 0
    }
  }
  let a = s >>> 0

  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Pentatonic Scale Notes for Beat Pads
const PENTATONIC_SCALE = [
  { noteName: 'C4', frequency: 261.63, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.6)' },
  { noteName: 'D4', frequency: 293.66, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.6)' },
  { noteName: 'E4', frequency: 329.63, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.6)' },
  { noteName: 'G4', frequency: 392.0, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.6)' },
  { noteName: 'A4', frequency: 440.0, color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.6)' },
  { noteName: 'C5', frequency: 523.25, color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.6)' },
]

// ============================================================================
// 2. MASTER RHYTHMIC SONGS & PHONEMIC FAMILIES CATALOG
// ============================================================================

export const MASTER_RHYTHM_SONGS: RhythmSpellSong[] = [
  // --- TIER 1 (Easy / Ages 3-5): CVC & Single-Syllable Rhymes ---
  {
    id: 'song_starlight_night',
    title: 'Starlight of the Night',
    tempoBpm: 108,
    leadPrompt: 'Find all magical words that rhyme with "NIGHT"!',
    targetWord: 'NIGHT',
    rhymeFamily: '-ight',
    rhymeRule: 'Ends with the bright /aɪt/ phoneme sound!',
    verseLines: [
      'Beneath the velvet sky of NIGHT, 🌌',
      'The glowing fireflies take FLIGHT. 🪰',
      'A crystal lantern gives us LIGHT, 💡',
      'And guides the stars so pure and BRIGHT! ✨',
    ],
    scientificConcept: {
      conceptTitle: 'Phonemic Awareness & Auditory Discrimination',
      scienceTopic: 'Phonological Awareness & Rhyme Detection',
      funFact: 'Recognizing nursery rhymes at age 4 is one of the strongest predictors of future reading mastery!',
      kidExplanation: 'Rhyming words share the same ending sound, even when they start with totally different letter sounds.',
    },
  },
  {
    id: 'song_solar_star',
    title: 'Dance of the Solar Star',
    tempoBpm: 112,
    leadPrompt: 'Find all magical words that rhyme with "STAR"!',
    targetWord: 'STAR',
    rhymeFamily: '-ar',
    rhymeRule: 'Ends with the open /ɑːr/ phoneme sound!',
    verseLines: [
      'Gazing at a twinkling STAR, ⭐',
      'Traveling across worlds so FAR. 🚀',
      'Catching comets in a JAR, 🫙',
      'Driving in a cosmic CAR! 🚗',
    ],
    scientificConcept: {
      conceptTitle: 'Rhythmic Entrainment & Neural Synchronization',
      scienceTopic: 'Auditory Meter & Neural Beat Tracking',
      funFact: 'When you tap to a beat, your brain neurons synchronize their electrical firing with the musical tempo!',
      kidExplanation: 'Rhythm helps your brain organize words into steady musical pulses, making them easy to remember.',
    },
  },
  {
    id: 'song_silver_moon',
    title: 'Melody of the Moon',
    tempoBpm: 104,
    leadPrompt: 'Find all magical words that rhyme with "MOON"!',
    targetWord: 'MOON',
    rhymeFamily: '-oon',
    rhymeRule: 'Ends with the resonant /uːn/ phoneme sound!',
    verseLines: [
      'Floating high above the MOON, 🌕',
      'Playing a celestial TUNE. 🎵',
      'Stirring stardust with a SPOON, 🥄',
      'We will land by sunny NOON! ☀️',
    ],
    scientificConcept: {
      conceptTitle: 'Syllabic Segmenting & Acoustic Meter',
      scienceTopic: 'Syllabic Beat Division & Speech Prosody',
      funFact: 'Every language in the world has a natural rhythm called prosody that helps us understand sentences!',
      kidExplanation: 'Clapping to syllables breaks big words into bite-sized rhythm beats like a musical drum kit.',
    },
  },

  // --- TIER 2 (Medium / Ages 6-8): Multi-Syllable Meter & Chants ---
  {
    id: 'song_crystal_dragon',
    title: 'Song of the Emerald Dragon',
    tempoBpm: 120,
    leadPrompt: 'Find all 2-syllable words that rhyme with "DRAGON"!',
    targetWord: 'DRAGON',
    rhymeFamily: '-agon',
    rhymeRule: 'Two-syllable trochaic meter ending in /-æɡ.ən/!',
    verseLines: [
      'Riding on a friendly DRAGON, 🐉',
      'Carrying a golden FLAGON. 🏺',
      'Rolling in a painted WAGON, 🛒',
      'Across the emerald garden lagoon! 🌿',
    ],
    scientificConcept: {
      conceptTitle: 'Trochaic Meter & Poetic Foot',
      scienceTopic: 'Metrical Stress & Multisyllabic Rhyme',
      funFact: 'Most English words follow a STRONG-weak rhythm pattern, just like a heartbeat: THUM-thump!',
      kidExplanation: 'Two-syllable rhymes match both the accented drum beat and the gentle finishing sound.',
    },
  },
  {
    id: 'song_twilight_glimmer',
    title: 'Whisper of the Twilight Glimmer',
    tempoBpm: 118,
    leadPrompt: 'Find all magical words that rhyme with "GLIMMER"!',
    targetWord: 'GLIMMER',
    rhymeFamily: '-immer',
    rhymeRule: 'Trochaic rhyme ending with /-ɪm.ər/!',
    verseLines: [
      'In the twilight starlight GLIMMER, ✨',
      'Fairy wings begin to SHIMMER. 🧚',
      'Diving like a graceful SWIMMER, 🏊',
      'Through the silver evening glow! 🌊',
    ],
    scientificConcept: {
      conceptTitle: 'Phonological Working Memory & Cadence',
      scienceTopic: 'Auditory Memory Buffer & Rhyme Synthesis',
      funFact: 'Singing lyrics activates both the left (language) and right (music) hemispheres of your brain simultaneously!',
      kidExplanation: 'When rhythm and rhyming combine, your brain remembers words ten times faster than plain speaking.',
    },
  },

  // --- TIER 3 (Hard / Ages 9-12): Poetic Cadence, Alliteration & Complex Meter ---
  {
    id: 'song_celestial_illumination',
    title: 'Ode to Celestial Illumination',
    tempoBpm: 124,
    leadPrompt: 'Find all 4-syllable words that rhyme with "ILLUMINATION"!',
    targetWord: 'ILLUMINATION',
    rhymeFamily: '-ation',
    rhymeRule: 'Four-syllable polysyllabic rhyme ending in /-eɪ.ʃən/!',
    verseLines: [
      'Behold the cosmic ILLUMINATION, 💡',
      'Mapping every CONSTELLATION. 🌌',
      'Joining in the CELEBRATION, 🎉',
      'Of the galaxy’s CREATION! 🪐',
    ],
    scientificConcept: {
      conceptTitle: 'Polysyllabic Morphological Cadence',
      scienceTopic: 'Latin Suffix Morphology & Syllabic Meter',
      funFact: 'The Latin suffix "-ation" turns active action verbs (illuminate) into grand state nouns (illumination)!',
      kidExplanation: 'Mastering polysyllabic suffixes helps you conduct complex poetry, scientific terms, and oratorical speeches.',
    },
  },
]

// Word Bank across families
interface WordOption {
  word: string
  emoji: string
  family: string
  syllables: number
}

const MASTER_WORD_BANK: WordOption[] = [
  // -ight
  { word: 'LIGHT', emoji: '💡', family: '-ight', syllables: 1 },
  { word: 'BRIGHT', emoji: '✨', family: '-ight', syllables: 1 },
  { word: 'FLIGHT', emoji: '🪰', family: '-ight', syllables: 1 },
  { word: 'SIGHT', emoji: '👀', family: '-ight', syllables: 1 },
  { word: 'KITE', emoji: '🪁', family: '-ight', syllables: 1 },

  // -ar
  { word: 'FAR', emoji: '🚀', family: '-ar', syllables: 1 },
  { word: 'CAR', emoji: '🚗', family: '-ar', syllables: 1 },
  { word: 'JAR', emoji: '🫙', family: '-ar', syllables: 1 },
  { word: 'BAR', emoji: '🍫', family: '-ar', syllables: 1 },

  // -oon
  { word: 'SPOON', emoji: '🥄', family: '-oon', syllables: 1 },
  { word: 'TUNE', emoji: '🎵', family: '-oon', syllables: 1 },
  { word: 'DUNE', emoji: '🏜️', family: '-oon', syllables: 1 },
  { word: 'NOON', emoji: '☀️', family: '-oon', syllables: 1 },

  // -at
  { word: 'BAT', emoji: '🦇', family: '-at', syllables: 1 },
  { word: 'HAT', emoji: '🎩', family: '-at', syllables: 1 },
  { word: 'MAT', emoji: '🧘', family: '-at', syllables: 1 },
  { word: 'RAT', emoji: '🐀', family: '-at', syllables: 1 },

  // -agon
  { word: 'FLAGON', emoji: '🏺', family: '-agon', syllables: 2 },
  { word: 'WAGON', emoji: '🛒', family: '-agon', syllables: 2 },

  // -immer
  { word: 'SHIMMER', emoji: '🧚', family: '-immer', syllables: 2 },
  { word: 'SWIMMER', emoji: '🏊', family: '-immer', syllables: 2 },
  { word: 'DIMMER', emoji: '🌘', family: '-immer', syllables: 2 },

  // -ation
  { word: 'CONSTELLATION', emoji: '🌌', family: '-ation', syllables: 4 },
  { word: 'CELEBRATION', emoji: '🎉', family: '-ation', syllables: 4 },
  { word: 'CREATION', emoji: '🪐', family: '-ation', syllables: 3 },
  { word: 'FASCINATION', emoji: '🔮', family: '-ation', syllables: 4 },

  // Distractors
  { word: 'SUN', emoji: '☀️', family: '-un', syllables: 1 },
  { word: 'TREE', emoji: '🌲', family: '-ee', syllables: 1 },
  { word: 'FISH', emoji: '🐟', family: '-ish', syllables: 1 },
  { word: 'BIRD', emoji: '🐦', family: '-ird', syllables: 1 },
  { word: 'RAIN', emoji: '🌧️', family: '-ain', syllables: 1 },
  { word: 'CASTLE', emoji: '🏰', family: '-astle', syllables: 2 },
  { word: 'SHADOW', emoji: '👤', family: '-adow', syllables: 2 },
  { word: 'FOREST', emoji: '🌳', family: '-orest', syllables: 2 },
  { word: 'GALAXY', emoji: '🌌', family: '-axy', syllables: 3 },
  { word: 'SUPERNOVA', emoji: '💥', family: '-ova', syllables: 4 },
]

// ============================================================================
// 3. PROCEDURAL RHYTHM SPELLS GENERATOR
// ============================================================================

export function generateProceduralRhythmSpellsChallenge(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): RhythmSpellsChallenge {
  const prng = createPRNG(`${seed}_rhythm_${difficulty}_${explorerLevel}`)

  // Filter eligible songs by difficulty tier
  let eligibleSongs = MASTER_RHYTHM_SONGS.slice(0, 3) // Easy defaults
  if (difficulty === 'medium') {
    eligibleSongs = MASTER_RHYTHM_SONGS.slice(3, 5)
  } else if (difficulty === 'hard') {
    eligibleSongs = MASTER_RHYTHM_SONGS.slice(5)
  }

  const songIndex = Math.floor(prng() * eligibleSongs.length)
  const song = eligibleSongs[songIndex] || MASTER_RHYTHM_SONGS[0]

  // Find all rhyming candidate words in master bank
  const matchingRhymes = MASTER_WORD_BANK.filter(
    (w) => w.family === song.rhymeFamily && w.word !== song.targetWord
  )

  // Find distractors
  const distractors = MASTER_WORD_BANK.filter((w) => w.family !== song.rhymeFamily)

  // Determine pad count: 4 pads for easy, 5 for medium, 6 for hard
  const totalPadsCount = difficulty === 'hard' ? 6 : difficulty === 'medium' ? 5 : 4
  const targetRhymesCount = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 3 : 2

  // Select target rhymes
  const shuffledRhymes = [...matchingRhymes]
  for (let i = shuffledRhymes.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = shuffledRhymes[i]
    shuffledRhymes[i] = shuffledRhymes[j]
    shuffledRhymes[j] = temp
  }
  const chosenRhymes = shuffledRhymes.slice(0, targetRhymesCount)

  // Select distractors to fill remaining pads
  const neededDistractors = totalPadsCount - chosenRhymes.length
  const shuffledDistractors = [...distractors]
  for (let i = shuffledDistractors.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = shuffledDistractors[i]
    shuffledDistractors[i] = shuffledDistractors[j]
    shuffledDistractors[j] = temp
  }
  const chosenDistractors = shuffledDistractors.slice(0, neededDistractors)

  // Combine and shuffle pad words
  const allPadWords = [
    ...chosenRhymes.map((r) => ({ ...r, isRhyme: true })),
    ...chosenDistractors.map((d) => ({ ...d, isRhyme: false })),
  ]

  for (let i = allPadWords.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = allPadWords[i]
    allPadWords[i] = allPadWords[j]
    allPadWords[j] = temp
  }

  // Create BeatPad objects mapped to pentatonic scale notes
  const pads: BeatPad[] = allPadWords.map((item, idx) => {
    const note = PENTATONIC_SCALE[idx % PENTATONIC_SCALE.length]
    return {
      id: `pad_${item.word.toLowerCase()}_${idx}`,
      noteName: note.noteName,
      frequency: note.frequency,
      color: note.color,
      glowColor: note.glowColor,
      word: item.word,
      emoji: item.emoji,
      isRhyme: item.isRhyme,
      syllableCount: item.syllables,
      padIndex: idx,
    }
  })

  const challengeId = `proc_rhythm_${String(seed).slice(0, 10)}_${difficulty}`

  return {
    id: challengeId,
    title: `Harmonic Spell: ${song.title}`,
    difficulty,
    tierNumber: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1,
    tempoBpm: song.tempoBpm,
    song,
    targetRhymesCount: chosenRhymes.length,
    pads,
    parMoves: chosenRhymes.length + 1,
    timeTargetSeconds: 35,
  }
}

export function generateRhythmSpellsChallenge(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): RhythmSpellsChallenge {
  return generateProceduralRhythmSpellsChallenge(seed, difficulty, explorerLevel)
}

// ============================================================================
// 4. ENGINE STATE REDUCER & INITIALIZER
// ============================================================================

export function getInitialRhythmSpellsState(challenge: RhythmSpellsChallenge): RhythmSpellsState {
  return {
    currentChallenge: challenge,
    status: 'conducting',
    activePads: challenge.pads,
    foundRhymeIds: [],
    currentBeat: 0,
    combo: 0,
    score: 0,
    stars: 3,
    xp: 25,
    telemetry: {
      challengeId: challenge.id,
      difficulty: challenge.difficulty,
      tapsCount: 0,
      perfectHits: 0,
      rhymesFound: 0,
      mistakesCount: 0,
      maxCombo: 0,
      score: 0,
      stars: 3,
      xp: 25,
      finalStatus: 'in_progress',
    },
  }
}

export function evaluateRhythmSpellsAction(
  state: RhythmSpellsState,
  action: RhythmSpellsAction
): RhythmSpellsState {
  switch (action.type) {
    case 'TAP_PAD': {
      if (state.status === 'spell_cast' || state.status === 'celebrating') {
        return state
      }

      const pad = state.activePads.find((p) => p.id === action.padId)
      if (!pad) return state

      const newTaps = state.telemetry.tapsCount + 1
      const isAlreadyFound = state.foundRhymeIds.includes(pad.id)

      if (pad.isRhyme && !isAlreadyFound) {
        const newFound = [...state.foundRhymeIds, pad.id]
        const newCombo = state.combo + 1
        const newMaxCombo = Math.max(state.telemetry.maxCombo, newCombo)
        const isSolved = newFound.length >= state.currentChallenge.targetRhymesCount

        const updatedTelemetry: RhythmSpellsTelemetry = {
          ...state.telemetry,
          tapsCount: newTaps,
          perfectHits: state.telemetry.perfectHits + 1,
          rhymesFound: newFound.length,
          maxCombo: newMaxCombo,
          finalStatus: isSolved ? 'solved' : 'in_progress',
        }

        if (isSolved) {
          const scoreResult = calculateRhythmSpellsScore(updatedTelemetry, state.currentChallenge)
          updatedTelemetry.score = scoreResult.score
          updatedTelemetry.stars = scoreResult.stars
          updatedTelemetry.xp = scoreResult.xp
        }

        return {
          ...state,
          foundRhymeIds: newFound,
          combo: newCombo,
          status: isSolved ? 'spell_cast' : 'conducting',
          score: updatedTelemetry.score,
          stars: updatedTelemetry.stars,
          xp: updatedTelemetry.xp,
          telemetry: updatedTelemetry,
        }
      } else if (!pad.isRhyme) {
        // Distractor tapped
        return {
          ...state,
          combo: 0,
          telemetry: {
            ...state.telemetry,
            tapsCount: newTaps,
            mistakesCount: state.telemetry.mistakesCount + 1,
          },
        }
      }

      return state
    }

    case 'BEAT_TICK': {
      return {
        ...state,
        currentBeat: (state.currentBeat + 1) % 4,
      }
    }

    case 'RESOLVE_CHALLENGE': {
      return {
        ...state,
        status: 'celebrating',
      }
    }

    case 'RESET_CHALLENGE': {
      return getInitialRhythmSpellsState(state.currentChallenge)
    }

    case 'LOAD_CHALLENGE': {
      return getInitialRhythmSpellsState(action.challenge)
    }

    default:
      return state
  }
}

// ============================================================================
// 5. SCORING & REWARDS
// ============================================================================

export function calculateRhythmSpellsScore(
  telemetry: RhythmSpellsTelemetry,
  challenge: RhythmSpellsChallenge
): { score: number; stars: number; xp: number } {
  let score = 100

  // Penalty for mistakes
  score -= telemetry.mistakesCount * 8

  // Bonus for combos
  if (telemetry.maxCombo >= challenge.targetRhymesCount) {
    score += 10
  }

  score = Math.max(50, Math.min(100, score))

  let stars = 3
  if (score >= 90) stars = 5
  else if (score >= 75) stars = 4

  const baseXP = challenge.difficulty === 'hard' ? 45 : challenge.difficulty === 'medium' ? 35 : 25
  const xp = baseXP + (stars >= 5 ? 10 : 0)

  return { score, stars, xp }
}
