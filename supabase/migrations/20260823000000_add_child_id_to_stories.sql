-- ==============================================================================
-- Migration: Add child_id to stories for canonical identity
-- ==============================================================================

alter table if exists public.stories
  add column if not exists child_id uuid references public.child_profiles(id) on delete set null;
