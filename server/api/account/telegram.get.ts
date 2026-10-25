import { getDB } from '../../utils/db'
import { telegramConfig } from '../../utils/telegram'

// Is Telegram available, and is this account linked to a chat?
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const config = telegramConfig(event)
  if (!config) return { enabled: false, connected: false }
  const row = await getDB(event).prepare('SELECT telegram_chat_id FROM profiles WHERE id = ?').bind(user.id).first<{ telegram_chat_id: string | null }>()
  return { enabled: true, connected: !!row?.telegram_chat_id, botUsername: config.botUsername }
})
