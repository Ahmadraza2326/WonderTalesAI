# ORBis Motion & Choreography System

> **Standard:** Purposeful, Non-Extraneous Motion Design  
> **Rule:** Animation must communicate causality, teaching, attention signaling, and feedback. Zero aimless bouncing.

---

## 1. Motion Timing Curves & Durations

```css
:root {
  /* ⏱️ Timing Durations */
  --motion-micro: 120ms;        /* Button press, toggle snap */
  --motion-short: 240ms;        /* Card flip, tooltip reveal */
  --motion-medium: 400ms;       /* Modal enter, manipulative glide */
  --motion-long: 650ms;         /* Scene transition, realm portal zoom */
  --motion-celebration: 1200ms; /* Starburst particle dispersion */

  /* 📈 Bespoke Easing Curves */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);    /* Playful bouncy overshoot */
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);        /* Natural deceleration */
  --ease-snappy: cubic-bezier(0.4, 0, 0.2, 1);         /* Quick mechanical response */
  --ease-in-out-float: cubic-bezier(0.45, 0, 0.55, 1); /* Continuous ambient breathing */
}
```

---

## 2. The 6 Choreography Patterns

### A. Attention Signal (Signaling Principle)
* **Goal:** Direct the child's eyes to a newly revealed clue or interactive slot.
* **Choreography:** Guide points $\to$ target slot pulses border opacity ($0.4 \to 1.0 \to 0.4$) over $800\text{ms}$ with a gentle radial aura expansion.

### B. Group-to-Array Transformation (Mathematical Causality)
* **Goal:** Visually demonstrate that equal groups transform into rows and columns.
* **Choreography:** 
  1. $t=0$: Groups sit in loose circular clusters.
  2. $t=200\text{ms}$: Group 1 translates along a smooth Bezier path to row $y_1$.
  3. $t=400\text{ms}$: Group 2 translates to row $y_2$.
  4. $t=600\text{ms}$: Group 3 translates to row $y_3$.
  5. $t=900\text{ms}$: Horizontal grid lines illuminate in sequence, accompanied by ascending chimes.

### C. Tactile Drag & Snap (Direct Manipulation)
* **Goal:** Give virtual objects weight and physical certainty.
* **Choreography:** While dragged, item elevates $+12\text{px}$ with a soft shadow and scales $1.08\times$. Upon release over a valid slot, item snaps into place using `--ease-spring` within $180\text{ms}$ with a tactile pop sound and haptic pulse.

### D. Misconception Correction (Diagnostic Remediation)
* **Goal:** Support understanding without triggering shame.
* **Choreography:** Selected incorrect option stays in place, guide tilts head (`thinking` pose), and a soft amber glow highlights the specific row/column that needs inspection.

### E. Scene Transition & Spatial Continuity
* **Goal:** Ensure the child never feels disoriented when advancing.
* **Choreography:** Current scene stage slides left and fades ($350\text{ms}$); next stage slides in from the right ($400\text{ms}$) with guide companion smoothly maintaining their stage position.

### F. Victory Celebration (Peak-End Rule)
* **Goal:** Celebrate effort and concept mastery.
* **Choreography:** Guide leaps in celebration (`celebrating_bounce`), Star Crystal shimmers with high-velocity stardust particles, and XP/Star counters roll up with rhythmic audio chimes.
