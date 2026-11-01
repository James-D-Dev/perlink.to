<template>
  <template v-if="setup?.visible.value">
    <!-- Collapsed sidebar: the ring with its count, so it reads as progress
         and not as something loading -->
    <UTooltip v-if="collapsed" :text="t('dashboard.onboarding.cardTitle')">
      <button
        type="button"
        class="mx-auto mt-4 flex size-12 items-center justify-center rounded-full transition-colors hover:bg-sand"
        :aria-label="t('dashboard.onboarding.cardTitle')"
        @click="openChecklist"
      >
        <SiteProgressRing :value="progress" :size="40" :label="`${setup.done.value}/${total}`" />
      </button>
    </UTooltip>

    <div v-else class="mt-4 rounded-2xl bg-paper p-4 ring-1 ring-line">
      <div class="flex items-center gap-3">
        <SiteProgressRing :value="progress" :size="40" :label="`${setup.done.value}/${total}`" />
        <div class="min-w-0">
          <p class="text-sm font-medium text-ink">{{ t('dashboard.onboarding.cardTitle') }}</p>
          <p class="text-xs text-ink-muted">{{ t('dashboard.onboarding.progress', { done: setup.done.value, total }) }}</p>
        </div>
      </div>
      <!-- Quiet: the sidebar's one primary button is "Create a site" -->
      <UButton
        size="sm"
        block
        color="neutral"
        variant="soft"
        trailing-icon="i-lucide-arrow-right"
        :label="t('dashboard.onboarding.cardAction')"
        class="mt-3"
        @click="openChecklist"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
defineProps<{ collapsed?: boolean }>()

const { t } = useI18n()
const { current: setup, open } = useSiteSetup()

const total = computed(() => setup.value?.steps.value.length ?? 5)
function openChecklist() {
  if (setup.value?.openChecklist) setup.value.openChecklist()
  else open.value = true
}

const progress = computed(() => (setup.value ? setup.value.done.value / total.value : 0))
</script>
