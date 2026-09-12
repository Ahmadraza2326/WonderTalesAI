import type { DifficultyTier } from '../../types/experience'
import type {
  WeightItem,
  PlacedWeightInstance,
  ScaleEquilibrium,
  PotionScalesPuzzle,
  PotionScalesState,
  PotionScalesAction,
  PotionScalesTelemetry,
} from '../../types/games/potionScales'

// ==========================================
// 1. PHYSICAL SCALE EQUILIBRIUM SOLVER
// ==========================================

export function calculateScaleEquilibrium(
  leftItems: PlacedWeightInstance[],
  rightItems: PlacedWeightInstance[]
): ScaleEquilibrium {
  const leftTotal = leftItems.reduce((acc, inst) => acc + (inst.item.isMystery ? (inst.item.mysteryHiddenWeight ?? inst.item.weight) : inst.item.weight), 0)
  const rightTotal = rightItems.reduce((acc, inst) => acc + (inst.item.isMystery ? (inst.item.mysteryHiddenWeight ?? inst.item.weight) : inst.item.weight), 0)

  // Floating point precision rounding to 3 decimals
  const leftTotalWeight = Math.round(leftTotal * 1000) / 1000
  const rightTotalWeight = Math.round(rightTotal * 1000) / 1000
  const weightDifference = Math.round((leftTotalWeight - rightTotalWeight) * 1000) / 1000

  // Tilt angle in degrees: clamped [-25, +25], positive = tilts down to the left
  const rawAngle = weightDifference * 4.5
  const tiltAngleDeg = Math.max(-25, Math.min(25, Math.round(rawAngle * 10) / 10))

  const isBalanced =
    Math.abs(weightDifference) < 0.001 &&
    leftTotalWeight > 0 &&
    rightTotalWeight > 0

  const isNearBalanced =
    !isBalanced &&
    leftTotalWeight > 0 &&
    rightTotalWeight > 0 &&
    Math.abs(weightDifference) <= 0.75

  return {
    leftTotalWeight,
    rightTotalWeight,
    weightDifference,
    tiltAngleDeg,
    isBalanced,
    isNearBalanced,
  }
}

// ==========================================
// 2. MASTER INVENTORY CATALOG OF WEIGHTS
// ==========================================

export const MASTER_POTION_WEIGHTS: Record<string, WeightItem> = {
  moonstone_1: {
    id: 'moonstone_1',
    name: 'Moonstone Pebble',
    emoji: '💎',
    weight: 1,
    displayWeightLabel: '1g',
    type: 'gem',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
  },
  star_gem_2: {
    id: 'star_gem_2',
    name: 'Star Quartz',
    emoji: '⭐',
    weight: 2,
    displayWeightLabel: '2g',
    type: 'gem',
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
  },
  emerald_leaf_3: {
    id: 'emerald_leaf_3',
    name: 'Verdant Crystal',
    emoji: '🌿',
    weight: 3,
    displayWeightLabel: '3g',
    type: 'crystal',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.6)',
  },
  sapphire_drop_4: {
    id: 'sapphire_drop_4',
    name: 'Sapphire Tear',
    emoji: '💧',
    weight: 4,
    displayWeightLabel: '4g',
    type: 'crystal',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.6)',
  },
  amber_ingot_5: {
    id: 'amber_ingot_5',
    name: 'Solar Amber Ingot',
    emoji: '🌟',
    weight: 5,
    displayWeightLabel: '5g',
    type: 'ingot',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
  },
  ruby_core_6: {
    id: 'ruby_core_6',
    name: 'Crimson Ruby Core',
    emoji: '❤️‍🔥',
    weight: 6,
    displayWeightLabel: '6g',
    type: 'gem',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.6)',
  },
  amethyst_chunk_7: {
    id: 'amethyst_chunk_7',
    name: 'Amethyst Shard',
    emoji: '🔮',
    weight: 7,
    displayWeightLabel: '7g',
    type: 'crystal',
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.6)',
  },
  titan_pyrite_10: {
    id: 'titan_pyrite_10',
    name: 'Titan Gold Block',
    emoji: '👑',
    weight: 10,
    displayWeightLabel: '10g',
    type: 'ingot',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
  },

  // Fractional Weights (for Hard Tier)
  quarter_gem_quarter: {
    id: 'quarter_gem_quarter',
    name: 'Tiny Star Splinter',
    emoji: '✨',
    weight: 0.25,
    displayWeightLabel: '¼g',
    isFraction: true,
    fractionLabel: '1/4',
    type: 'gem',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.6)',
  },
  half_crystal_half: {
    id: 'half_crystal_half',
    name: 'Luminous Crescent',
    emoji: '🌙',
    weight: 0.5,
    displayWeightLabel: '½g',
    isFraction: true,
    fractionLabel: '1/2',
    type: 'gem',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
  },
  three_quarters_shard: {
    id: 'three_quarters_shard',
    name: 'Sun Prism Fraction',
    emoji: '💫',
    weight: 0.75,
    displayWeightLabel: '¾g',
    isFraction: true,
    fractionLabel: '3/4',
    type: 'crystal',
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)',
  },

  // Liquid Beakers (Hard Tier Volume)
  liquid_flask_100: {
    id: 'liquid_flask_100',
    name: 'Dew Vial (100ml)',
    emoji: '🧪',
    weight: 1, // 100ml = 1g normalized unit
    volumeMl: 100,
    displayWeightLabel: '100ml (1u)',
    type: 'liquid_beaker',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
  },
  liquid_flask_250: {
    id: 'liquid_flask_250',
    name: 'Aura Flask (250ml)',
    emoji: '🍶',
    weight: 2.5, // 250ml = 2.5g normalized unit
    volumeMl: 250,
    displayWeightLabel: '250ml (2.5u)',
    type: 'liquid_beaker',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
  },
  liquid_flask_500: {
    id: 'liquid_flask_500',
    name: 'Ocean Pitcher (500ml)',
    emoji: '🏺',
    weight: 5, // 500ml = 5g normalized unit
    volumeMl: 500,
    displayWeightLabel: '500ml (5u)',
    type: 'liquid_beaker',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
  },
}

// ==========================================
// 3. CURATED MASTER PUZZLE SCENARIOS (18 LEVELS)
// ==========================================

