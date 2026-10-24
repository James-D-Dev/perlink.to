import { MARKETING_COPY, type MarketingLang } from '~/data/marketingCopy'

/**
 * Language of a marketing page, taken from the URL ("/vi" = Vietnamese),
 * plus its copy and links that stay in the same language.
 */
export function useMarketingLang() {
  const route = useRoute()
  const lang = computed<MarketingLang>(() => (route.path === '/vi' || route.path.startsWith('/vi/') ? 'vi' : 'en'))
  const copy = computed(() => MARKETING_COPY[lang.value])
  /** Home page in this language */
  const home = computed(() => (lang.value === 'vi' ? '/vi' : '/'))
  /** Section of the home page, e.g. anchor('templates') */
  const anchor = (id: string) => `${home.value}#${id}`
  return { lang, copy, home, anchor }
}
