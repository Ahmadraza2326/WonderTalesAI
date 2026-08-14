-- Migration: 20260814210000_add_generation_quotas_and_cooldowns.sql
-- Description: Server-side atomic story generation quotas and cooldown enforcement

-- 1. Create table for tracking generation quotas per user
create table if not exists public.user_generation_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stories_generated_today integer not null default 0 check (stories_generated_today >= 0),
  last_generation_date date not null default current_date,
  last_generated_at timestamptz not null default '1970-01-01 00:00:00+00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.user_generation_quotas enable row level security;

-- 3. RLS policy: users can only view their own quota
drop policy if exists "Users can view their own quota" on public.user_generation_quotas;
create policy "Users can view their own quota"
  on public.user_generation_quotas for select
  using (auth.uid() = user_id);

-- 4. Atomic quota consumption function
create or replace function public.consume_story_generation_quota(
  p_daily_limit integer default 10,
  p_cooldown_seconds integer default 20
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_record public.user_generation_quotas%rowtype;
  v_today date := current_date;
  v_now timestamptz := clock_timestamp();
  v_seconds_since_last integer;
begin
  -- 1. Identify caller
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object(
      'allowed', false,
      'code', 'UNAUTHENTICATED',
      'message', 'Authentication required to generate stories.'
    );
  end if;

  -- 2. Ensure row exists
  insert into public.user_generation_quotas (user_id, stories_generated_today, last_generation_date, last_generated_at)
  values (v_user_id, 0, v_today, '1970-01-01 00:00:00+00')
  on conflict (user_id) do nothing;

  -- 3. Lock row for atomic update
  select * into v_record
  from public.user_generation_quotas
  where user_id = v_user_id
  for update;

  -- 4. Reset daily counter if a new day has arrived
  if v_record.last_generation_date < v_today then
    v_record.stories_generated_today := 0;
    v_record.last_generation_date := v_today;
  end if;

  -- 5. Enforce server-side cooldown
  v_seconds_since_last := extract(epoch from (v_now - v_record.last_generated_at))::integer;
  if v_seconds_since_last < p_cooldown_seconds then
    return jsonb_build_object(
      'allowed', false,
      'code', 'COOLDOWN_ACTIVE',
      'message', format('Cooldown active. Please wait %s seconds before generating another story.', p_cooldown_seconds - v_seconds_since_last),
      'retry_after_seconds', p_cooldown_seconds - v_seconds_since_last,
      'stories_generated_today', v_record.stories_generated_today,
      'daily_limit', p_daily_limit
    );
  end if;

  -- 6. Enforce server-side daily quota
  if v_record.stories_generated_today >= p_daily_limit then
    return jsonb_build_object(
      'allowed', false,
      'code', 'DAILY_LIMIT_REACHED',
      'message', format('Daily limit of %s stories reached. Limit resets at midnight.', p_daily_limit),
      'stories_generated_today', v_record.stories_generated_today,
      'daily_limit', p_daily_limit
    );
  end if;

  -- 7. Atomically record consumption
  update public.user_generation_quotas
  set stories_generated_today = v_record.stories_generated_today + 1,
      last_generation_date = v_today,
      last_generated_at = v_now,
      updated_at = v_now
  where user_id = v_user_id;

  return jsonb_build_object(
    'allowed', true,
    'code', 'OK',
    'message', 'Quota granted.',
    'stories_generated_today', v_record.stories_generated_today + 1,
    'daily_limit', p_daily_limit,
    'remaining', p_daily_limit - (v_record.stories_generated_today + 1)
  );
end;
$$;

-- 5. Read-only quota inspector function for client status UX
create or replace function public.get_user_generation_quota(
  p_daily_limit integer default 10,
  p_cooldown_seconds integer default 20
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_record public.user_generation_quotas%rowtype;
  v_today date := current_date;
  v_now timestamptz := clock_timestamp();
  v_seconds_since_last integer := 999999;
  v_used integer := 0;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object(
      'authenticated', false,
      'used', 0,
      'daily_limit', p_daily_limit,
      'remaining', 0,
      'cooldown_remaining', 0
    );
  end if;

  select * into v_record
  from public.user_generation_quotas
  where user_id = v_user_id;

  if v_record.user_id is not null then
    if v_record.last_generation_date = v_today then
      v_used := v_record.stories_generated_today;
    else
      v_used := 0;
    end if;
    v_seconds_since_last := extract(epoch from (v_now - v_record.last_generated_at))::integer;
  end if;

  return jsonb_build_object(
    'authenticated', true,
    'used', v_used,
    'daily_limit', p_daily_limit,
    'remaining', greatest(0, p_daily_limit - v_used),
    'cooldown_remaining', greatest(0, p_cooldown_seconds - v_seconds_since_last)
  );
end;
$$;
