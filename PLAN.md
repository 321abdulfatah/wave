# WAVE — Build, Ship, Shape: Amazon Developer Hackathon 2026

> **Your door, answered without a word.**
> An accessible front-door agent for Deaf, hard-of-hearing, non-verbal and
> limited-mobility residents. The chime speaks for you; the camera reads gestures back.

- **Primary tracks:** Ring *and* Alexa+ (one project may be entered in both; it can win only
  one track prize, but that is two shots at a placement for one codebase)
- **Mini challenges:** AWS Builder + Open Source
- **Deadline:** 2026-10-23, 12:00pm PDT / 10:00pm GMT+3 — judging 9–20 Nov, winners ~3 Dec

---

## Why this shape

Machine audit (2026-09-18) ruled out the obvious choice:

| Constraint | Consequence |
|---|---|
| Windows 11 only, no Mac | Vega SDK unsupported on Windows **and** WSL → Vega path closed |
| 20 GB free on C: | Vega needs 20 GB minimum; Android/Fire OS needs ~15 GB → both unaffordable |
| Radeon 780M iGPU, no CUDA | No local GPU inference; browser MediaPipe / ONNX-web or cloud only |
| Node 22, Python 3.13, Docker, git, adb, VS Code | A web + MCP + cloud stack costs ~2 GB and runs today |

Ring + Alexa+ is the only combination that is fully buildable on this hardware, and it is
also the least crowded pair of tracks (Ring has the fewest entrants; the $25K tracks draw the
most). The Ring sample app already ships the exact primitives this idea needs.

---

## The interaction

Ring's Partner API has no two-way audio — live streams are video only. That limitation is the
product's core mechanic rather than a workaround:

```
button_press / motion_detected  ──▶  webhook (HMAC-SHA256 verified)
        │
        ├─▶ snapshot + WHEP live stream
        │        └─▶ vision: person / package / courier / vehicle
        │        └─▶ MediaPipe Hands: thumbs-up, wave, point, open palm
        │
        ├─▶ agent decides (Bedrock): who is this, what do they need, what is the policy
        │
        ├─▶ Chime audio playback  ──▶  the door SPEAKS to the visitor
        │
        └─▶ visual card to the resident  ──▶  no sound required, ever
```

Audio goes **out** through the Chime. Intent comes **in** through the camera as gesture.
A complete doorstep conversation with zero audio input and zero hearing required.

### Alexa+ layer (MCP server, spec 2025-11-25+, Streamable HTTP)
Tools: `list_door_events`, `who_came_today`, `describe_visitor`, `set_door_policy`,
`approve_recurring_visitor`. Returns **cards and carousels** with snapshots, and keeps
**state across sessions** (learns the Tuesday pharmacy courier) — both named in the official
rules as *creative* Alexa+ examples, versus the "basic MCP wrapper" they call obvious.

---

## Validation gates — answer these BEFORE writing product code

Nothing is assumed. Each gate can change the architecture.

- [ ] **G1** Ring Developer Playground token obtained; `reference/ring-api-helloworld` runs
      locally and lists devices.
- [ ] **G2** WHEP live view plays in the browser from the Playground, and the MediaPipe Hands
      processor detects a gesture on that stream.
- [ ] **G3** Webhooks reach localhost through a tunnel (cloudflared / ngrok) and the HMAC
      signature verifies. Playground must be able to fire simulated Package / Vehicle / Motion.
- [ ] **G4** **Chime audio playback** — is `POST /v1/devices/{id}/media/audio/playback`
      reachable from the Playground without a physical Chime? *If not, the "door speaks" beat
      must be demoed another way — decide before week 2.*
- [ ] **G5** Snapshot download (`media/image/download`) returns a real frame.
- [ ] **G6** Bedrock reachable from the account, with the $150 credits applied.
- [ ] **G7** MCP server responds over Streamable HTTP at spec 2025-11-25 through the tunnel.

**Gate review: 2026-09-21.** If G1–G3 fail, fall back to the Alexa+ simulated-experience path,
which the rules explicitly allow and which has no hardware dependency at all.

---

## Schedule (35 days)

| Window | Focus |
|---|---|
| Sep 18–21 | Validation gates G1–G7. AWS credits form submitted. Friction log running. |
| Sep 22–28 | Fork the sample. Webhook → event pipeline → resident dashboard. Real events end to end. |
| Sep 29–Oct 5 | Gesture vocabulary on the live stream + visitor classification from snapshots. |
| Oct 6–12 | Bedrock agent: policy, decisions, memory of recurring visitors. Chime speech-out. |
| Oct 13–19 | MCP server + Alexa+ cards/carousels. Open-source contribution. Accessibility polish. |
| Oct 20–23 | **Feature freeze.** Video, README, product feedback, friction log, submit early. |

---

## Rules compliance checklist

- [ ] Public GitHub repo with an OSS license visible in the About section
- [ ] Ring track: repo calls Ring APIs at runtime (not just named in the README)
- [ ] Alexa+ track: MCP server spec 2025-11-25+ over Streamable HTTP, imported and called
- [ ] Demo video < 3 min, public on YouTube, English, shows the Ring simulator working
- [ ] Product feedback for every tool/API/SDK used
- [ ] AWS Builder: AWS services named and documented in the feedback answer
- [ ] Open Source: contribution URL + repo URL + GitHub username + description
- [ ] Friction log entries (up to 10% bonus) — see FRICTION_LOG.md
