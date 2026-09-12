import type { DifficultyTier } from '../../types/experience'
import type {
  RelicItem,
  MuseumCard,
  MuseumExhibition,
  MemoryMuseumChallenge,
  MemoryMuseumState,
  MemoryMuseumAction,
  MemoryMuseumTelemetry,
} from '../../types/games/memoryMuseum'

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
// 2. CURATED MASTER EXHIBITIONS & RELIC CATALOG
// ============================================================================

export const MASTER_EXHIBITIONS: MuseumExhibition[] = [
  {
    id: 'exhibit_astronomy',
    themeTitle: 'Celestial Observatory & Starlight Relics',
    themeEmoji: '🌌',
    themeColor: '#38bdf8',
    curatorName: 'Professor Luna Moth',
    curatorAvatar: '🦋',
    curatorQuote: 'The cosmic gallery holds ancient navigation instruments and meteor crystals from across the galaxy!',
    celebrationQuote: 'Marvelous spatial recall! Every stellar relic is restored to its proper orbital pedestal!',
    scientificConcept: {
      conceptTitle: 'Visual Spatial Mapping & Astrolabes',
      scienceTopic: 'Spatial Memory & Celestial Navigation',
      funFact: 'Ancient mariners could calculate their exact latitude at night using brass astrolabes to measure the North Star!',
      kidExplanation: 'Your brain creates a mental map of where objects are located, just like astronomers map the constellations.',
    },
  },
  {
    id: 'exhibit_fossils',
    themeTitle: 'Prehistoric Paleontology Hall',
    themeEmoji: '🦖',
    themeColor: '#f59e0b',
    curatorName: 'Barnaby Bear, Chief Paleontologist',
    curatorAvatar: '🐻',
    curatorQuote: 'Help me match these fossilized dinosaur teeth, ammonites, and prehistoric amber specimens!',
    celebrationQuote: 'Spectacular fossil reconstruction! The prehistoric exhibition is fully restored!',
    scientificConcept: {
      conceptTitle: 'Working Memory Capacity & Fossil Stratigraphy',
      scienceTopic: 'Working Memory & Paleontological Preservation',
      funFact: 'Amber is fossilized tree resin that can preserve delicate insects and feathers for over 100 million years!',
      kidExplanation: 'Working memory lets your brain hold multiple clues in your mind at once while you search for matches.',
    },
  },
  {
    id: 'exhibit_ocean',
    themeTitle: 'Abyssal Oceanography Vault',
    themeEmoji: '🐙',
    themeColor: '#06b6d4',
    curatorName: 'Octo Scribe, Grand Archivist',
    curatorAvatar: '🐙',
    curatorQuote: 'Deep ocean trenches hold bioluminescent pearls, nautilus spirals, and sunken golden compasses!',
    celebrationQuote: 'Brilliant underwater taxonomy! The deep sea vault shines with luminous clarity!',
    scientificConcept: {
      conceptTitle: 'Pattern Recognition & Bioluminescence',
      scienceTopic: 'Visual Feature Binding & Marine Biology',
      funFact: 'Over 90% of creatures living in the deep ocean twilight zone produce their own living light!',
      kidExplanation: 'When you look at shapes and colors, your visual cortex binds them together into unforgettable memory icons.',
    },
  },
  {
    id: 'exhibit_botany',
    themeTitle: 'Enchanted Botanical Conservatory',
    themeEmoji: '🌿',
    themeColor: '#10b981',
    curatorName: 'Pippin Hedgehog, Herbologist',
    curatorAvatar: '🦔',
    curatorQuote: 'The greenhouse contains rare nocturnal moonflowers, solar bonsai saplings, and frost crystals!',
    celebrationQuote: 'Incredible botanical intuition! The enchanted gardens have blossomed into vibrant life!',
    scientificConcept: {
      conceptTitle: 'Chunking Strategies & Plant Taxonomy',
      scienceTopic: 'Cognitive Chunking & Botanical Symmetry',
      funFact: 'Sunflower seed spirals follow the Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21...) for perfect packing!',
      kidExplanation: 'Grouping items by colors and categories (chunking) makes remembering long lists much easier and faster.',
    },
  },
]

