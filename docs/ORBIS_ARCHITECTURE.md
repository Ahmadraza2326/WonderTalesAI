# ORBIS Technical Architecture

> **Status:** Locked Architecture Document  
> **Rule:** Do not invent architecture that conflicts with the existing codebase. Reuse existing decisions where appropriate and explicitly flag contradictions instead of silently replacing them.

## 1. AI/Provider Abstraction Layer

ORBis relies on provider abstractions to ensure the application does not break if a specific AI service goes down, becomes too expensive, or needs local fallback.

**Implementation (`src/services/ai/`):**
- **Voice:** `VoiceProvider` interface (`generateNarration(segments, options)`). 
  - *Current implementations:* `PiperVoiceProvider` (Local sidecar for Free/Dev), `OrbisVoiceProvider` (Cloud).
- **Images:** `ImageProvider` interface.
  - *Current implementations:* `ServerImageProvider` (Cloudflare Workers AI FLUX with Hugging Face & Procedural SVG fallback), `MockImageProvider` (Testing), `PollinationsImageProvider` (Legacy optional).
- **Text/LLM:** `aiEngine.ts` and `sceneIntelligence.ts` handle story generation, returning structured JSON (Story DNA).

**Architectural Rule:** Never call an external API directly from a React component. Always inject or call the appropriate Provider interface.

## 2. Story Architecture (Story DNA)

Stories in ORBis are not plain text blocks. They are structured data (Story DNA) designed to power multiple downstream experiences (reading, narration, quizzes) from a single generation cost.

**Data Flow:**
1. **Generation:** `aiEngine.ts` generates JSON based on `learningPackageSchema.ts`.
2. **Sanitization:** `jsonCleaner.ts` and `jsonParser.ts` ensure the LLM output is valid JSON, stripping markdown blocks if necessary.
3. **Storage:** Saved to Supabase `stories` table as a JSONB object containing `pages`, `characters`, `vocabulary`, and `metadata`.
4. **Pagination:** `storybookPagination.ts` (React-side) handles converting the DNA into a paginated reading experience (`[...pages]`), calculating layout constraints dynamically.

## 3. Child/Parent State Architecture

The application strictly separates Child (Play) state from Parent (Admin) state.

**Database Layer (Supabase):**
- **Auth User:** The parent account (email/password). Handled via standard Supabase Auth.
- **`profiles`:** Parent-level settings, billing status, and overall quota (`quotaService.ts`).
- **`child_profiles`:** The active child playing the game. Contains child-specific settings (age, name, avatar).

**Client Layer (React Contexts):**
- `AuthContext`: Manages the authenticated Supabase session.
- `ActiveChildContext`: Manages which `child_profile` is currently active.
- *Rule:* The child experience must NEVER surface billing, quota limits, or settings. If quota is empty, the UI gracefully falls back to the Free Story Library.

## 4. Mini-Game & Brain Development Architecture

Mini-games (Story Memory Quest, Word Trace & Vocabulary Quest, Logic Sequencing) are built as modular, reusable components powered strictly by the existing Story DNA.

**Implemented Activities:**
- **`quiz` (`QuizSection`):** Comprehension recall based on `learning_package.quizSeeds`.
- **`memory_match` (`StoryMemoryQuest`):** Active recall matching vocabulary words to definitions, characters to roles, and story locations.
- **`word_trace` (`WordTraceQuest`):** Orthographic spelling, letter-tile assembly, cloze sentence comprehension, and phonemic awareness based on `learning_package.vocabulary`.

**Core Pipeline & Principles:**
1. **Zero Incremental AI Cost:** Mini-games NEVER execute new LLM, TTS, or image generation calls. They extract structured data directly from the already-persisted `learning_package` (Story DNA).
2. **Deterministic Game Generation:**
   - Functions like `generateMemoryQuestGame(story, difficulty)` and `generateWordTraceGame(story, difficulty)` transform `vocabulary`, `characters`, `locations`, `importantObjects`, and `quizSeeds` into gameplay challenges.
   - Seeded pseudo-random generation (`story.id + difficulty + word`) ensures reproducible board states and distractor selections across sessions.
