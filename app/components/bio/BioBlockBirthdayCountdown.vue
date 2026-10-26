<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="countdownBlock?.hidden"
      :title="t('blocks.birthday.title')"
      block="birthday-countdown"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('birthday-countdown')"
    >
      <template #preview>
        <div v-if="data.birthDate" class="text-xs text-gray-500 dark:text-neutral-400 mr-2">
          {{ formatDate(data.birthDate) }}
        </div>
      </template>
    </BioBlockItemHeader>

    <!-- Birthday Countdown Edit Form -->
    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <!-- Birth Date -->
      <UFormField :label="t('blocks.birthday.birthDate')" required>
        <UInput
          type="date"
          :model-value="data.birthDate"
          :placeholder="t('blocks.birthday.birthDatePlaceholder')"
          class="w-full"
          @update:model-value="updateField('birthDate', $event)"
        />
      </UFormField>

      <!-- Label -->
      <UFormField :label="t('blocks.birthday.label')">
        <UInput
          :model-value="data.label"
          :placeholder="t('blocks.birthday.labelPlaceholder')"
          class="w-full"
          @update:model-value="updateField('label', $event)"
        />
      </UFormField>

      <!-- Theme Selection -->
      <UFormField :label="t('blocks.birthday.theme')">
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="theme in countdownThemes"
            :key="theme.id"
            class="flex items-center gap-2 p-2 rounded-lg border transition-all"
            :class="[
              data.theme === theme.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
            ]"
            @click="updateField('theme', theme.id)"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center"
              :class="theme.colorClass"
            >
              <UIcon :name="theme.icon" class="w-3 h-3" />
            </div>
            <span class="text-sm">{{ theme.name }}</span>
          </button>
        </div>
      </UFormField>

      <!-- Show Age Toggle -->
      <UFormField>
        <UCheckbox
          :model-value="data.showAge"
          :label="t('blocks.birthday.showAge')"
          @update:model-value="updateField('showAge', Boolean($event))"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, shallowRef, watch } from "vue";
import type { BirthdayCountdownBlock, BioBlock } from "~/types/bio";
import { useBioBlock } from "~/composables/useBioBlock";

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
}>();

const emit = defineEmits<{
  toggle: [];
  remove: [];
  update: [data: BirthdayCountdownBlock['data']];
}>();

const { t, locale } = useI18n();

// Theme options
const countdownThemeOptions = [
  { id: 'classic', name: 'Classic', icon: 'i-lucide-cake', colorClass: 'bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400' },
  { id: 'modern', name: 'Modern', icon: 'i-lucide-sparkles', colorClass: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { id: 'minimal', name: 'Minimal', icon: 'i-lucide-minus', colorClass: 'bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-neutral-300' },
  { id: 'party', name: 'Party', icon: 'i-lucide-party-popper', colorClass: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  { id: 'elegant', name: 'Elegant', icon: 'i-lucide-gem', colorClass: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
] as const;

const countdownThemes = computed(() =>
  countdownThemeOptions.map(theme => ({ ...theme, name: t(`blocks.birthday.themes.${theme.id}`) })),
);

// Use composable
const { 
  getBlock,
  toggleBlockHidden,
} = useBioBlock({
  blocks: toRef(props, 'blocks')
});

const countdownBlock = computed(() => getBlock<BirthdayCountdownBlock>('birthday-countdown'));

// Get current data
const data = computed(() => {
  const block = countdownBlock.value as BirthdayCountdownBlock | undefined;
  return block?.data ?? {
    birthDate: '',
    theme: 'classic' as const,
    showAge: true,
    label: '',
  };
});


// Update field helper
function updateField<K extends keyof BirthdayCountdownBlock['data']>(
  field: K,
  value: BirthdayCountdownBlock['data'][K]
) {
  const newData = { ...data.value, [field]: value };
  emit('update', newData);
}

// Format date for display
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(year, month - 1, day).toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
</script>
