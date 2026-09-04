# ORBis — Master Design & Architecture Blueprint
**Document Version:** 2.0.0 (Master System Canon & Design-to-Code Blueprint)  
**Methodology:** Living Learning Universe Architecture  
**Visual Foundation:** Cinematic 2.5D Cosmic Diorama  
**Master Visual Reference:** `public/assets/overworld/orbis_overworld_master.jpg`  
**Parent Workspace:** WonderTalesAI / ORBis Learning Universe  

---

## Executive Overview

This document serves as the **authoritative master blueprint** for the ORBis Cosmic Learning Universe. It synthesizes and unifies the four specialized design-to-code documents:
1. [`ORBis_Stitch_Design_Brief.md`](file:///c:/Users/muhammad/WonderTalesAI/docs/orbis/ORBis_Stitch_Design_Brief.md) (Aesthetic vision, anti-cliché mandates, Overworld composition)
2. [`ORBis_Screen_Inventory.md`](file:///c:/Users/muhammad/WonderTalesAI/docs/orbis/ORBis_Screen_Inventory.md) (Catalog of all 62 route mappings, pages, modals, and system states)
3. [`ORBis_Design_System_Seed.md`](file:///c:/Users/muhammad/WonderTalesAI/docs/orbis/ORBis_Design_System_Seed.md) (Design tokens, color palette, typography, radii, and materials)
4. [`ORBis_Design_to_Code_Contract.md`](file:///c:/Users/muhammad/WonderTalesAI/docs/orbis/ORBis_Design_to_Code_Contract.md) (Strict boundaries between visual design and frozen engineering logic)

---

## 1. Constitution & Frozen Boundaries

### 1.1 Product Vision & Essence
ORBis is a premium international children’s creative learning universe uniting interactive storytelling, a structured 10-realm academic curriculum, brain-development simulation games, an elemental companion sanctuary, and child-led creative expression into a single cohesive cosmos.

### 1.2 Anti-Cliché Prohibitions (Non-Negotiable)
- ❌ **No Generic SaaS / Productivity Dashboard:** No rectangular grey panels, sterile data tables, KPI cards, or collapsible sidebar navigation trees.
- ❌ **No Generic EdTech Portal:** No boring flat cards with stock icons, rigid progress bars, or sterile quiz layouts.
- ❌ **No "Glassmorphism Cliché":** Translucent glass is a subtle material accent for readability—NOT the sole visual identity.
- ❌ **No Box-Inside-A-Box Webpage:** No triple-nested containers, portrait phone frames rendered inside desktop viewports, or white page margins.

### 1.3 Immutable Engineering Boundary Matrix
Google Stitch is strictly a **VISUAL DESIGN SOURCE**, not an application generator.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        STITCH DESIGN FREEDOM (VISUAL SOURCE ONLY)                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ✅ Visual Hierarchy, Page Compositions & Scene Staging                                │
│  ✅ Layouts, Section Spacing & Responsive Flex Containers                              │
│  ✅ Typography Scales, Font Weight Distributions (within Outfit, Inter & Lora)         │
│  ✅ Component Framing, Glassmorphism Opacities, Shadows & Ambient Depth                │
│  ✅ Decorative Elements, Floating Crystal Badges & Realm Iconography                   │
│  ✅ Animation Timings, Parallax Speeds & Particle Densities                             │
│  ✅ Organic Nebula Silhouette Styling & Volumetric Lighting Blooms                     │
│  ✅ Visual Progress Indicators, Radar Charts & Floating HUD Styling                    │
│  ✅ Responsive Mobile & Desktop Layout Presentations                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FROZEN ENGINEERING CONTRACT (NEVER TOUCH)                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ❌ All 62 Application Route Declarations & Mappings in AppRouter.tsx (incl. aliases)   │
│  ❌ 10 Academic Realm IDs & 348 Micro-Skill Mastery Data Contracts                     │
│  ❌ Cinematic Lesson Timeline Step State Machine (`cinematicLessonsData.ts`)           │
│  ❌ All 11 Simulation Game Physics, Solvers, PRNGs & State Machines (`services/games/`)│
│  ❌ AI Story DNA Schemas & Gemini Provider Integrations (`src/services/ai/`)           │
│  ❌ Web Audio SFX Synthesizer Frequencies & Narration Queues (`services/audio/`)       │
│  ❌ XP Formulas, Star Balances, Streak Trackers, Tier Math & Quota Limits              │
│  ❌ Supabase Auth Handlers, Session Persistence & PostgreSQL Table Schemas             │
│  ❌ Parent PIN Gate Verification Logic, Crypto Hashes & Screen-Time Curfew Math        │
│  ❌ Capacitor Haptics Hardware Bridge Calls (`HapticsService.ts`)                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Canonical Master Overworld (Home Screen)

- **Canonical Route:** `/` (with `/overworld` as backward-compatible alias).
- **Core Principle:** The Overworld map **is** the navigation. Children explore the world directly by interacting with celestial islands.
- **Master Visual Asset:** `public/assets/overworld/orbis_overworld_master.jpg` rendered in full 100vw × 100vh landscape diorama.
- **Suppression of Secondary Navigation:**
  - Zero top section navigation links (`Overworld`, `Academy`, `Stories`, `Playroom`, `Explore`).
  - Zero bottom navigation dock on `/` and `/overworld`.
  - Zero left/right sidebars.
- **Minimal Floating Global HUD Only:**
  - *Top-Left:* Glowing ORBis AI brand mark & Explorer rank badge.
  - *Top-Center:* Explorer Level & XP progress pill, Star balance (`★`), Day streak counter (`🔥`).
  - *Top-Right:* Master sound FX toggle, ambient music toggle, theme/contrast toggle, active child avatar.

### The 6 Canonical Overworld Landmarks

```
                   [NORTH STAR] (Top: 5%, Left: 66%)
                (Daily Guidance & Quests Modal)
                           ↘
                  [ORBIS CITADEL] (Top: 12%, Left: 39%)
                    (Cosmic Command Center Modal)
                    /              \
          [ACADEMY]                  [STORIES]
      (Top: 34%, Left: 17%)      (Top: 34%, Left: 60%)
      (10 Academic Realms)       (Storybook Library & Studio)
                    \              /
          [PLAYROOM]                 [EXPLORE]
      (Top: 57%, Left: 28%)      (Top: 59%, Left: 52%)
    (11 Brain Simulation Labs)   (Celestial Observatory Hub)
```

### The Organic Nebula Interaction Language
- **No Hard Geometric Boundaries:** ❌ No rectangles, squares, circles, ellipses, or hover border boxes.
- **Multi-Cloud Nebula Aura:** On hover/touch, three asymmetric gaseous vapor clouds fade in behind the landmark (`blur(16px - 32px)`, `mix-blend-mode: screen / color-dodge`).
- **Drifting Stardust:** 4–5 glowing stardust motes oscillate in scale and opacity around the active node.
- **Canvas Explosion on Click:** Clicking any landmark triggers a 28-particle radial burst with gravity and fade, accompanied by a crystalline chime SFX.
- **Constellation Energy Paths:** Animated SVG energy packets transmit stardust along 5 paths from Citadel to North Star, Academy, Stories, Playroom, and Explore.

---

## 3. Unified Design System Tokens

### 3.1 Color Foundations & Accent Glows
Defined in `src/styles/tokens.css`:
- **Deep Cosmos:** Base Void `#04071b`, Nebula Core `#0e1545`, Nebula Mid `#080c2e`, Slate Substrate `#0f172a`.
- **10 Realm Accents:**
  - *Solar Gold* (`#fbbf24` / `#fde047`): North Star, Citadel, XP, Milestones.
  - *Arcane Cyan* (`#38bdf8`): Mathematics, Logic, Science.
  - *Living Emerald* (`#10b981`): Science, Nature, Correct Answers.
  - *Arcane Violet* (`#a855f7`): English, Explore Hub, Sanctuary.
  - *Golden Amber* (`#f59e0b`): Reading, Storybooks, Warmth.
  - *Clockwork Indigo* (`#6366f1`): Computer Science, Algorithms, Robotics.
  - *Enigma Rose* (`#ec4899`): Playroom, Brain Games, Sproutling creatures.
  - *Flame Orange* (`#f97316`): Creativity, Music, Arts.
  - *Terran Cyan* (`#14b8a6`): General Knowledge & World Discovery.
- **Semantic UI:** Text Bright `#f8fafc`, Text Muted `#94a3b8`, Danger Crimson `#ef4444`, Glass Surface `rgba(15, 23, 42, 0.75)`, Glass Border `rgba(255, 255, 255, 0.14)`.

### 3.2 Canonical Typography
- **Headings & Display:** `'Outfit'`, sans-serif (Weights: 600, 700, 800, 900).
- **Body & Interactive UI:** `'Inter'`, sans-serif (Canonical locked font in `index.html` & `tokens.css`; Weights: 400, 500, 600, 700).
- **Story Reader & Classical Lore:** `'Lora'`, serif (Weights: 400, 500, 600).

### 3.3 14 Bespoke UI Design Primitives
Exported from `src/components/ui/design/index.ts`:
1. `AnimatedIcon`: Vector micro-animated SVG icons (zero third-party icon fonts).
2. `MagicalButton`: Tactile 3D button with starlight glow and active 0.97× compression.
3. `GlassPanel`: Multi-elevation frosted acrylic container (`hero`, `card`, `subtle`).
4. `SkillCrystal`: Hexagonal mastery gemstone reflecting skill levels.
5. `WorldPortal`: Floating 2.5D realm doorway with ambient aura and parallax.
6. `OrbitalProgress`: Circular cosmic progress indicator with orbit particle.
7. `RealmBadge`: Crest representing realm domain and tier.
8. `RewardChip`: Stardust Star and XP counter chip.
9. `AdventurePath`: Constellation node track for courses and lessons.
10. `InteractionSurface`: Tactile grid stage for manipulatives and physics.
11. `LessonProgressRail`: Segmented progress bar tracking 5-scene lesson steps.
12. `ParticleField`: High-performance 60fps ambient canvas stardust simulation.
13. `CosmicAtmosphereBackdrop`: Deep space CSS/canvas background starfield.
14. `OrbCard`: Interactive tilt container for storybooks and mini-games.

---

## 4. Complete Route, Screen & State Inventory

The ORBis application implements **62 route declarations/mappings** in `AppRouter.tsx`. Below is the complete catalog:

| Screen ID | Canonical Route | Route Aliases | Screen Name / Function | Existing Component | Status |
|---|---|---|---|---|---|
| **B1** | `/` | `/overworld` | Master Celestial Overworld Map | `MasterCelestialOverworld.tsx` | Locked |
| **C1** | Modal on `/` | — | North Star Daily Guidance & Quests | `DailyQuestModal.tsx` | Locked |
| **D1** | Modal on `/` | — | Cosmic Citadel Command Center | `CentralOrbisCitadel.tsx` | Implementation Fix Pending |
| **H1** | `/explore` | — | Explore Celestial Observatory Hub | `ExplorePage.tsx` | Locked |
| **E1** | `/academy` | — | Academy Main 10-Realm Hub | `AcademyHomePage.tsx` | Active |
| **E2** | `/academy/subject/:id` | — | Realm Subject & Course Catalog | `SubjectDetailPage.tsx` | Active |
| **E3** | `/academy/course/:id` | — | Course Unit & Skill Track | `CourseDetailPage.tsx` | Active |
| **E4** | `/academy/skill/:id` | — | Granular Skill Hub (348 Skills) | `SkillHubPage.tsx` | Active |
| **E5** | `/academy/lesson/:id` | — | Cinematic Storybook Lesson Player | `LessonPage.tsx` | Active |
| **E6** | `/academy/practice/:id`| — | Adaptive Skill Practice Stage | `PracticePage.tsx` | Active |
| **E7** | `/academy/missions` | — | Academy Daily Quest Board | `AcademyMissionsPage.tsx` | Active |
| **E8** | `/academy/library` | — | Academy Universal Literature Library | `AcademyLibraryPage.tsx` | Active |
| **E9** | `/academy/think` | — | Think Lab (Philosophy & Logic) | `ThinkLabPage.tsx` | Active |
| **E10**| `/academy/science` | — | Science Lab (Virtual Experiments) | `ScienceLabPage.tsx` | Active |
| **E11**| `/academy/projects` | — | Project Studio (Cross-Disciplinary) | `ProjectStudioPage.tsx` | Active |
| **F1** | `/stories` | `/library`, `/workspace` | Storybook Library & Reader Catalog | `StoryLibraryPage.tsx` | Active |
| **F2** | `/stories/:id` | — | Interactive Flipbook Story Reader | `StoryWorkspacePage.tsx` | Active |
| **F3** | `/stories/new` | — | AI Story Generation Studio (Protected) | `CreateStoryPage.tsx` | Active |
| **G1** | `/playroom` | `/games` | Playroom Games Universe Hub | `GameUniversePage.tsx` | Active |
| **G2** | `/games/creature-lab` | — | Creature Lab Alchemy Station | `CreatureLabPage.tsx` | Active |
| **G3** | `/games/magic-machine` | `/playroom/magic-machine` | Magic Machine Physics Lab | `MagicMachinePage.tsx` | Active |
| **G4** | `/games/invention-lab` | `/playroom/invention-lab`, `/playground/invention-lab` | Invention Lab Engineering Station | `InventionLabPage.tsx` | Active |
| **G5** | `/games/mystery-detective` | `/playroom/mystery-detective` | Mystery Detective Forensics Lab | `MysteryDetectivePage.tsx` | Active |
| **G6** | `/games/potion-scales` | `/playroom/potion-scales` | Potion Market Scales Station | `PotionScalesPage.tsx` | Active |
| **G7** | `/games/spellforge` | `/playroom/spellforge`, `/playground/spellforge` | Spellforge Phonics Anvil | `SpellforgePage.tsx` | Active |
| **G8** | `/games/memory-museum` | `/playroom/memory-museum`, `/playground/memory-museum` | Memory Museum Palace Station | `MemoryMuseumPage.tsx` | Active |
| **G9** | `/games/rhythm-spells` | `/playroom/rhythm-spells`, `/playground/rhythm-spells` | Rhythm Spells Drum Station | `RhythmSpellsPage.tsx` | Active |
| **G10**| `/games/robopath` | `/playroom/robopath`, `/playground/robopath` | RoboPath Block Coding Station | `RoboPathPage.tsx` | Active |
| **G11**| `/games/ecosystem-sandbox` | `/playroom/ecosystem-sandbox`, `/playground/world-builder` | Ecosystem Sandbox Simulator | `EcosystemSandboxPage.tsx` | Active |
| **G12**| `/games/constellations` | `/playroom/constellations`, `/playroom/cosmic-constellations`, `/playground/cosmic-constellations` | Cosmic Constellation Puzzle Station | `CosmicConstellationPage.tsx` | Active |
| **I1** | `/academy/create` | — | Starlight Drawing & Melody Studio | `CreativeStudioPage.tsx` | Active |
| **J1** | `/sanctuary` | `/games/sanctuary` | Starlight Companion Sanctuary | `SanctuaryPage.tsx` | Active |
| **K1** | `/passport` | `/adventure-passport` | Explorer Adventure Passport | `PassportPage.tsx` | Active |
| **L1** | `/parent-zone` | — | Parent Insights & Curfew Center (Protected) | `ParentZonePage.tsx` | Active |
| **M1** | `/profile` | `/settings` | Explorer Profile & Settings (Protected) | `ProfilePage.tsx` | Active |
| **N1** | `/auth` | — | Parent Sign-In & Registration | `AuthPage.tsx` | Active |
| **N2** | `/reset-password` | — | Account Password Reset Flow | `ResetPasswordPage.tsx` | Active |
| **O1** | `/dashboard` | — | Protected Family & Story Dashboard | `DashboardPage.tsx` | Active |
| **ERR**| `*` | — | 404 Lost in Space Screen | `NotFoundPage.tsx` | Active |

---

## 5. Explore Hub Architecture

The Explore landmark on the Master Overworld routes strictly to `/explore` ([`ExplorePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/ExplorePage.tsx)).  
It is **NOT** a direct redirect to Sanctuary.

### The 6 Canonical Explore Portals:
1. **Universal Library (`/academy/library`):** Full literature catalog, realm readers, non-fiction archives, and audio folktales.
2. **Creative Studio (`/academy/create`):** Starlight drawing canvas, musical melody sequencer, and AI storybook illustration.
3. **Starlight Sanctuary (`/sanctuary`):** Mythical creature nursery, feeding, petting, and bond leveling.
4. **Explorer Passport (`/passport`):** Milestone stamps, realm mastery crests, and Grandmaster progress log.
5. **Parent Zone (`/parent-zone`):** Screen-time curfews, cognitive domain radar analytics, and subject insights (PIN-gated).
6. **Profile & Settings (`/profile`):** Multi-child explorer switcher, avatar customizations, audio volumes, and language preferences.

---

## 6. Academy Architecture (10 Academic Realms)

Registered in [`curriculumRegistry.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/academy/curriculum/curriculumRegistry.ts):
1. **Mathematics (`math`):** Number sense, operations, geometry, algebraic thinking.
2. **Physical & Life Science (`science`):** Scientific method, biology, chemistry, physics, ecology.
3. **English Language Arts (`english`):** Composition, rhetoric, comprehension, literary analysis.
4. **Reading & Phonics (`reading`):** Phonemic awareness, decoding, sight words, reading fluency.
5. **Vocabulary (`vocabulary`):** Etymology, morphology, context clues, domain lexicon.
6. **Grammar (`grammar`):** Sentence structures, punctuation, parts of speech, syntax.
7. **Computer Science (`computer_science`):** Algorithms, sequencing, loops, variables, debugging.
8. **Logic & Reasoning (`logic`):** Deductive logic, spatial reasoning, patterns, syllogisms.
9. **Creativity & Arts (`creativity`):** Visual composition, melody, narrative development, invention.
10. **General Knowledge (`general_knowledge`):** World geography, history, astronomy, culture.

### 5-Scene Cinematic Lesson Architecture
Implemented in [`cinematicLessonsData.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/academy/curriculum/cinematicLessonsData.ts):
- **Scene 1 (Narrative Hook):** Character mentor introduces real-world mystery.
- **Scene 2 (Direct Visual Teaching):** Animated diagrams, read-along voice narration.
- **Scene 3 (Tactile Manipulation):** Direct star-array or item manipulation on interactive canvas.
- **Scene 4 (Symbolic Emergence):** Abstract notation/equation emerges from concrete manipulative.
- **Scene 5 (Celebration & Reflection):** Confetti stardust burst, star payout, companion XP boost.

---

## 7. Stories Architecture & AI Studio

- **Reader (`/stories/:id`):** Paginated flipbook with word-level highlight timers synchronized via Web Speech API (`StoryWorkspacePage.tsx`).
- **Generation Wizard (`/stories/new`):** 4-step guided builder (Genre, Protagonist, Moral Lesson, Setting) feeding Gemini AI through `storyGenerationService.ts` and `storyContinuityEngine.ts`.
- **Story DNA Schema:** Character consistency profiles, emotional arcs, reading level constraints, and illustration generation prompts.

---

## 8. Playroom & Game Architecture (11 Games)

Governed by [`gameRegistry.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/gameRegistry.ts) and [`playgroundRegistry.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/playgroundRegistry.ts):
All 11 games feature deterministic Mulberry32 PRNG seed generators (`createPRNG`), par move calculations, daily rotating challenges, and zero external game framework dependencies.

1. **Creature Lab:** Chemistry alchemy cauldron (`creatureLabEngine.ts`).
2. **Magic Machine:** Kinetic 2D physics puzzle (`magicMachineEngine.ts`).
3. **Invention Lab:** Structural bridge engineering (`inventionLabEngine.ts`).
4. **Mystery Detective:** UV forensics & deductive logic (`mysteryDetectiveEngine.ts`).
5. **Potion Scales:** Mass equilibrium & fractions (`potionScalesEngine.ts`).
6. **Spellforge:** Syllable forging & phonics anvil (`spellforgeEngine.ts`).
7. **Memory Museum:** Spatial artifact palace (`memoryMuseumEngine.ts`).
8. **Rhythm Spells:** Pentatonic audio patterns (`rhythmSpellsEngine.ts`).
9. **RoboPath:** Block coding logic simulator (`roboPathEngine.ts`).
10. **Ecosystem Sandbox:** Ecological balance simulator (`ecosystemSandboxEngine.ts`).
11. **Cosmic Constellation:** Star-linking geometric puzzle (`cosmicConstellationEngine.ts`).

---

## 9. Sanctuary (Companion Care Ecosystem)

- **Route:** `/sanctuary` ([`SanctuaryPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/SanctuaryPage.tsx)).
- **Engine:** `sanctuaryService.ts`.
- **Biome Habitats:** Cosmic Nest, Crystal Cave, Star Grove, Solar Perch.
- **Actions:** Feed elemental treats, pet (haptic vibration), play mini-interactions, level up bond affinity.
- **Modals & Drawers:** `AlmanacDrawer.tsx` (discovered species), `CreatureHatchModal.tsx` (egg hatching sequence), `HappyAccidentModal.tsx` (rare fusion discoveries).

---

## 10. Passport & Adventure Milestones

- **Route:** `/passport` ([`PassportPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/PassportPage.tsx)).
- **Engine:** `progressionService.ts`.
- **Stamps & Badges:** Realm discovery crests, consecutive streak badges, cosmic rank progression (Novice Star-Seeker to Cosmic Grandmaster).

---

## 11. Parent Zone & Safety

- **Route:** `/parent-zone` (Protected Route, gated by `ParentPinModal.tsx`).
- **Engine:** `parentPinService.ts`, `curfewService.ts`.
- **Features:**
  - 4-Digit encrypted Parent PIN.
  - Screen-time curfews (downtime start/end hours with bedtime blackout overlay).
  - Cognitive domain radar chart (visualizing child growth across Math, Science, Phonics, Logic, Creativity).
  - Subject access locks.
  - Graduation diploma PDF/SVG generator (`DiplomaCertificateModal.tsx`).

---

## 12. Profile & Authentication

- **Authentication (`/auth`):** Supabase email auth, magic link sign-in, session persistence (`AuthPage.tsx`).
- **Password Reset (`/reset-password`):** Secure token verification (`ResetPasswordPage.tsx`).
- **Profile & Explorer Switcher (`/profile`):** Child switcher, avatar customization, sound sliders, language switcher (`ProfilePage.tsx`, `AddChildModal.tsx`, `SignOutConfirmationModal.tsx`).
- **Protected Family Dashboard (`/dashboard`):** Story management, daily bonus streak calendar (`DashboardPage.tsx`, `DailyLoginModal.tsx`).

---

## 13. Functional Engines & Contracts

```
┌───────────────────────────┬────────────────────────────────────────────────────────────┐
│ Functional Subsystem      │ Active Service / Engine Files                              │
├───────────────────────────┼────────────────────────────────────────────────────────────┤
│ Curriculum & Mastery      │ `curriculumRegistry.ts`, `cinematicLessonsData.ts`,        │
│                           │ `masteryService.ts`, `learningProgressService.ts`          │
│ 11 Game Simulation Engines│ `src/services/games/*.ts` (Mulberry32 deterministic PRNG)  │
│ Audio & Voice Synthesis   │ `sfxService.ts`, `audioSynth.ts`, `AudioContext.tsx`       │
│ Haptics Hardware Bridge   │ `HapticsService.ts` (@capacitor/haptics bridge)            │
│ AI Story Generation       │ `geminiService.ts`, `storyService.ts`,                     │
│                           │ `storyContinuityEngine.ts`, `storyAssetCacheService.ts`    │
│ Safety & Curfew           │ `parentPinService.ts`, `curfewService.ts`                  │
│ Offline & PWA Sync        │ `pwaService.ts`, `offlineSyncService.ts`                   │
└───────────────────────────┴────────────────────────────────────────────────────────────┘
```

---

## 14. Responsive / Desktop / Mobile Rules

- **Viewport Constraints:**
  - *Desktop (>= 1024px):* Full-screen 100vw × 100vh landscape cosmic diorama.
  - *Tablet (768px – 1023px):* Preserves 16:9 landscape aspect ratio with letterbox containment if needed.
  - *Mobile (< 768px):* Scaled diorama with minimum 48px touch targets; compact floating HUD; section navigation hidden on Overworld.
- **Accessibility (WCAG 2.1 AA):**
  - Minimum touch target: 44px × 44px.
  - Contrast ratio: $\ge 4.5:1$ for body text on glass surfaces.
  - Reduced Motion (`prefers-reduced-motion: reduce`): Particle field count reduces to ambient static glow; spinning gears replace with status chips.

---

## 15. Stitch → Antigravity Design-to-Code Protocol

When implementing designs generated by Google Stitch:
1. **Inspect Stitch Screen Output:** Extract layout structure, spacing, color glows, and typography weights.
2. **Map to Existing Tokens:** Replace any hardcoded hex codes with existing CSS variables (`--orbis-void-dark`, `--orbis-realm-math-glow`, etc.).
3. **Preserve Component Logic:** Drop Stitch JSX structure into the existing React component container, binding existing state variables, event handlers, and services.
4. **Never Replace Engines:** Retain all game engine solvers, lesson timelines, and audio hooks untouched.

---

## 16. Implementation Priority & Phases

### Phase 1: Overworld & Core Navigation Integrity (Current)
- Reconcile documentation and lock visual foundation.
- Resolve Citadel landmark modal wiring discrepancy (`CentralOrbisCitadel.tsx`).

### Phase 2: Design Token & UI Primitive Verification
- Verify all 14 primitives in `src/components/ui/design/` strictly adhere to `tokens.css`.
- Ensure zero emoji dependencies in core primitives.

### Phase 3: Stitch Screen Generation & Code Adaptation
- Generate Stitch screens according to the 24-step generation order.
- Adapt React pages sequentially without touching engine contracts.

### Phase 4: Full Multi-Device & Accessibility Verification
- Run browser subagent visual regression suite.
- Audit WCAG 2.1 AA compliance and mobile touch ergonomics.

---

## 17. QA / Zero-Regression Checklist

- [ ] Overworld `/` renders `MasterCelestialOverworld.tsx` with zero top/bottom nav.
- [ ] Explore `/explore` renders the 6-portal Celestial Observatory Hub.
- [ ] All 10 academic realms load valid subject/course/skill nodes.
- [ ] All 11 games mount properly with active canvas physics and PRNG seeds.
- [ ] Audio mute/music controls toggle cleanly with haptic feedback.
- [ ] Parent PIN modal prevents unauthorized access to `/parent-zone`.
- [ ] Curfew blackout triggers cleanly when simulated active.
- [ ] PWA service worker registers without bundle bloat.
- [ ] Vite dev server returns HTTP 200 with valid bundle sizes on all routes.
