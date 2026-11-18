import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import { grantPlan } from './plan'
import { grantWeddingPass, paymentProducts } from './weddingPass'
import { SUPERADMIN_EMAIL } from './superadmin'
import { sendTelegram, telegramApi } from './telegram'
import { transferNote } from './billing'
import { describeCheck, type CryptoCheck } from './cryptoPayments'
import { CRYPTO_NETWORK_BY_ID } from '#shared/crypto'
import { formatVnd, type BillingPeriod, type PaidPlanId } from '#shared/plans'
import { toAppLanguage, type AppLanguage } from '#shared/language'

// Payments the payer marked as done ("submitted") wait for the superadmin:
// a Telegram message with the details and Approve / Reject buttons, and the
// Superadmin → Payments page. Approving puts the plan on the account.

export interface PaymentRow {
  id: string
  user_id: string
  email: string | null
  plan: PaidPlanId
  period: BillingPeriod
  amount: number
  amount_usd: number | null
  code: string
  status: string
  method: 'bank' | 'crypto' | 'lemon' | 'creem'
  /** 'wedding': the Wedding pass rather than the plan alone (payment_products) */
  product?: string | null
  network: string | null
  token: string | null
  tx_hash: string | null
  check_result: string | null
  created_at: string
  submitted_at: string | null
  reviewed_at: string | null
  paid_at: string | null
  user_name?: string | null
  user_avatar?: string | null
}

export const PAYMENT_SELECT = `SELECT p.id, p.user_id, pr.email, p.plan, p.period, p.amount, p.amount_usd, p.code, p.status, p.method,
  p.network, p.token, p.tx_hash, p.check_result, p.created_at, p.submitted_at, p.reviewed_at, p.paid_at,
  pr.name AS user_name, pr.avatar AS user_avatar
  FROM payments p LEFT JOIN profiles pr ON pr.id = p.user_id`

export async function loadPayment(event: H3Event, id: string) {
  const payment = await getDB(event).prepare(`${PAYMENT_SELECT} WHERE p.id = ?`).bind(id).first<PaymentRow>()
  if (payment) payment.product = (await paymentProducts(event, [id])).get(id) ?? null
  return payment
}

export const parseCheck = (row: { check_result: string | null }) => {
  try {
    return row.check_result ? JSON.parse(row.check_result) as CryptoCheck : null
  } catch {
    return null
  }
}

/** Puts the plan on the account; false if the payment was already decided */
/** Puts the plan on the account. providerRef records where the money was
 * seen (a SePay transaction); otherwise the tx hash or "manual" */
export async function approvePayment(event: H3Event, id: string, providerRef?: string) {
  const payment = await loadPayment(event, id)
  if (!payment) return { ok: false as const, reason: 'not-found' }
  if (payment.status === 'paid') return { ok: false as const, reason: 'already-paid' }
  // Only the first approval goes through
  const marked = await getDB(event)
    .prepare(`UPDATE payments SET status = 'paid', paid_at = datetime('now'), reviewed_at = datetime('now'),
      provider_ref = COALESCE(provider_ref, ?) WHERE id = ? AND status IN ('pending', 'submitted', 'rejected')`)
    .bind(providerRef ?? (payment.tx_hash ? `tx:${payment.network}:${payment.tx_hash}` : `manual:${payment.id}`), id)
    .run()
  if (!(marked.meta as { changes?: number }).changes) return { ok: false as const, reason: 'already-paid' }
  const expiresAt = payment.product === 'wedding'
    ? await grantWeddingPass(event, payment.user_id, `payment:${payment.id}`)
    : await grantPlan(event, payment.user_id, payment.plan, { period: payment.period })
  return { ok: true as const, payment, expiresAt }
}

export async function rejectPayment(event: H3Event, id: string) {
  const changed = await getDB(event)
    .prepare(`UPDATE payments SET status = 'rejected', reviewed_at = datetime('now') WHERE id = ? AND status IN ('pending', 'submitted')`)
    .bind(id)
    .run()
  return !!(changed.meta as { changes?: number }).changes
}

/** The superadmin's Telegram chat, if they connected the bot (Settings → Notifications) */
async function adminChatId(event: H3Event) {
  const row = await getDB(event)
    .prepare('SELECT telegram_chat_id FROM profiles WHERE email = ? AND telegram_chat_id IS NOT NULL')
    .bind(SUPERADMIN_EMAIL)
    .first<{ telegram_chat_id: string }>()
  return row?.telegram_chat_id ?? null
}

export async function isAdminChat(event: H3Event, chatId: string) {
  return (await adminChatId(event)) === chatId
}

/** The reviewer (superadmin) reads English or Vietnamese */
export type AdminLanguage = 'en' | 'vi'

