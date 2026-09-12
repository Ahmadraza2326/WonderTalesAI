import type {
  Essence,
  CreatureSpecies,
  CreatureTrait,
  CreatureMutation,
  CreatureMutationVariant,
  HappyAccidentReaction,
  BrewResult,
  CreatureRarity,
  DiscoveredCreatureMetadata,
  GuestMigrationResult,
} from '../../types/games/creatureLab'

/**
 * ☀️ The 5 Prime Essences of ORBis Starlight Alchemy
 */
export const PRIME_ESSENCES: Essence[] = [
  {
    id: 'sun_ember',
    name: 'Sun Ember',
    shortDescription: 'Warm, crackling crystal of concentrated solar dawn.',
    family: 'lumina',
    glyph: '☀️',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    soundCue: 'essence_drop',
  },
  {
    id: 'moon_dew',
    name: 'Moon Dew',
    shortDescription: 'Cool, serene droplet gathered from starlit night skies.',
    family: 'lumina',
    glyph: '💧',
    primaryColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    soundCue: 'essence_drop',
  },
  {
    id: 'whisper_seed',
    name: 'Whisper Seed',
    shortDescription: 'Verdant, ancient pod that hums with woodland growth.',
    family: 'flora',
    glyph: '🌿',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    soundCue: 'essence_drop',
  },
  {
    id: 'breeze_feather',
    name: 'Breeze Feather',
    shortDescription: 'Weightless plume that swirls with gentle sky currents.',
    family: 'aero',
    glyph: '💨',
    primaryColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    soundCue: 'essence_drop',
  },
  {
    id: 'stardust_crystal',
    name: 'Stardust Crystal',
    shortDescription: 'Shimmering celestial prism that bends starlight into magic.',
    family: 'cosmic',
    glyph: '✨',
    primaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    soundCue: 'essence_drop',
  },
]

/**
 * 🐾 Complete 24-Species Master Roster of ORBis Creature Lab (Milestone 2)
 * 15 two-essence canonical pairings + 9 secret/catalyst combinations.
 */
