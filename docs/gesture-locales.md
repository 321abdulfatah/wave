# WAVE — per-locale gesture safety matrix

Consolidated matrix for the fourteen launch locales: which of our five gestures are unsafe,
what replaces them, and the colour, script, register and sign-language facts that go with each.

**How to read the evidence markers.** Every claim here is graded, because the honest answer
varies enormously by locale:

- **[A]** peer-reviewed, or a primary legal/standards text
- **[B]** named institutional publisher or government source
- **[C]** tertiary (reference works, Cultural Atlas, Wikipedia with footnotes checked)
- **[!]** **inference or absence of evidence** — our reasoning, not a source

Three locales — `es-MX`, `pt-BR`, `hi-IN` — **did not get a research pass** and are marked
`"verified": false` in the JSON. Their rows are gated conservatively and every note says so.
Do not let them pass as researched.

**Provenance.** The per-region evidence lives in
[gesture-research-mena.md](gesture-research-mena.md),
[gesture-research-eastasia.md](gesture-research-eastasia.md),
[gesture-research-greece-africa.md](gesture-research-greece-africa.md),
[locale-research-fr-us-ke.md](locale-research-fr-us-ke.md) and
[locale-colour-typography.md](locale-colour-typography.md). This document is the consolidation;
those are the working papers, and they record what failed to verify as carefully as what passed.
The runtime artefact is [`lib/gestures/locales.ts`](../lib/gestures/locales.ts); the matrix in
the requested five-gesture schema is [`lib/gestures/locales.json`](../lib/gestures/locales.json).

---

## Scope: which 14, and the two dropped

**Dropped `en-GB`** — within our five-gesture vocabulary it does not diverge from `en-US` at all.
The famously offensive British gesture is the reversed V sign, which we do not detect. It adds a
row and no decisions. If anyone ever adds a V sign, it comes straight back.

**Dropped `de-DE`** — its risk profile within our five is a subset of `fr-FR`'s. Both count "one"
on the thumb, both treat index-pointing at a person as mildly impolite, and `fr-FR` additionally
carries the bras d'honneur finding that makes the fist problem concrete. `de-DE` buys no
substitution `fr-FR` does not already buy.

Both were dropped for **redundancy within this gesture set**, not for unimportance.

**A caveat that should not be buried:** `hi-IN` and `en-NG` are each standing in for enormous,
internally non-uniform gestural areas — Nigeria alone has several hundred languages. And
`en-NG` is absent from `locales.ts` entirely; it is carried only in the JSON.

---

## Summary matrix

🟥 offensive · 🟧 impolite · 🟨 unclear / contested · 🟩 no issue found · ⬜ locale unresearched

| Locale | 👍 thumbs_up | ✋ open_palm | 👋 wave | ☝ point | ✊ fist |
|---|---|---|---|---|---|
| `en-US` | 🟩 | 🟩 | 🟩 | 🟩 | 🟨 render-only |
| `el-GR` | 🟨 | 🟥 **moútza** | 🟥 | 🟨 | 🟥 |
| `fr-FR` | 🟩 | 🟩 | 🟩 | 🟨 | 🟥 **bras d'honneur** |
| `es-MX` ⬜ | ⬜🟩 | ⬜🟨 | ⬜🟩 | ⬜🟧 | 🟥 |
| `pt-BR` ⬜ | ⬜🟩 | ⬜🟨 | ⬜🟩 | ⬜🟧 | 🟥 **figa** |
| `ar-SA` | 🟨 | 🟥 | 🟩 | 🟥 *no substitute* | 🟥 |
| `ar-EG` | 🟨 | 🟥 **Rabia** | 🟩 | 🟩 | 🟥 |
| `tr-TR` | 🟩 | 🟥 **Rabia** | 🟨 **= "no thanks"** | 🟨 | 🟥 **fig** |
| `ja-JP` | 🟨 | 🟩 | 🟨 **= "no"** | 🟨 | 🟥 |
| `ko-KR` | 🟨 | 🟩 | 🟨 | 🟨 | 🟥 |
| `zh-CN` | 🟨 | 🟩 | 🟨 | 🟨 | 🟥 |
| `hi-IN` ⬜ | ⬜🟨 | ⬜🟩 | ⬜🟩 | ⬜🟧 | 🟥 |
| `en-NG` | 🟩 *claim withdrawn* | 🟨 **"waka"?** | 🟨 | 🟧 | 🟥 |
| `sw-KE` | 🟩 *assumed* | 🟩 | 🟩 | 🟧 **sourced** | 🟥 |

