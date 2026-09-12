import type { DifficultyTier } from '../../types/experience'
import type {
  RuneBlock,
  AnvilSocket,
  SpellforgeWord,
  SpellforgeChallenge,
  SpellforgeState,
  SpellforgeAction,
  SpellforgeTelemetry,
  LiteracyScienceDossier,
} from '../../types/games/spellforge'

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

// ============================================================================
// 2. CURATED WORDS & PHONICS RECIPES
// ============================================================================

export const CURATED_SPELLFORGE_WORDS: SpellforgeWord[] = [
  // --- EASY TIER (CVC & Simple Phonemes) ---
  {
    id: 'easy_sun',
    targetWord: 'SUN',
    meaning: 'The radiant star that illuminates and warms the entire world.',
    phonicsBreakdown: ['S', 'U', 'N'],
    tier: 'easy',
    spellName: 'Solar Dawn Radiance',
    spellEmoji: '☀️',
    spellAuraColor: '#f59e0b',
    incantation: 'Solara Ignis Lumina!',
    scientificConcept: {
      conceptTitle: 'Phonemic Awareness & Solar Energy',
      scienceTopic: 'Phoneme Segmenting & Stellar Fusion',
      funFact: 'Sunlight takes approximately 8 minutes and 20 seconds to travel 93 million miles to Earth!',
      kidExplanation: 'Each letter sound (S-U-N) blends smoothly together like puzzle pieces to form the word.',
    },
  },
  {
    id: 'easy_cat',
    targetWord: 'CAT',
    meaning: 'A nimble, curious feline companion with keen night vision.',
    phonicsBreakdown: ['C', 'A', 'T'],
    tier: 'easy',
    spellName: 'Feline Agility Whisper',
    spellEmoji: '🐱',
    spellAuraColor: '#38bdf8',
    incantation: 'Felina Celeritas Paws!',
    scientificConcept: {
      conceptTitle: 'CVC Word Families (-at family)',
      scienceTopic: 'Consonant-Vowel-Consonant Construction',
      funFact: 'Cats can rotate their ears 180 degrees using 32 individual ear muscles!',
      kidExplanation: 'When you change the first consonant (B-at, H-at, C-at), you create a whole family of rhyming words!',
    },
  },
  {
    id: 'easy_fox',
    targetWord: 'FOX',
    meaning: 'A clever forest dweller with a bushy tail and amber coat.',
    phonicsBreakdown: ['F', 'O', 'X'],
    tier: 'easy',
    spellName: 'Amber Forest Guile',
    spellEmoji: '🦊',
    spellAuraColor: '#ea580c',
    incantation: 'Vulpes Umbra Sylva!',
    scientificConcept: {
      conceptTitle: 'Terminal Consonants & Sound Waves',
      scienceTopic: 'Final Phoneme Articulation',
      funFact: 'Foxes use the Earth’s magnetic field to accurately pounce on prey hidden beneath snow!',
      kidExplanation: 'The letter X makes two sounds blended together: /k/ and /s/!',
    },
  },
  {
    id: 'easy_owl',
    targetWord: 'OWL',
    meaning: 'A nocturnal bird of wisdom that flies in total silence.',
    phonicsBreakdown: ['O', 'W', 'L'],
    tier: 'easy',
    spellName: 'Midnight Nocturne Gaze',
    spellEmoji: '🦉',
    spellAuraColor: '#a855f7',
    incantation: 'Noctis Strix Sapientia!',
    scientificConcept: {
      conceptTitle: 'Diphthongs & Auditory Localization',
      scienceTopic: 'Vowel Glides & Sound Wave Direction',
      funFact: 'Owls have specialized serrated wing feathers that break up air turbulence for completely silent flight.',
      kidExplanation: 'The letters O and W team up together to make the glide sound /ow/!',
    },
  },

  // --- MEDIUM TIER (Blends, Digraphs, Onset-Rime) ---
  {
    id: 'med_spark',
    targetWord: 'SPARK',
    meaning: 'A glowing speck of burning fire or sudden creative inspiration.',
    phonicsBreakdown: ['SP', 'AR', 'K'],
    tier: 'medium',
    spellName: 'Forge Ignition Burst',
    spellEmoji: '✨',
    spellAuraColor: '#fbbf24',
    incantation: 'Scintilla Ignis Forgia!',
    scientificConcept: {
      conceptTitle: 'Consonant Blends & Bossy-R Vowels',
      scienceTopic: 'Phonetic Blends & R-Controlled Vowels',
      funFact: 'Flint and steel create sparks hot enough to reach over 1,500 degrees Fahrenheit!',
      kidExplanation: 'When the letter R follows a vowel like in "AR", it changes the vowel sound into a deep roar!',
    },
  },
  {
    id: 'med_knight',
    targetWord: 'KNIGHT',
    meaning: 'A courageous armored protector who upholds valor and honor.',
    phonicsBreakdown: ['KN', 'IGH', 'T'],
    tier: 'medium',
    spellName: 'Aegis Shield of Valor',
    spellEmoji: '🛡️',
    spellAuraColor: '#60a5fa',
    incantation: 'Chivalricus Valor Aegis!',
    scientificConcept: {
      conceptTitle: 'Silent Letters & Trigraphs (-ight)',
      scienceTopic: 'Historical Etymology & Orthography',
      funFact: 'In Old English centuries ago, the "k" and "gh" in knight were actually pronounced out loud!',
      kidExplanation: 'The three letters I-G-H work as a secret team called a trigraph to make one long /I/ sound.',
    },
  },
  {
    id: 'med_crystal',
    targetWord: 'CRYSTAL',
    meaning: 'A solid mineral whose atoms form a symmetrical repeating lattice.',
    phonicsBreakdown: ['CRY', 'ST', 'AL'],
    tier: 'medium',
    spellName: 'Prismatic Gem Resonator',
    spellEmoji: '💎',
    spellAuraColor: '#c084fc',
    incantation: 'Crystallum Lattice Prism!',
    scientificConcept: {
      conceptTitle: 'Syllabification & Crystal Lattices',
      scienceTopic: 'Syllable Segmentation & Mineralogy',
      funFact: 'Quartz crystals vibrate at exact frequencies (32,768 times a second) to keep time in digital watches!',
      kidExplanation: 'Crys-tal has two syllables! Clapping your hands for each syllable helps spell long words.',
    },
  },
  {
    id: 'med_dragon',
    targetWord: 'DRAGON',
    meaning: 'A mythical winged serpent possessing fiery breath and ancient lore.',
    phonicsBreakdown: ['DR', 'A', 'GON'],
    tier: 'medium',
    spellName: 'Wyrmfire Ascendance',
    spellEmoji: '🐉',
    spellAuraColor: '#ef4444',
    incantation: 'Draconis Flamma Caeli!',
    scientificConcept: {
      conceptTitle: 'Initial Blends & Mythological Taxonomy',
      scienceTopic: 'Consonant Clusters (DR-) & Folklore',
      funFact: 'Dragon myths appear independently across ancient Norse, Chinese, Aztec, and Egyptian cultures!',
      kidExplanation: 'The "DR" cluster starts in the roof of your mouth with your tongue curled slightly back.',
    },
  },

  // --- HARD TIER (Morphemes: Prefixes, Suffixes & Roots) ---
  {
    id: 'hard_telescope',
    targetWord: 'TELESCOPE',
    meaning: 'An optical instrument to see distant celestial bodies across the cosmos.',
    phonicsBreakdown: ['TELE', 'SCOPE'],
    morphemeBreakdown: ['tele (distant)', 'scope (to look/view)'],
    tier: 'hard',
    spellName: 'Cosmic Horizon Seer',
    spellEmoji: '🔭',
    spellAuraColor: '#818cf8',
    incantation: 'Tele-Scopium Astra Videre!',
    scientificConcept: {
      conceptTitle: 'Greek Morphemic Roots (Tele + Scope)',
      scienceTopic: 'Morphological Synthesis & Optics',
      funFact: 'The James Webb Space Telescope can see infrared light from galaxies formed over 13.5 billion years ago!',
      kidExplanation: 'Greek root "tele" means far away, and "scope" means to look. Together they mean "looking far away"!',
    },
  },
  {
    id: 'hard_biosphere',
    targetWord: 'BIOSPHERE',
    meaning: 'The global ecological sum of all living beings and their environments on Earth.',
    phonicsBreakdown: ['BIO', 'SPHERE'],
    morphemeBreakdown: ['bio (life)', 'sphere (globe/round ball)'],
    tier: 'hard',
    spellName: 'Terra Living Harmony',
    spellEmoji: '🌍',
    spellAuraColor: '#10b981',
    incantation: 'Biosphaera Vitae Orb!',
    scientificConcept: {
      conceptTitle: 'Morphemic Roots & Planetary Ecology',
      scienceTopic: 'Greek Etymology & Earth Systems',
      funFact: 'The biosphere extends from 6 miles into the ocean abyss up to 4 miles atop high mountains!',
      kidExplanation: '"Bio" means life (biology, biography) and "sphere" means ball. The living ball of Earth!',
    },
  },
  {
    id: 'hard_photosynthesis',
    targetWord: 'PHOTOSYNTHESIS',
    meaning: 'The biochemical process by which plants turn sunlight into energy.',
    phonicsBreakdown: ['PHOTO', 'SYN', 'THESIS'],
    morphemeBreakdown: ['photo (light)', 'syn (together)', 'thesis (to put/place)'],
    tier: 'hard',
    spellName: 'Verdant Solar Synthesis',
    spellEmoji: '🌱',
    spellAuraColor: '#34d399',
    incantation: 'Photo-Synthesis Chlorophyllia!',
    scientificConcept: {
      conceptTitle: 'Compound Morphemes & Plant Biology',
      scienceTopic: 'Prefix-Root-Suffix Chemistry',
      funFact: 'Plankton in the oceans produce over 50% of the oxygen we breathe through photosynthesis!',
      kidExplanation: '"Photo" (light) + "Synthesis" (putting together) = putting light and air together to make plant food!',
    },
  },
  {
    id: 'hard_luminescence',
    targetWord: 'LUMINESCENCE',
    meaning: 'The spontaneous emission of light from a substance not caused by heat.',
    phonicsBreakdown: ['LUMIN', 'ES', 'CENCE'],
    morphemeBreakdown: ['lumin (light)', 'esce (becoming)', 'ence (state of)'],
    tier: 'hard',
    spellName: 'Starlight Biolume Aura',
    spellEmoji: '💡',
    spellAuraColor: '#38bdf8',
    incantation: 'Luminescentia Noctis Glow!',
    scientificConcept: {
      conceptTitle: 'Latin Roots & Quantum Optics',
      scienceTopic: 'Latin Etymology & Photoluminescence',
      funFact: 'Fireflies produce cold light with nearly 100% efficiency—almost zero energy is wasted as heat!',
      kidExplanation: 'Latin root "lumen" means light (illuminate, luminous). Morphemes let you unlock dozens of words at once!',
    },
  },
]

