import { z } from 'zod'
import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { escapeHtml, lastEmailError, sendEmail } from '../../../utils/email'

const SUPPORT_FROM = 'Perlink Support <support@perlink.to>'

const bodySchema = z.object({
  to: z.string().trim().email(),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
  /** Answering this received email: the reply joins its thread */
  replyToId: z.string().optional(),
})

// Superadmin → Emails: write to someone, or answer a received email, from
// support@perlink.to. Replies come back to support@perlink.to (the Inbox, and
// Gmail). It's kept in Sent like everything Perlink sends.
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Add a valid address, a subject and a message' })
  const { to, subject, body, replyToId } = parsed.data

  let inReplyTo: string | undefined
  let references: string | undefined
  if (replyToId) {
    const original = await getDB(event)
      .prepare(`SELECT message_id, refs FROM mail_messages WHERE id = ? AND direction = 'in'`)
      .bind(replyToId)
      .first<{ message_id: string | null; refs: string | null }>()
    if (original?.message_id) {
      inReplyTo = original.message_id
      references = [original.refs, original.message_id].filter(Boolean).join(' ').slice(-1900)
    }
  }

  // Plain text as written; the HTML version keeps paragraphs and line breaks
  const html = body
    .split(/\n{2,}/)
    .map(paragraph => `<p style="margin:0 0 14px;line-height:1.6">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
  const id = crypto.randomUUID()
  const ok = await sendEmail(event, {
    id,
    kind: 'admin',
    from: SUPPORT_FROM,
    to,
    subject,
    text: body,
    html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;color:#1c1a17">${html}</div>`,
    replyTo: 'support@perlink.to',
    inReplyTo,
    references,
  })

  if (!ok) throw createError({ statusCode: 502, statusMessage: lastEmailError || 'The email could not be sent' })
  return { ok: true, id }
})
