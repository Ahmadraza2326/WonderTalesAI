# ORBis Phase 4A — Cinematic Lesson Player Deep Audit

> **Status:** READ-ONLY DEEP AUDIT COMPLETE  
> **Document Purpose:** Systematic architectural inspection of the ORBis Cinematic Lesson execution system, identifying existing capabilities, legacy code gaps, Stitch Direction C / Mobbin compliance, and defining the precise 7-milestone implementation plan for Phase 4A.  
> **Design Authority:** Stitch Project `4449806016687673397` (Direction C: *Living Learning Universe*) & Mobbin Benchmark Pattern Library  
> **Rule:** No code modifications, no test creation, 100% grounded in active repository files.

---

## 1. Executive Verdict

**Verdict:** **READY FOR PHASE 4A IMPLEMENTATION (EXCELLENT FOUNDATION WITH TARGETED DIRECTION C ELEVATION REQUIRED)**.

**Key Findings:**
1. **Rich Pedagogical & Character Foundations are Already Working:**
   - The 5-scene Bruner EIS progression (*Hook $\rightarrow$ Visual Demo $\rightarrow$ Interactive Manipulative $\rightarrow$ Micro-Question Check $\rightarrow$ Reflection & Star Crystal*) is fully supported in `cinematicLessonsData.ts`.
   - `GuideCharacterSvg.tsx` supports all 10 vector mascots with 12 emotional actor poses, dynamic pupil gaze tracking, and procedural breathing.
   - `narrationDirector.ts` is fully integrated with Web Speech API, 9 emotional vocal performance modes, word-by-word synchronized subtitles, and dynamic $-12\text{dB}$ background music ducking.
   - `useActivityEconomy.ts` and `masteryService.ts` provide idempotent, re-award protected progression ledger updates.
2. **Identified Legacy & Visual Gaps (Why Phase 4A is Necessary):**
   - **Emoji Residuals:** `CinematicLessonPlayer.tsx`, `GuideTeachingLayer.tsx`, `RealmStageBackdrop.tsx`, and `LessonViewer.tsx` contain presentation Unicode emojis (`✨`, `🚀`, `🤖`, `⭐`, `⚪`, `🔊`, `⏸️`, `▶️`, `🍃`, `🔮`, `💫`, `📜`, `🧭`) that violate the zero-presentation-emoji rule.
   - **Progress Rail Fragmentation:** `CinematicLessonPlayer.tsx` currently builds a custom, unpolished star-dot progress indicator rather than utilizing the established [`LessonProgressRail.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/LessonProgressRail.tsx).
   - **Atmospheric Stage Backing:** `RealmStageBackdrop.tsx` renders static floating emoji characters instead of utilizing the high-performance canvas [`ParticleField.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/ParticleField.tsx).
   - **Mobile Speech Bubble Stacking:** On 320px–375px mobile screens, `GuideTeachingLayer.tsx` horizontally squishes the mascot avatar and dialogue bubble; it requires responsive flex-wrap and fluid sizing.
   - **Legacy Text Block Fallback:** `LessonViewer.tsx` fallback renderer contains raw JSON string displays (`{JSON.stringify(currentBlock.visualData, null, 2)}`) which must be gracefully presented with `GlassPanel` and `AnimatedIcon`.

---

## 2. Current Lesson Architecture

```
                                    ┌────────────────────────┐
                                    │    SkillHubPage.tsx    │
                                    └───────────┬────────────┘
                                                │ (Clicks "Start Lesson")
                                                ▼
                                    ┌────────────────────────┐
                                    │     LessonPage.tsx     │
                                    │ (ParticleField, Modal) │
                                    └───────────┬────────────┘
                                                │
                                                ▼
                                    ┌────────────────────────┐
                                    │    LessonViewer.tsx    │
                                    └───────────┬────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 │ (If Cinematic Lesson Data Exists)                           │ (Legacy Block Fallback)
                 ▼                                                             ▼
┌───────────────────────────────────────────────┐               ┌───────────────────────────────┐
│          CinematicLessonPlayer.tsx            │               │      Legacy Step Renderer     │
├───────────────────────────────────────────────┤               └───────────────────────────────┘
│ • RealmStageBackdrop (Thematic Stage Canvas)  │
│ • LessonProgressRail (5-Scene Tracker & Audio)│
│ • GuideTeachingLayer (Mascot + Subtitles)     │
│ • LessonSceneRenderer (5 Scene Dispatcher):   │
│     ├─ VisualDemoRenderer (Animated Models)   │
│     ├─ 12 Manipulatives (TenFrame, Array, etc)│
│     └─ MicroQuestionRenderer (Tiered Hints)   │
│ • Completion Flow (XP, Stars, Celebration)    │
└───────────────────────────────────────────────┘
```

