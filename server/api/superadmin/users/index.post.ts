import { z } from 'zod'
import { getDB } from "../../../utils/db"
import { requireSuperadmin } from "../../../utils/superadmin"

const PLANS = ['free', 'starter', 'plus', 'pro'] as const

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().max(100).optional(),
  username: z.string().trim().regex(/^[a-zA-Z0-9_]{3,20}$/).optional(),
  plan: z.enum(PLANS).default('free'),
})

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Invalid input' })
  }
  const { email, name, plan } = parsed.data
  const username = parsed.data.username || email.split('@')[0]!.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20)

  const db = getDB(event)

  try {
    const existingEmail = await db.prepare(`SELECT id FROM profiles WHERE email = ?`).bind(email).first()
    if (existingEmail) throw createError({ statusCode: 409, statusMessage: 'Email already registered' })

    const existingUsername = await db.prepare(`SELECT id FROM profiles WHERE username = ?`).bind(username).first()
    if (existingUsername) throw createError({ statusCode: 409, statusMessage: 'Username already taken' })

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // User signs in with Google using this email; login matches profiles by email
    await db.prepare(`
      INSERT INTO profiles (id, email, username, name, plan, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
    `).bind(id, email, username, name || null, plan, now, now).run()

    return { success: true, id }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to create user: ${error.message}` })
  }
})