3. **Architectural Pipeline:**
   `Story DNA → deterministic game generation → client gameplay → activity completion contract → economyService.completeActivity() → secure reward ledger (child_activity_rewards)`.
4. **State & Validation:**
   - Active gameplay state (card flips, letter slots, move counts, hints) is managed locally in React state.
   - Completion triggers the server-authoritative RPC `award_child_rewards` via `economyService`, securely minting bounded XP and Stars while preventing duplicate reward claims.

### 4.1 Reusable ORBis Experience Layer Architecture

To ensure ORBis feels like an alive, magical universe rather than a disjointed set of educational widgets, all interactive activities are unified under an **Experience Layer**.

**Responsibility Boundaries:**
1. **Activity Rewards & Economy:**
   `Activity UI → useActivityEconomy → economyService → secure Supabase RPC (award_child_rewards) → child_activity_rewards ledger`
   *Rule:* The server/database remains the single authoritative source of truth for reward minting and idempotency. The React hook standardizes client lifecycle states and guards against redundant network dispatches during a single session, but never bypasses server validation.
2. **Audio & Sound Effects:**
   `Activity UI → sfxService → Web Audio API (synthetic oscillators)`
   *Rule:* Zero external audio dependencies or audio file downloads. Completely safe, non-throwing, and respects user mute state and child volume limits.

**Implementation Status & Modules:**
- **`src/types/experience.ts` (Implemented - Step 1):** Framework-agnostic contracts for `CognitiveDomain`, `ActivityMetadata`, `ActivityEconomyState`, `UseActivityEconomyOptions`, and `UseActivityEconomyReturn`.
- **`src/hooks/useActivityEconomy.ts` (Implemented - Step 1):** Reusable React hook encapsulating submission locks, completion state, and reward status distinction (`awarded` vs `alreadyClaimed`).
- **`src/services/audio/sfxService.ts` (Implemented - Step 1):** Zero-dependency Web Audio API synthesizer supporting 5 core child-friendly cues (`card_flip`, `match_success`, `mistake_soft`, `star_pop`, `victory_fanfare`) with lazy initialization and global mute/volume controls.
- **`CognitiveSkillBadge` (Implemented - Step 2):** Domain tag pill component representing all 6 cognitive brain development domains (`memory`, `vocabulary`, `comprehension`, `logic`, `creativity`, `phonics`).
- **`DifficultyToggle` (Implemented - Step 2):** Accessible segmented control (`easy`, `medium`, `hard`) with child-friendly tactile feedback and sound triggers.
- **`CelebrationParticles` (Implemented - Step 2):** Lightweight canvas particle burst automatically disabled/softened under `prefers-reduced-motion`.
- **`RewardCelebration` (Implemented - Step 2):** Reusable completion celebration overlay with animated XP count-up, star pop, daily streak flame ignition, polite `aria-live` screen-reader announcement, and primary focus management.
- **`ActivityShell` (Implemented - Step 2):** Universal container wrapper integrating the floating magical header, cognitive skill badge, difficulty toggle, live progress pill, and graceful empty state degradation.
- **Activity Refactoring (Implemented - Step 3):** `QuizSection.tsx`, `StoryMemoryQuest.tsx`, and `WordTraceQuest.tsx` refactored to consume `ActivityShell`, `useActivityEconomy`, `RewardCelebration`, and `sfxService`. Zero duplicate `hasAwardedRef` or direct `economyService` calls remain in activity presentation components.
- **Story Quest Hub (Implemented - Step 4):** Unified quest hub in `StoryViewer.tsx` allowing children to switch smoothly between `📖 Read Story`, `💡 Story Quiz`, `🧠 Memory Quest`, and `🔤 Word Trace` with cognitive domain tagging, accessible WAI-ARIA tab semantics, keyboard navigation (`ArrowLeft`/`ArrowRight`), Story DNA availability checks, and sound feedback.

### 4.2 Game Universe & Creature Lab Flagship Architecture (Milestone 2)

The **Game Universe Hub** (`/games`) and **Creature Lab** (`/games/creature-lab`) serve as the flagship reference implementation for standalone games in ORBis.

