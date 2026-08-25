import type { DifficultyTier } from '../experience'

/**
 * Types of physical components placeable in the Magic Machine Lab
 */
export type MachineComponentType =
  | 'ramp_right'
  | 'ramp_left'
  | 'ramp_steep'
  | 'spring_up'
  | 'spring_angled'
  | 'magnet_attract'
  | 'fan_right'
  | 'fan_up'
  | 'bumper_circle'
  | 'balloon_float'
  | 'platform_wood'

export interface ComponentMetadata {
  type: MachineComponentType
  name: string
  icon: string
  description: string
  defaultWidth: number
  defaultHeight: number
  restitution: number // bounciness
  friction: number
  mass?: number
}

export interface MachineComponent {
  id: string
  type: MachineComponentType
  x: number
  y: number
  width: number
  height: number
  rotation?: number // in degrees
  isFixed?: boolean // true for stage obstacles, false for child-placed components
  isActive?: boolean // e.g. spring currently expanded or fan blowing
  pulsePhase?: number // for animation
}

export interface PhysicsActor {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  mass: number
  isGrounded: boolean
  state: 'idle' | 'running' | 'success' | 'failed' | 'stuck'
  trail: Array<{ x: number; y: number; opacity: number }>
  squish: { x: number; y: number }
}

export interface MachineGoal {
  x: number
  y: number
  radius: number
  label?: string
  isSatisfied?: boolean
}

export interface ToolboxItem {
  type: MachineComponentType
  count: number
  maxCount: number
}

export interface MachineConfig {
  id: string
  title: string
  subtitle: string
  difficulty: DifficultyTier
  startPos: { x: number; y: number }
  goal: MachineGoal
  fixedComponents: MachineComponent[]
  availableToolbox: ToolboxItem[]
  parComponents: number
  hint: string
  scientificConcept: {
    title: string
    description: string
    funFact: string
  }
}

export interface MachineTelemetry {
  attempts: number
  componentsPlaced: number
  simulationDurationMs: number
  finalState: 'success' | 'failed' | 'stuck'
  score: number
  stars: number
  xp: number
  bouncesCount: number
  fanLaunchesCount: number
  magnetPullsCount: number
}

export interface MachineState {
  config: MachineConfig
  actor: PhysicsActor
  placedComponents: MachineComponent[]
  selectedComponentId: string | null
  simulationStatus: 'design' | 'running' | 'paused' | 'success' | 'failed'
  timeElapsed: number
  activeCollisions: string[]
  telemetry: MachineTelemetry
}

export type MachineAction =
  | { type: 'ADD_COMPONENT'; componentType: MachineComponentType; x: number; y: number }
  | { type: 'MOVE_COMPONENT'; id: string; x: number; y: number }
  | { type: 'REMOVE_COMPONENT'; id: string }
  | { type: 'SELECT_COMPONENT'; id: string | null }
  | { type: 'START_SIMULATION' }
  | { type: 'PAUSE_SIMULATION' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'STEP_SIMULATION'; deltaTime: number }

export interface MachineScoreResult {
  score: number
  stars: number
  xp: number
  isPerfect: boolean
  telemetry: MachineTelemetry
}
