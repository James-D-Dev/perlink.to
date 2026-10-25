import { getDB } from '../../../utils/db'
import { sendTelegram } from '../../../utils/telegram'

// Send a test message to the linked chat
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const row = await getDB(event).prepare('SELECT telegram_chat_id FROM profiles WHERE id = ?').bind(user.id).first<{ telegram_chat_id: string | null }>()
  if (!row?.telegram_chat_id) throw createError({ statusCode: 409, statusMessage: 'Telegram is not connected' })
  const sent = await sendTelegram(event, row.telegram_chat_id, '✅ <b>Perlink</b>: thông báo đang hoạt động. Đơn hàng và yêu cầu mới sẽ được gửi tới đây.\n\nNotifications are working. New orders and requests will arrive here.')
  if (!sent) throw createError({ statusCode: 502, statusMessage: 'Telegram did not accept the message' })
  return { success: true }
})
