import assert from 'node:assert/strict'
import {
  ECO_TOOLS,
  ECO_SCIENCE_CONCEPTS,
  simulateEcosystemTick,
  generateProceduralEcosystemChallenge,
} from '../src/services/games/ecosystemSandboxEngine'
import type { EcosystemSimulationState, SandboxTile } from '../src/types/games/ecosystemSandbox'

console.log('==================================================================')
console.log('🏝️ RUNNING 3D ECOSYSTEM SANDBOX ENGINE & CELLULAR AUTOMATA TEST SUITE')
console.log('==================================================================\n')

let passed = 0
let total = 0

function test(name: string, fn: () => void) {
  total++
  try {
    fn()
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`)
    throw err
  }
}

// --- 1. Eco Tools Palette Catalog ---
console.log('🧰 1. Ecological Tools Palette Catalog')

test('Tool catalog contains all 7 core terrain, flora, fauna, and weather tools', () => {
  const expectedTools = ['water', 'grassland', 'forest', 'herbivore', 'carnivore', 'sun', 'rain']
  for (const t of expectedTools) {
    assert.ok(ECO_TOOLS[t], `Tool ${t} must exist in catalog`)
    assert.ok(ECO_TOOLS[t].emoji.length > 0, `Tool ${t} must have an emoji`)
    assert.ok(ECO_TOOLS[t].cost > 0, `Tool ${t} must have a positive energy/mana cost`)
    assert.ok(ECO_TOOLS[t].description.length > 0, `Tool ${t} must have a description`)
  }
})

// --- 2. Deterministic Mulberry32 Procedural Island Generation ---
console.log('\n🎲 2. Deterministic Mulberry32 Procedural Island Generation')

test('Identical seeds generate identical island terrain layouts', () => {
  const c1 = generateProceduralEcosystemChallenge(777888, 'medium')
  const c2 = generateProceduralEcosystemChallenge(777888, 'medium')

  assert.equal(c1.id, c2.id)
  assert.equal(c1.gridWidth, c2.gridWidth)
  assert.equal(c1.gridHeight, c2.gridHeight)
  assert.equal(c1.targetBiodiversityScore, c2.targetBiodiversityScore)
  assert.deepEqual(c1.startingTiles, c2.startingTiles)
})

test('Difficulty levels scale grid dimensions and biodiversity goals appropriately', () => {
  const easy = generateProceduralEcosystemChallenge('seed_easy', 'easy')
  const medium = generateProceduralEcosystemChallenge('seed_med', 'medium')
  const hard = generateProceduralEcosystemChallenge('seed_hard', 'hard')

  assert.equal(easy.gridWidth, 5)
  assert.equal(easy.gridHeight, 5)
  assert.equal(easy.targetBiodiversityScore, 45)

  assert.equal(medium.gridWidth, 6)
  assert.equal(medium.gridHeight, 6)
  assert.equal(medium.targetBiodiversityScore, 60)

  assert.equal(hard.gridWidth, 7)
  assert.equal(hard.gridHeight, 7)
  assert.equal(hard.targetBiodiversityScore, 75)
})

// --- 3. Cellular Automata Physics & Ecological Simulation ---
console.log('\n🌱 3. Cellular Automata Physics & Ecological Simulation')

test('Water tiles diffuse moisture to adjacent neighbor tiles', () => {
  // Create a 3x3 grid with water in the center (1, 1) and dry land (moisture: 0) around it
  const grid: SandboxTile[][] = []
  for (let y = 0; y < 3; y++) {
    const row: SandboxTile[] = []
    for (let x = 0; x < 3; x++) {
      row.push({
        x,
        y,
        elevation: 1,
        biome: x === 1 && y === 1 ? 'shallow_water' : 'grassland',
        moisture: x === 1 && y === 1 ? 100 : 0,
        fertility: 50,
        vegetationLevel: 0,
        organisms: [],
      })
    }
    grid.push(row)
  }

  const state: EcosystemSimulationState = {
    grid,
    cycle: 0,
    weather: 'sunny',
    biodiversityScore: 0,
    producerCount: 0,
    herbivoreCount: 0,
    carnivoreCount: 0,
    decomposerCount: 0,
    isGoalAchieved: false,
    statusMessage: 'Test initial state',
  }

  const nextState = simulateEcosystemTick(state)
  // Neighbors (0, 1), (2, 1), (1, 0), (1, 2) should have received diffused moisture
  assert.ok(nextState.grid[1][0].moisture > 0, 'Neighbor tile (0,1) must receive diffused moisture')
  assert.ok(nextState.grid[1][2].moisture > 0, 'Neighbor tile (2,1) must receive diffused moisture')
  assert.ok(nextState.grid[0][1].moisture > 0, 'Neighbor tile (1,0) must receive diffused moisture')
  assert.ok(nextState.grid[2][1].moisture > 0, 'Neighbor tile (1,2) must receive diffused moisture')
})

test('Moist land with sunlight produces vegetation growth', () => {
  const grid: SandboxTile[][] = [
    [
      {
        x: 0,
        y: 0,
        elevation: 1,
        biome: 'grassland',
        moisture: 80,
        fertility: 80,
        vegetationLevel: 20,
        organisms: [],
      },
    ],
  ]

  const state: EcosystemSimulationState = {
    grid,
    cycle: 0,
    weather: 'sunny',
    biodiversityScore: 0,
    producerCount: 0,
    herbivoreCount: 0,
    carnivoreCount: 0,
    decomposerCount: 0,
    isGoalAchieved: false,
    statusMessage: 'Testing plant growth',
  }

  const nextState = simulateEcosystemTick(state)
  assert.ok(
    nextState.grid[0][0].vegetationLevel > 20,
    'Vegetation level must increase with high moisture and sunlight'
  )
  assert.equal(nextState.producerCount, 1)
})

test('Herbivores graze on tile vegetation and sustain energy', () => {
  const grid: SandboxTile[][] = [
    [
      {
        x: 0,
        y: 0,
        elevation: 1,
        biome: 'grassland',
        moisture: 50,
        fertility: 50,
        vegetationLevel: 50,
        organisms: [
          {
            id: 'deer_1',
            species: 'Sun-Deer',
            name: 'Sun-Deer',
            emoji: '🦌',
            trophicLevel: 'herbivore',
            x: 0,
            y: 0,
            energy: 50,
            maxEnergy: 100,
            age: 0,
            isAlive: true,
          },
        ],
      },
    ],
  ]

  const state: EcosystemSimulationState = {
    grid,
    cycle: 0,
    weather: 'sunny',
    biodiversityScore: 0,
    producerCount: 0,
    herbivoreCount: 1,
    carnivoreCount: 0,
    decomposerCount: 0,
    isGoalAchieved: false,
    statusMessage: 'Testing grazing',
  }

  const nextState = simulateEcosystemTick(state)
  assert.equal(nextState.herbivoreCount, 1)
  assert.ok(nextState.grid[0][0].organisms[0].energy > 50, 'Grazing herbivore energy must increase')
})

test('Carnivores hunt herbivores maintaining trophic balance', () => {
  const grid: SandboxTile[][] = [
    [
      {
        x: 0,
        y: 0,
        elevation: 1,
        biome: 'grassland',
        moisture: 50,
        fertility: 50,
        vegetationLevel: 50,
        organisms: [
          {
            id: 'deer_1',
            species: 'Sun-Deer',
            name: 'Sun-Deer',
            emoji: '🦌',
            trophicLevel: 'herbivore',
            x: 0,
            y: 0,
            energy: 50,
            maxEnergy: 100,
            age: 1,
            isAlive: true,
          },
          {
            id: 'fox_1',
            species: 'Amber-Fox',
            name: 'Amber-Fox',
            emoji: '🦊',
            trophicLevel: 'carnivore',
            x: 0,
            y: 0,
            energy: 40,
            maxEnergy: 100,
            age: 1,
            isAlive: true,
          },
        ],
      },
    ],
  ]

  const state: EcosystemSimulationState = {
    grid,
    cycle: 0,
    weather: 'sunny',
    biodiversityScore: 0,
    producerCount: 0,
    herbivoreCount: 1,
    carnivoreCount: 1,
    decomposerCount: 0,
    isGoalAchieved: false,
    statusMessage: 'Testing predation',
  }

  const nextState = simulateEcosystemTick(state)
  assert.equal(nextState.carnivoreCount, 1)
  assert.equal(nextState.herbivoreCount, 0, 'Prey herbivore was hunted by predator')
  assert.ok(nextState.grid[0][0].organisms[0].energy > 40, 'Predator energy increased after hunt')
})

// --- 4. Biodiversity Calculation & Equilibrium Goal ---
console.log('\n📊 4. Biodiversity Calculation & Equilibrium Goal')

test('Balanced multi-tier trophic food web achieves high biodiversity score and goal', () => {
  // Build a 2x2 balanced ecosystem
  const grid: SandboxTile[][] = [
    [
      {
        x: 0,
        y: 0,
        elevation: 1,
        biome: 'forest',
        moisture: 80,
        fertility: 80,
        vegetationLevel: 80,
        organisms: [
          {
            id: 'd1',
            species: 'Sun-Deer',
            name: 'Sun-Deer',
            emoji: '🦌',
            trophicLevel: 'herbivore',
            x: 0,
            y: 0,
            energy: 80,
            maxEnergy: 100,
            age: 0,
            isAlive: true,
          },
        ],
      },
      {
        x: 1,
        y: 0,
        elevation: 1,
        biome: 'forest',
        moisture: 80,
        fertility: 80,
        vegetationLevel: 80,
        organisms: [
          {
            id: 'd2',
            species: 'Sun-Deer',
            name: 'Sun-Deer',
            emoji: '🦌',
            trophicLevel: 'herbivore',
            x: 1,
            y: 0,
            energy: 80,
            maxEnergy: 100,
            age: 0,
            isAlive: true,
          },
        ],
      },
    ],
    [
      {
        x: 0,
        y: 1,
        elevation: 1,
        biome: 'forest',
        moisture: 80,
        fertility: 80,
        vegetationLevel: 80,
        organisms: [
          {
            id: 'f1',
            species: 'Amber-Fox',
            name: 'Amber-Fox',
            emoji: '🦊',
            trophicLevel: 'carnivore',
            x: 0,
            y: 1,
            energy: 80,
            maxEnergy: 100,
            age: 0,
            isAlive: true,
          },
        ],
      },
      {
        x: 1,
        y: 1,
        elevation: 1,
        biome: 'forest',
        moisture: 80,
        fertility: 80,
        vegetationLevel: 80,
        organisms: [],
      },
    ],
  ]

  const state: EcosystemSimulationState = {
    grid,
    cycle: 0,
    weather: 'sunny',
    biodiversityScore: 0,
    producerCount: 0,
    herbivoreCount: 0,
    carnivoreCount: 0,
    decomposerCount: 0,
    isGoalAchieved: false,
    statusMessage: 'Ready for equilibrium evaluation',
  }

  const nextState = simulateEcosystemTick(state)
  assert.ok(nextState.biodiversityScore >= 50, `Biodiversity score (${nextState.biodiversityScore}) should be >= 50`)
  assert.equal(nextState.isGoalAchieved, true, 'Equilibrium goal should be achieved')
})

// --- 5. Science of Wonder Dossier Curriculum ---
console.log('\n🔬 5. Science of Wonder Dossier Curriculum')

test('Curated ecology science concepts contain kid explanations and fun facts', () => {
  assert.ok(ECO_SCIENCE_CONCEPTS.length >= 5)
  for (const c of ECO_SCIENCE_CONCEPTS) {
    assert.ok(c.conceptTitle.length > 0)
    assert.ok(c.scienceTopic.length > 0)
    assert.ok(c.kidExplanation.length > 0)
    assert.ok(c.funFact.length > 0)
  }
})

console.log('\n==================================================================')
console.log(`🏆 ALL ${passed}/${total} ECOSYSTEM SANDBOX TEST ASSERTIONS PASSED!`)
console.log('==================================================================\n')
