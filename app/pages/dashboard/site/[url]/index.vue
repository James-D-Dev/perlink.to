<template>
  <UDashboardPanel id="bio">
    <template #header>
      <UDashboardNavbar
        :title="step === 'template' ? t('dashboard.editor.titleCreate') : t('dashboard.editor.titleEdit')"
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
            :placeholder="t('dashboard.editor.selectSite')"
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

          <!-- Analytics -->
          <UTooltip v-if="existingBio?.username" :text="t('common.analytics')">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-chart-column"
              :aria-label="t('common.analytics')"
              :to="`/dashboard/site/${existingBio.username}/analytics`"
            />
          </UTooltip>

          <!-- Printable QR card -->
          <UTooltip v-if="existingBio?.username" :text="t('dashboard.qr.open')">
            <UButton color="neutral" variant="ghost" icon="i-lucide-qr-code" :aria-label="t('dashboard.qr.open')" @click="qrOpen = true" />
          </UTooltip>

          <!-- Inbox -->
          <UTooltip v-if="existingBio?.username" :text="t('dashboard.inbox.open')">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-inbox"
              :aria-label="t('dashboard.inbox.open')"
              :to="`/dashboard/site/${existingBio.username}/inbox`"
            />
          </UTooltip>

          <!-- Copy URL -->
          <UTooltip :text="t('dashboard.editor.copyUrl')">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-copy"
              @click="copyUrl"
            />
          </UTooltip>

          <!-- Share -->
          <UTooltip :text="t('dashboard.editor.share')">
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
            {{ t('dashboard.editor.continueToEditor') }}
            <UIcon name="i-lucide-arrow-right" class="w-5 h-5 ml-2" />
          </UButton>
        </div>
      </template>

      <!-- Bio Editor (Step 2) -->
      <div v-else-if="step === 'edit'">
        <UTabs
          :items="editorTabs"
          default-value="site"
          color="neutral"
          variant="link"
          size="md"
          class="w-full"
          :ui="{ list: 'border-b border-default dark:border-white/10', trigger: 'px-2.5 sm:px-3' }"
        >
          <template #content="{ item }">
            <!-- Site (2D page) Tab -->
            <template v-if="item.value === 'site'">
              <!-- Template picker for empty pages -->
              <div v-if="showTemplatePicker" class="mt-4 rounded-xl border border-perlink-blue/30 bg-perlink-blue/5 p-4">
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-highlighted dark:text-white">{{ t('dashboard.editor.templateHeading') }}</h3>
                    <p class="text-sm text-muted dark:text-neutral-400">{{ t('dashboard.editor.templateIntro') }}</p>
                  </div>
                  <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="templatePickerDismissed = true" />
                </div>
                <BioTemplatePicker @select="applyTemplate" />
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-4">
                <div class="lg:col-span-7">
                  <BioEditor
                    :active-block="activeBlock"
                    :bio-data="bioData"
                    :templates="templates"
                    :selected-template="selectedTemplate"
                    :saving="saving"
                    :publishing="publishing"
                    :bio-page-id="existingBio?.id ?? ''"
                    @add-block="onAddBlock"
                    @toggle-block="toggleBlock"
                    @update-data="updateBioData"
                    @update-blocks="bioData.blocks = $event"
                    @update-theme="handleUpdateTheme"
                    @select-template="bioData.templateId = $event"
                    @save="saveBio"
                    @publish="publishBio"
                    @preview="previewOpen = true"
                    :dirty="isDirty"
                  />
                </div>
                <div class="hidden lg:block lg:col-span-5 sticky top-4 self-start">
                  <BioPreviewPanel
                    ref="previewPanelRef"
                    :preview-data="bioData"
                    :existing-bio="existingBio"
                    :username="existingBio?.username || username"
                  />
                </div>
              </div>

              <SiteQrModal
                v-if="existingBio?.username"
                v-model:open="qrOpen"
                :username="existingBio.username"
                :title="bioData.title"
                :theme-config="bioData.themeConfig"
              />

              <!-- Phone preview (mobile and tablet; desktop shows it beside the editor) -->
              <!-- The phone frame is the card, so no modal chrome around it -->
              <UModal
                v-model:open="previewOpen"
                :title="t('common.preview')"
                :ui="{ content: 'w-auto max-w-none bg-transparent shadow-none ring-0 divide-y-0 overflow-visible' }"
              >
                <template #content>
                  <div class="relative">
                    <BioIPhone15ProMockup :width="320" :height="500">
                      <BioPreview :bio-data="bioData" :username="existingBio?.username || username" />
                    </BioIPhone15ProMockup>
                    <UButton
                      icon="i-lucide-x"
                      color="neutral"
                      variant="solid"
                      class="absolute -right-3 -top-3 rounded-full shadow-lg"
                      :aria-label="t('dashboard.editor.closePreview')"
                      @click="previewOpen = false"
                    />
                  </div>
                </template>
              </UModal>
            </template>

            <!-- 3D room Tab -->
            <template v-else-if="item.value === 'room'">
              <div class="max-w-3xl space-y-4 pt-4">
                <div class="overflow-hidden rounded-xl border border-default bg-default sm:flex dark:border-white/10">
                  <div class="relative h-44 sm:h-auto sm:min-h-56 sm:w-1/2">
                    <LazyRoomCanvas :room="roomModel" preview class="pointer-events-none" />
                  </div>
                  <div class="flex flex-col justify-center gap-3 p-4 sm:w-1/2 sm:p-5">
                    <div>
                      <h3 class="font-semibold text-highlighted">{{ t('dashboard.editor.room.heading') }}</h3>
                      <p class="mt-1 text-sm text-muted">
                        {{ t('dashboard.editor.room.objects', { n: roomModel.objects.length }) }}
                      </p>
                    </div>
                    <div>
                      <UButton icon="i-lucide-box" :label="t('dashboard.editor.room.openEditor')" size="sm" :loading="openingRoom" @click="openRoomEditor" />
                    </div>
                  </div>
                </div>

                <div class="flex items-start justify-between gap-4 rounded-xl border border-default bg-default p-4 dark:border-white/10">
                  <div>
                    <p class="text-sm font-medium text-highlighted">{{ t('dashboard.editor.room.showFirst') }}</p>
                    <p class="mt-0.5 text-sm text-muted">
                      {{ pageMode === '3d'
                        ? t('dashboard.editor.room.modeOn')
                        : t('dashboard.editor.room.modeOff') }}
                    </p>
                  </div>
                  <USwitch :model-value="pageMode === '3d'" @update:model-value="setPageMode($event ? '3d' : '2d')" />
                </div>

                <div class="flex justify-end gap-2">
                  <UButton color="neutral" variant="outline" icon="i-lucide-save" :loading="saving" @click="saveBio">{{ t('common.saveDraft') }}</UButton>
                  <UButton icon="i-lucide-globe" :loading="publishing" @click="publishBio">{{ t('common.publish') }}</UButton>
                </div>
              </div>
            </template>

            <!-- Settings Tab -->
            <template v-else-if="item.value === 'settings'">
              <div class="pt-4 max-w-lg mx-auto space-y-6">
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.editor.settings.addressHeading') }}</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    {{ t('dashboard.editor.settings.addressText') }}
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

                <!-- Site language -->
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.editor.settings.languageHeading') }}</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    {{ t('dashboard.editor.settings.languageText') }}
                  </p>
                  <USelect
                    :model-value="normalizeSiteLanguage(bioData.themeConfig.language)"
                    :items="SITE_LANGUAGES.map((l) => ({ label: l.label, value: l.code }))"
                    class="w-full"
                    @update:model-value="handleUpdateTheme({ language: $event as string })"
                  />
                </div>

                <!-- Search & sharing -->
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.seo.heading') }}</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-4">{{ t('dashboard.seo.text') }}</p>
                  <SiteSeoSettings
                    :bio-data="bioData"
                    :username="existingBio?.username || username"
                    @update-theme="handleUpdateTheme"
                  />
                </div>

                <!-- Template -->
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.editor.settings.templateHeading') }}</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    {{ t('dashboard.editor.settings.templateText') }}
                  </p>
                  <BioTemplatePicker class="!grid-cols-2" @select="confirmApplyTemplate" />
                </div>

                <!-- Share Button Toggle -->
                <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-semibold text-highlighted dark:text-white mb-1">
                        {{ t('dashboard.editor.settings.shareHeading') }}
                      </h3>
                      <p class="text-sm text-muted dark:text-neutral-400">
                        {{ t('dashboard.editor.settings.shareText') }}
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
                  <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.editor.settings.visibilityHeading') }}</h3>
                  <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                    {{ t('dashboard.editor.settings.visibilityText') }}
                  </p>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-highlighted dark:text-white">
                        {{ existingBio?.isPublished ? t('dashboard.editor.settings.published') : t('dashboard.editor.settings.draft') }}
                      </p>
                      <p class="text-xs text-muted dark:text-neutral-400">
                        {{
                          existingBio?.isPublished
                            ? t('dashboard.editor.settings.publicText')
                            : t('dashboard.editor.settings.privateText')
                        }}
                      </p>
                    </div>
                    <UBadge
                      :color="existingBio?.isPublished ? 'success' : 'neutral'"
                      variant="soft"
                    >
                      {{ existingBio?.isPublished ? t('dashboard.editor.settings.live') : t('dashboard.editor.settings.draft') }}
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
import { useDebounceFn } from "@vueuse/core";
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
const { t } = useI18n();
const confirm = useConfirm();

