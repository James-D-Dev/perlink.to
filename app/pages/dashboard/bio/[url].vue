<template>
  <UDashboardPanel id="bio">
    <template #header>
      <UDashboardNavbar
        :title="step === 'template' ? 'Create a site' : 'Edit site'"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- Bio Page Selector -->
          <USelect
            v-if="userBioPages.length > 0"
            v-model="selectedBioUsername"
            :items="userBioPages"
            placeholder="Select site"
            class="hidden sm:block"
            size="xl"
            color="neutral"
            variant="subtle"
            @update:model-value="onBioPageChange"
            :ui="{}"
          >
            <template #item-label="{ item }">
              <span>perlink.to/{{ item.value }}</span>
            </template>
            <template #default="{ modelValue }">
              <span class="font-medium">perlink.to/{{ modelValue }}</span>
            </template>
          </USelect>

          <!-- Copy URL -->
          <UTooltip text="Copy URL">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-copy"
              @click="copyUrl"
            />
          </UTooltip>

          <!-- Share -->
          <UTooltip text="Share">
            <UButton color="primary" icon="i-lucide-share" @click="sharePage" />
          </UTooltip>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <UIcon
          name="i-lucide-loader-2"
          class="w-10 h-10 animate-spin text-dimmed dark:text-neutral-500"
        />
      </div>

      <!-- Template Selection (Step 1) -->
      <template v-else-if="step === 'template'">
        <BioUsernameInput
          v-model:username="username"
          :username-error="usernameError"
          :username-available="usernameAvailable"
          @check="checkUsername"
        />

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <UButton
            color="primary"
            size="lg"
            :disabled="!canProceed"
            :loading="creating"
            @click="createBioPage"
          >
            Continue to Editor
            <UIcon name="i-lucide-arrow-right" class="w-5 h-5 ml-2" />
          </UButton>
        </div>
      </template>

      <!-- Bio Editor (Step 2) -->
      <div v-else-if="step === 'edit'">
        <UTabs
          :items="editorTabs"
          default-value="editor"
          color="neutral"
          variant="pill"
          class="w-full"
          size="xl"
        >
          <template #content="{ item }">
            <!-- Editor Tab -->
            <template v-if="item.value === 'editor'">
              <!-- Template picker for empty pages -->
              <div v-if="showTemplatePicker" class="mt-4 rounded-xl border border-perlink-blue/30 bg-perlink-blue/5 p-4">
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-highlighted dark:text-white">Start from a template</h3>
                    <p class="text-sm text-muted dark:text-neutral-400">Pick a starting point. Every template includes sample content, a theme and a matching 3D room.</p>
                  </div>
                  <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="templatePickerDismissed = true" />
                </div>
                <BioTemplatePicker @select="applyTemplate" />
              </div>

              <!-- Page mode -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-4">
                <div class="inline-flex rounded-xl border border-default dark:border-white/10 bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl p-1">
                  <UButton
                    icon="i-lucide-layout-list"
                    label="2D page"
                    :color="pageMode === '2d' ? 'primary' : 'neutral'"
                    :variant="pageMode === '2d' ? 'solid' : 'ghost'"
                    @click="setPageMode('2d')"
                  />
                  <UButton
                    icon="i-lucide-box"
                    label="3D room"
                    :color="pageMode === '3d' ? 'primary' : 'neutral'"
                    :variant="pageMode === '3d' ? 'solid' : 'ghost'"
                    @click="setPageMode('3d')"
                  />
                </div>
                <p class="text-sm text-muted dark:text-neutral-400">
                  {{ pageMode === '3d'
                    ? 'Visitors see your 3D room first and can switch to the 2D page.'
                    : 'Visitors see your classic page.' }}
                </p>
              </div>

              <!-- 3D room launcher -->
              <div v-if="pageMode === '3d'" class="mt-4 overflow-hidden rounded-xl border border-default bg-default/60 backdrop-blur-xl sm:flex">
                <div class="relative h-56 sm:h-auto sm:w-1/2">
                  <LazyRoomCanvas :room="roomModel" preview class="pointer-events-none" />
                </div>
                <div class="flex flex-col justify-center gap-3 p-5 sm:w-1/2">
                  <div>
                    <h3 class="font-semibold text-highlighted">Your 3D room</h3>
                    <p class="mt-1 text-sm text-muted">
                      {{ roomModel.objects.length }} objects · decorate it in the full-screen editor, then publish.
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <UButton icon="i-lucide-box" label="Open 3D editor" :loading="openingRoom" @click="openRoomEditor" />
                    <UButton icon="i-lucide-globe" label="Publish" color="neutral" variant="outline" :loading="publishing" @click="publishBio" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div class="lg:col-span-7">
                  <BioEditor
                    :active-block="activeBlock"
                    :bio-data="bioData"
                    :templates="templates"
                    :selected-template="selectedTemplate"
                    :saving="saving"
                    :publishing="publishing"
                    :bio-page-id="existingBio?.id ?? ''"
                    :enabled-blocks="enabledBlocks"
                    @add-block="onAddBlock"
                    @toggle-block="toggleBlock"
                    @update-data="updateBioData"
                    @update-vietqr="handleUpdateVietQR"
                    @update-image-album="handleUpdateImageAlbum"
                    @update-blocks="bioData.blocks = $event"
                    @add-link="addLink"
                    @remove-link="removeLink"
                    @update-link="handleUpdateLink"
                    @update-social="handleUpdateSocial"
                    @update-theme="handleUpdateTheme"
                    @select-template="bioData.templateId = $event"
                    @save="saveBio"
                    @publish="publishBio"
                  />
                </div>
                <div class="lg:col-span-5 sticky top-4 self-start">
                  <BioPreviewPanel
                    ref="previewPanelRef"
                    :preview-data="bioData"
                    :existing-bio="existingBio"
                    :username="existingBio?.username || username"
                  />
                </div>
              </div>
            </template>

            <!-- Analytics Tab -->
            <template v-else-if="item.value === 'analytics'">
              <div class="max-w-5xl mx-auto pt-4">
                <BioAnalytics
                  :bio-page-id="existingBio?.id ?? ''"
                  :username="existingBio?.username ?? ''"
                  :bio-links="links"
                  :social-links="socialLinks"
                />
              </div>
            </template>

            <!-- Settings Tab -->
            <template v-else-if="item.value === 'settings'">
              <div class="pt-4 max-w-lg mx-auto space-y-6">
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">Site address</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    Your public site address
                  </p>
                  <div
                    class="flex items-center gap-2 bg-muted dark:bg-white/[0.03] border border-default dark:border-white/10 rounded-lg px-3 py-2"
                  >
                    <span class="text-muted dark:text-neutral-400 text-sm">perlink.to/</span>
                    <span class="font-medium text-highlighted dark:text-white text-sm">{{
                      existingBio?.username
                    }}</span>
                  </div>
                </div>

                <!-- Template -->
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">Template</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    Replace the page content, theme and 3D room with a template.
                  </p>
                  <BioTemplatePicker class="!grid-cols-2" @select="confirmApplyTemplate" />
                </div>

                <!-- Share Button Toggle -->
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-semibold text-highlighted dark:text-white mb-1">
                        Share Button
                      </h3>
                      <p class="text-sm text-muted dark:text-neutral-400">
                        Show a floating share button on your site
                      </p>
                    </div>
                    <USwitch
                      :model-value="bioData.themeConfig.showShare ?? false"
                      @update:model-value="
                        (val) =>
                          handleUpdateTheme({ showShare: val as boolean })
                      "
                    />
                  </div>
                </div>

                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">Visibility</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    Control who can see your site
                  </p>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-highlighted dark:text-white">
                        {{ existingBio?.isPublished ? "Published" : "Draft" }}
                      </p>
                      <p class="text-xs text-muted dark:text-neutral-400">
                        {{
                          existingBio?.isPublished
                            ? "Your page is publicly visible"
                            : "Only you can see this page"
                        }}
                      </p>
                    </div>
                    <UBadge
                      :color="existingBio?.isPublished ? 'success' : 'neutral'"
                      variant="soft"
                    >
                      {{ existingBio?.isPublished ? "Live" : "Draft" }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </UTabs>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { nanoid } from "nanoid";
import type {
  BioData,
  BioLink,
  SocialLink,
  ThemeConfig,
  VietQRInfo,
  BioBlock,
} from "~/types/bio";
import { DEFAULT_THEME } from "~/types/bio";
import { PAGE_TEMPLATES } from "~/data/pageTemplates";
import { createDefaultRoom, normalizeRoom, type PageMode, type RoomConfig } from "~/types/room";
import { useBioBlock } from "~/composables/useBioBlock";

definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
  ssr: false,
});

