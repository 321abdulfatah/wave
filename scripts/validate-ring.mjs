#!/usr/bin/env node
/**
 * Validation gates G1–G5 against the live Ring Partner API.
 *
 * A Playground token lives about 30 minutes, so this probes every endpoint WAVE
 * depends on in one pass and prints a verdict per gate. Run it the moment a
 * fresh token is pasted into .env.local.
 *
 *   node scripts/validate-ring.mjs           # read-only probes
 *   node scripts/validate-ring.mjs --chime   # also test Chime audio playback (G4)
 *
 * --chime is opt-in because that endpoint makes a real device play a sound.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.RING_API_BASE ?? 'https://api.amazonvision.com'
const WANT_CHIME = process.argv.includes('--chime')

const C = {
  reset: '\x1b[0m', dim: '\x1b[2m', bold: '\x1b[1m',
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m',
}

function loadToken() {
  if (process.env.RING_ACCESS_TOKEN) return process.env.RING_ACCESS_TOKEN
  for (const f of ['.env.local', '.env']) {
    try {
      const line = readFileSync(join(ROOT, f), 'utf8')
        .split(/\r?\n/)
        .find((l) => l.startsWith('RING_ACCESS_TOKEN='))
      const v = line?.slice('RING_ACCESS_TOKEN='.length).trim().replace(/^["']|["']$/g, '')
      if (v) return v
    } catch {
      /* file absent — try the next one */
    }
  }
  return null
}

const TOKEN = loadToken()
if (!TOKEN) {
  console.error(`${C.red}No RING_ACCESS_TOKEN found.${C.reset}

Put your Playground token in .env.local:

  RING_ACCESS_TOKEN=eyJ...

Get one at https://developer.amazon.com/ring/console/playground (valid ~30 min).`)
  process.exit(1)
}

const results = []

async function probe(label, path, { method = 'GET', body, headers, gate } = {}) {
  const started = Date.now()
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
        ...headers,
      },
      body,
    })
    const ms = Date.now() - started
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch {
      json = text.slice(0, 200)
    }

    const ok = res.ok
    results.push({ label, gate, ok, status: res.status, ms, json })
    const mark = ok ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`
    console.log(
      `  ${mark} ${label.padEnd(36)} ${C.dim}${res.status} · ${ms}ms${C.reset}`,
    )
    if (!ok) console.log(`       ${C.dim}${typeof json === 'string' ? json : JSON.stringify(json).slice(0, 200)}${C.reset}`)
    return ok ? json : null
  } catch (err) {
    results.push({ label, gate, ok: false, status: 0, ms: Date.now() - started, json: String(err) })
    console.log(`  ${C.red}FAIL${C.reset} ${label.padEnd(36)} ${C.dim}${err.message}${C.reset}`)
    return null
  }
}

console.log(`\n${C.bold}WAVE — Ring API validation${C.reset}`)
console.log(`${C.dim}${BASE} · token ${TOKEN.slice(0, 12)}…${C.reset}\n`)

/* ---- G1: the token works and devices are reachable ------------------ */
console.log(`${C.cyan}G1  account and devices${C.reset}`)
await probe('GET /v1/users/me', '/v1/users/me', { gate: 'G1' })
const devicesRes = await probe(
  'GET /v1/devices',
  '/v1/devices?include=status,capabilities,location',
  { gate: 'G1' },
)

const devices = devicesRes?.data ?? devicesRes?.devices ?? []
if (Array.isArray(devices) && devices.length) {
  console.log(`\n  ${C.dim}${devices.length} device(s):${C.reset}`)
  for (const d of devices) {
    const caps = (d.capabilities ?? []).join(', ') || '—'
    console.log(`    ${C.bold}${d.name ?? d.id}${C.reset} ${C.dim}${d.kind ?? ''} · ${d.id}${C.reset}`)
    console.log(`      ${C.dim}${caps}${C.reset}`)
  }
} else {
  console.log(`  ${C.yellow}No devices returned — the Playground may need a simulated device first.${C.reset}`)
}

const cam = devices.find((d) => d.kind !== 'chime') ?? devices[0]
const chime = devices.find((d) => d.kind === 'chime' || (d.capabilities ?? []).some((c) => /chime|audio/i.test(c)))

/* ---- G3: event history --------------------------------------------- */
if (cam) {
  console.log(`\n${C.cyan}G3  events${C.reset}`)
  await probe('GET history/events', `/v1/history/devices/${cam.id}/events`, { gate: 'G3' })
}

/* ---- G5: snapshot --------------------------------------------------- */
if (cam) {
  console.log(`\n${C.cyan}G5  snapshot${C.reset}`)
  await probe('POST media/image/download', `/v1/devices/${cam.id}/media/image/download`, {
    method: 'POST',
    gate: 'G5',
  })
}

/* ---- G2: WHEP live view --------------------------------------------- */
if (cam) {
  console.log(`\n${C.cyan}G2  live view (WHEP)${C.reset}`)
  // A minimal recvonly SDP offer. We only need to learn whether the endpoint
  // accepts a session at all — the browser negotiates the real one.
  const offer = [
    'v=0',
    'o=- 0 0 IN IP4 127.0.0.1',
    's=-',
    't=0 0',
    'a=group:BUNDLE 0',
    'm=video 9 UDP/TLS/RTP/SAVPF 96',
    'c=IN IP4 0.0.0.0',
    'a=rtcp-mux',
    'a=recvonly',
    'a=mid:0',
    'a=rtpmap:96 H264/90000',
    '',
  ].join('\r\n')
  await probe('POST whep/sessions', `/v1/devices/${cam.id}/media/streaming/whep/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp', Accept: 'application/sdp' },
    body: offer,
    gate: 'G2',
  })
}

