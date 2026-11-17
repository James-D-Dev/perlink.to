import { z } from 'zod'
import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { lastEmailError, sendEmail } from '../../../utils/email'
import { getLayout, renderLayout, textToHtml } from '../../../utils/emailTemplates'

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

  // Plain text as written; the HTML version is the branded layout around it
  const html = renderLayout({ layout: await getLayout(event), lang: 'en', title: subject, preheader: body.split('\n').find(Boolean)?.slice(0, 140), bodyHtml: textToHtml(body) })
  const id = crypto.randomUUID()
  const ok = await sendEmail(event, {
    id,
    kind: 'admin',
    from: SUPPORT_FROM,
    to,
    subject,
    text: body,
    html,
    replyTo: 'support@perlink.to',
    inReplyTo,
    references,
  })

  if (!ok) throw createError({ statusCode: 502, statusMessage: lastEmailError || 'The email could not be sent' })
  return { ok: true, id }
})
