import type { PlaygroundGameId } from '../types/playground'

export interface DailyStationChallenge {
  id: string
  stationId: PlaygroundGameId
  stationTitle: string
  stationIcon: string
  route: string
  accentColor: string
  bannerGradient: string
  challengeTitle: string
  challengeDescription: string
  modifier: string
  targetGoal: string
  difficultyLevel: number
  difficultyLabel: 'Explorer' | 'Adventurer' | 'Master' | 'Cosmic Champion'
  rewardBonusStars: number
  rewardBonusXp: number
  scientificConcept: {
    title: string
    scienceTopic: string
    kidExplanation: string
  }
  isCompleted: boolean
}

export interface DailyCosmicPackage {
  dateKey: string
  dayName: string
  cosmicModifier: string
  challenges: DailyStationChallenge[]
  grandBonus: {
    stars: number
    xp: number
    badge: string
  }
  completedCount: number
  allCompleted: boolean
}

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32)
 */
function createPrng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Hashes a string into a 32-bit integer seed
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

const COSMIC_ALIGNMENTS = [
  '🌌 Aurora Borealis Surge (Double Alchemy Energy)',
  '⚡ Clockwork Supernova (High Velocity Physics)',
  '🔍 Starlight Eclipse (Deep Shadow Deduction)',
  '⚖️ Golden Moon Equilibrium (High Precision Weights)',
  '🪐 Saturn Ring Harmony (Multi-Domain Mastery)',
  '🌟 Comet Tail Velocity (Speed & Memory Focus)',
  '🧪 Elemental Nebula Awakening (Rare Catalysts Active)',
]

const CREATURE_CHALLENGE_TEMPLATES = [
  {
    title: 'Starlight Solar Phoenix Hatching',
    desc: 'The solar winds have supercharged Sun essences! Brew a rare Lumina-Pyro companion.',
    modifier: 'Solar Flare +20% Heat',
    goal: 'Combine Lumina + Pyro with Blazing Crucible',
    concept: { title: 'Thermal Radiation', scienceTopic: 'Energy Transfer', kidExplanation: 'Heat travels across space as warm light waves!' },
  },
  {
    title: 'Crystal Frost Drake Synthesis',
    desc: 'Sub-zero stardust is falling on the cauldron! Hatch a crystal-scaled frost dragon.',
    modifier: 'Cryo-Cooling Effect',
    goal: 'Mix Terra + Lumina with Cool Temperature',
    concept: { title: 'Crystallization', scienceTopic: 'Solid States', kidExplanation: 'When liquids cool slowly, molecules lock into geometric crystal shapes!' },
  },
  {
    title: 'Flora Sprite Bloom Experiment',
    desc: 'Raindrops of light hit the soil! Guide a Flora seedling into a mythical bloom companion.',
    modifier: 'Rapid Photosynthesis',
    goal: 'Combine Flora + Aero essences',
    concept: { title: 'Photosynthesis', scienceTopic: 'Plant Energy', kidExplanation: 'Plants turn sunlight and air into sweet energy to grow!' },
  },
  {
    title: 'Chrono Cosmic Tortoise Awakening',
    desc: 'Time eddies ripple through the lab! Awaken the ancient guardian of the cosmic clock.',
    modifier: 'Temporal Slowdown',
    goal: 'Infuse Cosmic + Terra essences',
    concept: { title: 'Gravitational Waves', scienceTopic: 'Astrophysics', kidExplanation: 'Massive stars create ripples across space and time!' },
  },
]

