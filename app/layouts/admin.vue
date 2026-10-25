<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      v-model:collapsed="collapsed"
      collapsible
      resizable
      :min-size="16"
      :max-size="16"
      :default-size="16"
      :ui="{
        root: 'bg-paper border-r border-line',
        header: 'h-16',
        footer: 'border-t border-line',
        content: 'max-w-72',
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" :aria-label="collapsed ? 'Perlink home' : undefined" class="flex items-center" :class="collapsed && 'w-full justify-center'">
          <AppLogo :variant="collapsed ? 'mark' : 'full'" :size="24" />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <NuxtLink
          to="/dashboard/create"
          class="flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          :class="collapsed ? 'mx-auto w-10' : 'w-full'"
          :aria-label="collapsed ? t('nav.createSite') : undefined"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          <span v-if="!collapsed">{{ t('nav.createSite') }}</span>
        </NuxtLink>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="navigationLinks"
          orientation="vertical"
          class="mt-3"
          :ui="{
            link: 'min-h-11 gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink-soft before:rounded-xl hover:text-ink hover:before:bg-sand/60 data-active:font-medium data-active:text-ink data-active:before:bg-sand',
            linkLeadingIcon: 'size-5 text-ink-muted group-data-active:text-ink',
          }"
        />

        <!-- Site setup progress, while a site editor is open -->
        <SiteSetupCard :collapsed="collapsed" />

        <!-- Upgrade (gives way to the setup card) -->
        <NuxtLink
          v-if="!collapsed && !setup?.visible.value"
          to="/dashboard/upgrade"
          class="group mt-4 block rounded-2xl bg-sand p-4 transition-colors hover:bg-sand-strong"
        >
          <div class="flex items-center gap-2">
            <MarketingMkOrb palette="sunset" :size="18" still />
            <p class="text-sm font-medium text-ink">{{ t('nav.proTitle') }}</p>
          </div>
          <p class="mt-1.5 text-xs leading-relaxed text-ink-muted">{{ t('nav.proText') }}</p>
          <p class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink">
            {{ t('nav.seePlans') }}
            <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </p>
        </NuxtLink>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="supportLinks"
          orientation="vertical"
          class="mt-auto"
          :ui="{
            link: 'min-h-11 gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink-soft before:rounded-xl hover:text-ink hover:before:bg-sand/60 data-active:font-medium data-active:text-ink data-active:before:bg-sand',
            linkLeadingIcon: 'size-5 text-ink-muted',
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <UDashboardSearch :groups="groups" />

    <slot />
    <NotificationsSlideover />
    <HelpCenter />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { User } from "#auth-utils";
import type { NavigationMenuItem } from "@nuxt/ui";

const { user: sessionUser, loggedIn } = useUserSession();
const user = sessionUser as Ref<User | null>;
const open = ref(false);

// Focus mode: the site editor gets the room, so the menu folds to icons
// there and comes back as it was elsewhere. The sidebar saves its state, so
// a flag remembers that the fold was ours: a reload outside the editor (or
// leaving it with a full page load) unfolds it again.
const route = useRoute();
const collapsed = ref(false);
const isEditor = computed(() => /^\/dashboard\/site\/[^/]+\/?$/.test(route.path));
const AUTO_FOLD_KEY = "perlink:sidebar-auto-folded";

function fold() {
  if (collapsed.value) return;
  collapsed.value = true;
  try { localStorage.setItem(AUTO_FOLD_KEY, "1"); } catch {}
}
function unfold() {
  let ours = false;
  try { ours = localStorage.getItem(AUTO_FOLD_KEY) === "1"; localStorage.removeItem(AUTO_FOLD_KEY); } catch {}
  if (ours) collapsed.value = false;
}

watch(isEditor, (editing, wasEditing) => {
  if (editing && !wasEditing) fold();
  else if (!editing && wasEditing) unfold();
});
// The sidebar restores its saved state on mount, so decide after that
onMounted(() => nextTick(() => (isEditor.value ? fold() : unfold())));

const helpOpen = useHelpCenter();
const { current: setup } = useSiteSetup();

const { t } = useI18n();

const navigationLinks = computed<NavigationMenuItem[]>(() => [
  { label: t("nav.home"), icon: "i-lucide-house", to: "/dashboard", exact: true },
  { label: t("nav.sites"), icon: "i-lucide-layout-template", to: "/dashboard/site" },
  { label: t("nav.settings"), icon: "i-lucide-settings", to: "/dashboard/settings" },
]);

const supportLinks = computed<NavigationMenuItem[]>(() => [
  { label: t("nav.help"), icon: "i-lucide-circle-help", onSelect: () => (helpOpen.value = true) },
  { label: t("nav.feedback"), icon: "i-lucide-message-square-heart", to: "/dashboard/feedback" },
]);

const groups = computed(() => [
  {
    id: "links",
    label: t("nav.home"),
    items: navigationLinks.value as any,
  },
]);

</script>