export const CREATURE_ROSTER: CreatureSpecies[] = [
  // --- 1. LUMINA FAMILY ---
  {
    id: 'glow_puff',
    name: 'Glow-Puff',
    speciesTitle: 'The Bioluminescent Kitten',
    family: 'lumina',
    rarity: 'common',
    emoji: '🐱',
    primaryColor: '#f59e0b',
    secondaryColor: '#06b6d4',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    personality: 'Curious, affectionate, and loves purring beside reading lamps.',
    scientificConcept: {
      name: 'Bioluminescence',
      explanation: 'Living creatures produce their own cold, glowing light through a natural chemical reaction!',
      funFact: 'Fireflies and deep-sea anglerfish use bioluminescence to talk and light up the dark.',
    },
    favoriteFood: 'Star-Milk Berries',
    soundCue: 'creature_reveal',
    loreSnippet: 'When golden solar warmth meets calm lunar dew, a Glow-Puff awakens with softly shining whiskers.',
    clue: 'Combine the warmth of the Sun with the soothing calm of Moon Dew.',
    recipe: { essenceIds: ['moon_dew', 'sun_ember'] },
    traits: [
      { name: 'Night Glow', emoji: '✨', description: 'Illuminates dark reading corners.' },
      { name: 'Soft Purr', emoji: '🎵', description: 'Calms bedtime minds.' },
    ],
    habitatPreference: 'stardust_observatory',
  },
  {
    id: 'tide_otter',
    name: 'Tide-Otter',
    speciesTitle: 'The Surface-Tension Diver',
    family: 'lumina',
    rarity: 'common',
    emoji: '🦦',
    primaryColor: '#06b6d4',
    secondaryColor: '#38bdf8',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    personality: 'Playful and bouncy, loves sliding across smooth water droplets.',
    scientificConcept: {
      name: 'Surface Tension & Density',
      explanation: 'Water molecules hold tightly together at the surface, creating an invisible elastic skin!',
      funFact: 'Water strider insects can walk right across ponds because of surface tension.',
    },
    favoriteFood: 'Glowing River Pebbles',
    soundCue: 'creature_reveal',
    loreSnippet: 'Double drops of pure Moon Dew merge to form an otter that glides effortlessly atop water bubbles.',
    clue: 'Double the lunar moisture by brewing two Moon Dews together.',
    recipe: { essenceIds: ['moon_dew', 'moon_dew'] },
    traits: [
      { name: 'Bubble Slide', emoji: '🫧', description: 'Slides along water surfaces.' },
      { name: 'Giggle Wave', emoji: '🌊', description: 'Splashes joy to surrounding friends.' },
    ],
    habitatPreference: 'crystal_cave',
  },
  {
    id: 'aurora_kitsune',
    name: 'Aurora Kitsune',
    speciesTitle: 'The Starlight Prism Fox',
    family: 'lumina',
    rarity: 'legendary',
    isSecret: true,
    emoji: '🦊',
    primaryColor: '#f59e0b',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    personality: 'Enigmatic, noble, and weaves ribbons of northern lights with its nine tails.',
    scientificConcept: {
      name: 'Atmospheric Optics & Prisms',
      explanation: 'White light is made of all the rainbow colors, which separate when passing through crystals!',
      funFact: 'Rainbows are formed when raindrops act like billions of tiny glass prisms.',
    },
    favoriteFood: 'Prismatic Star-Nectar',
    soundCue: 'legendary_discovery',
    loreSnippet: 'A legendary cosmic fox born when solar fire, lunar calm, and deep stardust harmonize perfectly.',
    clue: '??? A three-essence celestial secret: Sun meets Moon under ancient Stardust.',
    recipe: { essenceIds: ['moon_dew', 'stardust_crystal', 'sun_ember'] },
    traits: [
      { name: 'Aurora Weave', emoji: '🌌', description: 'Paints twilight skies with dancing colors.' },
      { name: 'Prism Dash', emoji: '⚡', description: 'Moves at the speed of refracted light.' },
    ],
    habitatPreference: 'stardust_observatory',
  },

  // --- 2. FLORA FAMILY ---
  {
    id: 'bloom_lizard',
    name: 'Bloom-Lizard',
    speciesTitle: 'The Sun-Basking Floral Gecko',
    family: 'flora',
    rarity: 'common',
    emoji: '🦎',
    primaryColor: '#10b981',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    personality: 'Patient, sunny, and loves basking on warm mossy stones.',
    scientificConcept: {
      name: 'Photosynthesis',
      explanation: 'Plants absorb sunlight and water to create delicious sugar energy and fresh oxygen!',
      funFact: 'Every breath of fresh air we take was made by green plants and ocean algae.',
    },
    favoriteFood: 'Solar Nectar Droplets',
    soundCue: 'creature_reveal',
    loreSnippet: 'When living flora drinks golden solar embers, this flowery gecko sprouts with blooming petals.',
    clue: 'Mix a Whisper Seed with the fiery warmth of a Sun Ember.',
    recipe: { essenceIds: ['sun_ember', 'whisper_seed'] },
    traits: [
      { name: 'Petal Camouflage', emoji: '🌸', description: 'Blends into colorful flower beds.' },
      { name: 'Sun Absorption', emoji: '☀️', description: 'Gains joyful energy from bright sunlight.' },
    ],
    habitatPreference: 'grove',
  },
  {
    id: 'dandelion_fox',
    name: 'Dandelion-Fox',
    speciesTitle: 'The Puff-Tailed Woodland Scout',
    family: 'flora',
    rarity: 'common',
    emoji: '🦊',
    primaryColor: '#10b981',
    secondaryColor: '#8b5cf6',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    personality: 'Energetic, cheerful, and leaps into piles of autumn leaves.',
    scientificConcept: {
      name: 'Seed Dispersal',
      explanation: 'Plants use wind, water, and animal friends to carry their seeds to new growing spots!',
      funFact: 'A dandelion seed can glide on the wind for over 5 miles before landing.',
    },
    favoriteFood: 'Puff-Apple Slices',
    soundCue: 'creature_reveal',
    loreSnippet: 'A Whisper Seed swept up by a gentle Breeze Feather bursts into a fox with a tail of dandelion fluff.',
    clue: 'Combine the seed of the forest with the lift of a Breeze Feather.',
    recipe: { essenceIds: ['breeze_feather', 'whisper_seed'] },
    traits: [
      { name: 'Seed Glide', emoji: '🌾', description: 'Parachutes safely from high tree branches.' },
      { name: 'Forest Scout', emoji: '🧭', description: 'Finds hidden woodland paths.' },
    ],
    habitatPreference: 'grove',
  },
  {
    id: 'dewdrop_frog',
    name: 'Dewdrop-Frog',
    speciesTitle: 'The Lilypad Croaker',
    family: 'flora',
    rarity: 'common',
    emoji: '🐸',
    primaryColor: '#059669',
    secondaryColor: '#06b6d4',
    glowColor: 'rgba(5, 150, 105, 0.5)',
    personality: 'Rhythmic, friendly, and croaks cheerful tunes during light spring drizzles.',
    scientificConcept: {
      name: 'Amphibian Hydration',
      explanation: 'Frogs do not drink water through their mouths—they absorb moisture right through their skin!',
      funFact: 'Some tree frogs can freeze solid in the winter and thaw out healthy in the spring.',
    },
    favoriteFood: 'Luminescent Water Lilies',
    soundCue: 'creature_reveal',
    loreSnippet: 'When Moon Dew waters a fertile Whisper Seed, a glass-skinned frog with a lilypad crown emerges.',
    clue: 'Quench a Whisper Seed with soothing Moon Dew.',
    recipe: { essenceIds: ['moon_dew', 'whisper_seed'] },
    traits: [
      { name: 'Water Hop', emoji: '💧', description: 'Jumps across pond ripples.' },
      { name: 'Rain Chorus', emoji: '🌧️', description: 'Calls gentle rain to thirsty gardens.' },
    ],
    habitatPreference: 'grove',
  },
  {
    id: 'solar_flora_titan',
    name: 'Solar Treekin',
    speciesTitle: 'The Phototropic Forest Guardian',
    family: 'flora',
    rarity: 'epic',
    emoji: '🌻',
    primaryColor: '#eab308',
    secondaryColor: '#15803d',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    personality: 'Protective, warm, and turns its giant sunflower crown to follow the morning light.',
    scientificConcept: {
      name: 'Phototropism',
      explanation: 'Plants naturally bend and grow toward light sources to maximize their sun energy!',
      funFact: 'Young sunflowers follow the sun from east to west every single day.',
    },
    favoriteFood: 'Pure Solar Compost',
    soundCue: 'rare_discovery',
    loreSnippet: 'Two ancient seeds nourished by concentrated solar fire grow into a mighty sunflower guardian.',
    clue: 'Feed two Whisper Seeds with a blazing Sun Ember.',
    recipe: { essenceIds: ['sun_ember', 'whisper_seed', 'whisper_seed'] },
    traits: [
      { name: 'Sun Tracker', emoji: '☀️', description: 'Always points the way toward bright daylight.' },
      { name: 'Canopy Shield', emoji: '🛡️', description: 'Protects smaller creatures from storms.' },
    ],
    habitatPreference: 'grove',
  },

  // --- 3. AERO FAMILY ---
  {
    id: 'zephyr_sprite',
    name: 'Zephyr-Sprite',
    speciesTitle: 'The Whistling Wind Pixie',
    family: 'aero',
    rarity: 'common',
    emoji: '🧚',
    primaryColor: '#8b5cf6',
    secondaryColor: '#a78bfa',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    personality: 'Mischievous, speedy, and loves twirling spinning windmills.',
    scientificConcept: {
      name: 'Air Pressure & Lift',
      explanation: 'Fast-moving air creates lower pressure, creating aerodynamic lift that helps wings fly!',
      funFact: 'Air has real weight—the atmosphere pressing down on us is equal to a car resting on every square meter.',
    },
    favoriteFood: 'Sweet Morning Breezes',
    soundCue: 'creature_reveal',
    loreSnippet: 'Two Breeze Feathers spinning together generate a tiny vortex that awakens this cheerful wind pixie.',
    clue: 'Weave two Breeze Feathers into a swirling vortex.',
    recipe: { essenceIds: ['breeze_feather', 'breeze_feather'] },
    traits: [
      { name: 'Gust Twirl', emoji: '🌪️', description: 'Spins gentle cooling breezes.' },
      { name: 'Feather Weight', emoji: '🪶', description: 'Never leaves footprints on snow.' },
    ],
    habitatPreference: 'cloud_citadel',
  },
  {
    id: 'mist_whale',
    name: 'Mist-Whale',
    speciesTitle: 'The Sky-Drifting Dreamer',
    family: 'aero',
    rarity: 'rare',
    emoji: '🐳',
    primaryColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    personality: 'Serene and wise, sings low melodic tunes across the high clouds.',
    scientificConcept: {
      name: 'Condensation & Clouds',
      explanation: 'Warm invisible water vapor rises, cools down, and clumps into fluffy floating water clouds!',
      funFact: 'A single fluffy cumulus cloud can weigh over one million pounds of water.',
    },
    favoriteFood: 'Cirrus Cloud Flakes',
    soundCue: 'rare_discovery',
    loreSnippet: 'A drop of pure night dew carried high aloft by whispering breezes condenses into a floating sky-drifter.',
    clue: 'Let Moon Dew ride upon the currents of a Breeze Feather.',
    recipe: { essenceIds: ['breeze_feather', 'moon_dew'] },
    traits: [
      { name: 'Cloud Float', emoji: '☁️', description: 'Swims weightlessly through open sky.' },
      { name: 'Soothing Song', emoji: '🎶', description: 'Brings peaceful dreams to sleeping towns.' },
    ],
    habitatPreference: 'cloud_citadel',
  },
  {
    id: 'comet_swallow',
    name: 'Comet-Swallow',
    speciesTitle: 'The Aurora Skimmer',
    family: 'aero',
    rarity: 'epic',
    emoji: '🕊️',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    personality: 'Graceful, daring, and dives through shooting star tails.',
    scientificConcept: {
      name: 'Atmospheric Ionization',
      explanation: 'When space dust crashes into our upper atmosphere, friction makes it glow in brilliant shooting stars!',
      funFact: 'Millions of tiny meteors vaporize safely high above our heads every single day.',
    },
    favoriteFood: 'Shooting Star Shards',
    soundCue: 'rare_discovery',
    loreSnippet: 'A swift sky feather struck by cosmic starlight becomes a swallow that leaves a tail of sparkling neon.',
    clue: 'Infuse a swift Breeze Feather with celestial Stardust.',
    recipe: { essenceIds: ['breeze_feather', 'stardust_crystal'] },
    traits: [
      { name: 'Comet Tail', emoji: '🌠', description: 'Leaves a sparkling trail in night flight.' },
      { name: 'High Altitude', emoji: '🌌', description: 'Glides above storm clouds in total calm.' },
    ],
    habitatPreference: 'cloud_citadel',
  },
  {
    id: 'storm_pegasus',
    name: 'Storm-Pegasus',
    speciesTitle: 'The Thunder-Hoof Foal',
    family: 'aero',
    rarity: 'epic',
    emoji: '🦄',
    primaryColor: '#3b82f6',
    secondaryColor: '#a855f7',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    personality: 'Bold, spirited, and gallops across thunderclouds during summer rains.',
    scientificConcept: {
      name: 'Static Electricity & Lightning',
      explanation: 'Ice crystals crashing inside storm clouds build up static electric charges that snap in lightning!',
      funFact: 'A single lightning bolt is five times hotter than the surface of the sun.',
    },
    favoriteFood: 'Electrified Raindrops',
    soundCue: 'rare_discovery',
    loreSnippet: 'Dual wind feathers charged by cool moon rain coalesce into a winged foal that sparks with static joy.',
    clue: 'Charge two Breeze Feathers with the moisture of Moon Dew.',
    recipe: { essenceIds: ['breeze_feather', 'breeze_feather', 'moon_dew'] },
    traits: [
      { name: 'Static Gallop', emoji: '⚡', description: 'Leaves glowing electric hoofprints.' },
      { name: 'Cloud Step', emoji: '☁️', description: 'Runs across soft clouds like solid ground.' },
    ],
    habitatPreference: 'cloud_citadel',
  },

  // --- 4. PYRO FAMILY ---
  {
    id: 'magma_pug',
    name: 'Magma-Pug',
    speciesTitle: 'The Snorting Ember Pup',
    family: 'pyro',
    rarity: 'rare',
    emoji: '🐶',
    primaryColor: '#ef4444',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    personality: 'Mischievous, cuddly, and sneezes harmless little spark showers when happy.',
    scientificConcept: {
      name: 'Geothermal Heat & Convection',
      explanation: 'Deep inside the Earth, heat causes melted rock to rise, cool, and circulate in giant convection loops!',
      funFact: 'Volcanoes created over 80 percent of our planet’s land surface.',
    },
    favoriteFood: 'Toasted Lava Biscuits',
    soundCue: 'rare_discovery',
    loreSnippet: 'Double the solar heat creates an intensely warm core that coalesces into a cheerful, tail-wagging fiery pup.',
    clue: 'Concentrate double the solar heat with two Sun Embers.',
    recipe: { essenceIds: ['sun_ember', 'sun_ember'] },
    traits: [
      { name: 'Spark Sneeze', emoji: '💥', description: 'Creates friendly mini-fireworks.' },
      { name: 'Lap Warmer', emoji: '❤️', description: 'Keeps cozy on chilly winter evenings.' },
    ],
    habitatPreference: 'stardust_observatory',
  },
  {
    id: 'cinder_falcon',
    name: 'Cinder-Falcon',
    speciesTitle: 'The Thermal Glider',
    family: 'pyro',
    rarity: 'rare',
    emoji: '🦅',
    primaryColor: '#ea580c',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(234, 88, 12, 0.5)',
    personality: 'Alert, swift, and circles high on warm updraft thermals.',
    scientificConcept: {
      name: 'Thermal Updrafts',
      explanation: 'Warm air expands and rises, creating invisible upward elevators that birds use to glide for hours without flapping!',
      funFact: 'Eagles and hawks can soar for over 100 miles using thermal updrafts.',
    },
    favoriteFood: 'Crisp Sun-Seeds',
    soundCue: 'rare_discovery',
    loreSnippet: 'Sun warmth carried high by breeze feathers awakens a raptor with glowing fiery feathers.',
    clue: 'Send a Sun Ember soaring into a Breeze Feather.',
    recipe: { essenceIds: ['breeze_feather', 'sun_ember'] },
    traits: [
      { name: 'Thermal Soar', emoji: '🔥', description: 'Gains elevation without flapping.' },
      { name: 'Ember Vision', emoji: '👁️', description: 'Spots hidden treasure through dense fog.' },
    ],
    habitatPreference: 'stardust_observatory',
  },
  {
    id: 'inferno_drake',
    name: 'Inferno-Drake',
    speciesTitle: 'The Combustion Drake',
    family: 'pyro',
    rarity: 'epic',
    emoji: '🐲',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    glowColor: 'rgba(220, 38, 38, 0.6)',
    personality: 'Brave, playful, and blows warm smoke rings when laughing.',
    scientificConcept: {
      name: 'Combustion Triangle',
      explanation: 'Fire requires three essential things to exist: Fuel, Heat, and Oxygen from the air!',
      funFact: 'Candle flames in zero-gravity space burn in perfect blue spheres.',
    },
    favoriteFood: 'Spiced Magma Crystals',
    soundCue: 'rare_discovery',
    loreSnippet: 'Double solar fuel fed by wind oxygen creates a friendly miniature dragon of glowing embers.',
    clue: 'Feed two Sun Embers with the oxygen of a Breeze Feather.',
    recipe: { essenceIds: ['breeze_feather', 'sun_ember', 'sun_ember'] },
    traits: [
      { name: 'Smoke Rings', emoji: '💨', description: 'Blows playful heart-shaped smoke rings.' },
      { name: 'Flame Shield', emoji: '🔥', description: 'Protects friends from extreme frost.' },
    ],
    habitatPreference: 'stardust_observatory',
  },

  // --- 5. TERRA FAMILY ---
  {
    id: 'elder_sproutling',
    name: 'Elder Sproutling',
    speciesTitle: 'The Walking Bonsai Golem',
    family: 'terra',
    rarity: 'rare',
    emoji: '🪴',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    glowColor: 'rgba(5, 150, 105, 0.5)',
    personality: 'Sleepy, wise, and enjoys telling peaceful bedtime stories to sleeping flowers.',
    scientificConcept: {
      name: 'Root Systems & Absorption',
      explanation: 'Plant roots anchor the tree into the earth and act like tiny straws drinking water and minerals!',
      funFact: 'A single rye grass plant can grow over 380 miles of total root length.',
    },
    favoriteFood: 'Rich Composted Stardust',
    soundCue: 'rare_discovery',
    loreSnippet: 'When two ancient Whisper Seeds entwine, their roots knit together into a sturdy little walking tree creature.',
    clue: 'Weave two Whisper Seeds together in the cauldron.',
    recipe: { essenceIds: ['whisper_seed', 'whisper_seed'] },
    traits: [
      { name: 'Living Root', emoji: '🪵', description: 'Sprouts medicinal tea leaves overnight.' },
      { name: 'Tree Speech', emoji: '📖', description: 'Understands the whispering language of forests.' },
    ],
    habitatPreference: 'grove',
  },
  {
    id: 'crystal_pangolin',
    name: 'Crystal-Pangolin',
    speciesTitle: 'The Geode Roller',
    family: 'terra',
    rarity: 'epic',
    emoji: '🦔',
    primaryColor: '#d97706',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(217, 119, 6, 0.5)',
    personality: 'Shy and gentle, rolls into an iridescent crystalline geode ball when surprised.',
    scientificConcept: {
      name: 'Mineral Crystallization',
      explanation: 'Minerals dissolved in hot underground water slowly arrange into perfect geometric crystal shapes!',
      funFact: 'Quartz crystals vibrate at an exact frequency, which is how clocks keep precise time.',
    },
    favoriteFood: 'Sweet Quartz Dew',
    soundCue: 'rare_discovery',
    loreSnippet: 'Ancient seeds crystallized by stardust pressure form a gentle armored mammal covered in glowing geodes.',
    clue: 'Fuse dual Whisper Seeds with celestial Stardust Crystals.',
    recipe: { essenceIds: ['stardust_crystal', 'whisper_seed', 'whisper_seed'] },
    traits: [
      { name: 'Geode Armor', emoji: '💎', description: 'Reflects harmless light beams.' },
      { name: 'Crystal Roll', emoji: '🌀', description: 'Rolls smoothly down hills like a bowling ball.' },
    ],
    habitatPreference: 'crystal_cave',
  },

  // --- 6. COSMIC FAMILY ---
  {
    id: 'solar_phoenix',
    name: 'Solar-Phoenix Chick',
    speciesTitle: 'The Golden Featherling',
    family: 'cosmic',
    rarity: 'epic',
    emoji: '🐣',
    primaryColor: '#f59e0b',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    personality: 'Brave, inspiring, and radiates cheerfulness wherever it perches.',
    scientificConcept: {
      name: 'Solar Radiation & Fusion',
      explanation: 'Our sun creates enormous energy by fusing hydrogen atoms together in nuclear fusion!',
      funFact: 'Light from the sun takes only 8 minutes and 20 seconds to travel 93 million miles to Earth.',
    },
    favoriteFood: 'Starlight Sun-Seeds',
    soundCue: 'rare_discovery',
    loreSnippet: 'When a Sun Ember touches Stardust Crystals, a newborn phoenix chick hatches in a shower of golden light.',
    clue: 'Unite the warmth of the Sun with pure Stardust Crystals.',
    recipe: { essenceIds: ['stardust_crystal', 'sun_ember'] },
    traits: [
      { name: 'Dawn Call', emoji: '🌅', description: 'Wakes the world with inspiring melody.' },
      { name: 'Warm Feathers', emoji: '✨', description: 'Never feels chilly in cold winter winds.' },
    ],
    habitatPreference: 'stardust_observatory',
  },
  {
    id: 'astral_nautilus',
    name: 'Astral Nautilus',
    speciesTitle: 'The Spiral Shell Dreamer',
    family: 'cosmic',
    rarity: 'legendary',
    emoji: '🐚',
    primaryColor: '#ec4899',
    secondaryColor: '#06b6d4',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    personality: 'Contemplative, ancient, and holds the music of distant galaxies inside its spiral shell.',
    scientificConcept: {
      name: 'Fibonacci Spirals & Sacred Geometry',
      explanation: 'Nature builds shells, hurricanes, and galaxy arms using the golden logarithmic spiral ratio!',
      funFact: 'The spiral pattern in sunflower seeds and pinecones follows the exact same math as a nautilus shell.',
    },
    favoriteFood: 'Luminescent Star-Algae',
    soundCue: 'legendary_discovery',
    loreSnippet: 'Moon Dew infused with ancient Stardust forms an iridescent spiral shell of cosmic harmony.',
    clue: 'Blend cool Moon Dew with celestial Stardust Crystals.',
    recipe: { essenceIds: ['moon_dew', 'stardust_crystal'] },
    traits: [
      { name: 'Aurora Spiral', emoji: '🌌', description: 'Projects spinning galaxy light projections.' },
      { name: 'Gravity Float', emoji: '🪐', description: 'Drifts weightlessly in any environment.' },
    ],
    habitatPreference: 'crystal_cave',
  },
  {
    id: 'nebula_owl',
    name: 'Nebula-Owl',
    speciesTitle: 'The Starlight Seer',
    family: 'cosmic',
    rarity: 'legendary',
    emoji: '🦉',
    primaryColor: '#a855f7',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    personality: 'Vigilant, scholarly, and tracks orbiting celestial constellations with wide glowing eyes.',
    scientificConcept: {
      name: 'Gravitational Lensing & Astronomy',
      explanation: 'Massive stars and galaxies in space have so much gravity that they bend the path of starlight itself!',
      funFact: 'Telescopes look backward in time—when we see distant stars, we see light from millions of years ago.',
    },
    favoriteFood: 'Constellation Motes',
    soundCue: 'legendary_discovery',
    loreSnippet: 'Concentrating double celestial Stardust creates a starry owl whose feathers depict live constellations.',
    clue: 'Forge pure celestial magic by combining two Stardust Crystals.',
    recipe: { essenceIds: ['stardust_crystal', 'stardust_crystal'] },
    traits: [
      { name: 'Cosmic Vision', emoji: '🔭', description: 'Sees the distant moons of far-off worlds.' },
      { name: 'Silent Flight', emoji: '🤫', description: 'Flies in total absolute quiet.' },
    ],
    habitatPreference: 'stardust_observatory',
  },
  {
    id: 'star_spore',
    name: 'Star-Spore',
    speciesTitle: 'The Bioluminescent Mushroomling',
    family: 'cosmic',
    rarity: 'rare',
    emoji: '🍄',
    primaryColor: '#10b981',
    secondaryColor: '#ec4899',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    personality: 'Shy, sweet, and glows softly when friends whisper kind words nearby.',
    scientificConcept: {
      name: 'Mycelium Networks & Symbiosis',
      explanation: 'Underground fungal networks connect whole forests, sharing water and nutrients between trees!',
      funFact: 'The largest living organism on Earth is an underground honey fungus over 3 miles wide.',
    },
    favoriteFood: 'Starlight Dewdrops',
    soundCue: 'rare_discovery',
    loreSnippet: 'A Whisper Seed dusted with celestial powder blooms into a tiny walking mushroom that twinkles.',
    clue: 'Sprinkle celestial Stardust onto a fertile Whisper Seed.',
    recipe: { essenceIds: ['stardust_crystal', 'whisper_seed'] },
    traits: [
      { name: 'Spore Glow', emoji: '✨', description: 'Lights up forest pathways for traveling ants.' },
      { name: 'Root Whisper', emoji: '🌿', description: 'Passes friendly messages to neighboring plants.' },
    ],
    habitatPreference: 'grove',
  },
  {
    id: 'glacier_bear',
    name: 'Glacier-Bear',
    speciesTitle: 'The Frost-Armor Cub',
    family: 'cosmic',
    rarity: 'epic',
    emoji: '🐻',
    primaryColor: '#38bdf8',
    secondaryColor: '#6366f1',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    personality: 'Gentle giant, loves making snow angels and drinking chilled starlight cider.',
    scientificConcept: {
      name: 'Thermal Insulation & Cryosphere',
      explanation: 'Animals in arctic environments use thick hollow fur and insulating fat layers to trap body heat!',
      funFact: 'A polar bear’s fur isn’t actually white—it is transparent and hollow, scattering light like snow.',
    },
    favoriteFood: 'Frozen Star-Melons',
    soundCue: 'rare_discovery',
    loreSnippet: 'Dual lunar dew frozen by deep stardust forms a cuddly cub protected by crystalline frost armor.',
    clue: 'Freeze two Moon Dews with deep celestial Stardust.',
    recipe: { essenceIds: ['moon_dew', 'moon_dew', 'stardust_crystal'] },
    traits: [
      { name: 'Frost Shield', emoji: '❄️', description: 'Creates safe ice bridges over rivers.' },
      { name: 'Warm Hug', emoji: '🤗', description: 'Keeps fellow companions warm in blizzards.' },
    ],
    habitatPreference: 'crystal_cave',
  },
  {
    id: 'chrono_tortoise',
    name: 'Chrono-Tortoise',
    speciesTitle: 'The Deep-Time World Golem',
    family: 'cosmic',
    rarity: 'legendary',
    isSecret: true,
    emoji: '🐢',
    primaryColor: '#10b981',
    secondaryColor: '#f59e0b',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    personality: 'Serene, ancient, and carries a living miniature bonsai garden on its shell.',
    scientificConcept: {
      name: 'Geological Deep Time',
      explanation: 'Earth’s mountains, oceans, and life took billions of patient years to form and grow!',
      funFact: 'Some giant tortoises live for over 180 years, watching human generations pass by.',
    },
    favoriteFood: 'Ancient Amber Leaves',
    soundCue: 'legendary_discovery',
    loreSnippet: 'Sun warmth, plant life, and cosmic starlight converge into an ancient golem that moves outside of time.',
    clue: '??? A legendary secret: Combine Sun, Flora, and Stardust in harmony.',
    recipe: { essenceIds: ['stardust_crystal', 'sun_ember', 'whisper_seed'] },
    traits: [
      { name: 'Time Dilation', emoji: '⏳', description: 'Slows down hurried moments for peaceful reflection.' },
      { name: 'Living Ecosystem', emoji: '🌳', description: 'Provides homes for tiny moss pixies on its back.' },
    ],
    habitatPreference: 'stardust_observatory',
  },
  {
    id: 'deep_sea_leviathan',
    name: 'Abyssal Dragon',
    speciesTitle: 'The Hydrothermal Explorer',
    family: 'cosmic',
    rarity: 'legendary',
    isSecret: true,
    emoji: '🐉',
    primaryColor: '#06b6d4',
    secondaryColor: '#a855f7',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    personality: 'Majestic, calm, and swims through deep ocean hydrothermal trenches.',
    scientificConcept: {
      name: 'Chemosynthesis & Deep Ocean Vents',
      explanation: 'In the deep pitch-black ocean, life thrives without any sunlight using geothermal chemical energy!',
      funFact: 'Over 80 percent of the world’s ocean floor remains completely unexplored by humans.',
    },
    favoriteFood: 'Mineral Vent Pearls',
    soundCue: 'legendary_discovery',
    loreSnippet: 'Moon moisture and plant seeds bonded by starlight form a mythical dragon that swims through deep ocean trenches.',
    clue: '??? A deep secret: Mix Moon Dew, Whisper Seed, and Stardust Crystals.',
    recipe: { essenceIds: ['moon_dew', 'stardust_crystal', 'whisper_seed'] },
    traits: [
      { name: 'Pressure Proof', emoji: '🛡️', description: 'Can dive to the deepest oceanic trenches.' },
      { name: 'Abyssal Glow', emoji: '💡', description: 'Lights up pitch-black marine caverns.' },
    ],
    habitatPreference: 'crystal_cave',
  },
  {
    id: 'celestial_griffin',
    name: 'Celestial Griffin',
    speciesTitle: 'The Solar Wind Sovereign',
    family: 'cosmic',
    rarity: 'epic',
    isSecret: true,
    emoji: '🦅',
    primaryColor: '#f59e0b',
    secondaryColor: '#8b5cf6',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    personality: 'Proud, protective, and soars across planetary magnetospheres.',
    scientificConcept: {
      name: 'Planetary Magnetospheres',
      explanation: 'Earth’s spinning molten iron core creates an invisible magnetic force field that shields us from solar storms!',
      funFact: 'Migrating birds use magnetic compass sensors inside their eyes to navigate thousands of miles.',
    },
    favoriteFood: 'Golden Sun-Berries',
    soundCue: 'rare_discovery',
    loreSnippet: 'Sun warmth, wind speed, and stardust combine into a majestic winged griffin with starlight claws.',
    clue: '??? A sovereign secret: Blend Sun Ember, Breeze Feather, and Stardust Crystal.',
    recipe: { essenceIds: ['breeze_feather', 'stardust_crystal', 'sun_ember'] },
    traits: [
      { name: 'Magnetic Navigation', emoji: '🧭', description: 'Never loses its way across the universe.' },
      { name: 'Starlight Roar', emoji: '✨', description: 'Rallies friendly companions in courage.' },
    ],
    habitatPreference: 'cloud_citadel',
  },
]

