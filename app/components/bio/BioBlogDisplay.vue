<template>
  <!-- The site's latest blog posts, and a link to all of them -->
  <section v-if="posts.length || preview" class="overflow-hidden" :style="cardStyle">
    <div class="flex items-baseline justify-between gap-3 px-5 pt-5">
      <h2 class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">
        {{ data.title || t('latestPosts') }}
      </h2>
      <NuxtLink v-if="posts.length && !preview" :to="`/${username}/blog`" class="shrink-0 text-xs font-medium opacity-70 hover:opacity-100">
        {{ t('allPosts') }} →
      </NuxtLink>
    </div>

    <p v-if="!posts.length" class="px-5 pb-5 pt-2 text-sm opacity-60">{{ emptyText }}</p>

    <ul class="px-2 pb-2 pt-2">
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="`/${username}/blog/${post.slug}`" class="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-black/[0.04]">
          <img v-if="post.coverUrl" :src="post.coverUrl" alt="" class="size-16 shrink-0 rounded-xl object-cover" loading="lazy">
          <span class="min-w-0">
            <span class="line-clamp-2 block font-medium leading-snug">{{ post.title }}</span>
            <span class="mt-1 block text-xs opacity-60">{{ formatDate(post.publishedAt) }} · {{ t('minRead', { n: post.readingMinutes }) }}</span>
          </span>
        </NuxtLink>
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

const { t, lang } = useSiteI18n()

interface PostSummary { id: string; slug: string; title: string; coverUrl: string | null; readingMinutes: number; publishedAt: string | null }

const count = computed(() => Math.min(Math.max(props.data.count ?? 3, 1), 10))
const { data: res } = await useFetch<{ posts: PostSummary[] }>(() => `/api/bio/${props.username}/posts`, {
  query: { limit: count },
  key: `blog-block:${props.username}:${count.value}`,
  // A site that isn't live yet (editor preview) has no public posts
  default: () => ({ posts: [] }),
  pick: ['posts'],
})
const posts = computed(() => res.value?.posts ?? [])

const formatDate = (iso: string | null) => (iso ? new Intl.DateTimeFormat(lang.value, { dateStyle: 'medium' }).format(new Date(iso)) : '')
</script>
