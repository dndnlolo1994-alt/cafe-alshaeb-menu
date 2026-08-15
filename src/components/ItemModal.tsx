import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/useLanguage'
import { siteConfig } from '../config/site'
import { formatPrice } from '../utils/search'
import { CloseIcon } from './Icons'
import type { Category, MenuItem } from '../types'

interface Props {
  item: MenuItem
  category: Category | undefined
  onClose: () => void
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ItemModal({ item, category, onClose }: Props) {
  const { t, lang, pick } = useT()
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const [imageBroken, setImageBroken] = useState(false)

  useEffect(() => {
    closeButton.current?.focus()
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  // Escape closes; Tab cycles inside the dialog rather than escaping to the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialog.current) return

      const focusable = Array.from(
        dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const cheapest = item.variants.reduce((min, v) => (v.price < min.price ? v : min))
  const showImage = Boolean(item.image) && !imageBroken

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialog}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label={t('close')}
          ref={closeButton}
        >
          <CloseIcon />
        </button>

        {showImage && item.image && (
          <img
            className="modal__image"
            src={item.image}
            alt={item.imageAlt ? pick(item.imageAlt) : pick(item.name)}
            loading="lazy"
            decoding="async"
            onError={() => setImageBroken(true)}
          />
        )}

        {category && <p className="modal__category">{pick(category.name)}</p>}
        <h2 className="modal__title" id="modal-title">
          {pick(item.name)}
        </h2>

        {item.description && <p className="modal__desc">{pick(item.description)}</p>}

        {item.variants.length === 1 ? (
          <p className="modal__price">
            {formatPrice(cheapest.price, lang, siteConfig.currency)}
          </p>
        ) : (
          <div className="modal__block">
            <h3 className="modal__blockTitle">{t('sizes')}</h3>
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
          </div>
        )}

        {item.options && item.options.length > 0 && (
          <div className="modal__block">
            <h3 className="modal__blockTitle">{t('options')}</h3>
            <ul className="chips">
              {item.options.map((option) => (
                <li key={option.en} className="chip">
                  {pick(option)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.note && <p className="item__note">{pick(item.note)}</p>}
      </div>
    </div>
  )
}
