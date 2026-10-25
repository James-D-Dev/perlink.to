import { getDB } from '../../utils/db'
import { telegramConfig } from '../../utils/telegram'

/** How long the link from "Connect Telegram" works */
const LINK_MINUTES = 30

// Start linking Telegram: a one-time code for the bot's /start command,
// opened as t.me/<bot>?start=<code>
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const config = telegramConfig(event)
  if (!config?.botUsername) throw createError({ statusCode: 503, statusMessage: 'Telegram is not set up yet' })

  // Telegram allows A-Z a-z 0-9 _ - in start parameters, up to 64 characters
  const token = Array.from(crypto.getRandomValues(new Uint8Array(18)), b => b.toString(16).padStart(2, '0')).join('')
  const expires = new Date(Date.now() + LINK_MINUTES * 60_000).toISOString()
  await getDB(event)
    .prepare('UPDATE profiles SET telegram_link_token = ?, telegram_link_expires = ? WHERE id = ?')
    .bind(token, expires, user.id)
    .run()
  return { url: `https://t.me/${config.botUsername}?start=${token}` }
})