export const CURATED_POTION_PUZZLES: PotionScalesPuzzle[] = [
  // --- EASY TIER: Whole Number Additive Balances (6 levels) ---
  {
    id: 'easy_starlight_healing',
    title: 'Starlight Healing Brew',
    difficulty: 'easy',
    tierNumber: 1,
    parMoves: 2,
    recipe: {
      potionId: 'starlight_heal',
      potionName: 'Starlight Healing Elixir',
      potionEmoji: '✨',
      potionColor: '#38bdf8',
      potionGlow: 'rgba(56, 189, 248, 0.5)',
      targetWeight: 5,
      displayTargetFormula: 'Balance 5g on the scale',
      customer: {
        id: 'pip_bunny',
        name: 'Pip the Meadow Bunny',
        species: 'Meadow Bunny',
        avatar: '🐰',
        orderQuote: 'My ears need a soothing Starlight Elixir! Can you balance exactly 5 grams of moonstone?',
        celebrationQuote: 'Hooray! The potion sparkles with soothing light. My ears feel marvelous!',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.amber_ingot_5],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
      ],
      solutionHint: 'Place items on the right pan that add up to 5g (e.g. 5g ingot, or 3g + 2g).',
    },
    scientificConcept: {
      conceptTitle: 'Conservation of Mass',
      scienceTopic: 'Equilibrium & Weight Balance',
      funFact: 'No matter what combination of shapes you use, 5 grams of gems equals 5 grams of gold!',
      kidExplanation: 'When both sides of a scale carry the exact same total weight, the beam balances flat in the center.',
    },
  },
  {
    id: 'easy_sunfire_tonic',
    title: 'Sunfire Energy Tonic',
    difficulty: 'easy',
    tierNumber: 2,
    parMoves: 3,
    recipe: {
      potionId: 'sunfire_tonic',
      potionName: 'Sunfire Energy Tonic',
      potionEmoji: '☀️',
      potionColor: '#f59e0b',
      potionGlow: 'rgba(245, 158, 11, 0.5)',
      targetWeight: 6,
      displayTargetFormula: 'Combine weights to balance 6g',
      customer: {
        id: 'zephyr_gull',
        name: 'Zephyr Seagull',
        species: 'Sky Wanderer',
        avatar: '🕊️',
        orderQuote: 'I have a long flight over the Whispering Sea. I need a warm 6-gram Sunfire Tonic!',
        celebrationQuote: 'Squawk! Warm sunbeams are bubbling in the vial! Off to the clouds I soar!',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.ruby_core_6],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.sapphire_drop_4,
      ],
      solutionHint: 'Combine smaller gems like 3g + 2g + 1g or 4g + 2g on the right pan to make 6g.',
    },
    scientificConcept: {
      conceptTitle: 'Additive Composition',
      scienceTopic: 'Sum of Quantities',
      funFact: 'Adding 3 + 2 + 1 creates the exact same gravitational downward force as a single 6-gram stone!',
      kidExplanation: 'Many small weights can join together to equal one large weight on a scale.',
    },
  },
  {
    id: 'easy_dewdrop_calm',
    title: 'Dewdrop Calming Draught',
    difficulty: 'easy',
    tierNumber: 3,
    parMoves: 3,
    recipe: {
      potionId: 'dewdrop_calm',
      potionName: 'Dewdrop Calming Draught',
      potionEmoji: '💧',
      potionColor: '#60a5fa',
      potionGlow: 'rgba(96, 165, 250, 0.5)',
      targetWeight: 8,
      displayTargetFormula: 'Balance two 4g Sapphire Tears (8g total)',
      customer: {
        id: 'oliver_owl',
        name: 'Professor Hoot',
        species: 'Astronomy Scholar',
        avatar: '🦉',
        orderQuote: 'Whoo-whoo! I need 8 grams of Dewdrop Essence to prepare for tonight’s star observation.',
        celebrationQuote: 'Splendid measurement! A tranquil blue aura envelops the laboratory beaker.',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.sapphire_drop_4, MASTER_POTION_WEIGHTS.sapphire_drop_4],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.moonstone_1,
      ],
      solutionHint: 'The left side has 4g + 4g = 8g. Place 5g + 3g or 3g + 3g + 2g on the right.',
    },
    scientificConcept: {
      conceptTitle: 'Symmetrical Balancing',
      scienceTopic: 'Equivalence in Sets',
      funFact: 'Two 4g tears weigh the same as one 5g ingot plus one 3g crystal!',
      kidExplanation: 'A scale only cares about the total weight in the pan, not the number of pieces.',
    },
  },
  {
    id: 'easy_forest_whisper',
    title: 'Forest Whisper Elixir',
    difficulty: 'easy',
    tierNumber: 4,
    parMoves: 2,
    recipe: {
      potionId: 'forest_whisper',
      potionName: 'Forest Whisper Elixir',
      potionEmoji: '🌲',
      potionColor: '#10b981',
      potionGlow: 'rgba(16, 185, 129, 0.5)',
      targetWeight: 7,
      displayTargetFormula: 'Balance 7g Amethyst Shard',
      customer: {
        id: 'bramble_badger',
        name: 'Bramble Badger',
        species: 'Forest Herbalist',
        avatar: '🦡',
        orderQuote: 'My garden herbs need a 7g Forest Whisper concoction to sprout under the new moon!',
        celebrationQuote: 'Sniff sniff! It smells of sweet pine and rain! Thank you, young alchemist!',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.amethyst_chunk_7],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.moonstone_1,
      ],
      solutionHint: '5g + 2g = 7g.',
    },
    scientificConcept: {
      conceptTitle: 'Gravitational Force',
      scienceTopic: 'Weight & Gravity',
      funFact: 'Earth’s gravity pulls down equally on every single gram you place on either pan.',
      kidExplanation: 'Gravity is the invisible hand pulling on both pans until they rest in perfect harmony.',
    },
  },
  {
    id: 'easy_pixie_levitation',
    title: 'Pixie Dust Levitation Tonic',
    difficulty: 'easy',
    tierNumber: 5,
    parMoves: 3,
    recipe: {
      potionId: 'pixie_dust',
      potionName: 'Pixie Levitation Tonic',
      potionEmoji: '🧚',
      potionColor: '#ec4899',
      potionGlow: 'rgba(236, 72, 153, 0.5)',
      targetWeight: 10,
      displayTargetFormula: 'Balance 10g Titan Gold',
      customer: {
        id: 'glimmer_ferret',
        name: 'Glimmer Ferret',
        species: 'Curious Treasure Seeker',
        avatar: '🦔',
        orderQuote: 'Ooh shiny! I need 10 grams of bubbly floating tonic to reach the high pantry shelf!',
        celebrationQuote: 'Weee! Look at me float! The scale was balanced to perfection!',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.titan_pyrite_10],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.moonstone_1,
      ],
      solutionHint: 'Place 5g + 3g + 2g or two 5g ingots on the right pan.',
    },
    scientificConcept: {
      conceptTitle: 'Tens and Units Decomposition',
      scienceTopic: 'Number Bases',
      funFact: '10 grams can be built in over 40 different combinations of smaller stones!',
      kidExplanation: 'Large numbers are made up of smaller friendly numbers joined together.',
    },
  },
  {
    id: 'easy_celestial_star',
    title: 'Celestial Star Brew',
    difficulty: 'easy',
    tierNumber: 6,
    parMoves: 3,
    recipe: {
      potionId: 'celestial_star',
      potionName: 'Celestial Star Brew',
      potionEmoji: '🌌',
      potionColor: '#8b5cf6',
      potionGlow: 'rgba(139, 92, 246, 0.5)',
      targetWeight: 9,
      displayTargetFormula: 'Balance 5g + 4g on Left Pan',
      customer: {
        id: 'luna_moth',
        name: 'Luna Silkwing',
        species: 'Nocturnal Weaver',
        avatar: '🦋',
        orderQuote: 'The night sky calls! I need 9 grams of Celestial Star Brew to illuminate my silk thread.',
        celebrationQuote: 'Magnificent! The glowing indigo vapor sparkles like a galaxy in a jar!',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.amber_ingot_5, MASTER_POTION_WEIGHTS.sapphire_drop_4],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.amethyst_chunk_7,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.ruby_core_6,
      ],
      solutionHint: 'Left has 5g + 4g = 9g. Balance with 7g + 2g or 6g + 3g.',
    },
    scientificConcept: {
      conceptTitle: 'Fulcrum Center of Mass',
      scienceTopic: 'Fulcrums & Moments',
      funFact: 'A balance beam stays level when the rotational pull on both sides cancel each other out.',
      kidExplanation: 'When both arms experience equal force, the center pointer locks straight upward.',
    },
  },

  // --- MEDIUM TIER: Missing Weights & Multi-Pan Equations (6 levels) ---
  {
    id: 'med_mystic_moon_mystery',
    title: 'Mystic Moon Elixir',
    difficulty: 'medium',
    tierNumber: 1,
    parMoves: 2,
    recipe: {
      potionId: 'mystic_moon',
      potionName: 'Mystic Moon Elixir',
      potionEmoji: '🌙',
      potionColor: '#38bdf8',
      potionGlow: 'rgba(56, 189, 248, 0.5)',
      targetWeight: 8,
      displayTargetFormula: '? Mystery Pouch + 3g = 8g',
      customer: {
        id: 'chrono_tortoise',
        name: 'Chrono Tortoise',
        species: 'Time Scholar',
        avatar: '🐢',
        orderQuote: 'This secret ancient pouch sits with 3g on the left. The right holds 8g. Find what the pouch weighs!',
        celebrationQuote: 'Tick-tock, brilliant deduction! The mystery pouch holds exactly 5 grams!',
      },
      leftStartingItems: [
        {
          id: 'mystery_pouch_5',
          name: 'Mystery Pouch (?)',
          emoji: '🎁',
          weight: 5,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#a855f7',
          glowColor: 'rgba(168, 85, 247, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 5,
        },
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
      ],
      rightStartingItems: [MASTER_POTION_WEIGHTS.amber_ingot_5, MASTER_POTION_WEIGHTS.emerald_leaf_3],
      availableInventory: [
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
      ],
      solutionHint: 'Since ? + 3 = 8, subtracting 3 from 8 reveals the pouch is 5g.',
    },
    scientificConcept: {
      conceptTitle: 'Algebraic Balance & Unknowns',
      scienceTopic: 'Inverse Operations',
      funFact: 'Mathematicians use balance scales to discover unknown numbers without opening the box!',
      kidExplanation: 'If you take away the same weight from both sides, the unknown weight reveals itself.',
    },
  },
  {
    id: 'med_dragon_fire_tonic',
    title: 'Golden Dragon Draught',
    difficulty: 'medium',
    tierNumber: 2,
    parMoves: 3,
    recipe: {
      potionId: 'dragon_fire',
      potionName: 'Golden Dragon Draught',
      potionEmoji: '🐉',
      potionColor: '#eab308',
      potionGlow: 'rgba(234, 179, 8, 0.5)',
      targetWeight: 10,
      displayTargetFormula: '? Dragon Egg + 4g = 10g Gold',
      customer: {
        id: 'barnaby_bear',
        name: 'Barnaby Bear',
        species: 'Gentle Baker',
        avatar: '🐻',
        orderQuote: 'A rare golden dragon egg is on the left with a 4g drop. Right has a 10g bar. How heavy is the egg?',
        celebrationQuote: 'Delicious warmth! The dragon egg was exactly 6 grams of golden magic!',
      },
      leftStartingItems: [
        {
          id: 'mystery_egg_6',
          name: 'Dragon Egg (?)',
          emoji: '🥚',
          weight: 6,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#fbbf24',
          glowColor: 'rgba(251, 191, 36, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 6,
        },
        MASTER_POTION_WEIGHTS.sapphire_drop_4,
      ],
      rightStartingItems: [MASTER_POTION_WEIGHTS.titan_pyrite_10],
      availableInventory: [
        MASTER_POTION_WEIGHTS.ruby_core_6,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.star_gem_2,
      ],
      solutionHint: '? + 4 = 10. The egg is 6g (10 - 4 = 6).',
    },
    scientificConcept: {
      conceptTitle: 'Equivalence Relations',
      scienceTopic: 'Algebraic Symmetry',
      funFact: 'The equals sign (=) was invented in 1557 by a mathematician who drew two parallel balanced lines!',
      kidExplanation: 'Equivalence means whatever is on the left side is identical in total value to the right side.',
    },
  },
  {
    id: 'med_frost_crystal_potion',
    title: 'Frostbite Freeze Potion',
    difficulty: 'medium',
    tierNumber: 3,
    parMoves: 3,
    recipe: {
      potionId: 'frost_freeze',
      potionName: 'Frostbite Freeze Potion',
      potionEmoji: '❄️',
      potionColor: '#06b6d4',
      potionGlow: 'rgba(6, 182, 212, 0.5)',
      targetWeight: 12,
      displayTargetFormula: '? Frost Core + 2g + 3g = 12g',
      customer: {
        id: 'felix_squirrel',
        name: 'Felix Acorn Collector',
        species: 'Tree Climber',
        avatar: '🐿️',
        orderQuote: 'My ice pantry needs a 12g potion! The Frost Core sits with 2g and 3g. Find the missing piece!',
        celebrationQuote: 'Brrr! Crisp sparkling frost crystals form instantly on the counter!',
      },
      leftStartingItems: [
        {
          id: 'mystery_frost_7',
          name: 'Frost Core (?)',
          emoji: '🧊',
          weight: 7,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#38bdf8',
          glowColor: 'rgba(56, 189, 248, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 7,
        },
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
      ],
      rightStartingItems: [MASTER_POTION_WEIGHTS.titan_pyrite_10, MASTER_POTION_WEIGHTS.star_gem_2],
      availableInventory: [
        MASTER_POTION_WEIGHTS.amethyst_chunk_7,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.moonstone_1,
      ],
      solutionHint: '? + 5 = 12. The frost core is 7g.',
    },
    scientificConcept: {
      conceptTitle: 'Multi-Addend Equations',
      scienceTopic: 'Associative Properties',
      funFact: 'You can group numbers in any order (2 + 3 = 5, then 12 - 5 = 7) and the result never changes!',
      kidExplanation: 'Combine the known numbers first to make solving the mystery much easier.',
    },
  },
  {
    id: 'med_shadow_ward_tincture',
    title: 'Shadow Ward Tincture',
    difficulty: 'medium',
    tierNumber: 4,
    parMoves: 3,
    recipe: {
      potionId: 'shadow_ward',
      potionName: 'Shadow Ward Tincture',
      potionEmoji: '🛡️',
      potionColor: '#6366f1',
      potionGlow: 'rgba(99, 102, 241, 0.5)',
      targetWeight: 10,
      displayTargetFormula: '2 Equal Moon Pearls (2 × ?) + 2g = 10g',
      customer: {
        id: 'tide_otter',
        name: 'Tide Otter',
        species: 'River Navigator',
        avatar: '🦦',
        orderQuote: 'Two identical mysterious pearls plus a 2g shell balance 10g. How much does one pearl weigh?',
        celebrationQuote: 'Splish splash! A shimmering purple protective barrier shimmers around the boat!',
      },
      leftStartingItems: [
        {
          id: 'mystery_pearl_a',
          name: 'Moon Pearl A (?)',
          emoji: '🔮',
          weight: 4,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#818cf8',
          glowColor: 'rgba(129, 140, 248, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 4,
        },
        {
          id: 'mystery_pearl_b',
          name: 'Moon Pearl B (?)',
          emoji: '🔮',
          weight: 4,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#818cf8',
          glowColor: 'rgba(129, 140, 248, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 4,
        },
        MASTER_POTION_WEIGHTS.star_gem_2,
      ],
      rightStartingItems: [MASTER_POTION_WEIGHTS.titan_pyrite_10],
      availableInventory: [
        MASTER_POTION_WEIGHTS.sapphire_drop_4,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.star_gem_2,
      ],
      solutionHint: '2 × ? + 2 = 10. Subtract 2 to get 8, then divide by 2: each pearl is 4g.',
    },
    scientificConcept: {
      conceptTitle: 'Equal Groups & Division',
      scienceTopic: 'Multiplicative Reasoning',
      funFact: 'When two unknown objects are identical, splitting the remaining weight in half finds both!',
      kidExplanation: 'Equal groups share the weight evenly, like two friends sharing a bag of berries.',
    },
  },
  {
    id: 'med_amethyst_insight',
    title: 'Amethyst Insight Potion',
    difficulty: 'medium',
    tierNumber: 5,
    parMoves: 3,
    recipe: {
      potionId: 'amethyst_insight',
      potionName: 'Amethyst Insight Potion',
      potionEmoji: '👁️',
      potionColor: '#a855f7',
      potionGlow: 'rgba(168, 85, 247, 0.5)',
      targetWeight: 13,
      displayTargetFormula: '3 Mystery Runes (3 × ?) + 1g = 13g',
      customer: {
        id: 'octo_scribe',
        name: 'Octo the Scribe',
        species: 'Deep Sea Chronicler',
        avatar: '🐙',
        orderQuote: 'Three identical ancient runes with 1g balance 13g of gold. What is the weight of one rune?',
        celebrationQuote: 'By the eight tentacles of wisdom! My mind expands with crystal clear insight!',
      },
      leftStartingItems: [
        {
          id: 'mystery_rune_1',
          name: 'Rune 1 (?)',
          emoji: '📜',
          weight: 4,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#c084fc',
          glowColor: 'rgba(192, 132, 252, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 4,
        },
        {
          id: 'mystery_rune_2',
          name: 'Rune 2 (?)',
          emoji: '📜',
          weight: 4,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#c084fc',
          glowColor: 'rgba(192, 132, 252, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 4,
        },
        {
          id: 'mystery_rune_3',
          name: 'Rune 3 (?)',
          emoji: '📜',
          weight: 4,
          displayWeightLabel: '? g',
          type: 'mystery_box',
          color: '#c084fc',
          glowColor: 'rgba(192, 132, 252, 0.6)',
          isMystery: true,
          mysteryHiddenWeight: 4,
        },
        MASTER_POTION_WEIGHTS.moonstone_1,
      ],
      rightStartingItems: [
        MASTER_POTION_WEIGHTS.titan_pyrite_10,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
      ],
      availableInventory: [
        MASTER_POTION_WEIGHTS.sapphire_drop_4,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.star_gem_2,
      ],
      solutionHint: '3 × ? + 1 = 13. Subtract 1 = 12. 12 ÷ 3 = 4g per rune.',
    },
    scientificConcept: {
      conceptTitle: 'Algebraic Balancing Equations',
      scienceTopic: 'Linear Equations',
      funFact: 'Solving 3x + 1 = 13 on a balance scale is the exact foundation of rocket engineering math!',
      kidExplanation: 'Step by step, peeling away numbers like layers of an onion reveals the secret answer.',
    },
  },
  {
    id: 'med_phoenix_firebrew',
    title: 'Phoenix Firebrew',
    difficulty: 'medium',
    tierNumber: 6,
    parMoves: 3,
    recipe: {
      potionId: 'phoenix_fire',
      potionName: 'Phoenix Firebrew',
      potionEmoji: '🔥',
      potionColor: '#ef4444',
      potionGlow: 'rgba(239, 68, 68, 0.5)',
      targetWeight: 15,
      displayTargetFormula: '15g Phoenix Flame = ? Catalyst + 6g Ruby',
      customer: {
        id: 'aurora_fox',
        name: 'Aurora Fox',
        species: 'Astral Scout',
        avatar: '🦊',
        orderQuote: 'The left pan burns with 15g of Phoenix Flame. The right has 6g. What catalyst balances the flame?',
        celebrationQuote: 'Yip yip! Golden embers swirl in the flask! The flame is perfectly contained!',
      },
      leftStartingItems: [
        MASTER_POTION_WEIGHTS.titan_pyrite_10,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
      ],
      rightStartingItems: [MASTER_POTION_WEIGHTS.ruby_core_6],
      availableInventory: [
        MASTER_POTION_WEIGHTS.amethyst_chunk_7,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.sapphire_drop_4,
      ],
      solutionHint: '15 - 6 = 9g. Balance with 7g + 2g on the right side.',
    },
    scientificConcept: {
      conceptTitle: 'Subtraction as Balance',
      scienceTopic: 'Difference & Complements',
      funFact: 'Ancient Egyptian alchemists used two-pan balances to check gold purity with copper weights.',
      kidExplanation: 'Finding what is missing is simply discovering the gap between what you have and what you need.',
    },
  },

  // --- HARD TIER: Fractions, Liquid Volumes & Mixed Systems (6 levels) ---
  {
    id: 'hard_prismatic_rainbow',
    title: 'Prismatic Rainbow Serum',
    difficulty: 'hard',
    tierNumber: 1,
    parMoves: 3,
    recipe: {
      potionId: 'prismatic_rainbow',
      potionName: 'Prismatic Rainbow Serum',
      potionEmoji: '🌈',
      potionColor: '#f43f5e',
      potionGlow: 'rgba(244, 63, 94, 0.5)',
      targetWeight: 1.5,
      displayTargetFormula: 'Balance 1½ grams (1.5g) with Fractions',
      customer: {
        id: 'luna_moth',
        name: 'Luna Silkwing',
        species: 'Nocturnal Weaver',
        avatar: '🦋',
        orderQuote: 'A delicate rainbow potion requires exactly 1 and a half grams. Use the fractional crystal shards!',
        celebrationQuote: 'Beaming splendor! All seven colors of the spectrum shimmer in harmony!',
      },
      leftStartingItems: [
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.half_crystal_half,
      ],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.half_crystal_half,
        MASTER_POTION_WEIGHTS.three_quarters_shard,
        MASTER_POTION_WEIGHTS.quarter_gem_quarter,
        MASTER_POTION_WEIGHTS.moonstone_1,
      ],
      solutionHint: '1.5g can be balanced with two ¾g shards (0.75 + 0.75 = 1.5) or three ½g crystals (0.5 + 0.5 + 0.5 = 1.5).',
    },
    scientificConcept: {
      conceptTitle: 'Fractional Arithmetic',
      scienceTopic: 'Parts of a Whole',
      funFact: 'Two quarters (¼ + ¼) make one half (½), just like two puzzle pieces joining into one!',
      kidExplanation: 'Fractions are equal slices of one whole unit. Adding them together builds whole numbers.',
    },
  },
  {
    id: 'hard_astral_glow_philtre',
    title: 'Astral Glow Philtre',
    difficulty: 'hard',
    tierNumber: 2,
    parMoves: 3,
    recipe: {
      potionId: 'astral_glow',
      potionName: 'Astral Glow Philtre',
      potionEmoji: '💫',
      potionColor: '#a855f7',
      potionGlow: 'rgba(168, 85, 247, 0.5)',
      targetWeight: 2.25,
      displayTargetFormula: 'Balance 2¼ grams (2.25g)',
      customer: {
        id: 'oliver_owl',
        name: 'Professor Hoot',
        species: 'Astronomy Scholar',
        avatar: '🦉',
        orderQuote: 'Star charting telescope lenses demand precisely 2 and ¼ grams of luminous crystal.',
        celebrationQuote: 'Outstanding precision! The astral glow casts sharp, clear constellations onto the ceiling!',
      },
      leftStartingItems: [
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.quarter_gem_quarter,
      ],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.half_crystal_half,
        MASTER_POTION_WEIGHTS.three_quarters_shard,
        MASTER_POTION_WEIGHTS.quarter_gem_quarter,
      ],
      solutionHint: 'Combine 1g + 1g + ¼g = 2.25g, or 1g + ¾g + ½g = 2.25g.',
    },
    scientificConcept: {
      conceptTitle: 'Decomposing Mixed Numbers',
      scienceTopic: 'Rational Numbers',
      funFact: 'Precision jewelers and chemists measure precious medicines in fractions of a single gram!',
      kidExplanation: 'A mixed number has a whole number buddy standing next to a fractional friend.',
    },
  },
  {
    id: 'hard_ocean_depth_salve',
    title: 'Ocean Depth Salve',
    difficulty: 'hard',
    tierNumber: 3,
    parMoves: 3,
    recipe: {
      potionId: 'ocean_depth',
      potionName: 'Ocean Depth Salve',
      potionEmoji: '🌊',
      potionColor: '#0284c7',
      potionGlow: 'rgba(2, 132, 199, 0.5)',
      targetWeight: 5,
      targetVolumeMl: 500,
      allowLiquidPouring: true,
      displayTargetFormula: 'Balance 500ml Ocean Pitcher (5 units)',
      customer: {
        id: 'tide_otter',
        name: 'Tide Otter',
        species: 'River Navigator',
        avatar: '🦦',
        orderQuote: 'We need 500ml of deep ocean mineral water to soothe corals. Combine beakers on the scale!',
        celebrationQuote: 'Bubbles and tides! The salve glows with deep ocean luminescence!',
      },
      leftStartingItems: [MASTER_POTION_WEIGHTS.liquid_flask_500],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.liquid_flask_250,
        MASTER_POTION_WEIGHTS.liquid_flask_100,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
      ],
      solutionHint: 'Two 250ml flasks (2.5u + 2.5u = 5u) or 500ml equals 5g mass equivalence.',
    },
    scientificConcept: {
      conceptTitle: 'Liquid Volume & Density Equivalence',
      scienceTopic: 'Fluid Dynamics & Mass',
      funFact: 'In pure water, 1 milliliter (ml) of volume weighs exactly 1 gram of mass at sea level!',
      kidExplanation: 'Volume is how much space a liquid takes up, while mass is how heavy that liquid is.',
    },
  },
  {
    id: 'hard_chrono_speed_draught',
    title: 'Chrono-Speed Draught',
    difficulty: 'hard',
    tierNumber: 4,
    parMoves: 4,
    recipe: {
      potionId: 'chrono_speed',
      potionName: 'Chrono-Speed Draught',
      potionEmoji: '⏳',
      potionColor: '#d97706',
      potionGlow: 'rgba(217, 119, 6, 0.5)',
      targetWeight: 3.75,
      displayTargetFormula: 'Balance 3¾ grams (3.75g)',
      customer: {
        id: 'chrono_tortoise',
        name: 'Chrono Tortoise',
        species: 'Time Scholar',
        avatar: '🐢',
        orderQuote: 'To speed up time flow, I need 3 and ¾ grams of Chrono-Sand balanced precisely.',
        celebrationQuote: 'Whoosh! The laboratory clock ticks in melodious harmony! Fantastic measurement!',
      },
      leftStartingItems: [
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.three_quarters_shard,
      ],
      rightStartingItems: [],
      availableInventory: [
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.moonstone_1,
        MASTER_POTION_WEIGHTS.half_crystal_half,
        MASTER_POTION_WEIGHTS.quarter_gem_quarter,
      ],
      solutionHint: '2g + 1g + ½g + ¼g = 3.75g.',
    },
    scientificConcept: {
      conceptTitle: 'Binary Fractions & Subdivision',
      scienceTopic: 'Halving & Doubling',
      funFact: 'Ancient builders divided lengths by continuously halving: 1/2, 1/4, 1/8, 1/16!',
      kidExplanation: 'Each smaller fraction is created by cutting the previous one right in half.',
    },
  },
  {
    id: 'hard_thunderclap_essence',
    title: 'Thunderclap Essence',
    difficulty: 'hard',
    tierNumber: 5,
    parMoves: 4,
    recipe: {
      potionId: 'thunderclap',
      potionName: 'Thunderclap Storm Essence',
      potionEmoji: '⚡',
      potionColor: '#eab308',
      potionGlow: 'rgba(234, 179, 8, 0.5)',
      targetWeight: 7.5,
      allowLiquidPouring: true,
      displayTargetFormula: 'Balance 500ml Flask (5u) + 2.5u Star Crystal = 7.5u',
      customer: {
        id: 'zephyr_gull',
        name: 'Zephyr Seagull',
        species: 'Sky Wanderer',
        avatar: '🕊️',
        orderQuote: 'Thunderclouds contain both rain and lightning! Balance 500ml water plus 2.5g crystal.',
        celebrationQuote: 'Crack! A joyful spark dances harmlessly along the brass balance beam!',
      },
      leftStartingItems: [
        MASTER_POTION_WEIGHTS.liquid_flask_500,
        {
          id: 'half_crystal_2_5',
          name: 'Storm Crystal (2.5u)',
          emoji: '⚡',
          weight: 2.5,
          displayWeightLabel: '2½u',
          type: 'crystal',
          color: '#fbbf24',
          glowColor: 'rgba(251, 191, 36, 0.6)',
        },
      ],
      rightStartingItems: [MASTER_POTION_WEIGHTS.liquid_flask_250],
      availableInventory: [
        MASTER_POTION_WEIGHTS.liquid_flask_250,
        MASTER_POTION_WEIGHTS.amber_ingot_5,
        MASTER_POTION_WEIGHTS.star_gem_2,
        MASTER_POTION_WEIGHTS.half_crystal_half,
      ],
      solutionHint: 'Left has 5 + 2.5 = 7.5. Right has 2.5. Place 5g ingot on the right (2.5 + 5 = 7.5).',
    },
    scientificConcept: {
      conceptTitle: 'Combined Density Variables',
      scienceTopic: 'Heterogeneous Mixtures',
      funFact: 'Storm clouds carry millions of kilograms of floating water droplets alongside charged static particles!',
      kidExplanation: 'Liquids and solids add their weights together without canceling each other out.',
    },
  },
  {
    id: 'hard_philosophers_catalyst',
    title: "Philosopher's Master Catalyst",
    difficulty: 'hard',
    tierNumber: 6,
    parMoves: 4,
    recipe: {
      potionId: 'philosopher_catalyst',
      potionName: "Philosopher's Master Catalyst",
      potionEmoji: '👑',
      potionColor: '#a855f7',
      potionGlow: 'rgba(168, 85, 247, 0.5)',
      targetWeight: 4.5,
      displayTargetFormula: '4½g Gold = ? Mystery Crucible + 1¼g Crystal',
      customer: {
        id: 'octo_scribe',
        name: 'Octo the Scribe',
        species: 'Deep Sea Chronicler',
        avatar: '🐙',
        orderQuote: 'The ultimate alchemical secret! 4.5g on the left balances a mystery crucible plus 1.25g.',
        celebrationQuote: 'Eureka! The Philosopher’s Catalyst ignites with timeless golden luminescence!',
      },
      leftStartingItems: [
        MASTER_POTION_WEIGHTS.sapphire_drop_4,
        MASTER_POTION_WEIGHTS.half_crystal_half,
      ],
      rightStartingItems: [
        {
          id: 'quarter_gem_1_25_a',
          name: 'Crystal Shard',
          emoji: '✨',
          weight: 1.25,
          displayWeightLabel: '1¼g',
          type: 'gem',
          color: '#c084fc',
          glowColor: 'rgba(192, 132, 252, 0.6)',
        },
      ],
      availableInventory: [
        {
          id: 'three_and_quarter_3_25',
          name: 'Golden Crucible',
          emoji: '🏆',
          weight: 3.25,
          displayWeightLabel: '3¼g',
          type: 'ingot',
          color: '#fbbf24',
          glowColor: 'rgba(251, 191, 36, 0.6)',
        },
        MASTER_POTION_WEIGHTS.emerald_leaf_3,
        MASTER_POTION_WEIGHTS.quarter_gem_quarter,
        MASTER_POTION_WEIGHTS.half_crystal_half,
      ],
      solutionHint: '4.5 - 1.25 = 3.25 (3¼g). Balance with 3¼g or 3g + ¼g on the right.',
    },
    scientificConcept: {
      conceptTitle: 'Master Chemical Equilibrium',
      scienceTopic: 'Conservation in Chemical Reactions',
      funFact: 'Lavoisier proved in 1789 that in every chemical reaction, matter is neither created nor destroyed!',
      kidExplanation: 'In nature and in magic, everything balances out when you look closely at the numbers.',
    },
  },
]

