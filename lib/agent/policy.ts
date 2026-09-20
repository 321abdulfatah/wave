import type {
  DoorEvent,
  DoorLine,
  Gesture,
  Resolution,
  Turn,
  VisitorKind,
  VisitorMemory,
  Why,
} from '@/lib/ring/types'
import { stringsFor } from '@/lib/i18n/strings'

/**
 * WAVE's doorstep conversation engine.
 *
 * The engine is deterministic on purpose. A door agent that improvises is a door
 * agent that eventually says something the resident did not authorise, so the
 * language model is used to *classify* the visitor and *draft* phrasing, while
 * every branch that decides what actually happens lives here, in code the
 * resident's policy can be read off.
 */

export interface AgentContext {
  visitor: VisitorKind
  visitorLabel?: string
  confidence: number
  /** Everything WAVE has learned about recurring visitors. */
  memory: VisitorMemory[]
  /** Turns so far in this conversation. */
  turns: Turn[]
  /** Local hour, 0–23 — WAVE is quieter late at night. */
  hour: number
  /** Which language the door speaks. The register research is prescriptive
   *  here: Arabic uses plural-as-respect and phrases refusal as deferral. */
  locale?: string
}

export interface AgentDecision {
  /** What the Chime should say next, rendered in the caller's locale. Empty
   *  when the conversation is over. */
  speak: string
  /** The same line as a key, so a transcript can be re-rendered later in a
   *  language the resident had not chosen yet when it was spoken. */
  speakKey?: DoorLine
  /** Gestures that are meaningful as a reply to `speak`. */
  expecting: Gesture[]
  /** Set once the conversation has reached an outcome. */
  resolution: Resolution
  /** Whether to push a card to the resident right now. */
  notifyResident: boolean
  /** Why WAVE did this, as a key and its parameters. Rendered by the reader. */
  why: Why
}

const OPENER: Record<VisitorKind, DoorLine | undefined> = {
  courier: 'greetCourier',
  known: 'greetKnown',
  stranger: 'greetStranger',
  vehicle: undefined,
  unknown: 'greetUnknown',
}

/**
 * Decide the next move in a doorstep conversation.
 *
 * Called once when the event opens, and again after every gesture the camera
 * reads, so the whole interaction is just this function applied repeatedly.
 */
export function decide(ctx: AgentContext): AgentDecision {
  const lastVisitorTurn = [...ctx.turns].reverse().find((t) => t.from === 'visitor')
  const gesture = lastVisitorTurn?.gesture ?? 'none'
  const known = ctx.memory.find((m) => m.label === ctx.visitorLabel)
  const t = stringsFor(ctx.locale ?? 'en-US')

  // A vehicle with nobody approaching is not a conversation. Log it and stop.
  if (ctx.visitor === 'vehicle') {
    return {
      speak: '',
      expecting: [],
      resolution: 'resident_notified',
      notifyResident: false,
      why: { key: 'vehicleOnly' },
    }
  }

  // Opening move: nothing has been said yet.
  if (ctx.turns.length === 0) {
    const key = OPENER[ctx.visitor]
    return {
      speak: key ? t.door[key] : '',
      speakKey: key,
      expecting: ['nod', 'thumbs_up', 'shake'],
      resolution: 'in_progress',
      notifyResident: ctx.visitor === 'known',
      why: known?.policy
        ? { key: 'recognised', label: known.label, policy: known.policy }
        : { key: 'opened', visitor: ctx.visitor, confidence: ctx.confidence },
    }
  }

  switch (gesture) {
    // A nod is the pan-cultural yes at 98.18%; thumbs_up is accepted as an
    // acknowledgement but never treated as consent on its own.
    case 'nod':
    case 'thumbs_up':
      return {
        speak: t.door.directToDropPoint,
        speakKey: 'directToDropPoint',
        expecting: ['present', 'open_palm'],
        resolution: 'in_progress',
        notifyResident: false,
        why: { key: 'confirmedDelivery' },
      }

    case 'present':
      return {
        speak: t.door.confirmed,
        speakKey: 'confirmed',
        expecting: [],
        resolution: 'left_at_door',
        notifyResident: true,
        why: { key: 'placed' },
      }

    case 'wave':
      return {
        speak: t.door.messageSaved,
        speakKey: 'messageSaved',
        expecting: [],
        resolution: 'message_taken',
        notifyResident: true,
        why: { key: 'personNotDelivery' },
      }

    case 'open_palm':
      return {
        speak: t.door.holdOn,
        speakKey: 'holdOn',
        expecting: ['nod', 'present', 'shake'],
        resolution: 'in_progress',
        notifyResident: false,
        why: { key: 'askedForMoment' },
      }

    case 'shake':
    case 'thumbs_down':
      return {
        speak: t.door.closeDeclined,
        speakKey: 'closeDeclined',
        expecting: [],
        resolution: 'declined',
        notifyResident: false,
        why: { key: 'cancelled' },
      }

    default:
      // No readable gesture. Ask once more, then escalate rather than loop.
      if (ctx.turns.filter((t) => t.from === 'door').length >= 2) {
        return {
          speak: t.door.givingUp,
        speakKey: 'givingUp',
          expecting: [],
          resolution: 'message_taken',
          notifyResident: true,
          why: { key: 'escalated' },
        }
      }
      return {
        // Re-prompt with the head, not the hand: nod and shake are the two
        // highest-recognition emblems measured anywhere, and they work for
        // someone holding a parcel in both hands.
        speak: t.door.notUnderstood,
        speakKey: 'notUnderstood',
        expecting: ['nod', 'shake', 'wave'],
        resolution: 'in_progress',
        notifyResident: false,
        why: { key: 'belowThreshold' },
      }
  }
}

/** Fold a decision into the running event record. */
export function applyDecision(event: DoorEvent, decision: AgentDecision): DoorEvent {
  const turns = decision.speak
    ? [
        ...event.turns,
        { at: new Date().toISOString(), from: 'door' as const, key: decision.speakKey },
      ]
    : event.turns

  return { ...event, turns, resolution: decision.resolution, why: decision.why }
}
