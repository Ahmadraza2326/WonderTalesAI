import type { ChildProfile } from '../types/childProfile'
import type { CognitiveDomain } from '../types/experience'
import { getAllCreatures } from './games/creatureLabEngine'
import { MAGIC_MACHINE_PUZZLES } from './games/magicMachineEngine'
import { CURATED_DETECTIVE_CASES } from './games/mysteryDetectiveEngine'
import { CURATED_POTION_PUZZLES } from './games/potionScalesEngine'

export interface StationMasteryStats {
  id: string
  title: string
  icon: string
  route: string
  category: string
  primaryDomain: CognitiveDomain
  completedCount: number
  totalAvailable: number
  masteryPercentage: number
  badgeLabel: string
}

export interface ChildAdventureProgress {
  childId: string
  childName: string
  avatar: string
  xp: number
  stars: number
  currentStreak: number
  level: number
  explorerTitle: string
  stations: {
    creatureLab: StationMasteryStats
    magicMachine: StationMasteryStats
    mysteryDetective: StationMasteryStats
    potionScales: StationMasteryStats
  }
  cognitiveDomainScores: Record<CognitiveDomain, { xp: number; level: number; label: string }>
  unlockedScienceDossiersCount: number
  overallProgressPercentage: number
}

/**
 * Derives an inspirational, non-coercive Explorer Title based on accumulated XP.
 */
export function computeExplorerTitle(xp: number): { title: string; badge: string; level: number } {
  if (xp >= 750) return { title: 'Grand Master of the Cosmos', badge: '🪐', level: 6 }
  if (xp >= 500) return { title: 'Master of Elemental Alchemy', badge: '⚖️', level: 5 }
  if (xp >= 300) return { title: 'Ace Detective Sleuth', badge: '🔍', level: 4 }
  if (xp >= 150) return { title: 'Master Contraption Engineer', badge: '⚙️', level: 3 }
  if (xp >= 50) return { title: 'Apprentice Star-Alchemist', badge: '🧪', level: 2 }
  return { title: 'Novice Star-Seeker', badge: '🌟', level: 1 }
}

/**
 * Calculates a unified child adventure progress model combining server-authoritative
 * profile metrics (XP, Stars, Streaks) with station discovery registries.
 */
