# 🪐 ORBis 10-Game Procedural Engine Architecture & Deep Diagnostic Audit

**Document Version:** `1.0.0`  
**Date:** `August 28, 2026`  
**Authors:** Lead Game Engine Architect & Principal UI/UX Designer  
**Scope:** Flagship Mini-Game Engine Diagnostics, Performance Bottleneck Analysis, 10-Game Procedural Registry, and 60 FPS Architectural Blueprint

---

## Executive Summary

This technical audit transitions ORBis from isolated, ad-hoc visual components into an industrial-grade, procedural, 60 FPS game engine ecosystem. 

Historically, mini-games suffered from:
1. **React State In The Simulation Loop**: Calling `useState` setters within `requestAnimationFrame` cycles, triggering 60 re-renders per second, garbage collection stalls, and dropped frames.
2. **CSS Transition Latency**: Relying on CSS `transition: transform 0.4s cubic-bezier(...)` instead of continuous harmonic spring physics, causing visual snapping and jitter under rapid user interaction.
3. **Uncaptured Pointer Events**: Missing DOM `PointerCapture` APIs, leading to lost drag targets during quick swipes on mobile touchscreens.
4. **Viewport Overflow Scenarios**: Unconstrained vertical heights on tablets/phones forcing unwanted window scrollbars during gameplay.

This document establishes the diagnostic breakdown of the 4 flagship games, introduces the **10-Game Procedural Registry (`gameRegistry.ts`)**, and details the architectural blueprint for deterministic, PRNG-seeded educational gameplay.

---

## Part 1: Deep Code Inspection of Existing 4 Game Engines

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ORBIS ENGINE RUNTIME PARADIGM                                 │
├─────────────────────────────┬─────────────────────────────────┬─────────────────────────────────┤
│ ANTI-PATTERN (OLD)          │ SYMPTOM                         │ ARCHITECTURAL STANDARD (NEW)    │
├─────────────────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ setState() inside rAF loop  │ 60 FPS garbage collection spikes│ Mutable engine ref + Canvas 2D  │
│ CSS cubic-bezier transforms │ Jittery, abrupt multi-touch resets│ Continuous Verlet/Spring loops  │
│ HTML5 Drag & Drop API       │ Broken on mobile touchscreens   │ Unified PointerCapture Gestures │
│ Nested min-h-screen divs    │ Double scrollbars on mobile     │ Strict 100vh lock + Auto-scale  │
└─────────────────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

---

