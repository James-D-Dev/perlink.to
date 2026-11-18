import { APP_LANGUAGES } from '#shared/language'
import { requireSuperadmin } from '../../../utils/superadmin'
import { saveTemplateOverrides, templateDef } from '../../../utils/emailTemplates'
import { wordsByLanguage } from '../../../utils/emailTemplateSchema'
import type { AppLanguage } from '#shared/language'

// Save a template's words (only what differs from the default is kept);
// { reset: true } goes back to the default
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const def = templateDef(getRouterParam(event, 'id') ?? '')
  if (!def) throw createError({ statusCode: 404, statusMessage: 'Unknown template' })
  const body = await readBody(event)
  if (body?.reset) {
    await saveTemplateOverrides(event, def.id, null)
    return { ok: true, saved: {} }
  }
  const parsed = wordsByLanguage.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Check the fields' })
  const saved: Partial<Record<AppLanguage, Record<string, string>>> = {}
  for (const lang of APP_LANGUAGES) {
    const words = parsed.data[lang]
    if (!words) continue
    const changed = Object.fromEntries(Object.entries(words).filter(([key, value]) => value !== undefined && value !== def.defaults[lang][key as keyof typeof def.defaults.en]))
    if (Object.keys(changed).length) saved[lang] = changed as Record<string, string>
  }
  await saveTemplateOverrides(event, def.id, Object.keys(saved).length ? saved : null)
  return { ok: true, saved }
})
