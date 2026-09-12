# ORBis — Phase 10 Universal Curriculum Expansion Implementation Plan
## Scalable 50-Lesson Multi-Grade International Curriculum Expansion

**Target Phase:** Phase 10 — Universal Curriculum Expansion  
**Plan Date:** August 29, 2026  
**Status:** **PROPOSED & PENDING APPROVAL (DO NOT IMPLEMENT YET)**  
**Zero-Destructive Guardrail:** Strict protection of Phase 1–9 systems, 10 flagship games, authentication, parent PIN security, story generation, and economy.

---

## 1. Executive Implementation Strategy

Phase 10 transitions ORBis from a working demonstration prototype with 10 flagship cinematic lessons into a genuinely comprehensive learning universe featuring **50+ character-guided, multi-grade, international academic lessons**.

### Protected Invariant Systems (Zero Regression Permitted)
1. **Story Generation & Studio:** No modifications to story generation or Gemini/TTS infrastructure.
2. **10 Canonical Flagship Games:** Potion Scales, Spellforge, Ecosystem Sandbox, RoboPath, Mystery Detective, Rhythm Spells, Word Trace, Magic Machine, Memory Museum, Cosmic Constellations.
3. **Child Economy & Rewards:** XP, Stars, Leveling multipliers, and streak mechanics.
4. **Parent Zone & Security:** PIN locks, quota meters, and child safety gates.
5. **Phase 9 Responsive Navigation & Theming:** Mobile Bottom Nav, Header Explore dropdown, Cosmic Landing portal, Vector Mascots.

---

## 2. Phased Rollout Roadmap

