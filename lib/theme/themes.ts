/**
 * Per-locale theming for WAVE.
 *
 * The base theme — "Warm Domestic", defined in app/globals.css — stays the
 * fallback. Everything here is a DEPARTURE from it, and every departure cites
 * the finding that forced it. Where the honest answer is "no sourced reason to
 * differ", the theme carries `sameAsBase: true` and repeats the base values
 * rather than inventing a local flavour. An unjustified palette is a liability.
 *
 * Three constraints govern the whole file and none of them are negotiable:
 *
 *  1. **ISO 3864-4 supplies the alert semantics** — red = prohibition,
 *     yellow = warning, green = safe, blue = mandatory — not folk colour
 *     symbolism. The standard is legally binding signage in every market here
 *     and China's own national safety-colour standard matches it. Folk
 *     symbolism did not survive sourcing; the standard did. pt-BR is the single
 *     documented exception, and it says so in its own rationale.
 *
 *  2. **WCAG 1.4.1** — colour never carries a state alone. Theming may change
 *     hue; it may not make hue load-bearing. Every state in the preview also
 *     has an ISO 7010 shape and a text label.
 *
 *  3. **Contrast is measured, not eyeballed.** Every ratio in `contrast` below
 *     was computed from the hex values in this file with the WCAG 2.x relative
 *     luminance formula. All body pairs clear 4.5:1.
 *
 * Sources: docs/locale-colour-typography.md (ja/ko/zh),
 * docs/gesture-research-mena.md (ar/tr), docs/locale-research-fr-us-ke.md,
 * docs/gesture-research-greece-africa.md (el/en-NG), and the `colour` and
 * `text` fields already carried by lib/gestures/locales.ts.
 */

/** Colour tokens. Names match the custom properties in app/globals.css. */
export interface ThemeColours {
  paper: string
  paper2: string
  paper3: string
  card: string
  /** Body ink. Never lighter than 4.5:1 on `card`. */
  ink: string
  ink2: string
  ink3: string
  /** Prohibition / alert tier — ISO 3864-4 red. */
  clay: string
  clay2: string
  clayWash: string
  clayLine: string
  /** Warning tier — ISO 3864-4 yellow, hue-shifted where a locale forbids it. */
  ochre: string
  ochreInk: string
  ochreWash: string
  ochreLine: string
  /** Safe tier — ISO 3864-4 green. Teal in pt-BR only, and that is argued. */
  sage: string
  sageWash: string
  sageLine: string
  line: string
  line2: string
}

/**
 * Typography tokens. These are new: app/globals.css hardcodes the Fraunces
 * stack inside `.display`, which cannot be themed. The base values here are
 * identical to what globals.css already renders, so factoring them out changes
 * nothing for en-US.
 */
export interface ThemeType {
  fontDisplay: string
  fontSans: string
  /**
   * Deliberately 1 everywhere, including Arabic. The UAE Government Design
   * System sets Noto Kufi Arabic at the SAME sizes as the Latin stack, which
   * contradicts the widespread "set Arabic 20-30% larger" advice.
   */
  fontScale: string
  /** ~1.4 for Latin, 1.6-1.7 for CJK, 1.8 for Devanagari. */
  leading: string
  leadingDisplay: string
  trackingDisplay: string
  /** Forced to 0 for Devanagari: tracking shatters the shirorekha. */
  trackingEyebrow: string
  /** `none` for Greek — CSS uppercase mishandles the tonos. */
  eyebrowTransform: string
  /** `keep-all` for Korean, `normal` for Japanese and Chinese. Never shared. */
  wordBreak: string
  overflowWrap: string
  /** `strict` for Japanese: loose breaking strands a 。 or 」 at line start. */
  lineBreak: string
}

export interface LocaleTheme {
  code: string
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  /** What belongs on <html lang>. zh is tagged by region per CLReq. */
  htmlLang: string
  /**
   * True when this theme's COLOUR tokens are byte-identical to the base — i.e.
   * no sourced reason to differ was found. Such a locale may still carry
   * typography deltas (script coverage is not a matter of taste), so read
   * `type` as well as this flag.
   */
  sameAsBase: boolean
  colours: ThemeColours
  type: ThemeType
  /** Which research finding drove each departure. One entry per decision. */
  rationale: string[]
  /** Measured WCAG 2.x contrast ratios. Body text pairs must be >= 4.5. */
  contrast: Record<string, number>
}

