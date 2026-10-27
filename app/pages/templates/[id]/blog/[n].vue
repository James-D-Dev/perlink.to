<template>
  <div>
    <SiteTemplatePreviewBar :template-id="template.id" />

    <SiteBlogShell :site="site" :home-href="`/templates/${template.id}`" :blog-href="null" sample>
      <template #default="{ lang, cardStyle, headingStyle }">
        <article class="overflow-hidden rounded-3xl" :style="cardStyle">
          <img v-if="post.coverUrl" :src="post.coverUrl" :alt="post.title" class="aspect-[2/1] w-full object-cover">
          <div class="px-5 pb-8 pt-6 sm:px-8">
            <p class="text-xs opacity-60">{{ siteT(lang, 'minRead', { n: post.minutes ?? 4 }) }}</p>
            <h1 class="mt-2 text-[28px] font-bold leading-tight tracking-tight sm:text-4xl" :style="{ fontFamily: headingStyle.fontFamily }">{{ post.title }}</h1>
            <!-- Built from our own sample text with the safe renderer -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="blog-prose mt-6" :style="{ '--heading-font': headingStyle.fontFamily }" v-html="html" />
          </div>
        </article>

        <nav v-if="older || newer" class="mt-4 grid gap-3 sm:grid-cols-2">
          <NuxtLink v-if="older" :to="older.href" class="rounded-2xl p-4 transition hover:shadow-md" :style="cardStyle">
            <span class="text-xs opacity-60">← {{ siteT(lang, 'olderPost') }}</span>
            <span class="mt-0.5 block font-medium leading-snug">{{ older.title }}</span>
          </NuxtLink>
          <NuxtLink v-if="newer" :to="newer.href" class="rounded-2xl p-4 text-right transition hover:shadow-md sm:col-start-2" :style="cardStyle">
            <span class="text-xs opacity-60">{{ siteT(lang, 'newerPost') }} →</span>
            <span class="mt-0.5 block font-medium leading-snug">{{ newer.title }}</span>
          </NuxtLink>
        </nav>
      </template>
    </SiteBlogShell>
  </div>
</template>

<script setup lang="ts">
import type { BlogSite } from '~/components/site/SiteBlogShell.vue'
import type { BlogBlock } from '~/types/bio'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { localizeTemplateContent } from '~/data/templateCopyVi'
import { renderPostHtml, type PostNode } from '#shared/postContent'

// One of a template's example posts, opened from its preview page, so people
// can see how a post reads on that site before choosing it. The words are
// the same sample text for every template.
definePageMeta({ layout: 'blank', colorMode: 'light' })

const route = useRoute()
const { t, locale } = useI18n()

const template = PAGE_TEMPLATES.find(item => item.id === route.params.id)
const content = template ? localizeTemplateContent(template.build(), locale.value) : null
const blog = content?.blocks.find(block => block.name === 'blog') as BlogBlock | undefined
const samples = blog?.data.samples ?? []
const index = Number(route.params.n) - 1
if (!template || !content || !samples[index]) throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })

const post = samples[index]!
const href = (i: number) => `/templates/${template.id}/blog/${i + 1}`
const older = samples[index + 1] ? { title: samples[index + 1]!.title, href: href(index + 1) } : null
const newer = index > 0 && samples[index - 1] ? { title: samples[index - 1]!.title, href: href(index - 1) } : null

const site: BlogSite = {
  username: template.id,
  title: content.title,
  avatarUrl: content.avatarUrl || null,
  themeConfig: content.themeConfig,
  showBranding: false,
}

const text = (value: string): PostNode => ({ type: 'text', text: value })
const p = (value: string): PostNode => ({ type: 'paragraph', content: [text(value)] })
const COPY = {
  en: {
    intro: `This is an example post that comes with the ${t(`dashboard.templates.${template.id}.name`)} template. When you write in Perlink's blog editor, your own posts show here, in your site's colours and fonts.`,
    heading: 'What a post can hold',
    body: 'Headings, lists, quotes, links and photos, laid out to read easily on a phone.',
    list: ['Write at your own pace; drafts save as you go', 'Add a cover photo, and pictures inside the text', 'Publish when it is ready: it appears on your page and in your blog'],
    quote: 'A line worth remembering stands out like this.',
    end: 'Readers can share each post, and search engines can find it.',
  },
  vi: {
    intro: `Đây là bài viết mẫu đi kèm mẫu ${t(`dashboard.templates.${template.id}.name`)}. Khi bạn viết trong trình soạn blog của Perlink, bài của bạn sẽ hiện ở đây, theo màu sắc và font chữ của trang.`,
    heading: 'Một bài viết có thể có gì',
    body: 'Tiêu đề, danh sách, trích dẫn, liên kết và hình ảnh, trình bày dễ đọc trên điện thoại.',
    list: ['Viết theo nhịp của bạn, bản nháp tự lưu', 'Thêm ảnh bìa và ảnh trong bài', 'Đăng khi đã sẵn sàng: bài hiện trên trang và trong blog của bạn'],
    quote: 'Một câu đáng nhớ sẽ nổi bật như thế này.',
    end: 'Người đọc có thể chia sẻ từng bài, và công cụ tìm kiếm có thể tìm thấy bài viết.',
  },
}
const c = COPY[locale.value === 'vi' ? 'vi' : 'en']
const html = renderPostHtml({
  type: 'doc',
  content: [
    p(c.intro),
    { type: 'heading', attrs: { level: 2 }, content: [text(c.heading)] },
    p(c.body),
    { type: 'bulletList', content: c.list.map(item => ({ type: 'listItem', content: [p(item)] })) },
    { type: 'blockquote', content: [p(c.quote)] },
    p(c.end),
  ],
})

useSeoMeta({ title: `${post.title} · ${t('dashboard.home.previewTitle')}`, robots: 'noindex' })
</script>
