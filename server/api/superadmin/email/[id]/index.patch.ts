import { getDB } from '../../../../utils/db'
import { requireSuperadmin } from '../../../../utils/superadmin'

// Mark a received email read or unread
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ read?: boolean }>(event)
  await getDB(event)
    .prepare(`UPDATE mail_messages SET read_at = ${body?.read === false ? 'NULL' : `coalesce(read_at, datetime('now'))`} WHERE id = ? AND direction = 'in'`)
    .bind(id)
    .run()
  return { ok: true }
})
