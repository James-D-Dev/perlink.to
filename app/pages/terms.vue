<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <main class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600 mb-4">Last updated: {{ new Date().toLocaleDateString() }}</p>
        
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p class="text-gray-700 mb-4">
            By accessing or using Perlink.to ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our service. Perlink.to is a platform 
            that lets users create personal websites and interactive 3D worlds.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p class="text-gray-700 mb-4">
            Perlink.to provides tools for creating and managing:
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Personal websites with customizable templates, themes and content</li>
            <li>Interactive 3D worlds attached to those websites</li>
            <li>Image albums, photo frames and media hosting</li>
            <li>Page analytics</li>
            <li>Links and QR codes created with earlier versions of the Service, which continue to work</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <p class="text-gray-700 mb-4">
            To use certain features, you must create an account using Google authentication. 
            You are responsible for maintaining the security of your account and all activities 
            that occur under your account. You must immediately notify us of any unauthorized use.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
          <p class="text-gray-700 mb-4">You agree not to use the Service to:</p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Create links to illegal, harmful, or fraudulent content</li>
            <li>Distribute malware, viruses, or malicious software</li>
            <li>Engage in phishing or identity theft</li>
            <li>Violate intellectual property rights</li>
            <li>Harass, abuse, or threaten others</li>
            <li>Send spam or unsolicited communications</li>
            <li>Circumvent security measures or access unauthorized areas</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
          <p class="text-gray-700 mb-4">
            You retain ownership of content you create using our Service. By using Perlink.to, 
            you grant us a limited license to host and display your content as necessary to 
            provide the Service. You represent that you have all necessary rights to the content 
            you upload or link to through our platform.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">6. Service Limitations</h2>
          <p class="text-gray-700 mb-4">
            We reserve the right to:
          </p>
          <ul class="list-disc pl-6 text-gray-700 mb-4">
            <li>Limit the number of sites, 3D worlds or uploads per account</li>
            <li>Remove content that violates these terms</li>
            <li>Suspend or terminate accounts for policy violations</li>
            <li>Modify or discontinue features with reasonable notice</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">7. Analytics and Data</h2>
          <p class="text-gray-700 mb-4">
            We collect anonymous click data and analytics to improve our Service. 
            This includes IP addresses (anonymized), referrer information, and device types. 
            For more details, please see our Privacy Policy.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">8. Termination</h2>
          <p class="text-gray-700 mb-4">
            You may delete your account at any time. We reserve the right to suspend or 
            terminate your access to the Service immediately, without prior notice, for 
            conduct that we believe violates these Terms or is harmful to other users.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
          <p class="text-gray-700 mb-4">
            The Service is provided "as is" without warranties of any kind. We do not 
            guarantee that the Service will be uninterrupted, secure, or error-free. 
            You use the Service at your own risk.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
          <p class="text-gray-700 mb-4">
            To the maximum extent permitted by law, Perlink.to shall not be liable for 
            any indirect, incidental, special, consequential, or punitive damages arising 
            from your use of the Service.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
          <p class="text-gray-700 mb-4">
            We may update these Terms from time to time. We will notify users of significant 
            changes via email or through the Service. Continued use after changes constitutes 
            acceptance of the new Terms.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">12. Contact</h2>
          <p class="text-gray-700 mb-4">
            If you have questions about these Terms, please contact us at kimduc10a@gmail.com
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Terms of Service - Perlink.to',
  meta: [
    { name: 'description', content: 'Terms of Service for Perlink, the platform for personal websites and 3D worlds.' }
  ]
});
</script>
