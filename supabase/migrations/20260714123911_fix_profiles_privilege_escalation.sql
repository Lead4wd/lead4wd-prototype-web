-- CRITICAL fix. The default Supabase table-level INSERT/UPDATE grant covers ALL
-- columns, so any authenticated user could set profiles.is_admin = true on their
-- own row via direct PostgREST (the anon key is public in the web bundle) — a
-- privilege-escalation to super-admin. A column-level revoke alone does nothing
-- while the table-level grant stands, so we drop the table write grants and
-- re-grant only the user-editable columns. is_admin + email are now writable only
-- by the SECURITY DEFINER signup trigger / service role.
revoke insert, update on table public.profiles from anon, authenticated;

-- Profiles belong to authenticated users only; anon gets no write at all.
grant insert (id, display_name, role, language, streak, onboarded) on table public.profiles to authenticated;
grant update (display_name, role, language, streak, onboarded)     on table public.profiles to authenticated;
