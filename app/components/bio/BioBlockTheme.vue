<template>
  <div :class="standalone ? '' : 'bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden'">
    <BioBlockItemHeader
      v-if="!standalone"
      container
      :is-active="isActive"
      :title="t('theme.panelTitle')"
      icon="i-lucide-palette"
      @toggle="$emit('toggle')"
    >
      <!-- <template #actions>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-more-vertical"
        />
      </template> -->
    </BioBlockItemHeader>

    <div
      v-if="isActive || standalone"
      class="space-y-5"
      :class="standalone ? '' : 'p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03]'"
    >
      <!-- Mode toggle -->
      <UTabs
        :items="modeTabs"
        :model-value="editMode"
        color="neutral"
        variant="pill"
        class="w-full"
        size="sm"
        @update:model-value="editMode = $event as 'presets' | 'custom'"
      >
        <template #content="{ item }">
          <!-- Preset picker -->
          <template v-if="editMode === 'presets'">
            <BioThemePresetPicker
              :selected-id="selectedPresetId"
              @select="onPresetSelect"
            />
            <div class="mt-6">
              <label class="text-sm font-medium text-gray-700 dark:text-neutral-200 mb-2 block"
                >{{ t('theme.headerLayout.label') }}</label
              >
              <BioHeaderLayoutPicker
                :model-value="themeConfig.header.layout"
                :avatar-url="avatarUrl"
                :title="title"
                :bio="bio"
                :social-links="socialLinks"
                :banner-url="themeConfig.header.bannerUrl"
                :bio-page-id="bioPageId"
                @update:model-value="emitHeader('layout', $event)"
                @update:banner-url="emitHeader('bannerUrl', $event)"
              />
            </div>
          </template>

          <!-- Custom editor, grouped so it doesn't read as one long form -->
          <template v-if="editMode === 'custom'">
            <UAccordion
              v-model="openSections"
              type="multiple"
              :items="customSections"
              :ui="{ item: 'border-b border-default last:border-b-0 dark:border-white/10', trigger: 'py-3 text-sm', body: 'pb-4 pt-0' }"
            >
              <template #body="{ item }">
                <!-- Colours -->
                <div v-if="item.value === 'colors'" class="space-y-4">
                  <BioColorPicker
                    :primary="themeConfig.colors.primary"
                    :secondary="themeConfig.colors.secondary"
                    :third="themeConfig.colors.third"
                    @select="
                      (p) =>
                        emit('updateTheme', {
                          colors: { primary: p.primary, secondary: p.secondary, third: p.third },
                          card: { ...props.themeConfig.card, textColor: p.textColor },
                          button: { ...props.themeConfig.button, textColor: p.textColor },
                        })
                    "
                  />
                  <UFormField :label="t('theme.colors.accent')" :help="t('theme.colors.accentHelp')">
                    <div class="flex items-center gap-2">
                      <UPopover>
                        <UButton color="neutral" variant="outline" class="shrink-0 overflow-hidden rounded-full p-0" :aria-label="t('theme.colors.accent')">
                          <span class="size-8 rounded-full border-2 border-white shadow-sm" :style="{ backgroundColor: themeConfig.colors.primary || '#000000' }" />
                        </UButton>
                        <template #content>
                          <UColorPicker :model-value="themeConfig.colors.primary || '#000000'" class="p-2" @update:model-value="emitColors('primary', $event || '#000000')" />
                        </template>
                      </UPopover>
                      <UInput :model-value="themeConfig.colors.primary" class="w-32 font-mono" @update:model-value="emitColors('primary', $event as string)" />
                    </div>
                  </UFormField>
                  <div>
                    <p class="mb-2 text-sm font-medium text-default">{{ t('theme.background.title') }}</p>
                    <BioBackgroundPicker :background="themeConfig.background" @select="(v) => emit('updateTheme', { background: v })" />
                  </div>
                </div>

                <!-- Text -->
                <div v-else-if="item.value === 'text'" class="space-y-5">
                  <UFormField :label="t('theme.text.general')" :help="t('theme.text.generalHelp')">
                    <FontSelect :model-value="themeConfig.typography.paragraphFont" :font-options="paragraphFontOptions" @update:model-value="onGenericParagraphFontChange($event)" />
                  </UFormField>

                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t('theme.header.title') }}</p>
                    <div class="grid grid-cols-2 gap-3">
                      <UFormField :label="t('theme.fields.fontFamily')" class="col-span-2">
                        <FontSelect :model-value="themeConfig.header.fontFamily || themeConfig.typography.nameFont || 'system-ui'" :font-options="nameFontOptions" @update:model-value="onNameFontChange($event)" />
                      </UFormField>
                      <UFormField :label="t('theme.fields.fontSize')">
                        <USelect :model-value="themeConfig.header.fontSize || '1.5rem'" :items="headerFontSizeOptions" class="w-full" @update:model-value="emitHeader('fontSize', $event)" />
                      </UFormField>
                      <UFormField :label="t('theme.fields.weight')">
                        <USelect :model-value="themeConfig.header.fontWeight || '700'" :items="fontWeightOptions" class="w-full" @update:model-value="emitHeader('fontWeight', $event)" />
                      </UFormField>
                      <UFormField :label="t('theme.fields.letterSpacing')">
                        <USelect :model-value="themeConfig.header.letterSpacing || 'normal'" :items="letterSpacingOptions" class="w-full" @update:model-value="emitHeader('letterSpacing', $event === 'normal' ? undefined : $event)" />
                      </UFormField>
                      <UFormField :label="t('theme.fields.textColor')">
                        <BioColorField :model-value="themeConfig.header.textColor" :fallback="themeConfig.typography.textColor || '#334155'" :label="t('theme.fields.textColor')" :placeholder="t('common.auto')" @update:model-value="emitHeader('textColor', $event)" />
                      </UFormField>
                    </div>
                  </div>

                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t('theme.bio.title') }}</p>
                    <div class="grid grid-cols-2 gap-3">
                      <UFormField :label="t('theme.fields.fontFamily')" class="col-span-2">
                        <FontSelect :model-value="themeConfig.typography.bioFontFamily || themeConfig.typography.paragraphFont || 'system-ui'" :font-options="paragraphFontOptions" @update:model-value="onParagraphFontChange($event)" />
                      </UFormField>
                      <UFormField :label="t('theme.fields.fontSize')">
                        <USelect :model-value="themeConfig.typography.bioFontSize || '0.875rem'" :items="bioFontSizeOptions" class="w-full" @update:model-value="emitTypography('bioFontSize', $event)" />
                      </UFormField>
                      <UFormField :label="t('theme.fields.textColor')">
                        <BioColorField :model-value="themeConfig.typography.bioTextColor" :fallback="themeConfig.typography.textColor || '#334155'" :label="t('theme.fields.textColor')" :placeholder="t('common.auto')" @update:model-value="emitTypography('bioTextColor', $event)" />
                      </UFormField>
                    </div>
                  </div>

                  <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t('theme.page.blockTitles') }}</p>
                    <div class="grid grid-cols-2 gap-3">
                      <UFormField :label="t('theme.fields.fontFamily')" class="col-span-2 sm:col-span-1">
                        <FontSelect :model-value="themeConfig.typography.headingFont || 'system-ui'" :font-options="headingFontOptions" @update:model-value="onHeadingFontChange($event)" />
                      </UFormField>
                      <UFormField :label="t('theme.text.align')" class="col-span-2 sm:col-span-1">
                        <USelect :model-value="themeConfig.page?.titleAlign || 'center'" :items="titleAlignOptions" class="w-full" @update:model-value="emitPage('titleAlign', $event)" />
                      </UFormField>
                    </div>
                  </div>

                  <UFormField :label="t('theme.text.pageColor')" :help="t('theme.text.pageColorHelp')">
                    <BioColorField :model-value="themeConfig.typography.textColor" fallback="#334155" :label="t('theme.page.textColorAria')" :placeholder="t('common.auto')" @update:model-value="emitTypography('textColor', $event)" />
                  </UFormField>
                </div>

                <!-- Cards & buttons -->
                <div v-else-if="item.value === 'cards'" class="space-y-4">
                  <UFormField :label="t('theme.card.style')">
                    <BioVisualPicker :model-value="themeConfig.card.style || 'filled'" :options="cardStyleOptions" @update:model-value="emitCard('style', $event)">
                      <template #preview="{ value }">
                        <span class="flex h-5 w-full items-center justify-center rounded text-[8px] font-semibold" :style="cardPreviewStyle(value)">Aa</span>
                      </template>
                    </BioVisualPicker>
                  </UFormField>
                  <UFormField :label="t('theme.card.cornerRadius')">
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="r in radiusOptions"
                        :key="r.value"
                        type="button"
                        class="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition"
                        :class="activeRadius === r.value ? 'border-inverted text-highlighted ring-1 ring-inverted' : 'border-default text-muted hover:border-accented dark:border-white/10'"
                        @click="emitCard('cornerRadius', r.value)"
                      >
                        <span class="size-3.5 border-2 border-current" :style="{ borderRadius: `${Math.min(r.value, 7)}px`, borderBottomColor: 'transparent', borderLeftColor: 'transparent' }" />
                        {{ r.label }}
                      </button>
                    </div>
                  </UFormField>
                  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <UFormField :label="t('theme.card.color')">
                      <BioColorField :model-value="themeConfig.card.backgroundColor" :fallback="themeConfig.colors.primary" :label="t('theme.card.colorAria')" :placeholder="t('common.auto')" @update:model-value="emitCard('backgroundColor', $event)" />
                    </UFormField>
                    <UFormField :label="t('theme.fields.textColor')">
                      <BioColorField :model-value="themeConfig.card.textColor" fallback="#ffffff" :label="t('theme.fields.textColor')" :placeholder="t('common.auto')" @update:model-value="emitCard('textColor', $event)" />
                    </UFormField>
                    <UFormField :label="t('theme.card.borderColor')">
                      <BioColorField :model-value="themeConfig.card.outlineColor" :fallback="themeConfig.colors.primary" :label="t('theme.card.borderColorAria')" :placeholder="t('common.auto')" @update:model-value="emitCard('outlineColor', $event)" />
                    </UFormField>
                    <UFormField :label="t('theme.card.shadow')">
                      <USelect :model-value="themeConfig.card.shadow || 'none'" :items="shadowOptions" class="w-full" @update:model-value="emitCard('shadow', $event as string)" />
                    </UFormField>
                    <UFormField :label="t('theme.card.backdropBlur')">
                      <USelect :model-value="themeConfig.card.backdropBlur || 'none'" :items="backdropBlurOptions" class="w-full" @update:model-value="emitCard('backdropBlur', $event as string)" />
                    </UFormField>
                  </div>
                </div>

                <!-- Layout -->
                <div v-else-if="item.value === 'layout'" class="space-y-4">
                  <UFormField :label="t('theme.linkLayout.title')">
                    <BioVisualPicker :model-value="themeConfig.link.layout" :options="linkLayoutOptions" @update:model-value="emitLink('layout', $event)">
                      <template #preview="{ value }">
                        <span
                          class="flex w-full gap-1 rounded bg-white p-1 shadow-sm dark:bg-white/10"
                          :class="value === 'vertical' ? 'flex-col' : value === 'horizontal-right' ? 'flex-row-reverse items-center' : value === 'centered' ? 'items-center justify-center py-2' : 'items-center'"
                        >
                          <span v-if="value !== 'centered'" class="shrink-0 rounded-sm bg-gray-300 dark:bg-white/25" :class="value === 'vertical' ? 'h-5 w-full' : 'size-5'" />
                          <span class="flex min-w-0 flex-1 flex-col gap-0.5" :class="value === 'centered' ? 'items-center' : ''">
                            <span class="h-1 w-3/4 rounded-full bg-gray-400 dark:bg-white/40" />
                            <span class="h-1 w-1/2 rounded-full bg-gray-300 dark:bg-white/20" />
                          </span>
                        </span>
                      </template>
                    </BioVisualPicker>
                  </UFormField>
                  <UFormField :label="t('theme.avatar.title')">
                    <BioVisualPicker :model-value="themeConfig.avatar.shape" :options="avatarShapeOptions" :cols="3" @update:model-value="emitAvatar('shape', $event)">
                      <template #preview="{ value }">
                        <img v-if="avatarUrl" :src="avatarUrl" alt="" class="size-10 object-cover" :style="{ borderRadius: avatarRadius(value) }">
                        <span v-else class="flex size-10 items-center justify-center bg-gray-200 text-gray-400 dark:bg-white/10" :style="{ borderRadius: avatarRadius(value) }">
                          <UIcon name="i-lucide-user" class="size-5" />
                        </span>
                      </template>
                    </BioVisualPicker>
                  </UFormField>
                  <UFormField :label="t('theme.page.socialIcons')">
                    <BioVisualPicker :model-value="themeConfig.social?.style || 'soft'" :options="socialStyleOptions" @update:model-value="emit('updateTheme', { social: { style: $event as any } })">
                      <template #preview="{ value }">
                        <span class="flex gap-1">
                          <span v-for="i in 3" :key="i" class="flex size-5 items-center justify-center rounded-full" :style="socialPreviewStyle(value)">
                            <span class="size-2 rounded-[2px]" :style="{ backgroundColor: value === 'filled' ? '#fff' : accent }" />
                          </span>
                        </span>
                      </template>
                    </BioVisualPicker>
                  </UFormField>
                  <UFormField :label="t('theme.page.blockSpacing')">
                    <BioVisualPicker :model-value="themeConfig.page?.blockGap || 'normal'" :options="blockGapOptions" :cols="3" @update:model-value="emitPage('blockGap', $event)">
                      <template #preview="{ value }">
                        <span class="flex w-3/4 flex-col" :class="value === 'compact' ? 'gap-0.5' : value === 'relaxed' ? 'gap-2' : 'gap-1'">
                          <span v-for="i in 3" :key="i" class="h-2 rounded-sm bg-gray-300 dark:bg-white/25" />
                        </span>
                      </template>
                    </BioVisualPicker>
                  </UFormField>
                </div>

                <!-- Effects -->
                <div v-else-if="item.value === 'effects'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <UFormField :label="t('theme.card.appearAnimation')">
                    <USelect :model-value="themeConfig.card.animationAppear || 'none'" :items="appearOptions" class="w-full" @update:model-value="emitCard('animationAppear', $event as string)" />
                  </UFormField>
                  <UFormField :label="t('theme.card.hoverAnimation')">
                    <USelect :model-value="themeConfig.card.animationHover || 'none'" :items="hoverOptions" class="w-full" @update:model-value="emitCard('animationHover', $event as string)" />
                  </UFormField>
                </div>
              </template>
            </UAccordion>
          </template>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Template, ThemeConfig, SocialLink } from "~/types/bio";
