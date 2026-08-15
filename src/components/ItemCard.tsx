import { useState } from 'react'
import { useT } from '../i18n/useLanguage'
import { siteConfig } from '../config/site'
import { formatPrice } from '../utils/search'
import { ChevronIcon } from './Icons'
import type { MenuItem } from '../types'

interface Props {
  item: MenuItem
  onOpen: (item: MenuItem) => void
}

/** A card is worth opening only when there is more to show than the card holds. */
function hasDetails(item: MenuItem): boolean {
  return Boolean(item.options?.length) || item.variants.length > 1 || Boolean(item.image)
}

export function ItemCard({ item, onOpen }: Props) {
  const { t, lang, pick } = useT()
  const [imageBroken, setImageBroken] = useState(false)
  const interactive = hasDetails(item)
  const cheapest = item.variants.reduce((min, v) => (v.price < min.price ? v : min))

  const body = (
    <>
      {item.image && !imageBroken && (
        <div className="item__media">
          <img
            src={item.image}
            alt={item.imageAlt ? pick(item.imageAlt) : pick(item.name)}
            loading="lazy"
            decoding="async"
            onError={() => setImageBroken(true)}
          />
        </div>
      )}

      <div className="item__row">
        <span className="item__name">{pick(item.name)}</span>
        <span className="item__leader" aria-hidden="true" />
        <span className="item__price">
          {formatPrice(cheapest.price, lang, siteConfig.currency)}
        </span>
      </div>

      {item.description && <p className="item__desc">{pick(item.description)}</p>}

      {item.variants.length > 1 && (
        <ul className="variants">
          {item.variants.map((variant) => (
            <li key={variant.id} className="variant">
              <span className="variant__label">
                {variant.label ? pick(variant.label) : ''}
              </span>
              <span className="variant__price">
                {formatPrice(variant.price, lang, siteConfig.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {item.note && <p className="item__note">{pick(item.note)}</p>}

      {!item.available && <p className="item__note">{t('unavailable')}</p>}

      {interactive && (
        <span className="item__more">
          {t('details')}
          <ChevronIcon />
        </span>
      )}
    </>
  )

  const className = `item${item.available ? '' : ' is-unavailable'}`

  // Items with nothing extra to show stay plain markup, so a screen reader is
  // not offered a button that opens a dialog repeating what it just read.
  if (!interactive) {
    return (
      <li>
        <article className={className}>{body}</article>
      </li>
    )
  }

  return (
    <li>
      <button type="button" className={className} onClick={() => onOpen(item)}>
        {body}
      </button>
    </li>
  )
}