// State
const loading = ref(true);
const step = ref<"template" | "edit">("template");
const existingBio = ref<any>(null);

// Block-based editor state
const activeBlock = ref<string | null>("header");


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
    navigateTo(`/dashboard/site/${username}`);
  }
};

// Editor tabs
const previewOpen = ref(false);
const qrOpen = ref(false);

const editorTabs = computed(() => [
  { value: "site", label: t("dashboard.editor.tabs.site"), icon: "i-lucide-layout-list" },
  { value: "room", label: t("dashboard.editor.tabs.room"), icon: "i-lucide-box" },
  { value: "settings", icon: "i-lucide-settings", "aria-label": t("common.settings") },
]);

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

const onAddBlock = (blockType: string) => {
  const name = blockType as BioBlock["name"];
  // One-per-page blocks just open the existing one
  const existing = bioData.blocks.find((b) => b.name === name);
  if (existing && !isRepeatableBlock(name)) {
    activeBlock.value = existing.id ?? null;
    return;
  }
  const newBlock = {
    id: nanoid(8),
    name,
    index: bioData.blocks.length,
    hidden: false,
    data: emptyBlockData(name),
  } as BioBlock;
  bioData.blocks = [...bioData.blocks, newBlock];
  activeBlock.value = newBlock.id!;
};

