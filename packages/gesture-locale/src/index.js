/**
 * gesture-locale — culturally safe hand-gesture vocabularies.
 *
 * If you are building a gesture interface, you have almost certainly picked
 * five hand shapes that feel obvious. Four of them are probably offensive
 * somewhere. This library is the lookup table nobody had.
 *
 * The evidence base is in SOURCES.md. Every entry carries the grade of the
 * evidence behind it, and claims that could not be sourced are marked
 * `unverified` rather than quietly dropped or quietly asserted — the loudest
 * claims in this area turn out to be the worst sourced, and two widely
 * repeated ones were withdrawn during this research rather than softened.
 *
 * @module gesture-locale
 */

/**
 * @typedef {'thumbs_up'|'thumbs_down'|'open_palm'|'wave'|'present'|'purse'|'index_up'|'nod'|'shake'} GestureId
 * @typedef {'offensive'|'impolite'|'ambiguous'|'political'} Severity
 * @typedef {'peer-reviewed'|'institutional'|'tertiary'|'unverified'} Evidence
 */

/**
 * Gestures withheld everywhere, with the reason.
 *
 * These are not merely impolite somewhere. Each is either measured as hostile
 * across cultures, or sits one landmark away from an obscenity in a way a
 * classifier cannot be trusted to separate.
 */
export const GLOBALLY_UNSAFE = {
  fist: {
    severity: 'offensive',
    evidence: 'peer-reviewed',
    reason:
      'Pan-culturally "Threat" at 98.15% (Matsumoto & Hwang 2013). Triumph in Japan, the numeral ' +
      '10 in China, one landmark from the Turkish fig gesture, and the terminal handshape of the ' +
      "bras d'honneur in France, Mexico and Brazil — where the insult lives in the forearm and " +
      'second hand that a single-hand model cannot see, so a classifier logs "the visitor said no" ' +
      'for an obscene gesture.',
    use: 'thumbs_down',
  },
  ok_ring: {
    severity: 'offensive',
    evidence: 'peer-reviewed',
    reason:
      'A sexual insult in Turkey, offensive in Saudi Arabia, "I will break you" in Levantine ' +
      'usage, and obscene in Brazil. Three independent sources, three regions.',
    use: null,
  },
  figa: {
    severity: 'ambiguous',
    evidence: 'tertiary',
    reason:
      'Thumb between index and middle. Lucky in Brazil, obscene in Turkey and Russia. Worth a ' +
      'reject class rather than a gesture: in Brazil the failure is silent and wrong — logging ' +
      '"no" when someone wished you good luck.',
    use: null,
  },
  rabia: {
    severity: 'political',
    evidence: 'tertiary',
    reason:
      'Four fingers up with the thumb folded. Egypt designated the Muslim Brotherhood a terrorist ' +
      'organisation in 2013 and athletes have been banned for displaying it; in Turkey it is a ' +
      'governing-party emblem. A thumb-position-tolerant open_palm classifier emits it by accident.',
    use: null,
  },
}

/**
 * The three highest-recognition emblems measured anywhere, from Matsumoto &
 * Hwang's (2013) empirical catalogue.
 *
 * Two of them are heads, not hands. That is the most useful single fact in this
 * library: if you need yes and no, a hand-only pipeline is starting from a
 * worse position than a face or pose model would.
 */
export const PAN_CULTURAL = {
  nod: { meaning: 'yes', recognition: 0.9818, source: 'head' },
  shake: { meaning: 'no', recognition: 0.991, source: 'head' },
  open_palm: { meaning: 'stop', recognition: 1.0, source: 'hands' },
}

