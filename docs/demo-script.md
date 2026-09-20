# Demo video — shot script

**Target: 2 minutes 45 seconds.** The limit is 3:00. Judges watch a lot of these, and the
first fifteen seconds decide whether they watch the rest, so the problem lands before
anything is demonstrated.

## Before recording

- Run against **localhost**, not the deployed site. Everything is in one process there, so
  the event, the caption stream and the gesture reader cannot land on different serverless
  instances mid-take.
- `npm run dev`, then hard-reload once so the entrance motion plays on camera.
- Browser at **1480 × 940**, no bookmarks bar, no extensions, no notifications.
- Set the resident language to **English · United States** and clear visitor languages
  before the first take, or the gesture key will already be narrowed.
- **Caption the video.** A submission about captioning that ships uncaptioned is the whole
  argument, lost. Record voiceover, then burn in subtitles.

---

## 0:00 – 0:18 · The problem

**On screen:** the WAVE dashboard, still. No interaction yet.

> Every doorbell ever built assumes you can hear.
>
> The AI ones are worse about it. Alexa+ Greetings answers your door with generative AI and
> hands you a recording. Ring's AI descriptions describe the picture, not the speech. Google
> Nest states outright that it captions only non-verbal sound — it will tell a Deaf user that
> a doorbell rang, and never what the person said.

## 0:18 – 0:34 · The thing we found

**On screen:** cut to the terminal, `docs/` open at FL-009, or just the line in the UI —
*"Ring's own docs say the live view carries no audio. It carries Opus."*

> Ring's documentation says the live stream carries no audio. It carries Opus, forty-eight
> kilohertz, stereo. The WHEP answer negotiates it. That one contradiction is the whole
> feature.

## 0:34 – 1:15 · A visitor arrives

**Do:** click **Courier** under *Ring the doorbell*. Let the card land. Let the ring pulse
run once — do not cut it, the motion is part of the accessibility argument.

> A courier presses the button. WAVE recognises a visitor it has seen fourteen times before,
> and opens with the household's standing instruction, not with an improvisation.

**Do:** point at *Why WAVE did that*.

> It explains itself every time. The engine that decides is deterministic — a model captions
> and classifies, but nothing a language model writes gets spoken at this door on its own.

**Do:** start the webcam, nod at it, then show an open palm.

> The visitor answers with their hands. MediaPipe reads them in the browser. Only the label
> is posted — no video frame leaves the page.

**Do:** show the transcript filling in.

> And this is the part no shipping doorbell does: a written record of a conversation the
> resident never heard. Both sides of it.

## 1:15 – 1:50 · Culture is not a translation layer

**Do:** open **Language & culture**. Under *who arrives at your door*, pick **Ελληνικά**.
The withheld list grows.

> A thumbs-up is obscene in parts of West Africa. The ring gesture is obscene in Brazil. A
> raised open palm is a grave insult in Greece — so when a Greek visitor is expected, the door
> stops offering it and offers a raised index instead.
>
> Fourteen locales, and every blocked gesture carries its evidence grade. The claims we could
> not substantiate are marked withdrawn rather than quietly dropped.

**Do:** switch *what you read* to **العربية · الخليج**. Let the flip animation play.

> The interface is a full right-to-left pass. The transcript re-renders — it is stored as
> keys, not sentences, so a conversation recorded this morning reads in whichever language
> you switch to this evening.

**Do:** switch to **日本語**, and let the page colour and typeface change.

> Colour, typeface and line height change with the locale too. Japanese sets a cooler paper
> and Noto Sans JP; Hindi takes a 1.8 line height. A person's name is never red in any
> locale, because in Korean that is a funerary marking.

## 1:50 – 2:12 · Alexa+

**Do:** cut to a terminal, `curl` the MCP endpoint, or show an MCP client listing the tools.

> Alexa+ reaches WAVE over the Model Context Protocol — spec 2025-11-25, Streamable HTTP.
> Five tools. *Who came today. Describe that visit. What do you remember about this person.*
>
> It is read-mostly on purpose. An assistant may ask what happened at the door. It cannot
> open anything.

## 2:12 – 2:35 · What happens when it breaks

**On screen:** `/api/spend`, then the provider line in the captions panel.

> AWS suspended the account mid-build, because Syrian nationality is not offered in its
> identity verification — while this hackathon is open to every country not comprehensively
> sanctioned, which Syria has not been since July 2025. That is written up as FL-010.
>
> So no vendor is load-bearing. Bedrock and Transcribe are preferred and still first in the
> resolution order; every call goes through one file, and a fallback is configuration rather
> than a rewrite. Every model call is counted against a ceiling before it is sent. With no
> providers at all, the door still answers.

## 2:35 – 2:45 · Close

**On screen:** the dashboard, Arabic, with the transcript visible.

> Every doorbell is built for someone who can hear. This one is built for everyone else.
>
> WAVE. Your door, answered without a word.

---

## Shots that must be in it

A judge should be able to tick these off without pausing:

1. A real doorstep event arriving, with the ring pulse
2. Live captions with the backend named on screen
3. A gesture read from the webcam, with its confidence
4. The withheld-gesture list changing when a visitor locale is picked
5. The full RTL switch, with the transcript re-rendering
6. The MCP tool list
7. `/api/spend`

## What to leave out

The friction log, the research documents and the open-source package are stronger read than
narrated. Put them in the written submission and spend the seconds on the product.
