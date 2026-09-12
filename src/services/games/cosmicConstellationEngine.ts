import type { DifficultyTier } from '../../types/experience'
import type {
  StarSpectralClass,
  StarNode,
  ConstellationTarget,
  ConstellationChallenge,
  ConstellationScienceConcept,
} from '../../types/games/cosmicConstellation'
import { createPRNG } from './gameRegistry'

export const SPECTRAL_COLORS: Record<StarSpectralClass, { color: string; aura: string; name: string }> = {
  O_BLUE: { color: '#38bdf8', aura: 'rgba(56, 189, 248, 0.4)', name: 'Blue Giant (Hot)' },
  B_BLUE_WHITE: { color: '#818cf8', aura: 'rgba(129, 140, 248, 0.4)', name: 'Blue-White Subgiant' },
  A_WHITE: { color: '#f8fafc', aura: 'rgba(248, 250, 252, 0.45)', name: 'White Sirius Star' },
  F_YELLOW_WHITE: { color: '#fef08a', aura: 'rgba(254, 240, 138, 0.4)', name: 'Yellow-White Star' },
  G_YELLOW: { color: '#facc15', aura: 'rgba(250, 204, 21, 0.45)', name: 'Yellow Dwarf (Sun-like)' },
  K_ORANGE: { color: '#fb923c', aura: 'rgba(251, 146, 60, 0.4)', name: 'Orange Giant' },
  M_RED: { color: '#f87171', aura: 'rgba(248, 113, 113, 0.45)', name: 'Red Supergiant' },
  PULSAR: { color: '#c084fc', aura: 'rgba(192, 132, 252, 0.6)', name: 'Pulsing Neutron Star' },
}

export const CONSTELLATION_SCIENCE_CONCEPTS: ConstellationScienceConcept[] = [
  {
    conceptTitle: 'Light-Years: Looking Back in Time',
    scienceTopic: 'Astrophysics & Cosmic Distance',
    kidExplanation:
      'Because light takes time to travel across the galaxy, when you gaze up at the stars, you are actually looking back in time to how they looked hundreds of years ago!',
    funFact:
      'Light travels at 186,000 miles every single second. One light-year is nearly 6 TRILLION miles long!',
  },
  {
    conceptTitle: 'Nuclear Fusion: The Engine of Stars',
    scienceTopic: 'Stellar Physics & Energy',
    kidExplanation:
      'Stars are giant glowing spheres of hydrogen gas. At their super-hot cores, hydrogen atoms squeeze together in nuclear fusion to create light, warmth, and all the elements!',
    funFact:
      'Every gold ring and piece of silver on Earth was created inside a giant dying star that exploded in a supernova billions of years ago!',
  },
  {
    conceptTitle: 'Celestial Navigation: The North Star',
    scienceTopic: 'Astronavigation & Planetary Rotation',
    kidExplanation:
      'As Earth spins like a giant top, the stars appear to circle across the night sky. But Polaris (the North Star) sits directly above the North Pole, always pointing true north!',
    funFact:
      'Ancient sailors and explorers navigated across vast stormy oceans using only the stars and an instrument called an astrolabe!',
  },
  {
    conceptTitle: 'Stellar Colors: Cosmic Thermometers',
    scienceTopic: 'Thermodynamics & Spectroscopy',
    kidExplanation:
      'A star color tells us its temperature! Blazing blue stars are the hottest (over 30,000°C), yellow stars like our Sun are medium warm, and glowing red stars are cooler.',
    funFact:
      'Betelgeuse, the red shoulder star of Orion, is so massive that if placed where our Sun is, it would swallow Mercury, Venus, Earth, and Mars!',
  },
  {
    conceptTitle: 'Constellations: Storybooks in the Sky',
    scienceTopic: 'Cultural Astronomy & Geometry',
    kidExplanation:
      'For thousands of years, ancient cultures connected bright stars with imaginary lines to map constellations, creating cosmic calendars to know when to plant crops and harvest.',
    funFact:
      'Astronomers today officially recognize 88 constellations that cover the entire sphere of the night sky like a giant jigsaw puzzle!',
  },
]

