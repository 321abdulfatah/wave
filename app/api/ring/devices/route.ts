import { NextResponse } from 'next/server'
import { isMockMode, listDevices, RingError } from '@/lib/ring/client'
import { MOCK_DEVICES, localiseMock } from '@/lib/ring/mock'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const locale = new URL(req.url).searchParams.get('locale') ?? 'en-US'
  const mockDevices = localiseMock(locale).devices
  if (isMockMode()) {
    return NextResponse.json({ devices: mockDevices, mock: true })
  }
  try {
    return NextResponse.json({ devices: await listDevices(), mock: false })
  } catch (err) {
    const status = err instanceof RingError ? err.status : 500
    // Fall back rather than blanking the wall display — a hallway screen that
    // goes empty when the network blips is worse than one showing stale devices.
    return NextResponse.json(
      { devices: mockDevices, mock: true, error: (err as Error).message },
      { status: status === 401 ? 200 : status },
    )
  }
}
