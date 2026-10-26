import { getDB } from '../../../utils/db'
import { sendTelegram } from '../../../utils/telegram'
import { BOT_COPY } from '../../../utils/botCopy'
import { toAppLanguage } from '#shared/language'

// Send a test message to the linked chat
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const row = await getDB(event).prepare('SELECT telegram_chat_id, language FROM profiles WHERE id = ?').bind(user.id).first<{ telegram_chat_id: string | null; language: string | null }>()
  if (!row?.telegram_chat_id) throw createError({ statusCode: 409, statusMessage: 'Telegram is not connected' })
  const sent = await sendTelegram(event, row.telegram_chat_id, BOT_COPY[toAppLanguage(row.language)].test)
  if (!sent) throw createError({ statusCode: 502, statusMessage: 'Telegram did not accept the message' })
  return { success: true }
})
