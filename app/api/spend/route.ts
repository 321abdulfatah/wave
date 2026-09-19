import { NextResponse } from 'next/server'
import { spendToday } from '@/lib/ai/budget'

export const dynamic = 'force-dynamic'

/** What today has cost, and what the caps allow it to cost at most. */
export async function GET() {
  return NextResponse.json(spendToday())
}
