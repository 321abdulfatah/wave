import { NextResponse } from 'next/server'
import { isMockMode, startWhepSession, RingError } from '@/lib/ring/client'

export const dynamic = 'force-dynamic'

/**
 * WHEP signalling proxy.
 *
 * Ring rejects browser origins outright, so the SDP offer/answer exchange has
 * to be relayed by the server. The browser owns the peer connection and the
 * media path; this route only carries the handshake and never sees a frame.
 */
export async function POST(req: Request) {
  if (isMockMode()) {
    return NextResponse.json({ error: 'No RING_ACCESS_TOKEN — live view unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const deviceId = searchParams.get('deviceId')
  if (!deviceId) {
    return NextResponse.json({ error: 'deviceId is required' }, { status: 400 })
  }

  const offer = await req.text()
  if (!offer.startsWith('v=0')) {
    return NextResponse.json({ error: 'Body must be an SDP offer' }, { status: 400 })
  }

  try {
    const { sdpAnswer, location } = await startWhepSession(deviceId, offer)
    return new NextResponse(sdpAnswer, {
      status: 201,
      headers: {
        'Content-Type': 'application/sdp',
        // The browser needs this to tear the session down; Ring keeps billing
        // a live view until the session is explicitly deleted.
        'X-Whep-Session': location,
      },
    })
  } catch (err) {
    const status = err instanceof RingError ? err.status : 500
    return NextResponse.json({ error: (err as Error).message }, { status })
  }
}

/** Tear down a live view session. */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const session = searchParams.get('session')
  if (!session) return NextResponse.json({ error: 'session is required' }, { status: 400 })

  const url = session.startsWith('http')
    ? session
    : `${process.env.RING_API_BASE ?? 'https://api.amazonvision.com'}${session}`

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${process.env.RING_ACCESS_TOKEN}` },
  })
  return NextResponse.json({ ok: res.ok, status: res.status })
}
