import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { cfDeleteHostname, customDomainsEnabled } from '../../../../../utils/customDomains'

// Disconnect the site's domain
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const db = getDB(event)
  const row = await db.prepare('SELECT id, cf_hostname_id FROM custom_domains WHERE bio_page_id = ?').bind(site.id).first<{ id: string; cf_hostname_id: string | null }>()
  if (!row) return { success: true }
  if (row.cf_hostname_id && customDomainsEnabled(event)) await cfDeleteHostname(event, row.cf_hostname_id)
  await db.prepare('DELETE FROM custom_domains WHERE id = ?').bind(row.id).run()
  return { success: true }
})
