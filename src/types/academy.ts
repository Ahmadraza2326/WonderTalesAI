import type { CognitiveDomain, DifficultyTier } from './experience'
export type { AcademicRealm, AcademicSubject } from './learningUniverse'

/**
 * 🏛️ 10 Core Academic Subjects
 */
export type SubjectId =
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

export type AgeBand = 'early_learner' | 'beginner' | 'developing' | 'intermediate' | 'advanced'

export type MasteryTier =
  | 'not_started'
  | 'learning'
  | 'practicing'
  | 'developing'
  | 'proficient'
  | 'mastered'

/**
 * 📚 Curriculum Structure
 */
export interface AcademySubject {
  id: SubjectId
  title: string
  tagline: string
  description: string
  icon: string
  accentColor: string
  heroGradient: string
  cognitiveDomain: CognitiveDomain
  courses: AcademyCourse[]
}

export interface AcademyCourse {
  id: string
  subjectId: SubjectId
  title: string
  tagline: string
  description: string
  icon: string
  ageBand: AgeBand
  estimatedMinutes: number
  units: AcademyUnit[]
}

export interface AcademyUnit {
  id: string
  courseId: string
  subjectId: SubjectId
  orderIndex: number
  title: string
  description: string
  icon: string
  skills: AcademySkill[]
}

export interface AcademySkill {
  id: string
  unitId: string
  courseId: string
  subjectId: SubjectId
  orderIndex: number
  title: string
  description: string
  icon: string
  ageBand: AgeBand
  prerequisiteSkillIds: string[]
  lessonId: string
  practiceSetId: string
  capstoneGameId?: string // Flagship game link (e.g. potion_scales, robopath, spellforge)
}

/**
 * 📖 Lesson Block System
 */
export type LessonBlockType =
  | 'text'
  | 'callout'
  | 'visual_demo'
  | 'guided_step'
  | 'drag_drop_sorter'
  | 'simulation_embed'
  | 'reflection'

export interface LessonBlock {
  id: string
  type: LessonBlockType
  title?: string
  content: string
  visualData?: Record<string, unknown>
  interactivePrompt?: string
  expectedAnswer?: string | number | string[]
  explanation?: string
}

export interface AcademyLesson {
  id: string
  skillId: string
  title: string
  subtitle: string
  estimatedMinutes: number
  blocks: LessonBlock[]
  summaryTakeaways: string[]
  rewardXP: number
  rewardStars: number
}

/**
 * 🎯 Practice & 13 Question Types
 */
export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'number_input'
  | 'text_input'
  | 'fill_in_the_blank'
  | 'drag_and_drop'
  | 'matching_pairs'
  | 'ordering'
  | 'categorization'
  | 'word_builder'
  | 'visual_identification'
  | 'simulation_challenge'
  | 'canvas_trace'

export interface QuestionOption {
  id: string
  text: string
  icon?: string
  isCorrect?: boolean
}

export interface MatchingPair {
  id: string
  leftText: string
  leftIcon?: string
  rightText: string
  rightIcon?: string
}

export interface ProgressiveHints {
  tier1Concept: string
  tier2Specific: string
  tier3Partial: string
  tier4WorkedMethod: string
}

export interface PracticeQuestion {
  id: string
  type: QuestionType
  prompt: string
  scenarioText?: string
  visualAsset?: {
    type: 'emoji' | 'svg' | 'diagram' | 'formula'
    content: string
  }
  options?: QuestionOption[]
  correctOptionIds?: string[]
  correctNumber?: number
  correctText?: string
  tolerance?: number
  pairs?: MatchingPair[]
  orderedSequence?: string[]
  categories?: {
    name: string
    items: string[]
  }[]
  clozeParts?: {
    prefixText: string
    blankId: string
    expectedToken: string
    options?: string[]
    suffixText: string
  }[]
  hints: ProgressiveHints
  explanation: string
  difficulty: DifficultyTier
}

export interface PracticeSet {
  id: string
  skillId: string
  title: string
  targetPassScore: number // e.g. 75%
  questions: PracticeQuestion[]
  rewardXP: number
  rewardStars: number
}

/**
 * 📊 Mastery & Progress Tracking
 */
export interface SkillProgressRecord {
  childId: string
  skillId: string
  subjectId: SubjectId
  masteryLevel: MasteryTier
  masteryScore: number // 0 - 100%
  attemptsCount: number
  correctCount: number
  hintsUsedCount: number
  streak: number
  lastPracticedAt: string
}

export interface SubjectMasterySummary {
  subjectId: SubjectId
  title: string
  icon: string
  accentColor: string
  totalSkills: number
  masteredSkillsCount: number
  proficientSkillsCount: number
  averageMasteryScore: number
}

/**
 * 🧭 Missions & Quests
 */
export interface MissionTask {
  id: string
  label: string
  completed: boolean
  targetCount: number
  currentCount: number
  targetType: 'lesson' | 'practice' | 'mastery' | 'game'
  targetId: string
}

export interface AcademyMission {
  id: string
  title: string
  description: string
  badgeIcon: string
  subjectId?: SubjectId
  tasks: MissionTask[]
  xpReward: number
  starsReward: number
  isCompleted: boolean
}

/**
 * 🤖 Safe AI Learning Assistant
 */
export interface AskOrbisQuery {
  childId: string
  childAgeBand: AgeBand
  skillId?: string
  lessonBlockId?: string
  questionText: string
}

export interface AskOrbisResponse {
  answer: string
  socraticQuestion: string
  encouragement: string
  simplifiedAnalogy: string
}
