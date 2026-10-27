import type { LegalLang } from '~/data/legal/types'

// Shown on the legal pages (terms, privacy, refunds, report)
export const SUPPORT_EMAIL = 'support@perlink.to'
export const LEGAL_UPDATED_ISO = '2026-10-27'

/** Legal pages follow the visitor's language (Vietnamese or English) */
export function useLegalLang() {
  const { locale } = useI18n()
  return computed<LegalLang>(() => (locale.value === 'vi' ? 'vi' : 'en'))
}
