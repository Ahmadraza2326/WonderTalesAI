# ORBis Product Blueprint

> **Status:** Locked Vision Document  
> **Core Principle:** ORBis should feel like an alive, magical world rather than a conventional SaaS/education dashboard. Learning happens through play, discovery, and imagination.

## 1. Core Vision & Direction
ORBis is a child-focused interactive universe combining:
- Magical stories and reading
- Learning through play rather than "education-first" presentation
- Brain development: memory, logic, creativity, vocabulary, comprehension, problem-solving
- Genuinely fun mini-games
- XP, stars, credits, rewards, daily streaks, badges, and achievements
- Quests and challenges
- Worlds, characters, and unlockable progression
- Safe creative activities
- Parent-facing progress and safety controls
- Highly distinctive, joyful UI, animations, and micro-interactions

## 2. Cost & Sustainability Principle
**Until the first revenue arrives, minimize paid infrastructure/API dependence.**
- AI is an *optional superpower*, not the foundation that breaks the product when an API is unavailable or rate-limited.
- Favor local code, offline assets, reusable generated data (Story DNA), and intelligent client-side logic over raw LLM calls.
- Avoid cascading LLM calls (e.g., generating a story, then generating a quiz, then generating images). A single generation should extract or produce reusable JSON DNA.

## 3. ORBis Core Experience Loop (Stories + Standalone Games Universe)
1. **Choose Experience:** The child opens ORBis and selects among four core activities:
   - 📖 **Read a Story:** Illustrated storytelling with narration and reading companion aids.
   - 🎮 **Play Standalone Games:** Genuinely fun, highly replayable standalone games (Creature Lab, World Builder, Brainstorm Arena, Mystery Detective).
   - 💡 **Complete Learning Quests:** Story-linked comprehension, memory, and vocabulary challenges.
   - ✨ **Create & Discover:** Build and decorate their personal world, hatch creatures, and design characters.
2. **Engage & Master:** Frictionless, tactile gameplay with organic animations, accessible controls, and zero API runtime cost.
3. **Achieve:** Completing activities awards XP, Stars, and increments daily habit streaks.
4. **Unlock:** Stars unlock new biomes, sandbox materials, creature companions, and avatar cosmetics.
5. **Report (Parent):** Parents view a comprehensive dashboard of reading progress and cognitive skill development.

## 4. Learning & Brain-Development Framework
ORBis integrates brain development seamlessly across both story-linked activities and standalone games:
- **Story DNA Activities (Story Companion):**
  - **Memory (Story Memory Quest):** Active recall pairing vocabulary words to meanings and story details.
  - **Vocabulary & Spelling (Word Trace & Vocabulary Quest):** Orthographic spelling, letter tile assembly, and cloze sentences.
  - **Comprehension (Story Quiz):** Story narrative comprehension and deductive recall.
- **Standalone Flagship Games (Independent Universe - see `docs/ORBIS_MINIGAME_STRATEGY.md`):**
  - **Discovery & Hypothesis Testing:** *Creature Lab* (24 species, Starlight Alchemy, secret 3-part recipes, Science of Wonder concept cards, collection stats, and guest profile migration).
  - **Mechanical Engineering & Physics:** *Magic Machine Lab* (tactile workbench simulating gear ratios, conveyor belts, laser mirrors, and energy circuits with $0 runtime cost).
  - **Forensic Deduction & Logic:** *Mystery Detective* (crime scene inspection with forensic tool belt, evidence pinboard, suspect elimination, and Science of Wonder dossiers).
  - **Physical Equilibrium & Fractions:** *Potion Market Scales* (tactile two-pan balance scale digital toy simulating mass conservation, missing weight equations, fractions, and liquid volumes).

## 5. XP, Streak, Badge, and Economy System
- **XP:** Earned purely through effort and time spent reading/playing. Drives overall profile level.
- **Streaks:** Daily activity multipliers to encourage habit formation. Backed by calendar-day tracking (`last_activity_date`), incrementing at most once per day on meaningful activity completions.
- **Stars/Credits:** The earnable currency. Used in the "Rewards Shop" to unlock avatars, new UI themes, or premium story seeds.
- **Activity Rewards:** Authoritative, server-enforced reward ledger (`child_activity_rewards`) ensuring every activity (quiz, memory, word trace, creature lab) can be rewarded without risk of duplicate claims or client manipulation.
- **Crafting Stardust:** Replay currency earned in Creature Lab (3 Stardust per repeat brew) for experimentation without artificial gating.
- **Badges:** Milestone achievements (e.g., "Discovered 10 species", "Hatched a Legendary Creature", "Perfect memory score").

## 6. Free-First Monetization Boundary
- **Free Tier:** Access to a rotating library of pre-generated stories, basic mini-games, local TTS (Piper), and core progression.
- **Premium Tier:** Unlimited on-demand AI story generation, premium voices (Cloud TTS), advanced parent analytics, and exclusive cosmetics.
- **Cost Invariant:** Zero incremental AI or cloud API cost during mini-game play ($0.00 runtime cost).

