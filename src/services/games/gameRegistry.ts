import type { CognitiveDomain, DifficultyTier } from '../../types/experience'

/**
 * 🎮 Canonical 10-Game Procedural Engine Identifiers
 */
export type ProceduralGameId =
  | 'creature_alchemist'
  | 'clockwork_physics'
  | 'midnight_detective'
  | 'apothecary_scales'
  | 'spellforge_anvil'
  | 'memory_museum'
  | 'rhythm_conductor'
  | 'robopath_academy'
  | 'ecosystem_sandbox'
  | 'cosmic_constellation'

export type GameLifecycleStatus = 'playable' | 'coming_soon' | 'in_development'

/**
 * 🎲 Deterministic PRNG Generator Contract
 */
export interface SeededPRNG {
  seed: number
  next(): number // [0, 1)
  int(min: number, max: number): number // [min, max] inclusive
  float(min: number, max: number): number
  pick<T>(items: T[]): T
  shuffle<T>(items: T[]): T[]
  sample<T>(items: T[], count: number): T[]
  chance(probability: number): boolean
}

/**
 * 🧬 Generic Procedural Challenge Descriptor generated from PRNG seeds
 */
export interface ProceduralChallengeDescriptor {
  gameId: ProceduralGameId
  seed: number
  difficulty: DifficultyTier
  title: string
  subtitle: string
  scientificConcept: {
    name: string
    explanation: string
    funFact: string
  }
  parMoves: number
  timeTargetSeconds: number
  rewardXP: number
  rewardStars: number
  parameters: Record<string, unknown>
}

/**
 * 🏛️ Comprehensive Metadata Contract for every Procedural Mini-Game Engine
 */
export interface ProceduralGameMetadata {
  id: ProceduralGameId
  title: string
  codename: string
  discipline: string
  primaryDomain: CognitiveDomain
  secondaryDomains: CognitiveDomain[]
  ageRange: { min: number; max: number }
  route: string
  status: GameLifecycleStatus
  isPlayable: boolean
  emoji: string
  svgIcon: string
  gradientBanner: string
  accentGlow: string
  description: string
  learningObjectives: string[]
  pedagogicalRationale: string
  keyMechanics: string[]
  physicsEngineType: string
  renderBackend: 'canvas_2d' | 'webgl_spring' | 'hybrid_dom_canvas'
  prngHooks: {
    createSeed: (childId?: string, challengeIndex?: number) => number
    generateChallenge: (seed: number, tier?: DifficultyTier) => ProceduralChallengeDescriptor
  }
}

// ============================================================================
// 🎲 MULBERRY32 DETERMINISTIC PRNG ENGINE
// ============================================================================

export function createPRNG(seedInput: number | string): SeededPRNG {
  let seed =
    typeof seedInput === 'number'
      ? Math.floor(Math.abs(seedInput)) || 1337
      : hashStringToSeed(seedInput)

  function next(): number {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  function int(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min
  }

  function float(min: number, max: number): number {
    return next() * (max - min) + min
  }

  function pick<T>(items: T[]): T {
    if (!items.length) throw new Error('Cannot pick from empty array')
    return items[int(0, items.length - 1)]
  }

  function shuffle<T>(items: T[]): T[] {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1))
      const temp = copy[i]
      copy[i] = copy[j]
      copy[j] = temp
    }
    return copy
  }

  function sample<T>(items: T[], count: number): T[] {
    const shuffled = shuffle(items)
    return shuffled.slice(0, Math.min(count, items.length))
  }

  function chance(probability: number): boolean {
    return next() < probability
  }

  return {
    seed,
    next,
    int,
    float,
    pick,
    shuffle,
    sample,
    chance,
  }
}

export function hashStringToSeed(str: string): number {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0 || 1337
}

export function generateGameSessionSeed(gameId: string, childId = 'guest', salt: number | string = 0): number {
  return hashStringToSeed(`${gameId}:${childId}:${salt}:${Date.now()}`)
}

// ============================================================================
// 🎨 MASTER SVG ICON REPOSITORY
// ============================================================================

