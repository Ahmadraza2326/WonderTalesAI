# ORBis — Complete Screen & State Inventory
**Document Version:** 1.1.0 (Design & Stitch Generation Inventory)  
**Purpose:** Exhaustive catalog of every user-facing screen, sub-flow, overlay, and system state across all 62 route declarations in `AppRouter.tsx` for Stitch design generation and subsequent code integration.

---

## Routing Footprint Overview

The ORBis application implements **62 route declarations and mappings** in `src/routes/AppRouter.tsx`, spanning 30+ canonical functional screens, sub-hubs, lab environments, and production route aliases (e.g. `/games/*`, `/playroom/*`, `/playground/*`, `/academy/*`).

---

## Group A: Entry & Onboarding

### Screen A1: Star Gate Entrance & Onboarding Overlay
- **Route:** `/` (Initial first-time / unauthenticated state overlay)
- **Purpose:** Atmospheric entrance welcoming the explorer to ORBis; prompts child profile selection or parent sign-in over the cosmic diorama.
- **Primary User:** Child Explorer & Parent
- **Entry Points:** Direct URL root, fresh app installation.
- **Exit Points:** Overworld (`/`), Auth (`/auth`), Profile Setup (`/profile`).
- **Existing Components:** [`OverworldPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/OverworldPage.tsx), [`AuthPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/AuthPage.tsx). *(Note: `AuthModal.tsx` was a legacy reference; auth is handled via `AuthPage.tsx` at `/auth`).*
- **Stitch Redesign Scope:** Cinematic opening title card, glowing portal button, subtle ambient audio toggle.
- **Must Remain Untouched:** Supabase session checks, local storage child profile loading.
- **Responsive:** Fluid scaling centered diorama, responsive touch target (`min-height: 48px`).

---

## Group B: Home / Overworld

### Screen B1: Master Celestial Overworld Map
- **Route:** `/` and `/overworld`
- **Purpose:** The living centerpiece and primary navigation of the ORBis universe. The Overworld map **is** the navigation.
- **Primary User:** Child Explorer
- **Entry Points:** App launch, global home button, back from any sub-realm.
- **Exit Points:** North Star modal, Citadel modal, Academy (`/academy`), Stories (`/stories`), Playroom (`/playroom`), Explore (`/explore`).
- **Existing Components:** [`MasterCelestialOverworld.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/overworld/celestial/MasterCelestialOverworld.tsx), [`AppShell.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/layout/AppShell.tsx).
- **Architectural Rules:**
  - Full-screen edge-to-edge 100vw × 100vh cosmic environment.
  - Zero top section navigation links, zero bottom navigation dock, zero sidebars.
  - 6 canonical landmarks with organic multi-cloud gaseous nebula interaction glow (`blur(28px - 32px)`).
  - Canvas click explosion (28 particles) and animated constellation energy lines.
- **Legacy Artifact Note:** `src/pages/HomePage.tsx` contains an older generic card-grid layout; it is deprecated/orphaned legacy code. The canonical `/` route is strictly `OverworldPage.tsx`.
- **Responsive:** Fixed 100vw × 100vh landscape diorama with aspect ratio preservation; compact HUD on mobile.

---

## Group C: North Star

