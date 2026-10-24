<template>
  <UCard class="mt-8">
    <div class="space-y-4">
      <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('dashboard.username.heading') }}</h3>
      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-neutral-400">perlink.to/</span>
        <UInput
          :model-value="username"
          :placeholder="t('dashboard.username.placeholder')"
          class="flex-1"
          :error="usernameError"
          @update:model-value="$emit('update:username', $event)"
          @blur="$emit('check')"
        />
      </div>
      <p v-if="usernameError" class="text-red-500 text-sm">
        {{ usernameError }}
      </p>
      <p v-else-if="usernameAvailable" class="text-green-500 text-sm">
        <UIcon name="i-lucide-check-circle" class="w-4 h-4 inline mr-1" />
        {{ t('dashboard.username.available') }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  username: string;
  usernameError: string;
  usernameAvailable: boolean;
}>();

defineEmits<{
  'update:username': [value: string];
  check: [];
}>();
</script>