// ==========================================
// 4. SEEDED PROCEDURAL PUZZLE GENERATOR
// ==========================================

function createPRNG(seed: string | number) {
  let s = typeof seed === 'number' ? seed : 0
  if (typeof seed === 'string') {
    for (let i = 0; i < seed.length; i++) {
      s = (s << 5) - s + seed.charCodeAt(i)
      s |= 0
    }
  }
  let a = s >>> 0

  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PROCEDURAL_CUSTOMERS = [
  {
    id: 'luna_moth',
    name: 'Luna Astral Moth',
    species: 'Silkmoth',
    avatar: '🦋',
    orderQuote: 'I need a light celestial nectar to float softly between midnight moonflowers!',
    celebrationQuote: 'Such a weightless, sparkling brew! My wings feel lighter than a feather!',
  },
  {
    id: 'barnaby_bear',
    name: 'Barnaby Bear',
    species: 'Sun Bear',
    avatar: '🐻',
    orderQuote: 'A rich golden honey tonic to glaze my berry pastries to perfection!',
    celebrationQuote: 'Mmm! Sweet, aromatic, and perfectly weighed! You are a master alchemist!',
  },
  {
    id: 'zephyr_gull',
    name: 'Zephyr Gull',
    species: 'Sky Gull',
    avatar: '🕊️',
    orderQuote: 'An aerodynamic cloud elixir for soaring over the grand ocean cliffs!',
    celebrationQuote: 'Spectacular equilibrium! The air currents will carry me effortlessly now!',
  },
  {
    id: 'pippin_hedgehog',
    name: 'Pippin Hedgehog',
    species: 'Silver Hedgehog',
    avatar: '🦔',
    orderQuote: 'A refreshing dew essence for watering the rare crystal ferns!',
    celebrationQuote: 'My little garden will blossom with rainbow petals thanks to your recipe!',
  },
  {
    id: 'octo_scribe',
    name: 'Octo Scribe',
    species: 'Luminous Octopus',
    avatar: '🐙',
    orderQuote: 'A dense bioluminescent ink potion for recording ancient undersea tales!',
    celebrationQuote: 'Incredible density and balance! The deep archive scrolls will glow forever!',
  },
  {
    id: 'chrono_tortoise',
    name: 'Chrono Tortoise',
    species: 'Brass Tortoise',
    avatar: '🐢',
    orderQuote: 'A finely calibrated oil elixir to lubricate my clockwork pendulum gears!',
    celebrationQuote: 'Tick-tock, perfect timing! The great tower clock beats in exact harmony!',
  },
]

const PROCEDURAL_POTION_TEMPLATES = [
  {
    name: 'Starlight Luminary Tonic',
    emoji: '🧪',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.6)',
    concept: {
      conceptTitle: 'Liquid Density & Buoyancy',
      scienceTopic: 'Fluid Mechanics & Specific Gravity',
      funFact: 'Liquids with different densities can float in distinct colorful layers without mixing!',
      kidExplanation: 'Dense liquids have molecules packed tightly together, while light liquids float on top.',
    },
  },
  {
    name: 'Sunfire Elixir of Vitality',
    emoji: '☀️',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.6)',
    concept: {
      conceptTitle: 'Conservation of Mass in Mixtures',
      scienceTopic: 'Mass Balance & Alchemy',
      funFact: 'In 1789, Antoine Lavoisier proved that the total mass before mixing equals the total mass after!',
      kidExplanation: 'When you combine weights and liquids, not a single speck of matter disappears.',
    },
  },
  {
    name: 'Prismatic Aurora Draught',
    emoji: '🌈',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)',
    concept: {
      conceptTitle: 'Rational Fractions & Portions',
      scienceTopic: 'Fractional Arithmetic & Parts of a Whole',
      funFact: 'Ancient Egyptian scribes used unit fractions like 1/2, 1/4, and 1/8 to measure golden barley grain!',
      kidExplanation: 'Four quarter-grams combine to make one whole gram, just like puzzle pieces.',
    },
  },
  {
    name: 'Verdant Forest Dew Nectar',
    emoji: '🍃',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)',
    concept: {
      conceptTitle: 'Fulcrum Equilibrium & Levers',
      scienceTopic: 'Torque, Levers & Archimedes Principle',
      funFact: 'Archimedes once declared: "Give me a lever long enough and a fulcrum on which to place it, and I shall move the world!"',
      kidExplanation: 'A balance scale is a simple machine called a lever. Equal masses at equal distances balance out.',
    },
  },
]

