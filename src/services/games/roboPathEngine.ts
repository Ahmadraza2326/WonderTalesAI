import type { DifficultyTier } from '../../types/experience'
import type {
  RoboToken,
  TokenMetadata,
  CompassDirection,
  GridTile,
  RobotState,
  RoboPathChallenge,
  ProgramStepResult,
  ExecutionTrace,
  ScienceConcept,
} from '../../types/games/roboPath'

// ============================================================================
// 1. MASTER TOKEN CATALOG & METADATA
// ============================================================================

export const TOKEN_CATALOG: Record<RoboToken, TokenMetadata> = {
  FORWARD: {
    token: 'FORWARD',
    name: 'Step Forward',
    symbol: '⬆️',
    emoji: '🚀',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    description: 'Rolls BEEP-0 forward by 1 grid tile in the facing direction.',
    energyCost: 2,
  },
  TURN_LEFT: {
    token: 'TURN_LEFT',
    name: 'Turn Left',
    symbol: '↺',
    emoji: '⬅️',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    description: 'Rotates 90 degrees counter-clockwise to face the left.',
    energyCost: 1,
  },
  TURN_RIGHT: {
    token: 'TURN_RIGHT',
    name: 'Turn Right',
    symbol: '↻',
    emoji: '➡️',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    description: 'Rotates 90 degrees clockwise to face the right.',
    energyCost: 1,
  },
  JUMP: {
    token: 'JUMP',
    name: 'Thruster Jump',
    symbol: '⤼',
    emoji: '🦘',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    description: 'Activates rocket thrusters to leap 2 tiles over water or laser gates.',
    energyCost: 4,
  },
  LOOP_2X: {
    token: 'LOOP_2X',
    name: 'Repeat 2x',
    symbol: '🔁',
    emoji: '🔄',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    description: 'Repeats the very next command 2 times in sequence.',
    energyCost: 1,
  },
  GRAB_GEM: {
    token: 'GRAB_GEM',
    name: 'Collect Crystal',
    symbol: '💎',
    emoji: '✨',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    description: 'Extends magnetic arm to harvest a glowing energy crystal.',
    energyCost: 1,
  },
}

// ============================================================================
// 2. DIRECTIONAL ARITHMETIC & COMPASS HELPERS
// ============================================================================

export const DIRECTION_ORDER: CompassDirection[] = ['NORTH', 'EAST', 'SOUTH', 'WEST']

export const DIRECTION_DELTAS: Record<CompassDirection, { dx: number; dy: number }> = {
  NORTH: { dx: 0, dy: -1 },
  EAST: { dx: 1, dy: 0 },
  SOUTH: { dx: 0, dy: 1 },
  WEST: { dx: -1, dy: 0 },
}

export function rotateDirection(current: CompassDirection, turn: 'LEFT' | 'RIGHT'): CompassDirection {
  const currentIndex = DIRECTION_ORDER.indexOf(current)
  if (turn === 'LEFT') {
    const nextIndex = (currentIndex - 1 + 4) % 4
    return DIRECTION_ORDER[nextIndex]
  } else {
    const nextIndex = (currentIndex + 1) % 4
    return DIRECTION_ORDER[nextIndex]
  }
}

// ============================================================================
// 3. DETERMINISTIC PRNG ENGINE
// ============================================================================

