import { gameApi } from '@/lib/game-api';

export async function POST(request) {
  return gameApi(request, 'share');
}
