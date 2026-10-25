<template>
  <LegalShell :title="doc.title" :intro="doc.intro" :description="doc.description" updated>
    <LegalDoc :doc="doc" />
  </LegalShell>
</template>

<script setup lang="ts">
import { REFUND } from '~/data/legal/refund'

definePageMeta({ layout: 'default', colorMode: 'light' })
const lang = useLegalLang()
const doc = computed(() => REFUND[lang.value])
</script>