/**
 * 🧪 Playful Happy Accidents
 * Rewarding, funny non-creature surprises with zero punishment.
 */
export const HAPPY_ACCIDENTS: HappyAccidentReaction[] = [
  {
    id: 'bouncy_slime',
    name: 'Bouncy Starlight Slime',
    emoji: '🫧',
    description: 'A cheerful ball of iridescent starlight jelly that wiggles to a bouncy rhythm!',
    concept: 'Non-Newtonian fluid mechanics: bounces under pressure yet flows smoothly at rest.',
    rewardStardust: 5,
    primaryColor: '#a855f7',
    secondaryColor: '#38bdf8',
  },
  {
    id: 'singing_cloud',
    name: 'Singing Bubble Cloud',
    emoji: '☁️',
    description: 'A fluffy cloud of musical bubbles that pops in a harmonious three-note chord!',
    concept: 'Air trapping and acoustic resonance in soap bubble membranes.',
    rewardStardust: 5,
    primaryColor: '#38bdf8',
    secondaryColor: '#ec4899',
  },
  {
    id: 'sparkle_puff',
    name: 'Sparkle Puff Mist',
    emoji: '💫',
    description: 'A joyful puff of fragrant lavender glitter that covers the cauldron in sparkles!',
    concept: 'Micro-particle dispersal and static electrical attraction.',
    rewardStardust: 5,
    primaryColor: '#f43f5e',
    secondaryColor: '#fbbf24',
  },
  {
    id: 'dancing_ember',
    name: 'Dancing Ember Blob',
    emoji: '🔥',
    description: 'A warm little blob of friendly starlight that does a happy tap-dance on the rim!',
    concept: 'Thermal expansion and warm gas buoyancy in air.',
    rewardStardust: 5,
    primaryColor: '#f97316',
    secondaryColor: '#fbbf24',
  },
]

