import type { PracticeSet } from '../../../types/academy'

export const ACADEMY_PRACTICE_REGISTRY: Record<string, PracticeSet> = {
  practice_ten_frames: {
    id: 'practice_ten_frames',
    skillId: 'skill_ten_frames',
    title: 'Ten-Frame Quick Vision Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_tf_1',
        type: 'multiple_choice',
        prompt: 'Look at the ten-frame below. How many stars are filled in?',
        visualAsset: {
          type: 'diagram',
          content: 'Row 1: [⭐ ⭐ ⭐ ⭐ ⭐] | Row 2: [⭐ ⭐ ⚪ ⚪ ⚪]',
        },
        options: [
          { id: 'opt_a', text: '6 Stars' },
          { id: 'opt_b', text: '7 Stars', isCorrect: true },
          { id: 'opt_c', text: '8 Stars' },
          { id: 'opt_d', text: '5 Stars' },
        ],
        correctOptionIds: ['opt_b'],
        hints: {
          tier1Concept: 'Remember: a full top row always holds 5 items.',
          tier2Specific: 'Count the top row (5) plus the 2 extra stars in the bottom row.',
          tier3Partial: 'Calculate 5 + 2.',
          tier4WorkedMethod: '5 in top row + 2 in bottom row = 7 stars total.',
        },
        explanation: 'Top row has 5 stars, bottom row has 2 stars. 5 + 2 = 7.',
        difficulty: 'easy',
      },
    ],
  },

  practice_number_lines_20: {
    id: 'practice_number_lines_20',
    skillId: 'skill_number_lines_20',
    title: 'Number Line Navigation Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_nl_1',
        type: 'number_input',
        prompt: 'Start at number 7 on the line and jump 5 steps to the right. Where do you land?',
        correctNumber: 12,
        tolerance: 0,
        hints: {
          tier1Concept: 'Jumping to the right means addition.',
          tier2Specific: 'Calculate 7 + 5.',
          tier3Partial: '7 + 3 gets you to 10, then add 2 more.',
          tier4WorkedMethod: '7 + 5 = 12.',
        },
        explanation: '7 + 5 = 12 on the number line.',
        difficulty: 'easy',
      },
    ],
  },

  practice_make_ten: {
    id: 'practice_make_ten',
    skillId: 'skill_making_ten_strategy',
    title: 'Make-a-Ten Mental Math Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_mt_1',
        type: 'number_input',
        prompt: 'Use the make-ten strategy to solve: 8 + 6 = ?',
        correctNumber: 14,
        tolerance: 0,
        hints: {
          tier1Concept: 'Split 6 to make 10 with 8 first.',
          tier2Specific: '8 + 2 = 10. Then add the remaining 4.',
          tier3Partial: '10 + 4 = ?',
          tier4WorkedMethod: '8 + 2 = 10, and 10 + 4 = 14.',
        },
        explanation: '8 + 6 = 14.',
        difficulty: 'easy',
      },
    ],
  },

  practice_balance_equations: {
    id: 'practice_balance_equations',
    skillId: 'skill_potion_balance_equations',
    title: 'Apothecary Scale Equation Practice',
    targetPassScore: 75,
    rewardXP: 60,
    rewardStars: 4,
    questions: [
      {
        id: 'q_bal_1',
        type: 'number_input',
        prompt: 'The balance scale is level! Left Pan: [6g crystal + ?g pouch]. Right Pan: [14g golden ingot]. What is the weight of the unknown pouch?',
        correctNumber: 8,
        tolerance: 0,
        hints: {
          tier1Concept: 'When balanced, Left Total = Right Total.',
          tier2Specific: 'Write the equation: 6 + ? = 14.',
          tier3Partial: 'Subtract 6 from 14 to isolate the missing pouch.',
          tier4WorkedMethod: '14 - 6 = 8. The pouch weighs 8g.',
        },
        explanation: '6 + 8 = 14 grams on both pans.',
        difficulty: 'medium',
      },
    ],
  },

  practice_fractions_intro: {
    id: 'practice_fractions_intro',
    skillId: 'skill_fraction_parts_whole',
    title: 'Visual Fraction Parts Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_frac_1',
        type: 'multiple_choice',
        prompt: 'A magic pie is divided into 4 equal slices. If 3 slices are eaten, what fraction represents the eaten portion?',
        options: [
          { id: 'opt_1', text: '1/4' },
          { id: 'opt_2', text: '2/4' },
          { id: 'opt_3', text: '3/4', isCorrect: true },
          { id: 'opt_4', text: '4/4' },
        ],
        correctOptionIds: ['opt_3'],
        hints: {
          tier1Concept: 'Top number is parts taken; bottom is total parts.',
          tier2Specific: '3 slices taken out of 4 total slices.',
          tier3Partial: '3 over 4.',
          tier4WorkedMethod: '3 slices out of 4 is written as 3/4.',
        },
        explanation: '3 parts of 4 total equal parts is 3/4.',
        difficulty: 'easy',
      },
    ],
  },

  // --- SCIENCE ---
  practice_producers_consumers: {
    id: 'practice_producers_consumers',
    skillId: 'skill_producers_consumers',
    title: 'Trophic Ecology Classification Practice',
    targetPassScore: 75,
    rewardXP: 55,
    rewardStars: 3,
    questions: [
      {
        id: 'q_ec_1',
        type: 'categorization',
        prompt: 'Sort organisms into Producers or Consumers:',
        categories: [
          { name: 'Producers', items: ['Oak Tree', 'River Moss'] },
          { name: 'Consumers', items: ['Deer', 'Owl'] },
        ],
        hints: {
          tier1Concept: 'Producers are plants that perform photosynthesis.',
          tier2Specific: 'Animals that eat plants or other animals are consumers.',
          tier3Partial: 'Oak Tree and Moss are plants; Deer and Owl are animals.',
          tier4WorkedMethod: 'Producers: Oak Tree, River Moss. Consumers: Deer, Owl.',
        },
        explanation: 'Plants produce food from sunlight; animals consume other living things.',
        difficulty: 'medium',
      },
    ],
  },

  practice_trophic_balance: {
    id: 'practice_trophic_balance',
    skillId: 'skill_trophic_balance',
    title: 'Predator-Prey Balance Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_tb_1',
        type: 'multiple_choice',
        prompt: 'Why are predators important in a healthy island ecosystem?',
        options: [
          { id: 'opt_a', text: 'They prevent herbivores from overgrazing plants', isCorrect: true },
          { id: 'opt_b', text: 'They eat all the plant seeds' },
          { id: 'opt_c', text: 'They warm the soil temperature' },
        ],
        correctOptionIds: ['opt_a'],
        hints: {
          tier1Concept: 'Consider what happens to plants if too many herbivores exist.',
          tier2Specific: 'Predators keep herbivore numbers in check so vegetation thrives.',
          tier3Partial: 'Balancing animal populations protects the vegetation base.',
          tier4WorkedMethod: 'Predators prevent herbivores from consuming all producer plants.',
        },
        explanation: 'Predators keep herbivore populations balanced so habitats do not get depleted.',
        difficulty: 'easy',
      },
    ],
  },

  practice_gravity_inertia: {
    id: 'practice_gravity_inertia',
    skillId: 'skill_gravity_inertia',
    title: 'Kinetic Physics Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_gi_1',
        type: 'multiple_choice',
        prompt: 'As a marble rolls down a steep ramp, its potential energy converts into:',
        options: [
          { id: 'opt_kin', text: 'Kinetic (Motion) Energy', isCorrect: true },
          { id: 'opt_chem', text: 'Chemical Energy' },
          { id: 'opt_mag', text: 'Magnetic Power' },
        ],
        correctOptionIds: ['opt_kin'],
        hints: {
          tier1Concept: 'Motion energy has a specific scientific name.',
          tier2Specific: 'Think of movement: kinetic means of or relating to motion.',
          tier3Partial: 'Stored height energy becomes motion energy.',
          tier4WorkedMethod: 'Potential energy transforms into kinetic motion energy.',
        },
        explanation: 'Energy of motion is kinetic energy.',
        difficulty: 'easy',
      },
    ],
  },

  practice_truss_structures: {
    id: 'practice_truss_structures',
    skillId: 'skill_truss_structures',
    title: 'Bridge Truss Engineering Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_truss_1',
        type: 'multiple_choice',
        prompt: 'Which geometrical polygon is most rigid and resistant to structural deformation?',
        options: [
          { id: 'opt_tri', text: 'Triangle', isCorrect: true },
          { id: 'opt_sq', text: 'Square' },
          { id: 'opt_pent', text: 'Pentagon' },
        ],
        correctOptionIds: ['opt_tri'],
        hints: {
          tier1Concept: 'Three-sided polygons distribute loads across all joints.',
          tier2Specific: 'Look at real-life bridge scaffolding: what 3-sided shape is repeated?',
          tier3Partial: 'Triangles cannot bend without changing side lengths.',
          tier4WorkedMethod: 'Triangles are the strongest structural shape.',
        },
        explanation: 'Triangles distribute structural tension and compression forces evenly.',
        difficulty: 'easy',
      },
    ],
  },

  practice_spectral_colors: {
    id: 'practice_spectral_colors',
    skillId: 'skill_star_spectral_colors',
    title: 'Stellar Temperature Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_spec_1',
        type: 'multiple_choice',
        prompt: 'Which spectral star color indicates the hottest surface temperature in astronomy?',
        options: [
          { id: 'opt_blue', text: 'Blue', isCorrect: true },
          { id: 'opt_yellow', text: 'Yellow' },
          { id: 'opt_red', text: 'Red' },
        ],
        correctOptionIds: ['opt_blue'],
        hints: {
          tier1Concept: 'Higher frequency light carries higher thermal energy.',
          tier2Specific: 'Think of the hottest part of a flame or Class O stars.',
          tier3Partial: 'Blue light carries more energy than yellow or red light.',
          tier4WorkedMethod: 'Blue stars burn at the highest temperatures (over 25,000°K).',
        },
        explanation: 'Blue stars are the hottest; red stars are the coolest.',
        difficulty: 'easy',
      },
    ],
  },

  // --- ENGLISH & READING & VOCABULARY & GRAMMAR ---
  practice_syllables: {
    id: 'practice_syllables',
    skillId: 'skill_syllable_counting',
    title: 'Syllable Beat Counting Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_syl_1',
        type: 'number_input',
        prompt: 'Clap the syllable beats in the word "ASTRONAUT". How many syllables?',
        correctNumber: 3,
        tolerance: 0,
        hints: {
          tier1Concept: 'Count the distinct vowel sound beats.',
          tier2Specific: 'As - tro - naut.',
          tier3Partial: 'As (1), tro (2), naut (3).',
          tier4WorkedMethod: 'Astronaut has 3 syllables.',
        },
        explanation: 'As-tro-naut has 3 vowel sound beats.',
        difficulty: 'easy',
      },
    ],
  },

  practice_prefixes_un_re: {
    id: 'practice_prefixes_un_re',
    skillId: 'skill_prefix_un_re',
    title: 'Prefix Word Forging Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_pre_1',
        type: 'word_builder',
        prompt: 'Forge the word meaning "to build again" using RE + BUILD:',
        options: [
          { id: 'p_re', text: 'RE-', isCorrect: true },
          { id: 'p_un', text: 'UN-' },
        ],
        correctText: 'REBUILD',
        hints: {
          tier1Concept: 'Which prefix expresses doing an action again?',
          tier2Specific: 'RE- means again.',
          tier3Partial: 'Combine RE + BUILD.',
          tier4WorkedMethod: 'RE + BUILD = REBUILD.',
        },
        explanation: 'RE- means again. Rebuild means build again.',
        difficulty: 'easy',
      },
    ],
  },

  practice_context_clues: {
    id: 'practice_context_clues',
    skillId: 'skill_contextual_word_trace',
    title: 'Story Context Clue Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_cc_1',
        type: 'multiple_choice',
        prompt: '"The luminous crystals illuminated the dark cavern with bright glowing rays." What does LUMINOUS mean?',
        options: [
          { id: 'opt_glow', text: 'Shining and glowing with light', isCorrect: true },
          { id: 'opt_heavy', text: 'Extremely heavy and dense' },
          { id: 'opt_cold', text: 'Freezing and icy' },
        ],
        correctOptionIds: ['opt_glow'],
        hints: {
          tier1Concept: 'Look at the clue words in the sentence ("illuminated", "bright glowing rays").',
          tier2Specific: 'Things that illuminate dark caverns produce light.',
          tier3Partial: 'Luminous relates to emitting light.',
          tier4WorkedMethod: 'Luminous means bright and glowing with light.',
        },
        explanation: 'Context clues like "illuminated" and "glowing rays" indicate light.',
        difficulty: 'easy',
      },
    ],
  },

  practice_inferences: {
    id: 'practice_inferences',
    skillId: 'skill_drawing_inferences',
    title: 'Deductive Inferences Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_inf_1',
        type: 'multiple_choice',
        prompt: '"Maya put on her thick wool coat, wrapped a scarf around her neck, and grabbed her snow boots." What can you infer about the weather outside?',
        options: [
          { id: 'opt_cold', text: 'It is very cold and likely snowing', isCorrect: true },
          { id: 'opt_hot', text: 'It is a sunny summer beach day' },
          { id: 'opt_rain', text: 'It is a warm tropical thunderstorm' },
        ],
        correctOptionIds: ['opt_cold'],
        hints: {
          tier1Concept: 'Connect the clothing items to a season and climate.',
          tier2Specific: 'Wool coats, scarves, and snow boots are worn in cold temperatures.',
          tier3Partial: 'Snow boots and scarves protect against winter frost.',
          tier4WorkedMethod: 'The gear indicates freezing winter weather.',
        },
        explanation: 'Wool coats and snow boots infer freezing winter weather.',
        difficulty: 'easy',
      },
    ],
  },

  practice_shades_meaning: {
    id: 'practice_shades_meaning',
    skillId: 'skill_shades_of_meaning',
    title: 'Word Intensity Ranking Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_shades_1',
        type: 'ordering',
        prompt: 'Arrange these temperature adjectives from coolest to hottest intensity:',
        orderedSequence: ['Warm', 'Hot', 'Scorching'],
        hints: {
          tier1Concept: 'Rank by increasing heat intensity.',
          tier2Specific: 'Warm is pleasant heat, hot is strong heat, scorching is extreme heat.',
          tier3Partial: 'Start with Warm, then Hot, then Scorching.',
          tier4WorkedMethod: 'Order: Warm → Hot → Scorching.',
        },
        explanation: 'Warm is mild heat, Hot is strong, and Scorching is blazing extreme heat.',
        difficulty: 'easy',
      },
    ],
  },

  practice_action_verbs: {
    id: 'practice_action_verbs',
    skillId: 'skill_identifying_verbs',
    title: 'Spotting Action Verbs Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_verb_1',
        type: 'multiple_choice',
        prompt: 'In the sentence "The nimble rabbit leaped over the stone wall", which word is the action verb?',
        options: [
          { id: 'opt_rabbit', text: 'rabbit' },
          { id: 'opt_leaped', text: 'leaped', isCorrect: true },
          { id: 'opt_stone', text: 'stone' },
          { id: 'opt_wall', text: 'wall' },
        ],
        correctOptionIds: ['opt_leaped'],
        hints: {
          tier1Concept: 'An action verb tells what action the subject performed.',
          tier2Specific: 'What physical movement did the rabbit do?',
          tier3Partial: 'The rabbit moved by jumping: the past tense action is "leaped".',
          tier4WorkedMethod: 'Leaped is the action verb.',
        },
        explanation: '"Leaped" tells the physical action performed by the rabbit.',
        difficulty: 'easy',
      },
    ],
  },

  // --- COMPUTER SCIENCE ---
  practice_sequencing: {
    id: 'practice_sequencing',
    skillId: 'skill_step_sequencing',
    title: 'Robot Directional Algorithm Practice',
    targetPassScore: 75,
    rewardXP: 60,
    rewardStars: 4,
    questions: [
      {
        id: 'q_seq_1',
        type: 'ordering',
        prompt: 'Arrange instructions for BEEP-0 in the correct execution order:',
        orderedSequence: [
          'Step Forward (Tile 1)',
          'Step Forward (Tile 2)',
          'Turn Right (90°)',
          'Step Forward to Crystal',
        ],
        hints: {
          tier1Concept: 'Follow the chronological path from start to crystal.',
          tier2Specific: 'First take forward steps, then make the turn, then step onto target.',
          tier3Partial: 'Start with Tile 1, then Tile 2, then Turn Right.',
          tier4WorkedMethod: 'Order: Step Forward 1 → Step Forward 2 → Turn Right → Step to Crystal.',
        },
        explanation: 'Algorithms execute strictly from first instruction to last in chronological order.',
        difficulty: 'medium',
      },
    ],
  },

  practice_loops: {
    id: 'practice_loops',
    skillId: 'skill_loops_repetition',
    title: 'Repeat Loop Optimization Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_loop_1',
        type: 'multiple_choice',
        prompt: 'To move BEEP-0 5 tiles ahead, which code block is most concise and efficient?',
        options: [
          { id: 'opt_loop', text: 'Repeat 5 Times [Step Forward]', isCorrect: true },
          { id: 'opt_5steps', text: 'Step Forward, Step Forward, Step Forward, Step Forward, Step Forward' },
        ],
        correctOptionIds: ['opt_loop'],
        hints: {
          tier1Concept: 'Loops replace repetitive identical commands.',
          tier2Specific: 'Repeat loops reduce code length.',
          tier3Partial: 'Repeat 5 Times [Forward] accomplishes the same task in 1 command token.',
          tier4WorkedMethod: 'Repeat 5 Times [Step Forward] is the optimized loop form.',
        },
        explanation: 'Repeat loops express repetitive commands compactly.',
        difficulty: 'easy',
      },
    ],
  },

  // --- LOGIC & CREATIVITY & GENERAL KNOWLEDGE ---
  practice_elimination: {
    id: 'practice_elimination',
    skillId: 'skill_suspect_elimination',
    title: 'Deductive Elimination Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_elim_1',
        type: 'multiple_choice',
        prompt: 'Evidence shows yellow footprints at the scene. Suspect Barnaby only wears red boots, while Suspect Felix wears yellow sneakers. What should you do with Barnaby?',
        options: [
          { id: 'opt_cross', text: 'Eliminate Barnaby as a suspect', isCorrect: true },
          { id: 'opt_accuse', text: 'Accuse Barnaby immediately' },
        ],
        correctOptionIds: ['opt_cross'],
        hints: {
          tier1Concept: 'When evidence contradicts a suspect, they can be ruled out.',
          tier2Specific: 'Barnaby does not have yellow footwear, so he could not make yellow footprints.',
          tier3Partial: 'Contradicted suspects are eliminated from the suspect pool.',
          tier4WorkedMethod: 'Eliminate Barnaby because his footwear contradicts the physical evidence.',
        },
        explanation: 'Process of elimination removes suspects who contradict physical evidence.',
        difficulty: 'easy',
      },
    ],
  },

  practice_biome_design: {
    id: 'practice_biome_design',
    skillId: 'skill_biome_creation',
    title: 'Sanctuary Biome Design Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_biome_1',
        type: 'multiple_choice',
        prompt: 'To attract woodland creatures like deer and foxes, which habitat tiles should you cluster together?',
        options: [
          { id: 'opt_fw', text: 'Forest Trees + Fresh Water River', isCorrect: true },
          { id: 'opt_lava', text: 'Lava Rock + Desert Sand' },
        ],
        correctOptionIds: ['opt_fw'],
        hints: {
          tier1Concept: 'Living creatures require food shelter and hydration.',
          tier2Specific: 'Trees provide forage and shelter; rivers provide fresh water.',
          tier3Partial: 'Forest and water form a balanced woodland habitat.',
          tier4WorkedMethod: 'Forest Trees + River tiles provide habitat and water.',
        },
        explanation: 'Forest canopy combined with water creates an ideal woodland sanctuary.',
        difficulty: 'easy',
      },
    ],
  },

  practice_optics_lenses: {
    id: 'practice_optics_lenses',
    skillId: 'skill_optics_lenses',
    title: 'Lenses & Optics Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_optics_1',
        type: 'multiple_choice',
        prompt: 'What happens to light rays when they pass through a convex magnifying lens?',
        options: [
          { id: 'opt_focal', text: 'They bend inwards toward a focal point', isCorrect: true },
          { id: 'opt_dark', text: 'They turn into complete darkness' },
          { id: 'opt_bounce', text: 'They always bounce straight backwards' },
        ],
        correctOptionIds: ['opt_focal'],
        hints: {
          tier1Concept: 'Convex lenses converge light rays.',
          tier2Specific: 'Refraction bends light rays inwards to focus and magnify an image.',
          tier3Partial: 'Bending light inwards brings images into sharp magnified focus.',
          tier4WorkedMethod: 'Light rays refract and converge toward a focal point.',
        },
        explanation: 'Convex lenses bend (refract) light rays inwards toward a focal point.',
        difficulty: 'easy',
      },
    ],
  },

  practice_sun_star: {
    id: 'practice_sun_star',
    skillId: 'skill_sun_our_star',
    title: 'The Sun: Our Star Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_sun_1',
        type: 'multiple_choice',
        prompt: 'Why does the Sun look larger and brighter than other stars in the night sky?',
        options: [
          { id: 'opt_close', text: 'Because it is much closer to Earth than other stars', isCorrect: true },
          { id: 'opt_only', text: 'Because it is the only star in the universe' },
          { id: 'opt_fire', text: 'Because it is made of fire wood' },
        ],
        correctOptionIds: ['opt_close'],
        hints: {
          tier1Concept: 'The Sun is a star, just like the stars at night.',
          tier2Specific: 'Think about how distance makes distant headlights look smaller than a nearby flashlight.',
          tier3Partial: 'The Sun is in the center of our solar system, much closer than distant galaxy stars.',
          tier4WorkedMethod: 'The Sun is our closest star (approx 93 million miles), so it appears far larger and brighter.',
        },
        explanation: 'The Sun appears much larger and brighter because Earth is right beside it compared to light-years distant stars.',
        difficulty: 'easy',
      },
    ],
  },

  practice_arrays_multiplication_intro: {
    id: 'practice_arrays_multiplication_intro',
    skillId: 'skill_arrays_multiplication_intro',
    title: 'Star Arrays & Repeated Addition Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_arr_1',
        type: 'multiple_choice',
        prompt: 'Look at an array with 3 equal rows and 4 stars in each row. Which multiplication equation gives the total number of stars?',
        options: [
          { id: 'opt_add', text: '3 + 4 = 7 stars' },
          { id: 'opt_mult', text: '3 × 4 = 12 stars', isCorrect: true },
          { id: 'opt_sub', text: '12 - 4 = 8 stars' },
        ],
        correctOptionIds: ['opt_mult'],
        hints: {
          tier1Concept: 'An array organizes equal groups in rows and columns.',
          tier2Specific: 'There are 3 rows, with 4 stars in each row: 4 + 4 + 4.',
          tier3Partial: 'Repeated addition of 3 groups of 4 is written as 3 × 4.',
          tier4WorkedMethod: '3 rows × 4 stars per row = 12 stars total.',
        },
        explanation: '3 rows of 4 items equals 3 × 4 = 12 total items!',
        difficulty: 'easy',
      },
    ],
  },

  practice_place_value_tens_ones: {
    id: 'practice_place_value_tens_ones',
    skillId: 'skill_place_value_tens_ones',
    title: 'Place Value: Tens and Ones Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_pv_1',
        type: 'multiple_choice',
        prompt: 'If you have 5 bundles of 10 star crystals and 4 single crystals, what number do they make?',
        options: [
          { id: 'opt_54', text: '54 (5 tens + 4 ones)', isCorrect: true },
          { id: 'opt_45', text: '45 (4 tens + 5 ones)' },
          { id: 'opt_9', text: '9 (5 + 4)' },
        ],
        correctOptionIds: ['opt_54'],
        hints: {
          tier1Concept: 'Each bundle of ten equals 10.',
          tier2Specific: '5 bundles of 10 is 50. Then add the 4 single ones.',
          tier3Partial: '50 + 4 = 54.',
          tier4WorkedMethod: '5 tens (50) + 4 ones (4) = 54.',
        },
        explanation: '5 tens equals 50, plus 4 single ones equals 54!',
        difficulty: 'easy',
      },
    ],
  },

  practice_habitat_food_chains: {
    id: 'practice_habitat_food_chains',
    skillId: 'skill_habitat_food_chains',
    title: 'Habitat Food Chains Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_fc_1',
        type: 'multiple_choice',
        prompt: 'Which shows the correct order of energy flow in a meadow food chain?',
        options: [
          { id: 'opt_cor', text: 'Sun ➔ Clover (Plant) ➔ Rabbit ➔ Fox', isCorrect: true },
          { id: 'opt_w1', text: 'Fox ➔ Clover ➔ Sun ➔ Rabbit' },
          { id: 'opt_w2', text: 'Rabbit ➔ Fox ➔ Sun ➔ Clover' },
        ],
        correctOptionIds: ['opt_cor'],
        hints: {
          tier1Concept: 'All food chain energy starts from the Sun.',
          tier2Specific: 'Plants use sunlight to grow, then herbivores eat the plants.',
          tier3Partial: 'Predators eat herbivores.',
          tier4WorkedMethod: 'Sun gives energy to Clover, Rabbit eats Clover, Fox eats Rabbit.',
        },
        explanation: 'Energy flows from the Sun to producers (clover), then to primary consumers (rabbit), and then to predators (fox).',
        difficulty: 'easy',
      },
    ],
  },

  practice_compound_words: {
    id: 'practice_compound_words',
    skillId: 'skill_compound_words',
    title: 'Compound Word Chemistry Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_cw_1',
        type: 'multiple_choice',
        prompt: 'Which two words combine to form the compound word "SUNFLOWER"?',
        options: [
          { id: 'opt_sun_flower', text: 'SUN + FLOWER', isCorrect: true },
          { id: 'opt_star_light', text: 'STAR + LIGHT' },
          { id: 'opt_rain_bow', text: 'RAIN + BOW' },
        ],
        correctOptionIds: ['opt_sun_flower'],
        hints: {
          tier1Concept: 'A compound word combines two complete smaller words.',
          tier2Specific: 'Look at the syllables in SUNFLOWER.',
          tier3Partial: 'The first word is SUN, the second is FLOWER.',
          tier4WorkedMethod: 'SUN + FLOWER = SUNFLOWER.',
        },
        explanation: 'Combining the independent words "SUN" and "FLOWER" makes "SUNFLOWER"!',
        difficulty: 'easy',
      },
    ],
  },

  practice_musical_dynamics: {
    id: 'practice_musical_dynamics',
    skillId: 'skill_musical_dynamics',
    title: 'Piano & Forte Dynamics Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_md_1',
        type: 'multiple_choice',
        prompt: 'In music, what does the dynamic term "FORTE" (f) mean?',
        options: [
          { id: 'opt_loud', text: 'Loud and strong', isCorrect: true },
          { id: 'opt_soft', text: 'Soft like a whisper' },
          { id: 'opt_fast', text: 'Super fast tempo' },
        ],
        correctOptionIds: ['opt_loud'],
        hints: {
          tier1Concept: 'Dynamics tell musicians how loudly or softly to play.',
          tier2Specific: 'Piano (p) means soft, and Forte (f) is the opposite.',
          tier3Partial: 'Forte represents strong, booming sound.',
          tier4WorkedMethod: 'Forte means loud and strong!',
        },
        explanation: 'Forte (f) means loud and energetic, while piano (p) means soft.',
        difficulty: 'easy',
      },
    ],
  },

  practice_multiplication_arrays_g3: {
    id: 'practice_multiplication_arrays_g3',
    skillId: 'skill_multiplication_arrays_g3',
    title: 'Multi-Row Multiplication Arrays Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_mag3_1',
        type: 'multiple_choice',
        prompt: 'An array has 4 rows with 5 crystals in each row. How many total crystals are there?',
        options: [
          { id: 'opt_20', text: '4 × 5 = 20 crystals', isCorrect: true },
          { id: 'opt_9', text: '4 + 5 = 9 crystals' },
          { id: 'opt_24', text: '4 × 6 = 24 crystals' },
        ],
        correctOptionIds: ['opt_20'],
        hints: {
          tier1Concept: 'Total items = number of rows × items per row.',
          tier2Specific: 'Add 5 four times: 5 + 5 + 5 + 5.',
          tier3Partial: '4 groups of 5 equals 20.',
          tier4WorkedMethod: '4 × 5 = 20.',
        },
        explanation: '4 rows of 5 crystals equals 4 × 5 = 20 crystals total!',
        difficulty: 'easy',
      },
    ],
  },

  practice_fraction_halves_fourths: {
    id: 'practice_fraction_halves_fourths',
    skillId: 'skill_fraction_halves_fourths',
    title: 'Fraction Halves, Thirds & Fourths Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_fhf_1',
        type: 'multiple_choice',
        prompt: 'If a potion beaker is divided into 4 equal parts and 3 parts are filled, what fraction is filled?',
        options: [
          { id: 'opt_34', text: '3/4 (Three-Fourths)', isCorrect: true },
          { id: 'opt_14', text: '1/4 (One-Fourth)' },
          { id: 'opt_43', text: '4/3' },
        ],
        correctOptionIds: ['opt_34'],
        hints: {
          tier1Concept: 'Numerator is filled parts, denominator is total equal parts.',
          tier2Specific: 'There are 4 total parts (bottom number) and 3 active parts (top number).',
          tier3Partial: '3 out of 4 is written as 3/4.',
          tier4WorkedMethod: '3 filled parts / 4 total parts = 3/4.',
        },
        explanation: '3 parts filled out of 4 equal parts is the fraction 3/4 (three-fourths)!',
        difficulty: 'easy',
      },
    ],
  },

  practice_force_magnets: {
    id: 'practice_force_magnets',
    skillId: 'skill_force_magnets',
    title: 'Magnetic Forces Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_fm_1',
        type: 'multiple_choice',
        prompt: 'What happens when two North (N) poles of two magnets are pushed toward each other?',
        options: [
          { id: 'opt_repel', text: 'They repel and push each other away', isCorrect: true },
          { id: 'opt_attract', text: 'They stick together with magnetic attraction' },
          { id: 'opt_melt', text: 'They melt into liquid iron' },
        ],
        correctOptionIds: ['opt_repel'],
        hints: {
          tier1Concept: 'Magnets have two poles: North (N) and South (S).',
          tier2Specific: 'Opposite poles attract (N + S), and like poles repel.',
          tier3Partial: 'North and North are like poles.',
          tier4WorkedMethod: 'Like poles (N and N) push away (repel).',
        },
        explanation: 'Like magnetic poles (North and North) repel and push apart, while opposite poles attract!',
        difficulty: 'easy',
      },
    ],
  },

  practice_story_main_idea: {
    id: 'practice_story_main_idea',
    skillId: 'skill_story_main_idea',
    title: 'Story Main Idea Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_smi_1',
        type: 'multiple_choice',
        prompt: 'A paragraph describes how honeybees collect nectar, pollinate flowers, and build honeycombs. What is the main idea?',
        options: [
          { id: 'opt_bees', text: 'Honeybees have important jobs in the garden', isCorrect: true },
          { id: 'opt_yellow', text: 'All flowers are bright yellow' },
          { id: 'opt_sting', text: 'Bees only sting predators' },
        ],
        correctOptionIds: ['opt_bees'],
        hints: {
          tier1Concept: 'The main idea is the big overall point that connects all sentences.',
          tier2Specific: 'All the details describe the different roles honeybees perform.',
          tier3Partial: 'The paragraph is about how honeybees work in nature.',
          tier4WorkedMethod: 'Select "Honeybees have important jobs in the garden".',
        },
        explanation: 'The main idea sums up the whole passage: honeybees perform essential work in the ecosystem!',
        difficulty: 'easy',
      },
    ],
  },

  practice_debugging_commands: {
    id: 'practice_debugging_commands',
    skillId: 'skill_debugging_commands',
    title: 'Robot Debugging Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_dbg_1',
        type: 'multiple_choice',
        prompt: 'BEEP-0 needed to turn RIGHT but has a "TURN LEFT" command that causes a crash. How do you fix the bug?',
        options: [
          { id: 'opt_rep', text: 'Replace "TURN LEFT" with "TURN RIGHT"', isCorrect: true },
          { id: 'opt_del', text: 'Delete all commands in the program' },
          { id: 'opt_ignore', text: 'Run the program faster' },
        ],
        correctOptionIds: ['opt_rep'],
        hints: {
          tier1Concept: 'Debugging means finding and replacing the incorrect instruction.',
          tier2Specific: 'The erroneous step is TURN LEFT.',
          tier3Partial: 'Replacing the wrong direction with the correct one fixes the bug.',
          tier4WorkedMethod: 'Replace TURN LEFT with TURN RIGHT.',
        },
        explanation: 'Debugging resolves errors by replacing the incorrect turn with the intended direction!',
        difficulty: 'easy',
      },
    ],
  },

  practice_balance_equations_intro: {
    id: 'practice_balance_equations_intro',
    skillId: 'skill_balance_equations_intro',
    title: 'Balancing Equations Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_bal_1',
        type: 'multiple_choice',
        prompt: 'On a balanced potion scale, the left pan has [x + 7] and the right pan has [15]. What is the value of x?',
        options: [
          { id: 'opt_8', text: 'x = 8 (because 8 + 7 = 15)', isCorrect: true },
          { id: 'opt_22', text: 'x = 22' },
          { id: 'opt_7', text: 'x = 7' },
        ],
        correctOptionIds: ['opt_8'],
        hints: {
          tier1Concept: 'Both sides of the balance scale must equal 15.',
          tier2Specific: 'Subtract 7 from 15 to find the unknown x.',
          tier3Partial: '15 - 7 = 8.',
          tier4WorkedMethod: 'x = 15 - 7 = 8.',
        },
        explanation: 'To balance the equation x + 7 = 15, subtract 7 from both sides: x = 8!',
        difficulty: 'easy',
      },
    ],
  },

  practice_energy_transfer: {
    id: 'practice_energy_transfer',
    skillId: 'skill_energy_transfer',
    title: 'Energy Transfer Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_et_1',
        type: 'multiple_choice',
        prompt: 'When a roller cart sits at the very top of a steep hill, what type of energy does it have stored?',
        options: [
          { id: 'opt_pot', text: 'Potential (Gravitational Stored) Energy', isCorrect: true },
          { id: 'opt_kin', text: 'Kinetic Motion Energy' },
          { id: 'opt_sound', text: 'Sound Energy' },
        ],
        correctOptionIds: ['opt_pot'],
        hints: {
          tier1Concept: 'Stored energy due to height is called potential energy.',
          tier2Specific: 'Moving objects have kinetic energy, while stationary objects high up have potential energy.',
          tier3Partial: 'At the crest of the hill before moving, energy is stored.',
          tier4WorkedMethod: 'Objects at high elevations store potential energy.',
        },
        explanation: 'At the top of a hill, stored energy is Potential Energy, which converts to Kinetic Energy as it rolls down!',
        difficulty: 'easy',
      },
    ],
  },

  practice_prefixes_un_re_dis: {
    id: 'practice_prefixes_un_re_dis',
    skillId: 'skill_prefixes_un_re_dis',
    title: 'Prefixes UN-, RE-, DIS- Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_pref_1',
        type: 'multiple_choice',
        prompt: 'Which prefix added to "APPEAR" creates a word meaning "to vanish or not be seen"?',
        options: [
          { id: 'opt_dis', text: 'DIS- (DISAPPEAR)', isCorrect: true },
          { id: 'opt_re', text: 'RE- (REAPPEAR)' },
          { id: 'opt_pre', text: 'PRE- (PREAPPEAR)' },
        ],
        correctOptionIds: ['opt_dis'],
        hints: {
          tier1Concept: 'The prefix DIS- means not, opposite of, or away.',
          tier2Specific: 'Disappear means the opposite of appear.',
          tier3Partial: 'DIS + APPEAR = DISAPPEAR.',
          tier4WorkedMethod: 'Attach DIS- to APPEAR.',
        },
        explanation: 'Adding the prefix DIS- to APPEAR creates DISAPPEAR, which means to vanish from sight!',
        difficulty: 'easy',
      },
    ],
  },

  practice_conditional_if_else: {
    id: 'practice_conditional_if_else',
    skillId: 'skill_conditional_if_else',
    title: 'Conditional Branching Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_cie_1',
        type: 'multiple_choice',
        prompt: 'Look at the rule: IF (obstacle_ahead) THEN turn_right() ELSE move_forward(). If there is NO obstacle, what does the robot do?',
        options: [
          { id: 'opt_fwd', text: 'move_forward() (Executes the ELSE branch)', isCorrect: true },
          { id: 'opt_right', text: 'turn_right() (Executes the IF branch)' },
          { id: 'opt_stop', text: 'Shut down completely' },
        ],
        correctOptionIds: ['opt_fwd'],
        hints: {
          tier1Concept: 'When the IF condition is FALSE, the computer runs the ELSE branch.',
          tier2Specific: 'Obstacle ahead is FALSE (no obstacle).',
          tier3Partial: 'The ELSE branch specifies move_forward().',
          tier4WorkedMethod: 'Select move_forward().',
        },
        explanation: 'When the condition is false (no obstacle), the computer executes the ELSE branch: move_forward()!',
        difficulty: 'easy',
      },
    ],
  },

  practice_inference_clues: {
    id: 'practice_inference_clues',
    skillId: 'skill_inference_clues',
    title: 'Textual Inferences Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_inf_1',
        type: 'multiple_choice',
        prompt: 'The character put on yellow rain boots, grabbed an umbrella, and heard water tapping on the glass roof. What can you infer?',
        options: [
          { id: 'opt_rain', text: 'It is raining outside', isCorrect: true },
          { id: 'opt_snow', text: 'There is a heavy blizzard' },
          { id: 'opt_sun', text: 'It is hot and sunny' },
        ],
        correctOptionIds: ['opt_rain'],
        hints: {
          tier1Concept: 'An inference uses clues + prior knowledge to draw a logical conclusion.',
          tier2Specific: 'Umbrellas, rain boots, and water tapping are clues about wet weather.',
          tier3Partial: 'These clues point to rain.',
          tier4WorkedMethod: 'It is raining outside.',
        },
        explanation: 'Rain boots, an umbrella, and water tapping on glass clearly indicate rainy weather!',
        difficulty: 'easy',
      },
    ],
  },

  practice_fraction_multiplication: {
    id: 'practice_fraction_multiplication',
    skillId: 'skill_fraction_multiplication',
    title: 'Multiplying Fractions Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_fm_1',
        type: 'multiple_choice',
        prompt: 'What is (1/2) × (1/3) represented on an area grid model?',
        options: [
          { id: 'opt_16', text: '1/6 (One-Sixth)', isCorrect: true },
          { id: 'opt_25', text: '2/5' },
          { id: 'opt_23', text: '2/3' },
        ],
        correctOptionIds: ['opt_16'],
        hints: {
          tier1Concept: 'Multiply numerators together, and multiply denominators together.',
          tier2Specific: '(1 × 1) / (2 × 3).',
          tier3Partial: '1 / 6.',
          tier4WorkedMethod: '1/2 × 1/3 = 1/6.',
        },
        explanation: 'Multiplying numerators (1 × 1 = 1) and denominators (2 × 3 = 6) gives 1/6!',
        difficulty: 'easy',
      },
    ],
  },

  practice_ecosystem_balance: {
    id: 'practice_ecosystem_balance',
    skillId: 'skill_ecosystem_balance',
    title: 'Ecosystem Balance Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_eb_1',
        type: 'multiple_choice',
        prompt: 'In a forest biome, if the wolf predator population suddenly decreases, what immediately happens to the deer population?',
        options: [
          { id: 'opt_increase', text: 'The deer population increases because fewer are hunted', isCorrect: true },
          { id: 'opt_extinct', text: 'The deer population goes extinct immediately' },
          { id: 'opt_same', text: 'Nothing changes' },
        ],
        correctOptionIds: ['opt_increase'],
        hints: {
          tier1Concept: 'Predators control herbivore populations in balanced food webs.',
          tier2Specific: 'Without wolves hunting deer, more deer survive and reproduce.',
          tier3Partial: 'The deer numbers will rise.',
          tier4WorkedMethod: 'Deer population increases.',
        },
        explanation: 'Fewer predators allow herbivore populations to grow rapidly, which in turn can lead to overgrazing plants!',
        difficulty: 'easy',
      },
    ],
  },

  practice_shades_of_meaning_tier2: {
    id: 'practice_shades_of_meaning_tier2',
    skillId: 'skill_shades_of_meaning_tier2',
    title: 'Nuanced Adjectives Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_som_1',
        type: 'multiple_choice',
        prompt: 'Which word represents the most intense level of anger in this sequence: annoyed ➔ angry ➔ _______?',
        options: [
          { id: 'opt_furious', text: 'FURIOUS (Extreme rage)', isCorrect: true },
          { id: 'opt_calm', text: 'CALM (Peaceful)' },
          { id: 'opt_pleased', text: 'PLEASED (Happy)' },
        ],
        correctOptionIds: ['opt_furious'],
        hints: {
          tier1Concept: 'Shades of meaning rank adjectives by intensity from mild to extreme.',
          tier2Specific: 'Annoyed is mild, angry is moderate, and furious is peak intensity.',
          tier3Partial: 'Furious describes overwhelming fury.',
          tier4WorkedMethod: 'Select FURIOUS.',
        },
        explanation: 'Annoyed (mild) ➔ Angry (medium) ➔ Furious (extreme intensity)!',
        difficulty: 'easy',
      },
    ],
  },

  practice_deduction_grid_matrix: {
    id: 'practice_deduction_grid_matrix',
    skillId: 'skill_deduction_grid_matrix',
    title: 'Deduction Grid Matrix Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_dgm_1',
        type: 'multiple_choice',
        prompt: 'Clue 1: Maya is NOT the potion maker. Clue 2: Leo was in the library reading. Who made the potion between Maya, Leo, and Sam?',
        options: [
          { id: 'opt_sam', text: 'Sam (Maya and Leo are eliminated)', isCorrect: true },
          { id: 'opt_maya', text: 'Maya' },
          { id: 'opt_leo', text: 'Leo' },
        ],
        correctOptionIds: ['opt_sam'],
        hints: {
          tier1Concept: 'Use the elimination matrix to cross off impossible suspects.',
          tier2Specific: 'Maya is eliminated by Clue 1. Leo is eliminated by Clue 2.',
          tier3Partial: 'Only Sam remains.',
          tier4WorkedMethod: 'Sam must be the potion maker.',
        },
        explanation: 'Eliminating Maya (Clue 1) and Leo (Clue 2) leaves Sam as the only possible potion maker!',
        difficulty: 'easy',
      },
    ],
  },

  practice_solar_spectral_classes: {
    id: 'practice_solar_spectral_classes',
    skillId: 'skill_solar_spectral_classes',
    title: 'Stellar Spectra Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_ssc_1',
        type: 'multiple_choice',
        prompt: 'Which spectral class of stars has the hottest surface temperature and glows with a brilliant blue color?',
        options: [
          { id: 'opt_o_class', text: 'Class O / B (Blue Supergiants, >30,000 K)', isCorrect: true },
          { id: 'opt_m_class', text: 'Class M (Red Dwarfs, ~3,000 K)' },
          { id: 'opt_g_class', text: 'Class G (Yellow Stars like our Sun, ~5,800 K)' },
        ],
        correctOptionIds: ['opt_o_class'],
        hints: {
          tier1Concept: 'In physics and astronomy, blue light corresponds to higher thermal energy than red light.',
          tier2Specific: 'Class O stars are the hottest blue stars, while Class M stars are cooler red stars.',
          tier3Partial: 'Class O and B stars are burning hot blue giants.',
          tier4WorkedMethod: 'Class O/B stars are the hottest.',
        },
        explanation: 'Class O and B stars burn with immense heat (>30,000 K), emitting intense blue-white thermal radiation!',
        difficulty: 'easy',
      },
    ],
  },

  practice_ratios_proportions: {
    id: 'practice_ratios_proportions',
    skillId: 'skill_ratios_proportions',
    title: 'Ratios & Proportions Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_rp_1',
        type: 'multiple_choice',
        prompt: 'A glowing potion recipe requires a 2:3 ratio of Sun Drops to Moon Water. If you use 6 Sun Drops, how much Moon Water do you need?',
        options: [
          { id: 'opt_9', text: '9 drops of Moon Water (scaled by 3)', isCorrect: true },
          { id: 'opt_6', text: '6 drops' },
          { id: 'opt_12', text: '12 drops' },
        ],
        correctOptionIds: ['opt_9'],
        hints: {
          tier1Concept: 'Ratios scale proportionally by multiplying both parts by the same multiplier.',
          tier2Specific: 'Sun drops increased from 2 to 6 (multiplied by 3).',
          tier3Partial: 'Multiply Moon Water (3) by 3: 3 × 3 = 9.',
          tier4WorkedMethod: '2:3 scaled by 3 = 6:9.',
        },
        explanation: 'Scaling the 2:3 ratio by a factor of 3 gives 6 Sun Drops to 9 Moon Water drops!',
        difficulty: 'easy',
      },
    ],
  },

  practice_algebraic_expressions: {
    id: 'practice_algebraic_expressions',
    skillId: 'skill_algebraic_expressions',
    title: 'Algebraic Expressions Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_ae_1',
        type: 'multiple_choice',
        prompt: 'Evaluate the algebraic expression 3n + 4 when n = 5.',
        options: [
          { id: 'opt_19', text: '19 (because 3 × 5 + 4 = 15 + 4 = 19)', isCorrect: true },
          { id: 'opt_12', text: '12' },
          { id: 'opt_39', text: '39' },
        ],
        correctOptionIds: ['opt_19'],
        hints: {
          tier1Concept: 'Substitute the given value for the variable n.',
          tier2Specific: 'Replace n with 5: 3 × (5) + 4.',
          tier3Partial: 'Multiply first: 3 × 5 = 15. Then add 4: 15 + 4 = 19.',
          tier4WorkedMethod: '3(5) + 4 = 19.',
        },
        explanation: 'Substituting n = 5 yields (3 × 5) + 4 = 15 + 4 = 19!',
        difficulty: 'easy',
      },
    ],
  },

  practice_structural_engineering: {
    id: 'practice_structural_engineering',
    skillId: 'skill_structural_engineering',
    title: 'Structural Engineering Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_se_1',
        type: 'multiple_choice',
        prompt: 'Why do architectural bridge trusses use triangular geometry instead of squares?',
        options: [
          { id: 'opt_tri', text: 'Triangles distribute weight and resist deforming under load', isCorrect: true },
          { id: 'opt_cost', text: 'Triangles use more paint' },
          { id: 'opt_look', text: 'Only for decoration' },
        ],
        correctOptionIds: ['opt_tri'],
        hints: {
          tier1Concept: 'Triangles are geometrically rigid polygons that cannot deform without breaking a side.',
          tier2Specific: 'Forces are distributed through tension and compression along triangle trusses.',
          tier3Partial: 'Triangles prevent the bridge from shifting sideways.',
          tier4WorkedMethod: 'Triangles distribute loads and resist deformation.',
        },
        explanation: 'Triangles are inherently rigid structural units that distribute tension and compression evenly across bridge trusses!',
        difficulty: 'easy',
      },
    ],
  },

  practice_algorithmic_efficiency: {
    id: 'practice_algorithmic_efficiency',
    skillId: 'skill_algorithmic_efficiency',
    title: 'Algorithmic Efficiency Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_ae_1',
        type: 'multiple_choice',
        prompt: 'To draw a 4x4 square grid of tiles, which approach is more efficient in code length and clarity?',
        options: [
          { id: 'opt_nested', text: 'Nested Loop: REPEAT 4 [ REPEAT 4 [ place_tile(); move() ] ]', isCorrect: true },
          { id: 'opt_copy', text: 'Writing 16 separate place_tile() and move() lines in a row' },
          { id: 'opt_random', text: 'Placing tiles randomly without loops' },
        ],
        correctOptionIds: ['opt_nested'],
        hints: {
          tier1Concept: 'Nested loops repeat a sequence across rows and columns efficiently.',
          tier2Specific: 'A 2D grid is 4 rows × 4 columns.',
          tier3Partial: 'A loop inside a loop replaces 16 repetitive manual commands.',
          tier4WorkedMethod: 'Use the nested loop.',
        },
        explanation: 'Nested loops elegantly handle multi-dimensional grid traversals with concise, scalable code!',
        difficulty: 'easy',
      },
    ],
  },

  practice_scientific_hypothesis: {
    id: 'practice_scientific_hypothesis',
    skillId: 'skill_scientific_hypothesis',
    title: 'Scientific Hypothesis Practice',
    targetPassScore: 75,
    rewardXP: 50,
    rewardStars: 3,
    questions: [
      {
        id: 'q_sh_1',
        type: 'multiple_choice',
        prompt: 'Which statement is a valid, testable and falsifiable scientific hypothesis?',
        options: [
          { id: 'opt_hyp', text: 'If plants receive 8 hours of sunlight, then they will grow taller than plants in the dark', isCorrect: true },
          { id: 'opt_magic', text: 'Plants grow because forest spirits make them happy' },
          { id: 'opt_green', text: 'Plants are green because green is the prettiest color' },
        ],
        correctOptionIds: ['opt_hyp'],
        hints: {
          tier1Concept: 'A scientific hypothesis must be testable with measurable variables (IF... THEN...).',
          tier2Specific: 'Look for an explanation that can be proven or disproven by experimentation.',
          tier3Partial: 'Measuring plant height under different sunlight conditions is testable.',
          tier4WorkedMethod: 'Select the "If plants receive 8 hours of sunlight..." statement.',
        },
        explanation: 'A scientific hypothesis uses an "If [cause], then [effect]" structure that can be tested and measured with empirical data!',
        difficulty: 'easy',
      },
    ],
  },
}

