<template>
  <div class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Title & Tabs -->
        <div class="flex items-center gap-6">
          <h1 class="text-xl font-bold text-gray-900">Link in Bio</h1>
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <UButton
              variant="solid"
              color="neutral"
              size="sm"
              class="px-3 py-1.5 text-sm font-medium"
            >
              Home
            </UButton>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              class="px-3 py-1.5 text-sm font-medium"
            >
              + New Page
            </UButton>
          </div>
        </div>

        <!-- Right: Domain & Share -->
        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
          >
            <UIcon name="i-lucide-link" class="w-4 h-4 text-gray-400" />
            <span class="text-sm text-gray-500">perlink.to/</span>
            <span class="text-sm font-medium text-gray-900">{{ username || "yourname" }}</span>
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-gray-400" />
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-copy"
            @click="$emit('copy')"
          />
          <UButton color="primary" size="sm" class="font-medium" @click="$emit('share')">
            Share
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  username?: string;
}>();

defineEmits<{
  copy: [];
  share: [];
}>();
</script>