// ============================================================================
// 3. PROCEDURAL PHONICS & MORPHEME GENERATOR
// ============================================================================

const PROCEDURAL_WORD_TEMPLATES: Record<DifficultyTier, Array<{ word: string; meaning: string; parts: string[]; emoji: string; theme: string; color: string; concept: LiteracyScienceDossier }>> = {
  easy: [
    {
      word: 'STAR',
      meaning: 'A massive sphere of incandescent plasma held together by its own gravity.',
      parts: ['S', 'T', 'AR'],
      emoji: '⭐',
      theme: 'Starlight Core',
      color: '#f59e0b',
      concept: {
        conceptTitle: 'Initial Blends (ST-) & Astronomy',
        scienceTopic: 'Consonant Blends & Stellar Physics',
        funFact: 'Our Sun is an average-sized yellow dwarf star over 4.6 billion years old!',
        kidExplanation: 'Blending "ST" with "AR" creates a glowing word! Letters form sound teams.',
      },
    },
    {
      word: 'MOON',
      meaning: 'Earth’s natural satellite reflecting solar light in the night sky.',
      parts: ['M', 'OO', 'N'],
      emoji: '🌙',
      theme: 'Lunar Crescent',
      color: '#38bdf8',
      concept: {
        conceptTitle: 'Vowel Teams (OO) & Orbital Gravity',
        scienceTopic: 'Digraphs & Gravitational Orbit',
        funFact: 'The Moon causes the ocean tides to rise and fall twice every single day!',
        kidExplanation: 'Two O’s together make the gentle /oo/ sound like an owl hooting in the night.',
      },
    },
    {
      word: 'WIND',
      meaning: 'Moving air currents caused by differences in atmospheric pressure.',
      parts: ['W', 'I', 'N', 'D'],
      emoji: '💨',
      theme: 'Zephyr Airflow',
      color: '#60a5fa',
      concept: {
        conceptTitle: 'Short Vowels & Atmospheric Physics',
        scienceTopic: 'Short Vowels & Air Density',
        funFact: 'The fastest wind gust ever recorded on Earth was 253 mph during Tropical Cyclone Olivia!',
        kidExplanation: 'W-I-N-D segmenting: four crisp sounds combine to describe moving breeze.',
      },
    },
    {
      word: 'BEAR',
      meaning: 'A strong furry mammal with an exceptional sense of smell.',
      parts: ['B', 'E', 'AR'],
      emoji: '🐻',
      theme: 'Forest Vitality',
      color: '#b45309',
      concept: {
        conceptTitle: 'Vowel Combinations & Animal Senses',
        scienceTopic: 'R-Controlled Vowels & Zoology',
        funFact: 'A grizzly bear can smell food from over 20 miles away!',
        kidExplanation: 'B-E-A-R sounds combine to form a strong, hearty forest creature.',
      },
    },
  ],
  medium: [
    {
      word: 'FLAME',
      meaning: 'The visible, glowing gaseous part of a fire undergoing combustion.',
      parts: ['FL', 'A', 'ME'],
      emoji: '🔥',
      theme: 'Phoenix Ember',
      color: '#f97316',
      concept: {
        conceptTitle: 'Split Digraphs (Silent Magic-E)',
        scienceTopic: 'Vowel Lengthening & Thermal Chemistry',
        funFact: 'Blue flames are much hotter than red and yellow flames because they burn more completely!',
        kidExplanation: 'The magic silent E at the end leaps over the consonant to make the A say its own name (/ay/)!',
      },
    },
    {
      word: 'SHIELD',
      meaning: 'A protective barrier used to deflect impacts and protect guardians.',
      parts: ['SH', 'IE', 'LD'],
      emoji: '🛡️',
      theme: 'Bastion Barrier',
      color: '#6366f1',
      concept: {
        conceptTitle: 'Consonant Digraphs (SH-) & Metallurgy',
        scienceTopic: 'Fricative Digraphs & Material Strength',
        funFact: 'Titanium is as strong as steel but 45% lighter, making it ideal for aerospace shields!',
        kidExplanation: 'The letters S and H merge to make a smooth whispering /sh/ sound.',
      },
    },
    {
      word: 'AURORA',
      meaning: 'Luminous light curtains in the polar sky caused by solar solar particles.',
      parts: ['AU', 'RO', 'RA'],
      emoji: '🌌',
      theme: 'Boreal Luminary',
      color: '#10b981',
      concept: {
        conceptTitle: 'Multisyllabic Flow & Magnetospheric Science',
        scienceTopic: 'Syllabic Cadence & Earth’s Magnetic Field',
        funFact: 'Auroras also occur on Jupiter and Saturn, where they are thousands of times more powerful!',
        kidExplanation: 'Au-ro-ra has three syllables! Clapping rhythm helps unlock long, magical words.',
      },
    },
  ],
  hard: [
    {
      word: 'TELEPORT',
      meaning: 'To instantly transport matter across space without crossing physical distance.',
      parts: ['TELE', 'PORT'],
      emoji: '🌀',
      theme: 'Quantum Transit',
      color: '#a855f7',
      concept: {
        conceptTitle: 'Greek & Latin Root Synthesis (Tele + Port)',
        scienceTopic: 'Morphemic Roots & Quantum Mechanics',
        funFact: 'Quantum physicists have successfully teleported photons across 87 miles through satellite laser links!',
        kidExplanation: '"Tele" (Greek for far) + "Port" (Latin to carry) = carrying things across far distances!',
      },
    },
    {
      word: 'SUBMARINE',
      meaning: 'A specialized watercraft capable of independent underwater exploration.',
      parts: ['SUB', 'MAR', 'INE'],
      emoji: '🚢',
      theme: 'Oceanic Abyss',
      color: '#0284c7',
      concept: {
        conceptTitle: 'Prefixes & Marine Engineering',
        scienceTopic: 'Latin Prefix "Sub-" & Hydrostatics',
        funFact: 'Deep-sea research submarines can withstand water pressures over 1,000 times atmospheric pressure!',
        kidExplanation: '"Sub" (under) + "Mar" (sea) + "ine" = belonging under the sea!',
      },
    },
    {
      word: 'HYDROPONICS',
      meaning: 'The cultivation of plants in water enriched with nutrients without using soil.',
      parts: ['HYDRO', 'PON', 'ICS'],
      emoji: '🌿',
      theme: 'Living Aqueduct',
      color: '#059669',
      concept: {
        conceptTitle: 'Compound Morphemes & Sustainable Agriculture',
        scienceTopic: 'Greek Roots (Hydro + Ponos) & Botany',
        funFact: 'Astronauts on the International Space Station use hydroponics to grow fresh lettuce in zero gravity!',
        kidExplanation: '"Hydro" (water) + "Pon" (work) + "ics" = the science of working with water to grow food!',
      },
    },
  ],
}

