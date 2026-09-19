# Friction Log — Build, Ship, Shape: Amazon Developer Hackathon

Format per hackathon rules: task attempted / steps taken / expected vs actual /
severity (Critical | Important | Nice-to-have) / workaround / actionable suggestion.

Submissions with friction logs can earn up to a 10% judging bonus.

---

## FL-001 — Vega SDK cannot be installed on Windows, and WSL is explicitly unsupported
- **Date:** 2026-09-18
- **Tool:** Vega Developer Tools / Vega SDK
- **Task:** Set up a Fire TV development environment on a Windows 11 workstation.
- **Steps:** Read the hackathon Fire TV track requirements → followed the Resources link to
  the Vega getting-started guide → reached the Vega Developer Tools install prerequisites.
- **Expected:** A Windows install path, or at minimum a supported WSL2 path, since Windows is
  the most common developer desktop OS and the toolchain is React Native based.
- **Actual:** The prerequisites state that Windows and WSL are neither supported nor tested;
  only native macOS 10.15+ or Ubuntu 20.04+ are supported. A Windows-only developer is
  therefore locked out of the Vega half of the Fire TV track entirely.
- **Severity:** Critical
- **Workaround:** None on Windows. Options are dual-booting Ubuntu, buying a Mac, or falling
  back to the Fire OS (Android) path — which requires a separate ~15 GB Android toolchain.
- **Suggestion:** Ship an official Docker-based Vega toolchain image, or validate and document
  a WSL2 path. A containerised `vega` CLI would make the platform reachable from any host OS
  and would materially widen the Vega developer funnel.

---

## FL-002 — Fire TV track's own "creative" example depends on a camera that no Fire TV exposes
- **Date:** 2026-09-18
- **Tool:** Fire TV / Vega OS platform capabilities
- **Task:** Scope a computer-vision app for the Fire TV track.
- **Steps:** Read the official judging criteria, which list as a *creative* Fire TV example:
  "computer vision fitness app using the TV camera" → searched Fire TV and Vega API references
  for a camera or media-capture API.
- **Expected:** A documented camera API, or a clear statement of which devices expose one.
- **Actual:** No Fire TV Stick or Fire TV edition television has a built-in camera. The only
  camera path is USB UVC webcam support on the 2nd-gen Fire TV Cube, and that is reserved for
  Amazon's own two-way video calling and approved partner apps — not available as a general
  third-party API. The Vega Virtual Device provides no camera feed.
- **Severity:** Critical
- **Workaround:** Pair a phone as an external camera and stream inference results to the TV
  over WebSocket, which is a materially different architecture and cost.
- **Suggestion:** Either document the supported camera path for third-party Fire TV apps, or
  remove the TV-camera example from the judging criteria. As written it directs entrants
  toward an architecture the platform does not currently support.

---

## FL-003 — Ring API is video-only, which is not obvious until deep in the reference
- **Date:** 2026-09-18
- **Tool:** Ring Partner API
- **Task:** Evaluate whether a two-way conversational door experience is buildable.
- **Steps:** Read the Ring developer landing page → API development guide → full Partner API
  reference.
- **Expected:** Two-way audio, given that two-way talk is a headline consumer feature of every
  Ring doorbell.
- **Actual:** Live streams are explicitly "video only — no audio". There is no talk-back
  endpoint. The only audio output is `POST /v1/devices/{id}/media/audio/playback` on a Chime.
- **Severity:** Important
- **Workaround:** Design the interaction around Chime audio out plus camera-based gesture input.
- **Suggestion:** State the audio capability matrix on the API landing page, next to the
  streaming bullet, rather than only inside the endpoint reference. Entrants are scoping whole
  products off that first page.

---

## FL-004 — Ring Partner API is limited to US-located devices
- **Date:** 2026-09-18
- **Tool:** Ring Partner API
- **Task:** Confirm an international developer can build and demo on the Ring track.
- **Expected:** Global availability, since the hackathon is open to all countries excluding
  standard exceptions.
- **Actual:** The development guide states the API currently supports only US-located devices.
- **Severity:** Important
- **Workaround:** Use the Developer Playground, which needs no account linking, no
  subscription and no physical device — but this needs to be signposted for non-US entrants.
- **Suggestion:** Call out the Playground as the explicit supported path for non-US developers
  in the hackathon Ring resources, and publish a region roadmap.

