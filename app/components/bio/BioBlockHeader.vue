<template>
  <div class="rounded-xl border border-default bg-default dark:border-white/10 dark:bg-white/[0.04]">
    <!-- Header Edit Form -->
    <div class="p-3 sm:p-4">
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="group relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-elevated ring-1 ring-default"
            :aria-label="t('blocks.header.changePhoto')"
            @click="triggerFileInput"
          >
            <img v-if="avatarUrl" :src="avatarUrl" :alt="title" class="size-full object-cover">
            <UIcon v-else name="i-lucide-image-plus" class="size-5 text-muted" />
            <span class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <UIcon name="i-lucide-camera" class="size-4 text-white" />
            </span>
            <span v-if="uploading" class="absolute inset-0 flex items-center justify-center bg-black/50">
              <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin text-white" />
            </span>
          </button>
          <div class="min-w-0 flex-1">
            <UInput
              :model-value="title"
              :placeholder="t('blocks.header.titlePlaceholder')"
              class="w-full"
              :ui="{ base: 'font-semibold' }"
              @update:model-value="$emit('update:title', $event)"
            />
            <button type="button" class="mt-1 text-xs text-muted hover:text-highlighted" @click="triggerFileInput">
              {{ avatarUrl ? t('blocks.header.changePhoto') : t('blocks.header.addPhoto') }}
            </button>
            <p v-if="uploadError" class="text-xs text-red-500 mt-1">
              {{ uploadError }}
            </p>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="hidden"
              @change="onFileChange"
            />
          </div>
        </div>

        <div>
          <UTextarea
            :model-value="bio"
            :placeholder="t('blocks.header.bioPlaceholder')"
            class="w-full"
            :rows="2"
            autoresize
            @update:model-value="$emit('update:bio', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAvatarUpload } from "~/composables/useAvatarUpload";

const props = defineProps<{
  isActive: boolean;
  title: string;
  bio: string;
  avatarUrl: string;
  bioPageId: string;
}>();

const emit = defineEmits<{
  toggle: [];
  "update:title": [value: string];
  "update:bio": [value: string];
  "update:avatarUrl": [value: string];
}>();

const { t } = useI18n();

const fileInputRef = ref<HTMLInputElement | null>(null);
const { upload, uploading, error: uploadError } = useAvatarUpload();

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  (e.target as HTMLInputElement).value = "";
  try {
    const url = await upload(file, props.bioPageId);
    emit("update:avatarUrl", url);
  } catch {
    // error already set in composable
  }
}
</script>