### Screen C1: Daily Celestial Guidance & Quests
- **Route:** Triggered via modal on `/` (North Star landmark: 5% top, 66% left)
- **Purpose:** Presents daily starlight missions, daily affirmation, and streak milestone progress.
- **Primary User:** Child Explorer
- **Entry Points:** Tap North Star apex on Overworld.
- **Exit Points:** Dismiss back to Overworld, jump directly to featured lesson/game.
- **Existing Components:** [`DailyQuestModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/overworld/celestial/DailyQuestModal.tsx).
- **Stitch Redesign Scope:** Starlight glass scroll modal, glowing quest objective cards, claim animation button.
- **Must Remain Untouched:** `progressionService.ts`, quest completion verification, star reward payout formulas.
- **Responsive:** Centered floating modal with backdrop blur on desktop/tablet; bottom-sheet modal on mobile.

---

## Group D: ORBIS Citadel

### Screen D1: Cosmic Citadel Command Center
- **Route:** Triggered via modal on `/` (Citadel landmark: 12% top, 39% left)
- **Purpose:** Displays total realm mastery summary, companion status, and adventure level milestones.
- **Primary User:** Child Explorer
- **Entry Points:** Tap Citadel island on Overworld.
- **Exit Points:** Dismiss back to Overworld, jump to Passport (`/passport`) or Sanctuary (`/sanctuary`).
- **Existing Components:** [`CentralOrbisCitadel.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/overworld/celestial/CentralOrbisCitadel.tsx).
- **Known Wiring Discrepancy (Implementation Issue):** Currently in `MasterCelestialOverworld.tsx`, clicking the Citadel triggers `isDailyQuestOpen(true)` (the North Star modal). The intended canonical behavior is that Citadel opens `CentralOrbisCitadel.tsx` as a command modal. This is recorded as an implementation task for the code phase.
- **Stitch Redesign Scope:** Glowing crystalline castle modal with radial realm progress dials.
- **Must Remain Untouched:** Profile XP calculations, total star balance.

---

## Group E: Academy (10 Realms & Structured Learning)

### Screen E1: Academy Main Hub
- **Route:** `/academy`
- **Purpose:** Displays the 10 Academic Realms as floating celestial subject portals with mastery status.
- **Primary User:** Child Explorer
- **Existing Components:** [`AcademyHomePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/AcademyHomePage.tsx), `WorldPortal.tsx`, `GuideCompanionAvatar.tsx`.
- **Stitch Redesign Scope:** 10 illustrated realm crystal portals, daily curriculum recommendation rail, "Ask Orbis" AI tutor trigger.
- **Must Remain Untouched:** Realm IDs, curriculum registry mappings in `curriculumRegistry.ts`.

### Screen E2: Realm Subject & Course Catalog
- **Route:** `/academy/subject/:subjectId`
- **Purpose:** Displays subject courses, grade level paths, and prerequisite course tracks.
- **Existing Components:** [`SubjectDetailPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/SubjectDetailPage.tsx).

### Screen E3: Course Unit & Skill Track
- **Route:** `/academy/course/:courseId`
- **Purpose:** Node path of structured lessons, practice milestones, and capstone tests.
- **Existing Components:** [`CourseDetailPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/CourseDetailPage.tsx).

### Screen E4: Granular Skill Hub (348 Micro-Skills)
- **Route:** `/academy/skill/:skillId`
- **Purpose:** Deep dive into a single micro-skill with explanation, practice set, and mastery crystals.
- **Existing Components:** [`SkillHubPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/SkillHubPage.tsx).

### Screen E5: Cinematic Storybook Lesson Player
- **Route:** `/academy/lesson/:lessonId`
- **Purpose:** 5-scene staged teaching arena combining character acting, audio read-along, interactive manipulatives, and mid-lesson checks.
- **Existing Components:** [`LessonPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/LessonPage.tsx), `CinematicLessonPlayer.tsx`, `StarArrayManipulative.tsx`.
- **Must Remain Untouched:** `cinematicLessonsData.ts`, TTS voice synchronization, lesson step state machine.

### Screen E6: Adaptive Skill Practice Stage
- **Route:** `/academy/practice/:practiceSetId`
- **Purpose:** Interactive question workbench with instant audio-visual feedback, streak multipliers, and celebration modals.
- **Existing Components:** [`PracticePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/PracticePage.tsx), `ProgressiveHintDrawer.tsx`.

### Screen E7: Academy Quest Board
- **Route:** `/academy/missions`
- **Purpose:** Daily and weekly curriculum challenges that reward Star currency.
- **Existing Components:** [`AcademyMissionsPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/AcademyMissionsPage.tsx).

### Screen E8: Academy Universal Literature Library
- **Route:** `/academy/library`
- **Purpose:** Academic reading archives containing non-fiction readers, historical biographies, and realm scientific treatises.
- **Existing Components:** [`AcademyLibraryPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/AcademyLibraryPage.tsx).