/**
 * Deterministic Mulberry32 Pseudo-Random Number Generator
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * String hash for deterministic seeds
 */
function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}

/**
 * Calculates XP and Star reward amounts based on creature rarity
 */
export function getRewardForRarity(rarity: CreatureRarity): { xp: number; stars: number } {
  switch (rarity) {
    case 'legendary':
      return { xp: 100, stars: 10 }
    case 'epic':
      return { xp: 60, stars: 6 }
    case 'rare':
      return { xp: 40, stars: 4 }
    case 'common':
    default:
      return { xp: 25, stars: 2 }
  }
}

export const MUTATION_CONFIGS: Record<CreatureMutationVariant, {
  name: string
  titlePrefix: string
  auraColor: string
  sparkleEmoji: string
  bonusXp: number
  bonusStars: number
  mutationDescription: string
  trait: CreatureTrait
}> = {
  normal: {
    name: 'Canonical Species',
    titlePrefix: '',
    auraColor: 'transparent',
    sparkleEmoji: '✨',
    bonusXp: 0,
    bonusStars: 0,
    mutationDescription: 'Pure elemental manifestation.',
    trait: { name: 'Elemental Purity', emoji: '✨', description: 'Harmonizes with its natural habitat.' },
  },
  golden: {
    name: 'Golden Solar Mutation',
    titlePrefix: 'Gilded',
    auraColor: 'rgba(251, 191, 36, 0.75)',
    sparkleEmoji: '🌟',
    bonusXp: 25,
    bonusStars: 5,
    mutationDescription: 'Infused with super-concentrated solar dawn radiation.',
    trait: { name: 'Solar Radiance', emoji: '☀️', description: 'Glows with perpetual warm solar light.' },
  },
  spectral: {
    name: 'Spectral Moonlit Mutation',
    titlePrefix: 'Spectral',
    auraColor: 'rgba(6, 182, 212, 0.75)',
    sparkleEmoji: '👻',
    bonusXp: 35,
    bonusStars: 6,
    mutationDescription: 'Phase-shifts between physical matter and starlight ether.',
    trait: { name: 'Ethereal Phase', emoji: '🌌', description: 'Floats silently through physical barriers.' },
  },
  iridescent: {
    name: 'Iridescent Prismatic Mutation',
    titlePrefix: 'Prismatic',
    auraColor: 'rgba(236, 72, 153, 0.75)',
    sparkleEmoji: '🌈',
    bonusXp: 50,
    bonusStars: 8,
    mutationDescription: 'Refracts pure starlight into kaleidoscopic rainbow halos.',
    trait: { name: 'Prismatic Prism', emoji: '💎', description: 'Bends ambient light into vibrant rainbow ribbons.' },
  },
  starlight_celestial: {
    name: 'Celestial Nova Mutation',
    titlePrefix: 'Astral',
    auraColor: 'rgba(168, 85, 247, 0.9)',
    sparkleEmoji: '🌠',
    bonusXp: 75,
    bonusStars: 10,
    mutationDescription: 'Born under a rare cosmic supernova alignment.',
    trait: { name: 'Supernova Heart', emoji: '✨', description: 'Emits cosmic gravitational pulses of stardust.' },
  },
}

