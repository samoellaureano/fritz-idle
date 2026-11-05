import { newPlayer, runGameAction } from './game.js';

export class SaveConflictError extends Error {}

export async function executeSavedAction(store, userId, action, input = {}, clock = Date.now) {
  for (let attempt = 0; attempt < 20; attempt++) {
    let saved = await store.read(userId);
    if (!saved) {
      await store.create(userId, newPlayer(clock()));
      saved = await store.read(userId);
      if (!saved) throw new Error('Não foi possível criar o progresso.');
    }
    const result = runGameAction(saved.state, action, input, Math.max(clock(), saved.state.last_update));
    if (result.error) return result;
    if (await store.compareAndSet(userId, saved.version, result.player)) {
      return { ...result.state, saveVersion: saved.version + 1 };
    }
    await new Promise((resolve) => setTimeout(resolve, Math.min(50, (attempt + 1) * 5)));
  }
  throw new SaveConflictError('Muitas ações simultâneas. Aguarde um instante e tente novamente.');
}
