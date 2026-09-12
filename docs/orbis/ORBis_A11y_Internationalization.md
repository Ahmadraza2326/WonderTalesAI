# ORBis Accessibility & Internationalization Specification

> **Standard:** WCAG 2.1 AA Compliance & Multilingual Scalability  
> **Rule:** Never hardcode English into core UI architecture. Support bidirectional layouts (LTR / RTL), screen-reader semantics, and high-contrast child touch standards.

---

## 1. Multilingual & RTL Architecture

```
Supported Locales:
  • English (en-US, en-GB) [LTR]
  • Urdu (ur-PK) [RTL]
  • Arabic (ar-SA) [RTL]
  • Spanish (es-ES, es-MX) [LTR]
  • French (fr-FR) [LTR]
  • Mandarin Chinese (zh-CN) [LTR]
  • German (de-DE) [LTR]
  • Portuguese (pt-BR) [LTR]
```

### RTL Layout Engine:
* Logical CSS properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`) are mandatory.
* Floating mascots and dialogue balloons flip direction dynamically based on `document.documentElement.dir === 'rtl'`.
* Number lines, clock hands, and coordinates remain mathematically universal while contextual labels reflect the active locale.

---

## 2. Accessibility & Assistive Support

1. **Touch Target Dimensions:** Minimum $48\text{px} \times 48\text{px}$ touch targets for Grade 1–5, minimum $64\text{px} \times 64\text{px}$ for Pre-K and Kindergarten.
2. **Color Contrast:** Text and interactive elements maintain $\ge 4.5:1$ contrast ratio against dark celestial backgrounds.
3. **Multi-Sensory Redundancy:** Color is never used as the sole indicator of correctness. Success states combine color ($#10b981$), icon badge ($✓$), haptic feedback, and harmonic audio chimes.
4. **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by replacing particle bursts and scaling loops with instantaneous opacity fades.
5. **Screen Reader Semantics:** Clear `aria-label`, `role="region"`, and live region announcements for guide dialogue and question feedback.
