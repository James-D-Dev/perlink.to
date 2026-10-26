import { getDB } from '../../utils/db'
import { sendTelegram, telegramApi, telegramConfig } from '../../utils/telegram'
import { BOT_COPY } from '../../utils/botCopy'
import { chatLanguage } from '../../utils/userLanguage'
import { toAppLanguage } from '#shared/language'
import { REVIEW_COPY, adminLanguage, approvePayment, isAdminChat, loadPayment, markTelegramDecision, notifyPayer, paymentSummary, rejectPayment } from '../../utils/paymentReview'

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
      .prepare('SELECT id, language FROM profiles WHERE telegram_link_token = ? AND telegram_link_expires > ?')
      .bind(start[1], new Date().toISOString())
      .first<{ id: string; language: string | null }>()
    if (!profile) {
      await sendTelegram(event, chatId, BOT_COPY[await chatLanguage(event, chatId)].expired)
      return { ok: true }
    }
    await db
      .prepare('UPDATE profiles SET telegram_chat_id = ?, telegram_link_token = NULL, telegram_link_expires = NULL WHERE id = ?')
      .bind(chatId, profile.id)
      .run()
    await sendTelegram(event, chatId, BOT_COPY[toAppLanguage(profile.language)].connected)
    return { ok: true }
  }

  // In the linked account's language, English otherwise
  const copy = BOT_COPY[await chatLanguage(event, chatId)]
  if (text === '/stop') {
    await db.prepare('UPDATE profiles SET telegram_chat_id = NULL WHERE telegram_chat_id = ?').bind(chatId).run()
    await sendTelegram(event, chatId, copy.stopped)
    return { ok: true }
  }

  await sendTelegram(event, chatId, copy.help)
  return { ok: true }
})

// "Approve" / "Reject" under a payment review message. Only the superadmin's
// own chat can decide; the message is updated to say what happened.
async function handlePaymentButton(event: Parameters<typeof telegramApi>[0], query: NonNullable<TelegramUpdate['callback_query']>) {
  const answer = (text: string) => telegramApi(event, 'answerCallbackQuery', { callback_query_id: query.id, text })
  const c = REVIEW_COPY[await adminLanguage(event)]
  const match = query.data?.match(/^pay:(ok|no):([\w-]+)$/)
  const chatId = query.message ? String(query.message.chat.id) : ''
  if (!match || !query.message) return answer(c.answers.unknown).then(() => ({ ok: true }))
  if (!(await isAdminChat(event, chatId))) return answer(c.answers.notAdmin).then(() => ({ ok: true }))

  const [, action, id] = match
  const payment = await loadPayment(event, id!)
  if (!payment) return answer(c.answers.notFound).then(() => ({ ok: true }))
  const lang = await adminLanguage(event)

  if (action === 'ok') {
    const result = await approvePayment(event, id!)
    if (!result.ok) {
      await answer(result.reason === 'already-paid' ? c.answers.alreadyPaid : c.answers.failed)
    } else {
      await answer(c.answers.approved)
      await notifyPayer(event, payment, true, result.expiresAt)
      const until = new Date(result.expiresAt).toLocaleDateString(c.dateLocale)
      await markTelegramDecision(event, chatId, query.message.message_id, `${paymentSummary(payment, lang)}\n\n${c.approved(payment.plan.toUpperCase(), until)}`)
    }
  } else {
    const rejected = await rejectPayment(event, id!)
    await answer(rejected ? c.answers.rejected : c.answers.decided)
    if (rejected) await notifyPayer(event, payment, false)
    if (rejected) await markTelegramDecision(event, chatId, query.message.message_id, `${paymentSummary(payment, lang)}\n\n${c.rejected}`)
  }
  return { ok: true }
}
