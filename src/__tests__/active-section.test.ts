import { describe, expect, it } from 'vitest'
import { pickActiveSection, type SectionTop } from '../utils/active-section'

/** Roughly the real menu: a tall page of unevenly sized sections. */
const SECTIONS: SectionTop[] = [
  { id: 'pasta', top: 225 },
  { id: 'main-course', top: 811 },
  { id: 'fish-seafood', top: 1493 },
  { id: 'snacks', top: 1977 },
  { id: 'grills', top: 5169 },
  { id: 'sweets', top: 8244 },
  { id: 'chiller', top: 11005 },
]

const BAR = 57
const VIEWPORT = 678
const DOC = 11824

const activeAt = (scrollY: number, doc = DOC) =>
  pickActiveSection(SECTIONS, scrollY, BAR, VIEWPORT, doc)

describe('pickActiveSection', () => {
  it('starts on the first section at the top of the page', () => {
    expect(activeAt(0)).toBe('pasta')
  })

  it('advances as each heading passes under the sticky bar', () => {
    expect(activeAt(1000)).toBe('main-course')
    expect(activeAt(1600)).toBe('fish-seafood')
    expect(activeAt(3000)).toBe('snacks')
    expect(activeAt(6000)).toBe('grills')
    expect(activeAt(9000)).toBe('sweets')
  })

  it('switches exactly when the heading crosses the bar, not before', () => {
    const boundary = SECTIONS[1].top - BAR // main-course heading meets the bar
    expect(activeAt(boundary - 2)).toBe('pasta')
    expect(activeAt(boundary + 2)).toBe('main-course')
  })

  it('never skips ahead to a section still below the fold', () => {
    // Sweets starts at 8244; at 6000 it is far below and must not win.
    expect(activeAt(6000)).not.toBe('sweets')
  })

  it('moves only forwards as the reader scrolls down', () => {
    let lastIndex = -1
    for (let y = 0; y <= DOC - VIEWPORT; y += 100) {
      const id = activeAt(y)
      const index = SECTIONS.findIndex((s) => s.id === id)
      expect(index, `went backwards at y=${y}`).toBeGreaterThanOrEqual(lastIndex)
      lastIndex = index
    }
  })

  it('gives the last section the bottom of the page', () => {
    // A short closing section may never reach the bar, so bottoming out wins.
    expect(activeAt(DOC - VIEWPORT)).toBe('chiller')
  })

  it('is stable however far the scroll jumps — no crossing required', () => {
    // The failure mode of an IntersectionObserver: teleporting past a section.
    expect(activeAt(9000)).toBe('sweets')
    expect(activeAt(0)).toBe('pasta')
    expect(activeAt(9000)).toBe('sweets')
  })

  it('handles a page shorter than the viewport', () => {
    const short: SectionTop[] = [{ id: 'only', top: 100 }]
    expect(pickActiveSection(short, 0, BAR, 678, 400)).toBe('only')
  })

  it('returns null when there is nothing to track', () => {
    expect(pickActiveSection([], 0, BAR, VIEWPORT, DOC)).toBeNull()
  })
})
