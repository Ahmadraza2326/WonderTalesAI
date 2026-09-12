# ORBis Phase 4A — Premium Cinematic Lesson Experience Direction

> **Status:** APPROVED DESIGN DIRECTION  
> **Target Release:** ORBis Phase 4A — Cinematic Lesson Player Experience Upgrade  
> **Design Authority:** Stitch Project `4449806016687673397` (Direction C: *Living Learning Universe*) & Mobbin Child-First Interaction Benchmark Library  
> **Document Purpose:** Bridge the Phase 4A audit findings into an authoritative, world-class, premium design specification for the ORBis Lesson Player, ensuring an internationally competitive children's learning experience that transcends generic educational dashboards.

---

## 1. Premium Experience Vision

The ORBis Cinematic Lesson Player must not feel like a digital textbook or a sequence of instructional web pages. It must feel like **an interactive cosmic theater where the child is an active co-creator on an adventure**.

When a child enters a lesson:
1. **The Universe Embraces Them:** The screen deepens into a warm celestial realm (`#020617` $\to$ `#0f172a`), with domain-specific stardust and glowing cosmic nebulae tailored to the subject.
2. **The Companion Is Alive:** The realm mentor (*Poly, Newton, Lexi, BEEP-0, etc.*) stands physically on the stage as a living actor with procedural breathing, eye contact, and genuine emotional expressions.
3. **The Concept Is Tangible (Bruner Enactive-First):** Rather than reading abstract definitions, the child immediately touches, drags, groups, and snaps physical objects on a radiant [`InteractionSurface`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/InteractionSurface.tsx).
4. **The Guidance Is Multi-Sensory:** Spoken narration, word-by-word starlight subtitle highlights, $-12\text{dB}$ background music ducking, and pentatonic harmonic audio cues work in seamless synchronized harmony.
5. **The Atmosphere Is 100% Bespoke:** Zero generic presentation Unicode emojis. Every single asset, indicator, button, and mascot is rendered with handcrafted SVG vectors and responsive physics.

---

## 2. Current Experience Problems (Gap Analysis)

