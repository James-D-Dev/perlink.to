import { PAGE_TEMPLATES } from '../../app/data/pageTemplates'
import { localizeTemplateContent } from '../../app/data/templateCopyVi'

// Which published sites search engines should index. Every real site is a
// page that can rank on its own, and many of them grow the site as a whole;
// but a site still showing a template's sample name and words, or with next
// to nothing on it, is a thin page that weighs the whole domain down. Those
// stay reachable by link, with noindex and out of the sitemap, until the
// owner makes them their own.

const norm = (value: string | null | undefined) => (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')

let samples: { titles: Set<string>; bios: Set<string> } | null = null
/** Every template's sample name and bio, in English and as translated */
function sampleText() {
  if (samples) return samples
  const titles = new Set<string>(['your name', 'tên của bạn'])
  const bios = new Set<string>()
  for (const template of PAGE_TEMPLATES) {
    try {
      const content = template.build()
      for (const version of [content, localizeTemplateContent(content, 'vi')]) {
        titles.add(norm(version.title))
        if (version.bio) bios.add(norm(version.bio))
      }
    } catch {
      // A template that can't be built has no sample text to compare with
    }
  }
  samples = { titles, bios }
  return samples
}

export interface IndexableSource {
  username: string
  title?: string | null
  bio?: string | null
  /** Blocks on the page (visible ones, when known) */
  blockCount: number
}

/** Whether a published, open site is worth indexing */
export function siteIndexable(site: IndexableSource) {
  const title = norm(site.title)
  const bio = norm(site.bio)
  // Next to nothing on the page
  if (site.blockCount < 2 && bio.length < 60) return false
  // Still the template's sample: its name and its bio (or none)
  const { titles, bios } = sampleText()
  if (titles.has(title) && (!bio || bios.has(bio))) return false
  // No name of its own and hardly anything else
  if ((!title || title === norm(site.username)) && site.blockCount < 3 && bio.length < 30) return false
  return true
}