/** Per-locale exclusions. Absence of an entry means no sourced objection was found. */
export const LOCALES = {
  'en-US': { dir: 'ltr', signLanguage: 'ase', blocked: {} },
  'en-GB': { dir: 'ltr', signLanguage: 'bfi', blocked: {} },
  'en-NG': {
    dir: 'ltr',
    signLanguage: 'nsi',
    blocked: {
      open_palm: {
        severity: 'offensive',
        evidence: 'unverified',
        reason:
          'A spread palm thrust may carry an offensive reading. Acted on because the cost of being ' +
          'wrong is asymmetric, NOT because it is sourced: the "waka" claim carries no citation ' +
          'anywhere we could find, and searches of Nigerian press returned nothing. Do not repeat ' +
          'the claim as fact.',
        use: 'index_up',
      },
    },
  },
  'el-GR': {
    dir: 'ltr',
    signLanguage: 'gss',
    blocked: {
      open_palm: {
        severity: 'offensive',
        evidence: 'institutional',
        reason:
          'This is the moútza. The obvious fix fails: the fingers-together version is the ' +
          '«ευγενική» moútza, a named milder form of the same insult, which several travel sites ' +
          'recommend as the safe alternative. No palm-toward-camera flat hand of any finger ' +
          'spacing is safe here, and statically it is landmark-identical to "wait".',
        use: 'index_up',
      },
      wave: {
        severity: 'offensive',
        evidence: 'unverified',
        reason:
          'An oscillating palm-forward hand is repeated moútza exposure frame by frame. Inference ' +
          'from the form description, not a direct source.',
        use: null,
      },
    },
  },
  'ar-SA': {
    dir: 'rtl',
    signLanguage: 'sdl',
    blocked: {
      open_palm: {
        severity: 'offensive',
        evidence: 'tertiary',
        reason:
          'The moútza analogue is documented for the Persian Gulf. The load-bearing variable is ' +
          'finger tension and spread, which is exactly the usual discriminating feature.',
        use: 'purse',
      },
      present: {
        severity: 'impolite',
        evidence: 'institutional',
        reason:
          'Index-finger pointing is considered very rude; the sourced local alternative is a chin ' +
          'raise plus gaze, which is a head gesture and invisible to a hand model.',
        use: null,
      },
    },
  },
  'ar-EG': {
    dir: 'rtl',
    signLanguage: 'esl',
    blocked: {
      open_palm: {
        severity: 'political',
        evidence: 'tertiary',
        reason: 'With the thumb folded this is the Rabia sign. See GLOBALLY_UNSAFE.rabia.',
        use: 'purse',
      },
    },
  },
  'tr-TR': {
    dir: 'ltr',
    signLanguage: 'tsm',
    blocked: {
      wave: {
        severity: 'ambiguous',
        evidence: 'peer-reviewed',
        reason:
          'Palm outwards moving side to side designates "refusal of an offer" — no, thanks. That ' +
          'maps to the negation semantics, not the greeting semantics. A direct inversion.',
        use: null,
      },
      purse: {
        severity: 'ambiguous',
        evidence: 'peer-reviewed',
        reason:
          'The purse hand means "good / delicious" in Turkey, not "wait". Ship one wait gesture ' +
          'across locales and a Turkish visitor saying wait is heard as delicious.',
        use: null,
      },
    },
  },
  'ja-JP': {
    dir: 'ltr',
    signLanguage: 'jsl',
    blocked: {
      wave: {
        severity: 'ambiguous',
        evidence: 'institutional',
        reason:
          'ちがう、ちがう — palm out in front of the nose, waving — means "that is wrong / no" in ' +
          'Japan. Ship both a wave and a negation gesture and two of them mean no.',
        use: null,
      },
    },
  },
  'ko-KR': { dir: 'ltr', signLanguage: 'kvk', blocked: {} },
  'zh-CN': {
    dir: 'ltr',
    signLanguage: 'csl',
    blocked: {
      present: {
        severity: 'ambiguous',
        evidence: 'tertiary',
        reason:
          'In coastal southern China the numeral 7 is the index pointing down with the thumb ' +
          'extended. An extended index alone is the numeral 1. Regional, so it misfires in the ' +
          'south and not the north.',
        use: null,
      },
    },
  },
  'hi-IN': {
    dir: 'ltr',
    signLanguage: 'ins',
    blocked: {
      open_palm: {
        severity: 'political',
        evidence: 'unverified',
        reason:
          'Not offensive — the opposite. A raised open palm is the abhaya mudra, a blessing ' +
          'gesture deities make toward devotees, which makes a machine performing it a category ' +
          'error. It is also reported to be a national party election symbol. Both forms have ' +
          'fingers together, so a spread-finger version is safer; keep it at chest height.',
        use: null,
      },
    },
  },
  'sw-KE': {
    dir: 'ltr',
    signLanguage: 'xki',
    blocked: {
      present: {
        severity: 'impolite',
        evidence: 'institutional',
        reason:
          'Index-finger pointing is improper, and the source names the substitute: "When pointing ' +
          'to someone OR SOMETHING, it is polite to use all fingers of the hand." The object ' +
          'exemption is explicitly denied.',
        use: null,
      },
    },
  },
  'fr-FR': { dir: 'ltr', signLanguage: 'fsl', blocked: {} },
  'es-MX': {
    dir: 'ltr',
    signLanguage: 'mfs',
    blocked: {
      present: {
        severity: 'ambiguous',
        evidence: 'institutional',
        reason:
          'The Mexican "no" is an extended index shaken side to side and the Mexican "yes" is an ' +
          'index curled up and down, so an extended-index gesture collides with both native ' +
          'emblems. A correctness bug, not a politeness one.',
        use: null,
      },
    },
  },
  'pt-BR': { dir: 'ltr', signLanguage: 'bzs', blocked: {} },
}

