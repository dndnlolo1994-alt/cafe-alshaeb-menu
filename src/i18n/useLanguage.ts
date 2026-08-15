import { useContext } from 'react'
import { LanguageContext, type LanguageContextValue } from './language-context'
import { ui, type UiKey } from './strings'
import type { Localized } from '../types'

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}

/** UI string plus a helper for picking a side of any {ar, en} pair. */
export function useT() {
  const { lang, dir } = useLanguage()
  return {
    lang,
    dir,
    t: (key: UiKey) => ui[key][lang],
    pick: (value: Localized) => value[lang],
  }
}
