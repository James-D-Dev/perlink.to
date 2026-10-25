<template>
  <LegalShell :title="doc.title" :intro="doc.intro" :description="doc.description" updated>
    <LegalDoc :doc="doc" />
  </LegalShell>
</template>

<script setup lang="ts">
import { TERMS } from '~/data/legal/terms'

definePageMeta({ layout: 'default', colorMode: 'light' })
const lang = useLegalLang()
const doc = computed(() => TERMS[lang.value])
</script>
