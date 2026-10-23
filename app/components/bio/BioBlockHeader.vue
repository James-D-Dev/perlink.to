<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <!-- Header Edit Form -->
    <div class="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03]">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex-1 min-w-0">
            <div>
              <UInput
                :model-value="title"
                placeholder="Your name or title"
                @update:model-value="$emit('update:title', $event)"
                size="xl"
                class="font-bold w-full"
                :ui="{
                  base: 'py-5 text-lg md:text-xl rounded-2xl !pl-[74px]',
                  leading: 'pl-[1px]',
                }"
              >
                <template #leading>
                  <div
                    class="relative shrink-0 cursor-pointer mr-2"
                    @click="triggerFileInput"
                  >
                    <UAvatar
                      :src="avatarUrl || '/default-avatar.png'"
                      :alt="title"
                      class="size-16 rounded-2xl"
                      color="primary"
                      icon="i-lucide-image"
                    />
                    <div
                      class="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <UIcon
                        name="i-lucide-camera"
                        class="w-5 h-5 text-white"
                      />
                    </div>
                    <div
                      v-if="uploading"
                      class="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/50"
                    >
                      <UIcon
                        name="i-lucide-loader-circle"
                        class="w-5 h-5 text-white animate-spin"
                      />
                    </div>
                  </div>
                </template>
              </UInput>
            </div>
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
            placeholder="Tell us about yourself"
            class="w-full"
            :rows="3"
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
