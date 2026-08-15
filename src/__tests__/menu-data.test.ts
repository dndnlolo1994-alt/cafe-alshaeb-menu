import { describe, expect, it } from 'vitest'
import { categories, items } from '../data/menu'

/**
 * Guards the transcription itself. These are the numbers counted off the
 * photographs in /pic; if an edit changes a total, that is a signal to re-check
 * against the source page rather than to update the number here.
 */
const EXPECTED_CATEGORIES = 17
const EXPECTED_ITEMS = 114
const EXPECTED_PRICE_POINTS = 128

describe('menu data shape', () => {
  it('has the transcribed number of categories and items', () => {
    expect(categories).toHaveLength(EXPECTED_CATEGORIES)
    expect(items).toHaveLength(EXPECTED_ITEMS)
    expect(items.reduce((sum, item) => sum + item.variants.length, 0)).toBe(
      EXPECTED_PRICE_POINTS,
    )
  })

  it('uses unique ids', () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length)
    expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length)
  })

  it('points every item at a category that exists', () => {
    const ids = new Set(categories.map((c) => c.id))
    for (const item of items) {
      expect(ids, `${item.id} → ${item.category}`).toContain(item.category)
    }
  })

  it('leaves no category empty', () => {
    for (const category of categories) {
      const count = items.filter((i) => i.category === category.id).length
      expect(count, `category ${category.id}`).toBeGreaterThan(0)
    }
  })

  it('orders items uniquely inside each category', () => {
    for (const category of categories) {
      const orders = items
        .filter((i) => i.category === category.id)
        .map((i) => i.displayOrder)
      expect(new Set(orders).size, `category ${category.id}`).toBe(orders.length)
    }
  })
})

describe('bilingual completeness', () => {
  it('gives every category a name in both languages', () => {
    for (const category of categories) {
      expect(category.name.ar.trim(), category.id).not.toBe('')
      expect(category.name.en.trim(), category.id).not.toBe('')
    }
  })

  it('gives every item a name in both languages', () => {
    for (const item of items) {
      expect(item.name.ar.trim(), item.id).not.toBe('')
      expect(item.name.en.trim(), item.id).not.toBe('')
    }
  })

  it('never leaves half a translation behind', () => {
    for (const item of items) {
      if (item.description) {
        expect(item.description.ar.trim(), `${item.id} description.ar`).not.toBe('')
        expect(item.description.en.trim(), `${item.id} description.en`).not.toBe('')
      }
      if (item.note) {
        expect(item.note.ar.trim(), `${item.id} note.ar`).not.toBe('')
        expect(item.note.en.trim(), `${item.id} note.en`).not.toBe('')
      }
      for (const option of item.options ?? []) {
        expect(option.ar.trim(), `${item.id} option.ar`).not.toBe('')
        expect(option.en.trim(), `${item.id} option.en`).not.toBe('')
      }
      for (const variant of item.variants) {
        if (variant.label) {
          expect(variant.label.ar.trim(), `${item.id}/${variant.id}`).not.toBe('')
          expect(variant.label.en.trim(), `${item.id}/${variant.id}`).not.toBe('')
        }
      }
    }
  })

  it('writes Arabic names in Arabic script', () => {
    const arabic = /[؀-ۿ]/
    for (const item of items) {
      expect(arabic.test(item.name.ar), `${item.id}: "${item.name.ar}"`).toBe(true)
    }
  })
})

describe('prices', () => {
  it('are positive and never carry more than two decimals', () => {
    for (const item of items) {
      for (const variant of item.variants) {
        expect(variant.price, `${item.id}/${variant.id}`).toBeGreaterThan(0)
        expect(
          Math.round(variant.price * 100),
          `${item.id}/${variant.id} has sub-piastre precision`,
        ).toBeCloseTo(variant.price * 100, 6)
      }
    }
  })

  it('keeps the exact figures printed on the paper menu', () => {
    const priceOf = (id: string, variantId = 'standard') =>
      items.find((i) => i.id === id)?.variants.find((v) => v.id === variantId)?.price

    // Spot checks across every page, including the decimals most at risk of
    // being misread (0,50 vs 5,00 and 0,65 vs 6,50).
    expect(priceOf('mineral-water')).toBe(0.5)
    expect(priceOf('soft-drinks')).toBe(0.6)
    expect(priceOf('tea')).toBe(0.65)
    expect(priceOf('ice-cream-scoop')).toBe(0.85)
    expect(priceOf('single-turkish-coffee')).toBe(0.95)
    expect(priceOf('classic-kumpir')).toBe(1.25)
    expect(priceOf('arayes')).toBe(1.25)
    expect(priceOf('double-espresso')).toBe(1.9)
    expect(priceOf('mini-pizza')).toBe(1.95)
    expect(priceOf('milk-shake')).toBe(2.45)
    expect(priceOf('cappuccino')).toBe(2.55)
    expect(priceOf('grilled-chicken-breast')).toBe(5.95)
    expect(priceOf('fettuccine-alfredo')).toBe(3.75)
    expect(priceOf('sheshah')).toBe(3.4)
    expect(priceOf('fish-and-chips')).toBe(12)
    expect(priceOf('alshaeb-seafood-bucket')).toBe(16)

    // Weight tiers must not be swapped between sizes.
    expect(priceOf('local-mixed-grill', 'g250')).toBe(7)
    expect(priceOf('local-mixed-grill', 'g500')).toBe(13)
    expect(priceOf('local-mixed-grill', 'g1000')).toBe(25)
    expect(priceOf('smoked-lamb', 'g300')).toBe(7)
    expect(priceOf('smoked-lamb', 'g500')).toBe(13)
    expect(priceOf('smoked-lamb', 'g1000')).toBe(24)
    expect(priceOf('smoked-beef-imported', 'g1000')).toBe(17)
  })

  it('rises with size on every multi-size item', () => {
    for (const item of items.filter((i) => i.variants.length > 1)) {
      const prices = item.variants.map((v) => v.price)
      const ascending = prices.every((p, i) => i === 0 || p > prices[i - 1])
      expect(ascending, `${item.id}: ${prices.join(' → ')}`).toBe(true)
    }
  })
})

describe('provenance', () => {
  it('records the source photograph for every row', () => {
    for (const item of items) {
      expect(item.ocrSource, item.id).toMatch(/^pic\/.+\.jpeg$/)
    }
    for (const category of categories) {
      expect(category.ocrSource, category.id).toMatch(/^pic\/.+\.jpeg$/)
    }
  })

  it('explains every item that is not fully verified', () => {
    for (const item of items.filter((i) => i.verificationStatus === 'needs_confirmation')) {
      expect(item.note, `${item.id} must carry a note`).toBeDefined()
    }
  })

  it('never references an image file that was not supplied', () => {
    for (const item of items) {
      if (item.image) expect(item.imageAlt, `${item.id} needs alt text`).toBeDefined()
    }
  })
})