export const GAME_SVG_ICONS: Record<ProceduralGameId, string> = {
  creature_alchemist: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6H30M24 6V16L12 36C10.5 38.5 12.3 42 15.2 42H32.8C35.7 42 37.5 38.5 36 36L24 16" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 32C18 30 22 34 26 31C30 28 33 32 33 32" stroke="#ec4899" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="21" cy="26" r="2" fill="#38bdf8"/>
    <circle cx="27" cy="22" r="1.5" fill="#fbbf24"/>
  </svg>`,

  clockwork_physics: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="16" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4 3"/>
    <circle cx="24" cy="24" r="7" stroke="#fbbf24" stroke-width="2.5"/>
    <path d="M24 8V12M24 36V40M8 24H12M36 24H40M13 13L16 16M32 32L35 35M13 35L16 32M32 16L35 13" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="2.5" fill="#f59e0b"/>
  </svg>`,

  midnight_detective: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="13" stroke="#a855f7" stroke-width="3.5"/>
    <path d="M30 30L42 42" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="18" cy="18" r="4" stroke="#c084fc" stroke-width="2"/>
    <path d="M12 8L15 11M28 8L25 11" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  apothecary_scales: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6V42M14 42H34M8 14H40" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    <path d="M8 14L4 26C4 28.5 7.5 30 10 30C12.5 30 16 28.5 16 26L12 14" stroke="#34d399" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M36 14L32 26C32 28.5 35.5 30 38 30C40.5 30 44 28.5 44 26L40 14" stroke="#34d399" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="24" cy="14" r="3" fill="#fbbf24"/>
  </svg>`,

  spellforge_anvil: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 20H40C40 20 42 26 36 28L34 38H14L12 28C6 26 8 20 8 20Z" stroke="#f97316" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 8L30 14H18L24 8Z" stroke="#fbbf24" stroke-width="2.5" fill="rgba(251, 191, 36, 0.3)"/>
    <path d="M16 24L24 28L32 24" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  memory_museum: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18L24 8L42 18V22H6V18Z" stroke="#c084fc" stroke-width="3" stroke-linejoin="round"/>
    <path d="M10 22V38M18 22V38M30 22V38M38 22V38" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M6 38H42V42H6V38Z" stroke="#c084fc" stroke-width="3"/>
    <circle cx="24" cy="30" r="3" fill="#f43f5e"/>
  </svg>`,

  rhythm_conductor: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 36V16L34 10V30" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="10" cy="36" r="4" fill="#38bdf8"/>
    <circle cx="30" cy="30" r="4" fill="#2dd4bf"/>
    <path d="M14 20L34 14" stroke="#06b6d4" stroke-width="3"/>
    <path d="M38 8L42 12M42 8L38 12" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  robopath_academy: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="28" height="24" rx="6" stroke="#3b82f6" stroke-width="3"/>
    <circle cx="18" cy="24" r="3" fill="#60a5fa"/>
    <circle cx="30" cy="24" r="3" fill="#60a5fa"/>
    <path d="M20 32H28" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M24 14V8M20 8H28" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M6 26H10M38 26H42" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  ecosystem_sandbox: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 32C12 20 20 12 36 10C38 26 30 34 18 38L8 32Z" stroke="#10b981" stroke-width="3" stroke-linejoin="round"/>
    <path d="M8 32C16 30 26 24 36 10" stroke="#34d399" stroke-width="2"/>
    <path d="M18 24C22 28 28 28 32 26" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="18" r="2" fill="#6ee7b7"/>
  </svg>`,

  cosmic_constellation: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 38L18 22L32 28L40 10" stroke="#ec4899" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3"/>
    <circle cx="10" cy="38" r="3.5" fill="#f43f5e" stroke="#fff" stroke-width="1.5"/>
    <circle cx="18" cy="22" r="4.5" fill="#a855f7" stroke="#fff" stroke-width="1.5"/>
    <circle cx="32" cy="28" r="3.5" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>
    <circle cx="40" cy="10" r="5" fill="#fbbf24" stroke="#fff" stroke-width="1.5"/>
  </svg>`,
}

// ============================================================================
// 🏛️ MASTER 10-GAME PROCEDURAL REGISTRY
// ============================================================================

