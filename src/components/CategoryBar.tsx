import { useEffect, useRef } from 'react'
import { useT } from '../i18n/useLanguage'
import { CategoryEmblem } from './CategoryEmblem'
import type { Category } from '../types'

interface Props {
  categories: Category[]
  activeId: string | null
  onSelect: (id: string | null) => void
}

export function CategoryBar({ categories, activeId, onSelect }: Props) {
  const { t, pick } = useT()
  const scroller = useRef<HTMLDivElement>(null)

  // Bring the selected chip into view.
  //
  // This scrolls the strip itself rather than calling chip.scrollIntoView():
  // that walks *every* scrollable ancestor, and because this bar is sticky it
  // sits inside the document's scroll-padding, so the browser judges the chip
  // obscured and scrolls the page to reveal it — throwing the reader back to
  // the top. Moving only this container can never touch the page position.
  useEffect(() => {
    const box = scroller.current
    if (!activeId || !box) return
    const chip = box.querySelector<HTMLElement>(`[data-cat="${activeId}"]`)
    if (!chip) return

    const boxRect = box.getBoundingClientRect()
    const chipRect = chip.getBoundingClientRect()

    const margin = 12
    const clipped =
      chipRect.left < boxRect.left + margin || chipRect.right > boxRect.right - margin
    if (!clipped) return

    // Bounding rects are physical pixels, so this centres the chip in both RTL
    // and LTR without depending on how a browser signs scrollLeft in RTL.
    const delta = chipRect.left + chipRect.width / 2 - (boxRect.left + boxRect.width / 2)
    box.scrollBy({
      left: delta,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [activeId])

  return (
    <nav className="catbar" aria-label={t('categoriesLabel')}>
      <div className="catbar__scroller" ref={scroller}>
        <button
          type="button"
          className="catbar__chip catbar__chip--all"
          data-cat="__all"
          aria-current={activeId === null}
          onClick={() => onSelect(null)}
        >
          {t('allCategories')}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="catbar__chip"
            data-cat={category.id}
            aria-current={activeId === category.id}
            onClick={() => onSelect(category.id)}
          >
            <CategoryEmblem categoryId={category.id} className="catbar__emblem" />
            {pick(category.name)}
          </button>
        ))}
      </div>
    </nav>
  )
}
