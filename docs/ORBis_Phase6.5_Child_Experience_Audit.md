# ORBis — Phase 6.5 Child Experience QA & Teaching Quality Audit
## Rigorous Educational UX & Pedagogical Audit of the Running Experience

---

### 1. Executive Summary

This audit evaluates the **actual running child-facing experience** of ORBis Academy (Phase 6 implementation) across desktop and touch viewports. While the technical foundation (57/57 tests passing, strict TypeScript clean, ESLint clean, and Vite production bundle building in 3.02s) is solid, this audit focuses strictly on the **quality of the experience through the eyes of a child learner**:

> *"If a 4-year-old child opens this lesson with zero parental explanation, does the child immediately understand what to look at, listen to, touch, and do — and does the friendly character make them eager to continue learning?"*

---

### 2. Lesson-by-Lesson Child Experience Audit

#### Lesson 1: Pre-K Math — *Counting Star Gems with Poly* (`/academy/lesson/lesson_prek_star_counting`)
- **First 3 Seconds:** The child sees Poly the Owl with a glowing cyan avatar aura and speech bubble, while hearing speech synthesis: *"Hoo-hoo! Look up into the night sky! Glowing star gems are falling..."*
- **Visual Demonstration & Interaction:** Scene 2 immediately introduces the tactile **Ten-Frame Manipulative**. The top row auto-groups into 5 slots. Tapping an empty slot triggers a satisfying `star_pop` sound and haptic pulse, filling a glowing star.
- **Micro-Question:** Scene 3 asks: *"How many stars are in a full top row?"* Choice buttons are large ($\ge 64\text{px}$ touch targets), with visual icons (⭐ 3 Stars, 🌟 5 Stars, ✨ 10 Stars).
- **Wrong Answer Handling:** Choosing "3 Stars" produces a gentle `mistake_soft` sound, orange border (no red failure screen), and Poly says: *"Almost! Let us look at the clue together."* Requesting a clue reveals: *"Count each star in the top row: 1, 2, 3, 4, 5!"* without prematurely leaking the option button.
- **Celebration:** Final step triggers a `victory_fanfare`, Poly bounces with a `celebrating` emotional state, and awards 25 XP and 2 Stars.
- **Child Friction Points Identified:**
  1. *P2:* In Scene 1 (Welcome Hook), there is no auto-spawning animated star falling from the sky; the child only sees Poly's speech bubble before clicking "Continue Adventure".
  2. *P3:* The top progress bar says "Adventure Step 1 of 4" — text that a 4-year-old cannot read. Visual stepping icons (e.g. 4 small glowing star dots) would be more intuitive.

---

#### Lesson 2: Kindergarten Phonics — *Runic Word Sounds with Lexi* (`/academy/lesson/lesson_k_runic_phonics`)
- **First 3 Seconds:** Lexi the Lorekeeper Fox greets with amber cosmic styling: *"Welcome, young explorer! To open the secret door, we must forge the ancient word CAT..."*
- **Visual Demonstration & Interaction:** Scene 2 presents the **Runic Phoneme Altar** with 3 letter slots (`_ _ _`) and a tray of rune buttons (`C`, `A`, `T`, `S`, `P`). Tapping each rune instantly synthesizes the phoneme pronunciation (`/k/`, `/æ/`, `/t/`) and snaps the letter into the slot with glowing amber feedback.
- **Micro-Question:** Asks for the middle vowel sound `/æ/` with hints linking to "apple".
- **Child Friction Points Identified:**
  1. *P1:* Letter sounds currently rely on browser speech synthesis. On devices with low-quality TTS voices, individual short vowels like `/æ/` can sound robotic.
  2. *P2:* When all 3 slots are filled, the altar plays `match_success`, but the "secret door" does not visually swing open with an animated partition.

---

