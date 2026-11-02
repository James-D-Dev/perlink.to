import { MARKETING_COPY, type MarketingLang } from '~/data/marketingCopy'
import { USE_CASE_PAIRS } from '~/data/useCases'

/**
 * Language of a marketing page, plus its copy and links that stay in the same
 * language. The home pages take it from the URL ("/" English, "/vi"
 * Vietnamese, so each always renders the same for search engines); other
 * pages (pricing, trends...) follow the language the visitor picked, like
 * the rest of the page.
 */
/**
 * Pages with a fixed address in each language (English first), like the home
 * pages: each always renders the same for search engines, and the language
 * switch goes to the other address
 */
export const LANG_PAIRS: [string, string][] = [
  ['/', '/vi'],
  ['/templates', '/vi/templates'],
  ['/linktree-alternative', '/vi/thay-the-linktree'],
  ['/3d-portfolio', '/vi/portfolio-3d'],
  ...USE_CASE_PAIRS,
]
/** The same page in the other language, for paired pages; null otherwise */
export function pairedPath(path: string) {
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path
  for (const [en, vi] of LANG_PAIRS) {
    if (clean === en) return vi
    if (clean === vi) return en
  }
  return null
}

export function useMarketingLang() {
  const route = useRoute()
  const { locale } = useI18n()
  const lang = computed<MarketingLang>(() => {
    if (route.path === '/vi' || route.path.startsWith('/vi/')) return 'vi'
    if (pairedPath(route.path)) return 'en'
    return locale.value === 'vi' ? 'vi' : 'en'
  })
  const copy = computed(() => MARKETING_COPY[lang.value])
  /** Home page in this language */
  const home = computed(() => (lang.value === 'vi' ? '/vi' : '/'))
  /** Section of the home page, e.g. anchor('templates') */
  const anchor = (id: string) => `${home.value}#${id}`
  return { lang, copy, home, anchor }
}
