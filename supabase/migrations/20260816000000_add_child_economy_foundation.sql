-- ==============================================================================
-- Migration: Add Economy Foundation (XP and Stars) to child_profiles
-- ==============================================================================

alter table if exists public.child_profiles
  add column if not exists xp integer not null default 0,
  add column if not exists stars integer not null default 0,
  add column if not exists current_streak integer not null default 0;

-- Create secure RPC for awarding rewards
create or replace function public.award_child_rewards(
  p_child_id uuid,
  p_xp_amount integer,
  p_stars_amount integer
) returns void
language plpgsql
security definer
as $$
declare
  v_parent_id uuid;
begin
  -- 1. Get the parent_id of the child profile
  select parent_id into v_parent_id from public.child_profiles where id = p_child_id;
  
  -- 2. Ensure the calling user is the parent of this child
  if v_parent_id is null or auth.uid() != v_parent_id then
    raise exception 'Unauthorized';
  end if;
  
  -- 3. Validate reward amounts (Economy Integrity)
  if p_xp_amount < 0 or p_xp_amount > 500 then
    raise exception 'Invalid XP amount';
  end if;
  if p_stars_amount < 0 or p_stars_amount > 100 then
    raise exception 'Invalid stars amount';
  end if;
  
  -- 4. Award the rewards
  update public.child_profiles
  set xp = coalesce(xp, 0) + p_xp_amount,
      stars = coalesce(stars, 0) + p_stars_amount,
      updated_at = now()
  where id = p_child_id;
end;
$$;

-- Grant execution permission to authenticated users
grant execute on function public.award_child_rewards(uuid, integer, integer) to authenticated;