---

## 3. Full User Journey (Skill Hub $\rightarrow$ Lesson $\rightarrow$ Celebration)

1. **Launcher Gate (`SkillHubPage.tsx`):** Child selects *"Start Interactive Lesson"* from The Learning Triad $\rightarrow$ navigates to `/academy/lesson/:lessonId`.
2. **Audio Primer Gate (`CinematicLessonPlayer.tsx`):** Displays a tactile, welcoming cosmic stage card introducing the quest. When the child taps *"Begin Adventure"*, the Web Audio engine and speech synthesizer are primed seamlessly with an introductory audio chime.
3. **Scene 1 — Narrative & Visual Hook (`welcome_hook`):**
   - The realm guide appears in `GuideTeachingLayer.tsx` with a welcoming or curious pose.
   - `narrationDirector.ts` speaks the narrative dialogue while ducking background music by $-12\text{dB}$.
   - Live word-by-word subtitles illuminate in sync with the audio.
   - Child clicks `MagicalButton` (*"Continue Adventure ➔"*).
4. **Scene 2 — Visual Concept Demonstration (`visual_demonstration`):**
   - `VisualDemoRenderer.tsx` showcases the mathematical or scientific model (e.g. star array multiplication grid, fraction bar partition, water cycle simulation).
   - The guide points (`gaze="pointing_right"`) and explains the core concept.
5. **Scene 3 — Enactive Tactile Manipulative (`guided_interaction`):**
   - Renders one of 12 tactile interactive manipulatives on `InteractionSurface.tsx` (e.g. `TenFrameManipulative`, `StarArrayManipulative`, `BalanceScaleManipulative`, `NumberLineManipulative`, `CodeBlockManipulative`).
   - The child directly manipulates the objects on screen. When the target goal is met, `onTargetReached` fires with haptic feedback (`HapticsService.success()`) and success SFX (`sfxService.play('match_success')`), unlocking the advance button.
6. **Scene 4 — Micro-Question Comprehension Check (`micro_question`):**
   - `MicroQuestionRenderer.tsx` presents a contextual check.
   - If incorrect: soft mistake audio chime (`sfxService.play('mistake_soft')`), non-punitive guide encouragement, and progressive hint disclosure (Tiers 1–4).
   - If correct: victory chime and guide celebration pose.
7. **Scene 5 — Reflection & Victory (`reflection_summary`):**
   - The guide delivers the summary takeaway in celebration pose (`celebrating`).
   - Fires `onComplete(rewardXP, rewardStars)` $\rightarrow$ triggers `VictoryCelebrationModal.tsx`, updates mastery ledger in `masteryService.ts`, and awards XP/Stars via `useActivityEconomy.ts`.
   - Child taps *"Next Level"* $\rightarrow$ returns triumphant to `SkillHubPage.tsx`.

---

## 4. Scene & Director Architecture (5-Scene Bruner EIS)

The pedagogy strictly follows the **Bruner Enactive-Iconic-Symbolic (EIS)** progression model:

| Scene Type | Bruner Stage | Component In Charge | Sensory Modalities |
| :--- | :--- | :--- | :--- |
| **1. `welcome_hook`** | Concrete Narrative | `GuideTeachingLayer` + Mascot | Visual Character + Spoken Lore + Subtitles |
| **2. `visual_demonstration`** | Iconic Representation | `VisualDemoRenderer` | Visual Motion Diagram + Spoken Explanation |
| **3. `guided_interaction`** | Enactive / Direct Action | 12 Manipulatives on `InteractionSurface` | Tactile Touch/Drag + Audio Feedback + Spatial Visuals |
| **4. `micro_question`** | Symbolic Application | `MicroQuestionRenderer` | Abstract Symbols/Options + 4-Tier Scaffolding Drawer |
| **5. `reflection_summary`** | Synthesis & Mastery | `VictoryCelebrationModal` | Reward Star Chips + Fanfare Audio + Stardust Particles |

---

## 5. Character Actor Architecture (`GuideCharacterSvg.tsx` & `GuideTeachingLayer.tsx`)

- **10 Canonical Guides:** *Poly* (Math), *Newton* (Science), *Lexi* (English), *Aria* (Reading), *BEEP-0* (Computer Science), *Sherlock* (Logic), *Nova* (Space & Discovery), *DaVinci* (Engineering & Art), *Atlas* (World & Social), *Harmony* (Music & Mindfulness).
- **12 Actor Poses:** `idle`, `teaching`, `thinking`, `curious`, `excited`, `celebrating`, `encouraging`, `confused`, `concerned`, `listening`, `waiting`, `happy`.
- **Dynamic Gaze Tracking:** Supports directional gaze (`left`, `right`, `up`, `down`, `center`) and continuous normalized gaze target tracking `{ x, y }` to coordinate joint visual attention between the mascot and interactive workspace elements.
- **Lip-Sync & Subtitle Synchrony:** Procedural mouth animation and word-by-word highlighted text driven by Web Speech API boundary events.

