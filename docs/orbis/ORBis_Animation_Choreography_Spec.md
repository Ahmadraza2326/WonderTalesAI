# ORBis Animation Choreography & Motion Design Specification

---

## 1. Core Motion Philosophy

> **"Motion is not decoration; motion is explanation."**

In the ORBis Learning Universe, every animation communicates physical causality, spatial orientation, or pedagogical meaning. Unmotivated, erratic, or continuous bouncing motion creates cognitive noise and is strictly forbidden.

---

## 2. The 5-Tier Motion Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│                  THE 5-TIER MOTION HIERARCHY                 │
├─────────────────┬─────────────┬──────────────────────────────┤
│ TIER            │ DURATION    │ USE CASE                     │
├─────────────────┼─────────────┼──────────────────────────────┤
│ 1. MICRO        │ 50–150ms    │ Button press, hover state,   │
│                 │             │ icon toggle, magnetic touch  │
├─────────────────┼─────────────┼──────────────────────────────┤
│ 2. INTERACTION  │ 150–350ms   │ Slot snap, item drag spring, │
│                 │             │ card flip, modal appearance  │
├─────────────────┼─────────────┼──────────────────────────────┤
│ 3. TEACHING     │ 300–800ms   │ Visual demo, ghost hand,     │
│                 │             │ grouping items, equation fly │
├─────────────────┼─────────────┼──────────────────────────────┤
│ 4. DISCOVERY    │ 500–1200ms  │ Portal unlock, realm zoom,   │
│                 │             │ machine charging, egg hatch  │
├─────────────────┼─────────────┼──────────────────────────────┤
│ 5. CELEBRATION  │ 800–2000ms  │ Lesson victory, constellation│
│                 │             │ illumination, starburst flow │
└─────────────────┴─────────────┴──────────────────────────────┘
```

---

## 3. The 8 Functional Animation Categories

Every animation implemented in ORBis must explicitly belong to one of these 8 functional categories:

1. **AFFORDANCE (Inviting Interaction):**
   - *Example:* A subtle breathing glow on an empty drop slot indicating that an item belongs there.
   - *Timing:* 1,600ms continuous sine-wave oscillation (`opacity: 0.5 <-> 0.9`).

2. **CAUSALITY (Showing Cause & Effect):**
   - *Example:* As a child drags a 4th star into a row, the row container expands dynamically to hold it and emits a subtle ripple.
   - *Timing:* 200ms spring expansion.

3. **FEEDBACK (Confirming Action):**
   - *Example:* Snapping a gear onto an axle triggers a tactile $0.97\times$ compression followed by a $1.02\times$ settle bounce.
   - *Timing:* 240ms dampened spring.

4. **ORIENTATION (Spatial Continuity):**
   - *Example:* Transitioning from the Realm Hub to a Lesson zooms into the specific constellation node rather than an abrupt screen cut.
   - *Timing:* 650ms cubic-bezier camera pan.

5. **FOCUS (Attentional Spotlight):**
   - *Example:* During Guide character dialogue, background elements dim slightly (opacity down to 0.6) to direct the child’s eyes to the speaker and active formula.
   - *Timing:* 300ms ease-out fade.

6. **EMOTION (Character Living Presence):**
   - *Example:* Poly the Star Owl tilts head inquisitively when the learner hesitates, or flaps wings joyfully upon task completion.
   - *Timing:* 400ms organic keyframed vector articulation.

7. **REWARD (Emotional Gratification):**
   - *Example:* Mastery star expands from the center stage, sparkles, and arcs smoothly into the top header star counter.
   - *Timing:* 1,200ms parabolic path curve.

8. **TRANSITION (Pedagogical Stage Movement):**
   - *Example:* Moving from Scene 2 (Concept Reveal) to Scene 3 (Interactive Challenge) sweeps the instructional curtain aside with physical cloth/glass weight.
   - *Timing:* 450ms ease-in-out.

---

## 4. Canonical Cubic-Bezier Curves & CSS Tokens

All CSS transitions and JavaScript spring animations must use these standard tokens defined in `src/styles/tokens.css`:

```css
:root {
  /* Fast snappy response for interactive controls */
  --motion-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Smooth deceleration for entrances and reveals */
  --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Gentle natural acceleration for exits */
  --motion-ease-in: cubic-bezier(0.7, 0, 0.84, 0);

  /* Symmetric transition for camera pans and scene slides */
  --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

---

## 5. Reduced-Motion & Accessibility Enforcement

When `@media (prefers-reduced-motion: reduce)` is detected or the user toggles Reduced Motion in settings:

1. All continuous rotations, floating loops, and particle simulations are instantly disabled (`animation: none !important;`).
2. Moving transforms (`translateX`, `translateY`, `scale`) are replaced with instantaneous or gentle cross-fades (`opacity: 0.1s linear`).
3. Screen shake and violent parallax effects are strictly eliminated.
4. Pedagogical visual representations remain 100% visible and static.
