<template>
  <div>
    <RoomLoadingShell v-if="loading" />

    <UEmpty
      v-else-if="!bioPage"
      icon="i-lucide-box"
      :title="t('room.page.notFoundTitle')"
      :description="t('room.page.notFoundText')"
      :actions="[{ label: t('room.page.backToPages'), to: '/dashboard/site' }]"
      class="min-h-screen"
    />

    <LazyRoomStudio
      v-else
      ref="studioRef"
      v-model:room="room"
      :saving="saving"
      :publishing="publishing"
      :dirty="dirty"
      :username="bioPage.username"
      :site-name="bioPage.title || bioPage.username"
      :products="products"
      :auto-record="autoRecord"
      :shop-accent="bioPage.themeConfig.colors?.primary"
      :video-link="videoLink"
      :live-issue="liveIssue"
      :go-live="goLive"
      @back="goBack"
      @save="save()"
      @publish="publish"
    />
    <!-- The room editor has its own layout: the plan and pack prompts live here too -->
    <BillingUpgradeDialog />
    <BillingPackDialog />
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, ThemeConfig } from '~/types/bio'
import { createDefaultRoom, normalizeRoom, type RoomConfig } from '~/types/room'

definePageMeta({
  layout: 'blank',
  middleware: 'auth',
  ssr: false,
  colorMode: 'dark',
})

const route = useRoute()
const toast = useToast()
const { t } = useI18n()
const username = computed(() => route.params.url as string)
// ?record=1 (from the site editor's "Share a room video") opens the video
// dialog right away; the flag is dropped from the address so a reload doesn't
const autoRecord = route.query.record === '1'
if (autoRecord && import.meta.client) navigateTo({ path: route.path, query: {} }, { replace: true })

useHead({ title: () => t('room.page.title', { name: username.value }) })

const loading = ref(true)
const saving = ref(false)
const publishing = ref(false)
type EditedSite = { username: string; title?: string | null; themeConfig: Partial<ThemeConfig>; blocks?: BioBlock[]; isPublished?: boolean; hasDraft?: boolean }
const bioPage = ref<EditedSite | null>(null)
// Products the room's product stands can show
const products = computed(() => pageProducts(bioPage.value?.blocks).map(p => p.product))
const room = ref<RoomConfig>(createDefaultRoom())
const savedSnapshot = ref('')

const dirty = computed(() => JSON.stringify(room.value) !== savedSnapshot.value)

async function load() {
  try {
    const response = await $fetch<{ success: boolean; bioPage: EditedSite }>(
      `/api/admin/bio/${username.value}`,
    )
    bioPage.value = response.bioPage
    loadDomain()
    room.value = normalizeRoom(response.bioPage.themeConfig?.room)
    savedSnapshot.value = JSON.stringify(room.value)
  } catch (error) {
    console.error('Failed to load room:', error)
    bioPage.value = null
  } finally {
    // The loader finishes its intro and lands the pearl before the studio shows
    setTimeout(() => (loading.value = false), loaderWaitMs())
  }
}

async function save(options: { silent?: boolean } = {}): Promise<boolean> {
  if (!bioPage.value) return false
  saving.value = true
  try {
    // Only themeConfig is sent; the API keeps every other field as it is
    const themeConfig = { ...bioPage.value.themeConfig, room: room.value }
    // Saved as a draft on live sites; Publish makes it visible
    const response = await $fetch<{ bioPage?: { hasDraft?: boolean } }>(`/api/admin/bio/${username.value}`, { method: 'PUT' as const, body: { themeConfig, draft: true } })
    bioPage.value = { ...bioPage.value, themeConfig, hasDraft: !!response?.bioPage?.hasDraft }
    savedSnapshot.value = JSON.stringify(room.value)
    if (!options.silent) toast.add({ title: response?.bioPage?.hasDraft ? t('room.toast.savedDraft') : t('room.toast.saved'), color: 'success' })
    saveRoomPicture()
    return true
  } catch (error: any) {
    toast.add({ title: t('room.toast.saveFailed'), description: error?.data?.statusMessage, color: 'error' })
    return false
  } finally {
    saving.value = false
  }
}

// A picture of the room for the site editor and "My sites"; best effort
const studioRef = ref<{ snapshot: () => Promise<Blob | null> } | null>(null)
async function saveRoomPicture() {
  try {
    const blob = await studioRef.value?.snapshot()
    if (blob) await uploadSnapshot(username.value, 'room', blob)
  } catch (error) {
    console.warn('[room] snapshot failed', error)
  }
}

async function publish(): Promise<boolean> {
  publishing.value = true
  try {
    // Publishing saves first; only the publish result gets a toast
    if (!(await save({ silent: true }))) return false
    await $fetch(`/api/admin/bio/${username.value}/publish`, { method: 'POST' as const })
    if (bioPage.value) bioPage.value = { ...bioPage.value, isPublished: true, hasDraft: false }
    toast.add({
      title: t('room.toast.published'),
      description: t('room.toast.publishedText', { name: username.value }),
      color: 'success',
      actions: [{ label: t('room.toast.view'), onClick: () => { window.open(`/${username.value}`, '_blank') } }],
    })
    return true
  } catch (error: any) {
    if (useUpgradePrompt().fromError(error)) return false
    toast.add({ title: t('room.toast.publishFailed'), description: error?.data?.statusMessage, color: 'error' })
    return false
  } finally {
    publishing.value = false
  }
}

// ---------- Room video: its link must open this very room ----------

/** The site's own domain once it's active, else its perlink.to address */
const customDomain = ref<string | null>(null)
async function loadDomain() {
  try {
    const res = await $fetch<{ domain: { hostname: string; status: string } | null }>(`/api/admin/bio/${username.value}/domain`)
    customDomain.value = res.domain?.status === 'active' ? res.domain.hostname : null
  } catch {}
}
const videoLink = computed(() => customDomain.value ?? `perlink.to/${username.value}`)

/** Visitors see the room when the page opens in 3D or shows the room button */
const roomShown = (theme?: Partial<ThemeConfig>) => theme?.pageMode === '3d' || !!theme?.roomButton
/** Why the link wouldn't show the room in the video yet */
const liveIssue = computed<'unpublished' | 'hidden' | 'draft' | null>(() => {
  const site = bioPage.value
  if (!site) return null
  if (site.isPublished === false) return 'unpublished'
  if (!roomShown(site.themeConfig)) return 'hidden'
  return site.hasDraft || dirty.value ? 'draft' : null
})
/** Switches the room on for visitors (a button on the page) if it's off, and publishes */
async function goLive() {
  if (!bioPage.value) return false
  if (!roomShown(bioPage.value.themeConfig)) bioPage.value = { ...bioPage.value, themeConfig: { ...bioPage.value.themeConfig, roomButton: true } }
  return publish()
}

const confirm = useConfirm()

async function goBack() {
  if (dirty.value) {
    const leave = await confirm({
      title: t('room.page.leaveTitle'),
      description: t('room.page.leaveText'),
      confirmLabel: t('room.page.leave'),
      color: 'warning',
    })
    if (!leave) return
    savedSnapshot.value = JSON.stringify(room.value)
  }
  // Back to the 3D room section of the site editor
  navigateTo(`/dashboard/site/${username.value}#room`)
}

// Warn before closing the tab with unsaved changes
function onBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  load()
  window.addEventListener('beforeunload', onBeforeUnload)
})
onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>
