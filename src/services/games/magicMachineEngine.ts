import type {
  MachineComponentType,
  ComponentMetadata,
  MachineComponent,
  PhysicsActor,
  MachineConfig,
  MachineState,
  MachineAction,
  MachineScoreResult,
  MachineTelemetry
} from '../../types/games/magicMachine'
import type { DifficultyTier } from '../../types/experience'

export const COMPONENT_METADATA: Record<MachineComponentType, ComponentMetadata> = {
  ramp_right: {
    type: 'ramp_right',
    name: 'Downhill Ramp',
    icon: '📐',
    description: 'Slopes down to the right to accelerate rolling Sproutlings.',
    defaultWidth: 100,
    defaultHeight: 50,
    restitution: 0.3,
    friction: 0.98,
  },
  ramp_left: {
    type: 'ramp_left',
    name: 'Uphill Ramp',
    icon: '📐',
    description: 'Slopes down to the left to redirect trajectory.',
    defaultWidth: 100,
    defaultHeight: 50,
    restitution: 0.3,
    friction: 0.98,
  },
  ramp_steep: {
    type: 'ramp_steep',
    name: 'Steep Launch Ramp',
    icon: '📐',
    description: 'A steep ski-jump ramp for high speed aerial launches.',
    defaultWidth: 80,
    defaultHeight: 70,
    restitution: 0.4,
    friction: 0.99,
  },
  spring_up: {
    type: 'spring_up',
    name: 'Springboard',
    icon: '🌀',
    description: 'Packs coiled kinetic energy to launch objects high into the air.',
    defaultWidth: 70,
    defaultHeight: 30,
    restitution: 1.8,
    friction: 0.9,
  },
  spring_angled: {
    type: 'spring_angled',
    name: 'Angled Spring',
    icon: '🌀',
    description: 'Launches objects upwards and sideways in a parabolic arc.',
    defaultWidth: 70,
    defaultHeight: 40,
    restitution: 1.7,
    friction: 0.9,
  },
  magnet_attract: {
    type: 'magnet_attract',
    name: 'Starlight Magnet',
    icon: '🧲',
    description: 'Emits a magnetic resonance field that pulls objects toward its core.',
    defaultWidth: 60,
    defaultHeight: 60,
    restitution: 0.2,
    friction: 0.95,
  },
  fan_right: {
    type: 'fan_right',
    name: 'Breeze Turbine (Right)',
    icon: '💨',
    description: 'Blows a continuous column of air to push objects to the right.',
    defaultWidth: 50,
    defaultHeight: 60,
    restitution: 0.1,
    friction: 0.9,
  },
  fan_up: {
    type: 'fan_up',
    name: 'Updraft Fan',
    icon: '💨',
    description: 'Generates a powerful upward air current to float objects.',
    defaultWidth: 70,
    defaultHeight: 40,
    restitution: 0.1,
    friction: 0.9,
  },
  bumper_circle: {
    type: 'bumper_circle',
    name: 'Pinball Bumper',
    icon: '🎯',
    description: 'Super-elastic rubber ring that rebounds objects with amplified speed.',
    defaultWidth: 50,
    defaultHeight: 50,
    restitution: 1.5,
    friction: 0.99,
  },
  balloon_float: {
    type: 'balloon_float',
    name: 'Cloud Balloon',
    icon: '🎈',
    description: 'Attaches upward buoyancy to temporarily neutralize gravity.',
    defaultWidth: 40,
    defaultHeight: 60,
    restitution: 0.8,
    friction: 0.95,
  },
  platform_wood: {
    type: 'platform_wood',
    name: 'Wooden Plank',
    icon: '🪵',
    description: 'Solid horizontal plank for bridging yawning gaps.',
    defaultWidth: 120,
    defaultHeight: 20,
    restitution: 0.2,
    friction: 0.97,
  },
}

/**
 * 12 Curated Deterministic Puzzles (4 Easy, 4 Medium, 4 Hard)
 */
