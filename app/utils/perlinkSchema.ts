import { PAID_PLANS, PLAN_PRICES_USD } from '#shared/plans'
import { SUPPORT_EMAIL } from './legal'
import { SOCIAL_PROFILES } from './social'

// schema.org nodes for Perlink itself, shared by our own pages (home,
// pricing, about…) so every page describes the same organization and app,
// linked by @id instead of repeating them

export const PERLINK_URL = 'https://perlink.to'
export const PERLINK_ORG_ID = `${PERLINK_URL}/#organization`
export const PERLINK_APP_ID = `${PERLINK_URL}/#app`
export const PERLINK_WEBSITE_ID = `${PERLINK_URL}/#website`

const PLAN_NAMES = { starter: 'Starter', plus: 'Plus', max: 'Max' } as const

export const perlinkOrganization = (description?: string) => ({
  '@type': 'Organization',
  '@id': PERLINK_ORG_ID,
  name: 'Perlink',
  url: PERLINK_URL,
  logo: { '@type': 'ImageObject', url: `${PERLINK_URL}/web-app-manifest-512x512.png`, width: 512, height: 512 },
  ...(description ? { description } : {}),
  email: SUPPORT_EMAIL,
  foundingDate: '2026',
  founder: { '@type': 'Person', name: 'Hoang Kim Duc' },
  areaServed: 'Worldwide',
  sameAs: SOCIAL_PROFILES,
})

export const perlinkWebsite = () => ({
  '@type': 'WebSite',
  '@id': PERLINK_WEBSITE_ID,
  name: 'Perlink',
  url: PERLINK_URL,
  inLanguage: ['en', 'vi'],
  publisher: { '@id': PERLINK_ORG_ID },
})

/** The app with every plan as an offer, in US dollars a month */
export const perlinkApp = (description: string) => ({
  '@type': 'SoftwareApplication',
  '@id': PERLINK_APP_ID,
  name: 'Perlink',
  url: PERLINK_URL,
  applicationCategory: 'WebApplication',
  operatingSystem: 'Any',
  description,
  publisher: { '@id': PERLINK_ORG_ID },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: 0,
    highPrice: PLAN_PRICES_USD.max.monthly,
    offerCount: PAID_PLANS.length + 1,
    offers: [
      { '@type': 'Offer', name: 'Free', price: 0, priceCurrency: 'USD', url: `${PERLINK_URL}/pricing` },
      ...PAID_PLANS.map(plan => ({
        '@type': 'Offer',
        name: PLAN_NAMES[plan],
        price: PLAN_PRICES_USD[plan].monthly,
        priceCurrency: 'USD',
        url: `${PERLINK_URL}/pricing`,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: PLAN_PRICES_USD[plan].monthly, priceCurrency: 'USD', unitCode: 'MON' },
      })),
    ],
  },
})

/** Home › … › this page */
export const breadcrumbs = (items: { name: string; url: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
})

/** A JSON-LD script tag's content, safe inside <script> */
export const jsonLd = (graph: object[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
