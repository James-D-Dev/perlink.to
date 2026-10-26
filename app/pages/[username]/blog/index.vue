<template>
  <SiteBlogShell v-if="data" :site="data.site">
    <template #default="{ lang, cardStyle, headingStyle }">
      <h1 class="mb-6 text-3xl font-bold tracking-tight" :style="{ fontFamily: headingStyle.fontFamily }">{{ siteT(lang, 'blog') }}</h1>

      <p v-if="!data.posts.length" class="rounded-3xl p-8 text-center text-sm opacity-70" :style="cardStyle">{{ siteT(lang, 'noPosts') }}</p>

      <div class="space-y-4">
        <NuxtLink
          v-for="post in data.posts"
          :key="post.id"
          :to="`/${data.site.username}/blog/${post.slug}`"
          class="group block overflow-hidden rounded-3xl transition hover:-translate-y-0.5 hover:shadow-lg"
          :style="cardStyle"
        >
          <img v-if="post.coverUrl" :src="post.coverUrl" :alt="post.title" class="aspect-[2/1] w-full object-cover" loading="lazy">
          <div class="p-5">
            <p class="text-xs opacity-60">{{ formatDate(post.publishedAt, lang) }} · {{ siteT(lang, 'minRead', { n: post.readingMinutes }) }}</p>
            <h2 class="mt-1.5 text-xl font-semibold leading-snug" :style="{ fontFamily: headingStyle.fontFamily }">{{ post.title }}</h2>
            <p v-if="post.excerpt" class="mt-2 line-clamp-3 text-[15px] leading-relaxed opacity-75">{{ post.excerpt }}</p>
          </div>
        </NuxtLink>
      </div>
    </template>
  </SiteBlogShell>
</template>

<script setup lang="ts">
import type { BlogSite } from '~/components/site/SiteBlogShell.vue'

// perlink.to/<site>/blog: the site's published posts
definePageMeta({ layout: 'blank' })

interface PostSummary { id: string; slug: string; title: string; excerpt: string | null; coverUrl: string | null; readingMinutes: number; publishedAt: string | null }

const route = useRoute()
const username = String(route.params.username)
const { data, error } = await useFetch<{ site: BlogSite; posts: PostSummary[] }>(`/api/bio/${username}/posts`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const formatDate = (iso: string | null, lang: string) => (iso ? new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(iso)) : '')

const url = `https://perlink.to/${username}/blog`
const title = computed(() => `${siteT(normalizeSiteLanguage(data.value?.site.themeConfig.language), 'blog')} — ${data.value?.site.title ?? username}`)
useSeoMeta({
  title,
  ogTitle: title,
  description: () => data.value?.posts[0]?.excerpt ?? undefined,
  ogType: 'website',
  ogUrl: url,
  ogImage: () => data.value?.posts.find(p => p.coverUrl)?.coverUrl ?? data.value?.site.avatarUrl ?? undefined,
})
useHead({
  link: [
    { rel: 'canonical', href: url },
    { rel: 'alternate', type: 'application/rss+xml', title, href: `${url}/rss.xml` },
  ],
})
</script>
