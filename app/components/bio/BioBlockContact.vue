<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="contactBlock?.hidden"
      :title="data.title || t('blocks.contact.title')"
      icon="i-lucide-map-pin"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('contact')"
    >
      <template #actions>
        <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-trash-2" @click.stop="$emit('remove')" />
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.contact.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.contact.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.contact.address')">
        <UInput :model-value="data.address" :placeholder="t('blocks.contact.addressPlaceholder')" icon="i-lucide-map-pin" class="w-full" @update:model-value="update({ address: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.contact.mapLink')" :help="t('blocks.contact.mapLinkHelp')">
        <UInput :model-value="data.mapUrl" placeholder="https://maps.app.goo.gl/..." icon="i-lucide-map" class="w-full" @update:model-value="update({ mapUrl: String($event) })" />
      </UFormField>
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('blocks.contact.phone')">
          <UInput :model-value="data.phone" placeholder="+84 90 000 0000" icon="i-lucide-phone" class="w-full" @update:model-value="update({ phone: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.contact.email')">
          <UInput :model-value="data.email" placeholder="hello@example.com" icon="i-lucide-mail" class="w-full" @update:model-value="update({ email: String($event) })" />
        </UFormField>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('blocks.contact.bookingButton')">
          <UInput :model-value="data.bookingLabel" :placeholder="t('blocks.contact.bookingButtonPlaceholder')" class="w-full" @update:model-value="update({ bookingLabel: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.contact.bookingLink')">
          <UInput :model-value="data.bookingUrl" placeholder="https://..." icon="i-lucide-link" class="w-full" @update:model-value="update({ bookingUrl: String($event) })" />
        </UFormField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, ContactBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: ContactBlock['data']]
}>()

const { t } = useI18n()

const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })

const contactBlock = computed(() => getBlock<ContactBlock>('contact'))

const data = computed<ContactBlock['data']>(() => ({
  title: 'Contact',
  ...(contactBlock.value?.data || {}),
}))

function update(patch: Partial<ContactBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
