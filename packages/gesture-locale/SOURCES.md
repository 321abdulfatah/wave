# Sources

Every entry in this library traces to something below, and every entry carries the grade of the
evidence behind it. Where a claim could not be sourced it is marked `unverified` rather than
dropped or asserted.

## Peer-reviewed

- **Matsumoto, D., & Hwang, H. C. (2013).** Cultural Similarities and Differences in Emblematic
  Gestures. *Journal of Nonverbal Behavior* 37(1), 1–27. DOI 10.1007/s10919-012-0143-8 —
  the backbone. Encoders in six world regions produced gestures for a standard message list;
  separate decoders from the same region judged them, with a 70% threshold on both sides. This
  is where the measured recognition rates come from, including the fist at 98.15% "Threat" and
  the nod and shake at 98.18% and 99.10%.
- **Denizci, C. (2015).** A Study on How Turkish Emblematic Hand Gestures Convey Meaning.
  *İstanbul Üniversitesi İletişim Fakültesi Dergisi* 2015/II(49), 51–73 — the purse hand as
  "good/delicious" in Turkey, the wave as refusal, the fig gesture.
- **Alsubhi, M. S. (2017).** *How Language and Culture Shape Gesture in English, Arabic and
  Second Language Speakers.* PhD thesis, University of Birmingham — the purse hand as "wait" in
  Gulf Arabic, from a native speaker.
- **Kita, S. (2009).** Cross-cultural variation of speech-accompanying gesture: A review.
  *Language and Cognitive Processes* 24(2), 145–167 — the framework: emblem form–meaning links
  are culture-specific conventions and are opaque across cultures.
- **Trovato et al. (2013).** *Paladyn* 4(2), 83–93 — Egyptian and Japanese subjects greeted by a
  robot using the other culture's greeting each reported discomfort. Close to a direct empirical
  warrant for this whole library.

## Institutional

- **National Japan Bowl Gestures Guide**, Japan-America Society of Washington DC — ちがう、ちがう
  (the wave as "no" in Japan), palm-down beckoning, ガッツポーズ.
- **Greek Wikipedia, Μούντζα** — the form, and critically the «ευγενική» moútza: the
  fingers-together variant that travel guides recommend as the safe version is itself a named
  insult.
- **Cultural Atlas** (Mosaica) — Saudi, Egyptian, Turkish, Kenyan and Mexican communication and
  etiquette pages. Curated, but tertiary; graded as institutional, not peer-reviewed.
- **Village Volunteers**, *Basic Etiquette in Kenya* — names the substitute directly: "When
  pointing to someone or something, it is polite to use all fingers of the hand."
- **NPO法人日本サービスマナー協会** — the Japanese service-industry prescription for indicating
  things with an open hand, fingers together.

## Technical

- **MediaPipe Hand Landmarker** — 21 landmarks, configurable `num_hands`, world coordinates,
  and the handedness note this library exists partly to work around: the label assumes a
  mirrored image. The canned Gesture Recognizer set has no `Pointing_Down`.

## Withdrawn

Recorded here because a claim that fails verification is worth documenting as loudly as one that
passes:

- **"Thumbs-up is obscene in West Africa."** Traces to Axtell, *Gestures: The Do's and Taboos of
  Body Language Around the World* (1991). Secondary sources recirculate it without examining it.
  Wikipedia's *Thumb signal* article does not mention West Africa or Nigeria at all; its only
  sourced negative readings are Iran and Tibet.
- **The Nigerian "waka" gesture.** Wikipedia's *Mountza* article asserts it, and the sentence
  carries **no citation**. The *Obscene gesture* article mentions no Nigeria, West Africa, Hausa
  or "waka" anywhere. Searches scoped to Punch, Vanguard, Guardian Nigeria and Premium Times
  returned nothing. Two relevant papers — Agwuele (2014) and Orie (2009), both in *Gesture* —
  were paywalled and may well document it. The `en-NG` entry withholds the gesture anyway and
  says plainly that it is doing so on asymmetric cost, not on evidence.

## Known gaps

`es-MX`, `pt-BR` and `hi-IN` had thinner research passes than the rest. Wikipedia lists Mexico
among moútza analogues while also claiming the repeated version means "patience" there — two
statements in tension, both uncited. **Meo-Zilio & Mejía, *Diccionario de gestos: España e
Hispanoamérica* (Instituto Caro y Cuervo, 1980–83)** is the right primary source and was not
reachable.

A trap worth knowing: `codex-mundi.com` ranks well on exactly these queries, presents as a
curated reference with a severity scale and an academic bibliography, and is **AI-generated** —
its footer gives a generation date and none of its citations carry page numbers.
