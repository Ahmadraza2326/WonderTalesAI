import type {
  ElementalTreat,
  SanctuaryCreatureState,
  SanctuaryData,
  SanctuaryBiome,
  CreatureMood,
  FeedResult,
  PetResult,
} from '../../types/games/sanctuary'
import type { CreatureSpecies } from '../../types/games/creatureLab'
import {
  CREATURE_ROSTER,
  getCreatureById,
} from './creatureLabEngine'
import { sfxService } from '../audio/sfxService'

/**
 * 🍬 5 Elemental Treats of the ORBis Sanctuary
 */
export const SANCTUARY_TREATS: ElementalTreat[] = [
  {
    id: 'sunberry',
    name: 'Sunberry Crunch',
    emoji: '☀️',
    family: 'lumina',
    description: 'Crisp golden berry bursting with warm morning sunshine and vitamin glow.',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    happinessBoost: 25,
    friendshipXp: 15,
  },
  {
    id: 'sprout_leaf',
    name: 'Sproutleaf Chew',
    emoji: '🌿',
    family: 'flora',
    description: 'Fresh, mineral-rich clover leaf harvested from the Whispering Woods.',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    happinessBoost: 25,
    friendshipXp: 15,
  },
  {
    id: 'cloud_puff',
    name: 'Cloudpuff Soufflé',
    emoji: '💨',
    family: 'aero',
    description: 'Fluffy, aerated cotton treat spun from high-altitude stardust breezes.',
    primaryColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    happinessBoost: 25,
    friendshipXp: 15,
  },
  {
    id: 'ember_biscuit',
    name: 'Ember Biscuit',
    emoji: '🔥',
    family: 'pyro',
    description: 'Warm, spiced cracker with a crackling alchemical pop in every bite.',
    primaryColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    happinessBoost: 25,
    friendshipXp: 15,
  },
  {
    id: 'stardust_nectar',
    name: 'Stardust Nectar',
    emoji: '✨',
    family: 'cosmic',
    description: 'Iridescent celestial syrup loved universally by all mystical creatures.',
    primaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    happinessBoost: 30,
    friendshipXp: 20,
  },
]

export const DEFAULT_TREAT_INVENTORY: Record<string, number> = {
  sunberry: 5,
  sprout_leaf: 5,
  cloud_puff: 5,
  ember_biscuit: 5,
  stardust_nectar: 3,
}

export class SanctuaryService {
  private getStorageKey(childId: string): string {
    const id = childId && childId.trim() !== '' ? childId : 'guest'
    return `orbis_sanctuary_${id}`
  }

  /**
   * Calculates XP required to advance from current friendship level to next
   */
  public getXpForNextLevel(level: number): number {
    return Math.max(30, level * 50)
  }

  /**
   * Computes creature mood based on current happiness score
   */
  public computeMood(happiness: number): CreatureMood {
    if (happiness >= 85) return 'ecstatic'
    if (happiness >= 65) return 'happy'
    if (happiness >= 40) return 'content'
    if (happiness >= 20) return 'hungry'
    return 'sleepy'
  }

  /**
   * Reads raw sanctuary data from localStorage with auto-migration and decay
   */
  public getSanctuaryData(childId: string = 'guest'): SanctuaryData {
    const defaultData: SanctuaryData = {
      childId,
      activeBiome: 'all',
      creatures: {},
      treats: { ...DEFAULT_TREAT_INVENTORY },
      lastDailyTreatRefill: new Date().toISOString().split('T')[0],
      totalPatsEver: 0,
      totalFeedingsEver: 0,
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultData
    }

    try {
      const raw = window.localStorage.getItem(this.getStorageKey(childId))
      let data: SanctuaryData = raw ? JSON.parse(raw) : defaultData

      // Check daily treat refill
      const today = new Date().toISOString().split('T')[0]
      if (data.lastDailyTreatRefill !== today) {
        data = this.refillDailyTreats(data, today)
      }

      // Apply natural passive happiness decay
      data = this.applyPassiveDecay(data)

      return data
    } catch {
      return defaultData
    }
  }

  /**
   * Saves updated sanctuary data
   */
  public saveSanctuaryData(data: SanctuaryData): void {
    if (typeof window === 'undefined' || !window.localStorage) return
    try {
      window.localStorage.setItem(this.getStorageKey(data.childId), JSON.stringify(data))
    } catch {
      // Ignore storage write errors
    }
  }

  /**
   * Adds daily bonus treats (+3 to each treat category)
   */
  private refillDailyTreats(data: SanctuaryData, today: string): SanctuaryData {
    const updatedTreats = { ...data.treats }
    SANCTUARY_TREATS.forEach((t) => {
      updatedTreats[t.id] = (updatedTreats[t.id] || 0) + 3
    })

    const updated: SanctuaryData = {
      ...data,
      treats: updatedTreats,
      lastDailyTreatRefill: today,
    }
    this.saveSanctuaryData(updated)
    return updated
  }