---

## 6. Audio Architecture (`narrationDirector.ts` & `sfxService.ts`)

- **9 Performance Modes:** `warm_teacher`, `excited_discovery`, `wonder_suspense`, `encouragement`, `gentle_correction`, `celebration`, `reflective_guide`, `focused_attention`, `playful_challenge`.
- **Dynamic Music Ducking:** Automatically applies a $-12\text{dB}$ gain envelope to background music tracks when speech synthesis begins and smoothly restores normal gain on speech completion.
- **Synthesized SFX Palette:** Client-side zero-latency Web Audio sound effects: `star_pop`, `match_success`, `mistake_soft`, `card_flip`, `victory_fanfare`, `level_up`, `crystal_ping`.
- **Interruption & Replay Safety:** Calling `narrationDirector.speak()` instantly halts previous utterances, resets word indices, and executes the new performance cleanly.

---

## 7. Completion & Reward Audit

- **Execution Path:**
  - `CinematicLessonPlayer` $\rightarrow$ `onComplete(rewardXP, rewardStars)`
  - `LessonPage.handleCompleteLesson(xp, stars)`
  - `masteryService.recordLessonCompletion(skillId, subjectId, childId)` (Sets baseline 50 score, increments attempts/correct, updates tier)
  - `useActivityEconomy.completeActivity({ xpAmount, starsAmount })`
- **Re-Award & Duplicate Protection:**
  - `useActivityEconomy.ts` utilizes `hasSubmittedRef.current` and caches `lastResultRef.current`. Submitting multiple times within a single session run is blocked and returns the cached result without redundant economy ledger transactions.

---

## 8. Mobile & Responsive Audit (320px–1280px)

| Screen Width | Component Behavior | Required Elevation in Phase 4A |
| :--- | :--- | :--- |
| **1280px (Desktop)** | Centered 840px glass stage with balanced whitespace. | Maintain clean layout with `LessonProgressRail.tsx`. |
| **768px (Tablet)** | 2-column or stacked layout with clear touch zones. | Ensure manipulative surfaces scale cleanly. |
| **430px (Large Mobile)** | Single column stack with full-width cards. | Ensure mascot speech bubble pointer aligns correctly. |
| **375px & 320px (Mobile)** | Narrow viewport width. | Enable flex-wrap on `GuideTeachingLayer` (mascot stacks above bubble or scales to 64px) to prevent text truncation. Enforce $\ge 48\text{px}$ touch targets. |

---

## 9. Accessibility Audit (WCAG 2.1 AA / AAA)

- **Contrast:** Light text (`#f8fafc`) on dark glass surfaces (`rgba(15, 23, 42, 0.92)`) provides $> 9:1$ contrast ratio.
- **Narration Controls:** Audio toggle and replay buttons must provide explicit `aria-label` tags (`"Replay guide voice"`, `"Mute narration"`).
- **Reduced Motion:** Respect `@media (prefers-reduced-motion: reduce)` across particle canvases and character breathing animations.
- **Keyboard Navigation:** All interactive elements (`MagicalButton`, option tiles, manipulative controls) support standard tab navigation and keyboard activation (`Enter` / `Space`).

---

## 10. Stitch Direction C & Mobbin Interaction Audit

- **Visual Language:** Transition all lesson player containers from legacy ad-hoc styles to unified `GlassPanel` (`variant="hero"` and `variant="elevated"`).
- **Zero Emojis:** Replace all Unicode emoji characters with `AnimatedIcon` vectors and SVG graphics.
- **Progressive Scaffolding:** Unify the 4-tier hint drawer in `MicroQuestionRenderer.tsx` with animated clue bulb vectors and non-punitive guide dialogue.
- **Tactile Affordances:** Primary advance buttons use `MagicalButton` with spring physics and integrated sound cues.

---

## 11. Legacy vs Reusable vs Protected Components

| Category | Files / Components | Status / Action |
| :--- | :--- | :--- |
| **PROTECTED (Do Not Modify)** | `curriculumRegistry.ts`, `cinematicLessonsData.ts`, all subject curriculum files, 10 flagship games, Supabase schema, `authService.ts`. | **100% INVARIANT** |
| **REUSABLE ASSETS** | `GlassPanel.tsx`, `MagicalButton.tsx`, `AnimatedIcon.tsx`, `SkillCrystal.tsx`, `LessonProgressRail.tsx`, `ParticleField.tsx`, `InteractionSurface.tsx`, `GuideCharacterSvg.tsx`, `narrationDirector.ts`, `sfxService.ts`, `useActivityEconomy.ts`, `masteryService.ts`. | **REUSE DIRECTLY** |
| **TARGETED FOR 4A ELEVATION** | `LessonPage.tsx`, `LessonViewer.tsx`, `CinematicLessonPlayer.tsx`, `GuideTeachingLayer.tsx`, `MicroQuestionRenderer.tsx`, `RealmStageBackdrop.tsx`. | **REFINE IN PHASE 4A** |

