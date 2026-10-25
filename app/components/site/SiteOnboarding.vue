<template>
  <!-- The checklist itself; the sidebar card opens it (see SiteSetupCard) -->
  <UModal v-model:open="open" :title="t('dashboard.onboarding.title')" :description="t('dashboard.onboarding.progress', { done, total: steps.length })">
    <template #body>
      <div class="space-y-4">
        <!-- Progress bar -->
        <div class="h-1.5 overflow-hidden rounded-full bg-sand-strong">
          <div class="h-full rounded-full bg-ink transition-all" :style="{ width: `${(done / steps.length) * 100}%` }" />
        </div>

        <ol class="divide-y divide-line overflow-hidden rounded-xl ring-1 ring-line">
          <li v-for="step in steps" :key="step.key">
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sand/50 disabled:cursor-default disabled:hover:bg-transparent"
              :disabled="step.done"
              @click="onStep(step.key)"
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

        <div class="flex justify-end">
          <UButton size="xs" color="neutral" variant="ghost" :label="t('dashboard.onboarding.dismiss')" @click="dismiss" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { BioData } from '~/types/bio'
import type { SetupStepKey } from '~/composables/useSiteSetup'

// First steps to a live site, ticked off from the site's own content
const props = defineProps<{
  bioData: BioData
  username: string
  published: boolean
}>()

const emit = defineEmits<{ action: [step: SetupStepKey] }>()

const { t } = useI18n()
const { current, open } = useSiteSetup()

const storageKey = computed(() => `perlink:onboarding:${props.username}`)
const dismissed = ref(false)
const shared = ref(false)

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
  open.value = false
  remember()
}

function onStep(key: SetupStepKey) {
  open.value = false
  emit('action', key)
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

// Hand the sidebar what it needs while this editor is open
const state = { username: props.username, steps, done, visible }
onMounted(() => (current.value = state))
onBeforeUnmount(() => {
  if (current.value === state) current.value = null
  open.value = false
})
</script>