export const THEMES: Record<string, LocaleTheme> = {
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    dir: 'ltr',
    htmlLang: 'en-US',
    sameAsBase: true,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#a3432a',
      clay2: '#c2603d',
      clayWash: '#f6e1d5',
      clayLine: '#e6c4b2',
      ochre: '#c58a2b',
      ochreInk: '#815510',
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#44614a',
      sageWash: '#e7eee4',
      sageLine: '#cbdac6',
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "No departure. lib/gestures/locales.ts records only ANSI Z535 for en-US — DANGER white-on-red, WARNING black-on-orange, CAUTION black-on-yellow — which is the same semantics the base already encodes from ISO 3864-4.",
      "The base clay / ochre / sage triad already maps red = prohibition, amber = warning, green = safe. Restating it in different hex would be change without a finding behind it.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.04,
      "clay/clay-wash": 4.91,
      "ochre-ink/card": 6.33,
      "ochre-ink/ochre-wash": 5.5,
      "sage/card": 6.71,
      "sage/sage-wash": 5.81,
    },
  },

  'en-NG': {
    code: 'en-NG',
    name: 'English (Nigeria)',
    nativeName: 'English',
    dir: 'ltr',
    htmlLang: 'en-NG',
    sameAsBase: true,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#a3432a',
      clay2: '#c2603d',
      clayWash: '#f6e1d5',
      clayLine: '#e6c4b2',
      ochre: '#c58a2b',
      ochreInk: '#815510',
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#44614a',
      sageWash: '#e7eee4',
      sageLine: '#cbdac6',
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "No departure. The only colour note in lib/gestures/locales.ts is flag symbolism (green = agriculture, white = unity) plus a northern Islamic association for green — flag symbolism is not a UI constraint, and green as \"safe\" is ISO 3864-4, not a national reference.",
      "docs/gesture-research-greece-africa.md withdrew both Nigerian claims this project previously made — the \"waka\" reading of the spread palm carries no citation anywhere it could be traced, and the West-African thumbs-up taboo traces to a 1991 travel book. Having withdrawn two claims for being unsourced, inventing a Nigerian palette from nothing would be the same error in a new place.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.04,
      "clay/clay-wash": 4.91,
      "ochre-ink/card": 6.33,
      "ochre-ink/ochre-wash": 5.5,
      "sage/card": 6.71,
      "sage/sage-wash": 5.81,
    },
  },

  'fr-FR': {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    htmlLang: 'fr-FR',
    sameAsBase: false,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#a3432a',
      clay2: '#c2603d',
      clayWash: '#f6e1d5',
      clayLine: '#e6c4b2',
      ochre: '#c4600f', // departs from base
      ochreInk: '#9a4508', // departs from base
      ochreWash: '#f8e7d8', // departs from base
      ochreLine: '#e9c7ac', // departs from base
      sage: '#44614a',
      sageWash: '#e7eee4',
      sageLine: '#cbdac6',
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "The caution tier moves from yellow-gold to orange. docs/locale-research-fr-us-ke.md: a saturated yellow panel in France reads as gilets jaunes (Nov 2018 – Jun 2020, ~3m participants, peak 287,710 per the Ministry of the Interior) before it reads as caution — and the doc names orange as the substitute, which is ANSI-correct anyway.",
      "The yellow wash is replaced by a pale orange one, so no surface in the theme is a large yellow fill. Pastoureau (Jaune, Seuil 2019) supplies the older layer — greenish yellow as the colour of Judas and forgers, lexicalised in « rire jaune ».",
      "Everything else stays at base: no sourced French constraint touches the red, green or paper tiers.",
      "Type unchanged. Fraunces and Inter both carry accented capitals (À É Î Ô Ù), which the Académie française requires — « en français, l'accent a pleine valeur orthographique ». The hazard there is a locale-naive toUpperCase() in code, not the typeface.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.04,
      "clay/clay-wash": 4.91,
      "ochre-ink/card": 6.35,
      "ochre-ink/ochre-wash": 5.39,
      "sage/card": 6.71,
      "sage/sage-wash": 5.81,
    },
  },

  'el-GR': {
    code: 'el-GR',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    dir: 'ltr',
    htmlLang: 'el-GR',
    sameAsBase: true,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#a3432a',
      clay2: '#c2603d',
      clayWash: '#f6e1d5',
      clayLine: '#e6c4b2',
      ochre: '#c58a2b',
      ochreInk: '#815510',
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#44614a',
      sageWash: '#e7eee4',
      sageLine: '#cbdac6',
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Noto Serif\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'none', // departs from base
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "Palette unchanged. lib/gestures/locales.ts is explicit: \"Ground in ISO 3864-4; no reliable Greek-specific UI colour semantics found.\" A Greek palette invented to look Greek would be a costume.",
      "Display face changes for coverage, not taste: the Google Fonts API serves Fraunces in latin, latin-ext and vietnamese only — no Greek subset — so a Greek headline in Fraunces silently falls back to Georgia and loses the whole voice of the brand. Noto Serif carries greek and greek-ext.",
      "text-transform: uppercase is switched off for the eyebrow. docs/gesture-research-greece-africa.md: Greek uppercase drops the tonos but keeps the dialytika, and the disjunctive ή keeps its tonos — CSS gets this wrong. Uppercase Greek is supplied pre-composed instead.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.04,
      "clay/clay-wash": 4.91,
      "ochre-ink/card": 6.33,
      "ochre-ink/ochre-wash": 5.5,
      "sage/card": 6.71,
      "sage/sage-wash": 5.81,
    },
  },

  'tr-TR': {
    code: 'tr-TR',
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    htmlLang: 'tr-TR',
    sameAsBase: true,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#a3432a',
      clay2: '#c2603d',
      clayWash: '#f6e1d5',
      clayLine: '#e6c4b2',
      ochre: '#c58a2b',
      ochreInk: '#815510',
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#44614a',
      sageWash: '#e7eee4',
      sageLine: '#cbdac6',
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "No departure. docs/gesture-research-mena.md states it directly: \"Turkish colour semantics are snippet-level only. The Arabic colour paper does NOT apply.\" Borrowing the Arabic palette for Turkey because the locales are adjacent is exactly the error the research warns against.",
      "The real Turkish constraint is casing, not colour: toUpperCase(\"i\") is \"İ\" (U+0130) and toLowerCase(\"I\") is \"ı\" (U+0131). That is a string-handling rule, and it belongs in the i18n layer rather than in a theme. Fraunces covers U+0131 in its latin subset and U+0130 in latin-ext, so the display face renders both correctly.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.04,
      "clay/clay-wash": 4.91,
      "ochre-ink/card": 6.33,
      "ochre-ink/ochre-wash": 5.5,
      "sage/card": 6.71,
      "sage/sage-wash": 5.81,
    },
  },

  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Gulf)',
    nativeName: 'العربية',
    dir: 'rtl',
    htmlLang: 'ar-SA',
    sameAsBase: false,
    colours: {
      paper: '#f6f0e3', // departs from base
      paper2: '#efe7d6', // departs from base
      paper3: '#e6dcc6', // departs from base
      card: '#fcf7ec', // departs from base
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#9c3a22', // departs from base
      clay2: '#b8552f', // departs from base
      clayWash: '#f4ddcf', // departs from base
      clayLine: '#e2bda8', // departs from base
      ochre: '#a8622a', // departs from base
      ochreInk: '#7a4310', // departs from base
      ochreWash: '#f4e4d6', // departs from base
      ochreLine: '#e0c4ab', // departs from base
      sage: '#2f5d3a', // departs from base
      sageWash: '#e2eddd', // departs from base
      sageLine: '#bfd6b8', // departs from base
      line: '#e2d6bf', // departs from base
      line2: '#d2c2a4', // departs from base
    },
    type: {
      fontDisplay: '\'Noto Kufi Arabic\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Noto Kufi Arabic\', \'Inter\', system-ui, sans-serif', // departs from base
      fontScale: '1',
      leading: '1.7', // departs from base
      leadingDisplay: '1.18',
      trackingDisplay: '0', // departs from base
      trackingEyebrow: '0.04em', // departs from base
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "The caution tier loses its yellow. Hasan, Al-Sammerai & Abdul Kadir (2011), English Language Teaching 4(3):206–213, read in full: yellow reads as envy, sickness, cruelty and dishonesty — \"yellow smile = mean\". It is not caution here. The warning tier becomes copper, which keeps an amber position in the ISO 3864-4 ordering without the yellow reading.",
      "No surface is white. The same paper gives white as purity and weddings but also the shroud and the coffin — \"nearly impossible to change\" — so the near-white card (#fffcf6) is warmed to ivory and the paper deepened to sand. White is not the neutral background Western UI assumes it to be.",
      "Green is strengthened rather than merely kept. The source explicitly gives \"green light = good sign\", so the safe tier is the one place the Arabic reading and ISO 3864-4 agree, and it is worth leaning on.",
      "Blue is deliberately absent. The same paper puts blue with envy, jealousy, death and gloom — the default \"informational\" colour of every design system. It rests on one paper, so the response is to avoid introducing blue, not to make a claim about it.",
      "Type: Noto Kufi Arabic at the SAME size as the Latin stack (--font-scale: 1). The UAE Government Design System sets Arabic at identical sizes to Latin, which contradicts the common \"set Arabic 20–30% larger\" advice. Leading goes to 1.7 for the deeper Arabic descenders, and letter-spacing goes to zero because tracking breaks cursive joins.",
      "Layout is RTL via dir=\"rtl\"; the theme sets no physical margins, so components must use logical properties.",
    ],
    contrast: {
      "ink/paper": 13.48,
      "ink/card": 14.33,
      "ink-2/card": 7.81,
      "ink-3/card": 5.61,
      "clay/card": 6.46,
      "clay/clay-wash": 5.29,
      "ochre-ink/card": 7.45,
      "ochre-ink/ochre-wash": 6.41,
      "sage/card": 7.15,
      "sage/sage-wash": 6.33,
    },
  },

  'ar-EG': {
    code: 'ar-EG',
    name: 'Arabic (Egypt)',
    nativeName: 'العربية',
    dir: 'rtl',
    htmlLang: 'ar-EG',
    sameAsBase: false,
    colours: {
      paper: '#f6f0e3', // departs from base
      paper2: '#efe7d6', // departs from base
      paper3: '#e6dcc6', // departs from base
      card: '#fcf7ec', // departs from base
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#9c3a22', // departs from base
      clay2: '#b8552f', // departs from base
      clayWash: '#f4ddcf', // departs from base
      clayLine: '#e2bda8', // departs from base
      ochre: '#a8622a', // departs from base
      ochreInk: '#7a4310', // departs from base
      ochreWash: '#f4e4d6', // departs from base
      ochreLine: '#e0c4ab', // departs from base
      sage: '#2f5d3a', // departs from base
      sageWash: '#e2eddd', // departs from base
      sageLine: '#bfd6b8', // departs from base
      line: '#e2d6bf', // departs from base
      line2: '#d2c2a4', // departs from base
    },
    type: {
      fontDisplay: '\'Noto Kufi Arabic\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Noto Kufi Arabic\', \'Inter\', system-ui, sans-serif', // departs from base
      fontScale: '1',
      leading: '1.7', // departs from base
      leadingDisplay: '1.18',
      trackingDisplay: '0', // departs from base
      trackingEyebrow: '0.04em', // departs from base
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "Identical palette to ar-SA. The Hasan et al. (2011) colour findings are pan-Arabic rather than country-specific, and inventing an Egyptian variant on top of a pan-Arabic source would be decoration.",
      "The yellow removal here is for the sourced envy/sickness reading, NOT for mourning. docs/gesture-research-mena.md: \"the yellow = mourning in Egypt claim does not survive\" — the peer-reviewed source assigns mourning to black and a death association to white. The right constraint, from the wrong reason, is still a liability.",
      "The two locales diverge in numerals rather than in colour — Egypt conventionally uses European digits where the Gulf leans Arabic-Indic ٠-٩ — and that is a formatting concern, not a theme token.",
    ],
    contrast: {
      "ink/paper": 13.48,
      "ink/card": 14.33,
      "ink-2/card": 7.81,
      "ink-3/card": 5.61,
      "clay/card": 6.46,
      "clay/clay-wash": 5.29,
      "ochre-ink/card": 7.45,
      "ochre-ink/ochre-wash": 6.41,
      "sage/card": 7.15,
      "sage/sage-wash": 6.33,
    },
  },

  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    htmlLang: 'ja-JP',
    sameAsBase: false,
    colours: {
      paper: '#f2f1ee', // departs from base
      paper2: '#eae9e5', // departs from base
      paper3: '#dedcd7', // departs from base
      card: '#f7f6f3', // departs from base
      ink: '#24211f', // departs from base
      ink2: '#4e4a46', // departs from base
      ink3: '#67625e', // departs from base
      clay: '#9b3a2c', // departs from base
      clay2: '#b04a38', // departs from base
      clayWash: '#e5e2e0', // departs from base
      clayLine: '#c8c3c0', // departs from base
      ochre: '#a97d28', // departs from base
      ochreInk: '#7c5410', // departs from base
      ochreWash: '#efe9dc', // departs from base
      ochreLine: '#d7ccb5', // departs from base
      sage: '#3f5d48', // departs from base
      sageWash: '#e3eae3', // departs from base
      sageLine: '#c5d3c6', // departs from base
      line: '#dedcd6', // departs from base
      line2: '#c9c6be', // departs from base
    },
    type: {
      fontDisplay: '\'Noto Serif JP\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Noto Sans JP\', \'Inter\', system-ui, sans-serif', // departs from base
      fontScale: '1',
      leading: '1.65', // departs from base
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'strict', // departs from base
    },
    rationale: [
      "The paper turns from cream to a low-chroma washi grey, and the alert wash turns fully neutral. This is the 紅白 finding in docs/locale-colour-typography.md: red-and-white together is the visual grammar of CELEBRATION in Japan — 紅白幕, 紅白餅, 紅白饅頭, all 縁起物 — traceable to the Genpei War banners. A red alert on a cream-white card is the most natural thing a Western designer reaches for, and in Japan it reads as bunting.",
      "The fix the doc names is \"red on a neutral, grey or dark surface\", so the clay wash (#f6e1d5, a pink) becomes #e5e2e0, a warm grey. The red itself is kept — it is the alert hue that was never the problem; the white was.",
      "The theme stays LIGHT on purpose. Black, not white, is the modern Japanese funeral colour, and the pivot is datable: at Ōkubo Toshimichi's funeral in 1878 the upper classes wore black 「西洋のブラックフォーマルにならったものである」. A black-dominant \"serious\" theme carries a funerary tint here that it does not carry elsewhere, so ja-JP is the one locale where a dark variant would be a regression.",
      "Type: Noto Serif JP / Noto Sans JP, leading 1.65 (CJK wants 1.6–1.7 against ~1.4 for Latin), and line-break: strict, because loose breaking strands a 。 or 」 at line start. word-break stays normal — ベタ組 means lines may break almost anywhere, and that is correct.",
      "lang=\"ja-JP\" is load-bearing, not decoration. Han unification means the codepoint does not carry the locale; without it, kanji can render through a Simplified-Chinese fallback and look subtly wrong to a Japanese reader.",
    ],
    contrast: {
      "ink/paper": 14.17,
      "ink/card": 14.81,
      "ink-2/card": 8.12,
      "ink-3/card": 5.58,
      "clay/card": 6.4,
      "clay/clay-wash": 5.37,
      "ochre-ink/card": 6.2,
      "ochre-ink/ochre-wash": 5.54,
      "sage/card": 6.77,
      "sage/sage-wash": 5.97,
    },
  },

  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified, Mainland)',
    nativeName: '简体中文',
    dir: 'ltr',
    htmlLang: 'zh-Hans-CN',
    sameAsBase: false,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#b0140f', // departs from base
      clay2: '#cc2a1c', // departs from base
      clayWash: '#fadfdb', // departs from base
      clayLine: '#f0bcb3', // departs from base
      ochre: '#c58a2b',
      ochreInk: '#815510',
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#35643f', // departs from base
      sageWash: '#e5eee2', // departs from base
      sageLine: '#c6dac2', // departs from base
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Noto Serif SC\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Noto Sans SC\', \'Inter\', system-ui, sans-serif', // departs from base
      fontScale: '1',
      leading: '1.65', // departs from base
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "The red is pushed from the base's muted terracotta toward a true safety red. Red-as-alert is the legally standardised meaning in the Chinese national safety-colour standard — 红 = 禁止、停止、紧急告警 — which maps cleanly onto ISO 3864-4, so it is reinforced by the built environment the user walks through every day.",
      "The reason to strengthen it rather than merely keep it is measured: Kawai et al. (2022), Psychological Research 87(3):704–724, find red-negativity is attenuated in Mainland Chinese participants — a congruence effect of 32.42 ms versus 76.84 ms in the Western group, roughly 2.4× weaker. Red still works; it simply carries less on its own.",
      "Which is exactly why the theme does not lean on hue. Every state in the preview keeps an ISO 7010 shape (triangle = warning, circle-with-bar = prohibition, square = safe) and a text label. WCAG 1.4.1 requires that anyway; here it is also the fix for a measured effect size.",
      "Green surfaces are kept and slightly cleaned up. 戴绿帽子 derives from 綠頭巾 and is bound to the worn object — it does not generalise to green surfaces, text or status dots, and against it stands 绿 = 安全 in the national standard. The one real caveat is illustration: no green hat on any avatar.",
      "The 黄色 hazard is lexical, not chromatic, so the yellow swatch is untouched. 黄 carries the colloquial \"pornographic\" sense as a standalone morpheme (黄片, 扫黄), so the rule bites on copy: 「黄色警报」 is idiomatic and fine, a chip reading just 「黄色」 is not. The preview labels the warning chip 「警告」.",
      "Tagged zh-Hans-CN, not bare zh. CLReq: \"It is recommended that user agents distinguish typographical rules by region rather than Traditional or Simplified.\"",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.94,
      "clay/clay-wash": 5.64,
      "ochre-ink/card": 6.33,
      "ochre-ink/ochre-wash": 5.5,
      "sage/card": 6.73,
      "sage/sage-wash": 5.8,
    },
  },

  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    dir: 'ltr',
    htmlLang: 'ko-KR',
    sameAsBase: true,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#a3432a',
      clay2: '#c2603d',
      clayWash: '#f6e1d5',
      clayLine: '#e6c4b2',
      ochre: '#c58a2b',
      ochreInk: '#815510',
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#44614a',
      sageWash: '#e7eee4',
      sageLine: '#cbdac6',
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Noto Serif KR\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Noto Sans KR\', \'Inter\', system-ui, sans-serif', // departs from base
      fontScale: '1',
      leading: '1.6', // departs from base
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'keep-all', // departs from base
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "Palette unchanged, and that is the finding rather than the absence of one. The obvious move — recolour the Korean theme away from white because \"white means death in Korea\" — is NOT verified and the evidence cuts the other way: 백의민족, the white-clad people, is a well-cited description of white as ordinary everyday Korean dress for centuries, attested in the Records of Wei, Choe Nam-seon, Oppert and Yanagi. The English Korean funeral article contains no colour claims at all.",
      "One rule is added instead, and it is the sharpest per-locale rule in the whole corpus: a person's name is never rendered in red. Attested by Korea.net and the Dartmouth Folklore Archive with multiple independent informants. Red stays in the icon, border and badge; --name-ink pins the name to the default foreground even inside an otherwise-red alert.",
      "The taboo is cited, never explained — the two origin accounts (funeral wreaths and death certificates; execution decrees) conflict, and there is no acceptable source on whether it extends to China or Japan, so it is not treated as pan-CJK.",
      "Type: word-break: keep-all plus overflow-wrap: break-word. This is the OPPOSITE of ja-JP and zh-CN, and the reason is 한글 맞춤법 Article 2 (문화체육관광부 고시 제2017-12호): 문장의 각 단어는 띄어 씀을 원칙으로 한다. Korean is spaced between words, so it must not break inside them. One CSS rule must never be shared across the three.",
      "Korean also contracts rather than expands — W3C measures \"views\" → 조회 at about 0.8× — so labels are centred rather than stretched, and no alert card gets a fixed height.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 6.04,
      "clay/clay-wash": 4.91,
      "ochre-ink/card": 6.33,
      "ochre-ink/ochre-wash": 5.5,
      "sage/card": 6.71,
      "sage/sage-wash": 5.81,
    },
  },

  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    htmlLang: 'hi-IN',
    sameAsBase: false,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fdf8ec', // departs from base
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#9e2138', // departs from base
      clay2: '#b93349', // departs from base
      clayWash: '#f7e0e4', // departs from base
      clayLine: '#e9b8c1', // departs from base
      ochre: '#a08800', // departs from base
      ochreInk: '#6f5c00', // departs from base
      ochreWash: '#faf1cd', // departs from base
      ochreLine: '#e7d99c', // departs from base
      sage: '#3d5f43', // departs from base
      sageWash: '#e6eee3', // departs from base
      sageLine: '#c8d9c4', // departs from base
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Noto Serif Devanagari\', \'Fraunces\', Georgia, serif', // departs from base
      fontSans: '\'Noto Sans Devanagari\', \'Inter\', system-ui, sans-serif', // departs from base
      fontScale: '1',
      leading: '1.8', // departs from base
      leadingDisplay: '1.4', // departs from base
      trackingDisplay: '0', // departs from base
      trackingEyebrow: '0', // departs from base
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "Every orange is gone. lib/gestures/locales.ts: avoid saffron/orange ENTIRELY — simultaneously sacred (Hindu, Buddhist, Sikh), the Hindutva/BJP movement colour, and the top band of the flag. \"No reading of a saffron warning badge is inert.\" That removes both the base --ochre (a golden orange) and --clay-2 (a clear orange), which is why this is the largest palette departure in the set.",
      "The caution tier becomes haldi yellow, darkened to clear contrast. Yellow is auspicious and celebratory, so it underperforms as caution — the research says so plainly — but it is the best available warm accent precisely because it is not partisan. The underperformance is absorbed by the ISO 7010 triangle and the text label, not by the hue.",
      "The alert red is rotated away from orange toward madder/crimson, so no intermediate step between the red and the yellow can be read as saffron. Red stays bivalent here — sindoor and marriage as well as danger — which is another reason the state is never hue-only.",
      "White is not used as the all-clear. The all-clear tier is green, and the card is warmed off near-white. Hindu widowhood is marked by the SUBTRACTION of red and ornament (verified); the positive white-sari claim is only partially verified, so the theme acts on the verified half.",
      "Saffron, white and green never co-occur. There is no saffron in the palette at all, so the flag triad — whose depiction is regulated — cannot assemble by accident.",
      "Type: letter-spacing is forced to ZERO on both the display and the eyebrow. The shirorekha is drawn as part of each glyph and butts against its neighbour to form one continuous bar; tracking shatters the word. The base eyebrow ships 0.12em, so this is an override, not a default.",
      "Links get a spaced bottom border instead of an underline: the visual line in Devanagari is already at the top, and an underline collides with below-base matras. The affordance is kept; the collision is not.",
      "Leading goes to 1.8 — the tallest in the set — because Devanagari stacks matras above and below the base line.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.45,
      "ink-2/card": 7.87,
      "ink-3/card": 5.66,
      "clay/card": 7.26,
      "clay/clay-wash": 6.13,
      "ochre-ink/card": 6.18,
      "ochre-ink/ochre-wash": 5.78,
      "sage/card": 6.79,
      "sage/sage-wash": 6.07,
    },
  },

  'sw-KE': {
    code: 'sw-KE',
    name: 'Swahili (Kenya)',
    nativeName: 'Kiswahili',
    dir: 'ltr',
    htmlLang: 'sw-KE',
    sameAsBase: false,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#93231f', // departs from base
      clay2: '#ad3128', // departs from base
      clayWash: '#f6dedb', // departs from base
      clayLine: '#e8bbb5', // departs from base
      ochre: '#8a5c1c', // departs from base
      ochreInk: '#6b4514', // departs from base
      ochreWash: '#efe6d7', // departs from base
      ochreLine: '#d9c8ab', // departs from base
      sage: '#3a5c40', // departs from base
      sageWash: '#e5ede2', // departs from base
      sageLine: '#c6d8c2', // departs from base
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "Orange is removed, and this one costs something. Orange is ODM's election symbol and party colour, and orange is also the natural warning tier between yellow and red in every design system — docs/locale-research-fr-us-ke.md flags it as \"an easy trap\" for exactly that reason.",
      "The doc gives two outs: \"Use amber-toward-red, or drop the middle tier.\" This theme takes the first. The caution tier becomes a dark umber (#6b4514 ink) — an amber pulled so far down in lightness and chroma that it reads as brown rather than as ODM orange — and the alert red is pushed to a bluer, truer red so the two tiers stay separable by lightness as well as by hue.",
      "Yellow never appears beside green. Yellow + green together is the UDA pairing, and a two-state OK/caution indicator is precisely where those two would meet. Removing yellow from the caution tier removes the pairing as a side effect rather than by a separate rule.",
      "Red is kept for alerts but never as the sole signal. In Kenyan official symbolism red is sacrificial — the Kenya High Commission gives \"blood shed for independence\" — not merely \"danger\", so it carries a register the ISO reading does not cover.",
      "Paper, ink and the green tier stay at base: no source addresses them, and Kenyan mourning colour conventions could not be sourced at all. The flag assigning black to the people cuts against the Western assumption, which is a reason to leave it alone.",
      "Type unchanged — Latin, LTR, no diacritics in standard Swahili. The real constraint is that the apostrophe in ng' is a LETTER (ngoma \"drum\" vs ng'ombe \"cow\"), which is an ingest-normalisation and segmentation rule, not a theme token. The preview uses the surname Ng'ang'a deliberately.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 8.2,
      "clay/clay-wash": 6.55,
      "ochre-ink/card": 8.25,
      "ochre-ink/ochre-wash": 6.82,
      "sage/card": 7.36,
      "sage/sage-wash": 6.3,
    },
  },

  'es-MX': {
    code: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español',
    dir: 'ltr',
    htmlLang: 'es-MX',
    sameAsBase: false,
    colours: {
      paper: '#f7f0e2', // departs from base
      paper2: '#f0e7d4', // departs from base
      paper3: '#e8dcc3', // departs from base
      card: '#fdf8ec', // departs from base
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#9b3527', // departs from base
      clay2: '#b54833', // departs from base
      clayWash: '#f6e0d8', // departs from base
      clayLine: '#e7c1b3', // departs from base
      ochre: '#a3841c', // departs from base
      ochreInk: '#6f5a0c', // departs from base
      ochreWash: '#f7eecf', // departs from base
      ochreLine: '#e6d69e', // departs from base
      sage: '#1f5b52', // departs from base
      sageWash: '#dfece9', // departs from base
      sageLine: '#b8d5d0', // departs from base
      line: '#e3d6bd', // departs from base
      line2: '#d3c0a1', // departs from base
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "The flag triad is broken on two axes at once. The base theme puts sage green, a near-white card and clay red in the same component — green, white and red, which lib/gestures/locales.ts says to avoid together. The green is rotated to a deep pine-teal and every surface is warmed to sand, so neither the hue nor the white survives to assemble the flag.",
      "Rotating the green rather than only warming the white is the deliberate belt-and-braces choice: a cream card is still light enough to read as white in a photograph or a projector, and the flag reading is about what a glance produces.",
      "The yellow is pulled off marigold. In late October a saturated marigold reads as Día de Muertos decoration — festive, and off-register for an alert — so the caution tier sits at a cooler straw/amber, hue rotated away from the cempasúchil orange.",
      "Purple is absent by construction and stays that way. Purple is a mourning colour here and must not become the neutral \"info\" state — which is exactly what a designer reaching for a fourth tier would do.",
      "Type unchanged. Accents on capitals are mandatory (RAE) and á é í ó ú ü ñ ¿ ¡ are all covered by Fraunces latin/latin-ext.",
    ],
    contrast: {
      "ink/paper": 13.5,
      "ink/card": 14.45,
      "ink-2/card": 7.87,
      "ink-3/card": 5.66,
      "clay/card": 6.76,
      "clay/clay-wash": 5.65,
      "ochre-ink/card": 6.3,
      "ochre-ink/ochre-wash": 5.75,
      "sage/card": 7.4,
      "sage/sage-wash": 6.47,
    },
  },

  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português',
    dir: 'ltr',
    htmlLang: 'pt-BR',
    sameAsBase: false,
    colours: {
      paper: '#faf4ea',
      paper2: '#f4eadb',
      paper3: '#eee0cb',
      card: '#fffcf6',
      ink: '#2a2420',
      ink2: '#574c42',
      ink3: '#6e6154',
      clay: '#8e2a24', // departs from base
      clay2: '#a4392f', // departs from base
      clayWash: '#f5e0dc', // departs from base
      clayLine: '#e6bdb6', // departs from base
      ochre: '#c07d14', // departs from base
      ochreInk: '#7d5209', // departs from base
      ochreWash: '#f9ebd1',
      ochreLine: '#ebd3a6',
      sage: '#0f5c5e', // departs from base
      sageWash: '#deeceb', // departs from base
      sageLine: '#b6d5d4', // departs from base
      line: '#e6d9c5',
      line2: '#d8c6ab',
    },
    type: {
      fontDisplay: '\'Fraunces\', \'Iowan Old Style\', Georgia, serif',
      fontSans: '\'Inter\', \'Segoe UI Variable\', \'Segoe UI\', system-ui, sans-serif',
      fontScale: '1',
      leading: '1.55',
      leadingDisplay: '1.18',
      trackingDisplay: '-0.015em',
      trackingEyebrow: '0.12em',
      eyebrowTransform: 'uppercase',
      wordBreak: 'normal',
      overflowWrap: 'break-word',
      lineBreak: 'auto',
    },
    rationale: [
      "This is the theme where the default UI is the problem. Red is the historic colour of the Workers' Party and green+yellow is Bolsonaro's adopted pair, so a stock green-OK / red-alert interface puts the two most partisan colours in Brazilian politics side by side on a device mounted on someone's front door.",
      "The prescription is taken verbatim from lib/gestures/locales.ts: \"Use blue or teal for OK and amber for alert; reserve saturated red for genuine emergency.\" The safe tier becomes deep teal, the attention tier becomes amber, and the red is darkened and demoted to genuine emergency only.",
      "This is the only theme that departs from ISO 3864-4 on the SAFE tier, and the departure is deliberate rather than accidental: ISO reads blue as mandatory-instruction, not as safe. It is defensible only because WCAG 1.4.1 already forbids colour as the sole carrier — the ISO 7010 square and the text label still say \"safe\", and the teal is only the surface it sits on. Note this as the one place the theme system trades a standard for a political reading.",
      "Removing green also removes the green+yellow pair as a side effect, so the Bolsonaro pairing cannot assemble even though amber remains.",
      "Purple stays out of every neutral state. Purple is the dominant Brazilian funerary colour today (CNBB) — it has replaced black — and it is the obvious candidate for a fourth \"info\" tier.",
      "Type unchanged. No ü (the trema was abolished for native words by the Acordo Ortográfico de 1990) and no ¿ ¡; á é í ó ú â ê ô ã õ ç à are all in Fraunces latin/latin-ext.",
    ],
    contrast: {
      "ink/paper": 13.99,
      "ink/card": 14.95,
      "ink-2/card": 8.15,
      "ink-3/card": 5.86,
      "clay/card": 8.18,
      "clay/clay-wash": 6.61,
      "ochre-ink/card": 6.65,
      "ochre-ink/ochre-wash": 5.78,
      "sage/card": 7.56,
      "sage/sage-wash": 6.38,
    },
  },
}

