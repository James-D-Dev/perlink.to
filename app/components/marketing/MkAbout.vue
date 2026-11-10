<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="max-w-3xl">
        <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
        <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
        <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
      </div>
    </MarketingMkSection>

    <MarketingMkSection v-for="section in text.sections" :key="section.title" :title="section.title">
      <div class="max-w-3xl space-y-4">
        <p v-for="(paragraph, i) in section.paragraphs" :key="i" class="text-base leading-relaxed text-ink-muted md:text-lg">{{ paragraph }}</p>
      </div>
    </MarketingMkSection>

    <!-- In numbers: only what the product itself counts -->
    <MarketingMkSection :title="text.factsTitle">
      <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="fact in facts" :key="fact.label" class="rounded-2xl bg-sand p-6">
          <dt class="text-sm text-ink-muted">{{ fact.label }}</dt>
          <dd class="mk-display mt-2 text-3xl">{{ fact.value }}</dd>
        </div>
      </dl>
    </MarketingMkSection>

    <MarketingMkSection :title="text.contactTitle">
      <div class="max-w-3xl">
        <p class="text-base leading-relaxed text-ink-muted md:text-lg">{{ text.contactText }}</p>
        <ul class="mt-6 space-y-3 text-base">
          <li class="flex items-center gap-3">
            <UIcon name="i-lucide-mail" class="size-4 text-ink-muted" />
            <a :href="`mailto:${SUPPORT_EMAIL}`" class="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{{ SUPPORT_EMAIL }}</a>
          </li>
          <li class="flex items-center gap-3">
            <UIcon name="i-simple-icons-x" class="size-4 text-ink-muted" />
            <a :href="X_URL" target="_blank" rel="me noopener" class="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{{ X_HANDLE }}</a>
          </li>
          <li class="flex items-center gap-3">
            <UIcon name="i-lucide-flag" class="size-4 text-ink-muted" />
            <NuxtLink to="/report" class="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{{ text.report }}</NuxtLink>
          </li>
        </ul>
        <div class="mt-10 flex flex-wrap gap-3">
          <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ text.start }}</MarketingMkButton>
          <MarketingMkButton to="/pricing" variant="outline">{{ text.pricing }}</MarketingMkButton>
        </div>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { ABOUT_PAIR } from '~/data/guides'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

// Who makes Perlink, why, and how it pays for itself: the page search engines
// and AI assistants look for to know who stands behind the product
const { lang } = useMarketingLang()

