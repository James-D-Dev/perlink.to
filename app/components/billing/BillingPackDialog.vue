<template>
  <AppSheet :open="!!pack" :ui="{ content: 'max-w-md' }" @update:open="(value: boolean) => { if (!value) close() }">
    <template #content>
      <div v-if="pack" class="overflow-hidden rounded-[inherit]">
        <RoomPackPreview :pack="pack" />
        <div class="p-6 text-center">
          <p class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-pink-400 px-2.5 py-0.5 text-xs font-semibold text-white">
            <UIcon name="i-lucide-crown" class="size-3.5" />{{ t('room.packs.badge') }}
          </p>
          <h2 class="mt-3 text-lg font-semibold text-ink">{{ t('room.packs.promptTitle') }}</h2>
          <p class="mt-2 text-sm text-ink-muted">{{ t('room.packs.promptText') }}</p>
          <div class="mt-6 flex flex-col gap-2">
            <UButton
              block
              size="lg"
              icon="i-lucide-shopping-bag"
              :loading="buying === pack.id"
              :label="t('room.packs.buy', { price: formatUsd(pack.priceUsd) })"
              @click="buy(pack.id)"
            />
            <p class="text-xs text-ink-faint">{{ t('room.packs.oneTime') }}</p>
            <UButton block color="neutral" variant="outline" icon="i-lucide-gem" :label="t('room.packs.orMax')" to="/dashboard/upgrade" @click="close" />
            <UButton block color="neutral" variant="ghost" :label="t('room.packs.later')" @click="close" />
          </div>
        </div>
      </div>
    </template>
  </AppSheet>
</template>

<script setup lang="ts">
import { ROOM_PACK_BY_ID } from '#shared/roomPacks'
import { formatUsd } from '#shared/plans'

// Shown when a room with premium items is published without their pack
const { t } = useI18n()
const { packs, close } = usePackPrompt()
const { buy, buying } = useRoomPacks()
const pack = computed(() => (packs.value?.length ? ROOM_PACK_BY_ID[packs.value[0]!] : null))
</script>
