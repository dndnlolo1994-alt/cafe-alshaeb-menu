/** A section's distance from the top of the document. */
export interface SectionTop {
  id: string
  top: number
}

/**
 * Decides which section a reader is currently looking at.
 *
 * Kept free of the DOM so the rules are testable on their own: it takes plain
 * numbers and returns an id. `sections` must be in document order.
 */
export function pickActiveSection(
  sections: SectionTop[],
  scrollY: number,
  barHeight: number,
  viewportHeight: number,
  documentHeight: number,
): string | null {
  if (sections.length === 0) return null

  // The closing sections are often too short to ever push their heading past
  // the bar, so once the page bottoms out the last one wins outright.
  // Otherwise those categories could never be highlighted at all.
  if (viewportHeight + scrollY >= documentHeight - 2) {
    return sections[sections.length - 1].id
  }

  // A section becomes current as soon as its heading passes under the bar.
  const line = scrollY + barHeight + 1

  let current = sections[0].id
  for (const section of sections) {
    if (section.top <= line) current = section.id
    else break
  }
  return current
}
