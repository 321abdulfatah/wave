import { NextResponse } from 'next/server'
import { transcriberStatus } from '@/lib/captions/transcriber'

export const dynamic = 'force-dynamic'

/** Which backend is running, and what that means for where the audio goes. */
export async function GET(req: Request) {
  const locale = new URL(req.url).searchParams.get('locale') ?? 'en-US'
  return NextResponse.json(transcriberStatus(locale))
}
