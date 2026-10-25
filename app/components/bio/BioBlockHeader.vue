<template>
  <!-- Photo, name and intro: the top of the page -->
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sand ring-1 ring-line"
        :aria-label="t('blocks.header.changePhoto')"
        @click="triggerFileInput"
      >
        <img v-if="avatarUrl" :src="avatarUrl" :alt="title" class="size-full object-cover">
        <UIcon v-else name="i-lucide-image-plus" class="size-6 text-ink-muted" />
        <span class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <UIcon name="i-lucide-camera" class="size-5 text-white" />
        </span>
        <span v-if="uploading" class="absolute inset-0 flex items-center justify-center bg-black/50">
          <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin text-white" />
        </span>
      </button>
      <div class="flex flex-wrap gap-2">
        <UButton :label="avatarUrl ? t('blocks.header.changePhoto') : t('blocks.header.addPhoto')" icon="i-lucide-upload" :loading="uploading" @click="triggerFileInput" />
        <UButton v-if="avatarUrl" color="neutral" variant="ghost" :label="t('blocks.header.removePhoto')" @click="$emit('update:avatarUrl', '')" />
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        class="hidden"
        @change="onFileChange"
      >
    </div>
    <p v-if="uploadError" class="-mt-3 text-xs text-red-500">{{ uploadError }}</p>

    <UFormField :label="t('blocks.header.nameLabel')" :hint="`${title.length}/${TITLE_MAX}`">
      <UInput
        :model-value="title"
        :placeholder="t('blocks.header.titlePlaceholder')"
        :maxlength="TITLE_MAX"
        size="lg"
        class="w-full"
        :ui="{ base: 'font-semibold' }"
        @update:model-value="$emit('update:title', String($event))"
      />
    </UFormField>

    <UFormField :label="t('blocks.header.bioLabel')" :hint="`${bio.length}/${BIO_MAX}`">
      <UTextarea
        :model-value="bio"
        :placeholder="t('blocks.header.bioPlaceholder')"
        :maxlength="BIO_MAX"
        :rows="3"
        autoresize
        class="w-full"
        @update:model-value="$emit('update:bio', String($event))"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import { useAvatarUpload } from "~/composables/useAvatarUpload";

const props = defineProps<{
  isActive?: boolean;
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

// Long enough for a shop name or a short sentence, short enough to fit a phone
const TITLE_MAX = 60;
const BIO_MAX = 300;

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
