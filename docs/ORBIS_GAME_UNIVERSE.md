# ORBis Game Universe: Standalone Interactive Games Portfolio & Architecture

> **Status:** Master Product & Technical Architecture Document  
> **Core Principle:** ORBis is an alive, magical interactive universe for children. Stories, standalone games, creative sandboxes, and brain development quests form a unified, deeply engaging universe. Standalone games operate independently of stories with their own gameplay loops, deterministic logic, progressive mastery, tactile animations, and zero-cost local execution.

---

## 1. Executive Summary & Strategic Shift

### The Vision
While Story DNA interactive activities (`Story Quiz`, `Story Memory Quest`, and `Word Trace`) remain high-value reading companions, **they are not the sole entertainment anchor of ORBis**. 

When a child enters ORBis, they are empowered with four core paths:
1. 📖 **Read a Story:** Immersive illustrated storytelling with narration.
2. 🎮 **Play Standalone Games:** Genuinely fun, highly replayable, skill-building standalone games.
3. 💡 **Complete Learning Quests:** Story-linked comprehension, memory, and vocabulary challenges.
4. ✨ **Create & Discover:** Build their own magical universe, unlock creatures, decorate worlds, and express creativity.

---

## 2. Phase 1 — Comprehensive 10-Game Portfolio Analysis

---

### Game 1: World Builder (Physics & Spatial Construction Puzzle)
* **Concept:** Children build bridges, aqueducts, ramps, and floating towers using magical geometric blocks, crystals, and wind-gust beams to guide tiny celestial creatures ("Orblings") safely across perilous ravines to their cosmic shrines.
* **Target Age Range:** 6–12 years.
* **Primary Cognitive Skills:** Spatial reasoning, structural logic, intuitive physics (gravity, balance, load distribution), problem-solving.
* **Secondary Skills:** Fine motor planning, trial-and-error resilience, geometric intuition.
* **Why Voluntary Replay:** Sandbox physics satisfaction, multiple valid solutions per level, "sandbox mode" where children can build infinite fantasy towers and watch gravity tests.
* **30-Second First Session:** Place two wooden stone blocks and a crystal plank across a gentle gap. Tap "Release Orblings!" and watch 3 joyful glowing sprites tumble and cheer across the bridge into a star vortex.
* **5-Minute Gameplay Loop:** Solve 3 progressive levels (gaps → counterweights → floating wind-blocks), earning 3 stars on each for structural efficiency (least blocks used). Unlock a new building material ("Bouncy Jelly Crystal").
* **Progression System:** Unlock 24 puzzle stages across 4 biomes (Whispering Forest, Floating Isles, Crystal Caverns, Star Forge). Unlock special material blocks (Bouncy Jelly, Magnetic Granite, Anti-Gravity Glass).
* **Difficulty Scaling:** 
  * *Easy:* Flat stable platforms, clear anchor points, generous physics tolerances.
  * *Medium:* Multi-tier elevations, weight limits, swinging wind obstacles.
  * *Hard:* Moving platforms, dynamic wind currents, strict block count budget.
* **Personalization Opportunities:** Child chooses material themes (Glow Wood, Rose Quartz, Golden Ore) and customized Orbling hats.
* **Animation Opportunities:** Bouncy physics deform, block snap-glows, structural stress creaks (visual vibrations), celebratory Orbling backflips.
* **Sound Opportunities:** Tactile thuds, crystal clinks, cheerful squeaks, whooshing wind currents, triumphant xylophone fanfare.
* **Reward Opportunities:** Stars for efficiency, XP for level completion, unlocking building blocks for sandbox mode.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Engine.** Lightweight 2D spring/rigid-body solver (or pre-baked grid-physics in 2D canvas/SVG). 0 network dependency.
* **AI / API Requirements:** **Zero.** (Optional future feature: AI generates custom building riddles).
* **Estimated Implementation Complexity:** Medium–High (requires robust 2D canvas physics or lightweight deterministic 2D grid-physics engine).
* **Technical Risks:** Physics glitching/tunneling if continuous collision isn't clamped; mobile touch precision for block placement.
* **Retention Potential:** Very High (spatial physics sandbox has legendary natural replayability).
* **Release Target:** **V1 Flagship (Launch).**

---

