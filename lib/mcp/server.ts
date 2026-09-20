import { listEvents, listMemory, getEvent, upsertEvent } from '@/lib/store'
import { LOCALES, availableGestures } from '@/lib/gestures/locales'
import { gestureSpec } from '@/lib/gestures/vocabulary'
import type { DoorEvent } from '@/lib/ring/types'
import { stringsFor } from '@/lib/i18n/strings'

/**
 * WAVE's MCP server.
 *
 * Self-hosted, JSON-RPC 2.0 over Streamable HTTP, protocol version 2025-11-25 —
 * the minimum the Alexa+ track accepts.
 *
 * The design principle is the same one that governs the door agent itself: this
 * server **reads and summarises, and changes only the resident's own standing
 * policy.** It cannot speak to a visitor, unlock anything, or resolve an event.
 * An agent that can be talked into opening a door by whoever is standing at it
 * is not a door agent, it is a lock pick.
 */

export const PROTOCOL_VERSION = '2025-11-25'
export const SERVER_INFO = { name: 'wave-door-agent', version: '0.1.0' }

interface JsonRpcRequest {
  jsonrpc: '2.0'
  id?: string | number | null
  method: string
  params?: Record<string, unknown>
}

type Content =
  | { type: 'text'; text: string }
  | { type: 'resource'; resource: { uri: string; mimeType: string; text: string } }

interface ToolResult {
  content: Content[]
  isError?: boolean
  /** Rendered by Alexa+ as a card or carousel where the client supports it. */
  _meta?: Record<string, unknown>
}

/* ------------------------------------------------------------------ */
/* Tools                                                               */
/* ------------------------------------------------------------------ */

export const TOOLS = [
  {
    name: 'who_came_today',
    description:
      'Summarise everyone who came to the door today, what they wanted, and how each visit was ' +
      'resolved. Use this when the resident asks what they missed.',
    inputSchema: {
      type: 'object',
      properties: {
        since_hours: {
          type: 'number',
          description: 'How far back to look, in hours. Defaults to 24.',
        },
      },
    },
  },
  {
    name: 'describe_visit',
    description:
      'Read back one doorstep conversation in full — what the door said, what the visitor ' +
      'answered, and why the agent decided what it did.',
    inputSchema: {
      type: 'object',
      properties: { event_id: { type: 'string' } },
      required: ['event_id'],
    },
  },
  {
    name: 'list_known_visitors',
    description:
      'List the recurring visitors the door has learned, with the standing instruction the ' +
      'resident has set for each.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'set_visitor_policy',
    description:
      'Set or change the standing instruction for a recurring visitor — for example, always ' +
      'leave the pharmacy delivery at the door. This is the only state this server writes.',
    inputSchema: {
      type: 'object',
      properties: {
        label: { type: 'string', description: 'The visitor as named in list_known_visitors.' },
        policy: { type: 'string', description: 'The instruction, in plain language.' },
      },
      required: ['label', 'policy'],
    },
  },
  {
    name: 'explain_gestures',
    description:
      'Explain which gestures the door accepts in a given locale and why any are withheld there. ' +
      'The vocabulary varies by country because a gesture is not universal.',
    inputSchema: {
      type: 'object',
      properties: {
        locale: { type: 'string', description: 'BCP-47 locale, e.g. ar-SA, el-GR, ja-JP.' },
      },
      required: ['locale'],
    },
  },
] as const

/* ------------------------------------------------------------------ */

function card(title: string, lines: string[], accent?: string) {
  // Alexa+ renders _meta.card where it can and falls back to the text content
  // everywhere else, so the text block is never merely a duplicate.
  return { type: 'card', title, lines, accent }
}

function describeEvent(e: DoorEvent): string {
  const when = new Date(e.startedAt).toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  })
  const who = e.visitorLabel ?? e.visitor
  return `${when} · ${who} at the ${e.deviceName} · ${e.resolution.replace(/_/g, ' ')}`
}