const toast = useToast();
const confirm = useConfirm();

// State
const loading = ref(true);
const step = ref<"template" | "edit">("template");
const existingBio = ref<any>(null);

// Block-based editor state
const activeBlock = ref<string | null>("header");
const enabledBlocks = ref<string[]>([
]);

const selectedTemplate = ref("modern");
const username = ref("");
const usernameError = ref("");
const usernameAvailable = ref(false);
const creating = ref(false);
const saving = ref(false);
const publishing = ref(false);

const bioData = reactive<BioData>({
  title: "",
  bio: "",
  avatarUrl: "",
  templateId: "modern",
  themeConfig: { ...DEFAULT_THEME },
  blocks: [],
});

// Use composable for block management
const blocksRef = toRef(bioData, "blocks");
const {
  links,
  socialLinks,
  addLink: addLinkToBlock,
  removeLink: removeLinkFromBlock,
  updateLink: updateLinkInBlock,
} = useBioBlock({ blocks: blocksRef });

// Bio page selector state
const userBioPages = ref<{ label: string; value: string }[]>([]);
const selectedBioUsername = ref<string>("");

// Load all user bio pages for selector
const loadUserBioPages = async () => {
  try {
    const response = await $fetch("/api/admin/bios");
    if (response.success && response.bioPages) {
      userBioPages.value = response.bioPages.map((bp: any) => ({
        label: bp.username,
        value: bp.username,
      }));
      // Set default selected based on current route
      selectedBioUsername.value = routeUsername.value;
    }
  } catch (error) {
    console.error("Failed to load user bio pages:", error);
  }
};

