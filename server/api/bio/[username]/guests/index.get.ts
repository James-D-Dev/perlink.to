import { getDB } from '../../../../utils/db'
import { requireOwnedSite } from '../../../../utils/ownedSite'
import { getAccountPlan } from '../../../../utils/plan'
import { guestKey } from '../../../../utils/guests'
import { PLAN_LIMITS, minPlanFor } from '#shared/plans'

interface GuestRow {
  id: string
  name: string
  name_key: string
  side: string | null
  listed: number
  opens: number
  first_open_at: string | null
  last_open_at: string | null
  letter_opened_at: string | null
  created_at: string
}

// The owner's guest list: each guest's link, whether they opened it (plans
// with guest tracking; others see how many did, not who) and their RSVP
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const { plan } = await getAccountPlan(event, site.userId)
  const tracking = PLAN_LIMITS[plan].guestTracking
  const db = getDB(event)
  const rows = await db.prepare(`SELECT id, name, name_key, side, listed, opens, first_open_at, last_open_at, letter_opened_at, created_at
      FROM site_guests WHERE bio_page_id = ? ORDER BY listed DESC, created_at ASC LIMIT 2000`)
    .bind(site.id)
    .all<GuestRow>()
    .then(r => r.results ?? [])
    .catch(() => [] as GuestRow[])

  // RSVP replies, matched to guests by name
  const replies = new Map<string, { attending: string | null; guests: string | null }>()
  const forms = await db.prepare(`SELECT data FROM form_submissions WHERE bio_page_id = ? ORDER BY created_at ASC LIMIT 3000`)
    .bind(site.id)
    .all<{ data: string }>()
    .then(r => r.results ?? [])
    .catch(() => [] as { data: string }[])
  for (const form of forms) {
    try {
      const data = JSON.parse(form.data) as Record<string, string>
      if (data.kind !== 'rsvp' || !data.name) continue
      replies.set(guestKey(data.name), { attending: data.attending ?? null, guests: data.guests ?? null })
    } catch {
      // Not JSON: not an RSVP
    }
  }

  const opened = rows.filter(r => r.first_open_at).length
  return {
    tracking,
    /** The cheapest plan that shows who opened (for the upgrade prompt) */
    trackingPlan: minPlanFor('guestTracking'),
    stats: {
      guests: rows.length,
      opened,
      notOpened: rows.length - opened,
      replied: rows.filter(r => replies.has(r.name_key)).length,
    },
    guests: rows.map(r => ({
      id: r.id,
      name: r.name,
      side: r.side,
      listed: !!r.listed,
      ...(tracking
        ? { opens: r.opens, firstOpenAt: r.first_open_at, lastOpenAt: r.last_open_at, letterOpenedAt: r.letter_opened_at }
        : { opens: null, firstOpenAt: null, lastOpenAt: null, letterOpenedAt: null }),
      rsvp: replies.get(r.name_key) ?? null,
    })),
  }
})
