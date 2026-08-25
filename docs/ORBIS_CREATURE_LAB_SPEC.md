# ORBis Creature Lab: Complete Master Game Design Specification (Flagship Game #1)

> **Document Status:** Authoritative Game Design & Technical Blueprint  
> **Target Release:** ORBis Flagship Standalone Game Universe — Milestone 1  
> **Core Principle:** A genuinely magical, tactile, and intrinsically joyful discovery sandbox. Children experiment with elemental essences and catalysts in an alchemical cauldron to hatch, nurture, and collect fantastical creatures that inhabit their persistent ORBis universe.

---

## 1. Executive Vision & Core Fantasy

### The Young Magical Researcher
The child enters the **Starlight Observatory Laboratory** as an apprentice alchemist. Instead of facing a chemistry quiz or a worksheet, the child encounters an enchanted vessel, glowing jars of magical essences, and mysterious silhouetted entries in the ancient *Almanac of Wonder*. The child’s goal is to experiment, observe surprising reactions, make predictions, and hatch a thriving ecosystem of mythical companions.

```
                           ┌─────────────────────────────────────────┐
                           │      1. Explore & Select Essences       │
                           │   (Sun Ember, Moon Dew, Stardust, etc)  │
                           └────────────────────┬────────────────────┘
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │      2. Drag into Animated Cauldron     │
                           │   (Tactile Drag, Drop Sound, Shimmers)  │
                           └────────────────────┬────────────────────┘
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │     3. Observe Reaction & Predict       │
                           │   (Fluid Color Blending & Bubble Hints) │
                           └────────────────────┬────────────────────┘
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │       4. Stir the Cauldron Vessel       │
                           │   (Kinetic Swirl, Sound Cues, Suspense) │
                           └────────────────────┬────────────────────┘
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │     5. Hatching & Discovery Reveal      │
                           │   (Particle Blast & Living Pet Sprite)  │
                           └────────────────────┬────────────────────┘
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │     6. Almanac Collection & Rewards     │
                           │   (Name Creature, XP/Stars, Stardust)   │
                           └─────────────────────────────────────────┘
```

---

## 2. The 15 Concrete Gameplay Screens & State Machine

```
[World Entry] ──► [Lab Intro] ──► [Lab Idle] ──► [Ingredient Select] ──► [Prediction State]
                                       │                                         │
                                       ▼                                         ▼
[Almanac Drawer] ◄────────────── [Hatch Reveal] ◄────── [Reaction Reveal] ◄── [Stirring State]
```

1. **Game World Entry (`/games`):** Celestial galaxy hub showing the Starlight Observatory island with glowing chimneys and floating essence crystals.
2. **Creature Lab Introduction (First-Time Onboarding):** Master Alchemist Hoot provides a 5-second warm greeting: *"Welcome to the Lab! Mix two glowing essences in the cauldron to awaken your first magical companion."*
3. **Laboratory Idle State:** Cauldron gently bubbles with glowing embers; floating essence jars hover with subtle bobbing motion; Stardust counter and Almanac drawer icon are visible.
4. **Ingredient Discovery:** Unlocking new essences (e.g. *Stardust Crystal* or *Frost Catalyst*) by completing discovery milestones.
5. **Ingredient Selection (Drag/Tap):** Child drags or taps glowing essence jars onto the cauldron rim; fluid ripples and emits harmonic tones.
6. **Mixing Interaction:** Ingredients drop into the liquid; dynamic color interpolation blends primary colors into rich secondary/tertiary shades.
7. **Prediction Moment:** The cauldron fluid glows and displays subtle rising glyph bubbles, allowing the child to hypothesize which elemental family will emerge.
8. **Stirring State (The Activation):** The child taps **"🌀 STIR THE CAULDRON!"** (or uses Enter/Space); the vessel shakes with spring physics, liquids swirl, and bubbling audio intensifies.
9. **Reaction Reveal:** Suspense beat (0.8s) with radial light rays and lid vibration.
10. **Creature Hatch / Discovery:** Particle burst explosion; an animated 2D companion hatches, performs a joyful backflip, purrs/chirps, and displays its personality traits.
11. **Creature Almanac (`AlmanacDrawer.tsx`):** Slide-over collection book displaying discovered creatures, elemental family badges, favorite foods, and mystery glowing silhouettes with poetic clues for undiscovered species.
12. **Experiment History:** A visual mini-log showing past successful combinations and Happy Accidents.
13. **Replay State:** Retesting an existing recipe yields a friendly pet greeting and +3 Crafting Stardust without duplicate XP inflation.
14. **Empty / Sparse State:** A friendly empty Almanac view displaying 8 initial mystery pedestals with glowing question marks and inviting clues.
15. **Error / Boundary Recovery State:** Malformed or incomplete inputs safely degrade into a gentle bubbling splash with a friendly prompt (*"Add 1 more essence to brew!"*).

