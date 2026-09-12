/**
 * ORBis Story Continuity Engine (Phase 2A)
 * 
 * Deterministically connects story narratives, Story DNA, vocabulary runes,
 * and ethical/scientific themes to the 348 verified Academy curriculum skills
 * and 10 Flagship Playroom Games.
 *
 * Invariant:
 * - Pure computation (0 runtime AI calls, 0 token costs, <2ms execution time).
 * - Closed system: Only references verified skills from curriculumRegistry,
 *   verified guides from guideDirector, and verified games from playgroundRegistry.
 * - Never mutates underlying curriculum data or database schemas.
 */

import type { StoryRecord } from '../../types/story'
import type { ChildProfile } from '../../types/childProfile'
import type {
  AcademySkill,
  AcademySubject,
  SubjectId,
  AgeBand,
  SkillProgressRecord,
} from '../../types/academy'
import type { GuideId, ActorPose } from '../../types/learningUniverse'
import type { PlaygroundGameMetadata } from '../../types/playground'
import {
  getAllSkills,
  getAcademySubject,
  getAcademySkill,
} from './curriculum/curriculumRegistry'
import { loadAllSkillProgress } from './masteryService'
import { getPlaygroundGame } from '../games/playgroundRegistry'

export type ContinuityMatchReason =
  | 'concept_discovery'
  | 'vocabulary_reinforcement'
  | 'prerequisite_unlock'
  | 'adaptive_growth'
  | 'foundational_fallback'

export interface MatchingEvidence {
  matchedConcepts: string[]
  matchedVocabulary: string[]
  themeDomain: string
  domainScore: number
  conceptScore: number
  vocabularyScore: number
  adaptiveNeedScore: number
  prerequisitesMet: boolean
  resolvedPrerequisiteSkillId?: string
  totalScore: number
}

export interface StoryContinuityResult {
  storyId: string
  storyTitle: string

  // 1. Primary Recommended Academy Skill
  recommendedSkill: AcademySkill
  recommendedSubject: AcademySubject
  matchReason: ContinuityMatchReason
  matchReasonLabel: string
  connectionExplanation: string

  // 2. Guide Mentor Recommendation
  guideId: GuideId
  guidePose: ActorPose
  guideDialogue: string

  // 3. Flagship Playroom Capstone Game
  capstoneGame?: PlaygroundGameMetadata
  capstoneCallToAction?: string

  // 4. Reward Metadata (Metadata only, does not award rewards directly)
  rewards: {
    lessonXp: number
    lessonStars: number
    gameXp?: number
    gameStars?: number
  }

  // 5. Navigation Routes
  routes: {
    lessonRoute: string
    practiceRoute: string
    gameRoute?: string
  }

  // 6. Explainability & Debugging Metadata
  confidence: number // 0.0 to 1.0
  evidence: MatchingEvidence
  fallbackUsed: boolean
}

export interface StoryContinuityInput {
  story: StoryRecord
  childProfile?: ChildProfile | null
  child?: ChildProfile | null
  activeChild?: ChildProfile | null
  skillProgressMap?: Record<string, SkillProgressRecord>
}

// Age band hierarchy for developmental compatibility gating
const AGE_BAND_TIERS: Record<AgeBand, number> = {
  early_learner: 0,
  beginner: 1,
  developing: 2,
  intermediate: 3,
  advanced: 4,
}

// Stop words to remove noise during token matching
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'did', 'do', 'does', 'doing', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'story', 'tale', 'book',
  'magical', 'adventure', 'great', 'little',
])

/**
 * Resolves child age band from child profile or story metadata.
 */
export function resolveAgeBandFromChild(
  childProfile?: ChildProfile | null,
  storyAge?: string | number | null
): AgeBand {
  const rawAge = childProfile?.age ?? (storyAge ? Number(storyAge) : null)

  if (rawAge !== null && !Number.isNaN(rawAge)) {
    if (rawAge <= 5) return 'early_learner'
    if (rawAge <= 8) return 'beginner'
    if (rawAge <= 11) return 'developing'
    if (rawAge <= 14) return 'intermediate'
    return 'advanced'
  }

  // Fallback to reading_level
  const readingLevel = childProfile?.reading_level?.toLowerCase()
  if (readingLevel === 'early_reader' || readingLevel === 'pre_k') return 'early_learner'
  if (readingLevel === 'beginner') return 'beginner'
  if (readingLevel === 'intermediate') return 'developing'
  if (readingLevel === 'advanced') return 'intermediate'

  return 'beginner' // Safe global default
}