// Curated Star Map Library
export const CURATED_CONSTELLATIONS: ConstellationTarget[] = [
  {
    id: 'ursa_major',
    name: 'The Big Dipper (Ursa Major)',
    latinName: 'Ursa Major',
    mythologyStory: 'The great celestial bear whose seven brightest stars guide travelers to the North Star.',
    scientificConcept: CONSTELLATION_SCIENCE_CONCEPTS[2],
    stars: [
      { id: 'um_dubhe', name: 'Dubhe', x: -40, y: -50, z: 10, magnitude: 1.8, spectralClass: 'K_ORANGE', color: '#fb923c', size: 9, distanceLightYears: 123 },
      { id: 'um_merak', name: 'Merak', x: -40, y: -20, z: 5, magnitude: 2.4, spectralClass: 'A_WHITE', color: '#f8fafc', size: 8, distanceLightYears: 79 },
      { id: 'um_phecda', name: 'Phecda', x: -10, y: -20, z: 0, magnitude: 2.4, spectralClass: 'A_WHITE', color: '#f8fafc', size: 8, distanceLightYears: 84 },
      { id: 'um_megrez', name: 'Megrez', x: -10, y: -50, z: 2, magnitude: 3.3, spectralClass: 'A_WHITE', color: '#f8fafc', size: 6, distanceLightYears: 81 },
      { id: 'um_alioth', name: 'Alioth', x: 20, y: -60, z: 8, magnitude: 1.8, spectralClass: 'A_WHITE', color: '#f8fafc', size: 9, distanceLightYears: 81 },
      { id: 'um_mizar', name: 'Mizar', x: 45, y: -70, z: 12, magnitude: 2.2, spectralClass: 'A_WHITE', color: '#f8fafc', size: 8, distanceLightYears: 83 },
      { id: 'um_alkaid', name: 'Alkaid', x: 70, y: -80, z: 15, magnitude: 1.9, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 9, distanceLightYears: 101 },
    ],
    requiredEdges: [
      ['um_dubhe', 'um_merak'],
      ['um_merak', 'um_phecda'],
      ['um_phecda', 'um_megrez'],
      ['um_megrez', 'um_dubhe'],
      ['um_megrez', 'um_alioth'],
      ['um_alioth', 'um_mizar'],
      ['um_mizar', 'um_alkaid'],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia the Queen',
    latinName: 'Cassiopeia',
    mythologyStory: 'The celestial queen whose five brilliant stars form a distinctive "W" shape across the northern Milky Way.',
    scientificConcept: CONSTELLATION_SCIENCE_CONCEPTS[0],
    stars: [
      { id: 'cas_caph', name: 'Caph', x: -60, y: 10, z: 5, magnitude: 2.3, spectralClass: 'F_YELLOW_WHITE', color: '#fef08a', size: 8, distanceLightYears: 54 },
      { id: 'cas_schedar', name: 'Schedar', x: -30, y: -30, z: 10, magnitude: 2.2, spectralClass: 'K_ORANGE', color: '#fb923c', size: 9, distanceLightYears: 228 },
      { id: 'cas_navi', name: 'Navi (Gamma)', x: 0, y: 10, z: 12, magnitude: 2.1, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 9, distanceLightYears: 550 },
      { id: 'cas_ruchbah', name: 'Ruchbah', x: 35, y: -25, z: 8, magnitude: 2.7, spectralClass: 'A_WHITE', color: '#f8fafc', size: 7, distanceLightYears: 99 },
      { id: 'cas_segin', name: 'Segin', x: 65, y: 15, z: 2, magnitude: 3.4, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 6, distanceLightYears: 440 },
    ],
    requiredEdges: [
      ['cas_caph', 'cas_schedar'],
      ['cas_schedar', 'cas_navi'],
      ['cas_navi', 'cas_ruchbah'],
      ['cas_ruchbah', 'cas_segin'],
    ],
  },
  {
    id: 'orion',
    name: 'Orion the Hunter',
    latinName: 'Orion',
    mythologyStory: 'The cosmic hunter crowned with a belt of three aligned stars and the glowing Orion Nebula at his sword.',
    scientificConcept: CONSTELLATION_SCIENCE_CONCEPTS[3],
    stars: [
      { id: 'ori_betelgeuse', name: 'Betelgeuse', x: -40, y: -60, z: 15, magnitude: 0.5, spectralClass: 'M_RED', color: '#f87171', size: 12, distanceLightYears: 642 },
      { id: 'ori_bellatrix', name: 'Bellatrix', x: 40, y: -50, z: 10, magnitude: 1.6, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 9, distanceLightYears: 245 },
      { id: 'ori_mintaka', name: 'Mintaka', x: -20, y: -5, z: 5, magnitude: 2.2, spectralClass: 'O_BLUE', color: '#38bdf8', size: 8, distanceLightYears: 915 },
      { id: 'ori_alnilam', name: 'Alnilam', x: 0, y: 0, z: 5, magnitude: 1.7, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 9, distanceLightYears: 1340 },
      { id: 'ori_alnitak', name: 'Alnitak', x: 20, y: 5, z: 5, magnitude: 1.8, spectralClass: 'O_BLUE', color: '#38bdf8', size: 8, distanceLightYears: 800 },
      { id: 'ori_saiph', name: 'Saiph', x: -35, y: 60, z: 8, magnitude: 2.1, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 8, distanceLightYears: 720 },
      { id: 'ori_rigel', name: 'Rigel', x: 45, y: 55, z: 14, magnitude: 0.1, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 12, distanceLightYears: 860 },
    ],
    requiredEdges: [
      ['ori_betelgeuse', 'ori_bellatrix'],
      ['ori_betelgeuse', 'ori_mintaka'],
      ['ori_mintaka', 'ori_alnilam'],
      ['ori_alnilam', 'ori_alnitak'],
      ['ori_bellatrix', 'ori_alnitak'],
      ['ori_alnitak', 'ori_saiph'],
      ['ori_alnitak', 'ori_rigel'],
      ['ori_saiph', 'ori_rigel'],
    ],
  },
  {
    id: 'cygnus',
    name: 'Cygnus the Northern Swan',
    latinName: 'Cygnus',
    mythologyStory: 'The luminous swan soaring along the Milky Way with Deneb marking its tail and Albireo at its beak.',
    scientificConcept: CONSTELLATION_SCIENCE_CONCEPTS[1],
    stars: [
      { id: 'cyg_deneb', name: 'Deneb', x: 0, y: -60, z: 12, magnitude: 1.2, spectralClass: 'A_WHITE', color: '#f8fafc', size: 10, distanceLightYears: 1550 },
      { id: 'cyg_sadr', name: 'Sadr', x: 0, y: -10, z: 8, magnitude: 2.2, spectralClass: 'F_YELLOW_WHITE', color: '#fef08a', size: 8, distanceLightYears: 1500 },
      { id: 'cyg_albireo', name: 'Albireo', x: 0, y: 50, z: 5, magnitude: 3.1, spectralClass: 'K_ORANGE', color: '#fb923c', size: 7, distanceLightYears: 380 },
      { id: 'cyg_gienah', name: 'Gienah (East Wing)', x: -50, y: -10, z: 10, magnitude: 2.5, spectralClass: 'K_ORANGE', color: '#fb923c', size: 8, distanceLightYears: 72 },
      { id: 'cyg_fawaris', name: 'Fawaris (West Wing)', x: 50, y: -10, z: 10, magnitude: 2.9, spectralClass: 'B_BLUE_WHITE', color: '#818cf8', size: 7, distanceLightYears: 165 },
    ],
    requiredEdges: [
      ['cyg_deneb', 'cyg_sadr'],
      ['cyg_sadr', 'cyg_albireo'],
      ['cyg_gienah', 'cyg_sadr'],
      ['cyg_sadr', 'cyg_fawaris'],
    ],
  },
]

// Normalize Edge Pairs for bidirectional equality check
export function normalizeEdge(a: string, b: string): string {
  return a < b ? `${a}--${b}` : `${b}--${a}`
}

// Validate Graph Connection Accuracy
export function validateConstellationConnections(
  target: ConstellationTarget,
  activeEdges: [string, string][]
): {
  isComplete: boolean
  correctCount: number
  totalRequired: number
  extraCount: number
  accuracyPercentage: number
} {
  const targetEdgeSet = new Set(target.requiredEdges.map(([a, b]) => normalizeEdge(a, b)))
  const activeEdgeSet = new Set(activeEdges.map(([a, b]) => normalizeEdge(a, b)))

  let correctCount = 0
  let extraCount = 0

  for (const edgeKey of activeEdgeSet) {
    if (targetEdgeSet.has(edgeKey)) {
      correctCount++
    } else {
      extraCount++
    }
  }

  const isComplete = correctCount === targetEdgeSet.size
  const accuracyPercentage = Math.round((correctCount / targetEdgeSet.size) * 100)

  return {
    isComplete,
    correctCount,
    totalRequired: targetEdgeSet.size,
    extraCount,
    accuracyPercentage,
  }
}

// Deterministic Procedural Challenge Generator
export function generateProceduralConstellationChallenge(
  seedInput: number | string,
  difficulty: DifficultyTier = 'easy'
): ConstellationChallenge {
  const prng = createPRNG(seedInput)

  const constellationIndex = prng.int(0, CURATED_CONSTELLATIONS.length - 1)
  const targetConstellation = CURATED_CONSTELLATIONS[constellationIndex]

  let distractorCount = 4
  let rewardStars = 5
  let rewardXP = 35

  if (difficulty === 'medium') {
    distractorCount = 8
    rewardStars = 8
    rewardXP = 50
  } else if (difficulty === 'hard') {
    distractorCount = 14
    rewardStars = 12
    rewardXP = 70
  }

  // Generate Distractor Background Stars
  const distractorStars: StarNode[] = []
  const spectralKeys = Object.keys(SPECTRAL_COLORS) as StarSpectralClass[]

  for (let i = 0; i < distractorCount; i++) {
    const spec = spectralKeys[prng.int(0, spectralKeys.length - 1)]
    distractorStars.push({
      id: `distractor_${i}_${prng.seed}`,
      name: `Star HD-${prng.int(10000, 99999)}`,
      x: prng.int(-90, 90),
      y: prng.int(-90, 90),
      z: prng.int(-20, 20),
      magnitude: prng.int(3, 6),
      spectralClass: spec,
      color: SPECTRAL_COLORS[spec].color,
      size: prng.int(4, 7),
      distanceLightYears: prng.int(50, 2500),
    })
  }

  return {
    id: `constellation_${targetConstellation.id}_${prng.seed}_${difficulty}`,
    title: `Cosmic Star Map: ${targetConstellation.name}`,
    difficulty,
    seed: prng.seed,
    targetConstellation,
    distractorStars,
    maxLinesAllowed: targetConstellation.requiredEdges.length + 4,
    rewardStars,
    rewardXP,
  }
}
