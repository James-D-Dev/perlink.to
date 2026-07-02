<script setup lang="ts">
interface Props {
  width?: number;
  height?: number;
}

withDefaults(defineProps<Props>(), {
  width: 320,
  height: 650,
});
</script>

<template>
  <div
    class="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl mx-auto"
    :style="{ width: `${width}px` }"
  >
    <!-- Phone Frame -->
    <div class="bg-black rounded-[2.25rem] overflow-hidden border-4 border-gray-800">
      <!-- Dynamic Island -->
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-24 h-7 bg-black rounded-full"></div>
      </div>

      <!-- Screen Content -->
      <div
        class="bg-white"
        :style="{ height: `${height}px` }"
      >
        <slot />
      </div>

      <!-- Home Indicator -->
      <div class="bg-black py-3 flex justify-center">
        <div class="w-32 h-1 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

