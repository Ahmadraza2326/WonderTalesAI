# ORBis Information Architecture & Universal Routing

> **Standard:** Child-First Spatial Navigation & Wayfinding  
> **Rule:** Never overwhelm the child with dozens of unorganized choices. Answer immediately: "What should I do now?"

---

## 1. High-Level Spatial Hierarchy

```
                                [ OVERWORLD / CELESTIAL UNIVERSE ]
                                               │
             ┌─────────────────────────────────┼─────────────────────────────────┐
             ▼                                 ▼                                 ▼
    [ 🏛️ ACADEMY REALMS ]             [ 🪐 PLAYROOM GAMES ]             [ 📖 STORY LIBRARY ]
             │                                 │                                 │
     ┌───────┴───────┐                         │                                 │
     ▼               ▼                         ▼                                 ▼
[ ☀️ Guided Path ] [ 📚 Open Library ] [ 10 Flagship Worlds ]          [ Personalized Stories ]
     │               │                         │                                 │
     ▼               ▼                         ▼                                 ▼
[ Skill Hub ]   [ Category / Grade ]    [ Direct Game Engine ]        [ Reader & Audio Sync ]
     │
     ├─➔ 1. Cinematic Lesson Stage (/academy/lesson/:id)
     ├─➔ 2. Practice Drills (/academy/practice/:id)
     └─➔ 3. Flagship Game Launch (/playroom/:gameId)
```

---

## 2. Universal Academy Route Map

* `/academy`: The Living Academy Hub (Today's Guided Journey + Active Mentor + Floating Realm Portals).
* `/academy/subject/:subjectId`: Subject Realm Detail (Courses, Units, Realm Lore, Mascot Companion).
* `/academy/course/:courseId`: Course Progression Track (Unit milestones and skill constellations).
* `/academy/skill/:skillId`: The 3-Step Skill Hub (Step 1: Lesson $\to$ Step 2: Practice $\to$ Step 3: Capstone).
* `/academy/lesson/:lessonId`: The 5-Scene Cinematic Lesson Production Stage.
* `/academy/practice/:practiceSetId`: Fluency Practice & Evaluator Stage.
* `/academy/library`: Universal Exploratory Library (Categories + Grade Bands + Voice Search).
* `/academy/missions`: Daily Quests and Mastery Achievements.
* `/academy/create`: Creative Studio (Art canvas + Story narration generator).
* `/academy/think`: Think Lab (Logic puzzles & simulations).
* `/academy/science`: Science Lab (Physics & biology experiment stations).
* `/academy/projects`: Multi-disciplinary Capstone Creation Projects.
