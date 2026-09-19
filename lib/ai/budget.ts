/**
 * A hard ceiling on model spend.
 *
 * Nothing here is clever. It exists because the caption loop posts a chunk
 * every second while the camera is on, and a browser tab left open overnight
 * against a metered provider is how a $5 demo becomes a $400 invoice. The
 * provider's own dashboard limit is the real backstop; this is the one that
 * cannot be forgotten to configure.
 *
 * The cap is enforced in *calls*, not in dollars, because a running total in
 * dollars requires trusting a price table that changes. Calls are something we
 * can count exactly.
 *
 * Two limits worth stating plainly rather than discovering later:
 *
 *  - The ledger lives in memory. On Vercel each serverless instance keeps its
 *    own copy and instances recycle, so this is a cap per instance per day, not
 *    a global one. It reliably stops a runaway loop inside one hot instance —
 *    which is the failure mode it was written for — and it does not add up to a
 *    guarantee across the fleet.
 *  - Therefore the only real ceiling is the credit limit set on the provider
 *    key itself. This file is the seatbelt; that is the brake.
 */

import { env } from '@/lib/env'

/** Rough per-call costs, used only to translate the cap into a number a human can judge. */
const ESTIMATED_USD = {
  vision: 0.006, // ~1,800 input tokens for a doorstep frame, ~60 out, Sonnet-class pricing
  // Whisper-class pricing for one second of audio. On Groq's free tier this is
  // actually zero — requests are rate-limited rather than billed — so the
  // speech figure is an upper bound for a paid endpoint, not a prediction.
  speech: 0.0005,
}

interface Ledger {
  day: string
  vision: number
  speech: number
}

const g = globalThis as unknown as { __waveBudget?: Ledger }

function today() {
  return new Date().toISOString().slice(0, 10)
}

function ledger(): Ledger {
  if (!g.__waveBudget || g.__waveBudget.day !== today()) {
    g.__waveBudget = { day: today(), vision: 0, speech: 0 }
  }
  return g.__waveBudget
}

/**
 * Daily call ceilings.
 *
 * Sized against a fixed project budget rather than against what the providers
 * would allow: 150 classifications is far more doorstep events than a demo
 * produces, and 4,000 speech chunks is about 66 minutes of continuous
 * captioning on an endpoint that currently bills nothing for it.
 */
function limits() {
  return {
    vision: Number(env('MAX_VISION_CALLS_PER_DAY') ?? 150),
    speech: Number(env('MAX_SPEECH_CALLS_PER_DAY') ?? 4000),
  }
}

export interface BudgetCheck {
  allowed: boolean
  used: number
  limit: number
  /** Shown in the UI when the cap is hit, so it reads as a cap and not a crash. */
  message?: string
}

export function check(kind: 'vision' | 'speech'): BudgetCheck {
  const l = ledger()
  const cap = limits()[kind]
  const used = l[kind]

  if (used >= cap) {
    return {
      allowed: false,
      used,
      limit: cap,
      message:
        `Daily ${kind} limit reached (${used}/${cap}, about $${(cap * ESTIMATED_USD[kind]).toFixed(2)}). ` +
        `It resets at midnight UTC. Raise MAX_${kind.toUpperCase()}_CALLS_PER_DAY to change it.`,
    }
  }
  return { allowed: true, used, limit: cap }
}

/** Count a call that actually went out. Called after the request, not before. */
export function record(kind: 'vision' | 'speech') {
  ledger()[kind] += 1
}

export function spendToday() {
  const l = ledger()
  const cap = limits()
  return {
    day: l.day,
    vision: { used: l.vision, limit: cap.vision },
    speech: { used: l.speech, limit: cap.speech },
    estimatedUsd: Number((l.vision * ESTIMATED_USD.vision + l.speech * ESTIMATED_USD.speech).toFixed(3)),
    // The ceiling if both caps were reached today — the number worth checking
    // against the provider's own limit.
    worstCaseUsd: Number(
      (cap.vision * ESTIMATED_USD.vision + cap.speech * ESTIMATED_USD.speech).toFixed(2),
    ),
  }
}
