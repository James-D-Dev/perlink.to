import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { getAccessHash } from '../../../../../utils/siteAccess'

// Whether the site has a password (never the password itself)
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  return { hasPassword: !!(await getAccessHash(event, site.id)) }
})
