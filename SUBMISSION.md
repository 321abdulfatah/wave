# WAVE — your door, answered without a word

**Tracks:** Ring · Alexa+ **Mini challenges:** AWS Builder · Open Source

**Live:** https://wave-tan-nine.vercel.app · **MCP endpoint:** `/api/mcp` (spec 2025-11-25)

---

## Inspiration

Ring's Alexa+ Greetings already answers your door with generative AI. It talks to the visitor,
takes a message, handles the delivery. It is genuinely impressive.

Then a Deaf resident opens the app to see what was said, and Ring hands them **an audio
recording**.

That is not an oversight in one feature. It is the shape of the whole category. We went looking
for anything that closes the gap and found nothing:

- **Google Nest** describes the *sound* of a doorbell and then states outright, in its own
  documentation, that *"only non-verbal audio specified in the list is supported."* It hears the
  bell ring and refuses to transcribe the words of the person pressing it.
- **Ring's AI Video Descriptions** are visual-only — every accuracy caveat is about lighting and
  motion, none about audio.
- **Ring, Vivint and Wyze** all speak automatically at the door. All hand back audio or video.
- **Ring's Virtual Security Guard at $99/month**, SimpliSafe Active Guard and Deep Sentinel put
  *human* guards on two-way audio and log nothing in writing.
- **`ring.com/accessibility` returns 404.** No accessibility page. No VPAT.

Meanwhile the dedicated assistive category — the products actually sold to Deaf people —
charges **$70 to $414** for something strictly worse:

| Product | Price | Tells you who is there? | Lets you reply? | Any text? |
|---|---|---|---|---|
| Bellman & Symfon Visit | $413.85 | No | No | No |
| Sonic Alert HomeAware II | $269.99 | No | No | Event labels only |
| Serene CentralAlert CA-360 | $249.95 | No — its speech announces the alert *type*, which is useless to a Deaf user | No | No |
| Geemarc AmpliCall 100 | — | No — and its relay **opens the door** without you knowing who is there | No | No |

Every one is a **one-bit event bus**. A transmitter fires, a receiver flashes. The only
information that survives the radio hop is *which transmitter fired*. The retailer Diglo
organises the entire category by trigger type — and not one SKU in it does identity.

**That is the headline number: $70–$414 buys a doorbell that tells you someone is at the door.
It does not tell you who, and it does not let you answer.**

And the last thing we found is the one that decided the project. **Amazon already owns the
missing piece.** Echo Show ships **Call Captioning** — real-time captions, four languages — and
**Real Time Text**, a live chat feed during a call. Both are scoped to Alexa calls and Drop Ins.
Neither covers a Ring doorbell.

Same box. Same microphone. Same speech recognition. Wrong scope.

---

## What it does

WAVE gives a Deaf or hard-of-hearing resident **the conversation at their door, in writing, both
directions.**

**The door rings where they can see it.** The screen itself rings — concentric rings expand out
of the door card at 0.83 Hz. Not decoration: it is the notification channel, and it is designed
to be caught in peripheral vision from across a room.

**The visitor's speech becomes text.** Ring's WHEP live view carries an Opus audio track. We
capture it, convert to 16 kHz PCM in the browser, and stream it to Amazon Transcribe. Partials
render dimmed, finals commit, all inside an `aria-live` region. This is the feature nobody
ships.

**The visitor answers with their hands.** Ring has no live talk-back: audio out is a chime
playback, not a voice channel, so a visitor cannot simply be asked to repeat themselves. The
return channel is the camera. MediaPipe reads the hand in the browser and posts only the
resulting label — no video frame ever leaves the page.

**And the gestures change by culture.** This is the part we did not expect to matter and which
ended up defining the project.

**Alexa+ reads the record back.** A self-hosted MCP server, spec 2025-11-25 over Streamable
HTTP, with five tools: `who_came_today`, `describe_visit`, `list_known_visitors`,
`set_visitor_policy` and `explain_gestures`.

---

## The part that surprised us: a gesture is not universal

We started with five obvious hand shapes — thumbs up for yes, open palm for wait, wave for
hello, point for "leaving it here", fist for no. They felt so natural we nearly shipped them.

Then we checked them against **Matsumoto & Hwang (2013)**, a peer-reviewed emblem catalogue with
measured recognition rates across six world regions.

**Four of our five mappings were wrong.**

| Our gesture | What the data says |
|---|---|
| `fist` = no | Pan-culturally **"Threat" at 98.15%**. Triumph in Japan. The numeral 10 in China. One landmark from the obscene Turkish fig. And the terminal handshape of the *bras d'honneur* in France, Mexico and Brazil — where the insult lives in the forearm and second hand, which a single-hand model cannot see. **Our classifier would have logged "the visitor said no" for an obscene gesture.** |
| `open_palm` = wait | **This is the Greek moútza.** And the obvious fix fails: the fingers-together version is the «ευγενική» moútza, a *named milder form of the same insult* that several travel sites recommend as the safe alternative. Statically, the moútza and our "wait" are the **same 21 landmarks** — without thrust detection the system reads an insult as politeness. |
| `wave` = hello | A **US** emblem. In Japan, palm-out waving in front of the face is ちがう、ちがう — *"that is wrong."* In Turkey it is *"no, thanks."* |
| `thumbs_up` = yes | Means **"good"**, not yes — 74.85% in East Asia against 100% in the US. The pan-cultural "yes" is a **head nod at 98.18%**. |

