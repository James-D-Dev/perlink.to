import { getDB } from '../../utils/db'

// Stop Telegram messages for this account
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  await getDB(event)
    .prepare('UPDATE profiles SET telegram_chat_id = NULL, telegram_link_token = NULL, telegram_link_expires = NULL WHERE id = ?')
    .bind(user.id)
    .run()
  return { success: true }
})
