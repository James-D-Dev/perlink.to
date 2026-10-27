<template>
  <!-- The checklist itself; the sidebar card opens it (see SiteSetupCard) -->
  <AppSheet v-model:open="open" :title="t('dashboard.onboarding.title')" :description="t('dashboard.onboarding.progress', { done, total: steps.length })">
    <template #body>
      <div class="space-y-4">
        <!-- Progress bar -->
        <div class="h-1.5 overflow-hidden rounded-full bg-sand-strong">
          <div class="h-full rounded-full bg-tint transition-all" :style="{ width: `${(done / steps.length) * 100}%` }" />
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
                :class="step.done ? 'bg-tint text-white' : 'ring-1 ring-ink-faint'"
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
  </AppSheet>
</template>

<script setup lang="ts">
import type { BioData } from '~/types/bio'
import type { SetupStepKey } from '~/utils/siteSetup'

// First steps to a live site, ticked off from the site's own content
const props = defineProps<{
  bioData: BioData
  username: string
  published: boolean
}>()

const emit = defineEmits<{ action: [step: SetupStepKey] }>()

const { t } = useI18n()
const { current, open } = useSiteSetup()

const dismissed = ref(false)
const shared = ref(false)

onMounted(() => {
  const memory = readSetupMemory(props.username)
  dismissed.value = memory.dismissed
  shared.value = memory.shared
})

const remember = () => writeSetupMemory(props.username, { dismissed: dismissed.value, shared: shared.value })

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

const steps = computed(() => siteSetupSteps(props.bioData, props.published, shared.value))
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
