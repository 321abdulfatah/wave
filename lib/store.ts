import type { DoorEvent, VisitorMemory } from '@/lib/ring/types'
import { MOCK_EVENTS, MOCK_MEMORY } from '@/lib/ring/mock'

/**
 * In-process event store.
 *
 * Deliberately not a database. Everything WAVE keeps is a rolling window of
 * recent doorstep events plus a small memory of recurring visitors, and keeping
 * that in one place makes it obvious how little is retained — which matters for
 * a product pointed at someone's front door.
 *
 * Swapped for DynamoDB behind the same four functions before the Alexa+ MCP
 * server ships, since that runs in a separate process.
 */

const MAX_EVENTS = 100

interface Store {
  events: DoorEvent[]
  memory: VisitorMemory[]
  subscribers: Set<(e: DoorEvent) => void>
}

// Survives Next.js dev hot reloads, which otherwise reset module state on save.
const globalStore = globalThis as unknown as { __wave?: Store }

function store(): Store {
  if (!globalStore.__wave) {
    globalStore.__wave = {
      events: [...MOCK_EVENTS],
      memory: [...MOCK_MEMORY],
      subscribers: new Set(),
    }
  }
  return globalStore.__wave
}

export function listEvents(): DoorEvent[] {
  return [...store().events].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export function getEvent(id: string): DoorEvent | undefined {
  return store().events.find((e) => e.id === id)
}

export function upsertEvent(event: DoorEvent): DoorEvent {
  const s = store()
  const i = s.events.findIndex((e) => e.id === event.id)
  if (i >= 0) s.events[i] = event
  else s.events = [event, ...s.events].slice(0, MAX_EVENTS)

  for (const fn of s.subscribers) fn(event)
  return event
}

export function listMemory(): VisitorMemory[] {
  return store().memory
}

/** Record that a recurring visitor was seen, so WAVE recognises them next time. */
export function rememberVisitor(label: string, patch: Partial<VisitorMemory>) {
  const s = store()
  const existing = s.memory.find((m) => m.label === label)
  if (existing) {
    Object.assign(existing, patch, {
      seenCount: existing.seenCount + 1,
      lastSeen: new Date().toISOString(),
    })
  } else {
    s.memory.push({
      label,
      kind: patch.kind ?? 'unknown',
      typicalDays: patch.typicalDays ?? [new Date().getDay()],
      seenCount: 1,
      lastSeen: new Date().toISOString(),
      policy: patch.policy,
    })
  }
}

/** Subscribe to live events. Returns an unsubscribe function. */
export function subscribe(fn: (e: DoorEvent) => void): () => void {
  const s = store()
  s.subscribers.add(fn)
  return () => s.subscribers.delete(fn)
}
