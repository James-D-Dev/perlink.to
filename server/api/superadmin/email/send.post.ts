import { z } from 'zod'
import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { escapeHtml, lastEmailError, sendEmail } from '../../../utils/email'

const SUPPORT_FROM = 'Perlink Support <support@perlink.to>'

const bodySchema = z.object({
  to: z.string().trim().email(),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
})

// Superadmin → Emails: write to someone from support@perlink.to. Replies go
// back to support@perlink.to (Email Routing forwards them). Every email is
// kept in admin_emails.
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Add a valid address, a subject and a message' })
  const { to, subject, body } = parsed.data

  // Plain text as written; the HTML version keeps paragraphs and line breaks
  const html = body
    .split(/\n{2,}/)
    .map(paragraph => `<p style="margin:0 0 14px;line-height:1.6">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const ok = await sendEmail(event, {
    from: SUPPORT_FROM,
    to,
    subject,
    text: body,
    html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;color:#1c1a17">${html}</div>`,
    replyTo: 'support@perlink.to',
  })

  const db = getDB(event)
  const account = await db.prepare('SELECT id FROM profiles WHERE lower(email) = lower(?)').bind(to).first<{ id: string }>()
  const id = crypto.randomUUID()
  await db.prepare('INSERT INTO admin_emails (id, to_email, user_id, subject, body, status, error) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, to, account?.id ?? null, subject, body, ok ? 'sent' : 'failed', ok ? null : lastEmailError || 'Unknown error')
    .run()

  if (!ok) throw createError({ statusCode: 502, statusMessage: lastEmailError || 'The email could not be sent' })
  return { ok: true, id }
})
