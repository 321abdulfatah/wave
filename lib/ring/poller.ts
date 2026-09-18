import { listDevices, listEvents as listRingEvents, isMockMode } from '@/lib/ring/client'
import { decide } from '@/lib/agent/policy'
import { listMemory, upsertEvent, getEvent } from '@/lib/store'
import type { DoorEvent } from '@/lib/ring/types'

/**
 * Ring event poller.
 *
 * Webhooks are the production path, but they are configured per registered app
 * and are never delivered to the Developer Playground, so there is no way to
 * receive one before certification. Polling event history covers the same
 * ground for development and for the demo, and the webhook handler in
 * app/api/webhook stays the real entry point for a deployed app.
 */

const POLL_MS = 4_000

interface PollerState {
  timer: ReturnType<typeof setInterval> | null
  /** Ring event ids already turned into door events. */
  seen: Set<string>
  /** Only events after this are acted on, so startup does not replay history. */
  since: number
  deviceNames: Map<string, string>
  ticks: number
  errors: number
  lastError: string | null
  lastTickAt: number
  /** Claimed synchronously so concurrent starts cannot both win. */
  starting: boolean
}

const globalPoller = globalThis as unknown as { __wavePoller?: PollerState }

function state(): PollerState {
  if (!globalPoller.__wavePoller) {
    globalPoller.__wavePoller = {
      timer: null,
      seen: new Set(),
      since: Date.now(),
      deviceNames: new Map(),
      ticks: 0,
      errors: 0,
      lastError: null,
      lastTickAt: 0,
      starting: false,
    }
  }
  return globalPoller.__wavePoller
}

export function isPolling() {
  return state().timer !== null
}

/** Diagnostics for /api/ring/poller. */
export function pollerStatus() {
  const s = state()
  return {
    running: s.timer !== null,
    ticks: s.ticks,
    errors: s.errors,
    lastError: s.lastError,
    lastTickAt: s.lastTickAt ? new Date(s.lastTickAt).toISOString() : null,
    since: new Date(s.since).toISOString(),
    seen: s.seen.size,
    devices: [...s.deviceNames.values()],
  }
}

export async function startPolling(): Promise<{ started: boolean; reason?: string }> {
  const s = state()
  if (s.timer) return { started: true }
  if (isMockMode()) return { started: false, reason: 'No RING_ACCESS_TOKEN' }

  // Every dashboard that opens calls this, and the device lookup below is
  // awaited — so without a synchronous claim, two concurrent callers both pass
  // the timer check, both start an interval, and the second assignment orphans
  // the first one forever. That is how three pollers ended up hammering Ring
  // at 1.5s instead of one at 4s.
  if (s.starting) return { started: true }
  s.starting = true

  try {
    return await begin(s)
  } finally {
    s.starting = false
  }
}

async function begin(s: PollerState): Promise<{ started: boolean; reason?: string }> {
  const devices = await listDevices()
  if (devices.length === 0) return { started: false, reason: 'No devices on this account' }
  for (const d of devices) s.deviceNames.set(d.id, d.name)

  // Anything already in history predates this session and is not news.
  s.since = Date.now()
  for (const d of devices) {
    const existing = await listRingEvents(d.id).catch(() => [])
    for (const e of existing) s.seen.add(e.id)
  }

  console.log(`[poller] started, watching ${devices.length} device(s), ${s.seen.size} event(s) already in history`)

  if (s.timer) clearInterval(s.timer)
  s.timer = setInterval(() => {
    void tick().catch((err) => {
      // A failed poll is not fatal; the next one retries. But swallowing it
      // silently once cost an hour of looking in the wrong place.
      s.errors += 1
      s.lastError = String(err)
      console.error('[poller] tick failed:', err)
    })
  }, POLL_MS)

  return { started: true }
}

export function stopPolling() {
  const s = state()
  if (s.timer) clearInterval(s.timer)
  s.timer = null
}

async function tick() {
  const s = state()
  s.ticks += 1
  s.lastTickAt = Date.now()

  for (const [deviceId, deviceName] of s.deviceNames) {
    const events = await listRingEvents(deviceId)

    for (const e of events) {
      if (s.seen.has(e.id)) continue
      s.seen.add(e.id)
      if (e.start < s.since) continue

      // The Playground emits every simulated event as `on_demand` with no
      // sub_type and no cv_detections, so nothing here can be classified from
      // the event alone. The visitor kind is resolved later, from the frames.
      // See FL-008.
      const door: DoorEvent = {
        id: `evt_${e.id.slice(-10).toLowerCase()}`,
        deviceId,
        deviceName,
        startedAt: new Date(e.start).toISOString(),
        trigger: e.eventType === 'button_press' ? 'button_press' : 'motion_detected',
        visitor: 'unknown',
        confidence: 0.5,
        turns: [],
        resolution: 'in_progress',
        acknowledged: false,
      }

      if (getEvent(door.id)) continue

      const decision = decide({
        visitor: door.visitor,
        confidence: door.confidence,
        memory: listMemory(),
        turns: [],
        hour: new Date(e.start).getHours(),
      })
      if (decision.speak) {
        door.turns.push({ at: new Date().toISOString(), from: 'door', text: decision.speak })
      }
      door.resolution = decision.resolution

      console.log(`[poller] new Ring event ${e.eventType} -> ${door.id}`)
      upsertEvent(door)
    }
  }
}
