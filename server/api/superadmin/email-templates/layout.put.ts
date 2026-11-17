import { requireSuperadmin } from '../../../utils/superadmin'
import { DEFAULT_LAYOUT, saveLayout } from '../../../utils/emailTemplates'
import { layoutSchema } from '../../../utils/emailTemplateSchema'

// The layout every email shares: accent colour and footer line; { reset: true } for the default
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const body = await readBody(event)
  if (body?.reset) {
    await saveLayout(event, null)
    return { ok: true, layout: DEFAULT_LAYOUT }
  }
  const parsed = layoutSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Use a colour like #0066d6 and a short footer' })
  await saveLayout(event, parsed.data)
  return { ok: true, layout: parsed.data }
})
