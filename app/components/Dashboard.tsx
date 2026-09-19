'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Conversation from './Conversation'
import GestureKey from './GestureKey'
import GestureReader from './GestureReader'
import CaptionTrack from './CaptionTrack'
import LocaleSwitcher from './LocaleSwitcher'
import { I18nProvider, useT } from '@/lib/i18n/context'
import { stringsFor } from '@/lib/i18n/strings'
import type { DoorEvent, Gesture, RingDevice, Resolution, VisitorMemory } from '@/lib/ring/types'

function resolutionLabel(r: Resolution, t: ReturnType<typeof stringsFor>): string {
  return {
    in_progress: t.atDoorNow,
    left_at_door: t.leftAtDoor,
    message_taken: t.messageTaken,
    resident_notified: t.residentNotified,
    declined: t.declined,
  }[r]
}

const RESOLUTION_TONE: Record<Resolution, 'signal' | 'calm' | 'alert'> = {
  in_progress: 'signal',
  left_at_door: 'calm',
  message_taken: 'alert',
  resident_notified: 'calm',
  declined: 'calm',
}

export default function Dashboard({ mock }: { mock: boolean }) {
  const [events, setEvents] = useState<DoorEvent[]>([])
  const [devices, setDevices] = useState<RingDevice[]>([])
  const [memory, setMemory] = useState<VisitorMemory[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expecting, setExpecting] = useState<Gesture[]>([])
  const [rationale, setRationale] = useState<string>('')
  const [connected, setConnected] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [useRing, setUseRing] = useState(false)
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null)
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')
  const [locale, setLocale] = useState('en-US')
  const t = stringsFor(locale)
  const [polling, setPolling] = useState<{ started: boolean; reason?: string } | null>(null)
  const liveRegion = useRef<HTMLElement | null>(null)
  /** Event ids already seen, so a reconnect's snapshot does not re-announce. */
  const knownIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    liveRegion.current = document.getElementById('wave-live')
  }, [])

  /* ---- live event feed ------------------------------------------------ */
  useEffect(() => {
    const es = new EventSource(`/api/ring/events?locale=${locale}`)

    es.addEventListener('open', () => setConnected(true))
    es.addEventListener('error', () => setConnected(false))

    es.addEventListener('source', (e) => {
      setPolling(JSON.parse((e as MessageEvent).data))
    })

    es.addEventListener('snapshot', (e) => {
      const list = JSON.parse((e as MessageEvent).data) as DoorEvent[]
      for (const ev of list) knownIds.current.add(ev.id)
      setEvents(list)
      setSelectedId((cur) => cur ?? list[0]?.id ?? null)
    })

    es.addEventListener('door', (e) => {
      const incoming = JSON.parse((e as MessageEvent).data) as DoorEvent

      // Whether this event is new is decided here, against a ref, rather than
      // inside the setEvents updater. Updaters must stay pure: React invokes
      // them twice under StrictMode, which would double-announce and fight the
      // resident's selection.
      const isNew = !knownIds.current.has(incoming.id)
      knownIds.current.add(incoming.id)

      setEvents((prev) => {
        const i = prev.findIndex((p) => p.id === incoming.id)
        if (i < 0) return [incoming, ...prev]
        const next = [...prev]
        next[i] = incoming
        return next
      })

      if (isNew) {
        // A brand new event always takes focus — that is the whole point of the
        // product: the resident cannot hear it happen.
        setSelectedId(incoming.id)
        announce(t.isAtThe(t.visitor.unknown, incoming.deviceName))
      }
    })

    return () => es.close()
  }, [locale])

  useEffect(() => {
    fetch(`/api/ring/devices?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => setDevices(d.devices ?? []))
      .catch(() => setDevices([]))
    fetch(`/api/memory?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => setMemory(d.memory ?? []))
      .catch(() => setMemory([]))
  }, [locale])

  const announce = (text: string) => {
    if (liveRegion.current) liveRegion.current.textContent = text
  }

  const selected = useMemo(
    () => events.find((e) => e.id === selectedId) ?? events[0],
    [events, selectedId],
  )

  const active = selected?.resolution === 'in_progress'

  /** The first non-chime device, which is what a live view can be opened on. */
  const liveDevice = useMemo(() => devices.find((d) => d.kind !== 'chime'), [devices])

  /* ---- actions -------------------------------------------------------- */
  const sendGesture = useCallback(
    async (gesture: Gesture, confidence: number) => {
      if (!selected) return
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selected.id, gesture, confidence, locale }),
      })
      if (!res.ok) return
      const { event, decision } = await res.json()
      setEvents((prev) => prev.map((p) => (p.id === event.id ? event : p)))
      setExpecting(decision.expecting)
      setRationale(decision.rationale)
      announce(decision.speak || resolutionLabel(event.resolution as Resolution, t))
    },
    [selected, locale],
  )

  const onLocale = useCallback((code: string, d: 'ltr' | 'rtl') => {
    setDir(d)
    setLocale(code)
  }, [])

  const simulate = useCallback(async (visitor: string) => {
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor, locale }),
    })
    const { decision } = await res.json()
    setExpecting(decision.expecting)
    setRationale(decision.rationale)
  }, [locale])

  return (
    <I18nProvider locale={locale}>
    <main className="mx-auto max-w-shell px-5 py-7 md:px-8" dir={dir} data-locale={locale}>
      <Header mock={mock} connected={connected} devices={devices} polling={polling} />

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* ---------------- live door ---------------- */}
        <section className="space-y-5">
          <div className={`card relative overflow-hidden p-5 ${active ? 'ring-pulse' : ''}`}>
            {selected ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="eyebrow">{selected.deviceName}</div>
                    <h2 className="display mt-1 text-[28px] font-semibold leading-[1.15]">
                      {t.isAtThe(
                        selected.visitorLabel ?? visitorTitle(selected.visitor, t),
                        selected.deviceName,
                      )}
                    </h2>
                    <p className="mt-1 text-xs text-faint">
                      {timeAgo(selected.startedAt)} · {t.triggeredBy}{' '}
                      <span className="font-mono">{selected.trigger}</span> ·{' '}
                      {Math.round(selected.confidence * 100)}% {t.confidence}
                    </p>
                  </div>
                  <Badge tone={RESOLUTION_TONE[selected.resolution]}>
                    {active && <span className="breathe">●</span>}
                    {resolutionLabel(selected.resolution, t)}
                  </Badge>
                </div>

                <div className="mt-5 border-t pt-5">
                  <Conversation event={selected} />
                </div>
              </>
            ) : (
              <Empty />
            )}
          </div>

          {rationale && (
            <div
              className="card rise p-4 text-[13px] leading-relaxed"
              style={{ borderColor: 'rgba(45,212,191,.28)', background: 'var(--calm-soft)' }}
            >
              <div className="eyebrow mb-1.5" style={{ color: 'var(--calm)' }}>
                {t.whyWaveDidThat}
              </div>
              <p style={{ color: 'var(--text)' }}>{rationale}</p>
            </div>
          )}

          <CaptionTrack stream={liveStream} active={cameraOn} />

          <History events={events} selectedId={selected?.id} onSelect={setSelectedId} />
        </section>

        {/* ---------------- side rail ---------------- */}
        <aside className="space-y-5">
          <LocaleSwitcher onResidentChange={onLocale} />

          <section className="card p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold tracking-tight">{t.camera}</h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-faint">
                  {useRing ? t.ringLive : t.webcam}
                </p>
              </div>
              <button
                onClick={() => setCameraOn((v) => !v)}
                className="pill shrink-0 transition"
                style={{
                  color: cameraOn ? 'var(--signal)' : 'var(--text-dim)',
                  background: cameraOn ? 'var(--signal-soft)' : 'transparent',
                }}
              >
                {cameraOn ? t.stop : t.start}
              </button>
            </div>

            {/* Both sources run the identical landmark pipeline, so switching
                between them is a fair test of the classifier, not a fallback. */}
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border p-1" style={{ background: 'var(--ink-raised)' }}>
              {(
                [
                  [false, t.webcam],
                  [true, t.ringLive],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={label}
                  onClick={() => setUseRing(val)}
                  disabled={val && !liveDevice}
                  className="rounded-md px-2 py-1.5 text-[11px] font-semibold transition disabled:opacity-35"
                  style={{
                    background: useRing === val ? 'var(--signal-soft)' : 'transparent',
                    color: useRing === val ? 'var(--signal)' : 'var(--text-dim)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <GestureReader
              enabled={cameraOn}
              ringDeviceId={useRing ? liveDevice?.id : undefined}
              onStream={setLiveStream}
              onGesture={(g, c) => {
                if (active) sendGesture(g, c)
              }}
            />
          </section>

          <Panel
            title={t.gestureVocabulary}
            hint={t.gestureSubtitle}
          >
            <GestureKey expecting={expecting} disabled={!active} onSend={sendGesture} />
            {!active && (
              <p className="mt-3 text-[11px] leading-relaxed text-faint">
                {t.enabledWhileOpen}
              </p>
            )}
          </Panel>

          <Panel title={t.ringTheDoorbell} hint={t.simSubtitle}>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['courier', t.sim.courier],
                  ['stranger', t.sim.stranger],
                  ['known', t.sim.known],
                  ['vehicle', t.sim.vehicle],
                ] as const
              ).map(([kind, label]) => (
                <button
                  key={kind}
                  onClick={() => simulate(kind)}
                  className="rounded-lg border px-3 py-2.5 text-xs font-semibold transition hover:-translate-y-0.5"
                  style={{ background: 'var(--ink-raised)', color: 'var(--text-dim)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title={t.whoWaveRemembers}>
            <ul className="space-y-2.5">
              {memory.map((m) => (
                <li key={m.label} className="rounded-lg border p-3" style={{ background: 'var(--ink-raised)' }}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-semibold">{m.label}</span>
                    <span className="font-mono text-[10px] text-faint">{m.seenCount}×</span>
                  </div>
                  {m.policy && (
                    <p className="mt-1 text-[11.5px] leading-relaxed text-dim">{m.policy}</p>
                  )}
                </li>
              ))}
              {memory.length === 0 && <li className="text-xs text-faint">{t.nobodyYet}</li>}
            </ul>
          </Panel>

          <Panel title="Devices">
            <ul className="space-y-1.5">
              {devices.map((d) => (
                <li key={d.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-dim">{d.name}</span>
                  <span
                    className="pill"
                    style={{
                      color: d.online ? 'var(--calm)' : 'var(--text-faint)',
                      background: d.online ? 'var(--calm-soft)' : 'transparent',
                    }}
                  >
                    {d.kind}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </main>
    </I18nProvider>
  )
}

/* -------------------------------------------------------------------- */

function Header({
  mock,
  connected,
  devices,
  polling,
}: {
  mock: boolean
  connected: boolean
  devices: RingDevice[]
  polling: { started: boolean; reason?: string } | null
}) {
  const t = useT()
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
      <div>
        <div className="flex items-center gap-2.5">
          <WaveMark />
          <span className="display text-[24px] font-bold tracking-[-0.02em]">WAVE</span>
        </div>
        <p className="mt-1.5 text-[13px] text-dim">
          {t.tagline}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="pill"
          style={{
            color: connected ? 'var(--calm)' : 'var(--alert)',
            background: connected ? 'var(--calm-soft)' : 'var(--alert-soft)',
          }}
        >
          <span className={connected ? 'breathe' : ''}>●</span>
          {connected ? t.live : t.reconnecting}
        </span>
        <span
          className="pill"
          style={{
            color: polling?.started ? 'var(--signal)' : 'var(--text-dim)',
            background: polling?.started ? 'var(--signal-soft)' : 'transparent',
          }}
          title={polling?.reason}
        >
          {mock ? t.mockData : polling?.started ? t.watchingRing : 'Ring Playground'}
        </span>
        <span className="pill" style={{ color: 'var(--text-dim)' }}>
          {t.devices(devices.length)}
        </span>
      </div>
    </header>
  )
}

/** A doorbell press drawn as what it is for a Deaf resident: light, not sound. */
function WaveMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <circle cx="13" cy="13" r="3.2" fill="var(--signal)" />
      <circle cx="13" cy="13" r="7" stroke="var(--signal)" strokeOpacity=".55" strokeWidth="1.6" />
      <circle cx="13" cy="13" r="11.2" stroke="var(--signal)" strokeOpacity=".22" strokeWidth="1.6" />
    </svg>
  )
}

function Panel({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="card p-4">
      <h3 className="text-[13px] font-semibold tracking-tight">{title}</h3>
      {hint && <p className="mt-1 mb-3 text-[11.5px] leading-relaxed text-faint">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </section>
  )
}

function Badge({ tone, children }: { tone: 'signal' | 'calm' | 'alert'; children: React.ReactNode }) {
  const map = {
    signal: ['var(--signal)', 'var(--signal-soft)'],
    calm: ['var(--calm)', 'var(--calm-soft)'],
    alert: ['var(--alert)', 'var(--alert-soft)'],
  } as const
  const [fg, bg] = map[tone]
  return (
    <span className="pill" style={{ color: fg, background: bg, borderColor: fg }}>
      {children}
    </span>
  )
}

function History({
  events,
  selectedId,
  onSelect,
}: {
  events: DoorEvent[]
  selectedId?: string
  onSelect: (id: string) => void
}) {
  const t = useT()
  return (
    <section className="card p-4">
      <h3 className="mb-3 text-[13px] font-semibold tracking-tight">{t.recent}</h3>
      <ul className="space-y-1.5">
        {events.map((e) => {
          const on = e.id === selectedId
          return (
            <li key={e.id}>
              <button
                onClick={() => onSelect(e.id)}
                className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-start transition hover:border-bright"
                style={{
                  background: on ? 'var(--ink-raised)' : 'transparent',
                  borderColor: on ? 'var(--line-bright)' : 'transparent',
                }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background:
                      e.resolution === 'in_progress'
                        ? 'var(--signal)'
                        : e.acknowledged
                          ? 'var(--line-bright)'
                          : 'var(--calm)',
                  }}
                />
                <span className="min-w-0 flex-1 truncate text-[13px]">
                  {e.visitorLabel ?? visitorTitle(e.visitor, t)}
                  <span className="ms-2 text-faint">{e.deviceName}</span>
                </span>
                <span className="shrink-0 font-mono text-[10.5px] text-faint">
                  {timeAgo(e.startedAt)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Empty() {
  const t = useT()
  return (
    <div className="py-14 text-center">
      <div className="mx-auto mb-3 w-fit opacity-40">
        <WaveMark />
      </div>
      <p className="text-sm text-dim">{t.nothingAtDoor}</p>
      <p className="mt-1 text-xs text-faint">{t.ringTheDoorbell} from the panel on the right.</p>
    </div>
  )
}

function visitorTitle(kind: string, t: ReturnType<typeof stringsFor>) {
  return t.visitor[kind as keyof typeof t.visitor] ?? t.visitor.unknown
}

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}
