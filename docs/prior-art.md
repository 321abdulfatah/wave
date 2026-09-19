# Prior art and competitive landscape — WAVE

Research date: 2026-09-19 · 34 days to the deadline
Scope: commercial products, open source, academic work, past hackathon winners, and the
live competitor field inside *Build, Ship, Shape: Amazon Developer Hackathon*.

---

## Verdict

**Partly taken — and considerably more crowded than PLAN.md assumes.** Two teams are already
building, in public, a Ring doorbell app for Deaf and hard-of-hearing residents for *this
hackathon*: [RingVoice](https://github.com/RingVoice-Labs/ringvoice-frontend) (created 3 Sep,
"real-time captioning for deaf and hard-of-hearing users", AAA contrast, ARIA live regions,
reduced motion — the same accessibility posture our README claims) and
[RingRelay](https://github.com/Beeeeen/ringrelay) (created 18 Sep, "a Ring doorbell
conversation, made to work without hearing"). Neither uses gestures. The Ring track's
accessibility category is busy in general — at least four public repos target blind and
low-vision users, and [still-here](https://github.com/kevin9327/still-here) already uses the
exact "chime out, camera in" loop we describe as our mechanic, with motion instead of gesture.

What is **genuinely open**: nobody, anywhere — product, patent-in-practice, or research — has
shipped a gesture vocabulary that changes by locale. That is a real first. And there are
**zero arXiv papers matching "gesture" AND "doorbell"**, so gesture-at-the-door is unexplored
academically.

What is **dangerous**: our central technical premise is contested. RingRelay's README states
the Ring WHEP answer carries an Opus audio track (`recvonly` video **+ audio**), which if true
means a competitor can simply caption the visitor's speech and our whole "no inbound audio,
therefore gestures" chain reads as a workaround for a problem that does not exist. Separately,
the chime almost certainly **cannot speak sentences** — the capabilities payload exposes
`audio_ref` and *audio slots*, and another entrant independently concluded it can only play "a
category-specific tone". Read section 6 and "Where we are weak" before anything else.

---

## 1. Existing products for Deaf / HoH doorbell and door access

### 1a. Dedicated assistive alerting hardware

This category is mature, cheap, and solves *notification* only. None of it tells the resident
**who** is there or lets them **respond**.

| Product | What it does | What it does not do | URL |
|---|---|---|---|
| Bellman & Symfon Visit system | Flash + bed shaker + loud tone on doorbell press; whole-house transmitter network | No camera, no identity, no reply channel | https://us.bellman.com/blogs/news/doorbell-for-deaf |
| CallToU hearing-impaired doorbell | Strobe (2 intensities), 0–100 dB, 55 melodies, 1000 ft range, IPX5 | Same — a smarter bell, not a conversation | https://www.vitalitymedical.com/hearing-impaired-amplified-doorbells.html |
| Expandable Flashing Doorbell (1-800-Doorbell) | Strobe chime, expandable receivers | Same | https://www.1800doorbell.com/door-chimes/flashing-doorbell-expandable-deaf-doorbell-with-strobe/ |
| Hearview 7-colour visual doorbell | Large multi-colour LED visual alert | Same | https://www.hearview.ai/products/wireless-flashing-light-doorbell-visual-audio-alert-the-deaf-hard-of-hearing |
| Sarabec / Diglo assistive doorbell ranges | UK/US retail categories of the same class of device | Same | https://www.sarabec.com/category/doorbells · https://www.diglo.com/shop-by-alert-trigger/doorbell-and-door-knock;d=3;c=32;s=323 |

*Coverage gap, stated honestly:* Arlo, Eufy and Aqara vendor pages returned 403/404 to
automated fetching, so their "AI responder" / "virtual guard" features are **not verified here**.
Arlo's Virtual Security Guard is, by reputation, a *human* monitoring agent speaking to the
visitor rather than an AI, but that should be confirmed by hand before it is relied on in the
submission. Treat this row of the competitive set as open.

The Deaf community's own review sites are explicit that the smart-doorbell category fails them
on alerting: "without some flashing light for an alert, a Ring Video Doorbell simply doesn't
provide the alerting notice deaf people need"
([Deaf Vibes](https://deafvibes.com/living-with-hearing-loss/ring-doorbell-for-deaf/)).
There is a long-standing open feature request on Ring's own forum for a flashing/strobe alert
([Ring Community](https://community.ring.com/en_GB/conversations/feature-request-board/flashing-or-strobing-light-system-for-hearing-impaired/6580156a51f6e6fe788e3527)).

### 1b. Smart doorbell "answer for me" features — the real prior art

This is the category WAVE actually competes with, and it is closer to us than the hardware above.

| Feature | Vendor | What it does | The Deaf-relevant gap | URL |
|---|---|---|---|---|
| **Quick Replies / Smart Responses** | Ring | Plays one of **six fixed pre-recorded messages** through the doorbell speaker 0–20 s after a press, then records the visitor's reply (up to 60 s) | The reply is **stored as audio, never transcribed**. A Deaf resident receives a recording they cannot hear. Custom messages are not possible. | https://ring.com/support/articles/ztd70/Setting-up-Quick-Replies-in-the-Ring-App · https://www.pocket-lint.com/smart-home/news/ring/157856-what-is-ring-quick-replies-doorbell-answer-response/ |
| **Alexa Greetings** | Ring + Alexa | Alexa greets the visitor autonomously and takes a message on a Doorbell Pro | Same gap — a message, not a transcript | https://en.wikipedia.org/wiki/Ring_(company) · https://www.techradar.com/news/alexa-can-now-answer-your-ring-doorbell-and-take-a-message-if-you-cant |
| **Quick Responses** | Google Nest | Pre-recorded phrases spoken to the visitor; cannot be customised | One-directional; no recording or transcription of the visitor's reply documented | https://support.google.com/googlehome/answer/9225663 |
| **Familiar Faces** (Sep 2025) | Ring | AI recognises known people to suppress notifications | Identity, not conversation | https://en.wikipedia.org/wiki/Ring_(company) |
| **Search Party** (Oct 2025) | Ring | AI object recognition across footage for lost pets | Unrelated, but shows Ring shipping AI over camera pixels | https://en.wikipedia.org/wiki/Ring_(company) |

**The finding that matters:** the six Ring Quick Reply strings are exactly the shape of a
doorstep script — *"Please leave the package outside. If you'd like to leave a message, you can
do it now."* Ring already speaks to the visitor. What Ring does **not** do is give the resident
a readable record of what came back. That is the hole WAVE claims, and it is real — but note
that **captioning that audio is the obvious fix**, and two hackathon competitors are doing
exactly that (section 6).

### 1c. Open source around Ring

Two long-standing community projects predate the Partner API and reverse-engineer Ring's
consumer endpoints: [dgreif/ring](https://github.com/dgreif/ring) (`ring-client-api`, the
TypeScript client most Home Assistant work is built on) and
[tsightler/ring-mqtt](https://github.com/tsightler/ring-mqtt) (MQTT bridge with an RTSP gateway
for doorbells, cameras, alarms and lighting). Neither documents two-way audio, TTS to the
doorbell speaker, or chime sound playback in its README — the same wall the Partner API puts up.
Other community integrations of the same shape exist for competing hardware, e.g.
[iobroker-community-adapters/ioBroker.ring](https://github.com/iobroker-community-adapters/ioBroker.ring)
and [rroller/dahua](https://github.com/rroller/dahua) (562 stars, Home Assistant). None of them
address Deaf or HoH users specifically.

### 1d. Patents — the "AI doorman" is well covered

The autonomous-doorbell-conversation idea is heavily patented, mostly by SkyBell and Google.
This does not block a hackathon entry, but it undercuts any claim of conceptual novelty.

| Patent | Claim of interest | URL |
|---|---|---|
| US 12,300,081 — Intelligent doorbell for a security system | "conversational AI to provide an automated doorman service", with human operator escalation | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12300081 |
| US 11,909,549 / 11,362,853 / 11,102,027 / 9,060,104 — Doorbell communication systems and methods (SkyBell) | "Autonomous Answer Mode"; pre-recorded message asks the visitor to identify themselves and state their reason | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11909549 |
| US 9,953,514 — Visitor feedback to visitor interaction with a doorbell at a smart-home (Google) | Visitor-facing interaction feedback at the door | https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9953514 |
| **US 8,656,279 — Global settings for the enablement of culture-based gestures (SAP)** | **Directly claims our differentiator**: a device assigns a cultural setting and swaps in pre-trained per-culture gesture models. Worked example: thumbs-up "may mean 'OK' in U.S., 'money' in Japan, and 'zero' in Indonesia." Granted 2014. **No evidence it was ever built.** | https://patents.google.com/patent/US8656279B2/en |
| WO 2015/139969 A3 — User gesture recognition | Treats "cultural context" as a recognition context | https://patents.google.com/patent/WO2015139969A3 |

---

## 2. Gesture recognition at the door or in the smart home

**There is no product that reads hand gestures from a doorbell or security camera.** The
nearest neighbours are gesture-controlled smart homes (resident, enrolled, indoors) and one
research-grade distress-gesture detector.

| Project | What it does | Relation to WAVE | URL |
|---|---|---|---|
| Gestalyze | Real-time hand gesture + sign language recognition controlling smart-home devices via MQTT / Home Assistant; MediaPipe + FastAPI + React | Closest open-source analogue. **Resident-facing, enrolled user, indoors.** No door, no stranger, no locale. | https://github.com/rbcorrales/gestalyze |
| kinivi/hand-gesture-recognition-mediapipe | The canonical MediaPipe landmark→MLP gesture sample; most hobby projects fork it | Our classifier is a variant of this genre | https://github.com/kinivi/hand-gesture-recognition-mediapipe |
| Control-things-with-hand-gesture | Gestures control lights, speakers, fans | Same genre | https://github.com/PB3002/Control-things-with-hand-gesture |
| **SOS Gesture Recognition** (Devpost) | Detects the "Signal for Help" sequence (open palm, thumb tucked → fist) from a video stream; MediaPipe + Gemini; **envisions CCTV integration but has not built it** | **The single closest concept**: a stranger performing a gesture to a security camera. Prototype only. | https://devpost.com/software/sos-gesture-recognition |
| Hand Gesture Home Assistant (Devpost, HackCU V) | Leap Motion gestures → home automation | Sensor-based, indoors | https://devpost.com/software/hand-gesture-home-assistant |

**Academic check:** an arXiv API query for `all:"gesture" AND all:"doorbell"` returns
**zero results** (`<opensearch:totalResults>0</opensearch:totalResults>`). Gesture interaction
at the front door is genuinely unstudied.

**But the adjacent literature that does exist is the one that should worry us** — public-display
mid-air gesture interaction, which is the same problem (a stranger, no training, one chance):

| Work | Why it matters | DOI |
|---|---|---|
| Walter, Bailly & Müller, *StrikeAPose: Revealing mid-air gestures on public displays*, CHI 2013 | The canonical "how does a passerby learn a gesture exists" paper | https://doi.org/10.1145/2470654.2470774 |
| Walter et al., *Cuenesics*, MobileHCI 2014 | Mid-air gesture cues for novices | https://doi.org/10.1145/2628363.2628368 |
| Khurana & Chilana, *Novice users' mental models of gesture discoverability*, UbiComp 2024 | Most recent work on onboarding a zero-training user | https://doi.org/10.1145/3675094.3678370 |
| Cabreira & Hwang, *How do novice older users perform mid-air gesture interaction for the first time?*, NordiCHI 2016 | First-time performance, older adults | https://doi.org/10.1145/2971485.2996757 |

The consistent finding across that line: **for a cold visitor, discoverability is the
bottleneck, not recognition accuracy.** Getting `Open_Palm` to 99% solves the wrong problem if
the courier does not know a gesture interface exists.

---

## 3. Prior hackathon projects with overlapping ideas

This hackathon is **the first time Ring has been open to outside developers**
([Devpost](https://info.devpost.com/customer-stories/amazon-hackathons-on-devpost)), so there
is no prior Ring hackathon corpus. The overlap is in the sign-language genre, which is one of
the most saturated categories on Devpost.

| Project | What it did | Outcome | URL |
|---|---|---|---|
| Sign Sync | Two-way ASL↔English: webcam ASL→text, speech→sign visuals. MobileNetV2, **97% on ASL alphabet** | **Won The Wolfram Award, PennApps XXIV** | https://devpost.com/software/tbd-j9zy3h |
| Sign Language Interpreter using Deep Learning | Live-video ASL interpreter framed as a 24/7 translator for Deaf users | **Won UNT Hackathon 2019** (accessibility theme) | https://github.com/harshbg/Sign-Language-Interpreter-using-Deep-Learning |
| SignLingo | Random Forest on MediaPipe landmarks, **99.6% claimed** | No prize noted | https://devpost.com/software/signlingo-01orz9 |
| LiveSigns | Random Forest on MediaPipe, **99.1% claimed** | No prize noted | https://devpost.com/software/livesigns |
| SignSensei | Custom FC network on MediaPipe landmarks, **97% test accuracy** | No prize noted | https://devpost.com/software/signsensei |
| Multi Sign Language: Speech and Text Converter | ASL/BSL/SSL/ISL → text and speech, **95% claimed** | No prize noted | https://devpost.com/software/multi-sign-language-speech-and-text-converter |
| Slingo | Sign language detection for Deaf/mute children (nwHacks 2023) | No prize noted | https://devpost.com/software/slingo |
| SignSpeak | ASL recognition | No prize noted | https://devpost.com/software/signspeak-et23hj |
| Sign Vision / SignTech / SANCHAR / Breaking-Bad | Variations on the same ASL-recognition theme | No prizes noted | https://devpost.com/software/sign-vision · https://devpost.com/software/signtech-sign-language-translator · https://devpost.com/software/sanchar-ti1u7m · https://devpost.com/software/sign-language |
| Gesture Guard | Hand-symbol sequence as a passcode/login | No prize noted | https://devpost.com/software/gesture-guard |
| "Alexa for mute people" (Hack the Accessibility) | ASL via Leap Motion → string → Alexa, for banking | Accessibility hackathon entry | https://devpost.com/software/hack-the-accessibility-pgfc9a |

**Read this table as a warning.** "MediaPipe + classifier + 97–99% accuracy + Deaf users" is
one of the most common submissions on Devpost, and the vast majority of those projects did not
win. A judge who has seen five of these will discount a sixth on sight. Our gesture classifier
is not a differentiator; it is table stakes, and arguably a liability if we foreground it.

Non-hackathon academic doorbell work also exists and is unimpressive, which is useful context:
IoT doorbells for Deaf users that trigger an LED and push a camera image to a phone
([KSCST project report](https://www.kscst.org.in/spp/47_series/47s_spp/Exhibition%20Projects/319_47S_BE_2086.pdf),
[IJIRT paper](https://ijirt.org/publishedpaper/IJIRT187620_PAPER.pdf)).

---

## 4. What Amazon/AWS hackathon winners actually have in common

Twelve winners studied across four recent Amazon/AWS Devpost hackathons. This is the most
useful section in the document.

### The hackathon's own criteria

All four are **equally weighted** ([rules](https://amazonappdev2026.devpost.com/rules)):

1. **Tech Implementation** — "How well is the project built, and how effectively does it use the required tech?"
2. **Design** — "Does the project deliver a complete, coherent product experience?"
3. **Potential Impact** — "Does the project make a credible, specific case for solving customer needs?"
4. **Quality of the Idea** — "Is this a creative, imaginative use of the required tools?"

Friction logs earn **up to a 10% bonus**, assessed by an internal Amazon review team that
passes a recommendation to the Stage 2 panel. Registered participants: **9,625**
([Devpost](https://amazonappdev2026.devpost.com/)).

### The winners

| Project | Hackathon / place | What it is | URL |
|---|---|---|---|
| EcoLafaek | AWS AI Agent Global — **1st** | Citizen waste-reporting app + autonomous agent mapping pollution hotspots in Timor-Leste | https://devpost.com/software/ecolafaek |
| AegisAgent | AWS AI Agent Global — **2nd** | Multi-agent insurance claim review; built end-to-end with AI code generation | https://aws-agent-hackathon.devpost.com/updates/38140-congratulations-to-the-winners-of-the-aws-ai-agent-global-hackathon |
| Province | AWS AI Agent Global — **3rd** | Conversational tax filing; **"100% accuracy on Form 1040"** | *(same update post)* |
| Multi-Agent Triage / Oratio / Compliance Guardian / Drishti AI Navigator / AgentShell | AWS AI Agent Global — **Best of category** (AgentCore, Bedrock, Q, Nova Act, Strands) | One category prize per named AWS technology | *(same update post)* |
| ForestShield | AWS Lambda — **1st** | Serverless deforestation detection; Sentinel-2 + SageMaker K-means | https://devpost.com/software/forestshield-aws-deforestation-detection |
| OutScan | AWS Lambda — honourable mention | Genomic variant early-warning; **"would have detected Omicron 42 days earlier"** | https://devpost.com/software/outscan |
| Smart Meeting Assistant | AWS Lambda — winner | Audio → automated Jira tasks | https://devpost.com/software/smart-meeting-assistant |
| Drone SoundAware | AWS Lambda — winner | Drone flight-route noise planning | https://devpost.com/software/drone-soundaware |
| LLMIX | AWS Breaking Barriers — **1st** | Offline LLM-in-a-box on a Raspberry Pi 5 for the 2.6 bn people without reliable internet | https://devpost.com/software/llmix |
| Buzzle | AWS Breaking Barriers — **2nd** | Screenless RFID + voice learning toy; ESP32 hardware **plus a browser demo so judges can try it without the device** | https://devpost.com/software/buzzle |
| Infinite Memory | AWS Breaking Barriers — **3rd** | Dementia cognitive companion; Bedrock + Kendra + Neptune + DynamoDB + S3 | https://devpost.com/software/infinite-memory-plnev8 |
| FBF / Blitzer / Dual Knights / DuckStar | AWS Game Builder — winners | Games; included one using **voice + hand detection** (Christmas Cat Game) | https://awsdevchallenge.devpost.com/project-gallery?prize_filter=prizes |

### The pattern, concretely

1. **Winners bring a number, and the number is falsifiable.** "42 days earlier than official
   designation." "100% accuracy on Form 1040." "55.82% average on the Open Medical-LLM
   leaderboard, topping the <3B board." "1M+ pixels/month under $10." Not one winner said
   "works well."
2. **Winners have real users or real data before judging.** EcoLafaek listed *50+ waste
   reports, 3+ active mobile users, 25+ agent interactions* at submission. OutScan ran against
   GISAID. LLMIX published a fine-tuned model to a public leaderboard. Simulated demos win less
   often than deployed ones.
3. **Deep, multi-service AWS usage with a stated reason per service.** EcoLafaek: Bedrock
   Nova-Pro, AgentCore, Code Interpreter, Browser Tool, Titan Embed, S3, Lightsail, CodeBuild —
   eight. ForestShield: Lambda + SnapStart, Step Functions, SageMaker, SNS, WebSocket API, S3,
   DynamoDB, ElastiCache, CloudFormation — nine. Infinite Memory justified its sprawl
   explicitly: *"using a purpose-built database for each data type… leads to a much more
   powerful and efficient system."* One service used shallowly loses to five used with intent.
4. **The problem statement is specific, local and quantified.** "Dili produces over 300 tons of
   waste daily; more than 100 tons go uncollected." "2.6 billion people still live without
   reliable internet." Not "accessibility matters."
5. **Long, structured writeups.** 1,500–4,500 words in the standard Devpost order (Inspiration
   / What it does / How we built it / Challenges / Accomplishments / What we learned /
   What's next). This is essentially universal among winners.
6. **Architecture diagram plus five or more screenshots.** Near-universal. ForestShield shipped
   portal, results, Step Functions flow, PDF report, architecture. EcoLafaek shipped
   architecture, mobile app, pipeline, semantic search, dashboard, admin panel, agent sandbox.
7. **Hardware projects win — if judges can try them without the hardware.** Buzzle took 2nd
   with an ESP32 device *and* "a functional browser-based virtual demo." This directly
   validates WAVE's mock mode as a scoring asset, not an apology.
8. **Category prizes are named after technologies.** "Best AgentCore Implementation", "Best
   Strands SDK Implementation". Depth in one named Amazon technology is a separate, winnable
   lane.

---

## 5. Sign-language and gesture recognition generally — and what the accuracy numbers are worth

### MediaPipe Gesture Recognizer — read this before relying on it

Official docs: https://developers.google.com/edge/mediapipe/solutions/vision/gesture_recognizer
Model card: https://storage.googleapis.com/mediapipe-assets/gesture_recognizer/model_card_hand_gesture_classification_with_faireness_2022.pdf

Canned set is **8 classes**: `Closed_Fist`, `Open_Palm`, `Pointing_Up`, `Thumb_Down`,
`Thumb_Up`, `Victory`, `ILoveYou`, `None`.

Google publishes **SS F1** (harmonic mean of sensitivity and specificity), not top-1 accuracy:
95.5% weighted average across Monk Skin Tone (range 94.3–97.8%, ~2,000 images) and 93.9% across
perceived gender expression (~8,000 images). Latency 16.76 ms CPU on a Pixel 6.

The documented out-of-scope list is the problem:

- *"The model has not been tested in 'in-the-wild' smartphone camera conditions, including low-end devices, low light, motion blur etc."*
- Explicitly out of scope: **gestures involving motion (e.g. waving goodbye)**, **gestures involving multiple hands**, **translating sign language**.
- Hands model out of scope: hands **with gloves**, occlusions, holding objects, jewellery/henna.
- `num_hands` defaults to **1**; all confidence thresholds default to 0.5.
- The classifier never sees pixels — it consumes 21 landmarks plus handedness, so upstream
  failures (distance, blur, dark) surface as confidently wrong landmarks.

**A doorbell camera at night, 1–3 m away, on a courier holding a parcel and possibly wearing
gloves, sits outside every stated operating assumption of this model.** And `wave` — one of our
five gestures — is explicitly unsupported.

### Named projects and what they actually claim

| Project | Claim | Honest read | URL |
|---|---|---|---|
| PopSign ASL v1.0 (Georgia Tech + Google) | **99.6%**, 7 ms, 2.5 MB | Real dataset (210K+ examples, 47 Deaf signers) but the game keeps only **5 active classes at a time** out of 250. It is a 5-way problem. | https://proceedings.neurips.cc/paper_files/paper/2023/hash/00dada608b8db212ea7d9d92b24c68de-Abstract-Datasets_and_Benchmarks.html |
| Google ASL Fingerspelling (Kaggle, $200K) | 3M+ characters, 100+ Deaf signers; 1st place Squeezeformer + transformer decoder | Metric is normalised edit distance, not accuracy. Fingerspelling peaks **>80 wpm**. | https://www.kaggle.com/competitions/asl-fingerspelling · https://github.com/ChristofHenkel/kaggle-asl-fingerspelling-1st-place-solution |
| Google SL2T (Pixel 11, Aug 2026) | 50+ sign languages, 100K+ hours, landmarks-only | **No accuracy published.** Single-source report; treat as unconfirmed. | https://liamodell.com/2026/08/13/google-deepmind-artificial-intelligence-ai-sign-language-to-text-sl2t-american-sign-language-asl-live-transcribe-gboard/ |
| SignGemma (DeepMind) | "most capable sign language understanding model ever" | Marketing quote; **no benchmark ever published**. | https://deepmind.google/models/gemma/ |
| NVIDIA Signs | 100 signs → target 1,000 | **No accuracy figure at all.** Admits it ignores non-manual signals (facial expression, head movement) — i.e. ASL grammar. Learning tool, not translator. | https://signs-ai.com/ · https://blogs.nvidia.com/blog/ai-sign-language |
| Sign-Speak | SignCaption / SignLive / API | No accuracy, vocabulary size or latency published. ⚠️ The "92%" often attributed to it belongs to an unrelated **glove-based** paper. | https://www.sign-speak.com/ · https://arxiv.org/html/2407.12020 |
| Hand Talk | 38,000+ validated words | Wrong direction — text→avatar, not recognition. Falls back to fingerspelling for missing words. | https://www.handtalk.me/en/ |
| Ava | "99% accuracy" | **Not sign language** — speech-to-text captioning with human scribes. | https://www.ava.me/ |

### Non-English, and the lab-vs-wild gap

| Language | Work | Numbers | Read | URL |
|---|---|---|---|---|
| Turkish (TİD) | AUTSL — Sincan & Keles | **95.95% signer-dependent → 62.02% signer-independent** | The cleanest published demonstration of the gap: 34 points lost purely by holding out signers. | https://arxiv.org/abs/2008.00932 |
| Arabic | ArASL2018 | 32 static letters, cropped greyscale; papers routinely report 97–99% | Exactly the trap. Static hand shapes on uniform backgrounds. | https://doi.org/10.1016/j.dib.2019.103777 |
| Arabic | CLIP-ArASL (Alasmari 2026) | **99.25% supervised → 55.2% zero-shot on the same images** | Anything unseen collapses. | https://doi.org/10.3390/app16052573 |
| Arabic | KArSL | 502 signs but only **3 signers** | Large vocabulary, no signer diversity. | https://doi.org/10.1145/3423420 |
| Turkish | BosphorusSign22k (Akdag & Baykan 2024) | 94.52% / 98.53% signer-independent | Studio corpora, clean backgrounds. | https://doi.org/10.3390/electronics13071188 |
| BSL | BOBSL (BBC-Oxford) | ~1,400 h, 1,940 episodes, 37 signers, 77K vocab | Largest BSL corpus; **academic/non-commercial licence only**, so unusable in a product. | https://arxiv.org/abs/2111.03635 |

**The one-line version for our own writeup:** any ASL/ArSL result above ~95% on a static
alphabet dataset is image classification on cropped hands, not evidence about a front door.
If we quote a number, quote a signer-independent one, and say so.

### Culturally adaptive gesture interfaces — the state of the art

| Work | Finding | URL |
|---|---|---|
| Cauchard et al., *Cultural Influences on Human-Drone Interaction*, CHI 2017 | Gesture elicitation run in the USA then replicated in China; Chinese participants produced culturally specific gestures with no US counterpart (e.g. a T-shape "stop"). **The strongest evidence that elicited gesture sets diverge by country.** | https://doi.org/10.1145/3025453.3025755 |
| Urakami 2014, *Cross-cultural comparison of hand gestures of Japanese and Germans* | Peer-reviewed tabletop gesture divergence | https://doi.org/10.1016/j.chb.2014.08.010 |
| *Universal Hand Gesture Interaction Vocabulary for Cross-Cultural Users*, HCII 2024 | Frames the goal as finding a **universal** vocabulary — the field's instinct is to converge, not localise | https://doi.org/10.1007/978-3-031-61932-8_8 |
| *Iteratively Designing Gesture Vocabularies*, ACM TOCHI 2022 | Recommends "culturally- and socially-**resilient**" vocabularies — resilient, not localised | https://doi.org/10.1145/3503537 |
| Kita, *Cross-cultural variation of speech-accompanying gesture* | The correct citation for the general claim that gesture is conventional, not universal | https://doi.org/10.4324/9781003059783-1 |
| Yelle 2006, *Gesture* 6(2) | Historical "universal gesture language" systems all relied on conventional codes while claiming natural meaning | https://doi.org/10.1075/gest.6.2.07yel |

On the specific gesture claims, note that PLAN.md has already been corrected against
Matsumoto & Hwang (2013) and has withdrawn two unsupported assertions — that is the right
instinct and it should be preserved. Independent verification agrees the popular claims are
weaker than their ubiquity suggests: Wikipedia's *Thumb signal* article documents offence in
**Iran only**, sourced to a single 2007 *Guardian* travel column; the West Africa, Iraq and
Latin America variants trace largely to Roger Axtell's *Gestures* (1991) and Desmond Morris,
popular books recycled without primary fieldwork
(https://en.wikipedia.org/wiki/Thumb_signal). The moútza article carries explicit
`[better source needed]` tags on its origin claims (https://en.wikipedia.org/wiki/Moutza).
The **defensible** framing is Kita's: emblematic gestures are conventional and vary by culture,
therefore any fixed vocabulary carries locale risk. That is a design argument and it survives
regardless of whether the Iran anecdote holds.

One genuinely strong, quotable artefact: in *South West Terminal Ltd v Achter Land & Cattle
Ltd* (Saskatchewan KB, 2023) a farmer's thumbs-up emoji was held to be binding contractual
acceptance, for **CAD $82,000**. Gestures carry legal weight.

---

## 6. Who is building for THIS hackathon right now

The Devpost gallery is not published, but GitHub is. A repository search for
`"Build, Ship, Shape" in:readme` returns **122 repositories**; narrowing to Ring returns **25**.
Registered participants: **9,625**.

### Direct competitors — Deaf / hard-of-hearing on Ring

| Repo | Created | What it does | How close to WAVE |
|---|---|---|---|
| **[RingVoice](https://github.com/RingVoice-Labs/ringvoice-frontend)** (RingVoice-Labs, 2-person team) | 3 Sep | "Real-time captioning for Ring doorbell cameras designed specifically for deaf and hard-of-hearing users." Live captions of visitor speech, **quick-reply options**, visit history with full transcripts, **AAA contrast, ARIA live regions, screen-reader support, reduced-motion, installable PWA**. Cites "11 million deaf and hard-of-hearing Americans." | **Extremely close.** Same audience, same platform, same track, and the same accessibility differentiators our README lists. Differs only in input modality (they caption speech; we read gestures) and output (they do not touch the chime). Last push 11 Sep. |
| **[RingRelay](https://github.com/Beeeeen/ringrelay)** (TypeScript, MIT, 23 commits) | 18 Sep | "A Ring doorbell conversation, made to work without hearing — live captions in, spoken replies out, and the non-speech sounds a hearing person gets from their door." Whisper via `@huggingface/transformers` in-browser, YAMNet non-speech sound classification via `@mediapipe/tasks-audio`, on-device TTS, WHEP. | **Extremely close, and technically sharper than us in one respect** — it classifies non-speech sounds (truck, dog, knocking), which is a Deaf-user insight we do not have. Its replies play through the *resident's* device, not the door. |

### The rest of the Ring track — the accessibility lane is busy

| Repo | What it does |
|---|---|
| [AtchayamG/doorstep-ring](https://github.com/AtchayamG/doorstep-ring) | "Objective spoken descriptions of Ring doorbell events for blind and low-vision users", Bedrock Nova |
| [chinesepowered/hack-amazon4](https://github.com/chinesepowered/hack-amazon4) ("Describe My Door") | Same audience; **uses chime audio playback via pre-configured audio slots** plus phone TTS; Strands Agents SDK; AWS Builder mini |
| [chinesepowered/hack-amazon5](https://github.com/chinesepowered/hack-amazon5) | Dementia caregiving, Strands agent — same author entering twice |
| [usv240/nightlight](https://github.com/usv240/nightlight) | "The Ring doorbell works the night shift for families living with dementia" — plus [everyword](https://github.com/usv240/everyword) (word-by-word subtitles) and [bellwether](https://github.com/usv240/bellwether); this author has at least three entries |
| **[kevin9327/still-here](https://github.com/kevin9327/still-here)** | Caretaking: **"knocks with the chime before it alarms"**, and "the person at home answers by walking past a camera. No phone, no app, no button." **This is our chime-out / camera-in loop, already built, with 22 unit tests.** |
| [airbate/porchlight](https://github.com/airbate/porchlight) | Senior monitoring; Bedrock Nova Lite classification of Ring footage; FastAPI + React PWA; 12 tests |
| [AmirmLotfy/doorsignal](https://github.com/AmirmLotfy/doorsignal) | Ring events → guest/delivery/service workflows; Next.js 16, Lambda, DynamoDB, EventBridge, Nova 2 Lite, Cognito, SES, CDK; judge-mode isolation |
| [banksythequantLab/front-desk](https://github.com/banksythequantLab/front-desk) | Doorstep agent for a law office, local vision model |
| [KR-007J/ringguard-ai](https://github.com/KR-007J/ringguard-ai) | "Autonomous AI Caretaking & Access Co-Pilot" |
| [datAgent77/swarmops-SENTINEL-AWS](https://github.com/datAgent77/swarmops-SENTINEL-AWS) | "AI Security Officer for Ring doorbell" |
| [NovaCorpAI/agentpos-doorstep](https://github.com/NovaCorpAI/agentpos-doorstep) | Package events → signed delivery receipts |
| [SwaggyXO/ring-vision-mcp](https://github.com/SwaggyXO/ring-vision-mcp) | MCP server over the Ring Partner API — devices, status, history, WHEP |
| [Rafa-Innerchispa/inneros-ambient-guardian-amazon-2026](https://github.com/Rafa-Innerchispa/inneros-ambient-guardian-amazon-2026) | Alexa+ MCP orchestration **with Ring** — the same two-track play we are making |
| [jkarns87/homeledger](https://github.com/jkarns87/homeledger) | Household record as MCP server on Bedrock AgentCore, ingesting Ring events |
| [iancuileana83-lab/ring-med-watch](https://github.com/iancuileana83-lab/ring-med-watch), [dud8/latchkey](https://github.com/dud8/latchkey) | Medication / absence caretaking |
| [Justinsato/ring-video-wall](https://github.com/Justinsato/ring-video-wall) | Multi-camera WHEP video wall, forked from the official sample |

Tooling others have published that we could adopt or that competes with our friction-log
narrative: [josepha-mayo/ring-sandbox](https://github.com/josepha-mayo/ring-sandbox) (typed
Python client + **offline emulator** for `api.amazonvision.com`),
[jagritvats/ring-partner-sim](https://github.com/jagritvats/ring-partner-sim),
[bayraktartahsin/ring-webhook-kit](https://github.com/bayraktartahsin/ring-webhook-kit),
[api-evangelist/ring](https://github.com/api-evangelist/ring). Note that **three separate teams
independently built a Ring Partner API simulator** — our FL-006 complaint about the Playground
is widely shared, which is good for the friction-log bonus but means it is not a unique insight.

**Nobody in the visible cohort is using gestures or MediaPipe.** A `"Build, Ship, Shape"
in:readme` search crossed with gesture/deaf/sign-language/mediapipe returns no gesture-based
Ring entry. That part of our idea is, so far, ours alone.

---

## Where we are genuinely different

Blunt, with the things that are *not* different named first.

**Already exists — do not claim these:**

1. **"A Ring app for Deaf and hard-of-hearing residents."** Taken twice over, in this
   hackathon, publicly, before us: RingVoice (3 Sep) and RingRelay (18 Sep).
2. **"Accessibility-first interface: AAA contrast, ARIA live regions, reduced motion, no sound
   required."** RingVoice's README lists the same four. It is not a differentiator; it is the
   entry fee for this audience.
3. **"The door speaks to the visitor while the resident stays out of it."** Ring Quick Replies
   and Alexa Greetings have shipped this for years, and SkyBell's "Autonomous Answer Mode"
   patents cover the concept.
4. **"Chime out, camera in."** `still-here` built the same loop, with motion as the answer.
5. **"MediaPipe gesture classifier with high accuracy."** One of the most common project shapes
   on Devpost; dozens of entries claim 95–99.6%.
6. **"A Ring Partner API simulator / offline mock."** Three other teams shipped one.
7. **"Culture-aware gesture vocabularies" as an *idea*.** SAP patented it in 2010
   (US 8,656,279), with thumbs-up as the worked example.

**Genuinely different — these are ours:**

1. **Per-locale gesture vocabularies actually implemented in a shipping product.** No product
   anywhere exposes a locale parameter for gestures. MediaPipe's entire config surface is
   `num_hands` plus three thresholds. SAP's patent was granted in 2014 and apparently never
   built. The HCI literature is explicitly trying to find a *universal* vocabulary, not a
   localised one — nobody is even proposing what we are doing.
2. **Gesture interaction at the front door.** Zero arXiv hits for gesture + doorbell. No
   product. The nearest thing is a Devpost prototype that only *envisions* CCTV integration.
3. **A written transcript of a doorstep conversation the resident never heard, where the
   visitor's side came from the camera rather than a microphone.** Ring records the visitor's
   reply as audio and never transcribes it; Nest does not capture a reply at all.
4. **A deterministic policy engine as a stated design position** — "a door agent that
   improvises is a door agent that eventually says something nobody authorised." None of the
   competitor repos makes an argument about agent restraint at the door. This is a Design and
   Quality-of-Idea point and it is well made.
5. **Arabic-first RTL alongside English.** Nothing in the visible cohort is doing non-English
   locale work at all.

---

## Where we are weak

1. **The premise may be factually wrong, and a competitor's repo says so.** PLAN.md and
   FL-002 assert live streams are "video only — no audio". RingRelay's README describes an
   "SDP offer with `recvonly` video + audio, Opus track pulled from the answer" — i.e. the WHEP
   answer *does* carry audio. Ring's public docs do not resolve it either way: the
   [API documentation](https://developer.amazon.com/docs/ring/api-documentation.html) describes
   WHEP without mentioning audio at all. **Settle this experimentally this week.** If audio is
   there, our whole "therefore gestures" argument becomes a choice we have to justify on
   accessibility grounds rather than a constraint we were handed — and the honest justification
   is good (a Deaf *visitor* cannot speak to be captioned; a gesture channel serves them and
   RingRelay's does not) but it is a different argument and the narrative must change.
2. **The chime probably cannot say sentences.** The capabilities payload reports
   `audio: { customizable_slots: null, supported_actions: null }` (FL-006) and the docs say
   playback is "named by `audio_ref`" against *audio slots*. Another entrant independently
   concluded the chime can only play "a category-specific tone". If so, "the door SPEAKS to the
   visitor" is not true, and a judge who reads the API docs will notice. Either soften the
   claim to what the API supports, or make the fallback path (visitor-facing text on a phone,
   or the resident's device) a first-class part of the design rather than a caveat.
3. **We cannot know the visitor's locale — only the resident's.** This is the sharpest critique
   of our differentiator and it has no answer in the current plan. Device locale tells you where
   the *homeowner* installed the doorbell, not where the *stranger on the step* is from. A
   Greek courier at a British door still gets the British gesture set. Localising to the
   resident's region is defensible as a *harm-reduction* measure (do not ship the moútza in
   Athens) but it is not "the visitor's own gestures", and the README currently promises the
   latter.
4. **The cold-visitor problem is unsolved and it is the real bottleneck.** The public-display
   literature (StrikeAPose, Cuenesics, Khurana & Chilana 2024) is unanimous: a stranger does not
   know a gesture interface exists. Our five gestures require the courier to already know the
   vocabulary. Until there is a reveal mechanism, gesture accuracy is irrelevant.
5. **MediaPipe is outside its operating envelope at a front door.** Google's own model card:
   untested in the wild, in low light, with motion blur; gloves and occlusions out of scope;
   multi-hand out of scope; **motion gestures such as waving explicitly out of scope** — and
   `wave` is one of our five. A judge who knows MediaPipe will ask about night-time and about
   whether `wave` works at all.
6. **RingRelay has a Deaf-user insight we lack.** It classifies *non-speech* sounds — the truck,
   the dog, the knock — because that is information a hearing person gets from their door and a
   Deaf person does not. That is a better-observed user need than anything in our current
   feature list.
7. **Two of the four judging criteria are currently thin.** *Tech Implementation* asks how
   effectively the project uses the required tech, and our Alexa+ MCP server does not exist yet
   (Week 3). *Potential Impact* wants a credible specific case, and we have no numbers, no users
   and no Deaf reviewer.
8. **Volume.** 9,625 registrants and 122 public repos already. At least two authors are
   entering multiple projects. Ring's accessibility category alone has six or more serious
   entries.
9. **Eligibility is still unresolved.** The [rules](https://amazonappdev2026.devpost.com/rules)
   exclude "any other country which is comprehensively sanctioned by OFAC". Syria is not on the
   enumerated list, but the catch-all clause needs Devpost's written answer before the effort
   is fully committed.

---

## What winners do that we are not doing yet

Ordered by cost-to-benefit, most actionable first.

1. **Produce one falsifiable number and put it in the first paragraph of the submission.**
   Winners say "42 days earlier", "100% on Form 1040". We could say: gesture recognition
   measured on N held-out people, not on the developer's own hands, at doorbell distance, in
   daylight and at night, with the per-condition breakdown published. Measuring *and reporting
   the failure modes honestly* would itself be distinctive in a field of "99.6%" claims.
2. **Get real users, even three.** EcoLafaek won with "50+ reports, 3+ active users". Recruit
   two or three Deaf or HoH testers, have them use it, and quote them. A single sentence from a
   Deaf reviewer outweighs a paragraph of our own advocacy — and it directly answers *Potential
   Impact*, which asks for a "credible, specific case".
3. **Keep and promote the mock mode as a judge-facing feature.** Buzzle took 2nd place with
   hardware *plus* a browser demo. `doorsignal` has already built "judge-mode isolation". Our
   `npm run dev` scripted scenario is a scoring asset — label it as such in the README rather
   than as a fallback.
4. **Widen and justify the AWS surface.** Winners used eight or nine services with a reason per
   service. We currently have Bedrock planned and AgentCore/Strands aspirational. Write the
   per-service justification the way Infinite Memory did.
5. **Ship an architecture diagram and five-plus screenshots.** Near-universal among winners;
   we have none in the repo.
6. **Write the full Devpost narrative in the standard order and at length.** 1,500–4,500 words:
   Inspiration / What it does / How we built it / Challenges / Accomplishments / What we learned
   / What's next. This is free marks and it is the section judges read first.
7. **Quantify the problem statement the way winners do.** Replace "people who are Deaf or hard
   of hearing" with a specific, sourced figure and a specific scenario. RingVoice already cites
   "11 million deaf and hard-of-hearing Americans" — we should cite better, and globally, since
   our locale argument is global.
8. **Target a named-technology category prize.** The AWS AI Agent hackathon awarded "Best
   AgentCore Implementation", "Best Strands SDK Implementation" and so on. Depth in one named
   Amazon technology is a separate winnable lane alongside the track prize.
9. **Differentiate from RingVoice and RingRelay explicitly, in the writeup.** Both will likely
   submit. The strongest honest line: captioning serves a Deaf *resident* and a hearing
   *visitor*; WAVE's gesture channel additionally serves a Deaf, non-verbal or
   language-mismatched *visitor*, which a microphone cannot. Say it plainly rather than letting
   a judge conclude we built the same thing.
10. **Adopt RingRelay's non-speech-sound insight or say why not.** It is a genuine Deaf-user
    need and it is cheap to add to the transcript ("a dog barked", "a vehicle pulled up").
11. **Resolve the two API facts this week** — WHEP audio, and whether `audio_ref` can carry
    generated speech — and fold the answers into the friction log. Both become strong friction
    entries whichever way they go, and the friction log is worth up to 10%.