import { getAllCinematicLessons } from './cinematicLessonsData'
import { getAllSkills } from './curriculumRegistry'

export function getAcademyPracticeSet(practiceSetId: string): PracticeSet | undefined {
  if (ACADEMY_PRACTICE_REGISTRY[practiceSetId]) {
    return ACADEMY_PRACTICE_REGISTRY[practiceSetId]
  }

  // Fallback: adapt from cinematic lesson micro-questions
  const skill = getAllSkills().find((s) => s.practiceSetId === practiceSetId)
  const cinematic = getAllCinematicLessons().find(
    (l) =>
      (skill && (l.skillId === skill.id || l.id === skill.lessonId)) ||
      `practice_${l.id.replace('lesson_', '')}` === practiceSetId ||
      `practice_${l.skillId.replace('skill_', '')}` === practiceSetId ||
      l.skillId === practiceSetId.replace('practice_', 'skill_')
  )

  if (cinematic) {
    const microQScene = cinematic.scenes.find((s) => s.microQuestion)
    if (microQScene?.microQuestion) {
      const mq = microQScene.microQuestion
      const options = mq.options || []
      const correctOpt = options.find((o) => o.isCorrect) || options[0] || { id: 'opt_1' }
      return {
        id: practiceSetId,
        skillId: cinematic.skillId,
        title: `${cinematic.title} Practice`,
        targetPassScore: 75,
        rewardXP: 50,
        rewardStars: 3,
        questions: [
          {
            id: `q_${mq.id}`,
            type: 'multiple_choice',
            prompt: mq.prompt,
            options: options.map((o) => ({
              id: o.id,
              text: o.label,
              isCorrect: o.isCorrect,
            })),
            correctOptionIds: [correctOpt.id],
            hints: {
              tier1Concept: mq.hints[0] || 'Think about the core concept.',
              tier2Specific: mq.hints[1] || 'Look closely at the clues.',
              tier3Partial: mq.hints[2] || 'Consider the relationship.',
              tier4WorkedMethod: mq.hints[3] || mq.explanation || 'Select the correct answer.',
            },
            explanation: mq.explanation || 'Great job solving this question!',
            difficulty: 'easy',
          },
        ],
      }
    }
  }

  return undefined
}
