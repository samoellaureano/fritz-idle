import { NextResponse } from 'next/server';
import { claimDaily } from '@/lib/game';

export const dynamic = 'force-dynamic';

export async function POST() {
  const result = claimDaily();
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
