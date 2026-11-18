import { MARKETING_COPY, type MarketingLang } from '~/data/marketingCopy'
import { langFromPath, langSetOf, localPath, pathInLanguage } from '~/data/langPaths'
import { toAppLanguage } from '#shared/language'

export { langSetOf, localPath, pathInLanguage }

/**
 * Language of a marketing page, plus its copy and links that stay in the same
 * language. Pages with an address per language (home, templates, use cases…,
 * see data/langPaths) take it from the URL, so each always renders the same
 * for search engines; other pages (pricing, trends…) follow the language the
 * visitor picked.
 */
export function useMarketingLang() {
  const route = useRoute()
  const { locale } = useI18n()
  const lang = computed<MarketingLang>(() => {
    const fromPath = langFromPath(route.path)
    if (fromPath) return fromPath
    if (langSetOf(route.path)) return 'en'
    return toAppLanguage(locale.value)
  })
  const copy = computed(() => MARKETING_COPY[lang.value])
  /** Home page in this language */
  const home = computed(() => localPath('/', lang.value))
  /** Section of the home page, e.g. anchor('templates') */
  const anchor = (id: string) => `${home.value}#${id}`
  /** An English marketing address in this language ('/templates' → '/ja/templates') */
  const local = (enPath: string) => localPath(enPath, lang.value)
  return { lang, copy, home, anchor, local }
}

/** Visitors who come in through a page in another language get the dashboard in it too */
export function useSyncLocaleFromPage(lang: Ref<MarketingLang>) {
  const { locale, setLocale } = useI18n()
  onMounted(() => {
    if (lang.value !== 'en' && locale.value !== lang.value) setLocale(lang.value)
  })
}