---

## 3. The 24 Deterministic Experiment Combinations (20 Species + 4 Happy Accidents)

Every experiment is 100% deterministic, locally computed, and teaches an underlying scientific/ecological concept:

| # | Ingredients | Resulting Outcome | Family | Rarity | Visual Reaction | Sound Cue | Educational Concept | Replay Behavior |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **1** | ☀️ Sun Ember + 💧 Moon Dew | **Glow-Puff** (Bioluminescent Kitten) | Lumina | Common | Iridescent cyan liquid with glowing aura | Soft harmonic purr | **Bioluminescence:** Cold chemical light in nature | Re-hatches pet; grants +3 Stardust |
| **2** | ☀️ Sun Ember + 🌿 Whisper Seed | **Bloom-Lizard** (Sun Gecko) | Flora | Common | Verdant green fluid with sprouting vines | Sunny chitter chirp | **Photosynthesis:** Converting solar energy to growth | Re-hatches pet; grants +3 Stardust |
| **3** | 💧 Moon Dew + 💨 Breeze Feather | **Mist-Whale** (Sky Drifter) | Aero | Rare | Swirling cloud mist with floating droplets | Deep whale song chime | **Condensation & Water Cycle:** Mist & clouds | Re-hatches pet; grants +3 Stardust |
| **4** | 🌿 Whisper Seed + 💨 Breeze Feather | **Dandelion-Fox** (Puff Scout) | Flora | Common | Floating fluffy dandelion seeds | Playful yip bark | **Seed Dispersal:** Wind-borne plant reproduction | Re-hatches pet; grants +3 Stardust |
| **5** | ☀️ Sun Ember + ✨ Stardust Crystal | **Solar-Phoenix Chick** | Cosmic | Epic | Solar corona flare with golden sparks | Triumphant crystal peep | **Solar Radiation & Fusion:** Stellar energy | Re-hatches pet; grants +3 Stardust |
| **6** | 💧 Moon Dew + ✨ Stardust Crystal | **Astral Nautilus** (Spiral Shell) | Cosmic | Legendary | Luminescent spiral galaxy rings | Deep crystalline chime | **Fibonacci Spirals:** Sacred geometry in marine shells | Re-hatches pet; grants +3 Stardust |
| **7** | ☀️ Sun Ember + ☀️ Sun Ember | **Magma-Pug** (Ember Puppy) | Pyro | Rare | Bubbling lava magma with ember pops | Snorting puppy bark | **Thermal Convection:** High-heat volcanic dynamics | Re-hatches pet; grants +3 Stardust |
| **8** | 🌿 Whisper Seed + 🌿 Whisper Seed | **Elder Sproutling** (Bonsai Golem) | Terra | Rare | Entangled woody root tendrils | Deep resonant wood thud | **Root Systems:** Plant anchorage & nutrient absorption | Re-hatches pet; grants +3 Stardust |
| **9** | 💨 Breeze Feather + 💨 Breeze Feather | **Zephyr-Sprite** (Wind Pixie) | Aero | Common | Miniature whirlwind vortex | Playful flute whistle | **Aerodynamics & Air Pressure:** Lift & vortexes | Re-hatches pet; grants +3 Stardust |
| **10**| 💧 Moon Dew + 💧 Moon Dew | **Tide-Otter** (River Diver) | Lumina | Common | Splashing water ripples with bubble rings | Squeaky otter giggle | **Surface Tension & Fluid Density** | Re-hatches pet; grants +3 Stardust |
| **11**| ✨ Stardust + ✨ Stardust | **Nebula-Owl** (Starlight Seer) | Cosmic | Legendary | Orbiting miniature constellation stars | Echoing astral hoot | **Gravitational Lensing & Constellations** | Re-hatches pet; grants +3 Stardust |
| **12**| ☀️ Sun Ember + 💨 Breeze Feather | **Cinder-Falcon** (Thermal Glider) | Pyro | Rare | Swirling fiery thermal updraft | Piercing falcon screech | **Thermal Updrafts:** How birds glide on warm air | Re-hatches pet; grants +3 Stardust |
| **13**| 💧 Moon Dew + 🌿 Whisper Seed | **Dewdrop-Frog** (Lilypad Croaker) | Flora | Common | Raindrop ripples and sprouting lilypads | Deep ribbit croak | **Amphibian Hydration & Permeable Skin** | Re-hatches pet; grants +3 Stardust |
| **14**| 💨 Breeze Feather + ✨ Stardust | **Comet-Swallow** (Aurora Skimmer) | Aero | Epic | Aurora borealis color bands (Green/Pink) | Shimmering musical trill | **Atmospheric Ionization & Polar Auroras** | Re-hatches pet; grants +3 Stardust |
| **15**| 🌿 Whisper Seed + ✨ Stardust | **Star-Spore** (Mushroomling) | Cosmic | Rare | Glowing bioluminescent spore clouds | High glass bell ring | **Mycelium Networks & Symbiotic Ecology** | Re-hatches pet; grants +3 Stardust |
| **16**| ☀️ Sun + ☀️ Sun + 💨 Breeze | **Inferno-Drake** (Volcano Drake) | Pyro | Epic | Towering flame vortex with smoke rings | Baby dragon roar | **Combustion Dynamics:** Fuel + Heat + Oxygen | Re-hatches pet; grants +3 Stardust |
| **17**| 💧 Moon + 💧 Moon + ✨ Stardust | **Glacier-Bear** (Frost Cub) | Cosmic | Epic | Crystalline frost wave spreading outward | Friendly low growl | **Thermal Insulation & Glacial Cryosphere** | Re-hatches pet; grants +3 Stardust |
| **18**| 🌿 Whisper + 🌿 Whisper + ☀️ Sun | **Solar-Flora Titan** (Sunflower Tree) | Flora | Epic | Giant blooming sunburst petals | Leafy tree rustle chime | **Phototropism:** Plants growing toward light | Re-hatches pet; grants +3 Stardust |
| **19**| 💨 Breeze + 💨 Breeze + 💧 Moon | **Storm-Pegasus** (Thunder Foal) | Aero | Epic | Miniature lightning flash in dark cloud | Galloping electric whinny | **Static Charge & Lightning Generation** | Re-hatches pet; grants +3 Stardust |
| **20**| ☀️ Sun + 🌿 Whisper + ✨ Stardust | **Chrono-Tortoise** (Cosmic Golem) | Cosmic | Legendary | Golden time-dilation particle vortex | Deep harmonic gong | **Geological Longevity & Deep Time** | Re-hatches pet; grants +3 Stardust |
| **21**| ☀️ Sun + Unstable Fire Catalyst | **Dancing Ember Blob** (Happy Accident) | Novelty | Novelty | Sizzling bouncy fire jelly slime | Comedic popping boing | **Thermal Expansion** | Grants +5 Stardust |
| **22**| 💧 Moon + Unstable Water Catalyst | **Singing Bubble Cloud** (Happy Accident)| Novelty | Novelty | Floating warbling soap bubble cluster | Whimsical slide-whistle | **Air Trapping & Surfactants** | Grants +5 Stardust |
| **23**| 🌿 Whisper + Unstable Flora Catalyst | **Sparkle Puff Mist** (Happy Accident) | Novelty | Novelty | Sneeze-like glitter cloud puff | Comedic cartoon sneeze | **Pollen Allergens & Plant Spores** | Grants +5 Stardust |
| **24**| ✨ Stardust + Unstable Cosmic Catalyst | **Bouncy Starlight Slime** (Happy Accident)| Novelty | Novelty | Elastic neon gelatin bouncing around cauldron | Cartoon rubber boing | **Non-Newtonian Fluid Mechanics** | Grants +5 Stardust |

