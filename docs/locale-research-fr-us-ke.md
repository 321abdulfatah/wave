# Locale research — fr-FR, en-US, sw-KE

Third and final research pass. Two of our working assumptions were wrong; both are corrected
below. Confidence is marked throughout: **[A]** primary/peer-reviewed, fetched · **[B]**
established reference, fetched · **[C]** inference or absence of evidence.

---

## The verified engineering trap that affects every locale

**MediaPipe's `handedness` output assumes the input image is mirrored** — i.e. a front-facing
selfie camera. **A doorbell camera is not mirrored.** Any left/right logic — and a left-hand
taboo *is* left/right logic — will be **exactly backwards** unless the label is swapped. **[A,
verified in Google's own docs]**

This is the single most concrete bug the whole research pass found.

---

## France

### `fist` is the terminal handshape of an obscene gesture

The **bras d'honneur**: "an arm is bent in an L-shape, with the fist pointing upwards. The other
hand grips or slaps the biceps of the bent arm as it is emphatically raised." Meaning ≈ "up
yours". Common across the Romance-speaking world. **[B]**

> **The insult lives in the forearm and the second hand — neither of which a 21-landmark
> single-hand model can see.** A handshape-only classifier will emit `fist` → "no" for a visitor
> who just made an obscene gesture at the camera, and the UI will cheerfully log *"Visitor said
> no."* That is a **false-accept embarrassment**, not a false-reject.

Computable discriminator: bras d'honneur has the forearm **vertical**, fist **above elbow
height**, knuckles pointing **away** from the signer. Our "no" is **chest height, palm toward
camera**. Gate on wrist-Y against the detected face box, and on palm-normal sign.

Also live in France: the **poing levé** — the raised fist in trade unionism, anarchism, and
specifically "in posters produced during the May 1968 revolt." Same mitigation.

### Yellow is gilets-jaunes iconography

Nov 2018 – Jun 2020, ~3 million participants, peak 287,710 (Ministry of the Interior). Its
ubiquity is a French legal artefact: **since 2008 every French driver must carry a
high-visibility yellow vest**, which is exactly why everyone had one. **[B]**

Older layer, from the right authority — **Michel Pastoureau, *Jaune. Histoire d'une couleur***
(Seuil, 2019): in medieval Europe greenish yellow signified "demonic sulfur and bile, the colour
of forgers, lawless knights, Judas, and Lucifer." Lexicalised in **« rire jaune »** — a forced
laugh. **[B]**

> **Rule for fr-FR: no large yellow fills.** A saturated yellow panel on a French screen in 2026
> reads as gilets jaunes before it reads as caution. Yellow only as a thin border, small icon or
> text accent — or substitute **orange** for the caution tier, which is also the ANSI-correct
> choice.

### Bonjour is structurally expected of *us*, not of the visitor

**Kerbrat-Orecchioni (2001), « Je voudrais un p'tit bifteck », *Les Carnets du Cediscor* 7:
105–118** — corpus study of French shop interactions, read in full. **[A]**

- **"Bonjour !" appears in roughly 90% of interactions.**
- Politeness work occupies **about half** the material exchanged, far beyond transactional need.
- **And the nuance that helps us:** the greeting is typically **initiated by the shopkeeper** —
  the customer's return greeting is often omitted.

> **Our system is in the shopkeeper's seat.** It holds the space. Greeting first is not merely
> polite, it is structurally expected of the party who holds the door. Never open with the
> question.

**Consequence for the state machine:** the French flow needs **one more turn** than the American
one, because the greeting is its own move rather than fused into the first question. **Do not
build a turn-count-identical graph across locales and localise strings into it** — the French
path will feel curt.

Three rules the sources justify: `Bonjour` is the first token, before any question ·
`s'il vous plaît` on every directive · conditional not imperative (« Souhaitez-vous… », never
« Déposez… »). And **always `vous`** — there is no register in which a machine tutoies a
stranger at a French door.

### French typography — two hard requirements

**Accented capitals are required.** Académie française: *« en français, l'accent a pleine valeur
orthographique »*, and *« On veille donc, en bonne typographie, à utiliser systématiquement les
capitales accentuées »* — **including À**. The minimal pair is
`SUPPRIMER LES RETRAITES ?` versus `SUPPRIMER LES RETRAITÉS ?` **[A]**

> **Never generate French caps with a locale-naive `.toUpperCase()`**, and never use an all-caps
> font stack lacking accented capitals. `"état"` → `"ÉTAT"`, not `"ETAT"`.

**Narrow no-break space before high punctuation:**

| Mark | Space | Codepoint |
|---|---|---|
| `;` `!` `?` | narrow no-break | **U+202F** |
| `:` | full no-break (contested) | **U+00A0** |
| inside « » | narrow no-break | U+202F |

Make it one configurable function, not scattered string literals. If a renderer mangles U+202F,
degrade to U+00A0 — **never to a plain space**, which allows a line break before the mark.

**LSF** — *Langue des signes française*, recognised « comme une langue à part entière » by
**loi n° 2005-102 du 11 février 2005, art. 75**, codified at **Code de l'éducation L312-9-1**.
Verified against Légifrance. **[A]**

---

## United States

**All five gestures are conventionally fine.** The two things worth knowing are both about
*rendering*, not recognition:

**The raised fist.** Every canonical politically-loaded instance — Smith and Carlos on the
podium, protest imagery — is **an arm extended overhead**. The loaded object is *arm above the
head*, not *handshape*. A chest-height fist with a bent elbow on the body midline is not the
salute. **[B]** But: **never render a raised fist in the UI or marketing.** An app screen showing
✊ beside the word "NO" is a different artefact from a courier's hand at chest height. And
consider who is at the door — a Black courier whose chest-height fist our product publicly
labels "protest-adjacent" is a headline nobody wants.

**The thumbs-up "generational shift" is media froth.** The agent chased it down: the entire
discourse traces to **a Reddit post**, amplified by a TODAY article containing **no expert
analysis**. The survey everyone cites (Perspectus Global, ~2,000 people aged 16–29) asked which
emoji make you *"look officially old"* — **which is not the same claim as "reads as
passive-aggressive."** A search of the peer-reviewed literature found **no empirical study** of
generational differences in thumbs-up interpretation. And all of it concerns the 👍 **emoji in
text chat**, where the alternative is typing words. At a doorstep the alternative is nothing.

> **Ship `thumbs_up` in en-US without hesitation.** Do not let a reviewer talk you out of it with
> a Reddit thread.

---

## Kenya

### Our beckoning assumption was wrong

The "palm-up come-here is for dogs" rule is documented for **Japan**, cited to Brown & Brown
(2006). Wikipedia's *Beckoning sign* article documents **only two variants, US and Japan, and
names no African country.** **[B, including the negative]**

The Kenya-specific source says the opposite: beckoning uses **all fingers of one hand, palm
facing either up *or* down** (Cultural Atlas). **The Africa version of this claim is a
travel-blog mutation. Do not encode it.**

### `point` is unsafe, and the source names the substitute

- Cultural Atlas: *"Pointing with the index finger is discouraged"*; people *"point with their
  chin or lips."* **[A]**
- Village Volunteers: *"It is considered improper to point at someone with your index finger.
  When pointing to someone **or something**, it is polite to use all fingers of the hand."* **[A]**

Note that second source extends the norm **to objects explicitly** — so we do *not* get the
"pointing at a parcel is different" exemption we were hoping for.

> **The transferable rule, and the most useful single constraint in the whole research corpus:
> whole hand, never one finger.** It governs both pointing and beckoning in Kenya.

**Substitute: flat-hand present.** Four fingers extended and **adducted**, thumb alongside,
whole hand angled 30–60° downward, palm oriented upward/obliquely (offering, not commanding),
held ~1 s. This is *better* conditioned than what we have — it differs from `open_palm` on **two
orthogonal high-reliability features**: fingers together vs spread, and hand axis down vs up.

### Colour: avoid orange entirely

| Colour | Kenyan political association |
|---|---|
| **Orange** | **ODM** — election symbol is an orange fruit |
| **Yellow + green together** | **UDA** — the governing party |
| Neon green / brown / red | DCP (founded Feb 2025) |

Orange is the natural "warning" tier between yellow and red in most design systems, which makes
this an easy trap. **Use amber-toward-red, or drop the middle tier.**

Flag meanings (Kenya High Commission, Ottawa — official): black = the people · red = blood shed
for independence · green = the land · white = peace and honesty. Red is *sacrificial* in Kenyan
official symbolism, not merely "danger". Usable for alerts, never as the sole signal.

### Swahili: the apostrophe in `ng'` is a letter, not punctuation

Standard Swahili uses the Latin alphabet with **no diacritics** and is **not tonal**. But `ng'`
(/ŋ/) versus `ng` (/ᵑɡ/) is a **minimal pair**: `ngoma` (drum) vs `ng'ombe` (cow).

Seven ways naive processing breaks it — all worth a CI test:

1. **Smart-quote autocorrect** turns U+0027 into U+2019, silently breaking string matching,
   dictionary lookup and TTS. **Normalise U+2019 → U+0027 on ingest.**
2. `\b\w+\b` and `split(/\W/)` split `ng'ombe` into `ng` + `ombe`. Use `Intl.Segmenter`.
3. Line breaking must never break after the apostrophe.
4. Escaping in SQL, CSV, JSON-in-shell, YAML, `.strings`.
5. All-caps `NG'OMBE` — verify casing does not move the apostrophe.
6. HTML entity round-tripping.
7. TTS must produce /ŋ/, not a glottal stop.

**CI test strings:** `ng'ombe`, `ng'ambo`, `kung'aa`, `Ng'ang'a` (a very common Kenyan surname
— two apostrophes, and it *will* appear in real user data).

**String expansion:** measured at **~1.06× overall**, 1.29× for short labels — far less than
IBM's generic 200–300% guidance, which does not cover Swahili. The real risk is **single-token
length**: Swahili is agglutinative, so budget unbreakable tokens of **15–18 characters**
(`haijatambuliwa`, `Uwasilishaji`). Expansion is not monotonic — `Karibu` (6) is *shorter* than
`Welcome` (7).

### Greeting first is a hard constraint, not a nicety

The canonical academic treatment is titled, in full: **Yahya-Othman, Saida (1995), "Aren't you
going to greet me? Impoliteness in Swahili greetings," *Text* 15(2): 209–227.** The title frames
failure-to-greet explicitly as **impoliteness**. *(Citation verified via Crossref; De Gruyter
blocked the full text, so the detailed argument is inferred from the title — stated honestly.)*

Converging: *"People are expected to take the time to greet and shake hands with everyone
present"*; conversations *"start with a polite greeting and an inquiry into one's health."* **[A]**

> In Swahili interactional norms the greeting is a **precondition for transacting**, not a
> garnish. A device whose first utterance is *"Show your hand to the camera"* has skipped a
> required move — and it is speaking **on the household's behalf, at the household's door.** The
> reputational cost lands on our user.

**Use `Habari?` as the default** — safe, age-neutral, common. **Never `Jambo`** (reads as
tourist-Swahili to Kenyans). **Never generate `Shikamoo`**: it is age-graded, and a camera
cannot know a visitor's age — and *should not try*. Age estimation from video is inaccurate,
demographically biased, and turns a doorbell into a profiling device.

Use **plural-as-respect** instead (`hamjambo`, `karibuni`) — age-neutral deference that lets the
device be respectful without guessing who it is talking to.

**KSL is `xki`, not `kvk`.** Kenyan and Korean Sign Language both abbreviate to KSL. Never use
the bare abbreviation as a locale key. And the constitutional status is more precise than usually
stated: **Art. 7(3)(b)** creates a *promotion duty*; **Art. 120(1)** makes KSL an official
language *of Parliament*; **Art. 7(2)** lists only Kiswahili and English as official languages of
the Republic. Also: KSL is **not ASL** — no more than 20% full cognates (Roberts 2009, via Morgan
& Mayberry 2010). If anyone reaches for an ASL fingerspelling dataset as a proxy, that is the
number to quote back.

---

## Unverified — do not promote to fact

- Downward pointing in France, Kenya or anywhere: **no source addresses the downward case at
  all.** Our "probably fine" is inference from the fact that the documented taboo concerns
  pointing *at persons* — and Kenya's best source arguably contradicts even that.
- Thumbs-up in Kenya — no reputable source either way. An assumption, not a finding.
- *jaune* as French slang for a strikebreaker — plausible, unsourced.
- The French "barre" insult gesture — **no evidence it exists under that name.** Not fabricated.
- Maasai hand-gesture etiquette, and the widely-repeated "Maasai spitting greeting" — nothing
  found from a reputable source.
- Kenyan mourning colour conventions — nothing found. Note the flag assigns **black to the
  people**, which cuts against the Western assumption.
- "45 states + DC recognise ASL" — Wikipedia's figure via NAD; the NAD PDF was unreadable.