/* ---- G4: Chime audio — the one that decides the product ------------- */
console.log(`\n${C.cyan}G4  chime audio out${C.reset}`)
if (!chime) {
  console.log(`  ${C.yellow}SKIP${C.reset} no chime device in this account`)
  results.push({ label: 'chime audio', gate: 'G4', ok: false, status: 0, skipped: true })
} else if (!WANT_CHIME) {
  console.log(`  ${C.yellow}SKIP${C.reset} pass --chime to test (it plays a real sound)`)
  results.push({ label: 'chime audio', gate: 'G4', ok: false, status: 0, skipped: true })
} else {
  await probe('POST media/audio/playback', `/v1/devices/${chime.id}/media/audio/playback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio_slot: 1 }),
    gate: 'G4',
  })
}

/* ---- verdict --------------------------------------------------------- */
const GATES = {
  G1: 'token + devices reachable',
  G2: 'WHEP live view',
  G3: 'event history',
  G4: 'chime speaks  ← decides the product',
  G5: 'snapshot download',
}

console.log(`\n${C.bold}Gate summary${C.reset}`)
for (const [gate, desc] of Object.entries(GATES)) {
  const rows = results.filter((r) => r.gate === gate)
  const state = rows.length === 0
    ? `${C.dim}not run${C.reset}`
    : rows.every((r) => r.skipped)
      ? `${C.yellow}skipped${C.reset}`
      : rows.every((r) => r.ok)
        ? `${C.green}open${C.reset}`
        : `${C.red}blocked${C.reset}`
  console.log(`  ${gate}  ${desc.padEnd(38)} ${state}`)
}

const blocked = Object.keys(GATES).filter((g) => {
  const rows = results.filter((r) => r.gate === g)
  return rows.length > 0 && !rows.every((r) => r.skipped) && !rows.every((r) => r.ok)
})
console.log(
  blocked.length
    ? `\n${C.red}Blocked: ${blocked.join(', ')}${C.reset} — log each one in FRICTION_LOG.md before working around it.\n`
    : `\n${C.green}Every gate that ran is open.${C.reset}\n`,
)
