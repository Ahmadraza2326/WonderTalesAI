# ORBis Quality Gates & Definition of Done

> **Standard:** Zero-Tolerance for Mediocrity  
> **Rule:** A feature is NOT acceptable merely because it runs without crashing. It must pass all 11 Quality Gates.

---

## 1. The 11 Mandatory Quality Gates

```
[ Gate 1: PRODUCT QA ] ─────── Does it evoke joy, wonder, and authentic immersion?
[ Gate 2: PEDAGOGICAL QA ] ─── Does it follow concrete-to-symbolic progression?
[ Gate 3: VISUAL QA ] ──────── Are all assets bespoke, luminous, and free of emojis/placeholders?
[ Gate 4: MOTION QA ] ──────── Is animation purposeful, smooth, and physically grounded?
[ Gate 5: AUDIO QA ] ───────── Is narration warm, characterful, and dynamically ducked?
[ Gate 6: INTERACTION QA ] ─── Are touch targets large, tactile, and immediately responsive?
[ Gate 7: MOBILE QA ] ──────── Does it render flawlessly on narrow 360px portrait viewports?
[ Gate 8: ACCESSIBILITY QA ] ── Does it meet WCAG 2.1 AA contrast, keyboard & screen-reader rules?
[ Gate 9: PERFORMANCE QA ] ─── Does it sustain 60 FPS without layout thrashing?
[ Gate 10: LEARNING QA ] ───── Does mastery accurately reflect student understanding?
[ Gate 11: SAFETY QA ] ─────── Is all AI generation bounded, moderated, and COPPA compliant?
```

---

## 2. Definition of Done Checklist

A feature is complete ONLY when:
- [x] Technically functional with 0 unhandled promise rejections or runtime exceptions.
- [x] Visually premium with cosmic glassmorphism, depth, and responsive typography.
- [x] Character-integrated with emotional responsiveness and directional gaze.
- [x] Audio-integrated with ducked music, sound effects, and voice narration.
- [x] Zero placeholders (no generic emojis as primary art, no raw text dumps).
- [x] Fully tested in the master regression suite (`scripts/run_all_tests.ts`).
- [x] Strict TypeScript check passes with 0 errors (`tsc --noEmit`).
- [x] Production build passes (`vite build`).
- [x] Documentation updated in `docs/orbis/`.
