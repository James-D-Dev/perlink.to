import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import { stayNights } from './formNotification'
import { toAppLanguage } from '#shared/language'

// Messages from the Perlink Telegram bot. An owner links their account once
// (see /api/account/telegram); new orders and form requests on any of their
// sites are then sent to that chat.

export function telegramConfig(event: H3Event) {
  const { botToken, botUsername, webhookSecret } = useRuntimeConfig(event).telegram ?? {}
  return botToken ? { botToken: String(botToken), botUsername: String(botUsername || ''), webhookSecret: String(webhookSecret || '') } : null
}

/** Calls a Bot API method; returns its result, or null on any failure */
export async function telegramApi<T = unknown>(event: H3Event, method: string, body: Record<string, unknown>): Promise<T | null> {
  const config = telegramConfig(event)
  if (!config) return null
  try {
    const response = await fetch(`https://api.telegram.org/bot${config.botToken}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    const data = await response.json() as { ok: boolean; result?: T; description?: string }
    if (!data.ok) {
      console.warn(`[telegram] ${method} failed:`, data.description)
      return null
    }
    return data.result ?? null
  } catch (error) {
    console.warn(`[telegram] ${method} error:`, error instanceof Error ? error.message : error)
    return null
  }
}

/** A link button, or one that sends `callback` back to the webhook */
export type TelegramButton = { text: string; url: string } | { text: string; callback: string }

const toInlineButton = (b: TelegramButton) => ('url' in b ? { text: b.text, url: b.url } : { text: b.text, callback_data: b.callback })

/** Sends an HTML-formatted message, with buttons under it (one row, or rows) */
export function sendTelegram(event: H3Event, chatId: string, html: string, buttons: TelegramButton[] | TelegramButton[][] = []) {
  const rows = (buttons.length && Array.isArray(buttons[0]) ? buttons : [buttons]) as TelegramButton[][]
  return telegramApi(event, 'sendMessage', {
    chat_id: chatId,
    text: html,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
    ...(buttons.length ? { reply_markup: { inline_keyboard: rows.map(row => row.map(toInlineButton)) } } : {}),
  })
}

const COPY = {
  en: {
    order: (code: string) => `🛍 <b>New order ${code}</b>`,
    request: '📩 <b>New request</b>',
    rsvp: '💌 <b>Reply to your invitation</b>',
    stay: '🛏 <b>New room booking</b>',
    booking: '📅 <b>New booking</b>',
    answer: '💘 <b>Someone said YES</b>',
    subscribe: '📬 <b>New subscriber</b>',
    guestbook: (gift: string) => `💌 <b>New guestbook message</b> ${gift}`,
    on: (site: string) => `on perlink.to/${site}`,
    labels: { product: 'Product', quantity: 'Quantity', total: 'Total', payment: 'Payment', question: 'Question', name: 'Name', attending: 'Coming', service: 'Service', phone: 'Phone', email: 'Email', address: 'Address', date: 'Date', checkout: 'Check-out', nights: 'Nights', time: 'Time', guests: 'Guests', message: 'Message' } as Record<string, string>,
    payments: { cod: 'Cash on delivery', transfer: 'Bank transfer — check your bank account' } as Record<string, string>,
    attending: { yes: '✅ Yes', no: '❌ Can’t make it' } as Record<string, string>,
    open: 'Open inbox',
  },
  vi: {
    order: (code: string) => `🛍 <b>Đơn hàng mới ${code}</b>`,
    request: '📩 <b>Yêu cầu mới</b>',
    rsvp: '💌 <b>Khách trả lời thiệp mời</b>',
    stay: '🛏 <b>Đặt phòng mới</b>',
    booking: '📅 <b>Lịch hẹn mới</b>',
    answer: '💘 <b>Người ấy đã đồng ý</b>',
    subscribe: '📬 <b>Người đăng ký nhận tin mới</b>',
    guestbook: (gift: string) => `💌 <b>Lời chúc mới trong phòng 3D</b> ${gift}`,
    on: (site: string) => `trên perlink.to/${site}`,
    labels: { product: 'Sản phẩm', quantity: 'Số lượng', total: 'Tổng tiền', payment: 'Thanh toán', question: 'Câu hỏi', name: 'Họ tên', attending: 'Tham dự', service: 'Dịch vụ', phone: 'SĐT', email: 'Email', address: 'Địa chỉ', date: 'Ngày', checkout: 'Trả phòng', nights: 'Số đêm', time: 'Giờ', guests: 'Số khách', message: 'Lời nhắn' } as Record<string, string>,
    payments: { cod: 'Thanh toán khi nhận hàng (COD)', transfer: 'Chuyển khoản — kiểm tra tài khoản ngân hàng' } as Record<string, string>,
    attending: { yes: '✅ Có, sẽ đến', no: '❌ Không đến được' } as Record<string, string>,
    open: 'Mở Hộp thư',
  },
}

/** Tells a site's owner about a new order or form request, if they linked Telegram */
export async function notifyOwnerTelegram(
  event: H3Event,
  site: { userId: string; username: string; themeConfig?: unknown },
  data: Record<string, string>,
) {
  if (!telegramConfig(event)) return
  const owner = await getDB(event)
    .prepare('SELECT telegram_chat_id, language FROM profiles WHERE id = ?')
    .bind(site.userId)
    .first<{ telegram_chat_id: string | null; language: string | null }>()
  if (!owner?.telegram_chat_id) return

  // In the owner's language (Settings), English by default
  const copy = COPY[toAppLanguage(owner.language)]
  const isOrder = data.kind === 'order'
  const shown: Record<string, string> = {
    ...data,
    ...(isOrder && data.payment ? { payment: copy.payments[data.payment] ?? data.payment } : {}),
    ...(data.attending ? { attending: copy.attending[data.attending] ?? data.attending } : {}),
    ...(data.date && data.checkout ? { nights: String(stayNights(data.date, data.checkout)) } : {}),
  }
  const isAnswer = data.kind === 'answer'
  const isSubscriber = data.kind === 'subscribe'
  // A "yes" to a question: just the question, no contact details; a
  // subscriber: just the email, on one line
  const lines = isAnswer
    ? (data.question ? [`“${escapeHtml(data.question)}”`] : [])
    : isSubscriber
      ? [escapeHtml(data.email ?? '')]
    : Object.keys(copy.labels)
        .filter(key => shown[key])
        .map(key => `<b>${escapeHtml(copy.labels[key]!)}:</b> ${escapeHtml(shown[key]!)}`)
  const isGuestbook = data.kind === 'guestbook'
  const heading = isOrder
    ? copy.order(escapeHtml(data.code ?? ''))
    : isGuestbook
      ? copy.guestbook(escapeHtml(data.gift ?? ''))
      : data.kind === 'rsvp' ? copy.rsvp
        : isAnswer ? copy.answer
          : isSubscriber ? copy.subscribe
          : data.kind === 'stay' ? copy.stay
            : data.kind === 'booking' && data.date ? copy.booking
              : copy.request
  const html = `${heading} ${escapeHtml(copy.on(site.username))}\n\n${lines.join('\n')}`
  await sendTelegram(event, owner.telegram_chat_id, html, [
    { text: copy.open, url: `https://perlink.to/dashboard/site/${site.username}/inbox${isGuestbook ? '#guestbook' : isSubscriber ? '#subscribers' : ''}` },
  ])
}