export const MASTER_RELIC_POOL: RelicItem[] = [
  // Astronomy
  {
    id: 'relic_astrolabe',
    pairId: 'pair_astrolabe',
    name: 'Gilded Astrolabe',
    emoji: '🧭',
    category: 'astronomy',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    loreSnippet: 'An ancient brass instrument used by astronomers to measure star elevations.',
  },
  {
    id: 'relic_telescope',
    pairId: 'pair_telescope',
    name: 'Starglass Telescope',
    emoji: '🔭',
    category: 'astronomy',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    loreSnippet: 'Polished sapphire lenses that bring distant planetary rings into sharp view.',
  },
  {
    id: 'relic_meteorite',
    pairId: 'pair_meteorite',
    name: 'Cosmic Meteorite',
    emoji: '☄️',
    category: 'astronomy',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    loreSnippet: 'An iron-nickel celestial fragment that fell from the Kuiper asteroid belt.',
  },
  {
    id: 'relic_orrery',
    pairId: 'pair_orrery',
    name: 'Clockwork Orrery',
    emoji: '🪐',
    category: 'astronomy',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    loreSnippet: 'Gilded mechanical spheres revolving in exact mathematical planetary orbits.',
  },

  // Paleontology
  {
    id: 'relic_ammonite',
    pairId: 'pair_ammonite',
    name: 'Spiral Ammonite',
    emoji: '🐚',
    category: 'paleontology',
    color: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    loreSnippet: 'A fossilized spiral chamber shell that once drifted across ancient Jurassic seas.',
  },
  {
    id: 'relic_amber_fly',
    pairId: 'pair_amber_fly',
    name: 'Golden Amber Fossil',
    emoji: '🪲',
    category: 'paleontology',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    loreSnippet: 'Prehistoric tree resin encapsulating an ancient iridescent winged insect.',
  },
  {
    id: 'relic_dino_skull',
    pairId: 'pair_dino_skull',
    name: 'Fossilized Raptor Tooth',
    emoji: '🦖',
    category: 'paleontology',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    loreSnippet: 'A serrated predator tooth preserved in Mesozoic limestone bedrock.',
  },
  {
    id: 'relic_trilobite',
    pairId: 'pair_trilobite',
    name: 'Carved Trilobite',
    emoji: '🦕',
    category: 'paleontology',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    loreSnippet: 'An armored arthropod exoskeleton from the ancient Cambrian explosion.',
  },

  // Oceanography
  {
    id: 'relic_biolume_pearl',
    pairId: 'pair_biolume_pearl',
    name: 'Luminous Abyssal Pearl',
    emoji: '🦪',
    category: 'oceanography',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    loreSnippet: 'A glowing pearl harvested from deep marine hydrothermal vent trenches.',
  },
  {
    id: 'relic_nautilus',
    pairId: 'pair_nautilus',
    name: 'Prismatic Nautilus',
    emoji: '🦑',
    category: 'oceanography',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    loreSnippet: 'A cephalopod shell demonstrating perfect mathematical logarithmic spiral curves.',
  },
  {
    id: 'relic_coral_crown',
    pairId: 'pair_coral_crown',
    name: 'Living Coral Crown',
    emoji: '🪸',
    category: 'oceanography',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    loreSnippet: 'A delicate calcium carbonate structure sculpted by millions of microscopic polyps.',
  },
  {
    id: 'relic_sunken_chalice',
    pairId: 'pair_sunken_chalice',
    name: 'Sunken Gilded Chalice',
    emoji: '🏆',
    category: 'oceanography',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    loreSnippet: 'An ornate gold goblet recovered from a sunken ancient Mediterranean flagship.',
  },

  // Botany
  {
    id: 'relic_moonflower',
    pairId: 'pair_moonflower',
    name: 'Midnight Moonflower',
    emoji: '🌺',
    category: 'botany',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    loreSnippet: 'A nocturnal blossom that only unfurls its fragrant petals beneath starlight.',
  },
  {
    id: 'relic_solar_bonsai',
    pairId: 'pair_solar_bonsai',
    name: 'Solar Bonsai Sapling',
    emoji: '🌲',
    category: 'botany',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    loreSnippet: 'A miniature thousand-year-old cedar tree with leaves that store warm sunlight.',
  },
  {
    id: 'relic_frost_fern',
    pairId: 'pair_frost_fern',
    name: 'Crystalline Frost Fern',
    emoji: '❄️',
    category: 'botany',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.6)',
    loreSnippet: 'A rare high-altitude alpine plant coated in permanent geometric frost lattices.',
  },
  {
    id: 'relic_ancient_scroll',
    pairId: 'pair_ancient_scroll',
    name: 'Botanical Herbarium Scroll',
    emoji: '📜',
    category: 'botany',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    loreSnippet: 'Illuminated parchment detailing medicinal healing roots and flower tinctures.',
  },
]

