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
