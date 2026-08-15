/**
 * Everything about the venue that is not the menu itself.
 *
 * Contact details, address and opening hours do NOT appear anywhere in the
 * photographs in /pic, so they are left empty on purpose rather than invented.
 * Anything left empty is simply not rendered — the footer hides the row and the
 * structured data omits the field. Fill a value in and it appears.
 */

export interface ContactChannel {
  /** Empty string = not known yet, so nothing is shown to visitors. */
  value: string
  /** Set false to keep a value in the file but hide it from the page. */
  enabled: boolean
}

export interface OpeningHours {
  /** e.g. { ar: 'يوميًا', en: 'Daily' } */
  daysAr: string
  daysEn: string
  /** e.g. '10:00' */
  opens: string
  closes: string
}

export const siteConfig = {
  name: {
    ar: 'كافيه الشعب',
    en: 'Cafe AlShaeb',
  },

  tagline: {
    ar: 'مذاق شعبي أصيل',
    en: 'Authentic local flavour',
  },

  currency: {
    /** Shown after the number in the Arabic UI. */
    ar: 'د.أ',
    /** Shown after the number in the English UI. */
    en: 'JOD',
    /** ISO 4217, used only in structured data. */
    code: 'JOD',
  },

  /**
   * Printed at the bottom of every page of the paper menu:
   * "يضاف 10% بدل خدمة و 7% بدل ضريبة"
   */
  serviceNote: {
    ar: 'يضاف 10% بدل خدمة و 7% بدل ضريبة',
    en: '10% service charge and 7% tax will be added',
  },

  // ── Contact — fill these in; empty values are never shown ────────────────
  contact: {
    phone: { value: '', enabled: true } as ContactChannel,
    /** International format without '+', e.g. '9627XXXXXXXX'. */
    whatsapp: { value: '', enabled: true } as ContactChannel,
    email: { value: '', enabled: true } as ContactChannel,
  },

  address: {
    ar: '',
    en: '',
    /** Full Google Maps URL. */
    mapUrl: '',
  },

  /** Add one entry per distinct schedule; an empty array hides the section. */
  openingHours: [] as OpeningHours[],

  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },

  /** Canonical URL of the deployed menu, used for Open Graph and the QR code. */
  siteUrl: '',

  features: {
    /** Turn the book-opening intro off entirely. */
    bookIntro: true,
    /** Default language when the visitor has no saved preference. */
    defaultLang: 'ar' as const,
  },
} as const

/** True when at least one contact detail is filled in. */
export function hasAnyContact(): boolean {
  const c = siteConfig.contact
  return [c.phone, c.whatsapp, c.email].some((ch) => ch.enabled && ch.value.trim() !== '')
}

/** True when at least one social link is filled in. */
export function hasAnySocial(): boolean {
  return Object.values(siteConfig.social).some((v) => v.trim() !== '')
}
