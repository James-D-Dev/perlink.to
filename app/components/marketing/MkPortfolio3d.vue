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
        <MarketingMkButton :to="lang === 'vi' ? '/vi/templates' : '/templates'" variant="outline">{{ text.templates }}</MarketingMkButton>
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
          <MarketingMkClaimForm />
        </div>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { PORTFOLIO_BASE, PORTFOLIO_SLUGS, type PortfolioTopicId } from '~/data/portfolio3d/paths'

// "3D portfolio": the pillar page of the topic (/3d-portfolio,
// /vi/portfolio-3d). What a 3D portfolio is, a live room to try, who it suits
// (each with its own page under this one), templates, the full how-to and
// questions. The pages under it go deeper on one search each.
const { lang, copy } = useMarketingLang()

const topicLink = (id: PortfolioTopicId) => `${PORTFOLIO_BASE[lang.value]}/${PORTFOLIO_SLUGS[id][lang.value]}`

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
}
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
    note: 'Free to start · Works on phones · English and Vietnamese',
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
    note: 'Miễn phí để bắt đầu · Chạy tốt trên điện thoại · Tiếng Việt và tiếng Anh',
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
}
const text = computed(() => TEXT[lang.value])

// ---------- SEO ----------
const pageUrl = computed(() => `${PERLINK_URL}${PORTFOLIO_BASE[lang.value]}`)
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
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${PERLINK_URL}${PORTFOLIO_BASE.en}` },
    { rel: 'alternate', hreflang: 'vi', href: `${PERLINK_URL}${PORTFOLIO_BASE.vi}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${PERLINK_URL}${PORTFOLIO_BASE.en}` },
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
        inLanguage: lang.value,
        isPartOf: { '@id': PERLINK_WEBSITE_ID },
        about: { '@id': PERLINK_APP_ID },
        hasPart: (Object.keys(PORTFOLIO_SLUGS) as PortfolioTopicId[]).map(id => ({ '@type': 'WebPage', url: `${PERLINK_URL}${topicLink(id)}` })),
      },
      breadcrumbs([
        { name: 'Perlink', url: `${PERLINK_URL}${lang.value === 'vi' ? '/vi' : ''}` },
        { name: text.value.eyebrow, url: pageUrl.value },
      ]),
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl.value}#faq`,
        inLanguage: lang.value,
        mainEntity: text.value.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ]),
  }],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