### Screen E9: Think Lab (Philosophy & Cognitive Reasoning)
- **Route:** `/academy/think`
- **Purpose:** Thought experiments, logical fallacies, Socratic dialogues, and cognitive ethics challenges for young thinkers.
- **Existing Components:** [`ThinkLabPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/ThinkLabPage.tsx).

### Screen E10: Science Lab (Virtual Experiments)
- **Route:** `/academy/science`
- **Purpose:** Simulated laboratory bench for virtual chemistry titrations, optics prisms, circuit breadboards, and cell biology.
- **Existing Components:** [`ScienceLabPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/ScienceLabPage.tsx).

### Screen E11: Project Studio (Cross-Disciplinary Inventions)
- **Route:** `/academy/projects`
- **Purpose:** Capstone project workbench where children combine coding, science, and creative writing to build complex creations.
- **Existing Components:** [`ProjectStudioPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/ProjectStudioPage.tsx).

---

## Group F: Story Universe & Studio

### Screen F1: Storybook Library & Reader Collection
- **Route:** `/stories` (with `/library` and `/workspace` as aliases)
- **Purpose:** Visual catalog of illustrated AI-generated and classic children’s stories with genre filters and audio preview pills.
- **Existing Components:** [`StoryLibraryPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/StoryLibraryPage.tsx).

### Screen F2: Interactive Story Flipbook Reader
- **Route:** `/stories/:id`
- **Purpose:** Paginated flipbook story viewer with synchronized word-by-word read-along highlighting, ambient soundtrack, and SFX.
- **Existing Components:** [`StoryWorkspacePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/StoryWorkspacePage.tsx).
- **Must Remain Untouched:** Pagination engine, Web Speech API integration, word highlight timers.

### Screen F3: AI Story Generation Studio
- **Route:** `/stories/new` (Protected Route)
- **Purpose:** Guided prompt creator (Genre, Protagonist, Moral Lesson, Setting) that triggers Gemini story generation.
- **Existing Components:** [`CreateStoryPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/CreateStoryPage.tsx), [`StoryForm.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/StoryForm.tsx), `StoryGenerationOverlay.tsx`.
- **Must Remain Untouched:** Story DNA schema, character consistency validators, generation retry logic.

---

## Group G: Playroom (11 Brain Simulation Games)

### Screen G1: Playroom Games Universe Hub
- **Route:** `/playroom` (with `/games` as alias)
- **Purpose:** Arcade station displaying all 11 canonical brain development games and daily cosmic challenges.
- **Existing Components:** [`GameUniversePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/GameUniversePage.tsx), `GameUniverseHub.tsx`, `DailyCosmicChallengeCard.tsx`.

### Screens G2–G12: The 11 Canonical Game Stations
- **G2: Creature Lab (`/games/creature-lab`):** Elemental alchemy cauldron simulation, essence extraction, and creature awakening.
- **G3: Magic Machine (`/games/magic-machine`, `/playroom/magic-machine`):** Physics contraption puzzle with springs, magnets, and Sproutlings.
- **G4: Invention Lab (`/games/invention-lab`, `/playroom/invention-lab`, `/playground/invention-lab`):** Structural bridge engineering, trusses, and stress testing.
- **G5: Mystery Detective (`/games/mystery-detective`, `/playroom/mystery-detective`):** Clue UV inspection, footprints, forensic chemistry, and deductive logic.
- **G6: Potion Scales (`/games/potion-scales`, `/playroom/potion-scales`):** Brass balance weight, algebraic equilibrium, and liquid volume density.
- **G7: Spellforge (`/games/spellforge`, `/playroom/spellforge`, `/playground/spellforge`):** Rune phonics, syllable forging, and vocabulary blacksmith anvil.
- **G8: Memory Museum (`/games/memory-museum`, `/playroom/memory-museum`, `/playground/memory-museum`):** Artifact spatial memory palace and temporal sequencing.
- **G9: Rhythm Spells (`/games/rhythm-spells`, `/playroom/rhythm-spells`, `/playground/rhythm-spells`):** Musical beat timing, pentatonic scale, and ripple harmonics.
- **G10: RoboPath (`/games/robopath`, `/playroom/robopath`, `/playground/robopath`):** Visual block coding logic, loops, conditionals, and spatial grid pathing.
- **G11: Ecosystem Sandbox (`/games/ecosystem-sandbox`, `/playroom/ecosystem-sandbox`, `/playground/world-builder`):** Climate variables, food web ecological balance, and trophic cascades.
- **G12: Cosmic Constellation (`/games/constellations`, `/playroom/constellations`, `/playroom/cosmic-constellations`, `/playground/cosmic-constellations`):** Celestial star-linking geometry, coordinates, and astronomical folklore powered by `cosmicConstellationEngine.ts`.

