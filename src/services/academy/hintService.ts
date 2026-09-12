import type { PracticeQuestion, ProgressiveHints } from '../../types/academy'

export interface HintRequestResult {
  tierLevel: 1 | 2 | 3 | 4
  hintText: string
  hasMoreHints: boolean
  isMaxTier: boolean
}

/**
 * Returns progressive hint for a given question and current tier level (1 to 4).
 */
export function getProgressiveHint(
  question: PracticeQuestion,
  currentTier: number
): HintRequestResult {
  const hints = question.hints
  const targetTier = Math.max(1, Math.min(4, currentTier)) as 1 | 2 | 3 | 4

  let hintText = ''
  switch (targetTier) {
    case 1:
      hintText = hints.tier1Concept
      break
    case 2:
      hintText = hints.tier2Specific
      break
    case 3:
      hintText = hints.tier3Partial
      break
    case 4:
      hintText = hints.tier4WorkedMethod
      break
  }

  return {
    tierLevel: targetTier,
    hintText,
    hasMoreHints: targetTier < 4,
    isMaxTier: targetTier === 4,
  }
}

/**
 * Safety check: Verifies that Tier 1, 2, and 3 hints do not accidentally leak
 * the raw answer string or exact expected number.
 */
export function verifyHintSafety(
  hints: ProgressiveHints,
  rawAnswer: string | number
): { isSafe: boolean; leakingTiers: number[] } {
  const answerStr = String(rawAnswer).trim().toLowerCase()
  if (!answerStr || answerStr.length < 2) {
    return { isSafe: true, leakingTiers: [] }
  }

  const leakingTiers: number[] = []

  // Check tiers 1, 2, 3
  if (hints.tier1Concept.toLowerCase().includes(answerStr)) {
    leakingTiers.push(1)
  }
  if (hints.tier2Specific.toLowerCase().includes(answerStr)) {
    leakingTiers.push(2)
  }
  if (hints.tier3Partial.toLowerCase().includes(answerStr)) {
    leakingTiers.push(3)
  }

  return {
    isSafe: leakingTiers.length === 0,
    leakingTiers,
  }
}