---

## 4. Multi-Tiered Age Design & Complexity Scaling

```
┌───────────────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Difficulty Tier           │ Mechanical Adaptation                                                  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Tier 1: Apprentice (4–6)  │ 2-Essence Mixing with visual affinity halos on shelf. Focus on color   │
│                           │ blending and sensory delight.                                          │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Tier 2: Journeyman (6–8)  │ 3-Essence Combinations + Cauldron Temperature Dial (Cool/Warm/Blazing).│
│                           │ Deductive Almanac riddle hints.                                        │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ Tier 3: Master (8–10)     │ Rare Catalysts + Environmental Habitat Survival Testing.               │
└───────────────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Visual, Animation & Sound Design Principles

### Visual & Tactile Delight (Anti-SaaS Dashboard):
* **Living Cauldron SVG:** Breathing idle transforms, liquid level bobbing, dynamic SVG radial gradients (`#f59e0b` ☀️ + `#06b6d4` 💧 → `#8b5cf6` ✨).
* **Tactile Essence Jars:** Jars scale up to `1.08x` with floating starlight particle trails when hovered or dragged.
* **Canvas Particle Celebrations:** Egg hatch blasts 60+ celebratory stars, sparkles, and elemental embers with physics gravity and friction.
* **Sensory Accessibility:** Instant compliance with `prefers-reduced-motion: reduce` by replacing particle blasts with soft radial fades.

