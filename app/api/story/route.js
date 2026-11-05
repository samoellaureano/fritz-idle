import { NextResponse } from 'next/server';
import { recordStoryMemory } from '@/lib/game';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { chapterId } = await request.json();
  const result = recordStoryMemory(chapterId);
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
