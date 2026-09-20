import type { DoorEvent, RingDevice, VisitorMemory } from './types'

/**
 * Mock mode exists so the whole product — dashboard, conversation, gesture
 * reader — is demonstrable before a Ring Playground token is issued, and so the
 * demo never depends on a live network while it is being recorded.
 */

export const MOCK_DEVICES: RingDevice[] = [
  {
    id: 'dev_front_door',
    name: 'Front Door',
    kind: 'doorbell',
    online: true,
    capabilities: ['live_view', 'motion_detection', 'image_download'],
  },
  {
    id: 'dev_hallway_chime',
    name: 'Hallway Chime',
    kind: 'chime',
    online: true,
    capabilities: ['chime_controls', 'audio_playback'],
  },
  {
    id: 'dev_side_gate',
    name: 'Side Gate',
    kind: 'camera',
    online: true,
    capabilities: ['live_view', 'motion_detection'],
  },
]

export const MOCK_MEMORY: VisitorMemory[] = [
  {
    label: 'Pharmacy courier',
    kind: 'courier',
    typicalDays: [2],
    seenCount: 14,
    lastSeen: '2026-09-11T10:12:00Z',
    policy: 'Leave prescriptions at the door. Always confirm with a photo.',
  },
  {
    label: 'Ahmad (neighbour)',
    kind: 'known',
    typicalDays: [5, 6],
    seenCount: 31,
    lastSeen: '2026-09-14T17:40:00Z',
    policy: 'Always notify me, never turn away.',
  },
]

const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString()

/**
 * Demo data, localised.
 *
 * A real Ring device name is typed by the resident in the Ring app, so it is
 * correctly left untranslated in production. This is our scripted scenario
 * though, and a headline that reads "Pharmacy courier عند Front Door" mixes
 * scripts mid-sentence — which is exactly the tell that a product was
 * translated rather than localised.
 */
const AR_DEVICE: Record<string, string> = {
  dev_front_door: 'الباب الأمامي',
  dev_hallway_chime: 'جرس الممر',
  dev_side_gate: 'البوابة الجانبية',
}

/** Swap the demo names inside a live event record. */
const arLabel = (label: string) => (label.includes('Pharmacy') ? 'ساعي الصيدلية' : 'أحمد (الجار)')

const AR_POLICY: Record<string, string> = {
  'Leave prescriptions at the door. Always confirm with a photo.':
    'اتركوا الأدوية عند الباب. أكّدوا دائماً بصورة.',
  'Always notify me, never turn away.': 'أبلغوني دائماً، ولا تصرفوه أبداً.',
}

/**
 * Localise the parts of an event that are data rather than interface.
 *
 * Turns are deliberately not touched: they carry keys now, and the reader
 * renders them in whatever language is on screen at the time. What is left
 * here is scripted demo content — a device name, a visitor's label, the
 * standing instruction a resident would have typed — which has no key because
 * in production it is typed by a person.
 */
export function localiseEvent<
  T extends {
    deviceId: string
    deviceName: string
    visitorLabel?: string
    why?: { key: string; label?: string; policy?: string }
  },
>(event: T, locale: string): T {
  if (!locale.startsWith('ar')) return event
  return {
    ...event,
    deviceName: AR_DEVICE[event.deviceId] ?? event.deviceName,
    visitorLabel: event.visitorLabel ? arLabel(event.visitorLabel) : undefined,
    why: event.why
      ? {
          ...event.why,
          label: event.why.label ? arLabel(event.why.label) : undefined,
          policy: event.why.policy ? (AR_POLICY[event.why.policy] ?? event.why.policy) : undefined,
        }
      : undefined,
  }
}

export function localiseMock(locale: string) {
  if (!locale.startsWith('ar')) return { devices: MOCK_DEVICES, memory: MOCK_MEMORY }
  return {
    devices: MOCK_DEVICES.map((d) => ({
      ...d,
      name: AR_DEVICE[d.id] ?? d.name,
    })),
    memory: MOCK_MEMORY.map((m) => ({
      ...m,
      label: m.kind === 'courier' ? 'ساعي الصيدلية' : 'أحمد (الجار)',
      policy:
        m.kind === 'courier'
          ? 'اتركوا الأدوية عند الباب. أكّدوا دائماً بصورة.'
          : 'أبلغوني دائماً، ولا تصرفوه أبداً.',
    })),
  }
}

export const MOCK_EVENTS: DoorEvent[] = [
  {
    id: 'evt_1042',
    deviceId: 'dev_front_door',
    deviceName: 'Front Door',
    startedAt: ago(12),
    trigger: 'button_press',
    visitor: 'courier',
    visitorLabel: 'Pharmacy courier',
    confidence: 0.94,
    resolution: 'left_at_door',
    acknowledged: false,
    why: {
      key: 'recognised',
      label: 'Pharmacy courier',
      policy: 'Leave prescriptions at the door. Always confirm with a photo.',
    },
    turns: [
      { at: ago(12), from: 'door', key: 'greetCourier' },
      { at: ago(12), from: 'visitor', gesture: 'nod', confidence: 0.93 },
      { at: ago(11), from: 'door', key: 'directToDropPoint' },
      { at: ago(11), from: 'visitor', gesture: 'present', confidence: 0.87 },
      { at: ago(11), from: 'door', key: 'confirmed' },
    ],
  },
  {
    id: 'evt_1041',
    deviceId: 'dev_front_door',
    deviceName: 'Front Door',
    startedAt: ago(96),
    trigger: 'motion_detected',
    visitor: 'stranger',
    confidence: 0.71,
    resolution: 'message_taken',
    acknowledged: true,
    why: { key: 'personNotDelivery' },
    turns: [
      { at: ago(96), from: 'door', key: 'greetStranger' },
      { at: ago(96), from: 'visitor', gesture: 'wave', confidence: 0.79 },
      { at: ago(95), from: 'door', key: 'messageSaved' },
    ],
  },
  {
    // A vehicle with nobody approaching is not a conversation, so there is no
    // transcript to show — only the reason it was logged and left alone.
    id: 'evt_1040',
    deviceId: 'dev_side_gate',
    deviceName: 'Side Gate',
    startedAt: ago(320),
    trigger: 'motion_detected',
    visitor: 'vehicle',
    confidence: 0.83,
    resolution: 'resident_notified',
    acknowledged: true,
    why: { key: 'vehicleOnly' },
    turns: [],
  },
]
