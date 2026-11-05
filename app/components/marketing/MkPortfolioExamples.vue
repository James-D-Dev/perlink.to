<template>
  <div>
    <!-- Around the web: linked, described in our own words -->
    <ol class="divide-y divide-line border-y border-line">
      <li v-for="(item, i) in web" :key="item.id" class="grid gap-4 py-8 md:grid-cols-[4rem_1fr]">
        <span class="mk-display text-4xl text-ink-faint">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="max-w-3xl">
          <h3 class="text-xl font-medium text-ink">
            <a :href="item.url" target="_blank" rel="noopener" class="underline decoration-line underline-offset-4 hover:decoration-ink">{{ item[lang].name }}</a>
          </h3>
          <p class="mt-1 text-sm text-ink-muted">
            <span v-if="item.author">{{ t.by }} {{ item.author }} · </span>{{ item[lang].who }}
          </p>
          <ul class="mt-4 space-y-2">
            <li v-for="point in item[lang].highlights" :key="point" class="flex gap-3 text-base leading-relaxed text-ink-muted">
              <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-tint" />
              <span>{{ point }}</span>
            </li>
          </ul>
          <p class="mt-4 rounded-xl bg-sand px-4 py-3 text-sm leading-relaxed text-ink">
            <span class="font-medium">{{ t.takeaway }}</span> {{ item[lang].takeaway }}
          </p>
        </div>
      </li>
    </ol>

    <!-- Made on Perlink: the rooms are live right here -->
    <h3 id="perlink-examples" class="mk-display mt-20 scroll-mt-24 text-2xl sm:text-3xl">{{ t.perlinkTitle }}</h3>
    <p class="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{{ t.perlinkText }}</p>
    <div class="mt-8">
      <LazyMarketingMkRoomDemo hydrate-on-visible :initial="selected" />
    </div>
    <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in perlink" :key="item.id" class="flex flex-col rounded-2xl bg-sand p-6">
        <h4 class="text-base font-medium text-ink">{{ item[lang].name }}</h4>
        <p class="mt-1 text-sm text-ink-muted">{{ item[lang].who }}</p>
        <ul class="mt-4 space-y-2">
          <li v-for="point in item[lang].highlights" :key="point" class="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-tint" />
            <span>{{ point }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm leading-relaxed text-ink"><span class="font-medium">{{ t.takeaway }}</span> {{ item[lang].takeaway }}</p>
        <div class="mt-auto flex flex-wrap gap-2 pt-6">
          <button
            v-if="item.demo"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm text-paper transition-opacity hover:opacity-85"
            @click="show(item.demo)"
          >
            <UIcon name="i-lucide-box" class="size-4" />
            {{ t.seeRoom }}
          </button>
          <NuxtLink v-if="item.template" :to="`/templates/${item.template}`" class="inline-flex items-center rounded-full px-4 py-2 text-sm text-ink ring-1 ring-line transition-colors hover:bg-line">
            {{ t.template }}
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PORTFOLIO_EXAMPLES, type DemoRoom } from '~/data/portfolio3d'

// The examples page's roundup: 3D portfolios around the web, then the ones
// you can make on Perlink, with one live room that switches between them
const { lang } = useMarketingLang()
const web = PORTFOLIO_EXAMPLES.filter(item => item.kind === 'web' && item.url)
const perlink = PORTFOLIO_EXAMPLES.filter(item => item.kind === 'perlink')

const TEXT = {
  en: {
    by: 'By',
    takeaway: 'Take this:',
    perlinkTitle: 'Made on Perlink',
    perlinkText: 'Five portfolios you can make today without code. Pick one to open its room above, then start from its template.',
    seeRoom: 'See the room',
    template: 'Use the template',
  },
  vi: {
    by: 'Của',
    takeaway: 'Nên học:',
    perlinkTitle: 'Làm bằng Perlink',
    perlinkText: 'Năm portfolio bạn có thể làm ngay hôm nay mà không cần code. Chọn một cái để mở phòng phía trên, rồi bắt đầu từ mẫu của nó.',
    seeRoom: 'Xem phòng 3D',
    template: 'Dùng mẫu này',
  },
}
const t = computed(() => TEXT[lang.value])

const selected = ref<DemoRoom>(perlink[0]?.demo ?? 'designer')
function show(kind: DemoRoom) {
  selected.value = kind
  document.getElementById('perlink-examples')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
