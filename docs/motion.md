# WAVE Motion System

**Motion is the notification channel.** The resident cannot hear. Every job that a chime, a
voice, or a click of acknowledgement does in an ordinary doorbell has to be done here by
light and movement. That makes motion load-bearing — and it also makes it dangerous, because
the same properties that make an animation noticeable (large area, high luminance delta, high
frequency) are the properties that trigger photosensitive seizures and vestibular symptoms.

This document is the spec and the reasoning. The live reference implementation is
[`design/motion-lab.html`](../design/motion-lab.html).

---

## 0. The test every animation must pass

> **What would this have been if the user could hear?**

If an animation has no audio counterpart and no informational job, it is cut. Applied honestly
this removes most of what a design system normally contains: hover bloom, page-load
choreography, staggered card reveals, parallax, decorative loaders. None of those were ever
sounds. What survives is small:

| Animation | The sound it replaces |
|---|---|
| The Ring | the chime |
| Utterance | the Chime's synthesised voice, and its rhythm |
| Confidence Build | "mm-hm" — the noise a listener makes while understanding |
| Seal | the latch / the confirmation tone |
| Refuse | "sorry, what?" |
| Slip-in | the soft second notification blip you are allowed to ignore |
| Resolve | the moment a sound *stops* — silence, which is invisible |
| Signal Lost | the dead-air hiss of a line that has dropped |

Everything else in the product is static.

---

## 1. Research findings that set the numbers

### 1.1 How Deaf and hard-of-hearing people are actually alerted today

