import type { H3Event } from 'h3'

// Transactional email through Cloudflare Email Sending's REST API. Without
// NUXT_CF_EMAIL_API_TOKEN nothing is sent, so features that email stay usable
// before it's set up.

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export function emailEnabled(event: H3Event) {
  return !!useRuntimeConfig(event).cfEmailApiToken
}

export async function sendEmail(event: H3Event, message: EmailMessage): Promise<boolean> {
  const config = useRuntimeConfig(event)
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
    const from = String(config.emailFrom)
    let response = await post(from)
    const bare = from.match(/<([^>]+)>/)?.[1]
    if (!response.ok && response.status === 400 && bare) response = await post(bare)
    const data = await response.json().catch(() => null) as { success?: boolean; errors?: { message: string }[]; result?: { permanent_bounces?: string[] } } | null
    if (!response.ok || !data?.success) {
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
