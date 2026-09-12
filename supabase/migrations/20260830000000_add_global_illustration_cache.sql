-- Global Illustration Cache Schema & Policies
-- Provides O(1) SHA-256 prompt-level cache lookup across stories

create table if not exists public.story_illustrations (
  id uuid primary key default gen_random_uuid(),
  prompt_hash text not null unique,
  canonical_prompt text not null,
  storage_path text not null,
  width integer not null default 512,
  height integer not null default 512,
  provider text not null default 'cloudflare-flux',
  cache_version integer not null default 1,
  mime_type text not null default 'image/jpeg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.story_illustrations enable row level security;

-- Authenticated users can read cached illustrations
drop policy if exists "Authenticated users can read cached illustrations" on public.story_illustrations;
create policy "Authenticated users can read cached illustrations"
  on public.story_illustrations for select
  to authenticated
  using (true);

-- Authenticated users can insert cached illustrations
drop policy if exists "Authenticated users can insert cached illustrations" on public.story_illustrations;
create policy "Authenticated users can insert cached illustrations"
  on public.story_illustrations for insert
  to authenticated
  with check (true);

-- Unique index for instant canonical prompt hash lookup
create index if not exists idx_story_illustrations_prompt_hash on public.story_illustrations(prompt_hash);

-- Storage Policies for Reusable Shared Illustrations in 'story-assets' bucket
-- Reusable illustrations are stored under the non-user-specific path: shared-illustrations/<prompt_hash>.<ext>
-- Private user assets (e.g. <user_id>/<story_id>/...) remain strictly private to their owning user.

drop policy if exists "Authenticated users can read shared illustrations" on storage.objects;
create policy "Authenticated users can read shared illustrations"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'story-assets'
    and (storage.foldername(name))[1] = 'shared-illustrations'
  );

drop policy if exists "Authenticated users can upload shared illustrations" on storage.objects;
create policy "Authenticated users can upload shared illustrations"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'story-assets'
    and (storage.foldername(name))[1] = 'shared-illustrations'
  );