export const MAGIC_MACHINE_PUZZLES: MachineConfig[] = [
  // EASY 1: The Gentle Slopes
  {
    id: 'easy_gentle_slopes',
    title: 'The Gentle Slopes',
    subtitle: 'Learn how gravity and ramps guide motion',
    difficulty: 'easy',
    startPos: { x: 90, y: 100 },
    goal: { x: 700, y: 380, radius: 30, label: 'Star Cradle' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 140, width: 100, height: 20, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 650, y: 420, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'ramp_right', count: 2, maxCount: 2 },
      { type: 'platform_wood', count: 1, maxCount: 1 },
    ],
    parComponents: 2,
    hint: 'Place a Downhill Ramp right below the start ledge to catch the Sproutling and roll it toward the right!',
    scientificConcept: {
      title: 'Inclined Planes & Gravity',
      description: 'An inclined plane (ramp) converts downward gravitational pull into forward horizontal acceleration.',
      funFact: 'Ancient builders used long ramps to lift giant multi-ton pyramid stones with minimal effort!',
    },
  },
  // EASY 2: Springboard Leap
  {
    id: 'easy_spring_leap',
    title: 'Springboard Leap',
    subtitle: 'Bounce across the bottom canyon',
    difficulty: 'easy',
    startPos: { x: 90, y: 90 },
    goal: { x: 680, y: 220, radius: 30, label: 'Star Cradle' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 130, width: 100, height: 20, isFixed: true },
      { id: 'center_floor', type: 'platform_wood', x: 280, y: 430, width: 240, height: 20, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 630, y: 260, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'spring_up', count: 1, maxCount: 1 },
      { type: 'ramp_right', count: 1, maxCount: 1 },
    ],
    parComponents: 2,
    hint: 'Drop a ramp at the start, then place a Springboard on the floor where the Sproutling lands to bounce it up to the cradle.',
    scientificConcept: {
      title: 'Elastic Potential Energy',
      description: 'Coiled springs store energy when compressed, releasing it instantly as an upward kinetic impulse.',
      funFact: 'Fleas can jump over 100 times their height using spring-like proteins in their knees!',
    },
  },
  // EASY 3: Wind Chasm
  {
    id: 'easy_wind_chasm',
    title: 'The Wind Chasm',
    subtitle: 'Harness the power of the air blower',
    difficulty: 'easy',
    startPos: { x: 90, y: 120 },
    goal: { x: 710, y: 120, radius: 30, label: 'Sky Dock' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 160, width: 100, height: 20, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 660, y: 160, width: 100, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'fan_right', count: 2, maxCount: 2 },
      { type: 'platform_wood', count: 1, maxCount: 1 },
    ],
    parComponents: 2,
    hint: 'Place a Breeze Turbine to push the Sproutling horizontally across the yawning sky gap!',
    scientificConcept: {
      title: 'Aerodynamic Thrust',
      description: 'Fans accelerate air molecules in one direction, creating a pushing force called aerodynamic thrust.',
      funFact: 'Hovercrafts float on a continuous cushion of downward fan thrust, allowing them to glide over both water and land!',
    },
  },
  // EASY 4: Bumper Bounce
  {
    id: 'easy_bumper_bounce',
    title: 'Pinball Bumper Alley',
    subtitle: 'Ricochet through the obstacles',
    difficulty: 'easy',
    startPos: { x: 90, y: 100 },
    goal: { x: 700, y: 350, radius: 30, label: 'Star Cradle' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 140, width: 100, height: 20, isFixed: true },
      { id: 'mid_wall', type: 'platform_wood', x: 400, y: 220, width: 20, height: 180, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 650, y: 390, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'bumper_circle', count: 2, maxCount: 2 },
      { type: 'ramp_right', count: 1, maxCount: 1 },
    ],
    parComponents: 2,
    hint: 'Place a rubber Pinball Bumper above the middle wall to ricochet the rolling Sproutling cleanly over it!',
    scientificConcept: {
      title: 'Elastic Collisions',
      description: 'In an elastic collision, kinetic energy is preserved and reflected across the angle of impact.',
      funFact: 'Superballs are made of high-restitution polybutadiene rubber, retaining over 90% of their bounce energy!',
    },
  },

  // MEDIUM 1: The Tower Vault
  {
    id: 'med_tower_vault',
    title: 'The Tower Vault',
    subtitle: 'Overcome the giant clockwork tower',
    difficulty: 'medium',
    startPos: { x: 90, y: 80 },
    goal: { x: 710, y: 180, radius: 28, label: 'Clockwork Cradle' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 120, width: 100, height: 20, isFixed: true },
      { id: 'tall_tower', type: 'platform_wood', x: 380, y: 140, width: 40, height: 320, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 660, y: 220, width: 100, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'spring_angled', count: 1, maxCount: 1 },
      { type: 'ramp_steep', count: 1, maxCount: 1 },
      { type: 'fan_right', count: 1, maxCount: 1 },
    ],
    parComponents: 2,
    hint: 'Use an Angled Spring at the base and a Breeze Turbine at the peak to clear the tower and float into the cradle.',
    scientificConcept: {
      title: 'Parabolic Trajectory',
      description: 'An object launched with horizontal and vertical velocity follows a curved parabolic flight arc under gravity.',
      funFact: 'Fountain water jets form perfect parabolas, governed by the exact same physical equations!',
    },
  },
  // MEDIUM 2: Magnetic Ascent
  {
    id: 'med_magnetic_ascent',
    title: 'Magnetic Ascent',
    subtitle: 'Curve trajectory using magnetic pull',
    difficulty: 'medium',
    startPos: { x: 90, y: 350 },
    goal: { x: 680, y: 120, radius: 28, label: 'Sky Portal' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 390, width: 100, height: 20, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 630, y: 160, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'magnet_attract', count: 2, maxCount: 2 },
      { type: 'spring_up', count: 1, maxCount: 1 },
      { type: 'ramp_right', count: 1, maxCount: 1 },
    ],
    parComponents: 3,
    hint: 'Place a Springboard below the start, then suspend a Starlight Magnet near the top to bend the Sproutling toward the sky portal.',
    scientificConcept: {
      title: 'Inverse-Square Magnetic Fields',
      description: 'Magnetic attraction grows exponentially stronger as distance decreases, curving orbital trajectories.',
      funFact: 'Maglev bullet trains use powerful magnetic fields to float above the tracks, traveling with near-zero friction!',
    },
  },
  // MEDIUM 3: Dual Elevation Cascade
  {
    id: 'med_dual_cascade',
    title: 'Dual Elevation Cascade',
    subtitle: 'Chain multiple ramps across split tiers',
    difficulty: 'medium',
    startPos: { x: 90, y: 60 },
    goal: { x: 120, y: 420, radius: 28, label: 'Bottom Grotto' },
    fixedComponents: [
      { id: 'tier_1', type: 'platform_wood', x: 40, y: 100, width: 100, height: 20, isFixed: true },
      { id: 'tier_2', type: 'platform_wood', x: 500, y: 220, width: 220, height: 20, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 60, y: 460, width: 120, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'ramp_right', count: 1, maxCount: 1 },
      { type: 'ramp_left', count: 1, maxCount: 1 },
      { type: 'bumper_circle', count: 1, maxCount: 1 },
    ],
    parComponents: 3,
    hint: 'Roll right onto Tier 2, then place a Left Ramp or Bumper to reverse direction and drop into the Bottom Grotto.',
    scientificConcept: {
      title: 'Conservation of Momentum',
      description: 'Momentum is transferred and redirected when interacting with angled slopes and resilient bumpers.',
      funFact: 'Roller coasters use gravity and looping ramps to convert potential energy into thrilling kinetic speed!',
    },
  },
  // MEDIUM 4: The Cloud Lifter
  {
    id: 'med_cloud_lifter',
    title: 'The Cloud Lifter',
    subtitle: 'Defy gravity with updraft fans and balloons',
    difficulty: 'medium',
    startPos: { x: 100, y: 380 },
    goal: { x: 700, y: 90, radius: 28, label: 'Aero Beacon' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 50, y: 420, width: 100, height: 20, isFixed: true },
      { id: 'divider', type: 'platform_wood', x: 380, y: 200, width: 30, height: 250, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 650, y: 130, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'fan_up', count: 1, maxCount: 1 },
      { type: 'fan_right', count: 1, maxCount: 1 },
      { type: 'ramp_right', count: 1, maxCount: 1 },
    ],
    parComponents: 3,
    hint: 'Use an Updraft Fan to lift the Sproutling over the central divider, then push it right with a Breeze Turbine!',
    scientificConcept: {
      title: 'Fluid Buoyancy & Lift',
      description: 'Upward air currents generate aerodynamic lift that counters gravity, keeping objects suspended.',
      funFact: 'Eagles and gliders soar for hours without flapping wings by riding invisible warm updrafts called thermals!',
    },
  },

  // HARD 1: The Quantum Pinball Gauntlet
  {
    id: 'hard_pinball_gauntlet',
    title: 'The Quantum Gauntlet',
    subtitle: 'Precise multi-stage bounce synchronization',
    difficulty: 'hard',
    startPos: { x: 90, y: 400 },
    goal: { x: 700, y: 80, radius: 26, label: 'Celestial Apex' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 40, y: 440, width: 100, height: 20, isFixed: true },
      { id: 'hazard_1', type: 'platform_wood', x: 260, y: 240, width: 30, height: 240, isFixed: true },
      { id: 'hazard_2', type: 'platform_wood', x: 500, y: 80, width: 30, height: 260, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 650, y: 120, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'spring_angled', count: 2, maxCount: 2 },
      { type: 'magnet_attract', count: 1, maxCount: 1 },
      { type: 'bumper_circle', count: 2, maxCount: 2 },
    ],
    parComponents: 4,
    hint: 'Chain an angled spring to launch over Hazard 1, bounce off a bumper, and let a high magnet pull the Sproutling into the Apex!',
    scientificConcept: {
      title: 'Vector Force Decomposition',
      description: 'Forces acting from multiple components combine vectorially to create complex trajectory paths.',
      funFact: 'Spacecraft use planetary gravitational assists (slingshots) to accelerate to outer solar system speeds!',
    },
  },
  // HARD 2: The Starlight Labyrinth
  {
    id: 'hard_starlight_labyrinth',
    title: 'The Starlight Labyrinth',
    subtitle: 'Navigate through a dense maze of floating barriers',
    difficulty: 'hard',
    startPos: { x: 700, y: 70 },
    goal: { x: 100, y: 420, radius: 26, label: 'Labyrinth Heart' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 650, y: 110, width: 100, height: 20, isFixed: true },
      { id: 'wall_a', type: 'platform_wood', x: 520, y: 100, width: 20, height: 200, isFixed: true },
      { id: 'wall_b', type: 'platform_wood', x: 300, y: 220, width: 20, height: 240, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 50, y: 460, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'ramp_left', count: 2, maxCount: 2 },
      { type: 'fan_right', count: 1, maxCount: 1 },
      { type: 'spring_up', count: 1, maxCount: 1 },
      { type: 'bumper_circle', count: 1, maxCount: 1 },
    ],
    parComponents: 4,
    hint: 'Ramps to the left guide the fall beneath Wall A, while a bumper and fan guide the Sproutling past Wall B.',
    scientificConcept: {
      title: 'Potential vs Kinetic Cycling',
      description: 'Energy continuously trades between potential height energy and kinetic speed as objects descend and climb.',
      funFact: 'Pendulums conserve energy indefinitely in a vacuum, swinging between pure potential and pure kinetic states!',
    },
  },
  // HARD 3: The Orbital Vortex
  {
    id: 'hard_orbital_vortex',
    title: 'The Orbital Vortex',
    subtitle: 'Triple magnetic field sling sequence',
    difficulty: 'hard',
    startPos: { x: 80, y: 80 },
    goal: { x: 720, y: 420, radius: 26, label: 'Abyssal Beacon' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 30, y: 120, width: 100, height: 20, isFixed: true },
      { id: 'island_center', type: 'platform_wood', x: 350, y: 220, width: 100, height: 60, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 670, y: 460, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'magnet_attract', count: 2, maxCount: 2 },
      { type: 'fan_up', count: 1, maxCount: 1 },
      { type: 'bumper_circle', count: 2, maxCount: 2 },
    ],
    parComponents: 4,
    hint: 'Position magnets above and below the center island to whip the Sproutling in a graceful S-curve orbit directly to the beacon.',
    scientificConcept: {
      title: 'Centripetal Force & Gravity Wells',
      description: 'A perpendicular inward force continuously bends velocity into curved orbital arcs.',
      funFact: 'The Moon stays in orbit around Earth because Earth’s gravity acts as a continuous centripetal tether!',
    },
  },
  // HARD 4: Master Clockwork Orrery
  {
    id: 'hard_master_orrery',
    title: 'The Master Clockwork Orrery',
    subtitle: 'The ultimate 5-stage mechanical symphony',
    difficulty: 'hard',
    startPos: { x: 80, y: 420 },
    goal: { x: 720, y: 80, radius: 26, label: 'Orrery Crown' },
    fixedComponents: [
      { id: 'start_plat', type: 'platform_wood', x: 30, y: 460, width: 100, height: 20, isFixed: true },
      { id: 'gear_pillar_1', type: 'platform_wood', x: 250, y: 300, width: 30, height: 180, isFixed: true },
      { id: 'gear_pillar_2', type: 'platform_wood', x: 500, y: 180, width: 30, height: 280, isFixed: true },
      { id: 'goal_plat', type: 'platform_wood', x: 670, y: 120, width: 110, height: 20, isFixed: true },
    ],
    availableToolbox: [
      { type: 'spring_up', count: 2, maxCount: 2 },
      { type: 'fan_right', count: 2, maxCount: 2 },
      { type: 'magnet_attract', count: 1, maxCount: 1 },
      { type: 'ramp_steep', count: 1, maxCount: 1 },
    ],
    parComponents: 5,
    hint: 'Ascend in 3 stepped vertical leaps: Spring -> Fan push -> Second Spring -> High Magnet -> Crown Cradle!',
    scientificConcept: {
      title: 'Mechanical Work & Energy Conservation',
      description: 'Energy cannot be created or destroyed; it is transformed through springs, wind, and magnetic fields.',
      funFact: 'The First Law of Thermodynamics was discovered by studying steam engines and mechanical work in the 1800s!',
    },
  },
]

