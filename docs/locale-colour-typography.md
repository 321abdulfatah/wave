# Colour and typography — ja-JP, ko-KR, zh-CN

The research pass that produced the most directly implementable rules. Several widely repeated
"facts" did not survive; the survivors are narrow, cheap and real.

---

## The one that would have embarrassed us: 紅白 in Japan

**Red-and-white is the visual grammar of celebration in Japan, not alarm.** 紅白 (*kōhaku*)
signifies *hare*, the celebratory register: 紅白幕 (celebration curtains), 紅白餅, 紅白饅頭, all
縁起物 — auspicious items. The pairing traces to the Genpei War banners.

A red alert on a white card is the most natural thing a Western designer will reach for. In
Japan it reads as bunting.

**Fix:** red on a neutral, grey or dark surface. Never red-on-white as the alert treatment.

**And the companion finding:** black, not white, is the Japanese funeral colour *today*. The
switch is datable — at Ōkubo Toshimichi's funeral in 1878 the upper classes wore black,
explicitly 「西洋のブラックフォーマルにならったものである」, modelled on Western black formal wear.
So a black-dominant "serious" theme carries a funerary tint in Japan that it does not carry
elsewhere. Our current dark UI is worth a second look for ja-JP.

---

## "White means death in East Asia" is only two-thirds true

| Locale | Verdict |
|---|---|
| **zh-CN** | ✅ attested — funerary rites are 白事 (*báishì*, "white affairs"), white tied to *yin* and ghosts |
| **ja-JP** | ⚠️ **historically** yes (16th-c. Jesuit records; Edo-period white hemp), but **black today** |
| **ko-KR** | ❌ **not verified, and the evidence cuts the other way** |

The Korean case is worth stating plainly because we would have got it wrong. **백의민족** — "the
white-clad people" — is a well-cited article describing white as **ordinary everyday Korean
dress for centuries**, attested in the Chinese *Records of Wei* on Buyeo, in Choe Nam-seon,
Oppert and Yanagi Muneyoshi. The English *Korean funeral* article contains **no colour claims at
all**. The modern hemp burial-garment convention is described as substantially a **Japanese
colonial imposition** — 「일제의 잔재」 — and does not specify colour.

**Do not build a Korean design rule on white, in either direction, without a Korean reviewer.**

---

## Korea: never render a person's name in red

The one sharp, cheap, actionable Korean rule found. Attested by Korea.net (official ROK portal,
contributor section) and the **Dartmouth Folklore Archive** (collected from Sunglim Kim, a
Dartmouth art historian raised in Seoul; the collector notes multiple independent informants).

The *practice* is well attested. The *origin* stories conflict — funeral wreaths and death
certificates in one account, execution decrees in the other — so **cite the taboo, never the
explanation.**

**Implementation:** if the agent ever renders a visitor's name — "Unknown person at door", a
saved contact, a recognition label — that string must not be red, even inside an otherwise-red
alert. Keep red in the icon, border or badge; keep the name in default foreground. One CSS rule.

**Does it extend to China or Japan?** No acceptable source either way. Given red's auspicious
loading in China and 紅白 in Japan, **do not assume it is pan-CJK.**

---

## Red as an alert colour in China: legally standardised, and it works

The Chinese national safety-colour standard assigns:

| | |
|---|---|
| 红 red | 禁止、停止、**紧急告警** — prohibition, stop, emergency alarm |
| 黄 yellow | 危险、警告、注意 — danger, warning, caution |
| 蓝 blue | 指令 — mandatory instruction |
| 绿 green | 提示、**安全**、通行 — advisory, safe, proceed |

This maps cleanly onto **ISO 3864**. Red-as-alert is not confusing to a mainland Chinese user —
it is the legally standardised meaning in their own built environment. The festive red of 红包
and weddings is a *different register*, cued by gold, pattern and seasonal framing, not by hue.

**But do not lean on red/green alone.** Kawai, C. et al. (2022), "The good, the bad, and the
red," *Psychological Research* 87(3):704–724 — red *is* implicitly negative for Chinese
participants, but **significantly less so**: a congruence effect of 32.42 ms in Mainland China
versus 76.84 ms in the Western group, roughly 2.4× weaker. In the red–white opposition there was
no meaningful cultural difference. Green was consistently positive across all cultures.

