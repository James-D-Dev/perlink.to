<script setup lang="ts">
import { en as uiEn, vi as uiVi } from "@nuxt/ui/locale";

// Built-in Nuxt UI texts (empty states, close buttons...) follow the dashboard language
const { locale: i18nLocale } = useI18n();
const uiLocale = computed(() => (i18nLocale.value === "vi" ? uiVi : uiEn));

const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === "dark" ? "#0a0a0a" : "#fdfcfb",
);

useHead({
  meta: [
     { charset: 'utf-8' },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

// Defaults for pages that don't set their own
const title = "Perlink — Personal websites and 3D worlds";
const description =
  "Build a personal website for your work, restaurant, hotel or shop, and turn it into a 3D world people can explore.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://perlink.to/images/og.jpg",
  ogSiteName: "Perlink",
  twitterCard: "summary_large_image",
});


onMounted(() => {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light';
  }
});
</script>

<template>
  <!-- Toasts drop in from the top like iOS notifications -->
  <UApp :locale="uiLocale" :toaster="{ position: 'top-center', duration: 4000 }">
    <NuxtLoadingIndicator />
    <AppBootLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
