<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      title="Social Links"
      icon="i-lucide-share-2"
      :hidden="socialBlock?.hidden"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('social')"
    >
      <template #preview>
        <div class="flex items-center -space-x-1 mr-1">
          <template
            v-for="(social, i) in displayedSocials.slice(0, 4)"
            :key="social.provider"
          >
            <div
              class="size-6 rounded-full bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl ring-1 ring-white flex items-center justify-center"
            >
              <UIcon :name="getProviderIcon(social.provider)" class="size-5" />
            </div>
          </template>
        </div>
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

    <!-- Social Edit Form -->
    <div v-if="isActive" class="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03]">
      <!-- Draggable Social Links List -->
      <div class="space-y-3 mb-4">
        <draggable
          v-model="localSocials"
          item-key="id"
          handle=".drag-handle"
          @end="onDragEnd"
        >
          <template #item="{ element: social, index }">
            <div
              class="flex items-center gap-3 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 p-3 mb-2 last:mb-0"
            >
              <!-- Drag Handle -->
              <div
                class="drag-handle cursor-move text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 flex-shrink-0"
              >
                <UIcon name="i-lucide-grip-vertical" class="w-5 h-5" />
              </div>

              <!-- Provider Icon -->
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                :style="{
                  backgroundColor: getProviderColor(social.provider) + '20',
                }"
              >
                <UIcon
                  :name="getProviderIcon(social.provider)"
                  class="w-5 h-5"
                  :style="{ color: getProviderColor(social.provider) }"
                />
              </div>

              <!-- URL Input -->
              <UInput
                :model-value="social.url"
                :placeholder="!isUsernameProvider(social.provider) && !isInputFocused(social.id) ? '' : getProviderPlaceholder(social.provider)"
                size="lg"
                class="flex-1"
                @update:model-value="updateSocialUrl(social.id, $event)"
                @focus="onInputFocus(social.id)"
                @blur="onInputBlur(social.id)"
              >
                <label
                  class="flex items-center pointer-events-none absolute left-0 px-1.5 transition-all"
                  :class="isUsernameProvider(social.provider) || isInputFocused(social.id) || !!social.url
                    ? '-top-2.5 text-highlighted text-xs font-medium'
                    : 'top-2 text-dimmed text-sm font-normal'"
                >
                  <span class="inline-flex bg-default px-1">
                    {{ getProviderLabel(social.provider) }}

                    <span
                      class="inline-flex items-center text-xs text-gray-500 dark:text-neutral-400 ml-1"
                      >- Clicks: {{ social.clicks || 0 }}</span
                    >
                  </span>
                </label>
                <template v-if="isUsernameProvider(social.provider)" #leading>
                  <span>@</span>
                </template>
              </UInput>

              <!-- Delete Button -->
              <UButton
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-trash-2"
                class="flex-shrink-0 text-gray-400 dark:text-neutral-500 hover:text-red-500"
                @click="deleteSocial(social.id)"
              />
            </div>
          </template>
        </draggable>

        <!-- Empty State -->
        <div
          v-if="localSocials.length === 0"
          class="text-center py-8 text-gray-400 dark:text-neutral-500"
        >
          <UIcon
            name="i-lucide-share-2"
            class="w-8 h-8 mx-auto mb-2 opacity-50"
          />
          <p class="text-sm">No social links added yet</p>
        </div>
      </div>

      <!-- Add Social Button -->
      <UButton
        block
        color="neutral"
        variant="solid"
        icon="i-lucide-plus"
        label="Add social"
        class="bg-gray-900 text-white hover:bg-gray-800"
        @click="openAddModal"
      />
    </div>

    <!-- Add Social Modal -->
    <UModal v-model:open="isAddModalOpen" title="Add Social Link">
      <template #body>
        <div >
          <UInput
            v-model="providerSearchQuery"
            placeholder="Search social platforms..."
            icon="i-lucide-search"
            class="mb-4 w-full"
            size="lg"
          />
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <button
              v-for="provider in availableProviders"
              :key="provider.key"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-perlink-cyan hover:bg-perlink-cyan/5 transition-all"
              @click="addSocial(provider.key)"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: provider.color + '20' }"
              >
                <UIcon
                  :name="provider.icon"
                  class="w-6 h-6"
                  :style="{ color: provider.color }"
                />
              </div>
              <span class="text-xs font-medium text-gray-700 dark:text-neutral-200">{{
                provider.label
              }}</span>
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, toRef } from "vue";
import draggable from "vuedraggable";
import type {
  SocialLink,
  SocialProvider,
  SocialProviderInfo,
  BioBlock,
} from "~/types/bio";
import { SOCIAL_PROVIDERS } from "~/types/bio";
import { nanoid } from "nanoid";
import { useBioBlock } from "~/composables/useBioBlock";

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
}>();

