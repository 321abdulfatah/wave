import { NextResponse } from 'next/server'
import { listMemory } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ memory: listMemory() })
}
