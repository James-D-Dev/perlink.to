// Languages the dashboard, Perlink's own pages and its messages (email) come
// in. English is the main language and the default. "zh" is Simplified
// Chinese (mainland China, Singapore).

export const APP_LANGUAGES = ['en', 'vi', 'zh', 'ja', 'ko'] as const
export type AppLanguage = (typeof APP_LANGUAGES)[number]

export const toAppLanguage = (value: unknown): AppLanguage =>
  (APP_LANGUAGES as readonly unknown[]).includes(value) ? (value as AppLanguage) : 'en'

/** Cookie that remembers the chosen dashboard language */
export const LANGUAGE_COOKIE = 'perlink_lang'

/**
 * How each language is named and tagged: `label` in its own words (language
 * menus), `short` for a compact switch, `html` for <html lang> and hreflang,
 * `og` for og:locale, `intl` for dates and numbers.
 */
export const LANGUAGE_INFO: Record<AppLanguage, { label: string; short: string; html: string; og: string; intl: string }> = {
  en: { label: 'English', short: 'EN', html: 'en', og: 'en_US', intl: 'en-US' },
  vi: { label: 'Tiếng Việt', short: 'VI', html: 'vi', og: 'vi_VN', intl: 'vi-VN' },
  zh: { label: '简体中文', short: '中文', html: 'zh-Hans', og: 'zh_CN', intl: 'zh-CN' },
  ja: { label: '日本語', short: '日本語', html: 'ja', og: 'ja_JP', intl: 'ja-JP' },
  ko: { label: '한국어', short: '한국어', html: 'ko', og: 'ko_KR', intl: 'ko-KR' },
}

/** Languages whose marketing pages live under /<code> with English slugs (Vietnamese has its own slugs under /vi) */
export const PREFIXED_LANGUAGES = ['zh', 'ja', 'ko'] as const satisfies readonly AppLanguage[]
