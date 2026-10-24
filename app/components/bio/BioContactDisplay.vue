<template>
  <section class="space-y-3 p-5" :style="cardStyle">
    <h2 class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">{{ data.title || t('contact') }}</h2>

    <a v-if="data.address" :href="mapHref" target="_blank" rel="noopener noreferrer" class="flex items-start gap-2 text-sm hover:underline">
      <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0" />
      <span>{{ data.address }}</span>
    </a>
    <a v-if="data.phone" :href="`tel:${data.phone.replace(/\s+/g, '')}`" class="flex items-center gap-2 text-sm hover:underline">
      <UIcon name="i-lucide-phone" class="size-4 shrink-0" />
      <span>{{ data.phone }}</span>
    </a>
    <a v-if="data.email" :href="`mailto:${data.email}`" class="flex items-center gap-2 text-sm hover:underline">
      <UIcon name="i-lucide-mail" class="size-4 shrink-0" />
      <span>{{ data.email }}</span>
    </a>

    <div v-if="data.bookingUrl || data.phone" class="flex flex-wrap gap-2 pt-1">
      <a
        v-if="data.bookingUrl"
        :href="safeUrl(data.bookingUrl)"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
        :style="buttonStyle"
      >
        <UIcon name="i-lucide-calendar-check" class="size-4" />
        {{ data.bookingLabel || t('bookNow') }}
      </a>
      <a
        v-if="data.phone"
        :href="`tel:${data.phone.replace(/\s+/g, '')}`"
        class="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
        :class="data.bookingUrl ? '' : 'flex-1'"
        :style="buttonStyle"
      >
        <UIcon name="i-lucide-phone-call" class="size-4" />
        {{ t('call') }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContactBlock } from '~/types/bio'

const props = defineProps<{
  data: ContactBlock['data']
  cardStyle: Record<string, string | undefined>
  buttonStyle: Record<string, string | undefined>
  headingStyle?: Record<string, string | undefined>
}>()

const { t } = useSiteI18n()

// Only allow web links (blocks javascript: and similar)
function safeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^[a-z]+:/i, '')}`
}

const mapHref = computed(() =>
  props.data.mapUrl
    ? safeUrl(props.data.mapUrl)
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.data.address || '')}`,
)
</script>
