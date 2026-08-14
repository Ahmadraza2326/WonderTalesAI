-- Migration: 20260814200000_enable_core_rls_policies.sql
-- Description: Enables Row Level Security (RLS) and strict user-ownership policies for core tables

-- 1. Enable RLS on public tables
alter table if exists public.stories enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.child_profiles enable row level security;

-- 2. Policies for public.stories
drop policy if exists "Users can view their own stories" on public.stories;
create policy "Users can view their own stories"
  on public.stories for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own stories" on public.stories;
create policy "Users can insert their own stories"
  on public.stories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own stories" on public.stories;
create policy "Users can update their own stories"
  on public.stories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own stories" on public.stories;
create policy "Users can delete their own stories"
  on public.stories for delete
  using (auth.uid() = user_id);

-- 3. Policies for public.profiles
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Policies for public.child_profiles
drop policy if exists "Parents can view their child profiles" on public.child_profiles;
create policy "Parents can view their child profiles"
  on public.child_profiles for select
  using (auth.uid() = parent_id);

drop policy if exists "Parents can insert their child profiles" on public.child_profiles;
create policy "Parents can insert their child profiles"
  on public.child_profiles for insert
  with check (auth.uid() = parent_id);

drop policy if exists "Parents can update their child profiles" on public.child_profiles;
create policy "Parents can update their child profiles"
  on public.child_profiles for update
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

drop policy if exists "Parents can delete their child profiles" on public.child_profiles;
create policy "Parents can delete their child profiles"
  on public.child_profiles for delete
  using (auth.uid() = parent_id);
