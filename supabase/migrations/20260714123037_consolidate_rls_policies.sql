-- Rewrites all user-table RLS policies to fix three linter findings at once:
-- 1. auth.uid() wrapped in (select ...) so it's evaluated once per query, not per row.
-- 2. owner + admin SELECT merged into one policy (no duplicate permissive policies).
-- 3. scoped TO authenticated (anon has no business on user tables; content tables
--    keep their public read policies unchanged).

-- profiles ------------------------------------------------------------------
drop policy if exists profiles_owner_select on public.profiles;
drop policy if exists profiles_admin_read   on public.profiles;
drop policy if exists profiles_owner_insert on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;
drop policy if exists profiles_owner_delete on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
create policy profiles_insert on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy profiles_delete on public.profiles for delete to authenticated
  using (id = (select auth.uid()));

-- onboarding_answers ---------------------------------------------------------
drop policy if exists onboarding_answers_owner_all  on public.onboarding_answers;
drop policy if exists onboarding_answers_admin_read on public.onboarding_answers;
create policy onboarding_answers_select on public.onboarding_answers for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy onboarding_answers_insert on public.onboarding_answers for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy onboarding_answers_update on public.onboarding_answers for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy onboarding_answers_delete on public.onboarding_answers for delete to authenticated
  using (user_id = (select auth.uid()));

-- assessment_answers ---------------------------------------------------------
drop policy if exists assessment_answers_owner_all  on public.assessment_answers;
drop policy if exists assessment_answers_admin_read on public.assessment_answers;
create policy assessment_answers_select on public.assessment_answers for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy assessment_answers_insert on public.assessment_answers for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy assessment_answers_update on public.assessment_answers for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy assessment_answers_delete on public.assessment_answers for delete to authenticated
  using (user_id = (select auth.uid()));

-- module_progress -------------------------------------------------------------
drop policy if exists module_progress_owner_all  on public.module_progress;
drop policy if exists module_progress_admin_read on public.module_progress;
create policy module_progress_select on public.module_progress for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy module_progress_insert on public.module_progress for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy module_progress_update on public.module_progress for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy module_progress_delete on public.module_progress for delete to authenticated
  using (user_id = (select auth.uid()));

-- question_attempts ------------------------------------------------------------
drop policy if exists question_attempts_owner_all  on public.question_attempts;
drop policy if exists question_attempts_admin_read on public.question_attempts;
create policy question_attempts_select on public.question_attempts for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy question_attempts_insert on public.question_attempts for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy question_attempts_update on public.question_attempts for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy question_attempts_delete on public.question_attempts for delete to authenticated
  using (user_id = (select auth.uid()));

-- engagement_events (immutable log: select + insert only) ----------------------
drop policy if exists engagement_owner_select on public.engagement_events;
drop policy if exists engagement_owner_insert on public.engagement_events;
drop policy if exists engagement_admin_read   on public.engagement_events;
create policy engagement_events_select on public.engagement_events for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy engagement_events_insert on public.engagement_events for insert to authenticated
  with check (user_id = (select auth.uid()));
