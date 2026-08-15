import { useEffect, useState } from 'react'

/**
 * Tracks which category section is currently under the sticky bar.
 *
 * The observer's top margin matches the bar height so a section counts as
 * "active" once its heading clears the bar, not when it first peeks in.
 */
export function useActiveCategory(categoryIds: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(categoryIds[0] ?? null)

  useEffect(() => {
    if (!enabled || categoryIds.length === 0) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id.replace(/^section-/, '')
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio)
          else visible.delete(id)
        }

        // Whichever visible section comes first in menu order wins, so scrolling
        // down advances the chip exactly when a new section takes the top slot.
        const firstVisible = categoryIds.find((id) => visible.has(id))
        if (firstVisible) setActive(firstVisible)
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0, 0.01, 0.25],
      },
    )

    const elements = categoryIds
      .map((id) => document.getElementById(`section-${id}`))
      .filter((el): el is HTMLElement => el !== null)

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [categoryIds, enabled])

  return active
}