/**
 * Generate infinite procedural potion orders with algebraic equations and scientific dossiers
 */
export function generateProceduralPotionOrder(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): PotionScalesPuzzle {
  const prng = createPRNG(`${seed}_ps_${difficulty}_${explorerLevel}`)
  const custIndex = Math.floor(prng() * PROCEDURAL_CUSTOMERS.length)
  const customer = PROCEDURAL_CUSTOMERS[custIndex]

  const templIndex = Math.floor(prng() * PROCEDURAL_POTION_TEMPLATES.length)
  const template = PROCEDURAL_POTION_TEMPLATES[templIndex]

  if (difficulty === 'easy') {
    // Easy: Whole number balance (e.g. 5g = 2g + ?g)
    const targetWeights = [4, 5, 6, 7, 8, 9, 10]
    const targetW = targetWeights[Math.floor(prng() * targetWeights.length)]
    const fixedRightW = Math.max(1, Math.floor(prng() * (targetW - 1)))
    const missingW = targetW - fixedRightW

    const leftStarting: WeightItem[] = [
      {
        id: `target_order_${targetW}`,
        name: `Order Flask (${targetW}g)`,
        emoji: template.emoji,
        weight: targetW,
        displayWeightLabel: `${targetW}g`,
        type: 'liquid_beaker',
        color: template.color,
        glowColor: template.glow,
      },
    ]

    const rightStarting: WeightItem[] = fixedRightW > 0 ? [
      {
        id: `right_base_${fixedRightW}`,
        name: `Base Ingot (${fixedRightW}g)`,
        emoji: '🌟',
        weight: fixedRightW,
        displayWeightLabel: `${fixedRightW}g`,
        type: 'ingot',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.6)',
      },
    ] : []

    const inventory: WeightItem[] = [
      MASTER_POTION_WEIGHTS.moonstone_1,
      MASTER_POTION_WEIGHTS.star_gem_2,
      MASTER_POTION_WEIGHTS.emerald_leaf_3,
      MASTER_POTION_WEIGHTS.amber_ingot_5,
    ]

    return {
      id: `proc_potion_${String(seed).slice(0, 10)}_${difficulty}`,
      title: `${customer.name}'s ${template.name}`,
      difficulty: 'easy',
      tierNumber: 1,
      parMoves: 2,
      recipe: {
        potionId: `proc_pot_${seed}`,
        potionName: template.name,
        potionEmoji: template.emoji,
        potionColor: template.color,
        potionGlow: template.glow,
        targetWeight: targetW,
        displayTargetFormula: `${targetW}g = ${fixedRightW > 0 ? `${fixedRightW}g + ` : ''}?g`,
        customer,
        leftStartingItems: leftStarting,
        rightStartingItems: rightStarting,
        availableInventory: inventory,
        solutionHint: `Add weights equaling ${missingW}g to the right pan to balance the scale.`,
      },
      scientificConcept: template.concept,
    }
  } else if (difficulty === 'medium') {
    // Medium: Multi-step equation (e.g. 12g = 4g + ?g)
    const targetW = 8 + Math.floor(prng() * 10)
    const fixedRightW = 3 + Math.floor(prng() * 4)
    const missingW = targetW - fixedRightW

    const leftStarting: WeightItem[] = [
      {
        id: `target_order_${targetW}`,
        name: `${template.name} (${targetW}g)`,
        emoji: template.emoji,
        weight: targetW,
        displayWeightLabel: `${targetW}g`,
        type: 'liquid_beaker',
        color: template.color,
        glowColor: template.glow,
      },
    ]

    const rightStarting: WeightItem[] = [
      {
        id: `right_base_${fixedRightW}`,
        name: `Catalyst Shard (${fixedRightW}g)`,
        emoji: '🔮',
        weight: fixedRightW,
        displayWeightLabel: `${fixedRightW}g`,
        type: 'crystal',
        color: '#c084fc',
        glowColor: 'rgba(192, 132, 252, 0.6)',
      },
    ]

    const inventory: WeightItem[] = [
      MASTER_POTION_WEIGHTS.moonstone_1,
      MASTER_POTION_WEIGHTS.star_gem_2,
      MASTER_POTION_WEIGHTS.emerald_leaf_3,
      MASTER_POTION_WEIGHTS.sapphire_drop_4,
      MASTER_POTION_WEIGHTS.amber_ingot_5,
      MASTER_POTION_WEIGHTS.ruby_core_6,
    ]

    return {
      id: `proc_potion_${String(seed).slice(0, 10)}_${difficulty}`,
      title: `${customer.name}'s ${template.name}`,
      difficulty: 'medium',
      tierNumber: 2,
      parMoves: 3,
      recipe: {
        potionId: `proc_pot_${seed}`,
        potionName: template.name,
        potionEmoji: template.emoji,
        potionColor: template.color,
        potionGlow: template.glow,
        targetWeight: targetW,
        displayTargetFormula: `${targetW}g = ${fixedRightW}g + ?g`,
        customer,
        leftStartingItems: leftStarting,
        rightStartingItems: rightStarting,
        availableInventory: inventory,
        solutionHint: `Find weights that sum up to ${missingW}g (${targetW} - ${fixedRightW} = ${missingW}).`,
      },
      scientificConcept: template.concept,
    }
  } else {
    // Hard: Fractional balance (e.g. 4.5g = 1.25g + ?g)
    const fractions = [0.25, 0.5, 0.75]
    const baseW = 3 + Math.floor(prng() * 4)
    const fracLeft = fractions[Math.floor(prng() * fractions.length)]
    const targetW = baseW + fracLeft

    const fixedRightBase = 1 + Math.floor(prng() * 2)
    const fracRight = fractions[Math.floor(prng() * fractions.length)]
    const fixedRightW = fixedRightBase + fracRight
    const missingW = Math.round((targetW - fixedRightW) * 100) / 100

    const leftStarting: WeightItem[] = [
      {
        id: `target_frac_${targetW}`,
        name: `Prismatic Crucible (${targetW}g)`,
        emoji: '🏆',
        weight: targetW,
        displayWeightLabel: `${targetW}g`,
        type: 'liquid_beaker',
        color: template.color,
        glowColor: template.glow,
      },
    ]

    const rightStarting: WeightItem[] = [
      {
        id: `right_frac_${fixedRightW}`,
        name: `Essence Vial (${fixedRightW}g)`,
        emoji: '🧪',
        weight: fixedRightW,
        displayWeightLabel: `${fixedRightW}g`,
        type: 'gem',
        color: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.6)',
      },
    ]

    const inventory: WeightItem[] = [
      MASTER_POTION_WEIGHTS.quarter_gem_quarter,
      MASTER_POTION_WEIGHTS.half_crystal_half,
      MASTER_POTION_WEIGHTS.three_quarters_shard,
      MASTER_POTION_WEIGHTS.moonstone_1,
      MASTER_POTION_WEIGHTS.star_gem_2,
      MASTER_POTION_WEIGHTS.emerald_leaf_3,
    ]

    return {
      id: `proc_potion_${String(seed).slice(0, 10)}_${difficulty}`,
      title: `${customer.name}'s ${template.name}`,
      difficulty: 'hard',
      tierNumber: 3,
      parMoves: 3,
      recipe: {
        potionId: `proc_pot_${seed}`,
        potionName: template.name,
        potionEmoji: template.emoji,
        potionColor: template.color,
        potionGlow: template.glow,
        targetWeight: targetW,
        displayTargetFormula: `${targetW}g = ${fixedRightW}g + ?g`,
        customer,
        leftStartingItems: leftStarting,
        rightStartingItems: rightStarting,
        availableInventory: inventory,
        solutionHint: `Subtract fractions: ${targetW}g - ${fixedRightW}g = ${missingW}g.`,
      },
      scientificConcept: template.concept,
    }
  }
}

