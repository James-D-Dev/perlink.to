import { z } from 'zod'
import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { requirePlanFeature } from '../../../../../utils/plan'
import { ORDER_STATUSES, adjustStock, parseOrderMeta } from '../../../../../utils/orders'

// Mark a request as read or unread, or move an order along (paid plans).
// Cancelling an order puts its stock back; reopening it takes it again.
export default defineEventHandler(async (event) => {
  const bioPage = await requireOwnedSite(event)
  const id = getRouterParam(event, 'id')
  const body = z.object({ read: z.boolean().optional(), status: z.enum(ORDER_STATUSES).optional() }).safeParse(await readBody(event))
  if (!id || !body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  const db = getDB(event)

  if (body.data.read !== undefined) {
    await db
      .prepare(`UPDATE form_submissions SET read_at = CASE WHEN ? THEN datetime('now') ELSE NULL END WHERE id = ? AND bio_page_id = ?`)
      .bind(body.data.read ? 1 : 0, id, bioPage.id)
      .run()
  }

  const status = body.data.status
  if (status) {
    await requirePlanFeature(event, bioPage.userId, 'orders')
    const row = await db
      .prepare('SELECT block_id, status, meta FROM form_submissions WHERE id = ? AND bio_page_id = ?')
      .bind(id, bioPage.id)
      .first<{ block_id: string | null; status: string | null; meta: string | null }>()
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Order not found' })
    const before = row.status || 'new'
    const meta = parseOrderMeta(row.meta)
    if (meta && row.block_id && before !== status && (before === 'cancelled' || status === 'cancelled')) {
      // Back into stock what this order took, or take it again when reopened
      if (status === 'cancelled' && meta.took) {
        await adjustStock(event, bioPage.id, row.block_id, meta.productId, meta.took)
        meta.took = 0
      } else if (before === 'cancelled') {
        meta.took = -(await adjustStock(event, bioPage.id, row.block_id, meta.productId, -meta.quantity))
      }
    }
    await db
      .prepare(`UPDATE form_submissions SET status = ?, meta = ?, read_at = COALESCE(read_at, datetime('now')) WHERE id = ? AND bio_page_id = ?`)
      .bind(status, meta ? JSON.stringify(meta) : row.meta, id, bioPage.id)
      .run()
  }
  return { success: true }
})