**Per-gesture exposure:**

| Gesture | Unsafe in | Verdict |
|---|---|---|
| ✊ `fist` | **14 / 14** | **Cut globally.** Pan-culturally "Threat" at 98.15%. |
| ☝ `point` | 12 / 14 | Near-universal. Fixed by one rule: whole hand, never one finger. |
| 👍 `thumbs_up` | 7 / 14 | Mostly *semantic* ("good", not "yes") — rarely actually obscene. |
| ✋ `open_palm` | 7 / 14 | Rare but **catastrophic** where it fails. |
| 👋 `wave` | 6 / 14 | A US emblem that inverts in Japan and Turkey. |

---

## The findings that actually matter

### 1. The fist has to go, and not for the reason we assumed

Matsumoto & Hwang (2013) **[A]** is an empirical emblem catalogue — encoders in six world regions
produced gestures for a standard message list, then separate decoders from the same region judged
them, with a ≥70% production and ≥70% recognition bar. It gives **measured recognition rates
instead of anecdote**, which is what this whole area normally lacks.

A closed fist is pan-culturally **"Threat" at 98.15%**. On top of that: triumph in Japan
(ガッツポーズ), the numeral **10** in China, one landmark from the obscene **fig** in Turkey, and
the terminal handshape of the **bras d'honneur** in France, Mexico and Brazil.

That last one is the sharpest, and it is a *false-accept*, not a false-reject: the bras d'honneur's
insult lives in the **forearm and the second hand**, neither of which a single-hand 21-landmark
model can see. A handshape-only classifier logs *"Visitor said no"* for someone making an obscene
gesture at the camera.

**Replacement: `thumbs_down`.** It is maximally separable from `thumbs_up` on a single scalar, so
yes and no can never silently swap — which is the specific failure mode worth engineering against.

### 2. The pan-cultural emblems are heads, not hands

The three highest-recognition emblems on earth, from the same study:

| Meaning | Emblem | Recognition |
|---|---|---|
| Yes | **head nod** | 98.18% |
| No | **head shake** | 99.10% |
| Stop | open palm | 100% |

Two of three are not hands. And the culturally correct East Asian hello, yes and no are a **bow, a
nod and a shake** — none of which a hand-landmark pipeline can express.

**Recommendation: promote head nod and head shake to the primary yes/no channel.** MediaPipe ships
Face Landmarker and Pose Landmarker alongside Hand Landmarker. This is simultaneously the most
universal option, the most culturally safe, and the easiest to perform for someone **holding a
parcel in both hands** — which describes a large share of our actual users.

### 3. Greece: the obvious fix is also an insult

Our `open_palm` is the **moútza**. Greek Wikipedia **[C, footnotes checked]**: the insulter extends
his hand toward the insulted and shows the open palm with the fingers stretched out.

The finding that matters is the second-order one. **The fingers-together "safe version" that travel
sites recommend is itself a named milder insult** — the «ευγενική» μούντζα, the *polite* moútza,
same gesture with the fingers closed. Several sites recommend exactly this. They are wrong, and it
is actively dangerous advice. **No palm-toward-camera flat hand of any finger spacing is safe in
Greece.**

Two consequences:

1. **Statically, the moútza and our `open_palm` are the same 21 landmarks.** MediaPipe cannot
   separate them by hand shape — only by wrist-translation velocity toward the camera.
2. **Never prompt for it.** A hint reading "hold up your open palm to signal wait" instructs a Greek
   visitor to moútza the customer's doorbell. That is a localisation bug as much as a CV one.

Severity is legal, not merely social: Greek Penal Code **Art. 361** (εξύβριση) covers insult "with
words or deeds", explicitly including contemptuous gestures **[A]**. Ordinary Greeks already
self-censor — English Wikipedia records that Greeks signalling the number **five** must take care
not to overextend the fingers or face the palm toward the person.

**Substitute: the raised index, «μια στιγμή»** — index vertical, other three curled, palm
**edge-on**, static ~1s, no thrust. It separates cleanly from every other gesture in the
vocabulary. ⚠️ **[!]** The negative finding is well evidenced; this positive recommendation is
engineering inference, not a sourced Greek emblem. Validate with a Greek speaker.

### 4. The Rabia sign: a classifier bug with criminal-law consequences

**The single highest-consequence finding in the project, and we would have shipped it by accident.**

An open palm **with the thumb folded onto the palm** is the **Rabia sign** (Rabaa al-Adawiya, 2013).
Egypt designated the Muslim Brotherhood a terrorist organisation in December 2013. Documented
punishments for displaying it: footballer **Ahmed Abd El-Zaher**, suspended for a goal celebration;
kung fu champion **Mohamed Youssef**, banned for a year. In **Turkey** the identical sign is
**Erdoğan's** personal and party emblem — strongly partisan in the opposite direction.

**A thumb-position-tolerant `open_palm` classifier will emit Rabia on a four-finger hand.** The
four-fingers-up/thumb-folded configuration must be **hard rejected**, never absorbed into
`open_palm`, and never rendered as a prompt icon in either locale.

This is not a politeness problem. It is a gesture with criminal-law and employment consequences in
one target locale and a partisan political meaning in another, produced by accident by our own
code.

### 5. Japan's "hello" is "no" — and so is Turkey's

Two independent, verified semantic inversions:

- **Japan [B]** — *National Japan Bowl 2024 Gestures Guide* (Japan-America Society of Washington DC):
  ちがう、ちがう, "palm facing out, right in front of your nose, wave your arm back and forth", means
  *that is wrong / no*. So **two of our five gestures would both read as "no" in Japan**, and neither
  would mean what we intend.
- **Turkey [A]** — Denizci (2015), citing Calbris & Montredon (1986: 119): arm slightly extended
  toward the addressee, palm outwards, moving side to side in the transversal plane, designates
  **"refusal of an offer" — no, thanks.** A near-exact description of our `wave`, mapping to our
  `fist` semantics rather than our `wave` semantics.

These are worse than insults. An insult provokes a reaction someone tells you about; a **silent
semantic inversion** leaves both parties believing they were understood. Note also that the
discriminator here is **motion, not shape** — and `classifyLandmarks` is currently single-frame
with no temporal dimension at all.

### 6. Two claims this project asserted did not survive

`PLAN.md` states both as fact. Both should be withdrawn, not softened.

**"Thumbs-up is obscene in West Africa"** — close to debunked. Traces to Roger Axtell (1991);
secondary sources recirculate him without examination. Wikipedia's *Thumb signal* article does not
mention West Africa or Nigeria at all, and its only sourced negative reading is **Iran**. A
35-year-old travel book is thin ground for a product decision, and thumbs-up is ubiquitous in
Nigerian digital culture today.

**The Nigerian "waka" reading of the spread palm** — could not be sourced. Wikipedia's *Mountza*
article's Nigeria sentence **carries no citation at all**; the *Obscene gesture* article contains no
mention of Nigeria, West Africa, Hausa or "waka" anywhere, and its nearest claim cites a paywalled
1996 NYT piece that does not name Nigeria. Searches scoped to Punch, Vanguard, Guardian Nigeria and
Premium Times returned nothing. Two genuinely relevant papers — Agwuele (2014), *Gesture* 14(1), and
Orie (2009), *Gesture* 9(2) — **both 403'd** and may well document it.

