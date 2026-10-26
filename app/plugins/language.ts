import { LANGUAGE_COOKIE, toAppLanguage } from '#shared/language'

// The dashboard language: English unless one was picked (Settings, the
// header switch). The choice is kept in a cookie; signing in sets it from the
// account, so the language follows the user to other devices.
export default defineNuxtPlugin({
  name: 'perlink-language',
  dependsOn: ['i18n:plugin'],
  async setup(nuxtApp) {
    const cookie = useCookie<string | null>(LANGUAGE_COOKIE, { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/' })
    const i18n = nuxtApp.$i18n as unknown as { locale: Ref<string>; setLocale: (locale: string) => Promise<void> }
    const chosen = cookie.value ? toAppLanguage(cookie.value) : null
    if (chosen && chosen !== i18n.locale.value) await i18n.setLocale(chosen)
    nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
      cookie.value = newLocale
    })
  },
})
