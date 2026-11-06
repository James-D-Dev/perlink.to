<template>
  <!-- The wedding guides, on the wedding pillar page (MkUseCase id="wedding") -->
  <MarketingMkSection :title="more.title" :description="more.text">
    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="topic in WEDDING_TOPICS" :key="topic.id">
        <NuxtLink :to="weddingTopicPath(topic, lang)" class="group flex h-full flex-col rounded-2xl bg-sand p-6 transition-colors hover:bg-line md:p-8">
          <span class="mk-eyebrow">{{ topic[lang].eyebrow }}</span>
          <h3 class="mt-3 text-base font-medium text-ink">{{ topic[lang].title }}</h3>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">{{ topic[lang].description }}</p>
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
import { WEDDING_TOPICS, weddingTopicPath } from '~/data/weddingGuides'

const { lang } = useMarketingLang()
const MORE = {
  en: { title: 'Wedding invitation guides', text: 'What to write, how to address each guest, the music, paper or online, two languages and the 3D room.', read: 'Read the guide' },
  vi: { title: 'Cẩm nang thiệp cưới', text: 'Viết lời mời, ghi tên khách, chọn nhạc, thiệp giấy hay online, thiệp song ngữ và phòng 3D.', read: 'Đọc cẩm nang' },
}
const more = computed(() => MORE[lang.value])
</script>
