<template>
  <UModal
    :open="open"
    @update:open="$emit('update:open', false)"
    title="Your link is ready!"
    description="Copy the link below to share it or choose a platform to share it to."
  >
    <template #body>
      <div class="flex flex-col space-y-4">
        <div class="bg-perlink-blue/10 p-6 rounded-xl space-y-6">
          <div class="text-center text-lg font-bold text-perlink-blue">
            perlink.to/{{ shortCode }}
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <UButton
              variant="solid"
              color="primary"
              class="flex-1"
              size="xl"
              @click="$emit('view-details')"
            >
              <div class="flex items-center justify-center flex-1">
                <Icon name="ph:chart-line" class="w-4 h-4 mr-2" />
                View link details
              </div>
            </UButton>
            <UButton class="flex-1" color="primary" variant="subtle" size="xl" @click="copyLink">
              <div class="flex items-center justify-center flex-1">
                <Icon name="ph:copy" class="w-4 h-4 mr-2" />
                Copy link
              </div>
            </UButton>
          </div>
        </div>
        <div class="w-full overflow-hidden">
          <ShareLinkSocials :shortCode="shortCode" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import ShareLinkSocials from "@/components/features/ShareLinkSocials.vue";

const props = defineProps<{
  open: boolean;
  shortCode: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "view-details": [];
}>();

const toast = useToast();

const shortLink = computed(() => {
  if (props.shortCode)
    return `${useRuntimeConfig().public.baseUrl}/${props.shortCode}`;
  return "";
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shortLink.value);
    toast.add({
      title: "Copied to clipboard",
      description: shortLink.value,
    });
  } catch (error) {
    toast.add({
      title: "Failed to copy",
      description: "Please try again",
      color: "error",
    });
  }
};
</script>
