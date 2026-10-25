<template>
  <UModal v-model:open="open" :title="t('dashboard.address.title')" :description="description">
    <template #body>
      <form class="space-y-3" @submit.prevent="save">
        <UInput
          ref="inputRef"
          v-model="slug"
          size="xl"
          class="w-full"
          autocomplete="off"
          :placeholder="t('dashboard.address.placeholder')"
          :ui="{ leading: 'pointer-events-none', base: 'ps-[6.25rem]' }"
        >
          <template #leading>
            <span class="text-ink-muted">perlink.to/</span>
          </template>
        </UInput>
        <p class="text-xs" :class="messageClass">{{ message }}</p>
        <p v-if="published && !temporary" class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {{ t('dashboard.address.liveWarning', { old: `perlink.to/${current}` }) }}
        </p>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" :label="t(temporary ? 'dashboard.address.later' : 'common.cancel')" @click="open = false" />
        <UButton :loading="saving" :disabled="status !== 'available'" :label="confirmLabel" @click="save" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

// Choose or change a site's perlink.to address
const props = defineProps<{
  current: string
  /** Still on the address it got when created from a template */
  temporary?: boolean
  published?: boolean
  /** Shown as the main button, e.g. "Save and publish" */
  confirmText?: string
}>()

const emit = defineEmits<{ renamed: [username: string] }>()
const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const toast = useToast()

const slug = ref('')
const status = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
const serverMessage = ref('')
const saving = ref(false)
const inputRef = ref<{ inputRef?: HTMLInputElement } | null>(null)

const description = computed(() => t(props.temporary ? 'dashboard.address.textTemp' : 'dashboard.address.text'))
const confirmLabel = computed(() => props.confirmText || t('dashboard.address.save'))

const message = computed(() => ({
  idle: t('dashboard.claim.hint'),
  checking: t('dashboard.claim.checking'),
  available: t('dashboard.claim.available', { slug: slug.value }),
  taken: serverMessage.value || t('dashboard.claim.taken'),
  invalid: serverMessage.value || t('dashboard.claim.tooShort'),
})[status.value])

const messageClass = computed(() => ({
  idle: 'text-ink-muted',
  checking: 'text-ink-muted',
  available: 'text-emerald-600',
  taken: 'text-red-600',
  invalid: 'text-amber-600',
})[status.value])

const check = useDebounceFn(async (value: string) => {
  try {
    const res = await $fetch<{ success: boolean; message?: string }>('/api/check_bio_username_exists', { method: 'POST', body: { username: value } })
    if (value !== slug.value) return
    status.value = res.success ? 'available' : 'taken'
    serverMessage.value = res.message ?? ''
  } catch {
    if (value === slug.value) status.value = 'invalid'
  }
}, 350)

watch(slug, (raw) => {
  const value = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '')
  if (value !== raw) {
    slug.value = value
    return
  }
  serverMessage.value = ''
  if (!value || value === props.current) {
    status.value = 'idle'
    return
  }
  if (value.length < 3) {
    status.value = 'invalid'
    return
  }
  status.value = 'checking'
  check(value)
})

// Start empty for a temporary address, from the current one otherwise
watch(open, (isOpen) => {
  if (!isOpen) return
  slug.value = props.temporary ? '' : props.current
  status.value = 'idle'
  nextTick(() => inputRef.value?.inputRef?.focus())
})

async function save() {
  if (status.value !== 'available' || saving.value) return
  saving.value = true
  try {
    const res = await $fetch<{ username: string }>(`/api/admin/bio/${props.current}/address`, { method: 'PATCH', body: { username: slug.value } })
    open.value = false
    emit('renamed', res.username)
  } catch (error: any) {
    toast.add({ title: t('dashboard.address.failed'), description: error?.data?.statusMessage, color: 'error' })
    status.value = 'checking'
    check(slug.value)
  } finally {
    saving.value = false
  }
}
</script>
