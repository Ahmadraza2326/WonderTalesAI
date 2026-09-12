# ORBis Adaptive Learning & Mastery Specification

> **Standard:** Multi-Dimensional Skill Mastery Tracking  
> **Rule:** No fake progress. Mastery must track accuracy, independence, retention, and transfer over time.

---

## 1. The 4 Dimensions of Mastery

$$\text{Mastery Score} = 0.35 \times \text{Accuracy} + 0.25 \times \text{Independence} + 0.20 \times \text{Retention} + 0.20 \times \text{Transfer}$$

```
1. Accuracy (0–100):
   Ratio of correct attempts vs total attempts across lessons and practice drills.

2. Independence (0–100):
   1.0 minus penalty for hints used. Independent answers yield maximum score.

3. Retention (0–100):
   Decays smoothly after 14 days without exposure (gentle -2% per day over 14).
   Refreshed immediately upon spaced-retrieval warm-up in Daily Learning Plan.

4. Transfer / Capstone Mastery (0–100):
   Evaluates whether the child successfully applied the concept in the open-ended Flagship Game.
```

---

## 2. Mastery Tiers

```
[ Score: 0% ]       ➔ not_started (Locked or unviewed)
[ Score: 1%–29% ]   ➔ learning    (Lesson completed, introducing concepts)
[ Score: 30%–59% ]  ➔ practicing  (Engaged in skill drills, building fluency)
[ Score: 60%–79% ]  ➔ developing  (Consistently accurate with occasional hints)
[ Score: 80%–94% ]  ➔ proficient  (Fast, independent, accurate execution)
[ Score: 95%–100% ] ➔ mastered    (Proven transfer in flagship games & retention)
```

---

## 3. The Adaptive Guided Path Algorithm

The *Learning Director* generates the personalized Daily Learning Plan:
1. **Fatigue Check:** Sessions capped at 15–25 mins depending on age band.
2. **Prerequisite Gaps:** Prioritizes prerequisite skills before unlocking advanced concepts.
3. **Retention Decay Triggers:** Automatically inserts quick warm-up retrieval challenges for skills older than 14 days.
4. **Child Interest Balancing:** Injects creative studios or story quests matching the child's recorded profile interests.
