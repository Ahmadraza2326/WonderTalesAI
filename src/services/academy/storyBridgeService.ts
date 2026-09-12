/**
 * ORBis Story & Academic Bridge Service
 * Connects reading stories, vocabulary runes, scientific phenomena, and flagship games into a unified learning loop.
 *
 * Integrates dynamically with storyContinuityEngine while preserving backwards-compatibility
 * for static curriculum seed fixtures.
 */

import {
  getStoryContinuityBridge,
  type StoryContinuityInput,
  type StoryContinuityResult,
} from './storyContinuityEngine'
import type { StoryRecord } from '../../types/story'
import type { ChildProfile } from '../../types/childProfile'

export interface StoryAcademicConnection {
  storyId: string
  storyTitle: string
  associatedSubjectId: string
  targetSkillId: string
  vocabularyWords: string[]
  scienceConcept: string
  creativePrompt: string
  capstoneGameId: string
}

/**
 * Curated static connections for backwards-compatibility with existing tests and static fixtures.
 */
export const STORY_CONNECTIONS: StoryAcademicConnection[] = [
  {
    storyId: 'story_rainforest_secret',
    storyTitle: 'The Rainforest Secret',
    associatedSubjectId: 'science',
    targetSkillId: 'sci_ecosystem_balance',
    vocabularyWords: ['Canopy', 'Photosynthesis', 'Trophic', 'Equilibrium'],
    scienceConcept: 'Tropical Rainforest Biomes & Producer-Consumer Energy Flow',
    creativePrompt: 'Draw a colorful creature uniquely adapted to live high in the canopy treetops.',
    capstoneGameId: 'ecosystem_sandbox',
  },
  {
    storyId: 'story_brave_star',
    storyTitle: 'The Brave Little Star',
    associatedSubjectId: 'astronomy',
    targetSkillId: 'astronomy_constellations_intro',
    vocabularyWords: ['Nebula', 'Constellation', 'Luminosity', 'Orbit'],
    scienceConcept: 'Star Spectral Classes & Ancient Constellation Mapping',
    creativePrompt: 'Draw your own celestial constellation and connect its star lines in the night sky.',
    capstoneGameId: 'cosmic_constellations',
  },
  {
    storyId: 'story_potion_apprentice',
    storyTitle: 'The Potion Master Apprentice',
    associatedSubjectId: 'math',
    targetSkillId: 'math_fractions_intro',
    vocabularyWords: ['Numerator', 'Denominator', 'Equilibrium', 'Elixir'],
    scienceConcept: 'Conservation of Mass & Exact Fractional Proportions',
    creativePrompt: 'Draw a glowing potion bottle with magical layered liquids of different colors.',
    capstoneGameId: 'potion_scales',
  },
]

export function getStoryConnectionForSkill(skillId: string): StoryAcademicConnection | undefined {
  return STORY_CONNECTIONS.find((conn) => conn.targetSkillId === skillId)
}

export function getStoryConnectionByStoryId(storyId: string): StoryAcademicConnection | undefined {
  return STORY_CONNECTIONS.find((conn) => conn.storyId === storyId)
}

/**
 * Dynamic bridge resolver: evaluates story DNA, age bands, and mastery progress
 * via the canonical StoryContinuityEngine. Accepts either a full StoryContinuityInput or a direct StoryRecord.
 */
export function getDynamicStoryBridge(
  inputOrStory: StoryContinuityInput | StoryRecord,
  activeChild?: ChildProfile | null
): StoryContinuityResult {
  if ('title' in inputOrStory && !('story' in inputOrStory)) {
    return getStoryContinuityBridge({
      story: inputOrStory as StoryRecord,
      activeChild: activeChild || undefined,
    })
  }
  return getStoryContinuityBridge(inputOrStory as StoryContinuityInput)
}

/**
 * Convenience helper to resolve dynamic bridge recommendations directly from a StoryRecord.
 */
export function getStoryLearningBridge(
  story: StoryRecord,
  activeChild?: ChildProfile | null
): StoryContinuityResult {
  return getStoryContinuityBridge({
    story,
    activeChild: activeChild || undefined,
  })
}

export { getStoryContinuityBridge }
export type { StoryContinuityInput, StoryContinuityResult }
