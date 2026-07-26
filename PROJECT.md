# WonderTalesAI Project Guide

## Vision
WonderTalesAI is a calm, imaginative storytelling experience built with React and TypeScript. The product will grow from a polished landing page into a multi-page app with shared layout, simple user-facing pages, and later AI-assisted storytelling features.

## Tech Stack
- React 19
- TypeScript
- Vite
- React Router
- CSS variables for styling

## Folder Structure
- src/
  - App.tsx
  - main.tsx
  - components/
    - layout/
    - ui/
  - pages/
  - routes/
  - hooks/
  - services/
  - styles/
  - lib/
  - types/
  - context/

## Coding Conventions
- Keep components small and easy to read.
- Favor simple TypeScript interfaces over heavy abstractions.
- Reuse shared UI and layout components where appropriate.
- Preserve the app as runnable after each milestone step.
- Avoid unnecessary libraries and over-engineering.

## Development Commands
- npm install
- npm run dev
- npm run build

## Milestone Roadmap
1. Milestone 1: Landing page experience
2. Milestone 2: Shared multi-page shell, routing, simple pages, lightweight theme
3. Future milestones: auth, persistence, AI integration, and richer storytelling flows

## Git Workflow
- Create a new branch for each milestone or feature.
- Commit changes with clear, descriptive messages.
- Keep the main branch stable.
- Validate the app before merging.
