import { z } from 'zod'
import { getDB } from '../../utils/db'

// Update the display name
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = z.object({ name: z.string().trim().max(80) }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid name' })
  await getDB(event)
    .prepare(`UPDATE profiles SET name = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(body.data.name || null, user.id)
    .run()
  return { success: true }
})
