<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
          <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
          <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
          <div class="mt-8">
            <MarketingMkClaimForm />
          </div>
          <p class="mt-4 text-sm text-ink-muted">{{ text.note }}</p>
        </div>
        <img
          src="/images/landing/island.webp"
          srcset="/images/landing/island-720.webp 720w, /images/landing/island-1080.webp 1080w, /images/landing/island.webp 1440w"
          sizes="(min-width: 1024px) 50vw, 100vw"
          width="1440"
          height="757"
          :alt="text.heroAlt"
          class="aspect-[4/3] w-full rounded-2xl object-cover"
          fetchpriority="high"
        >
      </div>
    </MarketingMkSection>

    <!-- One address, two ways to look at it -->
    <MarketingMkSection :title="text.twoTitle" :description="text.twoText">
      <div class="grid gap-4 md:grid-cols-2">
        <div v-reveal class="flex flex-col rounded-2xl bg-sand p-6 md:p-8">
          <p class="text-sm font-medium text-ink">{{ text.pageLabel }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ text.pageText }}</p>
          <div class="mt-8 flex flex-1 items-end justify-center">
            <div class="w-[62%] max-w-[260px] overflow-hidden rounded-t-[28px] border-x-[6px] border-t-[6px] border-ink bg-white shadow-[0_20px_50px_rgba(12,11,10,0.15)]">
              <div class="aspect-[3/4] w-full" role="img" :aria-label="text.pageAlt">
                <LazySiteTemplateThumbnail hydrate-on-visible :template="portfolioTemplate" :scale="0.5" />
              </div>
            </div>
          </div>
        </div>
        <div v-reveal="120" class="flex flex-col rounded-2xl bg-sand p-6 md:p-8">
          <p class="text-sm font-medium text-ink">{{ text.roomLabel }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ text.roomText }}</p>
          <div class="mt-8 flex flex-1 items-end">
            <img
              src="/images/landing/city-night.webp"
              srcset="/images/landing/city-night-720.webp 720w, /images/landing/city-night-1080.webp 1080w, /images/landing/city-night.webp 1440w"
              sizes="(min-width: 768px) 50vw, 100vw"
              width="1440"
              height="757"
              :alt="text.roomAlt"
              class="aspect-[4/3] w-full rounded-xl object-cover"
              loading="lazy"
            >
          </div>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Why a 3D portfolio -->
    <MarketingMkSection :title="text.whyTitle" :description="text.whyText">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, i) in text.why" :key="item.title" v-reveal="(i % 3) * 90" class="rounded-2xl bg-sand p-6">
          <UIcon :name="item.icon" class="size-5 text-ink" />
          <h3 class="mt-4 text-base font-medium text-ink">{{ item.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Portfolio templates -->
    <MarketingMkSection :title="text.templatesTitle" :description="text.templatesText">
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        <NuxtLink v-for="(template, i) in portfolioTemplates" :key="template.id" v-reveal="(i % 4) * 90" :to="`/templates/${template.id}`" class="group block">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <div class="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
              <LazySiteTemplateThumbnail hydrate-on-visible :template="template" :scale="0.38" />
            </div>
          </div>
          <h3 class="mt-3 text-sm font-medium text-ink">{{ copy.templates.names[template.id]?.name ?? template.name }}</h3>
          <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">{{ copy.templates.names[template.id]?.description ?? template.description }}</p>
        </NuxtLink>
      </div>
    </MarketingMkSection>

    <!-- Code it yourself, or not -->
    <MarketingMkSection :title="text.compareTitle">
      <div v-reveal class="overflow-hidden rounded-2xl ring-1 ring-line">
        <table class="w-full text-left text-sm">
          <thead class="bg-sand text-ink">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium sm:px-6" />
              <th scope="col" class="px-4 py-3 font-medium sm:px-6">Perlink</th>
              <th scope="col" class="px-4 py-3 font-medium sm:px-6">{{ text.codeColumn }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="row in text.rows" :key="row.label">
              <th scope="row" class="px-4 py-3 font-normal text-ink sm:px-6">{{ row.label }}</th>
              <td class="px-4 py-3 text-ink sm:px-6">{{ row.perlink }}</td>
              <td class="px-4 py-3 text-ink-muted sm:px-6">{{ row.code }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </MarketingMkSection>

    <!-- How -->
    <MarketingMkSection :title="text.stepsTitle">
      <ol class="grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" v-reveal="i * 110" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">0{{ i + 1 }}</span>
          <p class="mt-6 text-base font-medium text-ink">{{ step.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
      <div class="mt-10 flex flex-wrap gap-3">
        <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ text.cta }}</MarketingMkButton>
        <MarketingMkButton :to="lang === 'vi' ? '/vi/templates' : '/templates'" variant="outline">{{ text.templates }}</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- Questions -->
    <MarketingMkSection :title="text.faqTitle">
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
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

// "3D portfolio website": an address per language (/3d-portfolio,
// /vi/portfolio-3d), for people who want a portfolio that stands out
// without coding one in Three.js
const { lang, copy } = useMarketingLang()

const PORTFOLIO_IDS = ['personal', 'creator', 'musician', 'wedding-photo']
const portfolioTemplates = PORTFOLIO_IDS.map(id => PAGE_TEMPLATES.find(item => item.id === id)).filter(item => !!item)
const portfolioTemplate = portfolioTemplates[0]!

const TEXT = {
  en: {
    metaTitle: '3D Portfolio Website Builder, No Code | Perlink',
    metaDescription: 'Make a 3D portfolio website without code. Your work as a clean page and as a 3D room visitors can walk around. Free templates, ready in minutes.',
    eyebrow: '3D portfolio website',
    title: 'A 3D portfolio website, without writing code',
    intro: 'Show your work as a clean portfolio page and as a small 3D room people can walk around, with your projects on the walls. Pick a template, add your work, publish at perlink.to/you. No Three.js, no Blender, no hosting to set up.',
    note: 'Free to start · Works on phones · English and Vietnamese',
    heroAlt: 'A Perlink 3D room on a floating island',
    twoTitle: 'One address, two ways to see your work',
    twoText: 'Visitors land on a fast portfolio page that works everywhere. One tap takes them into your 3D room.',
    pageLabel: 'The portfolio page',
    pageText: 'About you, selected work, links and contact. Quick to load and easy to read on any phone.',
    pageAlt: 'A personal portfolio page made with Perlink',
    roomLabel: 'The 3D room',
    roomText: 'The same page as a room on a floating land, by day or night, with music and things to tap.',
    roomAlt: 'A Perlink 3D room at night in a city',
    whyTitle: 'Why a 3D portfolio',
    whyText: 'A portfolio is there to be remembered. A room people can explore does that better than another grid of thumbnails.',
    why: [
      { icon: 'i-lucide-sparkles', title: 'Stand out', text: 'Recruiters and clients see dozens of portfolios a day. Yours is the one they walked around in.' },
      { icon: 'i-lucide-image', title: 'Your work on the walls', text: 'Hang your photos, artwork and project shots in the room, and keep the full gallery on the page.' },
      { icon: 'i-lucide-smartphone', title: 'Made for phones', text: 'The room adapts to the device, and the page opens instantly, so a link from Instagram or TikTok just works.' },
      { icon: 'i-lucide-clapperboard', title: 'A video of your room', text: 'Record a vertical tour of your room for TikTok, Reels and Shorts, right from the editor.' },
      { icon: 'i-lucide-search', title: 'Found on Google', text: 'The portfolio page is a real web page with its own title and description, ready for search engines.' },
      { icon: 'i-lucide-chart-column', title: 'See who visits', text: 'Visits and clicks per site, and a QR code for your CV or business card.' },
    ],
    templatesTitle: 'Portfolio templates',
    templatesText: 'Start from one of these. Each comes with sample work, a theme and a matching 3D room.',
    compareTitle: 'Perlink or coding it yourself',
    codeColumn: 'Coding it yourself',
    rows: [
      { label: 'Time to a live portfolio', perlink: 'Minutes', code: 'Days to weeks' },
      { label: 'Three.js, Blender or WebGL skills', perlink: 'Not needed', code: 'Needed' },
      { label: 'Hosting and a web address', perlink: 'Included (perlink.to/you)', code: 'You set them up' },
      { label: 'Updating your work', perlink: 'In the editor, on phone or computer', code: 'Change the code and deploy' },
      { label: 'A plain page for slow phones and search engines', perlink: 'Built in', code: 'You build it too' },
    ],
    stepsTitle: 'Make yours in three steps',
    steps: [
      { title: 'Pick a portfolio template', text: 'Choose your address and a template for designers, artists, photographers or musicians.' },
      { title: 'Add your work', text: 'Your name, a line about you, projects, photos and links. Arrange the room and pick its land.' },
      { title: 'Publish and share', text: 'Put perlink.to/you in your bio, CV and email signature, and post a video of your room.' },
    ],
    cta: 'Make your 3D portfolio',
    templates: 'Browse all templates',
    faqTitle: 'Questions',
    faq: [
      { q: 'Do I need to know Three.js or how to code?', a: 'No. Perlink builds the 3D room for you. You pick a template, then edit your page and arrange your room in a visual editor.' },
      { q: 'Is it free?', a: 'Yes. The free plan includes one site with a portfolio page, a 3D room and analytics. Paid plans add more sites, Pro themes and longer analytics.' },
      { q: 'Can I show my own projects and photos?', a: 'Yes. Add photo albums, videos, links and descriptions to the page, and hang your pictures in the 3D room.' },
      { q: 'Does it work on phones?', a: 'Yes. The page is built for phones first, and the 3D room adjusts its quality to the device so it stays smooth.' },
      { q: 'Will people who don’t want 3D still see my work?', a: 'Yes. Your portfolio is a normal web page first; the 3D room is one tap away. You can also make the room open first.' },
      { q: 'Can I use my own domain?', a: 'Custom domains are coming soon. For now your portfolio lives at perlink.to/yourname, which you choose.' },
    ],
  },
  vi: {
    metaTitle: 'Tạo website portfolio 3D không cần code | Perlink',
    metaDescription: 'Tạo website portfolio 3D không cần lập trình. Tác phẩm của bạn vừa là trang portfolio gọn gàng, vừa là phòng 3D để khách dạo quanh. Mẫu miễn phí.',
    eyebrow: 'Website portfolio 3D',
    title: 'Website portfolio 3D, không cần viết code',
    intro: 'Trưng bày tác phẩm trên một trang portfolio gọn gàng và trong một căn phòng 3D nhỏ để mọi người dạo quanh, với dự án của bạn treo trên tường. Chọn mẫu, thêm tác phẩm, đăng tại perlink.to/tên-bạn. Không cần Three.js, Blender hay tự thuê hosting.',
    note: 'Miễn phí để bắt đầu · Chạy tốt trên điện thoại · Tiếng Việt và tiếng Anh',
    heroAlt: 'Một phòng 3D Perlink trên hòn đảo lơ lửng',
    twoTitle: 'Một địa chỉ, hai cách xem tác phẩm',
    twoText: 'Khách vào một trang portfolio tải nhanh, xem được ở mọi nơi. Chạm một lần là vào phòng 3D của bạn.',
    pageLabel: 'Trang portfolio',
    pageText: 'Giới thiệu, tác phẩm tiêu biểu, liên kết và liên hệ. Tải nhanh, dễ đọc trên mọi điện thoại.',
    pageAlt: 'Một trang portfolio cá nhân làm bằng Perlink',
    roomLabel: 'Phòng 3D',
    roomText: 'Chính trang đó thành một căn phòng trên vùng đất lơ lửng, ngày hoặc đêm, có nhạc và đồ vật bấm được.',
    roomAlt: 'Một phòng 3D Perlink giữa thành phố về đêm',
    whyTitle: 'Vì sao nên có portfolio 3D',
    whyText: 'Portfolio sinh ra để được nhớ đến. Một căn phòng để khám phá làm việc đó tốt hơn thêm một lưới ảnh nữa.',
    why: [
      { icon: 'i-lucide-sparkles', title: 'Nổi bật', text: 'Nhà tuyển dụng và khách hàng xem hàng chục portfolio mỗi ngày. Portfolio của bạn là cái họ được dạo quanh.' },
      { icon: 'i-lucide-image', title: 'Tác phẩm treo trên tường', text: 'Treo ảnh, tranh và hình dự án trong phòng, giữ bộ sưu tập đầy đủ trên trang.' },
      { icon: 'i-lucide-smartphone', title: 'Làm cho điện thoại', text: 'Phòng tự điều chỉnh theo máy, trang mở ngay, nên link từ Instagram hay TikTok luôn chạy tốt.' },
      { icon: 'i-lucide-clapperboard', title: 'Video căn phòng', text: 'Quay video dọc dạo quanh phòng cho TikTok, Reels và Shorts ngay trong trình chỉnh sửa.' },
      { icon: 'i-lucide-search', title: 'Tìm thấy trên Google', text: 'Trang portfolio là một trang web thật, có tiêu đề và mô tả riêng, sẵn sàng cho công cụ tìm kiếm.' },
      { icon: 'i-lucide-chart-column', title: 'Biết ai ghé thăm', text: 'Lượt xem và lượt bấm cho từng trang, kèm mã QR để in lên CV hay danh thiếp.' },
    ],
    templatesTitle: 'Mẫu portfolio',
    templatesText: 'Bắt đầu từ một trong các mẫu này. Mỗi mẫu có sẵn tác phẩm mẫu, giao diện và phòng 3D đi kèm.',
    compareTitle: 'Dùng Perlink hay tự lập trình',
    codeColumn: 'Tự lập trình',
    rows: [
      { label: 'Thời gian để portfolio lên mạng', perlink: 'Vài phút', code: 'Vài ngày đến vài tuần' },
      { label: 'Kỹ năng Three.js, Blender, WebGL', perlink: 'Không cần', code: 'Cần' },
      { label: 'Hosting và địa chỉ web', perlink: 'Có sẵn (perlink.to/tên-bạn)', code: 'Tự thiết lập' },
      { label: 'Cập nhật tác phẩm', perlink: 'Trong trình chỉnh sửa, trên điện thoại hay máy tính', code: 'Sửa code và triển khai lại' },
      { label: 'Trang thường cho máy yếu và công cụ tìm kiếm', perlink: 'Có sẵn', code: 'Phải tự làm thêm' },
    ],
    stepsTitle: 'Làm portfolio của bạn trong ba bước',
    steps: [
      { title: 'Chọn mẫu portfolio', text: 'Chọn địa chỉ và một mẫu cho designer, họa sĩ, nhiếp ảnh gia hay nhạc sĩ.' },
      { title: 'Thêm tác phẩm', text: 'Tên, một câu giới thiệu, dự án, ảnh và liên kết. Sắp xếp căn phòng và chọn vùng đất.' },
      { title: 'Đăng và chia sẻ', text: 'Đặt perlink.to/tên-bạn vào bio, CV và chữ ký email, rồi đăng video căn phòng.' },
    ],
    cta: 'Tạo portfolio 3D',
    templates: 'Xem tất cả mẫu',
    faqTitle: 'Câu hỏi',
    faq: [
      { q: 'Tôi có cần biết Three.js hay lập trình không?', a: 'Không. Perlink dựng phòng 3D cho bạn. Bạn chọn mẫu, rồi chỉnh trang và sắp xếp phòng bằng trình chỉnh sửa trực quan.' },
      { q: 'Có miễn phí không?', a: 'Có. Gói miễn phí gồm một trang với portfolio, phòng 3D và thống kê. Gói trả phí có thêm trang, theme Pro và thống kê dài hơn.' },
      { q: 'Tôi có đưa dự án và ảnh của mình lên được không?', a: 'Được. Thêm album ảnh, video, liên kết và mô tả vào trang, và treo ảnh của bạn trong phòng 3D.' },
      { q: 'Có chạy trên điện thoại không?', a: 'Có. Trang được làm cho điện thoại trước tiên, phòng 3D tự chỉnh chất lượng theo máy để luôn mượt.' },
      { q: 'Người không thích 3D có xem được tác phẩm không?', a: 'Được. Portfolio của bạn trước hết là một trang web bình thường; phòng 3D chỉ cách một lần chạm. Bạn cũng có thể cho phòng mở trước.' },
      { q: 'Tôi có dùng tên miền riêng được không?', a: 'Tên miền riêng sắp ra mắt. Hiện portfolio của bạn ở perlink.to/tên-bạn, do bạn tự chọn.' },
    ],
  },
}
const text = computed(() => TEXT[lang.value])

// ---------- SEO ----------
const SITE = 'https://perlink.to'
const pageUrl = computed(() => `${SITE}${lang.value === 'vi' ? '/vi/portfolio-3d' : '/3d-portfolio'}`)
useSeoMeta({
  title: () => text.value.metaTitle,
  description: () => text.value.metaDescription,
  ogTitle: () => text.value.metaTitle,
  ogDescription: () => text.value.metaDescription,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogImage: `${SITE}/images/og.jpg`,
  twitterCard: 'summary_large_image',
})
useHead({
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${SITE}/3d-portfolio` },
    { rel: 'alternate', hreflang: 'vi', href: `${SITE}/vi/portfolio-3d` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}/3d-portfolio` },
  ],
  // The product and the questions, for search results
  script: () => [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Perlink',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        url: pageUrl.value,
        description: text.value.metaDescription,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: lang.value,
        mainEntity: text.value.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ]).replace(/</g, '\\u003c'),
  }],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
