create table if not exists public.story_translations (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_locale text not null,
  translated_content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, target_locale)
);

alter table public.story_translations enable row level security;

drop policy if exists "Users can read their own story translations" on public.story_translations;
create policy "Users can read their own story translations"
  on public.story_translations for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own story translations" on public.story_translations;
create policy "Users can insert their own story translations"
  on public.story_translations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own story translations" on public.story_translations;
create policy "Users can update their own story translations"
  on public.story_translations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own story translations" on public.story_translations;
create policy "Users can delete their own story translations"
  on public.story_translations for delete
  using (auth.uid() = user_id);
