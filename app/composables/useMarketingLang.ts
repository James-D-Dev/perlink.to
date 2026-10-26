import { MARKETING_COPY, type MarketingLang } from '~/data/marketingCopy'

/**
 * Language of a marketing page, plus its copy and links that stay in the same
 * language. The home pages take it from the URL ("/" English, "/vi"
 * Vietnamese, so each always renders the same for search engines); other
 * pages (pricing, trends...) follow the language the visitor picked, like
 * the rest of the page.
 */
export function useMarketingLang() {
  const route = useRoute()
  const { locale } = useI18n()
  const lang = computed<MarketingLang>(() => {
    if (route.path === '/vi' || route.path.startsWith('/vi/')) return 'vi'
    if (route.path === '/') return 'en'
    return locale.value === 'vi' ? 'vi' : 'en'
  })
  const copy = computed(() => MARKETING_COPY[lang.value])
  /** Home page in this language */
  const home = computed(() => (lang.value === 'vi' ? '/vi' : '/'))
  /** Section of the home page, e.g. anchor('templates') */
  const anchor = (id: string) => `${home.value}#${id}`
  return { lang, copy, home, anchor }
}
