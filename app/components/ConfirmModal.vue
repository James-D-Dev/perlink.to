<template>
  <UModal
    :title="title"
    :description="description"
    :close="false"
    :dismissible="true"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton color="neutral" variant="ghost" :label="t('common.cancel')" @click="emit('close', false)" />
      <UButton :color="color" :label="confirmLabel || t('common.confirm')" @click="emit('close', true)" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()

withDefaults(defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  color?: 'error' | 'warning' | 'primary'
}>(), {
  confirmLabel: undefined,
  color: 'error',
})

const emit = defineEmits<{ close: [confirmed: boolean] }>()
</script>
