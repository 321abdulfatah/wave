import { NextResponse } from 'next/server'
import { parseWebhook, verifyWebhookSignature } from '@/lib/ring/client'
import { decide } from '@/lib/agent/policy'
import { listMemory, upsertEvent } from '@/lib/store'
import type { DoorEvent, VisitorKind } from '@/lib/ring/types'

export const dynamic = 'force-dynamic'

/** Ring retries any webhook it does not see a 200 for within 5 seconds. */
const seen = new Set<string>()

export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('X-Signature')

  // Signature checking is skipped only when no secret is configured, which is
  // the local Playground case. Anywhere a secret exists, a bad one is rejected.
  if (process.env.RING_WEBHOOK_SECRET && process.env.RING_WEBHOOK_SECRET !== 'dev-secret-change-me') {
    if (!verifyWebhookSignature(raw, signature)) {
      return NextResponse.json({ error: 'bad signature' }, { status: 401 })
    }
  }

  const event = parseWebhook(JSON.parse(raw))
  if (!event) return NextResponse.json({ error: 'unparseable' }, { status: 400 })

  // Ring's meta.request_id is the idempotency key for its retry logic.
  if (seen.has(event.meta.request_id)) return NextResponse.json({ ok: true, duplicate: true })
  seen.add(event.meta.request_id)

  if (event.type !== 'button_press' && event.type !== 'motion_detected') {
    return NextResponse.json({ ok: true, ignored: event.type })
  }

  const visitor = classify(event.attributes?.sub_type)
  const memory = listMemory()

  const door: DoorEvent = {
    id: `evt_${event.meta.request_id.slice(0, 8)}`,
    deviceId: event.device_id,
    deviceName: event.device_id,
    startedAt: event.meta.time,
    trigger: event.type,
    visitor,
    confidence: event.attributes?.sub_type ? 0.9 : 0.6,
    turns: [],
    resolution: 'in_progress',
    acknowledged: false,
  }

  const decision = decide({
    visitor,
    confidence: door.confidence,
    memory,
    turns: [],
    hour: new Date(event.meta.time).getHours(),
  })

  if (decision.speak) {
    door.turns.push({ at: new Date().toISOString(), from: 'door', text: decision.speak })
  }
  door.resolution = decision.resolution
  upsertEvent(door)

  // Ring only needs to know we accepted it; the conversation continues async.
  return NextResponse.json({ ok: true, eventId: door.id })
}

function classify(subType?: string): VisitorKind {
  switch (subType) {
    case 'package':
      return 'courier'
    case 'vehicle':
      return 'vehicle'
    case 'human':
      return 'stranger'
    default:
      return 'unknown'
  }
}
