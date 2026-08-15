import { useCallback, useEffect, useMemo, useState } from 'react'
import { categories, items } from './data/menu'
import { buildSearchIndex, searchItems } from './utils/search'
import { useIntro } from './hooks/useIntro'
import { useT } from './i18n/useLanguage'
import { BackToTop } from './components/BackToTop'
import { BookIntro } from './components/BookIntro'
import { CategoryBar } from './components/CategoryBar'
import { CategoryGrid } from './components/CategoryGrid'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ItemCard } from './components/ItemCard'
import { ItemModal } from './components/ItemModal'
import { SearchBar } from './components/SearchBar'
import { StructuredData } from './components/StructuredData'
import type { MenuItem } from './types'

const sortedCategories = categories.slice().sort((a, b) => a.displayOrder - b.displayOrder)
const sortedItems = items.slice().sort((a, b) => a.displayOrder - b.displayOrder)
const availableItems = sortedItems.filter((item) => item.available)

export function App() {
  const { t, pick } = useT()
  const [query, setQuery] = useState('')
  /** null means the category overview; otherwise the category being read. */
  const [selected, setSelected] = useState<string | null>(null)
  const [openItem, setOpenItem] = useState<MenuItem | null>(null)
  const intro = useIntro()

  const index = useMemo(() => buildSearchIndex(sortedItems, sortedCategories), [])
  const searching = query.trim() !== ''

  const results = useMemo(
    () => (searching ? searchItems(query, availableItems, index) : []),
    [query, searching, index],
  )

  const counts = useMemo(
    () =>
      sortedCategories.map((category) => ({
        category,
        count: availableItems.filter((item) => item.category === category.id).length,
      })),
    [],
  )

  // Search results stay grouped so a match keeps the context of its category.
  const resultGroups = useMemo(
    () =>
      sortedCategories
        .map((category) => ({
          category,
          items: results.filter((item) => item.category === category.id),
        }))
        .filter((group) => group.items.length > 0),
    [results],
  )

  const currentCategory = sortedCategories.find((c) => c.id === selected)
  const currentItems = useMemo(
    () => (selected ? availableItems.filter((item) => item.category === selected) : []),
    [selected],
  )

  const chooseCategory = useCallback((id: string | null) => {
    setSelected(id)
    setQuery('')
  }, [])

  // Opening a category should start at its first item, not wherever the reader
  // happened to be in the previous one.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [selected])

  const showBar = searching || selected !== null

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
          resultCount={searching ? results.length : null}
        />
      </div>

      {/*
        Not wrapped in a .shell: a sticky element can only travel within its
        parent's box, so a wrapper only as tall as the bar would let it scroll
        away on the first swipe. It spans the page and constrains its own
        contents instead.
      */}
      {showBar && (
        <CategoryBar
          categories={sortedCategories}
          activeId={searching ? null : selected}
          onSelect={chooseCategory}
        />
      )}

      <main id="menu" className="shell">
        {searching ? (
          <>
            <h2 className="sr-only">{t('menuHeading')}</h2>
            {resultGroups.length === 0 ? (
              <div className="empty">
                <p className="empty__title">{t('noResultsTitle')}</p>
                <p className="empty__body">{t('noResultsBody')}</p>
              </div>
            ) : (
              resultGroups.map(({ category, items: groupItems }) => (
                <section key={category.id} className="section">
                  <div className="section__head">
                    <h3 className="section__title">{pick(category.name)}</h3>
                    <span className="section__rule" aria-hidden="true" />
                    <span className="section__count">
                      {groupItems.length} {t('itemsInCategory')}
                    </span>
                  </div>
                  <ul className="items">
                    {groupItems.map((item) => (
                      <ItemCard key={item.id} item={item} onOpen={setOpenItem} />
                    ))}
                  </ul>
                </section>
              ))
            )}
          </>
        ) : selected && currentCategory ? (
          <section className="section">
            <div className="section__head">
              <h2 className="section__title">{pick(currentCategory.name)}</h2>
              <span className="section__rule" aria-hidden="true" />
              <span className="section__count">
                {currentItems.length} {t('itemsInCategory')}
              </span>
            </div>
            <ul className="items">
              {currentItems.map((item) => (
                <ItemCard key={item.id} item={item} onOpen={setOpenItem} />
              ))}
            </ul>
          </section>
        ) : (
          <>
            <h2 className="overview__title">{t('browseTitle')}</h2>
            <CategoryGrid categories={counts} onSelect={chooseCategory} />
          </>
        )}
      </main>

      <Footer onReplayIntro={intro.replay} />
      <BackToTop />

      {openItem && (
        <ItemModal
          item={openItem}
          category={sortedCategories.find((c) => c.id === openItem.category)}
          onClose={() => setOpenItem(null)}
        />
      )}
    </>
  )
}