/**
 * Procedurally generates an endless variation of a creature using Mulberry32 PRNG.
 */
export function generateCreatureMutation(
  creature: CreatureSpecies,
  seedOrDate?: string | number,
  explorerLevel = 1
): CreatureSpecies {
  const seed =
    typeof seedOrDate === 'number'
      ? seedOrDate
      : hashString(`${creature.id}_${seedOrDate || new Date().toISOString().slice(0, 10)}_${explorerLevel}`)

  const rng = mulberry32(seed)
  const roll = rng()

  // Base mutation chance: 20% + 2% per explorer level (max 45%)
  const mutationChance = Math.min(0.45, 0.20 + explorerLevel * 0.02)

  if (roll > mutationChance) {
    return { ...creature }
  }

  const subRoll = rng()
  let variant: CreatureMutationVariant = 'golden'
  if (subRoll < 0.15) {
    variant = 'starlight_celestial'
  } else if (subRoll < 0.40) {
    variant = 'iridescent'
  } else if (subRoll < 0.70) {
    variant = 'spectral'
  } else {
    variant = 'golden'
  }

  const config = MUTATION_CONFIGS[variant]
  const mutation: CreatureMutation = {
    variant,
    name: config.name,
    titlePrefix: config.titlePrefix,
    auraColor: config.auraColor,
    sparkleEmoji: config.sparkleEmoji,
    bonusXp: config.bonusXp,
    bonusStars: config.bonusStars,
    mutationDescription: config.mutationDescription,
    specialTrait: config.trait,
  }

  return {
    ...creature,
    name: `${config.titlePrefix} ${creature.name}`.trim(),
    glowColor: config.auraColor,
    mutation,
    traits: [...creature.traits, config.trait],
  }
}

