import type { GestureId } from '@/lib/gestures/locales'

/**
 * Types mirroring the Ring Partner API (api.amazonvision.com).
 * Only the surface WAVE actually consumes is modelled here.
 */

/** Webhook event types Ring delivers. */
export type RingEventType =
  | 'button_press'
  | 'motion_detected'
  | 'device_online'
  | 'device_offline'
  | 'device_added'
  | 'device_removed'

export interface RingWebhookEvent {
  type: RingEventType
  device_id: string
  /** Ring sets sub_type to 'human' when the motion classifier is confident. */
  attributes?: { sub_type?: 'human' | 'vehicle' | 'package' | 'other' }
  meta: { request_id: string; time: string }
}

export interface RingDevice {
  id: string
  name: string
  kind: 'doorbell' | 'camera' | 'chime' | 'contact_sensor'
  online: boolean
  /** Ring Elite devices expose several camera modules behind one device id. */
  components?: { component_id: number; label: string }[]
  capabilities?: string[]
}

/* ------------------------------------------------------------------ */
/* WAVE domain types                                                    */
/* ------------------------------------------------------------------ */

/** What the vision pass believes is standing at the door. */
export type VisitorKind = 'courier' | 'known' | 'stranger' | 'vehicle' | 'unknown'

/**
 * What WAVE can read back from a visitor.
 *
 * Derived from the locale table rather than declared here, so a gesture cannot
 * exist in the UI without a sourced cultural record. 'none' is the unread case:
 * below threshold is treated as unread, never guessed at.
 */
export type Gesture = GestureId | 'none'

/** How a doorstep conversation ended. */
export type Resolution =
  | 'left_at_door'
  | 'message_taken'
  | 'resident_notified'
  | 'declined'
  | 'in_progress'

/** One turn in the doorstep conversation. */
export interface Turn {
  at: string
  /** 'door' = WAVE spoke through the Chime. 'visitor' = a gesture was read. */
  from: 'door' | 'visitor'
  /** Spoken text, or the human-readable reading of a gesture. */
  text: string
  gesture?: Gesture
  confidence?: number
}

/** A complete doorstep interaction, from first event to resolution. */
export interface DoorEvent {
  id: string
  deviceId: string
  deviceName: string
  startedAt: string
  trigger: RingEventType
  visitor: VisitorKind
  /** Present when a recurring visitor was recognised from memory. */
  visitorLabel?: string
  confidence: number
  snapshotUrl?: string
  turns: Turn[]
  resolution: Resolution
  /** Set once the resident has seen the card. */
  acknowledged: boolean
}

export interface VisitorMemory {
  label: string
  kind: VisitorKind
  /** ISO weekday numbers this visitor typically arrives on. */
  typicalDays: number[]
  seenCount: number
  lastSeen: string
  /** Standing instruction the resident set for this visitor. */
  policy?: string
}
