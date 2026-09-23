# Devpost submission — field by field

`SUBMISSION.md` is the narrative. This is the paperwork: the exact values that go into each
box on the Devpost form, and what is still missing.

**Deadline: 23 October 2026, 12:00 PDT — 22:00 in Kuwait.** Submit a day early. Devpost
closes on the minute and there is no appeal.

---

## Status

| | |
|---|---|
| ✅ Public repo, MIT, license visible | <https://github.com/321abdulfatah/wave> |
| ✅ Second public repo, MIT | <https://github.com/321abdulfatah/gesture-locale> |
| ✅ Deployed and reachable | <https://wave-tan-nine.vercel.app> |
| ✅ Ring APIs called at runtime | WHEP, event history, webhooks, media — `lib/ring/` |
| ✅ MCP server, spec 2025-11-25, Streamable HTTP | `/api/mcp`, five tools |
| ✅ Friction log | 10 entries, 2 critical |
| ✅ Written submission | `SUBMISSION.md` |
| ❌ **Demo video** | not recorded — script in `docs/demo-script.md` |
| ⚠️ **AWS Builder mini** | reachable via Kiro Crew, which needs no AWS account — see below |
| ⏳ Eligibility | emailed 19 Sep, no reply yet — but the rule text is quoted below and Syria is not excluded by it |
| ⏳ $150 AWS credits | requested, blocked behind the same verification |

---

## Fields

**Project name**
```
WAVE
```

**Tagline**
```
Your door, answered without a word.
```

**Tracks** — Ring, Alexa+

**Mini challenges** — Open Source, and AWS Builder once Kiro Crew has been used (see below).

**Eligibility, for reference.** The rules exclude residents of countries "where the laws of the
United States or local law prohibits participating or receiving a prize … including, but not
limited to, Brazil, Quebec, Russia, Crimea, Cuba, Iran, and North Korea and any other country
which is comprehensively sanctioned by the U.S. Treasury's Office of Foreign Assets Control."
Syria is not named, and has not been comprehensively sanctioned since E.O. 14312 on 30 June
2025; the State Sponsor of Terrorism designation was rescinded on 24 August 2026. The clause
keys on **residency**, which here is Kuwait. Amazon's retail and device-export country lists run
on EAR export controls, a different regime — see FL-010.

**Links**
```
Live:        https://wave-tan-nine.vercel.app
Repository:  https://github.com/321abdulfatah/wave
Package:     https://github.com/321abdulfatah/gesture-locale
MCP:         https://wave-tan-nine.vercel.app/api/mcp
Video:       [paste the unlisted-or-public YouTube URL here]
```

**Story fields** — paste from `SUBMISSION.md` under the matching heading. Devpost's boxes are
Inspiration / What it does / How we built it / Challenges / Accomplishments / What we learned /
What's next / Built with, and `SUBMISSION.md` is already written in that order.

**Image gallery** — `docs/screenshots/`, in this order. The architecture diagram goes first;
it is the one image that explains the whole project without a caption.

1. `docs/architecture.svg` (export to PNG if Devpost rejects SVG)
2. `01-dashboard.png`
3. `02-courier-at-the-door.png`
4. `04-gestures-withheld-for-greece.png`
5. `05-arabic-rtl.png`
6. `06-japanese.png`

---

## Open Source mini

```
Repository:   https://github.com/321abdulfatah/gesture-locale
Licence:      MIT
Username:     321abdulfatah
```

**Description**
```
gesture-locale is the culturally safe gesture vocabulary WAVE needed and could not
find. Fifteen locales, each listing the hand gestures it withholds and why, with a
severity and an evidence grade — peer-reviewed, institutional, tertiary or unverified —
on every claim. Two widely repeated claims we could not substantiate are documented as
withdrawn rather than quietly dropped, which is the part we would most like other
people to copy. Zero dependencies, 21 tests, usable by any computer-vision interface
that puts a hand shape in front of a stranger.
```

---

## AWS Builder mini — resolved, and reachable

The rule text was checked rather than guessed at. It asks entrants to incorporate AWS services
"such as Amazon Bedrock, AgentCore, Strands SDK, Kiro Crew, or SageMaker" **with documented
integrations**, and it says plainly that **Kiro Crew alone qualifies — a submitter need not also
call a runtime AWS service.**

That changes the position completely. The blocker was never the mini challenge; it was the
assumption that it required a working AWS account.

**Where we stand**

- Amazon Bedrock and Amazon Transcribe are **integrated and documented**, first in the
  resolution order in `lib/ai/provider.ts`. Neither has executed, and `SUBMISSION.md` says so.
- **Kiro Crew is the missing piece, and it does not need an AWS account.** Kiro signs in with
  GitHub or Google as well as AWS Builder ID, and the free tier needs no card. Kiro Crew itself
  is open source, and runs from a CLI and a web dashboard as well as the Mac app — which matters
  on Windows.

**To do**

1. Sign in to Kiro with the GitHub account. No card, no AWS account.
2. Use Kiro Crew on something real inside the hackathon window — it is well suited to the demo
   video checklist, or to a pass over the friction log.
3. Document what it was used for, with a screenshot or a session log. The rule asks for
   *documented* integration, so the documentation is the deliverable.
4. Then tick the AWS Builder box, and describe both: Kiro Crew used, Bedrock and Transcribe
   integrated but blocked at verification.

If Kiro sign-up is itself geo-blocked, that is a second data point for FL-010 and worth logging
as one. Try it before assuming either outcome.

---

## Product feedback

Devpost asks for feedback on every tool, API and SDK used. `FRICTION_LOG.md` is the answer —
paste it, or link it and summarise these:

- **FL-009, Critical** — the Partner API docs say the live view carries no audio. It
  negotiates `OPUS/48000/2`. A developer who trusts the documentation concludes that
  captioning a visitor is impossible and never builds the platform's single most valuable
  accessibility feature.
- **FL-010, Critical** — the hackathon admits every country not comprehensively sanctioned by
  OFAC; Syria has not been since 1 July 2025. AWS identity verification does not offer Syrian
  nationality. An entrant Amazon's rules accept cannot use Amazon's cloud.
- **FL-005** — signing into the Ring console returns a bare 404. The cause, three documents
  away, is that developer account setup is unavailable in 43 territories. A 404 is doing the
  work of a policy message.
- **FL-006 / FL-008** — the Playground's Package, Vehicle and Motion buttons all emit an
  identical `on_demand` event with empty `cv_detections`, and its DoorbellPro reports
  `audio: { supported_actions: null }`, so the one documented audio-out endpoint cannot be
  exercised.
- **FL-007** — a snapshot request missing a field answers `403 Cannot authorize: empty request
  body`, which sends you to look at your credentials instead of your payload.

---

## Before submitting

- [ ] Record the video, caption it, upload it, make it public, paste the link
- [ ] Use Kiro Crew and document it, then claim the AWS Builder mini
- [ ] Refresh the Ring Playground token if the demo should show live Ring rather than mock
- [ ] Check every link in the form actually opens in a private window
- [ ] Submit on the 22nd, not the 23rd
