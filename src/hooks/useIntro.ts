import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../config/site'

const STORAGE_KEY = 'alshaeb.introSeen'

function alreadySeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * The book cover runs on the first visit only. The flag is stored locally, so a
 * returning visitor lands straight on the menu; "replay" clears it for one run
 * without touching the stored value again until the intro finishes.
 */
export function useIntro() {
  const [visible, setVisible] = useState(
    () => siteConfig.features.bookIntro && !alreadySeen(),
  )

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Not remembering it is harmless; the intro simply shows again.
    }
  }, [])

  const dismiss = useCallback(() => {
    markSeen()
    setVisible(false)
  }, [markSeen])

  const replay = useCallback(() => setVisible(true), [])

  // The menu behind the cover must not scroll while it is up.
  useEffect(() => {
    if (!visible) return
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [visible])

  return { visible, dismiss, replay }
}
