# Gesture research — ar-SA, ar-EG, tr-TR

Best-sourced of the three research passes. One peer-reviewed Turkish corpus study, two PhD
theses and a peer-reviewed colour paper, all read in full.

---

## The finding that outranks everything else: the Rabia sign

`open_palm` **with the thumb folded onto the palm** is the **Rabia sign** (Rabaa al-Adawiya,
2013). Egypt designated the Muslim Brotherhood a terrorist organisation in December 2013.
Documented punishments for displaying it: footballer **Ahmed Abd El-Zaher**, suspended for a
goal celebration; kung fu champion **Mohamed Youssef**, banned for a year.

In Turkey the identical sign is **Erdoğan's** personal and party emblem — strongly partisan in
the opposite direction.

**Consequence:** a thumb-position-tolerant `open_palm` classifier *will* emit Rabia on a
four-finger hand. In `ar-EG` the four-fingers-up/thumb-folded configuration must be **hard
rejected**, not absorbed into `open_palm`, and it must never be rendered as an on-screen prompt
icon in either locale.

This is not a politeness问题. It is a gesture with criminal-law and employment consequences in
one of our target locales, and our classifier would produce it by accident.

---

## `open_palm` — the danger is finger *tension and spread*

The moútza form is "extending and **spreading** all fingers… presenting the palm towards the
face… with a forward motion." Wikipedia's moútza article lists close analogues in **Iraq, the
Persian Gulf region**, Armenia, Assyrian culture, Pakistan, Nigeria, Brazil, Spain, Panama and
Mexico. **Turkey is not on that list.** Wikipedia's *Waving* article separately notes that an
outward palm with fingers "fully stretched **under tension**" is an insult rather than a
greeting (citing Axtell).

The load-bearing variable is exactly the feature we currently discriminate on. **If `open_palm`
survives anywhere in the Arabic locales, it must not require spread fingers.**

---

## The purse hand: our best Arabic substitute, and a direct collision with Turkish

**In Arabic it means "wait".** Morris et al. (1979: 44), quoted in Alsubhi's Birmingham PhD —
"the thumb and the rest of the fingers of a hand are aligned and drawn together." Kendon (2004:
229) calls it the **purse hand / finger bunch**. Alsubhi (2017), a native Saudi speaker writing
in a peer-reviewed thesis: *"when this gesture is used in my culture, it means 'slowly', but it
can also mean 'wait'."* Corresponds to *sabar* and *shway shway*.

**In Turkey the same gesture means "good / delicious".** Denizci (2015), quoting Morris (1997:
154–155) and Axtell (1998: 159): the purse hand "designates that something is good or something
tastes good in Turkish culture." Cultural Atlas corroborates independently.

> Ship one "wait" gesture across all three locales and a Turkish visitor saying *wait* is heard
> as *delicious*, while a Turkish visitor praising something is heard as *wait*.

**Locale-gate the purse hand to `ar-*` only.**

Form differs between the Arabic locales, so the detector must accept both:
- **ar-SA** — fingertips converged into an upward cone, forearm vertical, slow small vertical
  oscillation. Cultural Atlas describes a three-digit variant (thumb + forefinger + middle).
- **ar-EG** — all four fingers to thumb, **palm facing inwards**, shaken up and down.

Key on tip-cluster tightness and vertical oscillation, and stay **agnostic about palm normal** —
which is the right call anyway, since palm orientation is the least reliable quantity to recover
from 21 landmarks at doorbell distance.

Landmark test: tips 4, 8, 12, 16, 20 collapse to a cluster whose mutual distances are small
relative to palm width, with the centroid above wrist landmark 0. Trivially separable.

⚠️ Middle East Eye notes the same pinched hand, done **fast** with hard eye contact, becomes a
threat ("I'll show you"). If the UI ever animates this as a prompt, animate it **slowly and
with small amplitude**.

---

## Turkey: `wave` is a refusal, and `fist` is one landmark from an obscenity

**`wave` is actively wrong.** Denizci (2015), citing Calbris & Montredon (1986: 119): arm
slightly extended toward the addressee, **palm facing outwards**, moving side to side in the
transversal plane, designates **"refusal of an offer" — "no, thanks."** That is a near-exact
description of our `wave`, and it maps to our `fist` semantics, not our `wave` semantics. A
direct inversion, not a nuance. **Remove `wave` from tr-TR entirely.**

**`fist` adjacency.** Axtell (1998: 159), via Denizci: the **fig gesture** — fist with the thumb
protruding between the first two fingers — is obscene in Turkey. A closed fist with a partially
emerged thumb is metrically adjacent. Require the thumb clearly wrapped *across* the fingers and
**reject the intermediate state** rather than snapping it to `fist`.

No source says a plain closed fist is itself offensive in any of the three locales. That is
"unsourced, probably fine" — not "verified safe".

**No sourced Turkish "wait" emblem was found.** The purse hand is ruled *out*; nothing is ruled
*in*. Turkey's own "no" is a head-back-plus-*tsk*, and its head-shake means "please explain",
not disagreement — both invisible to MediaPipe Hands. **Open question. Do not let anyone fill
it from intuition.**

