<template>
  <div>
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-slate-950">
      <UIcon name="i-lucide-loader-circle" class="size-10 animate-spin text-white/70" />
    </div>

    <UEmpty
      v-else-if="!bioPage"
      icon="i-lucide-box"
      title="Page not found"
      description="This page doesn't exist or you don't have access to it."
      :actions="[{ label: 'Back to my pages', to: '/dashboard/site' }]"
      class="min-h-screen"
    />

    <LazyRoomStudio
      v-else
      v-model:room="room"
      :saving="saving"
      :publishing="publishing"
      :dirty="dirty"
      @back="goBack"
      @save="save()"
      @publish="publish"
    />
  </div>
</template>

<script setup lang="ts">
import type { ThemeConfig } from '~/types/bio'
import { createDefaultRoom, normalizeRoom, type RoomConfig } from '~/types/room'

definePageMeta({
  layout: 'blank',
  middleware: 'auth',
  ssr: false,
  colorMode: 'dark',
})

const route = useRoute()
const toast = useToast()
const username = computed(() => route.params.url as string)

useHead({ title: () => `3D Room · ${username.value} | Perlink` })

const loading = ref(true)
const saving = ref(false)
const publishing = ref(false)
const bioPage = ref<{ username: string; themeConfig: Partial<ThemeConfig> } | null>(null)
const room = ref<RoomConfig>(createDefaultRoom())
const savedSnapshot = ref('')

const dirty = computed(() => JSON.stringify(room.value) !== savedSnapshot.value)

async function load() {
  try {
    const response = await $fetch<{ success: boolean; bioPage: { username: string; themeConfig: Partial<ThemeConfig> } }>(
      `/api/admin/bio/${username.value}`,
    )
    bioPage.value = response.bioPage
    room.value = normalizeRoom(response.bioPage.themeConfig?.room)
    savedSnapshot.value = JSON.stringify(room.value)
  } catch (error) {
    console.error('Failed to load room:', error)
    bioPage.value = null
  } finally {
    loading.value = false
  }
}

async function save(options: { silent?: boolean } = {}): Promise<boolean> {
  if (!bioPage.value) return false
  saving.value = true
  try {
    // Only themeConfig is sent; the API keeps every other field as it is
    const themeConfig = { ...bioPage.value.themeConfig, room: room.value }
    await $fetch(`/api/admin/bio/${username.value}`, { method: 'PUT' as const, body: { themeConfig } })
    bioPage.value = { ...bioPage.value, themeConfig }
    savedSnapshot.value = JSON.stringify(room.value)
    if (!options.silent) toast.add({ title: 'Room saved', color: 'success' })
    return true
  } catch (error: any) {
    toast.add({ title: 'Failed to save', description: error?.data?.statusMessage, color: 'error' })
    return false
  } finally {
    saving.value = false
  }
}

async function publish() {
  publishing.value = true
  try {
    // Publishing saves first; only the publish result gets a toast
    if (!(await save({ silent: true }))) return
    await $fetch(`/api/admin/bio/${username.value}/publish`, { method: 'POST' as const })
    toast.add({
      title: 'Published',
      description: `Your room is live at perlink.to/${username.value}`,
      color: 'success',
      actions: [{ label: 'View', onClick: () => { window.open(`/${username.value}`, '_blank') } }],
    })
  } catch (error: any) {
    toast.add({ title: 'Failed to publish', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    publishing.value = false
  }
}

const confirm = useConfirm()

async function goBack() {
  if (dirty.value) {
    const leave = await confirm({
      title: 'Leave without saving?',
      description: 'Your room changes have not been saved.',
      confirmLabel: 'Leave',
      color: 'warning',
    })
    if (!leave) return
    savedSnapshot.value = JSON.stringify(room.value)
  }
  navigateTo(`/dashboard/site/${username.value}`)
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
