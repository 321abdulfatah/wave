'use client'

import type { DoorEvent, Turn } from '@/lib/ring/types'
import { gestureSpec } from '@/lib/gestures/vocabulary'

/**
 * The doorstep transcript.
 *
 * Laid out as a conversation with two sides because that is what it is — the
 * door speaks aloud through the Chime, the visitor answers with their hands.
 * The resident reads both halves, having heard neither.
 */
export default function Conversation({ event }: { event: DoorEvent }) {
  return (
    <ol className="space-y-3">
      {event.turns.map((turn, i) => (
        <li key={i} className="rise" style={{ animationDelay: `${i * 70}ms` }}>
          <TurnRow turn={turn} />
        </li>
      ))}

      {event.resolution === 'in_progress' && (
        <li className="flex items-center gap-3 pl-1 pt-1">
          <Waveform />
          <span className="text-xs text-faint">listening for a gesture…</span>
        </li>
      )}
    </ol>
  )
}

function TurnRow({ turn }: { turn: Turn }) {
  const isDoor = turn.from === 'door'
  const spec = turn.gesture ? gestureSpec(turn.gesture) : undefined

  return (
    <div className={`flex gap-3 ${isDoor ? '' : 'flex-row-reverse'}`}>
      <div
        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm"
        style={{
          borderColor: isDoor ? 'var(--line-bright)' : 'var(--signal)',
          background: isDoor ? 'var(--ink-raised)' : 'var(--signal-soft)',
        }}
        aria-hidden
      >
        {isDoor ? '🔊' : (spec?.glyph ?? '🖐')}
      </div>

      <div className={`max-w-[78%] ${isDoor ? '' : 'text-right'}`}>
        <div className="eyebrow mb-1">
          {isDoor ? 'The door said' : 'Visitor gestured'}
          {typeof turn.confidence === 'number' && (
            <span className="ml-2 font-mono text-[10px] text-faint">
              {Math.round(turn.confidence * 100)}%
            </span>
          )}
        </div>
        <p
          className="rounded-xl border px-3.5 py-2.5 text-[13.5px] leading-relaxed"
          style={{
            background: isDoor ? 'var(--ink-raised)' : 'var(--signal-soft)',
            borderColor: isDoor ? 'var(--line)' : 'rgba(255,176,32,.28)',
            color: isDoor ? 'var(--text)' : 'var(--signal)',
          }}
        >
          {turn.text}
        </p>
      </div>
    </div>
  )
}

/** Stands in for the sound the resident cannot hear. */
function Waveform() {
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="bar block w-[3px] rounded-full"
          style={{
            height: '100%',
            background: 'var(--line-bright)',
            animationDelay: `${i * 0.11}s`,
          }}
        />
      ))}
    </div>
  )
}