/** The base theme is en-US: "Warm Domestic" exactly as app/globals.css ships it. */
export const BASE_THEME: LocaleTheme = THEMES['en-US']

export const THEMED_LOCALES = Object.keys(THEMES)

/** Falls back to the base rather than throwing — an unknown locale still renders. */
export function themeFor(code: string): LocaleTheme {
  return THEMES[code] ?? BASE_THEME
}

const COLOUR_VARS: Record<keyof ThemeColours, string> = {
  paper: '--paper',
  paper2: '--paper-2',
  paper3: '--paper-3',
  card: '--card',
  ink: '--ink',
  ink2: '--ink-2',
  ink3: '--ink-3',
  clay: '--clay',
  clay2: '--clay-2',
  clayWash: '--clay-wash',
  clayLine: '--clay-line',
  ochre: '--ochre',
  ochreInk: '--ochre-ink',
  ochreWash: '--ochre-wash',
  ochreLine: '--ochre-line',
  sage: '--sage',
  sageWash: '--sage-wash',
  sageLine: '--sage-line',
  line: '--line',
  line2: '--line-2',
}

const TYPE_VARS: Record<keyof ThemeType, string> = {
  fontDisplay: '--font-display',
  fontSans: '--font-sans',
  fontScale: '--font-scale',
  leading: '--leading',
  leadingDisplay: '--leading-display',
  trackingDisplay: '--tracking-display',
  trackingEyebrow: '--tracking-eyebrow',
  eyebrowTransform: '--eyebrow-transform',
  wordBreak: '--word-break',
  overflowWrap: '--overflow-wrap',
  lineBreak: '--line-break',
}

