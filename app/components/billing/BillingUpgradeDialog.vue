<template>
  <UModal :open="!!reason" :ui="{ content: 'max-w-md' }" @update:open="(value: boolean) => { if (!value) close() }">
    <template #content>
      <div v-if="reason" class="overflow-hidden rounded-[inherit]">
        <!-- Colour light behind the crown -->
        <div class="relative isolate flex h-28 items-center justify-center overflow-hidden bg-paper">
          <MarketingMkHeroBackdrop :fade="false" />
          <div class="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 text-white shadow-lg">
            <UIcon name="i-lucide-crown" class="size-7" />
          </div>
        </div>

        <div class="p-6 text-center">
          <h2 class="text-lg font-semibold text-ink">{{ t(`dashboard.billing.prompt.${reason.feature}.title`, { plan: planName }) }}</h2>
          <p class="mt-2 text-sm text-ink-muted">{{ t(`dashboard.billing.prompt.${reason.feature}.text`, { plan: planName, n: PLAN_LIMITS[reason.plan].sites }) }}</p>

          <div class="mt-6 flex flex-col gap-2">
            <UButton
              v-if="info?.canTrial && trialCovers"
              block
              size="lg"
              icon="i-lucide-sparkles"
              :loading="startingTrial"
              :label="t('dashboard.billing.prompt.trial')"
              @click="startTrial"
            />
            <UButton
              block
              size="lg"
              :color="info?.canTrial && trialCovers ? 'neutral' : 'primary'"
              :variant="info?.canTrial && trialCovers ? 'outline' : 'solid'"
              :label="t('dashboard.billing.prompt.seePlans')"
              @click="seePlans"
            />
            <UButton block color="neutral" variant="ghost" :label="t('dashboard.billing.prompt.later')" @click="close" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { PLAN_LIMITS, PLAN_ORDER, TRIAL_PLAN } from '#shared/plans'

// Shown when something needs a higher plan (see useUpgradePrompt)
const { t, locale } = useI18n()
const toast = useToast()
const { reason, close } = useUpgradePrompt()
const { info, ensure, refresh } = useBilling()

const startingTrial = ref(false)

const planName = computed(() => (reason.value ? t(`dashboard.billing.plans.${reason.value.plan}.name`) : ''))
// The trial plan has what's asked for
const trialCovers = computed(() => !!reason.value && PLAN_ORDER.indexOf(TRIAL_PLAN) >= PLAN_ORDER.indexOf(reason.value.plan))

watch(reason, (value) => {
  if (value) ensure()
})

async function startTrial() {
  startingTrial.value = true
  try {
    const res = await $fetch<{ expiresAt: string }>('/api/billing/trial', { method: 'POST' })
    await refresh()
    close()
    toast.add({
      title: t('dashboard.billing.trial.started', { date: new Date(res.expiresAt).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB') }),
      color: 'success',
    })
  } catch (error: any) {
    toast.add({ title: t('dashboard.billing.trial.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    startingTrial.value = false
  }
}

function seePlans() {
  const plan = reason.value?.plan
  close()
  navigateTo({ path: '/dashboard/upgrade', query: plan ? { plan } : {} })
}
</script>
