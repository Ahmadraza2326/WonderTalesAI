import {
  evaluateQuestionAnswer,
} from '../src/services/academy/practiceEngine'
import type { PracticeQuestion } from '../src/types/academy'

function runPracticeEvaluatorTests() {
  console.log('🎯 Running Practice Question Evaluator Tests (13 Types)...')
  let passed = 0
  let failed = 0

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++
    } else {
      failed++
      console.error(`❌ FAILED: ${msg}`)
    }
  }

  // 1. Multiple Choice
  const mcQuestion: PracticeQuestion = {
    id: 'q_mc',
    type: 'multiple_choice',
    prompt: 'What is 5 + 3?',
    options: [
      { id: 'opt_1', text: '7' },
      { id: 'opt_2', text: '8', isCorrect: true },
      { id: 'opt_3', text: '9' },
    ],
    correctOptionIds: ['opt_2'],
    hints: {
      tier1Concept: 'Addition combines groups.',
      tier2Specific: 'Count 3 up from 5.',
      tier3Partial: '5 + 2 = 7, add 1 more.',
      tier4WorkedMethod: '5 + 3 = 8.',
    },
    explanation: '5 + 3 = 8.',
    difficulty: 'easy',
  }

  const mcCorrect = evaluateQuestionAnswer(mcQuestion, { type: 'single_option', selectedOptionId: 'opt_2' })
  assert(mcCorrect.isCorrect && mcCorrect.score === 1.0, 'Multiple choice correct evaluation')

  const mcWrong = evaluateQuestionAnswer(mcQuestion, { type: 'single_option', selectedOptionId: 'opt_1' })
  assert(!mcWrong.isCorrect && mcWrong.score === 0, 'Multiple choice wrong evaluation')

  // 2. Number Input with Tolerance
  const numQuestion: PracticeQuestion = {
    id: 'q_num',
    type: 'number_input',
    prompt: 'Enter the balance mass in grams:',
    correctNumber: 15,
    tolerance: 0.5,
    hints: { tier1Concept: 'c', tier2Specific: 's', tier3Partial: 'p', tier4WorkedMethod: 'w' },
    explanation: '15 grams',
    difficulty: 'medium',
  }

  const numCorrect = evaluateQuestionAnswer(numQuestion, { type: 'number', value: 15.2 })
  assert(numCorrect.isCorrect, 'Number input within tolerance evaluates correct')

  const numWrong = evaluateQuestionAnswer(numQuestion, { type: 'number', value: 16.5 })
  assert(!numWrong.isCorrect, 'Number input outside tolerance evaluates wrong')

  // 3. Word Builder / Text Input
  const wordQuestion: PracticeQuestion = {
    id: 'q_wb',
    type: 'word_builder',
    prompt: 'Forge the word meaning to make again:',
    correctText: 'REMAKE',
    hints: { tier1Concept: 'c', tier2Specific: 's', tier3Partial: 'p', tier4WorkedMethod: 'w' },
    explanation: 'RE + MAKE = REMAKE',
    difficulty: 'easy',
  }

  const wordCorrect = evaluateQuestionAnswer(wordQuestion, { type: 'text', value: 'remake' })
  assert(wordCorrect.isCorrect, 'Word builder case-insensitive matches correct text')

  // 4. Fill in the Blank (Cloze)
  const clozeQuestion: PracticeQuestion = {
    id: 'q_cloze',
    type: 'fill_in_the_blank',
    prompt: 'Complete the sentence:',
    clozeParts: [
      { prefixText: 'He ', blankId: 'b1', expectedToken: 'unlocked', suffixText: ' the door.' },
    ],
    hints: { tier1Concept: 'c', tier2Specific: 's', tier3Partial: 'p', tier4WorkedMethod: 'w' },
    explanation: 'unlocked',
    difficulty: 'easy',
  }

  const clozeCorrect = evaluateQuestionAnswer(clozeQuestion, { type: 'cloze', tokens: { b1: 'unlocked' } })
  assert(clozeCorrect.isCorrect, 'Cloze blank matches expected token')

  // 5. Categorization
  const catQuestion: PracticeQuestion = {
    id: 'q_cat',
    type: 'categorization',
    prompt: 'Sort items:',
    categories: [
      { name: 'Herbivores', items: ['Rabbit', 'Deer'] },
      { name: 'Carnivores', items: ['Wolf', 'Hawk'] },
    ],
    hints: { tier1Concept: 'c', tier2Specific: 's', tier3Partial: 'p', tier4WorkedMethod: 'w' },
    explanation: 'Ecology categories',
    difficulty: 'medium',
  }

  const catCorrect = evaluateQuestionAnswer(catQuestion, {
    type: 'categorization',
    itemCategoryMap: { Rabbit: 'Herbivores', Deer: 'Herbivores', Wolf: 'Carnivores', Hawk: 'Carnivores' },
  })
  assert(catCorrect.isCorrect && catCorrect.score === 1.0, 'Categorization evaluates all items accurately')

  // 6. Ordering (Sequence)
  const orderQuestion: PracticeQuestion = {
    id: 'q_ord',
    type: 'ordering',
    prompt: 'Order steps:',
    orderedSequence: ['Step A', 'Step B', 'Step C'],
    hints: { tier1Concept: 'c', tier2Specific: 's', tier3Partial: 'p', tier4WorkedMethod: 'w' },
    explanation: 'Sequential order',
    difficulty: 'medium',
  }

  const orderCorrect = evaluateQuestionAnswer(orderQuestion, {
    type: 'ordering',
    sequence: ['Step A', 'Step B', 'Step C'],
  })
  assert(orderCorrect.isCorrect, 'Ordering matches exact sequence')

  const orderWrong = evaluateQuestionAnswer(orderQuestion, {
    type: 'ordering',
    sequence: ['Step B', 'Step A', 'Step C'],
  })
  assert(!orderWrong.isCorrect, 'Wrong sequence fails ordering evaluation')

  console.log(`\nPractice Evaluator Tests: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

runPracticeEvaluatorTests()
