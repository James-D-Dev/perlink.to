import { z } from 'zod'
import { getDB } from '../utils/db'
import { escapeHtml, runInBackground, sendEmail } from '../utils/email'
import { hashIP } from '../services/analytics'
import { SUPERADMIN_EMAIL } from '../utils/superadmin'
import { REPORT_REASONS } from '#shared/reports'

const bodySchema = z.object({
  username: z.string().min(1).max(64),
  reason: z.enum(REPORT_REASONS),
  details: z.string().max(2000).optional(),
  email: z.string().email().max(200).optional().or(z.literal('')),
})

/** Reports one visitor can send in a day */
const DAILY_LIMIT = 5

// A visitor reports a site that breaks the rules
export default defineEventHandler(async (event) => {
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a reason' })
  const { username, reason, details, email } = body.data

  const db = getDB(event)
  const site = await db.prepare('SELECT id, username FROM bio_pages WHERE username = ?').bind(username.toLowerCase()).first<{ id: string; username: string }>()
  if (!site) throw createError({ statusCode: 404, statusMessage: 'Site not found' })

  const ip = getRequestHeader(event, 'cf-connecting-ip') || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
  const today = new Date().toISOString().slice(0, 10)
  const reporterHash = await hashIP(ip, today)
  const sent = await db
    .prepare(`SELECT COUNT(*) AS n FROM reports WHERE reporter_hash = ? AND created_at > datetime('now', '-1 day')`)
    .bind(reporterHash)
    .first<{ n: number }>()
  if ((sent?.n ?? 0) >= DAILY_LIMIT) throw createError({ statusCode: 429, statusMessage: 'Too many reports today' })

  await db
    .prepare('INSERT INTO reports (id, bio_page_id, username, reason, details, reporter_email, reporter_hash) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), site.id, site.username, reason, details?.trim() || null, email || null, reporterHash)
    .run()

  // Let the admin know (skipped while email isn't set up)
  const siteUrl = `https://perlink.to/${site.username}`
  runInBackground(event, sendEmail(event, {
    to: SUPERADMIN_EMAIL,
    subject: `Report: perlink.to/${site.username} (${reason})`,
    text: `${siteUrl}\nReason: ${reason}\n${details ?? ''}\nReview: https://perlink.to/superadmin/reports`,
    html: `<p><a href="${siteUrl}">${siteUrl}</a></p><p>Reason: <b>${reason}</b></p><p>${escapeHtml(details ?? '')}</p><p><a href="https://perlink.to/superadmin/reports">Review reports</a></p>`,
    replyTo: email || undefined,
  }))

  return { success: true }
})
