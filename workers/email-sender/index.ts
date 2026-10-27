// Email sender for Perlink (Cloudflare Email Sending).
//
// Cloudflare Pages can't have a send_email binding, so the app hands each
// email to this Worker through a service binding. It isn't reachable from
// the internet (no workers.dev URL, no routes). The sending domain
// (perlink.to) must be onboarded in Email Sending. Setup: docs/email.md

interface EmailBinding {
  send(message: { to: string | string[]; from: string | { email: string; name: string }; subject: string; html?: string; text?: string; replyTo?: string }): Promise<{ messageId?: string }>
}

interface Env {
  EMAIL: EmailBinding
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
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405)
    const message = await request.json().catch(() => null) as SendRequest | null
    if (!message?.to || !message.from || !message.subject || !(message.html || message.text)) {
      return json({ ok: false, error: 'to, from, subject and html or text are required' }, 400)
    }
    const send = (from: string | { email: string; name: string }) => env.EMAIL.send({
      to: message.to,
      from,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    })
    try {
      // With a display name when given; the bare address if that isn't accepted
      let result
      if (message.fromName) {
        try {
          result = await send({ email: message.from, name: message.fromName })
        } catch {
          result = await send(message.from)
        }
      } else {
        result = await send(message.from)
      }
      return json({ ok: true, messageId: result?.messageId ?? null })
    } catch (error) {
      return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 502)
    }
  },
}