export function calculateAdventureProgress(
  child: ChildProfile | null,
  localDiscoveries: {
    creatureDiscoveriesCount?: number
    machineCompletedCount?: number
    detectiveSolvedCount?: number
    potionBrewedCount?: number
  } = {}
): ChildAdventureProgress {
  const childId = child?.id || 'guest'
  const childName = child?.name || 'Explorer'
  const avatar = child?.avatar || '🌟'
  const xp = child?.xp || 0
  const stars = child?.stars || 10
  const currentStreak = child?.current_streak || 1

  const { title: explorerTitle, level } = computeExplorerTitle(xp)

  const allCreatures = getAllCreatures()
  const creatureCount = Math.min(
    allCreatures.length,
    Math.max(0, localDiscoveries.creatureDiscoveriesCount ?? 0)
  )
  const machineCount = Math.min(
    MAGIC_MACHINE_PUZZLES.length,
    Math.max(0, localDiscoveries.machineCompletedCount ?? 0)
  )
  const detectiveCount = Math.min(
    CURATED_DETECTIVE_CASES.length,
    Math.max(0, localDiscoveries.detectiveSolvedCount ?? 0)
  )
  const potionCount = Math.min(
    CURATED_POTION_PUZZLES.length,
    Math.max(0, localDiscoveries.potionBrewedCount ?? 0)
  )

  const creatureLab: StationMasteryStats = {
    id: 'creature_lab',
    title: 'Creature Lab',
    icon: '🧪',
    route: '/games/creature-lab',
    category: 'alchemy_discovery',
    primaryDomain: 'creativity',
    completedCount: creatureCount,
    totalAvailable: allCreatures.length, // 24
    masteryPercentage: Math.round((creatureCount / allCreatures.length) * 100),
    badgeLabel: creatureCount >= allCreatures.length ? 'Almanac Master' : `${creatureCount}/${allCreatures.length} Species`,
  }

  const magicMachine: StationMasteryStats = {
    id: 'magic_machine',
    title: 'Magic Machine Lab',
    icon: '⚙️',
    route: '/playroom/magic-machine',
    category: 'physics_engineering',
    primaryDomain: 'logic',
    completedCount: machineCount,
    totalAvailable: MAGIC_MACHINE_PUZZLES.length, // 12
    masteryPercentage: Math.round((machineCount / MAGIC_MACHINE_PUZZLES.length) * 100),
    badgeLabel: machineCount >= 12 ? 'Master Inventor' : `${machineCount}/12 Inventions`,
  }

  const mysteryDetective: StationMasteryStats = {
    id: 'mystery_detective',
    title: 'Mystery Detective',
    icon: '🔍',
    route: '/playroom/mystery-detective',
    category: 'deductive_logic',
    primaryDomain: 'logic',
    completedCount: detectiveCount,
    totalAvailable: CURATED_DETECTIVE_CASES.length, // 12
    masteryPercentage: Math.round((detectiveCount / CURATED_DETECTIVE_CASES.length) * 100),
    badgeLabel: detectiveCount >= 12 ? 'Chief Inquisitor' : `${detectiveCount}/12 Cases`,
  }

  const potionScales: StationMasteryStats = {
    id: 'potion_scales',
    title: 'Potion Market Scales',
    icon: '⚖️',
    route: '/playroom/potion-scales',
    category: 'alchemy_discovery',
    primaryDomain: 'logic',
    completedCount: potionCount,
    totalAvailable: CURATED_POTION_PUZZLES.length, // 18
    masteryPercentage: Math.round((potionCount / CURATED_POTION_PUZZLES.length) * 100),
    badgeLabel: potionCount >= 18 ? 'Master Apothecary' : `${potionCount}/18 Potions`,
  }

  // 2. Cognitive Domain Distribution (Derived from XP weighting)
  const totalTasks = creatureCount + machineCount + detectiveCount + potionCount
  const overallPercentage =
    totalTasks > 0
      ? Math.round(
          ((creatureLab.masteryPercentage +
            magicMachine.masteryPercentage +
            mysteryDetective.masteryPercentage +
            potionScales.masteryPercentage) /
            400) *
            100
        )
      : 0

  const logicXp = Math.round(xp * 0.4) + machineCount * 15 + potionCount * 15 + detectiveCount * 15
  const creativityXp = Math.round(xp * 0.3) + creatureCount * 25
  const memoryXp = Math.round(xp * 0.15) + detectiveCount * 10
  const vocabularyXp = Math.round(xp * 0.15) + potionCount * 5

  const cognitiveDomainScores: Record<CognitiveDomain, { xp: number; level: number; label: string }> = {
    logic: {
      xp: logicXp,
      level: Math.max(1, Math.floor(logicXp / 100) + 1),
      label: 'Logic & Physics',
    },
    creativity: {
      xp: creativityXp,
      level: Math.max(1, Math.floor(creativityXp / 100) + 1),
      label: 'Creativity & Discovery',
    },
    memory: {
      xp: memoryXp,
      level: Math.max(1, Math.floor(memoryXp / 100) + 1),
      label: 'Memory & Working Recall',
    },
    vocabulary: {
      xp: vocabularyXp,
      level: Math.max(1, Math.floor(vocabularyXp / 100) + 1),
      label: 'Language & Concepts',
    },
    phonics: {
      xp: Math.round(xp * 0.1),
      level: Math.max(1, Math.floor(xp / 200) + 1),
      label: 'Sound & Rhythm',
    },
    comprehension: {
      xp: Math.round(xp * 0.2) + detectiveCount * 10,
      level: Math.max(1, Math.floor(xp / 150) + 1),
      label: 'Story Comprehension',
    },
  }

  // 3. Science Dossiers Unlocked
  const unlockedScienceDossiersCount =
    creatureCount + machineCount + detectiveCount + potionCount

  return {
    childId,
    childName,
    avatar,
    xp,
    stars,
    currentStreak,
    level,
    explorerTitle,
    stations: {
      creatureLab,
      magicMachine,
      mysteryDetective,
      potionScales,
    },
    cognitiveDomainScores,
    unlockedScienceDossiersCount,
    overallProgressPercentage: overallPercentage,
  }
}

