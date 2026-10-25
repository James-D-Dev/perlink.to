<template>
  <UDashboardPanel id="bio" :ui="{ body: step === 'edit' ? 'bg-sand' : '' }">
    <template #header>
      <!-- Editor bar: where you are on the left, what you can do with the site on the right -->
      <div class="flex h-16 shrink-0 items-center gap-2 border-b border-line bg-paper px-3 sm:px-4">
        <UDashboardSidebarToggle class="lg:hidden" />
        <UDashboardSidebarCollapse />
        <template v-if="step === 'edit' && existingBio?.username">
          <UTooltip :text="t('dashboard.sites.title')">
            <UButton to="/dashboard/site" icon="i-lucide-arrow-left" color="neutral" variant="ghost" class="hidden sm:inline-flex" :aria-label="t('dashboard.sites.title')" />
          </UTooltip>

          <!-- Which site, and a quick switch to another -->
          <UDropdownMenu :items="siteMenu" :content="{ align: 'start' }" :ui="{ content: 'w-64' }">
            <button type="button" class="flex min-w-0 items-center gap-2 rounded-full bg-sand py-1 pl-1 pr-3 transition-colors hover:bg-sand-strong">
              <img v-if="bioData.avatarUrl" :src="bioData.avatarUrl" alt="" class="size-7 shrink-0 rounded-full object-cover">
              <span v-else class="flex size-7 shrink-0 items-center justify-center rounded-full bg-paper text-xs font-semibold text-ink-soft">{{ (bioData.title || existingBio.username).charAt(0).toUpperCase() }}</span>
              <span class="min-w-0 text-left leading-tight">
                <span class="block max-w-40 truncate text-sm font-medium text-ink sm:max-w-56">{{ bioData.title || existingBio.username }}</span>
                <span class="block max-w-40 truncate text-[11px] text-ink-muted sm:max-w-56">perlink.to/{{ existingBio.username }}</span>
              </span>
              <UIcon name="i-lucide-chevrons-up-down" class="size-3.5 shrink-0 text-ink-muted" />
            </button>
          </UDropdownMenu>

          <div class="flex-1" />

          <!-- Save state, desktop (phones see it in the bottom bar) -->
          <p class="hidden items-center gap-1.5 text-xs lg:flex" :class="saveStatus.tone === 'muted' ? 'text-ink-muted' : 'text-ink'">
            <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-3 animate-spin" />
            <span v-else class="size-1.5 rounded-full" :class="{ 'bg-emerald-500': saveStatus.tone === 'muted', 'bg-amber-500': saveStatus.tone === 'pending', 'bg-red-500': saveStatus.tone === 'error' }" />
            {{ saveStatus.text }}
          </p>
          <UButton
            v-if="existingBio?.isPublished && existingBio?.hasDraft"
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-undo-2"
            class="hidden lg:inline-flex"
            :loading="discarding"
            :label="t('dashboard.editor.draft.discard')"
            @click="discardDraft"
          />

          <UTooltip :text="t('common.openSite')">
            <UButton :to="`/${existingBio.username}`" target="_blank" icon="i-lucide-external-link" color="neutral" variant="ghost" class="hidden sm:inline-flex" :aria-label="t('common.openSite')" />
          </UTooltip>
          <UDropdownMenu :items="shareMenu" :content="{ align: 'end' }" :ui="{ content: 'w-56' }">
            <UButton icon="i-lucide-share" color="neutral" variant="outline" :label="t('dashboard.editor.share')" class="max-sm:[&>span:last-child]:hidden" />
          </UDropdownMenu>
          <UTooltip :text="t('dashboard.editor.upToDate')" :disabled="!publishDisabled">
            <UButton
              icon="i-lucide-globe"
              class="hidden lg:inline-flex"
              :loading="publishing"
              :disabled="publishDisabled"
              :label="existingBio?.isPublished ? t('dashboard.editor.update') : t('common.publish')"
              @click="publishBio"
            />
          </UTooltip>
        </template>
        <h1 v-else class="text-base font-semibold text-ink">{{ t('dashboard.editor.titleCreate') }}</h1>
      </div>
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
      <div v-else-if="step === 'edit'" class="pb-20 lg:flex lg:gap-6 lg:pb-0">
        <!-- Sections: a labelled rail on desktop, chips on phones -->
        <nav class="sticky top-0 hidden h-fit w-16 shrink-0 flex-col items-center gap-3 pt-2 lg:flex" :aria-label="t('dashboard.editor.sections')">
          <button
            v-for="tab in editorTabs"
            :key="tab.value"
            type="button"
            class="group flex w-full flex-col items-center gap-1"
            :aria-current="activeTab === tab.value ? 'page' : undefined"
            @click="activeTab = tab.value as EditorTab"
          >
            <span
              class="flex size-11 items-center justify-center rounded-full transition-colors"
              :class="activeTab === tab.value ? 'bg-ink text-paper' : 'bg-paper text-ink-soft ring-1 ring-line group-hover:bg-sand'"
            >
              <UIcon :name="tab.icon" class="size-5" />
            </span>
            <span class="text-[11px] font-medium" :class="activeTab === tab.value ? 'text-ink' : 'text-ink-muted'">{{ tab.label }}</span>
          </button>
        </nav>

        <div class="min-w-0 flex-1">
        <div class="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:hidden">
          <button
            v-for="tab in editorTabs"
            :key="tab.value"
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
            :class="activeTab === tab.value ? 'bg-ink text-paper' : 'bg-paper text-ink-soft ring-1 ring-line'"
            @click="activeTab = tab.value as EditorTab"
          >
            <UIcon :name="tab.icon" class="size-4" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Content and design, with the preview beside them -->
        <div v-if="activeTab === 'content' || activeTab === 'header' || activeTab === 'design'" class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div class="rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-6 lg:col-span-7">
            <h2 class="mb-5 hidden text-xl font-semibold text-ink lg:block">{{ editorTabs.find((tab) => tab.value === activeTab)?.label }}</h2>
            <template v-if="activeTab === 'content'">
              <!-- Template picker for empty pages -->
              <div v-if="showTemplatePicker" class="mb-4 rounded-xl border border-perlink-blue/30 bg-perlink-blue/5 p-4">
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-highlighted dark:text-white">{{ t('dashboard.editor.templateHeading') }}</h3>
                    <p class="text-sm text-muted dark:text-neutral-400">{{ t('dashboard.editor.templateIntro') }}</p>
                  </div>
                  <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t('common.close')" @click="templatePickerDismissed = true" />
                </div>
                <BioTemplatePicker @select="applyTemplate" />
              </div>
              <!-- Closed it, page still empty: one line brings it back -->
              <button
                v-else-if="isEmptyPage"
                type="button"
                class="mb-4 flex w-full items-center gap-2 rounded-xl border border-dashed border-perlink-blue/40 px-4 py-2.5 text-sm font-medium text-highlighted transition hover:bg-perlink-blue/5"
                @click="templatePickerDismissed = false"
              >
                <UIcon name="i-lucide-layout-template" class="size-4" />
                {{ t('dashboard.editor.templateReopen') }}
                <UIcon name="i-lucide-chevron-right" class="ml-auto size-4 text-muted" />
              </button>

              <BioEditor
                ref="editorRef"
                @edit-header="activeTab = 'header'"
                :active-block="activeBlock"
                :bio-data="bioData"
                :bio-page-id="existingBio?.id ?? ''"
                @add-block="onAddBlock"
                @toggle-block="toggleBlock"
                @update-data="updateBioData"
                @update-blocks="bioData.blocks = $event"
                @focus-block="openBlock"
              />
            </template>

            <!-- Photo, name, intro and the header layout -->
            <div v-else-if="activeTab === 'header'" class="space-y-8">
              <BioBlockHeader
                :is-active="true"
                :title="bioData.title"
                :bio="bioData.bio"
                :avatar-url="bioData.avatarUrl"
                :bio-page-id="existingBio?.id ?? ''"
                @update:title="updateBioData('title', $event)"
                @update:bio="updateBioData('bio', $event)"
                @update:avatar-url="updateBioData('avatarUrl', $event)"
              />
              <div>
                <p class="mb-3 text-sm font-medium text-ink">{{ t('theme.headerLayout.label') }}</p>
                <BioHeaderLayoutPicker
                  :model-value="bioData.themeConfig.header.layout"
                  :avatar-url="bioData.avatarUrl"
                  :title="bioData.title"
                  :bio="bioData.bio"
                  :social-links="socialLinks"
                  :banner-url="bioData.themeConfig.header.bannerUrl"
                  :bio-page-id="existingBio?.id ?? ''"
                  @update:model-value="handleUpdateTheme({ header: { ...bioData.themeConfig.header, layout: $event } })"
                  @update:banner-url="handleUpdateTheme({ header: { ...bioData.themeConfig.header, bannerUrl: $event } })"
                />
              </div>
            </div>

            <BioBlockTheme
              v-else
              standalone
              :theme-config="bioData.themeConfig"
              :avatar-url="bioData.avatarUrl"
              :title="bioData.title"
              :bio="bioData.bio"
              :social-links="socialLinks"
              :bio-page-id="existingBio?.id ?? ''"
              @update-theme="handleUpdateTheme"
            />

            <SiteEditorActions
              :tab="activeTab"
              :status="saveStatus"
              :saving="saving"
              :publishing="publishing"
              :publish-disabled="publishDisabled"
              :published="!!existingBio?.isPublished"
              :can-discard="!!existingBio?.isPublished && !!existingBio?.hasDraft"
              :discarding="discarding"
              @preview="previewOpen = true"
              @switch-tab="activeTab = $event"
              @publish="publishBio"
              @discard="discardDraft"
            />
          </div>

          <div class="hidden lg:block lg:col-span-5">
            <div class="sticky top-0 space-y-4">
              <BioPreviewPanel
                ref="previewPanelRef"
                :preview-data="bioData"
                :existing-bio="existingBio"
                :username="existingBio?.username || username"
                :active-block="activeBlock"
                @select-block="openBlock"
              />
            </div>
          </div>
        </div>

        <!-- 3D room Tab -->
        <div v-else-if="activeTab === 'room'" class="max-w-3xl space-y-4 pt-4">
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

          <SiteEditorActions
            :tab="activeTab"
            :status="saveStatus"
            :saving="saving"
            :publishing="publishing"
            :publish-disabled="publishDisabled"
            :published="!!existingBio?.isPublished"
            :can-discard="!!existingBio?.isPublished && !!existingBio?.hasDraft"
            :discarding="discarding"
            @preview="previewOpen = true"
            @switch-tab="activeTab = $event"
            @publish="publishBio"
            @discard="discardDraft"
          />
        </div>

        <!-- Settings Tab -->
        <div v-else-if="activeTab === 'settings'" class="pt-4 max-w-lg mx-auto space-y-6">
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

          <!-- Custom domain -->
          <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-default dark:border-white/10 p-6">
            <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.domain.heading') }}</h3>
            <p class="text-sm text-muted dark:text-neutral-400 mb-4">{{ t('dashboard.domain.text') }}</p>
            <SiteDomainSettings v-if="existingBio?.username" :username="existingBio.username" />
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

          <!-- Replacing everything with a template is a big step, so it sits last and warns -->
          <div class="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
            <h3 class="font-semibold text-amber-900 mb-1">{{ t('dashboard.editor.settings.templateHeading') }}</h3>
            <p class="text-sm text-amber-900/80 mb-4">
              {{ t('dashboard.editor.settings.templateText') }}
            </p>
            <BioTemplatePicker class="!grid-cols-2" @select="confirmApplyTemplate" />
          </div>
        </div>

        </div>

        <!-- Setup checklist popup; the sidebar card opens it -->
        <SiteOnboarding
          v-if="existingBio?.username"
          ref="onboardingRef"
          :bio-data="bioData"
          :username="existingBio.username"
          :published="!!existingBio.isPublished"
          @action="onOnboardingAction"
        />

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
                <BioPreview
                  :bio-data="bioData"
                  :username="existingBio?.username || username"
                  :active-block-id="activeBlock"
                  @select-block="(id: string) => { previewOpen = false; openBlock(id) }"
                />
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
import { localizeTemplateContent } from "~/data/templateCopyVi";
import { createDefaultRoom, normalizeRoom, type PageMode, type RoomConfig } from "~/types/room";
import { useBioBlock } from "~/composables/useBioBlock";

definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
  ssr: false,
});

const toast = useToast();
const { t, locale } = useI18n();
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

type EditorTab = "content" | "header" | "design" | "room" | "settings";
const activeTab = ref<EditorTab>("content");
const editorTabs = computed(() => [
  { value: "content", label: t("dashboard.editor.tabs.content"), icon: "i-lucide-layout-list" },
  { value: "header", label: t("dashboard.editor.tabs.header"), icon: "i-lucide-circle-user-round" },
  { value: "design", label: t("dashboard.editor.tabs.design"), icon: "i-lucide-palette" },
  { value: "room", label: t("dashboard.editor.tabs.room"), icon: "i-lucide-box" },
  { value: "settings", label: t("dashboard.editor.tabs.settings"), icon: "i-lucide-settings" },
]);

// Social icons on the page, for the header layout thumbnails
// Bar menus: switch site, and everything you do with the link
const siteMenu = computed(() => [
  userBioPages.value.map((page) => ({
    label: `perlink.to/${page.value}`,
    icon: page.value === routeUsername.value ? "i-lucide-check" : "i-lucide-globe",
    onSelect: () => onBioPageChange(page.value),
  })),
  [{ label: t("dashboard.sites.title"), icon: "i-lucide-layout-grid", to: "/dashboard/site" }],
]);

