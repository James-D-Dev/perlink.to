<template>
  <!-- The wedding guides, on the wedding pillar page (MkUseCase id="wedding") -->
  <MarketingMkSection :title="more.title" :description="more.text">
    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="topic in WEDDING_TOPICS" :key="topic.id">
        <NuxtLink :to="weddingTopicPath(topic, guideLang)" class="group flex h-full flex-col rounded-2xl bg-sand p-6 transition-colors hover:bg-line md:p-8">
          <span class="mk-eyebrow">{{ topic[guideLang].eyebrow }}</span>
          <h3 class="mt-3 text-base font-medium text-ink">{{ topic[guideLang].title }}</h3>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{{ topic[guideLang].description }}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm text-ink">
            {{ more.read }}
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </NuxtLink>
      </li>
    </ul>
  </MarketingMkSection>
</template>

<script setup lang="ts">
import type { AppLanguage } from '#shared/language'
import { WEDDING_TOPICS, weddingTopicPath } from '~/data/weddingGuides'

const { lang } = useMarketingLang()
// The guides are written in English and Vietnamese; other languages list the English ones
const guideLang = computed(() => (lang.value === 'vi' ? 'vi' : 'en'))
const MORE = {
  en: { title: 'Wedding invitation guides', text: 'What to write, how to address each guest, the music, paper or online, two languages and the 3D room.', read: 'Read the guide' },
  vi: { title: 'Cẩm nang thiệp cưới', text: 'Viết lời mời, ghi tên khách, chọn nhạc, thiệp giấy hay online, thiệp song ngữ và phòng 3D.', read: 'Đọc cẩm nang' },
  zh: { title: '婚礼请柬指南（英文）', text: '请柬怎么写、宾客称呼、音乐、纸质还是电子请柬、双语请柬和 3D 房间。', read: '阅读指南' },
  ja: { title: '結婚式の招待状ガイド（英語）', text: '文面の書き方、ゲストの宛名、音楽、紙かWebか、2か国語の招待状、3Dルーム。', read: 'ガイドを読む' },
  ko: { title: '청첩장 가이드 (영문)', text: '문구 작성, 하객 호칭, 음악, 종이 청첩장과 모바일 청첩장, 2개 국어 청첩장, 3D 룸.', read: '가이드 읽기' },
} satisfies Record<AppLanguage, unknown>
const more = computed(() => MORE[lang.value])
</script>
