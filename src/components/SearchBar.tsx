import { useId } from 'react'
import { useT } from '../i18n/useLanguage'
import { CloseIcon, SearchIcon } from './Icons'

interface Props {
  value: string
  onChange: (value: string) => void
  resultCount: number | null
}

export function SearchBar({ value, onChange, resultCount }: Props) {
  const { t } = useT()
  const id = useId()

  return (
    <div className="search">
      <label className="sr-only" htmlFor={id}>
        {t('searchLabel')}
      </label>
      <SearchIcon className="search__icon" />
      <input
        id={id}
        className="search__field"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        placeholder={t('searchPlaceholder')}
        onChange={(e) => onChange(e.target.value)}
      />
      {value !== '' && (
        <button
          type="button"
          className="search__clear"
          onClick={() => onChange('')}
          aria-label={t('clearSearch')}
        >
          <CloseIcon />
        </button>
      )}

      <p className="search__count" role="status" aria-live="polite">
        {resultCount !== null && `${resultCount} ${t('resultsCount')}`}
      </p>
    </div>
  )
}