```
+---------------------------------------------------------------------------------------+
|                       PHASE 10 MULTI-STAGE EXECUTION ROADMAP                          |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [PHASE 10A] Data Architecture, Grade 6 Expansion & Universal Test Validator          |
|      ├── Add Grade 6 to GradeBand types & subject definitions                          |
|      ├── Build dynamic test_academy_universal_curriculum_validator.ts                 |
|      └── Establish canonical lesson factory authoring utilities                        |
|                                                                                       |
|  [PHASE 10B] Early Years & Foundation Expansion (Pre-K, Kindergarten, Grade 1)         |
|      ├── 15 New Cinematic Lessons (Counting, Shapes, Rhymes, Habitats, Emotions)     |
|      └── Non-reader visual choice enforcement & audio prompt verification             |
|                                                                                       |
|  [PHASE 10C] Intermediate & Upper Elementary Expansion (Grades 2, 3, 4, 5, 6)         |
|      ├── 25 New Cinematic Lessons (Fractions, Ecology, Coding Loops, Pre-Algebra)     |
|      └── Integration with Capstone Flagship Games & Learning Director DAG             |
|                                                                                       |
|  [PHASE 10D] Universal Multilingual Localization & Final Regression Verification      |
|      ├── English, Urdu, Spanish, Arabic, French, Japanese translation dictionaries    |
|      └── 60+ Master Test Suite Execution & Production Build Verification              |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

---

## 3. Detailed Phase Breakdown

### Stage 10A: Data Architecture & Universal Test Validator

1. **Grade 6 Integration:**
   - Update `GradeBand` in `src/types/learningUniverse.ts` to fully support `grade_6`.
   - Add Grade 6 configuration to `GRADE_BAND_CONFIGS` in `src/styles/academyTokens.ts` (target lesson duration: 8–10 min, focused visual density).
2. **Automated Universal Validator Suite:**
   - Create `scripts/test_academy_universal_curriculum_validator.ts` to automatically validate all lessons across:
     - Grade band validation ($\in \text{Pre-K} \dots \text{Grade 6}$)
     - Realm & subject ID matching
     - Guide companion ID matching
     - 4-Tier hint completeness
     - Reward integrity ($20 \le \text{XP} \le 100$, $1 \le \text{Stars} \le 5$)
     - Prerequisite acyclicity in Learning Director DAG

---

### Stage 10B: Early Years Expansion (Pre-K, Kindergarten, Grade 1)

**Target: 15 New Lessons (Total Early Years: 19 Lessons)**

#### Pre-K Curriculum (Ages 3–4):
1. `lesson_prek_color_sorting` (Creativity/Math • Poly) — Sort star gems by primary color.
2. `lesson_prek_shape_constellations` (Math • Poly) — Identify circles, triangles, and squares.
3. `lesson_prek_animal_sounds` (Reading/Phonics • Lexi) — Connect animal sounds to creature avatars.
4. `lesson_prek_belly_breathing` (SEL • Harmony) — Follow gentle breathing bubble animations.
5. `lesson_prek_big_small` (Math • Poly) — Compare giant celestial crystals with tiny stardust pebbles.

#### Kindergarten Curriculum (Ages 5–6):
1. `lesson_k_counting_10` (Math • Poly) — Fill ten-frames up to 10.
2. `lesson_k_rhyme_time` (Reading/Phonics • Lexi) — Match rhyming runes (CAT / HAT / BAT).
3. `lesson_k_living_things` (Science • Newton) — Distinguish living plants and animals from non-living rocks.
4. `lesson_k_robot_steps` (Computer Science • BEEP-0) — Guide BEEP-0 forward 3 steps to the battery charging station.
5. `lesson_k_sharing_fair` (SEL • Harmony) — Divide 4 apples equally between 2 animal friends.

#### Grade 1 Curriculum (Ages 6–7):
1. `lesson_g1_subtraction_jumps` (Math • Poly) — Jump backward on the number line ($10 - 4 = 6$).
2. `lesson_g1_sight_words` (Reading • Lexi) — Identify high-frequency sight runes in story sentences.
3. `lesson_g1_plant_parts` (Science • Newton) — Roots, stems, leaves, and flowers in the biome greenhouse.
4. `lesson_g1_noun_detective` (Grammar • Lexi) — Spot people, places, and things in the library.
5. `lesson_g1_pattern_repeats` (Computer Science/Logic • BEEP-0) — Complete ABAB and ABCABC tile patterns.

---

### Stage 10C: Intermediate & Upper Elementary Expansion (Grades 2 to 6)

**Target: 25 New Lessons (Total 50+ Lessons across ORBis Universe)**

#### Grade 2 Curriculum (Ages 7–8):
1. `lesson_g2_place_value_tens` (Math • Poly) — Grouping tens and ones to make 54.
2. `lesson_g2_habitat_food_chains` (Science • Newton) — Solar energy $\to$ Clover $\to$ Rabbit $\to$ Fox.
3. `lesson_g2_compound_words` (Grammar • Lexi) — Combine SUN + FLOWER into SUNFLOWER.
4. `lesson_g2_musical_dynamics` (Music • Aria) — Piano (soft) vs Forte (loud) sound waves.

#### Grade 3 Curriculum (Ages 8–9):
1. `lesson_g3_multiplication_arrays` (Math • Poly) — $3 \times 4$ crystal grids.
2. `lesson_g3_fraction_halves_fourths` (Math • Poly) — Partition potion bars and pizzas.
3. `lesson_g3_force_magnets` (Science • Newton) — North and South magnetic poles and repulsion.
4. `lesson_g3_story_main_idea` (Reading • Lexi) — Identify the central theme of paragraph scrolls.
5. `lesson_g3_debugging_commands` (Computer Science • BEEP-0) — Fix a broken 4-step robot routine.

#### Grade 4 Curriculum (Ages 9–10):
1. `lesson_g4_balance_equations_intro` (Math • Poly) — $x + 7 = 15$ with potion balance scales.
2. `lesson_g4_energy_transfer` (Science • Newton) — Potential energy $\to$ Kinetic motion on roller tracks.
3. `lesson_g4_prefixes_un_re_dis` (Grammar/Vocab • Lexi) — Morphology on the linguistic anvil.
4. `lesson_g4_conditional_if_else` (Computer Science • BEEP-0) — IF obstacle $\to$ TURN, ELSE $\to$ MOVE.
5. `lesson_g4_inference_clues` (Reading • Sherlock) — Deduce character motives from textual evidence.

#### Grade 5 Curriculum (Ages 10–11):
1. `lesson_g5_fraction_multiplication` (Math • Poly) — Multiplying unit fractions with visual area grids.
2. `lesson_g5_ecosystem_balance` (Science • Newton) — Trophic cascading in living biomes.
3. `lesson_g5_shades_of_meaning_tier2` (Vocabulary • Lexi) — Rank nuanced adjectives by emotional intensity.
4. `lesson_g5_deduction_grid_matrix` (Logic • Sherlock) — Solve 3x3 alibi elimination matrices.
5. `lesson_g5_solar_spectral_classes` (Astronomy/Science • Nova) — O/B blue giants vs M red dwarfs.

#### Grade 6 Curriculum (Ages 11–12):
1. `lesson_g6_ratios_proportions` (Math • Poly) — Mixing potion recipes with 2:3 reagent ratios.
2. `lesson_g6_algebraic_expressions` (Math • Poly) — Variable substitution ($2n + 5$ when $n=4$).
3. `lesson_g6_structural_engineering` (Science • Newton) — Bridge trusses, tension cables, and compression arches.
4. `lesson_g6_algorithmic_efficiency` (Computer Science • BEEP-0) — Compare nested loops vs single passes.
5. `lesson_g6_scientific_hypothesis` (Critical Thinking/Science • Newton & Sherlock) — Formulate and test falsifiable hypotheses.

---

### Stage 10D: Multilingual Localization & Final Regression Verification

1. **Localization Expansion:**
   - Implement `translations` dictionaries for target languages (`ur`, `es`, `ar`, `fr`, `ja`).
   - Validate RTL layout and icon alignment.
2. **Master Test Suite Run:**
   - Execute all test suites including `test_academy_universal_curriculum_validator.ts`.
   - Verify 0 TypeScript errors and clean Vite production build.

---

## 4. Acceptance Criteria

| ID | Criterion | Verification Method | Target Result |
|---|---|---|---|
| **AC-1** | 50+ Total Registered Lessons | `CINEMATIC_LESSONS_REGISTRY` length | $\ge 50$ interactive lessons |
| **AC-2** | Full Grade-Band Coverage | Pre-K to Grade 6 presence | $\ge 4$ lessons per grade band |
| **AC-3** | Full Realm Coverage | 10 Core Academic Realms | $\ge 3$ lessons per realm |
| **AC-4** | 4-Tier Scaffolding Invariant | Micro-question schema check | 100% of micro-questions have 4 hints |
| **AC-5** | Non-Reader Pre-K/K Integrity | Schema inspection | 100% of Pre-K/K options have visual icons & voice prompts |
| **AC-6** | Economy & Reward Integrity | Reward range validation | $20 \le \text{XP} \le 100$, $1 \le \text{Stars} \le 5$ |
| **AC-7** | Universal Test Validation | Automated runner | 100% of curriculum validator assertions pass |
| **AC-8** | Zero Regression on Phase 1–9 | Full test runner (`run_all_tests.ts`) | All suites pass with 0 errors |

---

## 5. Explicit Directive Status

> [!IMPORTANT]  
> **DO NOT IMPLEMENT YET.**  
> This implementation plan represents the comprehensive architectural roadmap for Phase 10. Execution will commence only upon explicit user review and approval.
