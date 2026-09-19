# The gap — what nobody ships

A sweep of the assistive-alerting category, every major smart-doorbell vendor, and the
open-source landscape. Full vendor tables and citations are the second half of this file; the
first half is the argument.

---

## The one-line case

> **Ring's Alexa+ Greetings already answers the door with generative AI. When a Deaf resident
> goes to see what was said, it hands them an audio recording.**

Amazon built the AI door agent. It is inaccessible to the people who most need a door answered
for them. Ring's own support page describes reviewing a Greeting as *"playing the video from
Event History."* Amazon's press release says *"You can review these messages alongside the video
footage"* — **the word transcript never appears.** Engadget's coverage says only *"reviewed later
on via the Ring app."*

*(Search summaries do claim Alexa+ Greetings offers "audio transcripts and AI-generated
summaries of visitor intent." Three primary sources contradict it. Treat it as search-summary
embellishment — but re-check before putting it in a submission, because if Amazon ships it
during the hackathon window this argument weakens.)*

---

## Six things nobody does

**1. No product captions a live visitor's speech for the resident.**

Google Nest is the cleanest citable negative in the whole landscape. Gemini for Home generates
AI descriptions and *describes sounds* — doorbell, barking, footsteps, glass, sirens, gunshots —
and then states outright:

> *"Only non-verbal audio specified in the list is supported."*

Google hears the *sound* of a doorbell and **refuses to transcribe the words of the person
pressing it.** Ring's AI Video Descriptions are visual-only — every accuracy caveat is about
lighting and motion, none about audio. Nobody else attempts it.

**2. No product returns text from an autonomous doorstep conversation.**

Ring, Vivint and Wyze all speak automatically at the door. All hand back audio or video.
Ring's Virtual Security Guard ($99/mo), SimpliSafe Active Guard and Deep Sentinel put **human**
guards on two-way audio and log nothing in writing.

**3. The assistive category conveys zero identity and zero response.**

| Product | Price | Tells you who? | Lets you reply? | Any text? |
|---|---|---|---|---|
| Bellman & Symfon Visit | $413.85 kit | No | No | No |
| Sonic Alert HomeAware II | $269.99 hub | No | No | Event labels only |
| Silent Call Medallion | $70–$330 | No — icon = category | No | No |
| Serene CentralAlert CA-360 | $249.95 | No — TTS announces the alert *type*, which is useless to a Deaf user | No | No |
| Geemarc AmpliCall 100 | n/a | No — and its relay **opens the door** without you knowing who is there | No | No |

Every one is a **one-bit event bus**: a transmitter fires, a receiver flashes. The only
information surviving the radio hop is *which transmitter fired*. The retailer Diglo organises
this entire category by trigger type — **not one SKU does identity.**

They charge $70–$414 for strictly less information than a free iPhone toggle.

**4. Amazon already owns the captioning primitive and has not pointed it at the door.**

This is the finding that belongs in the product feedback, because it goes straight to the team
this hackathon says it wants feedback for.

Echo Show ships **Call Captioning** — "real-time captions for Alexa calls", EN/ES/FR/PT — and
**Real Time Text**, "a live chat feed during an Alexa call or Drop In." Both are scoped to Alexa
calls and Drop Ins. **Neither covers a Ring doorbell's two-way talk.**

Same box. Same microphone. Same ASR. Wrong scope.

Apple is the same story: Live Captions can "capture and caption live, in-person speech through
the microphone" — but only if you are physically at the door holding the phone, which is the one
place a Deaf resident does not need help.

**5. Open source treats the transcript as an intermediate value, never the product.**

Every LLM-doorbell project assumes a hearing owner who wants a summary. And the obvious
"why didn't you just wire these together" answer is available:

| Project | Status |
|---|---|
| Frigate | 36k★, real software, **does** local STT now — but its maintainers state it "is not intended to act as a continuous, fully-automatic speech transcription service." Event transcription is manual, by design. |
| StreamAssist | 388★, **dead since Jul 2024**, 47 open issues |
| ring-mqtt | Maintainer **closed** the talkback PR in Jun 2026 |
| ring-client-api | 1.5k★, **no release since Feb 2025** |
| HA Ring integration | Docs: "Two-way audio in camera live view is not currently supported" |

Have that ready: a knowledgeable judge will ask why not just use StreamAssist and Frigate. The
answer is that StreamAssist has been dead for two years and Frigate explicitly refuses
continuous transcription.

**6. `ring.com/accessibility` returns 404.** No accessibility page. No VPAT. There is an open
Ring community request for real-time translation of Two-Way Talk — **demand exists, product does
not.**

---

## On the competition

The first prior-art pass flagged [ringvoice.vercel.app](https://ringvoice.vercel.app/) as a
direct competitor. On closer inspection it is a **UI mock**: scripted caption animation, zero
outbound links, no repo, no Devpost entry, no attribution — and a "LOG A RESPONSE" panel whose
options are explicitly labelled *"Not heard by visitor."*

Not a shipped product. But someone is circling this space, and it is the top organic result for
this exact idea. Know it before submitting.

---

## What this means for WAVE

The original framing was *"Ring carries no inbound audio, therefore gestures."* That framing is
brittle — it depends on an API limitation that may not hold, and it makes the product sound like
a workaround.

The durable framing is the gap above:

> **Every doorbell on the market is built for someone who can hear. The AI ones now answer the
> door for you and hand you a sound file. WAVE gives you the conversation in writing, both
> directions — what the door said, and what the visitor answered.**

Under that framing the gesture channel is not a workaround for missing audio. It is **the
visitor's reply channel**, and it is the half nobody has built even in principle: every system
above is one-directional, and the ones that do speak to the visitor have no way for the visitor
to answer a Deaf resident.

And the honest caveat to carry into judging: **the gap is in framing and assembly, not in
available technology.** Every piece exists. Nobody has pointed them at this problem.
