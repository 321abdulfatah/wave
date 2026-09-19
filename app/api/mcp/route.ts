import { handleRpc, PROTOCOL_VERSION } from '@/lib/mcp/server'

export const dynamic = 'force-dynamic'

/**
 * Streamable HTTP transport for the MCP server.
 *
 * One endpoint, POST for requests, GET for the optional server-to-client SSE
 * channel. WAVE never initiates, so GET holds the stream open and sends nothing
 * but keep-alives — closing it instead would be non-conformant, and some
 * clients probe it before they will call a tool.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id, MCP-Protocol-Version, Accept',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400)
  }

  // A client may batch. Notifications produce no reply, so a batch of only
  // notifications correctly yields 202 with no body.
  const batch = Array.isArray(body) ? body : [body]
  const replies = (await Promise.all(batch.map((m) => handleRpc(m as never)))).filter(Boolean)

  if (replies.length === 0) {
    return new Response(null, { status: 202, headers: CORS })
  }

  const payload = Array.isArray(body) ? replies : replies[0]

  // The spec allows a JSON body or an SSE stream. Honour whichever the client
  // asked for: Alexa+ negotiates SSE, and several inspectors send plain JSON.
  const accept = req.headers.get('accept') ?? ''
  if (accept.includes('text/event-stream')) {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: {
        ...CORS,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'MCP-Protocol-Version': PROTOCOL_VERSION,
      },
    })
  }

  return json(payload, 200)
}

/** Optional server-to-client channel. Held open, never used to initiate. */
export async function GET(req: Request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const ping = setInterval(() => controller.enqueue(encoder.encode(': ping\n\n')), 25_000)
      req.signal.addEventListener('abort', () => {
        clearInterval(ping)
        controller.close()
      })
    },
  })
  return new Response(stream, {
    headers: {
      ...CORS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'MCP-Protocol-Version': PROTOCOL_VERSION,
    },
  })
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'MCP-Protocol-Version': PROTOCOL_VERSION },
  })
}
