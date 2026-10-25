<template>
  <div>
    <!-- Root: one row per part of the look, with what it's set to now -->
    <div v-if="view === 'root'" class="space-y-5">
      <button type="button" class="design-row" @click="view = 'theme'">
        <span class="flex size-11 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl ring-1 ring-line" :style="rootBgStyle">
          <span class="h-1.5 w-6 rounded-full" :style="{ backgroundColor: accent }" />
          <span class="h-1.5 w-6 rounded-full opacity-60" :style="{ backgroundColor: accent }" />
        </span>
        <span class="min-w-0 flex-1 text-left">
          <span class="block text-sm font-medium text-ink">{{ t('theme.rows.theme') }}</span>
          <span class="block truncate text-xs text-ink-muted">{{ t('theme.rows.themeHint') }}</span>
        </span>
        <span class="max-w-[40%] truncate text-sm text-ink-muted">{{ currentPresetName }}</span>
        <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-ink-faint" />
      </button>

      <div>
        <p class="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('theme.rows.customize') }}</p>
        <div class="divide-y divide-line overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
          <button v-for="row in rootRows" :key="row.view" type="button" class="design-row rounded-none ring-0" @click="view = row.view">
            <span class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sand" :style="row.swatchStyle">
              <span v-if="row.text" class="text-base leading-none" :style="row.textStyle">{{ row.text }}</span>
              <UIcon v-else :name="row.icon" class="size-4 text-ink-soft" />
            </span>
            <span class="min-w-0 flex-1 text-left text-sm font-medium text-ink">{{ row.label }}</span>
            <span class="max-w-[45%] truncate text-sm text-ink-muted">{{ row.value }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-ink-faint" />
          </button>
        </div>
      </div>
    </div>

    <!-- One part, opened from the list -->
    <div v-else class="space-y-5">
      <div class="flex items-center gap-2">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="sm" :aria-label="t('common.back')" @click="view = 'root'" />
        <h3 class="text-lg font-semibold text-ink">{{ viewTitle }}</h3>
      </div>

      <BioThemePresetPicker v-if="view === 'theme'" :selected-id="themeConfig.presetId" @select="onPresetSelect" />
                <!-- Colours -->
                <div v-if="view === 'colors'" class="space-y-4">
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
                    <BioBackgroundPicker :background="themeConfig.background" :text-color="themeConfig.typography.textColor" @select="(v) => emit('updateTheme', { background: v })" />
                  </div>
                </div>

                <!-- Text -->
                <div v-else-if="view === 'text'" class="space-y-5">
                  <!-- One tap sets heading and body fonts that go together -->
                  <UFormField :label="t('theme.text.pairs')">
                    <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      <button
                        v-for="pair in FONT_PAIRS"
                        :key="pair.id"
                        type="button"
                        class="flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left transition"
                        :class="activePair === pair.id ? 'border-inverted ring-1 ring-inverted' : 'border-default hover:border-accented dark:border-white/10'"
                        @click="applyFontPair(pair)"
                      >
                        <span class="max-w-full truncate text-lg leading-tight text-highlighted" :style="{ fontFamily: pair.heading }">Aa Bb</span>
                        <span class="max-w-full truncate text-[11px] text-muted" :style="{ fontFamily: pair.body }">{{ fontName(pair.heading) }} · {{ fontName(pair.body) }}</span>
                      </button>
                    </div>
                  </UFormField>
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
                      <div class="col-span-2 flex items-center justify-between gap-3 rounded-lg bg-sand/60 px-3 py-2.5">
                        <span class="min-w-0">
                          <span class="block text-sm font-medium text-ink">{{ t('theme.text.nameGradient') }}</span>
                          <span class="block text-xs text-ink-muted">{{ t('theme.text.nameGradientHelp') }}</span>
                        </span>
                        <USwitch :model-value="!!themeConfig.header.textGradient" @update:model-value="emitHeader('textGradient', $event)" />
                      </div>
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
                <div v-else-if="view === 'cards'" class="space-y-4">
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
                    <UFormField :label="t('theme.card.borderWidth')" class="col-span-2 sm:col-span-3">
                      <div class="flex flex-wrap gap-1.5">
                        <button
                          v-for="w in borderWidthOptions"
                          :key="w"
                          type="button"
                          class="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition"
                          :class="(themeConfig.card.borderWidth ?? 0) === w ? 'border-inverted text-highlighted ring-1 ring-inverted' : 'border-default text-muted hover:border-accented dark:border-white/10'"
                          @click="emitCard('borderWidth', w)"
                        >
                          <span class="h-3 w-5 rounded-sm" :style="{ border: w ? `${w}px solid currentColor` : '1px dashed currentColor', opacity: w ? 1 : 0.5 }" />
                          {{ w ? `${w}px` : t('theme.card.borderAuto') }}
                        </button>
                      </div>
                    </UFormField>
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
                <div v-else-if="view === 'layout'" class="space-y-4">
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
                <div v-else-if="view === 'effects'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <UFormField :label="t('theme.card.appearAnimation')">
                    <USelect :model-value="themeConfig.card.animationAppear || 'none'" :items="appearOptions" class="w-full" @update:model-value="emitCard('animationAppear', $event as string)" />
                  </UFormField>
                  <UFormField :label="t('theme.card.hoverAnimation')">
                    <USelect :model-value="themeConfig.card.animationHover || 'none'" :items="hoverOptions" class="w-full" @update:model-value="emitCard('animationHover', $event as string)" />
                  </UFormField>
                </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Template, ThemeConfig, SocialLink } from "~/types/bio";
