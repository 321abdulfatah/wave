'use client'

import type { DoorEvent, Turn } from '@/lib/ring/types'
import { gestureSpec } from '@/lib/gestures/vocabulary'
import { useT } from '@/lib/i18n/context'

/**
 * The doorstep transcript.
 *
 * Laid out as a conversation with two sides because that is what it is — the
 * door speaks aloud through the Chime, the visitor answers with their hands.
 * The resident reads both halves, having heard neither.
 */
export default function Conversation({ event }: { event: DoorEvent }) {
  const t = useT()
  return (
    <ol className="space-y-3">
      {event.turns.map((turn, i) => (
        <li key={i} className="rise" style={{ animationDelay: `${i * 70}ms` }}>
          <TurnRow turn={turn} />
        </li>
      ))}

      {event.resolution === 'in_progress' && (
        <li className="flex items-center gap-3 ps-1 pt-1">
          <Waveform />
          <span className="text-xs text-faint">{t.listeningForGesture}</span>
        </li>
      )}
    </ol>
  )
}

function TurnRow({ turn }: { turn: Turn }) {
  const t = useT()
  const isDoor = turn.from === 'door'
  const spec = turn.gesture ? gestureSpec(turn.gesture) : undefined
  const loc = turn.gesture ? t.gestures[turn.gesture] : undefined

  /**
   * What this turn says, in the language on screen right now.
   *
   * Door lines and gestures resolve from their key, so a transcript recorded
   * in English reads as Arabic the moment the resident switches. `turn.text`
   * is the exception and is left alone: it holds a caption of what someone
   * actually said, and translating a record of speech would be a lie about
   * what was spoken.
   */
  const body = turn.key
    ? t.door[turn.key]
    : loc
      ? `${loc.label} — ${loc.meaning}`
      : (turn.text ?? '')

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
        {isDoor ? <SpeakerMark /> : <HandMark />}
      </div>

      <div className={`max-w-[78%] ${isDoor ? '' : 'text-end'}`}>
        <div className="eyebrow mb-1">
          {isDoor ? t.theDoorSaid : t.visitorGestured}
          {typeof turn.confidence === 'number' && (
            <span className="ms-2 font-mono text-[10px] text-faint">
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
          {body}
        </p>
      </div>
    </div>
  )
}

/* Emoji are deliberately absent. A gesture vocabulary that varies by locale
   cannot be drawn from a fixed emoji set — 👍 is one glyph and several
   meanings. The real hand glyphs are built from the 21 MediaPipe landmarks in
   design/gestural.html and will replace these marks. */

function SpeakerMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 6h2.5L9 3v10L5.5 10H3z" fill="currentColor" />
      <path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function HandMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5 9V4.2a1 1 0 0 1 2 0V8m0-.5V3.2a1 1 0 0 1 2 0V8m0-.3V4.2a1 1 0 0 1 2 0V9m-8 0v2a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4V6.7a1 1 0 0 1 2 0V9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
