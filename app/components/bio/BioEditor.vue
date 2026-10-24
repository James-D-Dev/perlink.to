<template>
  <div class="space-y-4">
    <!-- Block Selection Modal -->
    <ModalsBlockSelectionModal
      :open="showBlockModal"
      :enabled-blocks="bioData.blocks.map((b) => b.name)"
      @update:open="showBlockModal = $event"
      @select="selectBlock"
    />

    <!-- Blocks List -->
    <div class="space-y-2">
      <BioBlockHeader
        :is-active="activeBlock === 'header'"
        :title="bioData.title"
        :bio="bioData.bio"
        :avatar-url="bioData.avatarUrl"
        :bio-page-id="bioPageId"
        @toggle="$emit('toggleBlock', 'header')"
        @update:title="$emit('updateData', 'title', $event)"
        @update:bio="$emit('updateData', 'bio', $event)"
        @update:avatar-url="$emit('updateData', 'avatarUrl', $event)"
      />

      <draggable
        v-model="localBlocks"
        item-key="name"
        handle=".drag-handle"
        @end="onDragEnd"
      >
        <template #item="{ element: block }">
          <div class="relative group mb-2">
            <!-- Drag Handle -->
            <!-- <div class="drag-handle absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <UIcon name="i-lucide-grip-vertical" class="w-5 h-5 text-gray-400 dark:text-neutral-500" />
            </div> -->

            <!-- Social Block -->
            <BioBlockSocial
              v-if="block.name === 'social'"
              :is-active="activeBlock === 'social'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'social')"
              @update="onUpdateSocial"
            />

            <!-- Links Block -->
            <BioBlockLinks
              v-if="block.name === 'links'"
              :is-active="activeBlock === 'links'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'links')"
              @add="$emit('addLink', $event)"
              @remove="$emit('removeLink', $event)"
              @update-link="onUpdateLink"
              @select-image="onSelectImage"
              @update-title="onUpdateBlockTitle('links', $event)"
            />

            <!-- VietQR Block -->
            <VietQRDisplay
              v-if="block.name === 'vietqr'"
              :is-active="activeBlock === 'vietqr'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'vietqr')"
              @update:vietqr="$emit('updateVietqr', $event)"
            />

            <!-- Image Album Block -->
            <BioBlockImageAlbum
              v-if="block.name === 'image-album'"
              :is-active="activeBlock === 'image-album'"
              :blocks="blocksRef"
              :bio-page-id="bioPageId"
              @toggle="$emit('toggleBlock', 'image-album')"
              @update="$emit('updateImageAlbum', $event)"
              @update-title="onUpdateBlockTitle('image-album', $event)"
            />
            <!-- Text Block -->
            <BioBlockText
              v-if="block.name === 'text'"
              :is-active="activeBlock === 'text'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'text')"
              @remove="onRemoveBlock('text')"
              @update="onUpdateBlockData('text', $event)"
            />
            <!-- Birthday Countdown Block -->
            <BioBlockBirthdayCountdown
              v-if="block.name === 'birthday-countdown'"
              :is-active="activeBlock === 'birthday-countdown'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'birthday-countdown')"
              @remove="onRemoveBlock('birthday-countdown')"
              @update="onUpdateBirthdayCountdown"
            />
            <!-- Menu Block -->
            <BioBlockMenu
              v-if="block.name === 'menu'"
              :is-active="activeBlock === 'menu'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'menu')"
              @remove="onRemoveBlock('menu')"
              @update="onUpdateBlockData('menu', $event)"
            />
            <!-- Opening Hours Block -->
            <BioBlockHours
              v-if="block.name === 'hours'"
              :is-active="activeBlock === 'hours'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'hours')"
              @remove="onRemoveBlock('hours')"
              @update="onUpdateBlockData('hours', $event)"
            />
            <!-- Contact Block -->
            <BioBlockContact
              v-if="block.name === 'contact'"
              :is-active="activeBlock === 'contact'"
              :blocks="blocksRef"
              @toggle="$emit('toggleBlock', 'contact')"
              @remove="onRemoveBlock('contact')"
              @update="onUpdateBlockData('contact', $event)"
            />
            <!-- more block -->
          </div>

        </template>
      </draggable>

      <!-- Add Block Button -->
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accented py-2.5 text-sm font-medium text-muted transition hover:border-inverted hover:bg-elevated hover:text-highlighted dark:border-white/15 dark:text-neutral-400 dark:hover:border-white/40 dark:hover:text-white"
        @click="showBlockModal = true"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Add block
      </button>
    </div>

    <BioBlockTheme
      :is-active="activeBlock === 'theme'"
      :templates="templates"
      :selected-template="selectedTemplate"
      :theme-config="bioData.themeConfig"
      :avatar-url="bioData.avatarUrl"
      :title="bioData.title"
      :bio="bioData.bio"
      :social-links="socialLinks"
      :bio-page-id="bioPageId"
      @toggle="$emit('toggleBlock', 'theme')"
      @select-template="$emit('selectTemplate', $event)"
      @update-theme="$emit('updateTheme', $event)"
    />

    <!-- Action bar: stays at the bottom of the screen while editing -->
    <div class="sticky bottom-0 z-20 -mx-4 border-t border-default bg-default/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-3 dark:border-white/10">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-smartphone"
          color="neutral"
          variant="outline"
          class="lg:hidden"
          aria-label="Preview"
          @click="$emit('preview')"
        >
          <span class="hidden sm:inline">Preview</span>
        </UButton>
        <div class="flex-1" />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-save"
          :loading="saving"
          @click="$emit('save')"
        >
          Save draft
        </UButton>
        <UButton
          icon="i-lucide-globe"
          :loading="publishing"
          @click="$emit('publish')"
        >
          Publish
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import type {
  BioData,
  Template,
  BioLink,
  ThemeConfig,
  ImageAlbumBlock,
  SocialLink,
  LinksBlock,
  SocialBlock,
  ImageAlbumLayout,
  BioBlock,
  BirthdayCountdownBlock,
} from "~/types/bio";