const MAGIC_MACHINE_TEMPLATES = [
  {
    title: 'High-Velocity Starlight Launcher',
    desc: 'The Sproutlings need to jump across an asteroid gap! Calibrate spring tension and angles.',
    modifier: 'Low Gravity (1.5x Bounce)',
    goal: 'Position 2 Springs and 1 Boost Ramp into the Goal Portal',
    concept: { title: 'Elastic Potential Energy', scienceTopic: 'Kinematics', kidExplanation: 'Compressed springs store energy and release it as a super bounce!' },
  },
  {
    title: 'Magnetic Compass Rollercoaster',
    desc: 'Iron spheres must navigate a magnetic labyrinth without falling into the void.',
    modifier: 'Magnetic Flux Pulsing',
    goal: 'Place 2 Attraction Magnets to curve the trajectory',
    concept: { title: 'Magnetic Polarity', scienceTopic: 'Electromagnetism', kidExplanation: 'Opposite poles attract, pulling metal items along invisible force lines!' },
  },
  {
    title: 'Wind Tunnel Balloon Elevator',
    desc: 'Heavy gears are blocking the floor! Use vortex fans to lift Sproutling airships.',
    modifier: 'Updraft Aero Jets',
    goal: 'Align 2 Industrial Fans with Deflector Plates',
    concept: { title: 'Aerodynamic Lift', scienceTopic: 'Fluid Dynamics', kidExplanation: 'Faster moving air above a surface creates upwards lift!' },
  },
  {
    title: 'Pendulum Kinetic Chain Reaction',
    desc: 'Trigger a domino sequence of brass hammers to ring the cosmic clock tower.',
    modifier: 'Conservation of Momentum',
    goal: 'Chain 3 Mechanical Levers to strike the golden chime',
    concept: { title: 'Momentum Transfer', scienceTopic: 'Classical Mechanics', kidExplanation: 'When heavy moving objects collide, their push transfers forward!' },
  },
]

const MYSTERY_DETECTIVE_TEMPLATES = [
  {
    title: 'The Whispering Windmill Riddle',
    desc: 'Flour sacks were rearranged overnight in the bakery! Analyze paw prints and timelines.',
    modifier: 'UV Blacklight Lens Enabled',
    goal: 'Find 3 glowing flour tracks and eliminate 2 innocent animal suspects',
    concept: { title: 'Fluorescence & UV Light', scienceTopic: 'Optics', kidExplanation: 'Certain minerals glow when exposed to invisible ultraviolet light waves!' },
  },
  {
    title: 'The Stolen Clockwork Spring',
    desc: 'Barnaby Bear’s master pocketwatch stopped ticking! Inspect tool marks and alibis.',
    modifier: 'Microscopic Magnifier Active',
    goal: 'Inspect the scratch pattern and uncover the secret hidden pocket',
    concept: { title: 'Forensic Toolmark Analysis', scienceTopic: 'Forensic Science', kidExplanation: 'Every hard metal tool leaves unique microscopic scratches like a fingerprint!' },
  },
  {
    title: 'The Midnight Observatory Ghost',
    desc: 'Strange glowing lights flashed in the telescope dome! Trace refraction and shadows.',
    modifier: 'Prism Spectrum Filter',
    goal: 'Identify the lantern reflection source and solve the case',
    concept: { title: 'Light Refraction', scienceTopic: 'Optics', kidExplanation: 'Light bends and splits into rainbow colors when passing through glass prisms!' },
  },
  {
    title: 'The Honey Tart Disappearance',
    desc: 'Madame Brioche’s award-winning honey tart vanished! Inspect scent trails and crumbs.',
    modifier: 'Pollen Analysis Kit',
    goal: 'Match wild clover pollen on the suspect’s apron',
    concept: { title: 'Palynology (Pollen Tracing)', scienceTopic: 'Botanical Forensics', kidExplanation: 'Every flower has distinct pollen grains that show where someone traveled!' },
  },
]

