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
          <UDropdownMenu :items="siteMenu" :content="{ align: 'start', sideOffset: 8 }" :ui="{ content: 'w-72 max-h-[min(26rem,70dvh)]' }">
            <button type="button" class="flex min-w-0 items-center gap-2 rounded-full bg-white/70 py-1 pl-1 pr-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] backdrop-blur-xl transition-[background-color,transform] duration-150 hover:bg-white/90 active:scale-[0.98] data-[state=open]:bg-white">
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
      <!-- Loading: the editor's own shape, shimmering -->
      <div v-if="loading" class="lg:flex lg:gap-6" aria-busy="true">
        <div class="hidden w-16 shrink-0 flex-col items-center gap-3 pt-2 lg:flex">
          <div v-for="i in 5" :key="i" class="flex flex-col items-center gap-1.5">
            <USkeleton class="size-11 rounded-full" />
            <USkeleton class="h-2.5 w-10" />
          </div>
        </div>
        <div class="grid min-w-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div class="space-y-4 rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-6 lg:col-span-7">
            <USkeleton class="hidden h-6 w-32 lg:block" />
            <div class="flex items-center gap-3 p-2">
              <USkeleton class="size-14 rounded-full" />
              <div class="flex-1 space-y-2">
                <USkeleton class="h-4 w-40" />
                <USkeleton class="h-3 w-64 max-w-full" />
              </div>
            </div>
            <USkeleton v-for="i in 4" :key="i" class="h-12 w-full rounded-xl" />
            <USkeleton class="h-11 w-full rounded-xl" />
          </div>
          <div class="hidden flex-col items-center gap-4 lg:col-span-5 lg:flex">
            <USkeleton class="h-4 w-24 self-start" />
            <USkeleton class="h-[570px] w-[306px] rounded-[2rem]" />
          </div>
        </div>
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
      <!-- Made from a template in one click: still on its temporary address.
           Phones: icon and text, the button full width underneath -->
      <div
        v-if="step === 'edit' && tempAddress"
        class="mb-4 flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl bg-amber-50 p-3.5 ring-1 ring-amber-200"
      >
        <span class="flex size-9 shrink-0 items-center justify-center self-start rounded-full bg-amber-100 text-amber-700 sm:self-center">
          <UIcon name="i-lucide-link-2" class="size-[18px]" />
        </span>
        <div class="min-w-0 flex-1 basis-48">
          <p class="text-sm font-semibold text-amber-950">{{ t('dashboard.address.bannerTitle') }}</p>
          <p class="mt-0.5 text-[13px] leading-snug text-amber-900/80">
            <span class="break-all font-medium text-amber-950">perlink.to/{{ existingBio?.username }}</span>
            · {{ t('dashboard.address.bannerText') }}
          </p>
        </div>
        <UButton
          :label="t('dashboard.address.choose')"
          icon="i-lucide-pencil"
          class="w-full justify-center bg-amber-900 text-white hover:bg-amber-950 sm:w-auto"
          @click="openAddress(false)"
        />
      </div>

      <div v-if="step === 'edit' && !loading" class="pb-20 lg:flex lg:gap-6 lg:pb-0">
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
        <!-- Phone tabs: a solid bar whose dark pill follows the swipe between
             tabs (like Flutter's TabBar). The white labels are a copy clipped
             to the pill, so text turns white exactly where the pill is. The
             active tab is scrolled into view -->
        <div ref="tabBar" class="-mx-4 mb-2 overflow-x-auto px-4 py-1.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          <div ref="tabRow" class="relative flex w-max gap-0.5 rounded-full bg-paper p-1 shadow-sm ring-1 ring-line">
            <span class="absolute inset-y-1 rounded-full bg-ink shadow-sm" :style="pillStyle" aria-hidden="true" />
            <button
              v-for="tab in editorTabs"
              :key="tab.value"
              :data-tab="tab.value"
              type="button"
              class="relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft"
              :aria-current="activeTab === tab.value ? 'page' : undefined"
              @click="activeTab = tab.value as EditorTab"
            >
              <UIcon :name="tab.icon" class="size-4" />
              {{ tab.label }}
            </button>
            <div class="pointer-events-none absolute inset-0 flex gap-0.5 p-1 text-paper" :style="labelClipStyle" aria-hidden="true">
              <span v-for="tab in editorTabs" :key="tab.value" class="inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium">
                <UIcon :name="tab.icon" class="size-4" />
                {{ tab.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Phones: swipe sideways to change tab (useTabSwipe). The outer box
             clips the page while it slides, at the screen edges -->
        <div class="-mx-4 overflow-x-clip px-4 lg:mx-0 lg:overflow-x-visible lg:px-0">
        <div ref="swipeArea" class="relative touch-pan-y">
          <!-- Content, header and design, with the preview beside them. Each tab
               is a page; on phones the ones either side wait just off screen
               (paneMounted / paneClass) so a swipe shows them straight away -->
          <template v-for="pane in GRID_PANES" :key="pane">
          <div v-if="paneMounted(pane)" class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8" :class="paneClass(pane)" :style="paneStyle(pane)" :inert="pane !== activeTab || undefined">
            <div class="rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-6 lg:col-span-7">
              <h2 class="mb-5 hidden text-xl font-semibold text-ink lg:block">{{ editorTabs.find((tab) => tab.value === pane)?.label }}</h2>
              <template v-if="pane === 'content'">
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
                  :ref="(el: any) => (editorRef = el)"
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
              <div v-else-if="pane === 'header'" class="space-y-8">
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
                v-if="pane === activeTab"
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

            <div v-if="pane === activeTab" class="hidden lg:block lg:col-span-5">
              <div class="sticky top-0 space-y-4">
                <BioPreviewPanel
                  :ref="(el: any) => (previewPanelRef = el)"
                  :preview-data="bioData"
                  :existing-bio="existingBio"
                  :username="existingBio?.username || username"
                  :active-block="activeBlock"
                  @select-block="openBlock"
                />
              </div>
            </div>
          </div>
          </template>

          <!-- 3D room Tab -->
          <div v-if="paneMounted('room')" class="max-w-3xl space-y-4 pt-4" :class="paneClass('room')" :style="paneStyle('room')" :inert="activeTab !== 'room' || undefined">
            <div class="overflow-hidden rounded-3xl bg-paper ring-1 ring-line sm:flex">
              <div class="relative h-44 sm:h-auto sm:min-h-56 sm:w-1/2">
                <!-- The picture the 3D editor saves with each save or publish; until
                     there is one, the picture of the room's land -->
                <img :src="roomPicture" :alt="t('dashboard.editor.room.heading')" class="absolute inset-0 size-full object-cover" loading="lazy" decoding="async" @error="roomPictureFailed = true">
              </div>
              <div class="flex flex-col justify-center gap-3 p-4 sm:w-1/2 sm:p-5">
                <div>
                  <h3 class="font-semibold text-highlighted">{{ t('dashboard.editor.room.heading') }}</h3>
                  <p class="mt-1 text-sm text-muted">
                    {{ t('dashboard.editor.room.objects', { n: roomModel.objects.length }) }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <UButton icon="i-lucide-box" :label="t('dashboard.editor.room.openEditor')" size="sm" :loading="openingRoom === 'edit'" :disabled="!!openingRoom" @click="openRoomEditor()" />
                  <!-- Stands out: every room video posted brings people back.
                       Likes and hearts float up from it -->
                  <ReactionBurst>
                    <UButton
                      size="sm"
                      :loading="openingRoom === 'video'"
                      :disabled="!!openingRoom"
                      class="bg-gradient-to-r from-pink-500 via-red-500 to-amber-400 pl-1.5 font-semibold text-white shadow-[0_6px_20px_-6px_rgb(239_68_68/0.7)] hover:brightness-110 disabled:opacity-60"
                      @click="openRoomEditor('video')"
                    >
                      <template #leading>
                        <RoomSocialCycleIcon />
                      </template>
                      {{ t('dashboard.editor.room.shareVideo') }}
                    </UButton>
                  </ReactionBurst>
                </div>
              </div>
            </div>

            <div class="flex items-start justify-between gap-4 rounded-3xl bg-paper ring-1 ring-line p-4 sm:p-5">
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
              v-if="activeTab === 'room'"
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
          <div v-if="paneMounted('settings')" class="pt-4 max-w-lg mx-auto space-y-6" :class="paneClass('settings')" :style="paneStyle('settings')" :inert="activeTab !== 'settings' || undefined">
            <div class="rounded-3xl bg-paper ring-1 ring-line p-5 sm:p-6">
              <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.editor.settings.addressHeading') }}</h3>
              <p class="text-sm text-muted dark:text-neutral-400 mb-3">
                {{ t('dashboard.editor.settings.addressText') }}
              </p>
              <div class="flex items-center gap-2">
                <div class="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-default bg-muted px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                  <span class="text-sm text-muted dark:text-neutral-400">perlink.to/</span>
                  <span class="truncate text-sm font-medium text-highlighted dark:text-white">{{ existingBio?.username }}</span>
                </div>
                <UButton color="neutral" variant="outline" :label="t('dashboard.address.change')" @click="openAddress(false)" />
              </div>
            </div>

            <!-- Site language -->
            <div class="rounded-3xl bg-paper ring-1 ring-line p-5 sm:p-6">
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
            <div class="rounded-3xl bg-paper ring-1 ring-line p-5 sm:p-6">
              <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.domain.heading') }}</h3>
              <p class="text-sm text-muted dark:text-neutral-400 mb-4">{{ t('dashboard.domain.text') }}</p>
              <SiteDomainSettings v-if="existingBio?.username" :username="existingBio.username" />
            </div>

            <!-- Search & sharing -->
            <div class="rounded-3xl bg-paper ring-1 ring-line p-5 sm:p-6">
              <h3 class="font-semibold text-highlighted dark:text-white mb-1">{{ t('dashboard.seo.heading') }}</h3>
              <p class="text-sm text-muted dark:text-neutral-400 mb-4">{{ t('dashboard.seo.text') }}</p>
              <SiteSeoSettings
                :bio-data="bioData"
                :username="existingBio?.username || username"
                @update-theme="handleUpdateTheme"
              />
            </div>

            <!-- Share Button Toggle -->
            <div class="rounded-3xl bg-paper ring-1 ring-line p-5 sm:p-6">
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

            <div class="rounded-3xl bg-paper ring-1 ring-line p-5 sm:p-6">
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

        <SiteAddressDialog
          v-if="existingBio?.username"
          v-model:open="addressOpen"
          :current="existingBio.username"
          :temporary="tempAddress"
          :published="!!existingBio.isPublished"
          :confirm-text="publishAfterRename ? t('dashboard.address.saveAndPublish') : undefined"
          @renamed="onRenamed"
        />

        <SiteQrModal
          v-if="existingBio?.username"
          v-model:open="qrOpen"
          :username="existingBio.username"
          :title="bioData.title"
          :theme-config="bioData.themeConfig"
          :blocks="bioData.blocks"
        />

        <!-- Phone preview (mobile and tablet; desktop shows it beside the editor) -->
        <!-- The phone frame is the card: centred on a plain dim screen (no
             blur), close button in the top-right corner, tap around to close -->
        <UModal
          v-model:open="previewOpen"
          fullscreen
          :overlay="false"
          :title="t('common.preview')"
          :ui="{ content: 'rounded-none bg-black/70 ring-0 shadow-none backdrop-blur-none backdrop-saturate-100 dark:bg-black/70 dark:shadow-none' }"
        >
          <template #content>
            <div class="flex size-full items-center justify-center overflow-y-auto p-4" @click.self="previewOpen = false">
              <BioPreviewFrame>
                <BioPreview
                  :bio-data="bioData"
                  :username="existingBio?.username || username"
                  :active-block-id="activeBlock"
                  @select-block="(id: string) => { previewOpen = false; openBlock(id) }"
                />
              </BioPreviewFrame>
            </div>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="solid"
              size="lg"
              class="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] rounded-full bg-white text-black shadow-lg hover:bg-white/90"
              :aria-label="t('dashboard.editor.closePreview')"
              @click="previewOpen = false"
            />
          </template>
        </UModal>

        <!-- Floating shortcut to the 3D room tab (where the help button sits
             on other pages; help is still in the sidebar). Hidden on that tab -->
        <UButton
          v-if="existingBio?.username && !previewOpen && activeTab !== 'room'"
          icon="i-lucide-box"
          size="lg"
          :label="t('dashboard.editor.room.fab')"
          class="fixed bottom-20 right-5 z-50 bg-ink pr-4 text-paper shadow-[0_8px_24px_-6px_rgba(12,11,10,0.35)] hover:bg-ink/90 hover:scale-105 lg:bottom-5 print:hidden"
          @click="activeTab = 'room'"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { nanoid } from "nanoid";
import { useDebounceFn, useMediaQuery, useResizeObserver } from "@vueuse/core";
import { LANDS } from "~/utils/room/lands";
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
import type { BlockSeed } from "~/components/modals/BlockSelectionModal.vue";

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
const userBioPages = ref<{ label: string; value: string; title?: string; avatarUrl?: string }[]>([]);
const selectedBioUsername = ref<string>("");

// Load all user bio pages for selector
const loadUserBioPages = async () => {
  try {
    const response = await $fetch("/api/admin/bios");
    if (response.success && response.bioPages) {
      userBioPages.value = response.bioPages.map((bp: any) => ({
        label: bp.username,
        value: bp.username,
        title: bp.title || "",
        avatarUrl: bp.avatarUrl || "",
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
    // Same section on the other site
    navigateTo({ path: `/dashboard/site/${username}`, hash: activeTab.value === "content" ? "" : `#${activeTab.value}` });
  }
};

// Editor tabs
const previewOpen = ref(false);

const qrOpen = ref(false);

type EditorTab = "content" | "header" | "design" | "room" | "settings";
const EDITOR_TABS: EditorTab[] = ["content", "header", "design", "room", "settings"];

// The open section lives in the URL hash (…/site/james#header), so a reload
// or a shared link lands on the same section
const tabFromHash = (hash: string) => {
  const name = hash.replace(/^#\/?/, "") as EditorTab;
  return EDITOR_TABS.includes(name) ? name : "content";
};
const activeTab = ref<EditorTab>(tabFromHash(useRoute().hash));

// Keep the active phone tab in view, centred when it can be (only the tab bar scrolls)
const tabBar = ref<HTMLElement | null>(null);
watch([activeTab, tabBar], async () => {
  await nextTick();
  const bar = tabBar.value;
  const tab = bar?.querySelector<HTMLElement>(`[data-tab="${activeTab.value}"]`);
  if (!bar || !tab) return;
  const left = tab.getBoundingClientRect().left - bar.getBoundingClientRect().left + bar.scrollLeft;
  bar.scrollTo({ left: left - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
});
watch(activeTab, (tab) => {
  const hash = tab === "content" ? "" : `#${tab}`;
  if (location.hash !== hash) history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`);
});
// Phones and tablets swipe between the tabs, in the order of the tab bar,
// like pages side by side: the tabs either side of this one are kept ready
// just off screen (outside the page's padding) so they show while swiping
const swipeArea = ref<HTMLElement | null>(null);
const swipeable = useMediaQuery("(max-width: 1023px)");
const PANE_GAP = 32;
const swipe = useTabSwipe(swipeArea, computed(() => EDITOR_TABS), activeTab, swipeable, PANE_GAP);

// The tab bar's pill: between the active tab and the one the swipe is
// heading to, as far along as the swipe is
const tabRow = ref<HTMLElement | null>(null);
const tabRects = ref<{ left: number; width: number }[]>([]);
const tabRowWidth = ref(0);
function measureTabs() {
  const row = tabRow.value;
  if (!row) return;
  tabRowWidth.value = row.offsetWidth;
  tabRects.value = [...row.querySelectorAll<HTMLElement>("button[data-tab]")].map((b) => ({ left: b.offsetLeft, width: b.offsetWidth }));
}
useResizeObserver(tabRow, measureTabs);
const pill = computed(() => {
  const i = EDITOR_TABS.indexOf(activeTab.value);
  const from = tabRects.value[i];
  if (!from) return null;
  const p = swipe.progress.value;
  const to = tabRects.value[i + (p > 0 ? 1 : -1)];
  const k = to ? Math.min(Math.abs(p), 1) : 0;
  return { left: from.left + ((to?.left ?? 0) - from.left) * k, width: from.width + ((to?.width ?? 0) - from.width) * k };
});
// Eases with the page; follows the finger exactly while dragging
const pillTransition = computed(() =>
  swipe.progress.value !== 0 && !swipe.easing.value ? "none" : `left ${swipe.transition}, width ${swipe.transition}, clip-path ${swipe.transition}`,
);
const pillStyle = computed(() =>
  pill.value ? { left: `${pill.value.left}px`, width: `${pill.value.width}px`, transition: pillTransition.value } : { display: "none" },
);
const labelClipStyle = computed(() =>
  pill.value
    ? { clipPath: `inset(4px ${tabRowWidth.value - pill.value.left - pill.value.width}px 4px ${pill.value.left}px round 999px)`, transition: pillTransition.value }
    : { display: "none" },
);
const GRID_PANES = ["content", "header", "design"] as const;
const paneOffset = (pane: EditorTab) => EDITOR_TABS.indexOf(pane) - EDITOR_TABS.indexOf(activeTab.value);
const paneMounted = (pane: EditorTab) => pane === activeTab.value || (swipeable.value && Math.abs(paneOffset(pane)) === 1);
// Off-screen tabs don't add to the page's height or catch taps
const paneClass = (pane: EditorTab) => (pane === activeTab.value ? "" : "absolute inset-x-0 top-0 h-full overflow-hidden");
const paneStyle = (pane: EditorTab) =>
  pane === activeTab.value ? undefined : { transform: `translateX(calc(${paneOffset(pane)} * (100% + ${PANE_GAP}px)))` };
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
  [
    { type: "label" as const, label: t("dashboard.editor.yourSites") },
    ...userBioPages.value.map((page) => {
      const current = page.value === routeUsername.value;
      // This editor's site shows its live edits; the others what the list returned
      const title = (current ? bioData.title : page.title) || page.value;
      const src = (current ? bioData.avatarUrl : page.avatarUrl) || undefined;
      return {
        label: title,
        description: `perlink.to/${page.value}`,
        avatar: { src, alt: title, size: "md" as const, ui: { root: "bg-paper ring-1 ring-black/[0.06]" } },
        // The open site gets a tick, like the current choice in an iOS menu
        type: "checkbox" as const,
        checked: current,
        onSelect: () => onBioPageChange(page.value),
      };
    }),
  ],
  [
    { label: t("nav.createSite"), icon: "i-lucide-plus", to: "/dashboard/create" },
    { label: t("dashboard.sites.title"), icon: "i-lucide-layout-grid", to: "/dashboard/site" },
  ],
]);

const shareMenu = computed(() => [
  [
    // Which link is being shared, and whether visitors can open it yet
    {
      type: "label" as const,
      label: `perlink.to/${routeUsername.value}`,
      icon: existingBio.value?.isPublished ? "i-lucide-globe" : "i-lucide-eye-off",
      description: existingBio.value?.isPublished ? undefined : t("dashboard.editor.notLiveYet"),
    },
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

const previewPanelRef = ref<{ scrollToBlock: (blockId: string) => void; snapshot: (username: string) => Promise<unknown> } | null>(null);

// ---- Thumbnail ----
// The phone preview is photographed for the site's card in "My sites": a
// while after edits settle, right after publishing, and once for sites that
// don't have a picture yet. At most about once a minute.
const SNAPSHOT_DELAY = 10_000;
const SNAPSHOT_MIN_GAP = 60_000;
let lastSnapshotAt = 0;
let snapshotTimer: ReturnType<typeof setTimeout> | null = null;

async function takeSnapshot() {
  const username = existingBio.value?.username;
  if (!username || !previewPanelRef.value) return;
  try {
    const result = await previewPanelRef.value.snapshot(username);
    if (result) lastSnapshotAt = Date.now();
  } catch (error) {
    // A missing picture only means the card renders the page instead
    console.warn("[editor] snapshot failed", error);
  }
}

function scheduleSnapshot(delay = SNAPSHOT_DELAY) {
  if (snapshotTimer) clearTimeout(snapshotTimer);
  const wait = Math.max(delay, lastSnapshotAt + SNAPSHOT_MIN_GAP - Date.now());
  snapshotTimer = setTimeout(takeSnapshot, wait);
}
onBeforeUnmount(() => snapshotTimer && clearTimeout(snapshotTimer));

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

// What a pasted link fills in on a new block
function seededData(name: BioBlock["name"], seed?: BlockSeed): BioBlock["data"] {
  const data = emptyBlockData(name) as any;
  if (!seed?.url) return data;
  if (name === "video") data.url = seed.url;
  if (name === "contact") data.mapUrl = seed.url;
  if (name === "products") data.items = [{ id: nanoid(6), name: "", url: seed.url }];
  if (name === "social") data.links = [{ id: nanoid(6), provider: seed.provider, url: seed.url, index: 0 }];
  if (name === "links") {
    let title = seed.url;
    try { title = new URL(seed.url).hostname.replace(/^www\./, ""); } catch {}
    data.items = [{ id: nanoid(6), title, url: seed.url, icon: "link", order: 0, isActive: true }];
  }
  return data;
}

const onAddBlock = (blockType: string, atIndex?: number, seed?: BlockSeed) => {
  const name = blockType as BioBlock["name"];
  const existing = bioData.blocks.find((b) => b.name === name);
  // A pasted social link joins the page's social icons
  if (existing && name === "social" && seed?.url) {
    const links = [...((existing.data as any).links ?? [])];
    if (!links.some((l: any) => l.provider === seed.provider)) {
      links.push({ id: nanoid(6), provider: seed.provider, url: seed.url, index: links.length });
    }
    bioData.blocks = bioData.blocks.map((b) => (b.id === existing.id ? ({ ...b, data: { ...(b.data as object), links } } as BioBlock) : b));
    openBlock(existing.id!);
    return;
  }
  // One-per-page blocks just open the existing one
  if (existing && !isRepeatableBlock(name)) {
    openBlock(existing.id!);
    return;
  }
  const newBlock = {
    id: nanoid(8),
    name,
    index: 0,
    hidden: false,
    data: seededData(name, seed),
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
    scheduleSnapshot();

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

// ---- Address ----
// Sites made from a template in one click start on a temporary address
const tempAddress = computed(() => !!(bioData.themeConfig as any).tempAddress);
const addressOpen = ref(false);
const publishAfterRename = ref(false);

const upgradePrompt = useUpgradePrompt();

async function openAddress(thenPublish: boolean) {
  publishAfterRename.value = thenPublish;
  // Edits go to the current address before it changes
  if (isDirty.value) await saveBio({ silent: true });
  addressOpen.value = true;
}
watch(addressOpen, (isOpen) => {
  if (!isOpen && !publishing.value) publishAfterRename.value = false;
});

async function onRenamed(username: string) {
  savedSnapshot.value = currentSnapshot.value;
  if (publishAfterRename.value) {
    publishing.value = true;
    try {
      await $fetch(`/api/admin/bio/${username}/publish`, { method: "POST" as const });
      toast.add({ title: t("dashboard.toast.published"), description: t("dashboard.editor.publishedText", { username }), color: "success" });
    } catch (error: any) {
      // The address change went through either way, so carry on to it
      if (!upgradePrompt.fromError(error)) {
        toast.add({ title: t("dashboard.toast.error"), description: error?.data?.statusMessage || t("dashboard.editor.publishFailed"), color: "error" });
      }
    } finally {
      publishing.value = false;
    }
  } else {
    toast.add({ title: t("dashboard.address.saved"), description: `perlink.to/${username}`, color: "success" });
  }
  // The editor reopens on the new address, same section
  await navigateTo({ path: `/dashboard/site/${username}`, hash: activeTab.value === "content" ? "" : `#${activeTab.value}` }, { replace: true });
}

const publishBio = async () => {
  // A real address first
  if (tempAddress.value) {
    openAddress(true);
    return;
  }
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
    // The card should show what just went live
    if (snapshotTimer) clearTimeout(snapshotTimer);
    nextTick(takeSnapshot);

    toast.add({
      title: t("dashboard.toast.published"),
      description: t("dashboard.editor.publishedText", { username: existingBio.value.username }),
      color: "success",
    });
  } catch (error: any) {
    if (upgradePrompt.fromError(error)) return;
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

const openingRoom = ref<"edit" | "video" | null>(null);

// Save the page first so the full-screen editor starts from the latest data.
// "video" opens it straight into the room video dialog
// The saved picture of the room, or its land's while there's none (or it
// can't be loaded)
const roomPictureFailed = ref(false);
const roomPicture = computed(() =>
  (!roomPictureFailed.value && existingBio.value?.roomThumbnailUrl) ||
  (LANDS.find((land) => land.id === (roomModel.value.land ?? "island")) ?? LANDS[0])!.thumbnail,
);
watch(() => existingBio.value?.roomThumbnailUrl, () => (roomPictureFailed.value = false));

const openRoomEditor = async (mode: "edit" | "video" = "edit") => {
  if (!existingBio.value?.username) return;
  openingRoom.value = mode;
  // The room can be furnished before it's switched on for visitors
  if (!bioData.themeConfig.room) bioData.themeConfig = { ...bioData.themeConfig, room: createDefaultRoom() };
  await saveBio({ silent: true });
  openingRoom.value = null;
  navigateTo({ path: `/dashboard/room/${existingBio.value.username}`, query: mode === "video" ? { record: "1" } : {} });
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
      loadedUsername.value = response.bioPage.username;
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
        // Keys the defaults don't know (presetId, tempAddress, ...) are kept too
      }, { ...(savedTheme as object) } as ThemeConfig);
      // 3D room settings are not part of DEFAULT_THEME, so copy them explicitly
      bioData.themeConfig.pageMode = (savedTheme as any).pageMode === "3d" ? "3d" : "2d";
      if ((savedTheme as any).room) {
        bioData.themeConfig.room = normalizeRoom((savedTheme as any).room);
      }

      step.value = "edit";
      await nextTick();
      markSavedSnapshotOnly();
      // Sites from before thumbnails get their first picture once the preview has drawn
      if (!response.bioPage.thumbnailUrl) scheduleSnapshot(3000);
      // Came from the sidebar card on another page: show the checklist
      if (route.query.setup) {
        useSiteSetup().open.value = true;
        navigateTo({ query: { ...route.query, setup: undefined } }, { replace: true });
      }
      restoreLocalBackup(response.bioPage.draftUpdatedAt || response.bioPage.updatedAt);
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
// Keyed by the site this editor loaded, not the URL: when switching sites the
// URL changes before this page closes, and its backup must not land on the next site
const loadedUsername = ref("");
const draftKey = computed(() => `perlink:draft:${loadedUsername.value}`);
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
  if (!isDirty.value || !loadedUsername.value) return;
  try {
    localStorage.setItem(draftKey.value, JSON.stringify({ v: 2, savedAt: Date.now(), content: currentSnapshot.value }));
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

// Edits that never reached the server (tab closed within the autosave delay)
// come back on their own; older backups are dropped without asking
function restoreLocalBackup(serverTime: string | null | undefined) {
  let backup: { v?: number; savedAt?: number; content?: string } | null = null;
  try {
    backup = JSON.parse(localStorage.getItem(draftKey.value) || "null");
  } catch {}
  const forget = () => {
    try {
      localStorage.removeItem(draftKey.value);
    } catch {}
  };
  if (!backup || backup.v !== 2 || !backup.content || backup.content === savedSnapshot.value) return forget();
  const serverAt = serverTime ? Date.parse(serverTime.includes("T") ? serverTime : `${serverTime.replace(" ", "T")}Z`) : 0;
  if (!backup.savedAt || (serverAt && backup.savedAt <= serverAt)) return forget();

  const serverVersion = savedSnapshot.value;
  try {
    Object.assign(bioData, JSON.parse(backup.content));
  } catch {
    return forget();
  }
  const time = new Date(backup.savedAt).toLocaleTimeString(locale.value === "vi" ? "vi-VN" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  toast.add({
    title: t("dashboard.editor.unsaved.restoredTitle"),
    description: t("dashboard.editor.unsaved.restoredText", { site: `perlink.to/${loadedUsername.value}`, time }),
    actions: [
      {
        label: t("dashboard.editor.unsaved.undo"),
        color: "neutral",
        variant: "outline",
        onClick: () => {
          if (serverVersion) Object.assign(bioData, JSON.parse(serverVersion));
          forget();
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
