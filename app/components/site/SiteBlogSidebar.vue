<template>
  <!-- The site's posts beside the one being written: switch between them,
       find one, start another. The open post shows its title as it's typed -->
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex items-center gap-2 px-3 pb-2 pt-3">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :to="backTo" :aria-label="t('dashboard.blog.back')" />
      <p class="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{{ t('dashboard.blog.sidebar.title') }}</p>
      <UButton icon="i-lucide-plus" size="sm" :loading="creating" :aria-label="t('dashboard.blog.write')" @click="create" />
    </div>

    <div class="space-y-2 px-3 pb-2">
      <UInput
        v-if="posts.length > 5"
        v-model="query"
        icon="i-lucide-search"
        size="sm"
        class="w-full"
        :placeholder="t('dashboard.blog.sidebar.search')"
      />
      <div v-if="hasBoth" class="flex gap-1">
        <button
          v-for="f in FILTERS"
          :key="f"
          type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="filter === f ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-sand'"
          @click="filter = f"
        >
          {{ f === 'all' ? t('dashboard.blog.sidebar.all') : t(`dashboard.blog.status.${f}`) }}
          <span class="ml-0.5 opacity-60">{{ count(f) }}</span>
        </button>
      </div>
    </div>

    <nav class="min-h-0 flex-1 overflow-y-auto px-2 pb-4" :aria-label="t('dashboard.blog.sidebar.list')">
      <div v-if="!loaded" class="space-y-1.5 px-1">
        <USkeleton v-for="i in 4" :key="i" class="h-14 rounded-xl" />
      </div>
      <p v-else-if="!shown.length" class="px-3 py-6 text-center text-sm text-ink-muted">{{ t('dashboard.blog.sidebar.none') }}</p>
      <NuxtLink
        v-for="post in shown"
        :key="post.id"
        :to="`/dashboard/site/${username}/blog/${post.id}`"
        class="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors"
        :class="post.id === currentId ? 'bg-sand ring-1 ring-line' : 'hover:bg-sand/60'"
        :aria-current="post.id === currentId ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <img v-if="coverOf(post)" :src="coverOf(post)!" alt="" class="size-10 shrink-0 rounded-lg object-cover">
        <span v-else class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sand text-ink-faint ring-1 ring-line">
          <UIcon name="i-lucide-file-text" class="size-4" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-medium" :class="titleOf(post) ? 'text-ink' : 'text-ink-muted italic'">{{ titleOf(post) || t('dashboard.blog.untitled') }}</span>
          <span class="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
            <span class="size-1.5 shrink-0 rounded-full" :class="statusOf(post) === 'published' ? 'bg-emerald-500' : 'bg-amber-400'" />
            <span class="truncate">{{ t(`dashboard.blog.status.${statusOf(post)}`) }} · {{ when(post.updatedAt) }}</span>
          </span>
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGE_INFO, toAppLanguage } from '#shared/language'

const props = defineProps<{
  username: string
  currentId: string
  /** The open post as it is now (typed but maybe not saved yet) */
  current?: { title: string; status: 'draft' | 'published'; coverUrl: string | null }
}>()
defineEmits<{ navigate: [] }>()

const { t, locale } = useI18n()
const toast = useToast()
const backTo = computed(() => `/dashboard/site/${props.username}#blog`)

interface Post { id: string; title: string; status: 'draft' | 'published'; coverUrl: string | null; updatedAt: string }

// Kept across posts (the page is rebuilt for each one), so switching doesn't
// flash an empty list; refreshed quietly each time
const store = useState<Record<string, Post[]>>('blog-sidebar-posts', () => ({}))
const posts = computed(() => store.value[props.username] ?? [])
const loaded = computed(() => props.username in store.value)
async function refresh() {
  try {
    const res = await $fetch<{ posts: Post[] }>(`/api/admin/bio/${props.username}/posts`)
    store.value = { ...store.value, [props.username]: res.posts }
  } catch {}
}
onMounted(refresh)
defineExpose({ refresh })

const titleOf = (post: Post) => (post.id === props.currentId && props.current ? props.current.title : post.title).trim()
const statusOf = (post: Post) => (post.id === props.currentId && props.current ? props.current.status : post.status)
const coverOf = (post: Post) => (post.id === props.currentId && props.current ? props.current.coverUrl : post.coverUrl)

const FILTERS = ['all', 'draft', 'published'] as const
const filter = ref<typeof FILTERS[number]>('all')
const query = ref('')
const count = (f: typeof FILTERS[number]) => (f === 'all' ? posts.value.length : posts.value.filter(p => statusOf(p) === f).length)
const hasBoth = computed(() => count('draft') > 0 && count('published') > 0)
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return posts.value.filter(p =>
    (filter.value === 'all' || !hasBoth.value || statusOf(p) === filter.value)
    && (!q || titleOf(p).toLowerCase().includes(q)),
  )
})

// "5 min ago", "yesterday", or a date
const intl = computed(() => { const lang = toAppLanguage(locale.value); return lang === 'en' ? 'en-GB' : LANGUAGE_INFO[lang].intl })
function when(iso: string) {
  const date = new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`)
  const minutes = Math.round((date.getTime() - Date.now()) / 60000)
  const rtf = new Intl.RelativeTimeFormat(intl.value, { numeric: 'auto' })
  if (minutes > -60) return rtf.format(Math.min(0, minutes), 'minute')
  if (minutes > -60 * 24) return rtf.format(Math.round(minutes / 60), 'hour')
  if (minutes > -60 * 24 * 7) return rtf.format(Math.round(minutes / 1440), 'day')
  return date.toLocaleDateString(intl.value, { day: 'numeric', month: 'short' })
}

const creating = ref(false)
async function create() {
  creating.value = true
  try {
    const { id } = await $fetch<{ id: string }>(`/api/admin/bio/${props.username}/posts`, { method: 'POST' })
    await navigateTo(`/dashboard/site/${props.username}/blog/${id}`)
  } catch (error: any) {
    if (useUpgradePrompt().fromError(error)) return
    toast.add({ title: t('dashboard.blog.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    creating.value = false
  }
}
</script>
