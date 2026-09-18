import crypto from 'crypto'
import type { RingDevice, RingWebhookEvent } from './types'

const BASE = process.env.RING_API_BASE ?? 'https://api.amazonvision.com'

export class RingError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'RingError'
  }
}

/** True when no Playground token is configured, so WAVE should serve mock data. */
export function isMockMode() {
  return !process.env.RING_ACCESS_TOKEN
}

/**
 * Ring requires every call to be server-to-server — the API and OAuth hosts
 * reject browser origins — so this client is only ever imported from route
 * handlers, never from a component.
 */
async function ring<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.RING_ACCESS_TOKEN
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
  const data = await ring<{ data: RingDevice[] }>(
    '/v1/devices?include=status,capabilities,location',
  )
  return data.data
}

export async function deviceStatus(deviceId: string) {
  return ring<{ online: boolean }>(`/v1/devices/${deviceId}/status`)
}

/** Pull a still frame so the agent has something to look at. */
export async function downloadSnapshot(deviceId: string, componentId?: number) {
  const q = componentId != null ? `?component_id=${componentId}` : ''
  return ring<{ url: string; expires_at: string }>(
    `/v1/devices/${deviceId}/media/image/download${q}`,
    { method: 'POST' },
  )
}

/**
 * Speak through a Chime.
 *
 * This is the only audio path Ring exposes — live streams are video only, with
 * no talk-back endpoint. WAVE's entire doorstep conversation leaves the house
 * through here.
 */
export async function playOnChime(deviceId: string, audioSlot: number) {
  return ring<{ accepted: boolean }>(`/v1/devices/${deviceId}/media/audio/playback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio_slot: audioSlot }),
  })
}

/** Open a WHEP session by exchanging an SDP offer for an answer. */
export async function startWhepSession(deviceId: string, sdpOffer: string) {
  const res = await fetch(`${BASE}/v1/devices/${deviceId}/media/streaming/whep/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RING_ACCESS_TOKEN}`,
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
  const secret = process.env.RING_WEBHOOK_SECRET
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