import { type ThemePreset } from "~/data/themePresets";
import { nameFontOptions, headingFontOptions, paragraphFontOptions, type FontOption } from "~/data/fontOptions";
import { useGoogleFonts } from "~/composables/useGoogleFonts";

const { t } = useI18n();

const props = defineProps<{
  /** Shown on its own tab: no collapsible header around it */
  standalone?: boolean;
  isActive?: boolean;
  templates?: Template[];
  selectedTemplate?: string;
  themeConfig: ThemeConfig;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  socialLinks?: SocialLink[];
  bioPageId?: string;
}>();

const emit = defineEmits<{
  toggle: [];
  selectTemplate: [id: string];
  updateTheme: [patch: Partial<ThemeConfig>];
}>();

const editMode = ref<"presets" | "custom">("presets");

const modeTabs = computed(() => [
  { label: t("theme.tabs.presets"), value: "presets" },
  { label: t("theme.tabs.custom"), value: "custom" },
]);

const headerFontSizeOptions = computed(() => [
  { label: t("theme.options.small"), value: "1.25rem" },
  { label: t("theme.options.medium"), value: "1.5rem" },
  { label: t("theme.options.large"), value: "1.875rem" },
  { label: t("theme.options.xl"), value: "2.25rem" },
]);

const bioFontSizeOptions = computed(() => [
  { label: t("theme.options.xs"), value: "0.75rem" },
  { label: t("theme.options.small"), value: "0.875rem" },
  { label: t("theme.options.medium"), value: "1rem" },
  { label: t("theme.options.large"), value: "1.125rem" },
]);

