# Gesture research — East Asia (ja-JP, ko-KR, zh-CN)

Status: **sections 1–2 sourced, sections 3–6 not delivered** (colour, typography, sign
language, politeness register). The session's web-search budget was exhausted before those
ran. Do not fill them from memory — re-run with search budget.

Source grades: **[A]** peer-reviewed · **[B]** named institutional publisher · **[C]** tertiary.

---

## The headline: four of our five gestures are wrong

Matsumoto, D., & Hwang, H. C. (2013). *Cultural Similarities and Differences in Emblematic
Gestures.* Journal of Nonverbal Behavior 37(1), 1–27. DOI 10.1007/s10919-012-0143-8 **[A]**

An empirical emblem catalogue: encoders in six world regions produced gestures for a standard
message list, then separate decoders from the same region judged them. Inclusion required ≥70%
production and ≥70% recognition. The East Asia cell had 27 encoders and 209 decoders (127
China, 42 Japan, 40 Korea). This gives us **measured recognition rates instead of anecdote.**

| Our mapping | What the data says | Verdict |
|---|---|---|
| `open_palm` = wait | **"Stop" is pan-cultural at 100%** | ✅ the only one that survives |
| `thumbs_up` = yes | "Good" at **74.85%** in East Asia vs **100%** in US and Latin America. Pan-cultural "yes" is a **head nod (98.18%)** | ⚠️ means *good*, not *yes* |
| `wave` = hello | A **US** emblem (98.20%). The East Asian greeting emblem is a **waist bow (79.10%)** | ❌ wrong region |
| `fist` = no | Pan-cultural "No" is a **head shake (99.10%)**. A fist is pan-culturally **"Threat" at 98.15%** | ❌ **cut immediately** |
| `point` (index, down) | A **US** emblem (98.20%) with no East Asian counterpart. East Asian "Insult—little finger" is a digit **pointing downward** (70.00%) | ⚠️ downward digits are not inert |

Three further collisions, East Asia specific:

- **East Asian "No" (82.20%)** is an index finger moving **side to side**. Our `point` handshape,
  moved sideways, *is* their "no".
- **East Asian "Come" (78.20%)** is palm **down**, fingers fluttered toward self. **Pan-cultural
  "Go away" (100%)** is palm **down**, fingers fluttered **away**. Identical palm orientation,
  opposite meaning, distinguished only by curl direction — a near-worst case for a landmark
  classifier, and the failure mode is telling a visitor to leave when you meant come in.

**Limitations the authors state:** China/Japan/Korea are pooled into one bucket; 24 of 27 East
Asian encoders were immigrants in the US; absence of a gesture may mean it missed the 70%
threshold, not that it does not exist.

---

## Japan — two verified collisions

*National Japan Bowl 2024 Gestures Guide*, Japan-America Society of Washington DC **[B]**

- **Our `wave` is Japan's "no".** ちがう、ちがう — "palm facing out, right in front of your nose,
  wave your arm back and forth" — means *that is wrong / no*. So two of our five gestures would
  both read as "no" in Japan, and neither would mean what we intend.
- **Beckoning is palm down**, bent at the wrist. The guide itself notes this "looks like the
  American 'Shoo!'".
- **A raised fist is ガッツポーズ — triumph**, not refusal. Combined with the pan-cultural
  "threat" reading, `fist` = no has *no* supporting reading in Japan.
- Incidental: children are taught an **open hand at crosswalks** for "please stop" (reinforces
  open_palm); **Japanese finger counting runs in reverse**, so a closed fist is **five**, not zero.

The service-industry prescription for indicating things — palm toward the person, fingers
together — comes from NPO法人日本サービスマナー協会 **[B]**. Note it prescribes the open hand but
does **not** state that index pointing is rude; that inference is ours and is under-sourced.

---

## Korea — weakest evidence, flagged honestly

- All East Asia numbers above include 40 Korea-born decoders but **cannot be disaggregated**.
- **The "palm-up beckoning is for dogs in Korea" claim could NOT be sourced.** Every hit was a
  listicle or expat blog. The one credible lead (USC Digital Folklore Archives) failed on a TLS
  error. **Unverified — do not ship it as a claim.**