/**
 * Generate Level Config from Seed / Index and Difficulty Tier
 */
export function generateLevel(seed: string | number, difficulty: DifficultyTier = 'easy'): MachineConfig {
  const filtered = MAGIC_MACHINE_PUZZLES.filter((p) => p.difficulty === difficulty)
  if (filtered.length === 0) {
    return MAGIC_MACHINE_PUZZLES[0]
  }

  let index = 0
  if (typeof seed === 'number') {
    index = Math.abs(seed) % filtered.length
  } else if (typeof seed === 'string') {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i)
      hash |= 0
    }
    index = Math.abs(hash) % filtered.length
  }

  return filtered[index]
}

/**
 * Initial Machine State
 */
export function getInitialState(config: MachineConfig): MachineState {
  const initialActor: PhysicsActor = {
    x: config.startPos.x,
    y: config.startPos.y,
    vx: 0,
    vy: 0,
    radius: 16,
    mass: 1.0,
    isGrounded: true,
    state: 'idle',
    trail: [],
    squish: { x: 1, y: 1 },
  }

  const initialTelemetry: MachineTelemetry = {
    attempts: 0,
    componentsPlaced: 0,
    simulationDurationMs: 0,
    finalState: 'failed',
    score: 0,
    stars: 0,
    xp: 0,
    bouncesCount: 0,
    fanLaunchesCount: 0,
    magnetPullsCount: 0,
  }

  return {
    config,
    actor: initialActor,
    placedComponents: [],
    selectedComponentId: null,
    simulationStatus: 'design',
    timeElapsed: 0,
    activeCollisions: [],
    telemetry: initialTelemetry,
  }
}

