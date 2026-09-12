/**
 * ORBis Pedagogical Guide Director
 * Coordinates character personas, emotional states, reactive hints, and encouraging celebration dialogues.
 */

import type { GuideId, PedagogicalGuideProfile } from '../../types/learningUniverse'

export const PEDAGOGICAL_GUIDES: Record<GuideId, PedagogicalGuideProfile> = {
  poly: {
    id: 'poly',
    name: 'Poly',
    title: 'The Geometric Owl',
    avatar: '🦉',
    realm: 'math',
    accentColor: '#38bdf8',
    teachingStyle: 'Visual and pattern-based geometry & numbers.',
    voicePitch: 1.1,
    voiceRate: 0.95,
    catchphrase: 'Every puzzle has a beautiful pattern!',
    greetingLines: [
      'Hoo-hoo! Welcome to the Crystalline Citadel!',
      'Ready to discover some magical number patterns?',
      'Let us measure, count, and balance mass together!',
    ],
    encouragementLines: [
      'That was a brave attempt! Let us look at the pattern together.',
      'Mistakes help our minds grow sharper! Let us try with smaller steps.',
      'No worries! Poly is right here to guide your wings.',
    ],
    celebrationLines: [
      'Hoo-ray! You discovered the exact mathematical pattern!',
      'Brilliant precision! Your skill crystal shines bright!',
      'Masterful calculation! You are soaring high!',
    ],
  },
  newton: {
    id: 'newton',
    name: 'Newton',
    title: 'The Curious Otter',
    avatar: '🦦',
    realm: 'science',
    accentColor: '#10b981',
    teachingStyle: 'Empirical, playful hypothesis-testing.',
    voicePitch: 1.2,
    voiceRate: 1.0,
    catchphrase: 'Let us experiment and see what happens!',
    greetingLines: [
      'Splish-splash! Welcome to the Living Biome Lab!',
      'What mystery of nature shall we test today?',
      'Curious minds make the greatest scientists!',
    ],
    encouragementLines: [
      'In science, unexpected results are the best clues! Let us test again.',
      'Good hypothesis! Let us adjust one variable and observe.',
      'Every great scientist tries multiple experiments!',
    ],
    celebrationLines: [
      'Eureka! Your experiment proved the scientific law!',
      'Incredible observation! The ecosystem is thriving!',
      'You solved the living puzzle! Keep testing the universe!',
    ],
  },
  lexi: {
    id: 'lexi',
    name: 'Lexi',
    title: 'The Lorekeeper Fox',
    avatar: '🦊',
    realm: 'english',
    accentColor: '#f59e0b',
    teachingStyle: 'Story-driven, phonemic, and vocabulary-rich.',
    voicePitch: 1.15,
    voiceRate: 0.95,
    catchphrase: 'Words hold the magic of the universe!',
    greetingLines: [
      'Welcome, young scholar, to the Infinite Library!',
      'A new story waits to be woven with powerful words!',
      'Let us explore the ancient runic syllables today!',
    ],
    encouragementLines: [
      'Words can be tricky! Listen closely to the sounds inside it.',
      'Take your time! The quill is ready when you are.',
      'Let us break the word into gentle syllables together.',
    ],
    celebrationLines: [
      'Magnificent! You forged the exact word rune!',
      'A true lorekeeper! Your vocabulary powers are glowing!',
      'What a wonderful sentence! You are a master storyteller!',
    ],
  },
  beep_0: {
    id: 'beep_0',
    name: 'BEEP-0',
    title: 'The Explorer Bot',
    avatar: '🤖',
    realm: 'computer_science',
    accentColor: '#6366f1',
    teachingStyle: 'Algorithmic, step-by-step sequential logic.',
    voicePitch: 0.9,
    voiceRate: 1.05,
    catchphrase: 'Step-by-step algorithms solve any maze!',
    greetingLines: [
      'BEEP-BOOP! Initializing Cybernetic Logic Circuit!',
      'Algorithm systems online! Ready to program our path?',
      'Greetings, programmer! Let us sequence commands.',
    ],
    encouragementLines: [
      'Minor bug detected in command sequence! Debugging is normal.',
      'Check step sequence. Which instruction turned the wrong way?',
      'Recalibrating path vectors. Try looping the forward step!',
    ],
    celebrationLines: [
      'EXECUTION COMPLETE! 100% efficient algorithm!',
      'CIRCUIT MASTERED! Robot reached target beacon!',
      'Optimal code structure achieved! High-five, coder!',
    ],
  },
  sherlock: {
    id: 'sherlock',
    name: 'Sherlock',
    title: 'The Sleuth Hound',
    avatar: '🐶',
    realm: 'logic',
    accentColor: '#a855f7',
    teachingStyle: 'Deductive, clue-oriented investigation.',
    voicePitch: 0.95,
    voiceRate: 0.95,
    catchphrase: 'The clues always tell the true story!',
    greetingLines: [
      'Paws on the ground! Welcome to the Mystery Labyrinth!',
      'A forensic case awaits our keen magnifying lens!',
      'Look closely! Even the smallest detail is a clue.',
    ],
    encouragementLines: [
      'A false lead is just part of the case! Re-check witness clues.',
      'Look at what cannot be true, and the truth will appear.',
      'Sniffing out the truth takes patience. Let us review the notes.',
    ],
    celebrationLines: [
      'Case closed! Your deductive deduction was flawless!',
      'Magnificent deduction! You found the missing link!',
      'Sherlock bows to your detective brilliance!',
    ],
  },
  nova: {
    id: 'nova',
    name: 'Nova',
    title: 'The Star Voyager',
    avatar: '🚀',
    realm: 'astronomy',
    accentColor: '#ec4899',
    teachingStyle: 'Wonder-driven cosmic astronomy.',
    voicePitch: 1.1,
    voiceRate: 1.0,
    catchphrase: 'We are all made of stardust!',
    greetingLines: [
      'Starlit greetings from the Stellar Nebula!',
      'Ready to chart ancient celestial constellations?',
      'Telescopes focused! The cosmos is calling.',
    ],
    encouragementLines: [
      'The stars seem far, but their lines are connected! Look closely.',
      'Deep breath! Even galaxies take time to form.',
      'Try linking the brightest star first!',
    ],
    celebrationLines: [
      'Constellation illuminated! The night sky shines for you!',
      'Astronomical perfection! Stellar chart complete!',
      'You chart the stars like a true space voyager!',
    ],
  },
  davinci: {
    id: 'davinci',
    name: 'DaVinci',
    title: 'The Builder Dragon',
    avatar: '🐲',
    realm: 'creativity',
    accentColor: '#f97316',
    teachingStyle: 'Inventive structural engineering & design.',
    voicePitch: 1.05,
    voiceRate: 1.0,
    catchphrase: 'If you can dream it, you can build it!',
    greetingLines: [
      'Sparks and blueprints! Welcome to Wonder Workshop!',
      'What fantastical machine shall we invent today?',
      'Grab your tools! Imagination is our greatest material.',
    ],
    encouragementLines: [
      'Tension and compression! Add a triangle truss for strength.',
      'Every inventor had bridges collapse! Strengthen the beams.',
      'Creativity is trying what no one has tried before!',
    ],
    celebrationLines: [
      'Structural masterpiece! The bridge withstands the test!',
      'Ingenious design! Your invention is a work of art!',
      'Dragon-scale strength achieved! Superb engineering!',
    ],
  },
  atlas: {
    id: 'atlas',
    name: 'Atlas',
    title: 'The Explorer Bear',
    avatar: '🐻',
    realm: 'world_knowledge',
    accentColor: '#14b8a6',
    teachingStyle: 'Cultural, geographical, and historical discovery.',
    voicePitch: 0.95,
    voiceRate: 0.9,
    catchphrase: 'The world is a grand museum of wonders!',
    greetingLines: [
      'Pack your backpack! Welcome to the Universal Museum!',
      'Which corner of planet Earth shall we explore?',
      'History and culture are full of thrilling adventures.',
    ],
    encouragementLines: [
      'Every journey has a detour. Check the compass map again.',
      'Remember which continent this ancient wonder belongs to!',
      'Take your time exploring the artifacts.',
    ],
    celebrationLines: [
      'Expedition successful! Artifact curated into your museum!',
      'World explorer badge earned! You know your globe!',
      'Atlas salutes your geographical wisdom!',
    ],
  },
  aria: {
    id: 'aria',
    name: 'Aria',
    title: 'The Songbird',
    avatar: '🐦',
    realm: 'music',
    accentColor: '#a855f7',
    teachingStyle: 'Harmonic, rhythmic, and pitch melody.',
    voicePitch: 1.25,
    voiceRate: 1.0,
    catchphrase: 'Listen to the rhythm of your heart!',
    greetingLines: [
      'La-la-la! Welcome to the Sound Garden!',
      'Ready to create joyful beats and sparkling melodies?',
      'Let the rhythm guide your musical ears today!',
    ],
    encouragementLines: [
      'Feel the steady pulse! Tap with the beat: one, two, three, four.',
      'Music is all about harmony. Let us listen to the chord again.',
      'Sing it in your mind first, then tap the note!',
    ],
    celebrationLines: [
      'Harmonic resonance! That melody was pure magic!',
      'Rhythm master! You hit every beat right on tempo!',
      'A true musical maestro in the making!',
    ],
  },
  harmony: {
    id: 'harmony',
    name: 'Harmony',
    title: 'The Gentle Fawn',
    avatar: '🦌',
    realm: 'sel',
    accentColor: '#f43f5e',
    teachingStyle: 'Mindful, empathetic, and social-emotional guidance.',
    voicePitch: 1.1,
    voiceRate: 0.85,
    catchphrase: 'Kindness and calm make everything bloom.',
    greetingLines: [
      'Peaceful greetings in the Heart Garden.',
      'How does your heart feel today? Let us breathe gently together.',
      'Every feeling has a home here.',
    ],
    encouragementLines: [
      'Breathe in calm... breathe out frustration. You are doing great.',
      'Kindness to yourself comes first. Take all the time you need.',
      'It is okay to pause whenever you feel tired.',
    ],
    celebrationLines: [
      'Heart Garden in full bloom! Your empathy shines warmly.',
      'Wonderful kindness! You solved this with gentle patience.',
      'Harmony smiles with you! You handled this so calmly.',
    ],
  },
}

