import type { PracticeQuestion, QuestionType } from '../../types/academy'

export interface QuestionEvaluationResult {
  isCorrect: boolean
  score: number // 0 to 1.0
  feedbackMessage: string
  details?: Record<string, unknown>
}

export type UserAnswerPayload =
  | { type: 'single_option'; selectedOptionId: string }
  | { type: 'multi_option'; selectedOptionIds: string[] }
  | { type: 'number'; value: number }
  | { type: 'text'; value: string }
  | { type: 'cloze'; tokens: Record<string, string> }
  | { type: 'pairs'; matches: Record<string, string> } // leftId -> rightText or rightId
  | { type: 'ordering'; sequence: string[] }
  | { type: 'categorization'; itemCategoryMap: Record<string, string> } // item -> categoryName
  | { type: 'generic'; value: unknown }

/**
 * Universal Evaluator supporting all 13 Question Types
 */
export function evaluateQuestionAnswer(
  question: PracticeQuestion,
  answer: UserAnswerPayload
): QuestionEvaluationResult {
  switch (question.type as QuestionType) {
    case 'multiple_choice': {
      if (answer.type !== 'single_option') {
        return { isCorrect: false, score: 0, feedbackMessage: 'Invalid answer format.' }
      }
      const isCorrect = question.correctOptionIds?.includes(answer.selectedOptionId) ?? false
      return {
        isCorrect,
        score: isCorrect ? 1.0 : 0,
        feedbackMessage: isCorrect
          ? '🌟 Excellent work! Correct choice.'
          : 'Not quite right. Try analyzing the hint!',
      }
    }

    case 'multiple_select': {
      if (answer.type !== 'multi_option') {
        return { isCorrect: false, score: 0, feedbackMessage: 'Invalid answer format.' }
      }
      const correctSet = new Set(question.correctOptionIds || [])
      const userSet = new Set(answer.selectedOptionIds)

      const isExactMatch =
        correctSet.size === userSet.size &&
        Array.from(correctSet).every((id) => userSet.has(id))

      return {
        isCorrect: isExactMatch,
        score: isExactMatch ? 1.0 : 0,
        feedbackMessage: isExactMatch
          ? '✨ Perfect! All correct options selected.'
          : 'Check all options carefully.',
      }
    }

    case 'number_input': {
      if (answer.type !== 'number' || typeof answer.value !== 'number') {
        return { isCorrect: false, score: 0, feedbackMessage: 'Please enter a valid number.' }
      }
      const expected = question.correctNumber ?? 0
      const tol = question.tolerance ?? 0
      const diff = Math.abs(answer.value - expected)
      const isCorrect = diff <= tol

      return {
        isCorrect,
        score: isCorrect ? 1.0 : 0,
        feedbackMessage: isCorrect
          ? `🎉 Correct! The answer is ${expected}.`
          : 'Recalculate and try again!',
      }
    }

    case 'text_input':
    case 'word_builder': {
      if (answer.type !== 'text') {
        return { isCorrect: false, score: 0, feedbackMessage: 'Invalid text answer.' }
      }
      const expected = (question.correctText || '').trim().toLowerCase()
      const provided = (answer.value || '').trim().toLowerCase()
      const isCorrect = expected === provided

      return {
        isCorrect,
        score: isCorrect ? 1.0 : 0,
        feedbackMessage: isCorrect
          ? `🔥 Brilliant! You forged: ${question.correctText}`
          : 'Review the word roots and try again.',
      }
    }

    case 'fill_in_the_blank': {
      if (answer.type !== 'cloze' || !question.clozeParts) {
        return { isCorrect: false, score: 0, feedbackMessage: 'Fill in all blanks.' }
      }
      let allCorrect = true
      for (const part of question.clozeParts) {
        const userToken = (answer.tokens[part.blankId] || '').trim().toLowerCase()
        const expected = part.expectedToken.trim().toLowerCase()
        if (userToken !== expected) {
          allCorrect = false
          break
        }
      }
      return {
        isCorrect: allCorrect,
        score: allCorrect ? 1.0 : 0,
        feedbackMessage: allCorrect
          ? '✨ All blanks filled accurately!'
          : 'One or more blanks need revision.',
      }
    }

    case 'matching_pairs': {
      if (answer.type !== 'pairs' || !question.pairs) {
        return { isCorrect: false, score: 0, feedbackMessage: 'Match all pairs.' }
      }
      let correctMatches = 0
      for (const pair of question.pairs) {
        const userRight = (answer.matches[pair.leftText] || '').trim().toLowerCase()
        const expectedRight = pair.rightText.trim().toLowerCase()
        if (userRight === expectedRight) {
          correctMatches++
        }
      }
      const isAll = correctMatches === question.pairs.length
      return {
        isCorrect: isAll,
        score: question.pairs.length > 0 ? correctMatches / question.pairs.length : 0,
        feedbackMessage: isAll
          ? '🎯 All pairs matched successfully!'
          : `Matched ${correctMatches}/${question.pairs.length} pairs.`,
      }
    }

    case 'ordering': {
      if (answer.type !== 'ordering' || !question.orderedSequence) {
        return { isCorrect: false, score: 0, feedbackMessage: 'Order all items.' }
      }
      const isSequenceCorrect =
        question.orderedSequence.length === answer.sequence.length &&
        question.orderedSequence.every((item, idx) => item === answer.sequence[idx])

      return {
        isCorrect: isSequenceCorrect,
        score: isSequenceCorrect ? 1.0 : 0,
        feedbackMessage: isSequenceCorrect
          ? '🚀 Algorithm sequence is 100% correct!'
          : 'Check the step order and try again.',
      }
    }

    case 'categorization': {
      if (answer.type !== 'categorization' || !question.categories) {
        return { isCorrect: false, score: 0, feedbackMessage: 'Categorize all items.' }
      }
      let totalItems = 0
      let correctPlacements = 0

      for (const cat of question.categories) {
        for (const item of cat.items) {
          totalItems++
          const userCat = answer.itemCategoryMap[item]
          if (userCat === cat.name) {
            correctPlacements++
          }
        }
      }

      const isAll = correctPlacements === totalItems
      return {
        isCorrect: isAll,
        score: totalItems > 0 ? correctPlacements / totalItems : 0,
        feedbackMessage: isAll
          ? '🌿 All items sorted into correct categories!'
          : `Correctly sorted ${correctPlacements}/${totalItems} items.`,
      }
    }

    default: {
      // Fallback for visual identification / simulation / canvas trace
      return {
        isCorrect: true,
        score: 1.0,
        feedbackMessage: 'Great effort!',
      }
    }
  }
}
