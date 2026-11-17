// Email for Perlink (Cloudflare Email Service).
//
// Sending: Cloudflare Pages can't have a send_email binding, so the app hands
// each email to this Worker through a service binding (fetch). It isn't
// reachable from the internet (no workers.dev URL, no routes).
//
// Receiving: Email Routing sends mail for support@perlink.to here (email).
// Each one is forwarded to FORWARD_TO first, as before, then kept in D1
// (mail_messages) with its attachments in R2, for Superadmin → Emails.
// Setup: docs/email.md

import PostalMime from 'postal-mime'

interface EmailBinding {
  send(message: {
    to: string | string[]
    from: string | { email: string; name: string }
    subject: string
    html?: string
    text?: string
    replyTo?: string
    headers?: Record<string, string>
  }): Promise<{ messageId?: string }>
}

interface ForwardableEmail {
  readonly from: string
  readonly to: string
  readonly raw: ReadableStream
  readonly rawSize: number
  readonly headers: Headers
  forward(rcptTo: string, headers?: Headers): Promise<void>
}

interface Env {
  EMAIL: EmailBinding
  DB: D1Database
  MAIL: R2Bucket
  FORWARD_TO: string
}

interface SendRequest {
  to: string
  from: string
  /** Shown as the sender's name, e.g. "Perlink Support" */
  fromName?: string
  subject: string
  html: string
  text: string
  replyTo?: string
  /** Threading: In-Reply-To / References of the mail being answered */
  inReplyTo?: string
  references?: string
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

// D1 keeps a value up to 2 MB; a mail body past ~1 MB is cut
const MAX_BODY = 1_000_000
const clip = (value: string | undefined | null) => (value ? value.slice(0, MAX_BODY) : null)

async function send(request: Request, env: Env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405)
  const message = await request.json().catch(() => null) as SendRequest | null
  if (!message?.to || !message.from || !message.subject || !(message.html || message.text)) {
    return json({ ok: false, error: 'to, from, subject and html or text are required' }, 400)
  }
  const headers: Record<string, string> = {}
  if (message.inReplyTo) headers['In-Reply-To'] = message.inReplyTo
  if (message.references || message.inReplyTo) headers.References = message.references || message.inReplyTo!
  const sendAs = (from: string | { email: string; name: string }) => env.EMAIL.send({
    to: message.to,
    from,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
    ...(Object.keys(headers).length ? { headers } : {}),
  })
  try {
    // With a display name when given; the bare address if that isn't accepted
    let result
    if (message.fromName) {
      try {
        result = await sendAs({ email: message.from, name: message.fromName })
      } catch {
        result = await sendAs(message.from)
      }
    } else {
      result = await sendAs(message.from)
    }
    return json({ ok: true, messageId: result?.messageId ?? null })
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 502)
  }
}

async function receive(message: ForwardableEmail, env: Env) {
  const raw = await new Response(message.raw).arrayBuffer()

  // Gmail first: if keeping a copy fails, the mail still arrives as before
  let forwarded = true
  try {
    await message.forward(env.FORWARD_TO)
  } catch (error) {
    forwarded = false
    console.error('[mail] forward failed', error)
  }

  try {
    const mail = await PostalMime.parse(raw)
    const id = crypto.randomUUID()
    const fromEmail = (mail.from?.address || message.from).toLowerCase()

    const attachments = []
    for (const [index, file] of (mail.attachments ?? []).entries()) {
      const filename = (file.filename || `attachment-${index + 1}`).replace(/[\\/]/g, '_').slice(0, 150)
      const key = `in/${id}/${index}-${filename}`
      const content = typeof file.content === 'string' ? new TextEncoder().encode(file.content) : file.content
      await env.MAIL.put(key, content, { httpMetadata: { contentType: file.mimeType || 'application/octet-stream' } })
      attachments.push({ key, filename, mimeType: file.mimeType, size: content.byteLength, inline: file.disposition === 'inline', contentId: file.contentId || null })
    }

    const account = await env.DB.prepare('SELECT id FROM profiles WHERE lower(email) = ?').bind(fromEmail).first<{ id: string }>()
    await env.DB.prepare(`INSERT INTO mail_messages
      (id, direction, kind, from_email, from_name, to_email, subject, text, html, message_id, in_reply_to, refs, user_id, status, error, attachments)
      VALUES (?, 'in', 'inbound', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`)
      .bind(
        id,
        fromEmail,
        mail.from?.name || null,
        message.to.toLowerCase(),
        (mail.subject || '').slice(0, 500),
        clip(mail.text),
        clip(mail.html),
        mail.messageId || null,
        mail.inReplyTo || null,
        mail.references || null,
        account?.id ?? null,
        forwarded ? null : 'Not forwarded to Gmail',
        attachments.length ? JSON.stringify(attachments) : null,
      )
      .run()
  } catch (error) {
    console.error('[mail] could not keep a copy', error)
    // Neither forwarded nor kept: fail, so the sender gets a bounce rather than silence
    if (!forwarded) throw error
  }
}

export default {
  fetch: (request: Request, env: Env) => send(request, env),
  email: (message: ForwardableEmail, env: Env) => receive(message, env),
}
