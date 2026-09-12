import type {
  AcademySubject,
  SubjectId,
  AcademyCourse,
  AcademyUnit,
  AcademySkill,
} from '../../../types/academy'
import { MATH_SUBJECT } from './subjects/math'
import { SCIENCE_SUBJECT } from './subjects/science'
import {
  ENGLISH_SUBJECT,
  READING_SUBJECT,
  VOCABULARY_SUBJECT,
  GRAMMAR_SUBJECT,
} from './subjects/english'
import { CS_SUBJECT } from './subjects/computerScience'
import {
  LOGIC_SUBJECT,
  CREATIVITY_SUBJECT,
  GENERAL_KNOWLEDGE_SUBJECT,
} from './subjects/logicCreativity'

export const ACADEMY_SUBJECTS_REGISTRY: Record<SubjectId, AcademySubject> = {
  math: MATH_SUBJECT,
  science: SCIENCE_SUBJECT,
  english: ENGLISH_SUBJECT,
  reading: READING_SUBJECT,
  vocabulary: VOCABULARY_SUBJECT,
  grammar: GRAMMAR_SUBJECT,
  computer_science: CS_SUBJECT,
  logic: LOGIC_SUBJECT,
  creativity: CREATIVITY_SUBJECT,
  general_knowledge: GENERAL_KNOWLEDGE_SUBJECT,
}

export function getAllAcademySubjects(): AcademySubject[] {
  return Object.values(ACADEMY_SUBJECTS_REGISTRY)
}

export function getAcademySubject(subjectId: SubjectId | string): AcademySubject | undefined {
  return ACADEMY_SUBJECTS_REGISTRY[subjectId as SubjectId]
}

export function getAcademyCourse(courseId: string): AcademyCourse | undefined {
  for (const subject of getAllAcademySubjects()) {
    const course = subject.courses.find((c) => c.id === courseId)
    if (course) return course
  }
  return undefined
}

export function getAcademyUnit(unitId: string): AcademyUnit | undefined {
  for (const subject of getAllAcademySubjects()) {
    for (const course of subject.courses) {
      const unit = course.units.find((u) => u.id === unitId)
      if (unit) return unit
    }
  }
  return undefined
}

export function getAcademySkill(skillId: string): AcademySkill | undefined {
  for (const subject of getAllAcademySubjects()) {
    for (const course of subject.courses) {
      for (const unit of course.units) {
        const skill = unit.skills.find((s) => s.id === skillId)
        if (skill) return skill
      }
    }
  }
  return undefined
}

export function getAllSkills(): AcademySkill[] {
  const all: AcademySkill[] = []
  for (const subject of getAllAcademySubjects()) {
    for (const course of subject.courses) {
      for (const unit of course.units) {
        all.push(...unit.skills)
      }
    }
  }
  return all
}

export function getSkillsForSubject(subjectId: SubjectId): AcademySkill[] {
  const subject = getAcademySubject(subjectId)
  if (!subject) return []
  const skills: AcademySkill[] = []
  for (const course of subject.courses) {
    for (const unit of course.units) {
      skills.push(...unit.skills)
    }
  }
  return skills
}