- **Counter-evidence:** *Korean etiquette* **[C]** says younger South Koreans commonly greet by
  waving side to side. If true, Korea may tolerate `wave` = hello far better than Japan.
  **Contested.**

---

## China — numeral collisions

- **Thumbs up: no negative reading found** in any of the three locales. The widely repeated
  "means number one in China" line is tagged *citation needed* on Wikipedia **[C]**. The sourced
  negative readings are Iran and Tibet — both out of scope.
- **A closed fist is the numeral 10**; an extended index is **1**; and in **coastal southern
  China, 7 is the index pointing down with the thumb extended** — our `point` plus a thumb. That
  is the closest numeric collision in the matrix, and it is regional, so it misfires in the
  south and not the north.
- **拱手/抱拳 as a substitute carries a funeral failure mode.** Hand order inverts for
  inauspicious occasions (吉事尚左，凶事尚右) and again by gender. Getting it backwards produces a
  **funeral salute, delivered by a machine, to a stranger, at a door.** MediaPipe reports
  handedness so it is gateable — but the sources are thin and partly self-contradicting.
  **Do not ship without a native reviewer.**

---

## The architecture finding

Three of the five culturally correct East Asian equivalents — **bow, head shake, head nod** —
are **not hand gestures at all**. A hand-landmark-only pipeline cannot express the East Asian
versions of hello, yes and no.

And the pan-cultural winners are heads, not hands:

| Meaning | Pan-cultural emblem | Recognition |
|---|---|---|
| Yes | head nod | **98.18%** |
| No | head shake | **99.10%** |
| Stop | open palm | **100%** |

That is a stronger vocabulary than anything we can build from hands alone, and it is *more*
culturally portable, not less. MediaPipe ships Face Landmarker and Pose Landmarker alongside
Hand Landmarker.

**Recommendation: add head nod and head shake as the primary yes/no, keep open_palm as stop,
demote thumbs_up to "good", and cut `fist` entirely.**

---

## Substitutes assessed

MediaPipe confirmed: 21 landmarks per hand, configurable `num_hands`, per-hand handedness, 3D
world coordinates. Detectability judgements below are engineering opinion, not cited.

| Replace | With | Detectable from hands? |
|---|---|---|
| `point` | **Flat presentation hand** — fingers extended and *together*, palm angled up 30–45° | ✅ **best substitute found.** Finger adduction and palm normal are both robust, and adduction cleanly separates it from the spread-finger `open_palm` |
| `thumbs_up` | keep, relabel to "good" | ✅ trivially detectable; the problem is semantic |
| `open_palm` | keep | ✅ |
| `wave` | bow, or move greeting out of the gesture channel | ❌ torso, needs Pose |
| `fist` | head shake, or the Japanese batsu × | ❌ needs Face or Pose |

**Do not adopt palm-down beckoning as a substitute** — see the come/go-away collision above.

---

## Sources fetched

**[A]** Matsumoto & Hwang (2013), JNB 37(1) 1–27 · Kita (2009), *Language and Cognitive
Processes* 24(2) 145–167 (framework only; no CJK emblems)

**[B]** [National Japan Bowl 2024 Gestures Guide](https://japanbowl.org/wp-content/uploads/2024/02/2024-JB-Gestures-Guide_final-Ver.pdf) ·
[日本サービスマナー協会](https://www.j-manner.com/service/cat41/post-4.html)

**[C]** Wikipedia: Thumb signal · Chinese number gestures · List of gestures · Beckoning sign ·
Fist-and-palm · Korean etiquette · zh 揖禮

**Unread leads:** Kendon & Versante (2003) "Pointing by hand in Neapolitan" (paywalled);
Brosnahan & Okada (1990) *Japanese and English Gesture*; Ishida et al. (2007)
*Intercultural Collaboration*.

**Explicitly unsourced:** Korean palm-up beckoning; whether pointing *at the ground* is rude
anywhere (no source addresses the downward case at all); any negative CJK thumbs-up reading.
