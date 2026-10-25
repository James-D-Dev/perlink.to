import { requireSuperadmin } from '../../utils/superadmin'
import { telegramApi, telegramConfig } from '../../utils/telegram'

// Bot status for Superadmin → Settings: which bot, and where Telegram sends updates
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const config = telegramConfig(event)
  if (!config) return { configured: false }
  const [bot, webhook] = await Promise.all([
    telegramApi<{ username: string }>(event, 'getMe', {}),
    telegramApi<{ url: string; pending_update_count: number; last_error_message?: string }>(event, 'getWebhookInfo', {}),
  ])
  return {
    configured: true,
    botUsername: bot?.username ?? null,
    usernameMatches: !!bot && bot.username === config.botUsername,
    hasSecret: !!config.webhookSecret,
    webhookUrl: webhook?.url ?? '',
    pending: webhook?.pending_update_count ?? 0,
    lastError: webhook?.last_error_message ?? null,
  }
})
