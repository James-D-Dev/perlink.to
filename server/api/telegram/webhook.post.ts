import { getDB } from '../../utils/db'
import { sendTelegram, telegramApi, telegramConfig } from '../../utils/telegram'
import { approvePayment, isAdminChat, loadPayment, markTelegramDecision, paymentSummary, rejectPayment } from '../../utils/paymentReview'

interface TelegramUpdate {
  message?: {
    text?: string
    chat: { id: number; type: string }
  }
  /** A button under a payment review message was pressed */
  callback_query?: {
    id: string
    data?: string
    message?: { message_id: number; chat: { id: number } }
  }
}

const HELP = 'Perlink gửi đơn hàng và yêu cầu mới của trang bạn tới đây. Để kết nối, vào perlink.to → Cài đặt → Thông báo → Kết nối Telegram. Gõ /stop để tắt.\n\nPerlink sends your new orders and requests here. To connect, open perlink.to → Settings → Notifications → Connect Telegram. Send /stop to turn it off.'

// Messages people send to the Perlink bot. Telegram calls this with the
// secret set by /api/superadmin/telegram/setup; anything else is refused.
export default defineEventHandler(async (event) => {
  const config = telegramConfig(event)
  if (!config?.webhookSecret || getRequestHeader(event, 'x-telegram-bot-api-secret-token') !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const update = await readBody<TelegramUpdate>(event)
  if (update?.callback_query) return handlePaymentButton(event, update.callback_query)
  const message = update?.message
  // Only private chats with the bot; groups are ignored
  if (!message?.text || message.chat.type !== 'private') return { ok: true }
  const chatId = String(message.chat.id)
  const text = message.text.trim()
  const db = getDB(event)

  // "/start <code>" from the Connect Telegram link
  const start = text.match(/^\/start(?:\s+([A-Za-z0-9_-]{8,64}))?$/)
  if (start?.[1]) {
    const profile = await db
      .prepare('SELECT id FROM profiles WHERE telegram_link_token = ? AND telegram_link_expires > ?')
      .bind(start[1], new Date().toISOString())
      .first<{ id: string }>()
    if (!profile) {
      await sendTelegram(event, chatId, 'Liên kết đã hết hạn. Hãy bấm lại "Kết nối Telegram" trên Perlink.\n\nThis link has expired. Press "Connect Telegram" on Perlink again.')
      return { ok: true }
    }
    await db
      .prepare('UPDATE profiles SET telegram_chat_id = ?, telegram_link_token = NULL, telegram_link_expires = NULL WHERE id = ?')
      .bind(chatId, profile.id)
      .run()
    await sendTelegram(event, chatId, '✅ <b>Đã kết nối với Perlink!</b> Đơn hàng và yêu cầu mới sẽ được gửi tới đây. Gõ /stop để tắt.\n\n<b>Connected to Perlink!</b> New orders and requests will arrive here. Send /stop to turn it off.')
    return { ok: true }
  }

  if (text === '/stop') {
    await db.prepare('UPDATE profiles SET telegram_chat_id = NULL WHERE telegram_chat_id = ?').bind(chatId).run()
    await sendTelegram(event, chatId, 'Đã tắt thông báo Perlink.\n\nPerlink notifications are off.')
    return { ok: true }
  }

  await sendTelegram(event, chatId, HELP)
  return { ok: true }
})

// "Approve" / "Reject" under a payment review message. Only the superadmin's
// own chat can decide; the message is updated to say what happened.
async function handlePaymentButton(event: Parameters<typeof telegramApi>[0], query: NonNullable<TelegramUpdate['callback_query']>) {
  const answer = (text: string) => telegramApi(event, 'answerCallbackQuery', { callback_query_id: query.id, text })
  const match = query.data?.match(/^pay:(ok|no):([\w-]+)$/)
  const chatId = query.message ? String(query.message.chat.id) : ''
  if (!match || !query.message) return answer('Không hiểu yêu cầu').then(() => ({ ok: true }))
  if (!(await isAdminChat(event, chatId))) return answer('Chỉ superadmin được duyệt').then(() => ({ ok: true }))

  const [, action, id] = match
  const payment = await loadPayment(event, id!)
  if (!payment) return answer('Không tìm thấy thanh toán').then(() => ({ ok: true }))

  if (action === 'ok') {
    const result = await approvePayment(event, id!)
    if (!result.ok) {
      await answer(result.reason === 'already-paid' ? 'Đã duyệt trước đó' : 'Không duyệt được')
    } else {
      await answer('Đã nâng cấp ✅')
      const until = new Date(result.expiresAt).toLocaleDateString('vi-VN')
      await markTelegramDecision(event, chatId, query.message.message_id, `${paymentSummary(payment)}\n\n✅ <b>Đã duyệt</b> · gói ${payment.plan.toUpperCase()} tới ${until}`)
    }
  } else {
    const rejected = await rejectPayment(event, id!)
    await answer(rejected ? 'Đã từ chối' : 'Thanh toán này đã được xử lý')
    if (rejected) await markTelegramDecision(event, chatId, query.message.message_id, `${paymentSummary(payment)}\n\n✖ <b>Đã từ chối</b>`)
  }
  return { ok: true }
}