/**
 * Evaluates a brewing recipe deterministically.
 *
 * @param essenceIds Array of 2 or 3 selected essence IDs
 * @param discoveredIds List of creature IDs already in child's collection
 * @param seed Optional seed or options for deterministic happy accident and mutation generation
 */
export function evaluateBrew(
  essenceIds: string[],
  discoveredIds: string[] = [],
  seed: number | { seed?: number; childId?: string; explorerLevel?: number; dateKey?: string } = 42
): BrewResult {
  const resolvedSeed = typeof seed === 'number' ? seed : seed.seed || 42
  const childId = typeof seed === 'object' ? seed.childId || 'guest' : 'guest'
  const explorerLevel = typeof seed === 'object' ? seed.explorerLevel || 1 : 1
  const dateKey = typeof seed === 'object' ? seed.dateKey || new Date().toISOString().slice(0, 10) : ''

  if (!Array.isArray(essenceIds) || essenceIds.length < 2) {
    // Graceful fallback for incomplete brew
    return {
      type: 'happy_accident',
      reaction: HAPPY_ACCIDENTS[0],
      isNewDiscovery: false,
      xpAwarded: 5,
      starsAwarded: 0,
      stardustAwarded: 5,
    }
  }

  // Normalize recipe order: sort alphabetically so (A, B) === (B, A)
  const normalizedInput = [...essenceIds].sort()

  // Find matching creature in the roster
  const matchedCreature = CREATURE_ROSTER.find((creature) => {
    const sortedRecipe = [...creature.recipe.essenceIds].sort()
    if (sortedRecipe.length !== normalizedInput.length) return false
    return sortedRecipe.every((id, idx) => id === normalizedInput[idx])
  })

  if (matchedCreature) {
    const isNewDiscovery = !discoveredIds.includes(matchedCreature.id)
    const baseReward = getRewardForRarity(matchedCreature.rarity)

    // Check for rare procedural mutation
    const mutatedCreature = dateKey || typeof seed === 'object'
      ? generateCreatureMutation(matchedCreature, `${childId}_${dateKey}_${resolvedSeed}`, explorerLevel)
      : matchedCreature

    const bonusXp = mutatedCreature.mutation?.bonusXp || 0
    const bonusStars = mutatedCreature.mutation?.bonusStars || 0

    return {
      type: 'creature',
      creature: mutatedCreature,
      isNewDiscovery,
      // First discovery gets full XP/Stars; repeat discovery gets crafting stardust only
      xpAwarded: isNewDiscovery ? baseReward.xp + bonusXp : 0,
      starsAwarded: isNewDiscovery ? baseReward.stars + bonusStars : 0,
      stardustAwarded: isNewDiscovery ? 10 : 3,
      mutation: mutatedCreature.mutation,
    }
  }

  // No specific creature matched: generate a deterministic "Happy Accident"
  const comboHash = hashString(normalizedInput.join('_') + `_${resolvedSeed}`)
  const rng = mulberry32(comboHash)
  const accidentIndex = Math.floor(rng() * HAPPY_ACCIDENTS.length)
  const reaction = HAPPY_ACCIDENTS[accidentIndex] || HAPPY_ACCIDENTS[0]

  return {
    type: 'happy_accident',
    reaction,
    isNewDiscovery: false,
    xpAwarded: 5,
    starsAwarded: 0,
    stardustAwarded: reaction.rewardStardust,
  }
}

