import { useEffect, useRef } from 'react'
import { useT } from '../i18n/useLanguage'
import type { Category } from '../types'

interface Props {
  categories: Category[]
  activeId: string | null
}

export function CategoryBar({ categories, activeId }: Props) {
  const { t, pick } = useT()
  const scroller = useRef<HTMLDivElement>(null)

  // Keep the highlighted chip in view as the page scrolls past sections.
  //
  // This deliberately scrolls the strip itself instead of calling
  // chip.scrollIntoView(). scrollIntoView walks *every* scrollable ancestor,
  // and because this bar is sticky at the top it sits inside the document's
  // scroll-padding — so the browser judges the chip obscured and scrolls the
  // page to reveal it, throwing the reader back to the top mid-scroll. Moving
  // only this container can never touch the page position.
  useEffect(() => {
    const box = scroller.current
    if (!activeId || !box) return
    const chip = box.querySelector<HTMLElement>(`[data-cat="${activeId}"]`)
    if (!chip) return

    const boxRect = box.getBoundingClientRect()
    const chipRect = chip.getBoundingClientRect()

    // Leave it alone while it is comfortably inside the strip, so the bar is
    // not nudging sideways on every section change.
    const margin = 12
    const clipped =
      chipRect.left < boxRect.left + margin || chipRect.right > boxRect.right - margin
    if (!clipped) return

    // Measured from bounding rects rather than scrollLeft: these are physical
    // pixels, so the same arithmetic centres the chip in both RTL and LTR
    // without depending on how a browser signs scrollLeft in RTL.
    const delta =
      chipRect.left + chipRect.width / 2 - (boxRect.left + boxRect.width / 2)

    box.scrollBy({
      left: delta,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [activeId])

  const jumpTo = (id: string) => {
    const target = document.getElementById(`section-${id}`)
    target?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  return (
    <nav className="catbar" aria-label={t('categoriesLabel')}>
      <div className="catbar__scroller" ref={scroller}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="catbar__chip"
            data-cat={category.id}
            aria-current={activeId === category.id}
            onClick={() => jumpTo(category.id)}
          >
            {pick(category.name)}
          </button>
        ))}
      </div>
    </nav>
  )
}
