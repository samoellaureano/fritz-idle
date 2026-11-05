import { NextResponse } from 'next/server';
import { buy } from '@/lib/game';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { generatorId } = await request.json();
  const result = buy(generatorId);
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