export interface ScienceDossier {
  id: string
  sourceStationId: 'creature_lab' | 'magic_machine' | 'mystery_detective' | 'potion_scales'
  sourceStationTitle: string
  sourceStationIcon: string
  title: string
  description: string
  funFact: string
  unlocked: boolean
}

/**
 * Returns all 66 Science of Wonder Dossiers across the 4 flagship stations with unlock flags.
 */
export function getAllScienceDossiers(
  localDiscoveries: {
    creatureDiscoveriesCount?: number
    machineCompletedCount?: number
    detectiveSolvedCount?: number
    potionBrewedCount?: number
  } = {}
): ScienceDossier[] {
  const dossiers: ScienceDossier[] = []

  const creatureCount = localDiscoveries.creatureDiscoveriesCount ?? 0
  const machineCount = localDiscoveries.machineCompletedCount ?? 0
  const detectiveCount = localDiscoveries.detectiveSolvedCount ?? 0
  const potionCount = localDiscoveries.potionBrewedCount ?? 0

  // 1. Creature Lab Dossiers (24)
  const creatures = getAllCreatures()
  creatures.forEach((c, idx) => {
    dossiers.push({
      id: `sci_creature_${c.id}`,
      sourceStationId: 'creature_lab',
      sourceStationTitle: 'Creature Lab',
      sourceStationIcon: '🧪',
      title: c.scientificConcept?.name || c.name,
      description: c.scientificConcept?.explanation || c.loreSnippet,
      funFact: c.scientificConcept?.funFact || `Discovered via ${c.recipe.essenceIds.join(' + ')}`,
      unlocked: idx < creatureCount,
    })
  })

  // 2. Magic Machine Lab Dossiers (12)
  MAGIC_MACHINE_PUZZLES.forEach((p, idx) => {
    dossiers.push({
      id: `sci_machine_${p.id}`,
      sourceStationId: 'magic_machine',
      sourceStationTitle: 'Magic Machine Lab',
      sourceStationIcon: '⚙️',
      title: p.scientificConcept?.title || p.title,
      description: p.scientificConcept?.description || p.subtitle,
      funFact: p.scientificConcept?.funFact || p.hint,
      unlocked: idx < machineCount,
    })
  })

  // 3. Mystery Detective Dossiers (12)
  CURATED_DETECTIVE_CASES.forEach((c, idx) => {
    dossiers.push({
      id: `sci_detective_${c.id}`,
      sourceStationId: 'mystery_detective',
      sourceStationTitle: 'Mystery Detective',
      sourceStationIcon: '🔍',
      title: c.scientificConcept?.title || c.title,
      description: c.scientificConcept?.description || c.narrativeIntro,
      funFact: c.scientificConcept?.funFact || `Solved in ${c.locationName}`,
      unlocked: idx < detectiveCount,
    })
  })

  // 4. Potion Market Scales Dossiers (18)
  CURATED_POTION_PUZZLES.forEach((p, idx) => {
    dossiers.push({
      id: `sci_potion_${p.id}`,
      sourceStationId: 'potion_scales',
      sourceStationTitle: 'Potion Market Scales',
      sourceStationIcon: '⚖️',
      title: p.scientificConcept?.conceptTitle || p.title,
      description: p.scientificConcept?.kidExplanation || p.recipe.solutionHint,
      funFact: p.scientificConcept?.funFact || `Customer: ${p.recipe.customer.name}`,
      unlocked: idx < potionCount,
    })
  })

  return dossiers
}

