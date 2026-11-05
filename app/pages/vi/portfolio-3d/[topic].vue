<template>
  <MarketingMkPortfolioTopic :topic="topic" />
</template>

<script setup lang="ts">
import { findTopic } from '~/data/portfolio3d'

// A page of the 3D portfolio cluster (data/portfolio3d), in Vietnamese
// Keyed by path, so going from one topic to another sets the page up again
definePageMeta({ layout: 'default', colorMode: 'light', key: route => route.path })

const route = useRoute()
const found = findTopic('vi', String(route.params.topic))
if (!found) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const topic = found
</script>
