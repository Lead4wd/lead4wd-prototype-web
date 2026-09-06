-- Let a half-finished lesson be resumed.
--
-- module_progress only ever got a row when a module was COMPLETED, so closing
-- the tab on screen 7 of 12 lost the lot: the position, every answer, and the
-- reflection they had started writing. For micro-learning done on a phone
-- between meetings, being interrupted is the normal case, not the edge case.
--
-- The existing status CHECK already allows 'started', so no new vocabulary is
-- needed — that value simply had nothing writing it until now.
alter table public.module_progress
  add column if not exists screen_idx integer not null default 0,
  add column if not exists draft jsonb;

alter table public.module_progress
  drop constraint if exists module_progress_screen_idx_range;
alter table public.module_progress
  add constraint module_progress_screen_idx_range check (screen_idx >= 0 and screen_idx <= 499);

-- Bound the draft so a client cannot use it as free storage. 200 KB is far more
-- than the largest real module's answers.
alter table public.module_progress
  drop constraint if exists module_progress_draft_size;
alter table public.module_progress
  add constraint module_progress_draft_size
  check (draft is null or pg_column_size(draft) <= 200000);

-- module_progress_quiz_range is fully implied by module_progress_quiz_rng,
-- which adds the upper bound. Keeping both means every write is checked twice
-- and a failure names an arbitrary one of them.
alter table public.module_progress drop constraint if exists module_progress_quiz_range;