### Game 2: Creature Lab (Experiment & Discovery Combination Game)
* **Concept:** In a magical alchemist laboratory, children combine elemental essences (Sun Ember, Moon Dew, Breeze Whispers, Earth Clay, Star Dust) in bubbling cauldrons to discover, hatch, name, and evolve mystical pocket creatures.
* **Target Age Range:** 4–10 years.
* **Primary Cognitive Skills:** Categorization, hypothesis testing, cause-and-effect reasoning, systematic experimentation.
* **Secondary Skills:** Deductive memory, scientific note-taking (in-game discovery journal), vocabulary.
* **Why Voluntary Replay:** "Gotta discover them all" collection drive, unexpected funny creature combinations, feeding and interacting with unlocked pets.
* **30-Second First Session:** Drag a Sun Ember and Moon Dew into the shimmering golden cauldron. Stir with finger. The pot bubbles with rainbow steam and pops open to reveal "Glow-Puff", a chirping bioluminescent kitten.
* **5-Minute Gameplay Loop:** Experiment with 6 ingredient combinations, discover 3 new species, log them into the "Almanac of Wonder", and earn a "Junior Biologist" badge + Star currency.
* **Progression System:** 50+ unique discoverable creatures organized into Elemental Families (Pyro, Hydro, Flora, Cosmo, Chrono). Upgrading lab tools (magnifying glass, thermometer, mystical pipette).
* **Difficulty Scaling:**
  * *Easy:* 2-ingredient binary recipes with visual hint shadows.
  * *Medium:* 3-ingredient recipes with temperature/stirring direction constraints.
  * *Hard:* Multi-step synthesis with catalyst crystals and riddle recipes.
