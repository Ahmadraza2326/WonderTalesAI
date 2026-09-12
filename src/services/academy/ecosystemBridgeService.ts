import type { PlaygroundGameMetadata } from '../../types/playground'
import { getPlaygroundGame } from '../games/playgroundRegistry'
import { getAcademySkill } from './curriculum/curriculumRegistry'

export interface EcosystemLink {
  skillId: string
  skillTitle: string
  subjectId: string
  lessonRoute: string
  practiceRoute: string
  capstoneGame?: PlaygroundGameMetadata
}

export function getEcosystemLinksForSkill(skillId: string): EcosystemLink | undefined {
  const skill = getAcademySkill(skillId)
  if (!skill) return undefined

  let capstoneGame: PlaygroundGameMetadata | undefined
  if (skill.capstoneGameId) {
    capstoneGame = getPlaygroundGame(skill.capstoneGameId)
  }

  return {
    skillId: skill.id,
    skillTitle: skill.title,
    subjectId: skill.subjectId,
    lessonRoute: `/academy/lesson/${skill.lessonId}`,
    practiceRoute: `/academy/practice/${skill.practiceSetId}`,
    capstoneGame,
  }
}
