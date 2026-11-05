import { gameApi } from '@/lib/game-api';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  return gameApi(request, 'buy');
}
