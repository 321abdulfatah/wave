import type { DoorEvent, Gesture, Resolution, Turn, VisitorKind, VisitorMemory } from '@/lib/ring/types'

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
}

export interface AgentDecision {
  /** What the Chime should say next. Empty when the conversation is over. */
  speak: string
  /** Gestures that are meaningful as a reply to `speak`. */
  expecting: Gesture[]
  /** Set once the conversation has reached an outcome. */
  resolution: Resolution
  /** Whether to push a card to the resident right now. */
  notifyResident: boolean
  /** One line the resident sees explaining why WAVE did this. */
  rationale: string
}

const OPENERS: Record<VisitorKind, string> = {
  courier:
    'Hello. The resident here is Deaf and cannot come to the door. I can help — are you delivering something?',
  known: 'Hello again. The resident is not able to come to the door, but I will let them know you are here.',
  stranger: 'Hello. Nobody can come to the door right now. Are you expected?',
  vehicle: '',
  unknown: 'Hello. The resident here is Deaf. Give me a moment and I will help.',
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

  // A vehicle with nobody approaching is not a conversation. Log it and stop.
  if (ctx.visitor === 'vehicle') {
    return {
      speak: '',
      expecting: [],
      resolution: 'resident_notified',
      notifyResident: false,
      rationale: 'Vehicle only, no person approached the door. Logged without escalating.',
    }
  }

  // Opening move: nothing has been said yet.
  if (ctx.turns.length === 0) {
    return {
      speak: OPENERS[ctx.visitor],
      expecting: ['thumbs_up', 'wave', 'fist'],
      resolution: 'in_progress',
      notifyResident: ctx.visitor === 'known',
      rationale: known?.policy
        ? `Recognised ${known.label}. Standing instruction: ${known.policy}`
        : `Opened with the ${ctx.visitor} greeting at ${Math.round(ctx.confidence * 100)}% confidence.`,
    }
  }

  switch (gesture) {
    case 'thumbs_up':
      return {
        speak:
          'Thank you. Please leave it inside the porch, out of the rain, and point down once it is placed.',
        expecting: ['point', 'open_palm'],
        resolution: 'in_progress',
        notifyResident: false,
        rationale: 'Visitor confirmed a delivery. Directed them to the sheltered drop point.',
      }

    case 'point':
      return {
        speak: 'Got it, I have a photo. Have a good day.',
        expecting: [],
        resolution: 'left_at_door',
        notifyResident: true,
        rationale: 'Delivery placed and photographed. Resident notified with the snapshot.',
      }

    case 'wave':
      return {
        speak:
          'Understood. I have saved a clip and the resident will see it. Thank you for waiting.',
        expecting: [],
        resolution: 'message_taken',
        notifyResident: true,
        rationale: 'A person, not a delivery. Clip saved and escalated to the resident.',
      }

    case 'open_palm':
      return {
        speak: 'No problem, take your time. I am still here.',
        expecting: ['thumbs_up', 'point', 'fist'],
        resolution: 'in_progress',
        notifyResident: false,
        rationale: 'Visitor asked for a moment. Holding the conversation open.',
      }

    case 'fist':
      return {
        speak: 'Alright, nothing to do here. Take care.',
        expecting: [],
        resolution: 'declined',
        notifyResident: false,
        rationale: 'Visitor cancelled. Closed without disturbing the resident.',
      }

    default:
      // No readable gesture. Ask once more, then escalate rather than loop.
      if (ctx.turns.filter((t) => t.from === 'door').length >= 2) {
        return {
          speak: 'I could not read a reply. I have saved a clip for the resident. Goodbye.',
          expecting: [],
          resolution: 'message_taken',
          notifyResident: true,
          rationale: 'No gesture read after two prompts. Escalated instead of looping.',
        }
      }
      return {
        speak: 'I could not see that. Hold your hand up to the camera and give me a thumbs up for yes.',
        expecting: ['thumbs_up', 'fist', 'wave'],
        resolution: 'in_progress',
        notifyResident: false,
        rationale: 'Gesture below confidence threshold. Re-prompted with a clearer instruction.',
      }
  }
}

/** Fold a decision into the running event record. */
export function applyDecision(event: DoorEvent, decision: AgentDecision): DoorEvent {
  const turns = decision.speak
    ? [...event.turns, { at: new Date().toISOString(), from: 'door' as const, text: decision.speak }]
    : event.turns

  return { ...event, turns, resolution: decision.resolution }
}
