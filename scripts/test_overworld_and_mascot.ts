import { OVERWORLD_NODES } from '../src/components/overworld/OverworldJourneyMap'

console.log('🧪 RUNNING OVERWORLD JOURNEY MAP & ORBY MASCOT TEST SUITE...\n')

let passCount = 0
let failCount = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`)
    passCount++
  } else {
    console.error(`  ✗ FAIL: ${message}`)
    failCount++
  }
}

// 1. Overworld Node Count & Progression
console.log('1. Validating 10 Overworld Milestone Nodes...')
assert(OVERWORLD_NODES.length === 10, `Has 10 milestone nodes (got ${OVERWORLD_NODES.length})`)

const biomes = new Set(OVERWORLD_NODES.map((n) => n.biome))
assert(biomes.has('canopy'), 'Includes Starlight Canopy biome')
assert(biomes.has('valley'), 'Includes Clockwork Valley biome')
assert(biomes.has('woods'), 'Includes Detective Woods biome')
assert(biomes.has('hills'), 'Includes Apothecary Hills biome')
assert(biomes.has('citadel'), 'Includes Celestial Citadel biome')

// 2. Ascending Level and XP Hierarchy
console.log('\n2. Testing Ascending Difficulty & XP Hierarchy...')
for (let i = 1; i < OVERWORLD_NODES.length; i++) {
  const prev = OVERWORLD_NODES[i - 1]
  const curr = OVERWORLD_NODES[i]
  assert(curr.requiredXp >= prev.requiredXp, `Node #${i + 1} (${curr.title}) XP >= Node #${i} (${prev.title})`)
  assert(curr.requiredLevel >= prev.requiredLevel, `Node #${i + 1} Level >= Node #${i} Level`)
  assert(Boolean(curr.route), `Node #${i + 1} has valid route (${curr.route})`)
  assert(curr.starsReward > 0, `Node #${i + 1} awards stars (> 0)`)
}

// 3. Progressive Unlock Simulations
console.log('\n3. Simulating Progressive Unlocks Across Levels...')
function getUnlockedNodes(xp: number) {
  return OVERWORLD_NODES.filter((n) => xp >= n.requiredXp)
}

const noviceUnlocked = getUnlockedNodes(0)
assert(noviceUnlocked.length === 1, '0 XP unlocks exactly starting node')
assert(noviceUnlocked[0].id === 'node_1_story_grove', 'First node is Story Grove')

const apprenticeUnlocked = getUnlockedNodes(60)
assert(apprenticeUnlocked.length === 3, '60 XP unlocks 3 nodes (Story, Creature Lab, Magic Machine)')

const detectiveUnlocked = getUnlockedNodes(180)
assert(detectiveUnlocked.length === 5, '180 XP unlocks 5 nodes through Detective Woods')

const masterUnlocked = getUnlockedNodes(350)
assert(masterUnlocked.length === 7, '350 XP unlocks 7 nodes through Apothecary Hills')

const grandmasterUnlocked = getUnlockedNodes(800)
assert(grandmasterUnlocked.length === 10, '800 XP unlocks all 10 nodes including Celestial Citadel')

console.log(`\n==================================================================`)
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} OVERWORLD & MASCOT TEST ASSERTIONS PASSED!`)
  process.exit(0)
} else {
  console.error(`💥 ${failCount} ASSERTIONS FAILED!`)
  process.exit(1)
}
