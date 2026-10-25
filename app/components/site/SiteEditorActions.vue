<template>
  <!-- Saves happen on their own; publishing is the one decision left.
       Fixed to the bottom on phones, sticky inside the editor column on desktop. -->
  <div class="fixed inset-x-0 bottom-0 z-20 border-t border-default bg-default/90 px-3 py-2.5 backdrop-blur sm:px-4 lg:sticky lg:mt-4 lg:rounded-xl lg:border lg:px-3 dark:border-white/10">
    <div class="flex items-center gap-2">
      <!-- Phone preview and the design switch, on screens without the side column -->
      <UButton
        icon="i-lucide-smartphone"
        color="neutral"
        variant="outline"
        class="lg:hidden"
        :aria-label="t('common.preview')"
        @click="$emit('preview')"
      />
      <UButton
        v-if="tab === 'content' || tab === 'design'"
        :icon="tab === 'design' ? 'i-lucide-layout-list' : 'i-lucide-palette'"
        color="neutral"
        variant="outline"
        class="lg:hidden"
        :label="tab === 'design' ? t('dashboard.editor.tabs.content') : t('dashboard.editor.tabs.design')"
        @click="$emit('switchTab', tab === 'design' ? 'content' : 'design')"
      />

      <p class="flex min-w-0 flex-1 items-center gap-1.5 truncate px-1 text-xs" :class="status.tone === 'muted' ? 'text-muted' : 'text-highlighted'">
        <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-3 shrink-0 animate-spin" />
        <span
          v-else
          class="size-1.5 shrink-0 rounded-full"
          :class="{ 'bg-emerald-500': status.tone === 'muted', 'bg-amber-500': status.tone === 'pending', 'bg-red-500': status.tone === 'error' }"
        />
        <span class="truncate">{{ status.text }}</span>
      </p>

      <UTooltip v-if="canDiscard" :text="t('dashboard.editor.draft.discard')">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-undo-2"
          :aria-label="t('dashboard.editor.draft.discard')"
          :loading="discarding"
          @click="$emit('discard')"
        >
          <span class="hidden sm:inline">{{ t('dashboard.editor.draft.discard') }}</span>
        </UButton>
      </UTooltip>

      <UTooltip :text="t('dashboard.editor.upToDate')" :disabled="!publishDisabled">
        <UButton
          icon="i-lucide-globe"
          :loading="publishing"
          :disabled="publishDisabled"
          :label="published ? t('dashboard.editor.update') : t('common.publish')"
          @click="$emit('publish')"
        />
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tab: string
  status: { text: string; tone: 'muted' | 'pending' | 'error' }
  saving: boolean
  publishing: boolean
  publishDisabled: boolean
  published: boolean
  canDiscard: boolean
  discarding: boolean
}>()

defineEmits<{
  preview: []
  switchTab: [tab: 'content' | 'design']
  publish: []
  discard: []
}>()

const { t } = useI18n()
</script>