/**
 * The theme as CSS custom properties, for inline styles or SSR.
 * app/theme.css carries the same values as static [data-locale] blocks; this is
 * for the cases where a subtree needs a theme the document does not have.
 */
export function cssVars(theme: LocaleTheme): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(COLOUR_VARS)) out[v] = theme.colours[k as keyof ThemeColours]
  for (const [k, v] of Object.entries(TYPE_VARS)) out[v] = theme.type[k as keyof ThemeType]
  return out
}

/**
 * The one rule that is a taboo rather than a preference: a person's name is
 * never red in Korean. Attested by Korea.net and the Dartmouth Folklore Archive
 * with multiple independent informants. Cite the taboo, never the origin - the
 * two accounts conflict. No source says whether it extends to Chinese or
 * Japanese, so it is not treated as pan-CJK; it is simply applied everywhere,
 * because a name in body ink costs nothing anywhere else.
 *
 * Read it as `var(--name-ink, var(--ink))`, never as a `:root` alias. A custom
 * property containing `var()` is substituted on the element that declares it,
 * so `:root { --name-ink: var(--ink) }` would freeze every locale's name to the
 * BASE ink and silently break ja-JP, whose ink is #24211f rather than #2a2420.
 */
export const NAME_INK_VAR = '--name-ink'

/** Locales whose colours are the base, and the count that matters in review. */
export const UNCHANGED_LOCALES = THEMED_LOCALES.filter((c) => THEMES[c].sameAsBase)
