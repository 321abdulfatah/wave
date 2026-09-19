/**
 * Caption the visitor.
 *
 * This is the feature no shipping doorbell has. Google Nest describes the
 * *sound* of a doorbell and states outright that "only non-verbal audio
 * specified in the list is supported" — it will not transcribe the words of the
 * person pressing it. Ring's AI Video Descriptions are visual-only. Alexa+
 * Greetings answers the door with generative AI and hands a Deaf resident an
 * audio recording. Amazon already ships Call Captioning and Real Time Text on
 * Echo Show, and scoped both to Alexa calls rather than the doorbell.
 *
 * The raw material exists: Ring negotiates an OPUS/48000/2 track on the WHEP
 * answer, contradicting its own documentation (FL-009).
 *
 * Audio leaves the page only when a cloud backend is configured, and the UI
 * says which backend is running. That is a promise to the visitor as much as to
 * the resident: someone speaking at a stranger's door has not consented to
 * being transcribed by a third party.
 */

export type TranscriberBackend = 'aws-transcribe' | 'none'

export interface CaptionChunk {
  /** Text so far. Partials are replaced; finals are appended. */
  text: string
  isFinal: boolean
  /** Seconds since the session opened. */
  at: number
  confidence?: number
}

export interface TranscriberStatus {
  backend: TranscriberBackend
  available: boolean
  /** Shown verbatim in the UI. The resident should know where the audio went. */
  explanation: string
}

export function transcriberStatus(): TranscriberStatus {
  const hasAws = Boolean(process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID)

  if (hasAws) {
    return {
      backend: 'aws-transcribe',
      available: true,
      explanation:
        'Amazon Transcribe streaming. Audio from the doorbell is sent to AWS in the configured ' +
        'region and discarded after transcription; only the text is kept.',
    }
  }

  return {
    backend: 'none',
    available: false,
    explanation:
      'No transcription backend configured, so nothing is captioned and no audio leaves this ' +
      'machine. Set AWS_REGION and AWS_ACCESS_KEY_ID to enable Amazon Transcribe.',
  }
}

/**
 * PCM framing for Amazon Transcribe streaming.
 *
 * Transcribe wants 16-bit little-endian PCM. The browser gives Float32 at the
 * AudioContext rate, so the conversion has to happen somewhere; doing it on the
 * client keeps the payload at half the size and means the server never holds a
 * decoded buffer it does not need.
 */
export const TRANSCRIBE_SAMPLE_RATE = 16_000

export function floatToPcm16(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    // Clamp before scaling: values outside [-1, 1] wrap rather than clip if
    // you let them through, which is audible as a harsh crackle.
    const s = Math.max(-1, Math.min(1, input[i]))
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return out
}

/**
 * Downsample by simple averaging.
 *
 * A proper anti-aliasing filter would be better, but speech energy sits well
 * below 8 kHz and Transcribe is robust to the artefacts this leaves. Naive
 * decimation without averaging is what actually hurts word accuracy.
 */
export function downsample(input: Float32Array, from: number, to: number): Float32Array {
  if (to >= from) return input
  const ratio = from / to
  const out = new Float32Array(Math.floor(input.length / ratio))
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio)
    const end = Math.min(Math.floor((i + 1) * ratio), input.length)
    let sum = 0
    for (let j = start; j < end; j++) sum += input[j]
    out[i] = end > start ? sum / (end - start) : 0
  }
  return out
}
