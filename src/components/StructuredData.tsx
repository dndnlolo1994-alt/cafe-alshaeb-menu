import { useEffect } from 'react'
import { categories, items } from '../data/menu'
import { siteConfig } from '../config/site'
import { useLanguage } from '../i18n/useLanguage'

/**
 * Schema.org Restaurant + Menu built from the real data only.
 *
 * Address, phone and opening hours are omitted entirely while their config
 * values are blank — an empty or placeholder value in structured data is worse
 * than no value at all.
 */
function buildGraph(lang: 'ar' | 'en') {
  const menuSections = categories
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((category) => ({
      '@type': 'MenuSection',
      name: category.name[lang],
      hasMenuItem: items
        .filter((item) => item.category === category.id && item.available)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => ({
          '@type': 'MenuItem',
          name: item.name[lang],
          ...(item.description ? { description: item.description[lang] } : {}),
          offers: item.variants.map((variant) => ({
            '@type': 'Offer',
            price: variant.price.toFixed(2),
            priceCurrency: siteConfig.currency.code,
            ...(variant.label ? { name: variant.label[lang] } : {}),
          })),
        })),
    }))

  const restaurant: Record<string, unknown> = {
    '@type': 'Restaurant',
    name: siteConfig.name[lang],
    alternateName: lang === 'ar' ? siteConfig.name.en : siteConfig.name.ar,
    hasMenu: {
      '@type': 'Menu',
      name: lang === 'ar' ? 'المنيو' : 'Menu',
      inLanguage: lang,
      hasMenuSection: menuSections,
    },
  }

  if (siteConfig.siteUrl.trim()) {
    restaurant.url = siteConfig.siteUrl
    restaurant.logo = `${siteConfig.siteUrl.replace(/\/$/, '')}/brand/logo.png`
  }

  const phone = siteConfig.contact.phone
  if (phone.enabled && phone.value.trim()) restaurant.telephone = phone.value

  const address = siteConfig.address[lang].trim()
  if (address) {
    restaurant.address = { '@type': 'PostalAddress', streetAddress: address }
  }

  if (siteConfig.openingHours.length > 0) {
    restaurant.openingHoursSpecification = siteConfig.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      description: lang === 'ar' ? h.daysAr : h.daysEn,
      opens: h.opens,
      closes: h.closes,
    }))
  }

  return { '@context': 'https://schema.org', ...restaurant }
}

export function StructuredData() {
  const { lang } = useLanguage()

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(buildGraph(lang))
    document.head.appendChild(script)
    return () => script.remove()
  }, [lang])

  return null
}
