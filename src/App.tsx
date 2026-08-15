import { useMemo, useState } from 'react'
import { categories, items } from './data/menu'
import { buildSearchIndex, searchItems } from './utils/search'
import { useActiveCategory } from './hooks/useActiveCategory'
import { useIntro } from './hooks/useIntro'
import { useT } from './i18n/useLanguage'
import { BackToTop } from './components/BackToTop'
import { BookIntro } from './components/BookIntro'
import { CategoryBar } from './components/CategoryBar'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ItemCard } from './components/ItemCard'
import { ItemModal } from './components/ItemModal'
import { SearchBar } from './components/SearchBar'
import { StructuredData } from './components/StructuredData'
import type { MenuItem } from './types'

const sortedCategories = categories.slice().sort((a, b) => a.displayOrder - b.displayOrder)
const sortedItems = items.slice().sort((a, b) => a.displayOrder - b.displayOrder)

export function App() {
  const { t, pick } = useT()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const intro = useIntro()

  const index = useMemo(() => buildSearchIndex(sortedItems, sortedCategories), [])

  const visibleItems = useMemo(
    () => searchItems(query, sortedItems.filter((item) => item.available), index),
    [query, index],
  )

  // Only categories that still have something to show are rendered, so a
  // search never leaves empty headings behind.
  const groups = useMemo(
    () =>
      sortedCategories
        .map((category) => ({
          category,
          items: visibleItems.filter((item) => item.category === category.id),
        }))
        .filter((group) => group.items.length > 0),
    [visibleItems],
  )

  const searching = query.trim() !== ''
  const visibleCategoryIds = useMemo(() => groups.map((g) => g.category.id), [groups])
  const activeCategory = useActiveCategory(visibleCategoryIds, !intro.visible)

  return (
    <>
      <StructuredData />

      {intro.visible && <BookIntro onDone={intro.dismiss} />}

      <a className="skip-link" href="#menu">
        {t('menuHeading')}
      </a>

      <Header />

      <div className="shell">
        <SearchBar
          value={query}
          onChange={setQuery}
          resultCount={searching ? visibleItems.length : null}
        />
      </div>

      <div className="shell">
        <CategoryBar categories={groups.map((g) => g.category)} activeId={activeCategory} />
      </div>

      <main id="menu" className="shell">
        <h2 className="sr-only">{t('menuHeading')}</h2>

        {groups.length === 0 ? (
          <div className="empty">
            <p className="empty__title">{t('noResultsTitle')}</p>
            <p className="empty__body">{t('noResultsBody')}</p>
          </div>
        ) : (
          groups.map(({ category, items: groupItems }) => (
            <section
              key={category.id}
              className="section"
              id={`section-${category.id}`}
              aria-labelledby={`heading-${category.id}`}
            >
              <div className="section__head">
                <h3 className="section__title" id={`heading-${category.id}`}>
                  {pick(category.name)}
                </h3>
                <span className="section__rule" aria-hidden="true" />
                <span className="section__count">
                  {groupItems.length} {t('itemsInCategory')}
                </span>
              </div>

              <ul className="items">
                {groupItems.map((item) => (
                  <ItemCard key={item.id} item={item} onOpen={setSelected} />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <Footer onReplayIntro={intro.replay} />
      <BackToTop />

      {selected && (
        <ItemModal
          item={selected}
          category={sortedCategories.find((c) => c.id === selected.category)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
