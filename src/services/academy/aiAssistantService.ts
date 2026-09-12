import type { AskOrbisQuery, AskOrbisResponse } from '../../types/academy'

/**
 * Child-Safe Socratic "Ask ORBis" Tutor Assistant
 */
export async function queryAskOrbisAssistant(
  query: AskOrbisQuery
): Promise<AskOrbisResponse> {
  const qLower = query.questionText.toLowerCase()

  if (qLower.includes('fraction') || qLower.includes('half') || qLower.includes('fourth')) {
    return {
      answer: 'A fraction is simply a fair slice of a whole treasure! The bottom number tells us how many equal pieces exist, and the top number tells us how many pieces you have.',
      simplifiedAnalogy: 'Imagine slicing a round berry pie into 4 equal slices. If you eat 1 slice, you enjoyed 1/4 of the pie!',
      socraticQuestion: 'If we cut the pie into 2 equal slices instead, what fraction would 1 slice be?',
      encouragement: 'You have a wonderful eye for mathematical patterns! Keep exploring.',
    }
  }

  if (qLower.includes('balance') || qLower.includes('scale') || qLower.includes('equation')) {
    return {
      answer: 'An equation is like a playground seesaw in perfect equilibrium. Both sides must have the exact same total weight to stay level!',
      simplifiedAnalogy: 'If a puppy weighs 5 pounds on one side, you need exactly 5 pounds of dog treats on the other side to keep it balanced.',
      socraticQuestion: 'If you add 2 more pounds to the left side, what must you do to the right side to keep it balanced?',
      encouragement: 'Great mathematical curiosity! The apothecary scales are balancing because of your sharp mind.',
    }
  }

  if (qLower.includes('prefix') || qLower.includes('root') || qLower.includes('word')) {
    return {
      answer: 'Prefixes are magic keys that change a word\'s power! Placing UN- in front reverses meaning (happy → unhappy), while RE- means doing it again (read → reread).',
      simplifiedAnalogy: 'Think of the base word like a robot body, and the prefix like interchangeable power tools attached to its arm.',
      socraticQuestion: 'What does "unwrap" mean when you receive a birthday gift?',
      encouragement: 'You are becoming a true master word-forger on the Spellforge anvil!',
    }
  }

  // General Socratic fallback
  return {
    answer: 'That is a fantastic question! When we explore new concepts in ORBis Academy, breaking problems down into smaller clues always reveals the answer.',
    simplifiedAnalogy: 'Like building with toy blocks, we place one idea on top of another until our castle of understanding is complete.',
    socraticQuestion: 'What part of this problem feels familiar from things you already know?',
    encouragement: 'Keep asking questions — curiosity is the greatest superpower in the universe!',
  }
}
