# WAVE

**Your door, answered without a word.**

An accessible front-door agent for people who are Deaf, hard of hearing, non-verbal, or
unable to get to the door. Built on the Ring Partner API for the *Build, Ship, Shape:
Amazon Developer Hackathon*.

- **Primary tracks:** Ring · Alexa+
- **Mini challenges:** AWS Builder · Open Source

---

## The idea

Ring's Partner API streams **video only — there is no two-way audio and no talk-back
endpoint**. For most projects that is a wall. For WAVE it is the mechanic.

Audio goes **out** through the Chime. Intent comes **in** through the camera, as gesture.

```
🔔  button_press / motion_detected          Ring webhook, HMAC-SHA256 verified
         │
         ├── snapshot + WHEP live view      what is actually at the door
         ├── MediaPipe Hands                👍  ✋  👋  ☝  ✊
         ├── agent decides                  policy + memory of recurring visitors
         ├── Chime audio playback           the door speaks to the visitor
         └── visual card to the resident    no sound required, ever
```

A complete doorstep conversation, with zero audio input and zero hearing required.

The resident reads a transcript of something they never heard: what their door said, and
what the visitor answered with their hands.

---

## Running it

No Ring account, token, or hardware is needed to see the whole product — WAVE ships a mock
mode with a scripted visitor scenario.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, then press **Courier** under *Ring the doorbell* and answer
with the gesture buttons.

### Against the real Ring Playground

```bash
cp .env.example .env.local
# paste your Playground token from developer.ring.com
```

| Variable | Purpose |
|---|---|
| `RING_ACCESS_TOKEN` | Playground token. Unset → mock mode. |
| `RING_WEBHOOK_SECRET` | Shared secret for `X-Signature` verification. |
| `BEDROCK_MODEL_ID` | Visitor classification and phrasing. Unset → local policy engine. |

Ring rejects browser origins, so every call is server-to-server from a route handler.

---

## How it is put together

```
app/
  api/ring/devices    device list, falls back to mock rather than blanking the display
  api/ring/events     SSE feed of doorstep events
  api/webhook         Ring webhook receiver, HMAC verified, idempotent on request_id
  api/agent           advances a conversation by one gesture
  api/simulate        fires an event by hand, for rehearsing the demo
  components/         dashboard, transcript, gesture key
lib/
  ring/client.ts      Ring Partner API client
  ring/types.ts       domain model
  agent/policy.ts     the doorstep conversation engine
  gestures/           gesture vocabulary + MediaPipe landmark classifier
  store.ts            rolling event window + visitor memory
```

### Two decisions worth calling out

**Gesture recognition runs in the browser.** MediaPipe reads the hand on the client and only
the resulting label is posted to the server. No video frame leaves the house, and none of it
reaches a log.

**The conversation engine is deterministic.** A language model classifies the visitor and
drafts phrasing, but every branch that decides what actually happens lives in
`lib/agent/policy.ts`, in code the resident's standing instructions can be read off. A door
agent that improvises is a door agent that eventually says something nobody authorised.

---

## Accessibility

The product is for disabled users, so the interface is held to the same standard as the idea.

- Motion carries meaning rather than decoration — the door card *rings* visually, so a
  notification lands from across a room with no sound at all
- Every animation collapses to a static state under `prefers-reduced-motion`
- Events are announced through an assertive live region; deafness and low vision co-occur
  often enough that assuming a Deaf user is not also using a screen reader would be careless
- Gestures below their confidence threshold are treated as unread and re-prompted, never
  guessed at

---

## Status

See [PLAN.md](PLAN.md) for the schedule and the open validation gates, and
[FRICTION_LOG.md](FRICTION_LOG.md) for the developer-experience log kept during the build.

## License

MIT
