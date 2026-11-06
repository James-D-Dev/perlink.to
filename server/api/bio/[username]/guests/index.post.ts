import { z } from 'zod'
import { getDB } from '../../../../utils/db'
import { requireOwnedSite } from '../../../../utils/ownedSite'
import { MAX_GUESTS, cleanGuestName, guestKey } from '../../../../utils/guests'

const bodySchema = z.object({
  /** One name per line (or a list) */
  names: z.union([z.string().max(100_000), z.array(z.string().max(200)).max(MAX_GUESTS)]),
  side: z.enum(['groom', 'bride']).nullable().optional(),
})

// Adds guests to the list, one link each. A name already there keeps its
// row (and its opens); only its side changes, if one was given
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Add at least one name' })
  const raw = Array.isArray(body.data.names) ? body.data.names : body.data.names.split(/\r?\n|;/)
  const names = new Map<string, string>()
  for (const value of raw) {
    const name = cleanGuestName(value.replace(/^[\s\-*•\d.)]+/, ''))
    if (name) names.set(guestKey(name), name)
  }
  if (!names.size) throw createError({ statusCode: 400, statusMessage: 'Add at least one name' })

  const db = getDB(event)
  const count = await db.prepare('SELECT COUNT(*) AS n FROM site_guests WHERE bio_page_id = ?').bind(site.id).first<{ n: number }>()
  if ((count?.n ?? 0) + names.size > MAX_GUESTS) {
    throw createError({ statusCode: 400, statusMessage: `A site can have up to ${MAX_GUESTS} guests` })
  }
  const side = body.data.side ?? null
  const statements = [...names].map(([key, name]) => db
    .prepare(`INSERT INTO site_guests (id, bio_page_id, name, name_key, side, listed) VALUES (?, ?, ?, ?, ?, 1)
      ON CONFLICT(bio_page_id, name_key) DO UPDATE SET listed = 1, side = COALESCE(excluded.side, site_guests.side)`)
    .bind(crypto.randomUUID(), site.id, name, key, side))
  for (let i = 0; i < statements.length; i += 50) await db.batch(statements.slice(i, i + 50))
  return { added: names.size }
})
