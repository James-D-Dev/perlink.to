<template>
  <SiteBlogShell v-if="data" :site="data.site">
    <template #default="{ lang, cardStyle, headingStyle }">
      <article class="overflow-hidden rounded-3xl" :style="cardStyle">
        <img v-if="data.post.coverUrl" :src="data.post.coverUrl" :alt="data.post.title" class="aspect-[2/1] w-full object-cover">
        <div class="px-5 pb-8 pt-6 sm:px-8">
          <p class="text-xs opacity-60">{{ formatDate(data.post.publishedAt, lang) }} · {{ siteT(lang, 'minRead', { n: data.post.readingMinutes }) }}</p>
          <h1 class="mt-2 text-[28px] font-bold leading-tight tracking-tight sm:text-4xl" :style="{ fontFamily: headingStyle.fontFamily }">{{ data.post.title }}</h1>
          <!-- Rendered on the server from the post's document: only known
               elements, escaped text, safe links (shared/postContent.ts) -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blog-prose mt-6" :style="{ '--heading-font': headingStyle.fontFamily }" v-html="data.post.html" />
        </div>
      </article>

      <nav v-if="data.newer || data.older" class="mt-4 grid gap-3 sm:grid-cols-2">
        <NuxtLink v-if="data.older" :to="`/${data.site.username}/blog/${data.older.slug}`" class="rounded-2xl p-4 transition hover:shadow-md" :style="cardStyle">
          <span class="text-xs opacity-60">← {{ siteT(lang, 'olderPost') }}</span>
          <span class="mt-0.5 block font-medium leading-snug">{{ data.older.title }}</span>
        </NuxtLink>
        <NuxtLink v-if="data.newer" :to="`/${data.site.username}/blog/${data.newer.slug}`" class="rounded-2xl p-4 text-right transition hover:shadow-md sm:col-start-2" :style="cardStyle">
          <span class="text-xs opacity-60">{{ siteT(lang, 'newerPost') }} →</span>
          <span class="mt-0.5 block font-medium leading-snug">{{ data.newer.title }}</span>
        </NuxtLink>
      </nav>
    </template>
  </SiteBlogShell>
</template>

<script setup lang="ts">
import type { BlogSite } from '~/components/site/SiteBlogShell.vue'

// perlink.to/<site>/blog/<slug>: one post
definePageMeta({ layout: 'blank' })

interface Post { id: string; slug: string; title: string; excerpt: string | null; coverUrl: string | null; readingMinutes: number; publishedAt: string | null; updatedAt: string; html: string }
interface Neighbour { slug: string; title: string }

const route = useRoute()
const username = String(route.params.username)
const slug = String(route.params.slug)
const { data, error } = await useFetch<{ site: BlogSite; post: Post; newer: Neighbour | null; older: Neighbour | null }>(`/api/bio/${username}/posts/${slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })

const formatDate = (iso: string | null, lang: string) => (iso ? new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(iso)) : '')

const url = `https://perlink.to/${username}/blog/${slug}`
const title = computed(() => `${data.value?.post.title} — ${data.value?.site.title ?? username}`)
useSeoMeta({
  title,
  ogTitle: () => data.value?.post.title,
  description: () => data.value?.post.excerpt ?? undefined,
  ogDescription: () => data.value?.post.excerpt ?? undefined,
  ogType: 'article',
  ogUrl: url,
  ogImage: () => data.value?.post.coverUrl ?? data.value?.site.avatarUrl ?? undefined,
  twitterCard: 'summary_large_image',
  articlePublishedTime: () => data.value?.post.publishedAt ?? undefined,
  articleModifiedTime: () => data.value?.post.updatedAt ?? undefined,
})
useHead({
  link: [{ rel: 'canonical', href: url }],
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.value?.post.title,
      description: data.value?.post.excerpt,
      image: data.value?.post.coverUrl ?? undefined,
      datePublished: data.value?.post.publishedAt,
      dateModified: data.value?.post.updatedAt,
      author: { '@type': 'Person', name: data.value?.site.title },
      mainEntityOfPage: url,
    }).replace(/</g, '\\u003c')),
  }],
})
</script>

<style>
/* Readable post body: comfortable line length, spacing and sizes */
.blog-prose { font-size: 17px; line-height: 1.75; overflow-wrap: anywhere; }
.blog-prose > * + * { margin-top: 1.1em; }
.blog-prose h2, .blog-prose h3, .blog-prose h4 { font-family: var(--heading-font, inherit); font-weight: 700; line-height: 1.3; margin-top: 1.8em; }
.blog-prose h2 { font-size: 1.45em; }
.blog-prose h3 { font-size: 1.2em; }
.blog-prose h4 { font-size: 1.05em; }
.blog-prose a { text-decoration: underline; text-underline-offset: 3px; }
.blog-prose ul { list-style: disc; padding-left: 1.4em; }
.blog-prose ol { list-style: decimal; padding-left: 1.4em; }
.blog-prose li + li { margin-top: 0.35em; }
.blog-prose blockquote { border-left: 3px solid currentColor; padding-left: 1em; opacity: 0.8; font-style: italic; }
.blog-prose code { font-size: 0.9em; background: rgb(0 0 0 / 0.06); padding: 0.15em 0.35em; border-radius: 6px; }
.blog-prose pre { background: rgb(0 0 0 / 0.06); padding: 1em; border-radius: 14px; overflow-x: auto; }
.blog-prose pre code { background: none; padding: 0; }
.blog-prose hr { border: 0; border-top: 1px solid currentColor; opacity: 0.15; margin: 2em 0; }
.blog-prose figure img { width: 100%; border-radius: 16px; }
</style>