---

---

## FL-005 — Amazon developer account setup is blocked for Syria, 14 months after the sanctions that justified it were revoked
- **Date:** 2026-09-19
- **Tool:** Amazon Developer account registration / Ring Developer Console
- **Task:** Reach the Ring Developer Console to obtain Playground credentials.
- **Steps:** From developer.ring.com, followed the documented "Become a Developer" button to
  `https://developer.amazon.com/ring/console`. Signed in with a valid Amazon account. Was
  redirected to `https://developer.amazon.com/settings/console/registration?return_to=/ring/console`.
- **Expected:** The developer registration form, or a clear message explaining why registration
  is unavailable.
- **Actual:** **404 Page not found**, while signed in, with the account avatar rendering in the
  header. There is no error message, no country notice and nothing to act on. The real cause is
  only discoverable three documents away, in *Accepted IDs for Identity Verification*:
  "Identity verification and Amazon developer account setup isn't currently supported in these
  countries" — a list that includes **Syria**. A 404 is doing the work of a policy message.
- **Severity:** Critical
- **Workaround:** None. No Amazon developer account means no Ring Developer Console, no Fire TV
  submission and no Alexa Developer Console. Of the four hackathon tracks, only the Alexa+
  simulated-experience path remains reachable.
- **Suggestion:** Two things, in order of urgency.
  1. **Return a real message, not a 404.** Anyone in the 43 listed territories currently hits a
     dead page at step one of the documented onboarding path, with no way to learn why.
  2. **Re-examine the list.** Syria's presence on it predates a substantial change in its legal
     status: OFAC's comprehensive Syria sanctions were terminated effective 1 July 2025, all
     Syrian financial institutions were delisted on 30 June 2025, the Caesar Act was repealed on
     18 December 2025, and the State Sponsor of Terrorism designation was rescinded on
     24 August 2026. The identity-verification page was last updated 31 July 2025. This
     hackathon is advertised as open to all countries excluding standard exceptions, and Syria
     is no longer one of them — but Amazon's own onboarding still refuses Syrian developers,
     which makes three of the four tracks unenterable for them regardless of the contest rules.

---

## FL-006 — The Playground cannot exercise the only audio-out endpoint Ring has
- **Date:** 2026-09-19
- **Tool:** Ring Developer Playground / Chimes scope
- **Task:** Confirm that an app can play audio on a Ring device — the one visitor-facing
  output channel the Partner API exposes.
- **Steps:** Generated a Playground token, listed devices, read the device capabilities, then
  attempted `POST /v1/devices/{id}/media/audio/playback`.
- **Expected:** Either a simulated chime alongside the simulated doorbell, or a clear statement
  in the Playground that audio playback is out of scope for it.
- **Actual:** The Playground issues exactly one device, a DoorbellPro, and its capabilities
  report `audio: { customizable_slots: null, supported_actions: null }`. There is no chime, no
  way to add one, and `/v1/chimes` is a 404. Chime Controls is also gated behind a scope group
  chosen at app-creation time, which the Playground path deliberately skips. The result is that
  the Playground can exercise motion events, button presses, event history, WHEP live view and
  image snapshots — everything *inbound* — but **none** of the outbound audio surface.
- **Severity:** Important
- **Workaround:** Implement `playOnChime` against the documented contract and mark the step as
  simulated in the demo. It cannot be verified without buying a Ring Chime and a subscription.
- **Suggestion:** Add a simulated chime to the Playground device set. Any project that responds
  to a doorstep event rather than merely logging it needs an output channel, and right now the
  Playground can prove half a product. A simulated chime that returns 202 and echoes the
  `audio_ref` would be enough to develop against.

---

## FL-007 — `media/image/download` answers 403 for a schema problem, which reads as an auth failure
- **Date:** 2026-09-19
- **Tool:** Ring Partner API — Image Snapshots
- **Task:** Download a snapshot for the doorbell.
- **Steps:** `POST /v1/devices/{id}/media/image/download` with a valid bearer token, first with
  no body, then with several plausible time-range bodies.
- **Expected:** `400 Bad Request` naming the missing field, as the API's own error table
  promises for invalid parameters.
