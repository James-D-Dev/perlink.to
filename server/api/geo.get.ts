import { CONSENT_COUNTRIES } from '#shared/analytics'

// The visitor's country (from Cloudflare), so the page knows whether to ask
// before using analytics cookies
export default defineEventHandler((event) => {
  setHeader(event, 'cache-control', 'private, no-store')
  const country = (getHeader(event, 'cf-ipcountry') || '').toUpperCase()
  return { country: country || null, consentRequired: !country || country === 'XX' || CONSENT_COUNTRIES.has(country) }
})
