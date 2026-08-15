import { useEffect, useState } from 'react'
import { pickActiveSection, type SectionTop } from '../utils/active-section'

/** Used until the sticky bar can be measured. */
const FALLBACK_BAR_H = 68

/**
 * Tracks which category section is currently under the sticky bar.
 *
 * Section offsets are measured once and cached, so the scroll handler is pure
 * arithmetic and never forces a layout while the reader is moving. The cache
 * is refreshed whenever the menu actually changes height — a font swapping in,
 * a search filtering the list, or the window resizing.
 *
 * Position is read directly rather than watched with an IntersectionObserver:
 * an observer only reports threshold crossings, so a fast flick can carry a
 * short section straight past the detection band without firing, leaving the
 * highlight stuck on whatever it last saw.
 */
export function useActiveCategory(categoryIds: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(categoryIds[0] ?? null)

  useEffect(() => {
    if (!enabled || categoryIds.length === 0) {
      return
    }

    let sections: SectionTop[] = []
    let barHeight = FALLBACK_BAR_H
    let documentHeight = 0

    const measure = () => {
      const bar = document.querySelector<HTMLElement>('.catbar')
      barHeight = bar?.offsetHeight || FALLBACK_BAR_H
      documentHeight = document.documentElement.scrollHeight

      sections = []
      for (const id of categoryIds) {
        const el = document.getElementById(`section-${id}`)
        if (el) sections.push({ id, top: el.getBoundingClientRect().top + window.scrollY })
      }
    }

    const update = () => {
      const next = pickActiveSection(
        sections,
        window.scrollY,
        barHeight,
        window.innerHeight,
        documentHeight,
      )
      // React bails out on an unchanged value, so this does not re-render on
      // every scroll event.
      if (next) setActive(next)
    }

    const remeasure = () => {
      measure()
      update()
    }

    measure()
    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', remeasure)

    // Catches anything that shifts the sections: the webfont swapping in,
    // long names re-wrapping, or the rendered list changing.
    const observer = new ResizeObserver(remeasure)
    const main = document.getElementById('menu')
    if (main) observer.observe(main)

    // The font can land after the first measurement.
    document.fonts?.ready.then(remeasure).catch(() => {})

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', remeasure)
      observer.disconnect()
    }
  }, [categoryIds, enabled])

  return active
}
