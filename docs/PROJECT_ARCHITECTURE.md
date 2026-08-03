# WonderTales AI — Project Architecture

Version: 1.0
Status: Active Development

---

# Vision

WonderTales is not an AI story generator.

WonderTales is a premium international AI storytelling platform that creates unforgettable, personalized story experiences for children while helping them grow through imagination, reading, creativity, emotional intelligence, and life skills.

Every engineering decision must support this vision.

---

# Core Philosophy

The platform must always be:

- Premium quality
- Child-safe
- Parent-friendly
- Educational without feeling educational
- Emotionally engaging
- International
- Scalable
- Low-cost to operate
- Easy to maintain

---

# High-Level Architecture

Parent

↓

Create Story

↓

Story Generation

↓

Story DNA

↓

Learning Package

↓

Illustration Engine

↓

Narration

↓

StoryBook

↓

Dashboard

---

# Current Modules

## Frontend

- Landing
- Authentication
- Dashboard
- Story Workspace
- Profile
- Settings

---

## Backend

- Supabase Authentication
- Story Database
- Story Storage

---

## AI Layer

- Prompt Builder
- Gemini SDK
- Story Generator
- Story DNA
- Learning Package
- Illustration Prompt Generator
- Imagen Integration
- Narration Engine

---

# Design Principle

One responsibility per service.

No duplicate logic.

No unnecessary complexity.

Everything should connect into one unified pipeline.

---

# Development Principle

Build only what improves WonderTales.

Do not copy competitors.

Improve ideas instead of cloning them.

---

# Current Development Phase

Integration Phase

Goal:

Connect all existing modules into one complete storytelling pipeline.