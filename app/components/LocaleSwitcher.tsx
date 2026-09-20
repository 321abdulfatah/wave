'use client'

import { useEffect, useMemo, useState } from 'react'
import { LOCALES } from '@/lib/gestures/locales'
import {
  LOCALE_GROUPS,
  localeLabel,
  resolve,
  seedResidentLocale,
  DEFAULT_RESIDENT,
} from '@/lib/locale/resolve'
import { gestureSpec } from '@/lib/gestures/vocabulary'
import { stringsFor, isTranslated } from '@/lib/i18n/strings'

/**
 * Two questions, deliberately separated, because conflating them is the mistake
 * this whole feature exists to avoid:
 *
 *   "What language do YOU read?"        → the resident's interface
 *   "Who arrives at your door?"        → the gesture vocabulary and speech
 *
 * The second cannot be detected. Not by IP, which locates the door rather than
 * the person at it, and not by device locale, which is the same thing. It is
 * asked, and the answer narrows the safe set.
 */
const ALL_CODES = Object.keys(LOCALES)

export default function LocaleSwitcher({
  onResidentChange,
}: {
  onResidentChange?: (code: string, dir: 'ltr' | 'rtl') => void
}) {
  const [resident, setResident] = useState(DEFAULT_RESIDENT)
  const [visitors, setVisitors] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [flipping, setFlipping] = useState(false)

  // Seeded once from a stated preference, never from an inference.
  useEffect(() => {
    setResident(seedResidentLocale(navigator.languages ?? [navigator.language]))
  }, [])

  const res = useMemo(() => resolve(resident, visitors), [resident, visitors])
  const t = stringsFor(resident)

  useEffect(() => {
    document.documentElement.lang = res.resident.code
    document.documentElement.dir = res.resident.dir
    onResidentChange?.(res.resident.code, res.resident.dir)
  }, [res.resident, onResidentChange])

  // Direction changes are the most violent thing this control can do to a
  // layout, so it gets a brief settle rather than snapping mid-frame.
  function pickResident(code: string) {
    const changingDirection = LOCALES[code]?.dir !== res.resident.dir
    if (changingDirection) {
      setFlipping(true)
      setTimeout(() => setFlipping(false), 420)
    }
    setResident(code)
  }

  function toggleVisitor(code: string) {
    setVisitors((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  return (
    <section className={`card overflow-hidden p-4 ${flipping ? 'locale-flip' : ''}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-start"
        aria-expanded={open}
      >
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight">{t.languageAndCulture}</h3>
          <p className="mt-1 text-[11.5px] leading-relaxed text-faint">
            {localeLabel(res.resident.code, ALL_CODES)} · {t.gesturesSafe(res.safeGestures.length)}
            {res.excluded.length > 0 && ` · ${t.withheld(res.excluded.length)}`}
          </p>
        </div>
        <span
          className="mt-1 shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-[380ms]"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          opacity: open ? 1 : 0,
          transitionTimingFunction: 'var(--ease-swell)',
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            {/* ---- the resident ---- */}
            <p className="eyebrow mb-2">{t.whatYouRead}</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(LOCALES).map((l) => {
                const on = l.code === resident
                return (
                  <button
                    key={l.code}
                    onClick={() => pickResident(l.code)}
                    lang={l.code}
                    className="rounded-full border px-3 py-1.5 text-[12px] transition-all duration-200
                               hover:-translate-y-px"
                    style={{
                      background: on ? 'var(--ochre-wash)' : 'transparent',
                      borderColor: on ? 'var(--ochre-line)' : 'var(--line)',
                      color: on ? 'var(--ochre-ink)' : 'var(--ink-2)',
                      fontWeight: on ? 600 : 400,
                    }}
                  >
                    {localeLabel(l.code, ALL_CODES)}
                    {!isTranslated(l.code) && (
                      <span className="ms-1.5 opacity-55" title={t.inEnglish} aria-label={t.inEnglish}>
                        EN
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <p className="mt-2.5 text-[11px] leading-relaxed text-faint">
              {t.interfaceLanguages}
            </p>

            {/* ---- the visitors ---- */}
            <p className="eyebrow mb-2 mt-5">{t.whoArrives}</p>
            <p className="mb-3 text-[11.5px] leading-relaxed text-faint">
              {t.whoArrivesHint}
            </p>

            <div className="space-y-3">
              {LOCALE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
                    {t.regions[group.label] ?? group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.codes.map((code) => {
                      const on = visitors.includes(code)
                      return (
                        <button
                          key={code}
                          onClick={() => toggleVisitor(code)}
                          lang={code}
                          aria-pressed={on}
                          className="rounded-full border px-2.5 py-1 text-[11.5px] transition-all duration-200
                                     hover:-translate-y-px"
                          style={{
                            background: on ? 'var(--sage-wash)' : 'transparent',
                            borderColor: on ? 'var(--sage-line)' : 'var(--line)',
                            color: on ? 'var(--sage)' : 'var(--ink-3)',
                            fontWeight: on ? 600 : 400,
                          }}
                        >
                          {localeLabel(code, group.codes)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ---- the consequence, stated plainly ---- */}
            <div
              className="rise mt-5 rounded-lg border p-3"
              style={{ background: 'var(--paper-2)', borderColor: 'var(--line)' }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {res.explanation}
              </p>

              {res.excluded.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {res.excluded.map((e) => {
                    const name = (id: string) =>
                      t.gestures[id]?.label ?? gestureSpec(id as never)?.label ?? id
                    return (
                      <li key={e.gesture} className="text-[11.5px] leading-relaxed text-faint">
                        <span className="line-through">{name(e.gesture)}</span>
                        {' — '}
                        {localeLabel(e.from, ALL_CODES)}: {t.severity[e.severity]}
                        {e.substitute ? ` — ${t.offersInstead(name(e.substitute))}` : ''}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
