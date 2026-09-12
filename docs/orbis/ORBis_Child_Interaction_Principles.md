# ORBis Child-First Interaction Principles & UX Law

---

## 1. The Supreme Child Interaction Axiom

> **"If a 6-year-old cannot understand what to do within 3 seconds without reading instructions, the design has failed."**

Children do not read user manuals, multi-step tutorials, or paragraphs of instructional text. They learn through immediate physical cause-and-effect, visual hierarchy, living character gaze, and joyful multisensory feedback.

---

## 2. The 6 Golden Interaction Invariants

```
┌─────────────────────────────────────────────────────────────┐
│             THE 6 GOLDEN CHILD-FIRST INVARIANTS             │
├──────────────────────────────┬──────────────────────────────┤
│ 1. SHOW > TELL               │ 2. DO > READ                 │
│    Visual & motion modeling  │    Direct manipulation over  │
│    over static descriptions  │    reading text passages     │
├──────────────────────────────┼──────────────────────────────┤
│ 3. DISCOVER > MEMORIZE       │ 4. GUIDE > INSTRUCT          │
│    Experiencing causality    │    Companion co-learner over │
│    over rote symbol storage  │    authoritarian examiner    │
├──────────────────────────────┼──────────────────────────────┤
│ 5. PLAY > FORM-FILLING       │ 6. FEEDBACK > CORRECTION     │
│    Tangible toy mechanics    │    Sensory reaction over     │
│    over multiple-choice rows │    red "X" error messages    │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 3. The 5 Questions Every Child Interaction Must Answer

Every screen, manipulative, and activity must immediately resolve these 5 questions purely through visual affordances, character posture, and audio cues:

1. **WHAT DO I DO?**
   - *Visual Cue:* The active element pulses gently with an energy aura or displays an animated ghost-hand demonstration.
   - *Character Cue:* The guide looks directly at the interactive zone and gestures with an open palm.
   - *Auditory Cue:* The guide asks an engaging curiosity question (*"Can you help Poly arrange these stars into 3 equal rows?"*).

2. **WHY AM I DOING IT?**
   - *Contextual Meaning:* The action is embedded in a clear, relatable narrative or game goal (e.g., charging the spaceship battery, balancing the potion scale, unlocking the dragon's crystal).

3. **WHAT HAPPENS WHEN I DO IT?**
   - *Immediate Causality:* The moment the child touches or drags an item, it responds instantly with sound, elevation, and tactile feedback. Dropping an item in a slot triggers a mechanical lock-in sound and particle shimmer.

4. **WHAT DID I LEARN?**
   - *Conceptual Synthesis:* The equation or rule emerges directly from the completed action. As 3 rows of 4 stars click into place, glowing text reads: `3 rows of 4 = 12 stars! 3 × 4 = 12`.

5. **WHAT CAN I TRY NEXT?**
   - *Autonomous Next Step:* The character celebrates, opens a celebratory portal, and points to the next adventure node or invites the child to experiment in the freeform creative studio.

---

## 4. Tactile Affordances & Physical Mental Models

### 4.1 Magnetic Drop Zones & Snap Physics
- Interactive slots must exert a subtle magnetic attraction when a draggable element is within 40px of the target center.
- Upon release within the zone, the element snaps into place using a dampened spring animation ($\text{duration} = 240\text{ms}$, damping ratio $\zeta = 0.75$).
- Releasing an item outside valid zones must never trigger an error sound; the item smoothly glides back to its origin tray with a soft rubber-band arc.

### 4.2 Minimum Touch Target Bounds
- **Pre-K & Kindergarten (Ages 3–5):** Minimum interactive touch bounds $\ge 64\text{px} \times 64\text{px}$ with minimum 16px spatial separation.
- **Grades 1–3 (Ages 6–8):** Minimum touch bounds $\ge 56\text{px} \times 56\text{px}$.
- **Grades 4–6 (Ages 9–12):** Minimum touch bounds $\ge 48\text{px} \times 48\text{px}$.

---

## 5. Emotional Safety & Failure Normalization

1. **Zero Punitive Feedback:**
   - No red "X" marks, no harsh failure buzzers, no negative point deductions, and no character disappointment expressions.
2. **Curiosity Framing:**
   - When a child places an unexpected item into a machine, the system produces a comedic, gentle reaction (e.g., a cartoon puff of purple smoke, a funny wobble, a companion scratching their chin: *"Hmm, that gave us 10 stars instead of 12! Let's see what happens if we add one more star to each row!"*).
3. **The 3-Attempt Adaptive Ceiling:**
   - If a child hesitates or makes 2 consecutive incorrect attempts, the system automatically activates Tier 2 scaffolding (ghost trail demonstration) without displaying an alert or marking the lesson as "failed."

---

## 6. Sensory Budget & Cognitive Load Guardrails

- **Maximum Simultaneous Animated Elements:** No more than 3 distinct motion focal points on screen at any time.
- **Background Restraint:** Background cosmic starfields and nebula effects must remain subtle (opacity $\le 0.4$, blur $\ge 20\text{px}$) to keep 100% of the child's visual attention focused on the foreground learning stage.
- **Audio Clutter Prevention:** Background ambient music must immediately duck by $-12\text{dB}$ whenever character dialogue or phonics sound effects are active.
