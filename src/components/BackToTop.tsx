import { useEffect, useState } from 'react'
import { useT } from '../i18n/useLanguage'
import { ArrowUpIcon } from './Icons'

export function BackToTop() {
  const { t } = useT()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`to-top${visible ? ' is-visible' : ''}`}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
      aria-label={t('backToTop')}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <ArrowUpIcon />
    </button>
  )
}
