<script setup lang="ts">
const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === "dark" ? "#1b1718" : "white",
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

const title = "Perlink.to - Portfolio Templates & 3D Pages for Anything";
const description =
  "Build a beautiful page for you, your restaurant, your hotel or your shop with portfolio templates, drag-and-drop editing and interactive 3D mode.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://perlink.to/logo-full.png",
  twitterCard: "summary_large_image",
});


onMounted(() => {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light';
  }
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
