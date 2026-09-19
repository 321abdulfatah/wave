import { NextResponse } from 'next/server'
import { transcriberStatus, TRANSCRIBE_SAMPLE_RATE } from '@/lib/captions/transcriber'
import type { CaptionChunk } from '@/lib/captions/transcriber'

export const dynamic = 'force-dynamic'

/**
 * Accept a chunk of 16 kHz PCM from the browser and return caption text.
 *
 * The audio is held only for the duration of the call. Nothing is written to
 * disk, and the response carries text alone — a doorbell that archived every
 * stranger's voice would be a worse product than the one it replaced.
 */
export async function POST(req: Request) {
  const status = transcriberStatus()
  if (!status.available) {
    return NextResponse.json({ chunks: [], reason: status.explanation }, { status: 503 })
  }

  const pcm = await req.arrayBuffer()
  if (pcm.byteLength === 0) return NextResponse.json({ chunks: [] })

  const seconds = pcm.byteLength / 2 / TRANSCRIBE_SAMPLE_RATE

  try {
    const chunks = await transcribe(new Int16Array(pcm), seconds)
    return NextResponse.json({ chunks })
  } catch (err) {
    // A failed chunk is a gap in the captions. Say so rather than silently
    // returning nothing, which reads to the resident as "nobody spoke".
    return NextResponse.json(
      { chunks: [], error: (err as Error).message },
      { status: 502 },
    )
  }
}

/**
 * Amazon Transcribe streaming.
 *
 * Deliberately isolated behind this one function so the transport, the UI and
 * the privacy contract do not change when the backend does. The AWS SDK is
 * imported lazily: without credentials the route answers 503 from
 * transcriberStatus() above and this is never reached, so the dependency stays
 * out of the cold-start path.
 */
async function transcribe(pcm: Int16Array, seconds: number): Promise<CaptionChunk[]> {
  const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = await import(
    '@aws-sdk/client-transcribe-streaming'
  )

  const client = new TranscribeStreamingClient({ region: process.env.AWS_REGION })

  const response = await client.send(
    new StartStreamTranscriptionCommand({
      LanguageCode: (process.env.TRANSCRIBE_LANGUAGE ?? 'en-US') as never,
      MediaSampleRateHertz: TRANSCRIBE_SAMPLE_RATE,
      MediaEncoding: 'pcm',
      AudioStream: (async function* () {
        yield { AudioEvent: { AudioChunk: new Uint8Array(pcm.buffer) } }
      })(),
    }),
  )

  const out: CaptionChunk[] = []
  for await (const event of response.TranscriptResultStream ?? []) {
    for (const result of event.TranscriptEvent?.Transcript?.Results ?? []) {
      const alt = result.Alternatives?.[0]
      if (!alt?.Transcript) continue
      out.push({
        text: alt.Transcript,
        isFinal: !result.IsPartial,
        at: seconds,
        confidence: alt.Items?.[0]?.Confidence ?? undefined,
      })
    }
  }
  return out
}