Consumer doorbell signallers for Deaf households pair a push button with a **strobe receiver**;
many add a **bed shaker** and a remote receiver per room, with ranges up to ~600 ft, precisely
because a visual alert only works inside line of sight
([Diglo](https://www.diglo.com/shop-by-alert-trigger/doorbell-and-door-knock;d=3;c=32;s=323),
[ADCO](https://adcohearing.com/collections/signaling-notification-doorbell-notification),
[Safeguard Supply](https://safeguardsupply.com/flashing-doorbell-light-receiver-ss155)).

Two design consequences fall straight out of this:

1. **A visual alert has a coverage problem that sound does not.** Sound goes round corners.
   Light does not. WAVE's on-screen alert is therefore designed to be caught in **peripheral
   vision** from across a room, and the spec assumes the display is one node in a multi-node
   alert (phone haptics, additional displays) rather than the only one.
2. **The learned vocabulary is already "a big slow flash means someone wants you".** NFPA 72
   visible notification appliances — the strobes that exist in buildings specifically to give
   Deaf occupants equal warning — flash at **1–2 Hz**, with each flash under **0.2 s**
   ([ECMag](https://www.ecmag.com/magazine/articles/article-detail/strobe-light-requirements-proper-location-of-visible-notification-appliances),
   [System Sensor A/V guide](https://www.firetechs.net/library/ReferenceGuides/SystemSensor/AudibleVisibleRefGuide.pdf)).
   WAVE deliberately sits *adjacent to but not inside* that band (see §3.1) so it is read as
   "alert" without being mistaken for a life-safety signal.

### 1.2 What is genuinely dangerous

This is the constraint that shaped the whole system, so the numbers are given exactly.

- **WCAG 2.3.1 / 2.3.2 (Three Flashes).** Content must not flash **more than three times in any
  one-second period** unless it is below the general-flash and red-flash thresholds. A flash is
  exempt on area if the combined flashing area is **≤ 0.006 steradians within any 10° visual
  field** — roughly a quarter of the screen at typical viewing distance
  ([W3C Understanding 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html),
  [W3C Understanding 2.3.2](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html)).
- **The clinical picture is worse than the WCAG floor suggests.** Photoparoxysmal response peaks
  around **16 Hz**, with ~96% of photosensitive individuals sensitive somewhere in the **15–20 Hz**
  band; seizures are **rarely provoked below 3 Hz**; consensus guidance is that photosensitive
  individuals should not be exposed to more than **three flashes per second**
  ([International Guidelines for Photosensitive Epilepsy, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11872230/),
  [MDN: seizure disorders](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Seizure_disorders)).
  The Epilepsy Foundation hazard definition is a flash at **≥ 20 cd/m² luminance, ≥ 3 Hz,
  ≥ 0.006 sr**. **All three conditions must be met** to be hazardous — which is the lever this
  system pulls: WAVE's big alert is bright and large, so it must be slow.
- **WCAG 2.2.2 (Pause, Stop, Hide).** Anything moving or blinking that starts automatically,
  lasts **> 5 s** and sits alongside other content needs a pause/stop/hide mechanism, unless the
  motion is **essential** to the activity
  ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). WAVE's doorbell alert
  *is* the notification, so it takes the "essential" exemption — but only because dismissing the
  event is always one action away, and because it de-escalates on its own (§3.1).
- **Vestibular triggers are a separate axis from seizures.** Large sliding transitions, parallax,
  zooms and continuous looping motion cause dizziness, nausea and disorientation; importantly,
  **colour change, blur and opacity crossfades are not "motion"** for this purpose, so a
  crossfade remains available even under reduced motion
  ([W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html),
  [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)).
  This is the escape hatch that lets the alert survive `prefers-reduced-motion` instead of
  disappearing (§9).

### 1.3 Peripheral vision — why the alert lives at the edge of the screen

A wall display is usually seen out of the corner of the eye. Peripheral retina is bad at detail
and good at exactly the things an alert needs:

- Motion-detection thresholds rise with eccentricity, but **flicker and motion sensitivity are
  the defining functions of the peripheral field**; peak temporal contrast sensitivity sits around
  **5–20 Hz**, and the proportion of parasol (magnocellular) ganglion cells — the transient,
  motion-carrying pathway — increases with eccentricity
  ([Frontiers in Neuroscience](https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2021.683153/pdf),
  [elaTCSF, arXiv](https://arxiv.org/pdf/2503.16759)).
  The awkward truth is that the frequency band the periphery is *best* at is the band that is
  *most* likely to trigger a seizure. WAVE therefore cannot buy noticeability with frequency.
  It buys it with **area, luminance envelope and expansion** instead.
- **Expansion beats every other motion type for grabbing attention.** Looming/expanding motion
  captures attention regardless of the viewer's attentional set, attributed to behavioural
  urgency; motion *onset* captures attention while motion *direction* does not
  ([Franconeri & Simons, *Percept Psychophys*](https://link.springer.com/article/10.3758/BF03194829),
  [von Mühlenen & Lleras](https://warwick.ac.uk/fac/sci/psych/people/avonm/avonm/vonmuhlenen__lleras_2007_jeph.pdf)).
  This is the single most useful finding in the whole review: **one slow expansion per second
  outperforms a fast flicker, and is safe.**
- Calm-technology framing applies to everything that is *not* the doorbell: technology should
  "inform but not demand our focus", moving easily from periphery to centre and back
  ([Weiser & Brown](https://people.csail.mit.edu/rudolph/Teaching/weiser.pdf),
  [Case](https://www.caseorganic.com/post/principles-of-calm-technology)). WAVE has exactly one
  thing that is allowed to demand the centre, and it is someone standing at the door.

### 1.4 Motion craft borrowed

- **IBM Carbon** supplies the easing and duration scale, because it is published with real
  numbers: standard-productive `cubic-bezier(0.2, 0, 0.38, 0.9)`, entrance-expressive
  `cubic-bezier(0, 0, 0.3, 1)`, exit-expressive `cubic-bezier(0.4, 0.14, 1, 1)`, and durations
  fast-01 70 ms / fast-02 110 ms / moderate-01 150 ms / moderate-02 240 ms / slow-01 400 ms /
  slow-02 700 ms, with the rule that **duration scales with distance travelled**
  ([Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/),
  [@carbon/motion tokens](https://github.com/carbon-design-system/carbon/tree/main/packages/motion)).
- **Material 3** supplies the emphasised/standard split — emphasised for transitions the user
  should notice, standard when speed matters more than naturalness
  ([M3 easing and duration](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)).
- **Apple HIG** supplies the reduced-motion doctrine WAVE depends on: *if the motion itself
  conveys meaning, do not remove the animation entirely* — substitute a dissolve, highlight fade
  or colour shift ([Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)).
  In WAVE the motion always conveys meaning, so nothing is ever deleted; it is re-encoded.

---

## 2. Tokens

### 2.1 Easing

| Token | Curve | Use |
|---|---|---|
| `--ease-door` | `cubic-bezier(.2, 0, .38, .9)` | default state change; anything that must feel mechanical and certain |
| `--ease-enter` | `cubic-bezier(0, 0, .3, 1)` | something arriving; no in-ramp, decelerating stop |
| `--ease-exit` | `cubic-bezier(.4, .14, 1, 1)` | something leaving; accelerates out and is gone |
| `--ease-breath` | `cubic-bezier(.37, 0, .63, 1)` | symmetric sine — **sustained loops only**. No onset spike, so a loop doesn't re-trigger attention capture on every cycle |
| `--ease-swell` | `cubic-bezier(.16, .72, .31, 1)` | the looming expansion of the doorbell ring: fast release, long decelerating travel |
| `--ease-settle` | `cubic-bezier(.34, 1.26, .64, 1)` | the only overshoot in the system. Capped at **+4 % scale**, used once, on acceptance |

Overshoot is rationed to a single token and a single moment. A bounce with no physical referent
is decoration.

### 2.2 Duration

| Token | ms | Use |
|---|---|---|
| `--d-tap` | 80 | acknowledge a press; below this the change is missed, above it feels laggy |
| `--d-quick` | 140 | live data tween (gesture confidence); slightly longer than the 100 ms sample interval so the value is continuous, never stepped |
| `--d-base` | 220 | ordinary state change |
| `--d-considered` | 360 | list insertion, offline → online |
| `--d-deliberate` | 560 | online → offline, resolution of a long-running state |
| `--d-arrival` | 900 | full accept sequence, end to end |

### 2.3 Loop periods — the safety-critical ones

| Token | ms | Hz | Justification |
|---|---|---|---|
| `--loop-ring` | 1200 | **0.83** | 3.6× below the WCAG three-per-second limit; below the 3 Hz clinical floor; adjacent to but distinct from NFPA 72's 1–2 Hz life-safety cadence |
| `--loop-offline` | 2400 | 0.42 | slow enough to read as "condition", not "event" |
| `--loop-indet` | 1400 | 0.71 | indeterminate progress; deliberately un-hurried so it isn't mistaken for the door |
| `--loop-syllable` | 240 | 4.17 | **above 3 Hz — permitted only because of the area exemption**: the animated element is < 2 % of viewport and carries no large-field luminance change (§4) |

### 2.4 The colour safety check

The alert colour is sodium-lamp amber `#FFB020`. WCAG's red-flash rule applies to transitions
to or from a saturated red where **R / (R + G + B) ≥ 0.8**. For `#FFB020`:
`255 / (255 + 176 + 32) = 255 / 463 = ` **0.55**. Under the threshold, so the amber alert is
outside the red-flash rule entirely. The reject colour `#E86A5A` computes to **0.54**. Neither
alert colour may be changed without re-running this check.

---

## 3. The visual doorbell — **"The Ring"**

**Replaces:** the chime. **Tier:** T0. This is the most important animation in the product.

### 3.1 Specification

Three layers, all on a single 1200 ms bar:

| Layer | Property | Values | Duration | Easing |
|---|---|---|---|---|
| Ring ×3 | `scale` / `opacity` | `0.06 → 7.4` / `0 → .92 → 0` | 1200 ms, staggered **0 / 160 / 320 ms** | `--ease-swell` |
| Edge bloom | inset border glow `opacity` | `.15 → 1.0 → .15` | rise **420 ms**, fall **780 ms** | `--ease-breath` |
| Field swell | background luminance | ΔL ≤ **0.10** relative luminance | same 1200 ms envelope | `--ease-breath` |

**Sustain envelope.** Full amplitude for the first **20 s**. Then a 2 s ramp down to **55 %**
amplitude, held indefinitely while the event is live. A live visitor does not stop being a live
visitor, but an alert at full intensity for four minutes is punishing and gets covered with a
tea towel — which is worse than a quieter alert.

**Geometry.** Rings originate from the door position and travel outward past the frame; the edge
bloom is full-bleed at the display border. Nothing important happens in the centre of the screen,
because the centre is not where this will be seen.

### 3.2 Why these numbers

- **0.83 Hz, not 8 Hz.** The periphery's peak sensitivity band (5–20 Hz) overlaps almost exactly
  with the seizure-provocation band (peak ~16 Hz). That path is closed. The system buys
  noticeability from **expansion** instead, which captures attention independent of attentional
  set, and from **area** — the full display edge, a much larger stimulus than any icon.
- **It is a ramp, not a flash.** A 420 ms rise is not a flash by any definition in the guidance;
  WCAG's flash pair requires opposing luminance changes, and the field delta is held at ΔL ≤ 0.10
  regardless. Even if a reviewer counted each swell as a flash, 0.83 of them per second is legal
  with 3.6× of headroom.
- **Staggered by 160 ms.** Two onsets closer than ~100 ms fuse into one percept. 160 ms keeps the
  three rings readable as a sequence radiating outward rather than a single blur.
- **Not 1.0 Hz.** 1–2 Hz is what a fire strobe does. A doorbell that borrows a life-safety cadence
  exactly is a bad citizen of the room.

### 3.3 Reduced motion

No scale, no travel, no rings. The edge band **crossfades** between two luminance states on the
same 1200 ms bar — opacity and colour only, which is explicitly not motion for vestibular
purposes. A permanent solid amber bar with the words **AT THE DOOR NOW** is added and does not
animate at all. A further user setting, *No flashing at all*, freezes even the crossfade and
compensates with size and contrast: the bar doubles in height and the type steps up.

**The alert is never removed. It changes modality.** Text is always present underneath, in every
mode, because motion must never be the only channel.

---

## 4. The door speaking — **"Utterance"**

**Replaces:** hearing the Chime's synthesised voice, and its rhythm. **Tier:** T2.

The resident needs two different facts: *what* is being said (text, not motion) and *that it is
being said right now, at this pace* (motion). The second one matters because the visitor is
reacting to the speech in real time — if the resident cannot see when a sentence lands, they
cannot read the visitor's response.

| Property | Value |
|---|---|
| Form | 7 vertical bars, phase-shifted by one beat each |
| Beat | **240 ms** (`--loop-syllable`, 4.17 Hz) — English syllable rate is ~4–6/s |
| Height range | 8 % → 100 % |
| Easing | `--ease-breath` |
| Phrase gaps | bars drop to 8 % for one full beat at clause boundaries — the gaps are the information |
| Caption | words revealed on word-onset, 110 ms opacity fade, no movement |

**Safety note on the 4.17 Hz beat.** This exceeds 3 Hz and is only permissible because of the
area exemption: the animated region is under 2 % of the viewport, far below 0.006 sr, and there
is no large-field luminance change. If this component is ever scaled up to a full-screen "the
door is talking" view, **the beat must drop to ≤ 2 Hz** or the bars must be replaced by a
non-flashing sweep.

**Not an equalizer.** The bars are driven by TTS word-boundary events, not by random amplitude.
A decorative equalizer would be a lie about rhythm, and rhythm is the entire payload.

**Reduced motion.** Bars freeze at a static profile. A 5-block discrete progress indicator steps
(no tween) once per word, and the caption continues to reveal word by word — text appearing is
not motion. The rhythm survives as a step function.

---

## 5. A gesture being read — **"Confidence Build"**

**Replaces:** "mm-hm" — the continuous acknowledgement noise a listener makes. **Tier:** T2.
This is the visitor's *only* cue that they have been understood, and the visitor is standing
outside in the cold.

| Property | Value |
|---|---|
| Form | circular arc, `stroke-dashoffset` bound to model confidence |
| Sample interval | **100 ms** (10 Hz from the recogniser) |
| Tween | **140 ms** `--ease-door` — longer than the sample interval, so the arc is continuous, never stepping |
| Lock threshold | **0.85**; on crossing, stroke `2 px → 3 px` over 180 ms and hue shifts neutral → signal |
| Dwell before resolution | **300 ms** at 100 % before Seal fires |

### The rule that matters

**The arc is a display of data, never a timer.** It is driven by the confidence value and
nothing else. If confidence drops, the arc **retreats**, using the identical 140 ms tween — no
special failure animation while the read is still in progress. A progress ring that fills
smoothly and then rejects is worse than no feedback at all: it teaches the visitor that the
feedback is theatre, and after that they stop trusting the door.

The 300 ms dwell exists so the completion is *seen*. An arc that hits 100 % and resolves in the
same frame reads as a glitch, not as an answer.

**Reduced motion.** Tween removed; the arc updates in discrete 10 % steps, with a numeric
percentage rendered beside it. Position change without interpolation is not motion in the
vestibular sense, and the number carries the signal exactly.

---

## 6. Accepted / Rejected

Two resolutions that must be distinguishable **across a room, in peripheral vision, without
colour** — some Deaf users are also colour-blind, and peripheral colour discrimination is poor
in any case. So they are separated on **axis, direction and duration**, with colour as the third
redundancy behind shape and an always-present text label.

### 6.1 Seal — accepted

| Phase | Property | Duration | Easing |
|---|---|---|---|
| 1. Collapse | arc → filled disc, scale `1 → 0.96 → 1` (**+4 % max**) | 280 ms | `--ease-settle` |
| 2. Release | single ring `scale 1 → 1.6`, `opacity .7 → 0` | 520 ms | `--ease-exit` |
| **Total** | | **800 ms** | |

**Radial. Centred. One outward release.** This is the latch clunking home — inward commitment,
then one ripple of confirmation. It takes its time on purpose; acceptance is the good outcome
and is allowed to be legible.

### 6.2 Refuse — rejected

| Phase | Property | Duration | Easing |
|---|---|---|---|
| 1. Break | arc stops filling, gap opens at the top | 120 ms | `--ease-door` |
| 2. Shake | `translateX` ±**5 px → 3 px → 1.5 px**, 3 decaying oscillations | 320 ms | `--ease-door` |
| 3. Settle | ring becomes dashed, `opacity → .55` | 240 ms | `--ease-exit` |
| **Total** | | **680 ms** | |

**Lateral. Decaying. Never completes.** The head-shake, made physical: the decay is what makes
it read as friction rather than a rendering fault. Amplitude is deliberately tiny — 5 px on a
small element — because the oscillation rate (~9 Hz positional) is above the vestibular comfort
band even though the seizure thresholds do not apply to positional movement of a small object
with no luminance flash.

**The reject is shorter and blunter than the accept (680 ms vs 800 ms).** That asymmetry is
itself information: one outcome lingers, the other is curt.

**Reduced motion.** No shake, no collapse. A 120 ms crossfade swaps the glyph (filled disc vs
broken ring with a gap), the text label changes, and the shape difference carries the whole
distinction — which is precisely why the shapes were made different in the first place.

---

## 7. A new event arriving — **"Slip-in"**

**Replaces:** the soft second chime you are allowed to ignore. **Tier:** T3.

The constraint is negative: it must **not** steal focus from what the resident is reading. A
Deaf resident reading a transcript is using their only sensory channel for the product. An
animation that yanks that away costs more than it delivers.

| Property | Value |
|---|---|
| Enter | `translateY 12 px → 0` + `opacity 0 → 1` (opacity completes at 60 %) + height `0 → auto` |
| Duration | **360 ms** `--ease-enter` |
| Travel | **12 px only** — small displacement is deliberately low-salience |
| Fresh tint | background wash `opacity .14 → 0` over **2000 ms**, `--ease-breath`, decaying, never flashing |

**Anchor-preserving insertion.** If the resident has scrolled away from the top, or is focused
inside the list, the item is **not** animated into view. Instead a static "1 new" pill fades in
at the top edge over 200 ms — one fade, no pulse, no bounce — and the item is inserted below the
scroll anchor so nothing under the eye moves. **Motion only happens where the eye is not
reading.**

**Reduced motion.** No slide, no height animation: the row is simply present on the next paint
with a persistent `NEW` tag that stays until the row is opened. Findability moves from motion
to a durable label — arguably better, which is a hint that the tag should be there in both modes.

---

## 8. State transitions

### 8.1 In progress → resolved — **"Resolve"**

**Replaces:** the moment a sound stops. Silence is invisible, so the end of a process has to be
*shown*, not merely implied by the absence of animation.

| Phase | Property | Duration | Easing |
|---|---|---|---|
| Indeterminate | sheen travels the track, loop | **1400 ms** `--loop-indet` | `--ease-breath` |
| Resolve | sheen snaps to full-width determinate fill | **240 ms** | `--ease-door` |
| Label | crossfade "Listening…" → "Resolved" | 160 ms | `--ease-door` |

**The rule: an indeterminate loop must never simply stop.** It resolves into a determinate
shape. A loop that vanishes is the silent equivalent of audio cutting out mid-word — the user
cannot tell success from crash.

### 8.2 Online → offline — **"Signal Lost"**

This is the most dangerous state in the product. If the camera is offline the resident is not
being told about their door **and does not know it**. Offline is therefore not a quiet grey; it
is the one condition besides the doorbell that is allowed to persist.

| Phase | Property | Duration / period | Easing |
|---|---|---|---|
| Into offline | `saturate(1) → saturate(.15)`, colour drains | **560 ms** `--d-deliberate` | `--ease-exit` |
| Persist | status dot `opacity 1 → .35 → 1` | **2400 ms** (0.42 Hz) | `--ease-breath` |
| Persist (static) | diagonal hatch overlay on the panel | — | — |
| Back online | saturation returns + **one** ring pulse, non-repeating | **360 ms** + 520 ms | `--ease-enter` |

The hatch is the important part: it is a static texture, so the state is still legible when
motion is off, when the animation is paused, and in a screenshot. The breathe is slow enough to
be calm and present enough never to become invisible. Recovery gets **exactly one** pulse —
"we're back" is news, not an alarm.

**Reduced motion.** Breathe becomes a pure opacity crossfade at the same period (permitted), or
with *No flashing at all* it stops entirely and the hatch plus the word `OFFLINE` carry the
state.

---

## 9. Attention hierarchy

Motion is a scarce channel here in a way that sound is not: two sounds mix and you still hear
both; two competing loops on one screen and you read neither. So the budget is enforced.

### 9.1 Tiers

| Tier | Contents | Channel it may use |
|---|---|---|
| **T0 — Door live** | someone is at the door now | exclusive: display edge, full-field swell, looping |
| **T1 — System blind** | camera offline, Chime unreachable | persistent slow breathe + static hatch; **yields the peripheral channel to T0** |
| **T2 — Conversation** | door speaking, gesture being read | contained inside its own card; never the edge, never the full field |
| **T3 — Ambient** | new list item, resolution, sync | single-shot ≤ 400 ms, never loops, never leaves its container |

### 9.2 The rules

1. **One looping animation at a time, globally.** Loops are the notification channel. Two loops
   is two chimes ringing at once. Only the highest live tier keeps its loop; every lower tier
   collapses to its static representation (badge, hatch, label).
2. **One-shots may overlap a loop, but not each other inside 120 ms.** Queue them with a 120 ms
   minimum stagger, because two onsets closer than ~100 ms fuse into a single percept and the
   resident loses the count of how many things happened.
3. **Nothing outranks T0.** A T3 arrival during a live door event gets **no** enter animation at
   all; it is simply present on the next paint.
4. **Escalation may interrupt; de-escalation may not be abrupt.** Moving up a tier cuts in
   immediately — that is the point of an alert. Moving down always plays its resolve transition
   (≥ 240 ms) so the resident sees *why* the motion stopped. Motion that just disappears is
   unreadable.
5. **Peripheral budget: one.** At most one element may animate outside the foveal region at any
   moment, and only T0 or T1 may claim it.

---

## 10. The reduced-motion contract

`prefers-reduced-motion: reduce` **must not** mean "the Deaf user stops being notified". Apple's
guidance is explicit that motion carrying meaning should be re-encoded rather than deleted, and
WCAG/vestibular guidance is equally explicit that opacity, colour and blur changes are not
motion. Together these give the contract:

> **Every animation degrades to a state that still carries its information — never to nothing.**

| Animation | Reduced-motion encoding | Information preserved |
|---|---|---|
| The Ring | edge crossfade at the same 0.83 Hz, no scale/travel + permanent solid bar + text | someone is at the door, now |
| Utterance | frozen bars, 5-block step indicator, word-by-word caption | speech is happening, at this pace |
| Confidence Build | untweened 10 % steps + numeric % | you are being understood, this much |
| Seal | 120 ms crossfade to filled disc + label | accepted |
| Refuse | 120 ms crossfade to broken ring + label | not understood |
| Slip-in | no enter animation, persistent `NEW` tag | this one is new |
| Resolve | crossfade to determinate fill + label change | it finished, and it succeeded |
| Signal Lost | crossfade + static hatch + `OFFLINE` | the door is not being watched |

A third level, **No flashing at all**, removes even the permitted crossfades from T0/T1 and
compensates with size, contrast and persistent text. Some users need zero temporal change, and
for them the alert becomes a large static amber bar — which is exactly why every state in this
system was given a static form as well as a moving one.

---

## 11. What was cut, and why

| Cut | Reason |
|---|---|
| Hover bloom on cards | never a sound |
| Staggered page-load reveal | never a sound; costs 400 ms of comprehension on every load |
| Parallax on the hero | vestibular trigger, zero information |
| Skeleton shimmer | a shimmer at 2 Hz across a large area, telling the user nothing the layout doesn't |
| Spinner during gesture read | it would be a *timer*, and the truth is a *confidence value* (§5) |
| Colour-only accept/reject | fails at distance, in periphery, and for colour-blind users |
| Bouncy list insertion | steals focus; violates the one thing Slip-in exists to protect |
| A second simultaneous loop anywhere | §9 rule 1 |

---

## Sources

- [W3C — Understanding SC 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html)
- [W3C — Understanding SC 2.3.2 Three Flashes](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html)
- [W3C — Understanding SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [W3C — Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [MDN — Web accessibility for seizures and physical reactions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Seizure_disorders)
- [International Guidelines for Photosensitive Epilepsy: Gap Analysis and Recommendations (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11872230/)
- [Electrical Contractor — Strobe light requirements and placement (NFPA 72)](https://www.ecmag.com/magazine/articles/article-detail/strobe-light-requirements-proper-location-of-visible-notification-appliances)
- [System Sensor — Audible/Visible Appliance Reference Guide](https://www.firetechs.net/library/ReferenceGuides/SystemSensor/AudibleVisibleRefGuide.pdf)
- [Diglo — Doorbell and door-knock alerting devices](https://www.diglo.com/shop-by-alert-trigger/doorbell-and-door-knock;d=3;c=32;s=323)
- [ADCO Hearing — Doorbell notification for Deaf individuals](https://adcohearing.com/collections/signaling-notification-doorbell-notification)
- [Safeguard Supply — SS155 flashing doorbell strobe receiver](https://safeguardsupply.com/flashing-doorbell-light-receiver-ss155)
- [Frontiers in Neuroscience — peripheral visual field function](https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2021.683153/pdf)
- [elaTCSF: A Temporal Contrast Sensitivity Function for Flicker Detection (arXiv)](https://arxiv.org/pdf/2503.16759)
- [Franconeri & Simons — Moving and looming stimuli capture attention](https://link.springer.com/article/10.3758/BF03194829)
- [von Mühlenen & Lleras — No-onset looming motion guides spatial attention](https://warwick.ac.uk/fac/sci/psych/people/avonm/avonm/vonmuhlenen__lleras_2007_jeph.pdf)
- [IBM Carbon — Motion](https://carbondesignsystem.com/elements/motion/overview/)
- [IBM Carbon — @carbon/motion tokens](https://github.com/carbon-design-system/carbon/tree/main/packages/motion)
- [Material Design 3 — Easing and duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [Apple Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Weiser & Brown — Designing Calm Technology](https://people.csail.mit.edu/rudolph/Teaching/weiser.pdf)
- [Amber Case — Principles of Calm Technology](https://www.caseorganic.com/post/principles-of-calm-technology)
