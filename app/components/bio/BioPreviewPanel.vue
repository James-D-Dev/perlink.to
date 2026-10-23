<template>
  <div class="space-y-4">
    <!-- Preview Header -->
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-gray-900 dark:text-white">Preview</h3>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-white/[0.06] px-2 py-1 rounded">Mobile</span>
      </div>
    </div>

    <!-- Phone Mockup -->
    <BioIPhone15ProMockup :width="320" :height="500">
      <BioPreview v-if="previewData" :bio-data="previewData" :username="username" />
    </BioIPhone15ProMockup>

    <!-- Public URL Card -->
    <UCard v-if="existingBio?.isPublished" class="mt-4"
    :ui="{
      body: '!px-4 !py-3'
    }"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-globe" class="w-5 h-5 text-green-500" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            perlink.to/{{ username }}
          </p>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-external-link"
          :to="`/${username}`"
          target="_blank"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// Method to scroll to a specific block in the preview
const scrollToBlock = (blockId: string) => {
  // Map blockId to the corresponding DOM element ID in BioPageView
  const blockElementId = `${blockId}-block`;
  
  // Find the preview container - it's the element with overflow auto that contains BioPageView
  // BioPreview uses style with overflow: auto
  const previewElements = document.querySelectorAll('[style*="overflow: auto"]');
  
  for (const container of previewElements) {
    // Find the target block element within this container
    const targetBlock = container.querySelector(`#${blockElementId}`) as HTMLElement;
    if (targetBlock) {
      // Scroll the target block into view with smooth animation
      targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }
};

// Expose the method so parent can call it
defineExpose({
  scrollToBlock
});

defineProps<{
  previewData: any;
  existingBio: any;
  username: string;
}>();
</script>
