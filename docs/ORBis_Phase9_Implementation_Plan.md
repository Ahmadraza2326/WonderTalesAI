# ORBis Phase 9 — Production Implementation Plan
**Status:** PROPOSED & PAUSED — AWAITING EXPLICIT APPROVAL  
**Date:** August 29, 2026  
**Objective:** Systematic execution plan to elevate ORBis into a world-class international children's learning product.  

---

## 1. Plan Overview & Architectural Directives

This implementation plan is organized into **11 prioritized stages**. Each stage has defined acceptance criteria, risk assessments, and zero-destructive boundaries to ensure zero regressions across existing stories, games, economy, child profiles, and database contracts.

---

## 2. Prioritized Implementation Stages

### Stage 1: Critical Usability & Responsive Navigation (P0)
- **Goal:** Fix mobile bottom navigation and tablet header link overflow.
- **Scope:**
  - Update `src/components/layout/MobileBottomNav.tsx` to include `🏰 Home`, `🏛️ Academy`, `🪐 Games`, `🗺️ Overworld`, `👤 Profile`.
  - Update `src/components/layout/Header.tsx` to collapse secondary links into a clean "Explore ▾" menu on viewports $< 1200\text{px}$.
- **Risk:** Very Low. Purely layout and navigation.

### Stage 2: Landing Page & Brand First Impression (P1)
- **Goal:** Transform `/` into a magical, animated children's portal.
- **Scope:**
  - Redesign `src/pages/HomePage.tsx` to feature:
    - Cosmic animated hero banner with Poly, Lexi, and Newton mascots.
    - Live interactive previews of the Overworld, Academy Realms, and Flagship Games.
    - "Start Learning Adventure" primary CTA.
    - Parent Trust & Safety badges (Ad-free, COPPA compliant, AI safety guarded).
- **Risk:** Low. Replaces obsolete prototype text without affecting backend routes.

### Stage 3: Pre-K & Kindergarten Pure-Visual Child UX (P1)
- **Goal:** Eliminate reading dependencies for non-reading children (ages 3–5).
- **Scope:**
  - Update `src/components/academy/lesson/cinematic/MicroQuestionRenderer.tsx` for Pre-K:
    - Display pure visual icon targets (e.g. ⭐⭐⭐⭐⭐) instead of text labels ("5 Stars").
    - Trigger auto-narration of the question prompt via `narrationDirector`.
  - Verify touch target dimensions remain $\ge 72\text{px}$.
- **Risk:** Low. Pure visual rendering improvement.

### Stage 4: Audio Autoplay Priming & Interaction Gate (P1)
- **Goal:** Prevent browser audio suppression and ensure reliable sound/speech on scene entrance.
- **Scope:**
  - Add an intuitive "✨ Tap to Begin Adventure" entrance gate on lesson launch to prime the browser `AudioContext`.
  - Ensure mascot voice and sound effects play immediately on first scene start.
- **Risk:** Low.

### Stage 5: Guide Mascot Vector Character Elevation (P1)
- **Goal:** Elevate guide mascots from circular emoji orbs to illustrated vector character bodies.
- **Scope:**
  - Upgrade `src/components/academy/guide/GuideCharacterSvg.tsx` with bespoke SVG vector bodies, ears, wings, and animated limbs for Poly (Owl), Lexi (Fox), Newton (Otter), and BEEP-0 (Robot).
  - Retain all 8 emotional poses and gaze tracking.
- **Risk:** Medium (Visual). Needs careful SVG coordinate scaling.

### Stage 6: Overworld Winding Adventure Trail (P2)
- **Goal:** Replace vertical card list with an interactive, winding adventure path.
- **Scope:**
  - Upgrade `src/components/overworld/OverworldJourneyMap.tsx` with a curved SVG path connecting all 11 nodes.
  - Animate unlocked nodes with glowing particle pulses and locked nodes with mystical clouds.
- **Risk:** Low.

### Stage 7: Design System Button & Card Consolidation (P2)
- **Goal:** Eliminate dual-button styling across legacy and modern views.
- **Scope:**
  - Standardize all dashboard and form buttons to use `<MagicalButton variant="...">` from `src/components/ui/design/`.
  - Clean up remaining legacy CSS button overrides.
- **Risk:** Low.

### Stage 8: Multi-Child 1-Tap Switcher & Parent Co-Pilot (P2)
- **Goal:** Frictionless child profile switching on shared household devices.
- **Scope:**
  - Add a 1-tap Child Profile dropdown avatar in `src/components/layout/TopExplorerBar.tsx`.
  - Enhance `src/pages/ParentZonePage.tsx` with visual mastery radar charts.
- **Risk:** Low.

### Stage 9: Games Universe Developmental Filtering (P2)
- **Goal:** Help children and parents find age-appropriate games instantly.
- **Scope:**
  - Add grade band filter chips (`Early Learner`, `Explorer`, `Master`) to `src/pages/GameUniversePage.tsx`.
- **Risk:** Low.

### Stage 10: Curriculum Localization Extensibility (P2)
- **Goal:** Prepare curriculum data for seamless international language expansion.
- **Scope:**
  - Structure lesson metadata in `src/services/academy/curriculum/cinematicLessonsData.ts` to support translation keys.
- **Risk:** Low.

### Stage 11: Final Regression Testing & Verification (P3)
- **Goal:** Comprehensive automated verification across all test suites, TypeScript strict compile, and production build.
- **Scope:**
  - Run all 59+ test suites.
  - Run TypeScript compiler and ESLint.
  - Execute Vite production build.
- **Risk:** Zero.

---

## 3. Dependencies & Prerequisites
- No external packages or heavy dependencies required.
- All changes leverage existing React 18, TypeScript, CSS variables, and Lucide/SVG primitives.

---

## 4. Protected Systems Checklist
- [x] Story Generation & Gemini TTS
- [x] Child Profiles & Parent PIN Gate
- [x] 10 Canonical Flagship Games
- [x] Overworld XP / Star Economy & RPCs
- [x] Academy Curriculum & Learning Director
- [x] Supabase Auth & DB Schema

---

*End of Phase 9 Implementation Plan.*
