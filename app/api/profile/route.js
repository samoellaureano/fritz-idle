import { communityApi } from '@/lib/community-api';

export const dynamic = 'force-dynamic';
export const GET = (request) => communityApi(request, 'profile-read');
export const POST = (request) => communityApi(request, 'profile-save');
