import { useT } from '../i18n/useLanguage'
import { hasAnyContact, hasAnySocial, siteConfig } from '../config/site'

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
}

export function Footer({ onReplayIntro }: { onReplayIntro: () => void }) {
  const { t, lang } = useT()
  const { contact, address, openingHours, social } = siteConfig

  const phone = contact.phone.enabled ? contact.phone.value.trim() : ''
  const whatsapp = contact.whatsapp.enabled ? contact.whatsapp.value.trim() : ''
  const email = contact.email.enabled ? contact.email.value.trim() : ''
  const addressText = address[lang].trim()
  const socialLinks = Object.entries(social).filter(([, url]) => url.trim() !== '')

  // Nothing about the venue is invented: a detail that is not in the config
  // simply has no row here.
  const showContactBlock =
    hasAnyContact() || addressText !== '' || openingHours.length > 0 || hasAnySocial()

  return (
    <footer className="site-footer">
      <div className="shell">
        {showContactBlock && (
          <>
            <h2 className="footer__title">{t('contactTitle')}</h2>
            <div className="footer__list">
              {phone && (
                <p className="footer__row">
                  <span className="footer__label">{t('phone')}</span>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} dir="ltr">
                    {phone}
                  </a>
                </p>
              )}
              {whatsapp && (
                <p className="footer__row">
                  <span className="footer__label">{t('whatsapp')}</span>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                  >
                    {whatsapp}
                  </a>
                </p>
              )}
              {email && (
                <p className="footer__row">
                  <span className="footer__label">{t('email')}</span>
                  <a href={`mailto:${email}`} dir="ltr">
                    {email}
                  </a>
                </p>
              )}
              {addressText && (
                <p className="footer__row">
                  <span className="footer__label">{t('address')}</span>
                  <span>
                    {addressText}
                    {address.mapUrl.trim() && (
                      <>
                        {' — '}
                        <a href={address.mapUrl} target="_blank" rel="noreferrer">
                          {t('openMap')}
                        </a>
                      </>
                    )}
                  </span>
                </p>
              )}
              {openingHours.length > 0 && (
                <p className="footer__row">
                  <span className="footer__label">{t('hours')}</span>
                  <span>
                    {openingHours.map((h, i) => (
                      <span key={`${h.opens}-${h.closes}-${i}`} style={{ display: 'block' }}>
                        {lang === 'ar' ? h.daysAr : h.daysEn}
                        {': '}
                        <span dir="ltr">
                          {h.opens} – {h.closes}
                        </span>
                      </span>
                    ))}
                  </span>
                </p>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="footer__social">
                {socialLinks.map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noreferrer">
                    {SOCIAL_LABELS[key] ?? key}
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        <p className="footer__note">{siteConfig.serviceNote[lang]}</p>

        <div className="footer__meta">
          <span>
            © {siteConfig.name[lang]}
          </span>
          <button type="button" className="footer__replay" onClick={onReplayIntro}>
            {t('replayIntro')}
          </button>
        </div>
      </div>
    </footer>
  )
}
