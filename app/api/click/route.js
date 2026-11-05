import { NextResponse } from 'next/server';
import { click } from '@/lib/game';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(click());
}
