import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import { sendTelegram } from './telegram'
import { adminChatId, adminLanguage } from './paymentReview'
import { toAppLanguage } from '#shared/language'

// Chat with support. A signed-in user writes from the dashboard; each message
// is announced to the admin on Telegram, who answers from Superadmin →
// Support or by replying to that Telegram message.

export const SUPPORT_MAX_LENGTH = 2000

export interface SupportMessageRow {
  id: string
  user_id: string
  sender: 'user' | 'admin'
  body: string
  created_at: string
  read_at: string | null
}

export const toSupportMessage = (m: SupportMessageRow) => ({
  id: m.id,
  sender: m.sender,
  body: m.body,
  createdAt: m.created_at,
  read: !!m.read_at,
})

/** A message as the user or admin typed it: trimmed, not empty, not too long */
export function cleanSupportBody(value: unknown) {
  const body = typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : ''
  if (!body) throw createError({ statusCode: 400, statusMessage: 'Message is empty' })
  if (body.length > SUPPORT_MAX_LENGTH) throw createError({ statusCode: 400, statusMessage: 'Message is too long' })
  return body
}

export async function addSupportMessage(event: H3Event, userId: string, sender: 'user' | 'admin', body: string) {
  const id = crypto.randomUUID()
  await getDB(event)
    .prepare('INSERT INTO support_messages (id, user_id, sender, body) VALUES (?, ?, ?, ?)')
    .bind(id, userId, sender, body)
    .run()
  return id
}

const ADMIN_COPY = {
  en: { title: '💬 <b>New support message</b>', open: 'Open conversation', hint: 'Reply to this message to answer.' },
  vi: { title: '💬 <b>Tin nhắn tư vấn mới</b>', open: 'Mở cuộc trò chuyện', hint: 'Trả lời (reply) tin này để nhắn lại khách.' },
}

/** Tells the admin on Telegram; remembers the Telegram message so a reply there answers the user */
export async function notifyAdminOfSupport(event: H3Event, messageId: string, user: { id: string; email?: string | null; name?: string | null }, body: string) {
  const chatId = await adminChatId(event)
  if (!chatId) {
    console.warn('[support] new message but the superadmin has no Telegram linked')
    return
  }
  const c = ADMIN_COPY[await adminLanguage(event)]
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const who = [user.name, user.email].filter(Boolean).map(v => escapeHtml(String(v))).join(' · ')
  const text = body.length > 1500 ? `${body.slice(0, 1500)}…` : body
  const sent = await sendTelegram(event, chatId, `${c.title}\n<b>${who}</b>\n\n${escapeHtml(text)}\n\n<i>${c.hint}</i>`, [
    { text: c.open, url: `${siteUrl}/superadmin/support?user=${encodeURIComponent(user.id)}` },
  ]) as { message_id?: number } | null
  if (sent?.message_id) {
    await getDB(event).prepare('UPDATE support_messages SET telegram_message_id = ? WHERE id = ?').bind(sent.message_id, messageId).run()
  }
}

const USER_COPY = {
  en: { title: '💬 <b>Perlink support replied</b>', open: 'Open the chat' },
  vi: { title: '💬 <b>Perlink đã trả lời bạn</b>', open: 'Mở cuộc trò chuyện' },
  zh: { title: '💬 <b>Perlink 客服回复了你</b>', open: '打开对话' },
  ja: { title: '💬 <b>Perlink サポートから返信があります</b>', open: 'チャットを開く' },
  ko: { title: '💬 <b>Perlink 지원팀이 답장했습니다</b>', open: '채팅 열기' },
} as const

/** Tells the user on Telegram, if they connected it, that support answered */
export async function notifyUserOfReply(event: H3Event, userId: string, body: string) {
  const row = await getDB(event).prepare('SELECT telegram_chat_id, language FROM profiles WHERE id = ?').bind(userId).first<{ telegram_chat_id: string | null; language: string | null }>()
  if (!row?.telegram_chat_id) return
  const c = USER_COPY[toAppLanguage(row.language) as keyof typeof USER_COPY] ?? USER_COPY.en
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const text = body.length > 1500 ? `${body.slice(0, 1500)}…` : body
  await sendTelegram(event, row.telegram_chat_id, `${c.title}\n\n${escapeHtml(text)}`, [{ text: c.open, url: `${siteUrl}/dashboard?support=1` }])
}

/** The admin replied to a support notification in Telegram: that's an answer to the user */
export async function answerFromTelegram(event: H3Event, repliedTo: number, body: string) {
  const original = await getDB(event)
    .prepare("SELECT user_id FROM support_messages WHERE telegram_message_id = ? AND sender = 'user'")
    .bind(repliedTo)
    .first<{ user_id: string }>()
  if (!original) return false
  const clean = body.trim().slice(0, SUPPORT_MAX_LENGTH)
  if (!clean) return false
  await addSupportMessage(event, original.user_id, 'admin', clean)
  // Answering means the admin has read the conversation
  await getDB(event).prepare("UPDATE support_messages SET read_at = datetime('now') WHERE user_id = ? AND sender = 'user' AND read_at IS NULL").bind(original.user_id).run()
  await notifyUserOfReply(event, original.user_id, clean)
  return true
}