Read precisely: red-negativity is **attenuated, not absent**. Red still works as an alert. But a
red-versus-green-only encoding transmits materially less urgency to a zh-CN user — which is an
argument for pairing every state with an **ISO 7010 icon shape** (triangle = warning,
circle-with-bar = prohibition, square = safe) and a **text label**. WCAG 1.4.1 requires that
anyway.

---

## 黄色 and 绿帽子: both real, both misread by design blogs

**黄色 = pornographic is lexical, not chromatic.** Wiktionary documents the attributive sense
(黃色書籍, 黃色電影), *and* — the part usually missed — the **single character 黄 carries the
colloquial sense on its own**: 黃片, 黃賭毒, 掃黃.

So the common advice ("only in set phrases") is understated. But the risk is **in the copy, not
the palette**. A yellow swatch is not obscene; yellow is the national standard for 警告. The
hazard is a UI string where 黄色 sits attributively before a content-ish noun. 「黄色警报」 is
fine and idiomatic; a filter chip reading just 「黄色」 next to content categories is asking for
it. *(The yellow-journalism etymology is single-sourced — the sense is solid, the origin is not.)*

**戴绿帽子 is about hats, not green.** The idiom derives from 綠頭巾 and is bound to the object
worn by a man. It does not generalise to green surfaces, text, status dots or buttons — and
against it stands 绿 = 安全 in the national standard. **Green is the correct "all clear" colour
in a Chinese UI.** The one real caveat: **do not put a green hat on any illustrated character or
avatar.** That is an illustration review item, not a palette item.

---

## Never name a colour in UI copy

The blue/green lexical boundary does not sit where a designer assumes, in **any** of the three:

- **Japanese** 青 (*ao*) still covers greens — including, notably, the **"go" colour on a traffic
  light**. 緑 (*midori*) only separated in the Heian period.
- **Chinese** 青 (*qīng*) spans light yellowish-green through deep blue to black. 青天 is sky-blue;
  青菜 is a green vegetable.
- **Korean** 푸르다 covers both — 푸른 하늘 (blue sky), 푸른 숲 (green forest); 파랗다 means blue but
  "exceptionally means green" in 파란 불, the green light.

**Never write "tap the green button" or "the blue indicator means…".** Refer to controls by
label, position or icon. This is also the accessible choice, so it costs nothing.

---

## Typography rules that will bite the codebase

### `lang` is mandatory, and the reason is Han unification

The Unicode core spec, chapter 18, disclaims this explicitly: *"The Unicode Standard leaves the
issues of language tagging and word recognition up to a higher level of software and does not
attempt to encode the language of the Han characters."*

**The codepoint does not carry the locale. The markup must.** W3C: "text in Simplified Chinese,
Traditional Chinese, Japanese, and Korean languages may share the same code point for an
ideographic character, but speakers of these languages expect the glyphs used to vary" —
illustrated with 雪. A ja-JP user seeing kanji rendered through a Simplified-Chinese fallback
font sees characters that look subtly **wrong**. In a security product that is a trust signal we
cannot afford to get wrong.

Set `lang` on `<html>` — not `<body>`, which misses `<head>` — and on every inline span that
switches language.

### Tag the region, not just the script

CLReq (W3C, eds. Fuqiao Xue and Richard Ishida) is sharper than the usual simplified/traditional
binary: *"For most typographic rules… regional differences are more than differences between
Simplified and Traditional Chinese… It is recommended that user agents distinguish typographical
rules by region rather than Traditional or Simplified."*

**Use `zh-Hans-CN`**, not bare `zh` and not bare `zh-Hans`.

### Line breaking is *opposite* for Korean and for Japanese/Chinese

Per UAX #14 and JLReq/CLReq, Japanese and Chinese are set 「ベタ組」 — solid, square character
frames, no inter-word spacing — so **lines break almost anywhere**, and that is correct.

Korean does not work that way. **한글 맞춤법 Article 2** (문화체육관광부 고시 제2017-12호, 2017-03-28),
verbatim: 문장의 각 단어는 띄어 씀을 원칙으로 한다 — *each word in a sentence is, in principle,
written with spaces between.* Particles (조사) attach to the preceding word with no space.