And one we had not even considered: **`open_palm` with the thumb folded is the Rabia sign.**
Egypt designated the Muslim Brotherhood a terrorist organisation in 2013; a footballer was
suspended and a kung fu champion banned for a year for displaying it. In Turkey it is a
governing-party emblem. **A thumb-position-tolerant classifier emits it by accident.**

The architectural conclusion changed the product: **the two most recognised emblems on earth are
not hand gestures.** A nod reads as yes at 98.18% and a head shake as no at 99.10%. They are
more portable than anything hand-based *and* they work for someone holding a parcel in both
hands.

### Two of our own claims did not survive, and we withdrew them

This matters more to us than the findings that held:

- *"Thumbs-up is obscene in West Africa"* — traces to a 1991 travel book. Wikipedia's own
  thumb-signal article does not mention West Africa at all.
- *"The Nigerian waka gesture"* — the sentence asserting it carries **no citation anywhere** we
  could find; searches of Punch, Vanguard, Guardian Nigeria and Premium Times returned nothing.

Both were in our plan, written confidently. Both are gone. The `en-NG` entry still withholds the
gesture — on **asymmetric cost, not evidence** — and says so in those words.

Every claim in the shipped code carries its evidence grade: `peer-reviewed`, `institutional`,
`tertiary` or `unverified`. A judge can open `lib/gestures/locales.ts` and see which claims we
are confident about and which we are not.

### And this is why IP geolocation is the wrong answer

The obvious way to pick a locale is to geolocate the doorbell. It is wrong, and wrong in a way
that matters: **IP tells you where the door is. It tells you nothing about the person standing
at it.** A courier at a Norwegian door is as likely to be from Warsaw, Mogadishu or Lahore as
from Bergen. Localising the interface does not localise the visitor.

So WAVE asks two separate questions. *"What do you read?"* is seeded once from
`navigator.languages` — a stated preference, not an inference; never from IP, because a VPN
should not change the language of someone's home. *"Who arrives at your door?"* cannot be
detected at all, so the household answers it — and the door then uses only the **intersection**:
the gestures safe in every locale picked.

The safe set **shrinks** as locales are added, and the panel names which gesture was withheld
and by whom. A household expecting visitors from Athens and Cairo genuinely has fewer safe
gestures than one expecting only Seattle. Pretending otherwise is how you insult someone.

---

## How we built it

**Ring** — WHEP live view, event-history polling every 4 s, snapshot download, HMAC-verified
webhooks. Webhooks are configured per registered app and are never delivered to the Playground,
so polling covers development while the webhook handler stays the real production entry point.

**Alexa+** — a self-hosted MCP server, JSON-RPC 2.0 over Streamable HTTP, protocol 2025-11-25.
Read-mostly by design: it can summarise the record and change the resident's own standing
policy, but it **cannot speak to a visitor, unlock anything, or resolve an event.** An agent that
can be talked into opening a door by whoever is standing at it is not a door agent.

**AWS, and what actually ran** — captions are written against **Amazon Transcribe** streaming
and visitor classification against **Amazon Bedrock**, since Ring's own site says *"Ring provides
the pixels — add your own CV or AI models."* Both are first in the resolution order in
`lib/ai/provider.ts` and both are the path we wanted.

Neither has ever executed. AWS suspended the account mid-build during identity verification, and
the deployed build therefore runs the fallbacks — Groq Whisper for speech, OpenRouter for vision —
through the same interface. We are stating that plainly rather than listing two AWS services the
judges would find unexercised. The integration is real code on a path we could not open; it is
FL-010, and it is the reason no vendor in this project is load-bearing.

What is true of the classifier either way: it is asked about the **situation** and never the
person — is there a parcel, a uniform, a vehicle. Never who someone is, their age, gender or
race. A confidence below 0.6 is forced to `unknown` in code as well as in the prompt, because a
wrong confident answer greets a neighbour as a courier.

**Motion** — grounded in WCAG 2.3.1/2.3.2 and the 2025 photosensitive-epilepsy guidance rather
than in taste. The alert loops at **0.83 Hz, 3.6× under the three-per-second limit**, and buys
noticeability from looming expansion rather than flicker — because 15–20 Hz is simultaneously
what peripheral vision detects best and what provokes seizures. Under `prefers-reduced-motion`
every alert is **re-encoded, never deleted**.

**Design** — 14 per-locale themes on an **ISO 3864-4** base rather than folk colour symbolism,
because the standard is legally grounded and matches China's own national safety standard. Nine
locales get a distinct palette; five stay at base because there was no sourced reason to differ,
and saying so is the point. Per WCAG 1.4.1 no state is carried by colour alone.

---

## Challenges