  /**
   * Passive gentle decay: creatures gently get hungry over hours, but never fall below 25
   */
  private applyPassiveDecay(data: SanctuaryData): SanctuaryData {
    const now = Date.now()
    let changed = false
    const updatedCreatures = { ...data.creatures }

    Object.keys(updatedCreatures).forEach((cId) => {
      const state = updatedCreatures[cId]
      const lastFedMs = state.lastFedAt ? new Date(state.lastFedAt).getTime() : now
      const hoursSinceFed = Math.max(0, (now - lastFedMs) / (1000 * 60 * 60))

      // Decay by 2 points per 4 hours, floor at 25
      if (hoursSinceFed >= 4 && state.happiness > 25) {
        const decayAmount = Math.min(20, Math.floor(hoursSinceFed / 4) * 2)
        const newHappiness = Math.max(25, state.happiness - decayAmount)
        if (newHappiness !== state.happiness) {
          updatedCreatures[cId] = {
            ...state,
            happiness: newHappiness,
            currentMood: this.computeMood(newHappiness),
          }
          changed = true
        }
      }
    })

    if (changed) {
      const updated = { ...data, creatures: updatedCreatures }
      this.saveSanctuaryData(updated)
      return updated
    }
    return data
  }

  /**
   * Initializes or fetches a creature state within the sanctuary
   */
  public getOrCreateCreatureState(
    sanctuaryData: SanctuaryData,
    creatureId: string
  ): { state: SanctuaryCreatureState; updatedData: SanctuaryData } {
    if (sanctuaryData.creatures[creatureId]) {
      return {
        state: sanctuaryData.creatures[creatureId],
        updatedData: sanctuaryData,
      }
    }

    const defaultState: SanctuaryCreatureState = {
      creatureId,
      happiness: 70, // Start healthy & content
      friendshipLevel: 1,
      friendshipXp: 0,
      totalPetted: 0,
      totalFed: 0,
      lastFedAt: new Date().toISOString(),
      lastPettedAt: new Date().toISOString(),
      currentMood: 'happy',
      favoriteFoodMatchCount: 0,
    }

    const updatedData: SanctuaryData = {
      ...sanctuaryData,
      creatures: {
        ...sanctuaryData.creatures,
        [creatureId]: defaultState,
      },
    }

    this.saveSanctuaryData(updatedData)
    return { state: defaultState, updatedData }
  }

  /**
   * Interacts with a creature by Petting
   */
  public petCreature(childId: string, creatureId: string): PetResult {
    const data = this.getSanctuaryData(childId)
    const { state } = this.getOrCreateCreatureState(data, creatureId)
    const species = getCreatureById(creatureId)

    const happinessBefore = state.happiness
    const happinessGained = Math.min(100 - happinessBefore, 10)
    const happinessAfter = Math.min(100, happinessBefore + happinessGained)

    const friendshipXpGained = 8
    let currentXp = state.friendshipXp + friendshipXpGained
    let currentLevel = state.friendshipLevel
    const requiredXp = this.getXpForNextLevel(currentLevel)

    if (currentXp >= requiredXp && currentLevel < 10) {
      currentLevel += 1
      currentXp = currentXp - requiredXp
      sfxService.play('star_pop')
    }

    const newPetted = state.totalPetted + 1
    const updatedState: SanctuaryCreatureState = {
      ...state,
      happiness: happinessAfter,
      friendshipLevel: currentLevel,
      friendshipXp: currentXp,
      totalPetted: newPetted,
      lastPettedAt: new Date().toISOString(),
      currentMood: this.computeMood(happinessAfter),
    }

    const updatedData: SanctuaryData = {
      ...data,
      creatures: {
        ...data.creatures,
        [creatureId]: updatedState,
      },
      totalPatsEver: data.totalPatsEver + 1,
    }

    this.saveSanctuaryData(updatedData)

    // Play tactile purr / pet SFX
    if (newPetted % 3 === 0) {
      sfxService.play('creature_purr')
    } else {
      sfxService.play('creature_pet')
    }

    const name = state.customNickname || species?.name || 'Creature'
    const reactions = ['purrs softly with starlight sparkles', 'wiggles happily', 'nuzzles your hand warmly', 'glows brighter with joy']
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]