const POTION_SCALES_TEMPLATES = [
  {
    title: 'Dragon Fire Tonic Rush',
    desc: 'A shivering baby dragon needs warming elixir! Balance dragon fire root against brass weights.',
    modifier: 'Dual-Scale Thermal Balance',
    goal: 'Balance 35g of volcanic crystals using exactly 3 precision weights',
    concept: { title: 'Density & Specific Gravity', scienceTopic: 'Materials Chemistry', kidExplanation: 'Heavy metals have packed atoms, so small weights can balance large light crystals!' },
  },
  {
    title: 'Mermaid Ocean Salve Bazaar',
    desc: 'Coral reef fish need soothing pearl salve! Measure liquid volume and buoyant weights.',
    modifier: 'Hydrostatic Buoyancy',
    goal: 'Reach 48g equilibrium with sea kelp vials',
    concept: { title: 'Archimedes Principle', scienceTopic: 'Fluid Statics', kidExplanation: 'Objects submerged in liquids experience an upward push equal to displaced liquid!' },
  },
  {
    title: 'Astral Glow Philtre Batch',
    desc: 'Starlight lanterns are dimming across the village! Measure luminous glow dust.',
    modifier: 'Precision Gram Calibration',
    goal: 'Solve the 3-Step Weight Riddle in under 8 scale moves',
    concept: { title: 'System of Equations', scienceTopic: 'Algebraic Logic', kidExplanation: 'Comparing two different scales helps deduce the exact weight of mystery items!' },
  },
  {
    title: 'Chrono Speed Draught Order',
    desc: 'Swift postal pigeons need energy cordial! Rapidly fulfill 3 balanced orders.',
    modifier: 'Market Bazaar Rush Mode',
    goal: 'Achieve 3 consecutive perfect balances with 0 balance errors',
    concept: { title: 'Center of Mass', scienceTopic: 'Statics', kidExplanation: 'A scale stays perfectly flat when clockwise and counter-clockwise torques match!' },
  },
]

/**
 * Formats a Date object into 'YYYY-MM-DD'
 */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Procedurally generates the Infinite Daily Cosmic Challenges for a given date & child level.
 * 100% deterministic client-side calculation ($0.00 AI cost).
 */
