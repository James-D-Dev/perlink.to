<template>
  <UModal
    :title="title"
    :description="description"
    :close="false"
    :dismissible="true"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton color="neutral" variant="ghost" label="Cancel" @click="emit('close', false)" />
      <UButton :color="color" :label="confirmLabel" @click="emit('close', true)" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  color?: 'error' | 'warning' | 'primary'
}>(), {
  confirmLabel: 'Confirm',
  color: 'error',
})

const emit = defineEmits<{ close: [confirmed: boolean] }>()
</script>
