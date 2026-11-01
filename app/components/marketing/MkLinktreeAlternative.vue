<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="max-w-3xl">
        <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
        <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
        <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
        <div class="mt-8">
          <MarketingMkClaimForm />
        </div>
      </div>
    </MarketingMkSection>

    <!-- At a glance: only what's certain about both -->
    <MarketingMkSection :title="text.glanceTitle">
      <div v-reveal class="overflow-hidden rounded-2xl ring-1 ring-line">
        <table class="w-full text-left text-sm">
          <thead class="bg-sand text-ink">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium sm:px-6" />
              <th scope="col" class="px-4 py-3 font-medium sm:px-6">Perlink</th>
              <th scope="col" class="px-4 py-3 font-medium sm:px-6">Linktree</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="row in text.rows" :key="row.label">
              <th scope="row" class="px-4 py-3 font-normal text-ink sm:px-6">{{ row.label }}</th>
              <td class="px-4 py-3 sm:px-6"><span :class="row.perlink === '✓' ? 'text-emerald-700' : 'text-ink-muted'">{{ row.perlink }}</span></td>
              <td class="px-4 py-3 sm:px-6"><span :class="row.linktree === '✓' ? 'text-emerald-700' : 'text-ink-muted'">{{ row.linktree }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4 text-xs text-ink-faint">{{ text.disclaimer }}</p>
    </MarketingMkSection>

    <!-- What a Perlink page can hold -->
    <MarketingMkSection :title="text.featuresTitle" :description="text.featuresText">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(feature, i) in text.features" :key="feature.title" v-reveal="(i % 3) * 90" class="rounded-2xl bg-sand p-6">
          <UIcon :name="feature.icon" class="size-5 text-ink" />
          <h3 class="mt-4 text-base font-medium text-ink">{{ feature.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ feature.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Which one fits -->
    <MarketingMkSection :title="text.choiceTitle">
      <div class="grid gap-4 md:grid-cols-2">
        <div v-reveal class="rounded-2xl p-6 ring-1 ring-line">
          <h3 class="text-base font-medium text-ink">{{ text.linktreeFits }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ text.linktreeFitsText }}</p>
        </div>
        <div v-reveal="110" class="rounded-2xl bg-sand p-6">
          <h3 class="text-base font-medium text-ink">{{ text.perlinkFits }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ text.perlinkFitsText }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Switching -->
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
// "Linktree alternative": an address per language (/linktree-alternative,
// /vi/thay-the-linktree). Only says of Linktree what's plainly true; the
// rest is about Perlink.
const { lang } = useMarketingLang()

const TEXT = {
  en: {
    metaTitle: 'Linktree Alternative: Free Link in Bio + Website | Perlink',
    metaDescription: 'Looking for a Linktree alternative? Perlink gives you a free link in bio page that grows into a full website: menus, shop, blog and a walkable 3D room.',
    eyebrow: 'Linktree alternative',
    title: 'A Linktree alternative that grows into a whole website',
    intro: 'Linktree puts your links on one page. Perlink does that too, and lets the same page become a full website, with menus, products, bookings, photos and a blog, that visitors can also walk around in 3D.',
    glanceTitle: 'Perlink vs Linktree at a glance',
    rows: [
      { label: 'Link in bio page', perlink: '✓', linktree: '✓' },
      { label: 'Free to start', perlink: '✓', linktree: '✓' },
      { label: 'Your page as a walkable 3D room', perlink: '✓', linktree: '—' },
      { label: 'Room video for TikTok, Reels and Shorts', perlink: '✓', linktree: '—' },
      { label: 'Vietnamese interface and templates', perlink: '✓', linktree: '—' },
    ],
    disclaimer: 'Linktree is a trademark of its owner. This comparison is based on public information as of November 2026; check linktr.ee for its current features.',
    featuresTitle: 'More than a list of links',
    featuresText: 'Every Perlink page starts as a link in bio and can hold everything a small website needs.',
    features: [
      { icon: 'i-lucide-link', title: 'Links and socials', text: 'Your links, socials and contact buttons, laid out for phones first.' },
      { icon: 'i-lucide-utensils', title: 'Menus and opening hours', text: 'A menu with prices, opening hours and a booking form for restaurants and cafés.' },
      { icon: 'i-lucide-shopping-bag', title: 'Products and payments', text: 'Show products, take requests by form and add a VietQR code for bank transfers.' },
      { icon: 'i-lucide-images', title: 'Photos, videos and a blog', text: 'Albums, videos, testimonials and blog posts on the same address.' },
      { icon: 'i-lucide-box', title: 'A 3D room', text: 'Turn the page into a room on one of 11 lands, by day or night, with music and clickable objects.' },
      { icon: 'i-lucide-chart-column', title: 'Analytics and QR codes', text: 'See visits and clicks, and print a QR code that opens your page.' },
    ],
    choiceTitle: 'Which one fits you',
    linktreeFits: 'Linktree fits if…',
    linktreeFitsText: 'you only need a short list of links under your profile and nothing else.',
    perlinkFits: 'Perlink fits if…',
    perlinkFitsText: 'you want your bio link to be a real website for your work, restaurant, hotel or shop, in English or Vietnamese, with a 3D room that makes people stop scrolling.',
    stepsTitle: 'Switch in a few minutes',
    steps: [
      { title: 'Claim your name', text: 'Pick perlink.to/yourname and a template that fits.' },
      { title: 'Add your links', text: 'Paste the links you have now, then add a menu, products or photos if you like.' },
      { title: 'Update your bio', text: 'Put your new perlink.to link in your Instagram, TikTok and Facebook bio.' },
    ],
    cta: 'Create your page free',
    templates: 'Browse templates',
    faqTitle: 'Questions',
    faq: [
      { q: 'Is Perlink free?', a: 'Yes. The free plan includes one site with a link in bio page, a 3D room and analytics. Paid plans add more sites, Pro themes and your own domain.' },
      { q: 'Can I use my own domain?', a: 'Yes, on the Plus plan and above you can connect your own domain to your site.' },
      { q: 'Do I need to know how to code?', a: 'No. You pick a template and edit everything in a drag-and-drop editor, on your phone or computer.' },
      { q: 'What is the 3D room?', a: 'Your page shown as a small room on a floating land that visitors can look around, with your links and blocks as objects they can tap.' },
    ],
  },
  vi: {
    metaTitle: 'Thay thế Linktree: Link bio + trang web miễn phí | Perlink',
    metaDescription: 'Tìm giải pháp thay thế Linktree? Perlink cho bạn link bio miễn phí, mở rộng thành trang web đầy đủ: thực đơn, cửa hàng, blog và phòng 3D dạo được.',
    eyebrow: 'Thay thế Linktree',
    title: 'Giải pháp thay thế Linktree, lớn dần thành cả một trang web',
    intro: 'Linktree đặt các liên kết của bạn lên một trang. Perlink cũng vậy, và còn cho chính trang đó trở thành một trang web đầy đủ, có thực đơn, sản phẩm, đặt chỗ, ảnh và blog, mà khách còn có thể dạo quanh trong không gian 3D.',
    glanceTitle: 'So sánh nhanh Perlink và Linktree',
    rows: [
      { label: 'Trang link bio', perlink: '✓', linktree: '✓' },
      { label: 'Bắt đầu miễn phí', perlink: '✓', linktree: '✓' },
      { label: 'Trang của bạn thành phòng 3D dạo được', perlink: '✓', linktree: '—' },
      { label: 'Video phòng cho TikTok, Reels, Shorts', perlink: '✓', linktree: '—' },
      { label: 'Giao diện và mẫu tiếng Việt', perlink: '✓', linktree: '—' },
    ],
    disclaimer: 'Linktree là nhãn hiệu của chủ sở hữu. So sánh dựa trên thông tin công khai tính đến tháng 11/2026; xem linktr.ee để biết tính năng hiện tại.',
    featuresTitle: 'Không chỉ là danh sách liên kết',
    featuresText: 'Mỗi trang Perlink bắt đầu là một link bio và có thể chứa mọi thứ một trang web nhỏ cần.',
    features: [
      { icon: 'i-lucide-link', title: 'Liên kết và mạng xã hội', text: 'Liên kết, mạng xã hội và nút liên hệ, trình bày ưu tiên cho điện thoại.' },
      { icon: 'i-lucide-utensils', title: 'Thực đơn và giờ mở cửa', text: 'Thực đơn có giá, giờ mở cửa và form đặt bàn cho nhà hàng, quán cà phê.' },
      { icon: 'i-lucide-shopping-bag', title: 'Sản phẩm và thanh toán', text: 'Trưng bày sản phẩm, nhận yêu cầu qua form và thêm mã VietQR để nhận chuyển khoản.' },
      { icon: 'i-lucide-images', title: 'Ảnh, video và blog', text: 'Album ảnh, video, đánh giá và bài viết blog ngay trên cùng một địa chỉ.' },
      { icon: 'i-lucide-box', title: 'Phòng 3D', text: 'Biến trang thành một căn phòng trên 11 vùng đất, ngày hoặc đêm, có nhạc và đồ vật bấm được.' },
      { icon: 'i-lucide-chart-column', title: 'Thống kê và mã QR', text: 'Xem lượt truy cập, lượt bấm và in mã QR mở thẳng trang của bạn.' },
    ],
    choiceTitle: 'Cái nào hợp với bạn',
    linktreeFits: 'Linktree hợp nếu…',
    linktreeFitsText: 'bạn chỉ cần một danh sách liên kết ngắn dưới hồ sơ, không gì thêm.',
    perlinkFits: 'Perlink hợp nếu…',
    perlinkFitsText: 'bạn muốn link bio là một trang web thật cho công việc, nhà hàng, khách sạn hay cửa hàng, bằng tiếng Việt hoặc tiếng Anh, với một phòng 3D khiến người xem dừng lướt.',
    stepsTitle: 'Chuyển sang trong vài phút',
    steps: [
      { title: 'Giữ tên của bạn', text: 'Chọn perlink.to/tên-bạn và một mẫu phù hợp.' },
      { title: 'Thêm liên kết', text: 'Dán các liên kết bạn đang có, rồi thêm thực đơn, sản phẩm hay ảnh nếu muốn.' },
      { title: 'Cập nhật bio', text: 'Đặt link perlink.to mới vào bio Instagram, TikTok và Facebook.' },
    ],
    cta: 'Tạo trang miễn phí',
    templates: 'Xem các mẫu',
    faqTitle: 'Câu hỏi',
    faq: [
      { q: 'Perlink có miễn phí không?', a: 'Có. Gói miễn phí gồm một trang với link bio, phòng 3D và thống kê. Gói trả phí có thêm trang, theme Pro và tên miền riêng.' },
      { q: 'Tôi có dùng tên miền riêng được không?', a: 'Được, từ gói Plus trở lên bạn có thể gắn tên miền riêng cho trang.' },
      { q: 'Tôi có cần biết lập trình không?', a: 'Không. Bạn chọn mẫu và chỉnh mọi thứ bằng trình kéo thả, trên điện thoại hay máy tính.' },
      { q: 'Phòng 3D là gì?', a: 'Trang của bạn hiện thành một căn phòng nhỏ trên vùng đất lơ lửng, khách xoay xem được, với liên kết và nội dung là các đồ vật bấm vào được.' },
    ],
  },
}
const text = computed(() => TEXT[lang.value])

// ---------- SEO ----------
const SITE = 'https://perlink.to'
const pageUrl = computed(() => `${SITE}${lang.value === 'vi' ? '/vi/thay-the-linktree' : '/linktree-alternative'}`)
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
    { rel: 'alternate', hreflang: 'en', href: `${SITE}/linktree-alternative` },
    { rel: 'alternate', hreflang: 'vi', href: `${SITE}/vi/thay-the-linktree` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}/linktree-alternative` },
  ],
  // The questions, for search results
  script: () => [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang.value,
      mainEntity: text.value.faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    }).replace(/</g, '\\u003c'),
  }],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
