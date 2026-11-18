import type { H3Event } from 'h3'
import { getDB } from './db'
import { sendEmail } from './email'
import { renderTemplate } from './emailTemplates'
import { SUPERADMIN_EMAIL } from './superadmin'
import type { AppLanguage } from '#shared/language'

// One-time reminder emails, run by middleware/jobs about once an hour.
//
// nudge:no_site: people who signed up 1 to 7 days ago with an email address
// and no site yet get the "No site yet" template (Superadmin → Email
// templates) once. Each send is kept in mail_messages with that kind, which is
// also how we know it went out. At most 20 per run.

const BATCH = 20

interface Person { id: string; email: string; name: string | null; language: string | null; country: string | null }

const languageOf = (p: Person): AppLanguage => (p.language === 'vi' || (!p.language && p.country === 'VN') ? 'vi' : 'en')

function firstName(name: string | null, lang: AppLanguage) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  return (lang === 'vi' ? parts.at(-1) : parts[0]) || (lang === 'vi' ? 'bạn' : 'there')
}

export async function runNudges(event: H3Event) {
  const db = getDB(event)
  const { results } = await db.prepare(`
    SELECT p.id, p.email, p.name, p.language, p.country
    FROM profiles p
    WHERE p.email IS NOT NULL AND p.email != '' AND lower(p.email) != lower(?)
      AND COALESCE(p.status, 'active') = 'active'
      AND p.created_at <= datetime('now', '-1 day') AND p.created_at >= datetime('now', '-7 days')
      AND NOT EXISTS (SELECT 1 FROM bio_pages b WHERE b.user_id = p.id)
      AND NOT EXISTS (SELECT 1 FROM mail_messages m WHERE m.kind = 'nudge:no_site' AND (m.user_id = p.id OR lower(m.to_email) = lower(p.email)))
    ORDER BY p.created_at
    LIMIT ?
  `).bind(SUPERADMIN_EMAIL, BATCH).all<Person>()

  let sent = 0
  for (const person of results ?? []) {
    const lang = languageOf(person)
    const { subject, html, text } = await renderTemplate(event, 'nudge_no_site', lang, {
      vars: { name: firstName(person.name, lang) },
      buttonUrl: 'https://perlink.to/dashboard/new?utm_source=email&utm_medium=nudge&utm_campaign=no_site',
    })
    const ok = await sendEmail(event, {
      from: 'Perlink <support@perlink.to>',
      replyTo: 'support@perlink.to',
      to: person.email,
      subject,
      html,
      text,
      kind: 'nudge:no_site',
    })
    if (ok) sent++
  }
  if (results?.length) console.log(`[nudges] no_site: ${sent}/${results.length} sent`)
  return { candidates: results?.length ?? 0, sent }
}
