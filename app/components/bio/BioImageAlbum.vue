<template>
  <div v-if="hasImages" class="w-full">
    <!-- Vertical Layout -->
    <div v-if="layout === 'vertical'" class="flex flex-col gap-3">
      <div
        v-for="(image, index) in sortedImages"
        :key="image.url"
        class="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
        @click="openLightbox(index)"
      >
        <img
          :src="image.url"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Carousel Layout -->
    <UCarousel
      v-else
      v-slot="{ item }"
      arrows
      dots
      :prev-icon="prevIcon"
      :next-icon="nextIcon"
      :items="sortedImages"
      class="w-full"
    >
      <div
        class="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer mx-1"
        @click="openLightbox(sortedImages.findIndex(i => i.url === item.url))"
      >
        <img
          :src="item.url"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </UCarousel>

    <!-- Lightbox Modal -->
    <UModal
      :open="lightboxOpen"
      :close="{ color: 'neutral', variant: 'ghost' }"
      class="max-w-4xl"
      @update:open="lightboxOpen = $event"
    >
      <template #content>
        <div class="p-4 bg-black">
          <div class="relative">
            <img
              v-if="currentImage"
              :src="currentImage.url"
              class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <!-- Navigation -->
            <UButton
              v-if="images.length > 1"
              color="neutral"
              variant="solid"
              size="lg"
              :icon="prevIcon"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
              @click="prevImage"
            />
            <UButton
              v-if="images.length > 1"
              color="neutral"
              variant="solid"
              size="lg"
              :icon="nextIcon"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
              @click="nextImage"
            />
            <!-- Counter -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ImageAlbumBlock, ImageAlbumImage, ImageAlbumLayout } from '~/types/bio';

const props = defineProps<{
  data?: ImageAlbumBlock;
}>();

const prevIcon = 'i-lucide-chevron-left';
const nextIcon = 'i-lucide-chevron-right';

const images = computed(() => props.data?.images || []);
const sortedImages = computed(() => [...images.value].sort((a, b) => a.index - b.index));
const layout = computed<ImageAlbumLayout>(() => props.data?.layout || 'vertical');
const hasImages = computed(() => images.value.length > 0);

const lightboxOpen = ref(false);
const currentIndex = ref(0);

const currentImage = computed((): ImageAlbumImage | null => {
  if (sortedImages.value.length === 0) return null;
  return sortedImages.value[currentIndex.value] || null;
});

function openLightbox(index: number) {
  currentIndex.value = index;
  lightboxOpen.value = true;
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return;
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') lightboxOpen.value = false;
  };
  window.addEventListener('keydown', handleKeydown);
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
});
</script>
