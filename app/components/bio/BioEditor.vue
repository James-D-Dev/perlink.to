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
        item-key="id"
        handle=".drag-handle"
        @end="onDragEnd"
      >
        <template #item="{ element: block }">
          <div class="relative group mb-2">
            <!-- Each editor receives just its own block, so a page can hold several of one type.
                 (Comments must stay inside this div: draggable needs exactly one child per item) -->
            <BioBlockSocial
              v-if="block.name === 'social'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @update="(links: SocialLink[]) => patchData(block.id, { links })"
              @remove="onRemoveBlock(block.id)"
            />

            <BioBlockLinks
              v-if="block.name === 'links'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @add="(link: Partial<BioLink>) => addLink(block, link)"
              @remove="(index: number) => removeLink(block, index)"
              @update-link="(index: number, field: string, value: string | boolean) => updateLink(block, index, field, value)"
              @update="(items: BioLink[]) => patchData(block.id, { items: reorder(items) })"
              @select-image="onSelectImage"
              @update-title="(title: string) => patchData(block.id, { title })"
              @remove-block="onRemoveBlock(block.id)"
            />

            <VietQRDisplay
              v-if="block.name === 'vietqr'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @update:vietqr="(data: VietQRInfo) => replaceData(block.id, data)"
              @remove="onRemoveBlock(block.id)"
            />

            <BioBlockImageAlbum
              v-if="block.name === 'image-album'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              :bio-page-id="bioPageId"
              @toggle="$emit('toggleBlock', block.id)"
              @update="(data: { images: any[]; layout: ImageAlbumLayout }) => patchData(block.id, data)"
              @update-title="(title: string) => patchData(block.id, { title })"
              @remove="onRemoveBlock(block.id)"
            />

            <BioBlockText
              v-if="block.name === 'text'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockBirthdayCountdown
              v-if="block.name === 'birthday-countdown'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockMenu
              v-if="block.name === 'menu'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              :bio-page-id="bioPageId"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockHours
              v-if="block.name === 'hours'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockForm
              v-if="block.name === 'form'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockVideo
              v-if="block.name === 'video'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockTestimonials
              v-if="block.name === 'testimonials'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />

            <BioBlockContact
              v-if="block.name === 'contact'"
              :is-active="activeBlock === block.id"
              :blocks="[block]"
              @toggle="$emit('toggleBlock', block.id)"
              @remove="onRemoveBlock(block.id)"
              @update="(data: BioBlock['data']) => replaceData(block.id, data)"
            />
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
        {{ t('blocks.editor.addBlock') }}
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
          :aria-label="t('common.preview')"
          @click="$emit('preview')"
        >
          <span class="hidden sm:inline">{{ t('common.preview') }}</span>
        </UButton>
        <p class="flex min-w-0 flex-1 items-center gap-1.5 truncate px-1 text-xs" :class="dirty ? 'text-highlighted' : 'text-muted'">
          <span class="size-1.5 shrink-0 rounded-full" :class="dirty ? 'bg-amber-500' : 'bg-emerald-500'" />
          <span class="truncate">{{ dirty ? t('blocks.editor.unsavedChanges') : t('blocks.editor.allSaved') }}</span>
        </p>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-save"
          :loading="saving"
          @click="$emit('save')"
        >
          {{ t('common.saveDraft') }}
        </UButton>
        <UButton
          icon="i-lucide-globe"
          :loading="publishing"
          @click="$emit('publish')"
        >
          {{ t('common.publish') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import { nanoid } from "nanoid";
import type {
  BioData,
  Template,
  BioLink,
  ThemeConfig,
  SocialLink,
  ImageAlbumLayout,
  BioBlock,
  VietQRInfo,
} from "~/types/bio";

const props = defineProps<{
  activeBlock: string | null;
  bioData: BioData;
  templates: Template[];
  selectedTemplate: string;
  saving: boolean;
  publishing: boolean;
  bioPageId: string;
  /** There are edits that haven't been saved */
  dirty?: boolean;
}>();

const { t } = useI18n();

const showBlockModal = ref(false);

// All social links on the page, for the header layout picker
const socialLinks = computed<SocialLink[]>(() =>
  props.bioData.blocks.flatMap((b) => (b.name === "social" ? b.data?.links ?? [] : [])),
);

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

function selectBlock(blockType: string) {
  emit("addBlock", blockType);
}

const emit = defineEmits<{
  addBlock: [blockType: string];
  toggleBlock: [blockId: string];
  updateData: [key: keyof BioData, value: any];
  selectLinkImage: [index: number];
  updateTheme: [patch: Partial<ThemeConfig>];
  selectTemplate: [id: string];
  updateBlocks: [blocks: BioBlock[]];
  save: [];
  publish: [];
  preview: [];
}>();

// Lets the page open the add-block popup (onboarding checklist)
defineExpose({ openBlockModal: () => (showBlockModal.value = true) });

function onSelectImage(index: number) {
  emit("selectLinkImage", index);
}

// ---- Block updates, all by block id ----

function replaceData(blockId: string, data: BioBlock["data"]) {
  const index = localBlocks.value.findIndex((b) => b.id === blockId);
  if (index === -1) return;
  localBlocks.value[index] = { ...localBlocks.value[index]!, data } as BioBlock;
  emitBlockUpdate();
}

function patchData(blockId: string, patch: Record<string, unknown>) {
  const block = localBlocks.value.find((b) => b.id === blockId);
  if (block) replaceData(blockId, { ...(block.data as object), ...patch } as BioBlock["data"]);
}

function onRemoveBlock(blockId: string) {
  const index = localBlocks.value.findIndex((b) => b.id === blockId);
  if (index !== -1) {
    localBlocks.value.splice(index, 1);
    emitBlockUpdate();
  }
}

// Links keep an explicit order; editors work with the sorted list
function sortedLinks(block: BioBlock): BioLink[] {
  const items = block.name === "links" ? block.data?.items ?? [] : [];
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function reorder(items: BioLink[]): BioLink[] {
  return items.map((item, order) => ({ ...item, order }));
}

function addLink(block: BioBlock, link: Partial<BioLink>) {
  const items = sortedLinks(block);
  items.push({
    id: nanoid(6),
    title: link.title || "",
    subtitle: link.subtitle || "",
    url: link.url || "",
    imageUrl: link.imageUrl || "",
    icon: "link",
    order: items.length,
    isActive: true,
  });
  patchData(block.id!, { items: reorder(items) });
}

function removeLink(block: BioBlock, index: number) {
  const items = sortedLinks(block);
  items.splice(index, 1);
  patchData(block.id!, { items: reorder(items) });
}

function updateLink(block: BioBlock, index: number, field: string, value: string | boolean) {
  const items = sortedLinks(block);
  if (!items[index]) return;
  items[index] = { ...items[index]!, [field]: value };
  patchData(block.id!, { items });
}
</script>
