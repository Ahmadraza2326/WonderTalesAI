# ORBis Content Architecture & Scalable Templates
**Date:** August 29, 2026  
**Version:** 1.0.0  

---

## 1. Content Categories (15 Pillars)

The ORBis Universal Library organizes all educational assets across 15 standard categories:

| Category | Identifier | Description | Example Activities |
| :--- | :--- | :--- | :--- |
| **Learn** | `learn` | Structured stepped curriculum lessons | *Fractions on a Number Line*, *Photosynthesis Basics* |
| **Books** | `books` | Curated illustrated books with read-to-me narration | *The Curious Little Star*, *Ocean Giants* |
| **Stories** | `stories` | AI-orchestrated interactive tales | *The Brave Forest Guardian* |
| **Videos** | `videos` | Micro-concept animated pedagogical clips | *How Do Bees Make Honey?*, *Why Do Planets Orbit?* |
| **Games** | `games` | Educational games & Flagship Capstones | *Potion Market Scales*, *Robo-Path Academy* |
| **Create** | `create` | Creative Studio drawing & story making | *Draw Your Own Space Rocket*, *Design a Superhero* |
| **Think** | `think` | Critical Thinking & deduction puzzles | *Pattern Detective*, *Balance Pan Equilibrium* |
| **Science** | `science` | Interactive laboratory simulations | *Plant Growth & Sunlight*, *Gravity & Friction Lab* |
| **Art** | `art` | Color theory, shapes & visual composition | *Color Mixing Studio*, *Geometric Shape Mosaic* |
| **Music** | `music` | Rhythm, tempo, beats & instruments | *Rhythm Drum Pattern*, *Sound Garden Composition* |
| **Read** | `read` | Phonics, decodable words & sight words | *Rune Sound Blending*, *Sight Word Hunt* |
| **Write** | `write` | Sentence builder & creative writing prompts | *Write a Message to an Alien*, *Story Ending Forge* |
| **Explore** | `explore` | Encyclopedic discovery of world wonders | *Deep Sea Bioluminescence*, *Ancient Pyramids* |
| **SEL** | `sel` | Social-emotional learning & feelings | *Understanding Empathy*, *Calm Breathing with Harmony* |
| **Projects** | `projects` | Multi-disciplinary capstone projects | *Build a Space Station*, *Design an Eco-Sanctuary* |

---

## 2. Reusable Content Schemas & Templates

Every activity adheres to standard templates enabling rapid authoring without code changes:

### A. Lesson Template
```typescript
interface LessonTemplate {
  conceptIntro: { title: string; narrative: string; guideId: string; voicePrompt: string }
  visualExplanation: { diagramType: 'fraction' | 'balance' | 'ast' | 'hotspot' | 'simulation'; data: any }
  guidedInteraction: { prompt: string; targetAction: string; hintTier1: string }
  checkQuestion: { prompt: string; type: QuestionType; options: any[]; answer: any }
  reflection: { keyTakeaway: string; celebrationAudio: string }
  capstoneLink?: { gameId: string; challengeLevel: number }
}
```

### B. Science Simulation Template
```typescript
interface ScienceTemplate {
  hypothesisPrompt: string // "What happens to the plant if we turn off sunlight?"
  variableControls: Array<{ name: string; type: 'slider' | 'toggle' | 'selector'; min?: number; max?: number }>
  simulationPhysics: (inputs: Record<string, number | boolean>) => SimulationOutputState
  observedExplanation: string
  challengeGoal: { targetCondition: Record<string, any>; rewardStars: number }
}
```

### C. Creative Studio Template
```typescript
interface CreativeTemplate {
  canvasBackground: string // blank, space, ocean, forest, castle
  initialStickerPack: string // cosmic, animals, nature, fantasy
  guidePrompt: string // "Draw your own friendly alien creature!"
  followupQuestions: Array<{ prompt: string; options: string[] }>
  storyExportTheme: string
}
```

### D. Project-Based Learning Template
```typescript
interface ProjectTemplate {
  title: string
  badgeId: string
  milestones: Array<{
    title: string
    domain: 'math' | 'science' | 'art' | 'writing' | 'logic' | 'coding'
    taskDescription: string
    requiredSkillId?: string
    validationCheck: (submission: any) => boolean
  }>
  portfolioSummary: (completedTasks: any[]) => PortfolioRecord
}
```