// What the reviewer reads, in their language (English by default)
export const REVIEW_COPY = {
  en: {
    period: { monthly: '1 month', annual: '1 year' } as Record<BillingPeriod, string>,
    title: '💳 <b>Payment waiting for review</b>',
    method: { bank: 'Bank transfer', crypto: 'Crypto', lemon: 'Card', creem: 'Card' },
    weddingPass: '💍 Wedding pass (1 year of Starter + Wedding room pack)',
    account: 'Account', plan: 'Plan', amount: 'Amount', tx: 'Tx', check: 'Check', note: 'Transfer message', code: 'Code',
    bankCheck: 'open your bank app and find a transfer with this amount and message.',
    approve: '✅ Approve & upgrade', reject: '✖ Reject', reviewPage: 'Review page',
    approved: (plan: string, until: string) => `✅ <b>Approved</b> · ${plan} until ${until}`,
    rejected: '✖ <b>Rejected</b>',
    answers: { unknown: 'Unknown request', notAdmin: 'Only the superadmin can review', notFound: 'Payment not found', alreadyPaid: 'Already approved', failed: 'Couldn’t approve', approved: 'Upgraded ✅', rejected: 'Rejected', decided: 'This payment was already decided' },
    dateLocale: 'en-GB',
  },
  vi: {
    period: { monthly: '1 tháng', annual: '1 năm' } as Record<BillingPeriod, string>,
    title: '💳 <b>Thanh toán chờ duyệt</b>',
    method: { bank: 'Chuyển khoản', crypto: 'Crypto', lemon: 'Thẻ', creem: 'Thẻ' },
    weddingPass: '💍 Gói Đám cưới (1 năm Starter + bộ phòng Cưới 3D)',
    account: 'Tài khoản', plan: 'Gói', amount: 'Số tiền', tx: 'Tx', check: 'Kiểm tra', note: 'Nội dung CK', code: 'Mã',
    bankCheck: 'mở app ngân hàng, tìm giao dịch đúng số tiền và nội dung trên.',
    approve: '✅ Duyệt & nâng cấp', reject: '✖ Từ chối', reviewPage: 'Trang duyệt',
    approved: (plan: string, until: string) => `✅ <b>Đã duyệt</b> · gói ${plan} tới ${until}`,
    rejected: '✖ <b>Đã từ chối</b>',
    answers: { unknown: 'Không hiểu yêu cầu', notAdmin: 'Chỉ superadmin được duyệt', notFound: 'Không tìm thấy thanh toán', alreadyPaid: 'Đã duyệt trước đó', failed: 'Không duyệt được', approved: 'Đã nâng cấp ✅', rejected: 'Đã từ chối', decided: 'Thanh toán này đã được xử lý' },
    dateLocale: 'vi-VN',
  },
} satisfies Record<AdminLanguage, unknown>

// What the payer reads, in their own language (English by default)
const PAYER_COPY = {
  en: {
    approved: (plan: string, until: string) => `✅ <b>Your ${plan} plan is on</b>${until ? ` until ${until}` : ''}. Thank you!`,
    rejected: (code: string, plan: string) => `⚠️ <b>We couldn’t confirm payment ${code}</b> (${plan} plan). If you did pay, contact support with this code and we’ll check again.`,
    openPerlink: 'Open Perlink', seePayment: 'See the payment',
    dateLocale: 'en-GB',
  },
  vi: {
    approved: (plan: string, until: string) => `✅ <b>Gói ${plan} đã được bật</b>${until ? ` đến ${until}` : ''}. Cảm ơn bạn!`,
    rejected: (code: string, plan: string) => `⚠️ <b>Chưa xác nhận được thanh toán ${code}</b> (gói ${plan}). Nếu bạn đã chuyển tiền, hãy liên hệ hỗ trợ kèm mã này để được kiểm tra lại.`,
    openPerlink: 'Mở Perlink', seePayment: 'Xem thanh toán',
    dateLocale: 'vi-VN',
  },
  zh: {
    approved: (plan: string, until: string) => `✅ <b>你的 ${plan} 套餐已开通</b>${until ? `，有效期至 ${until}` : ''}。感谢你的支持！`,
    rejected: (code: string, plan: string) => `⚠️ <b>我们暂时无法确认付款 ${code}</b>（${plan} 套餐）。如果你已付款，请带上这个编号联系客服，我们会再次核实。`,
    openPerlink: '打开 Perlink', seePayment: '查看付款',
    dateLocale: 'zh-CN',
  },
  ja: {
    approved: (plan: string, until: string) => `✅ <b>${plan} プランが有効になりました</b>${until ? `（${until} まで）` : ''}。ありがとうございます！`,
    rejected: (code: string, plan: string) => `⚠️ <b>お支払い ${code} を確認できませんでした</b>（${plan} プラン）。お支払い済みの場合は、このコードを添えてサポートまでご連絡ください。改めて確認いたします。`,
    openPerlink: 'Perlink を開く', seePayment: 'お支払いを確認する',
    dateLocale: 'ja-JP',
  },
  ko: {
    approved: (plan: string, until: string) => `✅ <b>${plan} 플랜이 활성화되었어요</b>${until ? ` (${until}까지)` : ''}. 감사합니다!`,
    rejected: (code: string, plan: string) => `⚠️ <b>결제를 확인하지 못했어요</b> (코드 ${code}, ${plan} 플랜). 결제하셨다면 이 코드와 함께 고객지원에 문의해 주세요. 다시 확인해 드릴게요.`,
    openPerlink: 'Perlink 열기', seePayment: '결제 내역 보기',
    dateLocale: 'ko-KR',
  },
} satisfies Record<AppLanguage, unknown>

