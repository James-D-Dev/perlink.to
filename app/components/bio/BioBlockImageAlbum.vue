<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <!-- Header -->
    <BioBlockItemHeader
      :is-active="isActive"
      title="Image Album"
      icon="i-lucide-images"
      :hidden="imageAlbumBlock?.hidden"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('image-album')"
    >
      <template #badge>
        <span v-if="imageCount > 0" class="text-xs text-gray-500 dark:text-neutral-400">
          {{ imageCount }} image{{ imageCount > 1 ? 's' : '' }}
        </span>
      </template>
      <template #actions>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-more-vertical"
        />
      </template>
    </BioBlockItemHeader>

    <!-- Edit Form -->
    <div v-if="isActive" class="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <!-- Layout Selector -->
      <div>
        <label class="text-sm font-medium text-gray-700 dark:text-neutral-200 mb-2 block">Layout</label>
        <div class="flex gap-2">
          <UButton
            v-for="layout in layouts"
            :key="layout.value"
            size="sm"
            :variant="selectedLayout === layout.value ? 'solid' : 'outline'"
            :color="selectedLayout === layout.value ? 'primary' : 'neutral'"
            class="flex-1"
            @click="selectLayout(layout.value)"
          >
            <UIcon :name="layout.icon" class="w-4 h-4 mr-1" />
            {{ layout.label }}
          </UButton>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        v-if="canUpload"
        class="border-2 border-dashed border-gray-300 dark:border-white/15 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
        <UIcon name="i-lucide-upload-cloud" class="w-10 h-10 text-gray-400 dark:text-neutral-500 mx-auto mb-2" />
        <p class="text-sm text-gray-600 dark:text-neutral-300 mb-1">Click or drag images here</p>
        <p class="text-xs text-gray-400 dark:text-neutral-500">Max 6 images, up to 5MB each</p>
      </div>

      <!-- Max Images Reached -->
      <div
        v-else
        class="border border-gray-200 dark:border-white/10 rounded-xl p-4 text-center bg-gray-100 dark:bg-white/[0.06]"
      >
        <UIcon name="i-lucide-check-circle" class="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p class="text-sm text-gray-600 dark:text-neutral-300">Maximum 6 images reached</p>
      </div>

      <!-- Upload Progress -->
      <div v-if="uploading" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-neutral-300">Uploading...</span>
          <span class="text-gray-500 dark:text-neutral-400">{{ progress }}%</span>
        </div>
        <UProgress :value="progress" />
      </div>

      <!-- Image Preview -->
      <div v-if="albumImages.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-neutral-200">Images</label>
          <span class="text-xs text-gray-500 dark:text-neutral-400">{{ albumImages.length }}/5</span>
        </div>

        <!-- Grid with Drag & Drop -->
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="(image, index) in sortedImages"
            :key="image.url"
            class="relative group/item aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 cursor-move"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @drop.prevent="handleDropReorder(index)"
          >
            <!-- Index Badge -->
            <div class="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black/70 text-white text-xs font-medium flex items-center justify-center">
              {{ (image.index ?? 0) + 1 }}
            </div>
            <img
              :src="image.url"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <UButton
                color="neutral"
                variant="solid"
                size="xs"
                icon="i-lucide-eye"
                @click="previewImage(image.url)"
              />
              <UButton
                color="error"
                variant="solid"
                size="xs"
                icon="i-lucide-trash-2"
                @click="removeImage(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <UModal
      :open="!!previewingImage"
      :close="{ color: 'neutral', variant: 'ghost' }"
      @update:open="previewingImage = null"
    >
      <template #content>
        <div class="p-4">
          <img
            v-if="previewingImage"
            :src="previewingImage"
            class="w-full h-auto rounded-lg"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal
      :open="showDeleteModal"
      title="Delete Image"
      :close="{ color: 'neutral', variant: 'ghost' }"
      @update:open="closeDeleteModal"
    >
      <template #body>
        <p class="text-sm text-gray-600 dark:text-neutral-300">
          Are you sure you want to delete this image? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex gap-3 w-full">
          <UButton
            color="neutral"
            variant="outline"
            class="flex-1"
            @click="closeDeleteModal"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            variant="solid"
            class="flex-1"
            @click="confirmDelete"
          >
            <UIcon name="i-lucide-trash-2" class="w-4 h-4 mr-1" />
            Delete
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import type { BioBlock, ImageAlbumImage, ImageAlbumLayout } from '~/types/bio';
import { useBioBlock } from '~/composables/useBioBlock';
import { nanoid } from 'nanoid';

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
  bioPageId: string;
}>();

