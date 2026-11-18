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

/** The language most people in a country read (Cloudflare's cf-ipcountry code), if it isn't English */
export function countryLanguage(country: string | null | undefined): AppLanguage | null {
  switch ((country || '').toUpperCase()) {
    case 'VN': return 'vi'
    case 'CN': case 'SG': return 'zh'
    case 'JP': return 'ja'
    case 'KR': return 'ko'
    default: return null
  }
}

/**
 * The browser's preferred language (the top of Accept-Language), when it's
 * one of ours other than English. zh-TW / zh-HK / zh-Hant aren't Simplified
 * Chinese, so they don't count.
 */
export function acceptLanguage(header: string | null | undefined): AppLanguage | null {
  const tag = (header || '')
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';')
      const q = Number(params.find(p => p.trim().startsWith('q='))?.trim().slice(2) ?? 1)
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 }
    })
    .filter(t => t.tag && t.q > 0)
    .sort((a, b) => b.q - a.q)[0]?.tag ?? ''
  const primary = tag.split('-')[0]
  if (primary === 'vi') return 'vi'
  if (primary === 'ja') return 'ja'
  if (primary === 'ko') return 'ko'
  if (primary === 'zh' && !/^zh-(tw|hk|mo|hant)\b/.test(tag)) return 'zh'
  return null
}

/**
 * How an email greets someone by name: Vietnamese names put the given name
 * last ("Hoàng Kim Đức" → Đức), English uses the first word, Chinese,
 * Japanese and Korean the full name as given (the templates add さん / 님).
 * Without a name, a word that reads naturally in the template's place.
 */
export function greetingName(name: string | null | undefined, lang: AppLanguage, fallbackEn = 'there') {
  const full = (name || '').trim().replace(/\s+/g, ' ')
  const parts = full.split(' ').filter(Boolean)
  switch (lang) {
    case 'vi': return parts.at(-1) || 'bạn'
    case 'zh': return full || '你好'
    case 'ja': return full || 'ゲスト'
    case 'ko': return full || '회원'
    default: return parts[0] || fallbackEn
  }
}
