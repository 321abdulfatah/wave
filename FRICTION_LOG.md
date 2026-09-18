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
