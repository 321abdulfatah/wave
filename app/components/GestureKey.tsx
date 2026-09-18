'use client'

import { GESTURES } from '@/lib/gestures/vocabulary'
import type { Gesture } from '@/lib/ring/types'

/**
 * The gesture vocabulary, shown as a key.
 *
 * Doubles as the demo control surface: clicking a gesture posts it to the agent
 * exactly as the camera would, so the conversation can be driven end to end
 * without standing in front of a doorbell.
 */
export default function GestureKey({
  expecting,
  disabled,
  onSend,
}: {
  expecting: Gesture[]
  disabled: boolean
  onSend: (g: Gesture, confidence: number) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {GESTURES.map((g) => {
        const isExpected = expecting.includes(g.id)
        return (
          <button
            key={g.id}
            type="button"
            disabled={disabled}
            onClick={() => onSend(g.id, 0.93)}
            title={g.meaning}
            aria-label={`${g.label} — ${g.meaning}`}
            className="group flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition
                       disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:-translate-y-0.5"
            style={{
              background: isExpected ? 'var(--signal-soft)' : 'var(--ink-raised)',
              borderColor: isExpected ? 'rgba(255,176,32,.45)' : 'var(--line)',
            }}
          >
            <span className="text-2xl leading-none" aria-hidden>
              {g.glyph}
            </span>
            <span
              className="text-center text-[10px] font-semibold leading-tight"
              style={{ color: isExpected ? 'var(--signal)' : 'var(--text-dim)' }}
            >
              {g.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
