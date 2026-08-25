import type {
  InvestigationToolType,
  InvestigationTool,
  Suspect,
  Clue,
  DetectiveCase,
  DetectiveInvestigationState,
  DetectiveAction,
  CaseScoreResult,
  DetectiveTelemetry,
} from '../../types/games/mysteryDetective'
import type { DifficultyTier } from '../../types/experience'

export const INVESTIGATION_TOOLS: Record<InvestigationToolType, InvestigationTool> = {
  magnifying_glass: {
    id: 'magnifying_glass',
    name: 'Magnifying Glass',
    icon: '🔍',
    description: 'Zooms in to examine micro-fibers, thread colors, and delicate prints.',
    accentColor: '#f59e0b',
  },
  uv_brush: {
    id: 'uv_brush',
    name: 'UV Sparkle Brush',
    icon: '✨',
    description: 'Illuminates glowing footprints, magical residue, and hidden marks.',
    accentColor: '#8b5cf6',
  },
  sound_horn: {
    id: 'sound_horn',
    name: 'Listening Horn',
    icon: '👂',
    description: 'Detects soft ticking, rustling, and harmonic frequencies behind objects.',
    accentColor: '#06b6d4',
  },
  decoder_lens: {
    id: 'decoder_lens',
    name: 'Rune Decoder Lens',
    icon: '🔮',
    description: 'Deciphers encrypted symbols, secret ink, and optical puzzles.',
    accentColor: '#ec4899',
  },
}

/**
 * Master Suspect Catalog (12 Unique Whimsical Characters)
 */
export const MASTER_SUSPECTS: Record<string, Suspect> = {
  barnaby_bear: {
    id: 'barnaby_bear',
    name: 'Barnaby Bear',
    species: 'Sun Bear',
    avatar: '🐻',
    quote: 'I was just testing if the honey tarts were sweet enough!',
    traits: {
      height: 'tall',
      furOrFeathers: 'gold',
      diet: 'honey_pastry',
      accessory: 'hat',
      footprint: 'paw',
      habitat: 'forest',
    },
    innocentExplanation: 'Barnaby was in the kitchen measuring baker flour.',
    confessionQuote: 'I couldn’t resist the aroma! I promise to bake a fresh batch for everyone!',
  },
  pippin_hedgehog: {
    id: 'pippin_hedgehog',
    name: 'Pippin Hedgehog',
    species: 'Silver Hedgehog',
    avatar: '🦔',
    quote: 'I was tidying up the flowerpots in the conservatory.',
    traits: {
      height: 'tiny',
      furOrFeathers: 'silver',
      diet: 'sweet_fruit',
      accessory: 'scarf',
      footprint: 'claw',
      habitat: 'conservatory',
    },
    innocentExplanation: 'Pippin was watering the baby ferns on the lower shelf.',
    confessionQuote: 'The shiny glass sparkled like morning dew—I wanted to show it to my snail friends!',
  },
  professor_hoot: {
    id: 'professor_hoot',
    name: 'Professor Hoot',
    species: 'Midnight Owl',
    avatar: '🦉',
    quote: 'I was cataloging star constellations in the upper library.',
    traits: {
      height: 'short',
      furOrFeathers: 'midnight',
      diet: 'savory_seeds',
      accessory: 'glasses',
      footprint: 'claw',
      habitat: 'archives',
    },
    innocentExplanation: 'Professor Hoot was organizing antique parchment scrolls.',
    confessionQuote: 'I needed the lens to read the microscopic footnotes in the ancient starlight atlas!',
  },
  zephyr_gull: {
    id: 'zephyr_gull',
    name: 'Zephyr Gull',
    species: 'Sky Gull',
    avatar: '🕊️',
    quote: 'I was riding the ocean updrafts near the sky harbor.',
    traits: {
      height: 'tiny',
      furOrFeathers: 'white',
      diet: 'sparkle_dew',
      accessory: 'ribbon',
      footprint: 'webbed',
      habitat: 'sky_piers',
    },
    innocentExplanation: 'Zephyr was delivering mail to the floating lighthouse.',
    confessionQuote: 'The ribbon fluttered so nicely in the wind, I thought it was a festive streamer!',
  },
  felix_squirrel: {
    id: 'felix_squirrel',
    name: 'Felix Squirrel',
    species: 'Red Squirrel',
    avatar: '🐿️',
    quote: 'I was polishing clockwork gears in the grand bell tower.',
    traits: {
      height: 'short',
      furOrFeathers: 'crimson',
      diet: 'savory_seeds',
      accessory: 'boots',
      footprint: 'paw',
      habitat: 'clock_tower',
    },
    innocentExplanation: 'Felix was winding the pendulum spring.',
    confessionQuote: 'The gear had the most satisfying spin! I was calibrating my nut-cracking machine!',
  },
  glimmer_ferret: {
    id: 'glimmer_ferret',
    name: 'Glimmer Ferret',
    species: 'Emerald Ferret',
    avatar: '🦡',
    quote: 'I was inspecting gemstone veins in the crystal grotto.',
    traits: {
      height: 'short',
      furOrFeathers: 'emerald',
      diet: 'sweet_fruit',
      accessory: 'watch',
      footprint: 'claw',
      habitat: 'caverns',
    },
    innocentExplanation: 'Glimmer was polishing glowing quartz clusters.',
    confessionQuote: 'It glowed with such pretty colors! I wanted to brighten my underground burrow!',
  },
  luna_moth: {
    id: 'luna_moth',
    name: 'Luna Moth',
    species: 'Moon-Wing Moth',
    avatar: '🦋',
    quote: 'I was resting beneath the canopy of the whispering willow.',
    traits: {
      height: 'tiny',
      furOrFeathers: 'silver',
      diet: 'sparkle_dew',
      accessory: 'scarf',
      footprint: 'leaf_pad',
      habitat: 'forest',
    },
    innocentExplanation: 'Luna was drinking nectar from night-blooming jasmine.',
    confessionQuote: 'The silk thread felt so soft, I wanted to weave a cozy cocoon hammock!',
  },
  bramble_badger: {
    id: 'bramble_badger',
    name: 'Bramble Badger',
    species: 'Shadow Badger',
    avatar: '🦡',
    quote: 'I was sweeping the stone corridors of the royal archives.',
    traits: {
      height: 'tall',
      furOrFeathers: 'midnight',
      diet: 'honey_pastry',
      accessory: 'boots',
      footprint: 'claw',
      habitat: 'archives',
    },
    innocentExplanation: 'Bramble was stacking heavy oak book crates.',
    confessionQuote: 'I borrowed the key because the archive door was stuck and making squeaky noises!',
  },
  aurora_fox: {
    id: 'aurora_fox',
    name: 'Aurora Fox',
    species: 'Sunset Vulpix',
    avatar: '🦊',
    quote: 'I was sketching landscape paintings in the conservatory.',
    traits: {
      height: 'short',
      furOrFeathers: 'crimson',
      diet: 'sweet_fruit',
      accessory: 'glasses',
      footprint: 'paw',
      habitat: 'conservatory',
    },
    innocentExplanation: 'Aurora was mixing berry pigments on her palette.',
    confessionQuote: 'The prismatic crystal made the sunset rainbow 10 times brighter for my canvas!',
  },
  octo_scribe: {
    id: 'octo_scribe',
    name: 'Octo Scribe',
    species: 'Scholar Kraken',
    avatar: '🐙',
    quote: 'I was writing eight manuscripts simultaneously in the library.',
    traits: {
      height: 'tall',
      furOrFeathers: 'emerald',
      diet: 'savory_seeds',
      accessory: 'glasses',
      footprint: 'webbed',
      habitat: 'archives',
    },
    innocentExplanation: 'Octo was transcribing poetry with blue fountain ink.',
    confessionQuote: 'The golden tuning fork created the perfect rhythm for writing poetry stanzas!',
  },
  tide_otter: {
    id: 'tide_otter',
    name: 'Tide Otter',
    species: 'River Otter',
    avatar: '🦦',
    quote: 'I was juggling polished river pebbles at the dock.',
    traits: {
      height: 'short',
      furOrFeathers: 'gold',
      diet: 'sweet_fruit',
      accessory: 'scarf',
      footprint: 'webbed',
      habitat: 'sky_piers',
    },
    innocentExplanation: 'Tide was building a raft from driftwood.',
    confessionQuote: 'The shiny valve looked like the ultimate juggling sphere! Here it is, completely safe!',
  },
  chrono_tortoise: {
    id: 'chrono_tortoise',
    name: 'Chrono Tortoise',
    species: 'Ancient Tortoise',
    avatar: '🐢',
    quote: 'I was taking a peaceful 4-hour nap near the sundial.',
    traits: {
      height: 'short',
      furOrFeathers: 'gold',
      diet: 'moon_berries',
      accessory: 'watch',
      footprint: 'leaf_pad',
      habitat: 'clock_tower',
    },
    innocentExplanation: 'Chrono was admiring the shadow angles of the sundial.',
    confessionQuote: 'I borrowed the formula to calculate how many seconds I have spent relaxing today!',
  },
}

