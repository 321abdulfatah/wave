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
    turns: [
      {
        at: ago(12),
        from: 'door',
        text: 'Hello. The resident here is Deaf and cannot come to the door. I can help — are you delivering something?',
      },
      {
        at: ago(12),
        from: 'visitor',
        text: 'Nod — yes, go ahead',
        gesture: 'nod',
        confidence: 0.93,
      },
      {
        at: ago(11),
        from: 'door',
        text: 'Thank you. Please leave it inside the porch, out of the rain, and show me an open hand once it is placed.',
      },
      {
        at: ago(11),
        from: 'visitor',
        text: 'Open hand — leaving it here',
        gesture: 'present',
        confidence: 0.87,
      },
      { at: ago(11), from: 'door', text: 'Got it, I have a photo. Have a good day.' },
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
    turns: [
      {
        at: ago(96),
        from: 'door',
        text: 'Hello. Nobody can come to the door right now. Are you expected?',
      },
      {
        at: ago(96),
        from: 'visitor',
        text: 'Wave — hello, I am a person',
        gesture: 'wave',
        confidence: 0.79,
      },
      {
        at: ago(95),
        from: 'door',
        text: 'Understood. I have saved a clip and the resident will see it. Thank you for waiting.',
      },
    ],
  },
  {
    id: 'evt_1040',
    deviceId: 'dev_side_gate',
    deviceName: 'Side Gate',
    startedAt: ago(320),
    trigger: 'motion_detected',
    visitor: 'vehicle',
    confidence: 0.83,
    resolution: 'resident_notified',
    acknowledged: true,
    turns: [
      {
        at: ago(320),
        from: 'door',
        text: 'Vehicle at the side gate. No person approached. Logged, not escalated.',
      },
    ],
  },
]
