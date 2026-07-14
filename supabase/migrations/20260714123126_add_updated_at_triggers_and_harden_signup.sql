-- updated_at maintained by the DB, not trusted from clients.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_module_progress_updated_at on public.module_progress;
create trigger set_module_progress_updated_at
  before update on public.module_progress
  for each row execute function public.set_updated_at();

-- Signup trigger: never let a profile-insert failure kill account creation;
-- truncate to the profile CHECK limits and tolerate replays.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), split_part(new.email, '@', 1)), 80),
    left(new.email, 320)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
