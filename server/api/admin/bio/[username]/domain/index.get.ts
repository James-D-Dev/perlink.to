import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { cfGetHostname, customDomainsEnabled, domainRecords, domainStatus } from '../../../../../utils/customDomains'

// The site's own domain, refreshing its status from Cloudflare while pending
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const enabled = customDomainsEnabled(event)
  const db = getDB(event)
  let row: { id: string; hostname: string; cf_hostname_id: string | null; status: string; verification: string | null } | null = null
  try {
    row = await db.prepare('SELECT id, hostname, cf_hostname_id, status, verification FROM custom_domains WHERE bio_page_id = ?').bind(site.id).first()
  } catch {
    return { success: true, enabled: false, domain: null }
  }
  if (!row) return { success: true, enabled, domain: null }

  let status = row.status
  let records = row.verification ? JSON.parse(row.verification) : domainRecords(event, row.hostname)
  if (enabled && row.cf_hostname_id && status !== 'active') {
    try {
      const cfHostname = await cfGetHostname(event, row.cf_hostname_id)
      status = domainStatus(cfHostname)
      records = domainRecords(event, row.hostname, cfHostname)
      await db.prepare(`UPDATE custom_domains SET status = ?, verification = ?, updated_at = datetime('now') WHERE id = ?`)
        .bind(status, JSON.stringify(records), row.id).run()
    } catch (error) {
      console.error('[domain] status refresh failed', error)
    }
  }
  return { success: true, enabled, domain: { hostname: row.hostname, status, records } }
})
