import type { DifficultyTier } from '../../types/experience'
import type {
  BiomeTileType,
  SandboxTile,
  Organism,
  EcosystemChallenge,
  EcosystemSimulationState,
  EcoToolMetadata,
  EcoScienceConcept,
} from '../../types/games/ecosystemSandbox'
import { createPRNG } from './gameRegistry'

// Tool Palette Catalog
export const ECO_TOOLS: Record<string, EcoToolMetadata> = {
  water: {
    id: 'water',
    name: 'Crystal Spring',
    emoji: '💧',
    category: 'terrain',
    cost: 5,
    description: 'Channels fresh flowing water to hydrate adjacent land.',
  },
  grassland: {
    id: 'grassland',
    name: 'Meadow Soil',
    emoji: '🌱',
    category: 'terrain',
    cost: 5,
    description: 'Rich loamy soil ready for flowers and sproutlings.',
  },
  forest: {
    id: 'forest',
    name: 'Ancient Tree',
    emoji: '🌲',
    category: 'flora',
    cost: 10,
    description: 'Lush tree canopy that captures sunlight and oxygenates the biome.',
  },
  herbivore: {
    id: 'herbivore',
    name: 'Sun-Deer',
    emoji: '🦌',
    category: 'fauna',
    cost: 15,
    description: 'Gentle grazer that feasts on lush meadow vegetation.',
  },
  carnivore: {
    id: 'carnivore',
    name: 'Amber-Fox',
    emoji: '🦊',
    category: 'fauna',
    cost: 25,
    description: 'Agile predator that balances herbivore populations.',
  },
  sun: {
    id: 'sun',
    name: 'Solar Beam',
    emoji: '☀️',
    category: 'weather',
    cost: 10,
    description: 'Accelerates plant photosynthesis across the entire ecosystem.',
  },
  rain: {
    id: 'rain',
    name: 'Nourishing Rain',
    emoji: '🌧️',
    category: 'weather',
    cost: 10,
    description: 'Saturates the terrain with moisture to revive dry zones.',
  },
}

// Science of Wonder Curated Curriculum
export const ECO_SCIENCE_CONCEPTS: EcoScienceConcept[] = [
  {
    conceptTitle: 'Trophic Cascades & Food Webs',
    scienceTopic: 'Ecology & Population Balance',
    kidExplanation:
      'In nature, every living thing connects like a giant team! Plants catch sunlight, herbivores eat plants, and predators keep the balance so nobody runs out of food.',
    funFact:
      'When wolves returned to Yellowstone National Park, they changed the behavior of deer, allowing forests and riverbanks to grow back greener than ever!',
  },
  {
    conceptTitle: 'Photosynthesis: Sunlight into Sugar',
    scienceTopic: 'Botany & Solar Chemistry',
    kidExplanation:
      'Leaves are like solar-powered kitchens. They take sunshine, water from the ground, and air to cook sweet energy while making fresh oxygen for us to breathe!',
    funFact:
      'Over half of all the oxygen on planet Earth is made by tiny glowing ocean plants called phytoplankton!',
  },
  {
    conceptTitle: 'The Water Cycle & Soil Moisture',
    scienceTopic: 'Hydrology & Meteorology',
    kidExplanation:
      'Water never disappears! It travels from rivers into clouds, falls as rain, seeps deep into soil, and is drunk by thirsty tree roots in an endless loop.',
    funFact:
      'A single giant oak tree can drink and release over 100 gallons of water back into the atmosphere every single day!',
  },
  {
    conceptTitle: 'Mutualism: Nature Best Friends',
    scienceTopic: 'Symbiosis & Evolutionary Biology',
    kidExplanation:
      'Some creatures help each other survive. Bees get delicious nectar from flowers, and in return, they carry flower pollen so new baby flowers can bloom!',
    funFact:
      'Clownfish live safely inside stinging sea anemones because their special slime coat protects them from the stings!',
  },
  {
    conceptTitle: 'Decomposers: Earth Recyclers',
    scienceTopic: 'Nutrient Cycles & Soil Ecology',
    kidExplanation:
      'Mushrooms and earthworms are the ultimate cleaners of the forest. They break down fallen leaves and turn them into super-rich soil that feeds new saplings.',
    funFact:
      'Underneath a healthy forest floor is an underground fungal internet called mycorrhizae that trees use to share water and nutrients!',
  },
]