- **Actual:** `403 REQUEST_FORBIDDEN` with `"Cannot authorize: empty request body"`, then
  `"Cannot authorize: missing required timestamp fields in request body"`. Both are schema
  errors dressed as authorization failures. With a token that had just succeeded on four other
  endpoints, the obvious reading was a scope problem, and the time went into re-checking auth
  instead of the body. The correct shape — `type: "at_timestamp"` with `timestamp` in epoch
  milliseconds — is documented, but the error never points at it.
- **Severity:** Important
- **Workaround:** None needed once the schema is known; it works and returns 303 with a
  pre-signed Location.
- **Suggestion:** Return `400` with the offending field named, and reserve `403` for genuine
  authorization failures. Prefixing a validation message with "Cannot authorize" sends
  developers to the wrong place entirely.

---

## FL-008 — The Playground's Package / Vehicle / Motion buttons all emit the same undifferentiated event
- **Date:** 2026-09-19
- **Tool:** Ring Developer Playground — "Simulate live view event"
- **Task:** Produce the three event kinds the Playground advertises, so an app can be developed
  against realistic doorstep signals.
- **Steps:** Clicked **Package**, then **Vehicle**, then **Motion**. Polled
  `GET /v1/history/devices/{id}/events` after each.
- **Expected:** Three distinguishable events — at minimum `motion_detected` carrying
  `attributes.sub_type` of `package`, `vehicle` and `human`, which is exactly the shape the
  webhook documentation describes and the only thing that makes the three buttons different
  from one button.
- **Actual:** All three produce an identical record:
  `event_type: "on_demand"`, `cv_detections: { data: [] }`, no `sub_type`, no classification of
  any kind. The three buttons are indistinguishable downstream. `?include=cv_detections` returns
  an empty `included` array every time, and neither `?event_type=` nor `?filter[event_type]=`
  has any effect — the same six rows come back regardless.
- **Severity:** Important
- **Workaround:** Classify the visitor ourselves from the WHEP frames and snapshots rather than
  reading Ring's classification. Workable, and arguably the better architecture, but it means
  the entire `sub_type` branch of the code is written blind against documentation and cannot be
  tested before submission.
- **Suggestion:** Three things.
  1. Make the buttons emit `motion_detected` with the matching `sub_type`. A simulator whose
     three options are identical is teaching developers nothing about the real event shape.
  2. Populate `cv_detections` on simulated events, even with one canned detection. The
     relationship exists on every event and is documented nowhere in the main API reference;
     right now there is no way to learn its payload shape short of owning a real device.
  3. Either implement the event-history query parameters or reject unknown ones. Silently
     ignoring `?event_type=` reads as "this device has only on_demand events" rather than
     "this filter does nothing", which is a slow and avoidable misunderstanding.

---

## FL-009 — The API reference says "video only — no audio". Ring sends Opus.
- **Date:** 2026-09-19
- **Tool:** Ring Partner API — WHEP live streaming
- **Severity:** **Critical**
- **Task:** Confirm the documented audio capability of the live view before designing around it.
- **Steps:** Sent a WHEP SDP offer containing both a `recvonly` video m-line and a `recvonly`
  audio m-line (Opus 48000/2) to
  `POST /v1/devices/{id}/media/streaming/whep/sessions`.
- **Expected:** Per the Ring Developer landing page and the Partner API reference, live video is
  **"Video only — no audio"**. A conformant answer would therefore either omit the audio m-line
  or reject it with port 0.
- **Actual:** **201, and the answer accepts audio:**

  ```
  m=video 9 UDP/TLS/RTP/SAVPF 96
  a=sendonly
  m=audio 9 UDP/TLS/RTP/SAVPF 111
  a=sendonly
  a=rtpmap:111 OPUS/48000/2
  ```

  Ring negotiates an Opus audio track and marks it `sendonly` — it streams the visitor's audio
  to the client. The documentation is factually wrong.
- **Why this is Critical rather than Important.** This is not a cosmetic doc error. The single
  most valuable accessibility feature available on this platform is **captioning the visitor's
  speech for a Deaf or hard-of-hearing resident** — something no shipping doorbell does anywhere
  (Google Nest states outright that "only non-verbal audio specified in the list is supported";
  Ring's own AI Video Descriptions are visual-only; Alexa+ Greetings hands the resident an audio
  recording). A developer who reads the documentation concludes that feature is impossible on
  Ring and does not build it. **The docs are actively suppressing the platform's best
  accessibility capability.**

  We had designed an entire product architecture around the documented limitation before testing
  it. That is two days of design predicated on a sentence that is not true.
