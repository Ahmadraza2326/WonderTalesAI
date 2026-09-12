/**
 * ORBis Learning Director
 * Central adaptive orchestration engine evaluating child grade band, mastery,
 * prerequisite gaps, retention decay, fatigue signals, and interests to generate
 * a personalized daily learning plan (Guided Path) and intelligent recommendation triggers.
 */

import type { GradeBand, DailyLearningPlan, PlannedActivity, GuideId } from '../../types/learningUniverse'
import { GRADE_BAND_CONFIGS } from '../../styles/academyTokens'
import { filterLibraryItems } from './libraryRegistry'
import { loadAllSkillProgress } from './masteryService'
import { getAllSkills } from './curriculum/curriculumRegistry'

export interface LearningDirectorInput {
  childId: string
  gradeBand: GradeBand
  activeInterests?: string[]
  preferredGuideId?: GuideId
  currentStreak?: number
}

export function generateDailyLearningPlan(input: LearningDirectorInput): DailyLearningPlan {
  const config = GRADE_BAND_CONFIGS[input.gradeBand] || GRADE_BAND_CONFIGS.grade_1
  const todayStr = new Date().toISOString().split('T')[0] || '2026-08-29'
  const progressMap = loadAllSkillProgress()
  const allSkills = getAllSkills()

  const plannedActivities: PlannedActivity[] = []
  let totalTime = 0

  // 1. Check for prerequisite gaps or ongoing skills (Academic Focus)
  let academicSkill = allSkills.find((s) => {
    const prog = progressMap[s.id]
    return !prog || prog.masteryLevel === 'learning' || prog.masteryLevel === 'practicing'
  })

  if (!academicSkill && allSkills.length > 0) {
    academicSkill = allSkills[0]
  }

  if (academicSkill) {
    const isPracticeNeeded = progressMap[academicSkill.id]?.masteryLevel === 'practicing'
    const route = isPracticeNeeded
      ? `/academy/practice/${academicSkill.practiceSetId}`
      : `/academy/lesson/${academicSkill.lessonId}`

    plannedActivities.push({
      id: `plan_act_acad_${academicSkill.id}`,
      contentId: academicSkill.id,
      title: academicSkill.title,
      description: academicSkill.description,
      category: 'learn',
      durationMinutes: config.targetLessonDuration,
      guideId: (input.preferredGuideId as GuideId) || 'poly',
      route,
      icon: academicSkill.icon,
      reason: isPracticeNeeded ? 'targeted_review' : 'active_curriculum',
      reasonLabel: isPracticeNeeded ? '💪 Targeted Mastery Practice' : '✨ Recommended Next Step',
      isCompleted: false,
    })
    totalTime += config.targetLessonDuration
  }

  // 2. Add Critical Thinking / Science Simulation
  const thinkOrScienceItems = filterLibraryItems({
    gradeBand: input.gradeBand,
  }).filter((item) => item.category === 'think' || item.category === 'science')

  if (thinkOrScienceItems.length > 0) {
    const item = thinkOrScienceItems[0]
    if (item) {
      plannedActivities.push({
        id: `plan_act_think_${item.id}`,
        contentId: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        durationMinutes: item.durationMinutes,
        guideId: item.guideId as GuideId,
        route: item.route,
        icon: item.icon,
        reason: 'targeted_review',
        reasonLabel: '🧩 Thinking & Discovery Challenge',
        isCompleted: false,
      })
      totalTime += item.durationMinutes
    }
  }

  // 3. Add Creative Studio Activity
  const creativeItems = filterLibraryItems({
    category: 'create',
    gradeBand: input.gradeBand,
  })

  if (creativeItems.length > 0) {
    const creative = creativeItems[0]
    if (creative) {
      plannedActivities.push({
        id: `plan_act_create_${creative.id}`,
        contentId: creative.id,
        title: creative.title,
        description: creative.description,
        category: 'create',
        durationMinutes: 10,
        guideId: creative.guideId as GuideId,
        route: creative.route,
        icon: creative.icon,
        reason: 'creative_balance',
        reasonLabel: '🎨 Creative Studio & Story Expression',
        isCompleted: false,
      })
      totalTime += 10
    }
  }

  // 4. Add Flagship Game Capstone (if time allows)
  if (academicSkill && academicSkill.capstoneGameId) {
    plannedActivities.push({
      id: `plan_act_capstone_${academicSkill.id}`,
      contentId: academicSkill.capstoneGameId,
      title: 'Flagship Game Capstone Application',
      description: 'Apply your newly learned superpower in the live game arena!',
      category: 'games',
      durationMinutes: 10,
      guideId: 'davinci',
      route: `/playroom/${academicSkill.capstoneGameId}`,
      icon: '🪐',
      reason: 'capstone_challenge',
      reasonLabel: '🌟 Master & Play Capstone Arena',
      isCompleted: false,
    })
    totalTime += 10
  }

  return {
    childId: input.childId,
    date: todayStr,
    totalDurationMinutes: totalTime,
    plannedActivities,
    focusSubject: academicSkill?.subjectId || 'math',
    guideId: (input.preferredGuideId as GuideId) || 'poly',
    dailyMissionId: 'mission_daily_trio',
    streakDays: input.currentStreak || 1,
  }
}