const cardStyleOptions = computed(() =>
  (["filled", "outline", "ghost", "soft"] as const).map((value) => ({
    label: t(`theme.card.styles.${value}`),
    value,
  })),
);

const backdropBlurOptions = computed(() => [
  { label: t("theme.options.none"), value: "none" },
  { label: t("theme.options.small"), value: "sm" },
  { label: t("theme.options.medium"), value: "md" },
  { label: t("theme.options.large"), value: "lg" },
  { label: t("theme.options.xl"), value: "xl" },
]);

const titleAlignOptions = computed(() => [
  { label: t("theme.page.titleAlign.center"), value: "center" },
  { label: t("theme.page.titleAlign.left"), value: "left" },
]);
const selectedPresetId = ref<string | undefined>(undefined);

// Sections of the custom tab; effects stay closed since few people need them
const openSections = ref<string[]>(["colors"]);
const customSections = computed(() => [
  { label: t("theme.sections.colors"), icon: "i-lucide-palette", value: "colors" },
  { label: t("theme.sections.text"), icon: "i-lucide-type", value: "text" },
  { label: t("theme.sections.cards"), icon: "i-lucide-rectangle-horizontal", value: "cards" },
  { label: t("theme.sections.layout"), icon: "i-lucide-layout-template", value: "layout" },
  { label: t("theme.sections.effects"), icon: "i-lucide-sparkles", value: "effects" },
]);

