import { NextResponse } from 'next/server'
import { z } from 'zod'
import { decide } from '@/lib/agent/policy'
import { listMemory, upsertEvent } from '@/lib/store'
import { MOCK_DEVICES } from '@/lib/ring/mock'
import type { DoorEvent, VisitorKind } from '@/lib/ring/types'

export const dynamic = 'force-dynamic'

const Body = z.object({
  visitor: z.enum(['courier', 'known', 'stranger', 'vehicle', 'unknown']).default('courier'),
  deviceId: z.string().default('dev_front_door'),
  locale: z.string().optional(),
})

/**
 * Fire a doorstep event by hand.
 *
 * The Ring Playground can simulate Package, Vehicle and Motion events, but this
 * endpoint exists so the interaction can be rehearsed and recorded without any
 * dependency on Ring's availability on the day the demo video is shot.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { visitor, deviceId, locale } = Body.parse(body)

  const device = MOCK_DEVICES.find((d) => d.id === deviceId) ?? MOCK_DEVICES[0]
  const memory = listMemory()
  const known = visitor === 'courier' ? memory.find((m) => m.kind === 'courier') : undefined

  const event: DoorEvent = {
    id: `evt_${Date.now().toString(36)}`,
    deviceId: device.id,
    deviceName: device.name,
    startedAt: new Date().toISOString(),
    trigger: visitor === 'vehicle' ? 'motion_detected' : 'button_press',
    visitor: visitor as VisitorKind,
    visitorLabel: known?.label,
    confidence: known ? 0.94 : 0.72,
    turns: [],
    resolution: 'in_progress',
    acknowledged: false,
  }

  const decision = decide({
    visitor: event.visitor,
    visitorLabel: event.visitorLabel,
    confidence: event.confidence,
    memory,
    turns: [],
    hour: new Date().getHours(),
    locale,
  })

  if (decision.speak) {
    event.turns.push({ at: new Date().toISOString(), from: 'door', text: decision.speak })
  }
  event.resolution = decision.resolution
  upsertEvent(event)

  return NextResponse.json({ event, decision })
}