const DISTRACTOR_RUNES: Record<DifficultyTier, string[]> = {
  easy: ['B', 'P', 'T', 'D', 'M', 'R', 'L', 'K', 'G'],
  medium: ['TR', 'CL', 'BL', 'ST', 'ING', 'OOK', 'IGHT', 'EAM'],
  hard: ['AERO', 'CHRONO', 'MICRO', 'GEO', 'ASTRO', 'SCOPE', 'GRAPH'],
}

const RUNE_COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#fbbf24', '#60a5fa']

/**
 * Generate infinite procedural spellforge phonics & morpheme challenges
 */
export function generateProceduralSpellforgeChallenge(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): SpellforgeChallenge {
  const prng = createPRNG(`${seed}_spellforge_${difficulty}_${explorerLevel}`)

  // Pick template based on difficulty
  const templates = PROCEDURAL_WORD_TEMPLATES[difficulty]
  const chosenIndex = Math.floor(prng() * templates.length)
  const chosen = templates[chosenIndex]

  const parts = chosen.parts
  const wordId = `proc_spell_${String(seed).slice(0, 10)}_${difficulty}`

  const targetWord: SpellforgeWord = {
    id: wordId,
    targetWord: chosen.word,
    meaning: chosen.meaning,
    phonicsBreakdown: parts,
    tier: difficulty,
    spellName: chosen.theme,
    spellEmoji: chosen.emoji,
    spellAuraColor: chosen.color,
    incantation: `Verbum ${chosen.word} Awaken!`,
    scientificConcept: chosen.concept,
  }

  // Create sockets
  const socketWidth = Math.max(70, Math.min(110, 360 / parts.length))
  const startX = 400 - (parts.length * (socketWidth + 12)) / 2 + socketWidth / 2

  const sockets: AnvilSocket[] = parts.map((part, idx) => ({
    id: `socket_${idx}`,
    positionIndex: idx,
    expectedText: part,
    placedRune: null,
    label: `Rune Slot ${idx + 1}`,
    x: startX + idx * (socketWidth + 12),
    y: 260,
    width: socketWidth,
    height: 64,
  }))

  // Create target rune blocks
  const targetRunes: RuneBlock[] = parts.map((part, idx) => ({
    id: `rune_target_${idx}_${part}`,
    text: part,
    phonemeSound: `/${part.toLowerCase()}/`,
    type: difficulty === 'hard' ? 'root' : parts.length > 2 ? 'letter' : 'onset',
    color: RUNE_COLORS[idx % RUNE_COLORS.length],
    glowColor: RUNE_COLORS[idx % RUNE_COLORS.length],
    isDistractor: false,
  }))

  // Create distractor runes
  const distractorPool = DISTRACTOR_RUNES[difficulty]
  const numDistractors = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 3 : 2
  const distractors: RuneBlock[] = []

  for (let i = 0; i < numDistractors; i++) {
    const text = distractorPool[(Math.floor(prng() * distractorPool.length) + i) % distractorPool.length]
    distractors.push({
      id: `rune_distractor_${i}_${text}`,
      text,
      phonemeSound: `/${text.toLowerCase()}/`,
      type: difficulty === 'hard' ? 'root' : 'letter',
      color: '#94a3b8',
      glowColor: 'rgba(148, 163, 184, 0.4)',
      isDistractor: true,
    })
  }

  // Shuffle available runes deterministically
  const allRunes = [...targetRunes, ...distractors]
  for (let i = allRunes.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = allRunes[i]
    allRunes[i] = allRunes[j]
    allRunes[j] = temp
  }

  return {
    id: wordId,
    title: `Forge the ${chosen.theme}`,
    difficulty,
    tierNumber: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1,
    parMoves: parts.length,
    targetWord,
    sockets,
    availableRunes: allRunes,
    distractorRunes: distractors,
  }
}