/**
 * Tokenizes a string into distinct, cleaned lowercase keyword tokens.
 */
function tokenizeText(text: string): string[] {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
}

/**
 * Maps story theme / world keywords to target academic subjects.
 */
function getDomainAffinityForTheme(theme: string): SubjectId[] {
  const t = (theme || '').toLowerCase()

  if (t.includes('space') || t.includes('star') || t.includes('galaxy') || t.includes('planet') || t.includes('astronomy')) {
    return ['science', 'math', 'general_knowledge']
  }
  if (t.includes('ocean') || t.includes('forest') || t.includes('dino') || t.includes('animal') || t.includes('nature') || t.includes('reef')) {
    return ['science', 'creativity', 'reading']
  }
  if (t.includes('robot') || t.includes('machine') || t.includes('invent') || t.includes('gear') || t.includes('code') || t.includes('gadget')) {
    return ['computer_science', 'logic', 'math']
  }
  if (t.includes('potion') || t.includes('market') || t.includes('scale') || t.includes('bake') || t.includes('weigh') || t.includes('recipe')) {
    return ['math', 'logic', 'science']
  }
  if (t.includes('detective') || t.includes('mystery') || t.includes('clue') || t.includes('secret') || t.includes('puzzle') || t.includes('riddle')) {
    return ['logic', 'reading', 'general_knowledge']
  }

  // Fantasy / Fairy tale / General default
  return ['reading', 'vocabulary', 'creativity', 'english']
}

/**
 * Assigns a canonical guide mentor based on subject and theme.
 */
function assignGuideForSubject(subjectId: SubjectId, theme?: string): { guideId: GuideId; pose: ActorPose } {
  const t = (theme || '').toLowerCase()

  if (t.includes('space') || t.includes('star') || t.includes('galaxy')) {
    return { guideId: 'nova', pose: 'excited' }
  }

  switch (subjectId) {
    case 'math':
      return { guideId: 'poly', pose: 'happy' }
    case 'science':
      return { guideId: 'newton', pose: 'curious' }
    case 'reading':
    case 'english':
    case 'vocabulary':
    case 'grammar':
      return { guideId: 'lexi', pose: 'happy' }
    case 'computer_science':
      return { guideId: 'beep_0', pose: 'excited' }
    case 'logic':
      return { guideId: 'sherlock', pose: 'curious' }
    case 'creativity':
      return { guideId: 'davinci', pose: 'celebrating' }
    case 'general_knowledge':
      return { guideId: 'atlas', pose: 'teaching' }
    default:
      return { guideId: 'harmony', pose: 'happy' }
  }
}

/**
 * Generates an encouraging, conversational guide dialogue string.
 */
function createGuideDialogue(
  _guideId: GuideId,
  storyTitle: string,
  skillTitle: string,
  matchReason: ContinuityMatchReason
): string {
  const shortTitle = storyTitle.length > 28 ? `${storyTitle.slice(0, 26)}...` : storyTitle

  switch (matchReason) {
    case 'concept_discovery':
      return `Awesome reading! In "${shortTitle}", you discovered exciting ideas. Let's master ${skillTitle} together!`
    case 'vocabulary_reinforcement':
      return `Word power unlocked! You met brilliant new words in "${shortTitle}". Ready to forge your skills in ${skillTitle}?`
    case 'prerequisite_unlock':
      return `You're on an epic quest! Master ${skillTitle} first to unlock the next chapter of your journey!`
    case 'adaptive_growth':
      return `Great adventure in "${shortTitle}"! Let's boost your skill crystal with ${skillTitle}!`
    case 'foundational_fallback':
    default:
      return `Fantastic job finishing "${shortTitle}"! Join me in the Academy to explore ${skillTitle}!`
  }
}

/**
 * Deterministically computes the optimal Academy Skill, Capstone Game, and Guide
 * connection for any given story record.
 */
