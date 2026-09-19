/**
 * Per-locale gesture vocabulary, grounded in sourced research.
 *
 * Every `unsafe` flag below traces to a citation in docs/gesture-research-*.md.
 * Claims we could not source are marked `evidence: 'unverified'` and are acted
 * on only where the cost of being wrong is asymmetric. Two claims this project
 * previously asserted — thumbs-up as obscene in West Africa, and the Nigerian
 * "waka" reading of the wave — did not survive verification and were withdrawn
 * rather than softened.
 */

export type GestureId =
  | 'thumbs_up'
  | 'thumbs_down'
  | 'open_palm'
  | 'wave'
  | 'present' // flat hand, fingers together, angled down — "leaving it here"
  | 'purse' // fingertips converged — "wait", Arabic locales only
  | 'index_up' // raised index — "one moment", Greek substitute
  | 'nod' // head
  | 'shake' // head

export type Evidence = 'peer-reviewed' | 'institutional' | 'tertiary' | 'unverified'

export interface GestureRule {
  /** Why this gesture is not offered in this locale. */
  reason: string
  severity: 'offensive' | 'impolite' | 'ambiguous' | 'political'
  evidence: Evidence
  /** What we offer instead. */
  substitute?: GestureId
}

export interface LocaleSpec {
  code: string
  name: string
  nativeName: string
  dir: 'ltr' | 'rtl'
  /** Named correctly and never merged. "Arabic Sign Language" is not one language. */
  signLanguage: { name: string; nativeName?: string; iso: string; note?: string }
  /** Gestures withheld in this locale, and why. */
  blocked: Partial<Record<GestureId, GestureRule>>
  /** Locale-specific colour constraints on top of the ISO 3864-4 base. */
  colour: string[]
  /** Typography and text-handling requirements. */
  text: string[]
  /** How the door may address a stranger. */
  register: string
}

/**
 * The pan-cultural baseline, from Matsumoto & Hwang (2013) — an empirical
 * emblem catalogue with measured recognition rates across six world regions.
 *
 * These are the three highest-recognition emblems on earth, and two of them
 * are heads rather than hands. A hand-only pipeline cannot express the
 * culturally correct hello, yes or no in East Asia — those are a bow, a nod
 * and a shake. MediaPipe ships Face and Pose Landmarker alongside Hands.
 */
export const PAN_CULTURAL = {
  nod: { meaning: 'yes', recognition: 0.9818 },
  shake: { meaning: 'no', recognition: 0.991 },
  open_palm: { meaning: 'stop', recognition: 1.0 },
} as const

/** Withheld everywhere. Kept as a REJECT class so it is never silently folded in. */
export const GLOBALLY_WITHDRAWN: Record<string, GestureRule> = {
  fist: {
    reason:
      'Pan-culturally "Threat" at 98.15% (Matsumoto & Hwang 2013). Triumph in Japan (ガッツポーズ), ' +
      'the numeral 10 in China, one landmark from the Turkish fig gesture, and the terminal handshape ' +
      'of the bras d\'honneur in France, Mexico and Brazil — where a hand-only classifier would log ' +
      '"visitor said no" for an obscene gesture. Replaced by thumbs_down, which is maximally ' +
      'separable from thumbs_up on a single scalar so yes and no can never silently swap.',
    severity: 'offensive',
    evidence: 'peer-reviewed',
    substitute: 'thumbs_down',
  },
  ok_ring: {
    reason:
      'A sexual insult in Turkey (Morris 1997 via Denizci 2015), offensive in Saudi Arabia, ' +
      '"I will break you" in Levantine usage, and obscene in Brazil — the 1950s Nixon incident in ' +
      'São Paulo. Never offered, never rendered.',
    severity: 'offensive',
    evidence: 'peer-reviewed',
  },
  figa: {
    reason:
      'Thumb between index and middle. Lucky in Brazil, obscene in Turkey and Russia. A REJECT class ' +
      'rather than a gesture: in Brazil the failure is silent and wrong — logging "no" when a courier ' +
      'wished you good luck.',
    severity: 'ambiguous',
    evidence: 'tertiary',
  },
}

