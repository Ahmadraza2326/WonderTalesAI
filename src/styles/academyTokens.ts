/**
 * ORBis Academy & Learning Universe Design Tokens (TypeScript Authority)
 * Direction: Living Learning Universe
 * Centralizes theme colors, gradients, elevation, realm aesthetics, motion tokens, and accessibility bounds.
 */

import type { GradeBand, AcademicSubject, AcademicRealm } from '../types/learningUniverse'
export type { GradeBand, AcademicSubject, AcademicRealm } from '../types/learningUniverse'

export type InteractiveComponentState =
  | 'default'
  | 'hover'
  | 'pressed'
  | 'focused'
  | 'disabled'
  | 'success'
  | 'guidance'
  | 'loading'
  | 'reduced_motion'

export interface RealmStyleConfig {
  id: AcademicRealm
  name: string
  subjectId: AcademicSubject
  baseColor: string
  glowColor: string
  deepColor: string
  gradient: string
  glassSurface: string
  borderAura: string
  icon: string
  loreTitle: string
}

export const REALM_STYLE_CONFIGS: Record<AcademicRealm, RealmStyleConfig> = {
  mathematics: {
    id: 'mathematics',
    name: 'Citadel of Stars',
    subjectId: 'math',
    baseColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    deepColor: '#0369a1',
    gradient: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)',
    glassSurface: 'rgba(3, 105, 161, 0.25)',
    borderAura: 'rgba(56, 189, 248, 0.5)',
    icon: 'CitadelIcon',
    loreTitle: 'The Realm of Geometry, Number Patterns & Stellar Arrays',
  },
  science: {
    id: 'science',
    name: 'Living Biome Reef',
    subjectId: 'science',
    baseColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    deepColor: '#047857',
    gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
    glassSurface: 'rgba(4, 120, 87, 0.25)',
    borderAura: 'rgba(16, 185, 129, 0.5)',
    icon: 'BiomeIcon',
    loreTitle: 'The Realm of Matter, Ecosystem Energy & Physics Forces',
  },
  english: {
    id: 'english',
    name: 'Infinite Lexicon Tower',
    subjectId: 'english',
    baseColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    deepColor: '#7e22ce',
    gradient: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)',
    glassSurface: 'rgba(126, 34, 206, 0.25)',
    borderAura: 'rgba(168, 85, 247, 0.5)',
    icon: 'RuneIcon',
    loreTitle: 'The Realm of Grammatical Runes, Voice & Expressive Poetry',
  },
  reading: {
    id: 'reading',
    name: 'Sanctuary of Stories',
    subjectId: 'reading',
    baseColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    deepColor: '#b45309',
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    glassSurface: 'rgba(180, 83, 9, 0.25)',
    borderAura: 'rgba(245, 158, 11, 0.5)',
    icon: 'ScrollIcon',
    loreTitle: 'The Realm of Phonemic Soundwaves & Comprehension Quests',
  },
  computer_science: {
    id: 'computer_science',
    name: 'Clockwork Foundry',
    subjectId: 'computer_science',
    baseColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    deepColor: '#4338ca',
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
    glassSurface: 'rgba(67, 56, 202, 0.25)',
    borderAura: 'rgba(99, 102, 241, 0.5)',
    icon: 'CircuitIcon',
    loreTitle: 'The Realm of Algorithmic Sequences, Loops & Robot Routing',
  },
  logic_puzzles: {
    id: 'logic_puzzles',
    name: 'Enigma Observatory',
    subjectId: 'logic',
    baseColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    deepColor: '#be185d',
    gradient: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
    glassSurface: 'rgba(190, 24, 93, 0.25)',
    borderAura: 'rgba(236, 72, 153, 0.5)',
    icon: 'EnigmaIcon',
    loreTitle: 'The Realm of Forensic Deduction & Working Memory Grids',
  },
  creativity_arts: {
    id: 'creativity_arts',
    name: 'Radiance Studio',
    subjectId: 'creativity',
    baseColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    deepColor: '#c2410c',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #f97316 100%)',
    glassSurface: 'rgba(194, 65, 12, 0.25)',
    borderAura: 'rgba(249, 115, 22, 0.5)',
    icon: 'RadianceIcon',
    loreTitle: 'The Realm of Harmonic Melodies, Color Theory & Construction',
  },
  general_knowledge: {
    id: 'general_knowledge',
    name: 'Terran Chronometer',
    subjectId: 'knowledge',
    baseColor: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    deepColor: '#0f766e',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    glassSurface: 'rgba(15, 118, 110, 0.25)',
    borderAura: 'rgba(20, 184, 166, 0.5)',
    icon: 'GlobeIcon',
    loreTitle: 'The Realm of World Civilizations, Ancient Wonders & Geography',
  },
}