- **Workaround:** None needed — the capability works. But it is only discoverable by ignoring
  the documentation and probing the endpoint, which is not a reasonable expectation.
- **Suggestion:**
  1. **Correct the "Video only — no audio" statement** on the Ring Developer landing page and in
     the Partner API reference. It appears in both.
  2. Document the audio track properly: codec, sample rate, channel count, whether it is
     available on all device classes or only some, and whether a subscription gates it.
  3. Consider stating the accessibility implication explicitly in the docs. Amazon already ships
     Call Captioning and Real Time Text on Echo Show, scoped to Alexa calls and Drop Ins. The
     same primitive pointed at a doorbell would be the most significant accessibility feature in
     the category, and right now the documentation tells developers the raw material does not
     exist.

---

## FL-010 — The hackathon admits Syrian developers. AWS will not verify them.
- **Date:** 2026-09-19
- **Tool:** AWS account identity verification
- **Severity:** **Critical**
- **Task:** Enable Amazon Transcribe and Amazon Bedrock for the AWS Builder mini challenge.
- **Steps:** Created an AWS account, requested the hackathon's $150 promotional credits, and
  began identity verification.
- **Expected:** To verify and continue, since this hackathon is open to "all countries and
  territories, excluding standard exceptions" and the official rules exclude only countries
  **comprehensively sanctioned by OFAC**.
- **Actual:** **The account was suspended and verification cannot be completed, because Syria is
  not offered in the nationality/country list.** A support case is open
  (*AWS Account Verification — Manual Review Required*, 19 Sep 2026) asking three questions: why
  Syrian nationality is unsupported, whether a Syrian national may use AWS at all, and whether a
  manual path exists.

### Why this is Critical rather than a personal inconvenience

**Amazon's own rules and Amazon's own systems disagree with each other**, and a developer sits
in the gap.

Syria's position changed materially and is a matter of public record:

| Date | Change |
|---|---|
| 30 Jun 2025 | All Syrian financial institutions removed from OFAC's SDN list |
| **1 Jul 2025** | **The six Executive Orders constituting the Syria sanctions program revoked** |
| 18 Dec 2025 | Caesar Act repealed |
| 24 Aug 2026 | State Sponsor of Terrorism designation rescinded |

Syria has therefore **not been comprehensively sanctioned by OFAC for fourteen months**. By the
hackathon's own eligibility rule, a Syrian resident is eligible to enter and to win.

Amazon's *Accepted IDs for Identity Verification* page — last updated **31 July 2025**, one month
after the sanctions were revoked — still lists Syria among countries where "identity verification
and Amazon developer account setup isn't currently supported." The same block returns a bare
**404** on the Ring and Alexa developer consoles with no explanation (FL-005).

So the position is: **the contest says come in, and the platform says you do not exist.**

### The compounding problem with the credits

The rules offer $150 in AWS promotional credits to entrants. AWS's own billing documentation
states that **"Free account plans are not eligible for other promotional credits and discounts."**
A new entrant on the default Free plan may therefore be unable to redeem the credits the
hackathon is offering them — before the country block is even reached.

### Workaround

Every model call now routes through `lib/ai/provider.ts`, which prefers Bedrock and Transcribe
where they are available and otherwise falls back to any OpenAI-compatible endpoint. **We would
rather use the AWS services** — that is what the mini challenge asks for, and it is the
architecture we designed. The abstraction exists because a project built from a country AWS will
not verify cannot let a single vendor be load-bearing.

The product runs fully without either: the decision engine is deterministic, and the caption and
vision panels state which provider is active and what that means for where the data went.

### Suggestion

1. **Reconcile the eligibility rule with the verification list.** If the hackathon is open to a
   country, the platform it requires should be too. Right now Amazon is inviting developers it
   cannot onboard.
2. **Re-examine the unsupported-country list.** It predates a documented change in Syria's legal
   status by fourteen months. The list is not a law; it is a list, and it can be updated.
3. **Return a real message, not a 404.** Anyone in the 43 listed territories currently discovers
   this by hitting a dead page and guessing.
4. **State the Free-plan credit restriction in the hackathon rules**, or grant the credits in a
   form a Free-plan account can redeem. Offering credits that a default new account cannot accept
   is a trap laid for exactly the entrants with the least margin.
