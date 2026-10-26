import { z } from 'zod'
import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { requirePlanFeature } from '../../../../../utils/plan'
import { PLAN_LIMITS } from '#shared/plans'
import { cfCreateHostname, customDomainsEnabled, domainRecords, domainStatus, normalizeHostname } from '../../../../../utils/customDomains'

// Connect a domain to the site (one per site)
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const plan = await requirePlanFeature(event, site.userId, 'customDomain')
  if (!customDomainsEnabled(event)) {
    throw createError({ statusCode: 503, statusMessage: 'Custom domains are not available yet' })
  }
  const body = z.object({ hostname: z.string() }).safeParse(await readBody(event))
  const hostname = body.success ? normalizeHostname(body.data.hostname) : null
  if (!hostname) throw createError({ statusCode: 400, statusMessage: 'Enter a domain like www.myshop.com' })

  const db = getDB(event)
  const existing = await db.prepare('SELECT bio_page_id FROM custom_domains WHERE hostname = ?').bind(hostname).first<{ bio_page_id: string }>()
  if (existing && existing.bio_page_id !== site.id) {
    throw createError({ statusCode: 409, statusMessage: 'This domain is already connected to another site' })
  }
  const current = await db.prepare('SELECT id FROM custom_domains WHERE bio_page_id = ?').bind(site.id).first()
  if (current) throw createError({ statusCode: 409, statusMessage: 'Remove the current domain first' })
  // Each plan connects a set number of domains across all the account's sites
  const limit = PLAN_LIMITS[plan].domains
  const connected = await db
    .prepare('SELECT COUNT(*) AS n FROM custom_domains d JOIN bio_pages b ON b.id = d.bio_page_id WHERE b.user_id = ?')
    .bind(site.userId)
    .first<{ n: number }>()
  if ((connected?.n ?? 0) >= limit) {
    throw createError({ statusCode: 403, statusMessage: `Your plan connects up to ${limit} domains. Remove one from another site first.`, data: { code: 'DOMAIN_LIMIT', limit } })
  }

  const cfHostname = await cfCreateHostname(event, hostname)
  const records = domainRecords(event, hostname, cfHostname)
  const status = domainStatus(cfHostname)
  await db.prepare('INSERT INTO custom_domains (id, bio_page_id, hostname, cf_hostname_id, status, verification) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), site.id, hostname, cfHostname.id, status, JSON.stringify(records))
    .run()
  return { success: true, domain: { hostname, status, records } }
})
