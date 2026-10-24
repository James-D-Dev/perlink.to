<template>
  <div>
    <div class="mb-8 flex justify-center">
      <div class="inline-flex rounded-full bg-sand p-1" role="radiogroup" aria-label="Billing period">
        <button
          v-for="option in periods"
          :key="option.id"
          type="button"
          role="radio"
          :aria-checked="period === option.id"
          class="h-9 rounded-full px-4 text-sm transition-colors"
          :class="period === option.id ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(12,11,10,0.06)]' : 'text-ink-muted hover:text-ink'"
          @click="period = option.id"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="plan in planList"
        :key="plan.id"
        class="flex flex-col rounded-2xl p-6"
        :class="'popular' in plan && plan.popular ? 'bg-ink text-paper' : 'bg-sand text-ink'"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-base font-medium">{{ plan.name }}</h3>
          <span v-if="'popular' in plan && plan.popular" class="rounded-full bg-paper/15 px-2.5 py-0.5 text-xs">Recommended</span>
        </div>
        <p class="mt-1 text-sm" :class="'popular' in plan && plan.popular ? 'text-paper/60' : 'text-ink-muted'">{{ plan.description }}</p>
        <p class="mt-6 flex items-baseline gap-1">
          <span class="mk-display text-4xl" :class="'popular' in plan && plan.popular && 'text-paper'">${{ priceOf(plan) }}</span>
          <span class="text-sm" :class="'popular' in plan && plan.popular ? 'text-paper/60' : 'text-ink-muted'">/ month</span>
        </p>
        <p class="mt-1 h-4 text-xs" :class="'popular' in plan && plan.popular ? 'text-paper/50' : 'text-ink-faint'">
          <template v-if="plan.price > 0 && period === 'annual'">${{ plan.priceAnnual }} billed yearly</template>
        </p>

        <ul class="mt-6 flex-1 space-y-2.5">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-sm">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0" :class="'popular' in plan && plan.popular ? 'text-paper/70' : 'text-ink-muted'" />
            {{ feature }}
          </li>
        </ul>

        <div class="mt-8">
          <MarketingMkButton
            v-if="plan.price === 0"
            :to="loggedIn ? '/dashboard' : '/login'"
            :variant="'popular' in plan && plan.popular ? 'inverse' : 'outline'"
            block
          >
            {{ loggedIn ? 'Your current plan' : 'Start free' }}
          </MarketingMkButton>
          <MarketingMkButton
            v-else
            :href="upgradeMail(plan.name)"
            :variant="'popular' in plan && plan.popular ? 'inverse' : 'solid'"
            block
          >
            Contact us to upgrade
          </MarketingMkButton>
        </div>
      </article>
    </div>
    <p class="mt-6 text-center text-xs text-ink-faint">Online checkout is coming soon. Until then, contact us and we will upgrade your account.</p>
  </div>
</template>

<script setup lang="ts">
import { PLANS } from '~/composables/usePlans'

// Plan cards for /pricing and the dashboard upgrade page
const { loggedIn } = useUserSession()

const periods = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Yearly' },
] as const
const period = ref<'monthly' | 'annual'>('monthly')

const planList = Object.values(PLANS)

function priceOf(plan: (typeof planList)[number]) {
  if (plan.price === 0) return 0
  return period.value === 'annual' ? Math.round((plan.priceAnnual / 12) * 100) / 100 : plan.price
}

function upgradeMail(planName: string) {
  return `mailto:kimduc10a@gmail.com?subject=${encodeURIComponent(`Upgrade to Perlink ${planName}`)}`
}
</script>