const radiusOptions = computed(() => [
  { label: t("theme.options.none"), value: 0 },
  { label: t("theme.options.small"), value: 6 },
  { label: t("theme.options.medium"), value: 12 },
  { label: t("theme.options.large"), value: 20 },
  { label: t("theme.card.pill"), value: 999 },
]);

// Older themes may hold any number; light up the nearest preset
const activeRadius = computed(() => {
  const current = Number(props.themeConfig.card.cornerRadius ?? 12);
  return radiusOptions.value.reduce((best, r) =>
    Math.abs(r.value - current) < Math.abs(best.value - current) ? r : best,
  ).value;
});

const avatarShapeOptions = computed(() =>
  (["circle", "rounded", "square"] as const).map((value) => ({
    label: t(`theme.avatar.shapes.${value}`),
    value,
  })),
);

const avatarRadius = (shape: string) =>
  shape === "circle" ? "9999px" : shape === "rounded" ? "8px" : "2px";

const accent = computed(() => props.themeConfig.colors.primary || "#111827");

// Small look-alikes of a card in each style, in the site's accent colour
function cardPreviewStyle(style: string) {
  const color = accent.value;
  switch (style) {
    case "outline":
      return { border: `1.5px solid ${color}`, color };
    case "ghost":
      return { color };
    case "soft":
      return { backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color };
    default:
      return { backgroundColor: color, color: props.themeConfig.card.textColor || "#fff" };
  }
}

