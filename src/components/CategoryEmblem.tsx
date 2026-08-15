import type { JSX } from 'react'

/**
 * Line-drawn emblem for each category, in the engraved style of the logo's
 * scalloped badge. Drawn rather than photographed on purpose: /pic holds no
 * real photographs of these dishes, and a drawing promises nothing about how a
 * plate arrives. They inherit currentColor, so one set works on every ground.
 */
const EMBLEMS: Record<string, JSX.Element> = {
  // Bowl of noodles with a fork resting in it.
  pasta: (
    <>
      <path d="M9 25h30a15 15 0 0 1-30 0Z" />
      <path d="M14 20c2-3 5-3 7 0M23 19c2-3 5-3 7 0M31 21c1.5-2 3.5-2 5 0" />
      <path d="M36 25V13m-2.5 0v5m5-5v5" />
    </>
  ),

  // Cloche lifting off a plate.
  'main-course': (
    <>
      <path d="M11 28a13 13 0 0 1 26 0Z" />
      <path d="M7 32h34" />
      <path d="M24 15v-3" />
      <circle cx="24" cy="11" r="1.6" />
    </>
  ),

  // Fish, tail to the left.
  'fish-seafood': (
    <>
      <path d="M17 24c5-8 16-9 22 0-6 9-17 8-22 0Z" />
      <path d="M17 24 9 18v12l8-6Z" />
      <circle cx="32" cy="22" r="1.4" />
      <path d="M25 19.5c1.5 3 1.5 6 0 9" />
    </>
  ),

  // Carton of fries.
  snacks: (
    <>
      <path d="M16 25h16l-2 14H18l-2-14Z" />
      <path d="M18 25V15m6 10V12m6 13V16" />
      <path d="M15 29h18" />
    </>
  ),

  // Split baked potato with toppings.
  kumpir: (
    <>
      <ellipse cx="24" cy="26" rx="15" ry="9" />
      <path d="M13 24c6-4 16-4 22 0" />
      <circle cx="20" cy="24" r="1.2" />
      <circle cx="25" cy="25.5" r="1.2" />
      <circle cx="30" cy="24" r="1.2" />
    </>
  ),

  // Balloon: friendly, and it promises nothing about the food.
  children: (
    <>
      <path d="M24 10c5 0 9 4 9 9s-4 11-9 11-9-6-9-11 4-9 9-9Z" />
      <path d="M24 30v3" />
      <path d="M24 33c-3 2 3 4 0 6" />
    </>
  ),

  // Cut of meat under rising smoke.
  'smoked-meat': (
    <>
      <path d="M12 27a12 8 0 0 1 24 0 12 8 0 0 1-24 0Z" />
      <path d="M18 27a6 4 0 0 1 12 0 6 4 0 0 1-12 0Z" />
      <path d="M18 16c2-2 0-4 2-6M24 15c2-2 0-4 2-6M30 16c2-2 0-4 2-6" />
    </>
  ),

  // Skewer over a flame.
  grills: (
    <>
      <path d="M10 14h28" />
      <rect x="14" y="10" width="7" height="8" rx="1.5" />
      <rect x="24" y="10" width="7" height="8" rx="1.5" />
      <path d="M24 38c-5 0-8-3-8-7 0-4 4-5 4-9 3 2 4 4 4 6 1-1 1.5-2.5 1.5-4 3 2 6.5 4 6.5 7 0 4-3 7-8 7Z" />
    </>
  ),

  // Sandwich cut on the diagonal.
  sandwich: (
    <>
      <path d="M9 32 24 14l15 18Z" />
      <path d="M15 27h18" />
      <path d="M19 22h10" />
    </>
  ),

  // Cup and saucer with steam.
  'hot-drinks': (
    <>
      <path d="M13 21h20v7a10 10 0 0 1-20 0v-7Z" />
      <path d="M33 23h3a4 4 0 0 1 0 8h-3" />
      <path d="M10 38h26" />
      <path d="M19 16c1.5-2 0-3.5 1-5M26 16c1.5-2 0-3.5 1-5" />
    </>
  ),

  // Tall iced glass with a straw.
  'cold-drinks': (
    <>
      <path d="M16 14h16l-2 24H18L16 14Z" />
      <path d="M27 14 31 8" />
      <rect x="19" y="20" width="5" height="5" rx="1" />
      <rect x="25" y="27" width="5" height="5" rx="1" />
    </>
  ),

  // Slice of layered cake with a cherry.
  sweets: (
    <>
      <path d="M12 34V20l12-6 12 6v14Z" />
      <path d="M12 26h24M12 20l12 6 12-6" />
      <circle cx="24" cy="11" r="2.4" />
    </>
  ),

  // Cone with a single scoop.
  'ice-cream': (
    <>
      <path d="M17 22h14L24 39Z" />
      <path d="M17 22a7 7 0 0 1 14 0" />
      <path d="M19 27h10M21 32h6" />
    </>
  ),

  // Hookah: base, stem, bowl and hose.
  sheshah: (
    <>
      <path d="M18 39a7 7 0 0 1 12 0Z" />
      <path d="M24 32V16" />
      <path d="M20 12h8v4h-8Z" />
      <path d="M24 22c5 0 9 2 9 6s-3 5-5 5" />
    </>
  ),

  // Cocktail glass with a garnish.
  cocktail: (
    <>
      <path d="M11 14h26L24 27Z" />
      <path d="M24 27v9" />
      <path d="M17 38h14" />
      <circle cx="33" cy="19" r="3.5" />
    </>
  ),

  // Tumbler with a citrus wheel.
  'fruit-juice': (
    <>
      <path d="M17 16h14l-2 22H19l-2-22Z" />
      <path d="M17 23h14" />
      <path d="M29 13a5 5 0 0 1 10 0Z" />
      <path d="M34 13v-5" />
    </>
  ),

  // Capped bottle.
  chiller: (
    <>
      <path d="M20 9h8v5l3 5v20a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V19l3-5Z" />
      <path d="M17 24h14" />
      <path d="M20 9h8" />
    </>
  ),
}

interface Props {
  categoryId: string
  className?: string
}

export function CategoryEmblem({ categoryId, className }: Props) {
  const art = EMBLEMS[categoryId]
  if (!art) return null

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {art}
    </svg>
  )
}

/** Category ids that have artwork, so a missing one can be caught by a test. */
export const EMBLEM_IDS = Object.keys(EMBLEMS)
