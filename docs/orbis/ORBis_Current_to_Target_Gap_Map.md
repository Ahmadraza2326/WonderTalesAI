# ORBis Current-to-Target Gap Map & Component Audit

> **Standard:** Complete Project Reality Audit  
> **Rule:** Never protect weak code because it already exists. Classify every major component into `KEEP`, `REFACTOR`, `REBUILD`, `REPLACE`, `REMOVE`, or `DEFER`.

---

## 1. Executive Summary of Current vs. Target Reality

| Area | Current Reality | Target Standard | Verdict |
|---|---|---|---|
| **Design System** | Scattered CSS-in-JS inline styles, inconsistent gradients, rudimentary tokens. | Unified cosmic design system with WCAG contrast, fluid typography, rich glassmorphic surfaces, tactile buttons with all states. | 🔨 **REBUILD** |
| **Character System** | Static SVG vector circles with basic CSS transforms. No procedural eye-tracking, no lip-sync, limited emotion blending. | Living character actors with responsive gaze-following, fluid spine/limb kinematics, expressive emotional states, speech visemes. | 🔨 **REBUILD** |
| **Lesson Engine** | Linear 5-scene slideshow with basic conditional step triggers. Limited direct visual teaching transitions. | Cinematic interactive teaching stage with progressive visual reveal, animated group-to-array transformations, cause-effect manipulation. | 🔨 **REBUILD** |
| **Gold Lesson (`lesson_g2_array_multiplication`)** | Scene 2 shows static ten-frame counter. Scene 3 is simple number line hop. Scene 4 is 3-button choice. | Multi-stage interactive production: magical seed planting $\to$ rows $\times$ columns grouping $\to$ physical grid builder $\to$ equation emergence. | 🌟 **REBUILD (GOLD STANDARD)** |
| **Manipulatives** | 9 functional but visually simplistic manipulatives. Some hardcoded values and lack of tactile haptic feedback on web. | 11+ physicalized, responsive, multi-touch virtual manipulatives with dynamic physics, fluid particle feedback, and sound synchronization. | 🔧 **REFACTOR** |
| **Feedback System** | 4-tier hints rendered in a drawer below question. Some hints are static text descriptions. | Diagnostic misconception analyzer that detects *why* a child answered incorrectly and uses character gestures + canvas highlights to reteach. | 🔨 **REBUILD** |
| **Flagship Games (`magic_machine`, etc.)** | 10 playable game engines with state reducers and canvas/3D rendering. Some mechanics feel like isolated minigames. | Seamlessly integrated capstone worlds where the lesson concept (e.g. multiplication matrix) is the direct gameplay mechanic. | 🔧 **REFACTOR** |
| **Mastery & Learning Director** | Static rule-based formulas in `masteryService.ts` and `learningDirector.ts`. | Multi-dimensional Bayesian-style mastery tracking (accuracy, latency, hints, retention decay, transfer). | 🔧 **REFACTOR** |
| **Academy Home** | Vertical list of subjects and cards; feels slightly dashboard-like. | Dynamic "Today's Journey" hub with floating world realms, character greeting, recent quest tracker, and clean visual hierarchy. | 🔨 **REBUILD** |
| **Curriculum Data (50 Cinematic Lessons)** | 50 rigorously validated, acyclic, pedagogical lesson definitions in `cinematicLessonsData.ts`. | Canonical curriculum definition remains locked, validated, and frozen. | ✅ **KEEP** |

---

## 2. Detailed Component Classification Matrix

### 2.1 Lesson & Teaching Experience Components
* **`CinematicLessonPlayer.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Basic step index manager with splash start button.
  * *Target:* Full cinematic stage orchestrator with audio track ducking, scene cross-fading, pause/resume, replay button, and character stage presence.
* **`LessonSceneRenderer.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Dispatches to visual demo or manipulative based on switch statement.
  * *Target:* Integrated teaching stage where character dialogue, visual demonstration, and manipulative smoothly interact on a unified canvas.
