create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  version bigint not null default 0 check (version >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.game_saves enable row level security;
revoke all on public.game_saves from public, anon, authenticated;
grant select on public.game_saves to authenticated;
grant select, insert, update, delete on public.game_saves to service_role;

drop policy if exists "Read own progress" on public.game_saves;
create policy "Read own progress" on public.game_saves
  for select to authenticated using ((select auth.uid()) = user_id);