const sharePage = async () => {
  const url = `https://perlink.to/${username.value}`;
  try {
    await navigator.share({
      title: bioData.title || t("dashboard.editor.shareFallbackTitle"),
      url: url,
    });
  } catch (err) {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url);
    toast.add({
      title: t("dashboard.toast.copied"),
      description: t("dashboard.toast.urlCopied"),
      color: "success",
    });
  }
};

const checkUsername = async () => {
  if (username.value.length < 3) {
    usernameError.value = t("dashboard.editor.usernameTooShort");
    usernameAvailable.value = false;
    return;
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username.value)) {
    usernameError.value = t("dashboard.editor.usernameInvalid");
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
      title: t("dashboard.editor.created"),
      description: t("dashboard.editor.createdText"),
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: error.data?.statusMessage || t("dashboard.editor.createFailed"),
      color: "error",
    });
  } finally {
    creating.value = false;
  }
};

const saveBio = async () => {
  if (!existingBio.value?.username) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: t("dashboard.editor.noSiteToSave"),
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
    markSaved();

    toast.add({
      title: t("dashboard.toast.saved"),
      description: t("dashboard.editor.savedText"),
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: error.data?.statusMessage || t("dashboard.editor.saveFailed"),
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};

const publishBio = async () => {
  if (!existingBio.value?.username) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: t("dashboard.editor.noSiteToPublish"),
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
      title: t("dashboard.toast.published"),
      description: t("dashboard.editor.publishedText", { username: existingBio.value.username }),
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: error.data?.statusMessage || t("dashboard.editor.publishFailed"),
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
    title: t("dashboard.toast.copied"),
    description: t("dashboard.toast.urlCopied"),
    color: "success",
  });
};

