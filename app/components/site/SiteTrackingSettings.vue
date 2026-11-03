<template>
  <div class="space-y-4">
    <!-- Free plan: the fields show what's possible, the button opens the upgrade prompt -->
    <div v-if="locked" class="flex flex-wrap items-center gap-3 rounded-lg bg-elevated/60 px-3 py-2">
      <UIcon name="i-lucide-lock" class="size-4 shrink-0 text-muted" />
      <p class="min-w-0 flex-1 text-sm text-muted">{{ t('dashboard.tracking.locked') }}</p>
      <UButton size="xs" icon="i-lucide-sparkles" :label="t('dashboard.tracking.upgrade')" @click="upgrade.open('tracking', 'starter')" />
    </div>

    <UFormField
      v-for="field in FIELDS"
      :key="field.key"
      :label="field.label"
      :help="t(`dashboard.tracking.help.${field.key}`)"
      :error="invalid[field.key] ? t('dashboard.tracking.invalid', { example: field.example }) : undefined"
    >
      <UInput
        :model-value="drafts[field.key]"
        :placeholder="field.example"
        :icon="field.icon"
        :disabled="locked"
        autocomplete="off"
        class="w-full"
        @update:model-value="drafts[field.key] = String($event)"
        @blur="commit(field.key)"
      />
    </UFormField>
    <p class="text-xs text-muted">{{ t('dashboard.tracking.note') }}</p>
  </div>
</template>

<script setup lang="ts">
import { TRACKING_FORMATS, normalizeTrackingId, type SiteTracking } from '#shared/tracking'
import type { BioData, ThemeConfig } from '~/types/bio'

const props = defineProps<{ bioData: BioData }>()
const emit = defineEmits<{ updateTheme: [patch: Partial<ThemeConfig>] }>()

const { t } = useI18n()
const { info, ensure } = useBilling()
const upgrade = useUpgradePrompt()
onMounted(() => ensure())

const locked = computed(() => !!info.value && !info.value.limits.tracking)

type Key = keyof SiteTracking
const FIELDS: { key: Key; label: string; example: string; icon: string }[] = [
  { key: 'metaPixel', label: 'Facebook (Meta) Pixel ID', example: '1234567890123456', icon: 'i-simple-icons-meta' },
  { key: 'tiktokPixel', label: 'TikTok Pixel ID', example: 'C4ABCDEF123GHI456JKL', icon: 'i-simple-icons-tiktok' },
  { key: 'ga4', label: 'Google Analytics 4', example: 'G-ABC123XYZ9', icon: 'i-simple-icons-googleanalytics' },
  { key: 'gsc', label: 'Google Search Console', example: 'abcDEF123…', icon: 'i-simple-icons-googlesearchconsole' },
]

const saved = computed<SiteTracking>(() => props.bioData.themeConfig.tracking ?? {})
// What's typed, saved on blur once it's a valid ID (or empty)
const drafts = reactive<Record<Key, string>>({ metaPixel: '', tiktokPixel: '', ga4: '', gsc: '' })
const invalid = reactive<Record<Key, boolean>>({ metaPixel: false, tiktokPixel: false, ga4: false, gsc: false })
watch(saved, (value) => {
  for (const field of FIELDS) if (!invalid[field.key]) drafts[field.key] = value[field.key] ?? ''
}, { immediate: true })

function commit(key: Key) {
  // People paste whole snippets or meta tags: keep just the ID
  const id = normalizeTrackingId(key, drafts[key] ?? '')
  invalid[key] = !!id && !TRACKING_FORMATS[key].test(id)
  if (invalid[key]) return
  drafts[key] = id
  if ((saved.value[key] ?? '') === id) return
  const next: SiteTracking = { ...saved.value, [key]: id || undefined }
  emit('updateTheme', { tracking: next })
}
</script>