function socialPreviewStyle(style: string) {
  const color = accent.value;
  switch (style) {
    case "filled":
      return { backgroundColor: color };
    case "outline":
      return { border: `1.5px solid ${color}` };
    case "plain":
      return {};
    default:
      return { backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` };
  }
}

function onPresetSelect(preset: ThemePreset) {
  selectedPresetId.value = preset.id;
  // Theme patches merge into the current theme, so clear the extras a
  // template may have set that the preset doesn't define
  const theme = preset.theme;
  emit("updateTheme", {
    ...theme,
    card: { backgroundColor: undefined, outlineColor: undefined, ...theme.card },
    header: { fontWeight: undefined, letterSpacing: undefined, fontFamily: undefined, fontSize: undefined, textColor: undefined, ...theme.header },
    typography: { textColor: undefined, bioTextColor: undefined, bioFontFamily: undefined, ...theme.typography },
    social: theme.social ?? { style: "soft" },
    page: theme.page ?? { blockGap: "normal", titleAlign: "center" },
  });
}

// Google Fonts loader
const { loadFont, preloadBioFonts } = useGoogleFonts();

// Initialize fonts on mount
onMounted(() => {
  preloadBioFonts();
});

// Font change handlers with dynamic loading
function onNameFontChange(value: string) {
  const selectedFont = nameFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitHeader('fontFamily', value);
}

function onParagraphFontChange(value: string) {
  const selectedFont = paragraphFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitTypography('bioFontFamily', value);
}

function onHeadingFontChange(value: string) {
  const selectedFont = headingFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitTypography('headingFont', value);
}

const fontWeightOptions = computed(() => [
  { label: t('theme.fontWeights.light'), value: '300' },
  { label: t('theme.fontWeights.regular'), value: '400' },
  { label: t('theme.fontWeights.medium'), value: '500' },
  { label: t('theme.fontWeights.semibold'), value: '600' },
  { label: t('theme.fontWeights.bold'), value: '700' },
]);

const letterSpacingOptions = computed(() => [
  { label: t('theme.letterSpacings.tight'), value: '-0.03em' },
  { label: t('theme.letterSpacings.snug'), value: '-0.015em' },
  { label: t('theme.letterSpacings.normal'), value: 'normal' },
  { label: t('theme.letterSpacings.wide'), value: '0.04em' },
  { label: t('theme.letterSpacings.extraWide'), value: '0.12em' },
]);

const blockGapOptions = computed(() =>
  (['compact', 'normal', 'relaxed'] as const).map((value) => ({
    label: t(`theme.blockGaps.${value}`),
    value,
  })),
);

const socialStyleOptions = computed(() =>
  (['soft', 'filled', 'outline', 'plain'] as const).map((value) => ({
    label: t(`theme.socialStyles.${value}`),
    value,
  })),
);

function emitPage(key: string, value: any) {
  emit("updateTheme", {
    page: { blockGap: "normal", titleAlign: "center", ...props.themeConfig.page, [key]: value },
  });
}

function onGenericParagraphFontChange(value: string) {
  const selectedFont = paragraphFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitTypography('paragraphFont', value);
}

const shadowOptions = computed(() => [
  { label: t("theme.options.none"), value: "none" },
  { label: t("theme.options.small"), value: "sm" },
  { label: t("theme.options.medium"), value: "md" },
  { label: t("theme.options.large"), value: "lg" },
]);

const APPEAR_ANIMATIONS = [
  "fadeIn", "fadeInDown", "fadeInUp", "fadeInLeft", "fadeInRight",
  "zoomIn", "zoomInDown", "zoomInUp",
  "bounceIn", "bounceInDown", "bounceInUp",
  "slideInDown", "slideInUp", "slideInLeft", "slideInRight",
  "backInDown", "backInUp",
  "flipInX", "flipInY",
  "lightSpeedInRight", "rotateIn",
] as const;

const appearOptions = computed(() => [
  { label: t("theme.options.none"), value: "none" },
  ...APPEAR_ANIMATIONS.map((value) => ({
    label: t(`theme.animations.appear.${value}`),
    value,
  })),
]);

const HOVER_ANIMATIONS = [
  "pulse", "bounce", "rubberBand", "shakeX", "shakeY", "headShake",
  "swing", "tada", "wobble", "jello", "heartBeat", "flash", "flip",
] as const;

const hoverOptions = computed(() => [
  { label: t("theme.options.none"), value: "none" },
  ...HOVER_ANIMATIONS.map((value) => ({
    label: t(`theme.animations.hover.${value}`),
    value,
  })),
]);

const durationOptions = computed(() =>
  (["faster", "fast", "normal", "slow", "slower"] as const).map((value) => ({
    label: t(`theme.animations.durations.${value}`),
    value,
  })),
);

function emitColors(key: "primary" | "secondary" | "third", value: string) {
  emit("updateTheme", {
    colors: { ...props.themeConfig.colors, [key]: value },
  });
}

function emitBackground(key: string, value: any) {
  emit("updateTheme", {
    background: { ...props.themeConfig.background, [key]: value },
  });
}

function emitGradient(key: string, value: string) {
  emit("updateTheme", {
    background: {
      ...props.themeConfig.background,
      gradient: { ...props.themeConfig.background.gradient, [key]: value },
    },
  });
}

function emitCard(key: string, value: any) {
  emit("updateTheme", { card: { ...props.themeConfig.card, [key]: value } });
}

function emitButton(key: string, value: any) {
  emit("updateTheme", {
    button: { ...props.themeConfig.button, [key]: value },
  });
}

function emitTypography(key: string, value: string | undefined) {
  emit("updateTheme", {
    typography: { ...props.themeConfig.typography, [key]: value },
  });
}

function emitAvatar(key: string, value: any) {
  emit("updateTheme", {
    avatar: { ...props.themeConfig.avatar, [key]: value },
  });
}

const linkLayoutOptions = computed(() => [
  { label: t("theme.linkLayout.vertical"), value: "vertical" },
  { label: t("theme.linkLayout.horizontalLeft"), value: "horizontal-left" },
  { label: t("theme.linkLayout.horizontalRight"), value: "horizontal-right" },
  { label: t("theme.linkLayout.centered"), value: "centered" },
]);

function emitLink(key: string, value: any) {
  emit("updateTheme", { link: { ...props.themeConfig.link, [key]: value } });
}

function emitHeader(key: string, value: any) {
  emit("updateTheme", {
    header: { ...props.themeConfig.header, [key]: value },
  });
}
</script>
