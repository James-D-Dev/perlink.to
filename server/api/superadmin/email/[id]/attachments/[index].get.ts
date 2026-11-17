import { getDB } from '../../../../../utils/db'
import { requireSuperadmin } from '../../../../../utils/superadmin'

// An attachment of a received email, from the private perlink-mail bucket.
// Always a download (never rendered on perlink.to), so a file sent by
// anyone can't run as a page here.
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const id = getRouterParam(event, 'id')
  const index = Number(getRouterParam(event, 'index'))
  const row = await getDB(event).prepare('SELECT attachments FROM mail_messages WHERE id = ?').bind(id).first<{ attachments: string | null }>()
  const list = (() => { try { return JSON.parse(row?.attachments || '[]') as { key: string; filename: string }[] } catch { return [] } })()
  const file = list[index]
  if (!file) throw createError({ statusCode: 404, statusMessage: 'Attachment not found' })
  const bucket = (event.context.cloudflare?.env as unknown as { MAIL_BUCKET?: R2Bucket } | undefined)?.MAIL_BUCKET
  if (!bucket) throw createError({ statusCode: 503, statusMessage: 'Mail storage not configured' })
  const object = await bucket.get(file.key)
  if (!object) throw createError({ statusCode: 404, statusMessage: 'Attachment not found' })
  setResponseHeaders(event, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'private, no-store',
  })
  return object.body
})
