import { APP_LANGUAGES, LANGUAGE_INFO, PREFIXED_LANGUAGES, type AppLanguage } from '#shared/language'
import { USE_CASE_PAIRS } from './useCases'
import { ABOUT_PAIR, GUIDE_PAIRS } from './guides'
import { PORTFOLIO_PAIRS } from './portfolio3d/paths'
import { WEDDING_PAIRS } from './weddingGuides/paths'

// Addresses of Perlink's marketing pages in each language. English is at the
// root, Vietnamese under /vi with its own slugs, Chinese, Japanese and Korean
// under /zh, /ja, /ko with the English slugs. Used by the pages
// (pages/{zh,ja,ko}), the language switch, hreflang tags and the sitemap.
//
// The long guides (3D portfolio topics, wedding guides) are in English and
// Vietnamese only.

export type LangPaths = Partial<Record<AppLanguage, string>> & { en: string }

const SITE = 'https://perlink.to'

const prefixed = (lang: AppLanguage, en: string) => (en === '/' ? `/${lang}` : `/${lang}${en}`)

/** A page in every language */
const everyLanguage = ([en, vi]: [string, string]): LangPaths => ({
  en,
  vi,
  ...Object.fromEntries(PREFIXED_LANGUAGES.map(lang => [lang, prefixed(lang, en)])),
})

/** A page in English and Vietnamese only */
const enVi = ([en, vi]: [string, string]): LangPaths => ({ en, vi })

export const LANG_SETS: LangPaths[] = [
  everyLanguage(['/', '/vi']),
  everyLanguage(['/templates', '/vi/templates']),
  everyLanguage(['/3d-portfolio', '/vi/portfolio-3d']),
  everyLanguage(['/affiliates', '/vi/cong-tac-vien']),
  ...USE_CASE_PAIRS.map(everyLanguage),
  ...GUIDE_PAIRS.map(everyLanguage),
  everyLanguage(ABOUT_PAIR),
  ...PORTFOLIO_PAIRS.map(enVi),
  ...WEDDING_PAIRS.map(enVi),
]

const clean = (path: string) => {
  const bare = path.split(/[?#]/)[0] || '/'
  return bare.length > 1 ? bare.replace(/\/$/, '') : bare
}

/** The page's addresses in each language, when it has one per language */
export function langSetOf(path: string): LangPaths | null {
  const p = clean(path)
  return LANG_SETS.find(set => Object.values(set).includes(p)) ?? null
}

/** The language a marketing address is written in, from its prefix (null for root pages) */
export function langFromPath(path: string): AppLanguage | null {
  const p = clean(path)
  for (const lang of APP_LANGUAGES) {
    if (lang === 'en') continue
    if (p === `/${lang}` || p.startsWith(`/${lang}/`)) return lang
  }
  return null
}

/** The same page in another language, or null when it has no such address */
export function pathInLanguage(path: string, lang: AppLanguage): string | null {
  return langSetOf(path)?.[lang] ?? null
}

/** An English marketing address in `lang` ('/templates' → '/ja/templates'); English when there's none */
export function localPath(enPath: string, lang: AppLanguage): string {
  const set = LANG_SETS.find(s => s.en === clean(enPath))
  return set?.[lang] ?? enPath
}

/** <link rel="alternate" hreflang> for every language the page has, plus x-default (English) */
export function alternateLinks(path: string) {
  const set = langSetOf(path)
  if (!set) return []
  return [
    ...APP_LANGUAGES.filter(lang => set[lang]).map(lang => ({ rel: 'alternate', hreflang: LANGUAGE_INFO[lang].html, href: `${SITE}${set[lang]}` })),
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}${set.en}` },
  ]
}