export function generatePotionPuzzle(
  seed: string | number,
  difficulty: DifficultyTier = 'easy',
  explorerLevel: number = 1
): PotionScalesPuzzle {
  const filtered = CURATED_POTION_PUZZLES.filter((p) => p.difficulty === difficulty)

  if (typeof seed === 'number' && seed < filtered.length) {
    const basePuzzle = filtered[seed] || filtered[0]
    return {
      ...basePuzzle,
      id: `${basePuzzle.id}_seed_${seed}`,
    }
  }

  if (typeof seed === 'string' && seed.startsWith('curated_')) {
    const found = CURATED_POTION_PUZZLES.find((p) => p.id === seed)
    if (found) return found
  }

  return generateProceduralPotionOrder(seed, difficulty, explorerLevel)
}

// ==========================================
// 5. ENGINE STATE REDUCER & INITIALIZER
// ==========================================

export function getInitialPotionState(puzzle: PotionScalesPuzzle): PotionScalesState {
  const leftInitial: PlacedWeightInstance[] = puzzle.recipe.leftStartingItems.map((item, idx) => ({
    instanceId: `left_start_${idx}_${item.id}`,
    item,
    pan: 'left',
    placedAtTimestamp: Date.now(),
  }))

  const rightInitial: PlacedWeightInstance[] = puzzle.recipe.rightStartingItems.map((item, idx) => ({
    instanceId: `right_start_${idx}_${item.id}`,
    item,
    pan: 'right',
    placedAtTimestamp: Date.now(),
  }))

  const initialPlaced = [...leftInitial, ...rightInitial]
  const equilibrium = calculateScaleEquilibrium(leftInitial, rightInitial)

  return {
    currentPuzzle: puzzle,
    status: equilibrium.isBalanced ? 'balanced' : 'brewing',
    placedItems: initialPlaced,
    activeSelectedItem: null,
    activePourVolumeMl: 0,
    movesCount: 0,
    timeElapsedSeconds: 0,
    mistakesCount: 0,
    equilibrium,
    telemetry: {
      puzzleId: puzzle.id,
      difficulty: puzzle.difficulty,
      movesCount: 0,
      timeElapsedSeconds: 0,
      mistakesCount: 0,
      score: 0,
      stars: 0,
      xp: 0,
      finalStatus: 'in_progress',
    },
  }
}

