import type { AcademyLesson } from '../../../types/academy'

export const ACADEMY_LESSONS_REGISTRY: Record<string, AcademyLesson> = {
  // --- MATH ---
  lesson_ten_frames: {
    id: 'lesson_ten_frames',
    skillId: 'skill_ten_frames',
    title: 'Mastering Ten-Frames & Number Sense',
    subtitle: 'See numbers as 5s, 10s, and leftover ones',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Why Ten-Frames Matter',
        content: 'A ten-frame is a 2-by-5 grid. Because it holds exactly 10 items, our eyes can recognize quantities instantly without counting one by one!',
      },
      {
        id: 'b2',
        type: 'visual_demo',
        title: 'Full Row of 5 + Extra',
        content: 'When the top row is full, that is always 5. If we add 2 more in the bottom row, 5 + 2 = 7!',
        visualData: {
          grid: [
            ['⭐', '⭐', '⭐', '⭐', '⭐'],
            ['⭐', '⭐', '⚪', '⚪', '⚪'],
          ],
          total: 7,
        },
      },
      {
        id: 'b3',
        type: 'guided_step',
        title: 'Making a Full 10',
        content: 'How many empty spots are needed to turn 7 into 10? Look at the empty circles: 3 empty spots!',
        interactivePrompt: 'What is 10 minus 7?',
        expectedAnswer: 3,
        explanation: '7 filled stars + 3 empty circles = 10 total slots.',
      },
    ],
    summaryTakeaways: [
      'Top row of a ten-frame always holds 5.',
      'A full frame equals 10.',
      'Use empty spaces to quickly find complementary pairs that add to 10.',
    ],
    rewardXP: 30,
    rewardStars: 2,
  },

  lesson_number_lines_20: {
    id: 'lesson_number_lines_20',
    skillId: 'skill_number_lines_20',
    title: 'Jumping on the Number Line',
    subtitle: 'Visualize forward addition and backward subtraction',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'The Stepping Stone Line',
        content: 'A number line places numbers in order from left to right with equal distance between each stone. Moving right increases value (+), while moving left decreases value (-).',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Frog Jumps',
        content: 'Start at stone 6 and jump 4 steps to the right.',
        interactivePrompt: 'What number do you land on? (6 + 4)',
        expectedAnswer: 10,
        explanation: 'Starting at 6 and jumping 4 steps right lands on 10.',
      },
    ],
    summaryTakeaways: [
      'Moving right on a number line adds value.',
      'Moving left on a number line subtracts value.',
    ],
    rewardXP: 30,
    rewardStars: 2,
  },

  lesson_make_ten: {
    id: 'lesson_make_ten',
    skillId: 'skill_making_ten_strategy',
    title: 'The Make-a-Ten Strategy',
    subtitle: 'Decompose numbers into friendly friendly tens',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Friendly Number Ten',
        content: 'When adding numbers like 8 + 5, we can split 5 into (2 + 3). Add 8 + 2 first to reach 10, then add the remaining 3 to get 13!',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Try It with 9 + 6',
        content: '9 needs 1 to become 10. Split 6 into 1 + 5. 9 + 1 = 10, 10 + 5 = ?',
        interactivePrompt: 'What is 9 + 6?',
        expectedAnswer: 15,
        explanation: '9 + 1 = 10, and 10 + 5 = 15.',
      },
    ],
    summaryTakeaways: [
      'Making a ten simplifies mental addition.',
      'Always split the smaller number to complete the ten first.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_balance_equations: {
    id: 'lesson_balance_equations',
    skillId: 'skill_potion_balance_equations',
    title: 'Equilibrium & Balance Equations',
    subtitle: 'The Equals Sign means Same Weight on Both Sides',
    estimatedMinutes: 6,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'The Great Balance Scale',
        content: 'Think of an equation like a physical apothecary scale. The equals sign (=) is the center fulcrum point. For the scale to stay level, the left pan and right pan MUST have identical total values.',
      },
      {
        id: 'b2',
        type: 'visual_demo',
        title: 'Missing Weight Mystery',
        content: 'If the left pan holds a 5g crystal and an unknown pouch (x), and the right pan holds a 12g golden bar, the scale balances when 5 + x = 12.',
      },
      {
        id: 'b3',
        type: 'guided_step',
        title: 'Solving for the Unknown',
        content: 'Subtract 5g from both pans! 12g - 5g = ?g.',
        interactivePrompt: 'What is the missing pouch weight?',
        expectedAnswer: 7,
        explanation: '5 + 7 = 12. Both sides balance at 12 grams.',
      },
    ],
    summaryTakeaways: [
      'Equations represent balanced equilibrium.',
      'Whatever operation you do to one side, you must do to the other.',
      'Balance scales form the foundation of algebraic reasoning.',
    ],
    rewardXP: 40,
    rewardStars: 3,
  },

  lesson_fractions_intro: {
    id: 'lesson_fractions_intro',
    skillId: 'skill_fraction_parts_whole',
    title: 'Visualizing Fractions & Equal Parts',
    subtitle: 'Numerators, denominators, and fractional portions',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Parts of a Whole',
        content: 'A fraction describes equal portions of a single whole item. The bottom denominator tells how many equal parts exist in total; the top numerator tells how many parts we are considering.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Beaker Measurement',
        content: 'If a potion beaker is divided into 4 equal segments and filled up to 3 segments, what fraction is filled?',
        interactivePrompt: 'Is it 1/4, 2/4, or 3/4?',
        expectedAnswer: '3/4',
        explanation: '3 parts out of 4 total parts = 3/4.',
      },
    ],
    summaryTakeaways: [
      'Fractions require equal-sized parts.',
      'Numerator = parts taken; Denominator = total parts in the whole.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  // --- SCIENCE ---
  lesson_producers_consumers: {
    id: 'lesson_producers_consumers',
    skillId: 'skill_producers_consumers',
    title: 'Producers, Consumers & Solar Energy',
    subtitle: 'How life captures and transfers energy',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'The Ultimate Energy Source',
        content: 'All energy on living islands originates from sunlight! Plants, algae, and trees use photosynthesis to convert photons into nutritious sugars.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Identify the Producer',
        content: 'Which organism makes its own food using sunlight?',
        interactivePrompt: 'Select: Oak Tree, Fox, or Owl?',
        expectedAnswer: 'Oak Tree',
        explanation: 'Trees and plants are producers that synthesize energy from sunlight.',
      },
    ],
    summaryTakeaways: [
      'Producers synthesize food from solar photons.',
      'Consumers rely on eating plants or other animals.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_trophic_balance: {
    id: 'lesson_trophic_balance',
    skillId: 'skill_trophic_balance',
    title: 'Predator-Prey Equilibrium & Food Webs',
    subtitle: 'Maintaining population balance in island biomes',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'The Balance of Wildlife',
        content: 'If herbivore populations grow too large, they overgraze vegetation. Apex predators help keep herbivore populations healthy and balanced.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Equilibrium Scenario',
        content: 'If deer eat all the meadow grass, what happens to the deer population?',
        interactivePrompt: 'Does the deer population increase or decrease?',
        expectedAnswer: 'decrease',
        explanation: 'Without enough food producers, herbivore populations decline until plants regenerate.',
      },
    ],
    summaryTakeaways: [
      'Predators and prey regulate each other naturally.',
      'Biodiversity creates strong, resilient ecosystems.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_gravity_inertia: {
    id: 'lesson_gravity_inertia',
    skillId: 'skill_gravity_inertia',
    title: 'Kinetic Motion, Gravity & Inertia',
    subtitle: 'Why objects accelerate down ramps and keep rolling',
    estimatedMinutes: 6,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Gravity & Acceleration',
        content: 'Gravity pulls objects downward. Potential energy stored at the top of a ramp converts into kinetic motion energy as the ball accelerates down.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Speed at the Bottom',
        content: 'Does a ball roll faster or slower as it reaches the bottom of a ramp?',
        interactivePrompt: 'Type faster or slower:',
        expectedAnswer: 'faster',
        explanation: 'Gravity continually accelerates the ball downward.',
      },
    ],
    summaryTakeaways: [
      'Potential energy converts to kinetic energy.',
      'Inertia keeps moving objects traveling forward.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_truss_structures: {
    id: 'lesson_truss_structures',
    skillId: 'skill_truss_structures',
    title: 'Tension, Compression & Triangular Trusses',
    subtitle: 'Why triangles are the strongest structural shapes',
    estimatedMinutes: 6,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Forces in Bridges',
        content: 'When heavy rovers cross a bridge, the top beams experience COMPRESSION (squashing force), while bottom cables experience TENSION (pulling force).',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'The Triangle Secret',
        content: 'Unlike squares which collapse under side stress, triangles distribute loads across all three sides equally.',
        interactivePrompt: 'Which geometric shape is the strongest for bridge trusses: Triangle or Square?',
        expectedAnswer: 'Triangle',
        explanation: 'Triangles cannot be deformed without breaking a beam.',
      },
    ],
    summaryTakeaways: [
      'Compression pushes together; tension pulls apart.',
      'Triangular trusses distribute weight evenly across joints.',
    ],
    rewardXP: 40,
    rewardStars: 3,
  },

  lesson_spectral_colors: {
    id: 'lesson_spectral_colors',
    skillId: 'skill_star_spectral_colors',
    title: 'Star Temperatures & Spectral Colors',
    subtitle: 'Why blue stars are hottest and red stars are coolest',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'The Color of Heat',
        content: 'In astronomy, blue stars burn at blazing temperatures over 25,000°K (Class O/B), while red dwarf stars burn at cooler temperatures around 3,000°K (Class M).',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Star Color Check',
        content: 'Which star has a higher surface temperature: a Blue Giant or a Red Dwarf?',
        interactivePrompt: 'Blue Giant or Red Dwarf?',
        expectedAnswer: 'Blue Giant',
        explanation: 'Blue light carries more energy and indicates higher thermal temperatures.',
      },
    ],
    summaryTakeaways: [
      'Blue stars are the hottest; Red stars are cooler.',
      'Spectral classes (O, B, A, F, G, K, M) rank stars by temperature.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  // --- ENGLISH & READING & VOCABULARY & GRAMMAR ---
  lesson_syllables: {
    id: 'lesson_syllables',
    skillId: 'skill_syllable_counting',
    title: 'Clapping Syllable Beats',
    subtitle: 'Feel the rhythm of spoken words',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'What is a Syllable?',
        content: 'A syllable is a single unbroken sound unit of a word. Every syllable contains at least one vowel sound (A, E, I, O, U).',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Clap the Word: BUT-TER-FLY',
        content: 'Say "but-ter-fly" and clap on each beat.',
        interactivePrompt: 'How many syllable claps in butterfly?',
        expectedAnswer: 3,
        explanation: 'But (1) - ter (2) - fly (3) = 3 syllables.',
      },
    ],
    summaryTakeaways: [
      'Each syllable represents one vowel sound beat.',
      'Clapping helps count syllables accurately.',
    ],
    rewardXP: 30,
    rewardStars: 2,
  },

  lesson_prefixes_un_re: {
    id: 'lesson_prefixes_un_re',
    skillId: 'skill_prefix_un_re',
    title: 'Word Forging: Prefixes UN- & RE-',
    subtitle: 'Modify base root meanings on the linguistic anvil',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'What is a Prefix?',
        content: 'A prefix attaches to the front of a base root word.\n• UN- means "not" or "opposite"\n• RE- means "again"',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Prefix Meaning',
        content: 'If you "rebuild" a tower, you build it:',
        interactivePrompt: 'again or never?',
        expectedAnswer: 'again',
        explanation: 'RE- signals repetition ("again").',
      },
    ],
    summaryTakeaways: [
      'UN- indicates negation or reversal.',
      'RE- indicates repetition.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_context_clues: {
    id: 'lesson_context_clues',
    skillId: 'skill_contextual_word_trace',
    title: 'Context Clue Vocabulary Detective',
    subtitle: 'Decipher unfamiliar story words using surrounding sentences',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Using Clues in the Text',
        content: 'When you encounter an unfamiliar word, look at the sentences right before and after it for synonyms, antonyms, and descriptive hints.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Context Deduction',
        content: 'In "The luminous lamp illuminated the dark room", what clue hints that luminous means bright?',
        interactivePrompt: 'Type illuminated or room:',
        expectedAnswer: 'illuminated',
        explanation: 'Illuminated reveals that light is being shed.',
      },
    ],
    summaryTakeaways: [
      'Surrounding sentences provide context clues.',
      'Substitute your guess to verify if the sentence still makes sense.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_inferences: {
    id: 'lesson_inferences',
    skillId: 'skill_drawing_inferences',
    title: 'Drawing Logical Inferences',
    subtitle: 'Combine text clues with your own schema',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Reading Between the Lines',
        content: 'An inference is an educated conclusion: Text Clues + What You Already Know = Inference.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Inference Practice',
        content: 'If someone carries an open umbrella with rain dripping, what is the weather?',
        interactivePrompt: 'rainy or sunny?',
        expectedAnswer: 'rainy',
        explanation: 'The umbrella and raindrops infer rainy weather.',
      },
    ],
    summaryTakeaways: [
      'Inferences are conclusions based on evidence, not wild guesses.',
      'Combine text details with real-world knowledge.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_shades_meaning: {
    id: 'lesson_shades_meaning',
    skillId: 'skill_shades_of_meaning',
    title: 'Shades of Meaning & Word Intensity',
    subtitle: 'Rank words by power and precision',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Nuance in Adjectives',
        content: 'Words have different levels of intensity: warm → hot → scorching! Choosing precise words paints vivid pictures in readers\' minds.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Strongest Word',
        content: 'Which word describes the highest heat: warm, hot, or scorching?',
        interactivePrompt: 'Type the strongest word:',
        expectedAnswer: 'scorching',
        explanation: 'Scorching indicates intense, blistering heat.',
      },
    ],
    summaryTakeaways: [
      'Synonyms have varying degrees of intensity and emotion.',
      'Precise vocabulary makes storytelling vivid.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_action_verbs: {
    id: 'lesson_action_verbs',
    skillId: 'skill_identifying_verbs',
    title: 'Action Verbs in Motion',
    subtitle: 'Words that tell what a subject does',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'The Engine of Sentences',
        content: 'An action verb expresses physical or mental movement (run, leap, invent, deduce, discover).',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Spot the Action',
        content: 'In "The fox sprinted across the meadow", which word is the action verb?',
        interactivePrompt: 'Type the verb:',
        expectedAnswer: 'sprinted',
        explanation: 'Sprinted shows the physical running motion.',
      },
    ],
    summaryTakeaways: [
      'Action verbs drive the momentum of every sentence.',
      'Verbs answer the question: What is the subject doing?',
    ],
    rewardXP: 30,
    rewardStars: 2,
  },

  // --- COMPUTER SCIENCE ---
  lesson_sequencing: {
    id: 'lesson_sequencing',
    skillId: 'skill_step_sequencing',
    title: 'Algorithmic Sequencing for Robotics',
    subtitle: 'The order of computer commands determines the result',
    estimatedMinutes: 6,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Computers Follow Orders Exactly',
        content: 'An algorithm is an ordered sequence of instructions. Changing the order changes the robot\'s destination.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Order Check',
        content: 'If you turn left BEFORE moving forward, do you end up in the same spot as moving forward first?',
        interactivePrompt: 'yes or no?',
        expectedAnswer: 'no',
        explanation: 'Order changes the path completely.',
      },
    ],
    summaryTakeaways: [
      'Algorithms execute in strict chronological sequence.',
      'Order of commands determines the final program output.',
    ],
    rewardXP: 40,
    rewardStars: 3,
  },

  lesson_loops: {
    id: 'lesson_loops',
    skillId: 'skill_loops_repetition',
    title: 'Repeat Loops & Code Efficiency',
    subtitle: 'Reduce repetitive instructions with loop tokens',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Why Use Loops?',
        content: 'Instead of writing "Forward, Forward, Forward, Forward", a programmer writes "Repeat 4 Times [Forward]". This saves memory and keeps code readable!',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Loop Count',
        content: 'How many times will "Repeat 3 [Jump]" make BEEP-0 jump?',
        interactivePrompt: 'Type the number:',
        expectedAnswer: 3,
        explanation: 'The loop executes 3 jumps.',
      },
    ],
    summaryTakeaways: [
      'Loops execute a block of commands repeatedly.',
      'Loops reduce code length and improve algorithmic efficiency.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  // --- LOGIC & CREATIVITY & GENERAL KNOWLEDGE ---
  lesson_elimination: {
    id: 'lesson_elimination',
    skillId: 'skill_suspect_elimination',
    title: 'Process of Elimination in Deduction',
    subtitle: 'Rule out impossible suspects systematically',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Elimination Logic',
        content: 'If an alibi proves a suspect was in the library during the mystery, they cannot be the culprit. Cross them off your detective suspect list!',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Alibi Check',
        content: 'If a suspect has a proven alibi in another room, are they innocent or guilty?',
        interactivePrompt: 'innocent or guilty?',
        expectedAnswer: 'innocent',
        explanation: 'A verified alibi proves the suspect could not commit the crime.',
      },
    ],
    summaryTakeaways: [
      'Cross off contradicted suspects to narrow the search.',
      'Deduction is finding the truth after eliminating the impossible.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_biome_design: {
    id: 'lesson_biome_design',
    skillId: 'skill_biome_creation',
    title: 'Creating Sanctuary Habitats',
    subtitle: 'Combine natural elements to attract wildlife',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Natural Harmony',
        content: 'Placing forest groves near freshwater rivers provides shelter and hydration, attracting rare mythical creatures to your sanctuary.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Habitat Synergy',
        content: 'What two elements create a thriving forest habitat: Trees and Water, or Lava and Ice?',
        interactivePrompt: 'Type: Trees and Water',
        expectedAnswer: 'Trees and Water',
        explanation: 'Vegetation and freshwater form the basis of living biomes.',
      },
    ],
    summaryTakeaways: [
      'Ecosystem clusters create thriving animal habitats.',
      'Water and flora synergy attracts diverse wildlife.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },

  lesson_optics_lenses: {
    id: 'lesson_optics_lenses',
    skillId: 'skill_optics_lenses',
    title: 'Light, Lenses & Telescopes',
    subtitle: 'How curved glass refracts light rays',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Refraction & Optics',
        content: 'Convex lenses bend light rays toward a focal point, magnifying distant stars in telescopes and microscopic cells under laboratory microscopes.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Lens Curvature',
        content: 'Does a magnifying glass make tiny objects appear bigger or smaller?',
        interactivePrompt: 'bigger or smaller?',
        expectedAnswer: 'bigger',
        explanation: 'Convex lenses magnify images to appear larger.',
      },
    ],
    summaryTakeaways: [
      'Convex lenses converge light rays to magnify images.',
      'Telescopes and microscopes utilize optical refraction.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },
  lesson_sun_star: {
    id: 'lesson_sun_star',
    skillId: 'skill_sun_our_star',
    title: 'The Sun: Our Closest Star',
    subtitle: 'Understanding the glowing star at the center of our solar system',
    estimatedMinutes: 5,
    blocks: [
      {
        id: 'b1',
        type: 'text',
        title: 'Our Radiant Sun',
        content: 'The Sun is a giant sphere of glowing, hot gas. It is our nearest star, providing the light and thermal energy that powers all life on Earth.',
      },
      {
        id: 'b2',
        type: 'guided_step',
        title: 'Star Definition',
        content: 'Is the Sun a planet, a moon, or a star?',
        interactivePrompt: 'planet, moon, or star?',
        expectedAnswer: 'star',
        explanation: 'The Sun is the closest star to planet Earth.',
      },
    ],
    summaryTakeaways: [
      'The Sun is a glowing star providing solar light and heat to Earth.',
      'All other stars in the night sky are distant suns across deep space.',
    ],
    rewardXP: 35,
    rewardStars: 2,
  },
}

import { getCinematicLesson } from './cinematicLessonsData'

export function getAcademyLesson(lessonId: string): AcademyLesson | undefined {
  if (ACADEMY_LESSONS_REGISTRY[lessonId]) {
    return ACADEMY_LESSONS_REGISTRY[lessonId]
  }

  const cinematic = getCinematicLesson(lessonId)
  if (cinematic) {
    return {
      id: cinematic.id,
      skillId: cinematic.skillId,
      title: cinematic.title,
      subtitle: cinematic.subtitle,
      estimatedMinutes: cinematic.estimatedMinutes,
      blocks: cinematic.scenes.map((s, idx) => ({
        id: `b${idx + 1}`,
        type: s.type === 'micro_question' ? 'guided_step' : s.type === 'visual_demonstration' ? 'visual_demo' : 'text',
        title: s.title,
        content: s.guideDialogue || s.narrationText || s.title,
        explanation: s.microQuestion?.explanation,
      })),
      summaryTakeaways:
        cinematic.learningObjectives.length >= 2
          ? cinematic.learningObjectives
          : [...cinematic.learningObjectives, 'Mastery of foundational concept.'],
      rewardXP: cinematic.rewardXP,
      rewardStars: cinematic.rewardStars,
    }
  }

  return undefined
}
