/**
 * WHEP live view client.
 *
 * WHEP is WebRTC-HTTP Egress Protocol: the viewer POSTs an SDP offer, gets an
 * SDP answer back, and media flows over the resulting peer connection. Ring
 * will not accept that POST from a browser origin, so it goes through
 * /api/ring/stream, which relays it with the bearer token attached.
 */

export interface WhepSession {
  stream: MediaStream
  /** Closes the peer connection and tells Ring to end the live view. */
  close: () => Promise<void>
}

export async function openWhepSession(
  deviceId: string,
  { timeoutMs = 15_000 }: { timeoutMs?: number } = {},
): Promise<WhepSession> {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  })

  // Receive-only: WAVE never sends media to the doorbell.
  pc.addTransceiver('video', { direction: 'recvonly' })

  const streamReady = new Promise<MediaStream>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out waiting for video')), timeoutMs)
    pc.ontrack = (e) => {
      clearTimeout(timer)
      resolve(e.streams[0])
    }
  })

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  // Wait for ICE gathering so the offer carries its candidates. Ring's endpoint
  // takes a single complete offer rather than trickling candidates afterwards.
  await iceGathered(pc)

  const res = await fetch(`/api/ring/stream?deviceId=${encodeURIComponent(deviceId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp' },
    body: pc.localDescription?.sdp ?? offer.sdp ?? '',
  })

  if (!res.ok) {
    pc.close()
    const detail = await res.text().catch(() => '')
    throw new Error(`WHEP session refused (${res.status}) ${detail.slice(0, 160)}`)
  }

  const sessionUrl = res.headers.get('X-Whep-Session') ?? ''
  const answer = await res.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answer })

  const stream = await streamReady

  return {
    stream,
    close: async () => {
      pc.close()
      if (!sessionUrl) return
      // Best effort — a failed teardown must not break the UI, but it does
      // leave a live view open on Ring's side, so it is worth attempting.
      await fetch(`/api/ring/stream?session=${encodeURIComponent(sessionUrl)}`, {
        method: 'DELETE',
      }).catch(() => {})
    },
  }
}

function iceGathered(pc: RTCPeerConnection, timeoutMs = 3000): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve()

  return new Promise((resolve) => {
    // Resolving on a timer as well as on 'complete' keeps a host that never
    // finishes gathering from hanging the whole live view.
    const done = () => {
      clearTimeout(timer)
      pc.removeEventListener('icegatheringstatechange', onChange)
      resolve()
    }
    const onChange = () => {
      if (pc.iceGatheringState === 'complete') done()
    }
    const timer = setTimeout(done, timeoutMs)
    pc.addEventListener('icegatheringstatechange', onChange)
  })
}