/**
 * Pure Reducer Action Evaluator
 */
export function evaluateAction(state: MachineState, action: MachineAction): MachineState {
  switch (action.type) {
    case 'ADD_COMPONENT': {
      if (state.simulationStatus !== 'design' && state.simulationStatus !== 'paused') {
        return state
      }

      const meta = COMPONENT_METADATA[action.componentType]
      if (!meta) return state

      // Check toolbox limits
      const toolboxItem = state.config.availableToolbox.find((t) => t.type === action.componentType)
      const currentPlaced = state.placedComponents.filter((c) => c.type === action.componentType).length
      if (toolboxItem && currentPlaced >= toolboxItem.maxCount) {
        return state
      }

      const newComponent: MachineComponent = {
        id: `comp_${action.componentType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: action.componentType,
        x: Math.max(10, Math.min(790 - meta.defaultWidth, action.x)),
        y: Math.max(10, Math.min(490 - meta.defaultHeight, action.y)),
        width: meta.defaultWidth,
        height: meta.defaultHeight,
        isFixed: false,
      }

      return {
        ...state,
        placedComponents: [...state.placedComponents, newComponent],
        selectedComponentId: newComponent.id,
        telemetry: {
          ...state.telemetry,
          componentsPlaced: state.placedComponents.length + 1,
        },
      }
    }

    case 'MOVE_COMPONENT': {
      if (state.simulationStatus !== 'design') return state

      const updated = state.placedComponents.map((c) => {
        if (c.id !== action.id || c.isFixed) return c
        return {
          ...c,
          x: Math.max(10, Math.min(790 - c.width, action.x)),
          y: Math.max(10, Math.min(490 - c.height, action.y)),
        }
      })

      return {
        ...state,
        placedComponents: updated,
      }
    }

    case 'REMOVE_COMPONENT': {
      if (state.simulationStatus !== 'design') return state

      return {
        ...state,
        placedComponents: state.placedComponents.filter((c) => c.id !== action.id),
        selectedComponentId: state.selectedComponentId === action.id ? null : state.selectedComponentId,
        telemetry: {
          ...state.telemetry,
          componentsPlaced: Math.max(0, state.placedComponents.length - 1),
        },
      }
    }

    case 'SELECT_COMPONENT': {
      return {
        ...state,
        selectedComponentId: action.id,
      }
    }

    case 'START_SIMULATION': {
      if (state.simulationStatus === 'running') return state

      return {
        ...state,
        simulationStatus: 'running',
        actor: {
          ...state.actor,
          state: 'running',
          vx: 40, // initial gentle push forward
          vy: 0,
          isGrounded: false,
        },
        telemetry: {
          ...state.telemetry,
          attempts: state.telemetry.attempts + 1,
        },
      }
    }

    case 'PAUSE_SIMULATION': {
      return {
        ...state,
        simulationStatus: state.simulationStatus === 'running' ? 'paused' : state.simulationStatus,
      }
    }

    case 'RESET_SIMULATION': {
      return {
        ...state,
        simulationStatus: 'design',
        timeElapsed: 0,
        activeCollisions: [],
        actor: {
          ...state.actor,
          x: state.config.startPos.x,
          y: state.config.startPos.y,
          vx: 0,
          vy: 0,
          isGrounded: true,
          state: 'idle',
          trail: [],
          squish: { x: 1, y: 1 },
        },
      }
    }

    case 'STEP_SIMULATION': {
      if (state.simulationStatus !== 'running') return state
      return stepSimulation(state, action.deltaTime)
    }

    default:
      return state
  }
}

/**
 * 2D Physics Step Simulation (Fixed Substep Solver)
 */
export function stepSimulation(state: MachineState, deltaTime: number): MachineState {
  const GRAVITY = 920 // px/s^2
  const AIR_RESISTANCE = 0.998
  const MAX_VELOCITY = 1200
  const SUBSTEPS = 4
  const dt = Math.min(deltaTime, 0.05) / SUBSTEPS

  let actor = { ...state.actor }
  let telemetry = { ...state.telemetry }
  const activeCollisions: string[] = []
  const allComponents = [...state.config.fixedComponents, ...state.placedComponents]

  for (let step = 0; step < SUBSTEPS; step++) {
    // 1. Apply Gravity
    actor.vy += GRAVITY * dt

    // 2. Apply Component Field Forces (Magnets, Fans, Balloons)
    for (const comp of allComponents) {
      if (comp.type === 'magnet_attract') {
        const mx = comp.x + comp.width / 2
        const my = comp.y + comp.height / 2
        const dx = mx - actor.x
        const dy = my - actor.y
        const distSq = dx * dx + dy * dy
        const maxDist = 180

        if (distSq < maxDist * maxDist && distSq > 100) {
          const dist = Math.sqrt(distSq)
          const force = (45000 / distSq) * 12
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          actor.vx += fx * dt
          actor.vy += fy * dt
          activeCollisions.push(comp.id)
          telemetry.magnetPullsCount++
        }
      } else if (comp.type === 'fan_right') {
        // Air column to the right
        const inY = actor.y >= comp.y - 10 && actor.y <= comp.y + comp.height + 10
        const inX = actor.x >= comp.x && actor.x <= comp.x + 220
        if (inY && inX) {
          actor.vx += 950 * dt
          activeCollisions.push(comp.id)
          telemetry.fanLaunchesCount++
        }
      } else if (comp.type === 'fan_up') {
        // Air column upwards
        const inX = actor.x >= comp.x - 10 && actor.x <= comp.x + comp.width + 10
        const inY = actor.y <= comp.y + comp.height && actor.y >= comp.y - 240
        if (inX && inY) {
          actor.vy -= 1600 * dt // Strong upward lift overcoming gravity
          activeCollisions.push(comp.id)
          telemetry.fanLaunchesCount++
        }
      } else if (comp.type === 'balloon_float') {
        const dx = comp.x + comp.width / 2 - actor.x
        const dy = comp.y + comp.height / 2 - actor.y
        if (Math.abs(dx) < 30 && Math.abs(dy) < 40) {
          actor.vy -= 1400 * dt
          activeCollisions.push(comp.id)
        }
      }
    }

    // 3. Integrate Velocity with Damping
    actor.vx *= Math.pow(AIR_RESISTANCE, dt * 60)
    actor.vy *= Math.pow(AIR_RESISTANCE, dt * 60)

    // Clamp maximum velocity
    const speed = Math.sqrt(actor.vx * actor.vx + actor.vy * actor.vy)
    if (speed > MAX_VELOCITY) {
      actor.vx = (actor.vx / speed) * MAX_VELOCITY
      actor.vy = (actor.vy / speed) * MAX_VELOCITY
    }

    // 4. Integrate Position
    actor.x += actor.vx * dt
    actor.y += actor.vy * dt

    // 5. Solid Geometric Collisions
    for (const comp of allComponents) {
      if (comp.type === 'platform_wood') {
        // AABB box collision
        const left = comp.x
        const right = comp.x + comp.width
        const top = comp.y
        const bottom = comp.y + comp.height

        if (
          actor.x + actor.radius > left &&
          actor.x - actor.radius < right &&
          actor.y + actor.radius > top &&
          actor.y - actor.radius < bottom
        ) {
          const overlapTop = actor.y + actor.radius - top
          const overlapBottom = bottom - (actor.y - actor.radius)
          const overlapLeft = actor.x + actor.radius - left
          const overlapRight = right - (actor.x - actor.radius)

          const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight)

          if (minOverlap === overlapTop && actor.vy > 0) {
            actor.y = top - actor.radius
            actor.vy = -actor.vy * 0.25
            actor.vx *= 0.98 // rolling friction
            actor.isGrounded = true
          } else if (minOverlap === overlapBottom && actor.vy < 0) {
            actor.y = bottom + actor.radius
            actor.vy = -actor.vy * 0.3
          } else if (minOverlap === overlapLeft && actor.vx > 0) {
            actor.x = left - actor.radius
            actor.vx = -actor.vx * 0.3
          } else if (minOverlap === overlapRight && actor.vx < 0) {
            actor.x = right + actor.radius
            actor.vx = -actor.vx * 0.3
          }
          activeCollisions.push(comp.id)
        }
      } else if (comp.type === 'ramp_right') {
        // Downward slope to right
        if (
          actor.x + actor.radius >= comp.x &&
          actor.x - actor.radius <= comp.x + comp.width &&
          actor.y + actor.radius >= comp.y &&
          actor.y - actor.radius <= comp.y + comp.height
        ) {
          const relX = Math.max(0, Math.min(comp.width, actor.x - comp.x))
          const slopeY = comp.y + (relX / comp.width) * comp.height

          if (actor.y + actor.radius >= slopeY) {
            actor.y = slopeY - actor.radius
            // Convert gravity into downhill tangent velocity
            actor.vx += 380 * dt
            actor.vy = actor.vx * (comp.height / comp.width)
            activeCollisions.push(comp.id)
          }
        }
      } else if (comp.type === 'ramp_left') {
        // Downward slope to left
        if (
          actor.x + actor.radius >= comp.x &&
          actor.x - actor.radius <= comp.x + comp.width &&
          actor.y + actor.radius >= comp.y &&
          actor.y - actor.radius <= comp.y + comp.height
        ) {
          const relX = Math.max(0, Math.min(comp.width, actor.x - comp.x))
          const slopeY = comp.y + (1 - relX / comp.width) * comp.height

          if (actor.y + actor.radius >= slopeY) {
            actor.y = slopeY - actor.radius
            actor.vx -= 380 * dt
            actor.vy = -actor.vx * (comp.height / comp.width)
            activeCollisions.push(comp.id)
          }
        }
      } else if (comp.type === 'ramp_steep') {
        // Steep ramp
        if (
          actor.x + actor.radius >= comp.x &&
          actor.x - actor.radius <= comp.x + comp.width &&
          actor.y + actor.radius >= comp.y &&
          actor.y - actor.radius <= comp.y + comp.height
        ) {
          const relX = Math.max(0, Math.min(comp.width, actor.x - comp.x))
          const slopeY = comp.y + (relX / comp.width) * comp.height

          if (actor.y + actor.radius >= slopeY) {
            actor.y = slopeY - actor.radius
            actor.vx += 650 * dt
            actor.vy = -180 // small kick
            activeCollisions.push(comp.id)
          }
        }
      } else if (comp.type === 'spring_up') {
        // Spring trigger on top surface
        const left = comp.x
        const right = comp.x + comp.width
        const top = comp.y

        if (
          actor.x >= left - 8 &&
          actor.x <= right + 8 &&
          actor.y + actor.radius >= top - 10 &&
          actor.y + actor.radius <= top + comp.height &&
          actor.vy > -100
        ) {
          actor.y = top - actor.radius
          actor.vy = -720 // Powerful upward impulse
          activeCollisions.push(comp.id)
          telemetry.bouncesCount++
        }
      } else if (comp.type === 'spring_angled') {
        const left = comp.x
        const right = comp.x + comp.width
        const top = comp.y

        if (
          actor.x >= left - 8 &&
          actor.x <= right + 8 &&
          actor.y + actor.radius >= top - 10 &&
          actor.y + actor.radius <= top + comp.height &&
          actor.vy > -100
        ) {
          actor.y = top - actor.radius
          actor.vy = -680
          actor.vx += 320 // Launch diagonally forward
          activeCollisions.push(comp.id)
          telemetry.bouncesCount++
        }
      } else if (comp.type === 'bumper_circle') {
        const bx = comp.x + comp.width / 2
        const by = comp.y + comp.height / 2
        const br = comp.width / 2
        const dx = actor.x - bx
        const dy = actor.y - by
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < br + actor.radius) {
          const nx = dx / (dist || 1)
          const ny = dy / (dist || 1)
          actor.x = bx + nx * (br + actor.radius + 1)

          // Super-elastic reflection
          const dot = actor.vx * nx + actor.vy * ny
          actor.vx = (actor.vx - 2.2 * dot * nx) * 1.1
          actor.vy = (actor.vy - 2.2 * dot * ny) * 1.1
          activeCollisions.push(comp.id)
          telemetry.bouncesCount++
        }
      }
    }
  }

  // 6. Update Actor Trail
  const trail = [
    { x: actor.x, y: actor.y, opacity: 1.0 },
    ...actor.trail.slice(0, 7).map((t) => ({ ...t, opacity: t.opacity * 0.7 })),
  ]
  actor.trail = trail

  // 7. Check Goal Reach Condition
  const gdx = actor.x - state.config.goal.x
  const gdy = actor.y - state.config.goal.y
  const gDist = Math.sqrt(gdx * gdx + gdy * gdy)

  let nextStatus = state.simulationStatus
  const newTime = state.timeElapsed + deltaTime

  if (gDist <= state.config.goal.radius + actor.radius) {
    nextStatus = 'success'
    actor.state = 'success'
    actor.vx = 0
    actor.vy = 0
    telemetry.finalState = 'success'
    telemetry.simulationDurationMs = Math.round(newTime * 1000)
    const scoreRes = calculateScore(telemetry, state.config)
    telemetry.score = scoreRes.score
    telemetry.stars = scoreRes.stars
    telemetry.xp = scoreRes.xp
  } else if (actor.y > 540 || actor.x < -60 || actor.x > 860 || newTime > 14.0) {
    // Failure / Out of bounds / Timeout
    nextStatus = 'failed'
    actor.state = 'failed'
    telemetry.finalState = 'failed'
    telemetry.simulationDurationMs = Math.round(newTime * 1000)
  }

  return {
    ...state,
    actor,
    simulationStatus: nextStatus,
    timeElapsed: newTime,
    activeCollisions: Array.from(new Set(activeCollisions)),
    telemetry,
  }
}

/**
 * Score, XP & Star Reward Calculation
 */
export function calculateScore(telemetry: MachineTelemetry, config: MachineConfig): MachineScoreResult {
  const isPerfect = telemetry.componentsPlaced <= config.parComponents && telemetry.attempts <= 1

  // Base rewards by difficulty tier
  let baseXP = 30
  let baseStars = 3
  if (config.difficulty === 'medium') {
    baseXP = 50
    baseStars = 5
  } else if (config.difficulty === 'hard') {
    baseXP = 80
    baseStars = 8
  }

  const bonusXP = isPerfect ? 20 : 0
  const bonusStars = isPerfect ? 2 : 0

  const finalXP = baseXP + bonusXP
  const finalStars = baseStars + bonusStars

  // Normalized score 0-100
  let score = 75
  if (isPerfect) score = 100
  else if (telemetry.componentsPlaced <= config.parComponents + 1) score = 88

  return {
    score,
    xp: finalXP,
    stars: finalStars,
    isPerfect,
    telemetry: {
      ...telemetry,
      score,
      xp: finalXP,
      stars: finalStars,
    },
  }
}
