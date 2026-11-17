import type { H3Event } from 'h3'
import { runInBackground, sendEmail } from './email'
import { renderTemplate } from './emailTemplates'
import { LANGUAGE_COOKIE, toAppLanguage, type AppLanguage } from '#shared/language'

// Welcome email for a new account (template "welcome", Superadmin → Email
// templates), from support@perlink.to so a reply lands in Superadmin →
// Emails → Inbox. Vietnamese when the dashboard language cookie, the browser
// or the country says so; English otherwise.

export function signupLanguage(event: H3Event): AppLanguage {
  const cookie = getCookie(event, LANGUAGE_COOKIE)
  if (cookie) return toAppLanguage(cookie)
  if (/^vi\b/i.test(getHeader(event, 'accept-language') || '')) return 'vi'
  if (getHeader(event, 'cf-ipcountry') === 'VN') return 'vi'
  return 'en'
}

/** Sends the welcome email after the response (never holds up sign-in) */
export function sendWelcomeEmail(event: H3Event, profile: { email?: string | null; name?: string | null }, language?: AppLanguage) {
  if (!profile.email) return
  const to = profile.email
  const lang = language ?? signupLanguage(event)
  // Vietnamese names put the given name last ("Hoàng Kim Đức" → Đức)
  const parts = (profile.name || '').trim().split(/\s+/).filter(Boolean)
  const firstName = (lang === 'vi' ? parts.at(-1) : parts[0]) || (lang === 'vi' ? 'bạn' : 'friend')

  runInBackground(event, (async () => {
    const { subject, html, text } = await renderTemplate(event, 'welcome', lang, {
      vars: { name: firstName },
      buttonUrl: 'https://perlink.to/dashboard',
    })
    await sendEmail(event, { from: 'Perlink <support@perlink.to>', to, subject, html, text, replyTo: 'support@perlink.to' })
  })().catch(error => console.error('[welcome] not sent', error)))
}
