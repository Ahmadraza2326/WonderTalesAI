# ORBis Child Profile & Developmental Grade System
**Date:** August 29, 2026  
**Version:** 1.0.0  

---

## 1. Multi-Child Architecture

ORBis supports multiple independent child profiles under a single parent account. Each profile maintains isolated state:

```typescript
export interface ChildLearningProfile {
  id: string
  name: string
  avatarId: string
  age: number
  gradeBand: 'pre_k' | 'kindergarten' | 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5'
  learningPreferences: {
    preferredGuideId: string
    audioNarrationSpeed: number // 0.8x to 1.2x
    captionsEnabled: boolean
    reducedMotion: boolean
    soundEffectsVolume: number
  }
  masteryMatrix: Record<string, SkillMasteryState>
  portfolio: Array<ChildPortfolioItem>
  activeStreakDays: number
  lastActiveTimestamp: string
  interests: Array<'animals' | 'space' | 'dinosaurs' | 'fantasy' | 'robots' | 'oceans' | 'inventions'>
  offlineQueue: Array<QueuedProgressEvent>
}
```

---

## 2. Developmental Grade Adaptation Matrix

| Dimension | Pre-K / Nursery | Kindergarten | Grade 1–2 | Grade 3–5 |
| :--- | :--- | :--- | :--- | :--- |
| **Vocabulary Level** | Everyday objects, colors, shapes, animals | Early sight words, CVC words, basic numbers | Compound words, early science terms, simple math syntax | Technical vocabulary, hypothesis syntax, code operators |
| **Sentence Length** | 3–6 words | 6–10 words | 10–15 words | 15–25 words |
| **Narration Dependency** | Mandatory (100% spoken instructions) | Primary (audio plays by default with captions) | Supported (audio available on tap) | Optional (child reads with on-demand audio) |
| **Touch Targets** | Extra large ($\ge 64\text{px}$) | Large ($\ge 54\text{px}$) | Standard ($\ge 44\text{px}$) | Precise ($\ge 44\text{px}$) |
| **Interaction Types** | Tap, big drag, big stamp, simple swipe | Tile drag, trace, single choice, counting | Number entry, sorting, matching, fill-blank | Multi-select, code blocks, balance scales, formula sliders |
| **Activity Duration** | 3–5 minutes | 5–8 minutes | 8–12 minutes | 12–20 minutes |
| **Visual Density** | 1–2 objects on screen at once | 3–4 items with high contrast | Structured panels with clear sections | Multi-panel dashboards with detailed diagrams |
