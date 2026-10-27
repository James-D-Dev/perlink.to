import { requireSuperadmin, SUPERADMIN_EMAIL } from '../../../utils/superadmin'
import { emailTransport, lastEmailError, sendEmail } from '../../../utils/email'

// Superadmin → Settings: send a test email to the superadmin, to check that
// Cloudflare Email Sending works
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const transport = emailTransport(event)
  if (!transport) return { ok: false, transport: null, error: 'Email sending is not set up (no EMAIL binding or API token)' }
  const sentAt = new Date().toISOString()
  const ok = await sendEmail(event, {
    to: SUPERADMIN_EMAIL,
    subject: 'Perlink test email',
    text: `This is a test email from Perlink, sent ${sentAt} through Cloudflare Email Sending (${transport}).`,
    html: `<p>This is a test email from Perlink, sent ${sentAt} through Cloudflare Email Sending (<b>${transport}</b>).</p>`,
  })
  return { ok, transport, to: SUPERADMIN_EMAIL, error: ok ? null : lastEmailError || 'Unknown error' }
})
