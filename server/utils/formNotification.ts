import type { H3Event } from 'h3'
import { getDB } from './db'
import { sendEmail } from './email'
import { renderTemplate } from './emailTemplates'
import { toAppLanguage } from '#shared/language'

// "New request" email to a site owner when a visitor sends a form

/** Nights between check-in and check-out (YYYY-MM-DD) */
export function stayNights(from: string, to: string) {
  const day = (d: string) => Date.parse(`${d}T00:00:00Z`)
  return Math.max(0, Math.round((day(to) - day(from)) / 86_400_000))
}

// Field labels for the details table; the words around it are the
// form_request / form_order / form_rsvp / form_answer templates
// (Superadmin → Email templates)
const COPY = {
  en: {
    labels: { code: 'Order', product: 'Product', quantity: 'Quantity', total: 'Total', payment: 'Payment', question: 'Question', name: 'Name', attending: 'Coming', service: 'Service', phone: 'Phone', email: 'Email', address: 'Address', date: 'Date', checkout: 'Check-out', nights: 'Nights', time: 'Time', guests: 'Guests', message: 'Message' },
    attending: { yes: 'Yes', no: 'No, can’t make it' } as Record<string, string>,
    payments: { cod: 'Cash on delivery', transfer: 'Bank transfer' } as Record<string, string>,
  },
  vi: {
    labels: { code: 'Mã đơn', product: 'Sản phẩm', quantity: 'Số lượng', total: 'Tổng tiền', payment: 'Thanh toán', question: 'Câu hỏi', name: 'Họ tên', attending: 'Tham dự', service: 'Dịch vụ', phone: 'Số điện thoại', email: 'Email', address: 'Địa chỉ', date: 'Ngày', checkout: 'Trả phòng', nights: 'Số đêm', time: 'Giờ', guests: 'Số khách', message: 'Lời nhắn' },
    attending: { yes: 'Có, sẽ đến', no: 'Không đến được' } as Record<string, string>,
    payments: { cod: 'Thanh toán khi nhận hàng (COD)', transfer: 'Chuyển khoản' } as Record<string, string>,
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
  const lang = toAppLanguage(owner.language)
  const copy = COPY[lang]
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

  const template = isOrder ? 'form_order' : data.kind === 'rsvp' ? 'form_rsvp' : data.kind === 'answer' ? 'form_answer' : 'form_request'
  const { subject, html, text } = await renderTemplate(event, template, lang, {
    vars: { site: site.username, name: data.name ?? '', code: data.code ?? '' },
    buttonUrl: inboxUrl,
    rows: rows.map(([label, value]) => [label, value]),
  })

  await sendEmail(event, {
    to: owner.email,
    subject,
    html,
    text,
    // Replying goes straight to the visitor when they left an email
    replyTo: data.email,
  })
}