#### Lesson 3: Grade 1 Math — *Frog Jumps on the Number Line with Poly* (`/academy/lesson/lesson_g1_number_line_jumps`)
- **First 3 Seconds:** Poly introduces Ribbit the Frog on a stone path.
- **Tactile Manipulative:** The **NumberLineManipulative** renders numbered stepping stones from 0 to 10 with an animated bouncing frog (🐸) sitting on Stone 6. Tapping `Jump Forward (+1)` propels Ribbit stone-by-stone to 10 with tactile card-flip sound cues.
- **Educational Flow:** Concrete Frog Jump $\rightarrow$ Visual Path Highlight $\rightarrow$ Symbolic Equation ($6 + 4 = 10$).
- **Child Friction Points Identified:**
  1. *P2:* The jump forward/back buttons are text-labeled ("Jump Forward (+1) ➔"). For early Grade 1 readers, an icon of a jumping frog with a glowing right arrow would enhance intuitive comprehension.

---

#### Lesson 4: Grade 2 Science — *Buoyancy & Floating Islands with Newton* (`/academy/lesson/lesson_g2_floating_islands`)
- **Visual Demonstration:** The water tank displays a floating wooden log (🪵) bobbing above the waterline and a sinking stone (🪨) resting at the seabed with clear color-coded density tags.
- **Pedagogical Cycle:** Phenomenon $\rightarrow$ Guide Explanation $\rightarrow$ Hypothesis Prediction (Hollow glass bottle).
- **Child Friction Points Identified:**
  1. *P1:* The visual demo in Scene 2 is static CSS layout rather than an interactive physics sandbox where the child can drop objects into the water tank to watch them float or sink before the question.

---

#### Lesson 5: Grade 4 Computer Science — *Robot Path Loops with BEEP-0* (`/academy/lesson/lesson_g4_robot_loops`)
- **Visual & Interaction:** BEEP-0 introduces loop efficiency. The **CodeBlockManipulative** provides visual AST command blocks (`LOOP_2X`, `FORWARD`, `TURN_RIGHT`) that can be added or removed from the program line.
- **Child Friction Points Identified:**
  1. *P2:* The command blocks show in a list, but there is no side-by-side animated 2D grid showing BEEP-0 executing the commands tile-by-tile in real time during the lesson scene (unlike the standalone Robo-Path flagship game).

---

#### Lesson 6: Grade 5 Critical Thinking — *Sherlock Clue Dossier* (`/academy/lesson/lesson_g5_clue_deduction`)
- **Interaction & Logic:** Sherlock presents 3 forensic clues. The **LogicDeductionManipulative** allows the child to click `[X]` on suspects to rule them out with opacity dimming, testing deductive constraints.
- **Child Quality:** Highly engaging detective narrative, age-appropriate reasoning, clear evidence elimination.

---

### 3. Detailed Teaching & Experience Dimension Audits

#### A. Character Teaching Presence & Aliveness
- **Strengths:** 
  - Guides react with distinct emotions (`curious` when posing mysteries, `guiding` during manipulatives, `encouraging` on mistakes, `celebrating` on victory).
  - Dialogue speech bubble synchronizes word-by-word highlighted text during speech synthesis.
  - Quick replay and pause/play audio controls are directly accessible.
- **Gaps to World-Class:**
  - Guide avatar is currently a 2D emoji inside a glowing cosmic circle rather than a full animated SVG/Lottie character with eye tracking or arm pointing toward the active manipulative.

#### B. Visual Teaching & Concrete-to-Abstract Progression
- **Pre-K:** Fully concrete with star counters and ten-frames ($100\%$ visual/manipulative).
- **Kindergarten:** Concrete phoneme runes $\rightarrow$ word formation ($100\%$ auditory/visual).
- **Grade 1:** Concrete frog stepping stones $\rightarrow$ symbolic addition ($6 + 4 = 10$).
- **Grade 2–5:** Science simulations, loop algorithms, and deductive matrices.

#### C. Narration & Caption Quality
- Speech synthesis pitch and rate adapt by character (e.g. Poly $1.1\times$ pitch, Newton $1.2\times$, BEEP-0 $0.9\times$).
- Narration auto-plays on scene entrance.
- Captions are non-intrusive and highlighted word-by-word.