### Zero-Asset Procedural Web Audio Synthesis:
* **`essence_pickup`:** Ascending sine frequency sweep (400Hz → 800Hz, 120ms).
* **`essence_drop`:** Warm triangle splash drop (300Hz → 150Hz, 180ms).
* **`cauldron_bubble`:** Modulated dual-oscillator bubbling warble with random pitch jitter.
* **`creature_reveal`:** Triumphant 4-note major pentatonic chord chime with starlight shimmer.
* **`happy_accident`:** Playful bouncy slide-whistle with rubber boing resonance.
* **`almanac_unlock`:** Deep crystalline chime and golden stamp thud.

---

## 6. Authoritative Reward Economy Integration

Creature Lab bridges directly into the verified `useActivityEconomy` and `child_activity_rewards` ledger:

```typescript
// Stable activity identity
activityType: 'creature_lab'
activityId: `discovery_${creatureId}`

// Authoritative RPC Dispatch via economyService.completeActivity()
// - First discovery:
//     Common: 25 XP, 2 Stars
//     Rare: 40 XP, 4 Stars
//     Epic: 60 XP, 6 Stars
//     Legendary: 100 XP, 10 Stars
// - Replay of known species:
//     0 XP, 0 Stars, +3 Crafting Stardust (Prevents currency inflation)
// - Happy Accident novelty:
//     5 XP, 0 Stars, +5 Crafting Stardust
```

---

## 7. Ethical Monetization & Paywall Boundaries

```
┌───────────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ Free Tier (High-Value Ethical Entry)              │ Premium Tier ($9.99/mo)                      │
├───────────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ • Full 2-essence alchemy matrix (15 core species) │ • 3-essence recipes & rare catalysts         │
│ • Unlimited brewing with zero energy timers       │ • Direct pet export into AI story generation │
│ • Complete Almanac collection browser             │ • The Starlight Observatory Sanctuary theme  │
│ • 100% Ad-Free for all children                   │ • Parent Inductive Reasoning Growth Insights │
└───────────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

* **Ethical Red Lines:** Never paywall core discovery mechanics; never introduce paid consumable currency; never use artificial cooldown timers.

---

## 8. Technical Architecture & File Map

```
src/
├── types/games/
│   └── creatureLab.ts          # Complete species, essence, recipe, and reaction contracts
├── services/games/
│   ├── creatureLabEngine.ts    # 100% pure deterministic recipe evaluation, PRNG, and color shader math
│   └── gameRegistry.ts         # Master game catalog metadata
├── components/games/creature-lab/
│   ├── CreatureLab.tsx         # Root container with useActivityEconomy & local storage adapter
│   ├── CauldronStage.tsx       # Animated SVG cauldron with dynamic fluid blending & stirring button
│   ├── EssenceShelf.tsx        # Tactile glowing essence jars (>= 48px touch targets)
│   ├── CreatureHatchModal.tsx   # Emotional payoff reveal with particle celebrations & traits
│   ├── HappyAccidentModal.tsx   # Zero-punishment playful surprise modal with bonus Stardust
│   └── AlmanacDrawer.tsx       # Slide-over collection book with mystery glowing silhouettes
└── pages/
    └── CreatureLabPage.tsx     # Standalone page wrapper mounted at /games/creature-lab
```

---

## 9. Comprehensive Test Strategy (`scripts/test_creature_lab.ts`)

A 44-assertion automated test suite guarantees:
1. **Recipe Determinism:** Order-independent commutative recipe matching (e.g. `[Sun, Moon]` === `[Moon, Sun]`).
2. **Happy Accident Fallbacks:** Unmapped recipes safely yield non-punishing reactions without throwing errors.
3. **Reward Idempotency:** First discoveries award XP/Stars; repeat discoveries award 0 XP / 0 Stars + Stardust.
4. **Fluid Shader Math:** Ambient fluid colors interpolate accurately across single, dual, and triple mixtures.
5. **Boundary & Malformed Inputs:** Null, empty, or unknown essence IDs safely degrade into friendly bubble splashes.
6. **Authoritative Ledger Contract:** Passes verified `childId`, `activityType: 'creature_lab'`, and `activityId: 'discovery_<id>'` to the Supabase RPC.

---

## 10. Phased Implementation Milestones

* **Milestone 1 (Complete & Verified):** 5 Prime Essences, 8 living species, Cauldron SVG stage, Hatch modal, Almanac drawer, and 44/44 automated tests.
* **Milestone 2 (Expanded Catalog):** Implement the full 24-experiment matrix (Catalysts, Temperature dial, 20 species + 4 Happy Accidents).
* **Milestone 3 (Living Sanctuary Playground):** Add the roaming habitat playground where discovered pets wander and interact.
