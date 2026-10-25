<template>
  <BioPageView
    :bio-data="bioData"
    :username="username"
    :active-block-id="activeBlockId"
    :style="{
      width: `${RENDER_WIDTH}px`,
      height: `${renderHeight}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      overflow: 'auto',
    }"
    mode="preview"
    @select-block="$emit('selectBlock', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BioData } from "~/types/bio";

defineProps<{
  bioData: BioData;
  username: string;
  activeBlockId?: string | null;
}>();

defineEmits<{ selectBlock: [blockId: string] }>();

const RENDER_WIDTH = 375;
const DISPLAY_WIDTH = 296;
const DISPLAY_HEIGHT = 560;

const scale = computed(() => DISPLAY_WIDTH / RENDER_WIDTH);
const renderHeight = computed(() => DISPLAY_HEIGHT / scale.value);
</script>
