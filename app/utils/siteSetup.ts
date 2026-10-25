import type { BioBlock } from '~/types/bio'

export type SetupStepKey = 'photo' | 'bio' | 'contact' | 'publish' | 'share'

interface SetupSource {
  avatarUrl?: string | null
  bio?: string | null
  blocks?: BioBlock[] | null
}

// Something visitors can act on: a link, a social icon, contact details or a form
function hasWayToReach(blocks: BioBlock[]) {
  return blocks.some((b) => {
    if (b.hidden) return false
    if (b.name === 'links') return !!b.data?.items?.some(i => i.url)
    if (b.name === 'social') return !!b.data?.links?.some(l => l.url?.trim())
    if (b.name === 'contact') return !!(b.data?.phone || b.data?.email || b.data?.address || b.data?.bookingUrl)
    return b.name === 'form'
  })
}

/** First steps to a live site, ticked off from the site's own content */
export function siteSetupSteps(site: SetupSource, published: boolean, shared: boolean): { key: SetupStepKey; done: boolean }[] {
  return [
    { key: 'photo', done: !!site.avatarUrl },
    { key: 'bio', done: !!site.bio?.trim() },
    { key: 'contact', done: hasWayToReach(site.blocks ?? []) },
    { key: 'publish', done: published },
    { key: 'share', done: shared },
  ]
}

/** Per-site checklist memory: hidden by the owner, link already shared */
export function readSetupMemory(username: string): { dismissed: boolean; shared: boolean } {
  try {
    const saved = JSON.parse(localStorage.getItem(`perlink:onboarding:${username}`) || '{}')
    return { dismissed: !!saved.dismissed, shared: !!saved.shared }
  } catch {
    return { dismissed: false, shared: false }
  }
}

export function writeSetupMemory(username: string, memory: { dismissed: boolean; shared: boolean }) {
  try {
    localStorage.setItem(`perlink:onboarding:${username}`, JSON.stringify(memory))
  } catch {}
}
