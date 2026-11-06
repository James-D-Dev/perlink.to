<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <nav class="mb-8 text-sm text-ink-muted" :aria-label="more.breadcrumb">
        <NuxtLink :to="home" class="hover:text-ink">Perlink</NuxtLink>
        <span class="mx-2" aria-hidden="true">/</span>
        <NuxtLink :to="pillar" class="hover:text-ink">{{ more.pillar }}</NuxtLink>
        <span class="mx-2" aria-hidden="true">/</span>
        <span>{{ text.eyebrow }}</span>
      </nav>
      <div class="max-w-3xl">
        <p class="mk-eyebrow mb-4">{{ text.eyebrow }} · {{ more.read(topic.readMinutes) }}</p>
        <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
        <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
        <p class="mt-4 text-sm text-ink-muted">
          {{ more.by }} <NuxtLink :to="aboutPath" class="underline decoration-line underline-offset-4 hover:text-ink">Perlink</NuxtLink>
          · {{ more.updated }} <time :datetime="topic.updated">{{ updatedLabel }}</time>
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ more.start }}</MarketingMkButton>
          <MarketingMkButton to="#templates" variant="outline">{{ more.seeTemplates }}</MarketingMkButton>
        </div>
      </div>
    </MarketingMkSection>

    <!-- The article -->
    <MarketingMkSection>
      <article class="max-w-3xl">
        <section v-for="(section, i) in text.sections" :key="section.title" :class="i > 0 && 'mt-14'">
          <h2 class="mk-display text-2xl sm:text-3xl">{{ section.title }}</h2>
          <p v-for="(paragraph, j) in section.paragraphs" :key="j" class="mt-4 text-base leading-relaxed text-ink-muted">{{ paragraph }}</p>
          <ul v-if="section.bullets" class="mt-4 space-y-2.5">
            <li v-for="bullet in section.bullets" :key="bullet" class="flex gap-3 text-base leading-relaxed text-ink-muted">
              <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-tint" />
              <span>{{ bullet }}</span>
            </li>
          </ul>
          <!-- Wording to copy -->
          <div v-if="section.samples" class="mt-6 grid gap-4" :class="section.samples.length > 1 && 'md:grid-cols-2'">
            <figure v-for="sample in section.samples" :key="sample.label" class="rounded-2xl bg-sand p-6">
              <figcaption class="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                {{ sample.label }}
                <button type="button" class="inline-flex items-center gap-1 rounded-full px-2 py-1 normal-case tracking-normal transition-colors hover:bg-line hover:text-ink" @click="copySample(sample.text)">
                  <UIcon :name="copied === sample.text ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" />
                  {{ copied === sample.text ? more.copied : more.copy }}
                </button>
              </figcaption>
              <blockquote class="mt-4 whitespace-pre-line font-serif text-[15px] leading-relaxed text-ink">{{ sample.text }}</blockquote>
            </figure>
          </div>
        </section>

        <!-- One link, two families: on every guide -->
        <aside class="mt-14 rounded-2xl ring-1 ring-line p-6 md:p-8">
          <p class="mk-eyebrow">{{ more.sidesEyebrow }}</p>
          <h2 class="mt-3 text-xl font-medium text-ink">{{ more.sidesTitle }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ more.sidesText }}</p>
        </aside>
      </article>
    </MarketingMkSection>

    <!-- Side by side -->
    <MarketingMkSection v-if="text.table" :title="text.table.title">
      <div class="overflow-x-auto rounded-2xl ring-1 ring-line">
        <table class="w-full min-w-[540px] text-left text-sm">
          <thead class="bg-sand text-ink">
            <tr>
              <th v-for="(column, i) in text.table.columns" :key="i" scope="col" class="px-4 py-3 font-medium sm:px-6">{{ column }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="row in text.table.rows" :key="row[0]">
              <th scope="row" class="px-4 py-3 align-top font-normal text-ink sm:px-6">{{ row[0] }}</th>
              <td class="px-4 py-3 align-top text-ink sm:px-6">{{ row[1] }}</td>
              <td class="px-4 py-3 align-top text-ink-muted sm:px-6">{{ row[2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </MarketingMkSection>

    <!-- Starting points -->
    <MarketingMkSection id="templates" :title="more.templatesTitle" :description="more.templatesText">
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
        <NuxtLink v-for="template in templates" :key="template.id" :to="`/templates/${template.id}`" class="group block">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <div class="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
              <LazySiteTemplateThumbnail hydrate-on-visible sample :template="template" :scale="0.38" />
            </div>
          </div>
          <h3 class="mt-3 text-sm font-medium text-ink">{{ copy.templates.names[template.id]?.name ?? template.name }}</h3>
        </NuxtLink>
      </div>
    </MarketingMkSection>

    <!-- The steps -->
    <MarketingMkSection :title="text.stepsTitle">
      <ol class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="mt-6 text-base font-medium text-ink">{{ step.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
    </MarketingMkSection>

    <!-- Questions -->
    <MarketingMkSection :title="more.faqTitle">
      <div class="divide-y divide-line border-y border-line">
        <details v-for="item in text.faq" :key="item.q" class="group py-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
            {{ item.q }}
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45" />
          </summary>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{{ item.a }}</p>
        </details>
      </div>
    </MarketingMkSection>

    <!-- Start, and the rest of the guides -->
    <MarketingMkSection>
      <div class="max-w-2xl">
        <h2 class="mk-display text-3xl sm:text-4xl">{{ text.ctaTitle }}</h2>
        <p class="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">{{ text.ctaText }}</p>
        <div class="mt-8">
          <MarketingMkClaimForm topic="wedding" />
        </div>
      </div>
      <p class="mt-14 text-sm font-medium text-ink">{{ more.related }}</p>
      <ul class="mt-4 flex flex-wrap gap-2">
        <li>
          <NuxtLink :to="pillar" class="inline-flex rounded-full bg-ink px-4 py-2 text-sm text-paper transition-opacity hover:opacity-85">{{ more.pillarLink }}</NuxtLink>
        </li>
        <li v-for="other in others" :key="other.id">
          <NuxtLink :to="weddingTopicPath(other, lang)" class="inline-flex rounded-full bg-sand px-4 py-2 text-sm text-ink transition-colors hover:bg-line">{{ other[lang].eyebrow }}</NuxtLink>
        </li>
      </ul>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { ABOUT_PAIR } from '~/data/guides'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { WEDDING_BASE, WEDDING_TOPICS, weddingTopicPath, type WeddingTopic } from '~/data/weddingGuides'

// One guide of the wedding invitation cluster (wording, addressing guests,
// music, online vs paper, bilingual, the 3D room): its own words, wording to
// copy, templates to start from and links back to the pillar and the others
const props = defineProps<{ topic: WeddingTopic }>()

const { lang, home, copy } = useMarketingLang()
const topic = computed(() => props.topic)
const text = computed(() => topic.value[lang.value])
const pillar = computed(() => WEDDING_BASE[lang.value])
const others = computed(() => WEDDING_TOPICS.filter(item => item.id !== topic.value.id))
// Templates still being made are skipped until they exist
const templates = computed(() => topic.value.templates.map(id => PAGE_TEMPLATES.find(item => item.id === id)).filter(item => !!item))
const aboutPath = computed(() => (lang.value === 'vi' ? ABOUT_PAIR[1] : ABOUT_PAIR[0]))

const MORE = {
  en: {
    breadcrumb: 'Breadcrumb',
    pillar: 'Wedding website',
    pillarLink: 'Make a wedding website & online invitation',
    read: (n: number) => `${n} min read`,
    by: 'By',
    updated: 'Updated',
    start: 'Make your invitation free',
    seeTemplates: 'See wedding templates',
    copy: 'Copy',
    copied: 'Copied',
    sidesEyebrow: 'Two families, one link',
    sidesTitle: 'Groom’s side and Bride’s side on one invitation',
    sidesText: 'When each family holds its own ceremony or reception, put both on one page: a Groom’s side tab and a Bride’s side tab, each with its own time and venue. Send each family the link that opens their tab (it ends in ?side=groom or ?side=bride); the letter, photos, guestbook and gift QR are shared.',
    templatesTitle: 'Wedding templates to start from',
    templatesText: 'Each one is a full invitation with a sealed letter, countdown, schedule, venue map, reply form and a 3D room. Swap in your words and photos and send.',
    faqTitle: 'Questions',
    related: 'More wedding invitation guides',
  },
  vi: {
    breadcrumb: 'Đường dẫn',
    pillar: 'Thiệp cưới online',
    pillarLink: 'Tạo thiệp cưới online miễn phí',
    read: (n: number) => `${n} phút đọc`,
    by: 'Bởi',
    updated: 'Cập nhật',
    start: 'Tạo thiệp miễn phí',
    seeTemplates: 'Xem mẫu thiệp cưới',
    copy: 'Sao chép',
    copied: 'Đã chép',
    sidesEyebrow: 'Hai nhà, một link',
    sidesTitle: 'Nhà trai và nhà gái trên cùng một thiệp',
    sidesText: 'Khi mỗi bên tổ chức lễ và tiệc riêng, hãy để cả hai trên một trang: tab "Nhà trai" và tab "Nhà gái", mỗi tab có giờ và địa điểm riêng. Gửi mỗi gia đình link mở sẵn tab của họ (đuôi ?side=groom hoặc ?side=bride); lá thư, ảnh cưới, sổ lưu bút và mã QR mừng cưới dùng chung.',
    templatesTitle: 'Mẫu thiệp cưới để bắt đầu',
    templatesText: 'Mỗi mẫu là một tấm thiệp đầy đủ: lá thư niêm phong, đếm ngược, lịch trình, bản đồ, form xác nhận và phòng 3D. Thay lời và ảnh của hai bạn rồi gửi.',
    faqTitle: 'Câu hỏi',
    related: 'Đọc thêm về thiệp cưới',
  },
}
const more = computed(() => MORE[lang.value])
const updatedLabel = computed(() =>
  new Date(`${topic.value.updated}T00:00:00Z`).toLocaleDateString(lang.value === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
)

// Copy a sample's wording, with a moment of "Copied"
const copied = ref('')
async function copySample(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copied.value = value
    setTimeout(() => {
      if (copied.value === value) copied.value = ''
    }, 2000)
  } catch {
    // No clipboard (insecure context): the text is there to select by hand
  }
}

// ---------- SEO ----------
const pageUrl = computed(() => `${PERLINK_URL}${weddingTopicPath(topic.value, lang.value)}`)
useSeoMeta({
  title: () => text.value.seoTitle,
  description: () => text.value.description,
  ogTitle: () => text.value.seoTitle,
  ogDescription: () => text.value.description,
  ogUrl: () => pageUrl.value,
  ogType: 'article',
  ogSiteName: 'Perlink',
  ogImage: `${PERLINK_URL}/images/og.jpg`,
  twitterCard: 'summary_large_image',
  twitterSite: X_HANDLE,
  articleModifiedTime: () => topic.value.updated,
})
useHead({
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${PERLINK_URL}${weddingTopicPath(topic.value, 'en')}` },
    { rel: 'alternate', hreflang: 'vi', href: `${PERLINK_URL}${weddingTopicPath(topic.value, 'vi')}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${PERLINK_URL}${weddingTopicPath(topic.value, 'en')}` },
  ],
  script: () => [{
    type: 'application/ld+json',
    innerHTML: jsonLd([
      perlinkOrganization(),
      {
        '@type': 'Article',
        '@id': `${pageUrl.value}#article`,
        headline: text.value.title,
        description: text.value.description,
        inLanguage: lang.value,
        url: pageUrl.value,
        mainEntityOfPage: pageUrl.value,
        image: `${PERLINK_URL}/images/og.jpg`,
        datePublished: topic.value.updated,
        dateModified: topic.value.updated,
        author: { '@id': PERLINK_ORG_ID },
        publisher: { '@id': PERLINK_ORG_ID },
        about: { '@id': PERLINK_APP_ID },
        isPartOf: { '@type': 'WebPage', '@id': `${PERLINK_URL}${WEDDING_BASE[lang.value]}`, url: `${PERLINK_URL}${WEDDING_BASE[lang.value]}` },
      },
      breadcrumbs([
        { name: 'Perlink', url: `${PERLINK_URL}${home.value === '/' ? '' : home.value}` },
        { name: more.value.pillar, url: `${PERLINK_URL}${WEDDING_BASE[lang.value]}` },
        { name: text.value.eyebrow, url: pageUrl.value },
      ]),
    ]),
  }],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
