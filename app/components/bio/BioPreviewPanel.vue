<template>
  <div class="space-y-3">
    <!-- Preview Header -->
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('common.preview') }}</h3>
        <p class="truncate text-xs text-muted">{{ t('dashboard.editor.previewHint') }}</p>
      </div>

    </div>

    <!-- Phone Mockup -->
    <BioIPhone15ProMockup ref="phoneRef" :width="320" :height="500">
      <BioPreview
        v-if="previewData"
        :bio-data="previewData"
        :username="username"
        :active-block-id="activeBlock"
        @select-block="$emit('selectBlock', $event)"
      />
    </BioIPhone15ProMockup>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

// Method to scroll to a specific block in the preview
const scrollToBlock = (blockId: string) => {
  // The header keeps its fixed id; blocks use block-<id> (see BioPageView)
  const blockElementId = blockId === 'header' ? 'header-block' : `block-${blockId}`;

  // BioPreview is the scroll container (style overflow: auto)
  const previewElements = document.querySelectorAll('[style*="overflow: auto"]');

  for (const container of previewElements) {
    const targetBlock = container.querySelector(`#${CSS.escape(blockElementId)}`) as HTMLElement;
    if (targetBlock) {
      targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }
};

const phoneRef = ref<{ $el: Element } | null>(null);

/** Snapshot of the phone screen for the site's thumbnail; null when the preview isn't on screen */
async function snapshot(username: string) {
  // The page element inside the phone (the one BioPreview scales)
  const root = phoneRef.value?.$el as Element | undefined;
  const el = root?.parentElement?.querySelector<HTMLElement>('[style*="overflow: auto"]');
  if (!el || !el.offsetParent) return null;
  return await snapshotPage(username, el);
}

defineExpose({ scrollToBlock, snapshot });

defineProps<{
  previewData: any;
  existingBio: any;
  username: string;
  activeBlock?: string | null;
}>();

defineEmits<{ selectBlock: [blockId: string] }>();
</script>
