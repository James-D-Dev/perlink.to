import { z } from 'zod'
import { getDB } from '../../utils/db'

// Permanently delete the signed-in account: profile, sites (with their form
// requests), short links, feedback, analytics and uploaded images.
// The user must type their email address to confirm (DELETE for accounts
// without one, e.g. signed in with TikTok). A POST, not DELETE /api/account:
// on Cloudflare a DELETE request with a body crashes the worker (error 1101).
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = z.object({ confirm: z.string() }).safeParse(await readBody(event))
  const db = getDB(event)
  const profile = await db.prepare('SELECT email FROM profiles WHERE id = ?').bind(user.id).first<{ email: string | null }>()
  if (!profile) throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  if (!body.success || body.data.confirm.trim().toLowerCase() !== (profile.email || 'DELETE').toLowerCase()) {
    throw createError({ statusCode: 400, statusMessage: 'Type your email address to confirm' })
  }

  // Analytics rows point at sites and links without a foreign key
  const ids = [
    ...((await db.prepare('SELECT id FROM bio_pages WHERE user_id = ?').bind(user.id).all<{ id: string }>()).results ?? []),
    ...((await db.prepare('SELECT id FROM links WHERE user_id = ?').bind(user.id).all<{ id: string }>()).results ?? []),
  ].map(row => row.id)
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50)
    try {
      await db.prepare(`DELETE FROM click_events WHERE link_id IN (${chunk.map(() => '?').join(',')})`).bind(...chunk).run()
    } catch (error) {
      console.error('[POST /api/account/delete] click_events', error)
    }
  }

  // Sites, form requests, links, QR codes and feedback go with the profile (ON DELETE CASCADE)
  await db.prepare('DELETE FROM profiles WHERE id = ?').bind(user.id).run()
  await db.prepare('DELETE FROM auth_accounts WHERE user_id = ?').bind(user.id).run()

  // Uploaded images (best effort; the account is already gone)
  const bucket = event.context.cloudflare?.env?.AVATARS_BUCKET as R2Bucket | undefined
  if (bucket) {
    for (const prefix of [`${user.id}/`, `rooms/${user.id}/`]) {
      try {
        let cursor: string | undefined
        do {
          const listed = await bucket.list({ prefix, cursor })
          if (listed.objects.length) await bucket.delete(listed.objects.map(o => o.key))
          cursor = listed.truncated ? listed.cursor : undefined
        } while (cursor)
      } catch (error) {
        console.error('[POST /api/account/delete] images', error)
      }
    }
  }

  await clearUserSession(event)
  return { success: true }
})