// Cellular Automata Ecosystem Simulation Tick Engine
export function simulateEcosystemTick(currentState: EcosystemSimulationState): EcosystemSimulationState {
  const height = currentState.grid.length
  const width = currentState.grid[0].length
  const newGrid: SandboxTile[][] = currentState.grid.map((row) =>
    row.map((tile) => ({
      ...tile,
      organisms: tile.organisms.map((o) => ({ ...o })),
    }))
  )

  let totalProducers = 0
  let totalHerbivores = 0
  let totalCarnivores = 0
  let totalDecomposers = 0

  // 1. Environmental Moisture Diffusion & River Flow
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = newGrid[y][x]

      if (tile.biome === 'deep_water' || tile.biome === 'shallow_water') {
        tile.moisture = 100
        // Diffuse moisture to 4 neighbors
        const neighbors = [
          { dx: 0, dy: -1 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 },
        ]
        for (const { dx, dy } of neighbors) {
          const nx = x + dx
          const ny = y + dy
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            newGrid[ny][nx].moisture = Math.min(100, newGrid[ny][nx].moisture + 20)
          }
        }
      } else {
        // Rain weather bonus
        if (currentState.weather === 'rainy') {
          tile.moisture = Math.min(100, tile.moisture + 25)
        } else {
          // Natural evaporation
          tile.moisture = Math.max(5, tile.moisture - 4)
        }
      }
    }
  }

  // 2. Flora & Vegetation Growth (Producers)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = newGrid[y][x]

      if (tile.biome !== 'deep_water' && tile.biome !== 'shallow_water') {
        const sunBonus = currentState.weather === 'sunny' ? 1.5 : 1.0
        if (tile.moisture >= 25) {
          const growth = Math.round((tile.moisture / 10) * sunBonus)
          tile.vegetationLevel = Math.min(100, tile.vegetationLevel + growth)
        } else {
          tile.vegetationLevel = Math.max(0, tile.vegetationLevel - 5)
        }

        // Transform barren land into lush grassland or forest
        if (tile.vegetationLevel >= 70 && tile.biome === 'grassland') {
          tile.biome = 'forest'
        } else if (tile.vegetationLevel < 30 && tile.biome === 'forest') {
          tile.biome = 'grassland'
        }

        if (tile.vegetationLevel > 15) {
          totalProducers++
        }
      }
    }
  }

  // 3. Fauna Lifecycle & Trophic Interactions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = newGrid[y][x]
      const updatedOrganisms: Organism[] = []

      for (const org of tile.organisms) {
        if (!org.isAlive) continue

        org.age += 1

        if (org.trophicLevel === 'herbivore') {
          // Graze on tile vegetation
          if (tile.vegetationLevel >= 15) {
            tile.vegetationLevel = Math.max(0, tile.vegetationLevel - 15)
            org.energy = Math.min(org.maxEnergy, org.energy + 20)
          } else {
            org.energy -= 12 // Hunger decay
          }

          if (org.energy > 0) {
            updatedOrganisms.push(org)
            totalHerbivores++
          }
        } else if (org.trophicLevel === 'carnivore') {
          // Hunt herbivores on this or neighbor tile
          const preyIndex = updatedOrganisms.findIndex((o) => o.trophicLevel === 'herbivore' && o.isAlive)
          if (preyIndex !== -1) {
            updatedOrganisms[preyIndex].isAlive = false
            updatedOrganisms.splice(preyIndex, 1)
            totalHerbivores = Math.max(0, totalHerbivores - 1)
            org.energy = Math.min(org.maxEnergy, org.energy + 35)
          } else {
            org.energy -= 16 // Predator energy burn
          }

          if (org.energy > 0) {
            updatedOrganisms.push(org)
            totalCarnivores++
          }
        }
      }

      tile.organisms = updatedOrganisms
    }
  }

  // 4. Calculate Biodiversity Score (Shannon-Wiener inspired index)
  const totalLiving = totalProducers + totalHerbivores + totalCarnivores
  let biodiversityScore = 0
  if (totalLiving > 0) {
    const pProd = totalProducers / totalLiving
    const pHerb = totalHerbivores / totalLiving
    const pCarn = totalCarnivores / totalLiving

    const entropy =
      (pProd > 0 ? -pProd * Math.log2(pProd) : 0) +
      (pHerb > 0 ? -pHerb * Math.log2(pHerb) : 0) +
      (pCarn > 0 ? -pCarn * Math.log2(pCarn) : 0)

    // Normalize 0 to 100 based on max possible 3-tier entropy (1.585)
    biodiversityScore = Math.min(100, Math.round((entropy / 1.585) * 100))
  }

  const isGoalAchieved =
    totalProducers >= 4 &&
    totalHerbivores >= 2 &&
    totalCarnivores >= 1 &&
    biodiversityScore >= 50

  let statusMsg = 'Ecosystem cycling steadily.'
  if (isGoalAchieved) {
    statusMsg = '🌟 Ecological equilibrium achieved! Biome is thriving!'
  } else if (totalProducers < 3) {
    statusMsg = '⚠️ More sunlight & flora needed to support the food chain.'
  } else if (totalHerbivores === 0 && totalProducers >= 4) {
    statusMsg = '🌿 Abundant greenery ready for herbivores to graze!'
  } else if (totalCarnivores === 0 && totalHerbivores >= 3) {
    statusMsg = '🦌 Herbivore population is booming; introduce a predator to balance.'
  }

  return {
    grid: newGrid,
    cycle: currentState.cycle + 1,
    weather: currentState.weather,
    biodiversityScore,
    producerCount: totalProducers,
    herbivoreCount: totalHerbivores,
    carnivoreCount: totalCarnivores,
    decomposerCount: totalDecomposers,
    isGoalAchieved,
    statusMessage: statusMsg,
  }
}

