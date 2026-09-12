# ORBis Performance & Asset Budget Standards

> **Standard:** 60 FPS Fluidity, Core Web Vitals Excellence, Mobile Battery & Memory Optimization  
> **Rule:** Premium visual design must NEVER compromise performance. Enforce strict asset budgets and low-end hardware fallbacks.

---

## 1. Core Performance Targets

```
┌──────────────────────────────────────┬───────────────────────────────┐
│ Metric                               │ Target Threshold              │
├──────────────────────────────────────┼───────────────────────────────┤
│ Frame Rate                           │ Constant 60 FPS on mobile     │
│ Largest Contentful Paint (LCP)       │ < 1.8 seconds                 │
│ Interaction to Next Paint (INP)      │ < 100 ms                      │
│ Cumulative Layout Shift (CLS)        │ < 0.05                        │
│ Initial JavaScript Bundle            │ < 250 KB (gzipped)            │
│ Memory Footprint                     │ < 120 MB on low-end tablets   │
└──────────────────────────────────────┴───────────────────────────────┘
```

---

## 2. Asset & Rendering Optimization Rules

1. **GPU-Accelerated Animations:** Animate strictly with `transform` and `opacity`. Zero animations on `width`, `height`, `margin`, or `top/left` to avoid CPU layout reflows.
2. **Particle Throttling:** Ambient particle fields dynamically reduce particle count (e.g. $40 \to 15$) on mobile devices with `navigator.hardwareConcurrency <= 4`.
3. **Audio Sprite Management:** Synthesize standard sound cues or load compact compressed WebM/Opus audio sprites with persistent in-memory caching.
4. **Code Splitting & Dynamic Imports:** Every major game engine and academy lab is loaded on-demand via `React.lazy()` with luminous loading spinners.
