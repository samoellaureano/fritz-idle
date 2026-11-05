import 'server-only';
import { adminClient } from './server';

export function cloudStore() {
  const client = adminClient();
  return {
    async read(userId) {
      const { data, error } = await client.from('game_saves').select('state, version').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data;
    },
    async create(userId, state) {
      const { error } = await client.from('game_saves').insert({ user_id: userId, state, version: 0 });
      if (error && error.code !== '23505') throw error;
    },
    async compareAndSet(userId, version, state) {
      const { data, error } = await client.from('game_saves')
        .update({ state, version: version + 1, updated_at: new Date().toISOString() })
        .eq('user_id', userId).eq('version', version).select('version');
      if (error) throw error;
      return data.length === 1;
    },
  };
}
