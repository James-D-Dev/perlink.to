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
            <SiteTemplatePreviewSpacer />
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
import { toAppLanguage, type AppLanguage } from '#shared/language'

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
const COPY: Record<AppLanguage, { intro: string; heading: string; body: string; list: string[]; quote: string; end: string }> = {
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
  zh: {
    intro: `这是 ${t(`dashboard.templates.${template.id}.name`)} 模板自带的示例文章。你在 Perlink 博客编辑器里写的文章会显示在这里，并沿用你网站的配色和字体。`,
    heading: '一篇文章可以包含什么',
    body: '标题、列表、引用、链接和图片，排版清晰，在手机上也方便阅读。',
    list: ['按自己的节奏写，草稿会自动保存', '添加封面图，也可以在正文中插入图片', '准备好了就发布：文章会出现在你的页面和博客里'],
    quote: '值得记住的一句话会像这样突出显示。',
    end: '读者可以分享每一篇文章，搜索引擎也能找到它们。',
  },
  ja: {
    intro: `これは「${t(`dashboard.templates.${template.id}.name`)}」テンプレートに付いているサンプル記事です。Perlinkのブログエディターで書いた記事は、サイトの色とフォントでここに表示されます。`,
    heading: '記事に入れられるもの',
    body: '見出し、リスト、引用、リンク、写真。スマートフォンでも読みやすくレイアウトされます。',
    list: ['自分のペースで書けます。下書きは自動で保存されます', 'カバー写真や本文中の画像を追加できます', '準備ができたら公開。あなたのページとブログに表示されます'],
    quote: '心に残る一文は、このように目立たせることができます。',
    end: '読者は記事ごとにシェアでき、検索エンジンにも見つけてもらえます。',
  },
  ko: {
    intro: `${t(`dashboard.templates.${template.id}.name`)} 템플릿에 들어 있는 예시 글이에요. Perlink 블로그 편집기에서 글을 쓰면 사이트의 색상과 글꼴 그대로 여기에 표시돼요.`,
    heading: '글에 담을 수 있는 것',
    body: '제목, 목록, 인용, 링크, 사진을 휴대폰에서도 읽기 편하게 배치해요.',
    list: ['내 속도에 맞춰 쓰세요. 임시 저장은 자동으로 돼요', '커버 사진과 본문 속 사진을 넣을 수 있어요', '준비되면 게시하세요. 내 페이지와 블로그에 바로 표시돼요'],
    quote: '기억할 만한 문장은 이렇게 돋보이게 할 수 있어요.',
    end: '독자는 글마다 공유할 수 있고, 검색 엔진도 글을 찾을 수 있어요.',
  },
}
const c = COPY[toAppLanguage(locale.value)]
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
