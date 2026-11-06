begin;

create table public.player_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz not null
);
create index player_presence_last_seen on public.player_presence (last_seen_at);

alter table public.player_presence enable row level security;
revoke all on public.player_presence from public, anon, authenticated;
grant select, insert, update, delete on public.player_presence to service_role;

create or replace function public.heartbeat_player_presence(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  online_count integer;
begin
  insert into public.player_presence as presence (user_id, last_seen_at)
    values (p_user_id, v_now)
    on conflict (user_id) do update set last_seen_at = excluded.last_seen_at
      where presence.last_seen_at < v_now - interval '30 seconds';

  delete from public.player_presence
    where last_seen_at < v_now - interval '1 day';

  select count(*)::integer into online_count
    from public.player_presence
    where last_seen_at >= v_now - interval '2 minutes';

  return online_count;
end;
$$;
revoke all on function public.heartbeat_player_presence(uuid) from public, anon, authenticated;
grant execute on function public.heartbeat_player_presence(uuid) to service_role;

commit;
