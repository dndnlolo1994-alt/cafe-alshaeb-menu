import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './language-context'
import { siteConfig } from '../config/site'
import type { Lang } from '../types'

const STORAGE_KEY = 'alshaeb.lang'

function readStoredLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    // Private browsing can throw on access; fall through to the default.
  }
  return siteConfig.features.defaultLang
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // A failed save just means the choice is not remembered next visit.
    }
  }, [])

  // The whole document flips direction; no reload, no remount.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title =
      lang === 'ar'
        ? `${siteConfig.name.ar} — المنيو`
        : `${siteConfig.name.en} — Menu`
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === 'ar' ? 'en' : 'ar'),
      dir: lang === 'ar' ? 'rtl' : 'ltr',
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
