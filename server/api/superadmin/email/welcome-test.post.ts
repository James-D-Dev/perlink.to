import { requireSuperadmin, SUPERADMIN_EMAIL } from '../../../utils/superadmin'
import { sendWelcomeEmail } from '../../../utils/welcomeEmail'
import { toAppLanguage } from '#shared/language'

// Superadmin: send the new-account welcome email to the superadmin, to see
// it (?lang=en|vi|zh|ja|ko)
export default defineEventHandler((event) => {
  requireSuperadmin(event)
  const language = toAppLanguage(getQuery(event).lang)
  sendWelcomeEmail(event, { email: SUPERADMIN_EMAIL, name: event.context.user?.name ?? null }, language)
  return { ok: true, to: SUPERADMIN_EMAIL, language }
})
