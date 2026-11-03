import { z } from 'zod'
import { getDB } from '../../../../utils/db'
import { requireOwnedSite } from '../../../../utils/ownedSite'
import { cfDeleteHostname, customDomainsEnabled } from '../../../../utils/customDomains'

// Permanently delete one site: the page, its requests and orders, guestbook,
// blog posts, custom domain, analytics and uploaded images. The owner types
// the site's address to confirm. A POST, not DELETE: on Cloudflare a DELETE
// request with a body crashes the worker (see account/delete.post.ts).
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const body = z.object({ confirm: z.string() }).safeParse(await readBody(event))
  if (!body.success || body.data.confirm.trim().toLowerCase() !== site.username.toLowerCase()) {
    throw createError({ statusCode: 400, statusMessage: 'Type the site address to confirm' })
  }
  const db = getDB(event)

  // Its own domain is released at Cloudflare first, so it can be used again
  const domain = await db.prepare('SELECT cf_hostname_id FROM custom_domains WHERE bio_page_id = ?').bind(site.id).first<{ cf_hostname_id: string | null }>()
  if (domain?.cf_hostname_id && customDomainsEnabled(event)) {
    try {
      await cfDeleteHostname(event, domain.cf_hostname_id)
    } catch (error) {
      console.error('[POST delete site] domain', error)
    }
  }

  // Analytics rows point at the site without a foreign key
  try {
    await db.prepare('DELETE FROM click_events WHERE link_id = ?').bind(site.id).run()
  } catch (error) {
    console.error('[POST delete site] click_events', error)
  }

  // Requests, guestbook, posts, domain and reports go with it (ON DELETE CASCADE)
  await db.prepare('DELETE FROM bio_pages WHERE id = ?').bind(site.id).run()

  // Uploaded images (best effort; the site is already gone)
  const bucket = event.context.cloudflare?.env?.AVATARS_BUCKET as R2Bucket | undefined
  if (bucket) {
    try {
      let cursor: string | undefined
      do {
        const listed = await bucket.list({ prefix: `${site.userId}/${site.id}/`, cursor })
        if (listed.objects.length) await bucket.delete(listed.objects.map(o => o.key))
        cursor = listed.truncated ? listed.cursor : undefined
      } while (cursor)
    } catch (error) {
      console.error('[POST delete site] images', error)
    }
  }

  return { success: true }
})
