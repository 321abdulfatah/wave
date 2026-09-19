'use client'

import { GESTURES } from '@/lib/gestures/vocabulary'
import type { Gesture } from '@/lib/ring/types'
import { useT } from '@/lib/i18n/context'

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
  const t = useT()
  return (
    <div className="grid grid-cols-5 gap-2">
      {GESTURES.map((g) => {
        const isExpected = expecting.includes(g.id)
        const loc = t.gestures[g.id] ?? { label: g.label, meaning: g.meaning }
        return (
          <button
            key={g.id}
            type="button"
            disabled={disabled}
            onClick={() => onSend(g.id, 0.93)}
            title={loc.meaning}
            aria-label={`${loc.label} — ${loc.meaning}`}
            className="group flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition
                       disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:-translate-y-0.5"
            style={{
              background: isExpected ? 'var(--signal-soft)' : 'var(--ink-raised)',
              borderColor: isExpected ? 'rgba(255,176,32,.45)' : 'var(--line)',
            }}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-full border text-[10px] font-bold"
              style={{ borderColor: 'currentColor' }}
              aria-hidden
            >
              {loc.label.slice(0, 2)}
            </span>
            <span
              className="text-center text-[10px] font-semibold leading-tight"
              style={{ color: isExpected ? 'var(--signal)' : 'var(--text-dim)' }}
            >
              {loc.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