// Handle bio page selection change
const onBioPageChange = (username: string) => {
  if (username && username !== routeUsername.value) {
    navigateTo(`/dashboard/bio/${username}`);
  }
};

// Editor tabs
const editorTabs = [
  { value: "editor", label: "Editor", icon: "i-lucide-pencil" },
  { value: "analytics", label: "Analytics", icon: "i-lucide-bar-chart-2" },
  { value: "settings", label: "Settings", icon: "i-lucide-settings" },
];

// Computed
const canProceed = computed(() => {
  return (
    selectedTemplate.value &&
    username.value.length >= 3 &&
    usernameAvailable.value &&
    !usernameError.value
  );
});

const previewPanelRef = ref<{ scrollToBlock: (blockId: string) => void } | null>(null);

const toggleBlock = (blockId: string) => {
  const isOpening = activeBlock.value !== blockId;
  activeBlock.value = activeBlock.value === blockId ? null : blockId;
  
  // Scroll to the corresponding block in preview when opening
  if (isOpening && previewPanelRef.value) {
    nextTick(() => {
      previewPanelRef.value?.scrollToBlock(blockId);
    });
  }
};

const onAddBlock = (blockId: string) => {
  // Check if block already exists in bioData.blocks
  const existingIndex = bioData.blocks.findIndex((b) => b.name === blockId);

  if (existingIndex === -1) {
    // Create new block with proper structure
    const newBlock = {
      name: blockId,
      index: bioData.blocks.length,
      hidden: false,
      data: {},
    } as BioBlock;
    // Create new array to trigger reactivity
    bioData.blocks = [...bioData.blocks, newBlock];
    // Add to enabledBlocks
    if (!enabledBlocks.value.includes(blockId)) {
      enabledBlocks.value.push(blockId);
    }
  }

  // Auto-expand the newly added block
  activeBlock.value = blockId;
};

const sharePage = async () => {
  const url = `https://perlink.to/${username.value}`;
  try {
    await navigator.share({
      title: bioData.title || "Your Name",
      url: url,
    });
  } catch (err) {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    toast.add({
      title: "Copied!",
      description: "URL copied to clipboard",
      color: "success",
    });
  }
};

const checkUsername = async () => {
  if (username.value.length < 3) {
    usernameError.value = "Username must be at least 3 characters";
    usernameAvailable.value = false;
    return;
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username.value)) {
    usernameError.value =
      "Only letters, numbers, underscore and hyphen allowed";
    usernameAvailable.value = false;
    return;
  }

  usernameError.value = "";

  // For existing bio, allow same username
  if (existingBio.value && existingBio.value.username === username.value) {
    usernameAvailable.value = true;
    return;
  }

  // TODO: API call to check availability
  usernameAvailable.value = true;
};

const createBioPage = async () => {
  if (!canProceed.value) return;

  creating.value = true;
  try {
    const response = await $fetch("/api/bio", {
      method: "POST",
      body: {
        username: username.value,
        templateId: selectedTemplate.value,
      },
    });

    existingBio.value = response.bioPage;
    step.value = "edit";
    toast.add({
      title: "Site created!",
      description: "Now customize your page",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data?.statusMessage || "Failed to create site",
      color: "error",
    });
  } finally {
    creating.value = false;
  }
};