// ============================================================================
// 3. PROCEDURAL MEMORY MUSEUM GENERATOR
// ============================================================================

/**
 * Generates infinite procedural spatial memory challenges
 */
export function generateProceduralMemoryMuseumChallenge(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): MemoryMuseumChallenge {
  const prng = createPRNG(`${seed}_museum_${difficulty}_${explorerLevel}`)

  // Pick exhibition theme
  const exhibitIndex = Math.floor(prng() * MASTER_EXHIBITIONS.length)
  const exhibition = MASTER_EXHIBITIONS[exhibitIndex]

  // Determine grid dimensions based on difficulty
  let rows = 2
  let cols = 4
  let pairCount = 4

  if (difficulty === 'easy') {
    // Easy: 4x2 = 8 cards (4 pairs) or 4x3 = 12 cards (6 pairs)
    rows = 2
    cols = 4
    pairCount = 4
  } else if (difficulty === 'medium') {
    // Medium: 4x4 = 16 cards (8 pairs)
    rows = 4
    cols = 4
    pairCount = 8
  } else {
    // Hard: 5x4 = 20 cards (10 pairs) or 6x4 = 24 cards (12 pairs)
    rows = 4
    cols = 5
    pairCount = 10
  }

  // Pick distinct relic pairs from the master pool
  const shuffledRelics = [...MASTER_RELIC_POOL]
  for (let i = shuffledRelics.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = shuffledRelics[i]
    shuffledRelics[i] = shuffledRelics[j]
    shuffledRelics[j] = temp
  }

  const selectedRelics = shuffledRelics.slice(0, pairCount)

  // Duplicate each relic to form matched pairs (Card A and Card B)
  const cardList: MuseumCard[] = []

  selectedRelics.forEach((relic, idx) => {
    // Card A
    cardList.push({
      instanceId: `card_${relic.id}_a_${idx}`,
      relic,
      gridIndex: 0,
      row: 0,
      col: 0,
      isFlipped: false,
      isMatched: false,
      flipAngleDeg: 0,
    })
    // Card B
    cardList.push({
      instanceId: `card_${relic.id}_b_${idx}`,
      relic,
      gridIndex: 0,
      row: 0,
      col: 0,
      isFlipped: false,
      isMatched: false,
      flipAngleDeg: 0,
    })
  })

  // Shuffle grid layout deterministically
  for (let i = cardList.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    const temp = cardList[i]
    cardList[i] = cardList[j]
    cardList[j] = temp
  }

  // Assign grid indices, rows, cols
  cardList.forEach((card, idx) => {
    card.gridIndex = idx
    card.row = Math.floor(idx / cols)
    card.col = idx % cols
  })

  const challengeId = `proc_museum_${String(seed).slice(0, 10)}_${difficulty}`

  return {
    id: challengeId,
    title: `${exhibition.themeTitle}`,
    difficulty,
    tierNumber: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1,
    rows,
    cols,
    totalPairs: pairCount,
    parMoves: Math.round(pairCount * 1.6),
    timeTargetSeconds: pairCount * 10,
    exhibition,
    cards: cardList,
  }
}

/**
 * Load or generate memory museum challenge
 */
export function generateMemoryMuseumChallenge(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): MemoryMuseumChallenge {
  return generateProceduralMemoryMuseumChallenge(seed, difficulty, explorerLevel)
}

// ============================================================================
// 4. ENGINE STATE REDUCER & INITIALIZER
// ============================================================================

