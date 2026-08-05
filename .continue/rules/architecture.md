# ORBIS ARCHITECTURE

Project Name:
Orbis

Company:
DINARYX

--------------------------------------------------

MISSION

Orbis is an AI-powered educational storytelling platform.

The product is NOT a story generator.

Stories are only the beginning.

Every generated story becomes a complete educational learning experience.

--------------------------------------------------

HIGH LEVEL PIPELINE

Story Request

↓

Story Generation

↓

Learning Package

↓

WonderBrain

↓

Asset Engine

↓

StoryBook

↓

Narration

↓

Workspace

↓

Learning Activities

↓

Progress Tracking

--------------------------------------------------

SOURCE OF TRUTH

StoryRecord

contains:

- child
- age
- language
- theme
- genre
- reading level
- story length
- custom instructions

Everything starts here.

--------------------------------------------------

STORY ENGINE

Responsible ONLY for:

- generating story

Produces:

generatedStory

Never generates:

- quizzes
- vocabulary
- narration
- images

--------------------------------------------------

LEARNING ENGINE

Consumes:

StoryRecord

generatedStory

Produces:

LearningPackage

LearningPackage contains:

- Story DNA
- Vocabulary
- Reading Skills
- Life Skills
- Critical Thinking
- Creative Activity
- Parent Guide
- Quiz Seeds
- Game Seeds
- Illustration Prompts
- Narration Metadata

--------------------------------------------------

WONDER BRAIN

WonderBrain is the central intelligence object.

It combines:

generatedStory

LearningPackage

StoryBook

Narration

WonderBrain is the single object passed to UI.

--------------------------------------------------

ASSET ENGINE

Consumes:

StoryRecord

LearningPackage

Produces:

StoryBook

Narration

Future:

Illustrations

Animations

Voice Assets

--------------------------------------------------

STORYBOOK

StoryBook consists of pages.

Each page contains:

- page number
- text
- illustration prompt
- illustration url

--------------------------------------------------

NARRATION

Narration contains:

- scenes

Each scene contains:

- voice
- narration text
- emotion
- timing
- sound effects

--------------------------------------------------

UI

UI never generates content.

UI only displays WonderBrain.

--------------------------------------------------

SERVICES

StoryOrchestrator

Coordinates everything.

Pipeline:

Story

↓

Learning

↓

Assets

↓

WonderBrain

--------------------------------------------------

SERVICE RESPONSIBILITIES

StoryGenerationService

ONLY creates stories.

LearningPackageGenerationService

ONLY creates LearningPackage.

LearningEngine

Coordinates learning generation.

AssetEngine

Coordinates StoryBook and Narration.

StoryBookGenerator

Creates StoryBook.

StoryBookPagination

Splits pages.

NarrationGenerator

Creates narration.

WonderBrain

Combines everything.

--------------------------------------------------

DO NOT

Never duplicate interfaces.

Never duplicate services.

Never create another Story Generator.

Never create another Learning Engine.

Never rename architecture.

Never bypass StoryOrchestrator.

Never place AI logic inside React components.

Never move business logic into UI.

--------------------------------------------------

TYPES

Every feature should use existing types.

Do not recreate:

StoryRecord

LearningPackage

StoryBook

Narration

WonderBrain

--------------------------------------------------

FOLDER STRUCTURE

services/

contains business logic

types/

contains interfaces

components/

contains UI

pages/

contains screens

routes/

contains routing

--------------------------------------------------

BUILD RULE

Every feature must compile.

Run:

npm run build

after every feature.

--------------------------------------------------

CODING STYLE

Small functions.

Reusable services.

Strict TypeScript.

Readable names.

Composition over duplication.

--------------------------------------------------

FUTURE MODULES

Progress Engine

Teacher Dashboard

Parent Dashboard

Reward System

Achievements

Reading Analytics

Learning Analytics

Voice Generation

Image Generation

Animation Generation

Gamification

Memory System

Adaptive Learning

--------------------------------------------------

FINAL RULE

Everything eventually becomes WonderBrain.

WonderBrain becomes the UI.

UI never contains business logic.