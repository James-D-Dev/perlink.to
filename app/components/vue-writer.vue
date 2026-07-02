<script lang="ts" setup>
import { ref } from "vue";

const props = withDefaults(defineProps<{
  array: string[];
  eraseSpeed?: number;
  typeSpeed?: number;
  delay?: number;
  intervals?: number;
  start?: number;
  caret?: string;
  iterations?: number;
}>(), {
  eraseSpeed: 100,
  typeSpeed: 200,
  delay: 2000,
  intervals: 500,
  start: 0,
  caret: "cursor",
  iterations: 0,
})

const emit = defineEmits(["typed"]);

const typeValue = ref("");
const count = ref(0);
const typeStatus = ref(false);
const arrayIndex = ref(0);
const charIndex = ref(0);

function typewriter() {
  let loop = 0;
  if (charIndex.value < (props.array[arrayIndex.value]?.length ?? 0)) {
    if (!typeStatus.value) {
      typeStatus.value = true;
    }

    typeValue.value += props.array[arrayIndex.value]?.charAt(charIndex.value) ?? '';
    charIndex.value += 1;
    setTimeout(typewriter, props.typeSpeed);
  } else {
    count.value += 1;

    onTyped(props.array[arrayIndex.value] ?? '');

    if (count.value === props.array.length) {
      loop += 1;
      if (loop === props.iterations) {
        return (typeStatus.value = false);
      }
    }

    typeStatus.value = false;

    setTimeout(eraser, props.delay);
  }
}
function eraser() {
  if (charIndex.value > 0) {
    if (!typeStatus.value) typeStatus.value = true;
    typeValue.value = props.array[arrayIndex.value]?.substring(0, charIndex.value - 1) ?? '';
    charIndex.value -= 1;
    setTimeout(eraser, props.eraseSpeed);
  } else {
    typeStatus.value = false;
    arrayIndex.value += 1;
    if (arrayIndex.value >= props.array.length) arrayIndex.value = 0;
    setTimeout(typewriter, props.typeSpeed + props.intervals);
  }
}
function onTyped(typedString: string) {
  emit("typed", typedString);
}
setTimeout(typewriter, props.start);
</script>

<template>
  <div class="is-typed">
    <slot />
    <span class="typed">{{ typeValue }}</span>
    <span :class="props.caret + ' ' + { typing: typeStatus }">&nbsp;</span>
  </div>
</template>