# Folder Structure

This document describes the current repository layout and the responsibility of each major folder in the WonderTalesAI project.

## Top-Level Structure

```text
root/
  docs/                  # product and architecture documentation
  public/                # static assets served by the app
  src/                   # application source code
  package.json           # project scripts and dependencies
  vite.config.ts        # Vite configuration
  tsconfig*.json         # TypeScript configuration files
```

## Documentation Folder

The docs folder is the home of planning and architecture materials. It includes product requirements, milestone plans, architecture notes, and architecture decision records.

## Source Folder

The src folder contains the application implementation and is organized by concern.

### src/components

Contains reusable UI building blocks. This includes:

- layout components such as headers, footers, and page shells
- story-specific components such as story viewers and reading panels
- shared UI primitives such as buttons, loaders, and empty states

### src/pages

Contains route-level page components, such as the landing page, dashboard, story workspace, profile, and settings screens.

### src/routes

Defines the application routing structure and protected route behavior.

### src/context

Stores application-wide state and shared context providers.

### src/hooks

Contains reusable hooks for UI and application behavior.

### src/lib

Holds shared constants, client configuration, and integration helpers that support the app.

### src/services

Contains the main business logic for the app, including:

- story generation
- learning package generation
- auth-related flows
- AI service orchestration
- narration and illustration services

The services folder is one of the most important areas for understanding how the product works.

### src/services/ai

Contains the AI-specific implementation details, including provider adapters, prompt handling, parsing, and content validation logic.

### src/types

Defines shared TypeScript interfaces and domain models used across the application.

### src/styles

Contains design tokens and global styling rules.

### src/assets

Stores local static assets used by the product UI.

## Public Folder

The public folder contains static files that are served directly by the app, such as icons and other public assets.

## Why This Structure Matters

The project structure is intentionally split by responsibility so that:

- UI concerns stay separate from business logic
- AI behaviors are isolated in service layers
- feature pages remain easy to navigate
- future growth can be handled without major rewrites