// Helper functions for updating bio data
const updateBioData = (key: keyof BioData, value: any) => {
  (bioData[key] as any) = value;
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

const handleUpdateTheme = (patch: Partial<ThemeConfig>) => {
  updateTheme(patch);
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
  bioData.blocks = withBlockIds(content.blocks);
  bioData.themeConfig = {
    ...content.themeConfig,
    showShare: bioData.themeConfig.showShare,
    pageMode: bioData.themeConfig.pageMode || "2d",
    room: content.room,
  };
  templatePickerDismissed.value = true;
  activeBlock.value = bioData.blocks[0]?.id ?? "header";
  toast.add({
    title: t("dashboard.editor.templateApplied", { name: t(`dashboard.templates.${template.id}.name`) }),
    description: t("dashboard.editor.templateAppliedText"),
    color: "success",
  });
};

const confirmApplyTemplate = async (templateId: string) => {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return;
  const ok = await confirm({
    title: t("dashboard.editor.applyTitle", { name: t(`dashboard.templates.${template.id}.name`) }),
    description: t("dashboard.editor.applyText"),
    confirmLabel: t("dashboard.editor.applyConfirm"),
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
  // The room can be furnished before it's switched on for visitors
  if (!bioData.themeConfig.room) bioData.themeConfig = { ...bioData.themeConfig, room: createDefaultRoom() };
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
      bioData.blocks = withBlockIds(response.bioPage.blocks || []);
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

      step.value = "edit";
      await nextTick();
      markSavedSnapshotOnly();
      offerDraftRestore();
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

// ---- Unsaved changes ----
// "Save draft" writes straight to the site, so edits are never saved
// automatically; instead we show what's unsaved, warn before leaving and
// keep a local backup in case the tab closes.
const savedSnapshot = ref<string | null>(null);
const currentSnapshot = computed(() =>
  JSON.stringify({
    title: bioData.title,
    bio: bioData.bio,
    avatarUrl: bioData.avatarUrl,
    templateId: bioData.templateId,
    themeConfig: bioData.themeConfig,
    blocks: bioData.blocks,
  }),
);
const isDirty = computed(() => savedSnapshot.value !== null && savedSnapshot.value !== currentSnapshot.value);
const draftKey = computed(() => `perlink:draft:${routeUsername.value}`);

// After loading: the server copy is the saved state (keep any local backup)
function markSavedSnapshotOnly() {
  savedSnapshot.value = currentSnapshot.value;
}

function markSaved() {
  savedSnapshot.value = currentSnapshot.value;
  try {
    localStorage.removeItem(draftKey.value);
  } catch {}
}

const backupDraft = useDebounceFn(() => {
  if (!isDirty.value) return;
  try {
    localStorage.setItem(draftKey.value, currentSnapshot.value);
  } catch {}
}, 1000);
watch(currentSnapshot, backupDraft);

// Offer to bring back edits that were never saved (tab closed, crash...)
function offerDraftRestore() {
  let draft: string | null = null;
  try {
    draft = localStorage.getItem(draftKey.value);
  } catch {}
  if (!draft || draft === savedSnapshot.value) return;
  toast.add({
    title: t("dashboard.editor.unsaved.restoreTitle"),
    description: t("dashboard.editor.unsaved.restoreText"),
    duration: 0,
    actions: [
      {
        label: t("dashboard.editor.unsaved.restoreAction"),
        color: "neutral",
        onClick: () => {
          try {
            Object.assign(bioData, JSON.parse(draft!));
          } catch {}
        },
      },
      {
        label: t("dashboard.editor.unsaved.discardAction"),
        color: "neutral",
        variant: "ghost",
        onClick: () => {
          try {
            localStorage.removeItem(draftKey.value);
          } catch {}
        },
      },
    ],
  });
}

function onBeforeUnload(event: BeforeUnloadEvent) {
  if (!isDirty.value) return;
  event.preventDefault();
  event.returnValue = "";
}
onMounted(() => window.addEventListener("beforeunload", onBeforeUnload));
onBeforeUnmount(() => window.removeEventListener("beforeunload", onBeforeUnload));

const confirmLeave = useConfirm();
onBeforeRouteLeave(async () => {
  if (!isDirty.value) return true;
  return await confirmLeave({
    title: t("dashboard.editor.unsaved.leaveTitle"),
    description: t("dashboard.editor.unsaved.leaveText"),
    confirmLabel: t("dashboard.editor.unsaved.leaveAction"),
    color: "warning",
  });
});

onMounted(() => {
  loadBio();
  loadUserBioPages();
});
</script>
