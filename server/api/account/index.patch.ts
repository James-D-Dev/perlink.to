import { z } from 'zod'
import { getDB } from '../../utils/db'
import { APP_LANGUAGES, LANGUAGE_COOKIE } from '#shared/language'

// Update the display name and/or the language Perlink uses with this account
// (dashboard, Telegram, email)
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = z.object({
    name: z.string().trim().max(80).optional(),
    language: z.enum(APP_LANGUAGES).optional(),
  }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid details' })
  const db = getDB(event)
  if (body.data.name !== undefined) {
    await db.prepare(`UPDATE profiles SET name = ?, updated_at = datetime('now') WHERE id = ?`).bind(body.data.name || null, user.id).run()
  }
  if (body.data.language) {
    await db.prepare(`UPDATE profiles SET language = ?, updated_at = datetime('now') WHERE id = ?`).bind(body.data.language, user.id).run()
    setCookie(event, LANGUAGE_COOKIE, body.data.language, { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/' })
  }
  return { success: true }
})
