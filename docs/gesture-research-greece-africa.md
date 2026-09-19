# Gesture research — Greece, Nigeria, and what could not be sourced

Companion to [gesture-research-eastasia.md](gesture-research-eastasia.md). Same honesty rule:
every claim carries its confidence, and the claims that failed verification are named as such.

---

## Greece (el-GR) — `open_palm` is the blocker, and the obvious fix is also an insult

### The gesture we shipped as "wait" is the moútza

Greek Wikipedia, verbatim: *«Ο υβρίζων τείνει το χέρι του προς τον υβριζόμενο και «δείχνει» σε
αυτόν την ανοιχτή του παλάμη ενώ τα δάκτυλα του χεριού του είναι τεντωμένα.»* — the insulter
extends his hand toward the insulted and shows the open palm, fingers stretched out.

The canonical form includes a forward thrust, and proximity scales intensity. But the hand
shape itself carries the insult: English Wikipedia records that Greeks signalling the number
**five** must "take care not to overextend the fingers or face their palm towards the person,
lest it be mistaken for a mountza." **Ordinary Greeks already self-censor a static, non-thrust
spread palm.**

### The fingers-together "fix" is a named milder insult

The single most useful finding in this whole research pass. Greek Wikipedia:

> *«Μία παραλλαγή της, η «ευγενική» μούντζα, πραγματοποιείται με τον παραπάνω τρόπο, αλλά
> κρατώντας κλειστά τα δάχτυλα του χεριού. Η εν λόγω χειρονομία συνοδεύεται συχνά από τη φράση
> «φύσα!».»*

A variant, the **"polite" moútza**, is the same gesture with the fingers closed. Several travel
sites recommend exactly this as the safe version. **They are wrong, and that is actively
dangerous advice.** No palm-toward-camera flat hand of any finger spacing is safe in Greece.

### Two engineering consequences, both actionable now

1. **Statically, the moútza and our `open_palm` are the same 21 landmarks.** MediaPipe cannot
   separate them by hand shape — only by wrist translation velocity toward the camera. Keep
   `open_palm` anywhere and the system will silently classify an insult as "wait" unless a
   thrust-velocity feature exists.
2. **Never prompt a Greek visitor to perform it.** Any hint reading "hold up your open palm to
   signal wait" is instructing a Greek user to moútza the customer's doorbell. That is a
   localisation bug as much as a computer-vision one.

### Severity is legal, not merely social

Greek Penal Code **Art. 361** (*εξύβριση*) covers insult "with words or deeds," explicitly
including contemptuous gestures; **Art. 361A** covers unprovoked insult by deed. Up to one
year or a fine, prosecuted on complaint.

A June 2022 Road Traffic Code proposal carried a €100 fine plus a 10-day licence suspension for
a driver who moútzas a pedestrian. **Unconfirmed** — the September 2025 summary of the current
Code does not mention gesture offences, and we could not verify the provision was enacted. The
Penal Code route is the solid one.

Still live in the 2020s: Greek drivers interviewed by Alpha TV in 2022 called it *«Είναι εθνικό
άθλημα»* — "it's a national sport." **Journalism, not survey.** No age-stratified study of
moútza recognition among Greeks under 30 exists that we could find.

### Proposed Greek substitute for "wait"

The substitute must not present the palm to the camera at all.

**Primary — raised index, «μια στιγμή»:** index extended and vertical (fingertip above the MCP
in image space), other three curled, thumb against the middle phalanx, palm **edge-on** to the
camera, static hold ~1s, no thrust. Separates cleanly from every existing gesture: from our
downward `point` by the sign of (tip.y − mcp.y), from `fist` by index extension, from
`open_palm` by three curled fingers, from `thumbs_up` by which digit is extended.

**Secondary — palm-down flat hand with a small vertical pat** (σιγά σιγά). Palm normal points
at the ground, never at the viewer.

⚠️ **Both substitutes are engineering inference, not sourced Greek emblems.** The negative
finding is well evidenced; the positive recommendations are not. Validate with a Greek speaker
before shipping.

---

## Nigeria (en-NG) — two claims we made that did not survive

### "waka" — could not be sourced

**We asserted this. It does not hold up.**

- Wikipedia's *Mountza* article says the gesture "can be viewed as offensive in particular
  tribes" in Nigeria, with Hausa *uwar ka*. The footnotes were checked: **that sentence carries
  no citation at all.**
- Wikipedia's *Obscene gesture* article contains **no mention of Nigeria, West Africa, Hausa or
  "waka" anywhere**. Its nearest claim — five digits palm-forward as obscene in "some African
  and Caribbean countries" — cites a paywalled NYT piece from 18 Aug 1996 and **does not name
  Nigeria**.
