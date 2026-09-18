import { listEvents, subscribe } from '@/lib/store'
import { startPolling } from '@/lib/ring/poller'

export const dynamic = 'force-dynamic'

/**
 * Server-Sent Events feed of doorstep events.
 *
 * SSE rather than WebSocket: the traffic is one-directional and bursty, it
 * survives proxies without an upgrade handshake, and the browser reconnects on
 * its own — which matters for a screen that is expected to stay up for months.
 */
export async function GET(req: Request) {
  const encoder = new TextEncoder()

  // Kick the Ring poller off the first time anyone opens the dashboard. It is
  // idempotent, and there is no point polling a doorbell nobody is watching.
  const polling = await startPolling().catch((e) => ({ started: false, reason: String(e) }))

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      send('snapshot', listEvents())
      send('source', polling)

      const unsubscribe = subscribe((e) => send('door', e))

      // Proxies drop idle connections; a comment every 25s keeps the pipe warm
      // without showing up as an event on the client.
      const keepAlive = setInterval(() => controller.enqueue(encoder.encode(': ping\n\n')), 25_000)

      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive)
        unsubscribe()
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
