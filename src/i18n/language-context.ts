import { createContext } from 'react'
import type { Lang } from '../types'

export interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  /** 'rtl' for Arabic, 'ltr' for English. */
  dir: 'rtl' | 'ltr'
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