| Locale | Rule |
|---|---|
| ja-JP | `line-break: strict` — loose breaking strands a 。 or 」 at line start |
| zh-CN | default breaking; **do not** use `word-break: keep-all`, it causes overflow |
| ko-KR | **`word-break: keep-all`** + `overflow-wrap: break-word` |

**Do not share one CSS rule across the three.**

### Size and leading

W3C's text-size article, with a worked example: English "views" → Chinese 次檢視 at **1.2×**
(expansion), Korean 조회 at **0.8×** (contraction). Character count misleads badly — "desktop"
becomes デスクトップ, fewer characters but much wider.

CJK also needs more vertical space. **Budget `line-height` 1.6–1.7 for CJK versus ~1.4 for
Latin, and never fix an alert card's height.** The Korean contraction case matters too: a label
at 0.8× leaves a button under-filled, so centre rather than stretch.

### Vertical writing: skip it

All three are horizontal LTR today. Japanese retains vertical heavily in newspapers and novels,
and it remains culturally important for Traditional-Chinese regions — but **no locale requires
it for a functional alert interface**. Do not spend effort on `writing-mode: vertical-rl`.

---

## The defensible position on colour, overall

Ground the alert palette in **ISO 3864-4** — red = prohibition, yellow = warning, green = safe,
blue = mandatory — reinforced by China's own national safety standard, which matches it. That
semantics is legally standardised, environmentally reinforced, and identical across all three
locales.

Then apply exactly three evidence-backed per-locale deltas:

1. **ja-JP** — no red-on-white decorative alert treatment (紅白 is celebratory); reconsider a
   black-dominant theme (black is the funeral colour there).
2. **ko-KR** — never render a person's name in red.
3. **zh-CN** — watch the word 黄色 in copy, not the yellow swatch; no green hats in illustration.

Everything else is folk symbolism that did not survive sourcing.

---

## Explicitly unverified — do not promote these to fact

1. "White = mourning in Korea" — evidence cuts the other way.
2. The origin of the Korean red-ink taboo — two conflicting low-tier accounts.
3. Whether the red-name taboo extends to China or Japan — no source either way.
4. Chinese stock markets using red = up, green = down — widely repeated, could not verify.
5. GB standard number and year for 安全色 — the mapping is solid, the citation is not.
6. JIS Z 9101 / Z 9103 details — both candidate sources 404'd. Japanese and Korean adoption of
   ISO 3864 is **presumed, not verified**.
7. Etymology of 黄色 from "yellow journalism" — single-sourced; the sense is solid, the origin is not.
8. **Marcus & Gould (2000)**, *Interactions* 7(4):32–46 — a real paper, routinely cited by design
   blogs for colour claims. It is a **Hofstede-dimensions paper, not a colour-semantics paper.**
   Do not cite it for colour.
9. Jonauskaite et al. (2020), *Psychological Science* — SAGE 403'd; abstract only. Its thesis is
   *universality shaped by linguistic and geographic proximity*, which argues **against** strong
   locale-specific colour rewrites.

---

## Sources read

**Standards:** UAX #14 (Unicode 18.0.0, rev 57, 2026-09-01) · Unicode core spec ch. 18 ·
W3C JLReq · W3C CLReq · W3C KLReq · W3C i18n *qa-lang-why*, *qa-html-language-declarations*,
*article-text-size* · ISO 3864 (via en-wiki; iso.org 403'd)

**Government:** 한글 맞춤법 Art. 2, 문화체육관광부 고시 제2017-12호, National Institute of Korean
Language · Korea.net

**Peer-reviewed:** Kawai et al. (2022), *Psychological Research* 87(3):704–724,
doi 10.1007/s00426-022-01697-5 · Wei Bi (2024), *Roczniki Humanistyczne* 72(9) — **abstract only**

**Lexicographic:** Wiktionary 黃色, 黃, 戴綠帽子

**Tertiary, citations checked:** ja-wiki 喪服, 紅白 · ko-wiki 백의민족, 수의 · zh-wiki 安全色 ·
en-wiki Color in Chinese culture, Obangsaek, Distinction of blue and green in various languages

**University archive:** Dartmouth Folklore Archive — red-ink name taboo