**Position: plausible, widely attested informally, evidentially thin.** Avoid a spread-palm thrust
in Nigeria anyway on asymmetric cost — but do not state it as fact with a citation. It would not
survive a judge checking it.

The pattern is worth naming: **the loudest cross-cultural gesture claims are the worst sourced.**
The Greek and Egyptian findings, which are real and severe, are far better evidenced than the
Nigerian and West African ones that travel writing repeats most confidently.

### 7. A verified bug that affects every locale

**MediaPipe's `handedness` output assumes the input image is mirrored** — a front-facing selfie
camera. **A doorbell camera is not mirrored.** Any left/right logic — and a left-hand taboo *is*
left/right logic — will be **exactly backwards** unless the label is swapped **[A, Google's own
docs]**. Doorbell previews are also commonly mirrored for display, so the label must be keyed to the
**un-mirrored** frame.

This is the most concrete single bug the research found, and it silently inverts every
right-hand-preference rule we might add for the Arabic locales, Kenya or India.

---

## Colour: ground it in a standard, not in folk symbolism

**The defensible position.** Base the alert palette on **ISO 3864-4** — red = prohibition,
yellow = warning, green = safe, blue = mandatory. The standard is explicitly graphical "to overcome
language barriers", and **China's own national safety-colour standard matches it** (红 = 禁止、停止、
紧急告警; 绿 = 提示、安全、通行), so red-as-alert is the legally standardised meaning in a mainland
Chinese user's own built environment.

**WCAG 1.4.1 (Level A)** forbids colour as the sole carrier of meaning anyway. That demotes locale
colour from a correctness problem to a **tuning** problem — which is both cheaper and more
defensible than maintaining fourteen palettes. Pair every state with an **ISO 7010 icon shape** and
a text label.

