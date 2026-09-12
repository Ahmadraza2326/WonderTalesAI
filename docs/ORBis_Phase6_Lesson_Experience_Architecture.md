# ORBis — Phase 6 Master Architecture
## Cinematic Guided Learning Experience Architecture

---

### 1. Architectural Philosophy

ORBis Lesson Experience transforms passive text consumption into an **interactive, guided learning conversation**. 

```
                                    ┌────────────────────────────────┐
                                    │      ORBIS LEARNING SCENE      │
                                    └───────────────┬────────────────┘
                                                    │
             ┌──────────────────────────────────────┼──────────────────────────────────────┐
             │                                      │                                      │
             ▼                                      ▼                                      ▼
┌─────────────────────────┐            ┌─────────────────────────┐            ┌─────────────────────────┐
│   GUIDE TEACHING LAYER  │            │  VISUAL DEMO & OBJECTS  │            │  TACTILE MANIPULATIVE   │
│  - Active Character     │            │  - Animated Models      │            │  - Ten-Frames / Counters│
│  - Reactive Expressions │            │  - Spatial Transforms   │            │  - Number Lines         │
│  - Synchronized Speech  │            │  - Visual Comparisons   │            │  - Phoneme Runes        │
│  - Focus Spotlights     │            │  - Phenomena Simulators │            │  - Pan Balances / Code  │
└────────────┬────────────┘            └────────────┬────────────┘            └────────────┬────────────┘
             │                                      │                                      │
             └──────────────────────────────────────┼──────────────────────────────────────┘
                                                    │
                                                    ▼
                                       ┌─────────────────────────┐
                                       │   MICRO-QUESTION CHECK  │
                                       │  - Natural In-Flow Qs   │
                                       │  - Non-Punitive Feedback│
                                       │  - 4-Tier Scaffolding   │
                                       │  - Celebration Burst    │
                                       └─────────────────────────┘
```

---

### 2. Universal Lesson Scene Data Model

Every lesson is authored as a sequential array of declarative `CinematicLessonScene` objects:

```typescript
export type SceneType =
  | 'welcome_hook'           // Narrative context & guide welcome
  | 'visual_demonstration'  // Animated visual model with guided explanation
  | 'guided_interaction'     // Hands-on manipulative with guide instructions
  | 'micro_question'         // Rapid comprehension check with tiered hints
  | 'independent_try'        // Problem solving with manipulative
  | 'reflection_summary'     // Key concept review & celebration

export interface CinematicLessonScene {
  id: string
  type: SceneType
  title: string
  guideId: GuideId
  guideEmotion: GuideEmotion
  guideDialogue: string
  focusTargetId?: string
  visualDemo?: {
    kind: 'ten_frame' | 'number_line' | 'fraction_bar' | 'balance_scale' | 'phoneme_tile' | 'code_sequence' | 'ecosystem' | 'custom_illustration'
    props: Record<string, unknown>
  }
  manipulative?: {
    kind: 'ten_frame' | 'number_line' | 'fraction_bar' | 'balance_scale' | 'phoneme_builder' | 'code_blocks' | 'logic_clues'
    config: Record<string, unknown>
    expectedState?: Record<string, unknown>
  }
  microQuestion?: {
    prompt: string
    options?: Array<{ id: string; label: string; icon?: string; isCorrect: boolean }>
    expectedValue?: string | number
    hints: [string, string, string, string] // 4-tier progressive scaffolding
    explanation: string
  }
  soundCue?: string
  autoAdvanceDelayMs?: number
}
```

---

### 3. Guide Teaching & Dialogue State Machine

The guide companion shifts across 6 expressive states:
1. `neutral`: Resting attentive pose.
2. `curious`: Tilts head when introducing a mystery or story hook.
3. `thinking`: Ponders alongside the child during challenging micro-questions.
4. `guiding`: Points directly to the active manipulative or visual transformation.
5. `encouraging`: Offers compassionate, gentle scaffolding when a mistake occurs.
6. `celebrating`: Radiates particles and bounces upon step mastery.

---

### 4. Interactive Manipulatives Catalog

| Manipulative Component | Supported Domains | Key Interactions |
| :--- | :--- | :--- |
| **`TenFrameManipulative`** | Early Math, Counting, Addition to 10 | Tapping counters, filling rows of 5, instant subitizing visualization. |
| **`NumberLineManipulative`** | Grade 1–3 Math, Jump Operations | Stepping stone jumps forward (+), backward (-), landing highlights. |
| **`PhonemeTileManipulative`** | Phonics, Reading, Morphemes | Snapping consonant-vowel-consonant tiles, blending sound triggers. |
| **`FractionManipulative`** | Grade 3–5 Math, Fractions | Dividing bars into equal slices, coloring fractional segments ($1/2, 1/3, 1/4$). |
| **`BalanceScaleManipulative`** | Math & Physical Science, Mass | Placing weights and gem crystals onto pans with physics balance calculation. |
| **`CodeBlockManipulative`** | Computer Science & Logic | Dragging/clicking AST command blocks (Forward, Turn, Loop) and executing robot trace. |
| **`LogicDeductionManipulative`** | Critical Thinking & Forensic Logic | Flipping clue cards, eliminating suspects, testing deductive constraints. |

---

### 5. Micro-Question & Mistake Architecture

Mistakes are treated as developmental discoveries:
- **No failure buzzers or red alerts.**
- **Warm audio cues:** Soft chime (`mistake_soft`) followed by encouraging guide speech.
- **Progressive Scaffolding (4 Tiers):**
  1. *Tier 1 (Concept Reminder):* "Remember, the top row of a ten-frame always holds 5!"
  2. *Tier 2 (Specific Clue):* "Look at how many empty circles are left in the bottom row."
  3. *Tier 3 (Partial Guidance):* "We have 7 stars and need 3 more to reach 10."
  4. *Tier 4 (Worked Method):* "Count with me: 8, 9, 10! That is 3 steps."

---

### 6. Developmental Adaptation Matrix

| Grade Band | Max Session | Narration Mode | Visual Density | Touch Target | Primary Pedagogical Style |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Pre-K / Nursery** | 5 min | Auto-Play (Mandatory) | Minimal (1 focal object) | $\ge 64\text{px}$ | Tactile object tapping, sound matching, joyful discovery. |
| **Kindergarten** | 8 min | Auto-Play (Mandatory) | Focused (Large tiles) | $\ge 56\text{px}$ | Visual phonics, ten-frame counting, story prompts. |
| **Grade 1–2** | 12 min | Auto-Play (Default on) | Standard | $\ge 48\text{px}$ | Number line jumps, sentence building, visual coding. |
| **Grade 3–5** | 18 min | Supportive / On-Demand | Rich | $\ge 44\text{px}$ | Fraction partitioning, pan balance equations, multi-step logic. |

---

### 7. Extensible Authoring Registry

The system provides `CinematicLessonRegistry` which compiles declarative schemas into playable scenes at runtime, allowing educators and creators to author hundreds of lessons across all 10 academic domains without touching React rendering code.