export function getDailyCosmicChallenges(
  date: Date = new Date(),
  childLevel: number = 1,
  completedChallengeIds: string[] = []
): DailyCosmicPackage {
  const dateKey = getDateKey(date)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = `${daysOfWeek[date.getDay()]} Cosmic Alignment`

  const dateSeed = hashString(`${dateKey}_orbis_daily`)
  const prng = createPrng(dateSeed)

  const cosmicModifierIndex = Math.floor(prng() * COSMIC_ALIGNMENTS.length)
  const cosmicModifier = COSMIC_ALIGNMENTS[cosmicModifierIndex]

  // Determine difficulty tier by child level
  let difficultyLabel: DailyStationChallenge['difficultyLabel'] = 'Explorer'
  let difficultyLevel = Math.max(1, childLevel)
  let rewardMultiplier = 1

  if (childLevel >= 5) {
    difficultyLabel = 'Cosmic Champion'
    rewardMultiplier = 2.5
  } else if (childLevel >= 3) {
    difficultyLabel = 'Master'
    rewardMultiplier = 1.8
  } else if (childLevel >= 2) {
    difficultyLabel = 'Adventurer'
    rewardMultiplier = 1.3
  }

  // 1. Creature Lab Challenge
  const cIdx = Math.floor(prng() * CREATURE_CHALLENGE_TEMPLATES.length)
  const cTemplate = CREATURE_CHALLENGE_TEMPLATES[cIdx]
  const creatureChallengeId = `daily_${dateKey}_creature_lab`

  const creatureChallenge: DailyStationChallenge = {
    id: creatureChallengeId,
    stationId: 'creature_lab',
    stationTitle: 'Creature Lab',
    stationIcon: '🧪',
    route: '/games/creature-lab',
    accentColor: '#ec4899',
    bannerGradient: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #ec4899 100%)',
    challengeTitle: cTemplate.title,
    challengeDescription: cTemplate.desc,
    modifier: cTemplate.modifier,
    targetGoal: cTemplate.goal,
    difficultyLevel,
    difficultyLabel,
    rewardBonusStars: Math.round(12 * rewardMultiplier),
    rewardBonusXp: Math.round(120 * rewardMultiplier),
    scientificConcept: cTemplate.concept,
    isCompleted: completedChallengeIds.includes(creatureChallengeId),
  }

  // 2. Magic Machine Challenge
  const mIdx = Math.floor(prng() * MAGIC_MACHINE_TEMPLATES.length)
  const mTemplate = MAGIC_MACHINE_TEMPLATES[mIdx]
  const machineChallengeId = `daily_${dateKey}_magic_machine`

  const machineChallenge: DailyStationChallenge = {
    id: machineChallengeId,
    stationId: 'magic_machine',
    stationTitle: 'Magic Machine Lab',
    stationIcon: '⚙️',
    route: '/playroom/magic-machine',
    accentColor: '#06b6d4',
    bannerGradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)',
    challengeTitle: mTemplate.title,
    challengeDescription: mTemplate.desc,
    modifier: mTemplate.modifier,
    targetGoal: mTemplate.goal,
    difficultyLevel,
    difficultyLabel,
    rewardBonusStars: Math.round(12 * rewardMultiplier),
    rewardBonusXp: Math.round(120 * rewardMultiplier),
    scientificConcept: mTemplate.concept,
    isCompleted: completedChallengeIds.includes(machineChallengeId),
  }

  // 3. Mystery Detective Challenge
  const dIdx = Math.floor(prng() * MYSTERY_DETECTIVE_TEMPLATES.length)
  const dTemplate = MYSTERY_DETECTIVE_TEMPLATES[dIdx]
  const detectiveChallengeId = `daily_${dateKey}_mystery_detective`

  const detectiveChallenge: DailyStationChallenge = {
    id: detectiveChallengeId,
    stationId: 'mystery_detective',
    stationTitle: 'Mystery Detective',
    stationIcon: '🔍',
    route: '/playroom/mystery-detective',
    accentColor: '#a855f7',
    bannerGradient: 'linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #a855f7 100%)',
    challengeTitle: dTemplate.title,
    challengeDescription: dTemplate.desc,
    modifier: dTemplate.modifier,
    targetGoal: dTemplate.goal,
    difficultyLevel,
    difficultyLabel,
    rewardBonusStars: Math.round(15 * rewardMultiplier),
    rewardBonusXp: Math.round(150 * rewardMultiplier),
    scientificConcept: dTemplate.concept,
    isCompleted: completedChallengeIds.includes(detectiveChallengeId),
  }

  // 4. Potion Market Scales Challenge
  const pIdx = Math.floor(prng() * POTION_SCALES_TEMPLATES.length)
  const pTemplate = POTION_SCALES_TEMPLATES[pIdx]
  const potionChallengeId = `daily_${dateKey}_potion_scales`

  const potionChallenge: DailyStationChallenge = {
    id: potionChallengeId,
    stationId: 'potion_scales',
    stationTitle: 'Potion Market Scales',
    stationIcon: '⚖️',
    route: '/playroom/potion-scales',
    accentColor: '#10b981',
    bannerGradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    challengeTitle: pTemplate.title,
    challengeDescription: pTemplate.desc,
    modifier: pTemplate.modifier,
    targetGoal: pTemplate.goal,
    difficultyLevel,
    difficultyLabel,
    rewardBonusStars: Math.round(12 * rewardMultiplier),
    rewardBonusXp: Math.round(120 * rewardMultiplier),
    scientificConcept: pTemplate.concept,
    isCompleted: completedChallengeIds.includes(potionChallengeId),
  }

  const challenges = [creatureChallenge, machineChallenge, detectiveChallenge, potionChallenge]
  const completedCount = challenges.filter((c) => c.isCompleted).length
  const allCompleted = completedCount === challenges.length

  return {
    dateKey,
    dayName,
    cosmicModifier,
    challenges,
    grandBonus: {
      stars: Math.round(50 * rewardMultiplier),
      xp: Math.round(500 * rewardMultiplier),
      badge: '👑 Cosmic Grandmaster Crest',
    },
    completedCount,
    allCompleted,
  }
}

/**
 * Retrieves list of completed challenge IDs for a child from localStorage
 */
export function getDailyChallengeCompletionStatus(childId: string = 'guest'): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = window.localStorage.getItem(`orbis_daily_challenges_completed_${childId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Saves a completed daily challenge ID for a child
 */
export function markDailyChallengeCompleted(challengeId: string, childId: string = 'guest'): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false
  try {
    const existing = getDailyChallengeCompletionStatus(childId)
    if (!existing.includes(challengeId)) {
      existing.push(challengeId)
      window.localStorage.setItem(
        `orbis_daily_challenges_completed_${childId}`,
        JSON.stringify(existing)
      )
    }
    return true
  } catch {
    return false
  }
}