const emit = defineEmits<{
  toggle: [];
  update: [socials: SocialLink[]];
}>();

// Use composable
const { socialLinks, socialBlock, setSocialLinks, addSocialLink, removeSocialLink, updateSocialLink, moveSocialLink, toggleBlockHidden } = useBioBlock({
  blocks: toRef(props, 'blocks')
});

// Local copy for drag-and-drop
const localSocials = ref<SocialLink[]>([]);
let isUpdatingFromParent = false;

// Sync with parent (one-way)
watch(
  () => socialLinks.value,
  (newVal) => {
    isUpdatingFromParent = true;
    localSocials.value = [...(newVal || [])].sort(
      (a, b) => (a.index || 0) - (b.index || 0),
    );
    nextTick(() => {
      isUpdatingFromParent = false;
    });
  },
  { immediate: true, deep: true },
);

// Emit helper - only emit when not receiving from parent
function emitUpdate() {
  if (isUpdatingFromParent) return;
  const sorted = localSocials.value.map((s, i) => ({ ...s, index: i }));
  emit("update", sorted);
}

const isAddModalOpen = ref(false);
const focusedSocialIds = ref<Set<string>>(new Set());
const providerSearchQuery = ref('');

function onInputFocus(socialId: string) {
  focusedSocialIds.value.add(socialId);
}

function onInputBlur(socialId: string) {
  focusedSocialIds.value.delete(socialId);
}

function isInputFocused(socialId: string): boolean {
  return focusedSocialIds.value.has(socialId);
}

// Get providers not yet added, filtered by search query
const availableProviders = computed(() => {
  const addedProviders = new Set(localSocials.value.map((s) => s.provider));
  let providers = SOCIAL_PROVIDERS.filter((p) => !addedProviders.has(p.key));
  if (providerSearchQuery.value.trim()) {
    const query = providerSearchQuery.value.toLowerCase();
    providers = providers.filter((p) =>
      p.label.toLowerCase().includes(query) ||
      p.key.toLowerCase().includes(query)
    );
  }
  return providers;
});

// Display first 4 socials for preview
const displayedSocials = computed(() => {
  return localSocials.value.slice(0, 4);
});

// Helper functions
function getProviderInfo(provider: string): SocialProviderInfo | undefined {
  return SOCIAL_PROVIDERS.find((p) => p.key === provider);
}

function getProviderIcon(provider: string): string {
  return getProviderInfo(provider)?.icon || "i-lucide-link";
}

function getProviderColor(provider: string): string {
  return getProviderInfo(provider)?.color || "#6B7280";
}

function getProviderLabel(provider: string): string {
  return getProviderInfo(provider)?.label || provider;
}

function getProviderPlaceholder(provider: string): string {
  return getProviderInfo(provider)?.placeholder || "Enter URL";
}

 

function isUsernameProvider(provider: string): boolean {
  return SOCIAL_PROVIDERS.find((p) => p.key === provider)?.placeholder == "username";
}

function openAddModal() {
  if (availableProviders.value.length === 0) {
    // Could show a toast here
    return;
  }
  isAddModalOpen.value = true;
}

function addSocial(provider: SocialProvider) {
  const newSocial: SocialLink = {
    id: nanoid(),
    url: "",
    index: localSocials.value.length,
    provider,
    clicks: 0,
  };
  localSocials.value.push(newSocial);
  emitUpdate();
  isAddModalOpen.value = false;
}

function updateSocialUrl(id: string, url: string) {
  const social = localSocials.value.find((s) => s.id === id);
  if (social) {
    social.url = url;
    emitUpdate();
  }
}

function deleteSocial(id: string) {
  const index = localSocials.value.findIndex((s) => s.id === id);
  if (index > -1) {
    localSocials.value.splice(index, 1);
    emitUpdate();
  }
}

function onDragEnd() {
  // Re-index after drag
  localSocials.value = localSocials.value.map((s, i) => ({ ...s, index: i }));
  emitUpdate();
}
</script>
