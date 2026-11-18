import type { H3Event } from 'h3'
import { runInBackground, sendEmail } from './email'
import { renderTemplate } from './emailTemplates'
import { acceptLanguage, countryLanguage, greetingName } from './userLanguage'
import { LANGUAGE_COOKIE, toAppLanguage, type AppLanguage } from '#shared/language'

// Welcome email for a new account (template "welcome", Superadmin → Email
// templates), from support@perlink.to so a reply lands in Superadmin →
// Emails → Inbox. In the dashboard language cookie's language, else the
// browser's (Accept-Language), else the country's (VN → Vietnamese, CN/SG →
// Chinese, JP → Japanese, KR → Korean); English otherwise.

export function signupLanguage(event: H3Event): AppLanguage {
  const cookie = getCookie(event, LANGUAGE_COOKIE)
  if (cookie) return toAppLanguage(cookie)
  return acceptLanguage(getHeader(event, 'accept-language'))
    ?? countryLanguage(getHeader(event, 'cf-ipcountry'))
    ?? 'en'
}

/** Sends the welcome email after the response (never holds up sign-in) */
export function sendWelcomeEmail(event: H3Event, profile: { email?: string | null; name?: string | null }, language?: AppLanguage) {
  if (!profile.email) return
  const to = profile.email
  const lang = language ?? signupLanguage(event)
  const firstName = greetingName(profile.name, lang, 'friend')

  runInBackground(event, (async () => {
    const { subject, html, text } = await renderTemplate(event, 'welcome', lang, {
      vars: { name: firstName },
      buttonUrl: 'https://perlink.to/dashboard',
    })
    await sendEmail(event, { from: 'Perlink <support@perlink.to>', to, subject, html, text, replyTo: 'support@perlink.to' })
  })().catch(error => console.error('[welcome] not sent', error)))
}
