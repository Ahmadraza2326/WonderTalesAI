/**
 * ORBis Learning Universe Types
 * Defines data structures for Grade Bands, Learning Director, Content Library,
 * Pedagogical Guides, Creative Studio, Think Lab, Science Lab, and Projects.
 */

export type GradeBand =
  | 'pre_k'
  | 'kindergarten'
  | 'grade_1'
  | 'grade_2'
  | 'grade_3'
  | 'grade_4'
  | 'grade_5'
  | 'grade_6'

export type AcademicRealm =
  | 'mathematics'
  | 'science'
  | 'english'
  | 'reading'
  | 'computer_science'
  | 'logic_puzzles'
  | 'creativity_arts'
  | 'general_knowledge'

export type AcademicSubject =
  | 'math'
  | 'science'
  | 'english'
  | 'reading'
  | 'vocabulary'
  | 'grammar'
  | 'computer_science'
  | 'logic'
  | 'creativity'
  | 'general_knowledge'
  | 'knowledge'

export type { MasteryTier } from './academy'

export interface GradeBandConfig {
  id: GradeBand
  title: string
  ageRange: string
  description: string
  icon: string
  maxSessionMinutes: number
  narrationMandatory: boolean
  visualDensity: 'minimal' | 'focused' | 'standard' | 'rich'
  touchTargetSize: number // px
  targetLessonDuration: number // minutes
}

export type ContentCategory =
  | 'learn'
  | 'books'
  | 'stories'
  | 'videos'
  | 'games'
  | 'create'
  | 'think'
  | 'science'
  | 'art'
  | 'music'
  | 'read'
  | 'write'
  | 'explore'
  | 'sel'
  | 'projects'

export interface LibraryContentItem {
  id: string
  title: string
  description: string
  category: ContentCategory
  gradeBands: GradeBand[]
  subjectId: string
  skillId?: string
  icon: string
  coverImage?: string
  durationMinutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  hasAudioNarration: boolean
  isOfflineAvailable: boolean
  guideId: string
  route: string
  prerequisites: string[]
  capstoneGameId?: string
  relatedStoryId?: string
  tags: string[]
  rewardXP: number
  rewardStars: number
}

export type GuideId =
  | 'poly'
  | 'newton'
  | 'lexi'
  | 'beep_0'
  | 'sherlock'
  | 'nova'
  | 'davinci'
  | 'atlas'
  | 'aria'
  | 'harmony'

export type GuideEmotion =
  | 'neutral'
  | 'curious'
  | 'thinking'
  | 'guiding'
  | 'encouraging'
  | 'celebrating'
  | 'excited'
  | 'confused'
  | 'concerned'
  | 'listening'
  | 'waiting'
  | 'happy'

export type ActorPose =
  | 'idle'
  | 'curious'
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'teaching'
  | 'encouraging'
  | 'confused'
  | 'celebrating'
  | 'concerned'
  | 'listening'
  | 'waiting'
  | 'idle_breathe'
  | 'pointing_left'
  | 'pointing_right'
  | 'excited_wave'
  | 'celebrating_bounce'
  | 'encouraging_nod'
  | 'curious_tilt'

export interface GazeTarget {
  x: number // -100 to 100 or screen coordinate
  y: number // -100 to 100 or screen coordinate
}

export type GazeDirection = 'center' | 'left' | 'right' | 'down' | 'up' | 'target'

export interface PedagogicalGuideProfile {
  id: GuideId
  name: string
  title: string
  avatar: string
  realm: string
  accentColor: string
  teachingStyle: string
  voicePitch: number // 0.5 to 1.5
  voiceRate: number // 0.8 to 1.2
  catchphrase: string
  greetingLines: string[]
  encouragementLines: string[]
  celebrationLines: string[]
}

export interface PlannedActivity {
  id: string
  contentId: string
  title: string
  description: string
  category: ContentCategory
  durationMinutes: number
  guideId: GuideId
  route: string
  icon: string
  reason: 'active_curriculum' | 'targeted_review' | 'creative_balance' | 'capstone_challenge' | 'reading_discovery'
  reasonLabel: string
  isCompleted: boolean
}

export interface DailyLearningPlan {
  childId: string
  date: string
  totalDurationMinutes: number
  plannedActivities: PlannedActivity[]
  focusSubject: string
  guideId: GuideId
  dailyMissionId: string
  streakDays: number
}

export interface CreativeStudioDocument {
  id: string
  childId: string
  title: string
  mode: 'draw' | 'paint' | 'color' | 'stickers' | 'scene' | 'story'
  canvasDataUrl: string
  stickersUsed: Array<{ id: string; x: number; y: number; scale: number; rotation: number }>
  associatedSkillId?: string
  theme: string
  createdAt: string
  voiceRecordingUrl?: string
}

export interface ThinkLabPuzzleState {
  id: string
  title: string
  type: 'pattern_sequence' | 'logic_gate' | 'spatial_grid' | 'balance_scale' | 'deduction_clues'
  prompt: string
  guideId: GuideId
  manipulativeData: any
  correctAnswer: any
  userState: any
  isSolved: boolean
}

export interface ScienceSimulationState {
  id: string
  title: string
  topic: 'plants' | 'gravity' | 'light' | 'weather' | 'ecosystems' | 'magnets'
  hypothesisPrompt: string
  controls: Array<{ id: string; label: string; type: 'slider' | 'toggle'; value: number | boolean; min?: number; max?: number }>
  outputMetricLabel: string
  outputMetricValue: number | string
  isSuccessConditionMet: boolean
}

export interface ProjectMilestone {
  id: string
  title: string
  domain: 'math' | 'science' | 'art' | 'writing' | 'logic' | 'coding'
  taskDescription: string
  isCompleted: boolean
  route?: string
}

export interface LearningProject {
  id: string
  title: string
  description: string
  gradeBands: GradeBand[]
  coverIcon: string
  badgeId: string
  badgeTitle: string
  guideId: GuideId
  milestones: ProjectMilestone[]
  rewardXP: number
  rewardStars: number
}
