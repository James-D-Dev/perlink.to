<template>
  <div class="space-y-3">
    <p class="text-sm text-ink-muted">{{ t('dashboard.guestbook.intro') }}</p>

    <div v-if="loading" class="divide-y divide-line overflow-hidden rounded-xl bg-paper ring-1 ring-line">
      <div v-for="i in 3" :key="i" class="space-y-2 p-4">
        <USkeleton class="h-4 w-40" />
        <USkeleton class="h-3 w-64" />
      </div>
    </div>

    <div v-else-if="!entries.length" class="flex flex-col items-center rounded-xl bg-sand px-6 py-14 text-center">
      <span class="text-4xl" aria-hidden="true">💌</span>
      <h3 class="mt-3 font-medium text-ink">{{ t('dashboard.guestbook.emptyTitle') }}</h3>
      <p class="mt-1 max-w-sm text-sm text-ink-muted">{{ t('dashboard.guestbook.emptyText') }}</p>
      <UButton :to="`/dashboard/room/${username}`" class="mt-5" size="sm" icon="i-lucide-box" :label="t('dashboard.guestbook.openRoom')" />
    </div>

    <ul v-else class="divide-y divide-line overflow-hidden rounded-xl bg-paper ring-1 ring-line">
      <li v-for="entry in entries" :key="entry.id" class="flex gap-3 p-4" :class="entry.hidden && 'opacity-55'">
        <span class="text-2xl" aria-hidden="true">{{ GUEST_GIFT_EMOJI[entry.gift as GuestGiftType] ?? '🎁' }}</span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-3">
            <p class="flex items-center gap-2 font-medium text-ink">
              {{ entry.name }}
              <UBadge v-if="entry.hidden" color="neutral" variant="soft" size="sm" :label="t('dashboard.guestbook.hiddenBadge')" />
            </p>
            <p class="text-xs text-ink-muted">{{ formatWhen(entry.createdAt) }}</p>
          </div>
          <p class="mt-1 whitespace-pre-line text-sm text-ink">{{ entry.message }}</p>
          <div class="mt-2 flex gap-1.5">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              :icon="entry.hidden ? 'i-lucide-eye' : 'i-lucide-eye-off'"
              :label="entry.hidden ? t('dashboard.guestbook.show') : t('dashboard.guestbook.hide')"
              @click="setHidden(entry, !entry.hidden)"
            />
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-trash-2" :label="t('common.delete')" @click="remove(entry)" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { GUEST_GIFT_EMOJI, type GuestGiftType } from '#shared/guestbook'

// Owner's list of guestbook messages left in the site's 3D room
const props = defineProps<{ username: string }>()

interface Entry { id: string; name: string; message: string; gift: string; hidden: boolean; createdAt: string }

const { t, locale } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const loading = ref(true)
const entries = ref<Entry[]>([])
const api = computed(() => `/api/admin/bio/${props.username}/guestbook`)

onMounted(async () => {
  try {
    entries.value = (await $fetch<{ entries: Entry[] }>(api.value)).entries
  } catch {
    toast.add({ title: t('dashboard.guestbook.loadFailed'), color: 'error' })
  } finally {
    loading.value = false
  }
})

async function setHidden(entry: Entry, hidden: boolean) {
  entry.hidden = hidden
  try {
    await $fetch(`${api.value}/${entry.id}`, { method: 'PATCH', body: { hidden } })
  } catch {
    entry.hidden = !hidden
    toast.add({ title: t('dashboard.guestbook.saveFailed'), color: 'error' })
  }
}

async function remove(entry: Entry) {
  const ok = await confirm({ title: t('dashboard.guestbook.deleteTitle'), description: entry.message.slice(0, 120), confirmLabel: t('common.delete'), color: 'error' })
  if (!ok) return
  await $fetch(`${api.value}/${entry.id}`, { method: 'DELETE' })
  entries.value = entries.value.filter(e => e.id !== entry.id)
}

function formatWhen(value: string) {
  const date = new Date(`${value.replace(' ', 'T')}Z`)
  return date.toLocaleString(locale.value === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>
