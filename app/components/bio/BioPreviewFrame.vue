<script setup lang="ts">
// A plain screen for the page preview: black border, rounded corners
withDefaults(defineProps<{
  /** Screen width, matching BioPreview's display width */
  width?: number;
  height?: number;
}>(), {
  width: 296,
  height: 560,
});
</script>

<template>
  <div
    class="mx-auto overflow-hidden rounded-[2rem] border-[5px] border-black bg-white shadow-xl"
    :style="{ width: `${width + 10}px`, height: `${height + 10}px` }"
  >
    <slot />
  </div>
</template>
