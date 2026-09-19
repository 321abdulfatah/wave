/**
 * Model providers, chosen at runtime.
 *
 * WAVE was built against Amazon Bedrock and Amazon Transcribe, and those remain
 * the first choice. But this project is being built from Syria, and AWS
 * suspended the account because Syrian nationality is not offered in its
 * identity-verification flow — while this hackathon is explicitly open to all
 * countries except those comprehensively sanctioned by OFAC, which Syria has
 * not been since 1 July 2025.
 *
 * That inconsistency is Amazon's to resolve, and it is logged as FL-010. What
 * it means for the code is simply that no single vendor may be load-bearing.
 * Every model call in WAVE goes through this file, so swapping providers is a
 * configuration change rather than a rewrite — which is how it should have been
 * designed in the first place.
 *
 * Resolution order is deliberate: Bedrock first where it is available, because
 * the AWS Builder mini challenge asks for AWS services and we would rather use
 * them. A fallback is a fallback.
 */

import { env } from '@/lib/env'

export type VisionProvider = 'bedrock' | 'openai-compatible' | 'none'
export type SpeechProvider = 'aws-transcribe' | 'openai-compatible' | 'none'

export interface ProviderStatus<T> {
  provider: T
  available: boolean
  /** Shown in the UI. The resident should know where their data went. */
  label: string
}

function hasAws() {
  return Boolean(env('AWS_REGION') && env('AWS_ACCESS_KEY_ID'))
}

/**
 * Any endpoint speaking the OpenAI chat-completions shape: OpenRouter, Groq,
 * Together, a local llama.cpp server. One base URL and one key.
 */
function hasOpenAICompatible() {
  return Boolean(env('AI_API_KEY') && env('AI_BASE_URL'))
}

function hasSpeechEndpoint() {
  return Boolean(env('SPEECH_API_KEY') && env('SPEECH_BASE_URL'))
}

export function visionStatus(): ProviderStatus<VisionProvider> {
  if (hasAws()) {
    return { provider: 'bedrock', available: true, label: 'Amazon Bedrock' }
  }
  if (hasOpenAICompatible()) {
    return {
      provider: 'openai-compatible',
      available: true,
      label: `${hostOf(env('AI_BASE_URL'))} · ${env('AI_MODEL') ?? 'default model'}`,
    }
  }
  return { provider: 'none', available: false, label: 'No vision model configured' }
}

export function speechStatus(): ProviderStatus<SpeechProvider> {
  if (hasAws()) {
    return { provider: 'aws-transcribe', available: true, label: 'Amazon Transcribe' }
  }
  if (hasSpeechEndpoint()) {
    return {
      provider: 'openai-compatible',
      available: true,
      label: `${hostOf(env('SPEECH_BASE_URL'))} · ${env('SPEECH_MODEL') ?? 'whisper'}`,
    }
  }
  return { provider: 'none', available: false, label: 'No transcription model configured' }
}

function hostOf(url?: string) {
  try {
    return new URL(url ?? '').host
  } catch {
    return 'configured endpoint'
  }
}

/**
 * Ask an OpenAI-compatible endpoint about an image.
 *
 * Kept deliberately small: one POST, no SDK. Adding a vendor SDK for each
 * possible fallback is how a codebase ends up unable to move again.
 */
export async function visionOpenAICompatible(
  jpeg: Uint8Array,
  system: string,
  question: string,
): Promise<string> {
  const res = await fetch(`${env('AI_BASE_URL')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('AI_API_KEY')}`,
      'Content-Type': 'application/json',
      // OpenRouter asks for these and ignores them elsewhere.
      'HTTP-Referer': env('NEXT_PUBLIC_SITE_URL') ?? 'https://wave-tan-nine.vercel.app',
      'X-Title': 'WAVE',
    },
    body: JSON.stringify({
      model: env('AI_MODEL') ?? 'anthropic/claude-sonnet-4.5',
      max_tokens: 200,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${Buffer.from(jpeg).toString('base64')}` },
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`Vision endpoint returned ${res.status}: ${(await res.text()).slice(0, 160)}`)
  }
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

/**
 * Transcribe a WAV chunk through an OpenAI-compatible `/audio/transcriptions`
 * endpoint — Groq, OpenAI, or a local whisper.cpp server.
 *
 * Unlike Transcribe's streaming API this is request/response, so there are no
 * partials: each chunk comes back final. The caption UI already distinguishes
 * the two, so it degrades to slightly chunkier captions rather than breaking.
 */
export async function transcribeOpenAICompatible(wav: Uint8Array): Promise<string> {
  const form = new FormData()
  form.append('file', new Blob([wav as unknown as BlobPart], { type: 'audio/wav' }), 'chunk.wav')
  form.append('model', env('SPEECH_MODEL') ?? 'whisper-large-v3')
  const language = env('SPEECH_LANGUAGE')
  if (language) form.append('language', language)

  const res = await fetch(`${env('SPEECH_BASE_URL')}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('SPEECH_API_KEY')}` },
    body: form,
  })

  if (!res.ok) {
    throw new Error(`Speech endpoint returned ${res.status}: ${(await res.text()).slice(0, 160)}`)
  }
  const json = await res.json()
  return json.text ?? ''
}

/**
 * Wrap raw 16 kHz mono PCM in a WAV header.
 *
 * Transcribe accepts bare PCM; the OpenAI-compatible endpoints want a container
 * and will reject a naked buffer. Forty-four bytes of header is cheaper than
 * carrying an encoder.
 */
export function pcmToWav(pcm: Int16Array, sampleRate = 16_000): Uint8Array {
  const out = new ArrayBuffer(44 + pcm.byteLength)
  const view = new DataView(out)
  const ascii = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i))
  }

  ascii(0, 'RIFF')
  view.setUint32(4, 36 + pcm.byteLength, true)
  ascii(8, 'WAVE')
  ascii(12, 'fmt ')
  view.setUint32(16, 16, true) // PCM chunk size
  view.setUint16(20, 1, true) // format: PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true) // byte rate
  view.setUint16(32, 2, true) // block align
  view.setUint16(34, 16, true) // bits per sample
  ascii(36, 'data')
  view.setUint32(40, pcm.byteLength, true)

  new Uint8Array(out, 44).set(new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength))
  return new Uint8Array(out)
}