* **`GuideTeachingLayer.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Floating box with text and SVG avatar.
  * *Target:* Interactive mentor companion overlay with directional speech bubbles, gaze targeting, and gesture pointers.
* **`VisualDemoRenderer.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Static SVG cards and simple CSS bars.
  * *Target:* Rich animated teaching visualizer using progressive reveal, synchronized narration, and dynamic transformations.
* **`MicroQuestionRenderer.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Choice buttons with hint drawer.
  * *Target:* Diegetic question station embedded directly into the world narrative with audio playback, tactile options, and diagnostic scaffolding.

### 2.2 Practice & Manipulative System
* **`TenFrameManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add tactile snap physics, grouping animations, and array multiplication mode).
* **`NumberLineManipulative.tsx`** ➔ 🔧 **REFACTOR** (Support multi-hop arcs, skip-counting loops, and dynamic bounds).
* **`BalanceScaleManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add continuous physics spring simulation, mass calibration, and variable weights).
* **`RhythmDrumsManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add tempo visualizer, beat quantization, and multi-track audio layers).
* **`ColorPaletteManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add real-time shader-like spectral dispersion and wavelength visualization).
* **`InteractiveRoboGridSimulator.tsx`** ➔ 🔧 **REFACTOR** (Enhance path tracing animations, collision particles, and step execution controls).
* **`PhonemeTileManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add acoustic sound-wave synthesis and mouth shape articulation cards).
* **`SentenceRuneManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add syntactic tree visualizer and glowing rune connections).
* **`LogicDeductionManipulative.tsx`** ➔ 🔧 **REFACTOR** (Add interactive clue cross-off grid and deductive connection lines).

### 2.3 Page-Level Hubs & Discovery
* **`AcademyHomePage.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Grid of cards with shortcuts.
  * *Target:* Living celestial learning hub with "Today's Guided Journey", floating 3D realm portals, active guide greeting, and quest tracker.
* **`SkillHubPage.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* Static 3-step action cards (Lesson, Practice, Capstone).
  * *Target:* Interactive Skill Constellation Station showing clear prerequisite path, mastery crystal tier, and instant launchpad.
* **`CourseDetailPage.tsx` & `SubjectDetailPage.tsx`** ➔ 🔧 **REFACTOR** (Upgrade to rich realm backdrops, progress tracks, and unlocked unit nodes).
* **`AcademyLibraryPage.tsx`** ➔ 🔧 **REFACTOR** (Add visual discovery carousels, difficulty badges, and voice search simulation).
* **`PracticePage.tsx`** ➔ 🔧 **REFACTOR** (Integrate progressive streak multipliers, mastery celebration modals, and adaptive difficulty shifting).

### 2.4 Character & Audio System
* **`GuideCharacterSvg.tsx`** ➔ 🔨 **REBUILD**
  * *Current:* SVG circle with polygons and basic emotion rotations.
  * *Target:* Premium vector mascot engine with smooth breathing cycles, eye tracking towards mouse/touch, lip sync visemes, and 12 distinct emotional poses.
* **`GuideCompanionAvatar.tsx`** ➔ 🔧 **REFACTOR** (Support responsive sizing, glowing auras, and emotion cross-fades).
* **`guideDirector.ts`** ➔ ✅ **KEEP & EXPAND** (Guide profiles and emotional metadata are high quality).
* **`sfxService.ts`** ➔ 🔧 **REFACTOR** (Add Web Audio API synthesizer fallback, audio ducking, and spatial stereo panning).
* **`narrationDirector.ts`** ➔ 🔧 **REFACTOR** (Add emotion/pacing metadata support, speech synthesis tuning, and Gemini-TTS pipeline bridge).

### 2.5 Curriculum & Backend Services
* **`cinematicLessonsData.ts`** ➔ ✅ **KEEP (CANONICAL FROZEN)**
* **`curriculumRegistry.ts`** ➔ ✅ **KEEP**
* **`masteryService.ts`** ➔ 🔧 **REFACTOR** (Expand multi-dimensional retention and transfer scoring).
* **`economyService.ts`** ➔ ✅ **KEEP**
* **`learningDirector.ts`** ➔ 🔧 **REFACTOR** (Add adaptive branching and fatigue signal detection).
* **`playgroundRegistry.ts`** ➔ ✅ **KEEP**
