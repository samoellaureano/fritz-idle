begin;

create table public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 3 and 24 and nickname ~ '^[[:alnum:]_-]+$'),
  avatar_id text not null check (avatar_id in ('fritz', 'francisca', 'fritz-alt', 'juarez-machado', 'schwanke')),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index player_profiles_nickname_unique on public.player_profiles (lower(nickname));

create table public.community_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.player_profiles(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 160 and text !~ '[[:cntrl:]]'),
  created_at timestamptz not null default now()
);
create index community_messages_latest on public.community_messages (created_at desc, id desc);

alter table public.player_profiles enable row level security;
alter table public.community_messages enable row level security;
revoke all on public.player_profiles, public.community_messages from public, anon, authenticated;
grant select, insert, update, delete on public.player_profiles, public.community_messages to service_role;

-- Progress comes from authoritative saves, never from profile or browser fields.
create view public.community_ranking with (security_invoker = true) as
select p.id as profile_id, p.user_id, p.nickname, p.avatar_id,
  coalesce((s.state ->> 'seeds')::numeric, 0) as seeds,
  coalesce(jsonb_array_length(s.state -> 'memories'), 0) as memories,
  coalesce((s.state ->> 'lifetime')::numeric, 0) as lifetime,
  row_number() over (
    order by coalesce((s.state ->> 'seeds')::numeric, 0) desc,
      coalesce(jsonb_array_length(s.state -> 'memories'), 0) desc,
      coalesce((s.state ->> 'lifetime')::numeric, 0) desc,
      p.created_at asc, p.id asc
  ) as rank
from public.player_profiles p
left join public.game_saves s on s.user_id = p.user_id;
revoke all on public.community_ranking from public, anon, authenticated;
grant select on public.community_ranking to service_role;

-- A row lock serializes posts across tabs and devices, including the first post.
create function public.post_community_message(p_user_id uuid, p_text text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  profile public.player_profiles%rowtype;
  message public.community_messages%rowtype;
  posted_at timestamptz;
  retry_after integer;
begin
  select * into profile from public.player_profiles where user_id = p_user_id for update;
  if not found then return jsonb_build_object('error', 'profile_required'); end if;
  posted_at := clock_timestamp();
  if profile.last_message_at is not null and profile.last_message_at > posted_at - interval '60 seconds' then
    retry_after := greatest(1, ceil(extract(epoch from profile.last_message_at + interval '60 seconds' - posted_at))::integer);
    return jsonb_build_object('error', 'cooldown', 'retryAfter', retry_after);
  end if;
  insert into public.community_messages (profile_id, text, created_at)
    values (profile.id, p_text, posted_at) returning * into message;
  update public.player_profiles set last_message_at = posted_at where id = profile.id;
  return jsonb_build_object('id', message.id, 'created_at', message.created_at);
end;
$$;
revoke all on function public.post_community_message(uuid, text) from public, anon, authenticated;
grant execute on function public.post_community_message(uuid, text) to service_role;

commit;
