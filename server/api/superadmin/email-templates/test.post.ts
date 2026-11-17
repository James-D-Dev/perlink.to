import { requireSuperadmin, SUPERADMIN_EMAIL } from '../../../utils/superadmin'
import { lastEmailError, sendEmail } from '../../../utils/email'
import { getLayout, renderTemplate, templateDef } from '../../../utils/emailTemplates'
import { previewSchema } from '../../../utils/emailTemplateSchema'

// Send the template being edited, with sample values, to the superadmin
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const parsed = previewSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Bad request' })
  const { id, lang, words, layout } = parsed.data
  const def = templateDef(id)
  if (!def) throw createError({ statusCode: 404, statusMessage: 'Unknown template' })
  const email = await renderTemplate(event, id, lang, {
    vars: def.variables,
    buttonUrl: def.sampleUrl,
    rows: def.sampleRows,
    words,
    layout: layout ?? await getLayout(event),
  })
  const ok = await sendEmail(event, { from: 'Perlink <support@perlink.to>', to: SUPERADMIN_EMAIL, subject: `[Test] ${email.subject}`, html: email.html, text: email.text })
  if (!ok) throw createError({ statusCode: 502, statusMessage: lastEmailError || 'Not sent' })
  return { ok: true, to: SUPERADMIN_EMAIL }
})
