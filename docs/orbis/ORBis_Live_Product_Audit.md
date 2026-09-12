# ORBis Live Product Architecture & Codebase Audit

---

## 1. Executive Summary & Audit Scope

This document provides a line-by-line, component-by-component architectural inspection of the live WonderTales/ORBis codebase as of August 2026. It assesses technical health, runtime integrity, UX fidelity, and alignment with the ORBis Master Premium Experience standards across all 24 major subsystems.

---

## 2. Global Architecture & Route Map

```
App Entry (src/main.tsx)
 ├── CSS Tokens (src/styles/tokens.css + src/index.css)
 ├── Audio Provider (src/context/AudioContext.tsx)
 ├── Auth / Profile Provider (src/context/AuthContext.tsx)
 └── App Router (src/App.tsx)
      ├── / (Landing / Hero Discovery)
      ├── /home (Learner Home Hub)
      ├── /academy (ORBis Learning Universe Master Map)
      │    ├── /academy/subjects/:subjectId (Subject Realm Detail)
      │    ├── /academy/courses/:courseId (Course Journey Map)
      │    ├── /academy/lessons/:lessonId (Cinematic Lesson Player Stage)
      │    ├── /academy/skills (Skill Crystal Hub)
      │    ├── /academy/library (Living Content Library)
      │    ├── /academy/create (Creative Studio)
      │    ├── /academy/think (Think Lab / Logic)
      │    ├── /academy/science (Virtual Science Lab)
      │    └── /academy/projects (Project Studio)
      ├── /playroom (Playroom Hub / 10 Dedicated Stations)
      ├── /creatures (Sanctuary / Creature Lab)
      ├── /profile (Learner Profile & Avatar Studio)
      └── /parents (Parent & Educator Insights Portal)
```

---

## 3. Subsystem-by-Subsystem Audit

### 3.1 Academy Cinematic Lesson Engine
- **Files:**
  - [`src/components/academy/lesson/LessonViewer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/LessonViewer.tsx)
  - [`src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx)
  - [`src/components/academy/lesson/cinematic/LessonSceneRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/LessonSceneRenderer.tsx)
  - [`src/components/academy/lesson/cinematic/VisualDemoRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/VisualDemoRenderer.tsx)
  - [`src/components/academy/lesson/cinematic/MicroQuestionRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/MicroQuestionRenderer.tsx)
  - [`src/components/academy/lesson/cinematic/GuideTeachingLayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/GuideTeachingLayer.tsx)
  - [`src/components/academy/lesson/cinematic/RealmStageBackdrop.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/RealmStageBackdrop.tsx)
- **Current State:**
  - 50 fully authored lessons in `cinematicLessonsData.ts` adhering to 5-scene structure (Hook, Guide Arrives, Concept Reveal, Interactive Challenge, Celebration).
  - Runtime handles scene transitions, audio play cues, and hint delivery.
- **Identified Deficiencies:**
  - `VisualDemoRenderer.tsx` contains static SVG diagrams for some operations rather than dynamic physical spring simulations.
  - `MicroQuestionRenderer.tsx` relies on multiple-choice pills rather than in-world direct manipulation answers.
  - Scene transitions use simple cross-fades rather than camera zooms and spatial stage pans.

### 3.2 Character Guide & Actor Engine
- **Files:**
  - [`src/components/academy/guide/GuideCharacterSvg.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/guide/GuideCharacterSvg.tsx)
  - [`src/components/academy/guide/GuideCompanionAvatar.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/guide/GuideCompanionAvatar.tsx)
  - [`src/services/academy/guideDirector.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/academy/guideDirector.ts)
- **Current State:**
  - SVG renderer supports 10 distinct guides (Poly, Newton, Lexi, BEEP-0, Aria, Nova, Sherlock, Willow, Kai, Pixel).
  - Basic idle float animation and mood-based color accents.
- **Identified Deficiencies:**
  - Guides are currently 2D flat vector layers with static eyes; cursor/touch gaze tracking is not yet fully dynamic.
  - Actor poses are limited to 4 moods (`encouraging`, `celebrating`, `thinking`, `curious`) rather than the canonical 12 emotional actor states.
  - Breathing cycles and natural blinks are CSS keyframe approximations without procedural organic timing.

