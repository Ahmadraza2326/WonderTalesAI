-- Migration: 20260815220000_add_dev_quota_reset.sql
-- Description: Development-only helper to reset an authenticated user's daily quota in Supabase.

create or replace function public.dev_reset_user_quota()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  -- 1. Strictly identify authenticated caller via JWT
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object(
      'success', false,
      'error', 'UNAUTHENTICATED',
      'message', 'Authentication required to reset quota.'
    );
  end if;

  -- 2. Upsert reset record for the authenticated user
  insert into public.user_generation_quotas (
    user_id,
    stories_generated_today,
    last_generation_date,
    last_generated_at,
    updated_at
  )
  values (
    v_user_id,
    0,
    current_date,
    '1970-01-01 00:00:00+00',
    now()
  )
  on conflict (user_id) do update
  set stories_generated_today = 0,
      last_generation_date = current_date,
      last_generated_at = '1970-01-01 00:00:00+00',
      updated_at = now();

  return jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'stories_generated_today', 0,
    'daily_limit', 10,
    'remaining', 10,
    'cooldown_remaining', 0,
    'message', 'Development quota successfully reset to 0/10.'
  );
end;
$$;
