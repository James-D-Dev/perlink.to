import type { H3Event } from 'h3'

// Transactional email through Cloudflare Email Sending. Pages can't have a
// send_email binding, so emails go to the perlink-email Worker
// (workers/email-sender) through the EMAIL_WORKER service binding; the REST
// API with NUXT_CF_EMAIL_API_TOKEN is the fallback. With neither, nothing is sent, so features that
// email stay usable before it's set up.

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

interface ServiceBinding {
  fetch(input: string, init?: RequestInit): Promise<Response>
}
const emailBinding = (event: H3Event) => (event.context.cloudflare?.env as { EMAIL_WORKER?: ServiceBinding } | undefined)?.EMAIL_WORKER

/** How mail goes out here, for the superadmin's check */
export const emailTransport = (event: H3Event) => (emailBinding(event) ? 'worker' : useRuntimeConfig(event).cfEmailApiToken ? 'api' : null)

/** Why the last send failed (this worker), for the superadmin's check */
export let lastEmailError = ''

export function emailEnabled(event: H3Event) {
  return !!emailBinding(event) || !!useRuntimeConfig(event).cfEmailApiToken
}

export async function sendEmail(event: H3Event, message: EmailMessage): Promise<boolean> {
  const config = useRuntimeConfig(event)
  const from = String(config.emailFrom)
  const bare = from.match(/<([^>]+)>/)?.[1] ?? from

  const worker = emailBinding(event)
  if (worker) {
    try {
      const response = await worker.fetch('https://perlink-email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: message.to, from: bare, subject: message.subject, html: message.html, text: message.text, replyTo: message.replyTo }),
      })
      const data = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
      if (data?.ok) return true
      lastEmailError = data?.error || `Email worker HTTP ${response.status}`
      console.error('[email] worker send failed', lastEmailError)
      return false
    } catch (error) {
      lastEmailError = error instanceof Error ? error.message : String(error)
      console.error('[email] worker unreachable', error)
      return false
    }
  }

  if (!config.cfEmailApiToken || !config.cfAccountId) return false
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.cfAccountId}/email/sending/send`
  const post = (from: string) => fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.cfEmailApiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
    }),
  })
  try {
    // "Perlink <notifications@perlink.to>"; if the name isn't accepted, the bare address
    let response = await post(from)
    if (!response.ok && response.status === 400 && bare !== from) response = await post(bare)
    const data = await response.json().catch(() => null) as { success?: boolean; errors?: { message: string }[]; result?: { permanent_bounces?: string[] } } | null
    if (!response.ok || !data?.success) {
      lastEmailError = data?.errors?.map(e => e.message).join('; ') || `HTTP ${response.status}`
      console.error('[email] Cloudflare rejected the message', response.status, data?.errors?.map(e => e.message).join('; '))
      return false
    }
    if (data.result?.permanent_bounces?.length) console.warn('[email] bounced:', data.result.permanent_bounces.join(', '))
    return true
  } catch (error) {
    console.error('[email] send failed', error)
    return false
  }
}

/** Run work after the response is sent (Cloudflare), or inline elsewhere */
export function runInBackground(event: H3Event, work: Promise<unknown>) {
  const ctx = event.context.cloudflare?.context
  if (ctx?.waitUntil) ctx.waitUntil(work)
  else work.catch(error => console.error('[background]', error))
}

export const escapeHtml = (value: string) =>
  value.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c]!)
