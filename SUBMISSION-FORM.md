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
| ⚠️ **AWS Builder mini** | integrated but never executed; read the note below before claiming it |
| ⏳ Eligibility | emailed 19 Sep, no reply as of 22 Sep |
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

**Mini challenges** — Open Source. AWS Builder only if the note below says yes.

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

## The AWS Builder question — read before ticking the box

The honest position, which `SUBMISSION.md` now states in the open:

- Amazon Transcribe and Amazon Bedrock are **integrated in code** and **first in the
  resolution order** in `lib/ai/provider.ts`.
- Neither has **ever executed**. AWS suspended the account during identity verification,
  which does not offer Syrian nationality.
- The deployed build runs Groq Whisper and OpenRouter through the same interface.

If the mini challenge asks that AWS services be **used**, this does not qualify and claiming
it invites a judge to check and find nothing. If it asks that AWS services be **integrated and
documented in the feedback**, it does — and FL-010 is a stronger piece of feedback than a
working Bedrock call would have been.

**Read the rule text before ticking it.** If it is ambiguous, do not tick it: the submission
already gains more from the friction log entry than from the mini challenge, and a claim that
does not survive a check costs more than a mini challenge is worth.

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
- [ ] Re-read the rule text for the AWS Builder mini and decide
- [ ] Refresh the Ring Playground token if the demo should show live Ring rather than mock
- [ ] Check every link in the form actually opens in a private window
- [ ] Submit on the 22nd, not the 23rd
