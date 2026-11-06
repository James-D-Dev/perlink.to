<template>
  <MarketingMkWeddingTopic :topic="topic" />
</template>

<script setup lang="ts">
import { findWeddingTopic } from '~/data/weddingGuides'

// A guide page of the wedding invitation cluster (data/weddingGuides), in English
// Keyed by path, so going from one guide to another sets the page up again
definePageMeta({ layout: 'default', colorMode: 'light', key: route => route.path })

const route = useRoute()
const found = findWeddingTopic('en', String(route.params.topic))
if (!found) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const topic = found
</script>