export const GRADE_BAND_CONFIGS: Record<GradeBand, {
  title: string
  ageRange: string
  description: string
  icon: string
  maxSessionMinutes: number
  narrationMandatory: boolean
  visualDensity: 'minimal' | 'focused' | 'standard' | 'rich'
  touchTargetSize: number
  targetLessonDuration: number
}> = {
  pre_k: {
    title: 'Pre-K & Nursery',
    ageRange: 'Ages 3–4',
    description: 'Sensory discovery, colors, shapes, nursery phonics & big tactile interactions.',
    icon: '🌱',
    maxSessionMinutes: 15,
    narrationMandatory: true,
    visualDensity: 'minimal',
    touchTargetSize: 64,
    targetLessonDuration: 4,
  },
  kindergarten: {
    title: 'Kindergarten',
    ageRange: 'Ages 5–6',
    description: 'Foundational reading, early math counting, living nature & creative storytelling.',
    icon: '🌟',
    maxSessionMinutes: 20,
    narrationMandatory: true,
    visualDensity: 'focused',
    touchTargetSize: 54,
    targetLessonDuration: 6,
  },
  grade_1: {
    title: 'Grade 1',
    ageRange: 'Ages 6–7',
    description: 'Sight words, addition & subtraction, animal habitats & basic coding puzzles.',
    icon: '🚀',
    maxSessionMinutes: 25,
    narrationMandatory: false,
    visualDensity: 'standard',
    touchTargetSize: 48,
    targetLessonDuration: 8,
  },
  grade_2: {
    title: 'Grade 2',
    ageRange: 'Ages 7–8',
    description: 'Reading comprehension, 2D/3D shapes, ecosystem cycles & algorithm loops.',
    icon: '🔭',
    maxSessionMinutes: 30,
    narrationMandatory: false,
    visualDensity: 'standard',
    touchTargetSize: 44,
    targetLessonDuration: 10,
  },
  grade_3: {
    title: 'Grade 3',
    ageRange: 'Ages 8–9',
    description: 'Multiplication & division, fractions intro, earth science & mystery deduction.',
    icon: '⚡',
    maxSessionMinutes: 35,
    narrationMandatory: false,
    visualDensity: 'rich',
    touchTargetSize: 44,
    targetLessonDuration: 12,
  },
  grade_4: {
    title: 'Grade 4',
    ageRange: 'Ages 9–10',
    description: 'Fractions arithmetic, kinetic energy, stellar constellations & cross-disciplinary projects.',
    icon: '🌌',
    maxSessionMinutes: 40,
    narrationMandatory: false,
    visualDensity: 'rich',
    touchTargetSize: 44,
    targetLessonDuration: 15,
  },
  grade_5: {
    title: 'Grade 5',
    ageRange: 'Ages 10–11',
    description: 'Algebraic balance, structural engineering, complex algorithms & world history exploration.',
    icon: '👑',
    maxSessionMinutes: 45,
    narrationMandatory: false,
    visualDensity: 'rich',
    touchTargetSize: 44,
    targetLessonDuration: 18,
  },
  grade_6: {
    title: 'Grade 6',
    ageRange: 'Ages 11–12',
    description: 'Pre-algebra ratios, scientific investigation, advanced algorithms & global civilizational history.',
    icon: '🏛️',
    maxSessionMinutes: 45,
    narrationMandatory: false,
    visualDensity: 'rich',
    touchTargetSize: 44,
    targetLessonDuration: 20,
  },
}

export const MOTION_TIMING_TOKENS = {
  micro: 120,
  short: 240,
  medium: 400,
  long: 650,
  celebration: 1200,
} as const

export const TOUCH_TARGET_TOKENS = {
  minStandard: 48,
  minChild: 56,
  minPreK: 64,
} as const