export const LOCALES: Record<string, LocaleSpec> = {
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    dir: 'ltr',
    signLanguage: {
      name: 'American Sign Language',
      iso: 'ase',
      note: 'No federal recognition; recognised in state law in most states.',
    },
    blocked: {},
    colour: ['ANSI Z535: DANGER white-on-red, WARNING black-on-orange, CAUTION black-on-yellow.'],
    text: [],
    register: 'Direct, warm, brief. Over-formality reads as stilted from a machine.',
  },

  'el-GR': {
    code: 'el-GR',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    dir: 'ltr',
    signLanguage: {
      name: 'Greek Sign Language',
      nativeName: 'Ελληνική Νοηματική Γλώσσα',
      iso: 'gss',
      note: 'Recognised as equal to Greek by Law 4488/2017, Art. 65 §2.',
    },
    blocked: {
      open_palm: {
        reason:
          'This is the moútza. The canonical form is a forward thrust, but Greeks already self-censor ' +
          'a static spread palm when signalling "five". Critically, the obvious fix fails: the ' +
          'fingers-together version is the «ευγενική» moútza — a named, milder form of the same insult. ' +
          'No palm-toward-camera flat hand of any finger spacing is safe here. Statically it is ' +
          'landmark-identical to our "wait", so without thrust-velocity detection the system reads an ' +
          'insult as politeness.',
        severity: 'offensive',
        evidence: 'institutional',
        substitute: 'index_up',
      },
      wave: {
        reason:
          'An oscillating palm-forward hand is, frame by frame, repeated moútza exposure — and the ' +
          'lateral motion supplies the dynamism the insult wants. Inference from the form description, ' +
          'not a direct source, but acted on because the cost of being wrong is asymmetric.',
        severity: 'offensive',
        evidence: 'unverified',
      },
    },
    colour: ['Ground in ISO 3864-4; no reliable Greek-specific UI colour semantics found.'],
    text: [
      'Uppercase drops the tonos but keeps the dialytika; the disjunctive ή keeps its tonos. ' +
        'CSS text-transform: uppercase gets this wrong — supply pre-composed uppercase strings.',
    ],
    register: 'εσείς (plural/formal) to any unknown adult. Never εσύ.',
  },

  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Gulf)',
    nativeName: 'العربية',
    dir: 'rtl',
    signLanguage: {
      name: 'Saudi Sign Language',
      nativeName: 'لغة الإشارة السعودية',
      iso: 'sdl',
      note:
        'Never offer "Arabic Sign Language" as one option. Al-Fityani (2010) finds the unified ' +
        'project "unsound by scholarly linguistics standards", and Deaf Arabs report they cannot ' +
        'understand it.',
    },
    blocked: {
      open_palm: {
        reason:
          'The moútza analogue is documented for the Persian Gulf region. The load-bearing variable ' +
          'is finger tension and spread — exactly our discriminating feature. If offered at all here, ' +
          'it must not require spread fingers.',
        severity: 'offensive',
        evidence: 'tertiary',
        substitute: 'purse',
      },
      present: {
        reason:
          'Index-finger pointing is "considered very rude"; the sourced local alternative is a chin ' +
          'raise plus gaze, which is a head gesture and invisible to Hand Landmarker. No hand-based ' +
          'substitute was found. Sources address pointing at a person; the downward-at-ground case ' +
          'is unaddressed everywhere we looked.',
        severity: 'impolite',
        evidence: 'institutional',
      },
    },
    colour: [
      'Yellow reads as envy, sickness and insincerity — not caution. Do not use it for a pending state.',
      'White carries the shroud; it is not a neutral background here.',
      'Green is positive — the source gives "green light = good sign" explicitly.',
    ],
    text: [
      'RTL with mirrored layout; use logical properties, never margin-left/right.',
      'Numbers run LTR inside RTL text. Three numeral families differ by region.',
      'Gulf leans Arabic-Indic ٠-٩; pick per locale, not per language.',
    ],
    register:
      'Indirect. Do not photograph people, especially women, without permission — this is a camera ' +
      'product in this market. The السلام عليكم question for an automated agent addressing a stranger ' +
      'of unknown faith is unresolved and needs a native reviewer, not a search.',
  },

  'ar-EG': {
    code: 'ar-EG',
    name: 'Arabic (Egypt)',
    nativeName: 'العربية',
    dir: 'rtl',
    signLanguage: {
      name: 'Egyptian Sign Language',
      nativeName: 'لغة الإشارة المصرية',
      iso: 'esl',
      note: 'No grammatical description exists. Four manual alphabets were in use as of 2006.',
    },
    blocked: {
      open_palm: {
        reason:
          'With the thumb folded onto the palm this is the Rabia sign. Egypt designated the Muslim ' +
          'Brotherhood a terrorist organisation in 2013; a footballer was suspended and a kung fu ' +
          'champion banned for a year for displaying it. A thumb-position-tolerant classifier emits ' +
          'it by accident. The four-fingers-up/thumb-folded configuration must be HARD REJECTED, not ' +
          'absorbed, and never rendered as a prompt icon.',
        severity: 'political',
        evidence: 'tertiary',
        substitute: 'purse',
      },
    },
    colour: [
      'Same Arabic semantics as ar-SA. The "yellow = mourning in Egypt" claim does not survive — ' +
        'the peer-reviewed source assigns mourning to black. Avoid yellow for the sourced ' +
        'envy/sickness reading instead.',
    ],
    text: ['Egypt conventionally uses European digits 0-9 where the Gulf leans Arabic-Indic.'],
    register:
      'Egyptians "typically avoid saying no directly". A door agent that forces a binary yes/no is ' +
      'demanding a culturally dispreferred speech act — make the no path expressible as deferral. ' +
      'Note pointing is FINE here, unlike ar-SA: there is no pan-Arab rule.',
  },

  'tr-TR': {
    code: 'tr-TR',
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    signLanguage: {
      name: 'Turkish Sign Language',
      nativeName: 'Türk İşaret Dili',
      iso: 'tsm',
      note:
        'A language isolate with a TWO-HANDED manual alphabet — a single-hand 21-landmark pipeline ' +
        'structurally cannot do TİD fingerspelling. Do not imply otherwise.',
    },
    blocked: {
      wave: {
        reason:
          'Arm extended toward the addressee, palm outwards, moving side to side designates "refusal ' +
          'of an offer" — "no, thanks" (Calbris & Montredon 1986, via Denizci 2015). That is a near-exact ' +
          'description of our wave, and it maps to our "no" semantics, not our "hello" semantics. A ' +
          'direct inversion, not a nuance.',
        severity: 'ambiguous',
        evidence: 'peer-reviewed',
      },
      purse: {
        reason:
          'The purse hand means "good / delicious" in Turkey, not "wait" (Morris 1997 and Axtell 1998, ' +
          'via Denizci 2015). Ship one wait gesture across locales and a Turkish visitor saying wait is ' +
          'heard as delicious. No sourced Turkish "wait" emblem was found — this is an open question, ' +
          'and nobody should fill it from intuition.',
        severity: 'ambiguous',
        evidence: 'peer-reviewed',
      },
    },
    colour: ['Turkish colour semantics are snippet-level only. The Arabic colour paper does NOT apply.'],
    text: [
      'DOTTED AND DOTLESS I: toUpperCase("i") is "İ" (U+0130), toLowerCase("I") is "ı" (U+0131). ' +
        'This silently breaks case-insensitive matching. Never use locale-sensitive case folding for ' +
        'identifiers, gesture names, config keys or locale codes — only for displayed text.',
    ],
    register:
      'siz for any unfamiliar adult. buyurun as the service opener. Bey/Hanım follow the FIRST name.',
  },

  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    signLanguage: {
      name: 'Japanese Sign Language',
      nativeName: '日本手話',
      iso: 'jsl',
      note:
        'Do NOT ship a 日本手話 / 日本語対応手話 setting. The Japanese Federation of the Deaf formally ' +
        'opposes using that split as a category boundary: 「それら全てが手話であり…一つの言語である」.',
    },
    blocked: {
      wave: {
        reason:
          'ちがう、ちがう — palm out in front of the nose, waving back and forth — means "that is wrong / ' +
          'no" in Japan. Ship both wave and a negation gesture and two of five would mean "no", and ' +
          'neither would mean what we intend.',
        severity: 'ambiguous',
        evidence: 'institutional',
      },
    },
    colour: [
      '紅白 — red AND white together — is the visual grammar of CELEBRATION (紅白幕, 紅白餅), not alarm. ' +
        'No red-on-white alert treatment. Red on neutral or dark only.',
      'Black, not white, is the Japanese funeral colour today — the pivot is datable to 1878. A ' +
        'black-dominant "serious" theme carries a funerary tint here that it does not carry elsewhere.',
    ],
    text: ['line-break: strict — loose breaking strands a 。 or 」 at line start.'],
    register:
      '丁寧語 (です・ます) base with light 尊敬語 on the visitor\'s actions. Never 二重敬語, and never let ' +
      '尊敬語 morphology attach to a package. The 文化庁 warns that uniform maximal politeness to every ' +
      'person reads as unpleasant, not respectful — vary the phrasing.',
  },

  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified, Mainland)',
    nativeName: '简体中文',
    dir: 'ltr',
    signLanguage: {
      name: 'Chinese Sign Language',
      nativeName: '中国手语',
      iso: 'csl',
      note:
        'Hong Kong (hks) and Taiwan (tss) are different languages, not dialects. 国家通用手语 is a ~5,000-word ' +
        'top-down national standard atop documented multi-variety regional variation.',
    },
    blocked: {
      present: {
        reason:
          'In coastal southern China the numeral 7 is the index pointing down with the thumb extended — ' +
          'the closest numeric collision in the matrix, and regional, so it misfires in the south and not ' +
          'the north. An extended index alone is the numeral 1.',
        severity: 'ambiguous',
        evidence: 'tertiary',
      },
    },
    colour: [
      'Red as alert is the LEGALLY STANDARDISED meaning here — 红 = 禁止、停止、紧急告警 in the national ' +
        'safety-colour standard. The festive red of 红包 is a different register, cued by gold and pattern.',
      'But red-negativity is ~2.4x weaker than Western (Kawai et al. 2022), so never encode state in ' +
        'red/green alone — pair with an ISO 7010 shape and a label.',
      'The 黄色 hazard is LEXICAL, in the copy, not the palette. 黄 carries "pornographic" as a standalone ' +
        'colloquial morpheme. 「黄色警报」 is idiomatic and fine; a filter chip reading just 「黄色」 is not.',
      'Do not put a green hat on any illustrated character (戴绿帽子). Green surfaces are fine.',
    ],
    text: [
      'Tag zh-Hans-CN, not bare zh — CLReq: regional differences matter more than simplified vs traditional.',
      'lang is mandatory: Han unification means the codepoint does not carry the locale, and a ja user ' +
        'seeing kanji through a Simplified fallback font sees glyphs that look wrong.',
    ],
    register: '您, short plain sentences. Avoid stacked honorific framing.',
  },

  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    dir: 'ltr',
    signLanguage: {
      name: 'Korean Sign Language',
      nativeName: '한국수어',
      iso: 'kvk',
      note:
        'NEVER use the bare abbreviation KSL as a locale key — Kenyan Sign Language is also KSL (xki). ' +
        'The Korean Sign Language Act (2016) makes 한국수어 an official language of deaf Koreans, equal to 국어.',
    },
    blocked: {},
    colour: [
      'NEVER render a person\'s name in red. Attested by Korea.net and the Dartmouth Folklore Archive ' +
        'with multiple informants. Keep red in the icon, border or badge; keep the name in default ' +
        'foreground. Cite the taboo, never the origin — the two accounts conflict.',
      'The "white means death in Korea" claim is NOT verified and the evidence cuts the other way — ' +
        '백의민족, the white-clad people, describes white as everyday dress for centuries.',
    ],
    text: ['word-break: keep-all + overflow-wrap: break-word. This is the OPPOSITE of ja and zh.'],
    register:
      '하십시오체 for the opening frame; 해요체 is acceptable for follow-ups and a blend is authentically ' +
      'Korean. 반말 is never acceptable to an unknown visitor.',
  },

  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    signLanguage: {
      name: 'Indian Sign Language',
      iso: 'ins',
      note:
        'Part of Indo-Pakistani Sign Language. Its dominant fingerspelling is BSL-derived and therefore ' +
        'TWO-HANDED — do not write "unrelated to BSL". ~6 million signers, the most-used sign language ' +
        'in the world. Entirely out of scope for a five-gesture recogniser; do not imply support.',
    },
    blocked: {
      open_palm: {
        reason:
          'Not offensive — the opposite. A raised open palm is the abhaya mudra, a blessing gesture ' +
          'deities make toward devotees, which makes a machine performing it a category error. It is ' +
          'also reportedly the Indian National Congress election symbol. Both the sacred and the ' +
          'partisan forms have fingers TOGETHER, so our spread-finger version is safer — but keep it ' +
          'at chest height, never raised to shoulder, and never render it as a flat high-contrast ' +
          'front-facing silhouette.',
        severity: 'political',
        evidence: 'unverified',
      },
    },
    colour: [
      'Avoid saffron/orange ENTIRELY — simultaneously sacred (Hindu, Buddhist, Sikh), the Hindutva/BJP ' +
        'movement colour, and the top band of the flag. No reading of a saffron warning badge is inert.',
      'Do not use white as the "all clear" state. Hindu widowhood is marked by the SUBTRACTION of red ' +
        'and ornament (verified); the positive white-sari claim is only partially verified.',
      'Red is bivalent — sindoor and marriage AND danger. Never hue-only.',
      'Yellow (haldi) is auspicious and celebratory, so it underperforms as caution — but it is the ' +
        'best available warm accent because it is not partisan.',
      'Never use saffron/white/green as a triad. That is the flag, and its depiction is regulated.',
    ],
    text: [
      'NEVER apply letter-spacing to Devanagari — the shirorekha is drawn as part of each glyph and ' +
        'butts against its neighbours to form one continuous bar. Tracking shatters the word.',
      'Never underline: the visual line is already at the top, and an underline collides with ' +
        'below-base matras.',
      'Grapheme-cluster-aware truncation only, on a Unicode >= 15.1 segmenter (rule GB9c). The i-matra ' +
        'displays to the LEFT of the consonant it follows in memory, so naive slicing changes text in ' +
        'a place the index did not appear to touch.',
      'Short labels are the 200-300% expansion bucket, and doorbell UI is nearly all short labels.',
    ],
    register:
      'आप, always — a doorbell is the textbook service encounter with a stranger. आप governs plural-' +
      'honorific agreement throughout the clause, not just the pronoun. Imperatives: कीजिये / कीजियेगा, ' +
      'never कर or करो. Prefer constructions that avoid a gendered participle rather than guessing ' +
      'gender from video.',
  },

  'sw-KE': {
    code: 'sw-KE',
    name: 'Swahili (Kenya)',
    nativeName: 'Kiswahili',
    dir: 'ltr',
    signLanguage: {
      name: 'Kenyan Sign Language',
      nativeName: 'Lugha ya Alama ya Kenya',
      iso: 'xki',
      note:
        'Not ASL — no more than 20% full cognates. Art. 7(3)(b) creates a promotion duty and Art. 120(1) ' +
        'makes it official IN PARLIAMENT, but it is not an official language of the Republic.',
    },
    blocked: {
      present: {
        reason:
          'Index-finger pointing is improper, and the source names the substitute: "When pointing to ' +
          'someone OR SOMETHING, it is polite to use all fingers of the hand." The object exemption we ' +
          'hoped for is explicitly denied. The transferable rule — whole hand, never one finger — also ' +
          'governs beckoning here.',
        severity: 'impolite',
        evidence: 'institutional',
      },
    },
    colour: [
      'Avoid ORANGE entirely — it is ODM\'s election symbol and party colour, and orange is the natural ' +
        'warning tier in most design systems. Use amber-toward-red or drop the middle tier.',
      'Yellow AND green together is the UDA (governing party) pairing — avoid for a two-state indicator.',
      'Red is sacrificial in Kenyan official symbolism (blood shed for independence), not merely danger.',
    ],
    text: [
      "The apostrophe in ng' is a LETTER, not punctuation: ngoma (drum) vs ng'ombe (cow).",
      'Normalise U+2019 to U+0027 on ingest — smart-quote autocorrect silently breaks matching and TTS.',
      "Use Intl.Segmenter, not \\w — split(/\\W/) breaks ng'ombe into ng + ombe.",
      "CI test strings: ng'ombe, ng'ambo, kung'aa, Ng'ang'a (a common surname, two apostrophes).",
      'Expansion is ~1.06x overall, far less than generic guidance — but budget 15-18 char unbreakable ' +
        'tokens (haijatambuliwa, Uwasilishaji).',
    ],
    register:
      'GREET FIRST, unconditionally — the canonical paper is titled "Aren\'t you going to greet me? ' +
      'Impoliteness in Swahili greetings". The greeting is a precondition for transacting, and the ' +
      'device speaks on the household\'s behalf. Use Habari? Never Jambo (reads as tourist Swahili). ' +
      'NEVER generate Shikamoo: it is age-graded, and a camera cannot know a visitor\'s age and should ' +
      'not try. Use plural-as-respect instead — age-neutral deference.',
  },

  'en-NG': {
    code: 'en-NG',
    name: 'English (Nigeria)',
    nativeName: 'English',
    dir: 'ltr',
    signLanguage: {
      name: 'Nigerian Sign Language',
      iso: 'nsi',
      note:
        'No government recognition. Distinct from the indigenous Hausa Sign Language (Maganar Hannu), ' +
        'Yoruba and Bura sign languages. Whether NSL is properly "a dialect of ASL" is disputed.',
    },
    blocked: {
      open_palm: {
        reason:
          'A spread palm thrust may carry an offensive reading here. We act on this because the cost ' +
          'of being wrong is asymmetric — NOT because it is well sourced. The "waka" claim carries no ' +
          'citation anywhere we could find, including in the Wikipedia sentence that states it, and ' +
          'searches of Punch, Vanguard, Guardian Nigeria and Premium Times returned nothing. Two ' +
          'relevant papers (Agwuele 2014; Orie 2009, both in Gesture) were paywalled. Avoid the ' +
          'gesture; do not state the claim as fact.',
        severity: 'offensive',
        evidence: 'unverified',
        substitute: 'index_up',
      },
    },
    colour: [
      'Flag: green = agriculture, white = unity and peace. Green also carries an Islamic association ' +
        'in the north.',
    ],
    text: [
      'Latin, LTR. If you ever localise beyond English: Yoruba diacritics (ẹ ọ ṣ plus tone marks) are ' +
        'semantically load-bearing and absent from standard keyboards; Hausa Boko uses ɓ ɗ ƙ; and ' +
        'Hausa Ajami is Arabic script and therefore RTL.',
    ],
    register: 'Sir/ma for any senior or higher-ranking person. Honorific plurals for singular persons.',
  },

  'fr-FR': {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    signLanguage: {
      name: 'Langue des signes française',
      iso: 'fsl',
      note: 'Recognised « comme une langue à part entière » by loi 2005-102 art. 75.',
    },
    blocked: {},
    colour: [
      'No large yellow fills. A saturated yellow panel in France reads as gilets jaunes before it reads ' +
        'as caution. Yellow only as a thin border or accent — or use orange, which is ANSI-correct anyway.',
    ],
    text: [
      'Accented capitals are REQUIRED (Académie française), including À. Never generate French caps ' +
        'with a locale-naive toUpperCase: "état" becomes "ÉTAT", not "ETAT".',
      'Narrow no-break space U+202F before ; ! ? and U+00A0 before :. If a renderer mangles U+202F, ' +
        'degrade to U+00A0 — never to a plain space, which permits a line break before the mark.',
    ],
    register:
      'vous, always. Bonjour is the FIRST token before any question — and the corpus finding is that the ' +
      'greeting is initiated by the party who holds the space, which is us. The French flow therefore ' +
      'needs one MORE turn than the American one: do not build a turn-count-identical graph and localise ' +
      'strings into it. s\'il vous plaît on every directive; conditional, never imperative.',
  },

  'es-MX': {
    code: 'es-MX',
    name: 'Spanish (Mexico)',
    nativeName: 'Español',
    dir: 'ltr',
    signLanguage: {
      name: 'Lengua de Señas Mexicana',
      iso: 'mfs',
      note:
        'Recognised as A national language (not THE official sign language — Mexico has no ' +
        'constitutionally declared official language). Note lengua, not lenguaje.',
    },
    blocked: {
      present: {
        reason:
          'The Mexican "no" is an extended index shaken side to side and the Mexican "yes" is an index ' +
          'curled up and down — so an extended-index gesture collides with BOTH native emblems, ' +
          'separated only by orientation and motion. That is a correctness bug, not a politeness one.',
        severity: 'ambiguous',
        evidence: 'institutional',
      },
    },
    colour: [
      'Purple is a MOURNING colour — do not use it as a neutral info state.',
      'Avoid green+white+red together; it reads as the flag.',
      'Pick a yellow that is not marigold-orange — in late October a saturated marigold reads as ' +
        'Día de Muertos decoration, which is festive and off-register for an alert.',
    ],
    text: ['Accents on capitals are mandatory (RAE). Support á é í ó ú ü ñ ¿ ¡.'],
    register:
      'usted, unconditionally — do not infer the visitor\'s age from the camera to pick a register. ' +
      'Mexicans "rarely give direct refusals", so a single thumbs-up may be politeness rather than ' +
      'consent: never bind it to anything irreversible.',
  },

  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português',
    dir: 'ltr',
    signLanguage: {
      name: 'Língua Brasileira de Sinais',
      nativeName: 'Libras',
      iso: 'bzs',
      note:
        'Lei 10.436/2002 recognises Libras as a legal means of communication — it does NOT make it an ' +
        'official language of Brazil, and Art. 4 says it cannot substitute written Portuguese. This is ' +
        'the most commonly misstated fact about the law.',
    },
    blocked: {},
    colour: [
      'RED is the historic colour of the Workers\' Party and GREEN+YELLOW is Bolsonaro\'s adopted pair. ' +
        'A default green-OK / red-alert UI puts the two most partisan colours in Brazilian politics ' +
        'side by side on a device mounted on someone\'s front door. Use blue or teal for OK and amber ' +
        'for alert; reserve saturated red for genuine emergency.',
      'Purple is the dominant funerary colour today (CNBB) — it has replaced black. Keep it out of ' +
        'neutral states.',
    ],
    text: [
      'No ü — the trema was abolished for native words by the Acordo Ortográfico de 1990.',
      'Support á é í ó ú â ê ô ã õ ç à. No ¿ ¡.',
    ],
    register:
      'você is the unmarked second person and is NOT rude to a stranger — it does not behave like ' +
      'Spanish tú. o senhor / a senhora forces both an age judgement and a gender guess; aimed at a ' +
      '22-year-old courier it lands as "you look old". Better still, write the opener so it needs no ' +
      'second-person pronoun at all.',
  },
}

export const LOCALE_CODES = Object.keys(LOCALES)

/** Gestures offered in a locale, after removing the globally withdrawn and the locally blocked. */
export function availableGestures(code: string): GestureId[] {
  const spec = LOCALES[code]
  if (!spec) return []
  const base: GestureId[] = ['thumbs_up', 'thumbs_down', 'open_palm', 'wave', 'present', 'nod', 'shake']
  return base.filter((g) => !(g in spec.blocked))
}

/** What we offer instead, when a gesture is withheld here. */
export function substituteFor(code: string, gesture: GestureId): GestureId | undefined {
  return LOCALES[code]?.blocked[gesture]?.substitute
}
