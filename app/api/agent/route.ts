import { NextResponse } from 'next/server'
import { z } from 'zod'
import { applyDecision, decide } from '@/lib/agent/policy'
import { getEvent, listMemory, upsertEvent } from '@/lib/store'
import { gestureSpec } from '@/lib/gestures/vocabulary'

export const dynamic = 'force-dynamic'

const Body = z.object({
  eventId: z.string(),
  gesture: z.enum([
    'thumbs_up',
    'thumbs_down',
    'open_palm',
    'wave',
    'present',
    'purse',
    'index_up',
    'nod',
    'shake',
    'none',
  ]),
  confidence: z.number().min(0).max(1),
  locale: z.string().optional(),
})

/**
 * Advance a doorstep conversation by one turn.
 *
 * The browser reads the gesture — MediaPipe runs on the client, so no video
 * frame ever leaves the house — and posts only the resulting label. That keeps
 * the camera feed off the network and out of this server's logs.
 */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { eventId, gesture, confidence, locale } = parsed.data

  const event = getEvent(eventId)
  if (!event) return NextResponse.json({ error: 'unknown event' }, { status: 404 })
  if (event.resolution !== 'in_progress') {
    return NextResponse.json({ error: 'conversation already closed' }, { status: 409 })
  }

  // Below threshold the gesture is treated as unread rather than guessed at.
  // Acting on a half-seen hand at someone's front door is worse than asking again.
  const spec = gesture === 'none' ? undefined : gestureSpec(gesture)
  const accepted = gesture !== 'none' && spec != null && confidence >= spec.threshold

  const withVisitor = accepted
    ? {
        ...event,
        turns: [
          ...event.turns,
          {
            at: new Date().toISOString(),
            from: 'visitor' as const,
            text: `${spec!.label} — ${spec!.meaning}`,
            gesture,
            confidence,
          },
        ],
      }
    : event

  const decision = decide({
    visitor: withVisitor.visitor,
    visitorLabel: withVisitor.visitorLabel,
    confidence: withVisitor.confidence,
    memory: listMemory(),
    turns: withVisitor.turns,
    hour: new Date().getHours(),
    locale,
  })

  const next = applyDecision(withVisitor, decision)
  upsertEvent(next)

  return NextResponse.json({ event: next, decision, accepted })
}
