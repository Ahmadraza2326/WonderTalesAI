/**
 * ORBis Cinematic Lesson Types (Phase 6)
 * Core schemas for child-first, character-guided, visual-first lesson scenes,
 * interactive manipulatives, micro-questions, progressive scaffolding, and grade adaptations.
 */

import type { GuideId, GuideEmotion, GradeBand } from './learningUniverse'
import type { SubjectId } from './academy'

export type SceneType =
  | 'welcome_hook'           // Guide welcomes child, establishes narrative context & mission
  | 'visual_demonstration'  // Animated visual explanation with guide pointing
  | 'guided_interaction'     // Hands-on manipulative with guide instructions
  | 'micro_question'         // In-flow comprehension check with tiered hints
  | 'independent_try'        // Problem-solving using manipulative
  | 'reflection_summary'     // Key takeaway review & victory celebration

export interface VisualDemoModel {
  kind:
    | 'ten_frame_counting'
    | 'number_line_jump'
    | 'fraction_partition'
    | 'balance_scale_mass'
    | 'phoneme_sound_wave'
    | 'code_robot_trace'
    | 'science_phenomenon'
    | 'color_mixing'
    | 'rhythm_cadence'
    | 'calm_breathing'
  title: string
  subtitle?: string
  animationState?: string
  data: Record<string, unknown>
}

export interface ManipulativeConfig {
  kind:
    | 'ten_frame'
    | 'number_line'
    | 'fraction_bar'
    | 'balance_scale'
    | 'phoneme_builder'
    | 'code_blocks'
    | 'logic_clues'
    | 'sentence_runes'
    | 'robot_grid'
    | 'color_palette'
    | 'rhythm_drums'
    | 'breath_circle'
  initialState: Record<string, unknown>
  targetGoal?: Record<string, unknown>
  instructions: string
  interactive: boolean
}

export interface MicroQuestionConfig {
  id: string
  prompt: string
  subPrompt?: string
  questionType: 'single_choice' | 'multi_choice' | 'tap_target' | 'manipulative_verify'
  options?: Array<{
    id: string
    label: string
    icon?: string
    visualDetail?: string
    isCorrect: boolean
  }>
  expectedValue?: string | number | boolean | Record<string, unknown>
  hints: [string, string, string, string] // 4-tier progressive scaffolding
  explanation: string
}

export interface CinematicLessonScene {
  id: string
  type: SceneType
  title: string
  guideId: GuideId
  guideEmotion: GuideEmotion
  guideDialogue: string
  narrationText: string
  focusTargetId?: string
  visualDemo?: VisualDemoModel
  manipulative?: ManipulativeConfig
  microQuestion?: MicroQuestionConfig
  soundCue?: string
  hapticFeedback?: 'light' | 'medium' | 'success' | 'warning'
  autoAdvanceDelayMs?: number // Optional auto-advance for Pre-K passive animations
  celebrationEffect?: 'sparkles' | 'stars_burst' | 'crystal_glow' | 'rainbow_fanfare'
  translations?: Record<string, { guideDialogue?: string; narrationText?: string }>
}

export interface CinematicLesson {
  id: string
  skillId: string
  subjectId: SubjectId
  gradeBand: GradeBand
  title: string
  subtitle: string
  storyHook: string
  guideId: GuideId
  estimatedMinutes: number
  prerequisites: string[]
  learningObjectives: string[]
  scenes: CinematicLessonScene[]
  rewardXP: number
  rewardStars: number
  language?: string
  translations?: Record<string, { title?: string; subtitle?: string; storyHook?: string }>
  capstoneGameId?: string
  relatedStoryId?: string
  relatedCreativePrompt?: string
}

export interface LessonPlaybackState {
  currentSceneIndex: number
  activeHintTier: number // 0 = no hints shown, 1..4
  attemptCount: number
  hasAnsweredCurrentScene: boolean
  isCurrentAnswerCorrect: boolean
  userAnswer: unknown
  isSpeaking: boolean
  isFinished: boolean
  earnedXP: number
  earnedStars: number
}
