# WAVE — per-locale gesture safety matrix

> **STATUS: UNVERIFIED DRAFT. Do not ship, and do not put this in front of a judge as
> finished research.**
>
> The per-locale research pass did not complete. Four parallel research agents were
> dispatched across the sixteen candidate locales; they consumed the session's entire
> web-search budget (200/200 calls) and then died without returning findings. No further
> searches are possible in this session.
>
> What that means for this document, precisely:
>
> - The **cross-cutting sources** in [Evidence base](#evidence-base) are real. I retrieved
>   each one in this session and the claims attributed to them are what those pages
>   actually say.
> - The **per-locale claims** in the matrix and the locale sections are **not sourced**.
>   They are my own background knowledge, hedged where I know the evidence is contested,
>   and they carry **no citations because I could not verify them and will not invent
>   them**. Every locale entry in `lib/gestures/locales.json` is marked `"verified": false`.
>
> Treat this as a structured hypothesis and a verification queue, not as the deliverable.
> [What still needs sourcing](#what-still-needs-sourcing) lists the specific claims to
> check, in priority order.

---

## Scope: which 14, and the two dropped

Sixteen locales were proposed; the brief asked for fourteen.

**Dropped: `en-GB`.** Within our five-gesture vocabulary it does not diverge from `en-US`
in any way I can identify. The famously offensive British gesture is the reversed V sign,
which is not in our vocabulary and which we do not detect. Keeping it would add a row and
no decisions.

**Dropped: `de-DE`.** Its risk profile within our five is a subset of `fr-FR`'s — both are
Western European, both count "one" on the thumb (so both can emit an accidental
`thumbs_up`), and in both, index-pointing at a person is mildly impolite. It buys no
substitution that `fr-FR` does not already buy.

Both were dropped for **redundancy within this gesture set**, not because they are
unimportant markets. If the vocabulary grows — particularly if anyone adds a V sign or a
ring/"OK" shape — `en-GB` must come straight back.

A caveat on the survivors: **`hi-IN` and `en-NG` are doing unreasonable work.** A single
language tag is standing in for enormous, internally non-uniform gestural areas. Nigeria
alone has several hundred languages. Modelling either as one locale is a known
simplification, and the gesture set should not be presented as though it resolves them.

---

## Summary matrix

Legend: 🟥 offensive · 🟧 impolite · 🟨 unclear or contested · 🟩 no issue identified

| Locale | 👍 thumbs_up | ✋ open_palm | 👋 wave | ☝ point | ✊ fist | Subs |
|---|---|---|---|---|---|---|
| `en-US` English (US) | 🟩 | 🟩 | 🟩 | 🟩 | 🟩 | 0 |
| `el-GR` Greek | 🟨 | 🟥 **moútza** | 🟥 | 🟧 | 🟩 | 4 |
| `fr-FR` French | 🟩 | 🟩 | 🟩 | 🟧 | 🟩 | 1 |
| `es-MX` Spanish (MX) | 🟩 | 🟩 | 🟩 | 🟧 | 🟩 | 1 |
| `pt-BR` Portuguese (BR) | 🟩 | 🟩 | 🟩 | 🟧 | 🟩 | 1 |
| `ar-SA` Arabic (Gulf) | 🟨 | 🟨 | 🟩 | 🟧 | 🟨 | 4 |
| `ar-EG` Arabic (Egypt) | 🟨 | 🟨 | 🟩 | 🟧 | 🟨 | 4 |
| `tr-TR` Turkish | 🟩 | 🟩 | 🟩 | 🟧 | 🟩 | 1 |
| `ja-JP` Japanese | 🟩 | 🟩 | 🟨 **= "no"** | 🟧 | 🟩 | 2 |
| `ko-KR` Korean | 🟩 | 🟩 | 🟨 | 🟧 | 🟩 | 2 |
| `zh-CN` Chinese | 🟩 | 🟩 | 🟩 | 🟧 | 🟩 | 1 |
| `hi-IN` Hindi | 🟨 | 🟩 | 🟩 | 🟧 | 🟩 | 2 |
| `en-NG` English (NG) | 🟨 | 🟥 **waka?** | 🟥 | 🟧 | 🟩 | 4 |
| `sw-KE` Swahili (KE) | 🟩 | 🟩 | 🟩 | 🟧 | 🟩 | 1 |

**Per-gesture exposure:**

| Gesture | Unsafe in | Verdict |
|---|---|---|
| ☝ `point` | **13 / 14** | Near-universally impolite. The quiet catastrophe. |
| 👍 `thumbs_up` | 5 / 14 | Famous, but mostly *contested*, not settled. |
| ✋ `open_palm` | 4 / 14 | Rare but **severe** where it fails. |
| 👋 `wave` | 4 / 14 | Fails differently in Greece/Nigeria vs Japan/Korea. |
| ✊ `fist` | 2 / 14 | Safest gesture we have. |

---

## The four findings that actually matter

### 1. Pointing is the real problem, not the thumbs-up

The thumbs-up gets all the attention. But an isolated extended index finger is impolite
across essentially the entire non-Western world and much of Europe too — **13 of 14
locales**. It is the only gesture in our set that fails almost everywhere.

It fails *quietly*, which is why it is dangerous. A moútza provokes a reaction someone
will tell you about. A slightly rude point just makes the interaction faintly unpleasant,
at scale, invisibly, and nobody files a bug.

The mitigation is cheap and nearly global: **replace the isolated index finger with a flat
hand, fingers together, angled downward.** Landmark-wise that is fingers extended and
adducted with the fingertip centroid below the wrist. It carries the same "down here"
meaning, it is at least as easy to detect as an index point, and it is polite in every
locale in this table. There is a strong argument for simply making the open-hand
indication the *default* everywhere and dropping the index point from the vocabulary
entirely.

### 2. Two different gestures collide with `open_palm`, and they are the worst failures

- **Greece — the moútza (μούτζα).** An open hand, fingers splayed, thrust palm-forward at
  a person. A serious insult with a long history. Our `open_palm` is essentially that
  shape aimed at a camera, and our `wave` is that shape *repeated*, which is worse.
- **Nigeria — "waka".** The spread-five-fingers thrust, reported as a serious insult in
  functionally the same way. **I could not verify this from academic sources** and it is
  flagged accordingly — but the cautious direction is cheap, so it is marked unsafe.

The proposed discriminator in both cases is **finger adduction plus palm orientation**:
the insult requires *splayed* fingers and a *forward-facing* palm, so a fingers-together
hand held edge-on should be safe. **This is a hypothesis, not a sourced finding.** If
adduction does not actually defuse the moútza, the flat hand has to be dropped in Greece
altogether. Verify this before anything ships to Greece or Nigeria.

### 3. In Japan, our "hello" plausibly means "no"

A hand waved side to side with the palm outward, especially in front of the face,
conventionally reads in Japan as "no", "not at all", or "I don't understand". Our `wave`
is defined by exactly that oscillation and we map it to *hello*.

This is the most insidious failure mode in the set, because it is not an insult — it is a
**silent semantic inversion**. The visitor signals refusal, the system reads greeting, and
both parties believe they were understood. Nobody is offended and the outcome is still
wrong.

The mitigation is unusual in that **the discriminator is motion, not shape**: require a
*static* held hand and reject oscillation. That is a change to the temporal logic of the
classifier, not to its geometry, and the current `classifyLandmarks` has no temporal
dimension at all — it classifies a single frame. Supporting this locale requires adding
one.

### 4. The thumbs-up claim is weaker than the project currently asserts

`PLAN.md` currently states as fact that 👍 is obscene in "Iraq, Iran, Greece, West Africa,
Sardinia" and that the wave "reads as moútza in Greece and Nigeria." Those claims need
softening:

- The **Greek and Sardinian** attributions trace to Morris et al. (1979), which is real
  fieldwork — but it is 47 years old, and many later accounts hold the Western approving
  sense has largely displaced it.
- The **West African / Nigerian** attribution I could not trace to any Nigerian linguistic
  or anthropological source. It propagates through travel listicles. Critically, the
  fieldwork usually cited in support of it, Morris et al., **covers only Europe and the
  Mediterranean** and therefore says nothing whatsoever about Nigeria.

The honest position is *contested*, not *obscene*. That is still enough to justify not
relying on the thumbs-up as the affirmative in those locales — the design conclusion
survives — but the claim as written would not withstand a judge who checks it.

---

## Evidence base

These are the sources I actually retrieved in this session. They support the cross-cutting
arguments above; they do **not** support the per-locale specifics.

**Gesture anthropology**

- Morris, D., Collett, P., Marsh, P. & O'Shaughnessy, M. (1979). *Gestures: Their Origins
  and Distribution.* Jonathan Cape. Twenty gestures surveyed across 40 locations in 25
  countries. **Scope caveat, and it matters: Western Europe and the Mediterranean only.**
  It is routinely over-extended in popular writing to Africa and Asia, which it does not
  cover.
- Archer, D. (1997). Unspoken Diversity: Cultural Differences in Gestures. *Qualitative
  Sociology* 20(1), 79–105. DOI 10.1023/A:1024716331692. Explicitly asks whether the same
  gesture can carry opposite meanings in two cultures, and whether global gestural
  diversity is collapsing toward Western forms — the exact question behind the "has the
  thumbs-up been Westernised?" dispute.
  <https://link.springer.com/article/10.1023/A:1024716331692>
- Kendon, A. (2004). *Gesture: Visible Action as Utterance.* Cambridge University Press.
  Source for the emblem / quotable-gesture framing: emblems are conventionalised and
  culture-specific, which is precisely why a single vocabulary cannot travel.

**Culturally adapted machine interaction — the strongest warrant for this feature**

- Trovato, G., Zecca, M., Sessa, S., Jamone, L., Ham, J., Hashimoto, K. & Takanishi, A.
  (2013). Cross-cultural study on human–robot greeting interaction: acceptance and
  discomfort by Egyptians and Japanese. *Paladyn, Journal of Behavioral Robotics* 4(2),
  83–93. Egyptian and Japanese subjects were greeted by robots using each culture's
  greeting; each group preferred its own and reported **discomfort** with the foreign one.
  This is close to direct experimental support for localising a door agent's greeting, and
  it happens to cover two locales in our table. Open access.
  <https://www.degruyterbrill.com/document/doi/10.2478/pjbr-2013-0006/html>

**Colour**

- Jonauskaite, D. et al. (2020). Universal Patterns in Color-Emotion Associations Are
  Further Shaped by Linguistic and Geographic Proximity. *Psychological Science* 31(10).
  4,598 participants, 30 nations, 22 languages. Finds colour–emotion associations are
  **largely universal** (mean similarity r = .88) but systematically modulated by
  linguistic and geographic proximity. DOI 10.1177/0956797620948810.
  Useful corrective: the differences are real but smaller than colour-symbolism folklore
  implies.
- Madden, T. J., Hewett, K. & Roth, M. S. (2000). Managing Images in Different Cultures: A
  Cross-National Study of Color Meanings and Preferences. *Journal of International
  Marketing* 8(4), 90–107. Eight countries; blue and white pattern similarly across
  cultures, red and black diverge sharply.
- Aslam, M. M. (2006). Are You Selling the Right Colour? A Cross-cultural Review of Colour
  as a Marketing Cue. *Journal of Marketing Communications* 12(1), 15–30.

**Accessibility and layout**

- W3C, *Understanding SC 1.4.1: Use of Color* (WCAG 2.2, **Level A**): "Color is not used
  as the only visual means of conveying information, indicating an action, prompting a
  response, or distinguishing a visual element."
  <https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html>
- W3C Internationalization — *Arabic & Persian Layout Requirements* and the bidi authoring
  guidance: use logical `start`/`end` rather than `left`/`right`, mirror layout for RTL,
  do not mirror logos or time indicators.
  <https://www.w3.org/International/alreq/> ·
  <https://www.w3.org/International/articles/inline-bidi-markup/>

**Detectability**

- MediaPipe Gesture Recognizer ships exactly **eight** canned classes: `Unknown`,
  `Closed_Fist`, `Open_Palm`, `Pointing_Up`, `Thumb_Down`, `Thumb_Up`, `Victory`,
  `ILoveYou`. Everything else needs a custom classifier or hand-written landmark geometry.
  <https://developers.google.com/edge/mediapipe/solutions/vision/gesture_recognizer>
- MediaPipe Hand Landmarker: 21 landmarks per hand, handedness output, and `num_hands`
  configurable above 1 — which is what makes two-handed substitutes (namaste, gongshou)
  feasible at all, and what makes right-hand preference enforceable.
  <https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker>

**Sign language framing**

- United Nations, International Day of Sign Languages: more than 70 million deaf people
  worldwide, using **more than 300** different sign languages.
  <https://www.un.org/en/observances/sign-languages-day>
- World Federation of the Deaf FAQs: 200+ national sign languages, only about 40% legally
  recognised. There is no universal sign language; International Sign is a limited pidgin.
  <https://wfdeaf.org/contact/faqs/>

**A gap worth naming**

- Xia, H., Glueck, M., Annett, M., Wang, M. & Wigdor, D. (2022). Iteratively Designing
  Gesture Vocabularies: A Survey and Analysis of Best Practices in the HCI Literature.
  *ACM Transactions on Computer-Human Interaction.* DOI 10.1145/3503537. The survey
  identifies 13 factors crucial to gesture-vocabulary design and **culture is not among
  the headline ones**. The standard methodology literature under-treats exactly this
  problem — which is a point in the project's favour and more honest than claiming the
  literature backs us.

---

## Cross-cutting design conclusions

**Colour is a secondary channel, and WCAG settles the argument.** SC 1.4.1 (Level A)
already forbids colour as the sole carrier of meaning. Combined with Jonauskaite et al.'s
finding that colour–emotion associations are largely universal with cultural modulation,
the conclusion is that **shape, icon and text must carry the signal, and colour tunes it**.
That converts every locale colour difference below from a correctness bug into a polish
item — which is both more defensible and much cheaper than maintaining fourteen palettes.
For an accessibility product this is the right posture regardless.

Three colour cautions still earn their place, because they invert a default:

- **White is mourning** in Japan, Korea, China and India. A white-dominant "clean/neutral"
  panel can read as funerary. Affects four of fourteen.
- **Red is not danger** in China (luck; and *rising* in financial displays, inverting the
  Western convention), Turkey (national), India (auspicious) or Kenya. A red alert may not
  read as alarming at all.
- **Never render a personal name in red** in Korea, where it carries a death association.

**Handedness is free, so use it.** MediaPipe returns left/right. Several locales disfavour
the left hand for indicating and giving. Whether that taboo extends to a gesture made at a
camera is genuinely unclear and under-evidenced — but preferring the right hand where we
can tell costs one field.

**Two-handed gestures are available.** `num_hands >= 2` unlocks namaste (`hi-IN`) and
gongshou (`zh-CN`) as respectful, highly distinctive, easily detectable greetings. The
current classifier is single-hand only.

**The classifier needs a temporal dimension.** `classifyLandmarks` currently classifies one
frame. Japan's wave problem is a *motion* distinction, and Brazil's figa/fist ambiguity is
a thumb-position distinction that a single frame may get wrong. Neither is solvable with
the current shape.

---

## Per-locale detail

The machine-readable form is `lib/gestures/locales.json`. Every entry there is
`"verified": false`. The notes below add what does not fit the schema.

### `en-US` — English (United States) · ltr · ASL

The baseline the default vocabulary was built for; all five gestures are fine. The raised
fist has a protest and solidarity reading in US public life, but a fist at chest height
toward a doorbell does not carry it. **0 substitutions.**

### `el-GR` — Greek · ltr · Ελληνική Νοηματική Γλώσσα (ΕΝΓ / GSL)

**Tied for most substitutions (4), and the most severe single risk in the set.** The
moútza kills both `open_palm` and `wave`; `point` is impolite; `thumbs_up` is contested
per Morris et al. (1979) versus later Westernisation accounts. Only `fist` survives — and
it survives precisely because it has no fingers to splay.

Substitute shape for both palm gestures: fingers extended and **strongly adducted**, thumb
alongside, hand vertical with the palm plane roughly *parallel* to the camera axis so the
palm is not presented flat to the lens. Held still. **Verify that adduction defuses the
moútza before shipping.**

Register: εσείς for a stranger; greeting before request.

### `fr-FR` — French · ltr · Langue des signes française (LSF)

Only `point` needs substituting. One implementation note: the thumb is the counting
hand-shape for "one", so `thumbs_up` can be emitted unintentionally mid-count — a reason to
require a dwell time rather than firing on a single frame.

Register: **vous**, always. "Bonjour" before any request is close to obligatory; omitting
it reads as rude in a way with no English equivalent. The system's first utterance should
be a greeting, not an instruction.

### `es-MX` — Spanish (Mexico) · ltr · Lengua de Señas Mexicana (LSM)

Only `point`, and mildly — lip- and chin-pointing are common alternatives, so the open-hand
substitution reads naturally. Colour note: **purple**, not white or black, is the mourning
colour to avoid for a neutral UI. Register: usted.

### `pt-BR` — Portuguese (Brazil) · ltr · Língua Brasileira de Sinais (Libras)

Only `point`. `thumbs_up` is *strongly* positive here — probably the most thumbs-up-positive
locale in the table, where it substitutes for thanks, yes and OK. It is the best affirmative
available.

One classifier risk that is not cultural: the **figa** (thumb protruding between index and
middle fingers) is a distinct Brazilian good-luck shape differing from a plain fist only in
thumb position, and `classifyLandmarks` currently keys the fist on `!thumbOut`. Make sure a
figa does not land silently in the fist bucket and get read as **no**.

Colour: purple is the mourning colour. Register: você is fine; o senhor / a senhora for
deference.

### `ar-SA` — Arabic (Gulf) · **rtl** · لغة الإشارة السعودية

**Tied for most substitutions (4).** `thumbs_up` contested; `open_palm` better replaced;
`point` impolite; `fist` may read as threat (low confidence, a judgement call).

The standout substitute in the entire report: the **bunched-fingertip "wait"** — all five
fingertips drawn together pointing upward, with an optional slow vertical oscillation. It
is culturally idiomatic *and* unusually easy to detect, because fingertip convergence is a
clean single-threshold test in landmark space and nothing else in the vocabulary resembles
it. Culturally apt and computationally cheap rarely coincide.

Sign language naming: the unified pan-Arab lexicon (لغة الإشارة العربية الموحدة) is an
institutional standardisation effort, **not** the natural language of any Deaf community,
and is contested. Name the national language, not the unified lexicon.

Layout: RTL. Mirror the layout, use logical `start`/`end`, do not mirror logos.

Register: high formality. Open with السلام عليكم rather than an instruction; use a softener
before asking anything of a stranger.

### `ar-EG` — Arabic (Egypt) · **rtl** · لغة الإشارة المصرية

Same four substitutions and the same bunched-fingertip "wait", with which Egyptian gesture
is particularly associated. Egyptian usage is generally described as more Westernised than
Gulf usage, but the evidence is anecdotal in both directions.

The occasionally repeated claim that **yellow signifies mourning in Egypt** is unverified
and may be folklore. Do not design around it without checking.

Register: formal but warmer and less distant than Gulf.

### `tr-TR` — Turkish · ltr · Türk İşaret Dili (TİD)

Only `point`. Notably, **no moútza-equivalent** despite the shared Aegean geography — which
is itself informative: the moútza is Greek-specific, not regional. The strongly offensive
Turkish gestures usually cited (the fig sign; the ring/"OK" shape as a homophobic slur) are
not in our vocabulary — worth stating explicitly so nobody adds an "OK" gesture later.

Colour: red is national and positive, not primarily a danger colour.

**Typography, and this one bites:** Turkish has dotted and dotless i (İ/i and I/ı). Any
case conversion must be locale-aware — `toLocaleUpperCase('tr')` — or the UI will render
visibly wrong words.

### `ja-JP` — Japanese · ltr · 日本手話 (JSL)

Two substitutions: `wave` (the semantic inversion described above) and `point`.

The `point` substitute is the conventional Japanese **open presenting hand** — fingers
extended and adducted, palm rotated upward, whole hand inclined downward. It is both the
polite form and a clean landmark shape.

Colour: **white is mourning** as well as purity. Red is dual — danger, but also festive and
auspicious (kōhaku). Both need a second cue.

Register: keigo matters. Minimum teineigo (です/ます); open with an apology-softener
(失礼します / 恐れ入ります) rather than a direct instruction. Plain form would be markedly rude.

### `ko-KR` — Korean · ltr · 한국수어 (KSL)

Two substitutions, mirroring Japan but with **lower confidence on the wave** — I could not
source the Korean negating reading specifically. Since the static-hand mitigation is free,
apply it in both locales and verify later.

`thumbs_up` is positive ("number one"). Palm-up beckoning is for animals and is offensive
toward a person — not in our vocabulary, but do not add it.

Colour: **never render a personal name in red.** White carries a mourning association.

Register: Korean grammaticalises deference. A stranger at the door warrants hapsyo-che, or
at minimum haeyo-che. Banmal from a system speaking in the resident's name would be a
serious discourtesy.

### `zh-CN` — Chinese (mainland, Simplified) · ltr · 中国手语 (CSL)

Only `point`. Optional upgrade: the **gongshou / baoquan** salute (one fist covered by the
other open palm) is a respectful traditional greeting, detectable with `num_hands >= 2`
plus a two-hand relative-position test.

Colour, three traps: **red is luck**, not danger, and marks a *rise* in Chinese financial
displays — the inverse of Western convention, so a red alert may read as celebratory.
**White is mourning.** **Yellow** is historically imperial but in modern slang 黄色 also
denotes pornographic content — prefer another accent. Minor: avoid a green hat motif
(戴绿帽子 = cuckolded).

Register: 您, not 你, for a stranger.

### `hi-IN` — Hindi (India) · ltr · Indian Sign Language (ISL / Indo-Pakistani)

Two substitutions: `thumbs_up` (contested and regionally variable) and `point`.

**Namaste** — both palms pressed together at chest height — is the respectful greeting and
the natural substitute. Detectable with `num_hands = 2` and a cross-hand fingertip-distance
test.

**A hard limitation worth stating plainly:** the Indian head movement often called the head
wobble is a real and important affirmative — but it is a *head* gesture. MediaPipe Hands
cannot see it. A visitor who answers that way registers as **no response at all**, and the
door will simply not respond to them. That is an accessibility failure inside an
accessibility product, and no gesture substitution fixes it.

Colour: **white is mourning and widowhood** — the single most important colour caution in
the table, since a white "clean/neutral" UI can read as funerary. Red is auspicious, not
dangerous. Saffron/orange is sacred and politically loaded — avoid as decoration.

Register: आप, never तुम/तू, for a stranger.

### `en-NG` — English (Nigeria) · ltr · Nigerian Sign Language (NSL)

**Tied for most substitutions (4)**, and the **worst-sourced row in the table** — flagged
rather than smoothed over.

- `open_palm` / `wave`: the "waka" spread-five-fingers thrust, reported as a serious insult
  functionally parallel to the moútza. **Unverified from academic sources.** Marked unsafe
  because the cautious direction is cheap.
- `thumbs_up`: widely asserted offensive in West Africa, **not traceable** to Nigerian
  linguistic or anthropological literature. Marked contested, not obscene.
- `point`: impolite; left hand disfavoured.
- `fist`: the safest option here, having no fingers to be read as splayed.

NSL is historically ASL-derived through Andrew Foster's mission schools — name it Nigerian
Sign Language, not "African Sign Language", which does not exist.

Register: greeting is obligatory before business and deference to age is strongly marked.
Do not assume an English-speaking visitor.

### `sw-KE` — Swahili (Kenya) · ltr · Kenyan Sign Language (KSL)

Only `point`. **The contrast with Nigeria is the point of this row:** no waka-equivalent
concern is identified for Kenya, and `thumbs_up` is generally acceptable. "Africa" is
useless as a locale, and modelling `en-NG` and `sw-KE` separately is what makes that
visible.

**Naming collision worth catching now:** "KSL" denotes both **K**enyan and **K**orean Sign
Language, and both are in this table. Disambiguate as `KSL-KE` in any shared namespace.

Colour: red is the blood of the independence struggle in the flag and prominent in Maasai
dress — not a neutral danger colour.

Register: **probably the clearest politeness requirement in the set.** Swahili norms
require an exchange of salamu (hujambo / habari) before any transactional request, with
shikamoo to an elder. A door agent that skips to an instruction breaches a real and
strongly felt norm.

---

## What still needs sourcing

Priority order. Items 1–3 are ship-blockers for their locales.

1. **The Greek moútza** — its exact form (does a static splayed palm suffice, or is the
   forward thrust required?), its current severity among younger Greeks, and critically
   **whether finger adduction actually defuses it**. The entire Greek substitution strategy
   rests on an unverified hypothesis.
2. **Nigerian "waka"** — whether it is real, how widespread, how severe, and whether static
   spread fingers suffice. Needs Nigerian linguistic or anthropological literature, not
   travel writing.
3. **The Japanese wave-as-negation** — well known informally; needs a citable source, and
   the same question asked properly for Korean.
4. **Thumbs-up, per locale** — Greece, the Gulf, Egypt, Nigeria, India. Specifically: is
   there *post-2010* evidence, and has the Western sense displaced older readings? Archer
   (1997) frames this question; someone needs to answer it.
5. **The Arab bunched-fingertip "wait"** — a proper source for its form and meaning. It is
   the best substitute in the report and currently rests on my assertion alone.
6. **Left-hand taboo and camera gestures** — does a taboo about giving and eating extend to
   a gesture made at a lens? I found no evidence either way.
7. **Colour specifics** — the Egyptian yellow-mourning claim (verify or kill it), and the
   Korean red-ink-name association.
8. **Sign language names** — confirm each endonym and the Libras legal-recognition statute
   (Lei 10.436/2002) before printing a law number.

The search budget is exhausted for this session. A follow-up pass needs
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` raised, and should run the locale clusters
sequentially rather than as four parallel agents — the parallel fan-out is what burned 200
searches without returning anything.

## Changes this implies elsewhere (not made)

Recorded, not applied — this task was scoped to the two files above.

- `lib/gestures/vocabulary.ts` — `classifyLandmarks` is single-frame and single-hand. It
  needs a temporal dimension (Japan's static-vs-oscillating wave), two-hand support
  (namaste, gongshou), finger-adduction and palm-orientation tests (Greece, Nigeria), and
  a figa guard on the fist branch (Brazil).
- `PLAN.md` — the thumbs-up and wave claims in "The thesis, sharpened" are stated more
  confidently than the evidence supports. See finding 4.
