'use client'

import { useEffect, useRef, useState } from 'react'
import { downsample, floatToPcm16, TRANSCRIBE_SAMPLE_RATE } from '@/lib/captions/transcriber'
import type { CaptionChunk, TranscriberStatus } from '@/lib/captions/transcriber'

/**
 * Live captions for the visitor's speech.
 *
 * The audio comes off the Ring WHEP track — the one the documentation says does
 * not exist. Frames are read here, converted to 16 kHz PCM, and posted in
 * chunks; the raw stream is never stored.
 *
 * When no backend is configured the component does not fall silent. It says so,
 * in the panel, because a Deaf resident staring at an empty caption box needs
 * to know the difference between "nobody is speaking" and "captions are off".
 */
export default function CaptionTrack({
  stream,
  active,
}: {
  stream: MediaStream | null
  active: boolean
}) {
  const [chunks, setChunks] = useState<CaptionChunk[]>([])
  const [partial, setPartial] = useState('')
  const [status, setStatus] = useState<TranscriberStatus | null>(null)
  const [listening, setListening] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startedAt = useRef(0)

  useEffect(() => {
    fetch('/api/captions/status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [])

  useEffect(() => {
    if (!stream || !active || !status?.available) return
    const track = stream.getAudioTracks()[0]
    if (!track) return

    let ctx: AudioContext | null = null
    let cancelled = false
    startedAt.current = Date.now()

    ;(async () => {
      ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(new MediaStream([track]))

      // ScriptProcessor is deprecated in favour of AudioWorklet, but the worklet
      // needs a separate module file served from the origin, and this runs in a
      // Next route where that is more moving parts than the job deserves. The
      // buffer is large enough that the main-thread cost is negligible.
      const node = ctx.createScriptProcessor(4096, 1, 1)
      const sourceRate = ctx.sampleRate
      let pending: Int16Array[] = []

      node.onaudioprocess = (e) => {
        if (cancelled) return
        const raw = e.inputBuffer.getChannelData(0)
        pending.push(floatToPcm16(downsample(raw, sourceRate, TRANSCRIBE_SAMPLE_RATE)))
      }

      source.connect(node)
      // A ScriptProcessor only fires while connected to a destination. Routing
      // it to a muted gain node keeps it running without the resident hearing
      // audio they cannot use anyway.
      const mute = ctx.createGain()
      mute.gain.value = 0
      node.connect(mute)
      mute.connect(ctx.destination)
      setListening(true)

      // Ship roughly a second at a time. Shorter chunks cut words in half;
      // longer ones make the captions lag the person speaking.
      const flush = setInterval(async () => {
        if (cancelled || pending.length === 0) return
        const total = pending.reduce((n, c) => n + c.length, 0)
        const merged = new Int16Array(total)
        let off = 0
        for (const c of pending) {
          merged.set(c, off)
          off += c.length
        }
        pending = []

        try {
          const res = await fetch('/api/captions/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: merged.buffer as ArrayBuffer,
          })
          if (!res.ok) return
          const data = (await res.json()) as { chunks?: CaptionChunk[] }
          for (const c of data.chunks ?? []) {
            if (c.isFinal) {
              setChunks((prev) => [...prev, c])
              setPartial('')
            } else {
              setPartial(c.text)
            }
          }
        } catch {
          /* a dropped chunk is a gap in the captions, not a crash */
        }
      }, 1000)

      return () => clearInterval(flush)
    })()

    return () => {
      cancelled = true
      setListening(false)
      void ctx?.close()
    }
  }, [stream, active, status?.available])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chunks, partial])

  const hasAudio = (stream?.getAudioTracks().length ?? 0) > 0

  return (
    <section className="card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-tight">What the visitor said</h3>
          <p className="mt-1 text-[11.5px] leading-relaxed text-faint">
            Ring&rsquo;s own docs say the live view carries no audio. It carries Opus.
          </p>
        </div>
        {listening && (
          <span className="pill shrink-0" style={{ color: 'var(--calm)', background: 'var(--calm-soft)' }}>
            <span className="breathe">●</span> captioning
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="max-h-40 overflow-y-auto rounded-lg border p-3 text-[13px] leading-relaxed"
        style={{ background: 'var(--ink-raised)' }}
        // Captions are the primary channel for this user, so they are announced
        // rather than merely rendered.
        aria-live="polite"
        aria-atomic="false"
      >
        {chunks.length === 0 && !partial && (
          <p className="text-faint">
            {!status
              ? 'Checking the transcription backend…'
              : !status.available
                ? status.explanation
                : !hasAudio
                  ? 'No audio track on this stream yet.'
                  : 'Nothing said yet.'}
          </p>
        )}

        {chunks.map((c, i) => (
          <p key={i} className="rise mb-1.5">
            <span className="mr-2 font-mono text-[10px] text-faint">{fmt(c.at)}</span>
            {c.text}
          </p>
        ))}

        {/* Partials are dimmed so the resident can see the difference between
            what has been confirmed and what the recogniser is still revising. */}
        {partial && (
          <p className="mb-1.5 italic" style={{ color: 'var(--text-dim)' }}>
            {partial}
          </p>
        )}
      </div>

      {status && (
        <p className="mt-2 text-[11px] leading-relaxed text-faint">{status.explanation}</p>
      )}
    </section>
  )
}

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