- Searches scoped to Punch, Vanguard, Guardian Nigeria and Premium Times returned nothing.
- Two genuinely relevant papers — Agwuele (2014) "A repertoire of Yoruba hand and face
  gestures," *Gesture* 14(1); Orie (2009) "Pointing the Yoruba way," *Gesture* 9(2) — **both
  403'd**. They may well document it; we could not read them.

**Position: plausible, widely attested informally, evidentially thin.** Avoid a spread-palm
thrust in Nigeria anyway, because the cost of being wrong is asymmetric. But **do not state
"waka" as established fact with a citation** — it would not survive a judge checking it.

### "Thumbs up is offensive in West Africa" — close to debunked

Traces to Roger Axtell, *Gestures: The Do's and Taboos of Body Language Around the World*
(1991). Secondary sources recirculate Axtell without examining him. Wikipedia's *Thumb signal*
article **does not mention West Africa or Nigeria at all**; its only sourced negative reading is
Iran. A 35-year-old travel book is thin ground for a product decision, and thumbs-up is
ubiquitous in Nigerian digital culture today.

**We should stop repeating this claim.**

---

## What this does to our five gestures

| Gesture | Status | Why |
|---|---|---|
| `open_palm` | 🔴 **unsafe in el-GR at any finger spacing** | is the moútza; the polite variant is also an insult; landmark-identical to "wait" |
| `fist` | 🔴 **cut globally** | pan-cultural "Threat" at 98.15%; in Japan it is triumph; in China it is the numeral 10 |
| `wave` | 🟠 **locale-gated** | US emblem; in Japan it means "no"; in Greece it is a repeated moútza exposure (inference) |
| `point` | 🟠 **needs a custom classifier** | MediaPipe has no `Pointing_Down`; collides with southern-Chinese "7" and East Asian "no" |
| `thumbs_up` | 🟡 **relabel to "good", not "yes"** | 74.85% East Asia vs 100% US; the West Africa taboo is weakly sourced |

---

## The architecture conclusion

The pan-cultural emblems are **heads, not hands**:

| Meaning | Emblem | Recognition |
|---|---|---|
| Yes | head nod | **98.18%** |
| No | head shake | **99.10%** |
| Stop | open palm | **100%** (but see Greece) |

A hand-landmark-only pipeline cannot express the culturally correct versions of hello, yes and
no in East Asia — those are a bow, a nod and a shake. MediaPipe ships **Face Landmarker** and
**Pose Landmarker** alongside Hand Landmarker.

**Recommendation: promote head nod and head shake to the primary yes/no channel.** They are
simultaneously the most universal, the most culturally safe, and the easiest to perform for
someone holding a parcel in both hands.

---

## Technical constraints verified

- MediaPipe Hand Landmarker: 21 landmarks, `num_hands` configurable, **handedness reported**
  (so a left-hand taboo is enforceable in software), image and world coordinates both output.
- **Gesture Recognizer's canned set has no `Pointing_Down`**: `Closed_Fist, Open_Palm,
  Pointing_Up, Thumb_Down, Thumb_Up, Victory, ILoveYou`. Our downward point needs Model Maker
  or hand-rolled landmark geometry.
- Colour: ground the alert palette in **ISO 3864-4** (red = prohibition, yellow = warning,
  green = safe, blue = mandatory) rather than folk colour symbolism. The standard is explicitly
  graphical "to overcome language barriers," and **WCAG 1.4.1** forbids colour as the only
  carrier of meaning anyway — which makes locale colour a tuning question, not a correctness one.
- Greek typography: uppercase **drops the tonos** but **keeps the dialytika**; the disjunctive ή
  keeps its tonos. **CSS `text-transform: uppercase` gets this wrong** — supply pre-composed
  uppercase strings for Greek.
- Sign languages, correctly named: ΕΝΓ (Greek, recognised equal to Greek by Law 4488/2017 Art.
  65 §2), NSL `nsi` (Nigeria, no government recognition), KSL `xki` (Kenya — **note the
  collision with Korean Sign Language `kvk`; use ISO codes, never the abbreviation**), ISL `ins`
  (India, ~6 million signers, the most-used sign language in the world).

---

## Not delivered — do not fill from memory

The web-search budget (200) was exhausted. **Unsourced entirely:** es-MX, pt-BR, fr-FR, en-US,
sw-KE, hi-IN. Also open: the Wikipedia claim that the palm thrust is an insult "among Greeks
**and Mexicans**" — which if true makes `open_palm` unsafe in es-MX too, and which is in
tension with the same article's claim that in Mexico and Brazil a steady repeated version means
"patience." **Unverified and self-contradicting; must be checked before it enters any matrix.**

## A trap worth knowing about

`codex-mundi.com` ranks well on exactly these queries, presents as a curated reference work with
a severity scale and a Morris/Axtell/Kendon bibliography, and is **AI-generated** — its footer
reads "generated on 2026-09-10" and none of its four academic citations carry page numbers. It
was excluded. Expect more of this class of source on cultural-gesture queries.