---

## Never use the OK ring gesture as a substitute

Three independent sources, three locales, all bad:
- Denizci (2015), citing Morris (1997: 51–53): a **sexual insult** in Turkey.
- Cultural Atlas: offensive in **Saudi Arabia**.
- Middle East Eye: shaken, it is *bkassrak* — "I will break you" — in Levantine Arab usage.

**Ruled out permanently.**

---

## Pointing diverges *within* Arabic — there is no pan-Arab rule

- **ar-SA:** index-finger pointing is "considered very rude"; Saudis "raise their chin and look
  in the general direction" (Cultural Atlas). The sourced substitute is a **chin raise plus
  gaze** — a head gesture, invisible to Hand Landmarker. **No hand-based substitute found.**
- **ar-EG:** "Egyptians use their index finger to point at someone or something" (Cultural
  Atlas, same source family). **Fine here.**

Every source concerns pointing *at a person*. Nothing addresses pointing **downward at the
ground**, which is our actual case and the mitigating one. **Unsourced across all three.**

---

## Colour — the Arabic semantics invert two Western defaults

Hasan, Al-Sammerai & Abdul Kadir (2011), *English Language Teaching* 4(3): 206–213, read in
full. Pan-Arabic rather than country-specific.

| Colour | Arabic reading | UI consequence |
|---|---|---|
| **Green** | Islam, paradise, growth; the paper explicitly gives *"green light = good sign"* | ✅ safe for proceed/OK |
| **Red** | love and revolution, but also execution and death | ✅ fine for alerts — the negative valence is the one we want |
| **Yellow** | envy, sickness, cruelty, dishonesty — *"yellow smile = mean"* | ❌ **not caution.** Do not use for a pending state |
| **Blue** | envy, jealousy, death, gloom | ⚠️ the default "informational" colour in every design system reads negative here. Rests on one paper — get a second opinion |
| **White** | purity and weddings, **and the shroud and coffin** — "nearly impossible to change" | ⚠️ **not a neutral background** the way Western UI assumes |
| **Black** | mourning, but also elegance (the abaya) | — |

**The "yellow = mourning in Egypt" claim does not survive.** The only peer-reviewed treatment
read in full does not list mourning among yellow's meanings; it assigns mourning to black and a
death association to white. The yellow claim traces to *ancient* Egypt, and even there the
sources indicate white was worn to funerals. Avoid yellow in ar-EG — but for the sourced
envy/sickness reading, not for mourning.

**Design conclusion, and it is the robust one:** ground the alert palette in **ISO 3864-4**
(red = prohibition, yellow = warning, green = safe, blue = mandatory) rather than folk colour
symbolism. The standard is explicitly graphical "to overcome language barriers," and **WCAG
1.4.1** forbids colour as the sole carrier of meaning anyway — which demotes locale colour from
a correctness problem to a tuning one.

---

## Engineering hazards that will bite the codebase

**Turkish dotted and dotless i.** Turkish has four I-letters: `i`/`İ` and `ı`/`I`.
`toUpperCase("i")` is `"İ"` (U+0130), **not** `"I"`; `toLowerCase("I")` is `"ı"` (U+0131). This
silently breaks case-insensitive matching in the `tr` locale across Java, PHP, Oracle and .NET —
the classic failure is a keyword lookup where lowercased `"QUIT"` no longer equals `"quit"`.

> **Rule for this codebase:** never use locale-sensitive case folding for identifiers, gesture
> names, config keys or locale codes. Use `toLocaleUpperCase('en-US')` or an invariant
> comparison. Locale casing is for displayed text only.

**Mirroring flips handedness.** Doorbell previews are commonly mirrored. MediaPipe's `handedness`
label flips with the frame, so any right/left logic — and a left-hand taboo *is* right/left
logic — must be keyed to the **un-mirrored** frame.

**The left-hand taboo differs between our two Arabic locales.** Cultural Atlas's Saudi page
explicitly includes **waving and gesturing**; the Egyptian page confines it to eating and
passing items. Treat them separately. Kita & Essegbey (2001), "Pointing left in Ghana," shows
such taboos genuinely reshape spontaneous gesture — speakers tuck the left hand behind the back
and point rightward at leftward things — but that is Ghana, not Arabia, and not camera-mediated.
**Inference, not citation.** Expect a right-hand bias in the input distribution; never treat a
left-handed performance as a negative signal.

---

## Sign languages — name them correctly, and do not merge them

**"Arabic Sign Language" is not one language, and saying so is contested by Deaf Arabs
themselves.** Al-Fityani, Kinda (2010), *Deaf People, Modernity, and a Contentious Effort to
Unify Arab Sign Languages*, PhD dissertation, UC San Diego (committee chaired by Carol Padden),
read in full:

