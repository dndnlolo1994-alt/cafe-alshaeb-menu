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
  useEffect(() => {
    if (!activeId || !scroller.current) return
    const chip = scroller.current.querySelector<HTMLElement>(`[data-cat="${activeId}"]`)
    if (!chip) return

    const box = scroller.current.getBoundingClientRect()
    const chipBox = chip.getBoundingClientRect()
    if (chipBox.left < box.left || chipBox.right > box.right) {
      chip.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
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
