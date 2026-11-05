import { communityApi } from '@/lib/community-api';

export const dynamic = 'force-dynamic';
export const POST = (request) => communityApi(request, 'message-post');
export const DELETE = (request) => communityApi(request, 'message-delete');
