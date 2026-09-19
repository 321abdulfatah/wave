import crypto from 'crypto'
import type { RingDevice, RingWebhookEvent } from './types'
import { env } from '@/lib/env'

const BASE = env('RING_API_BASE') ?? 'https://api.amazonvision.com'

export class RingError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'RingError'
  }
}

/** True when no Playground token is configured, so WAVE should serve mock data. */
export function isMockMode() {
  return !env('RING_ACCESS_TOKEN')
}

/**
 * Ring requires every call to be server-to-server — the API and OAuth hosts
 * reject browser origins — so this client is only ever imported from route
 * handlers, never from a component.
 */
async function ring<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = env('RING_ACCESS_TOKEN')
  if (!token) throw new RingError(401, 'RING_ACCESS_TOKEN is not set')

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (res.status === 429) {
    // Ring rate-limits at 100 TPS per client_id and tells us how long to wait.
    const retry = res.headers.get('Retry-After') ?? '1'
    throw new RingError(429, `Rate limited, retry after ${retry}s`)
  }
  if (!res.ok) {
    throw new RingError(res.status, `${init.method ?? 'GET'} ${path} -> ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function listDevices(): Promise<RingDevice[]> {
  const doc = await ring<JsonApiDoc>('/v1/devices?include=status,capabilities,location')
  const byId = new Map((doc.included ?? []).map((r) => [r.id, r]))

  return doc.data.map((d) => {
    const related = (name: string) => {
      const id = d.relationships?.[name]?.data?.id
      return id ? byId.get(id)?.attributes : undefined
    }
    const status = related('status') as { online?: boolean } | undefined
    const caps = related('capabilities') as Record<string, unknown> | undefined
    const attrs = d.attributes as { name?: string; image_url?: string } | undefined

    return {
      id: d.id,
      name: attrs?.name ?? d.id,
      // Ring does not send a device kind, so it is inferred from the artwork
      // path, which is the only place the model name appears.
      kind: inferKind(attrs?.image_url),
      online: status?.online ?? false,
      capabilities: caps ? flattenCapabilities(caps) : [],
    }
  })
}

function inferKind(imageUrl?: string): RingDevice['kind'] {
  const s = (imageUrl ?? '').toLowerCase()
  if (s.includes('chime')) return 'chime'
  if (s.includes('doorbell') || s.includes('dp')) return 'doorbell'
  return 'camera'
}

/** Turn the nested capability object into the flat labels the UI shows. */
function flattenCapabilities(caps: Record<string, unknown>): string[] {
  return Object.entries(caps)
    .filter(([, v]) => v != null)
    .map(([k]) => k)
}

/* ------------------------------------------------------------------ */
/* JSON:API                                                            */
/* ------------------------------------------------------------------ */

/**
 * Ring speaks JSON:API, so a device arrives as a thin resource object whose
 * status and capabilities sit in a sibling `included` array, joined by id.
 * Everything above this line in the app expects a flat device, so the shapes
 * are reconciled here rather than leaking the envelope into the UI.
 */
interface JsonApiResource {
  type: string
  id: string
  attributes?: Record<string, unknown>
  relationships?: Record<string, { data?: { type: string; id: string } }>
}

interface JsonApiDoc {
  data: JsonApiResource[]
  included?: JsonApiResource[]
}

export async function deviceStatus(deviceId: string) {
  return ring<{ online: boolean }>(`/v1/devices/${deviceId}/status`)
}

export interface RingHistoryEvent {
  id: string
  /** Epoch milliseconds. */
  start: number
  end: number
  /** 'on_demand' for anything the Playground simulates. See FL-008. */
  eventType: string
  /** Ring's own computer-vision detections. Always empty in the Playground. */
  detections: { type: string; id: string }[]
}

/**
 * Recent events for a device, newest first.
 *
 * The documented `?event_type=` and `?filter[event_type]=` parameters are
 * silently ignored — the same rows come back either way — so filtering is done
 * here rather than asked of the API.
 */
export async function listEvents(deviceId: string): Promise<RingHistoryEvent[]> {
  const doc = await ring<JsonApiDoc>(`/v1/history/devices/${deviceId}/events`)

  return doc.data
    .map((e) => {
      const a = (e.attributes ?? {}) as { start?: number; end?: number; event_type?: string }
      const rel = e.relationships?.cv_detections as unknown as
        | { data?: { type: string; id: string }[] }
        | undefined
      return {
        id: e.id,
        start: a.start ?? 0,
        end: a.end ?? 0,
        eventType: a.event_type ?? 'unknown',
        detections: rel?.data ?? [],
      }
    })
    .sort((x, y) => y.start - x.start)
}

/**
 * Pull a still frame so the agent has something to look at.
 *
 * Media downloads are the one place Ring departs from JSON:API: the POST
 * answers 303 with a pre-signed Location, and the bytes come from a second GET.
 * The timestamp is epoch milliseconds and is mandatory — a bodyless POST is
 * rejected with 403, not 400, which reads like an auth failure and is not.
 */
export async function downloadSnapshot(
  deviceId: string,
  opts: { at?: number; componentId?: string; format?: 'jpeg' | 'png' } = {},
) {
  const res = await fetch(`${BASE}/v1/devices/${deviceId}/media/image/download`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Authorization: `Bearer ${env('RING_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'at_timestamp',
      timestamp: opts.at ?? Date.now(),
      image_options: { format: opts.format ?? 'jpeg' },
      ...(opts.componentId ? { components: [{ component_id: opts.componentId }] } : {}),
    }),
  })

  const location = res.headers.get('Location')
  if (res.status !== 303 || !location) {
    throw new RingError(res.status, `Snapshot failed: ${res.status}`)
  }
  return { url: location }
}

/**
 * Speak through a Chime.
 *
 * This is the only audio path Ring exposes — live streams are video only, with
 * no talk-back endpoint. WAVE's entire doorstep conversation leaves the house
 * through here.
 *
 * Two things gate it, and neither is available in the Developer Playground:
 * the app must hold the Chimes scope group with the Chime Controls capability,
 * and the account must actually own a chime. The Playground issues a single
 * DoorbellPro whose capabilities report `audio: { supported_actions: null }`,
 * so this path is written to the documented contract but cannot be exercised
 * there. See FL-006.
 */
export async function playOnChime(deviceId: string, audioRef: string) {
  return ring<{ accepted: boolean }>(`/v1/devices/${deviceId}/media/audio/playback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio_ref: audioRef }),
  })
}

/** Open a WHEP session by exchanging an SDP offer for an answer. */
export async function startWhepSession(deviceId: string, sdpOffer: string) {
  const res = await fetch(`${BASE}/v1/devices/${deviceId}/media/streaming/whep/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('RING_ACCESS_TOKEN')}`,
      'Content-Type': 'application/sdp',
    },
    body: sdpOffer,
  })
  if (!res.ok) throw new RingError(res.status, `WHEP session failed: ${res.status}`)
  return { sdpAnswer: await res.text(), location: res.headers.get('Location') ?? '' }
}

/**
 * Verify the HMAC-SHA256 signature Ring sends in X-Signature.
 *
 * Compared in constant time — a webhook endpoint is public, so a timing oracle
 * here would let anyone forge door events.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = env('RING_WEBHOOK_SECRET')
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature.replace(/^sha256=/, ''))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function parseWebhook(body: unknown): RingWebhookEvent | null {
  const e = body as RingWebhookEvent
  if (!e || typeof e.type !== 'string' || typeof e.device_id !== 'string') return null
  return e
}
