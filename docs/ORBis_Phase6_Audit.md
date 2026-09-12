# ORBis — Phase 6 Comprehensive Audit
## Cinematic Guided Learning Experience: From Scaffolding to World-Class Child-First Pedagogy

---

### 1. Executive Summary

This audit evaluates the transition of ORBis Academy from the structural curriculum registry (Phases 1–5) to a **cinematic, child-first, narrated, visual-first learning experience (Phase 6)** comparable in pedagogical warmth, accessibility, and visual engagement to premier early childhood learning environments (e.g. Khan Academy Kids), while embodying the distinctive **ORBis magical-3D-cosmic identity**.

---

### 2. Deep Audit of Existing Academy Subsystems

| Subsystem | Current State & Implementation | Gaps Identified for Phase 6 | Action Required |
| :--- | :--- | :--- | :--- |
| **Lesson Viewer (`LessonViewer.tsx`)** | Functional step-by-step block renderer with text, basic inputs, and raw JSON stringification for visual data. | Lacks visual-first demonstrations, animated object transitions, tactile manipulatives, integrated guide narration, and micro-questions. | Replace with `CinematicLessonPlayer` and modular `LessonSceneRenderer` supporting SHOW $\rightarrow$ EXPLAIN $\rightarrow$ INTERACT flows. |
| **Guide Character System (`guideDirector.ts`, `GuideCompanionAvatar.tsx`)** | 10 Guides defined with voice pitch/rate, dialogue catchphrases, and floating avatar pill. | Guides operate primarily as decorative cards rather than active on-screen pedagogical companions with reactive gestures and focus pointing. | Upgrade to `GuideTeachingLayer` with reactive emotional states (`neutral`, `curious`, `thinking`, `guiding`, `encouraging`, `celebrating`), speech bubbles, word highlighting, and focus spotlights. |
| **Manipulative Architecture (`src/components/academy/practice/manipulatives/`)** | 3 specialized manipulatives created (Balance Scale, Code Block, Fraction Bar). | Missing foundational early-learner manipulatives: Ten-Frames, Number Lines, Phoneme/Syllable tiles, Science phenomenon sliders, and Logic deduction boards. | Expand manipulative library with ten-frames, number lines, phoneme tiles, science simulators, and clue deduction cards. |
| **Instructional Flow** | Monolithic text cards with end-of-step text input prompt. | Young children are confronted with heavy reading blocks and keyboard input rather than visual animations and touch interactions. | Implement the 12-stage cognitive cycle (**WELCOME $\rightarrow$ HOOK $\rightarrow$ SHOW $\rightarrow$ EXPLAIN $\rightarrow$ INTERACT $\rightarrow$ THINK $\rightarrow$ TRY $\rightarrow$ FEEDBACK $\rightarrow$ PRACTICE $\rightarrow$ REINFORCE $\rightarrow$ CELEBRATE $\rightarrow$ REMEMBER**) adapted by grade band. |
| **Developmental Grade Scaling** | `GRADE_BAND_CONFIGS` define tokens (touch target size, max minutes). | The actual lesson rendering does not dynamically modify visual density, vocabulary simplicity, narration autostart, or choice count based on grade profile. | Connect `GradeBandConfig` directly into `LessonSceneRenderer` to enforce age-appropriate layouts, large touch targets ($\ge 64\text{px}$ for Pre-K), and audio autostart. |
| **Narration & Subtitles (`narrationDirector.ts`)** | Speech synthesis wrapper with listener event bus for `isSpeaking` and `charIndex`. | Does not synchronize word-by-word visual emphasis inside the lesson scene text. | Build `SynchronizedCaptionBar` and word-level token highlight during active voice playback. |
| **Micro-Questions & Mistakes** | Single submit button with simple pass/fail string output. | Does not provide gentle, non-punitive feedback or 4-tier scaffolding hints without answer leaks. | Integrate `MicroQuestionRenderer` with tiered scaffolding hints (`concept_reminder` $\rightarrow$ `specific_clue` $\rightarrow$ `partial_guidance` $\rightarrow$ `worked_example`). |
| **Demonstration Content** | Text-based sample lessons in `lessonsData.ts`. | Lacks high-fidelity, multimodal demonstration lessons across Pre-K Math, Phonics, Elementary Science, Grammar, Coding, Logic, Art, Music, and SEL. | Author 10 rich demonstration lesson datasets across all domains. |

---

### 3. Preservation & Compatibility Invariants

1. **Routing & URLs:** All existing routes (`/academy/lesson/:lessonId`, `/academy/practice/:practiceSetId`, `/academy/skill/:skillId`, `/academy/library`, `/academy/create`, `/academy/think`, `/academy/science`, `/academy/projects`) must remain fully functional.
2. **Mastery & Economy:** Economy rewards (`public.award_child_rewards`, XP, Stars) and the 4-factor mastery engine must continue to receive authoritative completion events.
3. **Flagship Game Bridges:** Maintain linkages to the 10 Canonical Flagship Games (`potion_scales`, `robopath`, `spellforge`, `ecosystem_sandbox`, `cosmic_constellation`, `invention_lab`, `mystery_detective`, `memory_museum`, `rhythm_spells`, `magic_machine`).
4. **Test Regression Suite:** All 56 existing test suites in `scripts/run_all_tests.ts` must pass 100%.

---

### 4. Conclusion & Readiness

The underlying system architecture (curriculum registry, mastery engine, guide director, narration service, and economy) is robust. Phase 6 will deliver the **cinematic child-first presentation layer and interactive scene engine** that elevates ORBis into a premier educational product.
