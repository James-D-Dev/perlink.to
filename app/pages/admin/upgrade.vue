<template>
  <UDashboardPanel id="upgrade">
    <template #header>
      <UDashboardNavbar title="Upgrade Plan">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <!-- Current Plan -->
        <UCard class="bg-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Current Plan</h2>
              <p class="text-gray-500 mt-1">
                You are currently on the <UBadge :color="currentPlanColor" size="sm">{{ currentPlanLabel }}</UBadge> plan
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ currentPlanPrice }}</div>
              <div class="text-sm text-gray-500">/month</div>
            </div>
          </div>
        </UCard>

        <!-- Usage Stats -->
        <UCard class="bg-white" title="Your Usage">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ usage.profiles }}/{{ limits.maxProfiles }}</div>
              <div class="text-sm text-gray-500 mt-1">Bio Profiles</div>
              <UProgress :value="(usage.profiles / limits.maxProfiles) * 100" class="mt-2" />
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ usage.shortLinks }}/{{ limits.maxShortLinks }}</div>
              <div class="text-sm text-gray-500 mt-1">Short Links</div>
              <UProgress :value="(usage.shortLinks / limits.maxShortLinks) * 100" class="mt-2" />
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-900">{{ usage.themes }}/{{ limits.maxThemes }}</div>
              <div class="text-sm text-gray-500 mt-1">Custom Themes</div>
              <UProgress :value="(usage.themes / limits.maxThemes) * 100" class="mt-2" />
            </div>
          </div>
        </UCard>

        <!-- Upgrade Options -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6">Available Plans</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Free -->
            <UCard 
              class="bg-white border-gray-200" 
              :class="{ 'ring-2 ring-green-500': currentPlan === 'free' }"
              :ui="{ body: 'p-6' }"
            >
              <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900">Free</h3>
                <div class="mt-4">
                  <span class="text-3xl font-bold text-gray-900">$0</span>
                  <span class="text-gray-500">/month</span>
                </div>
              </div>

              <UButton 
                v-if="currentPlan !== 'free'" 
                variant="outline" 
                color="neutral" 
                block 
                class="mt-6"
                @click="downgrade('free')"
              >
                Downgrade to Free
              </UButton>
              <UButton 
                v-else 
                color="neutral" 
                variant="soft" 
                block 
                class="mt-6" 
                disabled
              >
                Current Plan
              </UButton>

              <ul class="mt-6 space-y-3 text-sm">
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  1 profile
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  10 short links
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Basic QR codes
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  30-day analytics
                </li>
              </ul>
            </UCard>

            <!-- Pro -->
            <UCard 
              class="bg-white" 
              :class="{ 
                'border-primary-500 ring-2 ring-primary-500': currentPlan === 'pro',
                'border-primary-300': currentPlan !== 'pro'
              }"
              :ui="{ body: 'p-6' }"
            >
              <div class="absolute -top-3 left-1/2 -translate-x-1/2" v-if="currentPlan !== 'pro'">
                <UBadge color="primary" size="sm" class="font-semibold">Recommended</UBadge>
              </div>

              <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900">Pro</h3>
                <div class="mt-4">
                  <span class="text-3xl font-bold text-gray-900">$9</span>
                  <span class="text-gray-500">/month</span>
                </div>
              </div>

              <UButton 
                v-if="currentPlan !== 'pro'" 
                color="primary" 
                block 
                class="mt-6"
                @click="upgrade('pro')"
              >
                {{ currentPlan === 'business' ? 'Downgrade to Pro' : 'Upgrade to Pro' }}
              </UButton>
              <UButton 
                v-else 
                color="primary" 
                variant="soft" 
                block 
                class="mt-6" 
                disabled
              >
                Current Plan
              </UButton>

              <ul class="mt-6 space-y-3 text-sm">
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  <strong>10 profiles</strong>
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  <strong>500 short links</strong>
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Custom QR codes
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Full analytics
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Remove branding
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Custom domain
                </li>
              </ul>
            </UCard>

            <!-- Business -->
            <UCard 
              class="bg-white border-gray-200" 
              :class="{ 'ring-2 ring-purple-500': currentPlan === 'business' }"
              :ui="{ body: 'p-6' }"
            >
              <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900">Business</h3>
                <div class="mt-4">
                  <span class="text-3xl font-bold text-gray-900">$29</span>
                  <span class="text-gray-500">/month</span>
                </div>
              </div>

              <UButton 
                v-if="currentPlan !== 'business'" 
                variant="outline" 
                color="neutral" 
                block 
                class="mt-6"
                @click="upgrade('business')"
              >
                Upgrade to Business
              </UButton>
              <UButton 
                v-else 
                color="neutral" 
                variant="soft" 
                block 
                class="mt-6" 
                disabled
              >
                Current Plan
              </UButton>

              <ul class="mt-6 space-y-3 text-sm">
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  <strong>Unlimited profiles</strong>
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  <strong>Unlimited links</strong>
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Advanced QR & API
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Team features (5)
                </li>
                <li class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                  Priority support
                </li>
              </ul>
            </UCard>
          </div>
        </div>

        <!-- Billing History -->
        <UCard class="bg-white" title="Billing History" v-if="billingHistory.length > 0">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 px-3 font-medium text-gray-700">Date</th>
                <th class="text-left py-2 px-3 font-medium text-gray-700">Description</th>
                <th class="text-left py-2 px-3 font-medium text-gray-700">Amount</th>
                <th class="text-left py-2 px-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in billingHistory" :key="row.date" class="border-b border-gray-100">
                <td class="py-2 px-3">{{ row.date }}</td>
                <td class="py-2 px-3">{{ row.description }}</td>
                <td class="py-2 px-3">{{ row.amount }}</td>
                <td class="py-2 px-3">
                  <UBadge color="success" size="xs">{{ row.status }}</UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'admin'
});

// Current plan (would come from API)
const currentPlan = ref<'free' | 'pro' | 'business'>('free');

const currentPlanLabel = computed(() => ({
  free: 'Free',
  pro: 'Pro',
  business: 'Business'
}[currentPlan.value]));

const currentPlanColor = computed(() => ({
  free: 'neutral' as const,
  pro: 'primary' as const,
  business: 'success' as const
}[currentPlan.value]));

const currentPlanPrice = computed(() => ({
  free: '$0',
  pro: '$9',
  business: '$29'
}[currentPlan.value]));

// Usage stats (would come from API)
const usage = ref({
  profiles: 1,
  shortLinks: 5,
  themes: 1
});

const limits = computed(() => ({
  free: { maxProfiles: 1, maxShortLinks: 10, maxThemes: 1 },
  pro: { maxProfiles: 10, maxShortLinks: 500, maxThemes: 20 },
  business: { maxProfiles: Infinity, maxShortLinks: Infinity, maxThemes: Infinity }
}[currentPlan.value]));

// Billing history
const billingHistory = ref([
  { date: '2024-01-15', description: 'Pro Plan - Monthly', amount: '$9.00', status: 'Paid' }
]);

const billingColumns = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

// Actions
function upgrade(plan: 'pro' | 'business') {
  // TODO: Integrate with payment provider (Stripe, etc.)
  console.log('Upgrading to', plan);
}

function downgrade(plan: 'free') {
  // TODO: Confirm and process downgrade
  console.log('Downgrading to', plan);
}
</script>
