import { gameApi } from '@/lib/game-api';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  return gameApi(request, 'game');
}