**Ring's documentation says the live view carries no audio. It carries Opus.**

Two official pages state *"Video only — no audio."* We designed an entire product architecture
around that limitation before testing it. Then we sent a WHEP offer with a `recvonly` audio
m-line and got back:

```
m=audio 9 UDP/TLS/RTP/SAVPF 111
a=sendonly
a=rtpmap:111 OPUS/48000/2
```

This is **FL-009, Critical**, and it is critical for a reason beyond the doc error. Captioning a
visitor's speech is the most valuable accessibility feature available on this platform, and a
developer who reads the documentation concludes it is impossible and does not build it. **The
docs are suppressing the platform's best accessibility capability.**

**The Vega SDK does not run on Windows.** Not supported, not tested — macOS or Ubuntu only, 20 GB
minimum. This closed the Fire TV track entirely on the development machine available.

**A 404 where a policy message belongs.** Signing in and opening the Ring console returns a bare
404 with no explanation. The cause is three documents away: Amazon developer account setup is
unavailable in 43 territories. A 404 is doing the work of a policy message.

**The Playground can prove half a product.** Its Package, Vehicle and Motion buttons all emit an
identical `on_demand` event with empty `cv_detections`, and its single DoorbellPro reports
`audio: { supported_actions: null }` — so the one documented audio-out endpoint cannot be
exercised at all.

**The hackathon admits us; the cloud does not.** This competition is open to every country
except those comprehensively sanctioned by OFAC — which Syria has not been since 1 July 2025.
AWS's identity verification does not offer Syrian nationality, and the account was suspended
mid-build. So an entrant Amazon's own rules accept cannot use Amazon's own cloud, and the AWS
Builder path was closed by the same company running the contest. That is **FL-010, Critical**.

The engineering answer was to stop letting one vendor be load-bearing: every model call moved
behind `lib/ai/provider.ts`, so a provider is configuration rather than a rewrite. It is a better
design than the one we started with, and we would rather have arrived at it on purpose.

**Our own bugs, found by measuring rather than looking.** A race started three pollers instead of
one, hammering Ring every 1.3 s instead of every 4 s — hidden behind a silent `catch`. And the
ochre that draws the alert ring measured **2.72:1**, under WCAG 1.4.11's 3:1 floor for a
graphical object carrying state. For a Deaf resident **that ring is the doorbell** — the one
element in this product that must not be borderline. It is now 3.12:1.

---

## Accomplishments

- **Captioning a doorstep conversation**, which no shipping product does anywhere.
- **A per-locale gesture vocabulary** with an evidence grade on every claim. SAP patented the
  idea in 2010 (US 8,656,279) and appears never to have built it; the HCI literature is chasing
  a *universal* set instead.
- **Nine friction-log entries, three Critical**, every one from a real blocker hit while
  building.
- **[gesture-locale](packages/gesture-locale)** — the research extracted as a standalone MIT
  library with 20 passing tests, so the next team does not have to repeat it.
- **Arabic that is written rather than translated.** No السلام عليكم — the fiqh sources concern
  greeting between people of known faith, and a door agent greets whoever arrives.
  Plural-as-respect throughout, which is age-neutral deference — and that matters because the
  camera cannot know who it is talking to **and must not try.** Refusal phrased as deferral,
  because a direct "no" is culturally dispreferred in Egyptian register.

---

## What we learned

**The loudest claims are the worst sourced.** The gesture taboos everyone repeats — thumbs-up in
West Africa, the Nigerian palm — collapsed under checking. The severe, real findings — the
moútza, the Rabia sign, the fist as a threat — are far better evidenced and almost never
mentioned.

**Restraint is a feature.** The most defensible decisions in this project are things the product
refuses to do: it will not estimate a visitor's age, it will not archive a stranger's face, the
MCP server cannot unlock anything, and five locales have no custom theme because no source
justified one.

**Test the premise before building on it.** Two days of architecture rested on one sentence in
Ring's documentation that turned out to be false.

---

## What's next

**Deaf testers.** We have not tested with Deaf or hard-of-hearing users, and we are saying so
rather than implying otherwise. It is the single most important next step and nothing in this
submission substitutes for it.

**DynamoDB.** Events currently live in an in-memory singleton, documented as the first thing to
swap and four functions wide.

**A native reviewer per locale.** Several substitutes — the Greek raised index, the Chinese
两手 forms — are engineering inference constrained by a sourced negative finding, not sourced
positive emblems. They are marked as such in the code and should not ship without review.

**`es-MX`, `pt-BR` and `hi-IN` got thinner research passes** than the rest, and the `pt-BR`
theme is the one we would revert first if a Brazilian reviewer says a green tick reads as a
green tick.

---

## Built with

Next.js 15 · TypeScript · Ring Partner API (WHEP, webhooks, media) · Model Context Protocol
2025-11-25 · MediaPipe Hands · Vercel

Integrated and first in the resolution order, never executed because the AWS account was
suspended during identity verification (FL-010): **Amazon Transcribe**, **Amazon Bedrock**.
Running in the deployed build in their place: Groq Whisper, OpenRouter.
