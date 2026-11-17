import { getDB } from '../../../../utils/db'
import { requireSuperadmin } from '../../../../utils/superadmin'

// One email in full (opening a received one marks it read), with the rest of
// the conversation with that address
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const id = getRouterParam(event, 'id')
  const db = getDB(event)
  const row = await db.prepare('SELECT * FROM mail_messages WHERE id = ?').bind(id).first<Record<string, any>>()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Email not found' })
  if (row.direction === 'in' && !row.read_at) {
    await db.prepare(`UPDATE mail_messages SET read_at = datetime('now') WHERE id = ?`).bind(id).run()
  }
  const other = row.direction === 'in' ? row.from_email : row.to_email
  const thread = await db.prepare(`SELECT id, direction, kind, subject, status, created_at FROM mail_messages
      WHERE id != ? AND ((direction = 'in' AND lower(from_email) = lower(?)) OR (direction = 'out' AND lower(to_email) = lower(?)))
      ORDER BY created_at DESC LIMIT 30`)
    .bind(id, other, other)
    .all<Record<string, any>>()
  const attachments = (() => {
    try { return JSON.parse(row.attachments || '[]') as { filename: string; mimeType?: string; size: number; inline?: boolean }[] } catch { return [] }
  })()
  return {
    email: {
      id: row.id,
      direction: row.direction,
      kind: row.kind,
      from: row.from_email,
      fromName: row.from_name,
      to: row.to_email,
      subject: row.subject,
      text: row.text,
      html: row.html,
      messageId: row.message_id,
      references: row.refs,
      userId: row.user_id,
      status: row.status,
      error: row.error,
      createdAt: row.created_at,
      attachments: attachments.map((a, index) => ({ index, filename: a.filename, mimeType: a.mimeType, size: a.size, inline: !!a.inline })),
    },
    thread: (thread.results ?? []).map(t => ({ id: t.id, direction: t.direction, kind: t.kind, subject: t.subject, status: t.status, createdAt: t.created_at })),
  }
})
