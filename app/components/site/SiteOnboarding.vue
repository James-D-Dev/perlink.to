<template>
  <section v-if="visible" class="mt-4 overflow-hidden rounded-xl bg-paper ring-1 ring-line">
    <div class="flex items-center gap-3 px-4 py-3">
      <!-- Progress ring -->
      <svg viewBox="0 0 36 36" class="size-9 shrink-0 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-sand-strong)" stroke-width="4" />
        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-ink)" stroke-width="4" stroke-linecap="round" :stroke-dasharray="`${(done / steps.length) * 94.2} 94.2`" />
      </svg>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-ink">{{ t('dashboard.onboarding.title') }}</p>
        <p class="text-xs text-ink-muted">{{ t('dashboard.onboarding.progress', { done, total: steps.length }) }}</p>
      </div>
      <UButton
        size="xs"
        color="neutral"
        variant="ghost"
        :icon="collapsed ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
        :aria-label="collapsed ? t('dashboard.onboarding.expand') : t('dashboard.onboarding.collapse')"
        @click="collapsed = !collapsed"
      />
      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" :aria-label="t('dashboard.onboarding.dismiss')" @click="dismiss" />
    </div>

    <ol v-if="!collapsed" class="divide-y divide-line border-t border-line">
      <li v-for="step in steps" :key="step.key">
        <button
          type="button"
          class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sand/50 disabled:cursor-default disabled:hover:bg-transparent"
          :disabled="step.done"
          @click="$emit('action', step.key)"
        >
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-full"
            :class="step.done ? 'bg-ink text-paper' : 'ring-1 ring-ink-faint'"
          >
            <UIcon v-if="step.done" name="i-lucide-check" class="size-3" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm" :class="step.done ? 'text-ink-muted line-through' : 'text-ink'">{{ t(`dashboard.onboarding.steps.${step.key}.title`) }}</span>
            <span v-if="!step.done" class="block text-xs text-ink-muted">{{ t(`dashboard.onboarding.steps.${step.key}.text`) }}</span>
          </span>
          <UIcon v-if="!step.done" name="i-lucide-chevron-right" class="size-4 shrink-0 text-ink-faint" />
        </button>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { BioData } from '~/types/bio'

// First steps to a live site, ticked off from the site's own content
const props = defineProps<{
  bioData: BioData
  username: string
  published: boolean
}>()

defineEmits<{ action: [step: 'photo' | 'bio' | 'contact' | 'publish' | 'share'] }>()

const { t } = useI18n()

const storageKey = computed(() => `perlink:onboarding:${props.username}`)
const dismissed = ref(false)
const shared = ref(false)
const collapsed = ref(false)

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey.value) || '{}')
    dismissed.value = !!saved.dismissed
    shared.value = !!saved.shared
  } catch {}
})

function remember() {
  try {
    localStorage.setItem(storageKey.value, JSON.stringify({ dismissed: dismissed.value, shared: shared.value }))
  } catch {}
}

function dismiss() {
  dismissed.value = true
  remember()
}

/** Called by the editor when the owner copies or shares the link */
function markShared() {
  shared.value = true
  remember()
}
defineExpose({ markShared })

// Something visitors can act on: a link, a social icon, contact details or a form
const hasWayToReach = computed(() =>
  props.bioData.blocks.some((b) => {
    if (b.hidden) return false
    if (b.name === 'links') return b.data?.items?.some(i => i.url)
    if (b.name === 'social') return b.data?.links?.some(l => l.url?.trim())
    if (b.name === 'contact') return !!(b.data?.phone || b.data?.email || b.data?.address || b.data?.bookingUrl)
    return b.name === 'form'
  }),
)

const steps = computed(() => [
  { key: 'photo' as const, done: !!props.bioData.avatarUrl },
  { key: 'bio' as const, done: !!props.bioData.bio?.trim() },
  { key: 'contact' as const, done: hasWayToReach.value },
  { key: 'publish' as const, done: props.published },
  { key: 'share' as const, done: shared.value },
])

const done = computed(() => steps.value.filter(s => s.done).length)
const visible = computed(() => !dismissed.value && done.value < steps.value.length)
</script>
