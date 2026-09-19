'use client'

import { createContext, useContext } from 'react'
import { stringsFor, type Strings } from './strings'

/**
 * The resident's language, available anywhere without threading a prop through
 * every component. Defaults to English so a component rendered outside the
 * provider degrades to readable text rather than to blanks.
 */
const Ctx = createContext<{ t: Strings; locale: string }>({
  t: stringsFor('en-US'),
  locale: 'en-US',
})

export function I18nProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
  return <Ctx.Provider value={{ t: stringsFor(locale), locale }}>{children}</Ctx.Provider>
}

export function useT() {
  return useContext(Ctx).t
}

export function useLocale() {
  return useContext(Ctx).locale
}
