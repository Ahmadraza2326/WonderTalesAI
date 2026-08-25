/**
 * 🧪 Test Suite for ORBis Flagship Game #1 — Creature Lab & Game Universe Foundation (Milestone 2)
 * Verifies pure engine determinism, essence definitions, 24-species recipe matching,
 * secret discoveries, happy accident fallbacks, reward idempotency, collection stats,
 * scientific concepts, guest profile migration, and economy contracts.
 */

import {
  HAPPY_ACCIDENTS,
  evaluateBrew,
  getAllEssences,
  getAllCreatures,
  getCreatureById,
  getEssenceById,
  getHarmonicFluidColor,
  getRewardForRarity,
  getCollectionStats,
  migrateGuestDiscoveriesToChild,
} from '../src/services/games/creatureLabEngine'
import { gameRegistry } from '../src/services/games/gameRegistry'

let passedTests = 0
let failedTests = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`)
    passedTests++
  } else {
    console.error(`  ❌ [FAIL] ${message}`)
    failedTests++
  }
}

async function runCreatureLabTests() {
  console.log('\n🧪 Running Creature Lab Milestone 2 & Game Universe Test Suite...\n')

  // ---------------------------------------------------------------------------
  // 1. Game Universe Registry & Metadata Verification
  // ---------------------------------------------------------------------------
  console.log('--- 1. Game Universe Registry & Metadata ---')
  const allGames = gameRegistry.getAllGames()
  assert(allGames.length === 10, 'Universe registry contains exactly 10 games')

  const playableGames = gameRegistry.getPlayableGames()
  assert(playableGames.length === 1 && playableGames[0]?.id === 'creature_lab', 'Creature Lab is registered as the initial playable flagship')

  const creatureLabMeta = gameRegistry.getGameById('creature_lab')
  assert(
    Boolean(
      creatureLabMeta &&
        creatureLabMeta.title === 'Creature Lab' &&
        creatureLabMeta.route === '/games/creature-lab' &&
        creatureLabMeta.category === 'discovery' &&
        creatureLabMeta.primaryDomain === 'creativity'
    ),
    'Creature Lab metadata accurately defined'
  )

  const logicGames = gameRegistry.getGamesByDomain('logic')
  assert(logicGames.length >= 4, 'Logic domain correctly indexes all relevant standalone games')

  // ---------------------------------------------------------------------------
  // 2. Essence Definitions & Metadata Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Essence Definitions & Metadata ---')
  const essences = getAllEssences()
  assert(essences.length === 5, 'Exactly 5 Prime Essences defined in Starlight Alchemy')

  const sunEmber = getEssenceById('sun_ember')
  const moonDew = getEssenceById('moon_dew')
  const whisperSeed = getEssenceById('whisper_seed')
  const breezeFeather = getEssenceById('breeze_feather')
  const stardustCrystal = getEssenceById('stardust_crystal')

  assert(Boolean(sunEmber && sunEmber.glyph === '☀️' && sunEmber.family === 'lumina'), 'Sun Ember properly configured')
  assert(Boolean(moonDew && moonDew.glyph === '💧' && moonDew.family === 'lumina'), 'Moon Dew properly configured')
  assert(Boolean(whisperSeed && whisperSeed.glyph === '🌿' && whisperSeed.family === 'flora'), 'Whisper Seed properly configured')
  assert(Boolean(breezeFeather && breezeFeather.glyph === '💨' && breezeFeather.family === 'aero'), 'Breeze Feather properly configured')
  assert(Boolean(stardustCrystal && stardustCrystal.glyph === '✨' && stardustCrystal.family === 'cosmic'), 'Stardust Crystal properly configured')

  // ---------------------------------------------------------------------------
  // 3. Complete 24-Species Roster & Recipe Matching
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Creature Roster & Recipe Matching ---')
  const creatures = getAllCreatures()
  assert(creatures.length === 24, `Milestone 2 roster contains exactly 24 distinct species (found: ${creatures.length})`)

  // Check that every creature has a scientific concept and personality
  const allHaveScience = creatures.every((c) => c.scientificConcept && c.scientificConcept.name && c.scientificConcept.explanation)
  assert(allHaveScience, 'All 24 creatures have genuine scientific concepts defined')

  const allHavePersonality = creatures.every((c) => Boolean(c.personality && c.personality.length > 5))
  assert(allHavePersonality, 'All 24 creatures have rich personality descriptors')

  // Test standard 2-essence recipe: Sun Ember + Moon Dew
  const glowPuffRes1 = evaluateBrew(['sun_ember', 'moon_dew'], [])
  const glowPuffRes2 = evaluateBrew(['moon_dew', 'sun_ember'], [])
  assert(
    glowPuffRes1.type === 'creature' &&
      glowPuffRes1.creature?.id === 'glow_puff' &&
      glowPuffRes1.creature?.name === 'Glow-Puff',
    'Sun Ember + Moon Dew produces Glow-Puff'
  )
  assert(
    glowPuffRes2.type === 'creature' && glowPuffRes2.creature?.id === 'glow_puff',
    'Recipe matching is commutative (order independent)'
  )

  // Test secret 3-essence recipes
  const auroraRes = evaluateBrew(['sun_ember', 'moon_dew', 'stardust_crystal'], [])
  assert(
    auroraRes.type === 'creature' &&
      auroraRes.creature?.id === 'aurora_kitsune' &&
      auroraRes.creature?.rarity === 'legendary' &&
      Boolean(auroraRes.creature?.isSecret),
    'Three-essence recipe (Sun + Moon + Stardust) unlocks secret Legendary Aurora Kitsune'
  )

  const chronoRes = evaluateBrew(['whisper_seed', 'stardust_crystal', 'sun_ember'], [])
  assert(
    chronoRes.type === 'creature' && chronoRes.creature?.id === 'chrono_tortoise',
    'Secret combination (Seed + Stardust + Sun) produces Legendary Chrono-Tortoise'
  )

  // ---------------------------------------------------------------------------
  // 4. Happy Accidents & Deterministic Fallbacks
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Happy Accidents & Fallbacks ---')
  assert(HAPPY_ACCIDENTS.length === 4, 'Exactly 4 distinct Happy Accident reactions defined')

  // Invalid brew (< 2 essences) gracefully returns happy accident
  const incompleteBrew = evaluateBrew(['sun_ember'], [])
  assert(incompleteBrew.type === 'happy_accident', 'Incomplete brew (<2 essences) gracefully returns a Happy Accident')
  assert(incompleteBrew.stardustAwarded > 0, 'Happy accident awards positive crafting stardust with zero punishment')

  // ---------------------------------------------------------------------------
  // 5. Authoritative Reward Payload Contracts & Rarity Scaling
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Reward Economics & Authoritative Contract ---')
  const commonReward = getRewardForRarity('common')
  const rareReward = getRewardForRarity('rare')
  const epicReward = getRewardForRarity('epic')
  const legendaryReward = getRewardForRarity('legendary')

  assert(commonReward.xp === 25 && commonReward.stars === 2, 'Common creature awards 25 XP and 2 Stars')
  assert(rareReward.xp === 40 && rareReward.stars === 4, 'Rare creature awards 40 XP and 4 Stars')
  assert(epicReward.xp === 60 && epicReward.stars === 6, 'Epic creature awards 60 XP and 6 Stars')
  assert(legendaryReward.xp === 100 && legendaryReward.stars === 10, 'Legendary creature awards 100 XP and 10 Stars')

  // First discovery vs. Repeat discovery
  const firstBrew = evaluateBrew(['sun_ember', 'moon_dew'], [])
  const repeatBrew = evaluateBrew(['sun_ember', 'moon_dew'], ['glow_puff'])

  assert(firstBrew.isNewDiscovery === true && firstBrew.xpAwarded === 25 && firstBrew.starsAwarded === 2, 'First discovery grants full XP and Stars')
  assert(
    repeatBrew.isNewDiscovery === false &&
      repeatBrew.xpAwarded === 0 &&
      repeatBrew.starsAwarded === 0 &&
      repeatBrew.stardustAwarded === 3,
    'Repeat discovery grants 0 XP / 0 Stars and +3 Crafting Stardust'
  )

  // ---------------------------------------------------------------------------
  // 6. Fluid Color Dynamics
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Fluid Color Dynamics ---')
  const emptyFluid = getHarmonicFluidColor([])
  const singleFluid = getHarmonicFluidColor(['sun_ember'])
  const dualFluid = getHarmonicFluidColor(['sun_ember', 'moon_dew'])

  assert(Boolean(emptyFluid.primary && emptyFluid.glow), 'Empty cauldron computes default indigo ambient fluid')
  assert(singleFluid.primary === '#f59e0b', 'Single Sun Ember tints cauldron primary to solar amber')
  assert(Boolean(dualFluid.primary && dualFluid.secondary), 'Dual essences compute multi-stop radial blend')

  // ---------------------------------------------------------------------------
  // 7. Collection Statistics & Progress Calculation
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Collection Statistics Calculation ---')
  const initialStats = getCollectionStats([])
  assert(initialStats.totalSpecies === 24 && initialStats.discoveredCount === 0 && initialStats.progressPercent === 0, 'Initial stats report 0/24 (0%)')

  const partialStats = getCollectionStats(['glow_puff', 'bloom_lizard', 'aurora_kitsune'])
  assert(partialStats.discoveredCount === 3, 'Discovered count correctly reports 3')
  assert(partialStats.progressPercent === 13, 'Progress percent calculates rounded 13% for 3/24')
  assert(partialStats.secretCount === 1, 'Secret discoveries correctly tracked in stats')

  // ---------------------------------------------------------------------------
  // 8. Guest Discovery Migration Logic
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. Guest Migration Logic ---')
  // Mock localStorage for node test runner
  const storageMap: Record<string, string> = {
    orbis_creature_lab_discovered_guest: JSON.stringify(['glow_puff', 'bloom_lizard']),
    orbis_creature_lab_stardust_guest: '15',
    orbis_creature_lab_metadata_guest: JSON.stringify({
      glow_puff: { creatureId: 'glow_puff', discoveredAt: '2026-08-24T00:00:00Z', recipeEssences: ['moon_dew', 'sun_ember'], discoveryCount: 1 },
    }),
  }

  // Inject mock window.localStorage if running in Node
  if (typeof (global as any).window === 'undefined') {
    ;(global as any).window = {
      localStorage: {
        getItem: (k: string) => storageMap[k] || null,
        setItem: (k: string, v: string) => {
          storageMap[k] = v
        },
        removeItem: (k: string) => {
          delete storageMap[k]
        },
      },
    }
  }

  const migrationRes = migrateGuestDiscoveriesToChild('test_child_123')
  assert(migrationRes.success && migrationRes.migratedCount === 2, 'Successfully migrated 2 guest discoveries into child profile')
  assert(storageMap['orbis_creature_lab_discovered_test_child_123'] !== undefined, 'Target child profile storage populated')
  assert(storageMap['orbis_creature_lab_discovered_guest'] === undefined, 'Guest temporary storage cleaned up after migration')

  // ---------------------------------------------------------------------------
  // 9. Audio Synthesis Cue Registrations
  // ---------------------------------------------------------------------------
  console.log('\n--- 9. Audio Synthesis & Sfx Integration ---')
  const glowPuff = getCreatureById('glow_puff')
  const mistWhale = getCreatureById('mist_whale')
  const auroraKitsune = getCreatureById('aurora_kitsune')

  assert(glowPuff?.soundCue === 'creature_reveal', 'Common creature triggers creature_reveal sound cue')
  assert(mistWhale?.soundCue === 'rare_discovery', 'Rare creature triggers rare_discovery sound cue')
  assert(auroraKitsune?.soundCue === 'legendary_discovery', 'Legendary creature triggers legendary_discovery sound cue')

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n======================================================')
  console.log(`🎉 Creature Lab Milestone 2 Test Suite Completed!`)
  console.log(`   Passed: ${passedTests}`)
  console.log(`   Failed: ${failedTests}`)
  console.log('======================================================\n')

  if (failedTests > 0) {
    process.exit(1)
  }
}

runCreatureLabTests().catch((err) => {
  console.error('Unhandled test suite error:', err)
  process.exit(1)
})