* **Personalization Opportunities:** Naming discovered creatures, customizing creature habitats and coloration.
* **Animation Opportunities:** Liquid bubbling shaders, particle steam bursts, egg hatching cracks, creature expressive idle animations.
* **Sound Opportunities:** Liquid sloshing, bubbling pops, magic fizz, creature squeals/purrs, triumphant discovery chord.
* **Reward Opportunities:** Creature collection entries, laboratory decorations, XP and Star minting.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Logic.** Lookup table and state machine with combinatoric recipe hashing.
* **AI / API Requirements:** **Zero.** (Optional: AI generates unique funny backstory snippets for discovered creatures).
* **Estimated Implementation Complexity:** Low–Medium (straightforward state machine with rich SVG/Canvas presentation).
* **Technical Risks:** Ensuring recipe discovery doesn't feel like blind random guessing through clear visual clues.
* **Retention Potential:** Extreme (collection mechanics have the highest intrinsic retention in children's games).
* **Release Target:** **V1 Flagship (Launch).**

---

### Game 3: Mystery Detective (Evidence & Inference Investigation Game)
* **Concept:** The magical ORBis Academy has suffered a harmless mystery (e.g., "Who ate the Moonberry Pie?", "Where is Professor Owl's Golden Key?"). Children interview quirky character suspects, inspect clues with magical tools, eliminate suspects using logic grids, and solve the case.
* **Target Age Range:** 7–12 years.
* **Primary Cognitive Skills:** Deductive logic, evidence synthesis, critical thinking, conditional elimination.
* **Secondary Skills:** Reading comprehension, attention to visual detail, working memory.
* **Why Voluntary Replay:** Procedurally generated mysteries with different culprits and clue configurations each play; detective badge progression.
* **30-Second First Session:** Read a 1-sentence case prompt ("Someone left purple footprint dust in the library"). Click footprints to analyze with the magnifying glass. Cross off Suspects without purple boots.
* **5-Minute Gameplay Loop:** Gather 3 clues across 3 rooms, review the Case Board, deduce the single culprit who had the means and motive, present the verdict, receive a joyful confession and reward.
* **Progression System:** Detective Ranks (Rookie Sleuth → Detective Inspector → Grand Inquisitor of ORBis), unlocking new detective gadgets (UV Starlight Lamp, Sound Sniffer, Footprint Caster).
* **Difficulty Scaling:**
  * *Easy:* 3 suspects, 2 direct clues ("The culprit was wearing a green cape").
  * *Medium:* 4 suspects, indirect clues ("The culprit is taller than the gnome but shorter than the dragon").
  * *Hard:* 5 suspects, time-window alibis and negative condition logic ("If Pip was in the garden, then Pip could not have been in the kitchen").
* **Personalization Opportunities:** Custom detective badge, customizable detective trench-coat avatar, custom detective office.
* **Animation Opportunities:** Magnifying glass distortion zoom, fingerprint dust shimmer, dramatic accusation spotlight and gavel drop.
* **Sound Opportunities:** Cozy noir jazz acoustic guitar, magnifying glass whoosh, clue discovery chime, case solved brass fanfare.
* **Reward Opportunities:** Detective Badges, Star bounties, XP, unlockable case files.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Engine.** Logic-grid solver generator using constraint satisfaction algorithms (CSP).
* **AI / API Requirements:** **Zero.** (Optional: LLM can generate novel comedic character dialogue seeds).
* **Estimated Implementation Complexity:** Medium (logic grid generator + interactive case board).
* **Technical Risks:** Generating contradictory or unsolvable clue sets (mitigated by strict automated CSP solver verification during generation).
* **Retention Potential:** High (satisfaction of mystery solving and "aha!" moments).
* **Release Target:** **V1 Flagship (Launch).**

---

### Game 4: Brainstorm Arena (Adaptive Rapid Cognitive Challenge Game)
* **Concept:** A fast-paced, high-energy arcade mini-game arena where children face 60-second lightning rounds of rapid-fire micro-challenges testing pattern recognition, number sense, odd-one-out categorization, spatial rotations, and speed memory.
* **Target Age Range:** 5–12 years.
* **Primary Cognitive Skills:** Processing speed, cognitive flexibility, working memory, inhibitory control (Stroop-style tasks).
* **Secondary Skills:** Hand-eye coordination, numerical fluency, visual discrimination.
* **Why Voluntary Replay:** High-energy arcade rhythm, beating personal high scores, daily brain workout routines.
* **30-Second First Session:** Complete 3 micro-challenges in 15 seconds: Tap the highest glowing number → Find the flipped star → Don't tap the red dragon! Triumphant combo counter pulses `x3`!
* **5-Minute Gameplay Loop:** Play two 90-second rounds, hit a 15-streak combo, beat yesterday's high score, review a radar chart of brain skill improvements, and earn daily XP.
* **Progression System:** Arena Tiers (Bronze Star → Silver Comet → Gold Supernova → Mythic Astral), unlockable arena themes and combo streak visual effects (fire, lightning, stardust).
* **Difficulty Scaling:** Dynamic adaptive scaling — 3 consecutive correct answers increases speed and challenge complexity; 2 mistakes slightly lowers pace to prevent frustration.
* **Personalization Opportunities:** Arena banners, avatar celebration poses, combo effect trails.
* **Animation Opportunities:** Combo counter explosions, screen-shake pulses (disabled on reduced-motion), energetic score count-ups, countdown clock urgency rings.
* **Sound Opportunities:** Upbeat synth-pop arcade tempo, snappy clicks, multiplier riser sounds, combo cheer chorus.
* **Reward Opportunities:** Daily brain streak bonuses, high-score trophies, massive XP yields.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Code.** Algorithmic micro-task generators with PRNG seeds.
* **AI / API Requirements:** **Zero.**
* **Estimated Implementation Complexity:** Low–Medium (suite of 10 micro-game mini-templates controlled by a rapid state sequencer).
* **Technical Risks:** Keeping touch latency under 50ms for rapid tapping; ensuring tasks are unambiguous within 1 second of perception.
* **Retention Potential:** Extreme (daily habit driver, fast "bite-sized" dopamine loop).
* **Release Target:** **V1 Flagship (Launch).**

---

### Game 5: Dragon Rescue (Route Planning & Optimization Game)
* **Concept:** Guide friendly baby dragons through enchanted obstacle mazes, wind tunnels, and shifting tile puzzles to reach their mothers by laying down motion tiles (Forward, Turn Right, Fly High, Freeze Water).
* **Target Age Range:** 6–11 years.
* **Primary Cognitive Skills:** Algorithmic thinking, sequential planning, spatial orientation, debugging/troubleshooting.
* **Secondary Skills:** Executive function, predictive modeling.
* **Why Voluntary Replay:** Programming puzzle satisfaction, optimization challenges (least tiles used), dragon customization.
* **30-Second First Session:** Place [Forward] [Forward] [Turn Right] [Forward] on a grid. Press "Fly!" and watch the baby dragon hop along the path and collect two gold stars.
* **5-Minute Gameplay Loop:** Complete 4 levels involving obstacle avoidance, loop tiles, and pressure plates. Unlock the "Ice Dragon" species.
* **Progression System:** 30 levels across 5 worlds; unlocking dragon companions with unique abilities (Fire melts ice, Earth breaks boulders).
* **Difficulty Scaling:** Increasing grid size (3x3 → 8x8), introducing condition blocks ("If obstacle, turn left"), and limited tile inventories.
* **Personalization Opportunities:** Dragon skins, personalized breath effects (sparkles, hearts, bubbles).
* **Animation Opportunities:** Isometric or top-down dragon hopping, wing flutter, smoke puffs, obstacle collapse.
* **Sound Opportunities:** Dragon happy coos, tile snap sounds, stepping crunch, level victory roar.
* **Reward Opportunities:** Star ratings (1-3 stars per level), dragon evolution points.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Engine.**
* **AI / API Requirements:** **Zero.**
* **Estimated Implementation Complexity:** Medium (grid pathfinding and step execution interpreter).
* **Technical Risks:** Preventing infinite execution loops with strict step execution limits.
* **Retention Potential:** Very High.
* **Release Target:** **V1.5.**

---

### Game 6: Beat Forge (Rhythm & Pattern Creation Game)
* **Concept:** In a magical crystal forge, children tap along to rhythmic spell patterns, sync elemental beats, and compose their own looping musical spells that power up the ancient machinery of ORBis.
* **Target Age Range:** 5–12 years.
* **Primary Cognitive Skills:** Auditory pattern recognition, temporal coordination, working memory, creative expression.
* **Secondary Skills:** Timing accuracy, focus and concentration.
* **Why Voluntary Replay:** Music sandbox creativity, satisfying musical feedback, exporting/saving created tunes.
* **30-Second First Session:** Tap 4 glowing crystal runes on beat as light pulses reach the center. The forge erupts in harmonic chords and sparkling light.
* **5-Minute Gameplay Loop:** Match 3 rhythm tracks (Forest Folk, Astral Synth, Deep Cave Drum), then open the "Composer Table" to arrange a 4-bar loop and assign it as the player's personal profile anthem.
* **Progression System:** Unlocking instrument packs (Harp, Marimba, 8-Bit Synth, Crystal Flute) and sound effects.
* **Difficulty Scaling:** Simple 4/4 quarter notes → syncopation, off-beat hits, and multi-track polyrhythms.
* **Personalization Opportunities:** Composing custom themes, customizing crystal soundboards.
* **Animation Opportunities:** Rhythmic pulsing visualizers, reactive background elements swaying to BPM.
* **Sound Opportunities:** Rich multi-voice Web Audio synthesis, pentatonic scales (guaranteeing everything sounds melodious and harmonic).
* **Reward Opportunities:** Maestro badges, Stars, unlocking audio soundfonts.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Web Audio API.**
* **AI / API Requirements:** **Zero.**
* **Estimated Implementation Complexity:** Medium (requires strict Web Audio `AudioContext.currentTime` scheduling to prevent audio latency drift).
* **Technical Risks:** Audio scheduling drift on low-end mobile devices if based on `setTimeout` instead of native audio clock.
* **Retention Potential:** High.
* **Release Target:** **V1.5.**

---

### Game 7: Shadow Hunt (Animated Visual Observation Game)
* **Concept:** Animated silhouettes and camouflaged magical creatures dart through dense, layered storybook landscapes. Children use optical tools (spotlight, color filters, moonlight lens) to spot hidden anomalies, matching shapes, and camouflaged fairies.
* **Target Age Range:** 4–8 years.
* **Primary Cognitive Skills:** Visual search, visual discrimination, figure-ground segregation, selective attention.
* **Secondary Skills:** Detail orientation, patience.
* **Why Voluntary Replay:** Hidden object discovery thrill, animated scenery surprises, finding secret easter eggs.
* **30-Second First Session:** Move a glowing lantern across a dark tree canopy to reveal 3 hidden glowing owl eyes that chirp and flutter away.
* **5-Minute Gameplay Loop:** Search 2 detailed panoramas, locate 10 hidden items within a time challenge, uncover a secret passage leading to a rare collectible.
* **Progression System:** Unlocking new illustrated biomes and collection stamps for the Explorer's Passport.
* **Difficulty Scaling:** Larger canvases, moving/fleeting targets, color-masked backgrounds, visual distractor decoys.
* **Personalization Opportunities:** Custom explorer lantern designs and sticker books.
* **Animation Opportunities:** Layered parallax scrolling, ambient foliage sway, creature peek-a-boo animations.
* **Sound Opportunities:** Atmospheric nature ambience, magnifying shimmer, joyful chime on item discovery.
* **Reward Opportunities:** Explorer Stamps, Stars, XP.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local SVG/Canvas.**
* **AI / API Requirements:** **Zero.**
* **Estimated Implementation Complexity:** Low–Medium (rich asset-heavy visual rendering).
* **Technical Risks:** Large image asset payloads if not optimized into vector SVGs or efficient WebP sprites.
* **Retention Potential:** Medium–High (especially for younger age cohorts 4–7).
* **Release Target:** **V1.5.**

---

### Game 8: Rune Machine (Symbolic Pattern & Code Logic Game)
* **Concept:** Ancient robotic golems in ORBis need their rune cores reprogrammed. Children assemble visual logic gates, color-coded pipes, and loop pulleys to channel energy streams and solve state-machine puzzles.
* **Target Age Range:** 8–12 years.
* **Primary Cognitive Skills:** Abstract logic, Boolean operations (AND/OR/NOT), sequencing, state transformation.
* **Secondary Skills:** Systems thinking, debugging.
* **Why Voluntary Replay:** Deep intellectual satisfaction from complex logic solving; community level sharing.
* **30-Second First Session:** Rotate a splitter rune so blue energy flows to the left crystal and red energy flows to the right. The golem's eye powers on and waves.
* **5-Minute Gameplay Loop:** Solve 3 golem challenges incorporating inverter runes and conditional switches. Power up a giant guardian golem.
* **Progression System:** Golem Repair Master ranks, unlocking advanced logic components (Counters, Delay Runes, Memory Runes).
* **Difficulty Scaling:** Linear logic flows → branch conditionals → cyclical loops with variable limits.
* **Personalization Opportunities:** Customizing golem armor and rune glyph styles.
* **Animation Opportunities:** Flowing neon energy particles through glass tubes, mechanical gears turning, golem expressive eye visors.
* **Sound Opportunities:** Mechanical clanks, pneumatic hisses, hum of flowing energy, electrical success chime.
* **Reward Opportunities:** Master Coder Badges, Golem Companion unlocks.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Engine.**
* **AI / API Requirements:** **Zero.**
* **Estimated Implementation Complexity:** Medium–High (visual node graph / circuit evaluation engine).
* **Technical Risks:** UI complexity on small mobile screens with intricate logic node connections.
* **Retention Potential:** High for puzzle enthusiasts, but potentially too intimidating for under-6 age groups.
* **Release Target:** **V2.**

---

### Game 9: Tiny World (Interactive Ecosystem & Systems-Thinking Game)
* **Concept:** Children manage a living terrarium sphere or floating biosphere. By balancing water, sunlight, soil nutrients, and animal populations, they cultivate a thriving magical ecosystem with weather cycles and blooming life.
* **Target Age Range:** 7–12 years.
* **Primary Cognitive Skills:** Systems thinking, ecological causality, equilibrium balancing, resource management.
* **Secondary Skills:** Environmental empathy, long-term planning.
* **Why Voluntary Replay:** Tamagotchi-like attachment to their persistent living world, checking in daily to see how plants have grown.
* **30-Second First Session:** Seed a cloud with rain drops over a dry meadow. Flowers bloom instantly and two butterflies arrive to pollinate.
* **5-Minute Gameplay Loop:** Balance a mini-ecosystem over 3 simulated seasons, introduce a predator-prey balance, unlock a rare "Golden Blossom" tree.
* **Progression System:** Terrarium size expansion, unlocking new biomes (Tundra, Rainforest, Coral Atoll, Moon Garden).
* **Difficulty Scaling:** Simple single-variable balance (water + seeds) → multi-variable interdependent webs (temperature, oxygen, soil ph, food chains).
* **Personalization Opportunities:** Decorating the terrarium with ancient ruins, bridges, and glowing mushrooms.
* **Animation Opportunities:** Plant growth morphing, swimming fish, cloud formation and rainfall particle systems.
* **Sound Opportunities:** Soothing rain, breeze rustle, birdsong, bubbling brooks, gentle nature acoustics.
* **Reward Opportunities:** Ecosystem Health Stars, rare botanical seed unlocks.
* **Offline / Deterministic Feasibility:** **100% Deterministic Local Simulation Engine.** (Lightweight discrete math step model).
* **AI / API Requirements:** **Zero.**
* **Estimated Implementation Complexity:** High (simulation balance parameters, save-state serialization).
* **Technical Risks:** Ecosystem balance instability (death spirals) frustrating young players if math is too punitive.
* **Retention Potential:** Extremely High (persistent world ownership).
* **Release Target:** **V2.**

---

### Game 10: Dream Studio (Creative Character & World Creation Game)
* **Concept:** A guided creative sandbox where children paint, craft, dress, voice, and script their own characters and miniature interactive scenes. Characters created here can become actors in custom user-generated AI stories.
* **Target Age Range:** 5–12 years.
* **Primary Cognitive Skills:** Creative imagination, narrative storytelling, character empathy, visual design.
* **Secondary Skills:** Expressive communication, self-reflection.
* **Why Voluntary Replay:** Infinite creative canvas, pride in personal creations, seeing their own characters star in personalized AI stories.
* **30-Second First Session:** Pick a body template, spray-paint wings with purple glitter, attach googly star-eyes, and hear it speak in a funny voice.
* **5-Minute Gameplay Loop:** Create a character, choose their signature personality and catchphrase, place them in a mini scene with interactive props, and save them to the "ORBis Character Roster".
* **Progression System:** Unlocking art materials (Glitter brushes, Neon glow, Animated texture stamps) and scene backdrops.
* **Difficulty Scaling:** Freeform stickers and coloring for ages 4–6 → custom dialogue writing, attribute tuning, and animation timeline triggers for ages 8–12.
* **Personalization Opportunities:** 100% user-generated creative asset ownership.
* **Animation Opportunities:** Puppet rigging, reactive facial expression sliders, bouncy physics props.
* **Sound Opportunities:** Funny voice modulators, painting splatter sounds, sticker pop clicks.
* **Reward Opportunities:** Creative Artist Badges, publishing characters to the Family Showcase.
* **Offline / Deterministic Feasibility:** **100% Local Canvas / SVG Manipulation.**
* **AI / API Requirements:** **Zero for Creation.** (Optional: 1 LLM call when exporting the character into a full personalized Story Book).
* **Estimated Implementation Complexity:** High (rich vector canvas drawing and sticker placement tool).
* **Technical Risks:** Canvas export memory consumption on low-end mobile devices.
* **Retention Potential:** Extremely High (emotional attachment to self-made characters).
* **Release Target:** **V2.**

---

## 3. Phase 2 — Comprehensive 10-Game Scoring & Ranking

Every game evaluated from 1–10 across 8 objective product dimensions:
* **Fun:** Intrinsic moment-to-moment joy and tactile delight.
* **Replay:** Natural voluntary return potential without coercive grinding.
* **Edu:** Meaningful cognitive development (logic, memory, spatial, speed, science).
* **Wow:** Visual spectacle, animation appeal, and magic factor.
* **Feas:** Implementation feasibility in React/Vite/TypeScript without fragile third-party bloat.
* **Cost:** Zero runtime cost and deterministic local-first execution.
* **Diff:** Differentiation from standard boring educational apps.
* **Monet:** Premium tier appeal, cosmetic unlocks, and parent subscription value.

| Rank | Game Concept | Fun | Replay | Edu | Wow | Feas | Cost | Diff | Monet | Total / 80 | Primary Tier |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Creature Lab** | 10 | 10 | 9 | 10 | 9 | 10 | 10 | 9 | **77 / 80** | **V1 Flagship** |
| **2** | **World Builder** | 10 | 10 | 10 | 9 | 8 | 10 | 9 | 9 | **75 / 80** | **V1 Flagship** |
| **3** | **Brainstorm Arena** | 9 | 10 | 9 | 8 | 10 | 10 | 9 | 10 | **75 / 80** | **V1 Flagship** |
| **4** | **Mystery Detective** | 9 | 9 | 10 | 9 | 8 | 10 | 10 | 9 | **74 / 80** | **V1 Flagship** |
| **5** | **Dragon Rescue** | 8 | 9 | 9 | 8 | 9 | 10 | 8 | 8 | **69 / 80** | **V1.5** |
| **6** | **Beat Forge** | 9 | 8 | 8 | 9 | 7 | 10 | 9 | 8 | **68 / 80** | **V1.5** |
| **7** | **Shadow Hunt** | 8 | 7 | 7 | 9 | 9 | 10 | 8 | 7 | **65 / 80** | **V1.5** |
| **8** | **Tiny World** | 9 | 10 | 10 | 9 | 5 | 10 | 9 | 9 | **71 / 80** | **V2** |
| **9** | **Dream Studio** | 9 | 9 | 8 | 10 | 5 | 10 | 10 | 9 | **70 / 80** | **V2** |
| **10** | **Rune Machine** | 8 | 8 | 9 | 7 | 7 | 10 | 8 | 7 | **64 / 80** | **V2** |

---

## 4. Phase 3 — Evaluation & Definitive Selection of the First Four Games

### Evaluation of the Proposed Four:
The initial proposal suggested:
1. *World Builder* (Spatial/Physics)
2. *Mystery Detective* (Inference/Logic)
3. *Creature Lab* (Discovery/Experimentation)
4. *Brainstorm Arena* (Speed/Cognitive Flexibility)

### Critical Challenge:
* *Did any other concept outperform these 4 in V1 feasibility and impact?*
  - **Tiny World** and **Dream Studio** scored very high in long-term retention (71 and 70), but their technical implementation complexity (simulation math, complex drawing engine) would delay V1 standalone games by weeks and create scope bloat.
  - **Dragon Rescue** (69) is strong, but *World Builder* delivers superior open-ended spatial delight with higher visual appeal.
  - **Shadow Hunt** (65) is asset-heavy without enough deep cognitive challenge for older children.
  - **Beat Forge** (68) has mobile audio clock risks across fragmented Android devices that are better addressed in V1.5.

### Definitive Decision: The First 4 Flagship Standalone Games
The analysis confirms that the proposed quartet represents the **optimal, perfectly balanced cognitive and gameplay matrix**:

1. **Creature Lab (Discovery & Chemistry):** Focuses on inductive reasoning, experimentation, curiosity, and collection.
2. **World Builder (Spatial & Physics):** Focuses on 2D structural mechanics, gravity, spatial planning, and sandbox creativity.
3. **Mystery Detective (Logic & Deduction):** Focuses on critical thinking, evidence analysis, reading comprehension, and deductive elimination.
4. **Brainstorm Arena (Speed & Cognitive Agility):** Focuses on working memory, reaction speed, inhibitory control, and daily engagement habits.

---

## 5. Phase 4 — Common Game Engine Architecture

To ensure games are not ad-hoc single-use scripts, all standalone games will adhere to the unified **ORBis Standalone Game Engine**.

```
                           ┌────────────────────────────────────────┐
                           │            GameRegistry                │
                           │   (Metadata, Icons, Domain Taxonomy)   │
                           └──────────────────┬─────────────────────┘
                                              │
                   ┌──────────────────────────┴──────────────────────────┐
                   ▼                                                     ▼
      ┌──────────────────────────┐                         ┌──────────────────────────┐
      │   Standalone Game UI     │                         │   ActivityShell & UI     │
      │  (e.g. CreatureLab.tsx)  │                         │   (Header, Badges, SFX)  │
      └────────────┬─────────────┘                         └─────────────┬────────────┘
                   │                                                     │
                   ├──────────────────────────┬──────────────────────────┤
                   ▼                          ▼                          ▼
      ┌──────────────────────────┐ ┌────────────────────┐ ┌──────────────────────────┐
      │ Deterministic Generator  │ │ sfxService Engine  │ │  useActivityEconomy Hook │
      │  & Local State Machine   │ │ (Synthetic Audio)  │ │ (Lifecycle & Dedupe Lock)│
      └──────────────────────────┘ └────────────────────┘ └──────────────┬───────────┘
                                                                         │
                                                                         ▼
                                                            ┌──────────────────────────┐
                                                            │   economyService Bridge  │
                                                            └────────────┬─────────────┘
                                                                         │
                                                                         ▼
                                                            ┌──────────────────────────┐
                                                            │  PostgreSQL Ledger & RPC │
                                                            │  (award_child_rewards)   │
                                                            └──────────────────────────┘
```

### Core Architectural Contracts:

1. **`GameRegistry` (`src/services/games/gameRegistry.ts`):**
   - Central catalog mapping game IDs (`world_builder`, `creature_lab`, `mystery_detective`, `brainstorm_arena`) to metadata, icons, age ranges, primary/secondary cognitive domains, and route endpoints.

2. **`GameMetadata` (`src/types/games/engine.ts`):**
   ```typescript
   export interface StandaloneGameMetadata {
     id: string
     title: string
     tagline: string
     emoji: string
     primaryDomain: CognitiveDomain
     secondaryDomains: CognitiveDomain[]
     minAge: number
     maxAge: number
     supportsDifficulty: boolean
     supportsSandbox: boolean
     isAvailable: boolean
   }
   ```

3. **`GameSession` & Local State Lifecycle:**
   - Every game component runs a standard lifecycle:
     `IDLE → PLAYING → PAUSED → CALCULATING_SCORE → CELEBRATING → COMPLETED`.
   - Bounded telemetry tracking: `durationSeconds`, `movesCount`, `mistakesCount`, `hintsUsed`, `accuracyPercentage`.

4. **Unified Economy & Idempotency Bridge:**
   - Standalone games use `useActivityEconomy({ childId, activityType: gameId, activityId: levelOrSessionId })`.
   - Rewards are bounded and minted through `economyService.completeActivity()`, backed by the authoritative `child_activity_rewards` ledger.

5. **Audio & Sensory Integration:**
   - Zero audio asset downloads; all tactile feedback uses `sfxService.play()` with safe volume clamping and `prefers-reduced-motion` compliance.

---

## 6. Phase 5 — Progression Model: Beyond Artificial Grinding

ORBis progression is built around **meaningful creative mastery and discovery**, explicitly rejecting coercive screen-time loops, pay-to-win mechanics, or infinite artificial grinding.

### What Children Unlock:
1. **Cosmic Regions & World Maps:** Completing games and reading stories uncovers new magical biomes on the child's interactive map (Crystal Caverns, Star Forge, Cloud Citadel).
2. **Creature Companions:** Discovered in Creature Lab and fed/placed in their personal world sanctuary.
3. **Sandbox Building Materials:** World Builder unlocks advanced materials (Anti-Gravity Glass, Rainbow Slime, Magnetic Granite) for open-ended creative construction.
4. **Detective Gadgets & Badges:** Mystery Detective unlocks sleuth tools and printable mystery certificates for parents and children.
5. **Avatar Cosmetics & Aura Effects:** Stardust particle trails, enchanted hats, and custom profile banners.

### Database Progression Schema (Draft Specification for Future Migration):
```sql
-- Unlocked creative assets and world progression for the active child profile
CREATE TABLE IF NOT EXISTS child_world_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  unlocked_regions JSONB NOT NULL DEFAULT '["whispering_grove"]'::jsonb,
  discovered_creatures JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_materials JSONB NOT NULL DEFAULT '["basic_stone", "wood_plank"]'::jsonb,
  avatar_cosmetics JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_child_world_progression UNIQUE(child_id)
);
```

---

## 7. Phase 6 — Visual Identity & Aesthetics Guidelines

ORBis standalone games must never look like generic SaaS dashboards, boring flashcards, or Bootstrap grids.

### The ORBis Aesthetic Pillars:
1. **Magical Organic Environments:** Warm, layered, luminous color palettes (Indigo `#1e1b4b`, Cosmic Purple `#6c5ce7`, Starlight Gold `#f59e0b`, Emerald Glow `#10b981`).
2. **Tactile Physics & Motion:** Interactive elements have mass, organic press depth (scale `0.97` on press), and smooth spring releases (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
3. **Rich Visual Feedback:** Every correct action produces glowing light sparks, chime vibrations, and celebratory particles.
4. **Accessible Sensory Safeguards:** Strict adherence to `prefers-reduced-motion` and large touch boundaries (**≥ 44px**) across all viewports.

---

## 8. Phase 7 — Cost & Sustainability Strategy

1. **Zero-AI Gameplay Loops:** All core game generation, physics, recipe evaluation, deductive constraint satisfaction, and arcade micro-challenges run **100% locally in deterministic TypeScript/Canvas code**.
2. **Offline-Ready:** Once loaded in the browser/client, games function smoothly without network latency or server roundtrips.
3. **Selective High-Value AI Touchpoints:** AI is reserved for premium, high-impact moments (e.g. generating a full personalized bedtime story starring a creature discovered in Creature Lab), avoiding per-action API costs.

---

## 9. Implementation Roadmap

### Wave 1: The First 4 Standalone Games (V1 Flagship)
* **Milestone 1:** Game 1 — **Creature Lab** (*See comprehensive design spec: `docs/ORBIS_CREATURE_LAB_SPEC.md`*) (Recipe state machine, bubbling cauldron UI, creature almanac).
* **Milestone 2:** Game 2 — **Brainstorm Arena** (Speed micro-games sequencer, streak combo engine).
* **Milestone 3:** Game 3 — **World Builder** (2D spatial construction engine, physics Orblings).
* **Milestone 4:** Game 4 — **Mystery Detective** (Procedural CSP logic grid generator, interactive case board).

### Wave 2: Expanded Universe (V1.5)
* **Dragon Rescue** (Sequential algorithmic pathfinding).
* **Beat Forge** (Web Audio rhythm pattern sequencer).
* **Shadow Hunt** (Layered visual observation panorama).

### Wave 3: Persistent Worlds & Creative Sandbox (V2)
* **Tiny World** (Dynamic ecosystem simulation).
* **Dream Studio** (Vector character crafting & story export).
* **Rune Machine** (Visual node logic engine).
