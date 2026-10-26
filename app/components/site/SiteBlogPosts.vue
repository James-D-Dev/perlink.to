<template>
  <!-- The site's blog: its posts (drafts and published) and a way to write one -->
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-5">
      <div class="min-w-0">
        <h3 class="font-semibold text-highlighted">{{ t('dashboard.blog.heading') }}</h3>
        <p class="mt-0.5 text-sm text-muted">
          {{ t('dashboard.blog.intro') }}
          <a v-if="published" :href="`/${username}/blog`" target="_blank" class="font-medium text-ink underline underline-offset-2">perlink.to/{{ username }}/blog</a>
        </p>
        <p v-if="limit !== null" class="mt-1 text-xs text-muted">{{ t('dashboard.blog.usage', { n: publishedCount, max: limit }) }}</p>
      </div>
      <UButton icon="i-lucide-pen-line" :label="t('dashboard.blog.write')" :loading="creating" @click="create" />
    </div>

    <div v-if="pending && !posts.length" class="space-y-3">
      <USkeleton v-for="i in 2" :key="i" class="h-20 rounded-3xl" />
    </div>

    <div v-else-if="!posts.length" class="flex flex-col items-center rounded-3xl bg-paper px-6 py-12 text-center ring-1 ring-line">
      <span class="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"><UIcon name="i-lucide-newspaper" class="size-6" /></span>
      <p class="mt-3 font-medium text-ink">{{ t('dashboard.blog.emptyTitle') }}</p>
      <p class="mt-1 max-w-sm text-sm text-muted">{{ t('dashboard.blog.emptyText') }}</p>
    </div>

    <div v-else class="divide-y divide-line overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
      <div v-for="post in posts" :key="post.id" class="flex items-center gap-3 p-3 sm:p-4">
        <NuxtLink :to="editLink(post.id)" class="flex min-w-0 flex-1 items-center gap-3">
          <img v-if="post.coverUrl" :src="post.coverUrl" alt="" class="size-14 shrink-0 rounded-xl object-cover">
          <span v-else class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-sand text-ink-faint"><UIcon name="i-lucide-file-text" class="size-6" /></span>
          <span class="min-w-0">
            <span class="block truncate font-medium text-ink">{{ post.title || t('dashboard.blog.untitled') }}</span>
            <span class="mt-0.5 flex items-center gap-2 text-xs text-muted">
              <UBadge size="sm" variant="soft" :color="post.status === 'published' ? 'success' : 'neutral'" :label="t(`dashboard.blog.status.${post.status}`)" />
              <span>{{ formatDate(post.publishedAt ?? post.updatedAt) }}</span>
              <span>· {{ t('dashboard.blog.minutes', { n: post.readingMinutes }) }}</span>
            </span>
          </span>
        </NuxtLink>
        <UDropdownMenu :items="menu(post)">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" :aria-label="t('dashboard.blog.more')" />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PLAN_LIMITS } from '#shared/plans'

const props = defineProps<{
  username: string
  /** The site is live, so its blog can be visited */
  published?: boolean
}>()

const { t, locale } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const { info, ensure } = useBilling()
onMounted(ensure)

interface Post { id: string; slug: string; title: string; status: 'draft' | 'published'; coverUrl: string | null; readingMinutes: number; publishedAt: string | null; updatedAt: string }

const { data, pending, refresh } = await useFetch<{ posts: Post[] }>(() => `/api/admin/bio/${props.username}/posts`, { lazy: true, server: false })
const posts = computed(() => data.value?.posts ?? [])
const publishedCount = computed(() => posts.value.filter(p => p.status === 'published').length)
// The plan's limit counts every site's posts; this shows this site's against it
const limit = computed(() => {
  const posts = info.value ? PLAN_LIMITS[info.value.plan].posts : null
  return posts !== null && Number.isFinite(posts) ? posts : null
})

const editLink = (id: string) => `/dashboard/site/${props.username}/blog/${id}`
const formatDate = (iso: string) => new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB')

const creating = ref(false)
async function create() {
  creating.value = true
  try {
    const { id } = await $fetch<{ id: string }>(`/api/admin/bio/${props.username}/posts`, { method: 'POST' })
    await navigateTo(editLink(id))
  } catch (error: any) {
    toast.add({ title: t('dashboard.blog.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    creating.value = false
  }
}

function menu(post: Post) {
  return [[
    { label: t('dashboard.blog.edit'), icon: 'i-lucide-pencil', to: editLink(post.id) },
    ...(post.status === 'published' && props.published ? [{ label: t('dashboard.blog.view'), icon: 'i-lucide-external-link', to: `/${props.username}/blog/${post.slug}`, target: '_blank' }] : []),
  ], [
    { label: t('dashboard.blog.delete'), icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => remove(post) },
  ]]
}

async function remove(post: Post) {
  const ok = await confirm({ title: t('dashboard.blog.deleteTitle'), description: t('dashboard.blog.deleteText', { title: post.title || t('dashboard.blog.untitled') }), confirmLabel: t('dashboard.blog.delete') })
  if (!ok) return
  await $fetch(`/api/admin/bio/${props.username}/posts/${post.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