const shareMenu = computed(() => [
  [
    { label: t("dashboard.editor.copyUrl"), icon: "i-lucide-copy", onSelect: () => copyUrl() },
    { label: t("dashboard.editor.share"), icon: "i-lucide-share-2", onSelect: () => sharePage() },
    { label: t("dashboard.qr.open"), icon: "i-lucide-qr-code", onSelect: () => (qrOpen.value = true) },
  ],
  [
    { label: t("common.analytics"), icon: "i-lucide-chart-column", to: `/dashboard/site/${routeUsername.value}/analytics` },
    { label: t("dashboard.inbox.open"), icon: "i-lucide-inbox", to: `/dashboard/site/${routeUsername.value}/inbox` },
  ],
]);

const socialLinks = computed<SocialLink[]>(() =>
  bioData.blocks.flatMap((b) => (b.name === "social" ? b.data?.links ?? [] : [])),
);

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

const openBlock = (blockId: string) => {
  // The page's top has its own section
  if (blockId === "header") {
    activeTab.value = "header";
    return;
  }
  activeTab.value = "content";
  activeBlock.value = blockId;
  nextTick(() => {
    document.getElementById(`edit-${blockId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    previewPanelRef.value?.scrollToBlock(blockId);
  });
};

const onAddBlock = (blockType: string, atIndex?: number) => {
  const name = blockType as BioBlock["name"];
  // One-per-page blocks just open the existing one
  const existing = bioData.blocks.find((b) => b.name === name);
  if (existing && !isRepeatableBlock(name)) {
    openBlock(existing.id!);
    return;
  }
  const newBlock = {
    id: nanoid(8),
    name,
    index: 0,
    hidden: false,
    data: emptyBlockData(name),
  } as BioBlock;
  const sorted = [...bioData.blocks].sort((a, b) => (a.index || 0) - (b.index || 0));
  sorted.splice(atIndex ?? sorted.length, 0, newBlock);
  bioData.blocks = sorted.map((b, index) => ({ ...b, index }));
  openBlock(newBlock.id!);
};

// Onboarding checklist: each step takes the owner to the right place
const onboardingRef = ref<{ markShared: () => void } | null>(null);
const markShared = () => onboardingRef.value?.markShared();
const editorRef = ref<{ openBlockModal: () => void } | null>(null);
const onOnboardingAction = (step: string) => {
  if (step === "photo" || step === "bio") {
    openBlock("header");
  } else if (step === "contact") {
    activeTab.value = "content";
    nextTick(() => editorRef.value?.openBlockModal());
  } else if (step === "publish") {
    publishBio();
  } else if (step === "share") {
    sharePage();
  }
};

const sharePage = async () => {
  markShared();
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

const saveBio = async ({ silent = false }: { silent?: boolean } = {}) => {
  if (!existingBio.value?.username) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: t("dashboard.editor.noSiteToSave"),
      color: "error",
    });
    return;
  }

  saving.value = true;
  // What goes to the server; anything typed meanwhile stays "unsaved"
  const snapshot = currentSnapshot.value;
  try {
    // Live sites get a draft; visitors keep seeing the published version until "Publish"
    const response = await $fetch<{ bioPage: any }>(`/api/admin/bio/${existingBio.value.username}`, {
      method: "PUT" as const,
      body: { draft: true, ...JSON.parse(snapshot) },
    });
    markSaved(snapshot);
    existingBio.value = { ...existingBio.value, hasDraft: !!response.bioPage?.hasDraft };
    saveError.value = false;

    if (!silent) {
      toast.add({
        title: t("dashboard.toast.saved"),
        description: existingBio.value?.hasDraft ? t("dashboard.editor.draft.savedText") : t("dashboard.editor.savedText"),
        color: "success",
      });
    }
  } catch (error: any) {
    // Autosave retries on the next edit; one toast is enough until then
    if (!silent || !saveError.value) {
      toast.add({
        title: t("dashboard.toast.error"),
        description: error.data?.statusMessage || t("dashboard.editor.saveFailed"),
        color: "error",
      });
    }
    saveError.value = true;
  } finally {
    saving.value = false;
    // Edits made while saving go out next
    if (isDirty.value && !saveError.value) scheduleAutosave();
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
    // Save the edits, then publishing applies them to the live site
    await saveBio({ silent: true });

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
  markShared();
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
const isEmptyPage = computed(() => bioData.blocks.length === 0 && !bioData.bio);
const showTemplatePicker = computed(() => !templatePickerDismissed.value && isEmptyPage.value);

const applyTemplate = async (templateId: string) => {
  const template = PAGE_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return;
  // Vietnamese users get Vietnamese sample content and site language
  const content = localizeTemplateContent(template.build(), locale.value);
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
  // Show the result: back to the content tab, first block open
  activeTab.value = "content";
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
  await saveBio({ silent: true });
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
      // Came from the sidebar card on another page: show the checklist
      if (route.query.setup) {
        useSiteSetup().open.value = true;
        navigateTo({ query: { ...route.query, setup: undefined } }, { replace: true });
      }
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

// Throw away unpublished edits and reload the live version
const discarding = ref(false);
const discardDraft = async () => {
  if (!existingBio.value?.username) return;
  const ok = await confirmLeave({
    title: t("dashboard.editor.draft.discardTitle"),
    description: t("dashboard.editor.draft.discardText"),
    confirmLabel: t("dashboard.editor.draft.discard"),
  });
  if (!ok) return;
  discarding.value = true;
  try {
    await $fetch(`/api/admin/bio/${existingBio.value.username}/discard-draft`, { method: "POST" as const });
    savedSnapshot.value = null;
    await loadBio();
  } finally {
    discarding.value = false;
  }
};

// ---- Saving ----
// Edits are saved on their own shortly after they stop; a local backup covers
// the gap in case the tab closes first.
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
const saveError = ref(false);
const lastSavedAt = ref<Date | null>(null);

// After loading: the server copy is the saved state (keep any local backup)
function markSavedSnapshotOnly() {
  savedSnapshot.value = currentSnapshot.value;
}

function markSaved(snapshot: string) {
  savedSnapshot.value = snapshot;
  lastSavedAt.value = new Date();
  try {
    if (!isDirty.value) localStorage.removeItem(draftKey.value);
  } catch {}
}

const scheduleAutosave: () => void = useDebounceFn(() => {
  if (!isDirty.value || !existingBio.value?.username) return;
  // Mid-request: try again once it finishes
  if (saving.value) {
    scheduleAutosave();
    return;
  }
  saveBio({ silent: true });
}, 1500);

const backupDraft = useDebounceFn(() => {
  if (!isDirty.value) return;
  try {
    localStorage.setItem(draftKey.value, currentSnapshot.value);
  } catch {}
}, 1000);
watch(currentSnapshot, () => {
  backupDraft();
  if (savedSnapshot.value !== null) scheduleAutosave();
});

const saveStatus = computed<{ text: string; tone: "muted" | "pending" | "error" }>(() => {
  if (saving.value) return { text: t("dashboard.editor.status.saving"), tone: "pending" };
  if (saveError.value) return { text: t("dashboard.editor.status.error"), tone: "error" };
  if (isDirty.value) return { text: t("dashboard.editor.status.unsaved"), tone: "pending" };
  if (existingBio.value?.isPublished && existingBio.value?.hasDraft) {
    return { text: t("dashboard.editor.status.draftPending"), tone: "pending" };
  }
  if (lastSavedAt.value) {
    const time = lastSavedAt.value.toLocaleTimeString(locale.value === "vi" ? "vi-VN" : "en-GB", { hour: "2-digit", minute: "2-digit" });
    return { text: t("dashboard.editor.status.savedAt", { time }), tone: "muted" };
  }
  return { text: t("dashboard.editor.status.saved"), tone: "muted" };
});

// Nothing new to put live
const publishDisabled = computed(
  () => !!existingBio.value?.isPublished && !existingBio.value?.hasDraft && !isDirty.value && !saving.value,
);

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
  if (existingBio.value?.username) await saveBio({ silent: true });
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