**1. Standalone Game Registry (`src/services/games/gameRegistry.ts`):**
- Central catalog defining 10 standalone mini-games with cognitive domains, difficulty models, and route mappings.

**2. Starlight Alchemy Engine (`src/services/games/creatureLabEngine.ts`):**
- **5 Prime Essences:** `sun_ember` (☀️), `moon_dew` (💧), `whisper_seed` (🌿), `breeze_feather` (💨), `stardust_crystal` (✨).
- **24-Species Master Roster:** 15 canonical 2-essence pairings + 9 secret 3-essence recipes (`aurora_kitsune`, `solar_flora_titan`, `storm_pegasus`, `inferno_drake`, `glacier_bear`, `crystal_pangolin`, `chrono_tortoise`, `deep_sea_leviathan`, `celestial_griffin`).
- **Playful Happy Accidents:** 4 unmapped reactions (`singing_cloud`, `bouncy_slime`, `sparkle_puff`, `dancing_ember`) awarding positive crafting stardust with zero punishment.
- **Science of Wonder:** Every creature teaches a genuine scientific concept (bioluminescence, surface tension, photosynthesis, seed dispersal, convection, Fibonacci spirals, phototropism, etc.) appearing after discovery.
- **Personality & Customization:** Every creature features distinct personality traits and supports child-defined custom nicknames stored in persistent metadata.
- **Guest Discovery Migration:** `migrateGuestDiscoveriesToChild(childId)` seamlessly transfers guest discoveries and crafting stardust into newly created child profiles without compromising Supabase RLS boundaries.

**3. Audio Synthesis Extension (`src/services/audio/sfxService.ts`):**
- Synthetic Web Audio API generators for `liquid_mix`, `rare_discovery`, and `legendary_discovery`. Zero downloaded audio assets.

**4. Authoritative Reward Contract:**
- `activityType = 'creature_lab'`, `activityId = 'discovery_<creatureId>'`.
- Initial discovery awards authoritative XP and Stars via `award_child_rewards` RPC. Replaying or re-brewing awards 0 XP / 0 Stars and +3 Crafting Stardust.


## 5. Economy, Gamification & Activity Reward Architecture

