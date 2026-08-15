import { useT } from '../i18n/useLanguage'
import { CategoryEmblem } from './CategoryEmblem'
import type { Category } from '../types'

interface Props {
  categories: { category: Category; count: number }[]
  onSelect: (id: string) => void
}

/**
 * The opening view: every category at a glance, so a reader picks what they
 * want instead of scrolling past 114 items to find it.
 */
export function CategoryGrid({ categories, onSelect }: Props) {
  const { t, pick } = useT()

  return (
    <ul className="catgrid">
      {categories.map(({ category, count }) => (
        <li key={category.id}>
          <button
            type="button"
            className="cattile"
            onClick={() => onSelect(category.id)}
          >
            <span className="cattile__art">
              <CategoryEmblem categoryId={category.id} className="cattile__emblem" />
            </span>
            <span className="cattile__name">{pick(category.name)}</span>
            <span className="cattile__count">
              {count} {t('itemsInCategory')}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
