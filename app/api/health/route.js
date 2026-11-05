import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  db.prepare('SELECT 1').get();
  return NextResponse.json({ status: 'ok' });
}