The economy (XP, Stars, Streaks, Badges) requires authoritative backend validation to prevent client-side manipulation (even though it's a kids app, data integrity matters for parent reporting and game balance).

**Core Schema:**
- **`child_profiles`:** Stores cumulative `xp`, `stars`, `current_streak`, and `last_activity_date` (calendar date for streak continuity).
- **`child_activity_rewards`:** Persistent ledger recording all earned rewards.
  - Fields: `id`, `child_id`, `activity_type`, `activity_id`, `xp_awarded`, `stars_awarded`, `created_at`.
  - **Idempotency Rule:** `UNIQUE (child_id, activity_type, activity_id)`. The database is the authoritative single source of truth preventing duplicate reward claims.

**Activity Identity Model:**
- **`activity_type`:** Standardized activity string (e.g. `quiz`, `memory_match`, `word_trace`, `vocabulary`, `logic`, `story_completion`).
- **`activity_id`:** Stable unique identifier for the content instance (e.g. `story.id` for a story quiz).
- **Pipeline:** Client Activity Component → `economyService.completeActivity({ childId, activityType, activityId, xpAmount, starsAmount })` → Secure Supabase RPC `award_child_rewards`.

**Authoritative RPC Boundary (`award_child_rewards`):**
- **Parent Ownership Enforcement:** Validates `auth.uid() = child_profiles.parent_id`.
- **Integrity Bounds:** Strictly caps values (e.g. max 500 XP, max 100 Stars per transaction) and rejects negative amounts.
- **Atomic Transaction:** Checks for existing activity reward; if already claimed, returns `{ already_awarded: true, xp_awarded: 0, stars_awarded: 0 }` safely without minting duplicates.
- **Streak Calculation:** Evaluates `last_activity_date` against database `current_date` (UTC calendar day):
  - Same calendar day: Streak remains unchanged (max 1 streak increment per day).
  - Consecutive calendar day (`today - 1`): Increments `current_streak + 1`.
  - Missed day or first activity: Resets `current_streak = 1`.

**V1 Limitations Accepted:**
- Game scoring is calculated in the client component from Story DNA before invoking `completeActivity`, but reward values are strictly clamped and server-side duplicate protection makes reward farming impossible.

## 6. Content and Progression Architecture

- **Story Library:** The `StoryLibraryPage` queries the `stories` table. It distinguishes between global pre-computed stories (Free) and user-generated stories (Premium/Quota).
- **Unlocks:** A robust `unlockService.ts` will manage whether a child has enough Stars to access a specific World or Avatar, updating the `child_profiles.unlocked_assets` JSONB array.

## 7. Media Engine

- **Audio Playback:** Handled by a centralized `audioService` or React Audio Context, mapping the `audioUrl` returned by the `VoiceProvider` to the current page.
- **Pre-loading:** The media engine must pre-fetch the next page's audio and images while the child is reading the current page to ensure a seamless experience.

## 8. Summary of Hard Constraints

1. **No direct LLM calls from UI.**
2. **No single point of failure** (e.g., if Cloud TTS fails, the Provider gracefully falls back to local or disables audio without crashing).
3. **Strict separation of `profiles` (Parent) and `child_profiles` (Child).**
4. **All economy updates via RPC, not direct table updates.**

## 9. Standalone Game Universe & Creature Lab Architecture

- **Game Universe Hub (`/games`):** Standalone universe dashboard routing to registered games across 6 cognitive domains (`memory`, `logic`, `creativity`, `vocabulary`, `phonics`, `comprehension`).
- **Game Registry (`gameRegistry.ts`):** Single source of truth defining standalone game metadata, age ranges, category classification, release status (`playable`, `in_development`, `coming_soon`), and cognitive affinities.
- **Common Game HUD (`GameUniverseHUD.tsx`):** Unified header across all standalone games managing navigation back to the Universe map, Stardust currency counter, mute controls, and Almanac triggers.
- **Creature Lab Engine (`creatureLabEngine.ts`):** Pure deterministic client-side alchemy simulation ($0.00 runtime AI cost). Features 5 Prime Essences, 8 distinct species with harmonic elemental traits, and playful non-punishing "Happy Accident" reactions.
- **Economy Integration:** Uses `useActivityEconomy` with `activityType: 'creature_lab'` and `activityId: 'discovery_<speciesId>'`. Rarity determines XP/Stars rewards; duplicate discoveries yield crafting Stardust without double-minting XP/Stars.
- **Story DNA Synergy:** Standalone games support optional `storyContext?: StoryGameContext` to ingest thematic vocabulary and character attributes without requiring story completion as a gate.

## 10. Playroom Flagship Mini-Games

- **Flagship #1: Magic Machine Lab (`magicMachineEngine.ts`, `/playroom/magic-machine`):**
  - Interactive tactile physics workshop simulating gear ratios, conveyor belts, laser mirrors, and energy conduits.
  - Multi-tiered puzzle difficulty with deterministic simulation and $0 runtime AI cost.
- **Flagship #2: Mystery Detective (`mysteryDetectiveEngine.ts`, `/playroom/mystery-detective`):**
  - Forensic crime scene investigation game with tool belt (Magnifying Glass, UV Dust Brush, Listening Horn, Secret Decoder Lens).
  - Evidence pinboard, suspect elimination cross-off, and Science of Wonder dossiers.
- **Flagship #3: Potion Market Scales (`potionScalesEngine.ts`, `/playroom/potion-scales`):**
  - Tactile physical two-pan balance scale digital toy simulating mass conservation, algebraic equations, fractions ($\frac{1}{4}\text{g}, \frac{1}{2}\text{g}, \frac{3}{4}\text{g}$), and liquid volume pouring.
  - 18 curated master orders + seeded deterministic generation ($0 runtime AI cost).
  - Authoritative economy integration via `useActivityEconomy({ activityType: 'potion_scales' })`.
  - Science of Wonder dossiers explaining gravity, mass, liquid density, and algebraic equivalence.