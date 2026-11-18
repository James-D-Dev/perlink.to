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
import { APP_LANGUAGES, LANGUAGE_INFO, type AppLanguage } from '#shared/language'
import { alternateLinks } from '~/data/langPaths'
import { ABOUT_PAIR } from '~/data/guides'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

// Who makes Perlink, why, and how it pays for itself: the page search engines
// and AI assistants look for to know who stands behind the product
const { lang, local } = useMarketingLang()

const TEXT = {
  en: {
    seoTitle: 'About Perlink — Who makes it and why',
    description: 'Perlink is a personal website and link in bio builder where every page can also be a 3D world. Made in Vietnam by Hoang Kim Duc since 2026.',
    eyebrow: 'About',
    title: 'A website for everyone, and a world to walk into',
    intro: 'Perlink lets anyone make a personal website, a link in bio page or a small business site in minutes, and open the same page as a 3D room visitors can walk around. It works in English, Vietnamese, Chinese, Japanese and Korean, and it is free to start.',
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
          'That is also why Perlink was built for more than one language from the start: it began in English and Vietnamese, with prices in US dollars and Vietnamese dong, and now speaks Chinese, Japanese and Korean too.',
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
    intro: 'Perlink giúp bất kỳ ai tạo website cá nhân, trang link bio hay trang cho cửa hàng nhỏ trong vài phút, và mở chính trang đó thành một căn phòng 3D để khách đi dạo. Perlink có tiếng Việt, tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn, bắt đầu miễn phí.',
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
          'Đó cũng là lý do Perlink được làm cho nhiều ngôn ngữ ngay từ đầu: bắt đầu với tiếng Việt và tiếng Anh, giá bằng đô la Mỹ và đồng Việt Nam, và nay có thêm tiếng Trung, tiếng Nhật và tiếng Hàn.',
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
  zh: {
    seoTitle: '关于 Perlink：谁在做，为什么做',
    description: 'Perlink 是一个个人网站和链接主页搭建工具，每个页面都能变成 3D 世界。由 Hoang Kim Duc 自 2026 年起在越南开发。',
    eyebrow: '关于我们',
    title: '人人都能拥有的网站，和一个可以走进去的世界',
    intro: 'Perlink 让任何人在几分钟内做好个人网站、链接主页或小店网站，还能把同一个页面打开成访客可以四处走动的 3D 房间。支持英语、越南语、中文、日语和韩语，免费即可开始。',
    sections: [
      {
        title: '为什么会有 Perlink',
        paragraphs: [
          '大多数人和小商家并不需要一个庞大的网站。他们需要的是一个好页面：我是谁、提供什么、怎么联系我。可现有的工具，要么只是一串单调的链接列表，要么是得花一个周末才能学会的建站工具。',
          'Perlink 介于两者之间。你从专为你这类页面设计的模板开始（咖啡馆菜单、简历、婚礼请柬、民宿），换上文字和照片，然后发布。而且，页面不止是页面：Perlink 能把它变成一个小小的 3D 世界，可以在小岛上、樱花园里或夜色中的城市里，有音乐、可点击的物品和留言簿。',
        ],
      },
      {
        title: '谁在做 Perlink',
        paragraphs: [
          'Perlink 由越南的独立开发者 Hoang Kim Duc 开发和运营，自 2026 年开始开发。这是一个小而独立的产品：写代码、回复客服邮件、阅读每一条举报的，都是同一个人。',
          '这也是 Perlink 从一开始就面向多种语言的原因：它最初支持英语和越南语，价格以美元和越南盾计，现在也支持中文、日语和韩语了。',
        ],
      },
      {
        title: 'Perlink 靠什么维持',
        paragraphs: [
          'Perlink 有不限时长的免费套餐。费用来自需要更多功能的用户：Starter、Plus 和 Max 套餐提供更多在线网站、Pro 主题、自定义域名和更长时间的数据统计；主题 3D 房间素材包则一次性购买。',
          '每笔付款都享有 7 天退款保障，你的内容始终属于你：随时可以编辑、下线或删除。',
        ],
      },
    ],
    factsTitle: 'Perlink 一览',
    facts: { templates: '现成模板', lands: '3D 大陆', languages: '支持语言', since: '始于' },
    contactTitle: '联系我们',
    contactText: '有问题、想法，或者网站出了状况？随时来信。',
    report: '举报违规网站',
    start: '免费开始',
    pricing: '查看价格',
  },
  ja: {
    seoTitle: 'Perlink について：つくり手と、その理由',
    description: 'Perlink は、どのページも3Dワールドにできる個人サイト・リンクまとめ作成サービスです。2026年からベトナムで Hoang Kim Duc が開発しています。',
    eyebrow: 'Perlink について',
    title: 'すべての人にウェブサイトを。そして歩いて入れるワールドを',
    intro: 'Perlink を使えば、誰でも数分で個人サイト、リンクまとめページ、小さなお店のサイトを作れます。そして同じページを、訪れた人が歩き回れる3Dルームとして開くこともできます。英語、ベトナム語、中国語、日本語、韓国語に対応し、無料で始められます。',
    sections: [
      {
        title: 'Perlink が生まれた理由',
        paragraphs: [
          '多くの人や小さなお店に、大きなウェブサイトは必要ありません。必要なのは、自分が誰で、何を提供していて、どう連絡すればいいかが伝わる、よくできた1ページです。ところが、そのためのツールは、ただリンクを並べるだけのものか、使いこなすのに週末がまるごとかかるサイトビルダーのどちらかになりがちです。',
          'Perlink はその中間にあります。カフェのメニュー、履歴書、結婚式の招待状、民泊など、あなたのページの種類に合わせたテンプレートから始めて、文章と写真を差し替えて公開するだけ。そして、ページはページ以上のものになれるので、Perlink はそれを島や桜の庭、夜の街に浮かぶ小さな3Dワールドに変えます。音楽、クリックできるオブジェクト、ゲストブックも付いています。',
        ],
      },
      {
        title: 'つくっている人',
        paragraphs: [
          'Perlink は、ベトナムを拠点とする個人開発者 Hoang Kim Duc が開発・運営しており、2026年から開発が続いています。小さな独立したプロダクトで、コードを書くのも、サポートメールに返信するのも、すべての通報に目を通すのも同じ一人です。',
          'だからこそ Perlink は、最初から複数の言語を前提に作られてきました。英語とベトナム語で始まり、料金は米ドルとベトナムドンで表示。いまでは中国語、日本語、韓国語にも対応しています。',
        ],
      },
      {
        title: 'Perlink の運営を支える仕組み',
        paragraphs: [
          'Perlink には期間無制限の無料プランがあります。運営費は、より多くを必要とする方々に支えられています。Starter、Plus、Max の各プランでは、公開できるサイト数、Pro テーマ、独自ドメイン、より長い期間のアクセス解析が加わり、テーマ別の3Dルームパックは買い切りで販売しています。',
          'すべてのお支払いに7日間の返金保証が付いています。コンテンツはずっとあなたのものです。いつでも編集、非公開、削除ができます。',
        ],
      },
    ],
    factsTitle: '数字で見る Perlink',
    facts: { templates: 'すぐ使えるテンプレート', lands: '3Dの大地', languages: '対応言語', since: '開始年' },
    contactTitle: 'お問い合わせ',
    contactText: 'ご質問、アイデア、サイトの不具合など、いつでもお気軽にご連絡ください。',
    report: 'ルール違反のサイトを通報する',
    start: '無料ではじめる',
    pricing: '料金を見る',
  },
  ko: {
    seoTitle: 'Perlink 소개 — 누가, 왜 만들었나',
    description: 'Perlink는 모든 페이지가 3D 월드가 될 수 있는 개인 홈페이지·링크 인 바이오 빌더예요. 2026년부터 베트남에서 Hoang Kim Duc이 만들고 있어요.',
    eyebrow: '소개',
    title: '모두를 위한 홈페이지, 그리고 걸어 들어갈 수 있는 월드',
    intro: 'Perlink를 쓰면 누구나 몇 분 만에 개인 홈페이지, 링크 인 바이오 페이지, 작은 가게 사이트를 만들고, 같은 페이지를 방문자가 걸어 다닐 수 있는 3D 룸으로 열 수 있어요. 영어, 베트남어, 중국어, 일본어, 한국어를 지원하고 무료로 시작할 수 있어요.',
    sections: [
      {
        title: 'Perlink를 만든 이유',
        paragraphs: [
          '대부분의 사람과 작은 가게에는 거창한 웹사이트가 필요하지 않아요. 필요한 건 잘 만든 페이지 하나예요. 내가 누구인지, 무엇을 하는지, 어떻게 연락하면 되는지. 그런데 이를 위한 도구는 밋밋한 링크 목록이거나, 배우는 데만 주말이 걸리는 웹사이트 빌더인 경우가 많아요.',
          'Perlink는 그 중간에 있어요. 카페 메뉴, 이력서, 청첩장, 스테이처럼 내 페이지 종류에 맞춘 템플릿에서 시작해 글과 사진만 바꾸고 공개하면 끝이에요. 그리고 페이지는 페이지 이상이 될 수 있으니까, Perlink는 그것을 섬 위, 벚꽃 정원, 밤의 도시 속 작은 3D 월드로 바꿔 줘요. 음악, 클릭할 수 있는 오브젝트, 방명록까지 함께요.',
        ],
      },
      {
        title: '누가 만드나요',
        paragraphs: [
          'Perlink는 베트남에서 활동하는 독립 개발자 Hoang Kim Duc이 만들고 운영하며, 2026년부터 개발되고 있어요. 작고 독립적인 제품이라 코드를 쓰는 사람, 고객 문의 메일에 답하는 사람, 신고를 하나하나 읽는 사람이 모두 같은 사람이에요.',
          '그래서 Perlink는 처음부터 여러 언어를 염두에 두고 만들었어요. 영어와 베트남어로 시작해 미국 달러와 베트남 동으로 가격을 매겼고, 이제는 중국어, 일본어, 한국어도 지원해요.',
        ],
      },
      {
        title: 'Perlink는 어떻게 유지되나요',
        paragraphs: [
          'Perlink에는 기간 제한 없는 무료 요금제가 있어요. 운영 비용은 더 많은 기능이 필요한 분들이 내 주세요. Starter, Plus, Max 요금제에서는 공개 사이트 수, Pro 테마, 커스텀 도메인, 더 긴 통계 기간이 늘어나고, 테마별 3D 룸 팩은 한 번 구매로 판매해요.',
          '모든 결제는 7일 환불 보장이 적용되고, 콘텐츠는 언제나 여러분의 것이에요. 언제든 수정하거나 비공개로 돌리거나 삭제할 수 있어요.',
        ],
      },
    ],
    factsTitle: '한눈에 보는 Perlink',
    facts: { templates: '기본 제공 템플릿', lands: '3D 땅', languages: '지원 언어', since: '시작 연도' },
    contactTitle: '문의하기',
    contactText: '질문이나 아이디어가 있거나 사이트에 문제가 생겼나요? 언제든 연락 주세요.',
    report: '규칙을 어긴 사이트 신고하기',
    start: '무료로 시작하기',
    pricing: '요금제 보기',
  },
} satisfies Record<AppLanguage, unknown>
const text = computed(() => TEXT[lang.value])
const facts = computed(() => [
  { label: text.value.facts.templates, value: `${PAGE_TEMPLATES.length}` },
  { label: text.value.facts.lands, value: '11' },
  { label: text.value.facts.languages, value: `${APP_LANGUAGES.length}` },
  { label: text.value.facts.since, value: '2026' },
])

// ---------- SEO ----------
const path = computed(() => local(ABOUT_PAIR[0]))
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
  htmlAttrs: { lang: () => LANGUAGE_INFO[lang.value].html },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    ...alternateLinks(ABOUT_PAIR[0]),
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
        inLanguage: LANGUAGE_INFO[lang.value].html,
        about: { '@id': PERLINK_ORG_ID },
        isPartOf: { '@id': PERLINK_WEBSITE_ID },
      },
    ]),
  }],
})

const { locale, setLocale } = useI18n()
onMounted(() => {
  if (lang.value !== 'en' && locale.value !== lang.value) setLocale(lang.value)
})
</script>
