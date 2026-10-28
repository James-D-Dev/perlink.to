import type { Ref } from 'vue'

// What a site card can do (copy / share the link, QR, publish, unpublish),
// shared by the dashboard home and the sites list. `sites` is the list the
// cards come from, updated in place when a site is published or hidden.
export function useSiteActions(sites: Ref<any[]>) {
  const { t } = useI18n()
  const toast = useToast()

  const qrSite = ref<any | null>(null)
  const pendingSite = ref<string | null>(null)

  const copyUrl = async (username: string) => {
    try {
      const url = `https://perlink.to/${username}`
      await navigator.clipboard.writeText(url)
      toast.add({ title: t('dashboard.toast.copied'), description: url })
    } catch {
      toast.add({ title: t('dashboard.toast.copyFailed'), color: 'error' })
    }
  }

  const shareSite = async (site: any) => {
    const url = `https://perlink.to/${site.username}`
    try {
      await navigator.share({ title: site.title || site.username, url })
    } catch {
      await copyUrl(site.username)
    }
  }

  // Update the card right away: re-reading the list just after the write can
  // still return the old state, so the badge looked stuck until a reload
  const setPublished = (username: string, published: boolean) => {
    const site = sites.value.find(s => s.username === username)
    if (site) site.isPublished = published
  }

  const publishSite = async (username: string) => {
    pendingSite.value = username
    try {
      await $fetch(`/api/admin/bio/${username}/publish`, { method: 'POST' as const })
      setPublished(username, true)
      toast.add({ title: t('dashboard.toast.published'), description: t('dashboard.sites.publishedText') })
    } catch (error) {
      if (useUpgradePrompt().fromError(error)) return
      toast.add({ title: t('dashboard.toast.error'), description: t('dashboard.sites.publishFailed'), color: 'error' })
    } finally {
      pendingSite.value = null
    }
  }

  const unpublishSite = async (username: string) => {
    pendingSite.value = username
    try {
      await $fetch(`/api/admin/bio/${username}/unpublish`, { method: 'POST' as const })
      setPublished(username, false)
      toast.add({ title: t('dashboard.toast.unpublished'), description: t('dashboard.sites.unpublishedText') })
    } catch {
      toast.add({ title: t('dashboard.toast.error'), description: t('dashboard.sites.unpublishFailed'), color: 'error' })
    } finally {
      pendingSite.value = null
    }
  }

  return { qrSite, pendingSite, copyUrl, shareSite, publishSite, unpublishSite }
}