/**
 * Accessor for all essences
 */
export function getAllEssences(): Essence[] {
  return [...PRIME_ESSENCES]
}

/**
 * Accessor for all creatures
 */
export function getAllCreatures(): CreatureSpecies[] {
  return [...CREATURE_ROSTER]
}

/**
 * Find creature by ID
 */
export function getCreatureById(id: string): CreatureSpecies | undefined {
  return CREATURE_ROSTER.find((c) => c.id === id)
}

/**
 * Find essence by ID
 */
export function getEssenceById(id: string): Essence | undefined {
  return PRIME_ESSENCES.find((e) => e.id === id)
}

/**
 * Computes comprehensive collection statistics for the Almanac
 */
export function getCollectionStats(discoveredIds: string[] = []): {
  totalSpecies: number
  discoveredCount: number
  progressPercent: number
  commonCount: number
  rareCount: number
  epicCount: number
  legendaryCount: number
  secretCount: number
} {
  const total = CREATURE_ROSTER.length
  const validDiscovered = discoveredIds.filter((id) => CREATURE_ROSTER.some((c) => c.id === id))
  const discoveredCount = validDiscovered.length

  const discoveredObjects = validDiscovered
    .map((id) => getCreatureById(id))
    .filter((c): c is CreatureSpecies => c !== undefined)

  return {
    totalSpecies: total,
    discoveredCount,
    progressPercent: Math.round((discoveredCount / total) * 100),
    commonCount: discoveredObjects.filter((c) => c.rarity === 'common').length,
    rareCount: discoveredObjects.filter((c) => c.rarity === 'rare').length,
    epicCount: discoveredObjects.filter((c) => c.rarity === 'epic').length,
    legendaryCount: discoveredObjects.filter((c) => c.rarity === 'legendary').length,
    secretCount: discoveredObjects.filter((c) => c.isSecret).length,
  }
}