export const PROCEDURAL_GAME_REGISTRY: Record<ProceduralGameId, ProceduralGameMetadata> = {
  // 1. Creature Alchemist
  creature_alchemist: {
    id: 'creature_alchemist',
    title: 'Creature Alchemist',
    codename: 'alchemist_cauldron',
    discipline: 'Chemistry & Taxonomy',
    primaryDomain: 'creativity',
    secondaryDomains: ['logic', 'vocabulary'],
    ageRange: { min: 4, max: 10 },
    route: '/games/creature-lab',
    status: 'playable',
    isPlayable: true,
    emoji: '🧪',
    svgIcon: GAME_SVG_ICONS.creature_alchemist,
    gradientBanner: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #ec4899 100%)',
    accentGlow: 'rgba(236, 72, 153, 0.5)',
    description: 'Synthesize elemental starlight essences in an enchanted bubbling cauldron to discover 24 mythical species, learn taxonomic families, and master hypothesis testing.',
    learningObjectives: [
      'Chemical Reactions & Energy States',
      'Taxonomic Classification (Lumina, Flora, Aero, Ignis, Cosmic)',
      'Scientific Hypothesis Testing',
      'Observation & Empirical Deduction',
    ],
    pedagogicalRationale: 'Encourages experimental curiosity and systematic categorization through visual and tactile chemistry analogues with zero punitive failure.',
    keyMechanics: ['Essence Drag & Drop', 'Harmonic Viscosity Blending', 'Prediction & Hatching', 'Almanac Species Tracking'],
    physicsEngineType: 'Fluid Viscosity & Particle Blend Solver',
    renderBackend: 'hybrid_dom_canvas',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`alchemist:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const concepts = [
          { name: 'Bioluminescence', explanation: 'Chemical energy transformed into cold organic light.', funFact: 'Fireflies light up without generating any heat.' },
          { name: 'Photosynthesis', explanation: 'Plants convert sunlight into chemical energy.', funFact: 'Phytoplankton create over half the Earth’s oxygen.' },
          { name: 'Thermodynamics', explanation: 'Heat moves from warmer matter to cooler surroundings.', funFact: 'Lava rocks can retain heat for thousands of hours.' },
        ]
        const concept = prng.pick(concepts)
        return {
          gameId: 'creature_alchemist',
          seed,
          difficulty: tier,
          title: `Alchemical Hypothesis #${prng.int(101, 999)}`,
          subtitle: `Investigate the secrets of ${concept.name}`,
          scientificConcept: concept,
          parMoves: tier === 'hard' ? 4 : tier === 'medium' ? 3 : 2,
          timeTargetSeconds: 60,
          rewardXP: tier === 'hard' ? 60 : tier === 'medium' ? 45 : 30,
          rewardStars: 10,
          parameters: { targetFamily: prng.pick(['lumina', 'flora', 'aero', 'cosmic']), requiredEssenceCount: 2 },
        }
      },
    },
  },

  // 2. Clockwork Physics Lab
  clockwork_physics: {
    id: 'clockwork_physics',
    title: 'Clockwork Physics Lab',
    codename: 'magic_machine',
    discipline: 'Engineering & Energy',
    primaryDomain: 'logic',
    secondaryDomains: ['creativity'],
    ageRange: { min: 4, max: 12 },
    route: '/playroom/magic-machine',
    status: 'playable',
    isPlayable: true,
    emoji: '⚙️',
    svgIcon: GAME_SVG_ICONS.clockwork_physics,
    gradientBanner: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #06b6d4 100%)',
    accentGlow: 'rgba(37, 99, 235, 0.5)',
    description: 'Construct ingenious Rube Goldberg machines using ramps, springs, magnets, and updraft blowers to guide celestial Sproutlings safely into the Star Cradle.',
    learningObjectives: [
      'Conservation of Momentum & Kinetic Energy',
      'Gravitational Acceleration & Parabolic Trajectories',
      'Magnetic Flux & Vector Directionality',
      'Iterative Engineering & Debugging Loops',
    ],
    pedagogicalRationale: 'Instills mechanical intuition by allowing children to witness immediate, deterministic cause-and-effect in an authentic 2D rigid-body simulation.',
    keyMechanics: ['Tactile Grid Placement', 'Deterministic Verlet Physics Loop', 'Safe Iteration Sandbox', 'Star Cradle Collision Triggers'],
    physicsEngineType: '2D Rigid Body + Verlet Integrator + Collision Manifold',
    renderBackend: 'canvas_2d',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`clockwork:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const concepts = [
          { name: 'Kinetic Energy', explanation: 'Energy an object possesses due to its motion.', funFact: 'A rolling boulder gains speed as potential energy converts to kinetic.' },
          { name: 'Magnetic Attraction', explanation: 'Opposite magnetic poles attract while like poles repel.', funFact: 'Earth is a giant magnet surrounded by a protective magnetic shield.' },
          { name: 'Elastic Potential', explanation: 'Energy stored when mechanical springs are compressed.', funFact: 'Grasshoppers use organic spring joints to jump 20x their body length.' },
        ]
        const concept = prng.pick(concepts)
        return {
          gameId: 'clockwork_physics',
          seed,
          difficulty: tier,
          title: `Contraption Sector ${prng.int(1, 12)}`,
          subtitle: `Harness ${concept.name} to guide the Sproutling`,
          scientificConcept: concept,
          parMoves: tier === 'hard' ? 4 : tier === 'medium' ? 3 : 2,
          timeTargetSeconds: 90,
          rewardXP: tier === 'hard' ? 70 : tier === 'medium' ? 50 : 35,
          rewardStars: 12,
          parameters: { startX: 100, startY: 100, goalX: 700, goalY: 400, obstacleCount: tier === 'hard' ? 3 : 1 },
        }
      },
    },
  },

  // 3. Midnight Noir Detective
  midnight_detective: {
    id: 'midnight_detective',
    title: 'Midnight Noir Detective',
    codename: 'mystery_detective',
    discipline: 'Forensic Logic & Deduction',
    primaryDomain: 'logic',
    secondaryDomains: ['comprehension', 'vocabulary'],
    ageRange: { min: 4, max: 12 },
    route: '/playroom/mystery-detective',
    status: 'playable',
    isPlayable: true,
    emoji: '🔍',
    svgIcon: GAME_SVG_ICONS.midnight_detective,
    gradientBanner: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    accentGlow: 'rgba(67, 56, 202, 0.5)',
    description: 'Inspect whimsical crime scenes with UV lenses, listening horns, and rune decoders to gather evidence, evaluate alibis, and deduce culprits with formal constraint logic.',
    learningObjectives: [
      'Constraint Satisfaction & Elimination Logic',
      'Forensic Science Concepts (Optics, Acoustics, Chromatography)',
      'Critical Reading & Textual Evidence Evaluation',
      'Hypothesis Confirmation & Bias Mitigation',
    ],
    pedagogicalRationale: 'Develops formal logical reasoning by teaching children to cross-reference multiple independent constraints to arrive at unambiguous truth.',
    keyMechanics: ['Forensic Tool Belt Switcher', 'Interactive Scene Hotspot Scanning', 'Suspect Lineup Cross-Off Matrix', 'Science of Wonder Case Summaries'],
    physicsEngineType: 'Graph-Based Constraint Satisfaction Engine',
    renderBackend: 'hybrid_dom_canvas',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`detective:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const concepts = [
          { name: 'Ultraviolet Fluorescence', explanation: 'Substances absorb invisible UV light and re-emit glowing visible light.', funFact: 'Scorpions glow bright blue-green under UV light!' },
          { name: 'Acoustic Resonance', explanation: 'Sound waves vibrate physical chambers matching their natural frequency.', funFact: 'Opera singers can shatter crystal glasses by hitting resonant notes.' },
          { name: 'Optical Refraction', explanation: 'Light bends when transitioning between mediums like air and water.', funFact: 'Rainbows are caused by sunlight refracting through billions of raindrops.' },
        ]
        const concept = prng.pick(concepts)
        return {
          gameId: 'midnight_detective',
          seed,
          difficulty: tier,
          title: `The Case of the ${prng.pick(['Vanished Star Tarts', 'Gilded Telescope', 'Luminescent Feather', 'Midnight Clockwork'])}`,
          subtitle: `Apply ${concept.name} to reveal hidden clues`,
          scientificConcept: concept,
          parMoves: 3,
          timeTargetSeconds: 60,
          rewardXP: tier === 'hard' ? 65 : tier === 'medium' ? 45 : 30,
          rewardStars: 10,
          parameters: { totalSuspects: tier === 'hard' ? 5 : 3, culpritTrait: prng.pick(['tall', 'gold_fur', 'scarf', 'paw_prints']) },
        }
      },
    },
  },

  // 4. Apothecary Balance Scales
  apothecary_scales: {
    id: 'apothecary_scales',
    title: 'Apothecary Balance Scales',
    codename: 'potion_scales',
    discipline: 'Algebra & Density',
    primaryDomain: 'logic',
    secondaryDomains: ['creativity', 'vocabulary'],
    ageRange: { min: 4, max: 12 },
    route: '/playroom/potion-scales',
    status: 'playable',
    isPlayable: true,
    emoji: '⚖️',
    svgIcon: GAME_SVG_ICONS.apothecary_scales,
    gradientBanner: 'linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #06b6d4 100%)',
    accentGlow: 'rgba(13, 148, 136, 0.5)',
    description: 'Balance dual suspended pans with crystal weights, mystery pouches, and liquid density vials to brew harmonious alchemical remedies.',
    learningObjectives: [
      'Conservation of Mass & Equal Algebraic Equations',
      'Unknown Variable Solving ($x + a = b$)',
      'Liquid Volume & Relative Density Stratification',
      'Fractional Decomposition & Decimals',
    ],
    pedagogicalRationale: 'Transforms abstract algebraic equations into an intuitive physical balance experience where equal weight equals mathematical truth.',
    keyMechanics: ['Physical Fulcrum Angular Displacement', 'Tactile Weight Drag & Drop', 'Mystery Weight Deduction', 'Liquid Density Pouring'],
    physicsEngineType: 'Dual-Pan Torqued Fulcrum Moments Solver with Clamped Damping',
    renderBackend: 'hybrid_dom_canvas',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`scales:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const concepts = [
          { name: 'Conservation of Mass', explanation: 'Matter can change shapes, but its total mass remains constant.', funFact: 'When an ice cube melts into water, its weight does not change at all!' },
          { name: 'Liquid Density', explanation: 'Dense liquids sink to the bottom while lighter liquids float on top.', funFact: 'Honey is denser than water and will sink directly to the bottom of a glass.' },
          { name: 'Torque & Fulcrum Balance', explanation: 'Balance depends on both the weight and its distance from the pivot center.', funFact: 'Archimedes once said: Give me a lever long enough and I shall move the world!' },
        ]
        const concept = prng.pick(concepts)
        return {
          gameId: 'apothecary_scales',
          seed,
          difficulty: tier,
          title: `Elixir Order #${prng.int(200, 899)}`,
          subtitle: `Equilibrate the scale using ${concept.name}`,
          scientificConcept: concept,
          parMoves: tier === 'hard' ? 4 : 2,
          timeTargetSeconds: 60,
          rewardXP: tier === 'hard' ? 60 : tier === 'medium' ? 40 : 25,
          rewardStars: 10,
          parameters: { targetWeight: prng.int(5, 20), hasMysteryWeight: tier !== 'easy' },
        }
      },
    },
  },

  // 5. Spellforge Runic Anvil
  spellforge_anvil: {
    id: 'spellforge_anvil',
    title: 'Spellforge Runic Anvil',
    codename: 'spellforge',
    discipline: 'Phonics & Morpheme Spelling',
    primaryDomain: 'vocabulary',
    secondaryDomains: ['phonics', 'creativity'],
    ageRange: { min: 4, max: 10 },
    route: '/playroom/spellforge',
    status: 'playable',
    isPlayable: true,
    emoji: '🔥',
    svgIcon: GAME_SVG_ICONS.spellforge_anvil,
    gradientBanner: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fbbf24 100%)',
    accentGlow: 'rgba(234, 88, 12, 0.5)',
    description: 'Forge glowing phoneme runes and morpheme roots on an enchanted anvil to awaken living animated spells, expanding phonemic fluency and word families.',
    learningObjectives: [
      'Phonemic Synthesis & Segmenting (CVC, Blends, Digraphs)',
      'Morphology (Prefixes, Suffixes, Root Etymology)',
      'Spelling Fluency & Syllabification',
      'Vocabulary Expansion Through Word Families',
    ],
    pedagogicalRationale: 'Reinforces reading phonics through tactile constructive assembly—striking the rune hammer solidifies letter-sound correspondences.',
    keyMechanics: ['Rune Drag & Socket Snapping', 'Hammer Strike Phoneme Trigger', 'Living Spell Transformation'],
    physicsEngineType: 'Kinetic Socket Snap & Spring Particle Forge',
    renderBackend: 'canvas_2d',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`spellforge:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const wordFamilies = ['ast', 'ight', 'ore', 'ump', 'ark', 'eam']
        const targetFamily = prng.pick(wordFamilies)
        return {
          gameId: 'spellforge_anvil',
          seed,
          difficulty: tier,
          title: `Runic Word Forge: -${targetFamily}`,
          subtitle: 'Assemble root runes to awaken the elemental spell',
          scientificConcept: {
            name: 'Phonemic Construction',
            explanation: 'Words are built from modular sound units called phonemes.',
            funFact: 'The English language contains over 40 distinct sound phonemes!',
          },
          parMoves: 3,
          timeTargetSeconds: 45,
          rewardXP: 35,
          rewardStars: 8,
          parameters: { targetFamily, prefixes: ['b', 'st', 'fl', 'br'] },
        }
      },
    },
  },

  // 6. Memory Museum
  memory_museum: {
    id: 'memory_museum',
    title: 'Memory Museum',
    codename: 'curiosity_gallery',
    discipline: 'Spatial & Working Memory',
    primaryDomain: 'memory',
    secondaryDomains: ['logic', 'comprehension'],
    ageRange: { min: 4, max: 11 },
    route: '/playroom/memory-museum',
    status: 'playable',
    isPlayable: true,
    emoji: '🏛️',
    svgIcon: GAME_SVG_ICONS.memory_museum,
    gradientBanner: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #ec4899 100%)',
    accentGlow: 'rgba(124, 58, 237, 0.5)',
    description: 'Explore atmospheric museum galleries and uncover matching ancient relics using 3D perspective flip physics and spatial recall.',
    learningObjectives: [
      'Working Memory Capacity Expansion',
      'Visual Spatial Selective Attention',
      'Inhibitory Focus & Distractor Filtering',
      'Pattern Recall & Feature Binding',
    ],
    pedagogicalRationale: 'Strengthens working memory through staged observation and retrieval phases, building resilience against visual cognitive load.',
    keyMechanics: ['Observation Phase Countdown', 'Velvet Curtain Drop Shift', 'Deductive Tagging of Transformed Relics'],
    physicsEngineType: 'Matrix State Transformation & Time-Decay Engine',
    renderBackend: 'hybrid_dom_canvas',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`museum:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const gridSize = tier === 'hard' ? 4 : tier === 'medium' ? 3 : 2
        return {
          gameId: 'memory_museum',
          seed,
          difficulty: tier,
          title: `Curiosity Chamber ${prng.int(10, 99)}`,
          subtitle: `Remember the positions of ${gridSize * gridSize} artifacts`,
          scientificConcept: {
            name: 'Working Memory',
            explanation: 'The mental workspace used to temporarily hold and manipulate information.',
            funFact: 'Short-term visual memory typically holds 4-7 chunks of information at once.',
          },
          parMoves: 2,
          timeTargetSeconds: 40,
          rewardXP: 30,
          rewardStars: 8,
          parameters: { gridSize, changesCount: tier === 'hard' ? 3 : 1 },
        }
      },
    },
  },

  // 7. Rhythm Spells Conductor
  rhythm_conductor: {
    id: 'rhythm_conductor',
    title: 'Rhythm Spells Conductor',
    codename: 'rhythm_spells',
    discipline: 'Phonemic Beat & Musical Rhyme',
    primaryDomain: 'phonics',
    secondaryDomains: ['memory'],
    ageRange: { min: 4, max: 10 },
    route: '/playroom/rhythm-spells',
    status: 'playable',
    isPlayable: true,
    emoji: '🎵',
    svgIcon: GAME_SVG_ICONS.rhythm_conductor,
    gradientBanner: 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #2dd4bf 100%)',
    accentGlow: 'rgba(13, 148, 136, 0.5)',
    description: 'Echo musical rhythms and tap syllable rhyming drum pads to cast dazzling harmonic sound spells with 3D audio spectrum visuals.',
    learningObjectives: [
      'Syllabic Meter & Prosodic Rhythm',
      'Auditory Temporal Synchronization',
      'Mathematical Time Signature Fractions (1/4, 1/8)',
      'Harmonic Frequency Discrimination',
    ],
    pedagogicalRationale: 'Links musical beat tracking directly to phonetic phonological awareness, proven to accelerate language decoding in young readers.',
    keyMechanics: ['Rune Drum Tap', 'Lookahead Beat Quantization', 'Visual Shockwave Ripple Harmonics'],
    physicsEngineType: 'Time-Domain Audio Quantizer & Ripple Wavefront Engine',
    renderBackend: 'canvas_2d',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`rhythm:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const tempos = [100, 110, 120]
        return {
          gameId: 'rhythm_conductor',
          seed,
          difficulty: tier,
          title: `Harmonic Cadence #${prng.int(1, 24)}`,
          subtitle: 'Synchronize syllable strikes with the pentatonic loop',
          scientificConcept: {
            name: 'Auditory Rhythmic Entrainment',
            explanation: 'The brain automatically synchronizes neural firing to external musical rhythms.',
            funFact: 'Babies can detect rhythm violations in music before they learn to speak!',
          },
          parMoves: 8,
          timeTargetSeconds: 45,
          rewardXP: 35,
          rewardStars: 9,
          parameters: { bpm: prng.pick(tempos), measureCount: 4 },
        }
      },
    },
  },

  // 8. Robo-Path Academy
  robopath_academy: {
    id: 'robopath_academy',
    title: 'Robo-Path Academy',
    codename: 'robopath',
    discipline: 'Computational Coding Logic',
    primaryDomain: 'logic',
    secondaryDomains: ['creativity'],
    ageRange: { min: 5, max: 12 },
    route: '/playroom/robopath',
    status: 'playable',
    isPlayable: true,
    emoji: '🤖',
    svgIcon: GAME_SVG_ICONS.robopath_academy,
    gradientBanner: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    accentGlow: 'rgba(59, 130, 246, 0.5)',
    description: 'Program autonomous robotic helpers through intricate crystal mazes using visual directional tokens, loop registers, and condition branches.',
    learningObjectives: [
      'Sequential Algorithmic Thinking',
      'Loop Invariants & Iterative Efficiency',
      'Spatial Decomposition & Directional Coordinates',
      'Step-by-Step Debugging & Tracing',
    ],
    pedagogicalRationale: 'Builds computational literacy through tangible spatial execution, making abstract coding constructs concrete and visual.',
    keyMechanics: ['Code Token Slot Assembly', 'Single-Step Step-Through Execution', 'Token Budget Optimization'],
    physicsEngineType: 'Abstract Syntax Tree (AST) Grid Step Interpreter',
    renderBackend: 'hybrid_dom_canvas',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`robopath:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const mazeGridSize = tier === 'hard' ? 8 : tier === 'medium' ? 6 : 4
        return {
          gameId: 'robopath_academy',
          seed,
          difficulty: tier,
          title: `Algorithm Circuit ${prng.int(101, 404)}`,
          subtitle: 'Program the robot trajectory to reach the battery beacon',
          scientificConcept: {
            name: 'Algorithmic Sequencing',
            explanation: 'A step-by-step procedure of rules to solve a computational problem.',
            funFact: 'The first computer program was written by Ada Lovelace in 1843!',
          },
          parMoves: mazeGridSize + 2,
          timeTargetSeconds: 75,
          rewardXP: 50,
          rewardStars: 10,
          parameters: { gridSize: mazeGridSize, maxTokens: 8 },
        }
      },
    },
  },

  // 9. Ecosystem Sandbox
  ecosystem_sandbox: {
    id: 'ecosystem_sandbox',
    title: 'Ecosystem Sandbox',
    codename: 'world_builder',
    discipline: 'Biology & Food Chains',
    primaryDomain: 'creativity',
    secondaryDomains: ['logic'],
    ageRange: { min: 4, max: 12 },
    route: '/playroom/ecosystem-sandbox',
    status: 'playable',
    isPlayable: true,
    emoji: '🏝️',
    svgIcon: GAME_SVG_ICONS.ecosystem_sandbox,
    gradientBanner: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    accentGlow: 'rgba(16, 185, 129, 0.5)',
    description: 'Sculpt terrain biomes, water canals, and floral groves on a floating sanctuary island to balance food webs and attract wild creature populations.',
    learningObjectives: [
      'Trophic Levels & Food Web Equilibrium',
      'Ecological Carrying Capacity',
      'Hydrological Cycles & Plant Growth',
      'Biodiversity & Symbiotic Coexistence',
    ],
    pedagogicalRationale: 'Teaches environmental stewardship and complex systems dynamics through an interactive living ecological simulation.',
    keyMechanics: ['Isometric Hex Grid Placement', 'Cellular Automata Trophic Balancing', 'Wildlife Population Emergence'],
    physicsEngineType: 'Cellular Automata Food-Web Matrix Simulator',
    renderBackend: 'canvas_2d',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`ecosystem:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        return {
          gameId: 'ecosystem_sandbox',
          seed,
          difficulty: tier,
          title: `Biome Equilibrium Sector ${prng.int(1, 15)}`,
          subtitle: 'Balance flora and water sources to sustain herbivores',
          scientificConcept: {
            name: 'Trophic Cascade',
            explanation: 'Changes at the top of a food chain cascade through all lower levels of an ecosystem.',
            funFact: 'Reintroducing wolves into Yellowstone National Park changed the flow of the rivers!',
          },
          parMoves: 5,
          timeTargetSeconds: 120,
          rewardXP: 60,
          rewardStars: 15,
          parameters: { initialMoisture: 40, targetSpeciesCount: 3 },
        }
      },
    },
  },

  // 10. Cosmic Constellation Builder
  cosmic_constellation: {
    id: 'cosmic_constellation',
    title: 'Cosmic Constellation Builder',
    codename: 'starlight_geometry',
    discipline: 'Geometry & Coordinates',
    primaryDomain: 'logic',
    secondaryDomains: ['creativity', 'comprehension'],
    ageRange: { min: 5, max: 12 },
    route: '/playroom/constellations',
    status: 'playable',
    isPlayable: true,
    emoji: '✨',
    svgIcon: GAME_SVG_ICONS.cosmic_constellation,
    gradientBanner: 'linear-gradient(135deg, #4c1d95 0%, #db2777 50%, #fbbf24 100%)',
    accentGlow: 'rgba(219, 39, 119, 0.5)',
    description: 'Connect stellar coordinate points with glowing starlight beams to uncover mythical geometric figures and chart the night sky.',
    learningObjectives: [
      'Cartesian & Polar Coordinates $(X, Y)$',
      'Geometric Shapes & Polygon Angles',
      'Spatial Symmetry & Transformations',
      'Astronomical Stellar Classification',
    ],
    pedagogicalRationale: 'Demystifies 2D geometry and coordinate math by anchoring vertex graphing to awe-inspiring celestial folklore.',
    keyMechanics: ['Coordinate Star Point Snapping', 'Elastic Starlight Ray Drawing', 'Mythological Constellation Awakening'],
    physicsEngineType: '2D Celestial Graph & Ray-Intersection Solver',
    renderBackend: 'canvas_2d',
    prngHooks: {
      createSeed: (childId = 'guest', idx = 0) => hashStringToSeed(`constellation:${childId}:${idx}`),
      generateChallenge: (seed, tier = 'easy') => {
        const prng = createPRNG(seed)
        const shapes = ['Ursa Major', 'Pegasus', 'Orion Belt', 'Phoenix', 'Cassiopeia']
        const shape = prng.pick(shapes)
        return {
          gameId: 'cosmic_constellation',
          seed,
          difficulty: tier,
          title: `Constellation Map: ${shape}`,
          subtitle: 'Trace coordinate vertices to awaken the celestial legend',
          scientificConcept: {
            name: 'Stellar Constellations',
            explanation: 'Patterns of stars visible from Earth used by ancient astronomers for navigation.',
            funFact: 'The light from stars in the same constellation may take hundreds of years difference to reach Earth!',
          },
          parMoves: 6,
          timeTargetSeconds: 60,
          rewardXP: 45,
          rewardStars: 10,
          parameters: { starCount: tier === 'hard' ? 8 : tier === 'medium' ? 6 : 4, shapeName: shape },
        }
      },
    },
  },
}

