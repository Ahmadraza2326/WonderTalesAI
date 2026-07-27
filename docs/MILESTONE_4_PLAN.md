# Milestone 4 – Story Management

## Objective

Implement the first real product feature by allowing authenticated users to create, save, view, edit, and delete their own stories stored in Supabase.

---

## Scope

This milestone includes:

- Story creation form
- Save story to Supabase
- My Stories page
- Story detail page
- Edit story
- Delete story
- Loading and error states
- Authentication-aware behavior

No AI story generation yet.

---

## Database

Use the existing `stories` table.

Each story contains:

- title
- child_name
- child_age
- language
- theme
- moral
- characters
- story_length
- reading_level
- status
- created_at
- updated_at

---

## New Pages

### CreateStoryPage

Route:

/stories/new

Contains a form for creating stories.

---

### MyStoriesPage

Route:

/stories

Displays only the authenticated user's stories.

---

### StoryDetailPage

Route:

/stories/:id

Displays a single story.

---

## Components

Create reusable components:

- StoryForm
- StoryCard
- StoryList

---

## Story Form Fields

- Story Title
- Child Name
- Child Age
- Language
- Theme
- Moral
- Characters
- Story Length
- Reading Level

Validation should be simple and beginner-friendly.

---

## Navigation

Add a new navigation item:

My Stories

Dashboard should include:

Create Story button.

---

## User Flow

Sign in

↓

Dashboard

↓

Create Story

↓

Save

↓

Redirect to My Stories

↓

Open Story

↓

Edit or Delete

---

## UX

Show:

- loading spinner
- empty state
- success message
- friendly validation errors

---

## Accessibility

- labels for every field
- keyboard navigation
- visible focus states
- semantic HTML

---

## Verification

Before completion:

- Create story
- Save story
- View own stories
- Edit story
- Delete story
- Refresh browser
- Data persists
- Build succeeds
- No TypeScript errors

---

No AI generation is part of this milestone.
