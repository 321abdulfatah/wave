import { LOCALES, availableGestures, type GestureId, type LocaleSpec } from '@/lib/gestures/locales'

/**
 * Which locale, for whom.
 *
 * The obvious answer — geolocate the doorbell by IP — is wrong, and wrong in a
 * way that matters. IP tells you where the *door* is. It tells you nothing
 * about the person standing at it. A courier at a Norwegian door is as likely
 * to be from Warsaw, Mogadishu or Lahore as from Bergen, and the whole point of
 * a per-locale gesture vocabulary is that the *visitor's* reading is what can
 * go wrong. Localising the interface does not localise the visitor.
 *
 * So there are two audiences and they resolve differently:
 *
 *  1. **The resident.** Their own UI — language, script, reading direction.
 *     Resolved from their explicit choice, seeded once from the browser's
 *     language preferences. Never from IP: a VPN or a trip abroad should not
 *     silently change the language of someone's home.
 *
 *  2. **The visitor.** The gesture vocabulary the door will read, and the
 *     language it speaks. This cannot be detected. It is *configured* by the
 *     household, who genuinely do know which languages arrive at their door —
 *     and until they configure anything, the door falls back to the SAFE SET.
 *
 * The safe set is the intersection: only gestures with no offensive reading in
 * any configured locale. It shrinks as you add locales, which is the correct
 * behaviour — a household expecting visitors from Athens and Cairo has fewer
 * safe gestures available than one expecting only Seattle, and pretending
 * otherwise is how you insult someone.
 */

export interface LocaleResolution {
  /** The resident's own interface. */
  resident: LocaleSpec
  /** Locales the household expects visitors to come from. */
  visitorLocales: LocaleSpec[]
  /** Gestures safe across every one of them. */
  safeGestures: GestureId[]
  /** Gestures dropped by the intersection, and which locale dropped each. */
  excluded: { gesture: GestureId; because: string }[]
  /** Shown to the resident so the shrinking set is never mysterious. */
  explanation: string
}

export const DEFAULT_RESIDENT = 'en-US'

/**
 * Seed the resident's locale from the browser, once.
 *
 * `navigator.languages` is a stated preference, not an inference — the user set
 * it. That makes it a legitimate default in a way an IP lookup is not.
 */
export function seedResidentLocale(preferred: readonly string[]): string {
  for (const tag of preferred) {
    if (LOCALES[tag]) return tag
    // Fall back to any locale sharing the language subtag, so a browser set to
    // plain "ar" lands on ar-SA rather than on English.
    const lang = tag.split('-')[0].toLowerCase()
    const match = Object.keys(LOCALES).find((c) => c.split('-')[0].toLowerCase() === lang)
    if (match) return match
  }
  return DEFAULT_RESIDENT
}

const EXPLAIN = {
  en: {
    open: (n: number) =>
      `No visitor languages configured, so the door uses only the gestures that are safe in all ${n} ` +
      `locales it knows. Narrow this and more become available.`,
    scoped: (names: string, n: number) =>
      `Safe across ${names}. ` + (n ? `${n} gesture${n === 1 ? '' : 's'} withheld.` : 'Nothing withheld.'),
  },
  ar: {
    open: (n: number) =>
      `لم تُحدَّد لغات الزوار، فيستخدم الباب الإشارات الآمنة في اللغات الـ${n} التي يعرفها جميعاً. ` +
      `ضيّقوا الاختيار لتتاح إشارات أكثر.`,
    scoped: (names: string, n: number) =>
      `آمنة لدى ${names}. ` + (n ? `حُجبت ${n} إشارة.` : 'لم يُحجب شيء.'),
  },
}

export function resolve(residentCode: string, visitorCodes: string[]): LocaleResolution {
  const resident = LOCALES[residentCode] ?? LOCALES[DEFAULT_RESIDENT]

  // With nothing configured, assume the visitor could be from anywhere the
  // product knows about. That is the most conservative reading, and it is the
  // right default for a device that answers the door to strangers.
  const codes = visitorCodes.length > 0 ? visitorCodes : Object.keys(LOCALES)
  const visitorLocales = codes.map((c) => LOCALES[c]).filter(Boolean)

  const perLocale = visitorLocales.map((l) => new Set(availableGestures(l.code)))
  const safeGestures = availableGestures(resident.code).filter((g) =>
    perLocale.every((set) => set.has(g)),
  )

  const excluded: { gesture: GestureId; because: string }[] = []
  for (const l of visitorLocales) {
    for (const [gesture, rule] of Object.entries(l.blocked)) {
      if (safeGestures.includes(gesture as GestureId)) continue
      if (excluded.some((e) => e.gesture === gesture)) continue
      excluded.push({
        gesture: gesture as GestureId,
        because: `${l.name}: ${rule.severity}${rule.substitute ? ` — offers ${rule.substitute} instead` : ''}`,
      })
    }
  }

  const e = residentCode.startsWith('ar') ? EXPLAIN.ar : EXPLAIN.en
  const explanation =
    visitorCodes.length === 0
      ? e.open(visitorLocales.length)
      : e.scoped(
          visitorLocales.map((l) => (residentCode.startsWith('ar') ? l.nativeName : l.name)).join('، '),
          excluded.length,
        )

  return { resident, visitorLocales, safeGestures, excluded, explanation }
}

/** Locales grouped for the switcher, so the list is scannable rather than alphabetical. */
/**
 * The label to show for a locale inside a given list.
 *
 * The endonym alone is the right thing to show most of the time — a resident
 * looking for their language scans for the word they would write themselves,
 * not for "Arabic (Egypt)". But endonyms are not unique. Listed flat, en-US and
 * en-NG are both "English" and ar-SA and ar-EG are both "العربية", and the
 * picker asks the resident to choose between two identical rows.
 *
 * So the region is appended only where the list actually needs it. Inside the
 * visitor groups it usually does not, because those are already split by
 * continent; in the flat resident list it always does.
 */
export function localeLabel(code: string, within: readonly string[]): string {
  const l = LOCALES[code]
  if (!l) return code
  const ambiguous = within.some((other) => other !== code && LOCALES[other]?.nativeName === l.nativeName)
  return ambiguous ? `${l.nativeName} · ${l.nativeRegion}` : l.nativeName
}

export const LOCALE_GROUPS: { label: string; codes: string[] }[] = [
  { label: 'Europe', codes: ['en-GB', 'fr-FR', 'el-GR', 'tr-TR'] },
  { label: 'Americas', codes: ['en-US', 'es-MX', 'pt-BR'] },
  { label: 'Middle East', codes: ['ar-SA', 'ar-EG'] },
  { label: 'Asia', codes: ['ja-JP', 'ko-KR', 'zh-CN', 'hi-IN'] },
  { label: 'Africa', codes: ['en-NG', 'sw-KE'] },
].map((g) => ({ ...g, codes: g.codes.filter((c) => LOCALES[c]) }))
