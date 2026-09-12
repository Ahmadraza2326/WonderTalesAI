import type { MasteryTier, SkillProgressRecord, SubjectMasterySummary, SubjectId } from '../../types/academy'
import { getSkillsForSubject, getAllAcademySubjects } from './curriculum/curriculumRegistry'

export interface MasteryCalculationInput {
  attemptsCount: number
  correctCount: number
  hintsUsedCount: number
  daysSinceLastPracticed: number
  capstoneGameMastered?: boolean
}

export function calculateSkillMastery(input: MasteryCalculationInput): {
  score: number
  tier: MasteryTier
} {
  if (input.attemptsCount === 0) {
    return { score: 0, tier: 'not_started' }
  }

  // 1. Accuracy Component (0 - 100)
  const accuracy = Math.min(100, Math.round((input.correctCount / Math.max(1, input.attemptsCount)) * 100))

  // 2. Independence Component: penalized if heavy hints were required
  const hintsRatio = input.hintsUsedCount / Math.max(1, input.attemptsCount)
  const independence = Math.max(0, Math.min(100, Math.round((1 - hintsRatio * 0.5) * 100)))

  // 3. Retention Component: decays gently after 14 days without practice
  let retention = 100
  if (input.daysSinceLastPracticed > 14) {
    const daysOver = input.daysSinceLastPracticed - 14
    retention = Math.max(50, 100 - daysOver * 2)
  }

  // 4. Transfer / Capstone Component
  const transfer = input.capstoneGameMastered ? 100 : 75

  // Weighted formula
  const weightedScore = Math.round(
    accuracy * 0.35 + independence * 0.25 + retention * 0.2 + transfer * 0.2
  )

  const finalScore = Math.max(0, Math.min(100, weightedScore))

  let tier: MasteryTier = 'learning'
  if (finalScore >= 95) tier = 'mastered'
  else if (finalScore >= 80) tier = 'proficient'
  else if (finalScore >= 60) tier = 'developing'
  else if (finalScore >= 30) tier = 'practicing'
  else if (finalScore > 0) tier = 'learning'
  else tier = 'not_started'

  return { score: finalScore, tier }
}

const STORAGE_KEY = 'orbis_academy_skill_progress'
const inMemoryProgressStore: Record<string, SkillProgressRecord> = {}

export function loadAllSkillProgress(): Record<string, SkillProgressRecord> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...inMemoryProgressStore }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { ...inMemoryProgressStore }
  } catch {
    return { ...inMemoryProgressStore }
  }
}

export function saveSkillProgress(record: SkillProgressRecord): void {
  inMemoryProgressStore[record.skillId] = record
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const current = loadAllSkillProgress()
    current[record.skillId] = record
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Fallback handled by inMemoryProgressStore
  }
}

export function recordLessonCompletion(
  skillId: string,
  subjectId: SubjectId,
  childId: string = 'guest'
): SkillProgressRecord {
  const all = loadAllSkillProgress()
  const existing = all[skillId]

  const nextAttempts = (existing?.attemptsCount || 0) + 1
  const nextCorrect = (existing?.correctCount || 0) + 1
  const baseLessonScore = 50 // baseline comprehension score from completing lesson

  const currentScore = existing?.masteryScore || 0
  const finalScore = Math.max(currentScore, baseLessonScore)

  let tier: MasteryTier = 'practicing'
  if (finalScore >= 95) tier = 'mastered'
  else if (finalScore >= 80) tier = 'proficient'
  else if (finalScore >= 60) tier = 'developing'
  else if (finalScore >= 30) tier = 'practicing'
  else if (finalScore > 0) tier = 'learning'
  else tier = 'not_started'

  const record: SkillProgressRecord = {
    childId,
    skillId,
    subjectId,
    masteryLevel: tier,
    masteryScore: finalScore,
    attemptsCount: nextAttempts,
    correctCount: nextCorrect,
    hintsUsedCount: existing?.hintsUsedCount || 0,
    streak: (existing?.streak || 0) + 1,
    lastPracticedAt: new Date().toISOString(),
  }

  saveSkillProgress(record)
  return record
}

export function getSubjectMasterySummaries(): SubjectMasterySummary[] {
  const allProgress = loadAllSkillProgress()
  const subjects = getAllAcademySubjects()

  return subjects.map((subject) => {
    const skills = getSkillsForSubject(subject.id)
    let totalScore = 0
    let masteredCount = 0
    let proficientCount = 0

    for (const skill of skills) {
      const prog = allProgress[skill.id]
      if (prog) {
        totalScore += prog.masteryScore
        if (prog.masteryLevel === 'mastered') masteredCount++
        else if (prog.masteryLevel === 'proficient') proficientCount++
      }
    }

    const avg = skills.length > 0 ? Math.round(totalScore / skills.length) : 0

    return {
      subjectId: subject.id,
      title: subject.title,
      icon: subject.icon,
      accentColor: subject.accentColor,
      totalSkills: skills.length,
      masteredSkillsCount: masteredCount,
      proficientSkillsCount: proficientCount,
      averageMasteryScore: avg,
    }
  })
}
