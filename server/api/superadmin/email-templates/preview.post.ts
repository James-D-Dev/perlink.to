import { requireSuperadmin } from '../../../utils/superadmin'
import { getLayout, renderTemplate, templateDef } from '../../../utils/emailTemplates'
import { previewSchema } from '../../../utils/emailTemplateSchema'

// The editor's live preview: a template with the words being edited (not
// saved yet) and sample values
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const parsed = previewSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Bad preview' })
  const { id, lang, words, layout } = parsed.data
  const def = templateDef(id)
  if (!def) throw createError({ statusCode: 404, statusMessage: 'Unknown template' })
  return renderTemplate(event, id, lang, {
    vars: def.variables,
    buttonUrl: def.sampleUrl,
    rows: def.sampleRows,
    words,
    layout: layout ?? await getLayout(event),
  })
})