/**
 * 12 Curated Master Scenarios (4 Easy, 4 Medium, 4 Hard)
 */
export const CURATED_DETECTIVE_CASES: DetectiveCase[] = [
  // EASY 1: The Missing Honey Tart
  {
    id: 'easy_honey_tart',
    title: 'The Missing Honey Tart',
    locationName: 'Bakery Kitchen',
    locationEmoji: '🥐',
    victimName: 'Madame Brioche',
    victimEmoji: '👩‍🍳',
    missingItem: 'Golden Honey Tart',
    missingItemEmoji: '🥧',
    narrativeIntro: 'Madame Brioche left her award-winning honey tart on the cooling windowsill, but it vanished! Who took the sweet pastry?',
    difficulty: 'easy',
    suspectPool: [
      MASTER_SUSPECTS.barnaby_bear,
      MASTER_SUSPECTS.pippin_hedgehog,
      MASTER_SUSPECTS.zephyr_gull,
    ],
    culpritId: 'barnaby_bear',
    clues: [
      {
        id: 'clue_honey_tart_1',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'gold',
        textDescription: 'A strand of bright golden fur was snagged on the windowsill latch.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 220, y: 180 },
        icon: '🧶',
      },
      {
        id: 'clue_honey_tart_2',
        type: 'direct_match',
        traitKey: 'diet',
        expectedValue: 'honey_pastry',
        textDescription: 'A sticky trail of sweet honey glaze leads toward the suspect’s apron pocket.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 540, y: 320 },
        icon: '🍯',
      },
    ],
    hotspots: [
      {
        id: 'hs_window',
        clueId: 'clue_honey_tart_1',
        x: 220,
        y: 180,
        radius: 35,
        label: 'Windowsill Latch',
        hintText: 'Inspect the latch with your Magnifying Glass to check for snagged fibers.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_floor',
        clueId: 'clue_honey_tart_2',
        x: 540,
        y: 320,
        radius: 40,
        label: 'Kitchen Tile Trail',
        hintText: 'Sweep the floor with your UV Sparkle Brush to reveal hidden glaze footprints.',
        requiredTool: 'uv_brush',
      },
    ],
    parTimeSeconds: 45,
    scientificConcept: {
      title: 'Animal Olfaction & Scent Trails',
      description: 'Bears have an extraordinary sense of smell up to 7 times stronger than bloodhounds, allowing them to detect sweetness miles away!',
      funFact: 'Honeybees communicate the location of sweet nectar by performing an intricate figure-eight "waggle dance"!',
    },
  },

  // EASY 2: The Floating Star Lantern
  {
    id: 'easy_star_lantern',
    title: 'The Floating Star Lantern',
    locationName: 'Sky Pier Deck',
    locationEmoji: '⚓',
    victimName: 'Captain Feather',
    victimEmoji: '🦜',
    missingItem: 'Floating Star Lantern',
    missingItemEmoji: '🏮',
    narrativeIntro: 'Captain Feather’s beacon lantern untethered and drifted off! Someone with webbed feet was seen near the mooring lines.',
    difficulty: 'easy',
    suspectPool: [
      MASTER_SUSPECTS.zephyr_gull,
      MASTER_SUSPECTS.pippin_hedgehog,
      MASTER_SUSPECTS.felix_squirrel,
    ],
    culpritId: 'zephyr_gull',
    clues: [
      {
        id: 'clue_lantern_1',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'webbed',
        textDescription: 'Wet webbed footprints are stamped across the dock planks.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 380, y: 260 },
        icon: '🐾',
      },
      {
        id: 'clue_lantern_2',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'ribbon',
        textDescription: 'A silky fluttering ribbon was caught on the rope cleat.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 620, y: 150 },
        icon: '🎀',
      },
    ],
    hotspots: [
      {
        id: 'hs_planks',
        clueId: 'clue_lantern_1',
        x: 380,
        y: 260,
        radius: 35,
        label: 'Mooring Planks',
        hintText: 'Use the UV Brush to highlight wet footprints on the dock.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_cleat',
        clueId: 'clue_lantern_2',
        x: 620,
        y: 150,
        radius: 30,
        label: 'Rope Cleat',
        hintText: 'Inspect the rope cleat with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 45,
    scientificConcept: {
      title: 'Aerodynamic Lift & Coastal Webbing',
      description: 'Webbed feet act as natural hydrofoils in water and wide stabilizing rudders during aerial glides!',
      funFact: 'Albatrosses can glide for thousands of miles across oceans without flapping their wings once by riding wind gradients!',
    },
  },

  // EASY 3: The Swapped Magic Wand
  {
    id: 'easy_magic_wand',
    title: 'The Swapped Magic Wand',
    locationName: 'Academy Library',
    locationEmoji: '✨',
    victimName: 'Headmaster Merlin',
    victimEmoji: '🧙',
    missingItem: 'Prismatic Wand',
    missingItemEmoji: '🪄',
    narrativeIntro: 'The Headmaster’s wand was replaced with a silver paintbrush! Who borrowed the prismatic wand?',
    difficulty: 'easy',
    suspectPool: [
      MASTER_SUSPECTS.glimmer_ferret,
      MASTER_SUSPECTS.barnaby_bear,
      MASTER_SUSPECTS.professor_hoot,
    ],
    culpritId: 'glimmer_ferret',
    clues: [
      {
        id: 'clue_wand_1',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'emerald',
        textDescription: 'Glowing emerald fur fibers were left inside the velvet wand case.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 300, y: 200 },
        icon: '✨',
      },
      {
        id: 'clue_wand_2',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'watch',
        textDescription: 'A rhythmic ticking sound was heard near the gemstone desk drawer.',
        discoveryTool: 'sound_horn',
        hotspotLocation: { x: 500, y: 280 },
        icon: '⏱️',
      },
    ],
    hotspots: [
      {
        id: 'hs_case',
        clueId: 'clue_wand_1',
        x: 300,
        y: 200,
        radius: 35,
        label: 'Velvet Case',
        hintText: 'Inspect the open wand case with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_drawer',
        clueId: 'clue_wand_2',
        x: 500,
        y: 280,
        radius: 40,
        label: 'Desk Drawer',
        hintText: 'Listen to the drawer with the Listening Horn.',
        requiredTool: 'sound_horn',
      },
    ],
    parTimeSeconds: 45,
    scientificConcept: {
      title: 'Light Refraction & Prisms',
      description: 'A prism bends white light into its component rainbow spectrum because different light wavelengths travel at different speeds through glass.',
      funFact: 'Diamonds sparkle brilliantly because their high refractive index traps light inside in a dance of total internal reflection!',
    },
  },

  // EASY 4: The Whispering Garden Seed
  {
    id: 'easy_garden_seed',
    title: 'The Whispering Garden Seed',
    locationName: 'Botanical Greenhouse',
    locationEmoji: '🌿',
    victimName: 'Flora the Botanist',
    victimEmoji: '👩‍🌾',
    missingItem: 'Golden Sun-Seed',
    missingItemEmoji: '🌱',
    narrativeIntro: 'Flora’s prize Sun-Seed went missing from the glass pot! Who was digging in the conservatory soil?',
    difficulty: 'easy',
    suspectPool: [
      MASTER_SUSPECTS.pippin_hedgehog,
      MASTER_SUSPECTS.zephyr_gull,
      MASTER_SUSPECTS.professor_hoot,
    ],
    culpritId: 'pippin_hedgehog',
    clues: [
      {
        id: 'clue_seed_1',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'silver',
        textDescription: 'A small silver spine was embedded in the soft compost soil.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 260, y: 320 },
        icon: '🦔',
      },
      {
        id: 'clue_seed_2',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'scarf',
        textDescription: 'A warm woolen scarf thread was snagged on the watering can nozzle.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 580, y: 190 },
        icon: '🧣',
      },
    ],
    hotspots: [
      {
        id: 'hs_soil',
        clueId: 'clue_seed_1',
        x: 260,
        y: 320,
        radius: 35,
        label: 'Compost Bed',
        hintText: 'Inspect the compost soil with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_can',
        clueId: 'clue_seed_2',
        x: 580,
        y: 190,
        radius: 35,
        label: 'Watering Can',
        hintText: 'Examine the watering can with the UV Brush.',
        requiredTool: 'uv_brush',
      },
    ],
    parTimeSeconds: 45,
    scientificConcept: {
      title: 'Seed Dormancy & Germination',
      description: 'Seeds stay dormant in dry conditions and only trigger germination when water activates special enzymes that start embryonic growth.',
      funFact: 'Scientists sprouted a lotus flower seed that was over 1,300 years old, preserved in an ancient lakebed!',
    },
  },

  // MEDIUM 1: The Clockmaker's Escapement
  {
    id: 'med_clock_escapement',
    title: 'The Clockmaker’s Escapement',
    locationName: 'Grand Clock Tower',
    locationEmoji: '🕰️',
    victimName: 'Tick-Tock the Clockmaker',
    victimEmoji: '🦉',
    missingItem: 'Brass Escapement Wheel',
    missingItemEmoji: '⚙️',
    narrativeIntro: 'The master clock stopped ticking! The brass escapement wheel was taken by a resident wearing sturdy boots.',
    difficulty: 'medium',
    suspectPool: [
      MASTER_SUSPECTS.felix_squirrel,
      MASTER_SUSPECTS.bramble_badger,
      MASTER_SUSPECTS.barnaby_bear,
      MASTER_SUSPECTS.pippin_hedgehog,
    ],
    culpritId: 'felix_squirrel',
    clues: [
      {
        id: 'clue_clock_1',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'boots',
        textDescription: 'Deep boot prints were left in the clock grease near the pendulum base.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 320, y: 360 },
        icon: '👢',
      },
      {
        id: 'clue_clock_2',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'crimson',
        textDescription: 'A tuft of crimson red fur was caught between the brass cogs.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 480, y: 160 },
        icon: '🧶',
      },
      {
        id: 'clue_clock_3',
        type: 'direct_match',
        traitKey: 'height',
        expectedValue: 'short',
        textDescription: 'The culprit squeezed through a narrow 2-foot access hatch.',
        discoveryTool: 'sound_horn',
        hotspotLocation: { x: 180, y: 220 },
        icon: '📏',
      },
    ],
    hotspots: [
      {
        id: 'hs_pendulum',
        clueId: 'clue_clock_1',
        x: 320,
        y: 360,
        radius: 40,
        label: 'Pendulum Floor',
        hintText: 'Inspect the grease stains with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_cogs',
        clueId: 'clue_clock_2',
        x: 480,
        y: 160,
        radius: 35,
        label: 'Tower Cogs',
        hintText: 'Examine between the brass cogs with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_hatch',
        clueId: 'clue_clock_3',
        x: 180,
        y: 220,
        radius: 35,
        label: 'Access Hatch',
        hintText: 'Listen near the access hatch with the Listening Horn.',
        requiredTool: 'sound_horn',
      },
    ],
    parTimeSeconds: 60,
    scientificConcept: {
      title: 'Mechanical Pendulums & Escapements',
      description: 'An escapement wheel converts continuous rotational spring energy into precise, rhythmic ticks that keep time constant.',
      funFact: 'Galileo discovered the pendulum principle by observing a swinging chandelier in the Pisa Cathedral in 1581!',
    },
  },

  // MEDIUM 2: The Midnight Ink Spill
  {
    id: 'med_ink_spill',
    title: 'The Midnight Ink Spill',
    locationName: 'Royal Archive',
    locationEmoji: '📚',
    victimName: 'Archivist Thorne',
    victimEmoji: '🦔',
    missingItem: 'Enchanted Starlight Ink',
    missingItemEmoji: '🖋️',
    narrativeIntro: 'A jar of glowing starlight ink was taken from the scriptorium! Who was reading late into the night?',
    difficulty: 'medium',
    suspectPool: [
      MASTER_SUSPECTS.professor_hoot,
      MASTER_SUSPECTS.octo_scribe,
      MASTER_SUSPECTS.aurora_fox,
      MASTER_SUSPECTS.glimmer_ferret,
    ],
    culpritId: 'professor_hoot',
    clues: [
      {
        id: 'clue_ink_1',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'glasses',
        textDescription: 'A tiny eyeglass lens cloth was left on the reading desk.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 380, y: 220 },
        icon: '👓',
      },
      {
        id: 'clue_ink_2',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'midnight',
        textDescription: 'Midnight-colored feather barbs were found near the high book ladder.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 560, y: 140 },
        icon: '🪶',
      },
      {
        id: 'clue_ink_3',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'claw',
        textDescription: 'Sharp claw scratch marks were left on the wooden manuscript stand.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 220, y: 310 },
        icon: '🐾',
      },
    ],
    hotspots: [
      {
        id: 'hs_desk',
        clueId: 'clue_ink_1',
        x: 380,
        y: 220,
        radius: 35,
        label: 'Reading Desk',
        hintText: 'Inspect the desk surface with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_ladder',
        clueId: 'clue_ink_2',
        x: 560,
        y: 140,
        radius: 35,
        label: 'Book Ladder',
        hintText: 'Scan the high ladder rungs with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_stand',
        clueId: 'clue_ink_3',
        x: 220,
        y: 310,
        radius: 35,
        label: 'Manuscript Stand',
        hintText: 'Check the wooden stand for claw scratches with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 60,
    scientificConcept: {
      title: 'Fluid Viscosity & Capillary Action',
      description: 'Capillary action allows liquids like ink to flow upward through narrow fibers against gravity, making fountain pens and plant roots work!',
      funFact: 'Squid ink contains melanin—the exact same natural pigment that gives human hair and skin its color!',
    },
  },

  // MEDIUM 3: The Vanishing Prismatic Crystal
  {
    id: 'med_prismatic_crystal',
    title: 'The Vanishing Prismatic Crystal',
    locationName: 'Sunlit Greenhouse',
    locationEmoji: '🌺',
    victimName: 'Iris the Painter',
    victimEmoji: '🦚',
    missingItem: 'Prismatic Sun Crystal',
    missingItemEmoji: '💎',
    narrativeIntro: 'Iris’s prism crystal was borrowed to create rainbow refractions on a canvas! Who left crimson fur in the garden?',
    difficulty: 'medium',
    suspectPool: [
      MASTER_SUSPECTS.aurora_fox,
      MASTER_SUSPECTS.felix_squirrel,
      MASTER_SUSPECTS.glimmer_ferret,
      MASTER_SUSPECTS.tide_otter,
    ],
    culpritId: 'aurora_fox',
    clues: [
      {
        id: 'clue_prism_1',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'crimson',
        textDescription: 'Crimson brush hairs and fur were found on the easel stand.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 310, y: 210 },
        icon: '🎨',
      },
      {
        id: 'clue_prism_2',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'glasses',
        textDescription: 'Spectacle wire marks were impressed on the soft artist clay.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 490, y: 280 },
        icon: '👓',
      },
      {
        id: 'clue_prism_3',
        type: 'direct_match',
        traitKey: 'habitat',
        expectedValue: 'conservatory',
        textDescription: 'Greenhouse orchid pollen was clinging to the easel peg.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 620, y: 150 },
        icon: '🌸',
      },
    ],
    hotspots: [
      {
        id: 'hs_easel',
        clueId: 'clue_prism_1',
        x: 310,
        y: 210,
        radius: 35,
        label: 'Easel Stand',
        hintText: 'Inspect the easel stand with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_clay',
        clueId: 'clue_prism_2',
        x: 490,
        y: 280,
        radius: 35,
        label: 'Clay Table',
        hintText: 'Use the UV Brush on the clay impressions.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_peg',
        clueId: 'clue_prism_3',
        x: 620,
        y: 150,
        radius: 35,
        label: 'Orchid Peg',
        hintText: 'Check for pollen using the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 60,
    scientificConcept: {
      title: 'Color Wavelengths & Pigment Mixing',
      description: 'Light combines additively (RGB to White), whereas paint pigments mix subtractively (CMYK to Dark), absorbing specific light wavelengths.',
      funFact: 'Butterflies do not have colorful pigment in their wings—their iridescent blue shimmer comes from microscopic light-scattering nano-scales!',
    },
  },

  // MEDIUM 4: The Starlight Observatory Dial
  {
    id: 'med_observatory_dial',
    title: 'The Observatory Starlight Dial',
    locationName: 'Sky Dome Observatory',
    locationEmoji: '🔭',
    victimName: 'Astronomer Stella',
    victimEmoji: '🌟',
    missingItem: 'Starlight Dial',
    missingItemEmoji: '🧭',
    narrativeIntro: 'The dome telescope’s alignment dial was borrowed! Who left webbed prints and loves sweet fruit?',
    difficulty: 'medium',
    suspectPool: [
      MASTER_SUSPECTS.tide_otter,
      MASTER_SUSPECTS.zephyr_gull,
      MASTER_SUSPECTS.octo_scribe,
      MASTER_SUSPECTS.barnaby_bear,
    ],
    culpritId: 'tide_otter',
    clues: [
      {
        id: 'clue_dial_1',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'webbed',
        textDescription: 'Wet webbed river prints were left on the telescope brass pedals.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 360, y: 340 },
        icon: '🐾',
      },
      {
        id: 'clue_dial_2',
        type: 'direct_match',
        traitKey: 'diet',
        expectedValue: 'sweet_fruit',
        textDescription: 'A crushed sweet star-berry was left on the observatory seat.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 520, y: 240 },
        icon: '🍓',
      },
      {
        id: 'clue_dial_3',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'scarf',
        textDescription: 'A damp blue scarf fringe was caught on the telescope dome lever.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 210, y: 150 },
        icon: '🧣',
      },
    ],
    hotspots: [
      {
        id: 'hs_pedals',
        clueId: 'clue_dial_1',
        x: 360,
        y: 340,
        radius: 40,
        label: 'Telescope Pedals',
        hintText: 'Inspect the pedals with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_seat',
        clueId: 'clue_dial_2',
        x: 520,
        y: 240,
        radius: 35,
        label: 'Observatory Seat',
        hintText: 'Examine the fruit residue with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_lever',
        clueId: 'clue_dial_3',
        x: 210,
        y: 150,
        radius: 35,
        label: 'Dome Lever',
        hintText: 'Inspect the lever with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 60,
    scientificConcept: {
      title: 'Celestial Coordinates & Telescopes',
      description: 'Telescopes track stars across the night sky by compensating for Earth’s rotation using motorized equatorial mounts.',
      funFact: 'Because light takes time to travel through space, when you look at distant galaxies through a telescope, you are literally looking into the past!',
    },
  },

  // HARD 1: The Alchemist's Master Formula
  {
    id: 'hard_alchemist_formula',
    title: 'The Alchemist’s Master Formula',
    locationName: 'Alchemy Sanctum',
    locationEmoji: '🧪',
    victimName: 'Master Aurelius',
    victimEmoji: '🧙‍♂️',
    missingItem: 'Golden Formula Scroll',
    missingItemEmoji: '📜',
    narrativeIntro: 'The secret formula for transmutation was borrowed from the inner vault! The culprit is wearing a watch and loves moon berries.',
    difficulty: 'hard',
    suspectPool: [
      MASTER_SUSPECTS.chrono_tortoise,
      MASTER_SUSPECTS.glimmer_ferret,
      MASTER_SUSPECTS.bramble_badger,
      MASTER_SUSPECTS.professor_hoot,
      MASTER_SUSPECTS.octo_scribe,
    ],
    culpritId: 'chrono_tortoise',
    clues: [
      {
        id: 'clue_form_1',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'watch',
        textDescription: 'A slow ticking clockwork resonance echoes near the vault threshold.',
        discoveryTool: 'sound_horn',
        hotspotLocation: { x: 260, y: 220 },
        icon: '⏱️',
      },
      {
        id: 'clue_form_2',
        type: 'direct_match',
        traitKey: 'diet',
        expectedValue: 'moon_berries',
        textDescription: 'Phosphorescent purple moon berry stains were found on the beaker stand.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 450, y: 180 },
        icon: '🫐',
      },
      {
        id: 'clue_form_3',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'leaf_pad',
        textDescription: 'Gentle, broad leaf-pad impressions were left in the mineral dust.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 600, y: 320 },
        icon: '🐾',
      },
      {
        id: 'clue_form_4',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'gold',
        textDescription: 'Golden shell lacquer flecks were left on the brass scroll holder.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 380, y: 300 },
        icon: '✨',
      },
    ],
    hotspots: [
      {
        id: 'hs_vault',
        clueId: 'clue_form_1',
        x: 260,
        y: 220,
        radius: 35,
        label: 'Vault Threshold',
        hintText: 'Listen near the vault door with the Listening Horn.',
        requiredTool: 'sound_horn',
      },
      {
        id: 'hs_beaker',
        clueId: 'clue_form_2',
        x: 450,
        y: 180,
        radius: 35,
        label: 'Beaker Stand',
        hintText: 'Illuminate the beaker stand with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_dust',
        clueId: 'clue_form_3',
        x: 600,
        y: 320,
        radius: 35,
        label: 'Mineral Dust',
        hintText: 'Examine the footprints with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_scroll',
        clueId: 'clue_form_4',
        x: 380,
        y: 300,
        radius: 35,
        label: 'Scroll Holder',
        hintText: 'Check the scroll holder with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 75,
    scientificConcept: {
      title: 'Chemical Conservation of Mass',
      description: 'In all chemical reactions, mass is neither created nor destroyed; atoms merely rearrange to form new molecular substances.',
      funFact: 'Antoine Lavoisier proved the conservation of mass in 1789 by sealing chemical reactions in airtight glass containers and weighing them!',
    },
  },

  // HARD 2: The Sovereign Sun-Crest
  {
    id: 'hard_sun_crest',
    title: 'The Sovereign Sun-Crest',
    locationName: 'Grand Royal Archive',
    locationEmoji: '👑',
    victimName: 'King Aurel',
    victimEmoji: '🦁',
    missingItem: 'Sovereign Sun-Crest',
    missingItemEmoji: '☀️',
    narrativeIntro: 'The royal sun-crest vanished from the archive pedestal! Who is tall, wears boots, and loves honey pastries?',
    difficulty: 'hard',
    suspectPool: [
      MASTER_SUSPECTS.bramble_badger,
      MASTER_SUSPECTS.barnaby_bear,
      MASTER_SUSPECTS.octo_scribe,
      MASTER_SUSPECTS.professor_hoot,
      MASTER_SUSPECTS.chrono_tortoise,
    ],
    culpritId: 'bramble_badger',
    clues: [
      {
        id: 'clue_crest_1',
        type: 'direct_match',
        traitKey: 'height',
        expectedValue: 'tall',
        textDescription: 'The thief reached a high 6-foot shelf without using a ladder.',
        discoveryTool: 'sound_horn',
        hotspotLocation: { x: 210, y: 120 },
        icon: '📏',
      },
      {
        id: 'clue_crest_2',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'boots',
        textDescription: 'Heavy cobblestone boot marks were left near the velvet ropes.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 420, y: 340 },
        icon: '👢',
      },
      {
        id: 'clue_crest_3',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'midnight',
        textDescription: 'Midnight-black badger hairs were caught on the display clasp.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 550, y: 210 },
        icon: '🧶',
      },
      {
        id: 'clue_crest_4',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'claw',
        textDescription: 'Sturdy digging claw impressions were stamped in the doorway wax.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 320, y: 260 },
        icon: '🐾',
      },
    ],
    hotspots: [
      {
        id: 'hs_shelf',
        clueId: 'clue_crest_1',
        x: 210,
        y: 120,
        radius: 35,
        label: 'High Shelf',
        hintText: 'Listen near the high shelf with the Listening Horn.',
        requiredTool: 'sound_horn',
      },
      {
        id: 'hs_ropes',
        clueId: 'clue_crest_2',
        x: 420,
        y: 340,
        radius: 35,
        label: 'Velvet Ropes',
        hintText: 'Inspect the floor near the ropes with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_clasp',
        clueId: 'clue_crest_3',
        x: 550,
        y: 210,
        radius: 35,
        label: 'Display Clasp',
        hintText: 'Examine the clasp with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_wax',
        clueId: 'clue_crest_4',
        x: 320,
        y: 260,
        radius: 35,
        label: 'Doorway Wax',
        hintText: 'Check the doorway wax with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 75,
    scientificConcept: {
      title: 'Solar Flares & Photons',
      description: 'Light particles called photons take over 100,000 years to travel from the Sun’s core to its surface, but only 8 minutes to reach Earth!',
      funFact: 'A single solar flare can release the equivalent energy of millions of 100-megaton hydrogen bombs exploding simultaneously!',
    },
  },

  // HARD 3: The Submarine Valve Mystery
  {
    id: 'hard_submarine_valve',
    title: 'The Submarine Valve Mystery',
    locationName: 'Abyssal Harbor Dock',
    locationEmoji: '🌊',
    victimName: 'Captain Coral',
    victimEmoji: '🤿',
    missingItem: 'Pressure Valve Wheel',
    missingItemEmoji: '⚙️',
    narrativeIntro: 'The deep-sea sub’s ballast valve was borrowed! Who is tall, wears glasses, and writes with ink?',
    difficulty: 'hard',
    suspectPool: [
      MASTER_SUSPECTS.octo_scribe,
      MASTER_SUSPECTS.tide_otter,
      MASTER_SUSPECTS.bramble_badger,
      MASTER_SUSPECTS.glimmer_ferret,
      MASTER_SUSPECTS.luna_moth,
    ],
    culpritId: 'octo_scribe',
    clues: [
      {
        id: 'clue_valve_1',
        type: 'direct_match',
        traitKey: 'height',
        expectedValue: 'tall',
        textDescription: 'The valve was unbolted from the top hull 7 feet above the dock.',
        discoveryTool: 'sound_horn',
        hotspotLocation: { x: 280, y: 140 },
        icon: '📏',
      },
      {
        id: 'clue_valve_2',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'webbed',
        textDescription: 'Eight suction-cup webbed prints were stamped along the ballast line.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 480, y: 320 },
        icon: '🐾',
      },
      {
        id: 'clue_valve_3',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'glasses',
        textDescription: 'A pair of brass scholar spectacle frames left scratch marks on the pipe.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 620, y: 220 },
        icon: '👓',
      },
      {
        id: 'clue_valve_4',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'emerald',
        textDescription: 'Emerald green bioluminescent skin cells were left on the valve stem.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 380, y: 220 },
        icon: '✨',
      },
    ],
    hotspots: [
      {
        id: 'hs_hull',
        clueId: 'clue_valve_1',
        x: 280,
        y: 140,
        radius: 35,
        label: 'Submarine Hull',
        hintText: 'Listen near the top hull with the Listening Horn.',
        requiredTool: 'sound_horn',
      },
      {
        id: 'hs_ballast',
        clueId: 'clue_valve_2',
        x: 480,
        y: 320,
        radius: 40,
        label: 'Ballast Line',
        hintText: 'Inspect the ballast prints with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_pipe',
        clueId: 'clue_valve_3',
        x: 620,
        y: 220,
        radius: 35,
        label: 'Pipe Fitting',
        hintText: 'Check the pipe for scratch marks with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_stem',
        clueId: 'clue_valve_4',
        x: 380,
        y: 220,
        radius: 35,
        label: 'Valve Stem',
        hintText: 'Inspect the valve stem with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 75,
    scientificConcept: {
      title: 'Hydrostatic Pressure & Buoyancy',
      description: 'Submarines dive by flooding ballast tanks with heavy seawater and surface by blowing compressed air into the tanks to displace the water.',
      funFact: 'The Mariana Trench is nearly 36,000 feet deep—the water pressure at the bottom is over 1,000 times greater than atmospheric pressure!',
    },
  },

  // HARD 4: The Grand Orchestral Tuning Fork
  {
    id: 'hard_tuning_fork',
    title: 'The Grand Orchestral Tuning Fork',
    locationName: 'Symphony Concert Hall',
    locationEmoji: '🎻',
    victimName: 'Maestro Lyra',
    victimEmoji: '🦩',
    missingItem: 'Concert Tuning Fork',
    missingItemEmoji: '🎵',
    narrativeIntro: 'The pure 440Hz concert tuning fork went missing right before the overture! Who is short, has emerald fur, and loves fruit?',
    difficulty: 'hard',
    suspectPool: [
      MASTER_SUSPECTS.glimmer_ferret,
      MASTER_SUSPECTS.aurora_fox,
      MASTER_SUSPECTS.felix_squirrel,
      MASTER_SUSPECTS.pippin_hedgehog,
      MASTER_SUSPECTS.chrono_tortoise,
    ],
    culpritId: 'glimmer_ferret',
    clues: [
      {
        id: 'clue_fork_1',
        type: 'direct_match',
        traitKey: 'furOrFeathers',
        expectedValue: 'emerald',
        textDescription: 'Emerald green ferret hairs were caught on the conductor’s velvet podium.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 340, y: 220 },
        icon: '🧶',
      },
      {
        id: 'clue_fork_2',
        type: 'direct_match',
        traitKey: 'accessory',
        expectedValue: 'watch',
        textDescription: 'A rhythmic metallic watch chime resonated near the music stand.',
        discoveryTool: 'sound_horn',
        hotspotLocation: { x: 520, y: 160 },
        icon: '⏱️',
      },
      {
        id: 'clue_fork_3',
        type: 'direct_match',
        traitKey: 'diet',
        expectedValue: 'sweet_fruit',
        textDescription: 'Sweet berry juice stains were left on the golden violin chin rest.',
        discoveryTool: 'uv_brush',
        hotspotLocation: { x: 220, y: 310 },
        icon: '🍓',
      },
      {
        id: 'clue_fork_4',
        type: 'direct_match',
        traitKey: 'footprint',
        expectedValue: 'claw',
        textDescription: 'Delicate climbing claw scratches were left on the mahogany harp base.',
        discoveryTool: 'magnifying_glass',
        hotspotLocation: { x: 610, y: 280 },
        icon: '🐾',
      },
    ],
    hotspots: [
      {
        id: 'hs_podium',
        clueId: 'clue_fork_1',
        x: 340,
        y: 220,
        radius: 35,
        label: 'Conductor Podium',
        hintText: 'Examine the podium with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
      {
        id: 'hs_stand',
        clueId: 'clue_fork_2',
        x: 520,
        y: 160,
        radius: 35,
        label: 'Music Stand',
        hintText: 'Listen near the music stand with the Listening Horn.',
        requiredTool: 'sound_horn',
      },
      {
        id: 'hs_violin',
        clueId: 'clue_fork_3',
        x: 220,
        y: 310,
        radius: 35,
        label: 'Violin Rest',
        hintText: 'Check for fruit residue with the UV Brush.',
        requiredTool: 'uv_brush',
      },
      {
        id: 'hs_harp',
        clueId: 'clue_fork_4',
        x: 610,
        y: 280,
        radius: 35,
        label: 'Harp Base',
        hintText: 'Inspect the claw marks on the harp base with the Magnifying Glass.',
        requiredTool: 'magnifying_glass',
      },
    ],
    parTimeSeconds: 75,
    scientificConcept: {
      title: 'Acoustic Resonance & Frequencies',
      description: 'A tuning fork vibrates at a precise frequency (like 440 vibrations per second for Note A), pushing surrounding air molecules into pure sound waves.',
      funFact: 'Opera singers can shatter crystal wine glasses by singing a note that matches the glass’s natural resonant frequency with enough acoustic power!',
    },
  },
]

/**
 * Constraint Solver: Evaluates a suspect against a single clue
 */
export function evaluateSuspectAgainstClue(
  suspect: Suspect,
  clue: Clue,
  suspectPool: Suspect[]
): boolean {
  switch (clue.type) {
    case 'direct_match': {
      return suspect.traits[clue.traitKey] === clue.expectedValue
    }
    case 'negative_match': {
      return suspect.traits[clue.traitKey] !== clue.negativeValue
    }
    case 'comparison': {
      if (!clue.comparisonTargetId) return true
      const target = suspectPool.find((s) => s.id === clue.comparisonTargetId)
      if (!target) return true

      if (clue.traitKey === 'height') {
        const heightOrder = { tiny: 1, short: 2, tall: 3 }
        const suspectH = heightOrder[suspect.traits.height]
        const targetH = heightOrder[target.traits.height]
        if (clue.expectedValue === 'shorter') return suspectH < targetH
        if (clue.expectedValue === 'taller') return suspectH > targetH
      }
      return true
    }
    case 'conjunction': {
      return suspect.traits[clue.traitKey] === clue.expectedValue
    }
    default:
      return true
  }
}

/**
 * Constraint Solver: Finds all suspects satisfying all discovered clues
 */
export function solveCase(detectiveCase: DetectiveCase): {
  validCulpritIds: string[]
  eliminatedSuspectIds: string[]
  isUnique: boolean
} {
  const validCulpritIds: string[] = []
  const eliminatedSuspectIds: string[] = []

  for (const suspect of detectiveCase.suspectPool) {
    let satisfiesAll = true
    for (const clue of detectiveCase.clues) {
      if (!evaluateSuspectAgainstClue(suspect, clue, detectiveCase.suspectPool)) {
        satisfiesAll = false
        break
      }
    }

    if (satisfiesAll) {
      validCulpritIds.push(suspect.id)
    } else {
      eliminatedSuspectIds.push(suspect.id)
    }
  }

  return {
    validCulpritIds,
    eliminatedSuspectIds,
    isUnique: validCulpritIds.length === 1,
  }
}

/**
 * Validates that a detective case is logically sound and has exactly ONE solution
 */
export function validateCaseUniqueness(detectiveCase: DetectiveCase): boolean {
  if (!detectiveCase.suspectPool || detectiveCase.suspectPool.length < 3) {
    return false
  }

  const solution = solveCase(detectiveCase)
  if (!solution.isUnique) {
    return false
  }

  if (solution.validCulpritIds[0] !== detectiveCase.culpritId) {
    return false
  }

  // Ensure every clue contributes or is consistent
  for (const clue of detectiveCase.clues) {
    const culprit = detectiveCase.suspectPool.find((s) => s.id === detectiveCase.culpritId)
    if (!culprit || !evaluateSuspectAgainstClue(culprit, clue, detectiveCase.suspectPool)) {
      return false
    }
  }

  return true
}

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32)
 */
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

/**
 * Deterministic Level Generator
 */
export function generateCase(
  seed: string | number,
  difficulty: DifficultyTier = 'easy'
): DetectiveCase {
  const filtered = CURATED_DETECTIVE_CASES.filter((c) => c.difficulty === difficulty)
  if (filtered.length === 0) {
    return CURATED_DETECTIVE_CASES[0]
  }

  const prng = createPRNG(seed)
  const index = Math.floor(prng() * filtered.length)
  const chosen = filtered[index]

  // Validate uniqueness invariant
  if (!validateCaseUniqueness(chosen)) {
    throw new Error(`Case ${chosen.id} failed uniqueness invariant check`)
  }

  return chosen
}

/**
 * Initial Investigation State
 */
export function getInitialState(caseConfig: DetectiveCase): DetectiveInvestigationState {
  const initialTelemetry: DetectiveTelemetry = {
    attempts: 0,
    timeElapsedSeconds: 0,
    cluesFound: 0,
    mistakesCount: 0,
    score: 0,
    stars: 0,
    xp: 0,
    finalStatus: 'failed',
  }

  return {
    caseConfig,
    activeTool: 'magnifying_glass',
    discoveredClueIds: [],
    eliminatedSuspectIds: [],
    inspectedHotspotIds: [],
    selectedSuspectId: null,
    status: 'briefing',
    telemetry: initialTelemetry,
  }
}

/**
 * Pure Reducer Action Evaluator
 */
export function evaluateAction(
  state: DetectiveInvestigationState,
  action: DetectiveAction
): DetectiveInvestigationState {
  switch (action.type) {
    case 'START_INVESTIGATION': {
      return {
        ...state,
        status: 'investigating',
      }
    }

    case 'SELECT_TOOL': {
      return {
        ...state,
        activeTool: action.tool,
      }
    }

    case 'INSPECT_HOTSPOT': {
      if (state.inspectedHotspotIds.includes(action.hotspotId)) {
        return state
      }

      const hotspot = state.caseConfig.hotspots.find((h) => h.id === action.hotspotId)
      if (!hotspot) return state

      // If correct tool used, discover clue
      const newDiscoveredClues = [...state.discoveredClueIds]
      if (hotspot.requiredTool === state.activeTool) {
        if (!newDiscoveredClues.includes(hotspot.clueId)) {
          newDiscoveredClues.push(hotspot.clueId)
        }
      }

      const isAllCluesFound = newDiscoveredClues.length >= state.caseConfig.clues.length

      return {
        ...state,
        inspectedHotspotIds: [...state.inspectedHotspotIds, action.hotspotId],
        discoveredClueIds: newDiscoveredClues,
        status: isAllCluesFound ? 'deducing' : state.status,
        telemetry: {
          ...state.telemetry,
          cluesFound: newDiscoveredClues.length,
        },
      }
    }

    case 'DISCOVER_CLUE': {
      if (state.discoveredClueIds.includes(action.clueId)) return state
      const updated = [...state.discoveredClueIds, action.clueId]
      return {
        ...state,
        discoveredClueIds: updated,
        status: updated.length >= state.caseConfig.clues.length ? 'deducing' : state.status,
        telemetry: {
          ...state.telemetry,
          cluesFound: updated.length,
        },
      }
    }

    case 'TOGGLE_ELIMINATE_SUSPECT': {
      const isEliminated = state.eliminatedSuspectIds.includes(action.suspectId)
      const nextEliminated = isEliminated
        ? state.eliminatedSuspectIds.filter((id) => id !== action.suspectId)
        : [...state.eliminatedSuspectIds, action.suspectId]

      return {
        ...state,
        eliminatedSuspectIds: nextEliminated,
      }
    }

    case 'SELECT_SUSPECT': {
      return {
        ...state,
        selectedSuspectId: action.suspectId,
      }
    }

    case 'ACCUSE_SUSPECT': {
      const isCorrect = action.suspectId === state.caseConfig.culpritId
      const newAttempts = state.telemetry.attempts + 1

      if (isCorrect) {
        const scoreResult = calculateScore(state.telemetry, state.caseConfig)
        return {
          ...state,
          status: 'solved',
          telemetry: {
            ...state.telemetry,
            attempts: newAttempts,
            finalStatus: 'solved',
            score: scoreResult.score,
            stars: scoreResult.stars,
            xp: scoreResult.xp,
          },
        }
      } else {
        return {
          ...state,
          telemetry: {
            ...state.telemetry,
            attempts: newAttempts,
            mistakesCount: state.telemetry.mistakesCount + 1,
          },
        }
      }
    }

    case 'RESET_CASE': {
      return getInitialState(state.caseConfig)
    }

    case 'TICK_TIME': {
      if (state.status !== 'investigating' && state.status !== 'deducing') return state
      return {
        ...state,
        telemetry: {
          ...state.telemetry,
          timeElapsedSeconds: state.telemetry.timeElapsedSeconds + action.deltaSeconds,
        },
      }
    }

    default:
      return state
  }
}

/**
 * Score & Reward Calculation
 */
export function calculateScore(
  telemetry: DetectiveTelemetry,
  caseConfig: DetectiveCase
): CaseScoreResult {
  const isPerfect = telemetry.attempts <= 1 && telemetry.mistakesCount === 0

  let baseXP = 35
  let baseStars = 3
  if (caseConfig.difficulty === 'medium') {
    baseXP = 55
    baseStars = 5
  } else if (caseConfig.difficulty === 'hard') {
    baseXP = 85
    baseStars = 8
  }

  const bonusXP = isPerfect ? 20 : 0
  const bonusStars = isPerfect ? 2 : 0

  const finalXP = baseXP + bonusXP
  const finalStars = baseStars + bonusStars

  let score = 75
  if (isPerfect) score = 100
  else if (telemetry.mistakesCount === 1) score = 85

  return {
    score,
    stars: finalStars,
    xp: finalXP,
    isPerfect,
    telemetry: {
      ...telemetry,
      score,
      xp: finalXP,
      stars: finalStars,
      finalStatus: 'solved',
    },
  }
}
