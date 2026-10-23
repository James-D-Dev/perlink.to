<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Head>
      <Title>Pricing - Perlink.to</Title>
      <Meta name="description" content="Choose the perfect plan for your portfolio pages and templates. Free, Starter, Plus and Pro plans available." />
    </Head>
    <div class="py-8 md:py-12"></div>

    <!-- Hero -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
        Simple, transparent pricing
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Choose the perfect plan for your needs. Upgrade or downgrade anytime.
      </p>
    </div>

    <!-- Pricing Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div class="grid md:grid-cols-4 gap-3">
        <!-- Free Plan -->
        <UCard class="bg-white border-gray-200 overflow-hidden rounded-2xl" :ui="{ body: '!p-0' }">
          <!-- Dark Header -->
          <div class="bg-slate-900 text-white px-6 py-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">Free</h2>
              <UBadge color="neutral" variant="soft" size="sm">With ads</UBadge>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Price -->
            <div class="mb-6">
              <span class="text-5xl font-bold text-slate-900">$0</span>
              <span class="text-slate-600 ml-1">Forever</span>
              <p class="text-sm text-slate-500 mt-1">No credit card required</p>
            </div>

            <!-- CTA Button -->
            <UButton 
              to="/login" 
              variant="outline" 
              color="primary" 
              block 
              size="xl"
              class="rounded-full justify-between px-4"
            >
              <span>Start Free</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
            </UButton>

            <!-- Features -->
            <div class="mt-8">
              <p class="text-sm font-medium text-slate-700 mb-4">Free includes:</p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">1 page</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">Basic QR codes</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">30-day analytics</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">1 custom theme</span>
                </li>
              </ul>
            </div>

            <!-- Bottom note -->
            <p class="mt-6 pt-4 border-t border-gray-100 text-xs text-slate-500">
              1 page, templates & basic analytics
            </p>
          </div>
        </UCard>

        <!-- Starter Plan -->
        <UCard class="bg-white border-gray-200 overflow-hidden rounded-2xl" :ui="{ body: '!p-0' }">
          <!-- Dark Header -->
          <div class="bg-slate-900 text-white px-6 py-4">
            <h2 class="text-xl font-bold">Starter</h2>
          </div>
          
          <div class="p-6">
            <!-- Price -->
            <div class="mb-6">
              <span class="text-5xl font-bold text-slate-900">$5</span>
              <span class="text-slate-600 ml-1">/month</span>
              <p class="text-sm text-slate-500 mt-1">$60 billed annually</p>
            </div>

            <!-- CTA Button -->
            <UButton 
              to="/login" 
              variant="outline" 
              color="primary" 
              block 
              size="xl"
              class="rounded-full justify-between px-4"
            >
              <span>Get Started</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
            </UButton>

            <!-- Features -->
            <div class="mt-8">
              <p class="text-sm font-medium text-slate-700 mb-4">Everything in Free, plus:</p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span class="text-slate-600"><strong>2 pages</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span class="text-slate-600">Custom QR codes</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span class="text-slate-600">90-day analytics</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span class="text-slate-600">5 custom themes</span>
                </li>
              </ul>
            </div>

            <!-- Bottom note -->
            <p class="mt-6 pt-4 border-t border-gray-100 text-xs text-slate-500">
              2 pages, 5 themes & 90-day analytics
            </p>
          </div>
        </UCard>

        <!-- Plus Plan - Shows first on mobile -->
        <div class="relative order-first md:order-none">
          <!-- Recommended Badge -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <UBadge color="secondary" size="md" class="font-semibold px-4 shadow-sm">
              Recommended
            </UBadge>
          </div>
          
          <UCard class="bg-white border-2 border-primary overflow-hidden relative rounded-2xl" :ui="{ body: '!p-0' }">
            <!-- Orange Header -->
            <div class="bg-primary text-white px-6 py-4">
              <h2 class="text-xl font-bold">Plus</h2>
            </div>
            
            <div class="p-6">
              <!-- Price -->
              <div class="mb-6">
                <span class="text-5xl font-bold text-slate-900">$9</span>
                <span class="text-slate-600 ml-1">/month</span>
                <p class="text-sm text-slate-500 mt-1">$108 billed annually</p>
              </div>

              <!-- CTA Button -->
              <UButton 
                to="/login" 
                color="primary" 
                block 
                size="xl"
                class="rounded-full justify-between px-4"
              >
                <span>Upgrade to Plus</span>
                <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
              </UButton>

              <!-- Features -->
              <div class="mt-8">
                <p class="text-sm font-medium text-slate-700 mb-4">Everything in Free, plus:</p>
                <ul class="space-y-3 text-sm">
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span class="text-slate-600"><strong>10 pages</strong></span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span class="text-slate-600">Customizable QR codes</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span class="text-slate-600">Full analytics history</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span class="text-slate-600">Premium themes</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span class="text-slate-600">Remove branding</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span class="text-slate-600">Custom domain</span>
                  </li>
                </ul>
              </div>

              <!-- Bottom note -->
              <p class="mt-6 pt-4 border-t border-gray-100 text-xs text-slate-500">
                10 pages, custom domain & full analytics
              </p>
            </div>
          </UCard>
        </div>

        <!-- Pro Plan -->
        <UCard class="bg-white border-gray-200 overflow-hidden rounded-2xl" :ui="{ body: '!p-0' }">
          <!-- Dark Header -->
          <div class="bg-slate-900 text-white px-6 py-4">
            <h2 class="text-xl font-bold">Pro</h2>
          </div>
          
          <div class="p-6">
            <!-- Price -->
            <div class="mb-6">
              <span class="text-5xl font-bold text-slate-900">$29</span>
              <span class="text-slate-600 ml-1">/month</span>
              <p class="text-sm text-slate-500 mt-1">$348 billed annually</p>
            </div>

            <!-- CTA Button -->
            <UButton 
              to="/login" 
              variant="outline" 
              color="primary" 
              block 
              size="xl"
              class="rounded-full justify-between px-4"
            >
              <span>Upgrade to Pro</span>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
            </UButton>

            <!-- Features -->
            <div class="mt-8">
              <p class="text-sm font-medium text-slate-700 mb-4">Everything in Pro, plus:</p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600"><strong>Unlimited pages</strong></span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">Advanced QR & API access</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">Advanced analytics</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">Custom CSS themes</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">Team (5 members)</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span class="text-slate-600">Priority support</span>
                </li>
              </ul>
            </div>

            <!-- Bottom note -->
            <p class="mt-6 pt-4 border-t border-gray-100 text-xs text-slate-500">
              Unlimited everything with team features
            </p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div class="grid md:grid-cols-2 gap-6">
        <UCard class="bg-white">
          <h3 class="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
          <p class="text-gray-600 text-sm">Yes, you can change your plan at any time. Changes take effect immediately.</p>
        </UCard>
        <UCard class="bg-white">
          <h3 class="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
          <p class="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for Pro plans.</p>
        </UCard>
        <UCard class="bg-white">
          <h3 class="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
          <p class="text-gray-600 text-sm">Plus and Pro plans come with a 14-day free trial. No credit card required.</p>
        </UCard>
        <UCard class="bg-white">
          <h3 class="font-semibold text-gray-900 mb-2">What happens if I exceed my limits?</h3>
          <p class="text-gray-600 text-sm">You'll be prompted to upgrade. Your existing content remains accessible.</p>
        </UCard>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500 text-sm">
          Questions? Contact us at <a href="mailto:kimduc10a@gmail.com" class="text-primary-600 hover:underline">kimduc10a@gmail.com</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>