/**
 * Safely migrates guest discovery history into an active child profile
 */
export function migrateGuestDiscoveriesToChild(childId: string): GuestMigrationResult {
  if (typeof window === 'undefined' || !window.localStorage || !childId || childId === 'guest') {
    return { migratedCount: 0, stardustTransferred: 0, success: false }
  }

  try {
    const guestDiscoveredRaw = window.localStorage.getItem('orbis_creature_lab_discovered_guest')
    const guestStardustRaw = window.localStorage.getItem('orbis_creature_lab_stardust_guest')
    const guestMetadataRaw = window.localStorage.getItem('orbis_creature_lab_metadata_guest')

    const guestDiscovered: string[] = guestDiscoveredRaw ? JSON.parse(guestDiscoveredRaw) : []
    const guestStardust: number = guestStardustRaw ? Number(guestStardustRaw) || 0 : 0
    const guestMetadata: Record<string, DiscoveredCreatureMetadata> = guestMetadataRaw ? JSON.parse(guestMetadataRaw) : {}

    if (guestDiscovered.length === 0 && guestStardust === 0) {
      return { migratedCount: 0, stardustTransferred: 0, success: true }
    }

    const childDiscoveredKey = `orbis_creature_lab_discovered_${childId}`
    const childStardustKey = `orbis_creature_lab_stardust_${childId}`
    const childMetadataKey = `orbis_creature_lab_metadata_${childId}`

    const existingChildDiscovered: string[] = JSON.parse(window.localStorage.getItem(childDiscoveredKey) || '[]')
    const existingChildStardust: number = Number(window.localStorage.getItem(childStardustKey) || '0')
    const existingChildMetadata: Record<string, DiscoveredCreatureMetadata> = JSON.parse(window.localStorage.getItem(childMetadataKey) || '{}')

    // Merge unique discoveries
    const mergedDiscovered = Array.from(new Set([...existingChildDiscovered, ...guestDiscovered]))
    const mergedStardust = existingChildStardust + guestStardust
    const mergedMetadata = { ...guestMetadata, ...existingChildMetadata }

    window.localStorage.setItem(childDiscoveredKey, JSON.stringify(mergedDiscovered))
    window.localStorage.setItem(childStardustKey, String(mergedStardust))
    window.localStorage.setItem(childMetadataKey, JSON.stringify(mergedMetadata))

    // Clear guest storage after successful migration
    window.localStorage.removeItem('orbis_creature_lab_discovered_guest')
    window.localStorage.removeItem('orbis_creature_lab_stardust_guest')
    window.localStorage.removeItem('orbis_creature_lab_metadata_guest')

    return {
      migratedCount: guestDiscovered.length,
      stardustTransferred: guestStardust,
      success: true,
    }
  } catch {
    return { migratedCount: 0, stardustTransferred: 0, success: false }
  }
}

/**
 * Computes fluid blend color dynamically based on placed essence IDs
 */
export function getHarmonicFluidColor(essenceIds: string[]): {
  primary: string
  secondary: string
  glow: string
} {
  if (!essenceIds || essenceIds.length === 0) {
    return {
      primary: '#6366f1',
      secondary: '#4338ca',
      glow: 'rgba(99, 102, 241, 0.3)',
    }
  }

  const first = getEssenceById(essenceIds[0])
  if (essenceIds.length === 1 && first) {
    return {
      primary: first.primaryColor,
      secondary: '#1e1b4b',
      glow: first.glowColor,
    }
  }

  const second = getEssenceById(essenceIds[1])
  if (first && second) {
    return {
      primary: first.primaryColor,
      secondary: second.primaryColor,
      glow: `rgba(168, 85, 247, 0.6)`,
    }
  }

  return {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    glow: 'rgba(139, 92, 246, 0.4)',
  }
}