const TEXT = {
  en: {
    seoTitle: 'About Perlink — Who makes it and why',
    description: 'Perlink is a personal website and link in bio builder where every page can also be a 3D world. Made in Vietnam by Hoang Kim Duc since 2026.',
    eyebrow: 'About',
    title: 'A website for everyone, and a world to walk into',
    intro: 'Perlink lets anyone make a personal website, a link in bio page or a small business site in minutes, and open the same page as a 3D room visitors can walk around. It works in English and Vietnamese, and it is free to start.',
    sections: [
      {
        title: 'Why Perlink exists',
        paragraphs: [
          'Most people and small businesses don’t need a big website. They need one good page: who they are, what they offer, how to reach them. Yet the tools for that tend to be either a plain list of links or a website builder that takes a weekend to learn.',
          'Perlink sits in between. You start from a template made for your kind of page (a café menu, a CV, a wedding invitation, a homestay), change the words and photos, and publish. Then, because a page can be more than a page, Perlink turns it into a little 3D world on an island, a sakura garden or a city at night, with music, clickable objects and a guestbook.',
        ],
      },
      {
        title: 'Who makes it',
        paragraphs: [
          'Perlink is made and run by Hoang Kim Duc, an independent developer based in Vietnam, and has been in development since 2026. It is a small, independent product: the same person writes the code, answers support emails and reads every report.',
          'That is also why Perlink is built in both English and Vietnamese from the start, with prices in US dollars and Vietnamese dong, and payment options for both.',
        ],
      },
      {
        title: 'How Perlink pays for itself',
        paragraphs: [
          'Perlink has a free plan with no time limit. It is paid for by people who need more: the Starter, Plus and Max plans add more live sites, Pro themes, custom domains and longer analytics, and themed 3D room packs are sold once.',
          'Every payment comes with a 7-day money-back guarantee, and your content stays yours: you can edit, unpublish or delete it at any time.',
        ],
      },
    ],
    factsTitle: 'Perlink at a glance',
    facts: { templates: 'Ready-made templates', lands: '3D lands', languages: 'Languages', since: 'Since' },
    contactTitle: 'Get in touch',
    contactText: 'Questions, ideas or a problem with your site? Write any time.',
    report: 'Report a site that breaks the rules',
    start: 'Start free',
    pricing: 'See pricing',
  },
  vi: {
    seoTitle: 'Giới thiệu Perlink — Ai làm và vì sao',
    description: 'Perlink là công cụ tạo website cá nhân và link bio, nơi trang nào cũng có thể thành một thế giới 3D. Do Hoàng Kim Đức làm tại Việt Nam từ năm 2026.',
    eyebrow: 'Giới thiệu',
    title: 'Một trang web cho mọi người, và một thế giới để bước vào',
    intro: 'Perlink giúp bất kỳ ai tạo website cá nhân, trang link bio hay trang cho cửa hàng nhỏ trong vài phút, và mở chính trang đó thành một căn phòng 3D để khách đi dạo. Perlink có tiếng Việt và tiếng Anh, bắt đầu miễn phí.',
    sections: [
      {
        title: 'Vì sao có Perlink',
        paragraphs: [
          'Phần lớn mọi người và cửa hàng nhỏ không cần một website đồ sộ. Họ cần một trang thật tốt: mình là ai, có gì, liên hệ ra sao. Nhưng công cụ hiện có thường hoặc chỉ là danh sách link đơn điệu, hoặc là trình tạo web mất cả cuối tuần mới học xong.',
          'Perlink nằm ở giữa. Bạn bắt đầu từ một mẫu làm riêng cho loại trang của mình (thực đơn quán cà phê, CV, thiệp cưới, homestay), thay chữ và ảnh rồi xuất bản. Và vì một trang có thể hơn một trang, Perlink biến nó thành một thế giới 3D nhỏ trên đảo, trong vườn hoa anh đào hay giữa thành phố về đêm, có nhạc, đồ vật bấm được và sổ lưu bút.',
        ],
      },
      {
        title: 'Ai làm Perlink',
        paragraphs: [
          'Perlink do Hoàng Kim Đức, một lập trình viên độc lập tại Việt Nam, xây dựng và vận hành, bắt đầu từ năm 2026. Đây là một sản phẩm nhỏ và độc lập: cùng một người viết code, trả lời email hỗ trợ và đọc từng báo cáo vi phạm.',
          'Đó cũng là lý do Perlink có tiếng Việt và tiếng Anh ngay từ đầu, với giá bằng đô la Mỹ và đồng Việt Nam, cùng cách thanh toán cho cả hai.',
        ],
      },
      {
        title: 'Perlink sống bằng gì',
        paragraphs: [
          'Perlink có gói Miễn phí không giới hạn thời gian. Chi phí được trả bởi những người cần nhiều hơn: các gói Starter, Plus và Max có thêm trang đang hoạt động, theme Pro, tên miền riêng và thống kê dài hơn, còn cửa hàng 3D bán các gói phòng 3D theo chủ đề.',
          'Mọi khoản thanh toán đều được hoàn tiền trong 7 ngày, và nội dung luôn là của bạn: bạn có thể sửa, gỡ hoặc xoá bất cứ lúc nào.',
        ],
      },
    ],
    factsTitle: 'Perlink trong vài con số',
    facts: { templates: 'Mẫu có sẵn', lands: 'Vùng đất 3D', languages: 'Ngôn ngữ', since: 'Từ năm' },
    contactTitle: 'Liên hệ',
    contactText: 'Có câu hỏi, ý tưởng hay trang gặp sự cố? Cứ viết cho Perlink bất cứ lúc nào.',
    report: 'Báo cáo trang vi phạm',
    start: 'Bắt đầu miễn phí',
    pricing: 'Xem bảng giá',
  },
}
const text = computed(() => TEXT[lang.value])
const facts = computed(() => [
  { label: text.value.facts.templates, value: `${PAGE_TEMPLATES.length}` },
  { label: text.value.facts.lands, value: '11' },
  { label: text.value.facts.languages, value: '2' },
  { label: text.value.facts.since, value: '2026' },
])

// ---------- SEO ----------
const path = computed(() => (lang.value === 'vi' ? ABOUT_PAIR[1] : ABOUT_PAIR[0]))
const pageUrl = computed(() => `${PERLINK_URL}${path.value}`)
useSeoMeta({
  title: () => text.value.seoTitle,
  description: () => text.value.description,
  ogTitle: () => text.value.seoTitle,
  ogDescription: () => text.value.description,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogImage: `${PERLINK_URL}/images/og.jpg`,
  twitterCard: 'summary_large_image',
  twitterSite: X_HANDLE,
})
useHead({
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${PERLINK_URL}${ABOUT_PAIR[0]}` },
    { rel: 'alternate', hreflang: 'vi', href: `${PERLINK_URL}${ABOUT_PAIR[1]}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${PERLINK_URL}${ABOUT_PAIR[0]}` },
  ],
  script: () => [{
    type: 'application/ld+json',
    innerHTML: jsonLd([
      perlinkOrganization(text.value.description),
      perlinkApp(text.value.description),
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl.value}#page`,
        url: pageUrl.value,
        name: text.value.seoTitle,
        description: text.value.description,
        inLanguage: lang.value,
        about: { '@id': PERLINK_ORG_ID },
        isPartOf: { '@id': PERLINK_WEBSITE_ID },
      },
    ]),
  }],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