function createPRNG(seedInput: string | number) {
  let s = typeof seedInput === 'number' ? Math.floor(Math.abs(seedInput)) || 1337 : 0
  if (typeof seedInput === 'string') {
    for (let i = 0; i < seedInput.length; i++) {
      s = (s << 5) - s + seedInput.charCodeAt(i)
      s |= 0
    }
  }
  let a = s >>> 0

  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ============================================================================
// 4. SCIENCE OF WONDER CODEX DOSSIERS
// ============================================================================

export const ROBO_SCIENCE_CONCEPTS: ScienceConcept[] = [
  {
    conceptTitle: 'Algorithmic Sequencing',
    scienceTopic: 'Computer Science: Instructions & Order of Operations',
    funFact: 'Computers follow instructions in the exact order you write them—even if you tell them to put cereal on top of milk!',
    kidExplanation: 'An algorithm is like a magic recipe. If you follow the steps one by one, you reach the treasure every single time.',
  },
  {
    conceptTitle: 'Loop Invariants & Iteration',
    scienceTopic: 'Computational Efficiency: Loops & Repetition',
    funFact: 'Video games use game loops that repeat 60 times every single second to draw graphics on your screen!',
    kidExplanation: 'Loops let you say "repeat 2 times" instead of writing the same command twice, saving BEEP-0 memory and battery power.',
  },
  {
    conceptTitle: 'State Machines & Orientation',
    scienceTopic: 'Robotics: Sensor Coordinates & Compass Heading',
    funFact: 'Mars rovers like Perseverance use internal gyroscopes to know which direction they are facing on red dusty dunes!',
    kidExplanation: 'A robot needs to know both where it is standing and which way its camera is pointing before taking a step.',
  },
  {
    conceptTitle: 'Breadth-First Search (BFS)',
    scienceTopic: 'Graph Theory: Shortest Path Optimization',
    funFact: 'GPS navigation apps use graph search algorithms to calculate the quickest route through city traffic in milliseconds!',
    kidExplanation: 'Finding the shortest path means exploring all nearby tiles like ripples in a pond until you touch the goal.',
  },
  {
    conceptTitle: 'Error Handling & Debugging',
    scienceTopic: 'Software Engineering: Bug Detection & Resilience',
    funFact: 'The word "bug" in computing started in 1947 when an actual moth got stuck inside an electromechanical computer relay!',
    kidExplanation: 'When code doesn’t work on the first try, debugging is how we inspect each step to fix the path without giving up.',
  },
]

// ============================================================================
// 5. AST PROGRAM INTERPRETER & EXECUTION ENGINE
// ============================================================================

export function executeRoboProgram(
  challenge: RoboPathChallenge,
  tokenSequence: RoboToken[]
): ExecutionTrace {
  const steps: ProgramStepResult[] = []

  let currentState: RobotState = {
    x: challenge.startPos.x,
    y: challenge.startPos.y,
    direction: challenge.startDirection,
    energy: 100,
    maxEnergy: 100,
    crystalsCollected: 0,
    isAlive: true,
    isGoalReached: false,
    statusMessage: 'Ready to execute program.',
  }

  // Clone grid tiles to track runtime crystal harvesting and visited tiles
  const grid: GridTile[][] = challenge.tiles.map(row =>
    row.map(tile => ({ ...tile, hasCrystal: tile.hasCrystal, isVisited: tile.x === challenge.startPos.x && tile.y === challenge.startPos.y }))
  )

  let stepIndex = 0
  let isExecutionHalted = false
  let failureReason: string | undefined = undefined

  // Expand any LOOP_2X tokens into repeated operations
  const expandedTokens: { token: RoboToken; originalIndex: number }[] = []
  for (let i = 0; i < tokenSequence.length; i++) {
    const t = tokenSequence[i]
    if (t === 'LOOP_2X') {
      if (i + 1 < tokenSequence.length && tokenSequence[i + 1] !== 'LOOP_2X') {
        const nextToken = tokenSequence[i + 1]
        expandedTokens.push({ token: nextToken, originalIndex: i + 1 })
        expandedTokens.push({ token: nextToken, originalIndex: i + 1 })
        i++ // Skip next token as it was consumed by the loop
      }
    } else {
      expandedTokens.push({ token: t, originalIndex: i })
    }
  }

  for (const { token, originalIndex } of expandedTokens) {
    if (isExecutionHalted) break

    const prevState = { ...currentState }
    const tokenMeta = TOKEN_CATALOG[token]
    let actionTaken = ''
    let sfxCue: ProgramStepResult['sfxCue'] = 'step'
    let isStepSuccess = true
    let stepErrorMessage: string | undefined = undefined

    // Consume token energy
    currentState.energy = Math.max(0, currentState.energy - tokenMeta.energyCost)

    if (token === 'TURN_LEFT') {
      currentState.direction = rotateDirection(currentState.direction, 'LEFT')
      actionTaken = 'Rotated left 90°'
      sfxCue = 'turn'
      currentState.statusMessage = `Facing ${currentState.direction}`
    } else if (token === 'TURN_RIGHT') {
      currentState.direction = rotateDirection(currentState.direction, 'RIGHT')
      actionTaken = 'Rotated right 90°'
      sfxCue = 'turn'
      currentState.statusMessage = `Facing ${currentState.direction}`
    } else if (token === 'FORWARD') {
      const delta = DIRECTION_DELTAS[currentState.direction]
      const targetX = currentState.x + delta.dx
      const targetY = currentState.y + delta.dy

      // Check bounds
      if (targetX < 0 || targetX >= challenge.gridWidth || targetY < 0 || targetY >= challenge.gridHeight) {
        isStepSuccess = false
        stepErrorMessage = 'Bumped into sector boundary!'
        actionTaken = 'Boundary collision'
        sfxCue = 'bump'
        isExecutionHalted = true
        failureReason = 'BEEP-0 hit the perimeter wall.'
      } else {
        const tile = grid[targetY][targetX]
        if (tile.type === 'wall') {
          isStepSuccess = false
          stepErrorMessage = 'Bumped into an obsidian crystal wall!'
          actionTaken = 'Wall collision'
          sfxCue = 'bump'
          isExecutionHalted = true
          failureReason = 'BEEP-0 was blocked by a wall.'
        } else if (tile.type === 'water') {
          isStepSuccess = false
          stepErrorMessage = 'Fell into the plasma canal!'
          actionTaken = 'Fell in water'
          sfxCue = 'bump'
          currentState.isAlive = false
          isExecutionHalted = true
          failureReason = 'Water hazard without jumping.'
        } else if (tile.type === 'laser_gate' && tile.isLaserActive) {
          isStepSuccess = false
          stepErrorMessage = 'Laser security beam interrupted!'
          actionTaken = 'Laser trip'
          sfxCue = 'laser'
          currentState.isAlive = false
          isExecutionHalted = true
          failureReason = 'Walked into an active laser beam.'
        } else {
          currentState.x = targetX
          currentState.y = targetY
          tile.isVisited = true
          actionTaken = `Moved forward to (${targetX}, ${targetY})`
          sfxCue = 'step'
          currentState.statusMessage = `Moved to (${targetX}, ${targetY})`
        }
      }
    } else if (token === 'JUMP') {
      const delta = DIRECTION_DELTAS[currentState.direction]
      const targetX = currentState.x + delta.dx * 2
      const targetY = currentState.y + delta.dy * 2

      if (targetX < 0 || targetX >= challenge.gridWidth || targetY < 0 || targetY >= challenge.gridHeight) {
        isStepSuccess = false
        stepErrorMessage = 'Jump overshot the map boundaries!'
        actionTaken = 'Jump overshoot'
        sfxCue = 'bump'
        isExecutionHalted = true
        failureReason = 'Jump exceeded sector limits.'
      } else {
        const tile = grid[targetY][targetX]
        if (tile.type === 'wall') {
          isStepSuccess = false
          stepErrorMessage = 'Landed directly onto a wall!'
          actionTaken = 'Jump landing collision'
          sfxCue = 'bump'
          isExecutionHalted = true
          failureReason = 'Landed on an obstacle.'
        } else {
          currentState.x = targetX
          currentState.y = targetY
          tile.isVisited = true
          actionTaken = `Jumped 2 tiles forward to (${targetX}, ${targetY})`
          sfxCue = 'jump'
          currentState.statusMessage = `Thruster jump to (${targetX}, ${targetY})`
        }
      }
    } else if (token === 'GRAB_GEM') {
      const currentTile = grid[currentState.y][currentState.x]
      if (currentTile.hasCrystal) {
        currentTile.hasCrystal = false
        currentState.crystalsCollected += 1
        currentState.energy = Math.min(currentState.maxEnergy, currentState.energy + 25)
        actionTaken = 'Collected energy crystal (+25 Energy)'
        sfxCue = 'crystal'
        currentState.statusMessage = `Crystal collected (${currentState.crystalsCollected}/${challenge.totalCrystals})`
      } else {
        actionTaken = 'No crystal on this tile'
        sfxCue = 'step'
        currentState.statusMessage = 'Scanned tile: No crystal found'
      }
    }

    // Auto-check if robot stepped on crystal tile
    const currentTile = grid[currentState.y][currentState.x]
    if (currentTile.hasCrystal && token !== 'GRAB_GEM') {
      currentTile.hasCrystal = false
      currentState.crystalsCollected += 1
      sfxCue = 'crystal'
    }

    // Check if robot reached the battery beacon goal
    if (currentState.x === challenge.beaconPos.x && currentState.y === challenge.beaconPos.y) {
      if (currentState.crystalsCollected >= challenge.totalCrystals) {
        currentState.isGoalReached = true
        actionTaken = 'Battery Beacon fully energized!'
        sfxCue = 'beacon'
        currentState.statusMessage = 'Victory! Beacon activated.'
        isExecutionHalted = true
      } else {
        currentState.statusMessage = `Reached beacon, but need ${challenge.totalCrystals - currentState.crystalsCollected} more crystal(s)!`
      }
    }

    steps.push({
      stepIndex: stepIndex++,
      token,
      tokenIndex: originalIndex,
      previousState: prevState,
      nextState: { ...currentState },
      actionTaken,
      isSuccess: isStepSuccess,
      errorMessage: stepErrorMessage,
      sfxCue,
    })
  }

  const success = currentState.isGoalReached && currentState.isAlive
  const parDelta = challenge.parMoves - tokenSequence.length

  return {
    success,
    steps,
    finalState: currentState,
    tokensUsed: tokenSequence.length,
    crystalsCollected: currentState.crystalsCollected,
    goalReached: currentState.isGoalReached,
    parScoreDelta: parDelta,
    errorMessage: failureReason,
  }
}

// ============================================================================
// 6. PROCEDURAL LEVEL GENERATION WITH BREADTH-FIRST SEARCH (BFS)
// ============================================================================

export function generateProceduralRoboPathChallenge(
  seedInput: string | number,
  difficulty: DifficultyTier = 'easy',
  _explorerLevel = 1
): RoboPathChallenge {
  const prng = createPRNG(seedInput)
  const numericSeed = typeof seedInput === 'number' ? seedInput : Math.abs(prng() * 1000000) | 0

  const width = difficulty === 'hard' ? 7 : difficulty === 'medium' ? 6 : 5
  const height = difficulty === 'hard' ? 7 : difficulty === 'medium' ? 6 : 5

  // 1. Initialize empty floor grid
  const tiles: GridTile[][] = []
  for (let y = 0; y < height; y++) {
    const row: GridTile[] = []
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        type: 'floor',
        elevation: 0,
        hasCrystal: false,
        isLaserActive: false,
        isVisited: false,
      })
    }
    tiles.push(row)
  }

  // 2. Place Start Position (bottom-left area)
  const startPos = { x: 0, y: height - 1 }
  const startDirection: CompassDirection = 'NORTH'

  // 3. Place Beacon Goal Position (top-right area)
  const beaconPos = { x: width - 1, y: 0 }
  tiles[beaconPos.y][beaconPos.x].isGoal = true
  tiles[beaconPos.y][beaconPos.x].type = 'battery_beacon'

  // 4. Generate guaranteed passable primary path using random walk towards goal
  const pathSet = new Set<string>()
  pathSet.add(`${startPos.x},${startPos.y}`)
  pathSet.add(`${beaconPos.x},${beaconPos.y}`)

  let currX = startPos.x
  let currY = startPos.y
  while (currX !== beaconPos.x || currY !== beaconPos.y) {
    const canMoveX = currX < beaconPos.x
    const canMoveY = currY > beaconPos.y

    if (canMoveX && canMoveY) {
      if (prng() > 0.5) currX++
      else currY--
    } else if (canMoveX) {
      currX++
    } else if (canMoveY) {
      currY--
    }
    pathSet.add(`${currX},${currY}`)
  }

  // 5. Place Energy Crystals along/near the path
  const totalCrystals = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1
  let crystalsPlaced = 0
  const pathArray = Array.from(pathSet)
    .map(key => {
      const [x, y] = key.split(',').map(Number)
      return { x, y }
    })
    .filter(p => !(p.x === startPos.x && p.y === startPos.y) && !(p.x === beaconPos.x && p.y === beaconPos.y))

  for (let i = 0; i < pathArray.length && crystalsPlaced < totalCrystals; i++) {
    const p = pathArray[Math.floor(prng() * pathArray.length)]
    if (!tiles[p.y][p.x].hasCrystal) {
      tiles[p.y][p.x].hasCrystal = true
      tiles[p.y][p.x].type = 'energy_crystal'
      crystalsPlaced++
    }
  }

  // Fallback if path had too few tiles for crystals
  if (crystalsPlaced < totalCrystals) {
    for (let y = 0; y < height && crystalsPlaced < totalCrystals; y++) {
      for (let x = 0; x < width && crystalsPlaced < totalCrystals; x++) {
        if (!pathSet.has(`${x},${y}`) && !tiles[y][x].hasCrystal) {
          tiles[y][x].hasCrystal = true
          tiles[y][x].type = 'energy_crystal'
          pathSet.add(`${x},${y}`)
          crystalsPlaced++
        }
      }
    }
  }

  // 6. Scatter Obstacles (Walls and Water Pits) on non-path tiles
  const obstacleRatio = difficulty === 'hard' ? 0.28 : difficulty === 'medium' ? 0.2 : 0.12
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!pathSet.has(`${x},${y}`)) {
        if (prng() < obstacleRatio) {
          tiles[y][x].type = prng() > 0.6 ? 'wall' : 'water'
        }
      }
    }
  }

  // 7. Calculate Par Moves and Allowed Tokens
  const manhattanDist = Math.abs(beaconPos.x - startPos.x) + Math.abs(beaconPos.y - startPos.y)
  const parMoves = manhattanDist + totalCrystals * 2 + (difficulty === 'hard' ? 4 : 2)
  const maxTokens = parMoves + 4

  const allowedTokens: RoboToken[] = ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT']
  if (difficulty !== 'easy') allowedTokens.push('JUMP', 'LOOP_2X')
  allowedTokens.push('GRAB_GEM')

  // 8. Select Curated Science of Wonder Concept
  const concept = ROBO_SCIENCE_CONCEPTS[Math.floor(prng() * ROBO_SCIENCE_CONCEPTS.length)]

  return {
    id: `robopath_circuit_${numericSeed}`,
    title: `Algorithm Circuit #${(numericSeed % 900) + 100}`,
    subtitle: `Program BEEP-0 to energize the Battery Beacon`,
    seed: numericSeed,
    difficulty,
    gridWidth: width,
    gridHeight: height,
    tiles,
    startPos,
    startDirection,
    beaconPos,
    totalCrystals,
    maxTokens,
    parMoves,
    allowedTokens,
    scientificConcept: concept,
    rewardXP: difficulty === 'hard' ? 65 : difficulty === 'medium' ? 45 : 30,
    rewardStars: difficulty === 'hard' ? 12 : difficulty === 'medium' ? 8 : 5,
    hint: `Start by turning ${startDirection === 'NORTH' ? 'East or North' : 'towards the goal'} and using forward steps to harvest all ${totalCrystals} crystal(s) before entering the beacon!`,
  }
}