- A unified dictionary was released in 2001 with pan-Arab governmental backing.
- Lexicostatistical analysis of five natural sign languages (Israel, Jordan, Kuwait, Libya,
  Palestine) finds they are "unlikely to be descendants of a common ancestor," so unifying them
  "would be unsound by scholarly linguistics standards."
- Deaf Arabs object that they "cannot understand the unified sign language nor can they find a
  purpose or utility in it," and see it as threatening their natural languages.

**Never ship "Arabic Sign Language" as a single option. Name the national language.**

- **لغة الإشارة السعودية** — Saudi Sign Language, own vocabulary and grammar. CSIS (2014):
  roughly **one interpreter per ~93,000** hearing-impaired people, versus one per 46 in
  California.
- **لغة الإشارة المصرية** — Egyptian Sign Language. ~1.2 million deaf and HoH people aged 5+.
  **No grammatical description exists.** Al-Fityani records **four different manual alphabets**
  in use as of 2006. No formal legal recognition found.
- **Türk İşaret Dili (TİD)** — ~250,000 signers, a **language isolate**, SOV with clause-final
  modals. Partial recognition via Disability Law No. 5378 (1 July 2005), arts. 15 and 30. Uses a
  **two-handed** manual alphabet — so a single-hand 21-landmark pipeline **structurally cannot**
  do TİD fingerspelling. Do not imply otherwise in the pitch.

---

## Politeness register

All three locales communicate **indirectly**. Egypt specifically: Egyptians "typically avoid
saying 'no' directly" (Cultural Atlas). That is operationally important — **a door agent that
forces a binary yes/no is demanding a culturally dispreferred speech act.** Make the "no" path
expressible as deferral rather than refusal.

Turkish register mechanics (snippet-level, needs a native check): `siz` for any unfamiliar
adult; **`buyurun`** as the all-purpose service opener; `efendim` for "sir/madam"; honorifics
`Bey`/`Hanım` follow the **first** name. Since a door agent is effectively an automated
announcement, `-(y)InIz` imperatives are arguably the correct register.

⚠️ **السلام عليكم for an automated agent: unresolved, and not a web-search question.** The fiqh
sources concern person-to-person greeting between people of known faith. A door agent greets
anyone who arrives. A religiously-marked greeting carries mismatch risk in both directions and
**needs a native-speaker review, not a search.**

Also sourced for ar-SA, and it matters for a camera product: **do not photograph people,
especially women, without permission.**

---

## Unresolved — do not fill from memory

1. Thumbs-up in **Egypt** specifically — no source found; Iraq/Iran evidence does not transfer.
2. Thumbs-up in the **Gulf**, measured — evidence genuinely split. Slate (2003) via Axtell and
   the US Army DLI manual calls it "the foulest of Iraqi insults"; the *same* DLI manual says
   Arabian Peninsula populations adopted it post-1991 as a cooperation symbol; Cultural Atlas's
   Saudi page enumerates offensive gestures and **does not list it**. Treat as **ambiguous, not
   offensive by default** — accept it as input, never *prompt* for it.
3. A **tr-TR "wait"** gesture.
4. A **hand-based `point` substitute for ar-SA**.
5. Whether the **left-hand taboo applies to camera-mediated gesture** anywhere.
6. **Turkish colour semantics** — snippet-level only. The Arabic colour paper does **not** apply
   to Turkey.
7. The **greeting formula** question above.

---

## Sources read in full

- Denizci, C. (2015). "A Study on How Turkish Emblematic Hand Gestures Convey Meaning."
  *İstanbul Üniversitesi İletişim Fakültesi Dergisi* 2015/II(49): 51–73. DOI 10.17064/iüifhd.57009
- Alsubhi, M. S. (2017). *How Language and Culture Shape Gesture in English, Arabic and Second
  Language Speakers.* PhD thesis, University of Birmingham.
- Al-Fityani, K. (2010). *Deaf People, Modernity, and a Contentious Effort to Unify Arab Sign
  Languages.* PhD dissertation, UC San Diego.
- Hasan, A. A., Al-Sammerai, N. S. M., & Abdul Kadir, F. A. (2011). "How Colours are Semantically
  Construed in the Arabic and English Culture." *English Language Teaching* 4(3): 206–213.
- Cultural Atlas: Saudi Arabian, Egyptian and Turkish communication + etiquette pages.
- W3C Internationalization WG, *Arabic & Persian Layout Requirements* (ALReq).
- UAE Government Design System — Typography (Noto Kufi Arabic; note it uses **identical** sizes
  to the Latin stack, contradicting the common "set Arabic 20–30% larger" advice).
- Slate (2003); CSIS (2014); Middle East Eye (2020).

**Quoted within those sources, not read directly:** Morris et al. (1979: 44); Morris (1997: 51–53,
131, 154–155, 273–274); Axtell (1998: 159–160); Kendon (2004: 229); Kita & Essegbey (2001);
Calbris & Montredon (1986); Barakat (1973).

**Paywalled, not read:** Aslam (2006); Madden, Hewett & Roth (2000); Washington Post (2017) on
the Saudi thumbs-up.
