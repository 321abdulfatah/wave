import { NextResponse } from 'next/server'
import { transcriberStatus } from '@/lib/captions/transcriber'

export const dynamic = 'force-dynamic'

/** Which backend is running, and what that means for where the audio goes. */
export async function GET() {
  return NextResponse.json(transcriberStatus())
}