const addLink = (linkData?: Partial<BioLink>) => {
  const newLink: BioLink = {
    id: nanoid(6),
    title: linkData?.title || "",
    subtitle: linkData?.subtitle || "",
    url: linkData?.url || "",
    imageUrl: linkData?.imageUrl || "",
    icon: "link",
    order: links.value.length,
    isActive: true,
  };
  addLinkToBlock(newLink);
};

const removeLink = (index: number) => {
  removeLinkFromBlock(index);
};

const saveBio = async () => {
  if (!existingBio.value?.username) {
    toast.add({
      title: "Error",
      description: "No site to save",
      color: "error",
    });
    return;
  }

  saving.value = true;
  try {
    await $fetch(`/api/admin/bio/${existingBio.value.username}`, {
      method: "PUT" as const,
      body: {
        title: bioData.title,
        bio: bioData.bio,
        avatarUrl: bioData.avatarUrl,
        templateId: bioData.templateId,
        themeConfig: bioData.themeConfig,
        blocks: bioData.blocks,
      },
    });

    toast.add({
      title: "Saved!",
      description: "Your changes have been saved",
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data?.statusMessage || "Failed to save",
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};

const publishBio = async () => {
  if (!existingBio.value?.username) {
    toast.add({
      title: "Error",
      description: "No site to publish",
      color: "error",
    });
    return;
  }

  publishing.value = true;
  try {
    // First save
    await saveBio();

    // Then publish
    const response = await $fetch(
      `/api/admin/bio/${existingBio.value.username}/publish`,
      {
        method: "POST" as const,
      },
    );

    existingBio.value = response.bioPage;

    toast.add({
      title: "Published!",
      description: `Your page is now live at perlink.to/${existingBio.value.username}`,
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data?.statusMessage || "Failed to publish",
      color: "error",
    });
  } finally {
    publishing.value = false;
  }
};

const copyUrl = () => {
  const url = `https://perlink.to/${existingBio.value.username}`;
  navigator.clipboard.writeText(url);
  toast.add({
    title: "Copied!",
    description: "URL copied to clipboard",
    color: "success",
  });
};

// Helper functions for updating bio data
const updateBioData = (key: keyof BioData, value: any) => {
  (bioData[key] as any) = value;
};

const updateLink = (
  index: number,
  field: "title" | "url" | "subtitle" | "icon",
  value: string,
) => {
  updateLinkInBlock(index, { [field]: value });
};

const updateSocial = (socials: SocialLink[]) => {
  // Update via composable
  const { setSocialLinks } = useBioBlock({ blocks: toRef(bioData, "blocks") });
  setSocialLinks(socials);
};

const updateTheme = (update: Partial<ThemeConfig>) => {
  const merged: any = { ...bioData.themeConfig };
  for (const key of Object.keys(update) as (keyof ThemeConfig)[]) {
    const val = update[key];
    if (
      val &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      merged[key] &&
      typeof merged[key] === "object"
    ) {
      merged[key] = { ...merged[key], ...val };
    } else {
      merged[key] = val;
    }
  }
  bioData.themeConfig = merged;
};

const handleUpdateLink = (
  index: number,
  field: "title" | "url" | "subtitle" | "icon",
  value: string,
) => {
  updateLink(index, field, value);
};

const handleUpdateSocial = (socials: SocialLink[]) => {
  updateSocial(socials);
};

const handleUpdateTheme = (patch: Partial<ThemeConfig>) => {
  updateTheme(patch);
};

const handleUpdateVietQR = (data: VietQRInfo) => {
  const { setVietQR } = useBioBlock({ blocks: toRef(bioData, "blocks") });
  setVietQR(data);
};

const handleUpdateImageAlbum = (data: { images: any[]; layout: any }) => {
  const { setImageAlbum } = useBioBlock({ blocks: toRef(bioData, "blocks") });
  setImageAlbum(data.images, data.layout);
};

// Templates
const templatePickerDismissed = ref(false);
const showTemplatePicker = computed(
  () => !templatePickerDismissed.value && bioData.blocks.length === 0 && !bioData.bio,
);

const applyTemplate = async (templateId: string) => {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return;
  const content = template.build();
  bioData.title = bioData.title || content.title;
  bioData.avatarUrl = bioData.avatarUrl || content.avatarUrl || "";
  bioData.bio = content.bio;
  bioData.blocks = content.blocks;
  bioData.themeConfig = {
    ...content.themeConfig,
    showShare: bioData.themeConfig.showShare,
    pageMode: bioData.themeConfig.pageMode || "2d",
    room: content.room,
  };
  for (const block of content.blocks) {
    if (!enabledBlocks.value.includes(block.name)) enabledBlocks.value.push(block.name);
  }
  templatePickerDismissed.value = true;
  activeBlock.value = content.blocks[0]?.name ?? "header";
  toast.add({
    title: `${template.name} applied`,
    description: "Edit the sample content, then save or publish.",
    color: "success",
  });
};

const confirmApplyTemplate = async (templateId: string) => {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return;
  const ok = await confirm({
    title: `Apply "${template.name}"?`,
    description: "This replaces your current blocks, theme and 3D room. Your changes are not saved until you click Save.",
    confirmLabel: "Apply template",
    color: "primary",
  });
  if (ok) await applyTemplate(templateId);
};

// 3D room mode
const pageMode = computed<PageMode>(() => bioData.themeConfig.pageMode || "2d");

const roomModel = computed<RoomConfig>({
  get: () => bioData.themeConfig.room || createDefaultRoom(),
  set: (room) => {
    bioData.themeConfig = { ...bioData.themeConfig, room };
  },
});

const openingRoom = ref(false);

// Save the page first so the full-screen editor starts from the latest data
const openRoomEditor = async () => {
  if (!existingBio.value?.username) return;
  openingRoom.value = true;
  await saveBio();
  openingRoom.value = false;
  navigateTo(`/dashboard/room/${existingBio.value.username}`);
};

const setPageMode = (mode: PageMode) => {
  bioData.themeConfig = {
    ...bioData.themeConfig,
    pageMode: mode,
    room: mode === "3d" ? bioData.themeConfig.room || createDefaultRoom() : bioData.themeConfig.room,
  };
};

// Get username from route param
const route = useRoute();
const routeUsername = computed(() => route.params.url as string);

// Load existing bio by username
const loadBio = async () => {
  if (!routeUsername.value) {
    loading.value = false;
    return;
  }

  try {
    const response = await $fetch(`/api/admin/bio/${routeUsername.value}`);
    if (response.success && response.bioPage) {
      existingBio.value = response.bioPage;
      username.value = response.bioPage.username || "";
      selectedTemplate.value = response.bioPage.templateId || "modern";

      // Populate form
      bioData.title = response.bioPage.title || "";
      bioData.bio = response.bioPage.bio || "";
      bioData.avatarUrl = response.bioPage.avatarUrl || "";
      bioData.templateId = response.bioPage.templateId || "modern";
      bioData.blocks = response.bioPage.blocks || [];
      const savedTheme = response.bioPage.themeConfig || {};
      bioData.themeConfig = Object.keys(DEFAULT_THEME).reduce((acc, k) => {
        const key = k as keyof ThemeConfig;
        const def = DEFAULT_THEME[key];
        const saved = (savedTheme as any)[key];
        if (
          saved &&
          typeof saved === "object" &&
          !Array.isArray(saved) &&
          typeof def === "object"
        ) {
          (acc as any)[key] = { ...def, ...saved };
        } else {
          (acc as any)[key] = saved !== undefined ? saved : def;
        }
        return acc;
      }, {} as ThemeConfig);
      // 3D room settings are not part of DEFAULT_THEME, so copy them explicitly
      bioData.themeConfig.pageMode = (savedTheme as any).pageMode === "3d" ? "3d" : "2d";
      if ((savedTheme as any).room) {
        bioData.themeConfig.room = normalizeRoom((savedTheme as any).room);
      }

      // Mark every block the page already has as added
      for (const block of bioData.blocks) {
        if (!enabledBlocks.value.includes(block.name)) enabledBlocks.value.push(block.name);
      }

      // Enable VietQR block if exists
      if (
        bioData.blocks.some((b) => b.name === "vietqr") &&
        !enabledBlocks.value.includes("vietqr")
      ) {
        enabledBlocks.value.push("vietqr");
      }

      // Enable Image Album block if exists
      if (
        bioData.blocks.some((b) => b.name === "image-album") &&
        !enabledBlocks.value.includes("image-album")
      ) {
        enabledBlocks.value.push("image-album");
      }

      // Enable Links block if exists
      if (
        bioData.blocks.some((b) => b.name === "links") &&
        !enabledBlocks.value.includes("links")
      ) {
        enabledBlocks.value.push("links");
      }

      // Enable Social block if exists
      if (
        bioData.blocks.some((b) => b.name === "social") &&
        !enabledBlocks.value.includes("social")
      ) {
        enabledBlocks.value.push("social");
      }

      step.value = "edit";
    }
  } catch (error: any) {
    console.error("Failed to load bio:", error);
    // If bio not found, stay on template step to create new
    if (error.statusCode === 404) {
      username.value = routeUsername.value;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBio();
  loadUserBioPages();
});
</script>
