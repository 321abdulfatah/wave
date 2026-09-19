import { NextResponse } from 'next/server'
import { classifyVisitor, visionAvailable } from '@/lib/agent/vision'
import { downloadSnapshot, isMockMode } from '@/lib/ring/client'
import { getEvent, upsertEvent } from '@/lib/store'
import { check, record } from '@/lib/ai/budget'

export const dynamic = 'force-dynamic'

/**
 * Pull a snapshot for an event and classify what is at the door.
 *
 * The frame is fetched, sent, and dropped. Nothing is written to disk — a
 * doorbell that archived every stranger's face would be a worse product than
 * the one it replaced, and the accessibility case does not license it.
 */
export async function POST(req: Request) {
  const { eventId } = (await req.json().catch(() => ({}))) as { eventId?: string }
  const event = eventId ? getEvent(eventId) : undefined
  if (!event) return NextResponse.json({ error: 'unknown event' }, { status: 404 })

  if (!visionAvailable()) {
    return NextResponse.json(
      { available: false, reason: 'No AWS credentials configured. Set AWS_REGION and AWS_ACCESS_KEY_ID.' },
      { status: 503 },
    )
  }
  if (isMockMode()) {
    return NextResponse.json(
      { available: false, reason: 'No Ring token, so there is no real frame to classify.' },
      { status: 503 },
    )
  }

  const budget = check('vision')
  if (!budget.allowed) {
    return NextResponse.json({ available: false, reason: budget.message }, { status: 429 })
  }

  try {
    // The snapshot endpoint answers 303 with a pre-signed URL; the bytes come
    // from a second GET. See FL-007 — a bodyless POST there returns 403, which
    // reads as an auth failure and is not.
    const { url } = await downloadSnapshot(event.deviceId, {
      at: new Date(event.startedAt).getTime(),
    })
    const img = await fetch(url)
    if (!img.ok) throw new Error(`Snapshot fetch failed: ${img.status}`)

    const result = await classifyVisitor(new Uint8Array(await img.arrayBuffer()))
    record('vision')

    // Only overwrite the event's own guess when the model is more sure than the
    // trigger was. A confident "unknown" should not erase a known courier.
    if (result.confidence > event.confidence && result.visitor !== 'unknown') {
      upsertEvent({ ...event, visitor: result.visitor, confidence: result.confidence })
    }

    return NextResponse.json({ available: true, ...result })
  } catch (err) {
    return NextResponse.json({ available: false, reason: (err as Error).message }, { status: 502 })
  }
}