/**
 * Load or generate spellforge challenge based on seed or curated list
 */
export function generateSpellforgeChallenge(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): SpellforgeChallenge {
  const filtered = CURATED_SPELLFORGE_WORDS.filter((w) => w.tier === difficulty)

  if (typeof seed === 'number' && seed < filtered.length) {
    const word = filtered[seed] || filtered[0]
    const parts = word.phonicsBreakdown
    const socketWidth = Math.max(70, Math.min(110, 360 / parts.length))
    const startX = 400 - (parts.length * (socketWidth + 12)) / 2 + socketWidth / 2

    const sockets: AnvilSocket[] = parts.map((part, idx) => ({
      id: `socket_${idx}`,
      positionIndex: idx,
      expectedText: part,
      placedRune: null,
      label: `Rune Slot ${idx + 1}`,
      x: startX + idx * (socketWidth + 12),
      y: 260,
      width: socketWidth,
      height: 64,
    }))

    const targetRunes: RuneBlock[] = parts.map((part, idx) => ({
      id: `rune_target_${idx}_${part}`,
      text: part,
      phonemeSound: `/${part.toLowerCase()}/`,
      type: difficulty === 'hard' ? 'root' : 'letter',
      color: RUNE_COLORS[idx % RUNE_COLORS.length],
      glowColor: RUNE_COLORS[idx % RUNE_COLORS.length],
      isDistractor: false,
    }))

    const distractors: RuneBlock[] = DISTRACTOR_RUNES[difficulty].slice(0, 3).map((text, idx) => ({
      id: `rune_curated_distractor_${idx}_${text}`,
      text,
      phonemeSound: `/${text.toLowerCase()}/`,
      type: 'letter',
      color: '#94a3b8',
      glowColor: 'rgba(148, 163, 184, 0.4)',
      isDistractor: true,
    }))

    const allRunes = [...targetRunes, ...distractors]

    return {
      id: `curated_spell_${word.id}_${seed}`,
      title: `Forge: ${word.targetWord}`,
      difficulty,
      tierNumber: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1,
      parMoves: parts.length,
      targetWord: word,
      sockets,
      availableRunes: allRunes,
      distractorRunes: distractors,
    }
  }

  return generateProceduralSpellforgeChallenge(seed, difficulty, explorerLevel)
}

