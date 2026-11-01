import type { BioBlock, ThemeConfig } from '~/types/bio'

const SITE = 'https://perlink.to'

interface SeoSource {
  title?: string | null
  bio?: string | null
  avatarUrl?: string | null
  themeConfig?: Partial<ThemeConfig> | null
  blocks?: BioBlock[] | null
  /** False on plans without the Perlink badge */
  showBranding?: boolean
}

function absolute(url: string) {
  return url.startsWith('/') ? `${SITE}${url}` : url
}

/** Title, description and share image when the owner hasn't set their own */
export function siteSeoDefaults(page: SeoSource, username: string) {
  const title = page.title?.trim() || username
  const description = page.bio?.trim() || `${title} · perlink.to/${username}`
  const image = page.themeConfig?.header?.bannerUrl || page.avatarUrl || '/images/og.jpg'
  return { title, description, image }
}

/** Final values for the page head; `domain` is the site's own domain, if it has one */
export function siteSeo(page: SeoSource, username: string, domain?: string) {
  const defaults = siteSeoDefaults(page, username)
  const seo = page.themeConfig?.seo ?? {}
  return {
    // The owner's own SEO title as it is; otherwise the name, signed
    // "· Perlink" (not on their own domain, nor on plans without the badge)
    title: seo.title?.trim() || (domain || page.showBranding === false ? defaults.title : `${defaults.title} · Perlink`),
    description: (seo.description?.trim() || defaults.description).slice(0, 300),
    image: absolute(seo.imageUrl || defaults.image),
    url: domain ? `https://${domain}/` : `${SITE}/${username}`,
  }
}

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * schema.org LocalBusiness for pages with a contact or hours block, so search
 * engines can show the address, phone and opening hours. Null otherwise.
 */
export function localBusinessJsonLd(page: SeoSource, username: string, domain?: string) {
  const blocks = (page.blocks ?? []).filter(b => !b.hidden)
  const contact = blocks.find(b => b.name === 'contact')
  const hours = blocks.find(b => b.name === 'hours')
  if (!contact && !hours) return null
  const seo = siteSeo(page, username, domain)
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: page.title?.trim() || username,
    url: seo.url,
    image: seo.image,
  }
  if (page.bio) data.description = page.bio
  if (contact?.name === 'contact') {
    if (contact.data.address) data.address = contact.data.address
    if (contact.data.phone) data.telephone = contact.data.phone
    if (contact.data.email) data.email = contact.data.email
    if (contact.data.mapUrl) data.hasMap = contact.data.mapUrl
  }
  if (hours?.name === 'hours') {
    data.openingHoursSpecification = (hours.data.days ?? [])
      .filter(d => !d.closed)
      .map(d => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: SCHEMA_DAYS[d.day], opens: d.open, closes: d.close }))
  }
  return data
}
