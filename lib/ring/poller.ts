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
}

const globalPoller = globalThis as unknown as { __wavePoller?: PollerState }

function state(): PollerState {
  if (!globalPoller.__wavePoller) {
    globalPoller.__wavePoller = {
      timer: null,
      seen: new Set(),
      since: Date.now(),
      deviceNames: new Map(),
    }
  }
  return globalPoller.__wavePoller
}

export function isPolling() {
  return state().timer !== null
}

export async function startPolling(): Promise<{ started: boolean; reason?: string }> {
  const s = state()
  if (s.timer) return { started: true }
  if (isMockMode()) return { started: false, reason: 'No RING_ACCESS_TOKEN' }

  const devices = await listDevices()
  if (devices.length === 0) return { started: false, reason: 'No devices on this account' }
  for (const d of devices) s.deviceNames.set(d.id, d.name)

  // Anything already in history predates this session and is not news.
  s.since = Date.now()
  for (const d of devices) {
    const existing = await listRingEvents(d.id).catch(() => [])
    for (const e of existing) s.seen.add(e.id)
  }

  s.timer = setInterval(() => {
    void tick().catch(() => {
      /* a failed poll is not fatal; the next one will retry */
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

      upsertEvent(door)
    }
  }
}