| Area | Current Reality | Why It Feels Ordinary | Required Premium Evolution |
| :--- | :--- | :--- | :--- |
| **Stage Container** | Generic container with raw text *"← Exit Lesson"* button. | Feels like a standard web article or form. | Unified cosmic stage with sticky [`LessonProgressRail`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/LessonProgressRail.tsx) and ambient canvas particles. |
| **Progress Tracking** | Custom, unpolished star-dot dots and raw emojis (`✨`, `⭐`, `⚪`). | Inconsistent and amateurish visual presentation. | Standardized 5-scene progress rail with glowing milestone capsules and zero emojis. |
| **Atmospheric Backdrop** | `RealmStageBackdrop.tsx` renders static emoji spans (`🌌`, `🍃`, `🔮`). | Break immersion with cheap unicode characters. | Domain-tuned canvas [`ParticleField.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/ParticleField.tsx) with glowing radial nebulae. |
| **Character Staging** | Mascot sits in an isolated card box with raw emoji audio controls (`🔊`, `⏸️`). | Mascot feels like a decorative graphic sticker. | Mascot stands as an active actor on stage with joint visual attention and animated audio controls. |
| **Scene Transitions** | Instant state changes (`currentSceneIndex + 1`) without easing. | Feels like abrupt HTML page jumps. | Smooth 320ms cross-dissolve with spring easing and subtle realm aura pulse. |
| **Comprehension Check** | `MicroQuestionRenderer.tsx` options look like flat web radio buttons. | Low tactile affordance for children. | Elevated [`GlassPanel`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/GlassPanel.tsx) option tiles with tactile spring press, audio chords, and 4-tier hint drawer. |
| **Action Affordances** | Unstyled raw buttons with emoji strings (`Continue Adventure ➔`). | Inconsistent hit areas and visual weight. | Tactile [`MagicalButton`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/MagicalButton.tsx) with spring physics and $\ge 48\text{px}$ touch targets. |

---

## 3. Target Child Experience

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE CHILD'S EMOTIONAL JOURNEY                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. INVITATION & WONDER:                                                     │
│    Curtain rises on deep space. Poly welcomes the child warmly with         │
│    spoken voice and glowing subtitle stardust.                              │
│                                                                             │
│ 2. FOCUSED ILLUMINATION (Visual Demo):                                      │
│    Poly points right; a glowing geometric array or water cycle shines.     │
│    Music ducks gently so Poly's voice is crystal clear.                     │
│                                                                             │
│ 3. HANDS-ON EMPOWERMENT (Manipulative):                                     │
│    "Now your turn!" Star gems snap into slots with pentatonic chimes.       │
│    The child feels the tactile spring and haptic pulse.                     │
│                                                                             │
│ 4. SAFE CURIOSITY (Micro-Question):                                         │
│    No stress, no red "X". Poly tilts head thoughtfully. If stuck, clues     │
│    reveal gently tier-by-tier until the "Aha!" spark occurs.                │
│                                                                             │
│ 5. GLORIOUS CELEBRATION (Mastery):                                          │
│    Poly leaps with joy; fanfare chords ring out; a 96px SkillCrystal       │
│    glows with earned stars and XP.                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Stitch Design Requirements (Direction C: Living Learning Universe)

1. **The Universe Stage Canvas:**
   - Universal background: `radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 55%, #020617 100%)`.
   - Realm-specific atmospheric accents:
     - *Mathematics Citadel:* Celestial Cyan `#38bdf8` / Star Stardust.
     - *Science Biome:* Bioluminescent Emerald `#10b981` / Aurora Drift.
     - *Literacy & Story:* Royal Amethyst `#8b5cf6` / Rune Shimmer.
     - *Computer Science:* Clockwork Cyan `#06b6d4` / Circuit Energy.
     - *Logic & Puzzles:* Amber Solar `#f59e0b` / Prism Glow.
2. **Glassmorphic Surface Hierarchy:**
   - Header: Floating frosted blur `rgba(15, 23, 42, 0.85)` with `backdropFilter: 'blur(16px)'`.
   - Interaction Stage: Elevated hero container `rgba(15, 23, 42, 0.78)` with subtle inner glow and `border: '1px solid rgba(255, 255, 255, 0.12)'`.
   - Speech Capsule: Rounded bubble with dynamic realm accent border (`border: '1.5px solid ${accentColor}70'`).
3. **Strict Zero-Emoji Rule:**
   - 100% of icons must render via [`AnimatedIcon.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/AnimatedIcon.tsx), [`GuideCharacterSvg.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/guide/GuideCharacterSvg.tsx), or bespoke SVG vectors. Zero raw Unicode emojis permitted in child-facing UI.

---

## 5. Mobbin Interaction Requirements

1. **Joint Visual Attention:**
   - When instructional demonstrations or manipulatives are active, the guide character's eye pupils orient towards the interaction zone (`gaze="pointing_right"` or computed `gazeTarget`).
2. **Enactive-First Tactile Feedback:**
   - Every touch or drag on a manipulative triggers immediate visual spring reaction, sound feedback (`card_flip`, `match_success`), and physical haptics (`HapticsService.light()` or `medium()`).
3. **4-Tier Non-Intrusive Scaffolding Net:**
   - **Tier 0:** Attentive character presence; zero unsolicited interruption.
   - **Tier 1:** Conceptual hint via companion voice dialogue.
   - **Tier 2:** Specific clue highlighting the relevant manipulative element.
   - **Tier 3:** Partial strategy and animated ghost demonstration.
   - **Tier 4:** Full worked method demonstration without punitive score loss.
4. **Thumb-Friendly Navigation:**
   - Primary advance controls are anchored to the bottom right / bottom center, easily accessible by a child holding a tablet or mobile device with either hand.

---

## 6. Cinematic Scene Experience (5-Scene Bruner EIS)

```
Scene 1: Hook ───────► Scene 2: Visual ──────► Scene 3: Action ──────► Scene 4: Check ──────► Scene 5: Reward
(Lore & Mission)     (Iconic Model)         (Enactive Touch)       (Symbolic Quiz)        (Crystal Star)
```

- **Scene 1 (`welcome_hook`):**
  - Character Actor enters stage with energetic/curious pose.
  - Spoken dialogue sets the quest context; words highlight in synchronized starlight gold.
- **Scene 2 (`visual_demonstration`):**
  - Animated SVG visual model animates into view.
  - Companion gestures towards the model while explaining the concept.
- **Scene 3 (`guided_interaction`):**
  - Interactive manipulative stage activates (`InteractionSurface`).
  - Child interacts until target condition is satisfied.
  - Advance button illuminates with glowing pulse upon goal completion.
- **Scene 4 (`micro_question`):**
  - Contextual comprehension challenge with 2 to 4 tactile option cards.
  - Incorrect choices trigger gentle guide encouragement; correct choices trigger victory fanfare.
- **Scene 5 (`reflection_summary`):**
  - Companion congratulates the learner with a celebration pose.
  - Rewards mint into the child's economy ledger, opening the victory celebration modal.

---

## 7. Guide Actor Experience (`GuideCharacterSvg.tsx` & `GuideTeachingLayer.tsx`)

1. **Actor Pose Choreography:**
   - *Scene Entrance:* `curious` or `excited`.
   - *Explaining Concept:* `teaching` or `guiding`.
   - *Child Interacting:* `waiting` or `thinking`.
   - *Guiding on Mistake:* `encouraging` or `curious` (never angry or disappointed).
   - *Success / Milestone:* `celebrating` or `happy`.
2. **Lip-Sync & Subtitle Highlights:**
   - Procedural mouth animation moves dynamically during speech.
   - Speech bubble highlights current spoken words in `#38bdf8` with subtle spring scale (`scale(1.08)`).
3. **Audio Replay & Mute Accessibility:**
   - Replay voice button with `AnimatedIcon kind="volume_on"` and clear `aria-label="Replay guide voice"`.
   - Mute toggle with `AnimatedIcon kind="volume_off"`.

---

## 8. Audio/Visual Synchronization

```
                                  ┌───────────────────────────┐
                                  │   narrationDirector.ts    │
                                  └─────────────┬─────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
     ┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
     │ -12dB Music Ducking   │      │ Word-by-Word Subtitle │      │ Guide Character Mouth │
     │ (sfxService.duckMusic)│      │ Highlight Events      │      │ Procedural Lip-Sync   │
     └───────────────────────┘      └───────────────────────┘      └───────────────────────┘
```

- **Dynamic Ducking Envelope:** When the guide begins speaking, background music smoothly fades down by $-12\text{dB}$ within 150ms. When speech ends, music restores to normal volume over 300ms.
- **Harmonic SFX Palette:**
  - Button Click: `sfxService.play('button_click')`
  - Step Card Flip: `sfxService.play('card_flip')`
  - Correct Manipulative Match: `sfxService.play('match_success')`
  - Soft Guiding Mistake: `sfxService.play('mistake_soft')`
  - Stage Mastery Fanfare: `sfxService.play('victory_fanfare')`

---

## 9. Touch & Mobile Experience (320px–1280px)

- **320px & 375px (Compact Mobile):**
  - Mascot and speech bubble stack vertically (`flexDirection: 'column'` or `wrap`), with mascot scaling to 64px to preserve full text readability.
  - Manipulatives auto-scale with responsive aspect ratios.
  - Sticky bottom advance bar ensures $\ge 48\text{px}$ thumb touch target without blocking stage content.
- **768px (Tablet):**
  - Mascot stands alongside the speech bubble at 82px–96px.
  - Manipulative surface centers with generous 24px padding.
- **1280px (Desktop):**
  - Stage max-width constrained to 860px for optimal cognitive focus.
  - Full keyboard navigation (`Tab`, `Enter`, `Space`) across all interactive elements.

---

## 10. Existing Component Reuse Map

| Subsystem | Existing Component | Role in Upgraded Lesson Player |
| :--- | :--- | :--- |
| **Top Navigation** | [`LessonProgressRail.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/LessonProgressRail.tsx) | Primary sticky header: 5-scene progress, mute toggle, exit button. |
| **Surfaces** | [`GlassPanel.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/GlassPanel.tsx) | Elevation containers for stage, dialogues, and quiz cards. |
| **Buttons & Controls**| [`MagicalButton.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/MagicalButton.tsx) | Tactile advance buttons with spring feedback and sound cues. |
| **Iconography** | [`AnimatedIcon.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/AnimatedIcon.tsx) | 100% bespoke SVG iconography replacing all emojis. |
| **Atmosphere** | [`ParticleField.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/ParticleField.tsx) | Canvas-based stardust and atmospheric floating particles. |
| **Workspace** | [`InteractionSurface.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/InteractionSurface.tsx) | Tactile staging surface for all 12 manipulatives. |
| **Character Actor** | [`GuideCharacterSvg.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/guide/GuideCharacterSvg.tsx) | 10 vector mascots with 12 actor poses and gaze tracking. |
| **Celebration** | [`VictoryCelebrationModal.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/experience/VictoryCelebrationModal.tsx) | Full-screen celebration modal with earned XP and star chips. |
| **Audio Director** | [`narrationDirector.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/audio/narrationDirector.ts) & [`sfxService.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/audio/sfxService.ts) | Vocal synthesis, music ducking, and sound effects synthesizer. |
| **Curriculum Data** | [`cinematicLessonsData.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/academy/curriculum/cinematicLessonsData.ts) | 50 canonical 5-scene lesson definitions. |

---

## 11. New Component Requirements

**Zero bulky new architectures required.** The existing design primitives are comprehensive and battle-tested.  
The only architectural enhancement is a lightweight composite wrapper:
- **`CinematicStageFrame.tsx` (or integrated layout in `CinematicLessonPlayer.tsx`):** Unifies the sticky `LessonProgressRail`, ambient stage backdrop, character actor layer, active scene viewport, and sticky bottom navigation bar into one seamless viewport container.

---

## 12. Screen-by-Screen Design Specification

### Screen 1: Welcome & Audio Primer Gate
- **Background:** Deep space canvas with subject stardust particles.
- **Center Hero Card:** Elevated `GlassPanel` displaying lesson realm badge, grade band chip, estimated adventure time, and animated character greeting.
- **Primary CTA:** Pulsing `MagicalButton size="lg"` (*"Begin Adventure"*) that primes the Web Audio context and starts Scene 1 narration.

### Screen 2: Scene 1 (The Narrative Hook)
- **Top Rail:** `LessonProgressRail` showing Scene 1 active (glowing cyan pill).
- **Actor Stage:** Realm mascot in `excited` pose speaking narrative dialogue with live starlight subtitle highlights.
- **Bottom Bar:** `MagicalButton` (*"Continue Adventure ➔"*).

### Screen 3: Scene 2 (Visual Model Demonstration)
- **Top Rail:** Step 2 of 5 active.
- **Demonstration Stage:** Animated SVG visual model (e.g. 3x4 Starforge Array or Fraction Bar) with clean legend and mathematical breakdown.
- **Actor Stage:** Companion in `teaching` pose with `gaze="pointing_right"`.

### Screen 4: Scene 3 (Direct Tactile Manipulative)
- **Top Rail:** Step 3 of 5 active.
- **Manipulative Stage:** Tactile `InteractionSurface` hosting the manipulative (e.g. `TenFrameManipulative`, `StarArrayManipulative`).
- **Feedback:** Snapping objects trigger pentatonic chords; target goal completion illuminates advance button.

### Screen 5: Scene 4 (Micro-Question Check)
- **Top Rail:** Step 4 of 5 active.
- **Comprehension Challenge:** 2 to 4 tactile `GlassPanel` option cards with audio prompt button and 4-tier progressive hint disclosure.

### Screen 6: Scene 5 (Reflection & Victory)
- **Actor Stage:** Mascot in `celebrating` pose with victory fanfare audio.
- **Victory Modal:** `VictoryCelebrationModal` awards +30 XP, +5 Stars, and records progress in `masteryService.ts`.

---

## 13. Phase 4A Implementation Sequence

The implementation is strictly organized into 7 focused, sequential milestones:

### **Milestone 4A.1 — Premium Lesson Stage Foundation**
- **Objective:** Upgrade the overall container, sticky progress rail, and canvas stage background.
- **Files/Components:** [`src/pages/academy/LessonPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/LessonPage.tsx), [`src/components/academy/lesson/cinematic/RealmStageBackdrop.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/RealmStageBackdrop.tsx), and [`src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx).
- **What comes from Stitch:** Direction C deep-space tokens, frosted glass backdrop blur, and realm accent colors.
- **What Antigravity implements:** Integrate [`LessonProgressRail.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/LessonProgressRail.tsx) as the sticky header; replace emoji particles with canvas [`ParticleField.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/ui/design/ParticleField.tsx); sanitize header emojis.
- **Protected Invariants:** Lesson IDs, skill routing, and auth contexts remain untouched.

### **Milestone 4A.2 — Cinematic Scene System & Welcome Gate**
- **Objective:** Modernize the initial audio primer gate and scene transitions with zero emojis.
- **Files/Components:** [`src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx) and [`src/components/academy/lesson/LessonViewer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/LessonViewer.tsx).
- **What comes from Stitch:** Hero `GlassPanel` card styling and `MagicalButton` cosmic variants.
- **What Antigravity implements:** Replace raw emojis (`✨`, `🚀`, `⭐`, `🤖`) with `AnimatedIcon` vectors; polish the welcoming audio primer card; modernize fallback block reader.
- **Protected Invariants:** Audio priming protocol and lesson block validation logic preserved.

### **Milestone 4A.3 — Guide Actor + Multimodal Teaching**
- **Objective:** Elevate the character companion layer with responsive mobile wrapping and vector controls.
- **Files/Components:** [`src/components/academy/lesson/cinematic/GuideTeachingLayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/GuideTeachingLayer.tsx).
- **What comes from Stitch:** Frosted speech capsule styling and realm accent borders.
- **What Antigravity implements:** Replace raw emoji buttons (`🔊`, `⏸️`) with `AnimatedIcon`; implement responsive wrapping for 320px–375px screens; ensure actor poses match scene types.
- **Protected Invariants:** `narrationDirector` subscription lifecycle and word boundary events preserved.

### **Milestone 4A.4 — Audio + Feedback Experience**
- **Objective:** Fine-tune audio ducking, harmonic chords, and visual feedback across scene states.
- **Files/Components:** [`src/components/academy/lesson/cinematic/LessonSceneRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/LessonSceneRenderer.tsx), [`src/components/academy/lesson/cinematic/VisualDemoRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/VisualDemoRenderer.tsx), and [`src/components/academy/lesson/cinematic/MicroQuestionRenderer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/MicroQuestionRenderer.tsx).
- **What comes from Stitch:** Tactile quiz cards, clue bulb vectors, and stardust particle bursts.
- **What Antigravity implements:** Polish `MicroQuestionRenderer` with `GlassPanel`, sanitize hint drawer icons, verify `VisualDemoRenderer` displays cleanly.
- **Protected Invariants:** Manipulative goal verification logic and 4-tier hint structures preserved.

### **Milestone 4A.5 — Lesson Navigation + Completion**
- **Objective:** Unify bottom advance button affordances and guarantee idempotent completion.
- **Files/Components:** [`src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/academy/lesson/cinematic/CinematicLessonPlayer.tsx) and [`src/pages/academy/LessonPage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/pages/academy/LessonPage.tsx).
- **What comes from Stitch:** Cosmic `MagicalButton` styles and victory fanfare badge.
- **What Antigravity implements:** Standardize sticky bottom advance bar; connect `onComplete` to `VictoryCelebrationModal`; verify duplicate submission prevention.
- **Protected Invariants:** `masteryService.recordLessonCompletion` and `useActivityEconomy` reward minting logic preserved.

### **Milestone 4A.6 — Responsive + Accessibility Polish**
- **Objective:** Guarantee flawless presentation across all viewports (320px, 375px, 430px, 768px, 1280px) and WCAG 2.1 AA/AAA compliance.
- **Files/Components:** All Phase 4A lesson player files and `tokens.css`.
- **What comes from Stitch:** Touch target tokens ($\ge 48\text{px}$) and contrast scales.
- **What Antigravity implements:** Verify zero horizontal overflow, fluid typography with `clamp()`, keyboard focus rings, and `prefers-reduced-motion` safety.
- **Protected Invariants:** All existing accessibility semantics and responsive layout containers preserved.

### **Milestone 4A.7 — Final Visual + Regression QA**
- **Objective:** Verify TypeScript compilation, production build, dedicated Phase 4A test suite, and 66+ master regression suites.
- **Files/Components:** `scripts/test_cinematic_lesson_player.tsx` (new test suite), `scripts/run_all_tests.ts`.
- **What Antigravity implements:** Write comprehensive integration test suite covering all 5 scenes, audio ducking, guide poses, manipulative goal completion, and rewards.
- **Protected Invariants:** Zero errors in `tsc -b && vite build`. 100% pass across all regression suites.
