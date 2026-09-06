-- When the coach last followed up on the plan a manager committed to.
--
-- The proactive check-in (GET /me/ai/checkin) needs two dates to decide whether
-- to surface a nudge: when they committed, which lives in question_attempts, and
-- when they were last asked about it — which had nowhere to live until now.
-- Without it the nudge would reappear on every dashboard load.

alter table public.profiles
  add column if not exists last_checkin_at timestamptz;

-- Column privileges, same rule as the rest of this table: a table-level GRANT
-- covers ALL columns and would re-open is_admin, so grant the single column.
-- The API stamps this under the caller's own JWT, so the owner-only RLS policy
-- on profiles is what keeps one user from marking another as checked in.
grant update (last_checkin_at) on table public.profiles to authenticated;
