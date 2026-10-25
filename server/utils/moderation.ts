import type { H3Event } from 'h3'
import { getDB } from './db'

/** A site an admin took down can't be published again by its owner */
export async function requireNotRemoved(event: H3Event, bioPageId: string) {
  const row = await getDB(event).prepare('SELECT removed_at FROM bio_pages WHERE id = ?').bind(bioPageId).first<{ removed_at: string | null }>()
  if (row?.removed_at) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This site was taken down for breaking the Terms of Service. Contact support if you think this is a mistake.',
      data: { code: 'SITE_REMOVED' },
    })
  }
}