#### D. Micro-Questions & Mistake Scaffolding
- **Gentle Tone:** Zero failure buzzers or harsh red screens.
- **4-Tier Scaffolding:** Concept Reminder $\rightarrow$ Visual Clue $\rightarrow$ Specific Guidance $\rightarrow$ Worked Method.
- **Anti-Leak Defense Verified:** Tier 1 never reveals the exact option button.

---

### 4. Comparison: Premier Industry Principles vs ORBis Implementation

| Premier Principle (e.g. Khan Kids Benchmark) | ORBis Current Implementation | Status & Quality Assessment |
| :--- | :--- | :---: |
| **Character-Guided Companionship** | 10 Guides with reactive emotions, voice modulation, and live speech bubbles. | 🟡 **Strong Foundation** (Needs animated SVG gestures/pointing) |
| **Demonstration Before Questioning** | `SHOW` scene precedes `TRY` and `MICRO_QUESTION` across all lessons. | 🟢 **Fully Implemented** |
| **Tactile Visual Manipulatives** | Ten-Frames, Number Lines, Phoneme Altars, Pan Balances, Fraction Bars, Code Blocks, Clue Dossiers. | 🟢 **World-Class Pedagogical Depth** |
| **Non-Punitive Feedback** | Gentle chime, amber borders, encouraging guide voice, 4-tier scaffolding drawer. | 🟢 **Fully Implemented** |
| **Developmental Adaptation** | Pre-K large targets ($\ge 64\text{px}$), high narration, minimal text $\leftrightarrow$ Grade 5 multi-step logic. | 🟢 **Fully Implemented** |
| **Distraction-Free Focus** | Cinematic player with dark radial gradients, high contrast, clean progress trails. | 🟢 **Fully Implemented** |

---

### 5. Severity Matrix (Classified P0–P3)

| Priority | Component | Issue Description | Why It Matters for Children | Recommended Solution |
| :---: | :--- | :--- | :--- | :--- |
| **P1** | `VisualDemoRenderer.tsx` | Science floating/sinking demo is visual CSS rather than an interactive drop-in water tank. | Children learn physical science best when they can physically drop the pebble vs log into water. | Add interactive drag-and-drop into water tank before prediction question. |
| **P1** | `GuideTeachingLayer.tsx` | Guide is an expressive emoji circle rather than an animated character with physical pointing gestures. | A character physically pointing its wing/paw at the ten-frame dramatically increases gaze focus for 3-5 year olds. | Introduce vector character sprites with pointing and waving keyframes. |
| **P2** | `NumberLineManipulative.tsx` | Jump buttons rely on text ("Jump Forward (+1)") rather than intuitive visual arrows with bouncing frogs. | Early Grade 1 learners may hesitate reading text buttons. | Add bold visual jump arrow icons with frog footprints. |
| **P2** | `CinematicLessonPlayer.tsx` | Step progress is displayed as text ("Step 1 of 4") alongside progress bar. | Pre-K children cannot read numbers or step counters. | Replace text with glowing star stepping stones. |
| **P3** | `PhonemeTileManipulative.tsx` | Letter sound synthesis uses browser TTS short vowels. | Can sound slightly robotic on older devices. | Pre-record or synthesize clear phonemic WAV audio for core vowel sounds. |

---

### 6. Final Verdict & Recommendation

$$\mathbf{VERDICT:\ B\ —\ Technically\ Complete\ but\ Requires\ Experience\ Polish}$$

**Justification:** 
The underlying pedagogical engine, declarative scene schema, 10 guide personalities, tactile manipulatives, 4-tier progressive scaffolding, anti-leak defenses, and grade band scaling are **fully functional, verified, and integrated**. 

To reach absolute world-class child immersion prior to Phase 7, the recommended polish items in the Severity Matrix (interactive drop-in physics demo, visual jump arrows, star progress stepping stones, and enhanced character pointing gestures) should be implemented.
