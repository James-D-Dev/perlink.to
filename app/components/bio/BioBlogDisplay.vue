<template>
  <!-- The site's latest blog posts, and a link to all of them -->
  <section v-if="shown.length || preview" class="overflow-hidden" :style="cardStyle">
    <div class="flex items-baseline justify-between gap-3 px-5 pt-5">
      <h2 class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">
        {{ data.title || t('latestPosts') }}
      </h2>
      <NuxtLink v-if="posts.length && !preview && !templatePreview" :to="`/${username}/blog`" class="shrink-0 text-xs font-medium opacity-70 hover:opacity-100">
        {{ t('allPosts') }} →
      </NuxtLink>
    </div>

    <p v-if="!shown.length" class="px-5 pb-5 pt-2 text-sm opacity-60">{{ emptyText }}</p>

    <ul class="px-2 pb-2 pt-2">
      <li v-for="post in shown" :key="post.id">
        <component :is="post.slug ? NuxtLink : 'div'" :to="post.slug ? `/${username}/blog/${post.slug}` : undefined" class="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-black/[0.04]">
          <img v-if="post.coverUrl" :src="post.coverUrl" alt="" class="size-16 shrink-0 rounded-xl object-cover" loading="lazy">
          <span class="min-w-0">
            <span class="line-clamp-2 block font-medium leading-snug">{{ post.title }}</span>
            <span class="mt-1 block text-xs opacity-60">
              <template v-if="post.publishedAt">{{ formatDate(post.publishedAt) }} · </template>{{ t('minRead', { n: post.readingMinutes }) }}
            </span>
          </span>
        </component>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { BlogBlock } from '~/types/bio'

const props = defineProps<{
  data: BlogBlock['data']
  username: string
  /** Editor preview: shows a hint when there's nothing yet, and links don't leave */
  preview?: boolean
  /** Shown in the editor preview when no post is published */
  emptyText?: string
  cardStyle: Record<string, string | undefined>
  headingStyle?: Record<string, string | undefined>
}>()

import { NuxtLink } from '#components'

const { t, lang } = useSiteI18n()
// Template thumbnails have no site behind them: sample posts only
const templatePreview = inject(TEMPLATE_PREVIEW_KEY, false)

interface PostSummary { id: string; slug: string; title: string; coverUrl: string | null; readingMinutes: number; publishedAt: string | null }

const count = computed(() => Math.min(Math.max(props.data.count ?? 3, 1), 10))
const { data: res } = await useFetch<{ posts: PostSummary[] }>(() => `/api/bio/${props.username}/posts`, {
  query: { limit: count },
  key: `blog-block:${props.username}:${count.value}`,
  // A site that isn't live yet (editor preview) has no public posts
  default: () => ({ posts: [] }),
  pick: ['posts'],
  immediate: !templatePreview,
})
const posts = computed(() => res.value?.posts ?? [])
// Previews of a site without posts yet show the template's example posts
const shown = computed<PostSummary[]>(() => {
  if (posts.value.length && !templatePreview) return posts.value
  if (!props.preview && !templatePreview) return []
  return (props.data.samples ?? []).slice(0, count.value).map((sample, i) => ({
    id: `sample-${i}`, slug: '', title: sample.title, coverUrl: sample.coverUrl ?? null, readingMinutes: sample.minutes ?? 4, publishedAt: null,
  }))
})

const formatDate = (iso: string | null) => (iso ? new Intl.DateTimeFormat(lang.value, { dateStyle: 'medium' }).format(new Date(iso)) : '')
</script>
