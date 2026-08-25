import type { DifficultyTier } from '../experience'

/**
 * Forensic investigation tools available to the detective
 */
export type InvestigationToolType =
  | 'magnifying_glass'
  | 'uv_brush'
  | 'sound_horn'
  | 'decoder_lens'

export interface InvestigationTool {
  id: InvestigationToolType
  name: string
  icon: string
  description: string
  accentColor: string
}

/**
 * Trait keys used by the Constraint Satisfaction relational engine
 */
export type SuspectTraitKey =
  | 'height'
  | 'furOrFeathers'
  | 'diet'
  | 'accessory'
  | 'footprint'
  | 'habitat'

export interface SuspectTraits {
  height: 'tall' | 'short' | 'tiny'
  furOrFeathers: 'gold' | 'silver' | 'emerald' | 'crimson' | 'midnight' | 'white'
  diet: 'sweet_fruit' | 'savory_seeds' | 'sparkle_dew' | 'honey_pastry' | 'moon_berries'
  accessory: 'hat' | 'scarf' | 'glasses' | 'boots' | 'watch' | 'ribbon'
  footprint: 'paw' | 'hoof' | 'claw' | 'webbed' | 'leaf_pad'
  habitat: 'forest' | 'sky_piers' | 'archives' | 'conservatory' | 'clock_tower' | 'caverns'
}

export interface Suspect {
  id: string
  name: string
  species: string
  avatar: string
  quote: string
  traits: SuspectTraits
  innocentExplanation?: string
  confessionQuote?: string
}

/**
 * Clue classification for logical reasoning
 */
export type ClueType =
  | 'direct_match' // "Culprit has silver fur" -> trait must equal value
  | 'negative_match' // "Culprit is NOT wearing a scarf" -> trait must not equal value
  | 'comparison' // "Culprit is shorter than Pippin" -> requires reference suspect
  | 'conjunction' // "Culprit loves sweet fruit AND leaves webbed footprints"

export interface Clue {
  id: string
  type: ClueType
  traitKey: SuspectTraitKey
  expectedValue: string
  negativeValue?: string
  comparisonTargetId?: string
  textDescription: string
  discoveryTool: InvestigationToolType
  hotspotLocation: { x: number; y: number }
  isDiscovered?: boolean
  icon?: string
}

export interface Hotspot {
  id: string
  clueId: string
  x: number
  y: number
  radius: number
  label: string
  hintText: string
  requiredTool: InvestigationToolType
}

export interface ScientificConcept {
  title: string
  description: string
  funFact: string
}

export interface DetectiveCase {
  id: string
  title: string
  locationName: string
  locationEmoji: string
  victimName: string
  victimEmoji: string
  missingItem: string
  missingItemEmoji: string
  narrativeIntro: string
  difficulty: DifficultyTier
  suspectPool: Suspect[]
  culpritId: string
  clues: Clue[]
  hotspots: Hotspot[]
  parTimeSeconds: number
  scientificConcept: ScientificConcept
}

export interface DetectiveTelemetry {
  attempts: number
  timeElapsedSeconds: number
  cluesFound: number
  mistakesCount: number
  score: number
  stars: number
  xp: number
  finalStatus: 'solved' | 'failed'
}

export interface DetectiveInvestigationState {
  caseConfig: DetectiveCase
  activeTool: InvestigationToolType
  discoveredClueIds: string[]
  eliminatedSuspectIds: string[]
  inspectedHotspotIds: string[]
  selectedSuspectId: string | null
  status: 'briefing' | 'investigating' | 'deducing' | 'solved' | 'failed'
  telemetry: DetectiveTelemetry
}

export type DetectiveAction =
  | { type: 'SELECT_TOOL'; tool: InvestigationToolType }
  | { type: 'INSPECT_HOTSPOT'; hotspotId: string }
  | { type: 'DISCOVER_CLUE'; clueId: string }
  | { type: 'TOGGLE_ELIMINATE_SUSPECT'; suspectId: string }
  | { type: 'SELECT_SUSPECT'; suspectId: string | null }
  | { type: 'ACCUSE_SUSPECT'; suspectId: string }
  | { type: 'START_INVESTIGATION' }
  | { type: 'RESET_CASE' }
  | { type: 'TICK_TIME'; deltaSeconds: number }

export interface CaseScoreResult {
  score: number
  stars: number
  xp: number
  isPerfect: boolean
  telemetry: DetectiveTelemetry
}
