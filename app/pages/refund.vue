<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <main class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>

      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600 mb-4">Last updated: {{ LEGAL_UPDATED }}</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">1. Try before you pay</h2>
          <p class="text-gray-700 mb-4">
            Perlink has a free plan with no time limit, and every account can try the Plus plan free for 7 days.
            Paid plans never renew or charge you automatically.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">2. 7-day money-back guarantee</h2>
          <p class="text-gray-700 mb-4">
            If you are not happy with a paid plan, ask for a refund within 7 days of the payment and we will refund
            it in full. No questions asked. Your account returns to the free plan when the refund is made.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">3. After 7 days</h2>
          <p class="text-gray-700 mb-4">
            After 7 days, payments are not refunded, but your plan stays active until the end of the period you paid for.
            We make exceptions when the Service did not work as described, for example a long outage, or when a payment
            was made twice or by mistake: tell us and we will refund it.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">4. Not refunded</h2>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Accounts or sites removed for breaking our <NuxtLink to="/terms#acceptable-use" class="underline">Terms of Service</NuxtLink></li>
            <li>Third-party costs, such as a domain name you bought from a registrar</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">5. How to ask for a refund</h2>
          <p class="text-gray-700 mb-4">
            Email {{ SUPPORT_EMAIL }} from the email address of your Perlink account, with the payment code shown in
            Plans → Payment history (it starts with "PL"). We reply within 2 business days and send the money back by bank
            transfer to the account it came from within 5 business days of approving it.
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Refund Policy - Perlink',
  meta: [{ name: 'description', content: 'How refunds work for Perlink paid plans: 7-day money-back guarantee.' }],
})
</script>
