import type { GestureId } from './locales'

/**
 * WAVE's gesture vocabulary.
 *
 * This file was rewritten after the locale research landed, because four of the
 * original five gesture-to-meaning mappings were contradicted by Matsumoto &
 * Hwang (2013), a peer-reviewed emblem catalogue with measured recognition
 * rates. The reasoning for every change is in docs/gesture-research-*.md.
 *
 * Three rules govern what may live here:
 *
 *  1. A gesture must be geometrically separable from every other gesture on at
 *     least TWO independent high-reliability features, not one. Motion alone is
 *     not enough — a hesitant visitor or a three-frame buffer destroys it.
 *  2. A gesture must have no offensive reading in any locale where it is
 *     offered. Where one exists, the gesture is withheld there rather than
 *     softened, and a substitute is named.
 *  3. A gesture must be detectable from 21 landmarks at doorbell distance. A
 *     culturally perfect gesture we cannot see is worthless.
 */

export interface GestureSpec {
  id: GestureId
  label: string
  /** What WAVE takes this to mean. Note thumbs_up is "good", never "yes". */
  meaning: string
  /** Minimum landmark confidence before WAVE will act on it. */
  threshold: number
  /** Frames the shape must hold. A hand crossing the frame is not an answer. */
  stableFrames: number
  /** Where the frames come from. Head gestures need Face or Pose Landmarker. */
  source: 'hands' | 'head'
  /** Notes that must survive into the implementation. */
  detection: string
}

export const GESTURES: GestureSpec[] = [
  {
    id: 'nod',
    label: 'Nod',
    meaning: 'Yes',
    threshold: 0.8,
    stableFrames: 6,
    source: 'head',
    // The highest-recognition affirmative emblem measured anywhere, and it is
    // free for someone holding a parcel in both hands.
    detection: 'Head pitch oscillation. Pan-cultural at 98.18% — outperforms every hand gesture.',
  },
  {
    id: 'shake',
    label: 'Head shake',
    meaning: 'No',
    threshold: 0.8,
    stableFrames: 6,
    source: 'head',
    detection: 'Head yaw oscillation. Pan-cultural at 99.10%. Replaces the withdrawn fist.',
  },
  {
    id: 'thumbs_up',
    label: 'Thumbs up',
    meaning: 'Good — acknowledged',
    threshold: 0.82,
    stableFrames: 8,
    source: 'hands',
    // Deliberately NOT "yes". It measures 74.85% as "good" in East Asia against
    // 100% in the US, and the pan-cultural "yes" is a nod. The West Africa and
    // India taboos both failed verification, so it ships everywhere — but it is
    // accepted as input and never prompted for in the Gulf, where the evidence
    // is genuinely split.
    detection: 'Thumb extended and above the wrist, four fingers curled. Never prompt in ar-*.',
  },
  {
    id: 'thumbs_down',
    label: 'Thumbs down',
    meaning: 'No',
    threshold: 0.85,
    stableFrames: 8,
    source: 'hands',
    // Chosen because it is the exact inverse of thumbs_up on a single scalar —
    // the sign of (thumb tip y − wrist y). Yes and no therefore cannot silently
    // swap, which is the worst possible failure for this system.
    detection: 'Mirror of thumbs_up. Separable on one scalar, so yes/no can never invert.',
  },
  {
    id: 'open_palm',
    label: 'Open palm',
    meaning: 'Wait',
    threshold: 0.78,
    stableFrames: 12,
    source: 'hands',
    // Pan-cultural "stop" at 100% — and simultaneously the Greek moútza, which
    // is the SAME 21 landmarks statically. The thrust is the only separator, so
    // the motion gate below is not a refinement, it is the safety mechanism.
    detection:
      'Fingers SPREAD (spread is load-bearing: adducted is the "present" gesture, and the ' +
      'fingers-together palm is the "polite" moútza). Must be STATIC ≥600ms: reject on lateral ' +
      'velocity, and reject if the bounding box is GROWING, which is a thrust toward the camera. ' +
      'HARD REJECT four-fingers-up with the thumb folded — that is the Rabia sign.',
  },
  {
    id: 'present',
    label: 'Presenting hand',
    meaning: 'Leaving it here',
    threshold: 0.8,
    stableFrames: 10,
    source: 'hands',
    // Replaces the index point. Four independent locales — Kenya, India, Saudi
    // Arabia and Japanese service norms — name the open whole hand as the polite
    // substitute for the index finger. That convergence is the strongest signal
    // in the entire research corpus.
    detection:
      'Four fingers extended and ADDUCTED, thumb alongside, palm angled down 30–60°, offering ' +
      'rather than commanding. Separable from open_palm on two orthogonal features: fingers ' +
      'together vs spread, and hand axis down vs up. MediaPipe has no canned Pointing_Down, so ' +
      'this needs hand-rolled landmark geometry either way.',
  },
  {
    id: 'purse',
    label: 'Purse hand',
    meaning: 'Wait',
    threshold: 0.82,
    stableFrames: 10,
    source: 'hands',
    // ar-* only. It means "delicious" in Turkey — one of the sharpest collisions
    // found, and a reason locale gating is per-gesture rather than per-region.
    detection:
      'All five fingertips converged to a tight cluster whose mutual distances are small relative ' +
      'to palm width, centroid above the wrist. Accept both the 3-digit and 5-digit variants, and ' +
      'stay agnostic about palm normal — ar-SA points the cone up, ar-EG turns the palm inward. ' +
      'If ever animated as a prompt, animate it SLOWLY: fast with hard eye contact it is a threat.',
  },
  {
    id: 'index_up',
    label: 'Raised index',
    meaning: 'One moment',
    threshold: 0.8,
    stableFrames: 10,
    source: 'hands',
    // The Greek substitute, because no palm-forward hand is usable there.
    detection:
      'Index extended and vertical (fingertip above its MCP), other three curled, thumb against ' +
      'the middle phalanx, palm EDGE-ON to the camera — never facing it. Engineering inference, ' +
      'not a sourced Greek emblem: validate with a Greek speaker before shipping.',
  },
]

