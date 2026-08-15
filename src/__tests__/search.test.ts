import { describe, expect, it } from 'vitest'
import { categories, items } from '../data/menu'
import { buildSearchIndex, formatPrice, normalize, searchItems } from '../utils/search'

const index = buildSearchIndex(items, categories)
const find = (query: string) => searchItems(query, items, index).map((i) => i.id)

describe('normalize', () => {
  it('folds the Arabic letter variants people actually type', () => {
    expect(normalize('قهوة')).toBe(normalize('قهوه'))
    expect(normalize('أرجيلة')).toBe(normalize('ارجيله'))
    expect(normalize('مانجا')).toBe(normalize('مانجا'))
    expect(normalize('شايْ')).toBe(normalize('شاي'))
  })

  it('strips diacritics and tatweel', () => {
    expect(normalize('كَبَاب')).toBe('كباب')
    expect(normalize('كــباب')).toBe('كباب')
  })

  it('converts Arabic-Indic digits', () => {
    expect(normalize('١٥٠')).toBe('150')
  })

  it('lowercases and drops punctuation', () => {
    expect(normalize('Fish & Chips')).toBe('fish chips')
  })
})

describe('search', () => {
  it('finds an item by its Arabic name', () => {
    expect(find('شيش طاووق')).toContain('shish-tawook')
  })

  it('finds the same item by its English name', () => {
    expect(find('shish tawook')).toContain('shish-tawook')
  })

  it('finds Arabic items while the query is English and vice versa', () => {
    expect(find('lasagna')).toContain('lasagna')
    expect(find('لزانيا')).toContain('lasagna')
  })

  it('matches on the category name', () => {
    expect(find('مشاوي').length).toBeGreaterThan(4)
    expect(find('sandwich')).toContain('halloumi-sandwich')
  })

  it('matches on a flavour listed as an option', () => {
    expect(find('watermelon')).toContain('sheshah')
    expect(find('بطيخ')).toContain('sheshah')
    expect(find('guava')).toContain('fresh-juice')
  })

  it('tolerates a doubled or missing letter', () => {
    expect(find('cappucino')).toContain('cappuccino')
    expect(find('cappuccino')).toContain('cappuccino')
  })

  it('narrows as terms are added', () => {
    const latte = find('latte')
    const icedLatte = find('iced latte')
    expect(latte.length).toBeGreaterThan(icedLatte.length)
    expect(icedLatte).toContain('iced-latte')
    expect(icedLatte).not.toContain('coffee-latte')
  })

  it('ignores surrounding whitespace and case', () => {
    expect(find('  MOJITO  ')).toContain('mojito')
  })

  it('returns everything for an empty query', () => {
    expect(find('')).toHaveLength(items.length)
    expect(find('   ')).toHaveLength(items.length)
  })

  it('returns nothing for a term that is not on the menu', () => {
    expect(find('zzzznotonmenu')).toHaveLength(0)
  })
})

describe('formatPrice', () => {
  const currency = { ar: 'د.أ', en: 'JOD' }

  it('always shows two decimals', () => {
    expect(formatPrice(0.5, 'en', currency)).toBe('0.50 JOD')
    expect(formatPrice(12, 'en', currency)).toBe('12.00 JOD')
    expect(formatPrice(3.4, 'en', currency)).toBe('3.40 JOD')
  })

  it('uses the Arabic currency mark in Arabic', () => {
    expect(formatPrice(2.55, 'ar', currency)).toBe('2.55 د.أ')
  })
})
