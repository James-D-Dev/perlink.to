<template>
  <!-- Chinese, Japanese and Korean marketing pages (pages/{zh,ja,ko}): the
       same components as the English pages, at /<lang><English address>;
       the language comes from the URL (useMarketingLang) -->
  <MarketingMkLanding v-if="target.kind === 'home'" />
  <MarketingMkTemplates v-else-if="target.kind === 'templates'" />
  <MarketingMkAffiliates v-else-if="target.kind === 'affiliates'" />
  <MarketingMkPortfolio3d v-else-if="target.kind === 'portfolio'" />
  <MarketingMkAbout v-else-if="target.kind === 'about'" />
  <MarketingMkUseCase v-else-if="target.kind === 'useCase'" :id="target.id" />
  <MarketingMkGuide v-else-if="target.kind === 'guide'" :id="target.id" />
</template>

<script setup lang="ts">
import { USE_CASES } from '~/data/useCases'
import { ABOUT_PAIR, GUIDES } from '~/data/guides'

type Target =
  | { kind: 'home' | 'templates' | 'affiliates' | 'portfolio' | 'about' }
  | { kind: 'useCase' | 'guide'; id: string }

const route = useRoute()

const target = computed<Target>(() => {
  // "/ja/birthday-website" → "/birthday-website"
  const en = route.path.replace(/^\/(zh|ja|ko)(?=\/|$)/, '').replace(/\/$/, '') || '/'
  if (en === '/') return { kind: 'home' }
  if (en === '/templates') return { kind: 'templates' }
  if (en === '/affiliates') return { kind: 'affiliates' }
  if (en === '/3d-portfolio') return { kind: 'portfolio' }
  if (en === ABOUT_PAIR[0]) return { kind: 'about' }
  const useCase = USE_CASES.find(item => item.path.en === en)
  if (useCase) return { kind: 'useCase', id: useCase.id }
  const guide = GUIDES.find(item => item.path.en === en)
  if (guide) return { kind: 'guide', id: guide.id }
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
})
</script>
