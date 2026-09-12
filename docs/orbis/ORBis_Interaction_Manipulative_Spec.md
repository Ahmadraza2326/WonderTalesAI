# ORBis Virtual Manipulative Specification

> **Standard:** Physicalized, Multi-Sensory Concept Representation  
> **Rule:** Every interaction physically models the underlying domain concept. No arbitrary drag-and-drop.

---

## 1. Canonical Virtual Manipulatives Registry

```
┌──────────────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Manipulative Kind                │ Academic Domain      │ Concrete Mental Model & Mechanism                      │
├──────────────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ ten_frame                        │ Early Math / Pre-K   │ 2x5 Subitizing Grid, Base-10 Chunking                  │
│ number_line                      │ Primary Math / G1-G3 │ Continuous Spatial Axis, Multi-Hop Skip Counting       │
│ star_array_grid                  │ Multiplication / G2-3│ Rows x Columns 2D Spatial Area Matrix                  │
│ balance_scale                    │ Algebra & Mass / G3-5│ Continuous Spring Equilibrium, Bilateral Invariance    │
│ fraction_bar                     │ Rational Numbers/G3-5│ Linear & Radial Part-Whole Dynamic Slicing             │
│ phoneme_builder                  │ Phonics & Reading    │ Acoustic Onset/Rime Sound Tiles with Audio Synthesis   │
│ sentence_runes                   │ Syntax & Grammar     │ Syntactic Connection Nodes (Subject ➔ Verb ➔ Object)   │
│ robot_grid                       │ Computer Science     │ 4x4 Orthogonal Path Execution Bus with Token Registers │
│ code_blocks                      │ CS & Logic           │ Snap-together Control Flow & Nested Loop Containers    │
│ logic_clues                      │ Deductive Reasoning  │ Matrix Elimination Grid with Constraint Highlighting   │
│ rhythm_drums                     │ Music & Acoustics    │ Multi-track Percussion Pads with BPM Quantization      │
│ color_palette                    │ Astronomy / Science  │ Continuous Spectral Dispersion & Thermal Wavelength    │
│ water_tank                       │ Physics & Buoyancy   │ Archimedes Fluid Displacement & Density Simulation     │
└──────────────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Interaction Standard Checklist

Every virtual manipulative must satisfy:
1. **Touch-First Accessibility:** Minimum $48\text{px} \times 48\text{px}$ touch bounding boxes with generous padding.
2. **Instant Sensory Feedback:** Audio sound upon grab, drag whoosh, and satisfying snap upon placement.
3. **Reversibility:** The child can undo, drag back, or clear without penalty.
4. **State Machine Validity:** Manipulative maintains an internal declarative state (`initialState`, `currentState`, `targetGoal`) with strict completion evaluation.
