import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml, sendEmail } from './email'
import { toAppLanguage } from '#shared/language'

// "New request" email to a site owner when a visitor sends a form

/** Nights between check-in and check-out (YYYY-MM-DD) */
export function stayNights(from: string, to: string) {
  const day = (d: string) => Date.parse(`${d}T00:00:00Z`)
  return Math.max(0, Math.round((day(to) - day(from)) / 86_400_000))
}

const COPY = {
  en: {
    subject: (name: string, site: string) => `New request from ${name} · perlink.to/${site}`,
    intro: (site: string) => `Someone sent a request through your site perlink.to/${site}.`,
    labels: { code: 'Order', product: 'Product', quantity: 'Quantity', total: 'Total', payment: 'Payment', question: 'Question', name: 'Name', attending: 'Coming', service: 'Service', phone: 'Phone', email: 'Email', address: 'Address', date: 'Date', checkout: 'Check-out', nights: 'Nights', time: 'Time', guests: 'Guests', message: 'Message' },
    attending: { yes: 'Yes', no: 'No, can’t make it' } as Record<string, string>,
    rsvpSubject: (name: string, site: string) => `${name} replied to your invitation · perlink.to/${site}`,
    answerSubject: (site: string) => `💘 Someone said yes · perlink.to/${site}`,
    orderSubject: (code: string, site: string) => `New order ${code} · perlink.to/${site}`,
    orderIntro: (site: string) => `You have a new order on perlink.to/${site}.`,
    payments: { cod: 'Cash on delivery', transfer: 'Bank transfer' } as Record<string, string>,
    open: 'Open your inbox',
    footer: 'You get this email because your Perlink site has a form.',
  },
  vi: {
    subject: (name: string, site: string) => `Yêu cầu mới từ ${name} · perlink.to/${site}`,
    intro: (site: string) => `Có khách vừa gửi yêu cầu qua trang perlink.to/${site} của bạn.`,
    labels: { code: 'Mã đơn', product: 'Sản phẩm', quantity: 'Số lượng', total: 'Tổng tiền', payment: 'Thanh toán', question: 'Câu hỏi', name: 'Họ tên', attending: 'Tham dự', service: 'Dịch vụ', phone: 'Số điện thoại', email: 'Email', address: 'Địa chỉ', date: 'Ngày', checkout: 'Trả phòng', nights: 'Số đêm', time: 'Giờ', guests: 'Số khách', message: 'Lời nhắn' },
    attending: { yes: 'Có, sẽ đến', no: 'Không đến được' } as Record<string, string>,
    answerSubject: (site: string) => `💘 Người ấy đã đồng ý · perlink.to/${site}`,
    rsvpSubject: (name: string, site: string) => `${name} đã trả lời thiệp mời · perlink.to/${site}`,
    orderSubject: (code: string, site: string) => `Đơn hàng mới ${code} · perlink.to/${site}`,
    orderIntro: (site: string) => `Bạn có đơn hàng mới trên trang perlink.to/${site}.`,
    payments: { cod: 'Thanh toán khi nhận hàng (COD)', transfer: 'Chuyển khoản' } as Record<string, string>,
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
    .prepare('SELECT email, language FROM profiles WHERE id = ?')
    .bind(site.userId)
    .first<{ email: string | null; language: string | null }>()
  if (!owner?.email) return

  // In the owner's language (Settings), English by default
  const copy = COPY[toAppLanguage(owner.language)]
  const inboxUrl = `https://perlink.to/dashboard/site/${site.username}/inbox`
  const isOrder = data.kind === 'order'
  const shown: Record<string, string> = {
    ...data,
    ...(isOrder && data.payment ? { payment: copy.payments[data.payment] ?? data.payment } : {}),
    ...(data.attending ? { attending: copy.attending[data.attending] ?? data.attending } : {}),
    ...(data.date && data.checkout ? { nights: String(stayNights(data.date, data.checkout)) } : {}),
  }
  const rows = (Object.keys(copy.labels) as (keyof typeof copy.labels)[])
    .filter(key => shown[key])
    .map(key => [copy.labels[key], shown[key]!] as const)

  const html = `<div style="font-family:Inter,Helvetica,Arial,sans-serif;color:#0c0b0a;max-width:520px;margin:0 auto;padding:24px">
<p style="font-size:15px;color:#6b655e;margin:0 0 16px">${escapeHtml(isOrder ? copy.orderIntro(site.username) : copy.intro(site.username))}</p>
<table style="width:100%;border-collapse:collapse;font-size:15px">${rows
    .map(([label, value]) => `<tr><td style="padding:8px 0;color:#6b655e;width:120px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;white-space:pre-line">${escapeHtml(value)}</td></tr>`)
    .join('')}</table>
<p style="margin:24px 0"><a href="${inboxUrl}" style="background:#0c0b0a;color:#fdfcfb;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:14px">${escapeHtml(copy.open)}</a></p>
<p style="font-size:12px;color:#9b948c">${escapeHtml(copy.footer)}</p></div>`
  const text = `${isOrder ? copy.orderIntro(site.username) : copy.intro(site.username)}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${copy.open}: ${inboxUrl}`

  await sendEmail(event, {
    to: owner.email,
    subject: isOrder
      ? copy.orderSubject(data.code ?? '', site.username)
      : data.kind === 'rsvp'
        ? copy.rsvpSubject(data.name ?? '', site.username)
        : data.kind === 'answer'
          ? copy.answerSubject(site.username)
          : copy.subject(data.name ?? '', site.username),
    html,
    text,
    // Replying goes straight to the visitor when they left an email
    replyTo: data.email,
  })
}
