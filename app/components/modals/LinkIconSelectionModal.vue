<template>
  <UModal
    :open="open"
    title="Select Icon"
    :close="{ color: 'neutral', variant: 'ghost' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #content>
      <div class="p-4">
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="icon in availableIcons"
            :key="icon.id"
            class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
            :class="selectedIcon === icon.id
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-primary hover:bg-primary/5'"
            @click="selectIcon(icon.id)"
          >
            <UIcon :name="icon.icon" class="w-8 h-8" :class="icon.colorClass" />
            <span class="text-xs text-gray-600">{{ icon.label }}</span>
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface IconOption {
  id: string
  label: string
  icon: string
  colorClass: string
}

const props = defineProps<{
  open: boolean
  selectedIcon?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'select': [iconId: string]
}>()

const availableIcons: IconOption[] = [
  { id: 'facebook', label: 'Facebook', icon: 'i-fa-facebook', colorClass: 'text-blue-600' },
  { id: 'twitter', label: 'Twitter', icon: 'i-prime-twitter', colorClass: 'text-sky-500' },
  { id: 'instagram', label: 'Instagram', icon: 'i-fa-instagram', colorClass: 'text-pink-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'i-fa-linkedin', colorClass: 'text-blue-700' },
  { id: 'youtube', label: 'YouTube', icon: 'i-fa-youtube-play', colorClass: 'text-red-600' },
  { id: 'tiktok', label: 'TikTok', icon: 'i-prime-tiktok', colorClass: 'text-black' },
  { id: 'globe', label: 'Website', icon: 'i-prime-globe', colorClass: 'text-gray-600' },
  { id: 'link', label: 'Link', icon: 'i-lucide-link', colorClass: 'text-gray-500' },
]

function selectIcon(iconId: string) {
  emit('select', iconId)
  emit('update:open', false)
}
</script>
