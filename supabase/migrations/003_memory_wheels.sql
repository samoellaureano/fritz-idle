begin;

-- Append columns to preserve the existing view contract during rolling deployment.
-- Badges and rank always derive from service-written saves, never editable profiles.
create or replace view public.community_ranking with (security_invoker = true) as
select p.id as profile_id, p.user_id, p.nickname, p.avatar_id,
  coalesce((s.state ->> 'seeds')::numeric, 0) as seeds,
  coalesce(jsonb_array_length(s.state -> 'memories'), 0) as memories,
  coalesce((s.state ->> 'lifetime')::numeric, 0) as lifetime,
  row_number() over (
    order by coalesce((s.state ->> 'wheels')::numeric, 0) desc,
      coalesce((s.state ->> 'seeds')::numeric, 0) desc,
      coalesce(jsonb_array_length(s.state -> 'memories'), 0) desc,
      coalesce((s.state ->> 'lifetime')::numeric, 0) desc,
      p.created_at asc, p.id asc
  ) as rank,
  coalesce((s.state ->> 'wheels')::numeric, 0) as wheels,
  coalesce((s.state ->> 'rebirths')::numeric, 0) as rebirths
from public.player_profiles p
left join public.game_saves s on s.user_id = p.user_id;
revoke all on public.community_ranking from public, anon, authenticated;
grant select on public.community_ranking to service_role;

commit;