const emit = defineEmits<{
  toggle: [];
  update: [data: { images: any[], layout: ImageAlbumLayout }];
}>();

// Use composable
const { albumImages, albumLayout, imageAlbumBlock, setImageAlbum, addImage, removeImage: removeImageFromBlock, toggleBlockHidden } = useBioBlock({
  blocks: toRef(props, 'blocks')
});

const MAX_IMAGES = 6;

const layouts = [
  { value: 'vertical' as ImageAlbumLayout, label: 'Vertical', icon: 'i-lucide-layout-grid' },
  { value: 'carousel' as ImageAlbumLayout, label: 'Carousel', icon: 'i-lucide-images' },
];

const fileInput = ref<HTMLInputElement | null>(null);
const previewingImage = ref<string | null>(null);
const deleteIndex = ref<number | null>(null);
const dragSourceIndex = ref<number | null>(null);

// Use composable values
const sortedImages = computed(() => [...albumImages.value].sort((a, b) => (a.index ?? 0) - (b.index ?? 0)));
const selectedLayout = computed(() => albumLayout.value);
const imageCount = computed(() => albumImages.value.length);
const canUpload = computed(() => imageCount.value < MAX_IMAGES);
const showDeleteModal = computed(() => deleteIndex.value !== null);

const { uploadMultiple, uploading, error, progress } = useImageAlbumUpload();
const toast = useToast();

function triggerFileInput() {
  fileInput.value?.click();
}

function selectLayout(layout: ImageAlbumLayout) {
  emit('update', {
    images: albumImages.value,
    layout,
  });
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    await uploadFiles(Array.from(files));
  }
  // Reset input
  target.value = '';
}

async function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    await uploadFiles(imageFiles);
  }
}

async function uploadFiles(files: File[]) {
  if (files.length === 0) return;

  const remainingSlots = MAX_IMAGES - albumImages.value.length;
  if (remainingSlots <= 0) {
    toast.add({
      title: 'Limit reached',
      description: `Maximum ${MAX_IMAGES} images allowed`,
      color: 'warning',
    });
    return;
  }

  const filesToUpload = files.slice(0, remainingSlots);

  try {
    const newUrls = await uploadMultiple(filesToUpload, props.bioPageId, albumImages.value.map(i => i.url), MAX_IMAGES);

    // Create ImageAlbumImage objects with proper indices
    const newImageObjects: ImageAlbumImage[] = newUrls.map((url, idx) => ({
      id: nanoid(),
      url,
      index: albumImages.value.length + idx,
    }));

    emit('update', {
      images: [...albumImages.value, ...newImageObjects],
      layout: selectedLayout.value,
    });

    toast.add({
      title: 'Success',
      description: `${filesToUpload.length} image(s) uploaded`,
      color: 'success',
    });
  } catch (e: any) {
    toast.add({
      title: 'Upload failed',
      description: error.value || 'Failed to upload images',
      color: 'error',
    });
  }
}

function removeImage(index: number) {
  deleteIndex.value = index;
}

function handleDragStart(index: number) {
  dragSourceIndex.value = index;
}

function handleDropReorder(targetIndex: number) {
  if (dragSourceIndex.value === null || dragSourceIndex.value === targetIndex) return;

  const newImages = [...sortedImages.value];
  const [moved] = newImages.splice(dragSourceIndex.value, 1);
  if (!moved) return;
  newImages.splice(targetIndex, 0, moved);

  // Recalculate indices
  const reordered: ImageAlbumImage[] = newImages.map((img, idx) => ({ ...img, index: idx }));

  emit('update', {
    images: reordered,
    layout: selectedLayout.value,
  });

  dragSourceIndex.value = null;
}

function confirmDelete() {
  if (deleteIndex.value !== null) {
    const sorted = sortedImages.value;
    const imageToDelete = sorted[deleteIndex.value];
    if (!imageToDelete) return;

    const newImages = albumImages.value
      .filter(img => img.url !== imageToDelete.url)
      .map((img, idx) => ({ ...img, index: idx }));

    emit('update', {
      images: newImages,
      layout: selectedLayout.value,
    });
    toast.add({
      title: 'Deleted',
      description: 'Image removed from album',
      color: 'success',
    });
  }
  deleteIndex.value = null;
}

function closeDeleteModal() {
  deleteIndex.value = null;
}

function previewImage(url: string) {
  previewingImage.value = url;
}
</script>
