import { NextResponse } from 'next/server'
import { pollerStatus, startPolling } from '@/lib/ring/poller'

export const dynamic = 'force-dynamic'

/** Diagnostics: is the Ring poller alive, and what has it seen? */
export async function GET() {
  return NextResponse.json(pollerStatus())
}

/** Force a (re)start, for when a token was replaced mid-session. */
export async function POST() {
  const result = await startPolling()
  return NextResponse.json({ ...result, ...pollerStatus() })
}
