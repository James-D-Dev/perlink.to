import type { H3Event } from 'h3'
import { getDB } from './db'
import { sendEmail } from './email'
import { renderTemplate } from './emailTemplates'
import { toAppLanguage, type AppLanguage } from '#shared/language'

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
  zh: {
    labels: { code: '订单号', product: '商品', quantity: '数量', total: '总计', payment: '付款方式', question: '问题', name: '姓名', attending: '是否出席', service: '服务', phone: '电话', email: '邮箱', address: '地址', date: '日期', checkout: '退房', nights: '晚数', time: '时间', guests: '人数', message: '留言' },
    attending: { yes: '会出席', no: '无法出席' } as Record<string, string>,
    payments: { cod: '货到付款', transfer: '银行转账' } as Record<string, string>,
  },
  ja: {
    labels: { code: '注文番号', product: '商品', quantity: '数量', total: '合計', payment: 'お支払い方法', question: '質問', name: 'お名前', attending: '出欠', service: 'サービス', phone: '電話番号', email: 'メール', address: '住所', date: '日付', checkout: 'チェックアウト', nights: '泊数', time: '時間', guests: '人数', message: 'メッセージ' },
    attending: { yes: '出席', no: '欠席' } as Record<string, string>,
    payments: { cod: '代金引換', transfer: '銀行振込' } as Record<string, string>,
  },
  ko: {
    labels: { code: '주문번호', product: '상품', quantity: '수량', total: '합계', payment: '결제 방법', question: '질문', name: '이름', attending: '참석 여부', service: '서비스', phone: '전화번호', email: '이메일', address: '주소', date: '날짜', checkout: '체크아웃', nights: '박 수', time: '시간', guests: '인원', message: '메시지' },
    attending: { yes: '참석할게요', no: '참석이 어려워요' } as Record<string, string>,
    payments: { cod: '상품 수령 시 결제', transfer: '계좌이체' } as Record<string, string>,
  },
} satisfies Record<AppLanguage, unknown>

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
