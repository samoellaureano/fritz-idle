import { communityApi } from '@/lib/community-api';

export const dynamic = 'force-dynamic';
export const GET = (request) => communityApi(request, 'board');