export function evaluatePotionAction(
  state: PotionScalesState,
  action: PotionScalesAction
): PotionScalesState {
  switch (action.type) {
    case 'SELECT_INVENTORY_ITEM': {
      return {
        ...state,
        activeSelectedItem: action.item,
      }
    }

    case 'PLACE_ITEM': {
      const newInstance: PlacedWeightInstance = {
        instanceId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        item: action.item,
        pan: action.pan,
        placedAtTimestamp: Date.now(),
      }

      const updatedPlaced = [...state.placedItems, newInstance]
      const leftItems = updatedPlaced.filter((i) => i.pan === 'left')
      const rightItems = updatedPlaced.filter((i) => i.pan === 'right')
      const equilibrium = calculateScaleEquilibrium(leftItems, rightItems)

      const movesCount = state.movesCount + 1
      const isNewlyBalanced = equilibrium.isBalanced

      let score = state.telemetry.score
      let stars = state.telemetry.stars
      let xp = state.telemetry.xp
      let finalStatus = state.telemetry.finalStatus

      if (isNewlyBalanced) {
        const calculated = calculatePotionScore(
          {
            ...state.telemetry,
            movesCount,
            finalStatus: 'solved',
          },
          state.currentPuzzle
        )
        score = calculated.score
        stars = calculated.stars
        xp = calculated.xp
        finalStatus = 'solved'
      }

      return {
        ...state,
        placedItems: updatedPlaced,
        movesCount,
        equilibrium,
        status: isNewlyBalanced ? 'balanced' : 'brewing',
        telemetry: {
          ...state.telemetry,
          movesCount,
          score,
          stars,
          xp,
          finalStatus,
        },
      }
    }

    case 'REMOVE_ITEM': {
      const updatedPlaced = state.placedItems.filter((i) => i.instanceId !== action.instanceId)
      const leftItems = updatedPlaced.filter((i) => i.pan === 'left')
      const rightItems = updatedPlaced.filter((i) => i.pan === 'right')
      const equilibrium = calculateScaleEquilibrium(leftItems, rightItems)

      return {
        ...state,
        placedItems: updatedPlaced,
        movesCount: state.movesCount + 1,
        equilibrium,
        status: equilibrium.isBalanced ? 'balanced' : 'brewing',
      }
    }

    case 'CLEAR_PAN': {
      // Keep only initial locked items, clear placed inventory items
      const updatedPlaced = state.placedItems.filter(
        (i) => i.pan !== action.pan || i.instanceId.startsWith(`${action.pan}_start_`)
      )
      const leftItems = updatedPlaced.filter((i) => i.pan === 'left')
      const rightItems = updatedPlaced.filter((i) => i.pan === 'right')
      const equilibrium = calculateScaleEquilibrium(leftItems, rightItems)

      return {
        ...state,
        placedItems: updatedPlaced,
        movesCount: state.movesCount + 1,
        equilibrium,
        status: equilibrium.isBalanced ? 'balanced' : 'brewing',
      }
    }

    case 'POUR_LIQUID': {
      const weightFromLiquid = (action.amountMl / 100) * (action.weightPerMl ?? 1)
      const liquidItem: WeightItem = {
        id: `liquid_pour_${Date.now()}`,
        name: `Poured Liquid (${action.amountMl}ml)`,
        emoji: '💧',
        weight: Math.round(weightFromLiquid * 1000) / 1000,
        displayWeightLabel: `${action.amountMl}ml`,
        type: 'powder',
        color: '#06b6d4',
        glowColor: 'rgba(6, 182, 212, 0.6)',
      }

      const newInstance: PlacedWeightInstance = {
        instanceId: `poured_${Date.now()}`,
        item: liquidItem,
        pan: action.pan,
        placedAtTimestamp: Date.now(),
      }

      const updatedPlaced = [...state.placedItems, newInstance]
      const leftItems = updatedPlaced.filter((i) => i.pan === 'left')
      const rightItems = updatedPlaced.filter((i) => i.pan === 'right')
      const equilibrium = calculateScaleEquilibrium(leftItems, rightItems)

      return {
        ...state,
        placedItems: updatedPlaced,
        movesCount: state.movesCount + 1,
        equilibrium,
        status: equilibrium.isBalanced ? 'balanced' : 'brewing',
      }
    }

    case 'TICK_TIMER': {
      return {
        ...state,
        timeElapsedSeconds: state.timeElapsedSeconds + action.deltaSeconds,
        telemetry: {
          ...state.telemetry,
          timeElapsedSeconds: state.timeElapsedSeconds + action.deltaSeconds,
        },
      }
    }

    case 'RESET_PUZZLE': {
      return getInitialPotionState(state.currentPuzzle)
    }

    case 'LOAD_PUZZLE': {
      return getInitialPotionState(action.puzzle)
    }

    default:
      return state
  }
}

// ==========================================
// 6. SCORING & REWARD FORMULAS
// ==========================================

export function calculatePotionScore(
  telemetry: PotionScalesTelemetry,
  puzzle: PotionScalesPuzzle
): { score: number; stars: number; xp: number; isPerfect: boolean } {
  const isOptimalMoves = telemetry.movesCount <= puzzle.parMoves + 1
  const isFastTime = telemetry.timeElapsedSeconds <= 60

  let baseStars = 3
  let baseXP = 35

  if (puzzle.difficulty === 'medium') {
    baseStars = 5
    baseXP = 55
  } else if (puzzle.difficulty === 'hard') {
    baseStars = 8
    baseXP = 85
  }

  let bonusStars = 0
  let bonusXP = 0

  if (isOptimalMoves) {
    bonusStars += 1
    bonusXP += 10
  }

  if (isFastTime) {
    bonusStars += 1
    bonusXP += 10
  }

  const isPerfect = isOptimalMoves && telemetry.mistakesCount === 0

  return {
    score: 100 - Math.min(30, telemetry.mistakesCount * 5),
    stars: baseStars + bonusStars,
    xp: baseXP + bonusXP,
    isPerfect,
  }
}
