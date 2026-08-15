export type Lang = 'ar' | 'en'

/** Every user-facing string exists in both languages, side by side. */
export interface Localized {
  ar: string
  en: string
}

/**
 * One purchasable size of an item. Items sold at a single price carry exactly
 * one variant with no label; a 250/500/1000 gm grill carries three.
 */
export interface Variant {
  id: string
  /** "500 gm (family)" — omitted when the item has only one price. */
  label?: Localized
  price: number
}

/** A choice that does not change the price, e.g. a shisha flavour. */
export type ItemOption = Localized

export interface MenuItem {
  id: string
  /** Id of the owning category. */
  category: string
  name: Localized
  description?: Localized
  /** Ordered, at least one. */
  variants: Variant[]
  options?: ItemOption[]
  /** Path under /public. Absent until a confirmed photo of this dish exists. */
  image?: string
  imageAlt?: Localized
  displayOrder: number
  /** Set to false to hide an item without deleting it. */
  available: boolean
  /** Source file in /pic the item was transcribed from. */
  ocrSource: string
  verificationStatus: 'verified' | 'needs_confirmation'
  /** Shown on the card when the paper menu carries a caveat. */
  note?: Localized
}

export interface Category {
  id: string
  name: Localized
  displayOrder: number
  ocrSource: string
}