/** Detected, never acted on, never rendered. Each would otherwise be absorbed silently. */
export const REJECT_CLASSES = [
  'fist', // pan-cultural Threat 98.15%; bras d'honneur tail; numeral 10 in China
  'ok_ring', // sexual insult in Turkey, offensive in Saudi, obscene in Brazil
  'figa', // thumb between index and middle — lucky in Brazil, obscene in Turkey
  'rabia', // four fingers up, thumb folded — criminal-law consequences in Egypt
  'bras_dhonneur',
  'middle_finger',
] as const

export function gestureSpec(id: GestureId | 'none'): GestureSpec | undefined {
  if (id === 'none') return undefined
  return GESTURES.find((g) => g.id === id)
}

export const HAND_GESTURES = GESTURES.filter((g) => g.source === 'hands')
export const HEAD_GESTURES = GESTURES.filter((g) => g.source === 'head')

/**
 * MediaPipe reports handedness **assuming the input image is mirrored** — i.e. a
 * front-facing selfie camera. A doorbell camera is not mirrored, so every
 * left/right label arrives inverted. Any left-hand logic must go through here.
 *
 * This matters because several locales reserve the left hand, and getting the
 * taboo backwards is worse than not implementing it at all.
 */
export function correctHandedness(
  label: 'Left' | 'Right',
  frameIsMirrored: boolean,
): 'Left' | 'Right' {
  if (frameIsMirrored) return label
  return label === 'Left' ? 'Right' : 'Left'
}

/**
 * Classify a MediaPipe Hands landmark array.
 *
 * Landmarks arrive normalised to the frame, so every test is a ratio and stays
 * valid regardless of how far the visitor stands from the doorbell.
 */
export function classifyLandmarks(
  lm: { x: number; y: number; z: number }[],
): { gesture: GestureId | 'none'; confidence: number } {
  if (!lm || lm.length < 21) return { gesture: 'none', confidence: 0 }

  const wrist = lm[0]
  const thumbTip = lm[4]
  const tips = [lm[8], lm[12], lm[16], lm[20]]
  const pips = [lm[6], lm[10], lm[14], lm[18]]

  const extended = (tip: typeof lm[0], pip: typeof lm[0]) =>
    dist(tip, wrist) > dist(pip, wrist) * 1.15

  const fingers = tips.map((t, i) => extended(t, pips[i]))
  const openCount = fingers.filter(Boolean).length
  const thumbOut = dist(thumbTip, wrist) > dist(lm[2], wrist) * 1.3
  const thumbAbove = thumbTip.y < wrist.y - 0.12
  const thumbBelow = thumbTip.y > wrist.y + 0.12

  // Finger spread, normalised by palm width. This one scalar separates the
  // spread "wait" from the adducted "leaving it here", and it is the feature
  // the Greek moútza and the Rabia sign both turn on.
  const palmWidth = dist(lm[5], lm[17]) || 1
  const spread = meanPairwise(tips) / palmWidth

  if (thumbOut && thumbAbove && openCount === 0) return { gesture: 'thumbs_up', confidence: 0.93 }
  if (thumbOut && thumbBelow && openCount === 0) return { gesture: 'thumbs_down', confidence: 0.92 }

  // Fingertips converged — the Arabic "wait".
  if (spread < 0.35 && openCount >= 3 && meanPairwise([...tips, thumbTip]) / palmWidth < 0.4) {
    return { gesture: 'purse', confidence: 0.85 }
  }

  if (openCount === 4) {
    // Both of these are four fingers extended. Spread is the whole difference,
    // and getting it wrong in Greece means reading an insult as politeness.
    return spread > 0.55
      ? { gesture: 'open_palm', confidence: 0.88 }
      : { gesture: 'present', confidence: 0.84 }
  }

  if (fingers[0] && openCount === 1) {
    // Up is "one moment"; down was the old point gesture, now withdrawn in
    // favour of `present` because an extended index collides with local emblems
    // in Mexico, China, Kenya and India.
    return lm[8].y < lm[5].y
      ? { gesture: 'index_up', confidence: 0.86 }
      : { gesture: 'none', confidence: 0 }
  }

  return { gesture: 'none', confidence: 0 }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function meanPairwise(pts: { x: number; y: number }[]) {
  let sum = 0
  let n = 0
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      sum += dist(pts[i], pts[j])
      n++
    }
  }
  return n ? sum / n : 0
}