---

## Group H: Explore Observatory Hub

### Screen H1: Celestial Observatory Main Hub
- **Route:** `/explore`
- **Purpose:** Central starlight observatory linking to 6 key discovery and administrative experiences (NOT a direct jump to Sanctuary).
- **Existing Components:** [`ExplorePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/ExplorePage.tsx).
- **6 Canonical Portals:**
  1. Universal Library (`/academy/library`)
  2. Creative Studio (`/academy/create`)
  3. Starlight Sanctuary (`/sanctuary`)
  4. Explorer Passport (`/passport`)
  5. Parent Zone (`/parent-zone`)
  6. Profile & Settings (`/profile`)

---

## Group I: Creative Studio

### Screen I1: Starlight Drawing & Melody Studio
- **Route:** `/academy/create`
- **Purpose:** Multi-media creative space for drawing digital art, sequencing melodies, and exporting story illustrations.
- **Existing Components:** [`CreativeStudioPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/CreativeStudioPage.tsx).

---

## Group J: Starlight Companion Sanctuary

### Screen J1: Creature Nursery & Habitat
- **Route:** `/sanctuary` (with `/games/sanctuary` as alias)
- **Purpose:** Habitat where discovered elemental creatures live; explorers feed elemental treats, pet, and increase companion affinity.
- **Existing Components:** [`SanctuaryPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/SanctuaryPage.tsx), `AlmanacDrawer.tsx`, `CreatureHatchModal.tsx`.

---

## Group K: Explorer Passport

### Screen K1: Adventure Passport & Stamp Collection
- **Route:** `/passport` (with `/adventure-passport` as alias)
- **Purpose:** Cosmic passport book displaying earned milestone stamps, realm mastery crests, and titles.
- **Existing Components:** [`PassportPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/PassportPage.tsx).

---

## Group L: Parent Zone & Safety

### Screen L1: Parent Insights & Curfew Command Center
- **Route:** `/parent-zone` (Protected Route)
- **Purpose:** Gated dashboard for parents to configure screen-time curfews, review cognitive domain radars, and export certificates.
- **Existing Components:** [`ParentZonePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/ParentZonePage.tsx), `ParentPinModal.tsx`, `DiplomaCertificateModal.tsx`.
- **Must Remain Untouched:** `parentPinService.ts`, `curfewService.ts`.

---

## Group M: Profile & App Settings

### Screen M1: Child Profile Switcher & Settings
- **Route:** `/profile` (with `/settings` as alias; Protected Route)
- **Purpose:** Switch active child explorer profile, customize avatar, toggle audio volumes, and configure language.
- **Existing Components:** [`ProfilePage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/ProfilePage.tsx), `AddChildModal.tsx`, `SignOutConfirmationModal.tsx`.

---

## Group N: Authentication & Account Recovery

### Screen N1: Parent Sign-In & Account Creation
- **Route:** `/auth`
- **Purpose:** Supabase email authentication, magic links, and account creation.
- **Existing Components:** [`AuthPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/AuthPage.tsx).

### Screen N2: Password Recovery & Reset
- **Route:** `/reset-password`
- **Purpose:** Secure password reset via authenticated token link.
- **Existing Components:** [`ResetPasswordPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/ResetPasswordPage.tsx).

---

## Group O: Protected Explorer & Creator Dashboard

