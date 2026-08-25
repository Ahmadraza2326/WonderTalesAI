-- ==============================================================================
-- Migration: Add Child Activity Rewards & Server-Enforced Idempotency & Streaks
-- ==============================================================================

-- 1. Add last_activity_date to child_profiles if not exists
alter table if exists public.child_profiles
  add column if not exists last_activity_date date;

-- 2. Create child_activity_rewards table for persistent reward tracking
create table if not exists public.child_activity_rewards (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  activity_type text not null,
  activity_id text not null,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  stars_awarded integer not null default 0 check (stars_awarded >= 0),
  created_at timestamptz not null default now(),
  constraint child_activity_rewards_unique_per_activity unique (child_id, activity_type, activity_id)
);

-- Index for quick lookup by child and activity
create index if not exists idx_child_activity_rewards_lookup 
  on public.child_activity_rewards (child_id, activity_type, activity_id);

-- Enable RLS on child_activity_rewards
alter table public.child_activity_rewards enable row level security;

-- Drop existing policies if any
drop policy if exists "Parents can view their children's activity rewards" on public.child_activity_rewards;

-- RLS Policy: Parents can view their children's activity rewards
create policy "Parents can view their children's activity rewards"
  on public.child_activity_rewards
  for select
  using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = child_activity_rewards.child_id
        and cp.parent_id = auth.uid()
    )
  );

-- 3. Drop previous versions of award_child_rewards function if signature differs
drop function if exists public.award_child_rewards(uuid, integer, integer);
drop function if exists public.award_child_rewards(uuid, text, text, integer, integer);

-- 4. Create authoritative, atomic, idempotent RPC for awarding activity rewards
create or replace function public.award_child_rewards(
  p_child_id uuid,
  p_activity_type text,
  p_activity_id text,
  p_xp_amount integer default 0,
  p_stars_amount integer default 0
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_parent_id uuid;
  v_current_xp integer;
  v_current_stars integer;
  v_current_streak integer;
  v_last_activity_date date;
  v_today date;
  v_new_streak integer;
  v_streak_incremented boolean := false;
  v_reward_id uuid;
  v_clean_activity_type text;
  v_clean_activity_id text;
begin
  -- 1. Input sanitization & checks
  if p_child_id is null then
    raise exception 'Child ID is required';
  end if;

  v_clean_activity_type := lower(trim(coalesce(p_activity_type, '')));
  v_clean_activity_id := trim(coalesce(p_activity_id, ''));

  if length(v_clean_activity_type) = 0 or length(v_clean_activity_type) > 50 then
    raise exception 'Invalid activity type';
  end if;

  if length(v_clean_activity_id) = 0 or length(v_clean_activity_id) > 100 then
    raise exception 'Invalid activity ID';
  end if;

  -- 2. Reward bounds verification (Server-Side Economy Integrity)
  if p_xp_amount < 0 or p_xp_amount > 500 then
    raise exception 'Invalid XP amount (must be between 0 and 500)';
  end if;

  if p_stars_amount < 0 or p_stars_amount > 100 then
    raise exception 'Invalid stars amount (must be between 0 and 100)';
  end if;

  -- 3. Fetch child profile and verify parent ownership
  select parent_id, coalesce(xp, 0), coalesce(stars, 0), coalesce(current_streak, 0), last_activity_date
    into v_parent_id, v_current_xp, v_current_stars, v_current_streak, v_last_activity_date
  from public.child_profiles
  where id = p_child_id;

  if v_parent_id is null or auth.uid() is null or auth.uid() != v_parent_id then
    raise exception 'Unauthorized';
  end if;

  -- 4. Check server-side idempotency: has this child already claimed this activity reward?
  select id into v_reward_id
  from public.child_activity_rewards
  where child_id = p_child_id
    and activity_type = v_clean_activity_type
    and activity_id = v_clean_activity_id;

  if v_reward_id is not null then
    -- Already awarded! Return safe status without minting duplicate rewards
    return jsonb_build_object(
      'success', true,
      'already_awarded', true,
      'xp_awarded', 0,
      'stars_awarded', 0,
      'current_xp', v_current_xp,
      'current_stars', v_current_stars,
      'current_streak', v_current_streak,
      'streak_incremented', false
    );
  end if;

  -- 5. Calculate Daily Streak (calendar day in UTC)
  v_today := current_date;

  if v_last_activity_date is null or v_last_activity_date < (v_today - 1) then
    -- Streak reset or first activity
    v_new_streak := 1;
    v_streak_incremented := true;
  elsif v_last_activity_date = (v_today - 1) then
    -- Consecutive day activity
    v_new_streak := v_current_streak + 1;
    v_streak_incremented := true;
  else
    -- Already logged activity today
    v_new_streak := v_current_streak;
    v_streak_incremented := false;
  end if;

  -- 6. Insert activity reward record (atomic idempotency lock)
  insert into public.child_activity_rewards (
    child_id,
    activity_type,
    activity_id,
    xp_awarded,
    stars_awarded
  ) values (
    p_child_id,
    v_clean_activity_type,
    v_clean_activity_id,
    p_xp_amount,
    p_stars_amount
  );

  -- 7. Update child profile totals
  update public.child_profiles
  set xp = v_current_xp + p_xp_amount,
      stars = v_current_stars + p_stars_amount,
      current_streak = v_new_streak,
      last_activity_date = v_today,
      updated_at = now()
  where id = p_child_id;

  -- 8. Return successful reward transaction result
  return jsonb_build_object(
    'success', true,
    'already_awarded', false,
    'xp_awarded', p_xp_amount,
    'stars_awarded', p_stars_amount,
    'current_xp', v_current_xp + p_xp_amount,
    'current_stars', v_current_stars + p_stars_amount,
    'current_streak', v_new_streak,
    'streak_incremented', v_streak_incremented
  );
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.award_child_rewards(uuid, text, text, integer, integer) to authenticated;