### 3.3 Audio Synthesis & Narration Director
- **Files:**
  - [`src/services/audio/sfxService.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/audio/sfxService.ts) (1,600 lines Web Audio API engine)
  - [`src/services/audio/narrationDirector.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/audio/narrationDirector.ts)
  - [`src/services/audio/audioController.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/audio/audioController.ts)
- **Current State:**
  - Procedural Web Audio API sound synthesis with zero external MP3 network dependencies.
  - Pentatonic chime melodies, pentatonic scale arpeggios, and sound cues (`card_flip`, `button_click`, `star_pop`, `victory_fanfare`, etc.).
- **Identified Deficiencies:**
  - Narration speech is not yet fully ducking the background music by $-12\text{dB}$ via dynamic audio gain nodes.
  - Pitch modulation during speech pauses is basic; needs expressive sentence-chunked prosody control.

### 3.4 Playroom & Game Stations
- **Files:**
  - [`src/components/playroom/stations/MagicMachineLab.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/MagicMachineLab.tsx) (Math Array Engine)
  - [`src/components/playroom/stations/MysteryDetective.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/MysteryDetective.tsx) (Logic Deduction)
  - [`src/components/playroom/stations/PotionScales.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/PotionScales.tsx) (Algebra & Balance)
  - [`src/components/playroom/stations/SpellforgeAnvil.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/SpellforgeAnvil.tsx) (Phonics & Spelling)
  - [`src/components/playroom/stations/RoboPathAcademy.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/RoboPathAcademy.tsx) (Algorithms & Sequencing)
  - [`src/components/playroom/stations/EcosystemSandbox.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/EcosystemSandbox.tsx) (Biology & Systems)
  - [`src/components/playroom/stations/InventionLab.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/InventionLab.tsx) (Physics & Engineering)
  - [`src/components/playroom/stations/RhythmSpellsConductor.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/RhythmSpellsConductor.tsx) (Music & Beat)
  - [`src/components/playroom/stations/MemoryMuseum.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/MemoryMuseum.tsx) (History & Recall)
  - [`src/components/playroom/stations/CosmicConstellationBuilder.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/CosmicConstellationBuilder.tsx) (Astronomy & Geometry)
- **Current State:**
  - 10 distinct game engines with interactive canvases, Web Audio cues, and progression feedback.
- **Identified Deficiencies:**
  - `MagicMachineLab.tsx` needs deeper coupling to the `lesson_g2_array_multiplication` array concept where array formulas dynamically charge the machine battery.
  - In-game rewards need direct integration with Creature Sanctuary upgrades.

### 3.5 Design System & UI Components (`src/components/ui/design/`)
- **Files:**
  - `AnimatedIcon.tsx` (28 vector icons, 5 animation modes)
  - `MagicalButton.tsx` (9 states, realm styling, tactile physics, haptics)
  - `GlassPanel.tsx` (Elevation tiers: hero, card, slot, floating, translucent)
  - `SkillCrystal.tsx` (Faceted 3D crystal, particle stardust)
  - `WorldPortal.tsx` (Realm gateway with glowing ambient auras)
  - `OrbitalProgress.tsx` (Radial SVG progress meter)
  - `RealmBadge.tsx` (Tactile realm indicator)
  - `RewardChip.tsx` (XP and Star counter)
  - `AdventurePath.tsx` (Quest path with connected nodes)
  - `InteractionSurface.tsx` (Manipulative stage stage)
  - `LessonProgressRail.tsx` (5-scene cinematic progress header)
- **Current State:**
  - Phase 2 complete. Master tokens established in `tokens.css` and `academyTokens.ts`.
- **Identified Deficiencies:**
  - Need higher-level composite primitives: `CharacterActorStage`, `CelebrationConfettiStage`, `DirectManipulativeSandbox`.

---

## 4. Quality & Compliance Baseline

| Area | Target Standard | Current Status | Notes |
|---|---|---|---|
| **TypeScript Compilation** | 0 errors | ✅ 0 Errors | `npx.cmd tsc --noEmit` passes cleanly |
| **Universal Curriculum Integrity** | 100% valid | ✅ 12/12 Audits | 50 lessons, 0 orphans, 0 circular dependencies |
| **Runtime Regression Suite** | 100% pass | ✅ 63/63 Suites | Automated runner in `scripts/run_all_tests.ts` |
| **Touch Targets** | $\ge 48\text{px}$ (child), $\ge 64\text{px}$ (pre-k) | ✅ Enforced in tokens | `TOUCH_TARGET_TOKENS` verified |
| **A11y Reduced Motion** | Full `@media` support | ✅ Enforced | All design components bypass animations when enabled |
| **Zero Emoji Placeholders** | 100% Bespoke SVG | ✅ Enforced | `AnimatedIcon` system provides all icons |
