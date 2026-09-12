# ORBis AI & Child Safety Architecture

> **Standard:** Controlled, Deterministic, Child-Safe Generative Pipeline  
> **Rule:** AI operates behind strict schemas, guardrails, and validation gates. AI NEVER freely controls economy, permissions, curriculum definitions, or unrestricted child conversations.

---

## 1. The 6-Stage AI Safety Pipeline

```
[ 1. Context Sanitization & Age-Band Calibration ]
                         │
                         ▼
[ 2. Prompt Template Isolation & Strict System Guardrails ]
                         │
                         ▼
[ 3. Structured JSON Output Generation (Gemini 2.5 Flash) ]
                         │
                         ▼
[ 4. Safety & Content Moderation Filter (Zero Violence/PII) ]
                         │
                         ▼
[ 5. Pedagogical Schema & Grounding Validator ]
                         │
                         ▼
[ 6. Client Render & Diegetic Delivery ]
```

---

## 2. Strict Boundary Invariants

1. **Curriculum Invariance:** Core curriculum definitions (skills, prerequisites, learning objectives, standard math models) are canonical code artifacts and cannot be modified on the fly by ungrounded model hallucinations.
2. **Economic Ledger Invariance:** Minting of XP, Stars, and Creature mutations is authoritatively executed by the server-side database functions (`complete_activity` RPC). Client-side or AI prompts cannot award currency directly.
3. **Zero Open-Ended Unmoderated Chat:** AskOrbis assistant answers child questions within strict pedagogical bounds relevant to the active lesson block. It gracefully redirects off-topic or inappropriate prompts.
4. **COPPA / GDPR-K Privacy:** Zero storage of PII in generative prompts. Child names in story generation are filtered through privacy proxies.
