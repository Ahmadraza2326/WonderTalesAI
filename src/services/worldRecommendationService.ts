import type { StoryRecord } from '../types/story'
import type { PlaygroundGameId } from '../types/playground'

export interface StoryGameRecommendation {
  stationId: PlaygroundGameId
  stationTitle: string
  stationEmoji: string
  route: string
  headline: string
  callToAction: string
  reason: string
  accentColor: string
  bannerGradient: string
}

export interface StorySeedPrompt {
  id: string
  title: string
  theme: string
  character: string
  emoji: string
  moral: string
  unlockedByStationId: PlaygroundGameId
  unlockedByLabel: string
  isUnlocked: boolean
}

/**
 * Deterministically analyzes story text, theme, and title to recommend
 * the most contextually relevant flagship mini-game station.
 * Zero runtime AI cost.
 */
export function getStationRecommendationForStory(story: StoryRecord): StoryGameRecommendation {
  const storyText = story.learning_package?.story || (typeof story.story_content === 'string' ? story.story_content : '')
  const content = `${story.title || ''} ${story.theme || ''} ${story.moral || ''} ${storyText}`.toLowerCase()

  // 1. Check for Detective / Mystery / Clue keywords
  if (
    content.includes('detective') ||
    content.includes('mystery') ||
    content.includes('clue') ||
    content.includes('lost') ||
    content.includes('hidden') ||
    content.includes('suspect') ||
    content.includes('secret') ||
    content.includes('who')
  ) {
    return {
      stationId: 'mystery_detective',
      stationTitle: 'Mystery Detective',
      stationEmoji: '🔍',
      route: '/playroom/mystery-detective',
      headline: 'A New Mystery Awaits in the Whispering Woods!',
      callToAction: 'Grab your UV Brush & Decoder Lens to solve crime scene puzzles.',
      reason: 'Your story was full of intrigue and secrets! Put your deduction skills to the test.',
      accentColor: '#a855f7',
      bannerGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    }
  }

  // 2. Check for Physics / Machine / Robot / Invention keywords
  if (
    content.includes('robot') ||
    content.includes('machine') ||
    content.includes('invent') ||
    content.includes('gear') ||
    content.includes('rocket') ||
    content.includes('fly') ||
    content.includes('space') ||
    content.includes('build') ||
    content.includes('clock')
  ) {
    return {
      stationId: 'magic_machine',
      stationTitle: 'Magic Machine Lab',
      stationEmoji: '⚙️',
      route: '/playroom/magic-machine',
      headline: 'The Clockwork Workshop Needs Your Inventions!',
      callToAction: 'Place springs, ramps, and magnets to guide little Sproutlings.',
      reason: 'Inspired by the inventions in your story? Build your own physics contraption!',
      accentColor: '#06b6d4',
      bannerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #06b6d4 100%)',
    }
  }

  // 3. Check for Potions / Market / Baking / Math / Measure keywords
  if (
    content.includes('potion') ||
    content.includes('market') ||
    content.includes('bake') ||
    content.includes('cake') ||
    content.includes('shop') ||
    content.includes('weigh') ||
    content.includes('balance') ||
    content.includes('crystal') ||
    content.includes('herb')
  ) {
    return {
      stationId: 'potion_scales',
      stationTitle: 'Potion Market Scales',
      stationEmoji: '⚖️',
      route: '/playroom/potion-scales',
      headline: 'Animal Customers are Waiting at the Apothecary!',
      callToAction: 'Balance magical weights & pour bubbling beakers on the brass scales.',
      reason: 'Your story celebrated recipes and trade! Balance orders for friendly woodland customers.',
      accentColor: '#10b981',
      bannerGradient: 'linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #06b6d4 100%)',
    }
  }

  // 4. Default to Creature Lab (Creatures, Animals, Magic, Nature)
  return {
    stationId: 'creature_lab',
    stationTitle: 'Creature Lab',
    stationEmoji: '🧪',
    route: '/games/creature-lab',
    headline: 'Discover the Living Companions of the Astral Forest!',
    callToAction: 'Mix Sun, Moon, and Seed essences in the enchanted cauldron.',
    reason: 'Meet magical animal companions just like the heroes in your story!',
    accentColor: '#ec4899',
    bannerGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #ec4899 100%)',
  }
}

/**
 * Returns story seed ideas unlocked by the child's gameplay across the 4 flagship stations.
 */
export function getUnlockedStorySeeds(
  localDiscoveries: {
    creatureDiscoveriesCount?: number
    machineCompletedCount?: number
    detectiveSolvedCount?: number
    potionBrewedCount?: number
  } = {}
): StorySeedPrompt[] {
  const creatureCount = localDiscoveries.creatureDiscoveriesCount ?? 0
  const machineCount = localDiscoveries.machineCompletedCount ?? 0
  const detectiveCount = localDiscoveries.detectiveSolvedCount ?? 0
  const potionCount = localDiscoveries.potionBrewedCount ?? 0

  return [
    {
      id: 'seed_aurora_kitsune',
      title: 'The Starlit Quest of the Aurora Kitsune',
      theme: '🌌 Celestial Aurora Peaks',
      character: 'Kitsune the Star Fox & Maya',
      emoji: '🦊',
      moral: '🌟 Curiosity & True Courage',
      unlockedByStationId: 'creature_lab',
      unlockedByLabel: 'Hatch 3 Creatures in Creature Lab',
      isUnlocked: creatureCount >= 3,
    },
    {
      id: 'seed_clockwork_tower',
      title: 'The Great Clock Tower Flight',
      theme: '⚙️ Steampunk Cloud Citadel',
      character: 'Barnaby Bear & the Sproutling Inventor',
      emoji: '🦉',
      moral: '💡 Teamwork & Persistence',
      unlockedByStationId: 'magic_machine',
      unlockedByLabel: 'Build 3 Inventions in Magic Machine Lab',
      isUnlocked: machineCount >= 3,
    },
    {
      id: 'seed_missing_honey_tart',
      title: 'The Mystery of the Whispering Windmill',
      theme: '🔍 Whispering Woods Detective Agency',
      character: 'Detective Pippin the Hedgehog',
      emoji: '🦔',
      moral: '🤝 Honesty & Forgiveness',
      unlockedByStationId: 'mystery_detective',
      unlockedByLabel: 'Solve 2 Cases in Mystery Detective',
      isUnlocked: detectiveCount >= 2,
    },
    {
      id: 'seed_dragon_potion',
      title: 'The Dragon’s Midnight Elixir',
      theme: '⚖️ Emerald Apothecary Bazaar',
      character: 'Draco the Gentle Dragon & Madame Brioche',
      emoji: '🐉',
      moral: '❤️ Generosity & Precision',
      unlockedByStationId: 'potion_scales',
      unlockedByLabel: 'Brew 3 Potions in Potion Market Scales',
      isUnlocked: potionCount >= 3,
    },
  ]
}