async function callTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case 'who_came_today': {
      const hours = typeof args.since_hours === 'number' ? args.since_hours : 24
      const cutoff = Date.now() - hours * 3600_000
      const events = listEvents().filter((e) => new Date(e.startedAt).getTime() >= cutoff)

      if (events.length === 0) {
        return { content: [{ type: 'text', text: `Nobody came to the door in the last ${hours} hours.` }] }
      }

      const lines = events.map(describeEvent)
      const unacknowledged = events.filter((e) => !e.acknowledged).length

      return {
        content: [
          {
            type: 'text',
            text:
              `${events.length} visit${events.length === 1 ? '' : 's'} in the last ${hours} hours` +
              (unacknowledged ? `, ${unacknowledged} you have not seen yet` : '') +
              `:\n\n${lines.join('\n')}`,
          },
        ],
        _meta: {
          'wave/cards': events.map((e) =>
            card(e.visitorLabel ?? e.visitor, [
              describeEvent(e),
              `${e.turns.length} turns · ${Math.round(e.confidence * 100)}% confidence`,
            ]),
          ),
        },
      }
    }

    case 'describe_visit': {
      const e = getEvent(String(args.event_id))
      if (!e) return { content: [{ type: 'text', text: 'No such visit.' }], isError: true }

      const transcript = e.turns
        .map((t) => {
          if (t.from === 'door') return `The door said: "${t.text}"`
          const spec = t.gesture ? gestureSpec(t.gesture) : undefined
          const pct = t.confidence ? ` (${Math.round(t.confidence * 100)}%)` : ''
          return `The visitor answered: ${spec?.label ?? t.text}${pct}`
        })
        .join('\n')

      return {
        content: [
          { type: 'text', text: `${describeEvent(e)}\n\n${transcript}` },
          // The full record travels as a resource so the client can render it
          // without the model having to restate it.
          {
            type: 'resource',
            resource: {
              uri: `wave://visit/${e.id}`,
              mimeType: 'application/json',
              text: JSON.stringify(e, null, 2),
            },
          },
        ],
      }
    }

    case 'list_known_visitors': {
      const memory = listMemory()
      if (memory.length === 0) {
        return { content: [{ type: 'text', text: 'The door has not learned anyone yet.' }] }
      }
      return {
        content: [
          {
            type: 'text',
            text: memory
              .map(
                (m) =>
                  `${m.label} — seen ${m.seenCount} times` +
                  (m.policy ? `. Standing instruction: ${m.policy}` : '. No instruction set.'),
              )
              .join('\n'),
          },
        ],
        _meta: {
          'wave/cards': memory.map((m) =>
            card(m.label, [`Seen ${m.seenCount} times`, m.policy ?? 'No instruction set']),
          ),
        },
      }
    }

    case 'set_visitor_policy': {
      const label = String(args.label)
      const policy = String(args.policy)
      const memory = listMemory()
      const target = memory.find((m) => m.label.toLowerCase() === label.toLowerCase())

      if (!target) {
        return {
          content: [
            {
              type: 'text',
              text: `The door has not met anyone called "${label}". Known: ${memory
                .map((m) => m.label)
                .join(', ')}.`,
            },
          ],
          isError: true,
        }
      }

      target.policy = policy
      return {
        content: [{ type: 'text', text: `Set. For ${target.label}: ${policy}` }],
      }
    }

    case 'explain_gestures': {
      const code = String(args.locale)
      const spec = LOCALES[code]
      if (!spec) {
        return {
          content: [
            { type: 'text', text: `No vocabulary for ${code}. Known: ${Object.keys(LOCALES).join(', ')}.` },
          ],
          isError: true,
        }
      }

      const offered = availableGestures(code)
        .map((g) => {
          const s = gestureSpec(g)
          return s ? `${s.label} — ${s.meaning}` : g
        })
        .join('\n')

      const withheld = Object.entries(spec.blocked)
        .map(([g, rule]) => {
          const sub = rule.substitute ? ` Offered instead: ${gestureSpec(rule.substitute)?.label}.` : ''
          return `${g} — withheld (${rule.severity}, evidence: ${rule.evidence}).${sub}`
        })
        .join('\n')

      return {
        content: [
          {
            type: 'text',
            text:
              `${spec.name} (${spec.nativeName}), ${spec.dir.toUpperCase()}. ` +
              `Sign language: ${spec.signLanguage.name}.\n\n` +
              `Accepted here:\n${offered}\n\n` +
              (withheld ? `Withheld here:\n${withheld}` : 'Nothing is withheld in this locale.'),
          },
        ],
      }
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true }
  }
}

/* ------------------------------------------------------------------ */
/* JSON-RPC dispatch                                                    */
/* ------------------------------------------------------------------ */

export async function handleRpc(req: JsonRpcRequest): Promise<object | null> {
  const reply = (result: unknown) => ({ jsonrpc: '2.0' as const, id: req.id ?? null, result })
  const fail = (code: number, message: string) => ({
    jsonrpc: '2.0' as const,
    id: req.id ?? null,
    error: { code, message },
  })

  switch (req.method) {
    case 'initialize':
      return reply({
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          'WAVE answers the front door for a Deaf or hard-of-hearing resident and keeps a written ' +
          'record of what was said. Use these tools to read that record back. The gesture ' +
          'vocabulary varies by locale — explain_gestures says which are accepted where, and why.',
      })

    // Notifications carry no id and must not be answered.
    case 'notifications/initialized':
      return null

    case 'ping':
      return reply({})

    case 'tools/list':
      return reply({ tools: TOOLS })

    case 'tools/call': {
      const name = String(req.params?.name ?? '')
      const args = (req.params?.arguments as Record<string, unknown>) ?? {}
      try {
        return reply(await callTool(name, args))
      } catch (err) {
        return reply({
          content: [{ type: 'text', text: `Tool failed: ${(err as Error).message}` }],
          isError: true,
        })
      }
    }

    default:
      return fail(-32601, `Method not found: ${req.method}`)
  }
}
