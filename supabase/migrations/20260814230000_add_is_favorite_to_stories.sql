-- ==============================================================================
-- Migration: Add is_favorite to public.stories for Story Library Mastery (Phase 8C)
-- ==============================================================================

alter table if exists public.stories
  add column if not exists is_favorite boolean not null default false;

-- Composite index for fast user library queries filtered by favorites
create index if not exists idx_stories_user_favorite on public.stories(user_id, is_favorite);