const ALL = ['thumbs_up', 'thumbs_down', 'open_palm', 'wave', 'present', 'purse', 'index_up', 'nod', 'shake']

/**
 * Gestures safe in one locale.
 * @param {string} locale BCP-47 code
 * @returns {GestureId[]}
 */
export function safeIn(locale) {
  const spec = LOCALES[locale]
  if (!spec) throw new Error(`Unknown locale: ${locale}. Known: ${Object.keys(LOCALES).join(', ')}`)
  return ALL.filter((g) => !(g in spec.blocked) && !(g in GLOBALLY_UNSAFE))
}

/**
 * Gestures safe across ALL the given locales — the intersection.
 *
 * This shrinks as locales are added, which is the correct behaviour rather than
 * a limitation. A system serving visitors from Athens and Cairo genuinely has
 * fewer safe gestures than one serving only Seattle.
 *
 * @param {string[]} locales
 * @returns {{ safe: GestureId[], excluded: {gesture: GestureId, locale: string, reason: string, severity: Severity, evidence: Evidence, use: GestureId|null}[] }}
 */
export function safeAcross(locales) {
  if (!Array.isArray(locales) || locales.length === 0) {
    throw new Error('safeAcross requires at least one locale')
  }
  const sets = locales.map((l) => new Set(safeIn(l)))
  const safe = ALL.filter((g) => sets.every((s) => s.has(g)))

  const excluded = []
  for (const locale of locales) {
    for (const [gesture, rule] of Object.entries(LOCALES[locale].blocked)) {
      if (safe.includes(gesture)) continue
      excluded.push({ gesture, locale, ...rule })
    }
  }
  return { safe, excluded }
}

/**
 * Why a gesture is withheld in a locale, or null if it is not.
 * @param {string} locale
 * @param {GestureId} gesture
 */
export function why(locale, gesture) {
  if (gesture in GLOBALLY_UNSAFE) return { locale: '*', ...GLOBALLY_UNSAFE[gesture] }
  const spec = LOCALES[locale]
  if (!spec) throw new Error(`Unknown locale: ${locale}`)
  const rule = spec.blocked[gesture]
  return rule ? { locale, ...rule } : null
}

/**
 * MediaPipe reports handedness assuming a MIRRORED image — a front-facing
 * selfie camera. Fixed cameras, doorbells and kiosks are not mirrored, so every
 * label arrives inverted.
 *
 * Several locales reserve the left hand for hygiene. Getting that backwards is
 * worse than not implementing it, which is why this is exported rather than
 * left as a comment.
 *
 * @param {'Left'|'Right'} label
 * @param {boolean} frameIsMirrored
 */
export function correctHandedness(label, frameIsMirrored) {
  if (frameIsMirrored) return label
  return label === 'Left' ? 'Right' : 'Left'
}

export const locales = Object.keys(LOCALES)