export function getStoryContinuityBridge(input: StoryContinuityInput): StoryContinuityResult {
  const { story, childProfile, skillProgressMap } = input
  const effectiveChild = childProfile || input.child || input.activeChild
  const allSkills = getAllSkills()
  const progressMap = skillProgressMap || loadAllSkillProgress()

  const storyTitle = story.title || 'Magical Story'
  const childAgeBand = resolveAgeBandFromChild(effectiveChild, story.child_age)
  const childTier = AGE_BAND_TIERS[childAgeBand]

  // 1. Extract Normalized Story Tokens
  const educationalConcepts = story.learning_package?.storyDNA?.educationalConcepts || []
  const vocabularyWords = (story.learning_package?.storyDNA?.vocabulary || []).map((v) => v.word)
  const rawTheme = story.learning_package?.storyDNA?.theme || story.theme || ''
  const rawMoral = story.learning_package?.storyDNA?.moral || story.moral || ''
  const storyBody = story.learning_package?.story || (typeof story.story_content === 'string' ? story.story_content : '')

  const conceptTokens = Array.from(new Set(educationalConcepts.flatMap((c) => tokenizeText(c))))
  const vocabTokens = Array.from(new Set(vocabularyWords.flatMap((w) => tokenizeText(w))))
  const themeTokens = tokenizeText(`${rawTheme} ${rawMoral} ${storyTitle}`)

  const domainAffinities = getDomainAffinityForTheme(rawTheme)

  // 2. Score All Candidate Skills
  interface ScoredCandidate {
    skill: AcademySkill
    subject: AcademySubject
    evidence: MatchingEvidence
    unmetPrerequisite?: AcademySkill
  }

  const scoredCandidates: ScoredCandidate[] = []

  for (const skill of allSkills) {
    const subject = getAcademySubject(skill.subjectId)
    if (!subject) continue

    const skillTier = AGE_BAND_TIERS[skill.ageBand]

    // Developmental Gate: Reject skills more than 1 tier above child's age band
    if (skillTier > childTier + 1) {
      continue
    }

    const skillTitleTokens = tokenizeText(skill.title)
    const skillDescTokens = tokenizeText(skill.description)
    const allSkillTokens = Array.from(new Set([...skillTitleTokens, ...skillDescTokens]))

    // A. Concept Overlap Score (0.0 to 1.0)
    const matchedConcepts: string[] = []
    let conceptHits = 0
    for (const cToken of conceptTokens) {
      if (allSkillTokens.some((sToken) => sToken.includes(cToken) || cToken.includes(sToken))) {
        conceptHits++
        matchedConcepts.push(cToken)
      }
    }
    const conceptScore = conceptTokens.length > 0 ? Math.min(1.0, (conceptHits / Math.max(1, conceptTokens.length)) * 1.5) : 0

    // B. Vocabulary Overlap Score (0.0 to 1.0)
    const matchedVocab: string[] = []
    let vocabHits = 0
    for (const vToken of vocabTokens) {
      if (allSkillTokens.some((sToken) => sToken.includes(vToken) || vToken.includes(sToken))) {
        vocabHits++
        matchedVocab.push(vToken)
      }
    }
    const vocabularyScore = vocabTokens.length > 0 ? Math.min(1.0, (vocabHits / Math.max(1, vocabTokens.length)) * 1.5) : 0

    // C. Theme & Domain Affinity Score (0.0 to 1.0)
    let domainScore = 0.2 // Base affinity
    if (domainAffinities.includes(skill.subjectId)) {
      const idx = domainAffinities.indexOf(skill.subjectId)
      domainScore = idx === 0 ? 1.0 : 0.75
    }
    // Boost if story title tokens directly overlap skill tokens
    const directTitleOverlap = themeTokens.filter((t) => allSkillTokens.includes(t)).length
    if (directTitleOverlap > 0) {
      domainScore = Math.min(1.0, domainScore + 0.25)
    }

    // D. Adaptive Need & Mastery Score (0.0 to 1.0)
    const prog = progressMap[skill.id]
    let adaptiveNeedScore = 1.0
    if (prog) {
      if (prog.masteryLevel === 'mastered') {
        adaptiveNeedScore = 0.15 // Deprioritize already mastered skills
      } else if (prog.masteryLevel === 'proficient') {
        adaptiveNeedScore = 0.45
      } else if (prog.masteryLevel === 'practicing' || prog.masteryLevel === 'developing') {
        adaptiveNeedScore = 0.85 // High value for reinforcement
      } else {
        adaptiveNeedScore = 1.0 // Ready to learn
      }
    }

    // E. Prerequisite Evaluation
    let prerequisitesMet = true
    let unmetPrereqSkill: AcademySkill | undefined

    if (skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0) {
      for (const prereqId of skill.prerequisiteSkillIds) {
        const prereqProg = progressMap[prereqId]
        const isPrereqSatisfied = prereqProg && (prereqProg.masteryLevel === 'proficient' || prereqProg.masteryLevel === 'mastered')
        if (!isPrereqSatisfied) {
          prerequisitesMet = false
          unmetPrereqSkill = getAcademySkill(prereqId)
          break
        }
      }
    }

    // Age proximity bonus (prioritize exact age band match over +1 tier stretch)
    const ageProximityMultiplier = skill.ageBand === childAgeBand ? 1.1 : 0.9

    // Weighted Formula
    const baseWeightedScore =
      conceptScore * 0.4 +
      vocabularyScore * 0.25 +
      domainScore * 0.2 +
      adaptiveNeedScore * 0.15

    const finalScore = Number((baseWeightedScore * ageProximityMultiplier).toFixed(4))

    scoredCandidates.push({
      skill,
      subject,
      evidence: {
        matchedConcepts,
        matchedVocabulary: matchedVocab,
        themeDomain: skill.subjectId,
        domainScore,
        conceptScore,
        vocabularyScore,
        adaptiveNeedScore,
        prerequisitesMet,
        resolvedPrerequisiteSkillId: unmetPrereqSkill?.id,
        totalScore: finalScore,
      },
      unmetPrerequisite: unmetPrereqSkill,
    })
  }

  // 3. Sort Candidates by Score Descending
  scoredCandidates.sort((a, b) => b.evidence.totalScore - a.evidence.totalScore)

  const topCandidate = scoredCandidates[0]
  const hasStrongMatch = topCandidate && topCandidate.evidence.totalScore >= 0.25

  let chosenSkill: AcademySkill
  let chosenSubject: AcademySubject
  let matchReason: ContinuityMatchReason
  let matchReasonLabel: string
  let connectionExplanation: string
  let finalEvidence: MatchingEvidence
  let fallbackUsed = false

  if (hasStrongMatch) {
    // If top candidate has an unmet prerequisite, recommend the prerequisite unlock step
    if (!topCandidate.evidence.prerequisitesMet && topCandidate.unmetPrerequisite) {
      const prereqSubject = getAcademySubject(topCandidate.unmetPrerequisite.subjectId) || topCandidate.subject
      chosenSkill = topCandidate.unmetPrerequisite
      chosenSubject = prereqSubject
      matchReason = 'prerequisite_unlock'
      matchReasonLabel = '⭐ Prerequisite Adventure Unlocked'
      connectionExplanation = `To prepare for ${topCandidate.skill.title}, build your foundation in ${topCandidate.unmetPrerequisite.title}!`
      finalEvidence = {
        ...topCandidate.evidence,
        resolvedPrerequisiteSkillId: topCandidate.unmetPrerequisite.id,
      }
    } else {
      chosenSkill = topCandidate.skill
      chosenSubject = topCandidate.subject
      finalEvidence = topCandidate.evidence

      if (topCandidate.evidence.conceptScore >= 0.4) {
        matchReason = 'concept_discovery'
        matchReasonLabel = '🔬 Story Science & Concept Match'
        connectionExplanation = `Your story explored ${topCandidate.evidence.matchedConcepts.slice(0, 2).join(' & ')}. Deepen your discovery in the Academy!`
      } else if (topCandidate.evidence.vocabularyScore >= 0.3) {
        matchReason = 'vocabulary_reinforcement'
        matchReasonLabel = '🔤 Vocabulary Power Match'
        connectionExplanation = `You encountered power words like ${topCandidate.evidence.matchedVocabulary.slice(0, 2).join(', ')}. Master them with interactive lessons!`
      } else {
        matchReason = 'adaptive_growth'
        matchReasonLabel = '✨ Next Adventure in Your Learning Journey'
        connectionExplanation = `Continue your quest in ${chosenSubject.title} with this recommended challenge!`
      }
    }
  } else {
    // 4. Safe Fallback Selection
    fallbackUsed = true
    const fallbackSkill =
      allSkills.find((s) => s.ageBand === childAgeBand && s.subjectId === domainAffinities[0]) ||
      allSkills.find((s) => s.ageBand === childAgeBand) ||
      allSkills[0]

    const fallbackSubject = getAcademySubject(fallbackSkill.subjectId) || getAcademySubject('reading')!

    chosenSkill = fallbackSkill
    chosenSubject = fallbackSubject
    matchReason = 'foundational_fallback'
    matchReasonLabel = '🌟 Recommended Academy Lesson'
    connectionExplanation = `Jump into ${fallbackSubject.title} to level up your explorer passport!`
    finalEvidence = {
      matchedConcepts: [],
      matchedVocabulary: [],
      themeDomain: fallbackSubject.id,
      domainScore: 0.5,
      conceptScore: 0,
      vocabularyScore: 0,
      adaptiveNeedScore: 1.0,
      prerequisitesMet: true,
      totalScore: 0.5,
    }
  }

  // 5. Resolve Flagship Playroom Capstone Game
  let capstoneGame: PlaygroundGameMetadata | undefined
  let capstoneCallToAction: string | undefined

  if (chosenSkill.capstoneGameId) {
    capstoneGame = getPlaygroundGame(chosenSkill.capstoneGameId)
  }

  // Subject-level game fallback if skill does not specify a capstone directly
  if (!capstoneGame) {
    if (chosenSubject.id === 'math') capstoneGame = getPlaygroundGame('potion_scales')
    else if (chosenSubject.id === 'science') capstoneGame = getPlaygroundGame('ecosystem_sandbox')
    else if (chosenSubject.id === 'computer_science') capstoneGame = getPlaygroundGame('robopath')
    else if (chosenSubject.id === 'logic') capstoneGame = getPlaygroundGame('mystery_detective')
    else if (chosenSubject.id === 'vocabulary' || chosenSubject.id === 'english') capstoneGame = getPlaygroundGame('spellforge')
    else if (chosenSubject.id === 'creativity') capstoneGame = getPlaygroundGame('invention_lab')
  }

  if (capstoneGame) {
    capstoneCallToAction = `Put your ${chosenSubject.title} superpowers to the test in ${capstoneGame.title}!`
  }

  // 6. Assign Guide Avatar & Dialogues
  const preferredGuideId = ((effectiveChild as any)?.guide_companion as GuideId) || undefined
  const { guideId: subjectGuideId, pose } = assignGuideForSubject(chosenSubject.id, rawTheme)
  const guideId = preferredGuideId || subjectGuideId
  const guideDialogue = createGuideDialogue(guideId, storyTitle, chosenSkill.title, matchReason)

  // 7. Calculate Confidence Metric (0.0 to 1.0)
  const confidence = fallbackUsed ? 0.6 : Math.min(1.0, Math.max(0.4, finalEvidence.totalScore * 1.2))

  return {
    storyId: story.id,
    storyTitle,
    recommendedSkill: chosenSkill,
    recommendedSubject: chosenSubject,
    matchReason,
    matchReasonLabel,
    connectionExplanation,
    guideId,
    guidePose: pose,
    guideDialogue,
    capstoneGame,
    capstoneCallToAction,
    rewards: {
      lessonXp: 30,
      lessonStars: 5,
      gameXp: capstoneGame ? 25 : undefined,
      gameStars: capstoneGame ? 5 : undefined,
    },
    routes: {
      lessonRoute: `/academy/lesson/${chosenSkill.lessonId}`,
      practiceRoute: `/academy/practice/${chosenSkill.practiceSetId}`,
      gameRoute: capstoneGame?.route,
    },
    confidence: Number(confidence.toFixed(2)),
    evidence: finalEvidence,
    fallbackUsed,
  }
}
