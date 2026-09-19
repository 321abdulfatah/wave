import type { VisitorKind } from '@/lib/ring/types'
import { visionStatus, visionOpenAICompatible } from '@/lib/ai/provider'

/**
 * Who is at the door.
 *
 * Ring gives pixels and no classification — the Playground emits every
 * simulated event as `on_demand` with an empty `cv_detections` array (FL-008),
 * and even in production the documented `sub_type` is coarse. Ring's own
 * developer site says it plainly: "Ring provides the pixels — add your own CV
 * or AI models." So this is ours to build.
 *
 * Two rules shape the design, and both are about restraint:
 *
 *  1. **Classify the situation, never the person.** The model is asked whether
 *     there is a parcel, whether the person is in delivery uniform, whether a
 *     vehicle is present. It is never asked who someone is, their age, their
 *     gender or their race. A doorbell that profiles strangers is a worse
 *     product than the one it replaces, and the locale research already ruled
 *     out age estimation for exactly this reason.
 *  2. **A low-confidence answer is `unknown`, not a guess.** `unknown` has a
 *     safe greeting. A wrong confident answer greets a neighbour as a courier.
 */

export interface VisionResult {
  visitor: VisitorKind
  confidence: number
  /** One line the resident sees. The agent explains itself or it does not ship. */
  reasoning: string
  /** Which model answered, or why none did. */
  source: 'bedrock' | 'openai-compatible' | 'unavailable'
}

const SYSTEM = `You look at a single still frame from a doorbell camera and report what is
happening at the door. You are part of an accessibility product for a Deaf resident who cannot
hear the visitor, so your description is the only thing they have.

Report only the SITUATION. Never describe or infer a person's identity, age, gender, race,
or appearance beyond what they are carrying and whether they wear a delivery uniform.

Answer as JSON only:
{"visitor":"courier"|"known"|"stranger"|"vehicle"|"unknown","confidence":0.0-1.0,"reasoning":"one short sentence"}

- "courier": a parcel, a delivery uniform, or a marked vehicle is visible.
- "vehicle": a vehicle but no person approaching the door.
- "stranger": a person with no delivery indicators.
- "unknown": the frame is unclear, empty, or you are not confident. Prefer this over guessing.

Confidence below 0.6 must be reported as "unknown".`

export function visionAvailable(): boolean {
  return visionStatus().available
}

/**
 * Classify a doorstep snapshot with Amazon Bedrock.
 *
 * The SDK is imported lazily so an install without AWS credentials never pays
 * for it at cold start, and so the caption route and this one fail the same
 * way — by saying so rather than by throwing.
 */
export async function classifyVisitor(jpeg: Uint8Array): Promise<VisionResult> {
  const status = visionStatus()
  if (!status.available) {
    return {
      visitor: 'unknown',
      confidence: 0,
      reasoning: 'No vision model configured, so the frame was not sent anywhere.',
      source: 'unavailable',
    }
  }

  const text =
    status.provider === 'bedrock'
      ? await viaBedrock(jpeg)
      : await visionOpenAICompatible(jpeg, SYSTEM, 'What is happening at this door?')

  return parse(text, status.provider === 'bedrock' ? 'bedrock' : 'openai-compatible')
}

async function viaBedrock(jpeg: Uint8Array): Promise<string> {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime')
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION })

  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 200,
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: Buffer.from(jpeg).toString('base64') },
          },
          { type: 'text', text: 'What is happening at this door?' },
        ],
      },
    ],
  }

  const res = await client.send(
    new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID ?? 'us.anthropic.claude-sonnet-5',
      contentType: 'application/json',
      body: JSON.stringify(body),
    }),
  )

  const decoded = JSON.parse(new TextDecoder().decode(res.body))
  return decoded.content?.[0]?.text ?? ''
}

function parse(text: string, source: 'bedrock' | 'openai-compatible'): VisionResult {

  // The model is asked for bare JSON but may still wrap it in prose or a fence.
  // Extracting rather than parsing the whole string keeps one stray sentence
  // from turning a good classification into an error.
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    return {
      visitor: 'unknown',
      confidence: 0,
      reasoning: 'The model did not return a usable answer.',
      source,
    }
  }

  const parsed = JSON.parse(match[0]) as Partial<VisionResult>
  const confidence = Math.max(0, Math.min(1, Number(parsed.confidence ?? 0)))
  const kinds: VisitorKind[] = ['courier', 'known', 'stranger', 'vehicle', 'unknown']
  const visitor = kinds.includes(parsed.visitor as VisitorKind)
    ? (parsed.visitor as VisitorKind)
    : 'unknown'

  // Enforce the floor here as well as in the prompt. A model told to hedge will
  // sometimes still return "stranger" at 0.4, and the safe greeting costs
  // nothing while a wrong confident one greets a neighbour as a courier.
  return {
    visitor: confidence < 0.6 ? 'unknown' : visitor,
    confidence,
    reasoning: String(parsed.reasoning ?? '').slice(0, 200),
    source,
  }
}
