import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import { grantPlan } from './plan'
import { SUPERADMIN_EMAIL } from './superadmin'
import { sendTelegram, telegramApi } from './telegram'
import { transferNote } from './billing'
import { describeCheck, type CryptoCheck } from './cryptoPayments'
import { CRYPTO_NETWORK_BY_ID } from '#shared/crypto'
import { formatVnd, type BillingPeriod, type PaidPlanId } from '#shared/plans'

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
  method: 'bank' | 'crypto'
  network: string | null
  token: string | null
  tx_hash: string | null
  check_result: string | null
  created_at: string
  submitted_at: string | null
  reviewed_at: string | null
  paid_at: string | null
}

export const PAYMENT_SELECT = `SELECT p.id, p.user_id, pr.email, p.plan, p.period, p.amount, p.amount_usd, p.code, p.status, p.method,
  p.network, p.token, p.tx_hash, p.check_result, p.created_at, p.submitted_at, p.reviewed_at, p.paid_at
  FROM payments p LEFT JOIN profiles pr ON pr.id = p.user_id`

export function loadPayment(event: H3Event, id: string) {
  return getDB(event).prepare(`${PAYMENT_SELECT} WHERE p.id = ?`).bind(id).first<PaymentRow>()
}

export const parseCheck = (row: { check_result: string | null }) => {
  try {
    return row.check_result ? JSON.parse(row.check_result) as CryptoCheck : null
  } catch {
    return null
  }
}

/** Puts the plan on the account; false if the payment was already decided */
export async function approvePayment(event: H3Event, id: string) {
  const payment = await loadPayment(event, id)
  if (!payment) return { ok: false as const, reason: 'not-found' }
  if (payment.status === 'paid') return { ok: false as const, reason: 'already-paid' }
  // Only the first approval goes through
  const marked = await getDB(event)
    .prepare(`UPDATE payments SET status = 'paid', paid_at = datetime('now'), reviewed_at = datetime('now'),
      provider_ref = COALESCE(provider_ref, ?) WHERE id = ? AND status IN ('pending', 'submitted', 'rejected')`)
    .bind(payment.tx_hash ? `tx:${payment.network}:${payment.tx_hash}` : `manual:${payment.id}`, id)
    .run()
  if (!(marked.meta as { changes?: number }).changes) return { ok: false as const, reason: 'already-paid' }
  const expiresAt = await grantPlan(event, payment.user_id, payment.plan, { period: payment.period })
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

const PERIOD_LABEL: Record<BillingPeriod, string> = { monthly: '1 tháng', annual: '1 năm' }

/** The review message: who, which plan, how much, and how to check it */
export function paymentSummary(payment: PaymentRow) {
  const lines = [
    `💳 <b>Thanh toán chờ duyệt</b> · ${payment.method === 'crypto' ? 'Crypto' : 'Chuyển khoản'}`,
    '',
    `<b>Tài khoản:</b> ${escapeHtml(payment.email ?? payment.user_id)}`,
    `<b>Gói:</b> ${payment.plan.toUpperCase()} · ${PERIOD_LABEL[payment.period]}`,
  ]
  if (payment.method === 'crypto') {
    const network = payment.network ? CRYPTO_NETWORK_BY_ID[payment.network] : undefined
    const expected = payment.amount_usd ?? 0
    lines.push(
      `<b>Số tiền:</b> $${expected.toFixed(2)} ${payment.token ?? ''} · ${escapeHtml(network?.name ?? payment.network ?? '?')}`,
      `<b>Tx:</b> <code>${escapeHtml(payment.tx_hash ?? '')}</code>`,
      `<b>Kiểm tra:</b> ${describeCheck(parseCheck(payment), expected)}`,
    )
  } else {
    lines.push(
      `<b>Số tiền:</b> ${formatVnd(payment.amount)}`,
      `<b>Nội dung CK:</b> <code>${transferNote(payment.code)}</code>`,
      '<b>Kiểm tra:</b> mở app ngân hàng, tìm giao dịch đúng số tiền và nội dung trên.',
    )
  }
  lines.push(`<b>Mã:</b> ${payment.code}`)
  return lines.join('\n')
}

/** Sends the review message with Approve / Reject (and the explorer, for crypto) */
export async function notifyPaymentSubmitted(event: H3Event, payment: PaymentRow) {
  const chatId = await adminChatId(event)
  if (!chatId) {
    console.warn('[billing] payment submitted but the superadmin has no Telegram linked:', payment.code)
    return
  }
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const explorer = parseCheck(payment)?.explorer
  await sendTelegram(event, chatId, paymentSummary(payment), [
    [{ text: '✅ Duyệt & nâng cấp', callback: `pay:ok:${payment.id}` }, { text: '✖ Từ chối', callback: `pay:no:${payment.id}` }],
    [
      ...(explorer ? [{ text: '🔎 Explorer', url: explorer }] : []),
      { text: 'Trang duyệt', url: `${siteUrl}/superadmin/payments` },
    ],
  ])
}

/** Tells the payer on Telegram (if they connected it) what was decided */
export async function notifyPayer(event: H3Event, payment: PaymentRow, approved: boolean, expiresAt?: string) {
  const row = await getDB(event).prepare('SELECT telegram_chat_id FROM profiles WHERE id = ?').bind(payment.user_id).first<{ telegram_chat_id: string | null }>()
  if (!row?.telegram_chat_id) return
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const plan = payment.plan.toUpperCase()
  const html = approved
    ? `✅ <b>Gói ${plan} đã được bật</b>${expiresAt ? ` đến ${new Date(expiresAt).toLocaleDateString('vi-VN')}` : ''}. Cảm ơn bạn!\n\n<b>Your ${plan} plan is on.</b> Thank you!`
    : `⚠️ <b>Chưa xác nhận được thanh toán ${payment.code}</b> (gói ${plan}). Nếu bạn đã chuyển tiền, hãy trả lời email hỗ trợ kèm mã này để được kiểm tra lại.\n\n<b>We couldn't confirm payment ${payment.code}.</b> If you did pay, contact support with this code.`
  await sendTelegram(event, row.telegram_chat_id, html, [{ text: approved ? 'Mở Perlink' : 'Xem thanh toán', url: `${siteUrl}/dashboard/upgrade` }])
}

/** After a decision in Telegram: the message says what happened, without the buttons */
export async function markTelegramDecision(event: H3Event, chatId: string, messageId: number, html: string) {
  await telegramApi(event, 'editMessageText', { chat_id: chatId, message_id: messageId, text: html, parse_mode: 'HTML', link_preview_options: { is_disabled: true } })
}
