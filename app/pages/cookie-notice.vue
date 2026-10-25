<template>
  <LegalShell :title="doc.title" :intro="doc.intro" :description="doc.description" updated>
    <LegalDoc :doc="doc" />
  </LegalShell>
</template>

<script setup lang="ts">
import { COOKIES } from '~/data/legal/cookies'

definePageMeta({ layout: 'default', colorMode: 'light' })
const lang = useLegalLang()
const doc = computed(() => COOKIES[lang.value])
</script>
