<!-- Link Share Modal Component -->
<template>
  <UModal
    :open="open"
    @update:open="$emit('update:open', false)"
    :title="title || 'Share your Perlink'"
    :ui="{
      content: 'max-w-md',
      body: 'p-4 space-y-4'
    }"
  >
    <template #body>
      <!-- Social Share Buttons -->
      <div class="w-full overflow-hidden">
        <ShareLinkSocials :shortCode="shortLink" />
      </div>

      <!-- Link Copy Section -->
      <div class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-perlink-cyan/20 hover:border-primary transition-colors bg-perlink-cyan/10">
        <div class="flex-1 min-w-0">
          <div
            id="link-url"
            class="text-sm font-medium truncate cursor-pointer select-all"
            @click="selectText"
          >
            {{ shortLink }}
          </div>
        </div>
        <UButton
          color="primary"
          variant="soft"
          size="xl"
          icon="i-lucide-copy"
          @click="copyLink"
        >
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import ShareLinkSocials from "../features/ShareLinkSocials.vue";

const props = defineProps<{
  open: boolean;
  shortCode: string;
  title?: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "view-details": [];
}>();

const toast = useToast();

const shortLink = computed(() => {
  if (props.shortCode)
    return `https://s.perlink.to/${props.shortCode}`;
  return "";
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shortLink.value);
    toast.add({
      title: "Copied to clipboard",
      description: shortLink.value,
      color: "success"
    });
  } catch (error) {
    toast.add({
      title: "Failed to copy",
      description: "Please try again",
      color: "error",
    });
  }
};

const selectText = () => {
  const selection = window.getSelection();
  const element = document.querySelector("#link-url");
  if (!element || !selection) return;

  const range = document.createRange();
  range.selectNode(element);
  selection.removeAllRanges();
  selection.addRange(range);
};
</script>