// ============================================================================
// 🔄 LEGACY ID RESOLUTION MAP (Backward Compatibility)
// ============================================================================

export const LEGACY_GAME_ALIAS_MAP: Record<string, ProceduralGameId> = {
  creature_lab: 'creature_alchemist',
  magic_machine: 'clockwork_physics',
  invention_lab: 'clockwork_physics',
  mystery_detective: 'midnight_detective',
  word_detective: 'midnight_detective',
  potion_scales: 'apothecary_scales',
  spellforge: 'spellforge_anvil',
  memory_museum: 'memory_museum',
  rhythm_spells: 'rhythm_conductor',
  robopath: 'robopath_academy',
  world_builder: 'ecosystem_sandbox',
  constellations: 'cosmic_constellation',
}

// ============================================================================
// 🔍 PUBLIC REGISTRY ACCESS & QUERY APIS
// ============================================================================

export function getAllProceduralGames(): ProceduralGameMetadata[] {
  return Object.values(PROCEDURAL_GAME_REGISTRY)
}

export function getProceduralGame(id: string): ProceduralGameMetadata | undefined {
  const canonicalId = (LEGACY_GAME_ALIAS_MAP[id] || id) as ProceduralGameId
  return PROCEDURAL_GAME_REGISTRY[canonicalId]
}

export function getPlayableProceduralGames(): ProceduralGameMetadata[] {
  return getAllProceduralGames().filter((g) => g.isPlayable)
}

export function getProceduralGamesByDomain(domain: CognitiveDomain): ProceduralGameMetadata[] {
  return getAllProceduralGames().filter(
    (g) => g.primaryDomain === domain || g.secondaryDomains.includes(domain)
  )
}

export function generateProceduralChallenge(
  gameId: string,
  seed: number,
  tier: DifficultyTier = 'easy'
): ProceduralChallengeDescriptor {
  const game = getProceduralGame(gameId)
  if (!game) {
    throw new Error(`Unknown game ID: ${gameId}`)
  }
  return game.prngHooks.generateChallenge(seed, tier)
}

/**
 * 📦 Backward-Compatible Singleton Object
 */
export const gameRegistry = {
  getAllGames: () => getAllProceduralGames(),
  getPlayableGames: () => getPlayableProceduralGames(),
  getGameById: (id: string) => getProceduralGame(id),
  getGamesByDomain: (domain: CognitiveDomain) => getProceduralGamesByDomain(domain),
}

