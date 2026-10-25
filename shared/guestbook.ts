// Gifts visitors can leave with a guestbook message; each becomes a small
// 3D object in front of the room (app/utils/room/guestGifts.ts)
export const GUEST_GIFTS = ['flower', 'gift', 'cake', 'balloon', 'bear', 'star'] as const
export type GuestGiftType = (typeof GUEST_GIFTS)[number]

export const GUEST_GIFT_EMOJI: Record<GuestGiftType, string> = {
  flower: '💐',
  gift: '🎁',
  cake: '🎂',
  balloon: '🎈',
  bear: '🧸',
  star: '⭐',
}

export const GUESTBOOK_LIMITS = {
  name: 40,
  message: 240,
  /** Newest entries shown in a room */
  shown: 60,
}

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  gift: GuestGiftType
  createdAt: string
}
