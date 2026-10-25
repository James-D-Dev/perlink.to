import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { localizeTemplateContent } from '~/data/templateCopyVi'

const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'

function randomSuffix(length = 5) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('')
}

async function isFree(username: string) {
  try {
    const res = await $fetch<{ success: boolean }>('/api/check_bio_username_exists', { method: 'POST', body: { username } })
    return res.success
  } catch {
    return false
  }
}

/** A free temporary address like "spa-k3x9q", named after the template */
async function temporaryAddress(base: string) {
  const prefix = base.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'site'
  for (let i = 0; i < 5; i++) {
    const candidate = `${prefix}-${randomSuffix()}`
    if (await isFree(candidate)) return candidate
  }
  throw new Error('No free address')
}

/**
 * Creates a site and fills it from a template. Without an address, the site
 * gets a temporary one (marked in its theme) that the editor asks to change
 * before publishing.
 */
export function useCreateSite() {
  const { locale } = useI18n()

  async function createSite(options: { username?: string; templateId?: string }) {
    const template = options.templateId ? PAGE_TEMPLATES.find(t => t.id === options.templateId) : undefined
    const username = options.username || await temporaryAddress(template?.id ?? 'site')
    const tempAddress = !options.username

    await $fetch('/api/bio', { method: 'POST', body: { username } })

    if (template) {
      // Vietnamese users get Vietnamese sample content and site language
      const content = localizeTemplateContent(template.build(), locale.value)
      await $fetch(`/api/admin/bio/${username}`, {
        method: 'PUT' as const,
        body: {
          title: content.title,
          bio: content.bio,
          avatarUrl: content.avatarUrl,
          blocks: content.blocks,
          themeConfig: { ...content.themeConfig, pageMode: '2d', room: content.room, ...(tempAddress ? { tempAddress: true } : {}) },
        },
      })
    } else if (tempAddress) {
      await $fetch(`/api/admin/bio/${username}`, { method: 'PUT' as const, body: { themeConfig: { tempAddress: true } } })
    }

    return username
  }

  return { createSite }
}