const props = withDefaults(
  defineProps<{
    activeBlock: string | null;
    bioData: BioData;
    templates: Template[];
    selectedTemplate: string;
    saving: boolean;
    publishing: boolean;
    bioPageId: string;
    enabledBlocks?: string[];
  }>(),
  {
    enabledBlocks: () => ["links", "social", "image-album", "vietqr"],
  },
);

const showBlockModal = ref(false);

// Use computed for reactivity when blocks array changes
const blocksRef = computed(() => props.bioData.blocks);
const { links, socialLinks, toggleBlockHidden } = useBioBlock({
  blocks: blocksRef,
});

// Local copy for drag-and-drop
const localBlocks = ref<BioBlock[]>([]);
let isUpdatingFromParent = false;

// Sync with parent (one-way)
watch(
  () => props.bioData.blocks,
  (newVal) => {
    isUpdatingFromParent = true;
    localBlocks.value = [...(newVal || [])].sort(
      (a, b) => (a.index || 0) - (b.index || 0),
    );
    nextTick(() => {
      isUpdatingFromParent = false;
    });
  },
  { immediate: true, deep: true },
);

// Emit helper - only emit when not receiving from parent
function emitBlockUpdate() {
  if (isUpdatingFromParent) return;
  const sorted = localBlocks.value.map((b, i) => ({ ...b, index: i }));
  emit("updateBlocks", sorted);
}

function onDragEnd() {
  emitBlockUpdate();
}

function selectBlock(blockId: string) {
  emit("addBlock", blockId);
}

const emit = defineEmits<{
  addBlock: [blockType: string];
  toggleBlock: [blockId: string];
  updateData: [key: keyof BioData, value: any];
  addLink: [link: Partial<BioLink>];
  removeLink: [index: number];
  updateLink: [
    index: number,
    field: "title" | "subtitle" | "url" | "icon",
    value: string,
  ];
  selectLinkImage: [index: number];
  updateSocial: [socials: SocialLink[]];
  updateTheme: [patch: Partial<ThemeConfig>];
  selectTemplate: [id: string];
  updateVietqr: [
    data: {
      bankId: string;
      bankName: string;
      accountNumber: string;
      accountName?: string;
      amount?: string;
      note?: string;
      theme?: string;
      qrString: string;
    },
  ];
  updateImageAlbum: [data: { images: any[]; layout: ImageAlbumLayout }];
  updateBlocks: [blocks: BioBlock[]];
  save: [];
  publish: [];
  preview: [];
}>();

function onUpdateLink(index: number, field: string, value: string) {
  emit(
    "updateLink",
    index,
    field as "title" | "subtitle" | "url" | "icon",
    value,
  );
}
function onSelectImage(index: number) {
  emit("selectLinkImage", index);
}
function onUpdateSocial(socials: SocialLink[]) {
  emit("updateSocial", socials);
}

function onRemoveBlock(blockName: string) {
  const index = localBlocks.value.findIndex(b => b.name === blockName);
  if (index !== -1) {
    localBlocks.value.splice(index, 1);
    emitBlockUpdate();
  }
}

function onUpdateBlockData(blockName: BioBlock['name'], data: BioBlock['data']) {
  const index = localBlocks.value.findIndex(b => b.name === blockName);
  if (index !== -1 && localBlocks.value[index]) {
    localBlocks.value[index] = { ...localBlocks.value[index]!, data } as BioBlock;
    emitBlockUpdate();
  }
}

function onUpdateBlockTitle(blockName: 'links' | 'image-album', title: string) {
  const block = localBlocks.value.find(b => b.name === blockName);
  if (block) onUpdateBlockData(blockName, { ...block.data, title } as BioBlock['data']);
}

function onUpdateBirthdayCountdown(data: BirthdayCountdownBlock['data']) {
  const index = localBlocks.value.findIndex(b => b.name === 'birthday-countdown');
  if (index !== -1 && localBlocks.value[index]) {
    localBlocks.value[index]!.data = data;
    emitBlockUpdate();
  }
}
</script>
