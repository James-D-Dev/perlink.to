// Languages the dashboard and Perlink's own messages (Telegram, email) come
// in. English is the main language and the default.

export const APP_LANGUAGES = ['en', 'vi'] as const
export type AppLanguage = (typeof APP_LANGUAGES)[number]

export const toAppLanguage = (value: unknown): AppLanguage =>
  (APP_LANGUAGES as readonly unknown[]).includes(value) ? (value as AppLanguage) : 'en'

/** Cookie that remembers the chosen dashboard language */
export const LANGUAGE_COOKIE = 'perlink_lang'