// ============================================================================
// 4. ENGINE STATE REDUCER & INITIALIZER
// ============================================================================

export function getInitialSpellforgeState(challenge: SpellforgeChallenge): SpellforgeState {
  return {
    currentChallenge: challenge,
    status: 'forging',
    placedRunes: {},
    activeDragRune: null,
    hammerSwing: 0,
    movesCount: 0,
    timeElapsedSeconds: 0,
    mistakesCount: 0,
    telemetry: {
      challengeId: challenge.id,
      difficulty: challenge.difficulty,
      movesCount: 0,
      timeElapsedSeconds: 0,
      mistakesCount: 0,
      score: 0,
      stars: 0,
      xp: 0,
      finalStatus: 'in_progress',
    },
  }
}

export function evaluateSpellforgeAction(
  state: SpellforgeState,
  action: SpellforgeAction
): SpellforgeState {
  switch (action.type) {
    case 'SELECT_RUNE': {
      return {
        ...state,
        activeDragRune: action.rune,
      }
    }

    case 'SNAP_RUNE_TO_SOCKET': {
      const { socketId, rune } = action
      const socket = state.currentChallenge.sockets.find((s) => s.id === socketId)
      if (!socket) return state

      const isCorrect = socket.expectedText.toUpperCase() === rune.text.toUpperCase()
      const newPlaced = { ...state.placedRunes, [socketId]: rune }
      const newMistakes = isCorrect ? state.mistakesCount : state.mistakesCount + 1

      // Check if all sockets are correctly filled
      const allFilledCorrectly = state.currentChallenge.sockets.every((s) => {
        const placed = newPlaced[s.id]
        return placed && placed.text.toUpperCase() === s.expectedText.toUpperCase()
      })

      return {
        ...state,
        placedRunes: newPlaced,
        activeDragRune: null,
        movesCount: state.movesCount + 1,
        mistakesCount: newMistakes,
        status: allFilledCorrectly ? 'hammer_ready' : 'forging',
      }
    }

    case 'REMOVE_RUNE_FROM_SOCKET': {
      const { socketId } = action
      const newPlaced = { ...state.placedRunes }
      delete newPlaced[socketId]

      return {
        ...state,
        placedRunes: newPlaced,
        status: 'forging',
      }
    }

    case 'CLEAR_ANVIL': {
      return {
        ...state,
        placedRunes: {},
        status: 'forging',
      }
    }

    case 'TRIGGER_HAMMER_STRIKE': {
      if (state.status !== 'hammer_ready' && state.status !== 'forged') return state

      const scoreResult = calculateSpellforgeScore(state.telemetry, state.currentChallenge)

      return {
        ...state,
        status: 'forged',
        hammerSwing: 1,
        telemetry: {
          ...state.telemetry,
          movesCount: state.movesCount,
          timeElapsedSeconds: state.timeElapsedSeconds,
          mistakesCount: state.mistakesCount,
          score: scoreResult.score,
          stars: scoreResult.stars,
          xp: scoreResult.xp,
          finalStatus: 'solved',
        },
      }
    }

    case 'TICK_TIMER': {
      if (state.status === 'celebrating' || state.status === 'forged') return state
      return {
        ...state,
        timeElapsedSeconds: state.timeElapsedSeconds + action.deltaSeconds,
      }
    }

    case 'RESET_CHALLENGE': {
      return getInitialSpellforgeState(state.currentChallenge)
    }

    case 'LOAD_CHALLENGE': {
      return getInitialSpellforgeState(action.challenge)
    }

    default:
      return state
  }
}

// ============================================================================
// 5. SCORING & REWARDS
// ============================================================================

export function calculateSpellforgeScore(
  telemetry: SpellforgeTelemetry,
  challenge: SpellforgeChallenge
): { score: number; stars: number; xp: number } {
  let score = 100

  // Penalty for extra moves beyond par
  const extraMoves = Math.max(0, telemetry.movesCount - challenge.parMoves)
  score -= extraMoves * 5

  // Penalty for mistakes
  score -= telemetry.mistakesCount * 10

  // Time penalty over 60s
  if (telemetry.timeElapsedSeconds > 60) {
    const extraTime = telemetry.timeElapsedSeconds - 60
    score -= Math.min(20, Math.floor(extraTime / 5) * 2)
  }

  score = Math.max(50, Math.min(100, score))

  let stars = 3
  if (score >= 90) stars = 5
  else if (score >= 75) stars = 4

  const baseXP = challenge.difficulty === 'hard' ? 45 : challenge.difficulty === 'medium' ? 35 : 25
  const xp = baseXP + (stars >= 5 ? 10 : 0)

  return { score, stars, xp }
}
