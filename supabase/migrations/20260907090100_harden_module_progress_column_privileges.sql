-- Column privileges for module_progress, done the way that actually works.
--
-- THE TRAP, for whoever writes the next one of these: a table-level
-- `GRANT INSERT/UPDATE ON <table>` covers EVERY column, including columns added
-- afterwards, and it takes precedence over a column-level REVOKE. So
--
--   revoke update (updated_at) on table ... from authenticated;
--
-- reports success and changes nothing while that table-level grant stands.
-- module_progress had one, which is why updated_at and user_id were writable by
-- any signed-in client. Revoke the privilege on the TABLE, then grant it back
-- per column — the same pattern already used on profiles and ai_conversations.
revoke insert, update on table public.module_progress from anon, authenticated;

-- Everything the app legitimately writes. Not updated_at: it is set by the
-- column default on insert and by set_module_progress_updated_at on update.
grant insert (user_id, module_id, status, quiz_correct, quiz_total, score_pct, reflection, completed_at, screen_idx, draft)
  on table public.module_progress to authenticated;

-- Not user_id either: a progress row must never change owner.
grant update (module_id, status, quiz_correct, quiz_total, score_pct, reflection, completed_at, screen_idx, draft)
  on table public.module_progress to authenticated;
