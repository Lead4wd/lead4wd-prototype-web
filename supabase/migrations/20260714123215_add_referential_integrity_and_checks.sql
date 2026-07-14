-- Referential integrity: module_id columns now reference modules(id).
-- Plain FK (RESTRICT) so a module can't be deleted while user data references
-- it — deleting curriculum then requires an explicit, conscious cleanup.
alter table public.module_progress
  add constraint module_progress_module_id_fkey
  foreign key (module_id) references public.modules(id);
alter table public.question_attempts
  add constraint question_attempts_module_id_fkey
  foreign key (module_id) references public.modules(id);
alter table public.engagement_events
  add constraint engagement_events_module_id_fkey
  foreign key (module_id) references public.modules(id);

-- Support the FKs + admin per-module queries.
create index if not exists module_progress_module_idx on public.module_progress (module_id);
create index if not exists question_attempts_module_idx on public.question_attempts (module_id);
create index if not exists engagement_events_module_idx on public.engagement_events (module_id);

-- Content-table sanity (writes are service-role only, but constraints catch
-- a bad seed before it ships broken content).
alter table public.modules
  add constraint modules_id_len       check (char_length(id) between 1 and 40),
  add constraint modules_title_len    check (char_length(title) between 1 and 200),
  add constraint modules_summary_len  check (char_length(summary) <= 500),
  add constraint modules_cluster_len  check (char_length(cluster) between 1 and 120),
  add constraint modules_minutes_rng  check (minutes between 1 and 120),
  add constraint modules_sort_rng     check (sort_order between 0 and 1000),
  add constraint modules_skill_enum   check (skill in ('communication','listening','delegation','feedback','conflict')),
  add constraint modules_screens_arr  check (jsonb_typeof(screens) = 'array');

alter table public.assessment_questions
  add constraint assessment_questions_skill_enum
  check (skill in ('communication','listening','delegation','feedback','conflict'));

alter table public.locked_clusters
  add constraint locked_clusters_name_len check (char_length(name) between 1 and 120),
  add constraint locked_clusters_name_uniq unique (name);

-- User-data sanity that was missing.
alter table public.module_progress
  add constraint module_progress_quiz_rng
  check (quiz_correct >= 0 and quiz_total >= 0 and quiz_correct <= quiz_total and quiz_total <= 1000);

alter table public.question_attempts
  add constraint question_attempts_module_len check (char_length(module_id) <= 100);

alter table public.profiles
  add constraint profiles_email_len check (email is null or char_length(email) <= 320);
