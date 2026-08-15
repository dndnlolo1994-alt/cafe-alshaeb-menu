import type { Lang } from '../types'

/**
 * Every piece of chrome text. Item and category names live in data/menu.ts —
 * nothing bilingual is written inline in a component.
 */
export const ui = {
  openMenu: { ar: 'افتح المنيو', en: 'Open Menu' },
  skip: { ar: 'تخطي', en: 'Skip' },
  replayIntro: { ar: 'إعادة المقدمة', en: 'Replay intro' },

  searchLabel: { ar: 'ابحث في المنيو', en: 'Search the menu' },
  searchPlaceholder: { ar: 'ابحث عن صنف…', en: 'Search for an item…' },
  clearSearch: { ar: 'مسح البحث', en: 'Clear search' },
  noResultsTitle: { ar: 'لا توجد نتائج', en: 'No results' },
  noResultsBody: {
    ar: 'لم نعثر على أي صنف يطابق بحثك. جرّب كلمة أخرى.',
    en: 'Nothing matched your search. Try a different word.',
  },
  resultsCount: { ar: 'نتيجة', en: 'results' },

  categoriesLabel: { ar: 'أقسام المنيو', en: 'Menu categories' },
  allCategories: { ar: 'الكل', en: 'All' },

  languageToggle: { ar: 'English', en: 'العربية' },
  languageToggleLabel: { ar: 'Switch to English', en: 'التبديل إلى العربية' },

  backToTop: { ar: 'العودة إلى الأعلى', en: 'Back to top' },
  close: { ar: 'إغلاق', en: 'Close' },
  details: { ar: 'التفاصيل', en: 'Details' },
  options: { ar: 'الخيارات المتاحة', en: 'Available options' },
  sizes: { ar: 'الأحجام', en: 'Sizes' },
  unavailable: { ar: 'غير متوفر حاليًا', en: 'Currently unavailable' },

  contactTitle: { ar: 'معلومات المكان', en: 'Visit us' },
  phone: { ar: 'الهاتف', en: 'Phone' },
  whatsapp: { ar: 'واتساب', en: 'WhatsApp' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  address: { ar: 'العنوان', en: 'Address' },
  openMap: { ar: 'الموقع على الخريطة', en: 'View on map' },
  hours: { ar: 'ساعات العمل', en: 'Opening hours' },
  followUs: { ar: 'تابعنا', en: 'Follow us' },

  menuHeading: { ar: 'المنيو', en: 'Menu' },
  itemsInCategory: { ar: 'صنف', en: 'items' },
} as const

export type UiKey = keyof typeof ui

/** Reads a UI string in the active language. */
export function t(key: UiKey, lang: Lang): string {
  return ui[key][lang]
}