/** The superadmin's language (their account setting): Vietnamese if they chose it, English otherwise */
export async function adminLanguage(event: H3Event): Promise<AdminLanguage> {
  const row = await getDB(event).prepare('SELECT language FROM profiles WHERE email = ?').bind(SUPERADMIN_EMAIL).first<{ language: string | null }>().catch(() => null)
  return toAppLanguage(row?.language) === 'vi' ? 'vi' : 'en'
}

/** The review message: who, which plan, how much, and how to check it */
export function paymentSummary(payment: PaymentRow, lang: AdminLanguage = 'en') {
  const c = REVIEW_COPY[lang]
  const lines = [
    `${c.title} · ${c.method[payment.method]}`,
    '',
    `<b>${c.account}:</b> ${escapeHtml(payment.email ?? payment.user_id)}`,
    payment.product === 'wedding'
      ? `<b>${c.plan}:</b> ${c.weddingPass}`
      : `<b>${c.plan}:</b> ${payment.plan.toUpperCase()} · ${c.period[payment.period]}`,
  ]
  if (payment.method === 'crypto') {
    const network = payment.network ? CRYPTO_NETWORK_BY_ID[payment.network] : undefined
    const expected = payment.amount_usd ?? 0
    lines.push(
      `<b>${c.amount}:</b> $${expected.toFixed(2)} ${payment.token ?? ''} · ${escapeHtml(network?.name ?? payment.network ?? '?')}`,
      `<b>${c.tx}:</b> <code>${escapeHtml(payment.tx_hash ?? '')}</code>`,
      `<b>${c.check}:</b> ${describeCheck(parseCheck(payment), expected, lang)}`,
    )
  } else {
    lines.push(
      `<b>${c.amount}:</b> ${formatVnd(payment.amount)}`,
      `<b>${c.note}:</b> <code>${transferNote(payment.code)}</code>`,
      `<b>${c.check}:</b> ${c.bankCheck}`,
    )
  }
  lines.push(`<b>${c.code}:</b> ${payment.code}`)
  return lines.join('\n')
}

/** Sends the review message with Approve / Reject (and the explorer, for crypto) */
export async function notifyPaymentSubmitted(event: H3Event, payment: PaymentRow) {
  const chatId = await adminChatId(event)
  if (!chatId) {
    console.warn('[billing] payment submitted but the superadmin has no Telegram linked:', payment.code)
    return
  }
  const lang = await adminLanguage(event)
  const c = REVIEW_COPY[lang]
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const explorer = parseCheck(payment)?.explorer
  await sendTelegram(event, chatId, paymentSummary(payment, lang), [
    [{ text: c.approve, callback: `pay:ok:${payment.id}` }, { text: c.reject, callback: `pay:no:${payment.id}` }],
    [
      ...(explorer ? [{ text: '🔎 Explorer', url: explorer }] : []),
      { text: c.reviewPage, url: `${siteUrl}/superadmin/payments` },
    ],
  ])
}

/** Tells the payer on Telegram (if they connected it) what was decided, in their language */
export async function notifyPayer(event: H3Event, payment: PaymentRow, approved: boolean, expiresAt?: string) {
  const row = await getDB(event).prepare('SELECT telegram_chat_id, language FROM profiles WHERE id = ?').bind(payment.user_id).first<{ telegram_chat_id: string | null; language: string | null }>()
  if (!row?.telegram_chat_id) return
  const c = PAYER_COPY[toAppLanguage(row.language)]
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const plan = payment.plan.toUpperCase()
  const until = expiresAt ? new Date(expiresAt).toLocaleDateString(c.dateLocale) : ''
  const html = approved ? c.approved(plan, until) : c.rejected(payment.code, plan)
  await sendTelegram(event, row.telegram_chat_id, html, [{ text: approved ? c.openPerlink : c.seePayment, url: `${siteUrl}/dashboard/upgrade` }])
}

/** After a decision in Telegram: the message says what happened, without the buttons */
export async function markTelegramDecision(event: H3Event, chatId: string, messageId: number, html: string) {
  await telegramApi(event, 'editMessageText', { chat_id: chatId, message_id: messageId, text: html, parse_mode: 'HTML', link_preview_options: { is_disabled: true } })
}
