<template>
  <LegalShell :title="doc.title" :intro="doc.intro" :description="doc.description" updated>
    <LegalDoc :doc="doc" />
  </LegalShell>
</template>

<script setup lang="ts">
import { PRIVACY } from '~/data/legal/privacy'

definePageMeta({ layout: 'default', colorMode: 'light' })
const lang = useLegalLang()
const doc = computed(() => PRIVACY[lang.value])
</script>
