import { z } from 'zod'

const words = z.object({
  subject: z.string().max(300),
  heading: z.string().max(300),
  body: z.string().max(10000),
  button: z.string().max(100),
  note: z.string().max(1000),
}).partial()

export const wordsByLanguage = z.object({ en: words.optional(), vi: words.optional() })

export const layoutSchema = z.object({
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  footer: z.object({ en: z.string().max(300), vi: z.string().max(300) }),
})

export const previewSchema = z.object({
  id: z.string(),
  lang: z.enum(['en', 'vi']),
  words: words.optional(),
  layout: layoutSchema.optional(),
})
