<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="formBlock?.hidden"
      :title="data.title || t('blocks.form.defaultTitle')"
      block="form"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('form')"
    >
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.form.kind')">
        <div class="flex gap-1">
          <UButton
            v-for="kind in (['booking', 'contact'] as const)"
            :key="kind"
            size="sm"
            :color="data.kind === kind ? 'primary' : 'neutral'"
            :variant="data.kind === kind ? 'solid' : 'outline'"
            @click="update({ kind, fields: { ...FORM_PRESETS[kind] } })"
          >
            {{ t(`blocks.form.kinds.${kind}`) }}
          </UButton>
        </div>
      </UFormField>

      <UFormField :label="t('blocks.form.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.form.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.form.descriptionLabel')">
        <UInput :model-value="data.description" :placeholder="t('blocks.form.descriptionPlaceholder')" class="w-full" @update:model-value="update({ description: String($event) })" />
      </UFormField>

      <UFormField :label="t('blocks.form.fieldsLabel')" :help="t('blocks.form.fieldsHelp')">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <label
            v-for="field in FIELD_KEYS"
            :key="field"
            class="flex cursor-pointer items-center gap-2 rounded-md border border-default bg-default px-2.5 py-2 text-sm dark:border-white/10"
          >
            <UCheckbox :model-value="!!fields[field]" @update:model-value="update({ fields: { ...fields, [field]: !!$event } })" />
            {{ t(`blocks.form.fields.${field}`) }}
          </label>
        </div>
      </UFormField>

      <div class="grid gap-3 sm:grid-cols-2">
        <UFormField :label="t('blocks.form.submitLabel')">
          <UInput :model-value="data.submitLabel" :placeholder="t('blocks.form.submitPlaceholder')" class="w-full" @update:model-value="update({ submitLabel: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.form.successLabel')">
          <UInput :model-value="data.successMessage" :placeholder="t('blocks.form.successPlaceholder')" class="w-full" @update:model-value="update({ successMessage: String($event) })" />
        </UFormField>
      </div>

      <div class="flex items-start gap-2 rounded-lg bg-elevated/60 p-3 text-xs text-muted">
        <UIcon name="i-lucide-inbox" class="mt-0.5 size-4 shrink-0" />
        <span>{{ t('blocks.form.inboxNote') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, FormBlock, FormFields } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: FormBlock['data']]
}>()

const { t } = useI18n()

const FIELD_KEYS: (keyof FormFields)[] = ['phone', 'email', 'date', 'time', 'guests', 'message']

const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const formBlock = computed(() => getBlock<FormBlock>('form'))

const data = computed<FormBlock['data']>(() => ({
  kind: 'booking',
  fields: { ...FORM_PRESETS.booking },
  ...(formBlock.value?.data || {}),
}))
const fields = computed(() => data.value.fields)

function update(patch: Partial<FormBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
