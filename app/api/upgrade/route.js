import { NextResponse } from 'next/server';
import { buyUpgrade } from '@/lib/game';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { upgradeId } = await request.json();
  const result = buyUpgrade(upgradeId);
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
