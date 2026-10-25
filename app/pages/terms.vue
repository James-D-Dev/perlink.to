<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <main class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600 mb-4">Last updated: {{ LEGAL_UPDATED }}</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p class="text-gray-700 mb-4">
            By accessing or using Perlink ("the Service", perlink.to), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use the Service. Perlink is a platform that lets people
            and small businesses create personal websites and interactive 3D worlds.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p class="text-gray-700 mb-4">Perlink provides tools for creating and managing:</p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Personal and business websites with customizable templates, themes and content</li>
            <li>Interactive 3D worlds attached to those websites</li>
            <li>Image albums, photo frames and media hosting</li>
            <li>Page analytics</li>
            <li>Custom domains for websites (on paid plans)</li>
            <li>Links and QR codes created with earlier versions of the Service, which continue to work</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <p class="text-gray-700 mb-4">
            You sign in with Google. You must be at least 13 years old (or the minimum age of digital consent in your
            country) to use the Service. You are responsible for the security of your account and for all activity
            under it, and must tell us immediately about any unauthorized use.
          </p>
        </section>

        <section id="acceptable-use" class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use and Prohibited Content</h2>
          <p class="text-gray-700 mb-4">You are responsible for everything you publish with Perlink. You may not use the Service to publish, link to or promote:</p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Scams, fraud, fake giveaways, pyramid or "get rich quick" schemes, and unlicensed investment, trading or crypto offers</li>
            <li>Phishing: pages that imitate a bank, wallet, brand or login page, or that ask visitors for passwords, card numbers or one-time codes</li>
            <li>Malware, viruses or other harmful software</li>
            <li>Sexually explicit content, or any sexual content involving minors</li>
            <li>Violence, terrorism, hate speech, harassment or threats</li>
            <li>Illegal goods and services, including drugs, weapons, counterfeit goods, unlicensed gambling and stolen data</li>
            <li>Content that infringes copyright, trademarks or other rights</li>
            <li>Impersonation of another person, brand or organization</li>
            <li>Spam, unsolicited messages, or misleading links</li>
            <li>Anything that breaks the laws of Vietnam or of the country you operate in</li>
          </ul>
          <p class="text-gray-700 mb-4">You also may not try to get around security measures, overload the Service, or access other accounts.</p>
        </section>

        <section id="reports" class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">5. Reports and Takedowns</h2>
          <p class="text-gray-700 mb-4">
            Anyone can report a site through the "Report" link at the bottom of every Perlink site, or at
            <NuxtLink to="/report" class="underline">perlink.to/report</NuxtLink>. We review reports and may, without prior notice,
            remove a site, disable a custom domain, or suspend an account that breaks these Terms. A site that was taken down cannot be
            published again unless we restore it. If you believe we made a mistake, contact us at {{ SUPPORT_EMAIL }}.
            Rights holders can send copyright notices to the same address.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">6. Content and Intellectual Property</h2>
          <p class="text-gray-700 mb-4">
            You keep ownership of the content you create. By using Perlink, you give us a limited license to host,
            display and back up your content as needed to provide the Service. You confirm that you have the rights to
            everything you upload or link to. Perlink's software, templates, themes and brand remain ours.
          </p>
        </section>

        <section id="plans" class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">7. Plans, Payments and Renewal</h2>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Perlink has a free plan and paid plans (Starter, Plus and Pro). Current prices and what each plan includes are on the <NuxtLink to="/pricing" class="underline">pricing page</NuxtLink>. Prices are in Vietnamese đồng (VND).</li>
            <li>Paid plans are bought for one month or one year and are paid in advance by bank transfer (VietQR). A plan starts when the payment is received and ends at the end of the period. Plans do not renew or charge you automatically; you renew by paying again, and renewing the same plan adds the time to what is left.</li>
            <li>When a plan ends, the account returns to the free plan. Your sites stay online, but features of the paid plan (for example custom domains, publishing with Pro themes, or more sites) are no longer available until you renew.</li>
            <li>Each account can try the Plus plan free once for 7 days. No payment details are needed.</li>
            <li>We may change prices for future periods. A change never affects a period you have already paid for.</li>
            <li>Refunds are covered by our <NuxtLink to="/refund" class="underline">Refund Policy</NuxtLink>.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">8. Service Limits</h2>
          <p class="text-gray-700 mb-4">
            Each plan has limits, such as the number of sites. We may also limit uploads or traffic to protect the
            Service, and may change or discontinue features with reasonable notice.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">9. Analytics and Data</h2>
          <p class="text-gray-700 mb-4">
            We collect anonymous visit and click data for site owners and to improve the Service. IP addresses are
            hashed and never shown to site owners. See our <NuxtLink to="/privacy" class="underline">Privacy Policy</NuxtLink> for details.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">10. Termination</h2>
          <p class="text-gray-700 mb-4">
            You can delete your account at any time in Settings. We may suspend or terminate access to the Service for
            conduct that breaks these Terms or harms other people. If we terminate a paid account for reasons other than
            a breach of these Terms, we refund the unused part of the current period.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">11. Disclaimer of Warranties</h2>
          <p class="text-gray-700 mb-4">
            The Service is provided "as is" without warranties of any kind. We do not guarantee that it will be
            uninterrupted, secure or error-free.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">12. Limitation of Liability</h2>
          <p class="text-gray-700 mb-4">
            To the maximum extent permitted by law, Perlink is not liable for indirect, incidental, special,
            consequential or punitive damages arising from your use of the Service. Our total liability for any claim is
            limited to the amount you paid us in the 12 months before it.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">13. Changes to These Terms</h2>
          <p class="text-gray-700 mb-4">
            We may update these Terms. We will tell users about significant changes by email or in the Service.
            Continuing to use the Service after a change means you accept the new Terms.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">14. Contact</h2>
          <p class="text-gray-700 mb-4">Questions about these Terms: {{ SUPPORT_EMAIL }}</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Terms of Service - Perlink',
  meta: [
    { name: 'description', content: 'Terms of Service for Perlink, the platform for personal websites and 3D worlds.' },
  ],
})
</script>
