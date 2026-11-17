import { requireSuperadmin } from '../../../utils/superadmin'
import { DEFAULT_LAYOUT, EMAIL_TEMPLATES, getLayout, getTemplateOverrides } from '../../../utils/emailTemplates'

// Superadmin → Email templates: every template with its default and saved
// words, and the layout
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const templates = await Promise.all(EMAIL_TEMPLATES.map(async t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    audience: t.audience,
    variables: t.variables,
    defaults: t.defaults,
    saved: (await getTemplateOverrides(event, t.id)) ?? {},
  })))
  return { templates, layout: await getLayout(event), defaultLayout: DEFAULT_LAYOUT }
})
