import { NextResponse } from 'next/server'
import { listMemory } from '@/lib/store'
import { localiseMock } from '@/lib/ring/mock'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const locale = new URL(req.url).searchParams.get('locale') ?? 'en-US'
  const stored = listMemory()
  const localised = localiseMock(locale).memory
  // Match on kind rather than label, since the label is the thing being swapped.
  return NextResponse.json({
    memory: stored.map((m) => localised.find((l) => l.kind === m.kind) ?? m),
  })
}
