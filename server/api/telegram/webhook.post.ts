import { getDB } from '../../utils/db'
import { sendTelegram, telegramConfig } from '../../utils/telegram'

interface TelegramUpdate {
  message?: {
    text?: string
    chat: { id: number; type: string }
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