import { type ThemePreset } from "~/data/themePresets";
import { nameFontOptions, headingFontOptions, paragraphFontOptions, FONT_PAIRS, type FontOption } from "~/data/fontOptions";
import { useGoogleFonts } from "~/composables/useGoogleFonts";
import { backgroundCss } from "~/utils/themeBackground";

const { t, te } = useI18n();

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

type DesignView = "root" | "theme" | "colors" | "text" | "cards" | "layout" | "effects";
const view = ref<DesignView>("root");

const viewTitle = computed(() =>
  view.value === "theme" ? t("theme.rows.theme") : t(`theme.sections.${view.value}`),
);

const rootBgStyle = computed(() =>
  backgroundCss(props.themeConfig.background, props.themeConfig.colors.third || "#fff", props.themeConfig.typography.textColor),
);

const currentPresetName = computed(() => {
  const id = props.themeConfig.presetId;
  if (!id) return t("theme.rows.custom");
  const key = `theme.presets.${id}.name`;
  return te(key) ? t(key) : id;
});

const rootRows = computed(() => {
  const tc = props.themeConfig;
  const nameFont = tc.header.fontFamily || tc.typography.nameFont || "";
  const fontLabel = (v: string) => v.split(",")[0]!.replace(/["']/g, "").trim() || t("common.auto");
  const bgLabel = { solid: t("theme.background.tabs.solid"), gradient: t("theme.background.tabs.gradient"), image: t("theme.background.tabs.image"), video: t("theme.background.tabs.video"), effect: t("theme.background.tabs.effect") }[tc.background?.type ?? "solid"];
  return [
    { view: "colors" as const, label: t("theme.sections.colors"), value: bgLabel, swatchStyle: { ...rootBgStyle.value, boxShadow: `inset 0 0 0 6px transparent` }, icon: "i-lucide-palette", text: "●", textStyle: { color: accent.value, fontSize: "20px" } },
    { view: "text" as const, label: t("theme.sections.text"), value: fontLabel(nameFont), swatchStyle: {}, icon: "", text: "Aa", textStyle: { fontFamily: nameFont, fontWeight: 600 } },
    { view: "cards" as const, label: t("theme.sections.cards"), value: t(`theme.card.styles.${tc.card.style || "filled"}`), swatchStyle: {}, icon: "i-lucide-rectangle-horizontal", text: "", textStyle: {} },
    { view: "layout" as const, label: t("theme.sections.layout"), value: linkLayoutOptions.value.find((o) => o.value === tc.link.layout)?.label ?? "", swatchStyle: {}, icon: "i-lucide-layout-template", text: "", textStyle: {} },
    { view: "effects" as const, label: t("theme.sections.effects"), value: tc.card.animationAppear && tc.card.animationAppear !== "none" ? t(`theme.animations.appear.${tc.card.animationAppear}`) : t("theme.options.none"), swatchStyle: {}, icon: "i-lucide-sparkles", text: "", textStyle: {} },
  ];
});

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
  // Theme patches merge into the current theme, so clear the extras a
  // template may have set that the preset doesn't define
  const theme = preset.theme;
  emit("updateTheme", {
    ...theme,
    presetId: preset.id,
    // Backgrounds replace each other whole: no pattern or mesh left over
    background: { gradient: undefined, pattern: undefined, effectId: undefined, imageUrl: undefined, videoUrl: undefined, ...theme.background },
    card: { backgroundColor: undefined, outlineColor: undefined, borderWidth: undefined, backdropBlur: undefined, ...theme.card },
    // The owner's header layout (and banner) stays; the preset only restyles it
    header: { fontWeight: undefined, letterSpacing: undefined, fontFamily: undefined, fontSize: undefined, textColor: undefined, textGradient: undefined, ...theme.header, layout: props.themeConfig.header.layout, bannerUrl: props.themeConfig.header.bannerUrl },
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

const fontName = (value: string) => value.split(",")[0]!.replace(/["']/g, "").trim();

// The pair the page uses now, if its heading and body fonts match one
const activePair = computed(() => {
  const tc = props.themeConfig;
  const heading = fontName(tc.header.fontFamily || tc.typography.nameFont || "");
  const body = fontName(tc.typography.paragraphFont || "");
  return FONT_PAIRS.find((p) => fontName(p.heading) === heading && fontName(p.body) === body)?.id;
});

function applyFontPair(pair: (typeof FONT_PAIRS)[number]) {
  for (const value of [pair.heading, pair.body]) {
    const font = [...nameFontOptions, ...paragraphFontOptions].find((f) => f.value === value);
    if (font) loadFont(font);
  }
  emit("updateTheme", {
    header: { ...props.themeConfig.header, fontFamily: pair.heading },
    typography: {
      ...props.themeConfig.typography,
      nameFont: pair.heading,
      headingFont: pair.heading,
      paragraphFont: pair.body,
      bioFontFamily: pair.body,
    },
  });
}

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
  { label: t("theme.card.shadowHard"), value: "hard" },
  { label: t("theme.card.shadowGlow"), value: "glow" },
]);

const borderWidthOptions = [0, 1, 2, 3];

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

<style scoped>
.design-row {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: var(--color-paper);
  box-shadow: inset 0 0 0 1px var(--color-line);
  transition: background-color 0.15s;
}
.design-row:hover {
  background: color-mix(in srgb, var(--color-sand) 60%, var(--color-paper));
}
.design-row.ring-0 {
  box-shadow: none;
}
</style>
