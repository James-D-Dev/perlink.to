<template>
  <!-- The room editor (dashboard): the animated Perlink mark, like the rest of
       the app while it starts -->
  <div v-if="editor" class="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]" aria-busy="true">
    <AppLoader :size="76" />
  </div>

  <!-- A site's 3D view (visitors): the view's outline on a dark sky while the
       scene loads, without our brand on their site -->
  <div v-else class="fixed inset-0 overflow-hidden bg-slate-950" aria-busy="true">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,rgb(56_189_248/0.12),transparent)]" />
    <!-- Top bar -->
    <div class="absolute inset-x-3 top-3 flex items-center justify-between gap-3">
      <div class="shimmer-dark h-12 w-56 rounded-2xl" />
      <div class="flex gap-2">
        <div v-for="i in 2" :key="i" class="shimmer-dark size-10 rounded-full" />
      </div>
    </div>
    <!-- The island -->
    <div class="absolute left-1/2 top-1/2 size-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-[45%] shimmer-dark opacity-70" />
    <!-- Hint pill -->
    <div class="absolute inset-x-0 bottom-4 flex justify-center px-3">
      <div class="shimmer-dark h-8 w-56 rounded-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ editor?: boolean }>()
</script>
