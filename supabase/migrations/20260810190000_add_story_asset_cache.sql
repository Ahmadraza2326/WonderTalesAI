create table if not exists public.story_assets (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_type text not null check (asset_type in ('storybook', 'narration')),
  content_hash text not null,
  generation_version integer not null default 1,
  status text not null default 'generated' check (status in ('generating', 'generated', 'failed')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, asset_type, content_hash, generation_version)
);

alter table public.story_assets enable row level security;

drop policy if exists "Users can read their own story assets" on public.story_assets;
create policy "Users can read their own story assets"
  on public.story_assets for select using (auth.uid() = user_id);

drop policy if exists "Users can create their own story assets" on public.story_assets;
create policy "Users can create their own story assets"
  on public.story_assets for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own story assets" on public.story_assets;
create policy "Users can update their own story assets"
  on public.story_assets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own story assets" on public.story_assets;
create policy "Users can delete their own story assets"
  on public.story_assets for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('story-assets', 'story-assets', false)
on conflict (id) do nothing;

drop policy if exists "Users can read their own story asset files" on storage.objects;
create policy "Users can read their own story asset files"
  on storage.objects for select
  using (bucket_id = 'story-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can upload their own story asset files" on storage.objects;
create policy "Users can upload their own story asset files"
  on storage.objects for insert
  with check (bucket_id = 'story-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own story asset files" on storage.objects;
create policy "Users can update their own story asset files"
  on storage.objects for update
  using (bucket_id = 'story-assets' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'story-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete their own story asset files" on storage.objects;
create policy "Users can delete their own story asset files"
  on storage.objects for delete
  using (bucket_id = 'story-assets' and (storage.foldername(name))[1] = auth.uid()::text);
