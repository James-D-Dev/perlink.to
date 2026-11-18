import { z } from 'zod'
import { APP_LANGUAGES } from '#shared/language'

const words = z.object({
  subject: z.string().max(300),
  heading: z.string().max(300),
  body: z.string().max(10000),
  button: z.string().max(100),
  note: z.string().max(1000),
}).partial()

export const wordsByLanguage = z.object(Object.fromEntries(APP_LANGUAGES.map(lang => [lang, words.optional()])) as Record<(typeof APP_LANGUAGES)[number], z.ZodOptional<typeof words>>)

export const layoutSchema = z.object({
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  // Older saved layouts only have English and Vietnamese
  footer: z.object(Object.fromEntries(APP_LANGUAGES.map(lang => [lang, lang === 'en' || lang === 'vi' ? z.string().max(300) : z.string().max(300).optional()])) as Record<(typeof APP_LANGUAGES)[number], z.ZodString>),
})

export const previewSchema = z.object({
  id: z.string(),
  lang: z.enum(APP_LANGUAGES),
  words: words.optional(),
  layout: layoutSchema.optional(),
})
