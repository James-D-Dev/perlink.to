import type { H3Event } from 'h3'

// Transactional email through Resend's HTTP API. Without NUXT_RESEND_API_KEY
// nothing is sent, so features that email stay usable before it's set up.

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export function emailEnabled(event: H3Event) {
  return !!useRuntimeConfig(event).resendApiKey
}

export async function sendEmail(event: H3Event, message: EmailMessage): Promise<boolean> {
  const config = useRuntimeConfig(event)
  if (!config.resendApiKey) return false
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: config.emailFrom,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
      }),
    })
    if (!response.ok) {
      console.error('[email] Resend rejected the message', response.status, await response.text())
      return false
    }
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
