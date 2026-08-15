import type { MenuItem, Category, Lang } from '../types'

/**
 * Folds away the spelling differences people actually type: Arabic diacritics,
 * the alef/ya/ta-marbuta variants, tatweel, Arabic-Indic digits, and case.
 * "شاي" matches "الشاي", "cappucino" matches "Cappuccino" via the trimming
 * below, and an Arabic speaker typing "قهوه" still finds "قهوة".
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    // Arabic-Indic and extended Arabic-Indic digits → Latin digits.
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    // Harakat, superscript alef and tatweel carry no search value.
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[آأإٱ]/g, 'ا') // آ أ إ ٱ → ا
    .replace(/ى/g, 'ي') // ى → ي
    .replace(/ة/g, 'ه') // ة → ه
    .replace(/ؤ/g, 'و') // ؤ → و
    .replace(/ئ/g, 'ي') // ئ → ي
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** Collapses doubled letters so "cappucino" still finds "Cappuccino". */
function loosen(value: string): string {
  return value.replace(/(.)\1+/g, '$1')
}

/**
 * The haystack for one item: both languages of the name, description, options
 * and its category, so a search works whichever language the visitor types.
 */
function haystack(item: MenuItem, categories: Category[]): string {
  const category = categories.find((c) => c.id === item.category)
  const parts = [
    item.name.ar,
    item.name.en,
    item.description?.ar ?? '',
    item.description?.en ?? '',
    category?.name.ar ?? '',
    category?.name.en ?? '',
    ...(item.options ?? []).flatMap((o) => [o.ar, o.en]),
    ...item.variants.flatMap((v) => [v.label?.ar ?? '', v.label?.en ?? '']),
  ]
  return normalize(parts.join(' '))
}

export interface SearchIndexEntry {
  id: string
  text: string
  loose: string
}

export function buildSearchIndex(items: MenuItem[], categories: Category[]): SearchIndexEntry[] {
  return items.map((item) => {
    const text = haystack(item, categories)
    return { id: item.id, text, loose: loosen(text) }
  })
}

/**
 * Every whitespace-separated term must appear somewhere in the item, so
 * "iced latte" narrows rather than widens.
 */
export function searchItems(
  query: string,
  items: MenuItem[],
  index: SearchIndexEntry[],
): MenuItem[] {
  const terms = normalize(query).split(' ').filter(Boolean)
  if (terms.length === 0) return items

  const looseTerms = terms.map(loosen)
  const byId = new Map(index.map((entry) => [entry.id, entry]))

  return items.filter((item) => {
    const entry = byId.get(item.id)
    if (!entry) return false
    return terms.every(
      (term, i) => entry.text.includes(term) || entry.loose.includes(looseTerms[i]),
    )
  })
}

/** Formats a price the way the paper menu does, always to two decimals. */
export function formatPrice(price: number, lang: Lang, currency: { ar: string; en: string }): string {
  const amount = price.toFixed(2)
  return lang === 'ar' ? `${amount} ${currency.ar}` : `${amount} ${currency.en}`
}
