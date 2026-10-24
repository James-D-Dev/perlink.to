import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml, sendEmail } from './email'

// "New request" email to a site owner when a visitor sends a form

const COPY = {
  en: {
    subject: (name: string, site: string) => `New request from ${name} · perlink.to/${site}`,
    intro: (site: string) => `Someone sent a request through your site perlink.to/${site}.`,
    labels: { name: 'Name', phone: 'Phone', email: 'Email', date: 'Date', time: 'Time', guests: 'Guests', message: 'Message' },
    open: 'Open your inbox',
    footer: 'You get this email because your Perlink site has a form.',
  },
  vi: {
    subject: (name: string, site: string) => `Yêu cầu mới từ ${name} · perlink.to/${site}`,
    intro: (site: string) => `Có khách vừa gửi yêu cầu qua trang perlink.to/${site} của bạn.`,
    labels: { name: 'Họ tên', phone: 'Số điện thoại', email: 'Email', date: 'Ngày', time: 'Giờ', guests: 'Số khách', message: 'Lời nhắn' },
    open: 'Mở Hộp thư',
    footer: 'Bạn nhận email này vì trang Perlink của bạn có form.',
  },
}

export async function notifyOwnerOfRequest(
  event: H3Event,
  site: { userId: string; username: string; themeConfig?: unknown },
  data: Record<string, string>,
) {
  const owner = await getDB(event)
    .prepare('SELECT email FROM profiles WHERE id = ?')
    .bind(site.userId)
    .first<{ email: string | null }>()
  if (!owner?.email) return

  // Owners of Vietnamese sites get the email in Vietnamese
  const copy = (site.themeConfig as { language?: string } | undefined)?.language === 'vi' ? COPY.vi : COPY.en
  const inboxUrl = `https://perlink.to/dashboard/site/${site.username}/inbox`
  const rows = (Object.keys(copy.labels) as (keyof typeof copy.labels)[])
    .filter(key => data[key])
    .map(key => [copy.labels[key], data[key]!] as const)

  const html = `<div style="font-family:Inter,Helvetica,Arial,sans-serif;color:#0c0b0a;max-width:520px;margin:0 auto;padding:24px">
<p style="font-size:15px;color:#6b655e;margin:0 0 16px">${escapeHtml(copy.intro(site.username))}</p>
<table style="width:100%;border-collapse:collapse;font-size:15px">${rows
    .map(([label, value]) => `<tr><td style="padding:8px 0;color:#6b655e;width:120px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;white-space:pre-line">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>
<p style="margin:24px 0"><a href="${inboxUrl}" style="background:#0c0b0a;color:#fdfcfb;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:14px">${escapeHtml(copy.open)}</a></p>
<p style="font-size:12px;color:#9b948c">${escapeHtml(copy.footer)}</p></div>`
  const text = `${copy.intro(site.username)}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${copy.open}: ${inboxUrl}`

  await sendEmail(event, {
    to: owner.email,
    subject: copy.subject(data.name ?? '', site.username),
    html,
    text,
    // Replying goes straight to the visitor when they left an email
    replyTo: data.email,
  })
}
