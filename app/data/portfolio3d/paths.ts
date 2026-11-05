// Addresses of the 3D portfolio pages, apart from their words, so the
// language switch and the sitemap don't load every page's text

/** The pillar page in each language; topic pages live under it */
export const PORTFOLIO_BASE = { en: '/3d-portfolio', vi: '/vi/portfolio-3d' } as const

/** Each topic page's last path segment, per language */
export const PORTFOLIO_SLUGS = {
  designer: { en: 'designer', vi: 'designer' },
  developer: { en: 'developer', vi: 'lap-trinh-vien' },
  photographer: { en: 'photographer', vi: 'nhiep-anh-gia' },
  architect: { en: 'architect', vi: 'kien-truc-su' },
  student: { en: 'student', vi: 'sinh-vien' },
  examples: { en: 'examples', vi: 'vi-du' },
  compare: { en: 'vs-traditional-portfolio', vi: 'so-voi-portfolio-thuong' },
  effects: { en: 'portfolio-website-with-3d-effects', vi: 'website-portfolio-hieu-ung-3d' },
  free: { en: 'free', vi: 'mien-phi' },
} as const

export type PortfolioTopicId = keyof typeof PORTFOLIO_SLUGS

/** English and Vietnamese address of every topic page (hreflang, sitemap, language switch) */
export const PORTFOLIO_PAIRS: [string, string][] = Object.values(PORTFOLIO_SLUGS)
  .map(slug => [`${PORTFOLIO_BASE.en}/${slug.en}`, `${PORTFOLIO_BASE.vi}/${slug.vi}`])
