import { requireSuperadmin } from '../../../utils/superadmin'
import { telegramApi, telegramConfig } from '../../../utils/telegram'

// Point the bot's updates at this site's webhook, with the shared secret
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const config = telegramConfig(event)
  if (!config?.webhookSecret) throw createError({ statusCode: 503, statusMessage: 'Set NUXT_TELEGRAM_BOT_TOKEN and NUXT_TELEGRAM_WEBHOOK_SECRET first' })
  const url = `${getRequestURL(event).origin}/api/telegram/webhook`
  const ok = await telegramApi<boolean>(event, 'setWebhook', {
    url,
    secret_token: config.webhookSecret,
    allowed_updates: ['message'],
    drop_pending_updates: true,
  })
  if (!ok) throw createError({ statusCode: 502, statusMessage: 'Telegram refused the webhook' })
  return { success: true, url }
})
