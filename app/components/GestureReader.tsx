'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { classifyLandmarks, gestureSpec } from '@/lib/gestures/vocabulary'
import { openWhepSession } from '@/lib/ring/whep'
import type { Gesture } from '@/lib/ring/types'

/**
 * Live gesture reader.
 *
 * In production the frames come from the Ring camera's WHEP stream. Here they
 * come from whatever camera the browser offers, because the pipeline is
 * identical either way: frames in, 21 hand landmarks out, a label posted to the
 * agent. Nothing but that label ever leaves the page — the video is read in the
 * canvas and discarded, never uploaded, never logged.
 */

/** Frames the same gesture must hold before it counts as an answer. */
const STABLE_FRAMES = 8
/** Refuse to fire twice inside this window, so one hand-raise is one answer. */
const COOLDOWN_MS = 2500

export default function GestureReader({
  enabled,
  ringDeviceId,
  onGesture,
  onStream,
}: {
  enabled: boolean
  /** When set, frames come from this Ring camera's WHEP live view instead of
   *  the local webcam. Same landmarks, same classifier, same everything after. */
  ringDeviceId?: string
  onGesture: (g: Gesture, confidence: number) => void
  /** Surfaces the live stream so the caption layer can read its audio track. */
  onStream?: (s: MediaStream | null) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streakRef = useRef<{ gesture: Gesture; count: number }>({ gesture: 'none', count: 0 })
  const lastFiredRef = useRef(0)
  const cleanupRef = useRef<(() => void) | null>(null)

  const [status, setStatus] = useState<'idle' | 'loading' | 'live' | 'denied' | 'error'>('idle')
  const [reading, setReading] = useState<{ gesture: Gesture; confidence: number } | null>(null)
  const [progress, setProgress] = useState(0)

  // Keep the callback in a ref so restarting the camera is not tied to it
  // changing identity on every parent render.
  const onGestureRef = useRef(onGesture)
  useEffect(() => {
    onGestureRef.current = onGesture
  }, [onGesture])

  const handleResults = useCallback((results: { multiHandLandmarks?: { x: number; y: number; z: number }[][] }) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth || 480
    canvas.height = video.videoHeight || 360
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const hand = results.multiHandLandmarks?.[0]
    if (!hand) {
      streakRef.current = { gesture: 'none', count: 0 }
      setReading(null)
      setProgress(0)
      ctx.restore()
      return
    }

    drawHand(ctx, hand, canvas.width, canvas.height)

    const { gesture, confidence } = classifyLandmarks(hand)
    setReading(gesture === 'none' ? null : { gesture, confidence })

    // A gesture only counts once it has held still. A hand passing through the
    // frame on its way somewhere else is not an answer to a question.
    const streak = streakRef.current
    if (gesture !== 'none' && gesture === streak.gesture) streak.count += 1
    else streakRef.current = { gesture, count: gesture === 'none' ? 0 : 1 }

    setProgress(Math.min(1, streakRef.current.count / STABLE_FRAMES))

    const spec = gestureSpec(gesture)
    const ready =
      gesture !== 'none' &&
      spec != null &&
      confidence >= spec.threshold &&
      streakRef.current.count >= STABLE_FRAMES &&
      Date.now() - lastFiredRef.current > COOLDOWN_MS

    if (ready) {
      lastFiredRef.current = Date.now()
      streakRef.current = { gesture: 'none', count: 0 }
      setProgress(0)
      onGestureRef.current(gesture, confidence)
    }

    ctx.restore()
  }, [])

  useEffect(() => {
    if (!enabled) {
      cleanupRef.current?.()
      cleanupRef.current = null
      setStatus('idle')
      return
    }

    let cancelled = false
    setStatus('loading')

    ;(async () => {
      try {
        const { Hands } = await import('@mediapipe/hands')
        if (cancelled) return

        const hands = new Hands({
          // The npm package does not resolve its own wasm and model assets, so
          // they are pulled from the matching CDN build.
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        })
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0, // Integrated GPU — favour latency over precision.
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
        })
        hands.onResults(handleResults)

        const video = videoRef.current
        if (!video) return

        // Either source ends up as a MediaStream on the same <video>, so the
        // inference loop below does not care which one it is.
        let closeSource: () => Promise<void> | void
        if (ringDeviceId) {
          const session = await openWhepSession(ringDeviceId)
          if (cancelled) {
            await session.close()
            return
          }
          video.srcObject = session.stream
          onStream?.(session.stream)
          closeSource = session.close
        } else {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 480, height: 360 },
          })
          if (cancelled) {
            for (const t of stream.getTracks()) t.stop()
            return
          }
          video.srcObject = stream
          onStream?.(stream)
          closeSource = () => {
            for (const t of stream.getTracks()) t.stop()
          }
        }

        await video.play()
        setStatus('live')

        // A rAF loop rather than @mediapipe/camera_utils, because that helper
        // owns getUserMedia itself and cannot be pointed at a WebRTC stream.
        let frame = 0
        let inFlight = false
        const tick = async () => {
          frame = requestAnimationFrame(tick)
          if (inFlight || video.readyState < 2) return
          inFlight = true
          try {
            await hands.send({ image: video })
          } finally {
            inFlight = false
          }
        }
        frame = requestAnimationFrame(tick)

        cleanupRef.current = () => {
          cancelAnimationFrame(frame)
          hands.close()
          void closeSource()
          onStream?.(null)
          video.srcObject = null
        }
      } catch (err) {
        if (cancelled) return
        const name = (err as Error).name
        setStatus(name === 'NotAllowedError' || name === 'PermissionDeniedError' ? 'denied' : 'error')
      }
    })()

    return () => {
      cancelled = true
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [enabled, ringDeviceId, handleResults])

  const spec = reading ? gestureSpec(reading.gesture) : undefined

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border"
        style={{ background: 'var(--ink-raised)' }}
      >
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className={`h-full w-full object-cover ${ringDeviceId ? '' : '-scale-x-100'}`} />

        {status !== 'live' && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <p className="text-xs leading-relaxed text-faint">
              {status === 'idle' && 'Starts when a conversation opens.'}
              {status === 'loading' && 'Starting camera…'}
              {status === 'denied' && 'Camera permission denied. Allow it and reopen.'}
              {status === 'error' &&
                (ringDeviceId
                  ? 'Could not open the Ring live view. The token may have expired.'
                  : 'No camera available on this machine.')}
            </p>
          </div>
        )}

        {status === 'live' && spec && (
          <div
            className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-lg border px-3 py-2 backdrop-blur"
            style={{ background: 'rgba(7,8,11,.82)', borderColor: 'rgba(255,176,32,.4)' }}
          >
            <span className="text-[11px] font-bold uppercase tracking-wide" aria-hidden>
              {spec.label}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold" style={{ color: 'var(--signal)' }}>
                {spec.label}
              </div>
              {/* Filling this bar is the visitor's only feedback that the door
                  has understood them — they cannot hear a confirmation tone. */}
              <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
                <div
                  className="h-full rounded-full transition-[width] duration-75"
                  style={{ width: `${progress * 100}%`, background: 'var(--signal)' }}
                />
              </div>
            </div>
            <span className="font-mono text-[10px] text-faint">
              {Math.round(reading!.confidence * 100)}%
            </span>
          </div>
        )}

        {status === 'live' && (
          <span
            className="pill absolute right-3 top-3"
            style={{ background: 'rgba(7,8,11,.8)', color: 'var(--calm)' }}
          >
            <span className="breathe">●</span> reading
          </span>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-faint">
        {ringDeviceId
          ? 'Ring live view over WHEP. Frames are read in the browser; only the gesture label is stored.'
          : 'Frames are read in the browser. Only the gesture label is sent — no video leaves this page.'}
      </p>
    </div>
  )
}

/** Draw the skeleton so it is obvious what the model is actually tracking. */
function drawHand(
  ctx: CanvasRenderingContext2D,
  lm: { x: number; y: number }[],
  w: number,
  h: number,
) {
  const BONES: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17],
  ]

  ctx.strokeStyle = 'rgba(255,176,32,.85)'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  for (const [a, b] of BONES) {
    ctx.beginPath()
    ctx.moveTo(lm[a].x * w, lm[a].y * h)
    ctx.lineTo(lm[b].x * w, lm[b].y * h)
    ctx.stroke()
  }

  ctx.fillStyle = '#fff'
  for (const p of lm) {
    ctx.beginPath()
    ctx.arc(p.x * w, p.y * h, 2.6, 0, Math.PI * 2)
    ctx.fill()
  }
}
