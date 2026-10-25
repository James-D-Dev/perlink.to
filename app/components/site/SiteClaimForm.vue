<template>
  <form class="space-y-2" @submit.prevent="submit">
    <div
      class="flex items-center gap-2 rounded-full bg-default p-1.5 pl-3 ring-1 ring-default transition focus-within:ring-accented focus-within:ring-2 dark:bg-white/[0.04] dark:ring-white/10"
      :class="size === 'lg' ? 'sm:p-2' : ''"
    >
      <span class="shrink-0 pl-2 font-medium text-muted dark:text-neutral-400" :class="size === 'lg' ? 'sm:text-lg' : 'text-sm'">perlink.to/</span>
      <input
        ref="inputRef"
        v-model="slug"
        type="text"
        inputmode="url"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        :placeholder="t('dashboard.claim.placeholder')"
        class="min-w-0 flex-1 bg-transparent font-medium text-highlighted outline-none placeholder:text-dimmed dark:text-white dark:placeholder:text-neutral-600"
        :class="size === 'lg' ? 'sm:text-lg' : 'text-sm'"
        :aria-label="t('dashboard.claim.ariaLabel')"
      >
      <UButton
        type="submit"
        :size="size === 'lg' ? 'lg' : 'md'"
        :loading="creating"
        :disabled="status !== 'available'"
        trailing-icon="i-lucide-arrow-right"
        class="shrink-0 rounded-full"
      >
        <span class="hidden sm:inline">{{ t('dashboard.claim.submit') }}</span>
        <span class="sm:hidden">{{ t('dashboard.claim.submitShort') }}</span>
      </UButton>
    </div>
    <p class="flex min-h-5 items-center gap-1.5 pl-1 text-xs" :class="messageClass">
      <UIcon v-if="status === 'checking'" name="i-lucide-loader-circle" class="size-3.5 animate-spin" />
      <UIcon v-else-if="status === 'available'" name="i-lucide-circle-check" class="size-3.5" />
      <UIcon v-else-if="status === 'taken' || status === 'invalid'" name="i-lucide-circle-alert" class="size-3.5" />
      {{ message }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

const props = withDefaults(defineProps<{
  /** Template to apply after the site is created; none opens the editor's template picker */
  templateId?: string
  initialSlug?: string
  size?: 'md' | 'lg'
  autofocus?: boolean
}>(), {
  templateId: undefined,
  initialSlug: '',
  size: 'md',
  autofocus: false,
})

const emit = defineEmits<{ created: [username: string] }>()

const toast = useToast()
const { t } = useI18n()
const { createSite } = useCreateSite()
const inputRef = ref<HTMLInputElement | null>(null)
const slug = ref(props.initialSlug)
const status = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
// A message key (translated at render time) or raw text from the server
const messageState = ref<{ key?: string; params?: Record<string, unknown>; text?: string }>({ key: 'hint' })
const message = computed(() => messageState.value.text ?? t(`dashboard.claim.${messageState.value.key}`, messageState.value.params ?? {}))
const creating = ref(false)

const messageClass = computed(() => ({
  idle: 'text-muted dark:text-neutral-500',
  checking: 'text-muted dark:text-neutral-400',
  available: 'text-emerald-600 dark:text-emerald-400',
  taken: 'text-red-600 dark:text-red-400',
  invalid: 'text-amber-600 dark:text-amber-400',
})[status.value])

const check = useDebounceFn(async (value: string) => {
  try {
    const res = await $fetch<{ success: boolean; message?: string }>('/api/check_bio_username_exists', {
      method: 'POST',
      body: { username: value },
    })
    // Ignore results for an older value
    if (value !== slug.value) return
    status.value = res.success ? 'available' : 'taken'
    messageState.value = res.success
      ? { key: 'available', params: { slug: value } }
      : res.message ? { text: res.message } : { key: 'taken' }
  } catch {
    if (value !== slug.value) return
    status.value = 'invalid'
    messageState.value = { key: 'checkFailed' }
  }
}, 400)

watch(slug, (raw) => {
  // Addresses are lowercase without spaces
  const value = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '')
  if (value !== raw) {
    slug.value = value
    return
  }
  if (!value) {
    status.value = 'idle'
    messageState.value = { key: 'hint' }
    return
  }
  if (value.length < 3) {
    status.value = 'invalid'
    messageState.value = { key: 'tooShort' }
    return
  }
  status.value = 'checking'
  messageState.value = { key: 'checking' }
  check(value)
}, { immediate: true })

onMounted(() => {
  if (props.autofocus) nextTick(() => inputRef.value?.focus())
})

async function submit() {
  if (status.value !== 'available' || creating.value) return
  creating.value = true
  const username = slug.value
  try {
    await createSite({ username, templateId: props.templateId })

    emit('created', username)
    toast.add({ title: t('dashboard.claim.ready'), description: `perlink.to/${username}`, color: 'success' })
    await navigateTo(`/dashboard/site/${username}`)
  } catch (error: any) {
    if (useUpgradePrompt().fromError(error)) return
    toast.add({
      title: t('dashboard.claim.createFailed'),
      description: error?.data?.statusMessage || error?.message,
      color: 'error',
    })
    // The name may have been taken in the meantime
    status.value = 'checking'
    check(username)
  } finally {
    creating.value = false
  }
}
</script>
