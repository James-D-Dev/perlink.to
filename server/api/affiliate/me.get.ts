import { getDB } from '../../utils/db'

// The signed-in account's affiliate code and how many sign-ups it brought
// (sales and payouts are in the Lemon Squeezy affiliate dashboard)
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  try {
    const me = await db.prepare('SELECT affiliate_code FROM profiles WHERE id = ?').bind(user.id).first<{ affiliate_code: string | null }>()
    const code = me?.affiliate_code ?? null
    const signups = code
      ? await db.prepare('SELECT COUNT(*) AS n FROM profiles WHERE lower(referred_by) = lower(?)').bind(code).first<{ n: number }>()
      : null
    return { code, signups: signups?.n ?? 0 }
  } catch {
    // Before migration 0038
    return { code: null, signups: 0 }
  }
})
