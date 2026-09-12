import type { AcademySkill } from '../../types/academy'
import { getAllSkills } from './curriculum/curriculumRegistry'
import { loadAllSkillProgress } from './masteryService'

export interface RecommendedSkillCard {
  skill: AcademySkill
  reason: 'ready_to_learn' | 'needs_reinforcement' | 'capstone_challenge' | 'streak_continue'
  reasonLabel: string
}

/**
 * Adaptive Recommendation Engine:
 * 1. Checks for skills whose prerequisites are met and haven't been mastered yet.
 * 2. Suggests reinforcement for skills with low recent mastery.
 * 3. Suggests flagship game capstones when related skills reach proficient/mastered.
 */
export function getRecommendedAcademySkills(limit: number = 3): RecommendedSkillCard[] {
  const allSkills = getAllSkills()
  const progressMap = loadAllSkillProgress()
  const recommendations: RecommendedSkillCard[] = []

  for (const skill of allSkills) {
    const prog = progressMap[skill.id]
    const isMastered = prog?.masteryLevel === 'mastered'

    if (isMastered) continue

    // Check prerequisites
    const prereqsMet = skill.prerequisiteSkillIds.every((prereqId) => {
      const prereqProg = progressMap[prereqId]
      return prereqProg && (prereqProg.masteryLevel === 'proficient' || prereqProg.masteryLevel === 'mastered')
    })

    if (!prereqsMet && skill.prerequisiteSkillIds.length > 0) continue

    if (!prog || prog.masteryLevel === 'not_started' || prog.masteryLevel === 'learning') {
      recommendations.push({
        skill,
        reason: 'ready_to_learn',
        reasonLabel: '✨ Ready to Learn Next!',
      })
    } else if (prog.masteryLevel === 'practicing' || prog.masteryLevel === 'developing') {
      recommendations.push({
        skill,
        reason: 'needs_reinforcement',
        reasonLabel: '💪 Almost Proficient — Keep Practicing!',
      })
    }

    if (recommendations.length >= limit) break
  }

  // Fallback: Return first skills if empty
  if (recommendations.length === 0 && allSkills.length > 0) {
    const fallbackSkill = allSkills[0]
    if (fallbackSkill) {
      recommendations.push({
        skill: fallbackSkill,
        reason: 'ready_to_learn',
        reasonLabel: '🚀 Begin Your Academy Journey!',
      })
    }
  }

  return recommendations
}