Supporting this: Kawai et al. (2022), *Psychological Research* 87(3):704–724 **[A]** measured red's
implicit negativity at a 32.42 ms congruence effect in Mainland China versus 76.84 ms in the Western
group — roughly **2.4× weaker, attenuated but not absent**. Green was consistently positive across
all cultures. And Jonauskaite et al. (2020), *Psychological Science* 31(10) **[A, abstract only —
SAGE 403'd]** found colour–emotion associations largely universal (r = .88) and shaped by
linguistic/geographic proximity — which argues **against** strong locale-specific colour rewrites.

Then apply only the deltas that survived sourcing:

| Locale | Delta |
|---|---|
| `ar-SA` `ar-EG` | **Yellow is NOT caution** — envy, sickness, cruelty, dishonesty ("yellow smile = mean"). **White is the shroud and coffin** as well as purity, so not a neutral background. Blue reads negative (envy, jealousy, death), which undermines the default "informational" colour of every design system. Hasan, Al-Sammerai & Abdul Kadir (2011) **[A]**, read in full; blue rests on one paper. |
| `ja-JP` | **Never red-on-white as the alert treatment** — 紅白 *kōhaku* is the visual grammar of *celebration*; a red alert on a white card reads as bunting. And **black, not white, is the funeral colour today**, datable to Ōkubo Toshimichi's 1878 funeral — so our dark UI carries a funerary tint here. |
| `ko-KR` | **Never render a person's name in red.** Korea.net **[B]** and the Dartmouth Folklore Archive **[B]**. Cite the taboo, never the conflicting origin stories. One CSS rule. |
| `zh-CN` | The 黄色 hazard is **lexical, not chromatic** — the yellow swatch is the national warning colour, but 黄 carries a pornographic sense even alone (黃片, 掃黃). Watch the copy. 戴绿帽子 is about **hats**, not green: green is the correct "all clear". No green hats in illustration. |
| `fr-FR` | **No large yellow fills** — gilets jaunes iconography, ubiquitous because since 2008 every French driver must carry a hi-vis vest. Older layer per Pastoureau (2019) **[B]**: « rire jaune ». Use orange for caution, which is also ANSI-correct. |
| `sw-KE` | **Avoid orange entirely** (ODM's election symbol) and **yellow+green together** (UDA, governing party). Orange is the natural middle warning tier, which makes this an easy trap. |

**Two "facts" that did not survive:** "yellow = mourning in Egypt" (the peer-reviewed source assigns
mourning to black and death to white; the yellow claim traces to *ancient* Egypt, where white was
worn to funerals) and **"white = mourning in Korea"** — the evidence cuts the other way, since 백의민족,
"the white-clad people", describes white as ordinary Korean dress for centuries.

**Never name a colour in UI copy** in any CJK locale. The blue/green lexical boundary does not sit
where a designer assumes: Japanese 青 covers the "go" colour on a traffic light, Chinese 青 spans
yellowish-green to black, Korean 푸르다 covers both. "Tap the green button" is untranslatable — and
refusing to write it is the accessible choice anyway.

---

## Script, typography and text handling

| Locale | Requirement |
|---|---|
| `ar-SA` `ar-EG` | **RTL.** Mirror layout, use logical `start`/`end`, never mirror logos. W3C ALReq. |
| `el-GR` | Uppercase **drops the tonos** but **keeps the dialytika**; disjunctive ή keeps its tonos. **CSS `text-transform: uppercase` gets this wrong** — supply pre-composed uppercase strings. |
| `tr-TR` | Four I-letters. `toUpperCase("i")` is `"İ"` U+0130, not `"I"`. **Never use locale-sensitive case folding for identifiers, gesture names or config keys** — locale casing is for displayed text only. |
| `fr-FR` | **Accented capitals required** (« SUPPRIMER LES RETRAITES ? » vs « …RETRAITÉS ? » — Académie française **[A]**). Narrow no-break **U+202F** before `;` `!` `?`; U+00A0 before `:`. Never degrade to a plain space. |
| `sw-KE` | **The apostrophe in `ng'` is a letter** — `ngoma` (drum) vs `ng'ombe` (cow) is a minimal pair. Normalise U+2019→U+0027 on ingest; `\b\w+\b` splits it; never break a line after it. CI strings: `ng'ombe`, `kung'aa`, `Ng'ang'a`. Budget 15–18-char unbreakable tokens. |
| `ja-JP` `ko-KR` `zh-CN` | **`lang` is mandatory** — Han unification means the codepoint does not carry the locale, and a ja-JP user seeing kanji through a Simplified-Chinese fallback sees subtly *wrong* glyphs. In a security product that is a trust signal we cannot afford to lose. Set it on `<html>`, not `<body>`. |
| `zh-CN` | Tag the **region**: `zh-Hans-CN`, not bare `zh` or `zh-Hans` (W3C CLReq). |
| line breaking | **Opposite rules.** ja: `line-break: strict`. zh: default — **not** `keep-all`, which overflows. ko: **`word-break: keep-all`** + `overflow-wrap: break-word`, because 한글 맞춤법 Art. 2 **[A]** requires inter-word spaces. Do not share one CSS rule. |
| sizing | CJK `line-height` 1.6–1.7 vs ~1.4 Latin; never fix an alert card's height. Chinese expands ~1.2×, **Korean contracts ~0.8×** — centre labels rather than stretching. |

---

## Politeness register

The strongest empirical warrant for localising a door agent at all: **Trovato et al. (2013)**,
*Paladyn* 4(2):83–93 **[A, open access]** ran the experiment — Egyptian and Japanese subjects were
greeted by robots using each culture's greeting, and each group preferred its own and reported
**discomfort** with the foreign one. Two of our locales, directly tested.

| Locale | Register |
|---|---|
| `fr-FR` | **Greeting is structurally expected of *us*.** Kerbrat-Orecchioni (2001) **[A]**, a corpus study of French shop interactions: "Bonjour !" in ~90% of interactions, politeness work occupying about half the material exchanged, and the greeting typically **initiated by the shopkeeper**. Our system is in the shopkeeper's seat. Never open with the question. **The French flow needs one more turn than the American one** — do not build a turn-count-identical graph and localise strings into it. Always `vous`. |
| `sw-KE` | **Greeting is a precondition for transacting.** Yahya-Othman (1995), "Aren't you going to greet me? Impoliteness in Swahili greetings", *Text* 15(2) **[A, title verified via Crossref; De Gruyter blocked the full text]**. Use **`Habari?`** — never `Jambo` (tourist-Swahili). **Never generate `Shikamoo`**: it is age-graded, and a camera cannot know a visitor's age *and should not try* — age estimation from video is inaccurate, demographically biased, and turns a doorbell into a profiling device. Use plural-as-respect (`hamjambo`, `karibuni`) instead. |
| `ar-EG` | Egyptians "typically avoid saying 'no' directly" **[C]**. Operationally: **a binary yes/no demands a culturally dispreferred speech act.** Make the "no" path expressible as **deferral** rather than refusal. |
| `ar-SA` | Indirect. ⚠️ **السلام عليكم for an automated agent is unresolved and is not a web-search question** — the fiqh sources concern person-to-person greeting between people of known faith; a door agent greets anyone. Needs native review. Also sourced and directly relevant to a camera product: **do not photograph people, especially women, without permission.** |
| `tr-TR` | `siz`; **`buyurun`** as the service opener; `efendim`; `Bey`/`Hanım` follow the **first** name. `-(y)InIz` imperatives are arguably right for an automated announcement. Needs a native check. |
| `ja-JP` | Minimum teineigo (です/ます); apology-softener, not a direct instruction. |
| `ko-KR` | hapsyo-che, or at minimum haeyo-che. |
| `zh-CN` | 您, not 你. |
| `en-US` | Direct, warm, brief. Over-formality reads as stilted from a machine. |
| `es-MX` `pt-BR` `hi-IN` | **Unresearched.** `usted` / `o senhor` / `आप` are safe defaults, not findings. |

---

## Sign languages — name them correctly, and never merge them

The UN records **more than 300** sign languages worldwide; the WFD counts 200+ national sign
languages with only ~40% legally recognised. There is no universal sign language. We are not
implementing one — but naming them correctly is the cheapest possible signal that we know that.

| Locale | Name | ISO | Note |
|---|---|---|---|
| `en-US` | American Sign Language | `ase` | No federal recognition. |
| `el-GR` | Ελληνική Νοηματική Γλώσσα (ΕΝΓ) | — | Recognised **equal to Greek**, Law 4488/2017 art. 65 §2. |
| `fr-FR` | Langue des signes française | — | « Langue à part entière », loi 2005-102 art. 75, Code de l'éducation L312-9-1 **[A, Légifrance]**. |
| `ar-SA` | لغة الإشارة السعودية | — | ~1 interpreter per **93,000** HoH people (CSIS 2014), vs 1 per 46 in California. |
| `ar-EG` | لغة الإشارة المصرية | — | ~1.2m deaf/HoH aged 5+. **No grammatical description exists**; four manual alphabets in use as of 2006. |
| `tr-TR` | Türk İşaret Dili (TİD) | — | A **language isolate**, ~250k signers. **Two-handed manual alphabet — a single-hand pipeline structurally cannot do TİD fingerspelling.** Do not imply otherwise in the pitch. |
| `ja-JP` | 日本手話 | `jsl` | |
| `ko-KR` | 한국수어 | `kvk` | |
| `zh-CN` | 中国手语 | `csl` | |
| `hi-IN` | Indian Sign Language | `ins` | ~6 million signers — **the most-used sign language in the world**. |
| `en-NG` | Nigerian Sign Language | `nsi` | ASL-derived via Andrew Foster's mission schools. No government recognition. |
| `sw-KE` | Kenyan Sign Language | `xki` | Art. 7(3)(b) promotion duty; Art. 120(1) official **of Parliament** only. **Not ASL** — ≤20% full cognates (Roberts 2009 via Morgan & Mayberry 2010). |
| `es-MX` | Lengua de Señas Mexicana | `mfs` | Unresearched locale. |
| `pt-BR` | Língua Brasileira de Sinais (Libras) | `bzs` | Unresearched locale; the Lei 10.436/2002 recognition is widely cited but **not verified here**. |

Two traps: **"Arabic Sign Language" is not one language**, and saying so is contested by Deaf Arabs
themselves — Al-Fityani (2010, UC San Diego, committee chaired by Carol Padden) **[A, read in full]**
found five natural Arab sign languages "unlikely to be descendants of a common ancestor", with Deaf
Arabs objecting that they "cannot understand the unified sign language nor can they find a purpose
or utility in it". And **KSL is ambiguous** — Kenyan `xki` and Korean `kvk` both abbreviate to it,
and both are in this table. **Use ISO codes as keys, never the abbreviation.**

---

## What is still open

**Ship-blockers for their locales:**

1. **Greece** — is the raised-index substitute actually a Greek emblem, or only our inference? The
   negative finding is solid; the positive one is not.
2. **Turkey** — **no sourced "wait" emblem exists.** The purse hand is ruled *out* (it means
   "good/delicious" there); nothing is ruled *in*. Turkish "no" is a head-back-plus-*tsk* and the
   head shake means "please explain" — both invisible to Hand Landmarker. Do not let anyone fill
   this from intuition.
3. **`ar-SA` pointing** — no hand-based substitute found; the sourced alternative is a chin raise,
   which is a head gesture.
4. **`es-MX` / `pt-BR`** — Wikipedia's moútza article lists **Mexico and Brazil** among locales with
   close analogues, while the same article says a steady repeated version means **"patience"** in
   both. Unverified and self-contradicting. If the first claim is right, `open_palm` is unsafe there
   too.

**Also unresolved:** thumbs-up in Egypt and the Gulf, measured rather than anecdotal · whether the
left-hand taboo applies to **camera-mediated** gesture anywhere · whether pointing **at the ground**
is rude anywhere (**no source addresses the downward case at all**, in any locale — our "probably
fine" is inference, and Kenya's best source arguably contradicts even that) · Turkish colour
semantics · the greeting-formula question for `ar-SA` · full passes for `es-MX`, `pt-BR`, `hi-IN`.

**A sourcing trap to know about:** `codex-mundi.com` ranks well on exactly these queries, presents
as a curated reference work with a severity scale and a Morris/Axtell/Kendon bibliography, and is
**AI-generated** — its footer reads "generated on 2026-09-10" and none of its four academic
citations carry page numbers. It was excluded. Expect more of this class of source here.

---

## Code changes this implies (not made — this task was scoped to two files)

- **`lib/gestures/vocabulary.ts`** — the live classifier still encodes the old vocabulary.
  It needs: the **fist branch removed** or rerouted to `thumbs_down`; a **temporal dimension**
  (Japan's wave is a motion distinction, and `classifyLandmarks` is single-frame); **hard-reject
  classes** for Rabia (four fingers up, thumb folded), figa and the intermediate thumb state;
  **finger-adduction and palm-orientation** tests; and the **handedness mirror correction**.
- **`PLAN.md`** — the West Africa thumbs-up and Nigerian moútza-wave claims should be withdrawn
  (finding 6). The Greek claim is sound and can be stated more strongly, not less.
- **`lib/gestures/locales.ts`** — missing `en-NG`.