## 7. Content and Progression Architecture
- **Worlds:** Themed environments (e.g., "The Crystal Caves", "Space Station Alpha") that act as hubs.
- **Progression:** Unlocking worlds requires earning Stars from earlier content.
- **Story Library:** A mix of pre-computed high-quality stories (no generation cost) and dynamically generated content (Premium/Quota).
- **Game Universe Hub:** Standalone destination at `/games` allowing children to browse and play games independently.

## 8. UI/Design-System Principles (ORBis Experience Layer)
- **Distinctive & Joyful:** No generic Bootstrap/Tailwind standard templates. Heavy use of organic shapes, vibrant accessible colors, and playful typography.
- **Unified Experience Pipeline (Steps 1–5 & Milestone 2 Implemented):** All mini-games are anchored on shared contracts (`src/types/experience.ts`), unified economy state bridges (`useActivityEconomy`), child-safe audio synthesis (`sfxService`), shared UI primitives (`ActivityShell`, `CognitiveSkillBadge`, `DifficultyToggle`, `RewardCelebration`, `CelebrationParticles`), refactored game components (`QuizSection`, `StoryMemoryQuest`, `WordTraceQuest`), the unified Story Quest Hub (`StoryViewer`), and the standalone Flagship Game Universe Hub & Creature Lab Milestone 2.
- **Tactile:** Buttons and tiles provide organic touch feedback (scale press transforms, soft shadows).
- **Non-Text Navigation:** Heavy reliance on iconography, color coding, and character guides for pre-readers.

## 9. Animation, Audio & Celebration Principles
- **Alive:** The interface breathes with ambient floating animations and reactive card states.
- **Unified Reward Celebrations (`RewardCelebration` Implemented):** Activity completion triggers a joyful celebration modal animating XP tally counters, star pop constellations, and daily streak ignition.
- **Auditory Delights (`sfxService` Implemented):** Zero-dependency Web Audio API synthetic chimes for card flips, correct matches, gentle error nudges, star pops, and victory fanfares.
- **Sensory Safe:** Full adherence to `prefers-reduced-motion`, parent sound toggles, and gentle volume limits.

## 10. Accessibility and Child-Safety Requirements
- **Safety:** No open chat, no PII collection from children, no external links in child views.
- **Accessibility:** High contrast modes, large tap targets, dyscalculia/dyslexia-friendly fonts (e.g., OpenDyslexic toggle), and full TTS coverage.
- **Sensory:** Option to reduce motion and disable auto-playing audio for neurodivergent children.

## 11. Stitch MCP Workflow (Dedicated UI/UX Phase)
- **Wait for V1 Backend:** UI/UX redesign happens *after* core mechanics are stable.
- **Stitch MCP:** We will use Stitch connected via Antigravity MCP to inject reference designs, analyze inspiration apps, and build a unified design system.
- **Iterative Polish:** The design will be implemented component-by-component to ensure it doesn't break the React/Vite architecture.

## 12. 30–45 Day Development Roadmap

### MUST HAVE — V1 (Days 1–30)
- Core Story Reader (working pagination, local TTS via Piper sidecar, basic highlighting).
- Parent Dashboard (Auth, profile management, basic quota tracking).
- Pre-computed Story Library (Free tier content).
- Foundation of the Economy (XP, Stars, daily streaks, ledger in DB).
- Story DNA Companion Activities (Quiz, Story Memory Quest, Word Trace).
- Experience Layer (ActivityShell, RewardCelebration, sfxService audio engine, Quest Hub).
- The Provider Abstraction layer (TTS and Generation fully decoupled).
- First Flagship Standalone Game: **Creature Lab** (`docs/ORBIS_CREATURE_LAB_SPEC.md`).

### V1.5 (Days 30–45)
- UI/UX Polish Phase (Stitch MCP integration, animations, distinctive theming).
- Badges and Achievements system UI.
- Wave 1 Standalone Games: **World Builder**, **Brainstorm Arena**, **Mystery Detective**.
- Wave 2 Standalone Games: **Dragon Rescue**, **Beat Forge**, **Shadow Hunt**.

### V2 (Post 45 Days)
- Multiplayer/Social (safe, anonymous leaderboard or collaborative worlds).
- Cloud TTS integration for Premium users.
- Deep Brain Development analytics for parents.
- Mobile App wrappers (React Native / Capacitor).

### GOOD IDEA BUT DISTRACTION (Do Not Build Now)
- Custom LLM fine-tuning.
- Real-time multiplayer voice chat.
- Complex 3D rendering in-browser.
- Heavy physical merchandise integrations.

## 13. Rules for Future Coding Tasks (Preventing Drift)
1. **Never break the Free Tier:** Do not introduce a feature that requires an API key to load the home page.
2. **Never hardcode UI strings:** Use the existing i18n architecture.
3. **Protect the Provider Abstraction:** TTS, LLM, and Image generation must remain behind interfaces (`src/services/ai/`).
4. **Child vs. Parent State:** Never mix child gameplay state with parent billing/settings state.
5. **No Generic UI:** If adding a button, ensure it fits the "magical world" aesthetic, not a SaaS dashboard.
