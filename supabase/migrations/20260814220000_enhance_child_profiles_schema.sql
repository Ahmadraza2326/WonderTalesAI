-- ==============================================================================
-- Migration: Enhance child_profiles schema for ORBIS personalization (Phase 8A)
-- ==============================================================================

alter table if exists public.child_profiles
  add column if not exists avatar text default '🌟',
  add column if not exists preferred_language text default 'English',
  add column if not exists favorite_theme text,
  add column if not exists updated_at timestamptz default now();

-- Ensure performance index on parent_id
create index if not exists idx_child_profiles_parent_id on public.child_profiles(parent_id);

-- Ensure RLS is active
alter table if exists public.child_profiles enable row level security;