---

## 12. Risks & Invariants

1. **Curriculum Invariance:** Zero modifications to 348 standards, lesson IDs, skill IDs, or flagship game engines.
2. **Audio Autoplay Policies:** Browsers require a user gesture before Web Audio/SpeechSynthesis can play. The welcoming audio primer gate (*"Tap to Begin Adventure"*) safely primes the audio context without unhandled browser policy rejections.
3. **Double Submission Guard:** Preserve `useActivityEconomy` ref locking to prevent double-minting rewards.

---

## 13. Exact Phase 4A Implementation Sequence

Divided into 7 small, structured milestones:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ORBIS PHASE 4A IMPLEMENTATION SEQUENCE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Milestone 4A.1 — Lesson Stage Foundation & Progress Rail Integration        │
│   • Upgrade LessonPage.tsx and RealmStageBackdrop.tsx with canvas           │
│     ParticleField and Direction C dark cosmic gradients.                    │
│   • Integrate LessonProgressRail.tsx into CinematicLessonPlayer.tsx         │
│     with sticky header, 5-scene steps, audio mute/unmute, and exit handler. │
│                                                                             │
│ Milestone 4A.2 — Cinematic Scene Stage & Zero Emoji Sanitization            │
│   • Sanitize all presentation Unicode emojis across CinematicLessonPlayer,  │
│     RealmStageBackdrop, and LessonViewer.                                   │
│   • Standardize initial welcoming audio primer card with GlassPanel &       │
│     MagicalButton.                                                          │
│                                                                             │
│ Milestone 4A.3 — Living Guide Actor & Speech Layer Elevation                │
│   • Upgrade GuideTeachingLayer.tsx with AnimatedIcon controls, responsive   │
│     mobile flex-wrapping, and seamless word-by-word subtitle styling.       │
│   • Ensure GuideCharacterSvg poses coordinate with scene progression.       │
│                                                                             │
│ Milestone 4A.4 — Micro-Question Scaffolding & Visual Demo Polish            │
│   • Elevate MicroQuestionRenderer.tsx with GlassPanel, AnimatedIcon speech  │
│     prompts, and tactile 4-tier hint drawer.                                │
│   • Verify VisualDemoRenderer displays cleanly across 10 subject models.    │
│                                                                             │
│ Milestone 4A.5 — Navigation, Completion & Idempotent Reward Pipeline        │
│   • Standardize sticky/fixed bottom advance bar with MagicalButton.         │
│   • Verify handleCompleteLesson triggers VictoryCelebrationModal and        │
│     records mastery without redundant reward duplication.                   │
│                                                                             │
│ Milestone 4A.6 — Responsive (320px–1280px) & Accessibility Polish           │
│   • Verify all touch targets >= 48px, ARIA labels, contrast, and            │
│     prefers-reduced-motion across mobile, tablet, and desktop viewports.    │
│                                                                             │
│ Milestone 4A.7 — Verification & Master Regression Suite                     │
│   • Create dedicated test_cinematic_lesson_player.tsx test suite.           │
│   • Run full TypeScript check and all 66+ master regression suites.         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 14. Summary of Audit Outcomes

1. **What is already good:**
   - Universal 5-scene Bruner EIS data across 50 lessons.
   - Vector character actor system with 10 mascots and 12 poses.
   - 9-mode vocal narration director with dynamic $-12\text{dB}$ music ducking.
   - 12 tactile practice manipulatives and working visual demo models.
   - Idempotent activity economy hook and mastery progression service.
2. **What genuinely needs improvement:**
   - Replacing hardcoded presentation emojis with `AnimatedIcon` and SVG vectors.
   - Replacing fragmented header progress indicators with `LessonProgressRail.tsx`.
   - Replacing emoji particles in `RealmStageBackdrop.tsx` with canvas `ParticleField`.
   - Responsive wrapping in `GuideTeachingLayer.tsx` for 320px–375px mobile screens.
   - Polishing `MicroQuestionRenderer.tsx` with unified `GlassPanel` and tactile hint drawer.
3. **Exact first implementation task:**
   - **Milestone 4A.1 — Lesson Stage Foundation & Progress Rail Integration** (Upgrade `LessonPage.tsx`, `RealmStageBackdrop.tsx`, and embed `LessonProgressRail.tsx` in `CinematicLessonPlayer.tsx`).
