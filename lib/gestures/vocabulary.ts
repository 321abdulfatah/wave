import type { Gesture } from '@/lib/ring/types'

/**
 * WAVE's gesture vocabulary.
 *
 * Ring's live streams carry no audio, so a visitor cannot answer by speaking to
 * the device. They answer with their hands instead. Each gesture is chosen to be
 * unambiguous at doorstep distance and readable from MediaPipe's 21 hand landmarks.
 */
export interface GestureSpec {
  id: Gesture
  glyph: string
  label: string
  /** What WAVE takes this to mean in a doorstep conversation. */
  meaning: string
  /** Minimum landmark confidence before WAVE will act on it. */
  threshold: number
}

export const GESTURES: GestureSpec[] = [
  {
    id: 'thumbs_up',
    glyph: '👍',
    label: 'Thumbs up',
    meaning: 'Yes — go ahead',
    threshold: 0.82,
  },
  {
    id: 'open_palm',
    glyph: '✋',
    label: 'Open palm',
    meaning: 'Wait — I need a moment',
    threshold: 0.78,
  },
  {
    id: 'wave',
    glyph: '👋',
    label: 'Wave',
    meaning: 'Hello — I am a person, not a delivery',
    threshold: 0.75,
  },
  {
    id: 'point',
    glyph: '☝',
    label: 'Point down',
    meaning: 'Leaving it here',
    threshold: 0.8,
  },
  {
    id: 'fist',
    glyph: '✊',
    label: 'Closed fist',
    meaning: 'No — cancel',
    threshold: 0.85,
  },
]

export function gestureSpec(id: Gesture): GestureSpec | undefined {
  return GESTURES.find((g) => g.id === id)
}

/**
 * Classify a MediaPipe Hands landmark array into WAVE's vocabulary.
 *
 * Landmarks arrive normalised to the frame, so every test below is a ratio and
 * stays valid regardless of how far the visitor is standing from the doorbell.
 */
export function classifyLandmarks(
  lm: { x: number; y: number; z: number }[],
): { gesture: Gesture; confidence: number } {
  if (!lm || lm.length < 21) return { gesture: 'none', confidence: 0 }

  const wrist = lm[0]
  const thumbTip = lm[4]
  const indexTip = lm[8]
  const middleTip = lm[12]
  const ringTip = lm[16]
  const pinkyTip = lm[20]

  // A finger counts as extended when its tip sits further from the wrist than
  // its middle joint does.
  const extended = (tip: typeof lm[0], pip: typeof lm[0]) =>
    dist(tip, wrist) > dist(pip, wrist) * 1.15

  const fingers = [
    extended(indexTip, lm[6]),
    extended(middleTip, lm[10]),
    extended(ringTip, lm[14]),
    extended(pinkyTip, lm[18]),
  ]
  const openCount = fingers.filter(Boolean).length
  const thumbOut = dist(thumbTip, wrist) > dist(lm[2], wrist) * 1.3
  const thumbAbove = thumbTip.y < wrist.y - 0.12

  if (thumbOut && thumbAbove && openCount === 0) {
    return { gesture: 'thumbs_up', confidence: 0.93 }
  }
  if (openCount === 4 && thumbOut) {
    return { gesture: 'open_palm', confidence: 0.88 }
  }
  if (openCount === 0 && !thumbOut) {
    return { gesture: 'fist', confidence: 0.9 }
  }
  if (fingers[0] && openCount === 1) {
    return { gesture: 'point', confidence: 0.86 }
  }
  return { gesture: 'none', confidence: 0 }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}
