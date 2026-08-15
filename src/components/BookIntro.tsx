import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/useLanguage'
import { siteConfig } from '../config/site'

/** Matches the cover transition in components.css, plus the fade-out. */
const OPEN_MS = 1150
const FADE_MS = 450

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Falls back to the flat fade only on genuinely weak hardware.
 *
 * Keyed on reported RAM rather than core count on purpose: iPhones report four
 * cores, and a core-count test would quietly drop the animation on exactly the
 * devices that run it best. A single rotateY is cheap, so only phones
 * advertising 1 GB or less opt out. `deviceMemory` is Chromium-only; where it
 * is missing the animation simply plays.
 */
function isLowPowerDevice(): boolean {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  return typeof memory === 'number' && memory > 0 && memory <= 1
}

export function BookIntro({ onDone }: { onDone: () => void }) {
  const { t, lang } = useT()
  const [opening, setOpening] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [plain, setPlain] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    setPlain(prefersReducedMotion() || isLowPowerDevice())
    openButtonRef.current?.focus()
    const ids = timers.current
    return () => ids.forEach(clearTimeout)
  }, [])

  const finish = (animate: boolean) => {
    if (opening || leaving) return
    if (!animate) {
      onDone()
      return
    }
    setOpening(true)

    // Reduced motion means the cover fade is near-instant, so waiting out the
    // full timings would just be a blank pause. Only the 3D path needs the
    // cover to finish swinging before the menu is revealed.
    const reduced = prefersReducedMotion()
    const hold = reduced ? 120 : plain ? FADE_MS : OPEN_MS
    const tail = reduced ? 120 : FADE_MS

    timers.current.push(
      window.setTimeout(() => setLeaving(true), hold),
      window.setTimeout(onDone, hold + tail),
    )
  }

  // Escape skips straight through, like the Skip button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const classes = ['intro']
  if (opening) classes.push('is-opening')
  if (leaving) classes.push('is-leaving')
  if (plain) classes.push('is-plain')

  return (
    <div
      className={classes.join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label={siteConfig.name[lang]}
    >
      <div className="intro__stage">
        <div className="intro__cover">
          <span className="intro__spine" />
          <div className="intro__medallion">
            <img
              src="brand/logo.webp"
              alt={siteConfig.name[lang]}
              width={512}
              height={512}
              fetchPriority="high"
            />
          </div>
          <p className="intro__name">{siteConfig.name.en}</p>
        </div>
      </div>

      <div className="intro__actions">
        <button
          type="button"
          className="btn-open"
          ref={openButtonRef}
          onClick={() => finish(true)}
        >
          {t('openMenu')}
        </button>
        <button type="button" className="btn-skip" onClick={() => finish(false)}>
          {t('skip')}
        </button>
      </div>
    </div>
  )
}
