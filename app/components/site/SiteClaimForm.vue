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
        placeholder="your-site"
        class="min-w-0 flex-1 bg-transparent font-medium text-highlighted outline-none placeholder:text-dimmed dark:text-white dark:placeholder:text-neutral-600"
        :class="size === 'lg' ? 'sm:text-lg' : 'text-sm'"
        aria-label="Site address"
      >
      <UButton
        type="submit"
        :size="size === 'lg' ? 'lg' : 'md'"
        :loading="creating"
        :disabled="status !== 'available'"
        trailing-icon="i-lucide-arrow-right"
        class="shrink-0 rounded-full"
      >
        <span class="hidden sm:inline">Create your site</span>
        <span class="sm:hidden">Create</span>
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
const inputRef = ref<HTMLInputElement | null>(null)
const slug = ref(props.initialSlug)
const status = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
const message = ref('Letters, numbers, hyphens and underscores. You can change the content anytime.')
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
    message.value = res.success ? `perlink.to/${value} is available` : (res.message || 'This name is taken')
  } catch {
    if (value !== slug.value) return
    status.value = 'invalid'
    message.value = 'Could not check this name. Try again.'
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
    message.value = 'Letters, numbers, hyphens and underscores. You can change the content anytime.'
    return
  }
  if (value.length < 3) {
    status.value = 'invalid'
    message.value = 'At least 3 characters'
    return
  }
  status.value = 'checking'
  message.value = 'Checking availability...'
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
    await $fetch('/api/bio', { method: 'POST', body: { username } })

    const template = props.templateId ? PAGE_TEMPLATES.find(t => t.id === props.templateId) : undefined
    if (template) {
      const content = template.build()
      await $fetch(`/api/admin/bio/${username}`, {
        method: 'PUT' as const,
        body: {
          title: content.title,
          bio: content.bio,
          avatarUrl: content.avatarUrl,
          blocks: content.blocks,
          themeConfig: { ...content.themeConfig, pageMode: '2d', room: content.room },
        },
      })
    }

    emit('created', username)
    toast.add({ title: 'Your site is ready', description: `perlink.to/${username}`, color: 'success' })
    await navigateTo(`/dashboard/bio/${username}`)
  } catch (error: any) {
    toast.add({
      title: 'Could not create your site',
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
