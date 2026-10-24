<template>
  <!-- On a site's own domain, the home page is that site -->
  <SitePage v-if="domain" :username="domain.username" :domain="domain.hostname" />
  <MarketingMkLanding v-else />
</template>

<script setup lang="ts">
definePageMeta({ colorMode: 'light' })
defineOptions({ name: 'IndexPage' })

const domain = useState<{ hostname: string; username: string } | null>('custom-domain', () => null)
</script>