    return {
      happinessBefore,
      happinessAfter,
      happinessGained,
      friendshipXpGained,
      totalPetted: newPetted,
      reactionSound: 'creature_pet',
      reactionEmoji: '💖',
      message: `${name} ${randomReaction}!`,
    }
  }

  /**
   * Feeds a creature an elemental treat
   */
  public feedCreature(childId: string, creatureId: string, treatId: string): FeedResult {
    const data = this.getSanctuaryData(childId)
    const currentTreats = { ...data.treats }
    const treatCount = currentTreats[treatId] || 0

    if (treatCount <= 0) {
      sfxService.play('mistake_soft')
      return {
        success: false,
        isFavorite: false,
        happinessBefore: 0,
        happinessAfter: 0,
        happinessGained: 0,
        friendshipXpGained: 0,
        leveledUp: false,
        newLevel: 1,
        message: 'You have run out of this treat! Refill with stardust or wait for daily drops.',
      }
    }

    // Deduct treat
    currentTreats[treatId] = treatCount - 1

    const { state } = this.getOrCreateCreatureState(data, creatureId)
    const species = getCreatureById(creatureId)
    const treat = SANCTUARY_TREATS.find((t) => t.id === treatId)

    // Check if treat matches species family or universal cosmic
    const isFamilyMatch = treat && species && (treat.family === species.family || treat.family === 'cosmic')
    const isFavorite = Boolean(isFamilyMatch)

    const happinessBefore = state.happiness
    const baseBoost = treat ? treat.happinessBoost : 20
    const happinessBoost = isFavorite ? baseBoost + 15 : baseBoost
    const happinessGained = Math.min(100 - happinessBefore, happinessBoost)
    const happinessAfter = Math.min(100, happinessBefore + happinessGained)

    const baseXp = treat ? treat.friendshipXp : 15
    const friendshipXpGained = isFavorite ? baseXp + 20 : baseXp

    let currentXp = state.friendshipXp + friendshipXpGained
    let currentLevel = state.friendshipLevel
    let leveledUp = false
    const requiredXp = this.getXpForNextLevel(currentLevel)

    if (currentXp >= requiredXp && currentLevel < 10) {
      currentLevel += 1
      currentXp = currentXp - requiredXp
      leveledUp = true
      sfxService.play('victory_fanfare')
    } else {
      sfxService.play('creature_feed')
    }

    const updatedState: SanctuaryCreatureState = {
      ...state,
      happiness: happinessAfter,
      friendshipLevel: currentLevel,
      friendshipXp: currentXp,
      totalFed: state.totalFed + 1,
      lastFedAt: new Date().toISOString(),
      currentMood: this.computeMood(happinessAfter),
      favoriteFoodMatchCount: state.favoriteFoodMatchCount + (isFavorite ? 1 : 0),
    }

    const updatedData: SanctuaryData = {
      ...data,
      creatures: {
        ...data.creatures,
        [creatureId]: updatedState,
      },
      treats: currentTreats,
      totalFeedingsEver: data.totalFeedingsEver + 1,
    }

    this.saveSanctuaryData(updatedData)

    const name = state.customNickname || species?.name || 'Creature'
    let message = `${name} munched on the ${treat?.name || 'treat'}!`
    if (isFavorite) {
      message = `🌟 SUPER DELICIOUS! ${name} absolutely LOVES ${treat?.name} (+${happinessBoost}% Happiness)!`
    }
    if (leveledUp) {
      message += ` 👑 Friendship increased to Level ${currentLevel}!`
    }

    return {
      success: true,
      isFavorite,
      happinessBefore,
      happinessAfter,
      happinessGained,
      friendshipXpGained,
      leveledUp,
      newLevel: currentLevel,
      message,
    }
  }

  /**
   * Custom nickname assignment for child bond
   */
  public setNickname(childId: string, creatureId: string, nickname: string): void {
    const data = this.getSanctuaryData(childId)
    const { state } = this.getOrCreateCreatureState(data, creatureId)
    const trimmed = nickname.trim().slice(0, 24)

    const updatedState: SanctuaryCreatureState = {
      ...state,
      customNickname: trimmed.length > 0 ? trimmed : undefined,
    }

    const updatedData: SanctuaryData = {
      ...data,
      creatures: {
        ...data.creatures,
        [creatureId]: updatedState,
      },
    }

    this.saveSanctuaryData(updatedData)
    sfxService.play('card_flip')
  }

  /**
   * Refills treat inventory with stardust or reward packets
   */
  public grantTreats(childId: string, treatId: string, count: number = 3): void {
    const data = this.getSanctuaryData(childId)
    const updatedTreats = {
      ...data.treats,
      [treatId]: (data.treats[treatId] || 0) + count,
    }

    const updatedData: SanctuaryData = {
      ...data,
      treats: updatedTreats,
    }

    this.saveSanctuaryData(updatedData)
    sfxService.play('treat_pop')
  }

  /**
   * Sets active biome environment filter
   */
  public setActiveBiome(childId: string, biome: SanctuaryBiome): void {
    const data = this.getSanctuaryData(childId)
    const updatedData: SanctuaryData = {
      ...data,
      activeBiome: biome,
    }
    this.saveSanctuaryData(updatedData)
  }

  /**
   * Retrieves all discovered creatures from Creature Lab for the active child profile
   */
  public getDiscoveredCreatures(childId: string = 'guest'): CreatureSpecies[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return CREATURE_ROSTER.slice(0, 2) // Demo starter creatures if SSR
    }

    try {
      const storageKey = `orbis_creature_lab_discovered_${childId}`
      const raw = window.localStorage.getItem(storageKey)
      const ids: string[] = raw ? JSON.parse(raw) : []

      if (ids.length === 0) {
        return []
      }

      return ids
        .map((id) => getCreatureById(id))
        .filter((c): c is CreatureSpecies => c !== undefined)
    } catch {
      return []
    }
  }
}

export const sanctuaryService = new SanctuaryService()