// Deterministic Challenge & Terrain Generator
export function generateProceduralEcosystemChallenge(
  seedInput: number | string,
  difficulty: DifficultyTier = 'easy'
): EcosystemChallenge {
  const prng = createPRNG(seedInput)

  let gridWidth = 5
  let gridHeight = 5
  let targetBiodiversity = 45
  let targetProducers = 4
  let targetHerbivores = 2
  let targetCarnivores = 1
  let rewardStars = 5
  let rewardXP = 30

  if (difficulty === 'medium') {
    gridWidth = 6
    gridHeight = 6
    targetBiodiversity = 60
    targetProducers = 7
    targetHerbivores = 4
    targetCarnivores = 2
    rewardStars = 8
    rewardXP = 45
  } else if (difficulty === 'hard') {
    gridWidth = 7
    gridHeight = 7
    targetBiodiversity = 75
    targetProducers = 10
    targetHerbivores = 6
    targetCarnivores = 3
    rewardStars = 12
    rewardXP = 60
  }

  const conceptIndex = prng.int(0, ECO_SCIENCE_CONCEPTS.length - 1)
  const scientificConcept = ECO_SCIENCE_CONCEPTS[conceptIndex]

  // Generate Base Island Grid
  const startingTiles: SandboxTile[][] = []

  for (let y = 0; y < gridHeight; y++) {
    const row: SandboxTile[] = []
    for (let x = 0; x < gridWidth; x++) {
      const isEdge = x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1
      let biome: BiomeTileType = 'grassland'
      let elevation = 1
      let moisture = 40
      let vegetation = 30

      if (isEdge && prng.next() > 0.4) {
        biome = 'shallow_water'
        elevation = 0
        moisture = 100
        vegetation = 0
      } else if (prng.next() > 0.75) {
        biome = 'forest'
        vegetation = 75
        moisture = 60
      } else if (difficulty === 'hard' && prng.next() > 0.8) {
        biome = 'mountain'
        elevation = 3
        moisture = 15
        vegetation = 10
      }

      row.push({
        x,
        y,
        elevation,
        biome,
        moisture,
        fertility: 60,
        vegetationLevel: vegetation,
        organisms: [],
      })
    }
    startingTiles.push(row)
  }

  return {
    id: `eco_challenge_${prng.seed}_${difficulty}`,
    title: `Sanctuary Biome #${prng.int(101, 999)}`,
    difficulty,
    seed: prng.seed,
    gridWidth,
    gridHeight,
    initialWeather: 'sunny',
    targetBiodiversityScore: targetBiodiversity,
    targetProducerCount: targetProducers,
    targetHerbivoreCount: targetHerbivores,
    targetCarnivoreCount: targetCarnivores,
    maxCycles: 20,
    rewardStars,
    rewardXP,
    scientificConcept,
    startingTiles,
  }
}
