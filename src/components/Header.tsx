import { useLanguage, useT } from '../i18n/useLanguage'
import { siteConfig } from '../config/site'

export function Header() {
  const { t, lang } = useT()
  const { toggle } = useLanguage()

  return (
    <header className="site-header">
      <div className="shell site-header__top">
        <div className="brand">
          <div className="brand__mark">
            <img
              src="brand/logo.webp"
              alt={siteConfig.name[lang]}
              width={512}
              height={512}
              fetchPriority="high"
            />
          </div>
          <div className="brand__text">
            <h1 className="brand__name">{siteConfig.name[lang]}</h1>
            <p className="brand__tagline">{siteConfig.tagline[lang]}</p>
          </div>
        </div>

        <button
          type="button"
          className="lang-toggle"
          onClick={toggle}
          aria-label={t('languageToggleLabel')}
          lang={lang === 'ar' ? 'en' : 'ar'}
        >
          {t('languageToggle')}
        </button>
      </div>
    </header>
  )
}
