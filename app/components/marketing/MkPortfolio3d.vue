<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
          <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
          <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
          <div class="mt-8">
            <MarketingMkClaimForm topic="portfolio" />
          </div>
          <p class="mt-4 text-sm text-ink-muted">
            {{ text.note }} · <a href="#live-room" class="underline decoration-line underline-offset-4 hover:text-ink">{{ text.tryLink }}</a>
          </p>
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

    <!-- A live room, right here -->
    <MarketingMkSection id="live-room" :title="text.demoTitle" :description="text.demoText">
      <LazyMarketingMkRoomDemo hydrate-on-visible switchable />
    </MarketingMkSection>

    <!-- What it is -->
    <MarketingMkSection :title="text.whatTitle">
      <div class="max-w-3xl space-y-4">
        <p v-for="(paragraph, i) in text.what" :key="i" class="text-base leading-relaxed text-ink-muted md:text-lg">{{ paragraph }}</p>
      </div>
      <h3 class="mk-display mt-14 text-2xl sm:text-3xl">{{ text.diffTitle }}</h3>
      <div class="mt-6 overflow-x-auto rounded-2xl ring-1 ring-line">
        <table class="w-full min-w-[540px] text-left text-sm">
          <thead class="bg-sand text-ink">
            <tr>
              <th scope="col" class="px-4 py-3 font-medium sm:px-6" />
              <th scope="col" class="px-4 py-3 font-medium sm:px-6">{{ text.diffColumns[0] }}</th>
              <th scope="col" class="px-4 py-3 font-medium sm:px-6">{{ text.diffColumns[1] }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="row in text.diff" :key="row[0]">
              <th scope="row" class="px-4 py-3 align-top font-normal text-ink sm:px-6">{{ row[0] }}</th>
              <td class="px-4 py-3 align-top text-ink-muted sm:px-6">{{ row[1] }}</td>
              <td class="px-4 py-3 align-top text-ink sm:px-6">{{ row[2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4 text-sm text-ink-muted">
        <NuxtLink :to="topicLink('compare')" class="underline decoration-line underline-offset-4 hover:text-ink">{{ text.diffMore }}</NuxtLink>
      </p>
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
                <LazySiteTemplateThumbnail hydrate-on-visible sample :template="portfolioTemplate" :scale="0.5" />
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

    <!-- Who it's for, each with its own page -->
    <MarketingMkSection :title="text.whoTitle" :description="text.whoText">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(item, i) in text.who"
          :key="item.id"
          v-reveal="(i % 3) * 90"
          :to="topicLink(item.id)"
          class="group flex flex-col rounded-2xl bg-sand p-6 transition-colors hover:bg-line"
        >
          <UIcon :name="item.icon" class="size-5 text-ink" />
          <h3 class="mt-4 text-base font-medium text-ink">{{ item.title }}</h3>
          <p class="mt-1 flex-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm text-ink">
            {{ text.whoMore }}
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </NuxtLink>
        <div v-reveal="180" class="rounded-2xl p-6 ring-1 ring-line">
          <UIcon name="i-lucide-circle-help" class="size-5 text-ink" />
          <h3 class="mt-4 text-base font-medium text-ink">{{ text.notFor.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ text.notFor.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Templates by kind of work -->
    <MarketingMkSection :title="text.templatesTitle" :description="text.templatesText">
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        <NuxtLink v-for="(item, i) in portfolioTemplates" :key="item.template.id" v-reveal="(i % 4) * 90" :to="`/templates/${item.template.id}`" class="group block">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <div class="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
              <LazySiteTemplateThumbnail hydrate-on-visible sample :template="item.template" :scale="0.38" />
            </div>
            <span class="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs text-ink ring-1 ring-line backdrop-blur">{{ item.label }}</span>
          </div>
          <h3 class="mt-3 text-sm font-medium text-ink">{{ copy.templates.names[item.template.id]?.name ?? item.template.name }}</h3>
          <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">{{ copy.templates.names[item.template.id]?.description ?? item.template.description }}</p>
        </NuxtLink>
      </div>
    </MarketingMkSection>

    <!-- The full how-to -->
    <MarketingMkSection :title="text.stepsTitle" :description="text.stepsText">
      <ol class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" v-reveal="(i % 3) * 110" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="mt-6 text-base font-medium text-ink">{{ step.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
      <div class="mt-10 flex flex-wrap gap-3">
        <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ text.cta }}</MarketingMkButton>
        <MarketingMkButton :to="local('/templates')" variant="outline">{{ text.templates }}</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- What to put in, what to leave out -->
    <MarketingMkSection :title="text.checkTitle">
      <div class="grid gap-10 md:grid-cols-2">
        <div>
          <h3 class="text-base font-medium text-ink">{{ text.doTitle }}</h3>
          <ul class="mt-4 space-y-3">
            <li v-for="item in text.do" :key="item" class="flex gap-3 text-base leading-relaxed text-ink-muted">
              <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-tint" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-base font-medium text-ink">{{ text.dontTitle }}</h3>
          <ul class="mt-4 space-y-3">
            <li v-for="item in text.dont" :key="item" class="flex gap-3 text-base leading-relaxed text-ink-muted">
              <UIcon name="i-lucide-x" class="mt-1 size-4 shrink-0 text-ink-faint" />
              <span>{{ item }}</span>
            </li>
          </ul>
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

    <!-- Code it yourself, or not -->
    <MarketingMkSection :title="text.compareTitle">
      <div v-reveal class="overflow-x-auto rounded-2xl ring-1 ring-line">
        <table class="w-full min-w-[540px] text-left text-sm">
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
      <p class="mt-4 text-sm text-ink-muted">
        <NuxtLink :to="topicLink('effects')" class="underline decoration-line underline-offset-4 hover:text-ink">{{ text.effectsMore }}</NuxtLink>
      </p>
    </MarketingMkSection>

    <!-- Keep reading -->
    <MarketingMkSection :title="text.readTitle">
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="(item, i) in text.read"
          :key="item.id"
          v-reveal="(i % 2) * 90"
          :to="topicLink(item.id)"
          class="group rounded-2xl bg-sand p-6 transition-colors hover:bg-line md:p-8"
        >
          <h3 class="text-lg font-medium text-ink">{{ item.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
          <UIcon name="i-lucide-arrow-right" class="mt-4 size-4 text-ink transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
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

    <!-- Start -->
    <MarketingMkSection>
      <div class="max-w-2xl">
        <h2 class="mk-display text-3xl sm:text-4xl">{{ text.ctaTitle }}</h2>
        <p class="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">{{ text.ctaText }}</p>
        <div class="mt-8">
          <MarketingMkClaimForm topic="portfolio" />
        </div>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGE_INFO, type AppLanguage } from '#shared/language'
import { alternateLinks } from '~/data/langPaths'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { PORTFOLIO_BASE, PORTFOLIO_SLUGS, type PortfolioTopicId } from '~/data/portfolio3d/paths'

// "3D portfolio": the pillar page of the topic (/3d-portfolio,
// /vi/portfolio-3d). What a 3D portfolio is, a live room to try, who it suits
// (each with its own page under this one), templates, the full how-to and
// questions. The pages under it go deeper on one search each.
const { lang, copy, local } = useMarketingLang()

// Topic pages exist in English and Vietnamese; other languages link to the English one
const topicLang = computed(() => (lang.value === 'vi' ? 'vi' : 'en'))
const topicLink = (id: PortfolioTopicId) => `${PORTFOLIO_BASE[topicLang.value]}/${PORTFOLIO_SLUGS[id][topicLang.value]}`

const portfolioTemplate = PAGE_TEMPLATES.find(item => item.id === 'personal')!
// One or two per kind of work, labelled
const TEMPLATE_PICKS: [id: string, kind: 'designer' | 'developer' | 'photographer' | 'architect' | 'student' | 'anyone'][] = [
  ['creator', 'designer'], ['creative-agency', 'designer'],
  ['personal-neon', 'developer'], ['personal', 'anyone'],
  ['photographer', 'photographer'], ['wedding-photo', 'photographer'],
  ['interior-design', 'architect'], ['personal-resume', 'student'],
]
const KIND_LABELS = {
  en: { designer: 'Designer', developer: 'Developer', photographer: 'Photographer', architect: 'Architect', student: 'Student', anyone: 'Anyone' },
  vi: { designer: 'Designer', developer: 'Lập trình viên', photographer: 'Nhiếp ảnh', architect: 'Kiến trúc', student: 'Sinh viên', anyone: 'Mọi người' },
  zh: { designer: '设计师', developer: '开发者', photographer: '摄影师', architect: '建筑师', student: '学生', anyone: '所有人' },
  ja: { designer: 'デザイナー', developer: '開発者', photographer: '写真家', architect: '建築', student: '学生', anyone: 'どなたでも' },
  ko: { designer: '디자이너', developer: '개발자', photographer: '사진작가', architect: '건축가', student: '학생', anyone: '누구나' },
} satisfies Record<AppLanguage, Record<string, string>>
const portfolioTemplates = computed(() => TEMPLATE_PICKS
  .map(([id, kind]) => ({ template: PAGE_TEMPLATES.find(item => item.id === id), label: KIND_LABELS[lang.value][kind] }))
  .filter((item): item is { template: NonNullable<typeof item.template>; label: string } => !!item.template))

const TEXT = {
  en: {
    metaTitle: '3D Portfolio Website: Make One Free, No Code | Perlink',
    metaDescription: 'What a 3D portfolio is, who it suits and how to make one without code. Try a live 3D room, pick a template for your field and publish free.',
    eyebrow: '3D portfolio website',
    title: 'A 3D portfolio website, without writing code',
    intro: 'Show your work as a clean portfolio page and as a small 3D room people can walk around, with your projects on the walls. Pick a template, add your work, publish at perlink.to/you. No Three.js, no Blender, no hosting to set up.',
    note: 'Free to start · Works on phones · In 5 languages',
    tryLink: 'Try a live room',
    heroAlt: 'A Perlink 3D room on a floating island',
    demoTitle: 'Try a 3D portfolio right here',
    demoText: 'This is a real Perlink room, running in your browser. Switch between a designer, a developer, a photographer, an architect and a student, look around, and tap the work on the walls.',
    whatTitle: 'What is a 3D portfolio?',
    what: [
      'A 3D portfolio is a portfolio website where your work sits inside a three-dimensional space that visitors can move around in, instead of only on a flat page of thumbnails. It might be a room with your projects framed on the walls, a desk with your laptop that opens your GitHub, or a whole little world. It runs in the browser, so there is nothing to install.',
      'Most famous 3D portfolios are hand-built by developers with Three.js and WebGL, and they take weeks. That is why they stand out, and also why most people never make one. Perlink does the 3D part for you: you fill in a normal portfolio page, and the same content becomes a room you can arrange by dragging things around.',
      'The best 3D portfolios don’t replace the plain page, they add to it. A recruiter skimming twenty candidates still needs your name, your best three projects and a way to contact you in under a minute. So on Perlink every portfolio is both: a fast page first, and a room one tap away (or the other way round, if you prefer).',
    ],
    diffTitle: 'How a 3D portfolio differs from a regular one',
    diffColumns: ['Regular portfolio', '3D portfolio on Perlink'] as [string, string],
    diff: [
      ['What visitors do', 'Scroll a page of thumbnails', 'Read the page, then walk into a room and tap your work'],
      ['What they remember', 'Your best project, if it is first', 'The room itself, and you as the person who made it'],
      ['Time on your site', 'Often under a minute', 'Longer: people explore before they leave'],
      ['Load on a phone', 'Fast', 'Page is just as fast; the room loads only when opened'],
      ['Found on Google', 'Yes', 'Yes: the page is real HTML with its own title and description'],
      ['Effort to make', 'An afternoon with a site builder', 'The same afternoon: the room is made from your page'],
    ] as [string, string, string][],
    diffMore: 'Read the full comparison, with when a regular portfolio is the better choice',
    twoTitle: 'One address, two ways to see your work',
    twoText: 'Visitors land on a fast portfolio page that works everywhere. One tap takes them into your 3D room.',
    pageLabel: 'The portfolio page',
    pageText: 'About you, selected work, links and contact. Quick to load and easy to read on any phone.',
    pageAlt: 'A personal portfolio page made with Perlink',
    roomLabel: 'The 3D room',
    roomText: 'The same page as a room on a floating land, by day or night, with music and things to tap.',
    roomAlt: 'A Perlink 3D room at night in a city',
    whoTitle: 'Who a 3D portfolio is for',
    whoText: 'Anyone whose work is easier to show than to describe. Each kind of work has its own guide, with what to show and how to set the room up.',
    whoMore: 'Read the guide',
    who: [
      { id: 'designer' as const, icon: 'i-lucide-pen-tool', title: 'Designers', text: 'Graphic, product and UX designers: case studies on the page, your best visuals framed in the room.' },
      { id: 'developer' as const, icon: 'i-lucide-code-xml', title: 'Developers', text: 'Shipped projects, your stack and a laptop that opens your GitHub, without spending weeks in Three.js.' },
      { id: 'photographer' as const, icon: 'i-lucide-camera', title: 'Photographers', text: 'A gallery wall people walk along, with packages and booking on the page.' },
      { id: 'architect' as const, icon: 'i-lucide-ruler', title: 'Architects and interior designers', text: 'Spatial work shown in a space: built photos, renders and drawings, one project per wall.' },
      { id: 'student' as const, icon: 'i-lucide-graduation-cap', title: 'Students and graduates', text: 'School and side projects, your CV and a QR code for career fairs: a first portfolio that gets remembered.' },
    ],
    notFor: { title: 'When you may not need one', text: 'If your work is mostly writing, or the people hiring you only ever ask for a PDF, a plain page is enough. Perlink lets you keep the room off and use the page alone.' },
    templatesTitle: 'Portfolio templates by kind of work',
    templatesText: 'Each comes with sample work, a theme and a matching 3D room. Pick the closest one and make it yours.',
    stepsTitle: 'How to make a 3D portfolio, step by step',
    stepsText: 'About an hour from nothing to a published portfolio, most of it spent choosing your work.',
    steps: [
      { title: 'Choose your best 4 to 8 pieces', text: 'Fewer, stronger projects beat a full archive. Pick work that matches the job or clients you want next, and write one line on what each was for.' },
      { title: 'Claim your address', text: 'Pick perlink.to/yourname. Use the name you put on your CV and social profiles, so people can guess it.' },
      { title: 'Start from a template for your field', text: 'Designer, developer, photographer, architect or student. The template sets the layout, the theme and a room that fits.' },
      { title: 'Fill in the page', text: 'Your name and one sentence about what you do, then the work as an album, a timeline of experience, testimonials and a contact form.' },
      { title: 'Dress the room', text: 'Put your best images in the picture frames, link the laptop to GitHub or Behance, choose a land, day or night, and music if you like.' },
      { title: 'Check it on your phone', text: 'Open the page and the room on a phone. Make sure your name, best project and contact are visible without the room.' },
      { title: 'Publish and share', text: 'Set the search title and description, then put the link in your bio, CV and email signature. Record a short video of the room for TikTok or Reels.' },
    ],
    cta: 'Make your 3D portfolio',
    templates: 'Browse all templates',
    checkTitle: 'What to put in a 3D portfolio, and what to leave out',
    doTitle: 'Put in',
    do: [
      'Your name, what you do and where you are, in the first lines of the page',
      'Four to eight projects, each with a sentence on the problem and your part in it',
      'Your strongest image of each project in the room’s frames, so the room tells the story at a glance',
      'A clear way to reach you: a contact form, email or booking, on the page and linked from the room',
      'Links that prove the work: GitHub, Behance, Dribbble, a live product, a published article',
    ],
    dontTitle: 'Leave out',
    dont: [
      'Every project you have ever made. Old or off-topic work dilutes the best pieces',
      'Huge, uncompressed images. They slow the page and the room; a 2,000 px wide JPEG or WebP is plenty',
      'Work you can’t show. Ask before posting client work under NDA, or describe it without the files',
      'A room with nothing to do in it. Every object should either show work or lead somewhere',
      'Contact details only inside the room. Visitors who never open it must still find them',
    ],
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
    compareTitle: 'Perlink or coding it yourself',
    codeColumn: 'Coding it yourself',
    rows: [
      { label: 'Time to a live portfolio', perlink: 'Minutes', code: 'Days to weeks' },
      { label: 'Three.js, Blender or WebGL skills', perlink: 'Not needed', code: 'Needed' },
      { label: 'Hosting and a web address', perlink: 'Included (perlink.to/you)', code: 'You set them up' },
      { label: 'Updating your work', perlink: 'In the editor, on phone or computer', code: 'Change the code and deploy' },
      { label: 'A plain page for slow phones and search engines', perlink: 'Built in', code: 'You build it too' },
    ],
    effectsMore: 'Want to build 3D effects yourself? Read how they work and what they cost in load time',
    readTitle: 'Keep reading',
    read: [
      { id: 'examples' as const, title: '3D portfolio examples', text: 'Well-known 3D portfolios from around the web, what makes each one work, and ones you can make today.' },
      { id: 'compare' as const, title: '3D portfolio vs a regular portfolio', text: 'An honest comparison, including when a regular portfolio is the better choice.' },
      { id: 'effects' as const, title: 'Portfolio websites with 3D effects', text: 'Tilt cards, scroll scenes, WebGL heroes and full worlds: what each costs and when to use it.' },
      { id: 'free' as const, title: 'Make a 3D portfolio for free', text: 'Exactly what is free on Perlink, and the other free routes compared.' },
    ],
    faqTitle: 'Questions',
    faq: [
      { q: 'What is a 3D portfolio?', a: 'A portfolio website where your work is shown inside a 3D space visitors can move around in, such as a room with your projects on the walls. On Perlink it comes with a regular portfolio page at the same address.' },
      { q: 'Do I need to know Three.js or how to code?', a: 'No. Perlink builds the 3D room for you. You pick a template, then edit your page and arrange your room in a visual editor.' },
      { q: 'Is it free?', a: 'Yes. The free plan includes one site with a portfolio page, a 3D room and analytics, with no time limit. Paid plans add more sites, Pro themes and longer analytics.' },
      { q: 'How long does it take to make one?', a: 'The page and room are ready as soon as you pick a template. Most people spend an hour or so choosing their work and writing a line about each project.' },
      { q: 'Can I show my own projects and photos?', a: 'Yes. Add photo albums, videos, links and descriptions to the page, and hang your pictures in the 3D room. Visitors tap a picture to see it large.' },
      { q: 'Does it work on phones?', a: 'Yes. The page is built for phones first, and the 3D room adjusts its quality to the device so it stays smooth.' },
      { q: 'Will people who don’t want 3D still see my work?', a: 'Yes. Your portfolio is a normal web page first; the 3D room is one tap away. You can also make the room open first.' },
      { q: 'Will my 3D portfolio show up on Google?', a: 'Yes. The page is a real web page with your own search title, description and share image, and published sites are listed for search engines.' },
      { q: 'Can I use my own domain?', a: 'Yes, on the Plus plan. Your portfolio also lives at perlink.to/yourname, which you choose, and it keeps working after you connect your domain.' },
      { q: 'Can I put my 3D portfolio on my CV?', a: 'Yes. Put the perlink.to address in your CV and email signature, and print the QR code from your dashboard on a CV or business card.' },
    ],
    ctaTitle: 'Make your 3D portfolio today',
    ctaText: 'Claim your address, pick a template for your field and publish. Free, and no code.',
  },
  vi: {
    metaTitle: 'Website portfolio 3D: tạo miễn phí, không cần code | Perlink',
    metaDescription: 'Portfolio 3D là gì, hợp với ai và cách tự tạo không cần code. Thử ngay phòng 3D trực tiếp, chọn mẫu theo ngành của bạn và đăng miễn phí.',
    eyebrow: 'Website portfolio 3D',
    title: 'Website portfolio 3D, không cần viết code',
    intro: 'Trưng bày tác phẩm trên một trang portfolio gọn gàng và trong một căn phòng 3D nhỏ để mọi người dạo quanh, với dự án của bạn treo trên tường. Chọn mẫu, thêm tác phẩm, đăng tại perlink.to/tên-bạn. Không cần Three.js, Blender hay tự thuê hosting.',
    note: 'Miễn phí để bắt đầu · Chạy tốt trên điện thoại · 5 ngôn ngữ',
    tryLink: 'Thử phòng 3D ngay',
    heroAlt: 'Một phòng 3D Perlink trên hòn đảo lơ lửng',
    demoTitle: 'Thử một portfolio 3D ngay tại đây',
    demoText: 'Đây là một phòng Perlink thật, đang chạy trong trình duyệt của bạn. Chuyển giữa designer, lập trình viên, nhiếp ảnh gia, kiến trúc sư và sinh viên, nhìn quanh và chạm vào tác phẩm trên tường.',
    whatTitle: 'Portfolio 3D là gì?',
    what: [
      'Portfolio 3D là một website portfolio mà tác phẩm của bạn nằm trong một không gian ba chiều để người xem đi lại, thay vì chỉ là một trang phẳng đầy ảnh nhỏ. Đó có thể là căn phòng treo dự án trên tường, chiếc bàn có laptop mở ra GitHub của bạn, hay cả một thế giới nhỏ. Nó chạy ngay trong trình duyệt, không phải cài gì.',
      'Phần lớn các portfolio 3D nổi tiếng do lập trình viên tự dựng bằng Three.js và WebGL, mất hàng tuần. Vì thế chúng nổi bật, và cũng vì thế mà hầu hết mọi người không bao giờ làm. Perlink làm phần 3D thay bạn: bạn điền một trang portfolio bình thường, và chính nội dung đó thành một căn phòng bạn sắp xếp bằng cách kéo thả.',
      'Portfolio 3D tốt không thay thế trang thường mà bổ sung cho nó. Nhà tuyển dụng lướt qua hai mươi ứng viên vẫn cần thấy tên bạn, ba dự án tốt nhất và cách liên hệ trong chưa đầy một phút. Nên trên Perlink, portfolio nào cũng có cả hai: một trang tải nhanh trước, và căn phòng chỉ cách một lần chạm (hoặc ngược lại, nếu bạn muốn).',
    ],
    diffTitle: 'Portfolio 3D khác portfolio thường thế nào',
    diffColumns: ['Portfolio thường', 'Portfolio 3D trên Perlink'] as [string, string],
    diff: [
      ['Người xem làm gì', 'Cuộn một trang ảnh nhỏ', 'Đọc trang, rồi bước vào phòng và chạm vào tác phẩm'],
      ['Họ nhớ gì', 'Dự án tốt nhất, nếu nó nằm đầu tiên', 'Chính căn phòng, và bạn là người làm ra nó'],
      ['Thời gian ở lại', 'Thường dưới một phút', 'Lâu hơn: người ta khám phá rồi mới rời đi'],
      ['Tải trên điện thoại', 'Nhanh', 'Trang vẫn nhanh như vậy; phòng chỉ tải khi được mở'],
      ['Tìm thấy trên Google', 'Có', 'Có: trang là HTML thật, có tiêu đề và mô tả riêng'],
      ['Công sức làm', 'Một buổi chiều với trình tạo web', 'Cũng một buổi chiều: căn phòng được làm từ chính trang của bạn'],
    ] as [string, string, string][],
    diffMore: 'Đọc so sánh đầy đủ, kể cả khi nào portfolio thường là lựa chọn tốt hơn',
    twoTitle: 'Một địa chỉ, hai cách xem tác phẩm',
    twoText: 'Khách vào một trang portfolio tải nhanh, xem được ở mọi nơi. Chạm một lần là vào phòng 3D của bạn.',
    pageLabel: 'Trang portfolio',
    pageText: 'Giới thiệu, tác phẩm tiêu biểu, liên kết và liên hệ. Tải nhanh, dễ đọc trên mọi điện thoại.',
    pageAlt: 'Một trang portfolio cá nhân làm bằng Perlink',
    roomLabel: 'Phòng 3D',
    roomText: 'Chính trang đó thành một căn phòng trên vùng đất lơ lửng, ngày hoặc đêm, có nhạc và đồ vật bấm được.',
    roomAlt: 'Một phòng 3D Perlink giữa thành phố về đêm',
    whoTitle: 'Portfolio 3D dành cho ai',
    whoText: 'Cho bất kỳ ai có tác phẩm dễ cho xem hơn là kể. Mỗi ngành có một hướng dẫn riêng: nên đưa gì vào và bày phòng ra sao.',
    whoMore: 'Đọc hướng dẫn',
    who: [
      { id: 'designer' as const, icon: 'i-lucide-pen-tool', title: 'Designer', text: 'Thiết kế đồ họa, sản phẩm, UX: case study trên trang, hình đẹp nhất treo trong phòng.' },
      { id: 'developer' as const, icon: 'i-lucide-code-xml', title: 'Lập trình viên', text: 'Dự án đã ra mắt, stack của bạn và chiếc laptop mở ra GitHub, mà không phải mất hàng tuần với Three.js.' },
      { id: 'photographer' as const, icon: 'i-lucide-camera', title: 'Nhiếp ảnh gia', text: 'Một bức tường triển lãm để khách đi dọc, kèm gói chụp và đặt lịch trên trang.' },
      { id: 'architect' as const, icon: 'i-lucide-ruler', title: 'Kiến trúc sư và thiết kế nội thất', text: 'Tác phẩm không gian được trưng trong không gian: ảnh công trình, phối cảnh và bản vẽ, mỗi dự án một bức tường.' },
      { id: 'student' as const, icon: 'i-lucide-graduation-cap', title: 'Sinh viên và người mới ra trường', text: 'Đồ án, dự án cá nhân, CV và mã QR cho ngày hội việc làm: portfolio đầu tiên mà người ta nhớ.' },
    ],
    notFor: { title: 'Khi nào có thể chưa cần', text: 'Nếu công việc của bạn chủ yếu là viết, hoặc nơi tuyển dụng chỉ nhận file PDF, một trang thường là đủ. Perlink cho phép tắt phòng và chỉ dùng trang.' },
    templatesTitle: 'Mẫu portfolio theo ngành',
    templatesText: 'Mỗi mẫu có sẵn tác phẩm mẫu, giao diện và phòng 3D đi kèm. Chọn mẫu gần nhất rồi biến nó thành của bạn.',
    stepsTitle: 'Cách làm portfolio 3D, từng bước',
    stepsText: 'Khoảng một giờ từ con số không đến một portfolio đã đăng, phần lớn thời gian là để chọn tác phẩm.',
    steps: [
      { title: 'Chọn 4 đến 8 tác phẩm tốt nhất', text: 'Ít mà chất hơn là cả kho lưu trữ. Chọn những gì hợp với công việc hay khách hàng bạn muốn tiếp theo, và viết một dòng mỗi tác phẩm làm để làm gì.' },
      { title: 'Lấy địa chỉ của bạn', text: 'Chọn perlink.to/tên-bạn. Dùng cái tên bạn ghi trên CV và mạng xã hội để người ta dễ đoán.' },
      { title: 'Bắt đầu từ mẫu cho ngành của bạn', text: 'Designer, lập trình viên, nhiếp ảnh, kiến trúc hay sinh viên. Mẫu lo bố cục, giao diện và một căn phòng phù hợp.' },
      { title: 'Điền trang', text: 'Tên và một câu về việc bạn làm, rồi đến tác phẩm dạng album, dòng thời gian kinh nghiệm, nhận xét và form liên hệ.' },
      { title: 'Bày phòng', text: 'Đặt những hình đẹp nhất vào khung ảnh, gắn link GitHub hay Behance vào laptop, chọn vùng đất, ngày hoặc đêm, và nhạc nếu thích.' },
      { title: 'Kiểm tra trên điện thoại', text: 'Mở trang và phòng trên điện thoại. Đảm bảo tên, dự án tốt nhất và cách liên hệ đều thấy được mà không cần vào phòng.' },
      { title: 'Đăng và chia sẻ', text: 'Đặt tiêu đề và mô tả tìm kiếm, rồi đưa link vào bio, CV và chữ ký email. Quay một video ngắn căn phòng cho TikTok hay Reels.' },
    ],
    cta: 'Tạo portfolio 3D',
    templates: 'Xem tất cả mẫu',
    checkTitle: 'Nên đưa gì vào portfolio 3D, và nên bỏ gì',
    doTitle: 'Nên có',
    do: [
      'Tên, việc bạn làm và nơi bạn ở, ngay những dòng đầu của trang',
      'Bốn đến tám dự án, mỗi dự án một câu về vấn đề và phần việc của bạn',
      'Hình mạnh nhất của mỗi dự án trong khung ảnh của phòng, để căn phòng kể chuyện chỉ trong một cái nhìn',
      'Cách liên hệ rõ ràng: form liên hệ, email hoặc đặt lịch, có trên trang và có link từ trong phòng',
      'Link chứng minh tác phẩm: GitHub, Behance, Dribbble, sản phẩm đang chạy, bài viết đã đăng',
    ],
    dontTitle: 'Nên bỏ',
    dont: [
      'Mọi dự án bạn từng làm. Tác phẩm cũ hoặc lạc đề làm loãng những cái tốt nhất',
      'Ảnh khổng lồ chưa nén. Chúng làm chậm cả trang lẫn phòng; JPEG hay WebP rộng 2.000 px là đủ',
      'Tác phẩm không được phép công khai. Hỏi trước khi đăng dự án có NDA, hoặc mô tả mà không kèm file',
      'Một căn phòng không có gì để làm. Mỗi đồ vật nên trưng tác phẩm hoặc dẫn tới đâu đó',
      'Thông tin liên hệ chỉ nằm trong phòng. Người không mở phòng vẫn phải tìm thấy',
    ],
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
    compareTitle: 'Dùng Perlink hay tự lập trình',
    codeColumn: 'Tự lập trình',
    rows: [
      { label: 'Thời gian để portfolio lên mạng', perlink: 'Vài phút', code: 'Vài ngày đến vài tuần' },
      { label: 'Kỹ năng Three.js, Blender, WebGL', perlink: 'Không cần', code: 'Cần' },
      { label: 'Hosting và địa chỉ web', perlink: 'Có sẵn (perlink.to/tên-bạn)', code: 'Tự thiết lập' },
      { label: 'Cập nhật tác phẩm', perlink: 'Trong trình chỉnh sửa, trên điện thoại hay máy tính', code: 'Sửa code và triển khai lại' },
      { label: 'Trang thường cho máy yếu và công cụ tìm kiếm', perlink: 'Có sẵn', code: 'Phải tự làm thêm' },
    ],
    effectsMore: 'Muốn tự làm hiệu ứng 3D? Đọc cách chúng hoạt động và cái giá về tốc độ tải',
    readTitle: 'Đọc tiếp',
    read: [
      { id: 'examples' as const, title: 'Ví dụ portfolio 3D đẹp', text: 'Những portfolio 3D nổi tiếng trên mạng, vì sao chúng hiệu quả, và những cái bạn làm được ngay hôm nay.' },
      { id: 'compare' as const, title: 'Portfolio 3D và portfolio thường', text: 'So sánh thẳng thắn, kể cả khi nào portfolio thường là lựa chọn tốt hơn.' },
      { id: 'effects' as const, title: 'Website portfolio có hiệu ứng 3D', text: 'Thẻ nghiêng, cảnh cuộn, hero WebGL và cả thế giới: mỗi loại tốn gì và nên dùng khi nào.' },
      { id: 'free' as const, title: 'Làm portfolio 3D miễn phí', text: 'Chính xác những gì miễn phí trên Perlink, và so sánh các cách miễn phí khác.' },
    ],
    faqTitle: 'Câu hỏi',
    faq: [
      { q: 'Portfolio 3D là gì?', a: 'Là một website portfolio mà tác phẩm được trưng trong không gian 3D để người xem đi lại, ví dụ một căn phòng treo dự án trên tường. Trên Perlink, nó đi kèm một trang portfolio thường ở cùng địa chỉ.' },
      { q: 'Tôi có cần biết Three.js hay lập trình không?', a: 'Không. Perlink dựng phòng 3D cho bạn. Bạn chọn mẫu, rồi chỉnh trang và sắp xếp phòng bằng trình chỉnh sửa trực quan.' },
      { q: 'Có miễn phí không?', a: 'Có. Gói miễn phí gồm một trang với portfolio, phòng 3D và thống kê, không giới hạn thời gian. Gói trả phí có thêm trang, theme Pro và thống kê dài hơn.' },
      { q: 'Làm một cái mất bao lâu?', a: 'Trang và phòng có ngay khi bạn chọn mẫu. Phần lớn mọi người mất khoảng một giờ để chọn tác phẩm và viết một dòng cho mỗi dự án.' },
      { q: 'Tôi có đưa dự án và ảnh của mình lên được không?', a: 'Được. Thêm album ảnh, video, liên kết và mô tả vào trang, và treo ảnh của bạn trong phòng 3D. Khách chạm vào ảnh để xem lớn.' },
      { q: 'Có chạy trên điện thoại không?', a: 'Có. Trang được làm cho điện thoại trước tiên, phòng 3D tự chỉnh chất lượng theo máy để luôn mượt.' },
      { q: 'Người không thích 3D có xem được tác phẩm không?', a: 'Được. Portfolio của bạn trước hết là một trang web bình thường; phòng 3D chỉ cách một lần chạm. Bạn cũng có thể cho phòng mở trước.' },
      { q: 'Portfolio 3D của tôi có lên Google không?', a: 'Có. Trang là một trang web thật, có tiêu đề tìm kiếm, mô tả và ảnh chia sẻ do bạn đặt, và các trang đã đăng được gửi cho công cụ tìm kiếm.' },
      { q: 'Tôi có dùng tên miền riêng được không?', a: 'Được, với gói Plus. Portfolio của bạn cũng có địa chỉ perlink.to/tên-bạn do bạn tự chọn, địa chỉ này vẫn hoạt động sau khi nối tên miền riêng.' },
      { q: 'Tôi có ghi portfolio 3D vào CV được không?', a: 'Được. Ghi địa chỉ perlink.to vào CV và chữ ký email, và in mã QR từ trang quản lý lên CV hoặc danh thiếp.' },
    ],
    ctaTitle: 'Làm portfolio 3D của bạn ngay hôm nay',
    ctaText: 'Lấy địa chỉ, chọn mẫu cho ngành của bạn và đăng. Miễn phí, không cần code.',
  },
  zh: {
    metaTitle: '3D 作品集网站：免费制作，无需代码 | Perlink',
    metaDescription: '什么是 3D 作品集、适合谁、如何不写代码做一个。在线体验 3D 房间，选择适合你领域的模板，免费发布。',
    eyebrow: '3D 作品集网站',
    title: '3D 作品集网站，不用写一行代码',
    intro: '把作品做成一个简洁的作品集页面，同时也是一个可以四处走动的小型 3D 房间，你的项目就挂在墙上。选模板、加作品，发布到 perlink.to/你的名字。不用 Three.js，不用 Blender，也不用自己搭服务器。',
    note: '免费开始 · 手机可用 · 支持 5 种语言',
    tryLink: '体验在线房间',
    heroAlt: '漂浮小岛上的一个 Perlink 3D 房间',
    demoTitle: '就在这里体验 3D 作品集',
    demoText: '这是一个真实的 Perlink 房间，正在你的浏览器里运行。在设计师、开发者、摄影师、建筑师和学生之间切换，四处看看，点一点墙上的作品。',
    whatTitle: '什么是 3D 作品集？',
    what: [
      '3D 作品集是一种作品集网站：你的作品放在一个访客可以自由走动的三维空间里，而不只是一页平铺的缩略图。它可以是一个墙上挂满项目的房间，一张放着笔记本电脑、点开就是你 GitHub 的书桌，也可以是一整个小世界。它直接在浏览器里运行，无需安装任何东西。',
      '大多数知名的 3D 作品集都是开发者用 Three.js 和 WebGL 手工打造的，要花好几周。这正是它们出彩的原因，也是大多数人从来没做过的原因。Perlink 替你搞定 3D 部分：你只需填写一个普通的作品集页面，同样的内容就会变成一个房间，拖一拖就能布置好。',
      '好的 3D 作品集不是取代普通页面，而是在它之上加分。一位要快速浏览二十个候选人的招聘者，仍然需要在一分钟内看到你的名字、最好的三个项目和联系方式。所以在 Perlink 上，每个作品集都兼具两者：先是一个加载飞快的页面，房间只需轻点一下（如果你愿意，也可以反过来）。',
    ],
    diffTitle: '3D 作品集和普通作品集有什么不同',
    diffColumns: ['普通作品集', 'Perlink 上的 3D 作品集'] as [string, string],
    diff: [
      ['访客做什么', '滚动浏览一页缩略图', '先看页面，再走进房间点开你的作品'],
      ['他们记住什么', '你最好的项目（如果它排在第一个）', '房间本身，以及做出它的你'],
      ['在网站停留的时间', '常常不到一分钟', '更久：大家会先探索一番再离开'],
      ['手机加载', '快', '页面一样快；房间只在打开时才加载'],
      ['能被搜索引擎找到', '能', '能：页面是真正的 HTML，有自己的标题和描述'],
      ['制作难度', '用建站工具花一个下午', '同样一个下午：房间由你的页面直接生成'],
    ] as [string, string, string][],
    diffMore: '阅读完整对比，包括什么时候普通作品集更合适（英文）',
    twoTitle: '一个地址，两种方式看你的作品',
    twoText: '访客先看到一个处处可用、加载飞快的作品集页面，轻点一下就能进入你的 3D 房间。',
    pageLabel: '作品集页面',
    pageText: '个人介绍、精选作品、链接和联系方式。加载快，任何手机上都好读。',
    pageAlt: '用 Perlink 制作的个人作品集页面',
    roomLabel: '3D 房间',
    roomText: '同一个页面，变成漂浮大陆上的一个房间，白天黑夜皆可，有音乐，也有能点的东西。',
    roomAlt: '城市夜色中的一个 Perlink 3D 房间',
    whoTitle: '3D 作品集适合谁',
    whoText: '适合所有“作品比言语更有说服力”的人。每类工作都有专门的指南，告诉你该展示什么、房间怎么布置。',
    whoMore: '阅读指南（英文）',
    who: [
      { id: 'designer' as const, icon: 'i-lucide-pen-tool', title: '设计师', text: '平面、产品和 UX 设计师：案例研究放在页面上，最出彩的视觉挂在房间里。' },
      { id: 'developer' as const, icon: 'i-lucide-code-xml', title: '开发者', text: '已上线的项目、你的技术栈，还有一台点开就是 GitHub 的笔记本电脑，不用在 Three.js 上耗几周。' },
      { id: 'photographer' as const, icon: 'i-lucide-camera', title: '摄影师', text: '一面可以边走边看的作品墙，拍摄套餐和预约放在页面上。' },
      { id: 'architect' as const, icon: 'i-lucide-ruler', title: '建筑师和室内设计师', text: '空间作品就在空间里展示：实景照片、效果图和图纸，一面墙一个项目。' },
      { id: 'student' as const, icon: 'i-lucide-graduation-cap', title: '学生和应届毕业生', text: '课程作业和个人项目、你的简历，还有招聘会用的二维码：一份让人记住的第一份作品集。' },
    ],
    notFor: { title: '什么时候可能不需要', text: '如果你的工作主要是写作，或者招聘方只要 PDF，一个普通页面就够了。Perlink 可以关闭房间，只用页面。' },
    templatesTitle: '按职业分类的作品集模板',
    templatesText: '每个模板都附带示例作品、主题和配套的 3D 房间。挑一个最接近的，改成你的样子。',
    stepsTitle: '如何一步步做出 3D 作品集',
    stepsText: '从零到发布大约一小时，大部分时间花在挑选作品上。',
    steps: [
      { title: '挑出最好的 4 到 8 件作品', text: '少而精胜过全部堆上。选择和你下一份工作或目标客户相符的作品，并为每件写一句话说明它的用途。' },
      { title: '占下你的地址', text: '选好 perlink.to/你的名字。用你简历和社交账号上的名字，方便别人猜到。' },
      { title: '从你所在领域的模板开始', text: '设计师、开发者、摄影师、建筑师或学生。模板会帮你定好布局、主题和一个合适的房间。' },
      { title: '填写页面', text: '你的名字和一句话介绍你做什么，然后是相册形式的作品、经历时间线、推荐语和联系表单。' },
      { title: '布置房间', text: '把最好的图片放进相框，把笔记本电脑链接到 GitHub 或 Behance，选一片大陆、白天或黑夜，喜欢的话再配上音乐。' },
      { title: '在手机上检查', text: '用手机打开页面和房间。确保不进房间也能看到你的名字、最好的项目和联系方式。' },
      { title: '发布并分享', text: '设置搜索标题和描述，然后把链接放进社交简介、简历和邮件签名。再录一段房间短视频发到抖音、TikTok 或 Reels。' },
    ],
    cta: '制作你的 3D 作品集',
    templates: '浏览全部模板',
    checkTitle: '3D 作品集该放什么，不该放什么',
    doTitle: '应该放',
    do: [
      '在页面开头写明你的名字、你做什么、你在哪里',
      '四到八个项目，每个配一句话，说明要解决的问题和你负责的部分',
      '每个项目最有冲击力的一张图放进房间的相框，让房间一眼就讲清你的故事',
      '清晰的联系方式：联系表单、邮箱或预约，页面上要有，房间里也要能链过去',
      '能证明作品的链接：GitHub、Behance、Dribbble、上线的产品、已发表的文章',
    ],
    dontTitle: '不该放',
    dont: [
      '你做过的所有项目。过时或不相关的作品会稀释最好的那几件',
      '未压缩的超大图片。它们会拖慢页面和房间；宽 2000 px 的 JPEG 或 WebP 就足够了',
      '不能公开的作品。发布签了保密协议的客户作品前先征得同意，或者只做文字描述不放文件',
      '一个什么都做不了的房间。每件物品要么展示作品，要么通向某个地方',
      '只放在房间里的联系方式。从不打开房间的访客也必须能找到它们',
    ],
    whyTitle: '为什么要做 3D 作品集',
    whyText: '作品集的意义在于被记住。一个可以探索的房间，比又一排缩略图更能做到这一点。',
    why: [
      { icon: 'i-lucide-sparkles', title: '脱颖而出', text: '招聘者和客户每天要看几十份作品集。你的，是他们在里面走过一圈的那一份。' },
      { icon: 'i-lucide-image', title: '作品挂上墙', text: '把照片、画作和项目截图挂在房间里，完整的作品集仍保留在页面上。' },
      { icon: 'i-lucide-smartphone', title: '为手机而做', text: '房间会根据设备自动调整，页面秒开，所以从 Instagram 或 TikTok 点进来的链接都能顺畅打开。' },
      { icon: 'i-lucide-clapperboard', title: '房间视频', text: '直接在编辑器里录一段竖屏房间漫游视频，发到 TikTok、Reels 和 Shorts。' },
      { icon: 'i-lucide-search', title: '能被搜索到', text: '作品集页面是一个真正的网页，有自己的标题和描述，随时可被搜索引擎收录。' },
      { icon: 'i-lucide-chart-column', title: '看看谁来过', text: '每个网站的访问量和点击量，还有可以印在简历或名片上的二维码。' },
    ],
    compareTitle: '用 Perlink，还是自己写代码',
    codeColumn: '自己写代码',
    rows: [
      { label: '作品集上线所需时间', perlink: '几分钟', code: '几天到几周' },
      { label: 'Three.js、Blender 或 WebGL 技能', perlink: '不需要', code: '需要' },
      { label: '托管和网址', perlink: '已包含（perlink.to/你的名字）', code: '自己搭建' },
      { label: '更新作品', perlink: '在编辑器里改，手机电脑都行', code: '改代码再部署' },
      { label: '给慢速手机和搜索引擎看的普通页面', perlink: '内置', code: '还得自己做' },
    ],
    effectsMore: '想自己做 3D 特效？看看它们的原理和对加载速度的影响（英文）',
    readTitle: '继续阅读',
    read: [
      { id: 'examples' as const, title: '3D 作品集案例（英文）', text: '网上知名的 3D 作品集，它们为什么出彩，以及今天就能做出来的作品集。' },
      { id: 'compare' as const, title: '3D 作品集与普通作品集对比（英文）', text: '一份坦诚的对比，包括什么时候普通作品集才是更好的选择。' },
      { id: 'effects' as const, title: '带 3D 特效的作品集网站（英文）', text: '倾斜卡片、滚动场景、WebGL 首屏和完整的 3D 世界：各自的代价和适用场景。' },
      { id: 'free' as const, title: '免费制作 3D 作品集（英文）', text: 'Perlink 上到底哪些是免费的，以及其他免费方案的对比。' },
    ],
    faqTitle: '常见问题',
    faq: [
      { q: '什么是 3D 作品集？', a: '一种作品集网站，你的作品展示在一个访客可以走动的 3D 空间里，比如墙上挂着项目的房间。在 Perlink 上，同一个地址还附带一个普通的作品集页面。' },
      { q: '需要会 Three.js 或写代码吗？', a: '不需要。Perlink 会替你搭好 3D 房间。你只需选一个模板，然后在可视化编辑器里编辑页面、布置房间。' },
      { q: '免费吗？', a: '免费。免费套餐包含一个网站，带作品集页面、3D 房间和数据统计，不限时长。付费套餐提供更多网站、Pro 主题和更长时间的数据统计。' },
      { q: '做一个要多久？', a: '选好模板，页面和房间就已经就绪。大多数人会花一小时左右挑选作品、为每个项目写一句介绍。' },
      { q: '可以展示我自己的项目和照片吗？', a: '可以。在页面上添加相册、视频、链接和描述，再把图片挂到 3D 房间里。访客点一下图片就能看大图。' },
      { q: '手机上能用吗？', a: '能。页面优先为手机设计，3D 房间会根据设备调整画质，始终保持流畅。' },
      { q: '不想看 3D 的人还能看到我的作品吗？', a: '能。你的作品集首先是一个普通网页，3D 房间只需轻点一下。你也可以设置成先打开房间。' },
      { q: '我的 3D 作品集能被搜索引擎搜到吗？', a: '能。页面是一个真正的网页，有你自己设置的搜索标题、描述和分享图片，已发布的网站会提交给搜索引擎。' },
      { q: '可以用自己的域名吗？', a: '可以，需要 Plus 套餐。你的作品集同时还有一个自己选的 perlink.to/你的名字 地址，绑定域名后它依然可用。' },
      { q: '可以把 3D 作品集写进简历吗？', a: '可以。把 perlink.to 地址写进简历和邮件签名，还能从控制台下载二维码印在简历或名片上。' },
    ],
    ctaTitle: '今天就做好你的 3D 作品集',
    ctaText: '占下你的地址，选一个适合你领域的模板，然后发布。免费，无需代码。',
  },
  ja: {
    metaTitle: '3Dポートフォリオサイトを無料で、コード不要 | Perlink',
    metaDescription: '3Dポートフォリオとは何か、どんな人に向いているか、コードなしで作る方法。3Dルームを試して、職種別テンプレートで無料公開。',
    eyebrow: '3Dポートフォリオサイト',
    title: 'コードを書かずに、3Dポートフォリオサイトを',
    intro: '作品を、すっきりしたポートフォリオページと、歩き回れる小さな3Dルームの両方で見せましょう。壁にはあなたのプロジェクトが飾られます。テンプレートを選んで作品を追加し、perlink.to/あなたの名前 で公開。Three.js も Blender も、サーバーの準備もいりません。',
    note: '無料ではじめられる · スマホ対応 · 5言語対応',
    tryLink: '3Dルームを試す',
    heroAlt: '浮かぶ島の上にある Perlink の3Dルーム',
    demoTitle: 'ここで3Dポートフォリオを体験',
    demoText: 'これは本物の Perlink のルームで、あなたのブラウザで動いています。デザイナー、開発者、写真家、建築家、学生を切り替えて、見回し、壁の作品をタップしてみてください。',
    whatTitle: '3Dポートフォリオとは？',
    what: [
      '3Dポートフォリオとは、サムネイルが並ぶ平面のページだけでなく、訪れた人が動き回れる立体空間の中に作品を置いたポートフォリオサイトです。壁にプロジェクトを飾った部屋だったり、GitHub が開くノートパソコンが置かれた机だったり、小さなワールドまるごとだったりします。ブラウザで動くので、何もインストールする必要はありません。',
      '有名な3Dポートフォリオの多くは、開発者が Three.js や WebGL で何週間もかけて手作りしたものです。だからこそ目を引きますが、だからこそほとんどの人は作れません。Perlink は3Dの部分を代わりに引き受けます。普通のポートフォリオページを埋めるだけで、その内容がドラッグで配置できるルームになります。',
      '優れた3Dポートフォリオは、普通のページを置き換えるのではなく、それに加わるものです。20人の候補者を流し見する採用担当者には、1分以内に名前、ベストな3つのプロジェクト、連絡方法が必要です。だから Perlink のポートフォリオは両方を備えています。まず軽快なページがあり、ワンタップでルームへ（お好みで逆にもできます）。',
    ],
    diffTitle: '3Dポートフォリオと普通のポートフォリオの違い',
    diffColumns: ['普通のポートフォリオ', 'Perlink の3Dポートフォリオ'] as [string, string],
    diff: [
      ['訪問者がすること', 'サムネイルのページをスクロール', 'ページを読んでから、ルームに入って作品をタップ'],
      ['記憶に残るもの', 'ベストな作品（先頭にあれば）', 'ルームそのものと、それを作ったあなた'],
      ['サイトの滞在時間', '1分未満のことが多い', '長め：探索してから帰る'],
      ['スマホでの読み込み', '速い', 'ページは同じく速く、ルームは開いたときだけ読み込み'],
      ['Google での表示', 'される', 'される：ページは独自のタイトルと説明を持つ本物のHTML'],
      ['作る手間', 'サイトビルダーで半日', '同じ半日：ルームはページから自動で作られる'],
    ] as [string, string, string][],
    diffMore: '普通のポートフォリオのほうが向いている場合も含めた、詳しい比較を読む（英語）',
    twoTitle: 'ひとつのアドレスで、ふたつの見せ方',
    twoText: '訪問者は、どこでも見られる軽快なポートフォリオページに着地します。ワンタップで、あなたの3Dルームへ。',
    pageLabel: 'ポートフォリオページ',
    pageText: '自己紹介、代表作、リンク、連絡先。すぐに読み込まれ、どのスマホでも読みやすい。',
    pageAlt: 'Perlink で作った個人ポートフォリオページ',
    roomLabel: '3Dルーム',
    roomText: '同じページが、浮かぶ大地の上のルームに。昼でも夜でも、音楽とタップできるものと一緒に。',
    roomAlt: '夜の街にある Perlink の3Dルーム',
    whoTitle: '3Dポートフォリオが向いている人',
    whoText: '言葉で説明するより、見せたほうが早い作品を持つすべての人に。職種ごとに、何を見せてルームをどう整えるかのガイドがあります。',
    whoMore: 'ガイドを読む（英語）',
    who: [
      { id: 'designer' as const, icon: 'i-lucide-pen-tool', title: 'デザイナー', text: 'グラフィック、プロダクト、UXデザイナーに。ページにはケーススタディ、ルームにはベストなビジュアルを額装して。' },
      { id: 'developer' as const, icon: 'i-lucide-code-xml', title: '開発者', text: 'リリースしたプロジェクト、技術スタック、GitHub が開くノートパソコン。Three.js に何週間も費やす必要はありません。' },
      { id: 'photographer' as const, icon: 'i-lucide-camera', title: '写真家', text: '歩きながら眺めるギャラリーの壁。ページには撮影プランと予約を。' },
      { id: 'architect' as const, icon: 'i-lucide-ruler', title: '建築家・インテリアデザイナー', text: '空間の作品を空間で見せる。竣工写真、パース、図面を、1つの壁に1プロジェクトずつ。' },
      { id: 'student' as const, icon: 'i-lucide-graduation-cap', title: '学生・新卒', text: '授業や個人のプロジェクト、履歴書、就職イベント用のQRコード。記憶に残る最初のポートフォリオに。' },
    ],
    notFor: { title: '必要ないかもしれない場合', text: '仕事の大半が文章だったり、採用側がPDFしか求めなかったりするなら、普通のページで十分です。Perlink ではルームをオフにして、ページだけを使えます。' },
    templatesTitle: '職種別のポートフォリオテンプレート',
    templatesText: 'どれもサンプル作品、テーマ、合う3Dルーム付き。いちばん近いものを選んで、自分のものにしましょう。',
    stepsTitle: '3Dポートフォリオの作り方（ステップごと）',
    stepsText: 'ゼロから公開まで約1時間。そのほとんどは作品選びの時間です。',
    steps: [
      { title: 'ベストな作品を4〜8点選ぶ', text: 'すべてを並べるより、少数精鋭のほうが効果的です。次に狙う仕事やクライアントに合う作品を選び、それぞれ何のための作品か一行添えましょう。' },
      { title: 'アドレスを取得する', text: 'perlink.to/あなたの名前 を選びます。履歴書やSNSと同じ名前にすると、見つけてもらいやすくなります。' },
      { title: '職種別のテンプレートから始める', text: 'デザイナー、開発者、写真家、建築家、学生。テンプレートがレイアウト、テーマ、合うルームを用意します。' },
      { title: 'ページを埋める', text: '名前と、何をしている人かを一文で。続いて作品のアルバム、経歴のタイムライン、推薦の声、問い合わせフォーム。' },
      { title: 'ルームを飾る', text: 'ベストな画像をフォトフレームに入れ、ノートパソコンに GitHub や Behance をリンクし、大地、昼か夜か、好みで音楽を選びます。' },
      { title: 'スマホで確認する', text: 'ページとルームをスマホで開きます。ルームを開かなくても、名前、ベストな作品、連絡先が見えるか確かめましょう。' },
      { title: '公開してシェアする', text: '検索用のタイトルと説明を設定し、リンクをプロフィール、履歴書、メール署名に。TikTok や Reels 用に、ルームの短い動画を撮るのもおすすめです。' },
    ],
    cta: '3Dポートフォリオをつくる',
    templates: 'すべてのテンプレートを見る',
    checkTitle: '3Dポートフォリオに入れるもの、入れないもの',
    doTitle: '入れるもの',
    do: [
      '名前、職種、拠点を、ページの最初の数行に',
      '4〜8件のプロジェクト。それぞれ課題とあなたの役割を一文で',
      '各プロジェクトのいちばん強い画像をルームのフレームに。ひと目でルームが物語を伝えます',
      'わかりやすい連絡手段：問い合わせフォーム、メール、予約を、ページに置き、ルームからもリンク',
      '作品を裏付けるリンク：GitHub、Behance、Dribbble、公開中のプロダクト、掲載記事',
    ],
    dontTitle: '入れないもの',
    dont: [
      'これまでのすべてのプロジェクト。古い作品や関係ない作品は、ベストな作品の印象を薄めます',
      '圧縮していない巨大な画像。ページもルームも重くなります。幅2,000pxの JPEG か WebP で十分です',
      '公開できない作品。NDAのあるクライアントワークは掲載前に確認するか、ファイルなしで説明しましょう',
      '何もすることがないルーム。どのオブジェクトも、作品を見せるか、どこかへ案内するようにしましょう',
      'ルームの中だけにある連絡先。ルームを開かない人にも見つけられるようにしましょう',
    ],
    whyTitle: 'なぜ3Dポートフォリオなのか',
    whyText: 'ポートフォリオは覚えてもらうためのもの。探索できるルームは、サムネイルのグリッドをもうひとつ増やすより、ずっと記憶に残ります。',
    why: [
      { icon: 'i-lucide-sparkles', title: '目立つ', text: '採用担当者やクライアントは毎日何十ものポートフォリオを見ます。あなたのものは、歩き回ったポートフォリオとして記憶されます。' },
      { icon: 'i-lucide-image', title: '作品を壁に', text: '写真、アートワーク、プロジェクトの画像をルームに飾り、すべてのギャラリーはページに。' },
      { icon: 'i-lucide-smartphone', title: 'スマホ向け', text: 'ルームは端末に合わせて調整され、ページはすぐ開くので、Instagram や TikTok からのリンクもスムーズです。' },
      { icon: 'i-lucide-clapperboard', title: 'ルームの動画', text: 'TikTok、Reels、Shorts 向けに、ルームを巡る縦型動画をエディタからそのまま録画できます。' },
      { icon: 'i-lucide-search', title: 'Google で見つかる', text: 'ポートフォリオページは独自のタイトルと説明を持つ本物のウェブページで、検索エンジンに対応しています。' },
      { icon: 'i-lucide-chart-column', title: '訪問者がわかる', text: 'サイトごとのアクセス数とクリック数、履歴書や名刺に使えるQRコード。' },
    ],
    compareTitle: 'Perlink か、自分でコードを書くか',
    codeColumn: '自分でコードを書く',
    rows: [
      { label: 'ポートフォリオ公開までの時間', perlink: '数分', code: '数日〜数週間' },
      { label: 'Three.js、Blender、WebGL のスキル', perlink: '不要', code: '必要' },
      { label: 'ホスティングとアドレス', perlink: '込み（perlink.to/あなたの名前）', code: '自分で用意' },
      { label: '作品の更新', perlink: 'エディタで。スマホでもパソコンでも', code: 'コードを変更してデプロイ' },
      { label: '遅いスマホや検索エンジン向けの普通のページ', perlink: '標準搭載', code: 'それも自分で作る' },
    ],
    effectsMore: '3Dエフェクトを自分で作りたい？仕組みと読み込み時間への影響を読む（英語）',
    readTitle: 'さらに読む',
    read: [
      { id: 'examples' as const, title: '3Dポートフォリオの事例（英語）', text: 'ウェブで話題の3Dポートフォリオと、それぞれが優れている理由、そして今日作れるもの。' },
      { id: 'compare' as const, title: '3Dポートフォリオと普通のポートフォリオ（英語）', text: '普通のポートフォリオのほうが向いている場合も含めた、率直な比較。' },
      { id: 'effects' as const, title: '3Dエフェクトのあるポートフォリオサイト（英語）', text: '傾くカード、スクロール演出、WebGL のヒーロー、まるごとのワールド。それぞれのコストと使いどころ。' },
      { id: 'free' as const, title: '3Dポートフォリオを無料で作る（英語）', text: 'Perlink で無料でできることの詳細と、ほかの無料の方法との比較。' },
    ],
    faqTitle: 'よくある質問',
    faq: [
      { q: '3Dポートフォリオとは何ですか？', a: '壁にプロジェクトを飾った部屋のように、訪問者が動き回れる3D空間の中で作品を見せるポートフォリオサイトです。Perlink では、同じアドレスに普通のポートフォリオページも付いています。' },
      { q: 'Three.js やプログラミングの知識は必要ですか？', a: 'いいえ。3Dルームは Perlink が作ります。テンプレートを選んだら、ビジュアルエディタでページを編集し、ルームを配置するだけです。' },
      { q: '無料ですか？', a: 'はい。無料プランには、ポートフォリオページ、3Dルーム、アクセス解析付きのサイトが1つ含まれ、期間の制限はありません。有料プランでは、サイト数、Pro テーマ、より長い期間のアクセス解析が加わります。' },
      { q: '作るのにどれくらいかかりますか？', a: 'テンプレートを選んだ時点で、ページとルームはできあがっています。多くの人は、作品を選んで各プロジェクトに一行書くのに1時間ほどかけています。' },
      { q: '自分のプロジェクトや写真を載せられますか？', a: 'はい。ページにはフォトアルバム、動画、リンク、説明を追加でき、3Dルームには写真を飾れます。訪問者は写真をタップすると大きく表示できます。' },
      { q: 'スマホでも動きますか？', a: 'はい。ページはスマホ優先で作られており、3Dルームは端末に合わせて画質を調整するので、なめらかに動きます。' },
      { q: '3Dを見たくない人にも作品は見えますか？', a: 'はい。あなたのポートフォリオはまず普通のウェブページで、3Dルームはワンタップ先にあります。ルームを先に開くように設定することもできます。' },
      { q: '3Dポートフォリオは Google に表示されますか？', a: 'はい。ページは、検索用のタイトル、説明、シェア画像を自分で設定できる本物のウェブページで、公開したサイトは検索エンジンに通知されます。' },
      { q: '独自ドメインは使えますか？', a: 'はい、Plus プランで使えます。ポートフォリオは自分で選んだ perlink.to/あなたの名前 にもあり、独自ドメインをつないだ後も使えます。' },
      { q: '3Dポートフォリオを履歴書に載せられますか？', a: 'はい。perlink.to のアドレスを履歴書やメール署名に入れ、ダッシュボードのQRコードを履歴書や名刺に印刷しましょう。' },
    ],
    ctaTitle: '今日、3Dポートフォリオをつくろう',
    ctaText: 'アドレスを取得し、職種に合うテンプレートを選んで公開。無料で、コードも不要です。',
  },
  ko: {
    metaTitle: '3D 포트폴리오 사이트, 코딩 없이 무료로 | Perlink',
    metaDescription: '3D 포트폴리오란 무엇이고 누구에게 맞는지, 코딩 없이 만드는 법. 3D 룸을 직접 체험하고 분야별 템플릿으로 무료 공개하세요.',
    eyebrow: '3D 포트폴리오 사이트',
    title: '코딩 없이 만드는 3D 포트폴리오 사이트',
    intro: '작업물을 깔끔한 포트폴리오 페이지로, 그리고 벽에 프로젝트가 걸린 작은 3D 룸으로 보여 주세요. 템플릿을 고르고 작업을 넣은 뒤 perlink.to/내이름 으로 공개하면 끝. Three.js도, Blender도, 호스팅 설정도 필요 없어요.',
    note: '무료로 시작 · 휴대폰에서도 OK · 5개 언어 지원',
    tryLink: '3D 룸 체험하기',
    heroAlt: '떠 있는 섬 위의 Perlink 3D 룸',
    demoTitle: '여기서 바로 3D 포트폴리오를 체험해 보세요',
    demoText: '지금 브라우저에서 실행 중인 진짜 Perlink 룸이에요. 디자이너, 개발자, 사진작가, 건축가, 학생을 바꿔 가며 둘러보고 벽에 걸린 작업을 눌러 보세요.',
    whatTitle: '3D 포트폴리오란?',
    what: [
      '3D 포트폴리오는 작업물이 평평한 썸네일 페이지가 아니라 방문자가 돌아다닐 수 있는 3차원 공간 안에 놓인 포트폴리오 사이트예요. 프로젝트가 액자로 걸린 방일 수도 있고, 노트북을 누르면 GitHub가 열리는 책상일 수도, 작은 세계 전체일 수도 있어요. 브라우저에서 실행되니 설치할 것도 없어요.',
      '유명한 3D 포트폴리오는 대부분 개발자가 Three.js와 WebGL로 직접 만든 것이고, 몇 주가 걸려요. 그래서 눈에 띄고, 또 그래서 대부분은 만들 엄두를 못 내요. Perlink는 3D 부분을 대신 만들어 줘요. 평범한 포트폴리오 페이지를 채우면, 같은 내용이 드래그로 배치할 수 있는 방이 돼요.',
      '좋은 3D 포트폴리오는 일반 페이지를 대체하지 않고 더해 줘요. 지원자 스무 명을 훑어보는 채용 담당자에게는 여전히 1분 안에 이름, 대표 프로젝트 세 개, 연락 방법이 보여야 하니까요. 그래서 Perlink의 포트폴리오는 둘 다예요. 먼저 빠른 페이지, 그리고 탭 한 번 거리의 방(원하면 순서를 바꿀 수도 있어요).',
    ],
    diffTitle: '3D 포트폴리오와 일반 포트폴리오의 차이',
    diffColumns: ['일반 포트폴리오', 'Perlink 3D 포트폴리오'] as [string, string],
    diff: [
      ['방문자가 하는 일', '썸네일 페이지를 스크롤', '페이지를 읽고, 방에 들어가 작업을 눌러 봄'],
      ['기억에 남는 것', '대표 프로젝트(맨 위에 있다면)', '방 그 자체, 그리고 그걸 만든 사람인 나'],
      ['사이트 체류 시간', '대개 1분 미만', '더 길게: 떠나기 전에 둘러봄'],
      ['휴대폰 로딩', '빠름', '페이지는 똑같이 빠르고, 방은 열 때만 로딩'],
      ['Google 검색 노출', '됨', '됨: 페이지는 고유한 제목과 설명이 있는 실제 HTML'],
      ['만드는 수고', '사이트 빌더로 오후 한나절', '같은 오후 한나절: 방은 페이지에서 자동으로 만들어짐'],
    ] as [string, string, string][],
    diffMore: '일반 포트폴리오가 더 나은 경우까지 담은 전체 비교 읽기 (영문)',
    twoTitle: '하나의 주소, 작업을 보는 두 가지 방법',
    twoText: '방문자는 어디서나 잘 열리는 빠른 포트폴리오 페이지에 도착해요. 탭 한 번이면 3D 룸으로 들어가요.',
    pageLabel: '포트폴리오 페이지',
    pageText: '소개, 대표 작업, 링크, 연락처. 빠르게 열리고 어떤 휴대폰에서도 읽기 쉬워요.',
    pageAlt: 'Perlink로 만든 개인 포트폴리오 페이지',
    roomLabel: '3D 룸',
    roomText: '같은 페이지가 떠 있는 땅 위의 방으로. 낮이든 밤이든, 음악과 눌러 볼 것들과 함께.',
    roomAlt: '밤의 도시 속 Perlink 3D 룸',
    whoTitle: '3D 포트폴리오가 어울리는 사람',
    whoText: '설명하기보다 보여 주는 게 쉬운 작업을 하는 모든 분. 분야별로 무엇을 보여 주고 방을 어떻게 꾸밀지 담은 가이드가 있어요.',
    whoMore: '가이드 읽기 (영문)',
    who: [
      { id: 'designer' as const, icon: 'i-lucide-pen-tool', title: '디자이너', text: '그래픽, 프로덕트, UX 디자이너: 페이지에는 케이스 스터디, 방에는 대표 비주얼을 액자로.' },
      { id: 'developer' as const, icon: 'i-lucide-code-xml', title: '개발자', text: '출시한 프로젝트, 기술 스택, 누르면 GitHub가 열리는 노트북. Three.js에 몇 주를 쓰지 않아도 돼요.' },
      { id: 'photographer' as const, icon: 'i-lucide-camera', title: '사진작가', text: '사람들이 따라 걸으며 감상하는 갤러리 벽, 페이지에는 촬영 패키지와 예약.' },
      { id: 'architect' as const, icon: 'i-lucide-ruler', title: '건축가와 인테리어 디자이너', text: '공간 작업을 공간 안에서: 준공 사진, 렌더링, 도면을 프로젝트마다 벽 하나씩.' },
      { id: 'student' as const, icon: 'i-lucide-graduation-cap', title: '학생과 졸업생', text: '과제와 사이드 프로젝트, 이력서, 채용 박람회용 QR 코드. 기억에 남는 첫 포트폴리오.' },
    ],
    notFor: { title: '굳이 필요 없는 경우', text: '작업이 대부분 글이거나, 채용하는 곳이 PDF만 요구한다면 일반 페이지로 충분해요. Perlink에서는 방을 끄고 페이지만 쓸 수 있어요.' },
    templatesTitle: '분야별 포트폴리오 템플릿',
    templatesText: '샘플 작업, 테마, 어울리는 3D 룸이 모두 들어 있어요. 가장 가까운 것을 골라 내 것으로 만드세요.',
    stepsTitle: '3D 포트폴리오 만드는 법, 단계별로',
    stepsText: '처음부터 공개까지 약 1시간. 대부분은 작업을 고르는 데 쓰는 시간이에요.',
    steps: [
      { title: '대표작 4~8개 고르기', text: '모든 작업보다 적지만 강한 프로젝트가 나아요. 다음에 원하는 일이나 고객에 맞는 작업을 고르고, 각각 무엇을 위한 것이었는지 한 줄로 적어 보세요.' },
      { title: '주소 선점하기', text: 'perlink.to/내이름 을 고르세요. 이력서와 SNS 프로필에 쓰는 이름을 쓰면 사람들이 쉽게 찾아요.' },
      { title: '내 분야 템플릿에서 시작하기', text: '디자이너, 개발자, 사진작가, 건축가, 학생. 템플릿이 레이아웃, 테마, 어울리는 방을 정해 줘요.' },
      { title: '페이지 채우기', text: '이름과 하는 일을 한 문장으로, 그다음 작업 앨범, 경력 타임라인, 추천사, 문의 폼.' },
      { title: '방 꾸미기', text: '대표 이미지를 액자에 넣고, 노트북에 GitHub나 Behance를 연결하고, 땅과 낮·밤, 원하면 음악도 골라요.' },
      { title: '휴대폰으로 확인하기', text: '휴대폰에서 페이지와 방을 열어 보세요. 방에 들어가지 않아도 이름, 대표 프로젝트, 연락처가 보이는지 확인하세요.' },
      { title: '공개하고 공유하기', text: '검색용 제목과 설명을 정하고, 링크를 프로필, 이력서, 이메일 서명에 넣으세요. 방을 짧은 영상으로 찍어 TikTok이나 Reels에 올려 보세요.' },
    ],
    cta: '3D 포트폴리오 만들기',
    templates: '템플릿 전체 보기',
    checkTitle: '3D 포트폴리오에 넣을 것, 뺄 것',
    doTitle: '넣을 것',
    do: [
      '페이지 첫 줄에 이름, 하는 일, 활동 지역',
      '4~8개의 프로젝트, 각각 문제와 내 역할을 한 문장으로',
      '각 프로젝트의 가장 강렬한 이미지를 방의 액자에. 방이 한눈에 이야기를 전하도록',
      '분명한 연락 방법: 문의 폼, 이메일, 예약을 페이지에 두고 방에서도 연결',
      '작업을 증명하는 링크: GitHub, Behance, Dribbble, 운영 중인 서비스, 게재된 글',
    ],
    dontTitle: '뺄 것',
    dont: [
      '지금까지 한 모든 프로젝트. 오래되었거나 방향이 다른 작업은 대표작을 흐려요',
      '압축하지 않은 거대한 이미지. 페이지도 방도 느려져요. 가로 2,000px JPEG나 WebP면 충분해요',
      '공개할 수 없는 작업. NDA가 걸린 고객 작업은 먼저 물어보거나, 파일 없이 설명만 하세요',
      '할 게 없는 방. 모든 오브젝트는 작업을 보여 주거나 어딘가로 연결돼야 해요',
      '방 안에만 있는 연락처. 방을 열지 않는 방문자도 찾을 수 있어야 해요',
    ],
    whyTitle: '왜 3D 포트폴리오인가요',
    whyText: '포트폴리오는 기억되기 위해 있어요. 둘러볼 수 있는 방은 또 하나의 썸네일 그리드보다 훨씬 잘 기억돼요.',
    why: [
      { icon: 'i-lucide-sparkles', title: '돋보이기', text: '채용 담당자와 고객은 하루에 수십 개의 포트폴리오를 봐요. 그중 걸어 다녀 본 건 내 것뿐이에요.' },
      { icon: 'i-lucide-image', title: '벽에 걸린 내 작업', text: '사진, 작품, 프로젝트 이미지를 방에 걸고, 전체 갤러리는 페이지에 두세요.' },
      { icon: 'i-lucide-smartphone', title: '휴대폰에 최적화', text: '방은 기기에 맞춰 조절되고 페이지는 바로 열려서, Instagram이나 TikTok의 링크도 문제없어요.' },
      { icon: 'i-lucide-clapperboard', title: '내 방 영상', text: '에디터에서 바로 방을 둘러보는 세로 영상을 녹화해 TikTok, Reels, Shorts에 올려 보세요.' },
      { icon: 'i-lucide-search', title: 'Google 검색 노출', text: '포트폴리오 페이지는 고유한 제목과 설명이 있는 실제 웹페이지라 검색 엔진에 바로 노출될 수 있어요.' },
      { icon: 'i-lucide-chart-column', title: '방문자 확인', text: '사이트별 방문과 클릭 수, 그리고 이력서나 명함용 QR 코드.' },
    ],
    compareTitle: 'Perlink vs 직접 코딩',
    codeColumn: '직접 코딩',
    rows: [
      { label: '포트폴리오 공개까지 걸리는 시간', perlink: '몇 분', code: '며칠에서 몇 주' },
      { label: 'Three.js, Blender, WebGL 스킬', perlink: '필요 없음', code: '필요함' },
      { label: '호스팅과 웹 주소', perlink: '포함 (perlink.to/내이름)', code: '직접 설정' },
      { label: '작업 업데이트', perlink: '휴대폰이나 컴퓨터의 에디터에서', code: '코드 수정 후 배포' },
      { label: '느린 휴대폰과 검색 엔진용 일반 페이지', perlink: '기본 제공', code: '따로 만들어야 함' },
    ],
    effectsMore: '3D 효과를 직접 만들고 싶나요? 작동 원리와 로딩 속도 비용 알아보기 (영문)',
    readTitle: '더 읽어 보기',
    read: [
      { id: 'examples' as const, title: '3D 포트폴리오 사례 (영문)', text: '웹에서 유명한 3D 포트폴리오들, 각각이 효과적인 이유, 그리고 오늘 바로 만들 수 있는 것들.' },
      { id: 'compare' as const, title: '3D 포트폴리오 vs 일반 포트폴리오 (영문)', text: '일반 포트폴리오가 더 나은 경우까지 담은 솔직한 비교.' },
      { id: 'effects' as const, title: '3D 효과가 있는 포트폴리오 사이트 (영문)', text: '틸트 카드, 스크롤 씬, WebGL 히어로, 하나의 세계까지: 각각의 비용과 쓸 때.' },
      { id: 'free' as const, title: '3D 포트폴리오 무료로 만들기 (영문)', text: 'Perlink에서 정확히 무엇이 무료인지, 그리고 다른 무료 방법과의 비교.' },
    ],
    faqTitle: '자주 묻는 질문',
    faq: [
      { q: '3D 포트폴리오란 무엇인가요?', a: '작업물을 방문자가 돌아다닐 수 있는 3D 공간 안에 보여 주는 포트폴리오 사이트예요. 예를 들면 벽에 프로젝트가 걸린 방이죠. Perlink에서는 같은 주소에 일반 포트폴리오 페이지도 함께 있어요.' },
      { q: 'Three.js나 코딩을 알아야 하나요?', a: '아니요. Perlink가 3D 룸을 만들어 줘요. 템플릿을 고른 뒤 비주얼 에디터에서 페이지를 편집하고 방을 배치하면 돼요.' },
      { q: '무료인가요?', a: '네. 무료 요금제에는 포트폴리오 페이지, 3D 룸, 통계가 포함된 사이트 하나가 기간 제한 없이 들어 있어요. 유료 요금제에서는 사이트 수, Pro 테마, 통계 기간이 늘어나요.' },
      { q: '만드는 데 얼마나 걸리나요?', a: '템플릿을 고르는 순간 페이지와 방이 준비돼요. 대부분은 작업을 고르고 프로젝트마다 한 줄씩 쓰는 데 1시간 정도 걸려요.' },
      { q: '내 프로젝트와 사진을 보여 줄 수 있나요?', a: '네. 페이지에 사진 앨범, 영상, 링크, 설명을 넣고, 3D 룸에는 사진을 걸 수 있어요. 방문자가 사진을 누르면 크게 볼 수 있어요.' },
      { q: '휴대폰에서도 작동하나요?', a: '네. 페이지는 모바일 우선으로 만들어졌고, 3D 룸은 기기에 맞춰 품질을 조절해서 부드럽게 움직여요.' },
      { q: '3D를 원하지 않는 사람도 작업을 볼 수 있나요?', a: '네. 포트폴리오는 먼저 일반 웹페이지이고, 3D 룸은 탭 한 번 거리에 있어요. 방이 먼저 열리게 설정할 수도 있어요.' },
      { q: '3D 포트폴리오가 Google에 나오나요?', a: '네. 페이지는 직접 정한 검색 제목, 설명, 공유 이미지가 있는 실제 웹페이지이고, 공개된 사이트는 검색 엔진에 등록돼요.' },
      { q: '내 도메인을 쓸 수 있나요?', a: '네, Plus 요금제에서 가능해요. 포트폴리오는 직접 고른 perlink.to/내이름 주소에도 있고, 도메인을 연결한 뒤에도 계속 작동해요.' },
      { q: '3D 포트폴리오를 이력서에 넣을 수 있나요?', a: '네. 이력서와 이메일 서명에 perlink.to 주소를 넣고, 대시보드에서 QR 코드를 받아 이력서나 명함에 인쇄하세요.' },
    ],
    ctaTitle: '오늘 바로 3D 포트폴리오를 만들어 보세요',
    ctaText: '주소를 선점하고, 내 분야 템플릿을 골라 공개하세요. 무료, 코딩 필요 없음.',
  },
} satisfies Record<AppLanguage, unknown>
const text = computed(() => TEXT[lang.value])

// ---------- SEO ----------
const pageUrl = computed(() => `${PERLINK_URL}${local(PORTFOLIO_BASE.en)}`)
useSeoMeta({
  title: () => text.value.metaTitle,
  description: () => text.value.metaDescription,
  ogTitle: () => text.value.metaTitle,
  ogDescription: () => text.value.metaDescription,
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
    ...alternateLinks(PORTFOLIO_BASE.en),
  ],
  // The page, the product, the pages under it and the questions
  script: () => [{
    type: 'application/ld+json',
    innerHTML: jsonLd([
      perlinkOrganization(),
      perlinkApp(text.value.metaDescription),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl.value}#page`,
        url: pageUrl.value,
        name: text.value.metaTitle,
        description: text.value.metaDescription,
        inLanguage: LANGUAGE_INFO[lang.value].html,
        isPartOf: { '@id': PERLINK_WEBSITE_ID },
        about: { '@id': PERLINK_APP_ID },
        hasPart: (Object.keys(PORTFOLIO_SLUGS) as PortfolioTopicId[]).map(id => ({ '@type': 'WebPage', url: `${PERLINK_URL}${topicLink(id)}` })),
      },
      breadcrumbs([
        { name: 'Perlink', url: `${PERLINK_URL}${lang.value === 'en' ? '' : local('/')}` },
        { name: text.value.eyebrow, url: pageUrl.value },
      ]),
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl.value}#faq`,
        inLanguage: LANGUAGE_INFO[lang.value].html,
        mainEntity: text.value.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ]),
  }],
})

const { locale, setLocale } = useI18n()
onMounted(() => {
  if (lang.value !== 'en' && locale.value !== lang.value) setLocale(lang.value)
})
</script>
