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
      <div id="edit-header" class="scroll-mt-24">
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
      </div>

      <!-- Each editor receives just its own block, so a page can hold several of one type.
           The wrapper gives the block header its move / duplicate / delete menu.
           (draggable wants exactly one node in the item slot, so no comments inside it) -->
      <draggable
        v-model="localBlocks"
        item-key="id"
        handle=".drag-handle"
        @end="onDragEnd"
      >
        <template #item="{ element: block, index }">
          <BioBlockItem
            :block="block"
            :index="index"
            :count="localBlocks.length"
            class="mb-2"
            @move="(dir: -1 | 1) => moveBlock(block.id, dir)"
            @duplicate="duplicateBlock(block.id)"
            @remove="onRemoveBlock(block.id)"
            @toggle-hidden="toggleHidden(block.id)"
            @add-below="openBlockModal(block.id)"
          >
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
          </BioBlockItem>
        </template>
      </draggable>

      <!-- Add Block Button -->
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accented py-3 text-sm font-medium text-muted transition hover:border-inverted hover:bg-elevated hover:text-highlighted dark:border-white/15 dark:text-neutral-400 dark:hover:border-white/40 dark:hover:text-white"
        @click="openBlockModal()"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        {{ t('blocks.editor.addBlock') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import { nanoid } from "nanoid";
import type {
  BioData,
  BioLink,
  SocialLink,
  ImageAlbumLayout,
  BioBlock,
  VietQRInfo,
} from "~/types/bio";

const props = defineProps<{
  activeBlock: string | null;
  bioData: BioData;
  bioPageId: string;
}>();

const { t } = useI18n();

const showBlockModal = ref(false);
// Where a block picked from the modal goes: after this block, or at the end
const insertAfterId = ref<string | null>(null);

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

function openBlockModal(afterId: string | null = null) {
  insertAfterId.value = afterId;
  showBlockModal.value = true;
}

function selectBlock(blockType: string) {
  const after = insertAfterId.value;
  const index = after ? localBlocks.value.findIndex((b) => b.id === after) : -1;
  emit("addBlock", blockType, index === -1 ? undefined : index + 1);
  insertAfterId.value = null;
}

const emit = defineEmits<{
  addBlock: [blockType: string, atIndex?: number];
  toggleBlock: [blockId: string];
  updateData: [key: keyof BioData, value: any];
  selectLinkImage: [index: number];
  updateBlocks: [blocks: BioBlock[]];
  /** A block was added or duplicated and should open */
  focusBlock: [blockId: string];
}>();

// Lets the page open the add-block popup (onboarding checklist)
defineExpose({ openBlockModal: () => openBlockModal() });

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

function moveBlock(blockId: string, direction: -1 | 1) {
  const index = localBlocks.value.findIndex((b) => b.id === blockId);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= localBlocks.value.length) return;
  const [block] = localBlocks.value.splice(index, 1);
  localBlocks.value.splice(target, 0, block!);
  emitBlockUpdate();
}

// A deep copy with fresh ids, placed right under the original
function duplicateBlock(blockId: string) {
  const index = localBlocks.value.findIndex((b) => b.id === blockId);
  if (index === -1) return;
  const source = localBlocks.value[index]!;
  const data = JSON.parse(JSON.stringify(source.data ?? {}), (key, value) =>
    key === "id" && typeof value === "string" ? nanoid(6) : value,
  );
  const copy = { ...source, id: nanoid(8), data } as BioBlock;
  localBlocks.value.splice(index + 1, 0, copy);
  emitBlockUpdate();
  emit("focusBlock", copy.id!);
}

function toggleHidden(blockId: string) {
  const index = localBlocks.value.findIndex((b) => b.id === blockId);
  if (index === -1) return;
  localBlocks.value[index] = { ...localBlocks.value[index]!, hidden: !localBlocks.value[index]!.hidden } as BioBlock;
  emitBlockUpdate();
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