### 1. Creature Alchemist (Creature Lab)
* **Target Services:** [`src/services/games/creatureLabEngine.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/creatureLabEngine.ts)  
* **Target Components:** [`src/components/games/creature-lab/CreatureLab.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/games/creature-lab/CreatureLab.tsx), [`CauldronStage.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/games/creature-lab/CauldronStage.tsx)

#### Diagnostic Analysis & Bottlenecks:
1. **Cauldron Fluid State is Static CSS**:
   - In `CauldronStage.tsx`, fluid boiling is driven by CSS `@keyframes boil` and SVG radial gradient opacity changes.
   - When 2 essences are added, color interpolation jumps abruptly through CSS classes rather than computing smooth real-time HSL/RGB particle fluid dispersion.
2. **Synchronous LocalStorage I/O on Active State**:
   - In `CreatureLab.tsx`, `discoveredIds`, `stardust`, and `metadataMap` are read and written to `localStorage` in top-level `useEffect` hooks on every state change, introducing frame latency during celebration modal triggers.
3. **Essence Touch Tracking**:
   - Dragging an essence bottle does not use pointer capture. Fast diagonal swipes on iPad or Android tablets cause touch cancellation if the pointer exits the shelf bounding rect.

#### Proposed Physics & Engine Upgrades:
* **Canvas 2D Fluid Simulation Buffer**: Implement a double-buffered 2D metaball / particle canvas inside the cauldron rim ($N=40$ fluid particles with spring attraction and buoyancy).
* **Pointer Velocity Tracking**: Attach `setPointerCapture` with an elastic spring tether following the finger ($F = -k \Delta x - c v$).
* **Procedural Synthesis Goals**: Connect to `createPRNG(seed)` to procedurally generate daily alchemical recipes with scientific taxonomy explanations (Lumina, Flora, Aero, Ignis, Cosmic).

---

### 2. Clockwork Physics Lab (Magic Machine Lab)
* **Target Services:** [`src/services/games/magicMachineEngine.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/magicMachineEngine.ts)  
* **Target Components:** [`src/components/playroom/stations/MagicMachineLab.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/MagicMachineLab.tsx)

#### Diagnostic Analysis & Bottlenecks:
1. **Critical: React State Inside the 60 FPS Physics Loop**:
   - In `MagicMachineLab.tsx` (lines 170–173):
     ```ts
     const loop = (currentTime: number) => {
       const deltaSec = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05)
       lastTimeRef.current = currentTime
       setGameState((prev) => {
         if (prev.simulationStatus !== 'running') return prev
         return stepSimulation(prev, deltaSec)
       })
       animationFrameRef.current = requestAnimationFrame(loop)
     }
     ```
   - Calling `setGameState` 60 times/sec causes React to execute component diffing, hook checks, and virtual DOM reconciliation on every animation frame.
2. **First-Order Euler Collision Tunneling**:
   - `stepSimulation` in `magicMachineEngine.ts` uses basic Euler integration ($x_{t+1} = x_t + v \cdot \Delta t$). At high velocities (e.g. after steep ramps or springboards), small actors ($r=16\text{px}$) can tunnel straight through thin platforms ($h=10\text{px}$).
3. **Static Coordinate Projection**:
   - Canvas resolution is hardcoded to $800 \times 500$. Canvas scaling relies on CSS width stretching without adjusting canvas backing store pixels for high-DPI (Retina) displays.

#### Proposed Physics & Engine Upgrades:
* **Decoupled Mutable Physics Loop**: Move simulation actors into a mutable `PhysicsWorld` ref. The `requestAnimationFrame` loop updates actors directly and draws immediately to Canvas 2D at 60 FPS without touching React state.
* **Discrete Event Emitters for React**: React state updates are dispatched **only** when state changes discretely (`simulationStatus: 'running' -> 'success' | 'failed' | 'reset'`).
* **Verlet Integration with Sub-Stepping**: Replace Euler with 4 sub-steps per frame ($4 \times \Delta t / 4$) and swept sphere-box collision manifolds to eliminate tunneling.

---

### 3. Midnight Noir Detective (Mystery Detective)
* **Target Services:** [`src/services/games/mysteryDetectiveEngine.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/mysteryDetectiveEngine.ts)  
* **Target Components:** [`src/components/playroom/stations/MysteryDetective.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/MysteryDetective.tsx)

#### Diagnostic Analysis & Bottlenecks:
1. **DOM-Based Hotspot Detection**:
   - Crime scene evidence hotspots are mapped as absolute DOM elements with hover/click event listeners.
   - When dragging forensic tools (e.g., UV lens or Listening Horn), the cursor coordinates must pass through DOM hit testing which can be blocked by overlapping SVG layers or suspect cards.
2. **Static Reveal Transitions**:
   - UV glowing ink and footprint evidence use CSS opacity transitions instead of hardware-accelerated circular stencil masking or canvas shader reveals.
3. **Constraint Logic Coupling**:
   - Clue deduction logic evaluates suspect traits by iterating linear arrays on every click instead of an optimized constraint satisfaction bitmask graph.

#### Proposed Physics & Engine Upgrades:
* **Interactive Canvas Stencil Lens**: Render crime scene backgrounds on a canvas. The UV Brush and Magnifying Glass act as dynamic clipping paths (`ctx.clip()`) revealing an underlying glowing UV/spectral layer in real-time at mouse/touch coordinates $(x, y)$.
* **Spatial Hash Grid Hotspots**: Index evidence hotspots in a fast $32 \times 32$ spatial hash grid for instantaneous 0ms hit-testing during fluid tool dragging.
* **Graph-Based Elimination Engine**: Formalize culprit elimination as a bipartite constraint graph with automated contradiction checking.

---

### 4. Apothecary Balance Scales (Potion Scales)
* **Target Services:** [`src/services/games/potionScalesEngine.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/potionScalesEngine.ts)  
* **Target Components:** [`src/components/playroom/stations/PotionScales.tsx`](file:///c:/Users/muhammad/WonderTalesAI/src/components/playroom/stations/PotionScales.tsx)

#### Diagnostic Analysis & Bottlenecks:
1. **CSS Cubic-Bezier Fulcrum Jitter**:
   - The balance beam tilt angle is rendered via CSS: `transform: rotate(${clampedTiltAngle}deg)` with `transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`.
   - When a child drops multiple weights in rapid succession (e.g. adding 3g, then 2g, then 1g), each drop resets the CSS transition timing curve mid-flight, creating unnatural stuttering and visual clipping.
2. **Pan Y-Offset Decoupling**:
   - Suspended pan vertical offsets are computed via trigonometric estimation in React state. Because the beam and pans have independent CSS transitions, the suspension chains appear to stretch or detach from the pivot points during quick balance shifts.

#### Proposed Physics & Engine Upgrades:
* **True Damped Harmonic Oscillator**:
  $$\tau_{\text{net}} = (\sum m_{\text{left}} \cdot d_{\text{left}} - \sum m_{\text{right}} \cdot d_{\text{right}}) \cdot g$$
  $$I \frac{d^2\theta}{dt^2} + c \frac{d\theta}{dt} + k \theta = \tau_{\text{net}}$$
  Simulate beam angular acceleration and pan vertical damping in a real-time 60 FPS physics loop.
* **Liquid Beaker Surface Incline**: Liquid in beakers levels out relative to world gravity, sloshing dynamically as weights are added.

---

## Part 2: The 10-Game Procedural Engine Ecosystem

All 10 games are registered in [`src/services/games/gameRegistry.ts`](file:///c:/Users/muhammad/WonderTalesAI/src/services/games/gameRegistry.ts) with full metadata, pedagogical objectives, PRNG seed generation hooks, and SVG icons:

| # | Game ID | Title | Scientific Discipline | Cognitive Domain | Physics / Algorithm Model | Status |
|---|---|---|---|---|---|:---:|
| **1** | `creature_alchemist` | **Creature Alchemist** | Chemistry & Taxonomy | Creativity | Fluid Viscosity & Particle Blend Solver | 🟢 `playable` |
| **2** | `clockwork_physics` | **Clockwork Physics Lab** | Engineering & Energy | Logic | 2D Rigid Body + Verlet Integrator | 🟢 `playable` |
| **3** | `midnight_detective` | **Midnight Noir Detective** | Forensic Logic | Logic | Graph Constraint Satisfaction Engine | 🟢 `playable` |
| **4** | `apothecary_scales` | **Apothecary Balance Scales** | Algebra & Density | Logic | Dual-Pan Torqued Fulcrum Moments | 🟢 `playable` |
| **5** | `spellforge_anvil` | **Spellforge Runic Anvil** | Phonics & Spelling | Vocabulary | Kinetic Socket Snap & Particle Forge | 🟡 `in_development` |
| **6** | `memory_museum` | **Memory Museum** | Spatial Memory | Memory | Matrix State Transformation & Time-Decay | 🟡 `in_development` |
| **7** | `rhythm_conductor` | **Rhythm Spells Conductor** | Phonemic Beat & Rhyme | Phonics | Time-Domain Audio Quantizer & Ripple Wavefront | 🟡 `in_development` |
| **8** | `robopath_academy` | **Robo-Path Academy** | Computational Logic | Logic | AST Grid Step Interpreter & Maze Solver | 🟡 `in_development` |
| **9** | `ecosystem_sandbox` | **Ecosystem Sandbox** | Biology & Food Chains | Creativity | Cellular Automata Food-Web Matrix | 🟡 `in_development` |
| **10** | `cosmic_constellation` | **Cosmic Constellation Builder** | Geometry & Coordinates | Logic | 2D Celestial Graph & Ray-Intersection | 🟡 `in_development` |

---

## Part 3: Procedural PRNG Engine Architecture

To ensure infinite replayability and zero server API costs for level generation, all 10 engines share a deterministic **Mulberry32 PRNG Generator**:

```typescript
export function createPRNG(seedInput: number | string): SeededPRNG {
  let seed = typeof seedInput === 'number' ? seedInput : hashStringToSeed(seedInput)
  
  function next(): number {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    seed,
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    float: (min, max) => next() * (max - min) + min,
    pick: (items) => items[Math.floor(next() * items.length)],
    shuffle: (items) => /* deterministic Fisher-Yates */,
    sample: (items, count) => /* sample */,
    chance: (p) => next() < p,
  }
}
```

### Deterministic Session Seeding Formula:
$$\text{SessionSeed} = \text{Hash32}\Big(\text{GameID} \parallel \text{ChildID} \parallel \text{Difficulty} \parallel \text{CalendarDayKey}\Big)$$

* **Deterministic Replay**: A parent or teacher can replay the exact same procedural challenge by inputting the numerical seed.
* **Daily Alignment**: All children worldwide receive the same curated daily puzzle seed for daily streak challenges.

---

## Part 4: Viewport Height & Layout Zero-Scroll Standard

To ensure zero page scrollbars across all desktop, tablet, and mobile displays:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header (75px)                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Root Page Container: height: calc(100vh - 75px), overflow: hidden           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Top Activity Navigation / Orby Hints Bar (48px)                         │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Dynamic Scale Canvas / Interactive Stage                                │ │
│ │ style={{                                                                │ │
│ │   transform: `scale(${Math.min(1, availW / 1080, availH / 680)})`,     │ │
│ │   transformOrigin: 'top center'                                         │ │
│ │ }}                                                                      │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Bottom Drawer / Inventory Dock (110px)                                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 5: Implementation Execution Roadmap

### Step 1: Deep Code Inspection & Diagnostic Report (Completed ✅)
* Comprehensive audit of existing 4 game engines.
* Identification of `setState` rAF bottlenecks, CSS transition jitter, and pointer issues.
* Central 10-game registry implemented in `src/services/games/gameRegistry.ts`.
* Creation of `GAME_ENGINE_AUDIT.md`.

### Step 2: High-Performance Engine Core Upgrade
* Decouple physics loops from React state in `MagicMachineLab.tsx` and `PotionScales.tsx`.
* Implement Verlet integration + Harmonic Oscillator physics solvers.
* Upgrade touch interaction with unified PointerCapture managers.

### Step 3: Procedural PRNG Generator Integration
* Wire `gameRegistry.ts` challenge generators into `DailyChallengeModal` and Overworld Journey nodes.
* Implement seed input and deterministic level sharing.

### Step 4: Full Engine Implementation for 6 Remaining Games
* Implement `Spellforge Runic Anvil` and `Memory Museum`.
* Implement `Rhythm Spells Conductor` and `Robo-Path Academy`.
* Implement `Ecosystem Sandbox` and `Cosmic Constellation Builder`.

### Step 5: Master Verification & Performance Profiling
* Run automated headless tests for all 10 procedural challenge generators.
* Verify 60 FPS performance budgets on mobile Chrome and iOS Safari.
