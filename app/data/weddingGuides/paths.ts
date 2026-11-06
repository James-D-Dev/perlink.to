// Addresses of the wedding guide pages, apart from their words, so the
// language switch and the sitemap don't load every page's text

/** The pillar page in each language; guide pages live under it */
export const WEDDING_BASE = { en: '/wedding-website', vi: '/vi/thiep-cuoi-online' } as const

/** Each guide page's last path segment, per language */
export const WEDDING_SLUGS = {
  wording: { en: 'wedding-invitation-wording', vi: 'loi-moi-cuoi-hay' },
  addressing: { en: 'how-to-address-wedding-guests', vi: 'cach-ghi-ten-khach-thiep-cuoi' },
  music: { en: 'wedding-music', vi: 'nhac-dam-cuoi' },
  paper: { en: 'online-vs-paper-wedding-invitations', vi: 'thiep-cuoi-online-hay-thiep-giay' },
  bilingual: { en: 'bilingual-wedding-invitation', vi: 'thiep-cuoi-song-ngu' },
  room: { en: 'wedding-invitation-with-3d-room', vi: 'thiep-cuoi-phong-3d' },
} as const

export type WeddingTopicId = keyof typeof WEDDING_SLUGS

/** English and Vietnamese address of every guide page (hreflang, sitemap, language switch) */
export const WEDDING_PAIRS: [string, string][] = Object.values(WEDDING_SLUGS)
  .map(slug => [`${WEDDING_BASE.en}/${slug.en}`, `${WEDDING_BASE.vi}/${slug.vi}`])