export function getGuideProfile(guideId: GuideId): PedagogicalGuideProfile {
  return PEDAGOGICAL_GUIDES[guideId] || PEDAGOGICAL_GUIDES.poly
}

export function getRandomLine(lines: string[]): string {
  if (!lines || lines.length === 0) return ''
  const index = Math.floor(Math.random() * lines.length)
  return lines[index] || ''
}

export type LearnerSignal =
  | 'idle_exploring'
  | 'hesitation_8s'
  | 'first_mistake'
  | 'repeated_mistake'
  | 'rapid_streak'
  | 'concept_revealed'
  | 'lesson_completed'
  | 'celebrating_victory'

export interface LearnerStateContext {
  signal?: LearnerSignal
  isCorrect?: boolean
  streak?: number
  hesitation?: boolean
}

/**
 * Maps live learner interactions to the 12 canonical guide actor poses.
 */
export function determineActorPose(
  input: LearnerSignal | LearnerStateContext
): import('../../types/learningUniverse').ActorPose {
  if (typeof input === 'object' && input !== null) {
    if (input.streak && input.streak >= 3) return 'celebrating'
    if (input.streak && input.streak > 1) return 'excited'
    if (input.isCorrect === true) return 'happy'
    if (input.isCorrect === false) return 'encouraging'
    if (input.hesitation) return 'curious'
    if (input.signal) return determineActorPose(input.signal)
    return 'idle'
  }

  switch (input) {
    case 'hesitation_8s':
      return 'curious'
    case 'first_mistake':
      return 'encouraging'
    case 'repeated_mistake':
      return 'concerned'
    case 'rapid_streak':
      return 'excited'
    case 'concept_revealed':
      return 'teaching'
    case 'lesson_completed':
    case 'celebrating_victory':
      return 'celebrating'
    case 'idle_exploring':
    default:
      return 'idle'
  }
}
