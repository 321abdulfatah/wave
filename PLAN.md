# WAVE — Build, Ship, Shape: Amazon Developer Hackathon 2026

> **Your door, answered without a word.**
> An accessible front-door agent for Deaf, hard-of-hearing, non-verbal and
> limited-mobility residents — in the visitor's own language and their own gestures.

- **Primary tracks:** Ring *and* Alexa+ (one project, two tracks, two shots at one prize)
- **Mini challenges:** AWS Builder + Open Source
- **Deadline:** 2026-10-23, 12:00pm PDT / 10:00pm GMT+3 · judging 9–20 Nov · winners ~3 Dec

---

## Where it stands (2026-09-19, 34 days out)

Ring is connected and live. Four of five validation gates are open.

| Gate | State | Note |
|---|---|---|
| G1 token + devices | ✅ open | `Playground Device`, a DoorbellPro, US/CA |
| G2 WHEP live view | ✅ open | 201, video plays in the browser |
| G3 event history | ✅ open | polled every 4s |
| G5 snapshot | ✅ open | 303 → pre-signed URL |
| G4 chime speaks | ❌ blocked | no chime in the Playground — FL-006 |

Working end to end: Ring event → poller → decision engine → visual ring → gesture
read from either the webcam or the Ring WHEP stream → resolution card.

Eight friction-log entries, four of them Critical or Important, all from real blockers hit
while building. Worth up to a 10% judging bonus.

---

## The thesis, sharpened

Ring's Partner API carries **no inbound audio**. Streams are video only and there is no
talk-back endpoint. WAVE turns that into the mechanic: audio goes **out** through the Chime,
intent comes **in** through the camera as gesture.

But a gesture is not a universal token, and this is where the product gets its edge:

> **👍 means "good" in Seattle and something obscene in Baghdad, Athens and Lagos.**
> **There is no universal sign language. There are more than 300.**

Four of WAVE's five starting gestures are offensive or ambiguous somewhere:

| Gesture | Where it fails |
|---|---|
| 👍 thumbs up | Iraq, Iran, Greece, West Africa, Sardinia — obscene |
| ✋ open palm | Greece — the *moútza*, one of the oldest insults in Europe |
| ☝ pointing | rude across much of Asia, the Middle East and Africa |
| 👋 wave | palm-forward reads as moútza in Greece and Nigeria |

A door agent that misreads a gesture is not merely unhelpful — it insults a stranger on
someone's doorstep, in their name. So the gesture vocabulary is **per-locale**, not a
translation layer bolted on at the end. Same for colour (white is mourning in much of East
Asia; red is luck in China and danger in the West), for reading direction, and for how
directly a stranger may be addressed.

This is the strongest differentiator the project has. Ring ships globally; nobody else in
this hackathon will have thought about it.

---

## The 34 days

### Week 1 · Sep 19–25 — Design and locale foundations
- Visual identity rebuilt by parallel design agents exploring distinct directions, then
  one chosen and applied throughout
- Locale engine: language, gesture set, palette and layout direction resolved per region
- Gesture vocabulary research: sourced, cited, and reviewed for each launch locale
- Arabic and English first, both fully RTL/LTR correct

### Week 2 · Sep 26–Oct 2 — Vision
- Visitor classification from Ring snapshots and WHEP frames via Bedrock
  (Ring gives pixels and no classification — see FL-008, so this is ours to build)
- Package / person / vehicle / courier-uniform detection
- Feed confidence into the decision engine instead of the current fixed 0.5

### Week 3 · Oct 3–9 — Alexa+ and the agent
- Self-hosted MCP server, spec 2025-11-25 over Streamable HTTP
- Tools: `list_door_events`, `who_came_today`, `describe_visitor`, `set_door_policy`
- Cards and carousels; state carried across sessions
- AgentCore / Strands for the AWS Builder mini

### Week 4 · Oct 10–16 — Depth and polish
- Visitor memory that actually learns recurring couriers
- Accessibility audit: contrast, focus order, reduced motion, screen reader
- Open-source contribution extracted from the project, with tests
- Load and failure behaviour: expired token, offline device, network loss

### Week 5 · Oct 17–22 — Submission
- Demo video, under 3 minutes, best material first
- README, setup instructions verified from a clean clone
- Product feedback and the final friction log
- **Submit 24 hours early.** Not on the deadline.

### Oct 23 — Deadline, nothing but watching.

---

## Rules compliance

- [ ] Public GitHub repo, OSS license visible in the About section
- [ ] Ring track: Ring APIs called at runtime, not just named in the README ✅ already true
- [ ] Alexa+ track: MCP server spec 2025-11-25+ over Streamable HTTP, imported and called
- [ ] Demo video < 3 min, public on YouTube, English, shows the Ring simulator working
- [ ] Product feedback for every tool, API and SDK used
- [ ] AWS Builder: AWS services named and documented in the feedback answer
- [ ] Open Source: contribution URL + repo URL + GitHub username + description
- [ ] Friction log entries — see FRICTION_LOG.md

## Open questions

- Devpost eligibility reply (emailed 2026-09-19) — Syria residency, prize delivery
- $150 AWS credits — requested, up to 5 business days
- G4: whether a chime ever becomes testable, or the step stays labelled as simulated