### Screen O1: Family Dashboard & Story Archive
- **Route:** `/dashboard` (Protected Route)
- **Purpose:** Central family portal to review child stories, edit created books, and claim login streak bonuses.
- **Existing Components:** [`DashboardPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/DashboardPage.tsx), `DailyLoginModal.tsx`.

---

## Groups P–Z: Shared System Modals, Drawers & States

| ID | Name / Overlay | Purpose | Exact Existing File Path |
|---|---|---|---|
| **P1** | `AskOrbisModal` | Voice-enabled AI cosmic tutor modal with microphone input | [`src/components/academy/assistant/AskOrbisModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/assistant/AskOrbisModal.tsx) |
| **P2** | `DailyLoginModal` | 7-day stardust streak reward calendar modal | [`src/components/experience/DailyLoginModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/experience/DailyLoginModal.tsx) |
| **P3** | `VictoryCelebrationModal` | Confetti stardust burst & XP payout upon completing lessons/games | [`src/components/experience/VictoryCelebrationModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/experience/VictoryCelebrationModal.tsx) |
| **P4** | `ProgressiveHintDrawer` | 4-tier scaffolding hint system for practice questions | [`src/components/academy/practice/ProgressiveHintDrawer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/practice/ProgressiveHintDrawer.tsx) |
| **P5** | `AlmanacDrawer` | Creature species discovery compendium & recipe list | [`src/components/games/creature-lab/AlmanacDrawer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/games/creature-lab/AlmanacDrawer.tsx) |
| **P6** | `CreatureHatchModal` | Egg incubation and companion awakening sequence | [`src/components/games/creature-lab/CreatureHatchModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/games/creature-lab/CreatureHatchModal.tsx) |
| **P7** | `HappyAccidentModal` | Serendipitous elemental fusion discovery modal | [`src/components/games/creature-lab/HappyAccidentModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/games/creature-lab/HappyAccidentModal.tsx) |
| **P8** | `DiplomaCertificateModal`| Printable PDF/SVG achievement diploma generator | [`src/components/parent/DiplomaCertificateModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/parent/DiplomaCertificateModal.tsx) |
| **P9** | `ParentPinModal` | 4-digit cryptographic numeric keypad gating adult areas | [`src/components/parent/ParentPinModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/parent/ParentPinModal.tsx) |
| **P10**| `AddChildModal` | New child explorer profile creation modal | [`src/components/profile/AddChildModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/profile/AddChildModal.tsx) |
| **P11**| `SignOutConfirmationModal`| Sign out confirmation dialog | [`src/components/profile/SignOutConfirmationModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/profile/SignOutConfirmationModal.tsx) |
| **P12**| `StoryGenerationOverlay`| Multi-stage AI storybook synthesis loader | [`src/components/story/wizard/StoryGenerationOverlay.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/story/wizard/StoryGenerationOverlay.tsx) |
| **P13**| `DeleteStoryModal` | Story deletion confirmation modal | [`src/components/story/DeleteStoryModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/story/DeleteStoryModal.tsx) |
| **P14**| `PrintableStoryBookModal`| Printable PDF booklet exporter | [`src/components/story/PrintableStoryBookModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/story/PrintableStoryBookModal.tsx) |
| **S1** | `RouteLoadingFallback` | Cosmic starburst spinner during lazy chunk load | [`src/components/ui/RouteLoadingFallback.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/RouteLoadingFallback.tsx) |
| **S2** | `NotFoundPage` (404) | Cosmic lost-in-space screen with return button | [`src/pages/NotFoundPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/NotFoundPage.tsx) |
| **S3** | Web Audio Unlock Banner | User interaction gate required by browser autoplay policies | `audioSynth.ts` / `AudioContext.tsx` |
| **S4** | PWA / Offline Sync State | Stardust banner indicating cached offline mode & PWA install | `pwaService.ts` / `offlineSyncService.ts` |
| **S5** | Screen-Time Curfew Blackout | Bedtime blackout screen locking app when curfew is active | `curfewService.ts` |
