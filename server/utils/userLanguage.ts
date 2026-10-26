import type { H3Event } from 'h3'
import { getDB } from './db'
import { toAppLanguage, type AppLanguage } from '#shared/language'

/** The language an account chose in Settings (English if none) */
export async function userLanguage(event: H3Event, userId: string): Promise<AppLanguage> {
  const row = await getDB(event).prepare('SELECT language FROM profiles WHERE id = ?').bind(userId).first<{ language: string | null }>().catch(() => null)
  return toAppLanguage(row?.language)
}

/** The language of the account linked to a Telegram chat (English if none) */
export async function chatLanguage(event: H3Event, chatId: string): Promise<AppLanguage> {
  const row = await getDB(event).prepare('SELECT language FROM profiles WHERE telegram_chat_id = ?').bind(chatId).first<{ language: string | null }>().catch(() => null)
  return toAppLanguage(row?.language)
}