export function getInitialMemoryMuseumState(challenge: MemoryMuseumChallenge): MemoryMuseumState {
  return {
    currentChallenge: challenge,
    status: 'playing',
    cards: challenge.cards.map((c) => ({ ...c, isFlipped: false, isMatched: false, flipAngleDeg: 0 })),
    selectedCardIndices: [],
    matchedPairIds: [],
    movesCount: 0,
    mistakesCount: 0,
    timeElapsedSeconds: 0,
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

export function evaluateMemoryMuseumAction(
  state: MemoryMuseumState,
  action: MemoryMuseumAction
): MemoryMuseumState {
  switch (action.type) {
    case 'FLIP_CARD': {
      const { cardIndex } = action
      const card = state.cards[cardIndex]

      if (!card || card.isFlipped || card.isMatched || state.status === 'checking_match') {
        return state
      }

      const newSelected = [...state.selectedCardIndices, cardIndex]
      const newCards = state.cards.map((c, idx) => (idx === cardIndex ? { ...c, isFlipped: true } : c))

      if (newSelected.length === 1) {
        return {
          ...state,
          cards: newCards,
          selectedCardIndices: newSelected,
        }
      }

      if (newSelected.length === 2) {
        const firstIndex = newSelected[0]
        const secondIndex = newSelected[1]
        const card1 = newCards[firstIndex]
        const card2 = newCards[secondIndex]

        const isMatch = card1.relic.pairId === card2.relic.pairId

        if (isMatch) {
          const newMatchedPairIds = [...state.matchedPairIds, card1.relic.pairId]
          const matchedCards = newCards.map((c) =>
            c.relic.pairId === card1.relic.pairId ? { ...c, isMatched: true, isFlipped: true } : c
          )

          const allRestored = newMatchedPairIds.length >= state.currentChallenge.totalPairs
          const newMoves = state.movesCount + 1

          const updatedTelemetry: MemoryMuseumTelemetry = {
            ...state.telemetry,
            movesCount: newMoves,
            timeElapsedSeconds: state.timeElapsedSeconds,
            mistakesCount: state.mistakesCount,
            finalStatus: allRestored ? 'solved' : 'in_progress',
          }

          if (allRestored) {
            const scoreResult = calculateMemoryMuseumScore(updatedTelemetry, state.currentChallenge)
            updatedTelemetry.score = scoreResult.score
            updatedTelemetry.stars = scoreResult.stars
            updatedTelemetry.xp = scoreResult.xp
          }

          return {
            ...state,
            cards: matchedCards,
            selectedCardIndices: [],
            matchedPairIds: newMatchedPairIds,
            movesCount: newMoves,
            status: allRestored ? 'restored' : 'playing',
            telemetry: updatedTelemetry,
          }
        } else {
          return {
            ...state,
            cards: newCards,
            selectedCardIndices: newSelected,
            movesCount: state.movesCount + 1,
            mistakesCount: state.mistakesCount + 1,
            status: 'checking_match',
          }
        }
      }

      return state
    }

    case 'RESOLVE_MATCH_CHECK': {
      if (state.selectedCardIndices.length < 2) return state

      const unflipCards = state.cards.map((c, idx) =>
        state.selectedCardIndices.includes(idx) && !c.isMatched ? { ...c, isFlipped: false } : c
      )

      return {
        ...state,
        cards: unflipCards,
        selectedCardIndices: [],
        status: 'playing',
      }
    }

    case 'TICK_TIMER': {
      if (state.status === 'celebrating' || state.status === 'restored') return state
      return {
        ...state,
        timeElapsedSeconds: state.timeElapsedSeconds + action.deltaSeconds,
      }
    }

    case 'RESET_CHALLENGE': {
      return getInitialMemoryMuseumState(state.currentChallenge)
    }

    case 'LOAD_CHALLENGE': {
      return getInitialMemoryMuseumState(action.challenge)
    }

    default:
      return state
  }
}

// ============================================================================
// 5. SCORING & REWARDS
// ============================================================================

export function calculateMemoryMuseumScore(
  telemetry: MemoryMuseumTelemetry,
  challenge: MemoryMuseumChallenge
): { score: number; stars: number; xp: number } {
  let score = 100

  // Penalty for moves beyond par
  const extraMoves = Math.max(0, telemetry.movesCount - challenge.parMoves)
  score -= extraMoves * 4

  // Penalty for mistakes
  score -= telemetry.mistakesCount * 6

  // Time penalty over time target
  if (telemetry.timeElapsedSeconds > challenge.timeTargetSeconds) {
    const extraTime = telemetry.timeElapsedSeconds - challenge.timeTargetSeconds
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
