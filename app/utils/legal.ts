import type { LegalLang } from '~/data/legal/types'
import { LANGUAGE_INFO, toAppLanguage } from '#shared/language'

// Shown on the legal pages (terms, privacy, refunds, report)
export const SUPPORT_EMAIL = 'support@perlink.to'
export const LEGAL_UPDATED_ISO = '2026-11-18'

/** Legal pages follow the visitor's language (English when it isn't one of Perlink's) */
export function useLegalLang() {
  const { locale } = useI18n()
  return computed<LegalLang>(() => toAppLanguage(locale.value))
}

/** A legal page's date (YYYY-MM-DD) written out in the given language */
export function formatLegalDate(iso: string, lang: LegalLang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(LANGUAGE_INFO[lang].intl, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
