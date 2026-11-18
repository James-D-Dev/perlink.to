import type { H3Event } from 'h3'
import { getDB } from './db'
import { escapeHtml } from './email'
import { sendTelegram } from './telegram'
import { getAccountPlan } from './plan'
import { PLAN_LIMITS } from '#shared/plans'
import { toAppLanguage, type AppLanguage } from '#shared/language'

// Guests of an invitation (site_guests): the owner's list, each with a link
// of their own (?to=Name), and when each one opened it.

/** One row per guest name, however it was typed */
export const guestKey = (name: string) => name.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ')

/** A name as the envelope shows it: trimmed, at most 60 characters (BioLetterDisplay) */
export const cleanGuestName = (name: unknown) => String(name ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').slice(0, 60)

/** At most this many guests per site, listed or seen through a link */
export const MAX_GUESTS = 2000

export type GuestSide = 'groom' | 'bride'
export const toSide = (value: unknown): GuestSide | null => (value === 'groom' || value === 'bride' ? value : null)

const COPY = {
  en: {
    opened: (name: string) => `💌 <b>${name}</b> just opened your invitation`,
    letter: (name: string) => `💌 <b>${name}</b> opened the letter`,
    on: (site: string) => `on perlink.to/${site}`,
    open: 'See your guests',
  },
  vi: {
    opened: (name: string) => `💌 <b>${name}</b> vừa mở thiệp của bạn`,
    letter: (name: string) => `💌 <b>${name}</b> vừa mở thư mời`,
    on: (site: string) => `trên perlink.to/${site}`,
    open: 'Xem danh sách khách',
  },
  zh: {
    opened: (name: string) => `💌 <b>${name}</b> 刚刚打开了你的邀请函`,
    letter: (name: string) => `💌 <b>${name}</b> 打开了信件`,
    on: (site: string) => `（perlink.to/${site}）`,
    open: '查看来宾名单',
  },
  ja: {
    opened: (name: string) => `💌 <b>${name}</b>さんが招待状を開きました`,
    letter: (name: string) => `💌 <b>${name}</b>さんが手紙を開きました`,
    on: (site: string) => `（perlink.to/${site}）`,
    open: 'ゲスト一覧を見る',
  },
  ko: {
    opened: (name: string) => `💌 <b>${name}</b>님이 방금 초대장을 열었어요`,
    letter: (name: string) => `💌 <b>${name}</b>님이 편지를 열었어요`,
    on: (site: string) => `(perlink.to/${site})`,
    open: '하객 명단 보기',
  },
} satisfies Record<AppLanguage, unknown>

/** Tells the owner on Telegram that a guest opened the invitation the first time (plans with guest tracking) */
export async function notifyGuestOpened(event: H3Event, site: { userId: string; username: string }, name: string) {
  const { plan } = await getAccountPlan(event, site.userId)
  if (!PLAN_LIMITS[plan].guestTracking) return
  const owner = await getDB(event).prepare('SELECT telegram_chat_id, language FROM profiles WHERE id = ?').bind(site.userId)
    .first<{ telegram_chat_id: string | null; language: string | null }>()
  if (!owner?.telegram_chat_id) return
  const copy = COPY[toAppLanguage(owner.language)]
  await sendTelegram(event, owner.telegram_chat_id, `${copy.opened(escapeHtml(name))} ${escapeHtml(copy.on(site.username))}`, [
    { text: copy.open, url: `https://perlink.to/dashboard/site/${site.username}/guests` },
  ])
}
