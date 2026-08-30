-- Persisted AI coach chats. Until now conversations lived only in React state,
-- so a refresh lost both the transcript and the model's memory of it.

create table if not exists public.ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null default 'New chat' check (char_length(title) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ai_conversations_user_updated_idx
  on public.ai_conversations (user_id, updated_at desc);

create table if not exists public.ai_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  -- Denormalised so RLS can be enforced without a join on every row.
  user_id         uuid not null references auth.users(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null check (char_length(content) <= 8000),
  created_at      timestamptz not null default now()
);
create index if not exists ai_messages_conversation_idx
  on public.ai_messages (conversation_id, created_at);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages      enable row level security;

-- Same shape as every other user table: owner-only, auth.uid() wrapped in a
-- subselect so it is evaluated once per query, scoped TO authenticated.
-- Deliberately NO admin read policy — coaching chats are the most sensitive
-- thing a user writes here, and no one else needs to read them.
create policy ai_conversations_select on public.ai_conversations for select to authenticated
  using (user_id = (select auth.uid()));
create policy ai_conversations_insert on public.ai_conversations for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy ai_conversations_update on public.ai_conversations for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy ai_conversations_delete on public.ai_conversations for delete to authenticated
  using (user_id = (select auth.uid()));

create policy ai_messages_select on public.ai_messages for select to authenticated
  using (user_id = (select auth.uid()));
create policy ai_messages_insert on public.ai_messages for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy ai_messages_delete on public.ai_messages for delete to authenticated
  using (user_id = (select auth.uid()));

-- updated_at is maintained by the DB, never trusted from a client.
drop trigger if exists set_ai_conversations_updated_at on public.ai_conversations;
create trigger set_ai_conversations_updated_at
  before update on public.ai_conversations
  for each row execute function public.set_updated_at();

-- Column privileges. A table-level grant covers ALL columns and would let a
-- client forge created_at/updated_at or rewrite history, so grant only what the
-- app legitimately writes. Messages are append-only: no UPDATE grant at all.
revoke insert, update on table public.ai_conversations from anon, authenticated;
revoke insert, update on table public.ai_messages      from anon, authenticated;

grant insert (id, user_id, title) on table public.ai_conversations to authenticated;
grant update (title)              on table public.ai_conversations to authenticated;
grant insert (conversation_id, user_id, role, content) on table public.ai_messages to authenticated;
